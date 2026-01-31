import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

const VALID_STATUSES = ['pending', 'approved', 'in_progress', 'fulfilled', 'denied'];

export async function PATCH(request: Request) {
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
    const { request_id, status, fulfillment_notes } = body;

    if (!request_id || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Use service client to bypass RLS
    const supabase = createServiceClient();

    // Update request
    const updateData: Record<string, string | null> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'fulfilled') {
      updateData.fulfilled_at = new Date().toISOString();
      updateData.fulfilled_by = user.email || 'Staff';
    }

    if (fulfillment_notes) {
      updateData.fulfillment_notes = fulfillment_notes;
    }

    const { data: updatedRequest, error } = await supabase
      .from('user_requests')
      .update(updateData)
      .eq('id', request_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating request:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ request: updatedRequest, success: true });
  } catch (error) {
    console.error('Admin request update error:', error);
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    );
  }
}
