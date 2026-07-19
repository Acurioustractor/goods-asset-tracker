import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DemandRowItem, type DemandRow } from './demand-row';
import { AddDemandForm } from './add-demand-form';
import { CommunityMetaForm } from './community-meta-form';
import { getCommunityVoices, getCommunityStories } from '@/lib/data/community-stories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CommunityRow = {
  id: string;
  name: string;
  traditional_name: string | null;
  state: string;
  status: string;
  partner: string | null;
  contacts: string[] | null;
  region: string | null;
  lat: number | null;
  lng: number | null;
  name_aliases: string[] | null;
  notes: string | null;
  facility_interest: string | null;
  facility_notes: string | null;
  key_people: Array<{ name: string; role?: string; org?: string; storytellerSlug?: string; note?: string }> | null;
  procurement_contacts: Array<{ name: string; org?: string; note?: string }> | null;
  notion_url: string | null;
};

type RollupRow = {
  id: string;
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

type AssetRow = {
  unique_id: string;
  name: string | null;
  product: string | null;
  status: string | null;
  supply_date: string | null;
  partner_name: string | null;
  quantity: number | null;
  notes: string | null;
};

type DealRow = {
  id: string;
  title: string;
  pipeline_stage: string;
  amount_cents: number | null;
  units: number | null;
  deal_type: string;
  updated_at: string | null;
};

const ASSET_STATUS_STYLE: Record<string, string> = {
  deployed: 'bg-green-100 text-green-800',
  ready: 'bg-amber-100 text-amber-800',
  allocated: 'bg-blue-100 text-blue-800',
  requested: 'bg-purple-100 text-purple-800',
  demo: 'bg-pink-100 text-pink-800',
  retired: 'bg-gray-100 text-gray-700',
  under_investigation: 'bg-red-100 text-red-800',
};

const COMMUNITY_STATUS_STYLE: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  testing: 'bg-amber-100 text-amber-800 border-amber-200',
  exploring: 'bg-blue-100 text-blue-800 border-blue-200',
  prospect: 'bg-purple-100 text-purple-800 border-purple-200',
  administrative: 'bg-gray-100 text-gray-700 border-gray-200',
};

function fmt(n: number | null | undefined): string {
  return (n ?? 0).toLocaleString('en-AU');
}
function fmtMoney(cents: number | null | undefined): string {
  const dollars = (cents ?? 0) / 100;
  if (Math.abs(dollars) >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (Math.abs(dollars) >= 1_000) return `$${(dollars / 1_000).toFixed(0)}k`;
  return `$${dollars.toLocaleString('en-AU')}`;
}

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [commRes, rollupRes] = await Promise.all([
    supabase
      .from('communities')
      .select('id, name, traditional_name, state, status, partner, contacts, region, lat, lng, name_aliases, notes, facility_interest, facility_notes, key_people, procurement_contacts, notion_url')
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('community_rollup')
      .select('id, deployed_beds, deployed_machines, allocated_beds, requested_beds, ready_beds, retired_assets, open_demand_qty, open_demand_value_cents, active_pipeline_cents, won_revenue_cents')
      .eq('id', id)
      .maybeSingle(),
  ]);

  if (commRes.error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Community</h1>
        <p className="mt-3 text-sm text-red-600">Failed to load: {commRes.error.message}</p>
      </div>
    );
  }

  const community = commRes.data as CommunityRow | null;
  if (!community) notFound();

  const rollup = (rollupRes.data as RollupRow | null) || {
    id,
    deployed_beds: 0,
    deployed_machines: 0,
    allocated_beds: 0,
    requested_beds: 0,
    ready_beds: 0,
    retired_assets: 0,
    open_demand_qty: 0,
    open_demand_value_cents: 0,
    active_pipeline_cents: 0,
    won_revenue_cents: 0,
  };

  // Asset query: name + aliases case-insensitive
  const aliases = (community.name_aliases || []).filter(Boolean);
  const matchNames = [community.name, ...aliases];
  const escapeForIlike = (s: string) => s.replace(/[%_]/g, (m) => `\\${m}`);
  const orFilter = matchNames.map((n) => `community.ilike.${escapeForIlike(n)}`).join(',');

  const [assetsRes, demandRes, dealsRes, machineAssetsRes] = await Promise.all([
    supabase
      .from('assets')
      .select('unique_id, name, product, status, supply_date, partner_name, quantity, notes')
      .or(orFilter)
      .order('supply_date', { ascending: false, nullsFirst: false })
      .limit(500),
    supabase
      .from('community_demand')
      .select('id, community_id, requested_by, product, qty, status, estimated_value_cents, notes')
      .eq('community_id', id)
      .order('status', { ascending: true })
      .order('estimated_value_cents', { ascending: false, nullsFirst: false }),
    supabase
      .from('crm_deals')
      .select('id, title, pipeline_stage, amount_cents, units, deal_type, updated_at')
      .filter('metadata->>community_id', 'eq', id)
      .order('amount_cents', { ascending: false }),
    // Machines deployed here (for fleet cross-link)
    supabase
      .from('assets')
      .select('unique_id, name, machine_id, status')
      .eq('community_id', id)
      .ilike('product', '%machine%')
      .not('machine_id', 'is', null),
  ]);

  const assets = (assetsRes.data || []) as AssetRow[];
  const demand = (demandRes.data || []) as DemandRow[];
  const deals = (dealsRes.data || []) as DealRow[];

  // Fleet cross-link: machine assets at this community, with last-seen + alert count
  type MachineAsset = { unique_id: string; name: string | null; machine_id: string; status: string | null };
  const machineAssets = (machineAssetsRes.data || []) as MachineAsset[];
  const machineIds = machineAssets.map((m) => m.machine_id).filter(Boolean);
  let lastSeenByMachine = new Map<string, string>();
  let openAlertsByMachine = new Map<string, number>();
  if (machineIds.length > 0) {
    const [usageRes, alertsRes] = await Promise.all([
      supabase
        .from('usage_logs')
        .select('machine_id, created_at')
        .in('machine_id', machineIds)
        .order('created_at', { ascending: false })
        .limit(2000),
      supabase
        .from('alerts')
        .select('machine_id')
        .in('machine_id', machineIds)
        .or('resolved.is.null,resolved.eq.false'),
    ]);
    for (const r of (usageRes.data || []) as Array<{ machine_id: string | null; created_at: string | null }>) {
      if (!r.machine_id || !r.created_at) continue;
      const prev = lastSeenByMachine.get(r.machine_id);
      if (!prev || r.created_at > prev) lastSeenByMachine.set(r.machine_id, r.created_at);
    }
    for (const r of (alertsRes.data || []) as Array<{ machine_id: string | null }>) {
      if (!r.machine_id) continue;
      openAlertsByMachine.set(r.machine_id, (openAlertsByMachine.get(r.machine_id) || 0) + 1);
    }
  }

  // Human stories: compendium (sync) + Empathy Ledger (async, swallow failures)
  const communityMatch = { name: community.name, aliases: aliases };
  const compendiumVoices = getCommunityVoices(communityMatch);
  const elStories = await getCommunityStories(communityMatch, { limit: 8 }).catch(() => []);

  // Group assets by status for a compact summary
  const assetStatusCounts = new Map<string, number>();
  for (const a of assets) {
    const key = a.status || 'unknown';
    assetStatusCounts.set(key, (assetStatusCounts.get(key) || 0) + (a.quantity || 1));
  }

  const gap = Math.max(0, rollup.open_demand_qty - rollup.deployed_beds);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <header className="space-y-2">
        <div className="text-xs text-gray-500">
          <Link href="/admin/communities" className="hover:underline">Communities</Link>
          <span className="mx-1.5">/</span>
          <span>{community.name}</span>
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{community.name}</h1>
          <Badge variant="outline" className="text-xs">{community.state}</Badge>
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${COMMUNITY_STATUS_STYLE[community.status] || 'bg-gray-100 text-gray-700'}`}>
            {community.status}
          </span>
          {community.traditional_name && (
            <span className="text-sm italic text-gray-500">{community.traditional_name} Country</span>
          )}
          {community.lat && community.lng && (
            <a
              className="text-xs text-orange-600 hover:underline"
              href={`https://www.google.com/maps/search/?api=1&query=${community.lat},${community.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              {community.lat.toFixed(3)}, {community.lng.toFixed(3)} ↗
            </a>
          )}
        </div>
        <CommunityMetaForm
          id={community.id}
          partner={community.partner}
          status={community.status}
          contacts={community.contacts || []}
          notes={community.notes}
        />
      </header>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Beds Deployed" value={fmt(rollup.deployed_beds)} sub={`${fmt(rollup.deployed_machines)} machines`} />
        <Kpi label="Ready / Allocated" value={`${fmt(rollup.ready_beds)} / ${fmt(rollup.allocated_beds)}`} sub="awaiting fulfilment" highlight={rollup.ready_beds + rollup.allocated_beds > 0} />
        <Kpi label="Open Demand" value={fmt(rollup.open_demand_qty)} sub={fmtMoney(rollup.open_demand_value_cents)} />
        <Kpi label="Demand Gap" value={fmt(gap)} sub={gap > 0 ? 'beds short of demand' : 'fulfilled or no demand'} highlight={gap > 20} />
      </section>

      {/* People & facility — live from communities columns (seeded 2026-07-19) */}
      {((community.key_people?.length || 0) > 0 || (community.procurement_contacts?.length || 0) > 0 || community.facility_interest) && (
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold">People</h2>
            <ul className="mt-2 space-y-2">
              {(community.key_people || []).map((p) => (
                <li key={p.name} className="text-sm">
                  {p.storytellerSlug ? (
                    <Link href={`/storytellers/${p.storytellerSlug}`} className="font-medium hover:underline">{p.name}</Link>
                  ) : (
                    <span className="font-medium">{p.name}</span>
                  )}
                  <span className="text-xs text-gray-500">{p.role ? ` · ${p.role}` : ''}{p.org ? ` · ${p.org}` : ''}</span>
                  {p.note && <div className="text-[11px] text-gray-400">{p.note}</div>}
                </li>
              ))}
              {(community.procurement_contacts || []).map((p) => (
                <li key={p.name} className="text-sm">
                  <span className="font-medium">{p.name}</span>
                  {p.org && <span className="text-xs text-gray-500"> · {p.org}</span>}
                  <span className="ml-1.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">procurement</span>
                  {p.note && <div className="text-[11px] text-gray-400">{p.note}</div>}
                </li>
              ))}
            </ul>
            {community.notion_url && (
              <a href={community.notion_url} className="mt-2 inline-block text-[11px] text-gray-400 underline" target="_blank" rel="noreferrer">Notion record</a>
            )}
          </div>
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold">Production facility</h2>
            {community.facility_interest ? (
              <p className="mt-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 capitalize">{community.facility_interest}</p>
            ) : (
              <p className="mt-2 text-sm text-gray-400">Not yet assessed.</p>
            )}
            {community.facility_notes && <p className="mt-2 text-xs leading-relaxed text-gray-500">{community.facility_notes}</p>}
            <p className="mt-3 text-[11px] text-gray-400">
              Stages: interested → exploring → committed → progressing. Evidence-only, never guessed.
            </p>
          </div>
        </section>
      )}

      {(rollup.active_pipeline_cents > 0 || rollup.won_revenue_cents > 0) && (
        <section className="rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <strong>CRM:</strong>
          {rollup.active_pipeline_cents > 0 && (
            <span className="ml-2 text-blue-700">{fmtMoney(rollup.active_pipeline_cents)} active pipeline</span>
          )}
          {rollup.won_revenue_cents > 0 && (
            <span className="ml-2 text-emerald-700">{fmtMoney(rollup.won_revenue_cents)} won</span>
          )}
        </section>
      )}

      {/* Demand */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Documented Demand</h2>
            <p className="text-xs text-gray-500">{demand.length} record{demand.length === 1 ? '' : 's'}. Click <em>edit</em> to update; new requests with <strong>+ Log demand</strong>.</p>
          </div>
          <AddDemandForm communityId={community.id} />
        </div>
        {demand.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-sm text-gray-500">No demand logged yet for this community.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-2 px-3 font-medium">Requested by</th>
                  <th className="hidden sm:table-cell py-2 px-3 font-medium">Product</th>
                  <th className="py-2 px-3 font-medium text-right">Qty</th>
                  <th className="hidden md:table-cell py-2 px-3 font-medium text-right">Est. Value</th>
                  <th className="py-2 px-3 font-medium">Status</th>
                  <th className="hidden lg:table-cell py-2 px-3 font-medium">Notes</th>
                  <th className="py-2 px-3 font-medium text-right w-16"></th>
                </tr>
              </thead>
              <tbody>
                {demand.map((d) => (
                  <DemandRowItem key={d.id} row={d} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Community voices + Empathy Ledger stories */}
      {(compendiumVoices.length > 0 || elStories.length > 0) && (
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold">Community Voices</h2>
            <p className="text-xs text-gray-500">
              {compendiumVoices.length} compendium voice{compendiumVoices.length === 1 ? '' : 's'}
              {elStories.length > 0 && <> + {elStories.length} Empathy Ledger {elStories.length === 1 ? 'story' : 'stories'}</>}
            </p>
          </div>

          {compendiumVoices.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {compendiumVoices.map((v) => (
                <div key={v.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-2">
                    <div className="font-medium text-gray-900">{v.name}</div>
                    {v.role && <div className="text-xs text-gray-500">{v.role}</div>}
                  </div>
                  <div className="space-y-2">
                    {v.quotes.map((q, i) => (
                      <blockquote key={i} className="border-l-2 border-orange-200 pl-3 text-sm italic text-gray-700">
                        &ldquo;{q}&rdquo;
                      </blockquote>
                    ))}
                  </div>
                  {v.context && (
                    <p className="mt-3 text-xs text-gray-500 leading-relaxed">{v.context}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {elStories.length > 0 && (
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">From Empathy Ledger</div>
              <div className="grid gap-3 md:grid-cols-2">
                {elStories.map((s) => (
                  <Link
                    key={s.id}
                    href={`/stories/${s.id}`}
                    className="block rounded-lg border bg-white p-4 hover:border-orange-300 hover:shadow-sm transition"
                  >
                    <div className="text-xs text-gray-500">
                      {s.storytellerName || s.authorName}
                      {s.publishedAt && ' · '}
                      {s.publishedAt && new Date(s.publishedAt).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
                    </div>
                    <div className="mt-1 font-medium text-gray-900 line-clamp-2">{s.title}</div>
                    {(s.excerpt || s.summary) && (
                      <p className="mt-2 text-xs text-gray-600 line-clamp-3">{s.excerpt || s.summary}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Assets */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Assets at {community.name}</h2>
            <p className="text-xs text-gray-500">
              {assets.length} record{assets.length === 1 ? '' : 's'} matched on <code>{community.name}</code>
              {aliases.length > 0 && <> + aliases {aliases.map((a) => <code key={a} className="ml-1">{a}</code>)}</>}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[...assetStatusCounts.entries()].map(([s, n]) => (
              <Badge key={s} className={`text-xs ${ASSET_STATUS_STYLE[s] || 'bg-gray-100 text-gray-700'}`}>
                {s.replace(/_/g, ' ')}: <span className="ml-1 font-bold">{n}</span>
              </Badge>
            ))}
          </div>
        </div>
        {assets.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-sm text-gray-500">No assets matched to this community yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-2 px-3 font-medium">ID</th>
                  <th className="hidden md:table-cell py-2 px-3 font-medium">Name</th>
                  <th className="hidden sm:table-cell py-2 px-3 font-medium">Product</th>
                  <th className="py-2 px-3 font-medium">Status</th>
                  <th className="hidden md:table-cell py-2 px-3 font-medium">Supplied</th>
                  <th className="hidden lg:table-cell py-2 px-3 font-medium">Partner</th>
                </tr>
              </thead>
              <tbody>
                {assets.slice(0, 100).map((a) => (
                  <tr key={a.unique_id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 px-3 font-mono text-xs">
                      <Link href={`/admin/assets/${a.unique_id}`} className="text-orange-600 hover:underline">
                        {a.unique_id}
                      </Link>
                    </td>
                    <td className="hidden md:table-cell py-2 px-3 text-xs text-gray-700">{a.name || '—'}</td>
                    <td className="hidden sm:table-cell py-2 px-3 text-xs text-gray-600">{a.product || '—'}</td>
                    <td className="py-2 px-3">
                      <Badge className={`text-xs ${ASSET_STATUS_STYLE[a.status || 'unknown'] || 'bg-gray-100 text-gray-700'}`}>
                        {(a.status || 'unknown').replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="hidden md:table-cell py-2 px-3 text-xs text-gray-500">{a.supply_date || '—'}</td>
                    <td className="hidden lg:table-cell py-2 px-3 text-xs text-gray-500">{a.partner_name || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {assets.length > 100 && (
              <p className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t">
                Showing first 100 of {assets.length}. Full list in <Link href="/admin/assets" className="text-orange-600 hover:underline">Asset Register</Link>.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Fleet: washing machines deployed here */}
      {machineAssets.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Washing Machines</h2>
              <p className="text-xs text-gray-500">
                {machineAssets.length} machine{machineAssets.length === 1 ? '' : 's'} deployed.
                {' '}<Link href="/admin/fleet" className="text-orange-600 hover:underline">Open fleet dashboard ↗</Link>
              </p>
            </div>
            {[...openAlertsByMachine.values()].reduce((s, n) => s + n, 0) > 0 && (
              <Badge className="bg-red-100 text-red-800 text-xs">
                {[...openAlertsByMachine.values()].reduce((s, n) => s + n, 0)} open alert{[...openAlertsByMachine.values()].reduce((s, n) => s + n, 0) === 1 ? '' : 's'}
              </Badge>
            )}
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-2 px-3 font-medium">Asset</th>
                  <th className="py-2 px-3 font-medium">Device</th>
                  <th className="py-2 px-3 font-medium">Status</th>
                  <th className="py-2 px-3 font-medium">Last Seen</th>
                  <th className="py-2 px-3 font-medium">Alerts</th>
                </tr>
              </thead>
              <tbody>
                {machineAssets.map((m) => {
                  const lastSeen = lastSeenByMachine.get(m.machine_id);
                  const alertCount = openAlertsByMachine.get(m.machine_id) || 0;
                  const lastSeenLabel = lastSeen
                    ? `${Math.floor((Date.now() - new Date(lastSeen).getTime()) / 86400000)}d ago`
                    : 'never';
                  const isSilent = !lastSeen || Date.now() - new Date(lastSeen).getTime() > 7 * 86400000;
                  return (
                    <tr key={m.unique_id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <Link href={`/bed/${m.unique_id}`} className="font-mono text-xs text-orange-600 hover:underline">
                          {m.unique_id}
                        </Link>
                        {m.name && <div className="text-xs text-gray-600">{m.name}</div>}
                      </td>
                      <td className="py-2 px-3">
                        <Link
                          href={`/admin/fleet/${encodeURIComponent(m.machine_id)}`}
                          className="font-mono text-xs text-blue-600 hover:underline"
                        >
                          {m.machine_id.slice(0, 12)}…
                        </Link>
                      </td>
                      <td className="py-2 px-3">
                        <Badge className={`text-xs ${ASSET_STATUS_STYLE[m.status || 'unknown'] || 'bg-gray-100 text-gray-700'}`}>
                          {(m.status || 'unknown').replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className={`py-2 px-3 text-xs ${isSilent ? 'text-red-700' : 'text-emerald-700'}`}>
                        {lastSeenLabel}
                      </td>
                      <td className="py-2 px-3">
                        {alertCount > 0 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                            {alertCount}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Deals linked via metadata->>community_id */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">CRM Deals</h2>
          <p className="text-xs text-gray-500">
            Linked via <code>crm_deals.metadata.community_id = {community.id}</code>.
            {deals.length === 0 && ' Set this metadata in the CRM admin to surface deals here.'}
          </p>
        </div>
        {deals.length === 0 ? null : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-2 px-3 font-medium">Deal</th>
                  <th className="py-2 px-3 font-medium">Type</th>
                  <th className="py-2 px-3 font-medium">Stage</th>
                  <th className="py-2 px-3 font-medium text-right">Units</th>
                  <th className="py-2 px-3 font-medium text-right">Amount</th>
                  <th className="py-2 px-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((d) => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">{d.title}</td>
                    <td className="py-2 px-3 text-xs text-gray-600">{d.deal_type}</td>
                    <td className="py-2 px-3 text-xs">{d.pipeline_stage}</td>
                    <td className="py-2 px-3 text-right font-mono">{d.units || '—'}</td>
                    <td className="py-2 px-3 text-right font-mono">{fmtMoney(d.amount_cents)}</td>
                    <td className="py-2 px-3 text-xs text-gray-500">
                      {d.updated_at ? new Date(d.updated_at).toLocaleDateString('en-AU') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <Card className={highlight ? 'border-amber-300 bg-amber-50/50' : undefined}>
      <CardContent>
        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
        <div className={`mt-1 text-3xl font-bold ${highlight ? 'text-amber-900' : 'text-gray-900'}`}>{value}</div>
        {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
      </CardContent>
    </Card>
  );
}
