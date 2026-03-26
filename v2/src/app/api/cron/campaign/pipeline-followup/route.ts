import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';
import { sendEmail, followupEmail, staleReEngagementEmail } from '@/lib/email/send';
import {
  FOLLOWUP_RULES,
  STALE_THRESHOLD_DAYS,
  MAX_AUTO_FOLLOWUPS,
  type PipelineStage,
} from '@/lib/campaign/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/**
 * Pipeline Followup Cron — runs weekly (Wednesdays)
 *
 * Auto-sends follow-up emails based on pipeline stage and time:
 * - contacted: 7 days → follow up
 * - proposal_sent: 14 days → follow up
 * - in_discussion: 14 days → follow up
 * - Any stage 30+ days inactive → mark stale, send re-engagement
 *
 * Max 3 auto follow-ups per contact, then escalates.
 * Max 1 follow-up per contact per week.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const now = new Date();
  const results = {
    follow_ups_sent: 0,
    marked_stale: 0,
    escalations: 0,
    skipped: 0,
    errors: 0,
    details: [] as string[],
  };

  try {
    // Fetch contacts — pipeline_stage stored in metadata JSONB
    const { data: contacts } = await supabase
      .from('crm_contacts')
      .select('id, email, name, last_contact_date, relationship_status, metadata')
      .not('email', 'is', null)
      .in('relationship_status', ['prospect', 'active']);

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({
        success: true,
        timestamp: now.toISOString(),
        message: 'No pipeline contacts to follow up',
        ...results,
      });
    }

    for (const contact of contacts) {
      const meta = (contact.metadata || {}) as Record<string, unknown>;
      const stage = meta.pipeline_stage as PipelineStage | undefined;
      if (!contact.email || !stage) continue;

      const lastContacted = contact.last_contact_date ? new Date(contact.last_contact_date) : null;
      const daysSinceContact = lastContacted
        ? Math.floor((now.getTime() - lastContacted.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      const followupsSent = (meta.auto_followups_sent as number) || 0;

      // Skip if we sent a follow-up in the last 7 days
      if (daysSinceContact < 7) {
        results.skipped++;
        continue;
      }

      // ── Check for stale (30+ days) ──
      if (daysSinceContact >= STALE_THRESHOLD_DAYS && stage !== 'stale' && stage !== 'active' && stage !== 'committed') {
        // Mark as stale in metadata
        await supabase
          .from('crm_contacts')
          .update({
            metadata: { ...meta, pipeline_stage: 'stale' },
            updated_at: now.toISOString(),
          })
          .eq('id', contact.id);

        // Send re-engagement email
        const template = staleReEngagementEmail(contact.name || '');
        const emailResult = await sendEmail({
          ...template,
          to: contact.email,
        });

        if (emailResult.success) {
          results.marked_stale++;
          results.details.push(`Marked stale + re-engaged: ${contact.name || contact.email}`);
        } else {
          results.errors++;
        }

        // Update last_contact_date
        await supabase
          .from('crm_contacts')
          .update({ last_contact_date: now.toISOString() })
          .eq('id', contact.id);

        continue;
      }

      // ── Check follow-up rules ──
      const followupDays = FOLLOWUP_RULES[stage];
      if (!followupDays || daysSinceContact < followupDays) {
        results.skipped++;
        continue;
      }

      // Max auto follow-ups reached → escalate
      if (followupsSent >= MAX_AUTO_FOLLOWUPS) {
        results.escalations++;
        results.details.push(`Escalation needed: ${contact.name || contact.email} (${followupsSent} follow-ups sent)`);
        continue;
      }

      // ── Send follow-up ──
      const template = followupEmail(contact.name || '', stage);
      const emailResult = await sendEmail({
        ...template,
        to: contact.email,
      });

      if (emailResult.success) {
        results.follow_ups_sent++;
        results.details.push(`Follow-up sent: ${contact.name || contact.email} (stage: ${stage}, day ${daysSinceContact})`);

        // Update contact record
        await supabase
          .from('crm_contacts')
          .update({
            last_contact_date: now.toISOString(),
            metadata: { ...meta, auto_followups_sent: followupsSent + 1 },
          })
          .eq('id', contact.id);
      } else {
        results.errors++;
        results.details.push(`Email failed: ${contact.email} — ${emailResult.error}`);
      }

      // Rate limit between emails
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      total_pipeline_contacts: contacts.length,
      ...results,
    });
  } catch (error) {
    console.error('[Pipeline Followup] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Followup failed' },
      { status: 500 },
    );
  }
}
