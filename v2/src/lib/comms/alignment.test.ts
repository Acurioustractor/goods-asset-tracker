import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { MESSAGE_CATALOGUE, BUILDER_NAMES } from './catalogue';
import { COMMS, KNOWN_ENTITIES } from './facts';

/**
 * One person can receive several of these over a month: a quote, then an order confirmation, then
 * a support reply. They should read as though the same organisation wrote all of them, because it
 * did.
 *
 * Every check here is something that has already gone wrong somewhere, or that would be invisible
 * until a person pointed it out: two phone numbers, two response times, two names for the entity
 * that invoices, an unsubscribe link on a receipt, a sign off that drifts.
 *
 * The facts live in ./facts and the messages compose from them, so most of this cannot break by
 * accident any more. The guard is for the day somebody types one out by hand.
 */

const COMMS_DIR = __dirname;

/** Phone numbers in any of the shapes an Australian mobile gets written in. */
const PHONE_SHAPES = /\b(?:\+?61\s?4|04)\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/g;

const AI_VOCAB = [
  'delve',
  'crucial',
  'pivotal',
  'seamless',
  'robust',
  'comprehensive',
  'nuanced',
  'holistic',
  'leverage',
  'stakeholder',
  'we are thrilled',
  'we are excited',
  'reach out',
  'touch base',
  'circle back',
  'at your earliest convenience',
];

/** Other ways of saying the response window. One phrasing everywhere, or it reads as two promises. */
const RIVAL_WINDOWS = [
  '48 hours',
  '24 hours',
  'two days',
  '2 business days',
  'couple of business days',
  'few days',
  'asap',
];

describe('every message sounds like the same organisation', () => {
  for (const entry of MESSAGE_CATALOGUE) {
    describe(entry.label, () => {
      const { text, html, subject } = entry.example;

      it('signs off the one way', () => {
        expect(
          text.trimEnd().endsWith(COMMS.signOff),
          `${entry.id} ends "${text.trimEnd().slice(-40)}" instead of the shared sign off`,
        ).toBe(true);
      });

      it('uses no phone number but ours', () => {
        const found = [...text.matchAll(PHONE_SHAPES)].map((m) => m[0]);
        for (const number of found) {
          expect(
            number.replace(/[\s-]/g, ''),
            `${entry.id} carries ${number}, which is not the number in facts.ts`,
          ).toBe(COMMS.phone.replace(/[\s-]/g, ''));
        }
      });

      it('states the response window one way', () => {
        const lower = text.toLowerCase();
        for (const rival of RIVAL_WINDOWS) {
          expect(
            lower.includes(rival),
            `${entry.id} says "${rival}". Every message says "${COMMS.replyWindow}" or says nothing.`,
          ).toBe(false);
        }
      });

      it('names no entity we have not heard of', () => {
        // Take the known names out first, then anything still ending in Ltd is a second name for
        // something that already has one. Matching entity names directly is how you end up
        // asserting on "Orders are invoiced by A Curious Tractor Pty Ltd".
        let remaining = text;
        for (const known of KNOWN_ENTITIES) remaining = remaining.split(known).join('');
        const leftovers = [...remaining.matchAll(/\b[A-Za-z'][A-Za-z' ]{2,40}?(?:Pty Ltd|Ltd)\b/g)].map(
          (m) => m[0].trim(),
        );
        expect(
          leftovers,
          `${entry.id} names an entity that is not ${KNOWN_ENTITIES.join(' or ')}.`,
        ).toEqual([]);
      });

      it('carries no unsubscribe, because none of these is a campaign', () => {
        expect(text.toLowerCase()).not.toContain('unsubscribe');
        expect(html.toLowerCase()).not.toContain('unsubscribe');
      });

      it('has no em-dash and no AI vocabulary', () => {
        expect(text).not.toContain('—');
        const lower = text.toLowerCase();
        const found = AI_VOCAB.filter((word) => lower.includes(word));
        expect(found, `${entry.id} carries ${found.join(', ')}`).toEqual([]);
      });

      it('has a subject that says what it is about', () => {
        expect(subject.length).toBeGreaterThan(8);
        expect(
          /thank you for (your )?(enquiry|inquiry|email|message)/i.test(subject),
          `${entry.id} has a subject nobody can find again in a mailbox`,
        ).toBe(false);
      });

      it('says the same thing in both bodies', () => {
        const stripped = html
          .replace(/<br\/>/g, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
        for (const paragraph of text.split('\n\n')) {
          const firstLine = paragraph.split('\n')[0].trim();
          if (firstLine.length < 12) continue;
          expect(
            stripped.includes(firstLine),
            `${entry.id}: "${firstLine.slice(0, 40)}..." is in the text body and not in the HTML one`,
          ).toBe(true);
        }
      });
    });
  }
});

describe('the catalogue is the whole of it', () => {
  it('has an entry for every message builder in this folder', () => {
    const exported = fs
      .readdirSync(COMMS_DIR)
      .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
      .flatMap((f) => {
        const src = fs.readFileSync(path.join(COMMS_DIR, f), 'utf8');
        return [...src.matchAll(/export function (build[A-Za-z]+)\(/g)].map((m) => m[1]);
      })
      .filter((name) => name !== 'buildEmail');

    for (const name of exported) {
      expect(
        BUILDER_NAMES as readonly string[],
        `${name} builds a message that nothing in the catalogue renders, so no guard reads it and ` +
          'nobody can see it on the page. Add it to catalogue.ts.',
      ).toContain(name);
    }
  });

  it('renders every entry from a real example, never a placeholder', () => {
    for (const entry of MESSAGE_CATALOGUE) {
      expect(entry.example.text).not.toMatch(/lorem|placeholder|TODO|xxx/i);
      expect(entry.example.text.length).toBeGreaterThan(100);
    }
  });

  it('keeps ids unique', () => {
    const ids = MESSAGE_CATALOGUE.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
