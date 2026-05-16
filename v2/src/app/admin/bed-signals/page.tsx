import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SignalRow = {
  id: string;
  asset_id: string;
  signal_type: string;
  signal_value: string | null;
  payload: Record<string, unknown>;
  contact: string | null;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
  created_by: string | null;
};

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
  pulse: { label: 'Pulse', color: 'bg-emerald-100 text-emerald-900' },
  reminder: { label: 'Reminder', color: 'bg-amber-100 text-amber-900' },
  check_in: { label: 'Check-in', color: 'bg-blue-100 text-blue-900' },
  demand_bump: { label: 'Demand', color: 'bg-violet-100 text-violet-900' },
  name_change: { label: 'Name', color: 'bg-stone-100 text-stone-900' },
  workshop_interest: { label: 'Workshop', color: 'bg-orange-100 text-orange-900' },
};

const ALL_TYPES = Object.keys(TYPE_LABEL);

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function BedSignalsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; community?: string }>;
}) {
  const params = await searchParams;
  const filterType = ALL_TYPES.includes(params.type || '') ? params.type! : null;
  const filterCommunity = params.community || null;

  const supabase = createServiceClient();

  // Pull recent signals + the asset's community for filter/display
  let query = supabase
    .from('bed_signals')
    .select('id, asset_id, signal_type, signal_value, payload, contact, scheduled_for, sent_at, created_at, created_by')
    .order('created_at', { ascending: false })
    .limit(200);

  if (filterType) query = query.eq('signal_type', filterType);

  const { data: signals } = await query;

  // Join assets for community context (one extra query keeps the type simple)
  const assetIds = Array.from(new Set((signals || []).map((s) => s.asset_id)));
  const { data: assets } = assetIds.length
    ? await supabase
        .from('assets')
        .select('unique_id, community, community_id, product, display_name')
        .in('unique_id', assetIds)
    : { data: [] as { unique_id: string; community: string | null; community_id: string | null; product: string | null; display_name: string | null }[] };

  const assetMap = new Map(assets?.map((a) => [a.unique_id, a]) || []);

  // Optional community filter — applied client-side after join
  const filteredSignals = (signals || []).filter((s) => {
    if (!filterCommunity) return true;
    const asset = assetMap.get(s.asset_id);
    return asset?.community === filterCommunity;
  });

  // Counts for the last 7 days, per signal type
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const recent = (signals || []).filter((s) => s.created_at >= sevenDaysAgo);
  const countsByType: Record<string, number> = {};
  for (const s of recent) countsByType[s.signal_type] = (countsByType[s.signal_type] || 0) + 1;

  // Pulse breakdown specifically
  const pulses = recent.filter((s) => s.signal_type === 'pulse');
  const pulseCounts = {
    good: pulses.filter((s) => s.signal_value === 'good').length,
    meh: pulses.filter((s) => s.signal_value === 'meh').length,
    bad: pulses.filter((s) => s.signal_value === 'bad').length,
  };

  const communities = Array.from(
    new Set(
      (assets || []).map((a) => a.community).filter((c): c is string => !!c),
    ),
  ).sort();

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 max-w-7xl mx-auto">
      <header className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold">Bed scan signals</h1>
          <p className="text-sm text-muted-foreground">
            Everything that comes off /bed/{'{id}'} scans — pulses, name changes, reminders, demand bumps, workshop interest.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Showing latest {filteredSignals.length} of {(signals || []).length}
        </div>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Pulse (7d)</p>
          <p className="text-2xl font-bold mt-1">
            {pulseCounts.good + pulseCounts.meh + pulseCounts.bad}
          </p>
          <div className="flex gap-2 text-xs mt-2">
            <span className="text-emerald-700">👍 {pulseCounts.good}</span>
            <span className="text-amber-700">😐 {pulseCounts.meh}</span>
            <span className="text-red-700">👎 {pulseCounts.bad}</span>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Reminders (7d)</p>
          <p className="text-2xl font-bold mt-1">{countsByType.reminder || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">queued for future SMS</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Demand bumps (7d)</p>
          <p className="text-2xl font-bold mt-1">{countsByType.demand_bump || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">community-initiated requests</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Names + workshop (7d)</p>
          <p className="text-2xl font-bold mt-1">
            {(countsByType.name_change || 0) + (countsByType.workshop_interest || 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">named beds + workshop sign-ups</p>
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">Filter:</span>
        <Link
          href="/admin/bed-signals"
          className={`px-3 py-1.5 rounded-full border ${!filterType && !filterCommunity ? 'bg-foreground text-background' : 'bg-card hover:bg-muted'}`}
        >
          All
        </Link>
        {ALL_TYPES.map((type) => (
          <Link
            key={type}
            href={`/admin/bed-signals?type=${type}${filterCommunity ? `&community=${encodeURIComponent(filterCommunity)}` : ''}`}
            className={`px-3 py-1.5 rounded-full border ${filterType === type ? 'bg-foreground text-background' : 'bg-card hover:bg-muted'}`}
          >
            {TYPE_LABEL[type].label}
          </Link>
        ))}
        {communities.length > 0 && (
          <>
            <span className="mx-2 text-muted-foreground">·</span>
            <select
              defaultValue={filterCommunity || ''}
              onChange={undefined}
              className="text-xs rounded-full border bg-card px-3 py-1.5"
              disabled
              aria-label="Community filter (use URL ?community=...)"
            >
              <option value="">All communities</option>
              {communities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </>
        )}
      </section>

      {/* Table */}
      <section className="rounded-2xl border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">When</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Bed</th>
              <th className="text-left px-4 py-3 font-medium">Community</th>
              <th className="text-left px-4 py-3 font-medium">Value</th>
              <th className="text-left px-4 py-3 font-medium">Contact</th>
              <th className="text-left px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredSignals.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No signals yet. They land here when people scan beds and tap a tile.
                </td>
              </tr>
            ) : (
              filteredSignals.map((s) => {
                const meta = TYPE_LABEL[s.signal_type] || { label: s.signal_type, color: 'bg-stone-100 text-stone-900' };
                const asset = assetMap.get(s.asset_id);
                const payloadEntries = Object.entries(s.payload || {});
                return (
                  <tr key={s.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-muted-foreground">
                      {formatDateTime(s.created_at)}
                      {s.scheduled_for && (
                        <div className="text-[10px] text-amber-700 mt-0.5">
                          fires {formatDateTime(s.scheduled_for)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link href={`/bed/${s.asset_id}`} className="font-mono text-xs underline hover:text-foreground">
                        {s.asset_id}
                      </Link>
                      {asset?.display_name && (
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          &ldquo;{asset.display_name}&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {asset?.community_id ? (
                        <Link
                          href={`/admin/communities/${asset.community_id}`}
                          className="underline hover:text-foreground"
                        >
                          {asset.community || '—'}
                        </Link>
                      ) : (
                        asset?.community || '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono">
                      {s.signal_value || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {s.contact || <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs max-w-md">
                      {payloadEntries.length === 0 ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <details>
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            {payloadEntries.length} {payloadEntries.length === 1 ? 'field' : 'fields'}
                          </summary>
                          <pre className="mt-1 text-[10px] whitespace-pre-wrap break-all bg-muted/40 rounded p-2">
                            {JSON.stringify(s.payload, null, 2)}
                          </pre>
                        </details>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>

      <p className="text-xs text-muted-foreground">
        Reminders queue in <code className="bg-muted px-1 rounded">bed_signals</code> with{' '}
        <code className="bg-muted px-1 rounded">scheduled_for</code>. The{' '}
        <code className="bg-muted px-1 rounded">sms-dispatch</code> cron runs daily at 8am AEST,
        sends via the Goods GHL number, and stamps <code className="bg-muted px-1 rounded">sent_at</code>.
        Pulse spikes (3+ 👎 per community in 7 days) fire a webhook to GHL via{' '}
        <code className="bg-muted px-1 rounded">pulse-watch</code> every 30 min.
      </p>
    </div>
  );
}
