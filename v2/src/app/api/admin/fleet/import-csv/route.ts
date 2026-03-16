import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * Import washing machine telemetry from CSV (e.g. exported from Google Sheets).
 *
 * Expected CSV columns (from Particle → Zapier → Google Sheets "Goods Washer"):
 *   Event, Public, Coreid, Data, Userid, Fw Version, Published At
 *
 * POST body: { csv: "Event,Public,Coreid,Data,Userid,Fw Version,Published At\n..." }
 * or POST body: { rows: [{ event, coreid, data, published_at, fw_version }] }
 */
export async function POST(request: NextRequest) {
  try {
    const userSupabase = await createClient();
    const { data: { user } } = await userSupabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    let rows: Array<{
      event: string;
      coreid: string;
      data: string;
      published_at: string;
      fw_version?: number;
    }> = [];

    if (body.rows) {
      rows = body.rows;
    } else if (body.csv) {
      rows = parseCSV(body.csv);
    } else {
      return NextResponse.json({ error: 'Provide csv string or rows array' }, { status: 400 });
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No rows to import' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get asset lookup by machine_id
    const { data: assets } = await supabase
      .from('assets')
      .select('unique_id, machine_id')
      .not('machine_id', 'is', null);

    const assetByMachineId = new Map<string, string>();
    for (const a of assets || []) {
      if (a.machine_id) assetByMachineId.set(a.machine_id, a.unique_id);
    }

    let imported = 0;
    let duplicates = 0;
    let errors = 0;

    for (const row of rows) {
      if (!row.coreid || !row.event) continue;

      // Parse nested data JSON
      let eventData: { count?: number; A?: string; kWh?: string } | null = null;
      try {
        if (row.data && row.data !== 'test-event') {
          eventData = JSON.parse(row.data);
        }
      } catch {
        // non-JSON data, skip parsing
      }

      const eventType = mapEventType(row.event);
      const occurredAt = row.published_at || new Date().toISOString();

      // Deterministic event_id
      const eventId = crypto
        .createHash('sha256')
        .update(`${row.coreid}-${occurredAt}-${eventData?.count ?? ''}`)
        .digest('hex')
        .substring(0, 32);

      const amps = eventData?.A ? parseFloat(eventData.A) : null;
      const energyKwh = eventData?.kWh ? parseFloat(eventData.kWh) : null;

      const { error: insertError } = await supabase
        .from('usage_logs')
        .insert({
          asset_id: assetByMachineId.get(row.coreid) || null,
          event_id: `particle-${eventId}`,
          event_type: eventType,
          machine_id: row.coreid,
          firmware_version: row.fw_version?.toString() || null,
          power_kwh: energyKwh,
          energy_kwh_total: eventData?.count ? (eventData.count * (energyKwh || 0)) : null,
          cycle_count_total: eventData?.count || null,
          online: true,
          status: eventType === 'cycle_complete' ? 'completed' : eventType,
          created_at: occurredAt,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          duplicates++;
        } else {
          errors++;
        }
      } else {
        imported++;
      }
    }

    return NextResponse.json({
      success: true,
      total: rows.length,
      imported,
      duplicates,
      errors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function mapEventType(event: string): string {
  switch (event) {
    case 'wash_event':
    case 'zapier-new-wash':
    case 'new-wash':
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

function parseCSV(csv: string): Array<{
  event: string;
  coreid: string;
  data: string;
  published_at: string;
  fw_version?: number;
}> {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] || '';
    });

    rows.push({
      event: row.event || '',
      coreid: row.coreid || '',
      data: row.data || '',
      published_at: row.published_at || '',
      fw_version: row.fw_version ? parseInt(row.fw_version) : undefined,
    });
  }

  return rows;
}
