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
    case 'zapier-new-wash':
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

async function logReceipt(
  supabase: ReturnType<typeof createServiceClient>,
  fields: {
    status_code: number;
    event_type?: string | null;
    machine_id?: string | null;
    body_size: number;
    user_agent?: string | null;
    remote_ip?: string | null;
    duplicate?: boolean;
    error_message?: string | null;
    raw_body?: unknown;
  }
) {
  // Best-effort — never let receipt-logging failures take down the webhook.
  try {
    await supabase.from('webhook_receipts').insert({
      source: 'particle',
      ...fields,
    });
  } catch {
    /* swallow */
  }
}

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');
  const remoteIp =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    null;
  const supabaseLog = createServiceClient();

  let body: string;
  let payload: ParticlePayload;

  try {
    body = await request.text();
    payload = JSON.parse(body);
  } catch {
    await logReceipt(supabaseLog, {
      status_code: 400,
      body_size: 0,
      user_agent: userAgent,
      remote_ip: remoteIp,
      error_message: 'Invalid JSON',
    });
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload.coreid || !payload.event) {
    await logReceipt(supabaseLog, {
      status_code: 400,
      body_size: body.length,
      user_agent: userAgent,
      remote_ip: remoteIp,
      error_message: 'Missing required fields: coreid, event',
      raw_body: payload,
    });
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
        await logReceipt(supabaseLog, {
          status_code: 200,
          event_type: eventType,
          machine_id: payload.coreid,
          body_size: body.length,
          user_agent: userAgent,
          remote_ip: remoteIp,
          duplicate: true,
        });
        return NextResponse.json({ received: true, duplicate: true });
      }
      console.error('Particle webhook insert error:', insertError);
      await logReceipt(supabaseLog, {
        status_code: 500,
        event_type: eventType,
        machine_id: payload.coreid,
        body_size: body.length,
        user_agent: userAgent,
        remote_ip: remoteIp,
        error_message: insertError.message,
      });
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

    await logReceipt(supabaseLog, {
      status_code: 200,
      event_type: eventType,
      machine_id: payload.coreid,
      body_size: body.length,
      user_agent: userAgent,
      remote_ip: remoteIp,
    });

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
    await logReceipt(supabaseLog, {
      status_code: 500,
      event_type: undefined,
      machine_id: payload.coreid,
      body_size: body.length,
      user_agent: userAgent,
      remote_ip: remoteIp,
      error_message: message,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
