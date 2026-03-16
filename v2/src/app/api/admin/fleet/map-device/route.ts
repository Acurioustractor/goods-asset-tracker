import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

/**
 * Map a Particle coreid to an existing washing machine asset.
 *
 * POST { asset_id: "GB0-113", particle_coreid: "e00fce68..." }
 *
 * This updates the asset's machine_id to the Particle coreid so that
 * incoming webhook events are automatically linked.
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

    const { asset_id, particle_coreid } = await request.json();
    if (!asset_id || !particle_coreid) {
      return NextResponse.json({ error: 'asset_id and particle_coreid required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Update the asset's machine_id to the Particle coreid
    const { data, error } = await supabase
      .from('assets')
      .update({ machine_id: particle_coreid })
      .eq('unique_id', asset_id)
      .select('unique_id, machine_id, name, community')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also update any existing usage_logs with the old machine_id
    // to link them to the new coreid (best effort)
    const oldMachineId = data.name; // The old human-readable name was likely used
    if (oldMachineId && oldMachineId !== particle_coreid) {
      await supabase
        .from('usage_logs')
        .update({ machine_id: particle_coreid })
        .eq('machine_id', oldMachineId);
    }

    return NextResponse.json({ success: true, asset: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET — list all washing machine assets with their current machine_id mapping
 */
export async function GET(request: NextRequest) {
  try {
    const userSupabase = await createClient();
    const { data: { user } } = await userSupabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createServiceClient();

    const { data: machines } = await supabase
      .from('assets')
      .select('unique_id, machine_id, name, community, product')
      .eq('product', 'Washing Machine')
      .order('community');

    // Check which have real Particle coreids vs human names
    const result = (machines || []).map((m) => ({
      ...m,
      has_particle_id: m.machine_id?.match(/^[a-f0-9]{24}$/) ? true : false,
    }));

    return NextResponse.json({ machines: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
