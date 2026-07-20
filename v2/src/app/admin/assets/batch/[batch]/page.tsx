import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BulkAllocateForm } from './bulk-allocate-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type AssetRow = {
  unique_id: string;
  name: string | null;
  product: string | null;
  status: string | null;
  community: string | null;
  community_id: string | null;
  supply_date: string | null;
  qr_url: string | null;
};

type CommunityOption = {
  id: string;
  name: string;
  state: string;
  status: string;
};

const STATUS_STYLE: Record<string, string> = {
  deployed: 'bg-green-100 text-green-800',
  ready: 'bg-amber-100 text-amber-800',
  allocated: 'bg-primary/10 text-primary',
  requested: 'bg-purple-100 text-purple-800',
  demo: 'bg-pink-100 text-pink-800',
  retired: 'bg-muted text-foreground',
  under_investigation: 'bg-red-100 text-red-800',
};

export default async function BatchDetailPage({
  params,
}: {
  params: Promise<{ batch: string }>;
}) {
  const { batch } = await params;
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(batch)) notFound();

  const supabase = createServiceClient();
  const prefix = `GB0-${batch}`;

  const [assetsRes, communitiesRes] = await Promise.all([
    supabase
      .from('assets')
      .select('unique_id, name, product, status, community, community_id, supply_date, qr_url')
      .or(`unique_id.eq.${prefix},unique_id.like.${prefix}-%,unique_id.like.${prefix}_%`)
      .order('unique_id', { ascending: true }),
    supabase
      .from('communities')
      .select('id, name, state, status')
      .order('status', { ascending: true })
      .order('name', { ascending: true }),
  ]);

  if (assetsRes.error) {
    return (
      <div className="p-6">
        <h1 className="font-display text-xl font-bold">Batch {batch}</h1>
        <p className="mt-3 text-sm text-red-600">Failed to load: {assetsRes.error.message}</p>
      </div>
    );
  }

  const assets = (assetsRes.data || []) as AssetRow[];
  const communityOptions = (communitiesRes.data || []) as CommunityOption[];

  if (assets.length === 0) {
    notFound();
  }

  // Per-status summary
  const statusCounts = new Map<string, number>();
  const communityCounts = new Map<string, number>();
  for (const a of assets) {
    statusCounts.set(a.status || 'unknown', (statusCounts.get(a.status || 'unknown') || 0) + 1);
    communityCounts.set(a.community || '—', (communityCounts.get(a.community || '—') || 0) + 1);
  }

  // Trip helper: if every asset is currently `ready` & `Pending Delivery`, the
  // batch is freshly minted and ready to deploy. Surface this state prominently.
  const allReady = assets.every((a) => a.status === 'ready');
  const allPending = assets.every((a) => a.community === 'Pending Delivery' || a.community_id === 'pending-delivery');

  return (
    <div className="space-y-6 pb-16">
      <header className="space-y-2">
        <div className="text-xs text-muted-foreground">
          <Link href="/admin/assets" className="hover:underline">Asset Register</Link>
          <span className="mx-1.5">/</span>
          <span>Batch {prefix}</span>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Batch {prefix}</h1>
        <p className="text-sm text-muted-foreground">
          {assets.length} asset{assets.length === 1 ? '' : 's'} in this batch.
          {allReady && allPending && (
            <> All <code>ready</code> + <code>Pending Delivery</code> — ready for trip allocation.</>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {[...statusCounts.entries()].map(([s, n]) => (
            <Badge key={s} className={`text-xs ${STATUS_STYLE[s] || 'bg-muted text-foreground'}`}>
              {s.replace(/_/g, ' ')}: <span className="ml-1 font-bold">{n}</span>
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <a
            href={`/api/admin/assets/batch/${batch}/manifest`}
            className="rounded-md border bg-card px-3 py-1.5 font-medium text-foreground hover:bg-muted"
          >
            Download manifest CSV
          </a>
          <a
            href={`/api/admin/assets/batch/${batch}/print`}
            className="rounded-md border bg-card px-3 py-1.5 font-medium text-foreground hover:bg-muted"
          >
            Print QR sheet (PDF)
          </a>
        </div>
      </header>

      {/* Bulk allocate — the headline action on this page */}
      <BulkAllocateForm
        batch={batch}
        assets={assets.map((a) => ({
          unique_id: a.unique_id,
          status: a.status,
          community: a.community,
          community_id: a.community_id,
        }))}
        communityOptions={communityOptions}
      />

      {/* Per-community split (visible after first allocate, useful as audit) */}
      {communityCounts.size > 1 && (
        <Card>
          <CardContent className="pt-5">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
              Current community split
            </div>
            <div className="flex flex-wrap gap-2">
              {[...communityCounts.entries()]
                .sort((a, b) => b[1] - a[1])
                .map(([c, n]) => (
                  <Badge key={c} variant="outline" className="text-xs">
                    {c}: <span className="ml-1 font-bold">{n}</span>
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full table for reference (read-only, per-row drill via QR link) */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-2 px-3 font-medium">ID</th>
              <th className="py-2 px-3 font-medium">Name</th>
              <th className="py-2 px-3 font-medium">Product</th>
              <th className="py-2 px-3 font-medium">Status</th>
              <th className="py-2 px-3 font-medium">Community</th>
              <th className="py-2 px-3 font-medium">Supply Date</th>
              <th className="py-2 px-3 font-medium text-right">Drill-in</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.unique_id} className="border-b last:border-0 hover:bg-muted">
                <td className="py-1.5 px-3 font-mono text-xs">{a.unique_id}</td>
                <td className="py-1.5 px-3 text-xs text-foreground">{a.name || '—'}</td>
                <td className="py-1.5 px-3 text-xs text-muted-foreground">{a.product || '—'}</td>
                <td className="py-1.5 px-3">
                  <Badge className={`text-xs ${STATUS_STYLE[a.status || 'unknown'] || 'bg-muted text-foreground'}`}>
                    {(a.status || 'unknown').replace(/_/g, ' ')}
                  </Badge>
                </td>
                <td className="py-1.5 px-3 text-xs text-muted-foreground">{a.community || '—'}</td>
                <td className="py-1.5 px-3 text-xs text-muted-foreground">{a.supply_date || '—'}</td>
                <td className="py-1.5 px-3 text-right">
                  <Link href={`/bed/${a.unique_id}`} className="text-xs text-orange-600 hover:underline">
                    open ↗
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
