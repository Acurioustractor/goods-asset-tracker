/**
 * Who Goods on Country is, for every public page that has to answer it: the entity, the charity
 * status, the board and the team. One module so the footer, the buying page, the facility page and
 * Who we are never disagree.
 *
 * Sources: ASIC's live register, read 19 September 2026 (the company is still THE BUTTERFLY MOVEMENT LTD;
 * Goods on Country is its registered business name from 23 July 2026; the change of company name the
 * board resolved on 12 September is not yet registered). Ben, 16 September 2026 (one entity), rulings X (28 August 2026, one operating identity) and AA (5 September, the
 * charity applies and receives), the master artifact's entity paragraph (ABN, ACN, registered charity since 2012 with
 * deductible gift status), goods-board.ts for directors, pitch-chapters.ts GOVERNANCE for the team.
 * The board handover is in progress and no chair has been appointed: never print one. No imports, so
 * the client-side footer can read it without pulling the pitch data into the browser.
 * organisation.guards.test.ts holds the ABN, the names and the claims.
 */

export const ORGANISATION = {
  tradingName: 'Goods on Country',
  /** The name on ASIC's register. Change to pendingName when ASIC registers it. */
  legalName: 'The Butterfly Movement Ltd',
  /** Resolved by the board 12 September 2026, not yet registered with ASIC. */
  pendingName: 'Goods on Country Ltd',
  abn: '22 155 132 684',
  acn: '155 132 684',
  /** ABN Lookup, the public register anyone can check. */
  abnLookupUrl: 'https://abr.business.gov.au/ABN/View?abn=22155132684',
  charityLine: 'A registered charity since 2012, endorsed as a deductible gift recipient.',
  identityLine: 'Goods on Country is the trading name of The Butterfly Movement Ltd, the registered charity. The change of company name to Goods on Country Ltd is being lodged.',
  /** Ben, 15 September 2026: this line is right; never flag it. Held equal to GOVERNANCE.line by the guards. */
  boardLine: 'Goods on Country is a DGR1 charity led by 100% Indigenous Directors.',
  boardNote: 'The board carries responsibility for purpose, assets and organisational decisions. The board handover is in progress and no chair has been appointed.',
  holds: 'The products, the designs, the contracts, the making and the evidence sit with Goods on Country.',
  /** Ben, 16 September 2026: sales can still go through A Curious Tractor Pty Ltd for now. /terms names it as the seller of record. */
  seller: 'Orders are invoiced by A Curious Tractor Pty Ltd for now.',
  partners: 'Community partners are independent organisations with their own boards. They decide how beds are used, who is paid and what is made next.',
  giving: 'Talk to us before you give and we will confirm how your gift is receipted.',
  /**
   * Ben, 16 September 2026: a working idea. The community organisations that take Goods beds or run
   * a production facility become members of the charity. Nothing has changed in the constitution or
   * the register of members, so every surface writes it as proposed (organisation.guards.test.ts).
   */
  membership: {
    status: 'proposed',
    title: 'Members of the charity, proposed',
    line: 'We are working on making the community organisations that take Goods beds or run a production facility members of Goods on Country, the charity.',
    why: "Members vote at the charity's general meetings, so the organisations holding the beds and running the facilities would have a say in how Goods on Country is run.",
    state: 'It is a working idea, being worked through with the board. Nothing has changed yet.',
    short: 'Proposed: members of the charity.',
  },
  email: 'hi@act.place',
} as const;
