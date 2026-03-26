import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/**
 * GHL Activity Sync Cron — runs daily
 *
 * Pulls GHL contact tags and notes into crm_activities
 * so we have a unified activity feed across all channels.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!ghl.isEnabled()) {
    return NextResponse.json({ success: true, message: 'GHL disabled', synced: 0 });
  }

  const supabase = createServiceClient();
  const results = { synced: 0, skipped: 0, errors: 0 };

  try {
    // Get all GHL contacts with goods tags
    const ghlContacts = await ghl.getContacts({ goodsOnly: true });

    // Get CRM contacts to match
    const { data: crmContacts } = await supabase
      .from('crm_contacts')
      .select('id, email, phone, name');

    if (!crmContacts) {
      return NextResponse.json({ success: true, message: 'No CRM contacts', ...results });
    }

    // Build lookup maps
    const crmByEmail = new Map<string, string>();
    const crmByPhone = new Map<string, string>();
    for (const c of crmContacts) {
      if (c.email) crmByEmail.set(c.email.toLowerCase(), c.id);
      if (c.phone) crmByPhone.set(c.phone, c.id);
    }

    // Get existing activities to avoid duplicates
    const { data: existingActivities } = await supabase
      .from('crm_activities')
      .select('metadata')
      .eq('channel', 'ghl');

    const existingGhlIds = new Set<string>();
    if (existingActivities) {
      for (const a of existingActivities) {
        const meta = a.metadata as Record<string, unknown>;
        if (meta?.ghl_sync_key) existingGhlIds.add(meta.ghl_sync_key as string);
      }
    }

    // For each GHL contact, log their tags as activity if new
    for (const ghlContact of ghlContacts) {
      const email = ghlContact.email?.toLowerCase();
      const phone = ghlContact.phone;
      const contactId = (email && crmByEmail.get(email)) || (phone && crmByPhone.get(phone));

      if (!contactId) {
        results.skipped++;
        continue;
      }

      // Log tag-based activities
      const tags = ghlContact.tags || [];
      const syncKey = `ghl-tags-${ghlContact.id}-${tags.sort().join(',')}`;

      if (existingGhlIds.has(syncKey)) {
        results.skipped++;
        continue;
      }

      // Determine activity type from tags
      const tagActivities: { type: string; subject: string }[] = [];

      if (tags.some((t: string) => t.includes('customer') || t.includes('order'))) {
        tagActivities.push({ type: 'note', subject: 'Customer via GHL' });
      }
      if (tags.some((t: string) => t.includes('newsletter'))) {
        tagActivities.push({ type: 'note', subject: 'Newsletter subscriber via GHL' });
      }
      if (tags.some((t: string) => t.includes('support'))) {
        tagActivities.push({ type: 'note', subject: 'Support request via GHL' });
      }
      if (tags.some((t: string) => t.includes('partner') || t.includes('strategic'))) {
        tagActivities.push({ type: 'note', subject: 'Strategic target via GHL' });
      }

      if (tagActivities.length === 0) {
        tagActivities.push({ type: 'note', subject: `GHL contact: ${tags.join(', ')}` });
      }

      for (const activity of tagActivities) {
        const { error } = await supabase.from('crm_activities').insert({
          contact_id: contactId,
          activity_type: activity.type,
          subject: activity.subject,
          body: `GHL tags: ${tags.join(', ')}`,
          channel: 'ghl',
          direction: 'inbound',
          occurred_at: new Date().toISOString(),
          metadata: { ghl_sync_key: syncKey, ghl_contact_id: ghlContact.id, tags },
        });

        if (error) {
          results.errors++;
        } else {
          results.synced++;
        }
      }

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ghl_contacts: ghlContacts.length,
      ...results,
    });
  } catch (error) {
    console.error('[GHL Activity Sync] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 },
    );
  }
}
