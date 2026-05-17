import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard) return guard;

    const body = await request.json();
    const { community, product, quantity, partner_name, notes, status } = body;

    if (!community) {
      return NextResponse.json({ error: 'Community is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Generate a unique_id for the pipeline entry
    const prefix = product === 'Washing Machine' ? 'WM' : 'SB';
    const timestamp = Date.now().toString(36).toUpperCase();
    const unique_id = `${prefix}-REQ-${timestamp}`;

    const { data, error } = await supabase
      .from('assets')
      .insert({
        unique_id,
        product: product || 'Stretch Bed',
        status: status || 'requested',
        community,
        quantity: quantity || 1,
        partner_name: partner_name || null,
        notes: notes || null,
        type: 'pipeline',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating pipeline entry:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ asset: data, success: true });
  } catch (error) {
    console.error('Pipeline create error:', error);
    return NextResponse.json({ error: 'Failed to create requisition' }, { status: 500 });
  }
}
