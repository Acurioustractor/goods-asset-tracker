/**
 * The reply to somebody with a budget asking about beds.
 *
 * Ben wrote this on 17 September, branch 2 of seven. It does the thing the generic
 * acknowledgement cannot: it asks for the three numbers that unblock a quote, so the
 * acknowledgement becomes the first half of the real conversation instead of a receipt.
 *
 * Two facts in here are load bearing and neither is decoration.
 *
 * Freight quoted as one figure with the beds, because freight to a remote community moves the
 * price more than anything else and a quote that hides it is a quote that gets renegotiated.
 *
 * Who invoices. Orders are invoiced by A Curious Tractor Pty Ltd for now (Ben, 16 September),
 * and the charity is Goods on Country Ltd. A buyer who needs to pay a DGR for a grant or a
 * donation has to know that before they raise a purchase order, not after.
 */

import { COMMS, buildEmail, type BuiltEmail } from './facts';
import type { ReplyContext } from './replies';

export function buildBulkOrderReply(ctx: ReplyContext): BuiltEmail {
  const subject = ctx.organisation?.trim()
    ? `${ctx.organisation.trim()}, and what we need to quote your beds`
    : 'Your bed order, and what we need to quote it';

  return buildEmail(subject, [
    'Thanks for getting in touch about beds.',
    'To give you a real number we need three things: how many, which community, and when you want them there. If you have those, reply with them and it speeds this up by days.',
    'Freight moves the price more than anything else, so we quote the beds and the freight to your place as one figure. No surprises at the end.',
    `I will come back within ${COMMS.replyWindow} with that quote. Orders are invoiced by ${COMMS.invoicingEntity}. If you need the charity instead, for a donation or a grant, that is ${COMMS.charity} and I will point you the right way.`,
    COMMS.signOff,
  ]);
}
