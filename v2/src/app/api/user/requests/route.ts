import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const VALID_REQUEST_TYPES = ['blanket', 'pillow', 'parts', 'checkin', 'pickup', 'other'];

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's requests
    const { data: requests, error } = await supabase
      .from('user_requests')
      .select('id, asset_id, request_type, description, priority, status, created_at, fulfilled_at, fulfillment_notes')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching requests:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ requests: requests || [] });
  } catch (error) {
    console.error('Requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { request_type, asset_id, description } = body;

    // Validate request type
    if (!request_type || !VALID_REQUEST_TYPES.includes(request_type)) {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }

    // Validate asset_id (user must own this asset)
    if (asset_id) {
      const { data: userAsset } = await supabase
        .from('user_assets')
        .select('id')
        .eq('profile_id', user.id)
        .eq('asset_id', asset_id)
        .eq('claim_status', 'active')
        .single();

      if (!userAsset) {
        return NextResponse.json(
          { error: 'You can only make requests for items you have claimed' },
          { status: 400 }
        );
      }
    }

    // Create request
    const { data: newRequest, error } = await supabase
      .from('user_requests')
      .insert({
        profile_id: user.id,
        asset_id: asset_id || null,
        request_type,
        description: description || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating request:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ request: newRequest, success: true });
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}
