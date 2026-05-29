import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { reconcile, type XeroInvoice, type CrmDealRow } from '@/lib/finance/xero-reconciliation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TWENTY_FOUR_H = 24 * 60 * 60 * 1000;

const ACT_URL = process.env.ACT_INFRA_SUPABASE_URL || '';
const ACT_KEY = process.env.ACT_INFRA_SUPABASE_KEY || '';

/**
 * Fetch live Goods Xero invoices (VOIDED/DELETED excluded at the query) so the
 * dashboard's "overdue" derives from Xero status + due_date via the shared
 * `reconcile()` helper — NOT from CRM notes text. Same pattern as
 * /admin/xero-reconciliation. Returns [] on any failure so the tile reads $0
 * (honest "nothing confirmed overdue") rather than crashing the dashboard.
 */
async function fetchXeroInvoices(): Promise<XeroInvoice[]> {
  if (!ACT_URL || !ACT_KEY) return [];
  const url =
    `${ACT_URL}/rest/v1/xero_invoices` +
    `?select=date,contact_name,total,amount_paid,amount_due,status,invoice_number,income_type,type,due_date` +
    `&project_code=eq.ACT-GD` +
    `&type=in.(ACCREC,ACCPAY)` +
    `&status=not.in.(VOIDED,DELETED)` +
    `&order=date.desc`;
  try {
    const res = await fetch(url, {
      headers: { apikey: ACT_KEY, Authorization: `Bearer ${ACT_KEY}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return (await res.json()) as XeroInvoice[];
  } catch {
    return [];
  }
}

const SIGNAL_BADGE: Record<string, { label: string; emoji: string; tone: string }> = {
  pulse: { label: 'Pulse', emoji: '🫀', tone: 'bg-emerald-100 text-emerald-900' },
  reminder: { label: 'Reminder', emoji: '⏰', tone: 'bg-amber-100 text-amber-900' },
  check_in: { label: 'Check-in', emoji: '⏰', tone: 'bg-amber-100 text-amber-900' },
  demand_bump: { label: 'Demand', emoji: '📣', tone: 'bg-violet-100 text-violet-900' },
  name_change: { label: 'Named', emoji: '✏️', tone: 'bg-stone-100 text-stone-900' },
  workshop_interest: { label: 'Workshop', emoji: '🪛', tone: 'bg-orange-100 text-orange-900' },
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatMoney(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(0)}K`;
  return `$${dollars.toFixed(0)}`;
}

export default async function AdminDashboard() {
  const supabase = createServiceClient();
  const oneDayAgo = new Date(Date.now() - TWENTY_FOUR_H).toISOString();

  const thirtyDaysAgo = new Date(Date.now() - 30 * TWENTY_FOUR_H).toISOString();
  const [
    bedsByCommunityRes,
    recentSignalsRes,
    unresolvedAlertsRes,
    pendingRemindersRes,
    crmDealsRes,
    recentCompassionRes,
    bedFlowRes,
    pipelineDealsRes,
    productionInventoryRes,
    xeroInvoices,
  ] = await Promise.all([
    supabase
      .from('assets')
      .select('unique_id, community, community_id, status, product, quantity, display_name')
      .in('status', ['ready', 'allocated'])
      .order('community', { ascending: true }),
    supabase
      .from('bed_signals')
      .select('id, asset_id, signal_type, signal_value, payload, contact, created_at')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(15),
    supabase
      .from('alerts')
      .select('id, asset_id, type, severity, details, alert_date, created_at')
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('bed_signals')
      .select('id, asset_id, signal_type, signal_value, contact, scheduled_for')
      .in('signal_type', ['reminder', 'check_in'])
      .lte('scheduled_for', new Date(Date.now() + 24 * TWENTY_FOUR_H).toISOString())
      .is('sent_at', null)
      .order('scheduled_for', { ascending: true })
      .limit(20),
    // All deals (with the columns reconcile() needs) so overdue is derived from
    // Xero via the shared lib — NOT from a notes-ILIKE '%OVERDUE%' text match.
    supabase
      .from('crm_deals')
      .select('id, title, deal_type, pipeline_stage, amount_cents, notes, source, updated_at')
      .neq('pipeline_stage', 'lost'),
    supabase
      .from('compassion_content')
      .select('id, asset_id, content_type, caption, created_at')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(8),
    // Bed-flow rollup — production/ready/allocated/deployed/retired across products
    supabase
      .from('assets')
      .select('status, product, quantity, created_at, notes'),
    // Pipeline value across deals (not just overdue)
    supabase
      .from('crm_deals')
      .select('pipeline_stage, amount_cents, units, deal_type')
      .in('deal_type', ['sale', 'procurement'])
      .neq('pipeline_stage', 'lost'),
    // Production inventory (most recent snapshot — raw plastic stock, beds possible)
    supabase
      .from('production_inventory')
      .select('snapshot_date, raw_plastic_kg, sheets_count, beds_possible')
      .order('snapshot_date', { ascending: false })
      .limit(1),
    // Live Xero invoices — the SOURCE of overdue (status + due_date), not notes.
    fetchXeroInvoices(),
  ]);

  const readyAssets = bedsByCommunityRes.data || [];
  const signals = recentSignalsRes.data || [];
  const alerts = unresolvedAlertsRes.data || [];
  const dueReminders = pendingRemindersRes.data || [];
  const recentCompassion = recentCompassionRes.data || [];

  // Overdue = genuinely-collectable receivables past due, derived from Xero via
  // the shared reconcile() helper (isOverdue on Xero status + due_date). This
  // replaces the old `.ilike('notes','%OVERDUE%')` CRM text-match, which the
  // honesty guardrails forbid (notes text is not collectable debt).
  const crmDealsForRecon: CrmDealRow[] = ((crmDealsRes.data as Array<Record<string, unknown>> | null) || []).map((d) => ({
    id: d.id as string,
    title: (d.title as string) ?? null,
    deal_type: (d.deal_type as string) ?? null,
    pipeline_stage: (d.pipeline_stage as string) ?? null,
    amount_cents: (d.amount_cents as number) ?? null,
    notes: (d.notes as string) ?? null,
    source: (d.source as string) ?? null,
    updated_at: (d.updated_at as string) ?? null,
  }));
  const reconciliation = reconcile(crmDealsForRecon, xeroInvoices);
  // Dollars. `arOverdue` is the only genuine "overdue" (past-due ACCREC).
  const overdueTotalDollars = reconciliation.totals.arOverdue;
  const overdueCount = reconciliation.arOverdue.length;
  const overdueInvoices = reconciliation.arOverdue;

  type CommunityBucket = {
    community: string;
    communityId: string | null;
    ready: number;
    allocated: number;
    ids: string[];
  };
  const byCommunity = new Map<string, CommunityBucket>();
  for (const a of readyAssets) {
    const key = (a.community as string) || 'Pending Delivery';
    const entry: CommunityBucket = byCommunity.get(key) || {
      community: key,
      communityId: (a.community_id as string | null) ?? null,
      ready: 0,
      allocated: 0,
      ids: [],
    };
    if (a.status === 'ready') entry.ready += (a.quantity as number) || 1;
    if (a.status === 'allocated') entry.allocated += (a.quantity as number) || 1;
    entry.ids.push(a.unique_id as string);
    byCommunity.set(key, entry);
  }
  const tripTargets = Array.from(byCommunity.values())
    .filter((c) => c.ready + c.allocated > 0)
    .sort((a, b) => b.ready + b.allocated - (a.ready + a.allocated));

  const totalReady = readyAssets.filter((a) => a.status === 'ready').reduce((s, a) => s + (a.quantity || 1), 0);
  const totalAllocated = readyAssets.filter((a) => a.status === 'allocated').reduce((s, a) => s + (a.quantity || 1), 0);

  const pulses24h = signals.filter((s) => s.signal_type === 'pulse');
  const goodPulses = pulses24h.filter((s) => s.signal_value === 'good').length;
  const mehPulses = pulses24h.filter((s) => s.signal_value === 'meh').length;
  const badPulses = pulses24h.filter((s) => s.signal_value === 'bad').length;

  // formatMoney() takes cents; overdue is sourced in dollars from Xero.
  const overdueTotalCents = Math.round(overdueTotalDollars * 100);

  // Bed-flow rollup — production-style kanban across all bed assets
  const allBedAssets = (bedFlowRes.data || []) as Array<{ status: string; product: string; quantity: number | null; created_at: string; notes: string | null }>;
  const bedFlow = { inProduction: 0, ready: 0, allocated: 0, deployed: 0, deployed30d: 0, retired: 0 };
  for (const a of allBedAssets) {
    if (!/bed/i.test(a.product || '')) continue;
    const q = a.quantity || 1;
    const isInTransit = (a.notes || '').toLowerCase().includes('transit');
    if (isInTransit) {
      bedFlow.allocated += q;
      continue;
    }
    switch (a.status) {
      case 'requested': bedFlow.inProduction += q; break;
      case 'ready': bedFlow.ready += q; break;
      case 'allocated': bedFlow.allocated += q; break;
      case 'deployed':
        bedFlow.deployed += q;
        if (a.created_at && a.created_at >= thirtyDaysAgo) bedFlow.deployed30d += q;
        break;
      case 'retired': bedFlow.retired += q; break;
    }
  }

  // Pipeline value across deals
  const allDeals = (pipelineDealsRes.data || []) as Array<{ pipeline_stage: string; amount_cents: number | null; units: number | null; deal_type: string }>;
  const pipelineValue = allDeals.reduce((s, d) => s + (d.amount_cents || 0), 0);
  const pipelineWon = allDeals.filter((d) => d.pipeline_stage === 'won').reduce((s, d) => s + (d.amount_cents || 0), 0);
  const pipelineActive = pipelineValue - pipelineWon;

  // Production inventory (raw plastic + beds possible)
  const inventory = (productionInventoryRes.data || [])[0] as { raw_plastic_kg: number; sheets_count: number; beds_possible: number; snapshot_date: string } | undefined;

  // Compute today's #1 action (highest-priority thing to do)
  type TodayCall = { headline: string; detail: string; href: string; tone: 'red' | 'amber' | 'emerald' | 'blue' };
  const todayCall: TodayCall = (() => {
    if (overdueTotalCents > 100_000_00) {
      const top = [...overdueInvoices].sort((a, b) => (b.amount_due ?? 0) - (a.amount_due ?? 0))[0];
      return {
        headline: `Chase ${formatMoney(overdueTotalCents)} overdue (AR)`,
        detail: top ? `${top.contact_name ?? top.invoice_number ?? 'invoice'}` : `${overdueCount} invoices`,
        href: '/admin/xero-reconciliation',
        tone: 'red',
      };
    }
    const silentMachines = alerts.filter((a) => a.type === 'machine_silent').length;
    if (silentMachines >= 3) {
      return {
        headline: `${silentMachines} machines silent`,
        detail: 'Field signal needed — check in with communities',
        href: '/admin/bed-signals',
        tone: 'amber',
      };
    }
    const bigCommunity = tripTargets[0];
    if (bigCommunity && bigCommunity.ready >= 5) {
      return {
        headline: `${bigCommunity.ready} ready for ${bigCommunity.community}`,
        detail: 'Schedule the next trip to clear inventory',
        href: '/admin/bed-preflight',
        tone: 'emerald',
      };
    }
    return {
      headline: 'All systems clean',
      detail: 'Pick a funder to brief or open the cost model',
      href: '/admin/funders',
      tone: 'blue',
    };
  })();

  const toneClass: Record<TodayCall['tone'], string> = {
    red: 'bg-red-50 border-red-200 text-red-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 max-w-7xl mx-auto">
      <header className="flex items-baseline justify-between gap-4 flex-wrap">
        <h1 className="font-display text-3xl font-bold">Today</h1>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })} · {bedFlow.deployed30d} beds delivered in 30d
        </p>
      </header>

      {/* HERO STRIP — the 4 things to know in 5 seconds */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Bed flow */}
        <Link href="/admin/production" className="rounded-2xl border bg-card shadow-sm p-4 hover:shadow-md transition-shadow">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Beds in motion</p>
          <div className="mt-2 grid grid-cols-4 gap-1 text-center text-xs">
            <div>
              <div className="text-xl font-bold tabular-nums">{bedFlow.inProduction}</div>
              <div className="text-[10px] text-muted-foreground">making</div>
            </div>
            <div>
              <div className="text-xl font-bold tabular-nums text-emerald-700">{bedFlow.ready}</div>
              <div className="text-[10px] text-muted-foreground">ready</div>
            </div>
            <div>
              <div className="text-xl font-bold tabular-nums text-amber-700">{bedFlow.allocated}</div>
              <div className="text-[10px] text-muted-foreground">allocated</div>
            </div>
            <div>
              <div className="text-xl font-bold tabular-nums text-blue-700">{bedFlow.deployed}</div>
              <div className="text-[10px] text-muted-foreground">on Country</div>
            </div>
          </div>
          {inventory && inventory.beds_possible > 0 && (
            <p className="mt-3 text-[11px] text-muted-foreground border-t pt-2">
              + {inventory.beds_possible} beds possible from {inventory.raw_plastic_kg}kg raw plastic in stock
            </p>
          )}
        </Link>

        {/* 2. Money */}
        <Link href="/admin/xero-reconciliation" className="rounded-2xl border bg-card shadow-sm p-4 hover:shadow-md transition-shadow">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Money</p>
          <div className="mt-2">
            {overdueTotalCents > 0 ? (
              <div className="text-2xl font-bold tabular-nums text-red-700">{formatMoney(overdueTotalCents)}</div>
            ) : (
              <div className="text-2xl font-bold tabular-nums text-emerald-700">$0</div>
            )}
            <p className="text-[11px] text-muted-foreground">AR overdue (Xero) · {overdueCount} invoice{overdueCount === 1 ? '' : 's'}</p>
          </div>
          <div className="mt-3 pt-2 border-t flex justify-between text-[11px] text-muted-foreground">
            <span>Pipeline {formatMoney(pipelineActive)}</span>
            <span>Won {formatMoney(pipelineWon)}</span>
          </div>
        </Link>

        {/* 3. Today's call */}
        <Link href={todayCall.href} className={`rounded-2xl border shadow-sm p-4 hover:shadow-md transition-shadow ${toneClass[todayCall.tone]}`}>
          <p className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Today's call</p>
          <p className="mt-2 text-lg font-bold leading-tight">{todayCall.headline}</p>
          <p className="mt-1 text-xs opacity-80">{todayCall.detail}</p>
          <p className="mt-3 text-[10px] uppercase tracking-wider font-semibold opacity-70">Open →</p>
        </Link>

        {/* 4. Cost-model trajectory */}
        <Link href="/admin/cost-model" className="rounded-2xl border bg-card shadow-sm p-4 hover:shadow-md transition-shadow">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Cost trajectory</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums">$535</span>
            <span className="text-xs text-muted-foreground">→ $276</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Defy Kits → Factory in-house</p>
          <div className="mt-3 pt-2 border-t flex justify-between text-[11px] text-muted-foreground">
            <span>Idiot Index 8.6×</span>
            <span>$90-200K capex</span>
          </div>
        </Link>
      </section>

      {/* Trip targets */}
      <section className="rounded-2xl border bg-card shadow-sm">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">Where the beds are going</h2>
            <p className="text-xs text-muted-foreground">
              Communities with ready or allocated beds, ordered by volume.
            </p>
          </div>
          <Link href="/admin/assets" className="text-xs underline hover:text-foreground">
            All assets →
          </Link>
        </div>
        {tripTargets.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground text-center">
            No beds in pipeline. Mint a batch in{' '}
            <Link href="/admin/assets" className="underline">
              /admin/assets
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y">
            {tripTargets.slice(0, 8).map((c) => (
              <li key={c.community} className="p-4 hover:bg-muted/30 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm">
                    {c.communityId ? (
                      <Link href={`/admin/communities/${c.communityId}`} className="hover:underline">
                        {c.community}
                      </Link>
                    ) : (
                      c.community
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.ready > 0 ? `${c.ready} ready` : null}
                    {c.ready > 0 && c.allocated > 0 ? ' · ' : null}
                    {c.allocated > 0 ? `${c.allocated} allocated` : null}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{c.ready + c.allocated}</span>
                  <Link
                    href={`/admin/assets?community=${encodeURIComponent(c.community)}`}
                    className="text-xs underline hover:text-foreground whitespace-nowrap"
                  >
                    drill in
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Live signals + needs attention */}
      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Live (last 24h)</h2>
              <p className="text-xs text-muted-foreground">
                {signals.length} signal{signals.length === 1 ? '' : 's'} · 👍 {goodPulses} 😐 {mehPulses} 👎 {badPulses}
              </p>
            </div>
            <Link href="/admin/bed-signals" className="text-xs underline hover:text-foreground">
              All →
            </Link>
          </div>
          {signals.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">
              Quiet. Field signals land here when people scan beds.
            </p>
          ) : (
            <ul className="divide-y">
              {signals.slice(0, 8).map((s) => {
                const badge = SIGNAL_BADGE[s.signal_type] || { label: s.signal_type, emoji: '•', tone: 'bg-stone-100 text-stone-900' };
                return (
                  <li key={s.id} className="px-4 py-3 flex items-start gap-3 text-sm">
                    <span className="text-lg flex-shrink-0">{badge.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.tone} mr-2`}>
                          {badge.label}
                        </span>
                        {s.signal_value && <span className="font-mono text-xs">{s.signal_value}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <Link href={`/bed/${s.asset_id}`} className="font-mono underline hover:text-foreground">
                          {s.asset_id}
                        </Link>
                        {' · '}
                        {relativeTime(s.created_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="px-5 py-4 border-b">
            <h2 className="font-display text-lg font-bold">Needs attention</h2>
            <p className="text-xs text-muted-foreground">
              {alerts.length} alert{alerts.length === 1 ? '' : 's'} · {dueReminders.length} reminder{dueReminders.length === 1 ? '' : 's'} due ·{' '}
              {overdueCount} overdue
            </p>
          </div>
          <ul className="divide-y">
            {alerts.slice(0, 4).map((a) => (
              <li key={a.id} className="px-4 py-3 text-sm">
                <p className="font-medium text-red-900">
                  <span className="inline-block rounded-full bg-red-100 text-red-900 px-2 py-0.5 text-[10px] font-medium mr-2">
                    {a.severity} {a.type}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.details}</p>
                {a.asset_id && (
                  <Link href={`/bed/${a.asset_id}`} className="text-xs font-mono underline hover:text-foreground mt-1 inline-block">
                    {a.asset_id}
                  </Link>
                )}
              </li>
            ))}
            {dueReminders.length > 0 && (
              <li className="px-4 py-3 text-sm">
                <p className="font-medium">
                  <span className="inline-block rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-medium mr-2">
                    SMS dispatch
                  </span>
                  {dueReminders.length} reminder{dueReminders.length === 1 ? '' : 's'} fire next 8am AEST
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Earliest:{' '}
                  {dueReminders[0]?.scheduled_for
                    ? new Date(dueReminders[0].scheduled_for).toLocaleString('en-AU', {
                        day: 'numeric',
                        month: 'short',
                      })
                    : '—'}
                </p>
              </li>
            )}
            {overdueCount > 0 && (
              <li className="px-4 py-3 text-sm">
                <p className="font-medium">
                  <span className="inline-block rounded-full bg-red-100 text-red-900 px-2 py-0.5 text-[10px] font-medium mr-2">
                    Money
                  </span>
                  {formatMoney(overdueTotalCents)} AR overdue across {overdueCount} invoice{overdueCount === 1 ? '' : 's'}
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {overdueInvoices.slice(0, 3).map((inv) => inv.contact_name ?? inv.invoice_number ?? '—').join(' · ')}
                </p>
                <Link href="/admin/xero-reconciliation" className="text-xs underline hover:text-foreground mt-1 inline-block">
                  Xero recon →
                </Link>
              </li>
            )}
            {alerts.length === 0 && dueReminders.length === 0 && overdueCount === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground text-center">
                Nothing flagged. Have a good day.
              </li>
            )}
          </ul>
        </section>
      </div>

      {/* Recent photos + quick actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-2xl border bg-card shadow-sm">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold">Recent photos</h2>
              <p className="text-xs text-muted-foreground">
                Compassion content uploaded in the last 24h.
              </p>
            </div>
            <Link href="/admin/compassion" className="text-xs underline hover:text-foreground">
              All →
            </Link>
          </div>
          {recentCompassion.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">No new uploads today.</p>
          ) : (
            <ul className="divide-y">
              {recentCompassion.slice(0, 5).map((c) => (
                <li key={c.id} className="px-4 py-3 text-sm">
                  <p className="font-medium truncate">
                    <Link href={`/bed/${c.asset_id}`} className="font-mono text-xs underline hover:text-foreground">
                      {c.asset_id}
                    </Link>{' '}
                    · <span className="text-xs">{c.content_type}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {c.caption || '(no caption)'}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{relativeTime(c.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border bg-card shadow-sm p-5 space-y-3">
          <div>
            <h2 className="font-display text-lg font-bold">Quick actions</h2>
            <p className="text-xs text-muted-foreground">
              The things you reach for most during a trip.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/admin/bed-preflight"
              className="rounded-xl border hover:bg-amber-50 dark:hover:bg-amber-950/30 p-3 text-center text-sm font-semibold"
            >
              ✈️ Preflight
            </Link>
            <Link
              href="/admin/bed-signals"
              className="rounded-xl border hover:bg-amber-50 dark:hover:bg-amber-950/30 p-3 text-center text-sm font-semibold"
            >
              📡 Signals
            </Link>
            <Link
              href="/admin/compassion"
              className="rounded-xl border hover:bg-amber-50 dark:hover:bg-amber-950/30 p-3 text-center text-sm font-semibold"
            >
              📸 Upload photo
            </Link>
            <Link
              href="/admin/communities"
              className="rounded-xl border hover:bg-amber-50 dark:hover:bg-amber-950/30 p-3 text-center text-sm font-semibold"
            >
              🌏 Communities
            </Link>
            <Link
              href="/admin/assets"
              className="rounded-xl border hover:bg-amber-50 dark:hover:bg-amber-950/30 p-3 text-center text-sm font-semibold"
            >
              📚 Assets
            </Link>
            <Link
              href="/admin/deals"
              className="rounded-xl border hover:bg-amber-50 dark:hover:bg-amber-950/30 p-3 text-center text-sm font-semibold"
            >
              📊 Deals
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
