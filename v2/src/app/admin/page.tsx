import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TWENTY_FOUR_H = 24 * 60 * 60 * 1000;

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

  const [
    bedsByCommunityRes,
    recentSignalsRes,
    unresolvedAlertsRes,
    pendingRemindersRes,
    overdueDealsRes,
    recentCompassionRes,
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
    supabase
      .from('crm_deals')
      .select('id, title, amount_cents, notes, pipeline_stage')
      .ilike('notes', '%OVERDUE%')
      .neq('pipeline_stage', 'lost'),
    supabase
      .from('compassion_content')
      .select('id, asset_id, content_type, caption, created_at')
      .gte('created_at', oneDayAgo)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const readyAssets = bedsByCommunityRes.data || [];
  const signals = recentSignalsRes.data || [];
  const alerts = unresolvedAlertsRes.data || [];
  const dueReminders = pendingRemindersRes.data || [];
  const overdueDeals = overdueDealsRes.data || [];
  const recentCompassion = recentCompassionRes.data || [];

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

  const overdueTotal = overdueDeals.reduce((s, d) => s + (d.amount_cents || 0), 0);

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 max-w-6xl mx-auto">
      <header>
        <h1 className="font-display text-2xl font-bold">Today</h1>
        <p className="text-sm text-muted-foreground">
          Live field state. {totalReady} beds ready · {totalAllocated} allocated · {signals.length} signals in last 24h.
        </p>
      </header>

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
              {overdueDeals.length} overdue
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
            {overdueDeals.length > 0 && (
              <li className="px-4 py-3 text-sm">
                <p className="font-medium">
                  <span className="inline-block rounded-full bg-red-100 text-red-900 px-2 py-0.5 text-[10px] font-medium mr-2">
                    Money
                  </span>
                  {formatMoney(overdueTotal)} overdue across {overdueDeals.length} invoice{overdueDeals.length === 1 ? '' : 's'}
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {overdueDeals.slice(0, 3).map((d) => d.title).join(' · ')}
                </p>
                <Link href="/admin/xero-reconciliation" className="text-xs underline hover:text-foreground mt-1 inline-block">
                  Xero recon →
                </Link>
              </li>
            )}
            {alerts.length === 0 && dueReminders.length === 0 && overdueDeals.length === 0 && (
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
