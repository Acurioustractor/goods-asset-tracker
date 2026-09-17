/**
 * The reply to a journalist who asked for the media pack.
 *
 * Branch 5 of seven, and the one where the generic letter was most obviously wrong: they asked
 * for a link and got "somebody will get back to you within a couple of business days". The GHL
 * workflow that was meant to send the pack has been a draft since February, and it triggers on
 * Contact Created, so a journalist already in the account would never have fired it anyway.
 *
 * Send the thing and get out of the way. No two day promise, because what they asked for is in
 * the email.
 *
 * The consent paragraph is not a formality. The photographs on /press are cleared for use and the
 * people in them consented to those specific images. Images elsewhere on the site are not covered
 * by that, and a journalist who pulls one from a story page is publishing a photograph of a person
 * who did not agree to it. Saying so in the email is cheaper than finding out afterwards.
 */

import type { BuiltEmail, ReplyContext } from './replies';

const PRESS_URL = 'https://www.goodsoncountry.com/press';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toHtml(paragraphs: string[]): string {
  return paragraphs
    .map((p) => {
      const safe = esc(p).replace(/\n/g, '<br/>');
      const linked = safe.replace(
        PRESS_URL,
        `<a href="${PRESS_URL}" style="color:#0f766e">${PRESS_URL}</a>`,
      );
      return `<p style="margin:0 0 16px;line-height:1.55">${linked}</p>`;
    })
    .join('');
}

export function buildMediaPackReply(_ctx: ReplyContext): BuiltEmail {
  const paragraphs = [
    'Thanks for getting in touch.',
    `Everything is here: ${PRESS_URL}`,
    'The photos on that page are cleared for use. The people in them consented to those specific images, so please use what is there rather than pulling images off the rest of the site.',
    'If you want to talk to someone in community rather than to me, tell me what the story is and I will ask. That is their call, and it takes a bit of time, so give me more than a day if you can.',
    'Ben\nGoods on Country',
  ];

  return {
    subject: 'The Goods media pack',
    html: toHtml(paragraphs),
    text: paragraphs.join('\n\n'),
  };
}
