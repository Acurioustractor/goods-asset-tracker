import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const userSupabase = await createClient();
    const {
      data: { user },
    } = await userSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { asset_id, content_type, media_url, thumbnail_url, caption } = body;

    // Validate required fields
    if (!asset_id) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      );
    }

    if (!['photo', 'video', 'message'].includes(content_type)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Use service client to bypass RLS
    const supabase = createServiceClient();

    // Create compassion content
    const { data: content, error } = await supabase
      .from('compassion_content')
      .insert({
        asset_id,
        content_type,
        media_url: media_url || null,
        thumbnail_url: thumbnail_url || null,
        caption: caption || null,
        created_by: user.email || 'Staff',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating compassion content:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ content, success: true });
  } catch (error) {
    console.error('Admin compassion error:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
