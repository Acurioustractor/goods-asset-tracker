import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('asset_id');

    // First get user's claimed assets
    const { data: userAssets, error: assetsError } = await supabase
      .from('user_assets')
      .select('asset_id')
      .eq('profile_id', user.id)
      .eq('claim_status', 'active');

    if (assetsError) {
      console.error('Error fetching user assets:', assetsError);
      return NextResponse.json({ error: assetsError.message }, { status: 500 });
    }

    if (!userAssets || userAssets.length === 0) {
      return NextResponse.json({ content: [] });
    }

    const claimedAssetIds = userAssets.map((ua) => ua.asset_id);

    // Build query for compassion content
    let query = supabase
      .from('compassion_content')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by specific asset or all claimed assets
    if (assetId) {
      // Verify user has claimed this asset
      if (!claimedAssetIds.includes(assetId)) {
        return NextResponse.json({ error: 'Asset not claimed' }, { status: 403 });
      }
      query = query.eq('asset_id', assetId);
    } else {
      query = query.in('asset_id', claimedAssetIds);
    }

    const { data: content, error } = await query;

    if (error) {
      console.error('Error fetching compassion content:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mark content as viewed
    if (content && content.length > 0) {
      const unviewedIds = content
        .filter((c) => !c.viewed_at)
        .map((c) => c.id);

      if (unviewedIds.length > 0) {
        await supabase
          .from('compassion_content')
          .update({ viewed_at: new Date().toISOString() })
          .in('id', unviewedIds);
      }
    }

    return NextResponse.json({ content: content || [] });
  } catch (error) {
    console.error('User compassion error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
