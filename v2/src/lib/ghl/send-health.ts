/**
 * Is anybody actually being answered.
 *
 * Two questions, two sources, one screen.
 *
 * 1. WHAT GHL IS DOING. A workflow that sits in draft looks exactly like a working one from
 *    everywhere except the workflow list. New Order Notification was a draft from February to
 *    September while people paid on the site and heard nothing, and the only way to find that
 *    out was to open GHL and look. This reads the live list instead, so a draft that matters is
 *    a red line on a page rather than something somebody eventually notices.
 *
 * 2. WHAT REACHED A HUMAN. `contact_submissions` is the only record that knows whether BOTH
 *    halves of a submission worked: the CRM write and the email to the team. GHL knows about its
 *    own sends and nothing about ours; our logs know about ours and nothing about GHL's. This
 *    table is where the two meet, and it is what caught a row that had been retrying against
 *    GHL every ten minutes for a week.
 *
 * Read-only. Nothing here writes anywhere.
 */

import { ghl } from './index';
import { createServiceClient } from '@/lib/supabase/server';

/**
 * The workflows Goods depends on, and what goes silent when one is a draft.
 * Matched on name, because the ids change when a workflow is rebuilt and the name is what
 * somebody sees in the dashboard.
 */
export const WATCHED_WORKFLOWS: { name: string; does: string; ifDraft: string }[] = [
  {
    name: 'Goods Inquiry → Acknowledge',
    does: 'Replies to everybody who fills in a form, one minute after the tag lands.',
    ifDraft: 'Every enquiry through every door goes unanswered.',
  },
  {
    name: 'New Order Notification',
    does: 'Was meant to confirm an order.',
    ifDraft:
      'Nothing, any more. The confirmation is sent from the webhook now, so this one can stay off or be deleted.',
  },
  {
    name: 'Goods media form submission',
    does: 'Was meant to send a journalist the media pack.',
    ifDraft: 'A journalist asks for a link and gets the generic reply instead.',
  },
  {
    name: 'Newsletter Signup',
    does: 'The welcome for somebody who has just subscribed.',
    ifDraft: 'Five forms across the site capture consent and the person never hears anything.',
  },
  {
    name: 'ACT Core — Newsletter Signup',
    does: 'The ACT-wide version of the same thing.',
    ifDraft: 'Same silence, from the other direction.',
  },
];

export interface WorkflowHealth {
  name: string;
  does: string;
  ifDraft: string;
  /** 'published', 'draft', or 'missing' when no workflow of that name exists any more. */
  status: string;
}

export interface InboundHealth {
  /** Submissions in the window. */
  total: number;
  /** Reached both the CRM and the team inbox. */
  clean: number;
  /** Still pending or failed on either side, which means the cron is still retrying them. */
  unresolved: number;
  /** The oldest unresolved one, which is the one that has been retrying longest. */
  oldestUnresolved: { kind: string; subject: string; created_at: string } | null;
  byKind: { kind: string; count: number }[];
  windowDays: number;
}

export async function readWorkflowHealth(): Promise<WorkflowHealth[]> {
  const live = await ghl.listWorkflows();
  const byName = new Map(live.map((w) => [w.name, w.status]));
  return WATCHED_WORKFLOWS.map((w) => ({ ...w, status: byName.get(w.name) ?? 'missing' }));
}

export async function readInboundHealth(windowDays = 30): Promise<InboundHealth> {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
  const empty: InboundHealth = {
    total: 0,
    clean: 0,
    unresolved: 0,
    oldestUnresolved: null,
    byKind: [],
    windowDays,
  };

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('kind, subject, inbox_status, ghl_status, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: true });
    if (error || !data) return empty;

    const unresolvedRows = data.filter(
      (r) =>
        r.inbox_status === 'pending' ||
        r.inbox_status === 'failed' ||
        r.ghl_status === 'pending' ||
        r.ghl_status === 'failed',
    );
    const counts = new Map<string, number>();
    for (const row of data) counts.set(row.kind, (counts.get(row.kind) || 0) + 1);

    return {
      total: data.length,
      clean: data.length - unresolvedRows.length,
      unresolved: unresolvedRows.length,
      oldestUnresolved: unresolvedRows[0]
        ? {
            kind: unresolvedRows[0].kind,
            subject: unresolvedRows[0].subject,
            created_at: unresolvedRows[0].created_at,
          }
        : null,
      byKind: [...counts.entries()]
        .map(([kind, count]) => ({ kind, count }))
        .sort((a, b) => b.count - a.count),
      windowDays,
    };
  } catch {
    return empty;
  }
}
