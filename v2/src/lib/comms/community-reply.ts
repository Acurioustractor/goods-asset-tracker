/**
 * The reply to somebody putting their community forward.
 *
 * Branch 4 of seven. It is the only one of the seven that promises a phone call, and that is
 * right: nothing gets made for a community until that community has decided it wants it, who gets
 * paid and what gets made next, and that is not a conversation to have over email.
 *
 * It is also the only one where the promise is a person's time rather than a document. A call
 * inside two business days is Ben's to keep, and an unkept call on this lane costs more than a
 * late quote does.
 *
 * ── The variant that the drafted copy did not have ──────────────────────────
 * The contact form does not require a phone number. Promising to ring somebody who never gave us
 * one is a promise that cannot be kept by anybody, so when there is no number the email asks for
 * it instead. Same commitment, honest about what we need to keep it.
 *
 * R9 note: pressing this button does not put anybody on the community line. `interest:community`
 * is an identity tag, `lane:community` is a relationship a human confirms, and a council officer
 * who clicks it should not be auto-laned. This reply is class 1: they wrote to us, an answer is
 * owed.
 */

import type { BuiltEmail, ReplyContext } from './replies';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toHtml(paragraphs: string[]): string {
  return paragraphs
    .map((p) => `<p style="margin:0 0 16px;line-height:1.55">${esc(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

export function buildCommunityReply(ctx: ReplyContext): BuiltEmail {
  const haveNumber = Boolean(ctx.phone && ctx.phone.trim().length >= 6);

  const paragraphs = [
    'Thanks for getting in touch.',
    'Nothing gets made for a community until that community has decided it wants it, who gets paid and what gets made next. So the first step is a conversation, and it happens on the phone rather than over email.',
    haveNumber
      ? 'I will ring you within two business days. If there is someone else who should be on that call, reply with their name and I will make sure they are.'
      : 'Reply with a number and a good time and I will ring you within two business days. If there is someone else who should be on that call, send their name too and I will make sure they are.',
    'Ben\nGoods on Country',
  ];

  return {
    subject: 'Thanks for putting your community forward',
    html: toHtml(paragraphs),
    text: paragraphs.join('\n\n'),
  };
}
