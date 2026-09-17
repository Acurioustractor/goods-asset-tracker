/**
 * The reply to somebody registering interest in a washing machine.
 *
 * Not one of Ben's seven branches. It arrives through the partner route rather than the contact
 * form, and until now it fell through to the generic letter, which promises a reply within two
 * business days about a product that is not for sale.
 *
 * What the machine is, said plainly, because the honest version is more interesting than a
 * marketing one: Pakkimjalki Kari, named in Warumungu by Elder Dianne Stokes, built on a Speed
 * Queen base, prototype stage, already in several communities. Register interest only.
 *
 * The promise matches the one the form already makes on screen: we will be in touch when it is
 * ready, or sooner if we have questions about their community. Nothing here says a date, because
 * nobody has set one.
 */

import { COMMS, buildEmail, type BuiltEmail } from './facts';
import type { ReplyContext } from './replies';

export function buildWasherReply(ctx: ReplyContext): BuiltEmail {
  const place = ctx.organisation?.trim();

  return buildEmail('Pakkimjalki Kari, and where it is up to', [
    'Thanks for registering interest.',
    'Pakkimjalki Kari was named in Warumungu by Elder Dianne Stokes. It is built on a Speed Queen base and it is still a prototype: there are machines in several communities now and we are learning from every one of them.',
    'That means it is not for sale yet, and this list is how you hear first when it is.',
    place
      ? `In the meantime, if there is something specific about ${place} we should know, reply and tell me. Where the machines go and how they get looked after is the part we get wrong without local help.`
      : 'In the meantime, if there is something specific about your community we should know, reply and tell me. Where the machines go and how they get looked after is the part we get wrong without local help.',
    `If you would rather talk, ring Ben on ${COMMS.phone}.`,
    COMMS.signOff,
  ]);
}
