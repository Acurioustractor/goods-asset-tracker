/**
 * The footer logo rows are a claim about money, so they are tested like one.
 *
 * On 2026-09-16 Centrecorp Foundation was sitting in the footer's "Backed by"
 * row on every public page. Centrecorp has never given Goods a grant. They are a
 * customer: 107 beds on INV-0291. Nothing caught it because a logo array is
 * prose as far as the compiler is concerned.
 *
 * "Backed by" is read by funders as the philanthropic base. Padding it with a
 * buyer inflates that base and, worse, tells anyone who knows the difference
 * that we do not. So the rule is now mechanical: a logo may appear under
 * "Backed by" only if that funder has a line in grants-received.ts, which is
 * itself tied to the books.
 */

import { describe, it, expect } from 'vitest';
import { backedByPartners, buyerPartners } from '@/components/layout/site-footer';
import { GRANTS_RECEIVED } from '@/lib/data/grants-received';

/** "Vincent Fairfax Family Foundation with FRRR, Backing the Future" -> matches "FRRR". */
const grantorText = GRANTS_RECEIVED.map((g) => g.funder.toLowerCase()).join(' | ');

describe('footer partner rows', () => {
  it('every "Backed by" logo is a funder with a line in the books', () => {
    const notFunders = backedByPartners
      .filter((p) => !grantorText.includes(p.name.toLowerCase().replace(/^the /, '')))
      .map((p) => p.name);

    expect(
      notFunders,
      'a logo is in the "Backed by" row with no matching line in grants-received.ts. Either they gave money and the grant line is missing, or they did not and the logo belongs in another row.',
    ).toEqual([]);
  });

  it('no organisation is shown as both a backer and a buyer', () => {
    const backers = new Set(backedByPartners.map((p) => p.name.toLowerCase()));
    const both = buyerPartners.map((p) => p.name).filter((n) => backers.has(n.toLowerCase()));

    expect(both, 'an organisation appears in two footer rows at once').toEqual([]);
  });

  it('Centrecorp is a buyer, not a backer', () => {
    // Pinned by name because this specific error already shipped once and read as
    // philanthropy on every page of the site for months.
    expect(backedByPartners.map((p) => p.name)).not.toContain('Centrecorp Foundation');
    expect(buyerPartners.map((p) => p.name)).toContain('Centrecorp Foundation');
  });
});
