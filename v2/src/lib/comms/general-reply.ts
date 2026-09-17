/**
 * The reply to everything else.
 *
 * Branch 7, the catch-all, and the shortest on purpose. We do not know what they want yet, so
 * anything longer would be filling space with guesses. Two facts and a way through: a person
 * reads it, an answer comes inside the window, and there is a number for anybody who cannot wait.
 *
 * This is the one that replaces the published generic letter for the subjects that have no branch
 * of their own. It says the same thing that letter tried to say, in half the words, without the
 * unsubscribe footer, and without "usually".
 */

import { COMMS, buildEmail, type BuiltEmail } from './facts';
import type { ReplyContext } from './replies';

export function buildGeneralReply(_ctx: ReplyContext): BuiltEmail {
  return buildEmail('We have got your message', [
    `Thanks for writing. I read these myself and will come back to you within ${COMMS.replyWindow}.`,
    `If it is urgent, ring Ben on ${COMMS.phone}.`,
    COMMS.signOff,
  ]);
}
