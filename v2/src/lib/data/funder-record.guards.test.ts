/**
 * The record of who has funded Goods, guarded.
 *
 * `grants-received.ts` is tied to the books. Every other file that talks about
 * philanthropy is a copy, and on 2026-09-16 every copy had drifted:
 *
 *   - compendium.ts listed FRRR and Vincent Fairfax as two separate $50,000
 *     grants. They are ONE joint Backing the Future grant paid on INV-0253. The
 *     wiki warns about this double-count in five places; it was on the public
 *     /press page regardless.
 *   - The Funding Network read $130,000 in two files and "~$80K" in a third
 *     against $144,558 actually banked.
 *   - QBE Stage 1 read $10,000 against $50,000.
 *   - story-road.ts printed "about 89 per cent from grants and philanthropy"
 *     with no stated denominator, and grants received EXCEED the revenue figure
 *     printed beside it, so the ratio could not have been right.
 *
 * None of that was a typo. It is what happens when a reconciled figure gets a
 * second hand-kept home. The fix was to derive rather than retype; these tests
 * stop the retyping coming back.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { GRANTS_RECEIVED, GRANTS_RECEIVED_TOTAL_AUD, GRANTS_AWARDED_OUTSIDE_THESE_BOOKS } from '@/lib/data/grants-received';
import { PAID_INVOICE_NET_AUD } from '@/lib/data/paid-trade';
import { funding } from '@/lib/data/compendium';

const read = (rel: string) => readFileSync(join(process.cwd(), 'src/lib/data', rel), 'utf8');

/**
 * Comments and `note:` fields legitimately quote the superseded figures, because
 * that is how the next reader learns what was wrong. Only RENDERED strings count,
 * so strip both before scanning.
 */
const renderedOnly = (src: string) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((l) => !l.trimStart().startsWith('//'))
    .filter((l) => !/^\s*note:/.test(l))
    .join('\n');

describe('grants received', () => {
  it('ties to the 16 September 2026 reconciliation', () => {
    expect(GRANTS_RECEIVED_TOTAL_AUD).toBe(772_788);
    expect(GRANTS_RECEIVED).toHaveLength(7);
  });

  it('counts FRRR and Vincent Fairfax as one joint grant, never two', () => {
    const frrrLines = GRANTS_RECEIVED.filter((g) => /frrr|fairfax/i.test(g.funder));
    expect(
      frrrLines.map((g) => g.funder),
      'FRRR and VFFF are one joint $50,000 Backing the Future grant (INV-0253). Two lines is a $50,000 double-count.',
    ).toHaveLength(1);
    expect(frrrLines[0].amountAud).toBe(50_000);
  });
});

describe('grants awarded but outside these books', () => {
  it('is acknowledged, so the total is never mistaken for everything ever given', () => {
    // FRRR's Community Led Climate Solutions grant is awarded and paid and is in none of
    // the books this list is built from. While that is true the total is a total of THESE
    // books, and a surface that calls it "all philanthropy received" is overstating its
    // own precision. Emptying this array is the signal that it has been resolved.
    for (const g of GRANTS_AWARDED_OUTSIDE_THESE_BOOKS) {
      expect(g.funder).toBeTruthy();
      expect(g.whyOutside, `${g.funder}: say why it is outside, or move it into GRANTS_RECEIVED`).toBeTruthy();
    }
    // No line may be in both places at once.
    const inBooks = new Set(GRANTS_RECEIVED.map((g) => g.funder.toLowerCase()));
    for (const g of GRANTS_AWARDED_OUTSIDE_THESE_BOOKS) {
      expect(inBooks.has(g.funder.toLowerCase()), `${g.funder} is listed as both received and outside`).toBe(false);
    }
  });
});

describe('derived copies stay tied to the source', () => {
  it('the compendium funding list derives its received lines from the books', () => {
    const received = funding.filter((f) => f.status === 'received');
    expect(received).toHaveLength(GRANTS_RECEIVED.length);
    expect(received.reduce((n, f) => n + f.amount, 0)).toBe(GRANTS_RECEIVED_TOTAL_AUD);

    // The specific shape of the old bug: two rows summing to the one joint grant.
    const fairfaxish = received.filter((f) => /frrr|fairfax/i.test(f.source));
    expect(fairfaxish, 'the FRRR/VFFF double-count is back').toHaveLength(1);
  });

  it('no data file still states a superseded Funding Network figure', () => {
    const banked = GRANTS_RECEIVED.find((g) => /funding network/i.test(g.funder));
    expect(banked?.amountAud).toBe(144_558);

    const stale = /\$130,000|\$130K|~\$80K/;
    for (const file of ['compendium.ts', 'content.ts', 'story-road.ts']) {
      const hits = renderedOnly(read(file)).split('\n').filter((l) => stale.test(l));
      expect(hits, `${file} still prints a superseded Funding Network figure`).toEqual([]);
    }
  });
});

describe('the philanthropic share', () => {
  it('is about three quarters, and is derived rather than asserted', () => {
    const share = GRANTS_RECEIVED_TOTAL_AUD / (GRANTS_RECEIVED_TOTAL_AUD + PAID_INVOICE_NET_AUD);
    expect(share).toBeGreaterThan(0.74);
    expect(share).toBeLessThan(0.78);

    // The old claim, pinned so it cannot quietly return. If the share genuinely
    // becomes 89 per cent one day, the denominator has to be written down first.
    expect(Math.round(share * 100)).not.toBe(89);
  });

  it('the road no longer prints a percentage with no denominator', () => {
    const road = renderedOnly(read('story-road.ts'));
    const moneyStop = road.slice(road.indexOf("id: 'money'"), road.indexOf("id: 'closing'"));
    expect(
      /89 per cent|'89%'/.test(moneyStop),
      'the unsourced 89 per cent claim is back on the road',
    ).toBe(false);
  });
});
