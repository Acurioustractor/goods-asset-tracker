import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

type SignalType = 'pulse' | 'reminder' | 'check_in' | 'demand_bump' | 'name_change' | 'workshop_interest';

const VALID_TYPES: SignalType[] = ['pulse', 'reminder', 'check_in', 'demand_bump', 'name_change', 'workshop_interest'];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: {
    signal_type?: SignalType;
    signal_value?: string;
    contact?: string;
    payload?: Record<string, unknown>;
    scheduled_for?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!body.signal_type || !VALID_TYPES.includes(body.signal_type)) {
    return NextResponse.json({ error: 'Invalid signal_type' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: asset } = await supabase
    .from('assets')
    .select('unique_id, community, community_id, product')
    .eq('unique_id', id)
    .single();
  if (!asset) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  const { data: row, error } = await supabase
    .from('bed_signals')
    .insert({
      asset_id: asset.unique_id,
      signal_type: body.signal_type,
      signal_value: body.signal_value || null,
      contact: body.contact || null,
      payload: body.payload || {},
      scheduled_for: body.scheduled_for || null,
      created_by: 'web-scan',
    })
    .select('id')
    .single();

  if (error) {
    console.error('[bed/signal] insert failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Side effect: demand_bump also writes to community_demand if structured
  if (body.signal_type === 'demand_bump' && asset.community_id) {
    await supabase.from('community_demand').insert({
      community_id: asset.community_id,
      product: asset.product || 'Stretch Bed',
      qty: (body.payload?.qty as number) || (body.payload?.quantity as number) || 1,
      status: 'requested',
      source: 'bed-scan',
      requested_by: body.contact || (body.payload?.requested_by as string) || 'bed-scan',
      request_date: new Date().toISOString().slice(0, 10),
      notes:
        (body.payload?.notes as string) ||
        `Bumped from /bed/${asset.unique_id}`,
    });
  }

  return NextResponse.json({ ok: true, id: row.id });
}
