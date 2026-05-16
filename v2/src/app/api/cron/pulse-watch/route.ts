import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Pulse-watch cron — runs every 30 min during business hours.
 *
 * Scans bed_signals for clusters of bad pulses (>=3 👎 in 7d per community).
 * For each community that crosses the threshold AND has no fresh alert (<24h old):
 *   1. Inserts an alerts row (type='pulse_spike', severity='Medium')
 *   2. POSTs to GHL inbound webhook (if GHL_PULSE_WEBHOOK_URL is set)
 *
 * Bearer secured via CRON_SECRET when called by Vercel. Plain GET allowed for
 * manual testing from the admin browser (no secret = dry-run, doesn't write).
 */

type PulseRow = {
  asset_id: string;
  signal_value: string | null;
  created_at: string;
};

type AssetMeta = {
  unique_id: string;
  community: string | null;
  community_id: string | null;
};

const PULSE_THRESHOLD = 3; // bad pulses in window before alerting
const PULSE_WINDOW_DAYS = 7;
const ALERT_COOLDOWN_HOURS = 24;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const dryRun = !isCron;

  const supabase = createServiceClient();
  const since = new Date(Date.now() - PULSE_WINDOW_DAYS * 86400_000).toISOString();
  const cooldownSince = new Date(Date.now() - ALERT_COOLDOWN_HOURS * 3600_000).toISOString();
  const webhookUrl = process.env.GHL_PULSE_WEBHOOK_URL || '';

  // 1. Pull all bad pulses in the window
  const { data: pulses, error: pulsesErr } = await supabase
    .from('bed_signals')
    .select('asset_id, signal_value, created_at')
    .eq('signal_type', 'pulse')
    .eq('signal_value', 'bad')
    .gte('created_at', since);

  if (pulsesErr) {
    return NextResponse.json({ error: pulsesErr.message }, { status: 500 });
  }

  const rows: PulseRow[] = pulses || [];

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, scanned: 0, alerts: 0, dryRun });
  }

  // 2. Resolve assets → community
  const assetIds = Array.from(new Set(rows.map((r) => r.asset_id)));
  const { data: assets } = await supabase
    .from('assets')
    .select('unique_id, community, community_id')
    .in('unique_id', assetIds);

  const assetMap = new Map<string, AssetMeta>(
    (assets || []).map((a) => [a.unique_id, a as AssetMeta]),
  );

  // 3. Group by community
  const byCommunity: Record<string, { ids: string[]; community: string; communityId: string | null }> = {};
  for (const row of rows) {
    const meta = assetMap.get(row.asset_id);
    if (!meta?.community) continue;
    const key = meta.community;
    if (!byCommunity[key]) {
      byCommunity[key] = { ids: [], community: meta.community, communityId: meta.community_id };
    }
    byCommunity[key].ids.push(row.asset_id);
  }

  // 4. For each community over threshold, check cooldown + alert
  const fired: { community: string; count: number; webhookOk: boolean | null }[] = [];
  for (const [community, group] of Object.entries(byCommunity)) {
    if (group.ids.length < PULSE_THRESHOLD) continue;

    // Cooldown check: was there a pulse_spike alert for an asset in this community in the last 24h?
    const { data: recentAlerts } = await supabase
      .from('alerts')
      .select('id, details, created_at')
      .eq('type', 'pulse_spike')
      .gte('created_at', cooldownSince)
      .in('asset_id', group.ids);

    if (recentAlerts && recentAlerts.length > 0) continue;

    const details = `${group.ids.length} community members in ${community} pulsed 👎 on their beds in the last ${PULSE_WINDOW_DAYS} days. Bed IDs: ${Array.from(new Set(group.ids)).slice(0, 20).join(', ')}`;

    let webhookOk: boolean | null = null;

    if (!dryRun) {
      // Insert one alerts row keyed to the first asset (alerts table requires asset_id)
      await supabase.from('alerts').insert({
        asset_id: group.ids[0],
        alert_date: new Date().toISOString(),
        type: 'pulse_spike',
        severity: 'Medium',
        details,
      });

      if (webhookUrl) {
        try {
          const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'pulse_spike',
              community,
              community_id: group.communityId,
              bad_pulse_count: group.ids.length,
              window_days: PULSE_WINDOW_DAYS,
              affected_bed_ids: Array.from(new Set(group.ids)).slice(0, 20),
              fired_at: new Date().toISOString(),
              admin_link: `https://www.goodsoncountry.com/admin/bed-signals?type=pulse&community=${encodeURIComponent(community)}`,
            }),
          });
          webhookOk = res.ok;
          if (!res.ok) {
            console.error('[pulse-watch] GHL webhook returned', res.status, await res.text());
          }
        } catch (err) {
          webhookOk = false;
          console.error('[pulse-watch] GHL webhook threw:', err);
        }
      }
    }

    fired.push({ community, count: group.ids.length, webhookOk });
  }

  return NextResponse.json({
    ok: true,
    scanned: rows.length,
    communitiesOverThreshold: Object.entries(byCommunity).filter(([, g]) => g.ids.length >= PULSE_THRESHOLD).length,
    alertsFired: fired.length,
    dryRun,
    webhookConfigured: !!webhookUrl,
    fired,
  });
}
