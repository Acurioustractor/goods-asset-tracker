import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { allTargets } from '@/lib/data/outreach-targets';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

    const body = await request.json() as { contactId?: string; targetId?: string };
    const contactId = body.contactId?.trim();
    const targetId = body.targetId?.trim();

    if (!contactId || !targetId) {
      return NextResponse.json({ error: 'contactId and targetId are required' }, { status: 400 });
    }

    const target = allTargets.find((entry) => entry.id === targetId);
    if (!target) {
      return NextResponse.json({ error: 'Target not found' }, { status: 404 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase
      .from('crm_contacts')
      .update({
        grantscope_id: target.id,
        metadata: {
          outreach_target_id: target.id,
          outreach_category: target.category,
          outreach_priority: target.priority,
          identity_resolved_manually: true,
          identity_match_basis: 'manual',
        },
      })
      .eq('id', contactId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      contactId,
      targetId: target.id,
      targetName: target.name,
    });
  } catch (error) {
    console.error('Resolve outreach target identity error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to resolve outreach target identity' },
      { status: 500 },
    );
  }
}
