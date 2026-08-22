import { createServiceClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/send';
import { ghl } from '@/lib/ghl';

export type ContactSubmissionKind = 'contact' | 'partnership' | 'newsletter';

export type ContactSubmission = {
  kind: ContactSubmissionKind;
  email?: string;
  name?: string;
  subject: string;
  payload: Record<string, unknown>;
};

type Status = 'pending' | 'delivered' | 'failed' | 'disabled';

/**
 * Write before external calls. This is deliberately separate from the form
 * tables: it records every public route in the same recoverable queue.
 */
export async function recordContactSubmission(submission: ContactSubmission): Promise<string | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        kind: submission.kind,
        submitter_email: submission.email || null,
        submitter_name: submission.name || null,
        subject: submission.subject,
        payload: submission.payload,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data.id as string;
  } catch (error) {
    console.error('[Contact delivery] Could not persist submission:', error);
    return null;
  }
}

export async function updateContactSubmission(
  id: string | null,
  patch: { ghlStatus?: Status; inboxStatus?: Status; error?: string; delivered?: boolean },
) {
  if (!id) return;
  try {
    const supabase = createServiceClient();
    await supabase.from('contact_submissions').update({
      ...(patch.ghlStatus ? { ghl_status: patch.ghlStatus } : {}),
      ...(patch.inboxStatus ? { inbox_status: patch.inboxStatus } : {}),
      ...(patch.error ? { last_error: patch.error.slice(0, 2000) } : {}),
      last_attempt_at: new Date().toISOString(),
      ...(patch.delivered ? { delivered_at: new Date().toISOString() } : {}),
    }).eq('id', id);
  } catch (error) {
    console.error('[Contact delivery] Could not update submission:', error);
  }
}

function safeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

/** Independently puts the whole enquiry into the team inbox. */
export async function sendSubmissionToInbox(submission: ContactSubmission) {
  const lines = [
    `Type: ${submission.kind}`,
    `From: ${submission.name || 'Not provided'} <${submission.email || 'No email supplied'}>`,
    `Subject: ${submission.subject}`,
    '',
    safeText(submission.payload.message) || safeText(submission.payload.issueDescription) || 'No message supplied.',
  ];
  const optional = ['organisation', 'organizationName', 'contactPhone', 'phone', 'website', 'partnershipType'];
  for (const key of optional) {
    const value = safeText(submission.payload[key]);
    if (value) lines.push(`${key}: ${value}`);
  }
  const result = await sendEmail({
    to: process.env.CONTACT_INBOX_EMAIL || 'hi@act.place',
    subject: `[Goods website] ${submission.subject}`,
    body: lines.join('\n'),
    replyTo: submission.email || undefined,
  });
  return { success: result.success && !result.simulated, error: result.error || (result.simulated ? 'Email delivery is not configured' : undefined) };
}

export async function retryInboxDeliveries(limit = 50) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id, kind, submitter_email, submitter_name, subject, payload, inbox_status, ghl_status')
    .or('inbox_status.in.(pending,failed),ghl_status.in.(pending,failed)')
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;

  let delivered = 0;
  let failed = 0;
  let ghlDelivered = 0;
  for (const row of data || []) {
    const submission: ContactSubmission = {
      kind: row.kind as ContactSubmissionKind,
      email: row.submitter_email || undefined,
      name: row.submitter_name || undefined,
      subject: row.subject,
      payload: (row.payload || {}) as Record<string, unknown>,
    };
    let replayGhl = row.ghl_status === 'pending' || row.ghl_status === 'failed';
    let ghlError: string | undefined;
    if (replayGhl) {
      try {
        const replay = submission.kind === 'newsletter'
          ? await ghl.addToNewsletter({
              email: submission.email,
              phone: safeText(submission.payload.phone) || undefined,
              name: submission.name,
              tag: 'website-recovery',
              newsletterConsent: 'Yes',
            })
          : await ghl.createInquiryContact(
              submission.email || '',
              submission.name || undefined,
              ['goods-website-recovery', submission.kind === 'partnership' ? 'goods-partner-lead' : 'goods-inquiry'],
              { source: `Website recovery: ${submission.subject}`, message: safeText(submission.payload.message) },
            );
        replayGhl = !(replay.success && !replay.simulated && replay.contact?.id);
        ghlError = replay.error || (replay.simulated ? 'GoHighLevel delivery is not configured' : undefined);
      } catch (error) {
        ghlError = error instanceof Error ? error.message : 'Unknown GoHighLevel replay error';
      }
    }

    const result = row.inbox_status === 'delivered'
      ? { success: true, error: undefined }
      : await sendSubmissionToInbox(submission);
    await updateContactSubmission(row.id, {
      ghlStatus: replayGhl ? 'failed' : 'delivered',
      inboxStatus: result.success ? 'delivered' : 'failed',
      error: [ghlError, result.error].filter(Boolean).join(' | ') || undefined,
      delivered: result.success && !replayGhl,
    });
    if (!replayGhl) ghlDelivered++;
    if (result.success) delivered++; else failed++;
  }
  return { scanned: (data || []).length, delivered, failed, ghlDelivered };
}
