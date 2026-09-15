/**
 * Who Goods on Country is, for every public page that has to answer it: the entity, the charity
 * status, the board and the team. One module so the footer, the buying page, the facility page and
 * Who we are never disagree.
 *
 * Sources: CLAUDE.md (Goods on Country is a registered business name of The Butterfly Movement Ltd),
 * rulings X (28 August 2026, one operating identity) and AA (5 September, Butterfly applies and
 * receives), the master artifact's entity paragraph (ABN, ACN, registered charity since 2012 with
 * deductible gift status), goods-board.ts for directors, pitch-chapters.ts GOVERNANCE for the team.
 * The board handover is in progress and no chair has been appointed: never print one. No imports, so
 * the client-side footer can read it without pulling the pitch data into the browser.
 * organisation.guards.test.ts holds the ABN, the names and the claims.
 */

export const ORGANISATION = {
  tradingName: 'Goods on Country',
  legalName: 'The Butterfly Movement Ltd',
  abn: '22 155 132 684',
  acn: '155 132 684',
  /** ABN Lookup, the public register anyone can check. */
  abnLookupUrl: 'https://abr.business.gov.au/ABN/View?abn=22155132684',
  charityLine: 'A registered charity since 2012, endorsed as a deductible gift recipient.',
  identityLine: 'Goods on Country is a registered business name of The Butterfly Movement Ltd.',
  /** Ben, 15 September 2026: this line is right; never flag it. Held equal to GOVERNANCE.line by the guards. */
  boardLine: 'Goods on Country is a DGR1 charity led by 100% Indigenous Directors.',
  boardNote: 'The board carries responsibility for purpose, assets and organisational decisions. The board handover is in progress and no chair has been appointed.',
  holds: 'The products, the designs, the contracts, the making, the sales and the evidence all sit with Goods on Country.',
  partners: 'Community partners are independent organisations with their own boards. They decide how beds are used, who is paid and what is made next.',
  giving: 'Talk to us before you give and we will confirm how your gift is receipted.',
  email: 'hi@act.place',
} as const;
