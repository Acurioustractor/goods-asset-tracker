import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const userSupabase = await createClient();
    const {
      data: { user },
    } = await userSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
