import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { canonValue } from '@/lib/data/canon';
import { NEEDS_BEN } from '@/lib/data/investor-wiki';
import MapCard, { type MapCommunity } from './map-card';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default async function MapHome() {
  const supabase = createServiceClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [commRes, rollupRes, assetsRes, signalsRes, mediaCountRes] = await Promise.all([
    supabase.from('communities').select('id, name, state, status, lat, lng, facility_interest'),
    supabase.from('community_rollup').select('id, deployed_beds'),
    supabase.from('assets').select('unique_id, community_id, product, quantity').eq('status', 'deployed'),
    supabase.from('bed_signals').select('asset_id, created_at').gte('created_at', thirtyDaysAgo),
    supabase.from('content_items').select('id', { count: 'exact', head: true }),
  ]);

  const rollup = new Map((rollupRes.data || []).map((r) => [r.id as string, r]));
  const washersByComm = new Map<string, number>();
  const assetCommunity = new Map<string, string>();
  for (const a of assetsRes.data || []) {
    if (!a.community_id) continue;
    assetCommunity.set(a.unique_id as string, a.community_id as string);
    if (a.product === 'Washing Machine') {
      washersByComm.set(a.community_id as string, (washersByComm.get(a.community_id as string) || 0) + ((a.quantity as number) || 1));
    }
  }
  const signalsByComm = new Map<string, number>();
  for (const sig of signalsRes.data || []) {
    const cid = assetCommunity.get(sig.asset_id as string);
    if (cid) signalsByComm.set(cid, (signalsByComm.get(cid) || 0) + 1);
  }

  const communities: MapCommunity[] = (commRes.data || [])
    .filter((c) => c.lat != null && c.lng != null)
    .map((c) => ({
      id: c.id as string,
      name: c.name as string,
      lat: c.lat as number,
      lng: c.lng as number,
      beds: (rollup.get(c.id as string)?.deployed_beds as number) || 0,
      washers: washersByComm.get(c.id as string) || 0,
      signals30d: signalsByComm.get(c.id as string) || 0,
      facilityInterest: (c.facility_interest as string) || null,
      status: c.status as string,
    }));

  const withBeds = communities.filter((c) => c.beds > 0).sort((a, b) => b.beds - a.beds);
  const totalSignals = [...signalsByComm.values()].reduce((n, v) => n + v, 0);
  const changedCount = signalsByComm.size;

  const now = new Date();
  const dateLabel = `${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`;

  const revenue = Number(canonValue('revenue-carveout'));
  const mediaCount = mediaCountRes.count ?? 0;

  const canonStats = [
    { value: String(CANONICAL_ASSETS.bedsDeployed), label: 'beds' },
    { value: String(CANONICAL_ASSETS.stretchBedsDeployed), label: 'stretch' },
    { value: String(CANONICAL_ASSETS.washersInCommunity), label: 'washers' },
    { value: String(CANONICAL_ASSETS.communitiesServed), label: 'communities' },
    { value: `${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg`, label: 'HDPE' },
  ];

  const tiles = [
    { name: 'Media Room', sub: `${mediaCount.toLocaleString()} items · tag & add`, href: '/admin/media-library' },
    { name: 'Money', sub: `$${revenue.toLocaleString()} signed`, href: '/admin/cost-model' },
    { name: 'Products & Plant', sub: 'Stretch Bed · the plant', href: '/admin/facility' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-4">
      {/* Header + canon strip */}
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">{dateLabel}</p>
          <h1 className="font-display text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Where things stand</h1>
        </div>
        <div className="flex items-end gap-6">
          {canonStats.map((s) => (
            <div key={s.label} className="text-right">
              <div className="font-display text-2xl font-bold tabular-nums" style={{ fontFamily: 'Georgia, serif' }}>{s.value}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Body: map + tiles | rail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-stretch">
        {/* Left: map + product tiles */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="relative rounded-2xl border bg-[#FBF8F1] overflow-hidden" style={{ minHeight: 460 }}>
            <MapCard communities={communities} />
            <Link
              href="/admin/atlas"
              className="absolute bottom-3 right-3 rounded-lg bg-card/90 backdrop-blur border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-card shadow-sm flex items-center gap-1"
            >
              Open the full Atlas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="absolute bottom-3 left-3 rounded-lg bg-card/90 backdrop-blur border px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
              {CANONICAL_ASSETS.bedsDeployed} beds · {CANONICAL_ASSETS.washersInCommunity} washers · {CANONICAL_ASSETS.communitiesServed} communities
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tiles.map((t) => (
              <Link key={t.name} href={t.href} className="flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 hover:shadow-md transition-shadow">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.sub}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-4">
          {/* Needs you */}
          <div className="rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold" style={{ fontFamily: 'Georgia, serif' }}>Needs you</h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{NEEDS_BEN.length}</span>
            </div>
            <ul className="space-y-2.5">
              {NEEDS_BEN.slice(0, 5).map((n) => (
                <li key={n.label} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden />
                  {n.href ? (
                    <Link href={n.href} className="text-sm leading-snug hover:underline">{n.label}</Link>
                  ) : (
                    <span className="text-sm leading-snug">{n.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Changed lately */}
          <div className="rounded-2xl border bg-card p-4">
            <h2 className="font-display text-lg font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Changed lately</h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground tabular-nums">{totalSignals}</span> bed scans across{' '}
              <span className="font-semibold text-foreground tabular-nums">{changedCount}</span> communities in the last 30 days.
            </p>
            <Link href="/admin/bed-signals" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">See the signals →</Link>
          </div>

          {/* Communities */}
          <div className="rounded-2xl border bg-card p-4 flex-1">
            <h2 className="font-display text-lg font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Communities · {CANONICAL_ASSETS.communitiesServed}</h2>
            <ul className="space-y-1.5">
              {withBeds.slice(0, 7).map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/communities/${c.id}`} className="flex items-center justify-between gap-2 hover:text-primary transition-colors">
                    <span className="flex items-center gap-1.5 text-sm truncate">
                      {c.name}
                      {c.washers > 0 && <span className="h-1.5 w-1.5 rounded-full bg-[#4E8F88]" aria-hidden />}
                    </span>
                    <span className="font-display text-sm font-bold tabular-nums" style={{ fontFamily: 'Georgia, serif' }}>{c.beds}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {withBeds.length > 7 && (
              <p className="mt-2 text-xs text-muted-foreground">+ {withBeds.length - 7} more places</p>
            )}
            <Link href="/admin/communities" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">All communities →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
