/**
 * Which reply a person gets, and the one place that decides.
 *
 * The contact form takes seven subjects and every one of them gets the same letter: the published
 * "Goods Inquiry → Acknowledge" workflow, which fires on the `project-goods` tag and says somebody
 * will get back to you within a couple of business days. Ben wrote seven branch messages on
 * 17 September to replace it. They are being switched on one at a time, watching a week of real
 * enquiries between each, because seven new emails published at once is seven untested emails in
 * front of funders and communities.
 *
 * ── The invariant this file exists to own ───────────────────────────────────
 * A person gets ONE reply. If we have written a branch for their subject, we send it and we do
 * NOT stamp `project-goods`, so the generic letter does not also arrive. If we have not, we stamp
 * the tag and the generic letter is what they get, which is better than silence.
 *
 * Doing that decision in the route is how a person ends up with two emails that contradict each
 * other. So the route does not decide: it calls `acknowledgeOrReply` and the exclusivity is
 * structural. Adding branch three is one entry in REPLY_BUILDERS.
 */

import { ghl } from '@/lib/ghl';
import { buildBulkOrderReply } from './bulk-order-reply';
import { buildMediaPackReply } from './media-pack-reply';
import { buildCapitalReply } from './capital-reply';

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

/** What a builder is given. Everything the contact form knows. */
export interface ReplyContext {
  name?: string;
  organisation?: string;
  message?: string;
}

/**
 * Contact-form subject to the reply we have written for it. A subject that is not here falls
 * through to the generic acknowledgement on purpose, and that is the rollout plan rather than a
 * gap: support and bulk order first, watch a week, then the rest.
 */
export const REPLY_BUILDERS: Record<string, (ctx: ReplyContext) => BuiltEmail> = {
  'Bulk Order Inquiry': buildBulkOrderReply,
  'Media Pack Request': buildMediaPackReply,
  'Facility Funding Inquiry': buildCapitalReply,
};

export type ReplyOutcome = 'replied' | 'acknowledged' | 'failed';

/**
 * Send the branch reply for this subject, or stamp the tag that fires the generic one. Never both.
 *
 * Returns what happened so the route can log it. It never throws: an enquiry that is already
 * recorded and already on a board must not fail because an email did.
 */
export async function acknowledgeOrReply(opts: {
  contactId: string;
  subject: string;
  context?: ReplyContext;
}): Promise<ReplyOutcome> {
  const builder = REPLY_BUILDERS[opts.subject];

  if (!builder) {
    try {
      await ghl.addTags(opts.contactId, ['project-goods']);
      return 'acknowledged';
    } catch (error) {
      console.error('[Replies] Could not stamp the acknowledgement tag:', error);
      return 'failed';
    }
  }

  try {
    const email = builder(opts.context || {});
    const sent = await ghl.sendTransactionalReply({
      contactId: opts.contactId,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    if (sent.skipped === 'suppressed') {
      console.warn(`[Replies] ${opts.subject}: contact is suppressed, nothing sent`);
      return 'replied';
    }
    if (!sent.success) {
      console.error(`[Replies] ${opts.subject}: reply failed: ${sent.error}`);
      return 'failed';
    }
    return 'replied';
  } catch (error) {
    console.error('[Replies] Could not send the branch reply:', error);
    return 'failed';
  }
}

/** The subjects that have their own written reply. Used by the guards and by /admin/campaign. */
export function subjectsWithOwnReply(): string[] {
  return Object.keys(REPLY_BUILDERS);
}
