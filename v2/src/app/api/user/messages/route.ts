import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get('count_only') === 'true';

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If only counting unread messages
    if (countOnly) {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .eq('direction', 'outbound')
        .is('read_at', null);

      if (error) {
        console.error('Error counting unread messages:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ unread_count: count || 0 });
    }

    // Get all messages
    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, asset_id, direction, message_text, sender_name, created_at, read_at')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: true })
      .limit(200);

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mark unread outbound messages as read
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('profile_id', user.id)
      .eq('direction', 'outbound')
      .is('read_at', null);

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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
    const { message_text, asset_id } = body;

    if (!message_text || typeof message_text !== 'string' || message_text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }

    // Get user profile for sender name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, phone, email')
      .eq('id', user.id)
      .single();

    const senderName = profile?.display_name || user.phone || 'User';

    // Create message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        profile_id: user.id,
        asset_id: asset_id || null,
        direction: 'inbound',
        message_text: message_text.trim(),
        sender_name: senderName,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Somebody on the community line just wrote to us. Raise a task against a
    // named human with a 12-hour clock: a message is a person waiting, so it
    // gets a tighter clock than a parts request. Nothing is sent back to them
    // automatically; a person replies in /admin/messages.
    try {
      await ghl.raiseCommunityInbound({
        name: profile?.display_name || undefined,
        phone: profile?.phone || undefined,
        email: profile?.email || undefined,
        kind: 'Portal message',
        detail: message_text.trim(),
        assetId: asset_id || undefined,
        dueInHours: 12,
      });
    } catch (notifyError) {
      console.error('[Messages] Could not raise the inbound task:', notifyError);
    }

    return NextResponse.json({ message, success: true });
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
