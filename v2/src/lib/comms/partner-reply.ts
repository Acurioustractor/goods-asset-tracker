/**
 * The reply to the broad partnership enquiry.
 *
 * Branch 6 of seven, and the hardest to write because the word does four jobs. A community
 * deciding what gets made and who gets paid, an organisation selling beds into its own place,
 * somebody putting capital behind a facility, and a supplier who can move plastic, steel or
 * canvas all arrive through the same button. Guessing which one a person meant produces a
 * confident answer to a question they did not ask.
 *
 * So it does not guess. It names the four, asks which is closest, and promises the right
 * information rather than a general answer. That is the honest version of a broad door, and the
 * reply that comes back is what routes them to the correct lane.
 */

import { COMMS, buildEmail, type BuiltEmail } from './facts';
import type { ReplyContext } from './replies';

export function buildPartnerReply(_ctx: ReplyContext): BuiltEmail {
  return buildEmail('We have got your message', [
    'Thanks for writing.',
    'Partnership means a few things here: a community deciding what gets made and who gets paid, an organisation selling beds into its own place, someone putting capital behind a facility, or a supplier who can move plastic, steel or canvas.',
    `Reply with which one is closest and I will come back within ${COMMS.replyWindow} with the right information instead of a general answer. If it is easier to talk than type, say so and we will ring you.`,
    COMMS.signOff,
  ]);
}
