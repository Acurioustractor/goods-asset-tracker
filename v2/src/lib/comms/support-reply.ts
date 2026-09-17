/**
 * The reply to somebody whose bed or washing machine has gone wrong.
 *
 * This is the one lane where the person already owns a Goods product, and until 17 September a
 * support ticket produced a Supabase row and nothing else. Then it got the generic
 * acknowledgement, which says somebody will get back to you within a couple of business days.
 * That is the wrong sentence for a bed that is not safe to sleep on tonight.
 *
 * Ben wrote this copy on 17 September. Two changes from the draft: it names the asset when we
 * have it on the register, because a person who reports a fault wants to know we found their
 * bed, and it leads with the phone when the ticket is urgent.
 *
 * The person is on the community line, so this is a class-2 service message: about a thing they
 * hold, in reply to something they did. It carries no unsubscribe and joins no list.
 */

import { COMMS, buildEmail, type BuiltEmail } from './facts';

export interface SupportReplyInput {
  /** The asset they reported, e.g. GB0-156-40. */
  assetId: string;
  /** What the register says it is, when the register knows. */
  product?: string | null;
  community?: string | null;
  /** Low, Medium, High, Urgent. */
  priority: string;
  name?: string;
}

function isUrgent(priority: string): boolean {
  return /^(high|urgent)$/i.test(priority.trim());
}

export function buildSupportReply(input: SupportReplyInput): BuiltEmail {
  const urgent = isUrgent(input.priority);
  const whatWeHave = input.product
    ? `We have ${input.assetId} on the register as a ${input.product.toLowerCase()}${
        input.community ? ` at ${input.community}` : ''
      }.`
    : `We have ${input.assetId} on the record.`;
  const next = `Here is what happens next. We check it against its record, work out whether it needs a part, a repair or a replacement, and come back to you within ${COMMS.replyWindow} with which one it is and when.`;

  const paragraphs = urgent
    ? [
        'Thanks for telling us.',
        `You marked this urgent, so ring Ben on ${COMMS.phone} rather than waiting on email.`,
        whatWeHave,
        next,
        COMMS.signOff,
      ]
    : [
        'Thanks for telling us.',
        whatWeHave,
        next,
        `If it is not safe to use right now, ring Ben on ${COMMS.phone} and do not wait for the email.`,
        COMMS.signOff,
      ];

  return buildEmail(`${input.assetId}, and what happens now`, paragraphs);
}
