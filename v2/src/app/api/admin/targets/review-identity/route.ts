import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type CrmContactMetadata = Record<string, unknown> | null;

export async function POST(request: Request) {
  try {
    const userSupabase = await createClient();
    const {
      data: { user },
    } = await userSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      user.user_metadata?.role === 'admin' ||
      process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json() as { contactId?: string; contactIds?: string[]; action?: 'review' | 'undo' };
    const contactIds = [
      ...(body.contactId ? [body.contactId] : []),
      ...((body.contactIds || []).filter(Boolean)),
    ]
      .map((value) => value.trim())
      .filter(Boolean);
    const action = body.action === 'undo' ? 'undo' : 'review';

    if (contactIds.length === 0) {
      return NextResponse.json({ error: 'contactId or contactIds is required' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: contacts, error: contactError } = await supabase
      .from('crm_contacts')
      .select('id, metadata')
      .in('id', contactIds);

    if (contactError) {
      return NextResponse.json({ error: contactError.message }, { status: 500 });
    }

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const reviewedAt = action === 'review' ? new Date().toISOString() : null;
    const updates = await Promise.all(
      contacts.map(async (contact) => {
        const metadata = (contact.metadata || {}) as CrmContactMetadata;
        const nextMetadata = {
          ...(metadata || {}),
          identity_backfill_reviewed: action === 'review',
          identity_backfill_reviewed_at: reviewedAt,
          identity_backfill_review_status: action === 'review' ? 'skipped' : null,
        };

        const { error: updateError } = await supabase
          .from('crm_contacts')
          .update({
            metadata: nextMetadata,
          })
          .eq('id', contact.id);

        return {
          contactId: contact.id,
          error: updateError,
        };
      }),
    );

    const failed = updates.filter((update) => update.error);
    if (failed.length > 0) {
      return NextResponse.json(
        { error: failed[0].error?.message || 'Failed to update contact review state' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      contactIds: contacts.map((contact) => contact.id),
      count: contacts.length,
      action,
    });
  } catch (error) {
    console.error('Review outreach target identity error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to mark identity review' },
      { status: 500 },
    );
  }
}
