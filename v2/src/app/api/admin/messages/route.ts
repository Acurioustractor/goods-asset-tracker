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
    const { profile_id, asset_id, message_text, mark_read_id } = body;

    if (!profile_id || !message_text) {
      return NextResponse.json(
        { error: 'Profile ID and message text are required' },
        { status: 400 }
      );
    }

    // Use service client to bypass RLS
    const supabase = createServiceClient();

    // Create outbound message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        profile_id,
        asset_id: asset_id || null,
        direction: 'outbound',
        message_text: message_text.trim(),
        sender_name: user.email || 'Staff',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mark original message as read if specified
    if (mark_read_id) {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', mark_read_id);
    }

    return NextResponse.json({ message, success: true });
  } catch (error) {
    console.error('Admin message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
