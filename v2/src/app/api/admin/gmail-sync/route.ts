import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface GmailEntry {
  email: string;
  lastEmailDate: string;       // ISO 8601 date string
  totalEmails: number;
  lastSubject?: string;
}

interface UpdateResult {
  email: string;
  contactId: string;
  updated: boolean;
  reason: string;
}

/**
 * POST /api/admin/gmail-sync
 *
 * Accepts a JSON body with an array of Gmail email summaries gathered by
 * the caller (e.g. Claude via Gmail MCP) and writes them into crm_contacts:
 *   - last_contact_date  — updated only when Gmail date is more recent
 *   - metadata.gmail_email_count  — total emails exchanged
 *   - metadata.gmail_last_subject — subject line of the most recent email
 *
 * Auth: Authorization: Bearer <CRON_SECRET>
 *
 * Example body:
 * [
 *   {
 *     "email": "person@example.com",
 *     "lastEmailDate": "2026-03-20T14:30:00Z",
 *     "totalEmails": 12,
 *     "lastSubject": "Re: Stretch Bed order"
 *   }
 * ]
 */
export async function POST(request: NextRequest) {
  // Auth check — reuse CRON_SECRET so the same token works for all admin routes
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let entries: GmailEntry[];
  try {
    entries = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ error: 'Body must be a non-empty array' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Normalise emails to lower-case for matching
  const normalised = entries.map(e => ({
    ...e,
    email: e.email.toLowerCase().trim(),
  }));

  const emails = normalised.map(e => e.email);

  // Fetch all matching contacts in one query
  const { data: contacts, error: fetchError } = await supabase
    .from('crm_contacts')
    .select('id, email, last_contact_date, metadata')
    .in('email', emails);

  if (fetchError) {
    console.error('[Gmail Sync] Fetch error:', fetchError.message);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // Index contacts by email for O(1) lookup
  const contactByEmail = new Map<string, { id: string; last_contact_date: string | null; metadata: Record<string, unknown> }>();
  for (const c of contacts ?? []) {
    if (c.email) {
      contactByEmail.set(c.email.toLowerCase(), c);
    }
  }

  const results: UpdateResult[] = [];
  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  for (const entry of normalised) {
    const contact = contactByEmail.get(entry.email);

    if (!contact) {
      notFoundCount++;
      results.push({
        email: entry.email,
        contactId: '',
        updated: false,
        reason: 'no_crm_contact',
      });
      continue;
    }

    // Decide whether Gmail date is more recent than the stored last_contact_date
    const gmailDate = new Date(entry.lastEmailDate);
    const existingDate = contact.last_contact_date ? new Date(contact.last_contact_date) : null;
    const shouldUpdateDate = !existingDate || gmailDate > existingDate;

    const updatedMetadata: Record<string, unknown> = {
      ...(contact.metadata ?? {}),
      gmail_email_count: entry.totalEmails,
      gmail_last_subject: entry.lastSubject ?? null,
      gmail_synced_at: new Date().toISOString(),
    };

    const patch: Record<string, unknown> = {
      metadata: updatedMetadata,
      updated_at: new Date().toISOString(),
    };

    if (shouldUpdateDate) {
      patch.last_contact_date = gmailDate.toISOString();
    }

    const { error: updateError } = await supabase
      .from('crm_contacts')
      .update(patch)
      .eq('id', contact.id);

    if (updateError) {
      console.error(`[Gmail Sync] Update error for ${entry.email}:`, updateError.message);
      results.push({
        email: entry.email,
        contactId: contact.id,
        updated: false,
        reason: `update_error: ${updateError.message}`,
      });
      skippedCount++;
      continue;
    }

    updatedCount++;
    results.push({
      email: entry.email,
      contactId: contact.id,
      updated: true,
      reason: shouldUpdateDate ? 'date_and_metadata_updated' : 'metadata_only_updated',
    });
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    summary: {
      received: entries.length,
      updated: updatedCount,
      skipped: skippedCount,
      not_found: notFoundCount,
    },
    results,
  });
}
