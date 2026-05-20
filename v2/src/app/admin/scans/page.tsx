import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScansTimeChart } from './scans-time-chart';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ScanRow {
  id: number;
  unique_id: string;
  scanned_at: string;
  user_agent: string | null;
  referer: string | null;
  is_bot: boolean;
  is_admin: boolean;
  admin_email: string | null;
}

interface AssetLite {
  unique_id: string;
  community: string | null;
  place: string | null;
  recipient_name: string | null;
  product: string | null;
}

export default async function ScansAnalyticsPage() {
  const supabase = createServiceClient();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);

  const scansRes = await supabase
    .from('bed_scans')
    .select('id, unique_id, scanned_at, user_agent, referer, is_bot, is_admin, admin_email')
    .gte('scanned_at', thirtyDaysAgo)
    .order('scanned_at', { ascending: false })
    .limit(50000);

  if (scansRes.error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Scans</h1>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="space-y-2 p-6">
            <p className="font-semibold text-amber-900">
              The <code>bed_scans</code> table doesn&apos;t exist yet.
            </p>
            <p className="text-sm text-amber-800">
              Apply the migration at{' '}
              <code className="rounded bg-white px-1.5 py-0.5">
                v2/supabase/migrations/20260520000002_bed_scans.sql
              </code>{' '}
              and refresh.
            </p>
            <p className="text-xs text-amber-700">Supabase error: {scansRes.error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scans: ScanRow[] = scansRes.data || [];

  // Total counts
  const realScans = scans.filter((s) => !s.is_bot && !s.is_admin);
  const today = realScans.filter((s) => new Date(s.scanned_at) >= todayStart);
  const last7d = realScans.filter(
    (s) => new Date(s.scanned_at) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
  );
  const last30d = realScans;
  const botCount = scans.filter((s) => s.is_bot).length;
  const adminCount = scans.filter((s) => s.is_admin).length;

  // All-time real scan count (separate query — the 30d window above might miss it)
  const allTimeRes = await supabase
    .from('bed_scans')
    .select('unique_id', { count: 'exact', head: true })
    .eq('is_bot', false)
    .eq('is_admin', false);
  const allTimeReal = allTimeRes.count ?? last30d.length;

  // Bucket scans into 1-day buckets for the chart (30 buckets max)
  const buckets = new Map<string, { scans: number; bots: number; admin: number }>();
  for (let d = 29; d >= 0; d--) {
    const day = new Date(now); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - d);
    buckets.set(day.toISOString(), { scans: 0, bots: 0, admin: 0 });
  }
  for (const s of scans) {
    const day = new Date(s.scanned_at); day.setHours(0, 0, 0, 0);
    const key = day.toISOString();
    const b = buckets.get(key);
    if (!b) continue;
    if (s.is_bot) b.bots += 1;
    else if (s.is_admin) b.admin += 1;
    else b.scans += 1;
  }
  const chartData = [...buckets.entries()].map(([bucket, v]) => ({ bucket, ...v }));

  // Top 20 most-scanned beds (real scans only)
  const perBed = new Map<string, number>();
  for (const s of realScans) {
    perBed.set(s.unique_id, (perBed.get(s.unique_id) || 0) + 1);
  }
  const topIds = [...perBed.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);

  // Hydrate top beds with asset details
  const ids = topIds.map(([id]) => id);
  const assetsRes = ids.length
    ? await supabase
        .from('assets')
        .select('unique_id, community, place, recipient_name, product')
        .in('unique_id', ids)
    : { data: [] as AssetLite[] };
  const assetMap = new Map<string, AssetLite>();
  for (const a of (assetsRes.data || []) as AssetLite[]) {
    assetMap.set(a.unique_id, a);
  }

  // Recent feed (real scans only, 50 latest)
  const recent = realScans.slice(0, 50);
  const recentIds = [...new Set(recent.map((r) => r.unique_id))].filter((id) => !assetMap.has(id));
  if (recentIds.length) {
    const extraRes = await supabase
      .from('assets')
      .select('unique_id, community, place, recipient_name, product')
      .in('unique_id', recentIds);
    for (const a of (extraRes.data || []) as AssetLite[]) {
      assetMap.set(a.unique_id, a);
    }
  }

  return (
    <div className="space-y-8 pb-16">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Scans</h1>
        <p className="mt-1 text-sm text-gray-500">
          Every page view of <code className="text-xs">/bed/[id]</code> — i.e. every QR scan that
          successfully opened the URL. Bots and Goods-admin views are excluded from the headline
          counts but kept in the data for transparency.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Today" value={today.length} sub="real scans" highlight />
        <Kpi label="Last 7 days" value={last7d.length} sub="real scans" />
        <Kpi label="Last 30 days" value={last30d.length} sub="real scans" />
        <Kpi label="All time" value={allTimeReal} sub="real scans" />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <ExclusionBadge label="Bots filtered" value={botCount} color="bg-gray-100 text-gray-700" />
        <ExclusionBadge label="Admin views excluded" value={adminCount} color="bg-amber-100 text-amber-800" />
        <ExclusionBadge label="Unique beds scanned" value={perBed.size} color="bg-emerald-100 text-emerald-800" />
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Last 30 days</h2>
        <Card>
          <CardContent className="p-4">
            <ScansTimeChart data={chartData} />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Top 20 most-scanned beds</h2>
        {topIds.length === 0 ? (
          <p className="text-sm text-gray-500">No real scans yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <Th>Rank</Th>
                  <Th>Bed</Th>
                  <Th>Product</Th>
                  <Th>Community</Th>
                  <Th>Recipient</Th>
                  <Th className="text-right pr-4">Scans (30d)</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {topIds.map(([id, count], idx) => {
                  const a = assetMap.get(id);
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <Td className="text-gray-400">{idx + 1}</Td>
                      <Td className="font-mono text-xs">
                        <Link href={`/bed/${id}`} target="_blank" className="text-blue-700 hover:underline">
                          {id}
                        </Link>
                      </Td>
                      <Td>{a?.product || '--'}</Td>
                      <Td>
                        {a?.community || <span className="text-gray-400">--</span>}
                        {a?.place ? <span className="text-gray-400"> · {a.place}</span> : null}
                      </Td>
                      <Td>{a?.recipient_name || <span className="text-gray-400">--</span>}</Td>
                      <Td className="pr-4 text-right">
                        <Badge variant="secondary" className="font-bold">{count}</Badge>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Recent scans</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-500">No real scans yet.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <Th>When</Th>
                  <Th>Bed</Th>
                  <Th>Community</Th>
                  <Th>Recipient</Th>
                  <Th>UA</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recent.map((s) => {
                  const a = assetMap.get(s.unique_id);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <Td className="whitespace-nowrap text-xs text-gray-500">
                        {new Date(s.scanned_at).toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' })}
                      </Td>
                      <Td className="font-mono text-xs">
                        <Link href={`/bed/${s.unique_id}`} target="_blank" className="text-blue-700 hover:underline">
                          {s.unique_id}
                        </Link>
                      </Td>
                      <Td>{a?.community || <span className="text-gray-400">--</span>}</Td>
                      <Td>{a?.recipient_name || <span className="text-gray-400">--</span>}</Td>
                      <Td className="max-w-[28ch] truncate text-xs text-gray-500" title={s.user_agent || ''}>
                        {shortUa(s.user_agent)}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value, sub, highlight }: { label: string; value: number; sub?: string; highlight?: boolean }) {
  return (
    <Card className={highlight ? 'border-emerald-200 bg-emerald-50/40' : ''}>
      <CardContent className="p-4">
        <div className={`text-xs uppercase tracking-wide ${highlight ? 'text-emerald-700' : 'text-gray-500'}`}>
          {label}
        </div>
        <div className={`mt-1 text-2xl font-bold ${highlight ? 'text-emerald-900' : 'text-gray-900'}`}>
          {value.toLocaleString()}
        </div>
        {sub && <div className="text-xs text-gray-500">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function ExclusionBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex items-baseline justify-between rounded-md px-3 py-2 text-sm ${color}`}>
      <span>{label}</span>
      <span className="font-bold">{value.toLocaleString()}</span>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 text-left font-medium ${className}`}>{children}</th>;
}

function Td({ children, className = '', title }: { children: React.ReactNode; className?: string; title?: string }) {
  return <td className={`px-3 py-2 ${className}`} title={title}>{children}</td>;
}

function shortUa(ua: string | null): string {
  if (!ua) return '--';
  // Try to extract platform from common iPhone / Android / Mac UAs
  const m =
    ua.match(/iPhone[^)]*/) ||
    ua.match(/Android[^;]*/) ||
    ua.match(/Macintosh[^)]*/) ||
    ua.match(/Windows[^;)]*/) ||
    ua.match(/Linux[^;)]*/);
  return m ? m[0] : ua.slice(0, 40);
}
