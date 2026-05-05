import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Compare Particle Cloud's per-device "last seen" against our usage_logs.
 *
 * Splits "device problem" from "pipeline problem" without a site visit.
 *
 * POST body: { token: "particle-access-token" }
 *   OR set PARTICLE_ACCESS_TOKEN in env and call with empty body.
 *
 * Get a token from console.particle.io → Settings → Access Tokens.
 */
export async function POST(request: NextRequest) {
  const userSupabase = await createClient();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const isAdmin =
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  let body: { token?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* empty body is fine */
  }

  const token = body.token || process.env.PARTICLE_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: 'No Particle access token. Pass {"token":"..."} in body or set PARTICLE_ACCESS_TOKEN env.' },
      { status: 400 }
    );
  }

  // Fetch device list from Particle Cloud
  let devices: Array<{
    id: string;
    name?: string;
    last_heard?: string | null;
    last_handshake_at?: string | null;
    online?: boolean;
    connected?: boolean;
  }> = [];
  try {
    const res = await fetch('https://api.particle.io/v1/devices', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      return NextResponse.json(
        { error: `Particle Cloud returned ${res.status}`, detail: errBody.slice(0, 500) },
        { status: 502 }
      );
    }
    devices = await res.json();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Particle Cloud unreachable: ${message}` }, { status: 502 });
  }

  // Pull our local last-seen for every coreid via the deployments RPC
  const supabase = createServiceClient();
  const { data: deploymentRows } = await supabase.rpc('get_all_washing_deployments');
  const localByCoreid = new Map<string, { last_seen_at: string | null; name: string | null; community: string | null }>();
  for (const d of (deploymentRows || []) as Array<{ machine_id: string | null; last_seen_at: string | null; name: string | null; community: string | null }>) {
    if (d.machine_id) localByCoreid.set(d.machine_id, d);
  }

  type Verdict =
    | 'agrees_recent'
    | 'agrees_silent'
    | 'pipeline_break'
    | 'never_seen_locally'
    | 'particle_forgot'
    | 'never_anywhere';

  const now = Date.now();
  const RECENT_DAYS = 2;
  const dayMs = 24 * 60 * 60 * 1000;

  const comparison = devices.map((d) => {
    const pCloud = d.last_heard || d.last_handshake_at;
    const local = localByCoreid.get(d.id);
    const pTs = pCloud ? new Date(pCloud).getTime() : null;
    const oTs = local?.last_seen_at ? new Date(local.last_seen_at).getTime() : null;

    let verdict: Verdict;
    let reason: string;

    if (pTs && oTs) {
      const gapDays = (pTs - oTs) / dayMs;
      const pRecent = (now - pTs) / dayMs <= RECENT_DAYS;
      const oRecent = (now - oTs) / dayMs <= RECENT_DAYS;
      if (pRecent && oRecent) {
        verdict = 'agrees_recent';
        reason = 'Particle and our DB both show recent activity. Healthy.';
      } else if (!pRecent && !oRecent && Math.abs(gapDays) <= 1) {
        verdict = 'agrees_silent';
        reason = 'Particle and our DB both stopped at the same time → device-side problem.';
      } else if (gapDays > 1) {
        verdict = 'pipeline_break';
        reason = `Particle saw the device ${Math.round(gapDays)}d after our DB stopped → break is between Particle and our webhook (Zapier or Particle Integration).`;
      } else {
        verdict = 'agrees_silent';
        reason = `Both stopped, gap ${Math.round(gapDays)}d`;
      }
    } else if (pTs && !oTs) {
      verdict = 'never_seen_locally';
      reason = 'Particle has the device but we have never seen any events → never connected to our webhook.';
    } else if (!pTs && oTs) {
      verdict = 'particle_forgot';
      reason = 'Our DB has events but Particle Cloud has no last-seen → device may have been deleted from Particle account.';
    } else {
      verdict = 'never_anywhere';
      reason = 'Neither side has ever seen this device.';
    }

    return {
      coreid: d.id,
      device_name: d.name || null,
      particle_online: d.online || d.connected || false,
      particle_last_seen: pCloud || null,
      our_last_seen: local?.last_seen_at || null,
      asset_name: local?.name || null,
      asset_community: local?.community || null,
      verdict,
      reason,
    };
  });

  // Local coreids Particle does not know about
  const particleIds = new Set(devices.map((d) => d.id));
  const localOnly = Array.from(localByCoreid.entries())
    .filter(([id]) => id.startsWith('e00fce68') && !particleIds.has(id))
    .map(([id, info]) => ({
      coreid: id,
      asset_name: info.name,
      asset_community: info.community,
      our_last_seen: info.last_seen_at,
    }));

  return NextResponse.json({
    checked_at: new Date().toISOString(),
    particle_account_devices: devices.length,
    summary: comparison.reduce(
      (acc, c) => {
        acc[c.verdict] = (acc[c.verdict] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    devices: comparison,
    local_only_coreids: localOnly,
  });
}
