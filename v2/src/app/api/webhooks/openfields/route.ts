import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface OpenfieldsPayload {
  event_id: string;
  event_type: 'cycle_complete' | 'heartbeat' | 'restart' | 'offline' | 'online' | 'firmware_update';
  occurred_at: string;
  machine_id: string;
  site_name?: string;
  firmware_version?: string;
  power_w?: number;
  energy_kwh_total?: number;
  cycle_count_total?: number;
  restart_counter?: number;
  online?: boolean;
  signal_rssi?: number;
}

function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.OPENFIELDS_WEBHOOK_SECRET;
  if (!secret) {
    console.error('OPENFIELDS_WEBHOOK_SECRET not configured');
    return false;
  }
  if (!signature) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-openfields-signature');

  // Verify HMAC signature
  if (!verifySignature(body, signature)) {
    console.error('Openfields webhook: invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: OpenfieldsPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload.event_id || !payload.event_type || !payload.machine_id) {
    return NextResponse.json(
      { error: 'Missing required fields: event_id, event_type, machine_id' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  try {
    // Look up asset by machine_id (PK is unique_id in assets table)
    const { data: asset } = await supabase
      .from('assets')
      .select('unique_id')
      .eq('machine_id', payload.machine_id)
      .single();

    // Calculate per-cycle kWh from wattage (rough estimate: assume ~45min cycle)
    const powerKwh = payload.power_w
      ? Math.round((payload.power_w * 0.75) / 1000 * 100) / 100
      : null;

    // Insert usage log (idempotent via event_id unique constraint)
    const { error: insertError } = await supabase
      .from('usage_logs')
      .insert({
        asset_id: asset?.unique_id || null,
        event_id: payload.event_id,
        event_type: payload.event_type,
        machine_id: payload.machine_id,
        site_name: payload.site_name || null,
        firmware_version: payload.firmware_version || null,
        power_kwh: powerKwh,
        energy_kwh_total: payload.energy_kwh_total || null,
        cycle_count_total: payload.cycle_count_total || null,
        restart_counter: payload.restart_counter || null,
        signal_rssi: payload.signal_rssi || null,
        online: payload.online ?? true,
        status: payload.event_type === 'cycle_complete' ? 'completed' : payload.event_type,
        created_at: payload.occurred_at || new Date().toISOString(),
      });

    if (insertError) {
      // Duplicate event_id — idempotent, return success
      if (insertError.code === '23505') {
        return NextResponse.json({ received: true, duplicate: true });
      }
      console.error('Openfields webhook insert error:', insertError);
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      );
    }

    // Auto-create alerts for notable events
    await createAutoAlerts(supabase, payload, asset?.unique_id);

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Openfields webhook handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function createAutoAlerts(
  supabase: ReturnType<typeof createServiceClient>,
  payload: OpenfieldsPayload,
  assetId: string | null
) {
  const alerts: Array<{
    asset_id: string | null;
    type: string;
    severity: string;
    details: string;
  }> = [];

  // Machine went offline
  if (payload.event_type === 'offline') {
    alerts.push({
      asset_id: assetId,
      type: 'machine_offline',
      severity: 'Medium',
      details: `Machine ${payload.machine_id} went offline at ${payload.site_name || 'unknown site'} (${payload.occurred_at})`,
    });
  }

  // Frequent restarts (restart_counter > 10 in recent period)
  if (payload.event_type === 'restart' && (payload.restart_counter || 0) > 10) {
    alerts.push({
      asset_id: assetId,
      type: 'frequent_restarts',
      severity: 'High',
      details: `Machine ${payload.machine_id} has ${payload.restart_counter} restarts (${payload.occurred_at})`,
    });
  }

  // High energy usage per cycle (> 2600W is unusual for a wash cycle)
  if (
    payload.event_type === 'cycle_complete' &&
    payload.power_w &&
    payload.power_w > 2600
  ) {
    alerts.push({
      asset_id: assetId,
      type: 'high_energy_usage',
      severity: 'Low',
      details: `Machine ${payload.machine_id} used ${payload.power_w}W in a cycle (${payload.occurred_at})`,
    });
  }

  if (alerts.length > 0) {
    const { error } = await supabase.from('alerts').insert(alerts);
    if (error) {
      console.error('Failed to create auto alerts:', error);
    }
  }
}
