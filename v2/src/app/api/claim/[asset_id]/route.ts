import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';

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

    // Sync claim to GHL for CRM tracking, and put a human on it.
    //
    // The contact write alone is not enough. A claim is the one moment somebody
    // in a community chooses to be known to Goods, and until this task existed
    // it produced a row and a contact record that nobody was told about. The
    // task points INWARD: the person is on lane:community and receives nothing
    // automatic (R9). Someone rings them instead.
    const claimant = {
      phone: user.phone || undefined,
      email: user.email || undefined,
      name: user.user_metadata?.display_name || user.user_metadata?.full_name,
    };
    try {
      if (ghl.isEnabled() && claimant.phone) {
        await ghl.createRecipientContact({
          phone: claimant.phone,
          name: claimant.name,
          assetId: asset_id,
          productType: asset.product || 'unknown',
          community: asset.community || 'unknown',
        });
      }
    } catch (ghlError) {
      // Don't fail the claim if GHL sync fails
      console.error('[Claim] GHL sync error (non-fatal):', ghlError);
    }

    try {
      await ghl.raiseCommunityInbound({
        name: claimant.name,
        phone: claimant.phone,
        email: claimant.email,
        kind: 'Bed claimed by QR',
        detail: [
          `${asset.product || 'An item'} ${asset_id} was claimed`,
          asset.community ? `Community: ${asset.community}` : null,
          'First claim through the QR flow. Ring them and find out how it is going.',
        ]
          .filter(Boolean)
          .join('\n'),
        assetId: asset_id,
      });
    } catch (notifyError) {
      console.error('[Claim] Could not raise the inbound task:', notifyError);
    }

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
