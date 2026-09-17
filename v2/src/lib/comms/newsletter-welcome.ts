/**
 * The welcome for somebody who has just subscribed.
 *
 * ── Why this one is not sent from code ──────────────────────────────────────
 * Every other message in this folder is transactional: a reply to something a person did. This
 * one is the first message of a list, which makes it a commercial electronic message under the
 * Spam Act, and those need a working unsubscribe. GHL adds and honours one; a send from our code
 * does not. So this copy exists to be pasted into the Newsletter Signup workflow in GHL, which
 * has been a draft since January while five forms across the site captured consent and sent
 * nothing back.
 *
 * It lives here rather than in a document so the alignment guard reads it with the rest: the same
 * sign off, the same phone number, no second name for an entity, no AI vocabulary. A message that
 * GHL sends should not be the one that sounds different.
 *
 * ── What it can honestly say ────────────────────────────────────────────────
 * Ben ruled on 17 September that the 164 people already on the list wait until there is something
 * worth sending. That ruling makes the welcome MORE necessary, not less: a person who ticks a box
 * and hears nothing for nine months assumes it did not work. This says plainly that it worked,
 * that it will be infrequent, and how to leave.
 */

import { COMMS, buildEmail, type BuiltEmail } from './facts';

export function buildNewsletterWelcome(): BuiltEmail {
  return buildEmail('You are on the Goods list', [
    'Thanks for putting your name down.',
    'You will not hear from us often. Goods sends something when there is a story worth your time: a bed arriving somewhere it was needed, a community deciding what gets made next, a plant coming on. Not a monthly update for the sake of one.',
    `When you do hear from us it will be from me, and you can reply to it. If you would rather not, there is an unsubscribe link at the bottom of every one, and it works. If something goes wrong with it, ring ${COMMS.phone}.`,
    COMMS.signOff,
  ]);
}
