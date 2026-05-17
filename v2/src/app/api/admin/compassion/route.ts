import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard) return guard;

    // Fetch user for audit fields (created_by); may be null in local dev
    const userSupabase = await createClient();
    const {
      data: { user },
    } = await userSupabase.auth.getUser();

    const body = await request.json();
    const { asset_id, content_type, media_url, thumbnail_url, caption, is_public } = body;

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

    // Create compassion content. Staff uploads default to public unless toggled off.
    const { data: content, error } = await supabase
      .from('compassion_content')
      .insert({
        asset_id,
        content_type,
        media_url: media_url || null,
        thumbnail_url: thumbnail_url || null,
        caption: caption || null,
        created_by: user?.email || 'Staff',
        is_public: is_public !== false,
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
