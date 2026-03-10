import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Particle.io webhook receiver for washing machine telemetry.
 *
 * Particle devices (via Zapier or direct webhook) POST events like:
 * {
 *   "event": "wash_event",
 *   "data": "{\"count\":3,\"A\":\"1.65\",\"kWh\":\"0.65\"}",
 *   "published_at": "2026-03-09T10:55:34.382Z",
 *   "coreid": "e00fce687ae01d08f95694e5",
 *   "userid": "5e6ad98d764c6d00014be177",
 *   "fw_version": 6,
 *   "public": false
 * }
 *
 * This transforms the Particle payload into our usage_logs schema
 * (same table the Openfields endpoint writes to).
 */

interface ParticlePayload {
  event: string;
  data: string; // JSON string: { count, A, kWh }
  published_at: string;
  coreid: string;
  userid?: string;
  fw_version?: number;
  public?: boolean;
}

interface WashEventData {
  count: number;
  A: string; // amps
  kWh: string; // energy per cycle
}

function mapEventType(event: string): string {
  switch (event) {
    case 'wash_event':
      return 'cycle_complete';
    case 'heartbeat':
    case 'spark/status':
      return 'heartbeat';
    case 'restart':
    case 'spark/device/restart':
      return 'restart';
    default:
      return event;
  }
}

export async function POST(request: NextRequest) {
  let body: string;
  let payload: ParticlePayload;

  try {
    body = await request.text();
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload.coreid || !payload.event) {
    return NextResponse.json(
      { error: 'Missing required fields: coreid, event' },
      { status: 400 }
    );
  }

  // Parse the nested data JSON string
  let eventData: WashEventData | null = null;
  if (payload.data) {
    try {
      eventData = JSON.parse(payload.data);
    } catch {
      // data might not always be JSON — log but continue
      console.warn('Particle webhook: non-JSON data field:', payload.data);
    }
  }

  const eventType = mapEventType(payload.event);
  const occurredAt = payload.published_at || new Date().toISOString();

  // Generate deterministic event_id from coreid + timestamp to prevent duplicates
  const eventId = crypto
    .createHash('sha256')
    .update(`${payload.coreid}-${occurredAt}-${eventData?.count ?? ''}`)
    .digest('hex')
    .substring(0, 32);

  const supabase = createServiceClient();

  try {
    // Look up asset by machine_id (coreid maps to machine_id in assets table)
    const { data: asset } = await supabase
      .from('assets')
      .select('unique_id')
      .eq('machine_id', payload.coreid)
      .single();

    // Calculate power in watts from amps (assume ~240V Australian mains)
    const amps = eventData?.A ? parseFloat(eventData.A) : null;
    const powerW = amps ? Math.round(amps * 240) : null;
    const energyKwh = eventData?.kWh ? parseFloat(eventData.kWh) : null;

    const { error: insertError } = await supabase
      .from('usage_logs')
      .insert({
        asset_id: asset?.unique_id || null,
        event_id: `particle-${eventId}`,
        event_type: eventType,
        machine_id: payload.coreid,
        firmware_version: payload.fw_version?.toString() || null,
        power_kwh: energyKwh,
        energy_kwh_total: eventData?.count
          ? (eventData.count * (energyKwh || 0))
          : null,
        cycle_count_total: eventData?.count || null,
        online: true,
        status: eventType === 'cycle_complete' ? 'completed' : eventType,
        created_at: occurredAt,
      });

    if (insertError) {
      // Duplicate event_id — idempotent, return success
      if (insertError.code === '23505') {
        return NextResponse.json({ received: true, duplicate: true });
      }
      console.error('Particle webhook insert error:', insertError);
      return NextResponse.json(
        { error: 'Database error', detail: insertError.message },
        { status: 500 }
      );
    }

    // Auto-create alert if machine was previously unknown
    if (!asset) {
      console.warn(
        `Particle webhook: unknown machine coreid=${payload.coreid}. ` +
        `Add machine_id to assets table to link telemetry.`
      );
    }

    return NextResponse.json({
      received: true,
      event_type: eventType,
      machine_id: payload.coreid,
      kwh: energyKwh,
      cycles: eventData?.count,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Particle webhook handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
