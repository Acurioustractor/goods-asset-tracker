import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ asset_id: string }> }
) {
  try {
    const { asset_id } = await params;
    const supabase = await createClient();

    // Get asset details
    const { data: asset, error } = await supabase
      .from('assets')
      .select('unique_id, name, product, community, place')
      .eq('unique_id', asset_id)
      .single();

    if (error || !asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ asset });
  } catch (error) {
    console.error('Get asset error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ asset_id: string }> }
) {
  try {
    const { asset_id } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if asset exists
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('unique_id, product, community')
      .eq('unique_id', asset_id)
      .single();

    if (assetError || !asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    // Check if already claimed by this user
    const { data: existingClaim } = await supabase
      .from('user_assets')
      .select('id')
      .eq('profile_id', user.id)
      .eq('asset_id', asset_id)
      .single();

    if (existingClaim) {
      return NextResponse.json(
        { error: 'You have already claimed this item' },
        { status: 400 }
      );
    }

    // Create claim
    const { error: claimError } = await supabase
      .from('user_assets')
      .insert({
        profile_id: user.id,
        asset_id: asset_id,
      });

    if (claimError) {
      console.error('Claim error:', claimError);
      return NextResponse.json(
        { error: claimError.message },
        { status: 500 }
      );
    }

    // TODO: Sync with GHL when enabled
    // const ghl = await import('@/lib/ghl');
    // await ghl.updateContactWithClaim(user.phone, asset_id, asset.product, asset.community);

    return NextResponse.json({
      success: true,
      message: 'Item claimed successfully',
    });
  } catch (error) {
    console.error('Claim error:', error);
    return NextResponse.json(
      { error: 'Failed to claim item' },
      { status: 500 }
    );
  }
}
