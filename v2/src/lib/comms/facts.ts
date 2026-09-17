/**
 * The facts every message repeats, in one place, and the rendering every message shares.
 *
 * ── Why this exists ─────────────────────────────────────────────────────────
 * Six messages in and the phone number was written out four times, "two business days" four
 * times, the press URL twice, and the HTML escaper five times. None of that is a problem until
 * the day a number changes, and then it is six files and whichever one somebody forgets. It is
 * also how a person gets two emails from Goods that sign off differently, quote a different
 * response time, or name a different entity as the seller.
 *
 * So the messages compose from here. Change the phone number once. The guard beside the messages
 * then holds the alignment: every message signs off the same way, nobody writes a raw phone
 * number, and nobody invents a second name for an entity that already has one.
 *
 * ── What belongs here, and what does not ────────────────────────────────────
 * Facts a message states about Goods: how to reach us, how long we take, who invoices. Figures
 * that already live in canon are IMPORTED rather than repeated, so a message cannot drift from
 * the register: PLASTIC_KG_PER_BED comes from products.ts, which is the single source of truth
 * for specs.
 *
 * Judgements, tone and anything a person would argue about do not belong here. They belong in
 * the message, where they can be read in context.
 */

import { PLASTIC_KG_PER_BED } from '@/lib/data/products';

export const COMMS = {
  /** The number in every message. Guarded: no message may hard-code another one. */
  phone: '0422 883 943',
  /** Where replies land. Ben reads it. */
  replyTo: 'hi@act.place',
  /** How every message ends. One voice, one name. */
  signOff: 'Ben\nGoods on Country',
  /** The commitment. Said the same way everywhere, so it cannot be two days here and 48 hours there. */
  replyWindow: 'two business days',
  /**
   * Who invoices an order today (Ben, 16 September 2026). Gifts and loans go to the charity.
   * A buyer needs this before they raise a purchase order, not after.
   */
  invoicingEntity: 'A Curious Tractor Pty Ltd',
  /** The charity. DGR. Never described as a business name of anything else. */
  charity: 'Goods on Country Ltd',
  /** The media pack, and the only page whose photographs are cleared for outside use. */
  pressUrl: 'https://www.goodsoncountry.com/press',
  /** Imported from products.ts, never typed out. */
  plasticKgPerBed: PLASTIC_KG_PER_BED,
} as const;

/** Entity names a message is allowed to use. Anything else is a second name for something. */
export const KNOWN_ENTITIES = [COMMS.invoicingEntity, COMMS.charity] as const;

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Paragraphs to the HTML body of an email. Inline styles because email clients do not load a
 * stylesheet, and a bare URL becomes a link so a journalist does not have to copy and paste it.
 */
export function renderParagraphs(paragraphs: string[]): string {
  return paragraphs
    .map((p) => {
      const safe = escapeHtml(p).replace(/\n/g, '<br/>');
      const linked = safe.replace(
        /https:\/\/[^\s<]+/g,
        (url) => `<a href="${url}" style="color:#0f766e">${url}</a>`,
      );
      return `<p style="margin:0 0 16px;line-height:1.55">${linked}</p>`;
    })
    .join('');
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

/** Build both bodies from the same paragraphs, so the text and the HTML can never disagree. */
export function buildEmail(subject: string, paragraphs: string[]): BuiltEmail {
  return {
    subject,
    html: renderParagraphs(paragraphs),
    text: paragraphs.join('\n\n'),
  };
}
