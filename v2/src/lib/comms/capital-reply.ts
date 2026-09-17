/**
 * The reply to somebody asking about putting capital behind a facility.
 *
 * Branch 3 of seven, and the one with the most at stake in a single email. The generic
 * acknowledgement that went to funders until now carries the marketing unsubscribe footer, so a
 * funder who clicked it stopped receiving Goods email entirely and nothing recorded that it had
 * happened. A transactional reply sent from the route has no footer, which removes that risk
 * from the one lane where it was most expensive.
 *
 * Two things the copy holds on purpose.
 *
 * A facility is described as a plant in a community that presses beds, employs local people and
 * moves toward that community owning it. Ownership is a pathway here, never a completed claim,
 * and the wording says "moves toward" for that reason.
 *
 * Both kinds of capital are named, grant and recoverable, because the raise is genuinely open to
 * both and a funder who can only do one should not have to guess which one we want.
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

export function buildCapitalReply(_ctx: ReplyContext): BuiltEmail {
  const paragraphs = [
    'Thanks for writing.',
    'A facility is a plant in a community that presses beds from recycled plastic, employs local people, and moves toward that community owning it. Capital comes in as a grant or as something recoverable, and both are real conversations here.',
    'Within two business days I will send you the numbers: what a facility costs to stand up, what it produces, and what the community ends up holding. If you would rather talk it through than read it, say so and we will find a time this week.',
    'Ben\nGoods on Country',
  ];

  return {
    subject: 'Backing a facility',
    html: toHtml(paragraphs),
    text: paragraphs.join('\n\n'),
  };
}
