import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { expansionTargets } from '@/lib/data/expansion-targets';
import { COMMUNITY_OS, FACILITY_LABEL } from '@/lib/data/community-os';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CommunityRollup = {
  id: string;
  name: string;
  traditional_name: string | null;
  state: string;
  status: string;
  partner: string | null;
  lat: number | null;
  lng: number | null;
  deployed_beds: number;
  deployed_machines: number;
  allocated_beds: number;
  requested_beds: number;
  ready_beds: number;
  retired_assets: number;
  open_demand_qty: number;
  open_demand_value_cents: number;
  active_pipeline_cents: number;
  won_revenue_cents: number;
};

type DemandRow = {
  id: string;
  community_id: string;
  requested_by: string | null;
  product: string;
  qty: number;
  status: string;
  estimated_value_cents: number | null;
  source: string | null;
  notes: string | null;
};

const STATUS_ORDER = ['active', 'testing', 'exploring', 'prospect', 'administrative'] as const;
const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  testing: 'bg-accent/15 text-accent-foreground border-accent/30',
  exploring: 'bg-primary/10 text-primary border-primary/20',
  prospect: 'bg-muted text-muted-foreground border-border',
  administrative: 'bg-muted text-muted-foreground border-border',
};

const DEMAND_STATUS_STYLE: Record<string, string> = {
  exploring: 'bg-primary/10 text-primary',
  requested: 'bg-accent/15 text-accent-foreground',
  approved: 'bg-emerald-50 text-emerald-700',
  allocated: 'bg-primary/15 text-primary',
  fulfilled: 'bg-muted text-muted-foreground',
  dropped: 'bg-red-50 text-red-700',
};

function fmt(n: number): string {
  return n.toLocaleString('en-AU');
}
function fmtMoney(cents: number): string {
  const dollars = cents / 100;
  if (Math.abs(dollars) >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (Math.abs(dollars) >= 1_000) return `$${(dollars / 1_000).toFixed(0)}k`;
  return `$${dollars.toLocaleString('en-AU')}`;
}

export default async function CommunitiesPage() {
  const supabase = createServiceClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [rollupRes, demandRes, assetsRes, signalsRes, osColsRes, mediaRes, voicesRes] = await Promise.all([
    supabase.from('community_rollup').select('*'),
    supabase
      .from('community_demand')
      .select('id, community_id, requested_by, product, qty, status, estimated_value_cents, source, notes')
      .order('estimated_value_cents', { ascending: false, nullsFirst: false }),
    supabase
      .from('assets')
      .select('unique_id, community_id, product, status, quantity')
      .eq('status', 'deployed'),
    supabase
      .from('bed_signals')
      .select('asset_id, signal_type, created_at')
      .gte('created_at', thirtyDaysAgo),
    supabase
      .from('communities')
      .select('id, facility_interest, facility_notes, key_people, procurement_contacts, notion_url'),
    supabase
      .from('content_items')
      .select('id, community_id, url, poster_url, media_type, consent_tier')
      .not('community_id', 'is', null)
      .neq('consent_tier', 'red'),
    supabase.from('storytellers').select('id, community_id, display_name, is_elder, portrait:content_items(url)'),
  ]);

  if (rollupRes.error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold font-display">Communities</h1>
        <p className="mt-3 text-sm text-red-600">Failed to load: {rollupRes.error.message}</p>
      </div>
    );
  }

  const rows: CommunityRollup[] = (rollupRes.data || []) as CommunityRollup[];
  const demand: DemandRow[] = (demandRes.data || []) as DemandRow[];

  // Per-community product split + "giving back" signal counts (last 30d).
  const deployedAssets = (assetsRes.data || []) as Array<{ unique_id: string; community_id: string | null; product: string; quantity: number | null }>;
  const splitByCommunity = new Map<string, { basket: number; stretch: number; washers: number }>();
  const assetCommunity = new Map<string, string>();
  for (const a of deployedAssets) {
    if (!a.community_id) continue;
    assetCommunity.set(a.unique_id, a.community_id);
    const s = splitByCommunity.get(a.community_id) || { basket: 0, stretch: 0, washers: 0 };
    const q = a.quantity || 1;
    if (a.product === 'Basket Bed') s.basket += q;
    else if (a.product === 'Stretch Bed') s.stretch += q;
    else if (a.product === 'Washing Machine') s.washers += q;
    splitByCommunity.set(a.community_id, s);
  }
  // Community OS profiles: live columns (seeded 2026-07-19) with the code
  // overlay as fallback for rows not yet in the database.
  type OsRow = {
    id: string;
    facility_interest: string | null;
    facility_notes: string | null;
    key_people: Array<{ name: string; role?: string; org?: string; storytellerSlug?: string; note?: string }> | null;
    procurement_contacts: Array<{ name: string; org?: string; note?: string }> | null;
    notion_url: string | null;
  };
  const osProfiles = new Map<string, OsRow>();
  for (const row of ((osColsRes.data || []) as OsRow[])) {
    const hasData =
      row.facility_interest || (row.key_people && row.key_people.length) || (row.procurement_contacts && row.procurement_contacts.length);
    if (hasData) osProfiles.set(row.id, row);
  }
  for (const [cid, o] of Object.entries(COMMUNITY_OS)) {
    if (!osProfiles.has(cid)) {
      osProfiles.set(cid, {
        id: cid,
        facility_interest: o.facilityInterest,
        facility_notes: o.facilityNote ?? null,
        key_people: o.people.filter((p) => !p.procurement),
        procurement_contacts: o.people.filter((p) => p.procurement),
        notion_url: null,
      });
    }
  }

  // Media + voices per community (same assembly as the Atlas drill panel)
  const mediaByCommunity = new Map<string, { photos: string[]; photoCount: number; videoCount: number }>();
  for (const m of (mediaRes.data || []) as Array<{ community_id: string; url: string; poster_url: string | null; media_type: string }>) {
    const entry = mediaByCommunity.get(m.community_id) || { photos: [], photoCount: 0, videoCount: 0 };
    if (m.media_type === 'video') entry.videoCount += 1;
    else {
      entry.photoCount += 1;
      const thumb = m.poster_url || m.url;
      if (entry.photos.length < 4 && thumb) entry.photos.push(thumb);
    }
    mediaByCommunity.set(m.community_id, entry);
  }
  const voicesByCommunity = new Map<string, Array<{ name: string; elder: boolean; portrait: string | null }>>();
  for (const v of (voicesRes.data || []) as Array<{ community_id: string | null; display_name: string; is_elder: boolean; portrait: { url?: string } | Array<{ url?: string }> | null }>) {
    if (!v.community_id) continue;
    const list = voicesByCommunity.get(v.community_id) || [];
    const portrait = Array.isArray(v.portrait) ? (v.portrait[0]?.url ?? null) : (v.portrait?.url ?? null);
    list.push({ name: v.display_name, elder: Boolean(v.is_elder), portrait });
    voicesByCommunity.set(v.community_id, list);
  }

  const signals30d = new Map<string, number>();
  for (const sig of (signalsRes.data || []) as Array<{ asset_id: string }>) {
    const cid = assetCommunity.get(sig.asset_id);
    if (!cid) continue;
    signals30d.set(cid, (signals30d.get(cid) || 0) + 1);
  }
  const demandByCommunity = new Map<string, DemandRow[]>();
  for (const d of demand) {
    if (!demandByCommunity.has(d.community_id)) demandByCommunity.set(d.community_id, []);
    demandByCommunity.get(d.community_id)!.push(d);
  }

  // KPIs
  const activeCount = rows.filter((r) => r.status === 'active').length;
  const prospectCount = rows.filter((r) => r.status === 'prospect' || r.status === 'exploring').length;
  const totalBedsDeployed = rows.reduce((s, r) => s + (r.deployed_beds || 0), 0);
  const totalWashersDeployed = rows.reduce((s, r) => s + (r.deployed_machines || 0), 0);
  const totalReadyBeds = rows.reduce((s, r) => s + (r.ready_beds || 0), 0);
  const totalDemandQty = rows.reduce((s, r) => s + (r.open_demand_qty || 0), 0);
  const totalDemandValueCents = rows.reduce((s, r) => s + (r.open_demand_value_cents || 0), 0);

  // Sort: active first by deployed desc, then exploring/prospect alphabetical, admin last
  const sorted = [...rows].sort((a, b) => {
    const sa = STATUS_ORDER.indexOf(a.status as typeof STATUS_ORDER[number]);
    const sb = STATUS_ORDER.indexOf(b.status as typeof STATUS_ORDER[number]);
    if (sa !== sb) return (sa === -1 ? 99 : sa) - (sb === -1 ? 99 : sb);
    if (a.status === 'active' || a.status === 'testing') {
      return (b.deployed_beds || 0) - (a.deployed_beds || 0);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-10 pb-16">
      <header>
        <h1 className="text-2xl font-bold font-display tracking-tight">Communities</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Canonical register, joined live to <code>assets</code>, <code>community_demand</code> and <code>crm_deals</code>.
          {' '}{activeCount} active, {prospectCount} in pipeline.
        </p>
      </header>

      {/* Jump bar — sticky; sections + one chip per community */}
      <nav className="sticky top-0 z-20 -mx-4 space-y-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          {[
            ['#register', 'Register'],
            ['#cards', 'Community cards'],
            ['#demand', 'Demand'],
            ['#expansion', 'Expansion'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/20">
              {label}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sorted.map((r) => (
            <a
              key={r.id}
              href={`#c-${r.id}`}
              className={`rounded-full border px-2 py-0.5 text-[11px] transition-colors hover:border-primary hover:text-primary ${
                r.status === 'active' || r.status === 'testing'
                  ? 'border-border text-foreground'
                  : 'border-border/60 text-muted-foreground'
              }`}
            >
              {r.name}
              {r.deployed_beds > 0 && <span className="ml-1 text-muted-foreground">{fmt(r.deployed_beds)}</span>}
            </a>
          ))}
        </div>
      </nav>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Active Communities" value={fmt(activeCount)} sub={`${rows.length} total in register`} />
        <Kpi label="Beds Deployed" value={fmt(totalBedsDeployed)} sub="in community" />
        <Kpi label="Washers Deployed" value={fmt(totalWashersDeployed)} />
        <Kpi label="Ready (Awaiting Allocation)" value={fmt(totalReadyBeds)} sub="next-trip batches" highlight />
        <Kpi label="Open Demand" value={fmt(totalDemandQty)} sub={fmtMoney(totalDemandValueCents)} />
      </section>

      {/* Communities table */}
      <section id="register" className="scroll-mt-28">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold font-display">Communities Register</h2>
          <span className="text-xs text-muted-foreground">Demand minus deployed = gap to fill</span>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 px-3 font-medium">Community</th>
                <th className="hidden sm:table-cell py-2 px-3 font-medium">State</th>
                <th className="py-2 px-3 font-medium">Status</th>
                <th className="hidden md:table-cell py-2 px-3 font-medium">Partner</th>
                <th className="py-2 px-3 font-medium text-right">Beds</th>
                <th className="hidden sm:table-cell py-2 px-3 font-medium text-right">Washers</th>
                <th className="hidden lg:table-cell py-2 px-3 font-medium text-right">Signals 30d</th>
                <th className="hidden lg:table-cell py-2 px-3 font-medium">Facility</th>
                <th className="hidden md:table-cell py-2 px-3 font-medium text-right">Ready / Alloc</th>
                <th className="py-2 px-3 font-medium text-right">Demand</th>
                <th className="hidden lg:table-cell py-2 px-3 font-medium text-right">CRM Pipeline</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const gap = Math.max(0, (r.open_demand_qty || 0) - (r.deployed_beds || 0));
                return (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted">
                    <td className="py-2 px-3">
                      <Link href={`/admin/communities/${r.id}`} className="block">
                        <div className="font-medium text-foreground hover:text-primary hover:underline">{r.name}</div>
                        {r.traditional_name && (
                          <div className="text-xs text-muted-foreground italic">{r.traditional_name}</div>
                        )}
                        <div className="sm:hidden mt-0.5 text-[11px] text-muted-foreground">{r.state}{r.partner && <> · {r.partner}</>}</div>
                      </Link>
                    </td>
                    <td className="hidden sm:table-cell py-2 px-3">
                      <Badge variant="outline" className="text-xs">{r.state}</Badge>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status] || 'bg-muted text-foreground'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="hidden md:table-cell py-2 px-3 text-xs text-muted-foreground">{r.partner || '—'}</td>
                    <td className="py-2 px-3 text-right font-mono">
                      {r.deployed_beds > 0 ? (
                        <div>
                          <div>{fmt(r.deployed_beds)}</div>
                          {(() => {
                            const sp = splitByCommunity.get(r.id);
                            return sp && (sp.basket || sp.stretch) ? (
                              <div className="text-[10px] text-muted-foreground">{sp.basket}B · {sp.stretch}S</div>
                            ) : null;
                          })()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="hidden sm:table-cell py-2 px-3 text-right font-mono">{r.deployed_machines > 0 ? fmt(r.deployed_machines) : <span className="text-muted-foreground">0</span>}</td>
                    <td className="hidden lg:table-cell py-2 px-3 text-right font-mono text-xs">
                      {(signals30d.get(r.id) || 0) > 0 ? (
                        <span className="text-emerald-700">{fmt(signals30d.get(r.id)!)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell py-2 px-3 text-xs">
                      {(() => {
                        const fi = osProfiles.get(r.id)?.facility_interest as keyof typeof FACILITY_LABEL | null | undefined;
                        if (fi && FACILITY_LABEL[fi]) {
                          return (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                              {FACILITY_LABEL[fi]}
                            </span>
                          );
                        }
                        return <span className="text-muted-foreground">not assessed</span>;
                      })()}
                    </td>
                    <td className="hidden md:table-cell py-2 px-3 text-right font-mono text-xs">
                      {r.ready_beds > 0 && <span className="text-primary">{fmt(r.ready_beds)} ready</span>}
                      {r.ready_beds > 0 && r.allocated_beds > 0 && <span className="text-muted-foreground"> / </span>}
                      {r.allocated_beds > 0 && <span className="text-primary">{fmt(r.allocated_beds)} alloc</span>}
                      {r.ready_beds === 0 && r.allocated_beds === 0 && <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">
                      {r.open_demand_qty > 0 ? (
                        <div>
                          <div className={gap > 50 ? 'text-red-700 font-semibold' : 'text-foreground'}>{fmt(r.open_demand_qty)}</div>
                          <div className="text-xs text-muted-foreground">{fmtMoney(r.open_demand_value_cents)}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell py-2 px-3 text-right font-mono text-xs">
                      {r.active_pipeline_cents > 0 && <div className="text-primary">{fmtMoney(r.active_pipeline_cents)}</div>}
                      {r.won_revenue_cents > 0 && <div className="text-emerald-700">{fmtMoney(r.won_revenue_cents)} won</div>}
                      {r.active_pipeline_cents === 0 && r.won_revenue_cents === 0 && <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Community cards: media + voices + people + facility, one card per place */}
      <section id="cards" className="scroll-mt-28">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold font-display">Community cards</h2>
          <span className="text-xs text-muted-foreground">
            Photos + voices from <code>content_items</code>/<code>storytellers</code> · people live from <code>communities</code> columns
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted
            .filter((r) => osProfiles.has(r.id) || mediaByCommunity.has(r.id) || voicesByCommunity.has(r.id))
            .map((r) => {
              const os = osProfiles.get(r.id) || {
                id: r.id,
                facility_interest: null,
                facility_notes: null,
                key_people: [],
                procurement_contacts: [],
                notion_url: null,
              };
              const fi = os.facility_interest as keyof typeof FACILITY_LABEL | null;
              const md = mediaByCommunity.get(r.id);
              const vv = voicesByCommunity.get(r.id) || [];
              return (
                <div key={r.id} id={`c-${r.id}`} className="scroll-mt-28 rounded-lg border bg-card p-4">
                  {md && md.photos.length > 0 && (
                    <div className="-mx-4 -mt-4 mb-3 grid grid-cols-4 gap-px overflow-hidden rounded-t-lg">
                      {md.photos.map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={src} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                      ))}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/admin/communities/${r.id}`} className="font-semibold text-foreground hover:text-primary hover:underline">
                      {r.name}
                    </Link>
                    {fi && FACILITY_LABEL[fi] ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Facility: {FACILITY_LABEL[fi]}
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">facility not assessed</span>
                    )}
                  </div>
                  {os.facility_notes && <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{os.facility_notes}</p>}
                  <ul className="mt-3 space-y-1.5">
                    {(os.key_people || []).map((p) => (
                      <li key={p.name} className="text-sm">
                        <span className="font-medium">
                          {p.storytellerSlug ? (
                            <Link href={`/storytellers/${p.storytellerSlug}`} className="hover:underline">
                              {p.name}
                            </Link>
                          ) : (
                            p.name
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {p.role ? ` · ${p.role}` : ''}{p.org ? ` · ${p.org}` : ''}
                        </span>
                        {p.note && <div className="text-[11px] text-muted-foreground">{p.note}</div>}
                      </li>
                    ))}
                    {(os.procurement_contacts || []).map((p) => (
                      <li key={p.name} className="text-sm">
                        <span className="font-medium">{p.name}</span>
                        {p.org && <span className="text-xs text-muted-foreground"> · {p.org}</span>}
                        <span className="ml-1.5 inline-flex rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                          procurement
                        </span>
                        {p.note && <div className="text-[11px] text-muted-foreground">{p.note}</div>}
                      </li>
                    ))}
                  </ul>
                  {vv.length > 0 && (
                    <div className="mt-3 border-t border-border pt-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Voices ({vv.length})
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {vv.slice(0, 8).map((v) => (
                          <span key={v.name} className="flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px]" title={v.name}>
                            {v.portrait ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={v.portrait} alt="" className="h-4 w-4 rounded-full object-cover" loading="lazy" />
                            ) : null}
                            {v.name.split(' ')[0]}
                            {v.elder && <span className="text-primary">·E</span>}
                          </span>
                        ))}
                        {vv.length > 8 && <span className="text-[11px] text-muted-foreground">+{vv.length - 8}</span>}
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
                    <span>
                      {md ? `${md.photoCount} photos${md.videoCount ? ` · ${md.videoCount} videos` : ''}` : 'no tagged media'}
                    </span>
                    <span className="flex gap-2">
                      <Link href="/admin/media-library" className="text-primary hover:underline">media</Link>
                      <Link href={`/admin/communities/${r.id}`} className="text-primary hover:underline">dashboard →</Link>
                    </span>
                  </div>
                  {os.notion_url && (
                    <a href={os.notion_url} className="mt-2 inline-block text-[11px] text-muted-foreground underline" target="_blank" rel="noreferrer">
                      Notion record
                    </a>
                  )}
                </div>
              );
            })}
        </div>
      </section>

      {/* Demand records */}
      <section id="demand" className="scroll-mt-28">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-base font-semibold font-display">Documented Demand</h2>
          <span className="text-xs text-muted-foreground">{demand.length} open records, edit in <code>community_demand</code> table</span>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 px-3 font-medium">Community</th>
                <th className="py-2 px-3 font-medium">Requested By</th>
                <th className="py-2 px-3 font-medium">Product</th>
                <th className="py-2 px-3 font-medium text-right">Qty</th>
                <th className="py-2 px-3 font-medium text-right">Est. Value</th>
                <th className="py-2 px-3 font-medium">Status</th>
                <th className="py-2 px-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {demand.map((d) => {
                const c = rows.find((r) => r.id === d.community_id);
                return (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-muted">
                    <td className="py-2 px-3 font-medium">
                      <Link href={`/admin/communities/${d.community_id}`} className="text-primary hover:underline">
                        {c?.name || d.community_id}
                      </Link>
                    </td>
                    <td className="py-2 px-3 text-foreground">{d.requested_by || '—'}</td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">{d.product}</td>
                    <td className="py-2 px-3 text-right font-mono">{fmt(d.qty)}</td>
                    <td className="py-2 px-3 text-right font-mono">
                      {d.estimated_value_cents ? fmtMoney(d.estimated_value_cents) : '—'}
                    </td>
                    <td className="py-2 px-3">
                      <Badge className={`text-xs ${DEMAND_STATUS_STYLE[d.status] || 'bg-muted text-foreground'}`}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-xs text-muted-foreground max-w-[280px] truncate">{d.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Expansion target priorities (static — sourced from desk research) */}
      <section id="expansion" className="scroll-mt-28">
        <div className="mb-3">
          <h2 className="text-base font-semibold font-display">Expansion Priorities (Desk Research)</h2>
          <p className="text-sm text-muted-foreground">
            Top {expansionTargets.length} communities ranked by overcrowding + active housing builds. Move into the
            register above as outreach activates.
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 px-3 font-medium w-10">#</th>
                <th className="py-2 px-3 font-medium">Community</th>
                <th className="py-2 px-3 font-medium">State</th>
                <th className="py-2 px-3 font-medium text-right">Pop.</th>
                <th className="py-2 px-3 font-medium">Why</th>
                <th className="py-2 px-3 font-medium">Housing Body</th>
              </tr>
            </thead>
            <tbody>
              {expansionTargets.map((t) => (
                <tr key={t.priority} className="border-b last:border-0 hover:bg-muted">
                  <td className="py-2 px-3 text-muted-foreground font-mono text-xs">{t.priority}</td>
                  <td className="py-2 px-3 font-medium">{t.community}</td>
                  <td className="py-2 px-3">
                    <Badge variant="outline" className="text-xs">{t.state}</Badge>
                  </td>
                  <td className="py-2 px-3 text-right font-mono">~{fmt(t.pop)}</td>
                  <td className="py-2 px-3 text-muted-foreground text-xs max-w-[320px]">{t.reason}</td>
                  <td className="py-2 px-3 text-muted-foreground text-xs">{t.housingBody}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <Card className={highlight ? 'border-primary/30 bg-primary/5' : undefined}>
      <CardContent>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={`mt-1 text-3xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value}</div>
        {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}
