import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Fleet daily rollup cron — runs every 6 hours.
 *
 * 1. Aggregates usage_logs into daily_machine_rollups for yesterday + today
 * 2. Creates alerts for machines silent >24h (heartbeat monitoring)
 *
 * Secured via CRON_SECRET header (Vercel cron sets this automatically).
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const results: string[] = [];

  try {
    // ── 1. REFRESH MATERIALIZED VIEW ──
    // daily_machine_rollups is a materialized view that aggregates usage_logs.
    // We just need to refresh it — the SQL view definition handles the aggregation.
    const { error: refreshError } = await supabase.rpc('refresh_daily_machine_rollups');
    if (refreshError) {
      results.push(`Rollup refresh failed: ${refreshError.message}`);
    } else {
      results.push('Refreshed daily_machine_rollups materialized view');
    }

    // ── 2. HEARTBEAT ALERTING ──
    // Find machines that haven't reported in 24h
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ).toISOString();

    // Get all known machines
    const { data: allMachines } = await supabase
      .from('assets')
      .select('unique_id, machine_id, name, community')
      .not('machine_id', 'is', null);

    if (allMachines && allMachines.length > 0) {
      // Get latest log per machine
      const { data: latestLogs } = await supabase
        .from('usage_logs')
        .select('machine_id, created_at')
        .not('machine_id', 'is', null)
        .order('created_at', { ascending: false });

      const latestByMachine = new Map<string, string>();
      for (const log of latestLogs || []) {
        if (log.machine_id && !latestByMachine.has(log.machine_id)) {
          latestByMachine.set(log.machine_id, log.created_at);
        }
      }

      // Check for existing open offline alerts to avoid duplicates
      const { data: existingAlerts } = await supabase
        .from('alerts')
        .select('asset_id, type')
        .eq('type', 'machine_silent')
        .or('resolved.is.null,resolved.eq.false');

      const existingAlertAssets = new Set(
        (existingAlerts || []).map((a) => a.asset_id),
      );

      let silentCount = 0;
      for (const machine of allMachines) {
        const lastSeen = latestByMachine.get(machine.machine_id!);

        // Skip if already has an open silent alert
        if (existingAlertAssets.has(machine.unique_id)) continue;

        // Skip machines that never reported (they may not have telemetry)
        if (!lastSeen) continue;

        if (lastSeen < twentyFourHoursAgo) {
          silentCount++;
          await supabase.from('alerts').insert({
            asset_id: machine.unique_id,
            type: 'machine_silent',
            severity: 'Medium',
            details: `${machine.name || machine.machine_id} (${machine.community}) has not reported in 24+ hours. Last seen: ${new Date(lastSeen).toLocaleString('en-AU')}.`,
          });
        }
      }

      results.push(
        `Heartbeat check: ${allMachines.length} machines, ${silentCount} new silent alerts`,
      );
    }

    // ── 3. AUTO-RESOLVE SILENT ALERTS ──
    // If a machine that was marked silent is now reporting, resolve the alert
    const { data: openSilentAlerts } = await supabase
      .from('alerts')
      .select('id, asset_id')
      .eq('type', 'machine_silent')
      .or('resolved.is.null,resolved.eq.false');

    if (openSilentAlerts && openSilentAlerts.length > 0) {
      // Get the asset → machine_id mapping
      const assetIds = openSilentAlerts.map((a) => a.asset_id).filter(Boolean);
      const { data: alertAssets } = await supabase
        .from('assets')
        .select('unique_id, machine_id')
        .in('unique_id', assetIds as string[]);

      const assetToMachine = new Map<string, string>();
      for (const a of alertAssets || []) {
        if (a.machine_id) assetToMachine.set(a.unique_id, a.machine_id);
      }

      let resolvedCount = 0;
      for (const alert of openSilentAlerts) {
        const machineId = assetToMachine.get(alert.asset_id as string);
        if (!machineId) continue;

        // Check if this machine has reported recently
        const { data: recentLog } = await supabase
          .from('usage_logs')
          .select('created_at')
          .eq('machine_id', machineId)
          .gte('created_at', twentyFourHoursAgo)
          .limit(1);

        if (recentLog && recentLog.length > 0) {
          await supabase
            .from('alerts')
            .update({ resolved: true })
            .eq('id', alert.id);
          resolvedCount++;
        }
      }

      if (resolvedCount > 0) {
        results.push(`Auto-resolved ${resolvedCount} silent alerts (machines back online)`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Fleet rollup cron error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
