/**
 * THE MONTH-6 OWNERSHIP TEST - the mechanism that makes "ownership is a pathway"
 * capable of failing.
 *
 * The north star (ruling E) is a community that can collect the plastic, make the goods, and
 * come to own the making. The standing ceiling (STRATEGY §7) is that ownership is a pathway,
 * never claimed complete. Until this file existed, nothing in the system could say whether that
 * pathway had moved at any site. An unfalsifiable claim at the centre of a pitch is precisely
 * what a good funder finds, so the claim needed a test that can return NO.
 *
 * ---------------------------------------------------------------------------
 * PROVENANCE
 * ---------------------------------------------------------------------------
 * The test originates in the JusticeHub handover checkpoints, cited as
 * `JusticeHub/output/goods-on-country/community-ownership-checkpoints.md` in the ACT infra repo.
 * THAT FILE NO LONGER EXISTS AT THAT PATH and no renamed copy was found (searched 2026-07-26).
 *
 * The only surviving statement is metric 11 and its callout in
 * `wiki/outputs/2026-05-29-goods-theory-of-change-and-mel.md`:
 *
 *   "At each production site we test four things at month 6, where partial counts as NO:
 *    (1) the community holds the keys to the factory; (2) a named community lead is on payroll;
 *    (3) a community-controlled entity invoices the buyer directly; (4) at least 50% of
 *    production is community-controlled."
 *
 * ---------------------------------------------------------------------------
 * WHAT WAS KEPT, AND WHY IT IS THE WHOLE VALUE
 * ---------------------------------------------------------------------------
 * Binary, per site, and partial counts as NO. Every soft ownership metric drifts into a story
 * about progress. A checkpoint that fails when it is nearly met is the only kind that keeps an
 * organisation honest about a handover it has not completed. Do not add a "partial" result.
 *
 * ---------------------------------------------------------------------------
 * WHAT CHANGED, AND WHICH RULING FORCED IT (Ben, 2026-07-26)
 * ---------------------------------------------------------------------------
 * 1. "Keys to the factory" became keys to THE EQUIPMENT AND THE PLACE IT SITS. Ruling D says the
 *    object is infrastructure, not a plant, and of four live pathways only Oonchiumpa wants a
 *    whole facility. Under the old wording Utopia could never pass, not because ownership had
 *    failed but because there is no factory. The test would have scored which module a community
 *    bought from us rather than whether they own it.
 *
 * 2. The stated purpose changed. The old callout justified the test as proof that "our job is to
 *    become unnecessary", which is RETIRED (ruling A). After a handover Goods still has a job:
 *    design, quality, training, equipment, working capital, back office. The test proves the
 *    pathway MOVED. It does not prove Goods disappeared, and must never be captioned as if it did.
 *
 * 3. The clock was undefined ("month 6" from what), which made the test unfailable and therefore
 *    pointless. It is now SIX MONTHS FROM THE START OF DELIVER at that site, because that is the
 *    first moment there is anything to own.
 *
 * 4. Checkpoint 4 was "at least 50% of production is community-controlled". Replaced by DECISION.
 *    Two reasons. It could not be scored (50% of volume, of process steps, of hours?), and a
 *    second 50-percent in a system that already carries the 51% First Nations supplier-ownership
 *    test is exactly how a wrong sentence reaches a funder document. Those tests sit at different
 *    levels and must never be conflated: see `FIFTY_ONE_PERCENT_IS_A_DIFFERENT_TEST` below.
 *    The production share is still worth reporting. It is not a checkpoint.
 *
 * 5. Data and story sovereignty became THE GATE THE TEST SITS BEHIND rather than a fifth
 *    checkpoint, which also settles one of the four homeless items in STRATEGY §9 (sovereignty as
 *    a gate things pass through, not a metric counted at the end). Five would have broken a test
 *    known as four.
 *
 * 6. "Production site" means PRODUCTION FOR SALE ONLY. Assembly of delivered beds in community is
 *    not production for sale. If assembly counted, several sites would become eligible at once and
 *    the test would get much weaker for free, which is the failure mode this whole file exists to
 *    prevent.
 *
 * ---------------------------------------------------------------------------
 * THE CONSEQUENCE, WHICH IS THE USEFUL PART
 * ---------------------------------------------------------------------------
 * The MEL table records the test as "not yet met at any site". Applied with the eligibility rule
 * that is wrong, and wrong in a way that sounds worse than the truth. NO SITE IS YET ELIGIBLE.
 * "Not yet met" sounds like four failures. "Not yet eligible" is accurate, and it dates the
 * claim: Oonchiumpa is the first site that will be testable, and month 6 of its Deliver is the
 * first date this pitch can be checked against.
 *
 * Invariants are enforced in `ownership-test.guards.test.ts`.
 */

import { COMMUNITY_PATHWAYS } from './community-pathways';

// ---------------------------------------------------------------------------
// The four checkpoints
// ---------------------------------------------------------------------------

export type CheckpointId = 'keys' | 'payroll' | 'invoice' | 'decision';

export interface CheckpointDef {
  id: CheckpointId;
  label: string;
  /** The condition, written so it scores the same for one shredder or a full facility. */
  passesWhen: string;
  /** What this checkpoint is actually protecting against. */
  why: string;
}

export const OWNERSHIP_CHECKPOINTS: CheckpointDef[] = [
  {
    id: 'keys',
    label: 'Keys',
    passesWhen:
      'The community controls physical access to the equipment and to the place it sits.',
    why: 'Access is the most basic form of control and the easiest to quietly retain.',
  },
  {
    id: 'payroll',
    label: 'Payroll',
    passesWhen:
      'A named community person is paid to run it, and the payer is named.',
    why: 'An unpaid local champion is not a transfer. Naming the payer closes the ambiguity in the original wording.',
  },
  {
    id: 'invoice',
    label: 'Invoice',
    passesWhen:
      'A community-controlled entity invoices the buyer directly for what the site produces.',
    why: 'Revenue is where ownership stops being symbolic. This is the seller-of-record question, live and untested at Oonchiumpa.',
  },
  {
    id: 'decision',
    label: 'Decision',
    passesWhen:
      'The community decides what gets made, when, and who works on it, without needing Goods to agree.',
    why: 'Replaces an unscoreable production percentage. Control of production is really control of the decisions about it.',
  },
];

/** Four of four is a pass. There is deliberately no partial state. */
export const SCORING_RULE =
  'Four of four is a pass. Anything else is a fail, recorded with which checkpoints passed.';

/** The clock, previously undefined, which is what made the test unfailable. */
export const CLOCK_RULE =
  'Six months from the start of Deliver at that site.';

/** What makes a site a production site at all. Ruled 2026-07-26. */
export const PRODUCTION_SITE_RULE =
  'Production for sale only. Assembly of delivered beds in community is not production for sale.';

/**
 * The gate the whole test sits behind, rather than a fifth checkpoint.
 * Also settles the homeless "data sovereignty as a gate" item in STRATEGY §9.
 */
export const SOVEREIGNTY_GATE =
  'The community controls what is published about this site.';

/**
 * Guard against the single most expensive confusion available in this system.
 * Quoted wherever both numbers could appear on one surface.
 */
export const FIFTY_ONE_PERCENT_IS_A_DIFFERENT_TEST =
  'This test scores a site. The 51% First Nations ownership test scores the supplier entity, which is the company, and is what Supply Nation, IPP, IBA and First Australians Capital assess. Passing one says nothing about the other.';

// ---------------------------------------------------------------------------
// Per-site state
// ---------------------------------------------------------------------------

export type CheckpointResult = 'pass' | 'fail' | 'not-assessed';

export type SiteTestState =
  /** Has not entered Deliver as a production site, so cannot be tested yet. */
  | 'not-eligible'
  /** Eligible, but the six months are not up. */
  | 'awaiting-month-6'
  | 'pass'
  | 'fail';

export interface SiteOwnershipTest {
  /** Matches an id in COMMUNITY_PATHWAYS. */
  pathwayId: string;
  siteName: string;
  /**
   * ISO date the site started Deliver as a production site, or null if it has not.
   * Null is the reason every site currently reads not-eligible, and it is the honest answer.
   */
  deliverStartedOn: string | null;
  /** Whether this site produces for sale, per PRODUCTION_SITE_RULE. */
  producesForSale: boolean;
  results: Record<CheckpointId, CheckpointResult>;
  /** Why this site sits where it does, in one line. */
  note: string;
}

const NONE_ASSESSED: Record<CheckpointId, CheckpointResult> = {
  keys: 'not-assessed',
  payroll: 'not-assessed',
  invoice: 'not-assessed',
  decision: 'not-assessed',
};

/**
 * Every live pathway, in stage order. All four are pre-Deliver as at 2026-07-26, so all four are
 * not-eligible. That is the finding, not a gap in the data.
 */
export const SITE_OWNERSHIP_TESTS: SiteOwnershipTest[] = [
  {
    pathwayId: 'oonchiumpa',
    siteName: 'Oonchiumpa',
    deliverStartedOn: null,
    producesForSale: false,
    results: { ...NONE_ASSESSED },
    note: 'At Resource. The first site that will be testable, and the only one that wants a complete facility. Checkpoint 3 is an unmade decision here, not a measurement: the seller-of-record direction has not been put to Oonchiumpa.',
  },
  {
    pathwayId: 'utopia',
    siteName: 'Utopia Homelands',
    deliverStartedOn: null,
    producesForSale: false,
    results: { ...NONE_ASSESSED },
    note: 'At Shape. A shredder module, not a facility, which is the case that broke the original checkpoint 1.',
  },
  {
    pathwayId: 'tennant-creek',
    siteName: 'Tennant Creek',
    deliverStartedOn: null,
    producesForSale: false,
    results: { ...NONE_ASSESSED },
    note: 'At Yarn, reconfirming. Blocked on the partner, not on numbers.',
  },
  {
    pathwayId: 'maningrida',
    siteName: 'Maningrida',
    deliverStartedOn: null,
    producesForSale: false,
    results: { ...NONE_ASSESSED },
    note: 'At Grow, reviewing. The biggest delivery in the register, but community assembly of delivered beds is not production for sale (PRODUCTION_SITE_RULE), so the site is not eligible and the honest state is not-eligible, not fail.',
  },
  {
    pathwayId: 'palm-island',
    siteName: 'Palm Island',
    deliverStartedOn: null,
    producesForSale: false,
    results: { ...NONE_ASSESSED },
    note: 'At Yarn, not yet begun. No capability audit has been done.',
  },
];

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

/**
 * Pure month arithmetic on an ISO date, so results never depend on when this runs.
 *
 * Clamps to the end of the target month rather than overflowing: Deliver starting 31 August
 * falls due 28 February, not 3 March. Naive Date arithmetic overflows here, and a due date that
 * drifts a few days is the kind of small wrongness nobody checks.
 */
export function addMonths(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const targetMonth = m - 1 + months;
  const lastDayOfTarget = new Date(Date.UTC(y, targetMonth + 1, 0)).getUTCDate();
  const day = Math.min(d, lastDayOfTarget);
  return new Date(Date.UTC(y, targetMonth, day)).toISOString().slice(0, 10);
}

/** A site can only be tested once it has entered Deliver AND produces for sale. */
export function isEligible(site: SiteOwnershipTest): boolean {
  return site.deliverStartedOn !== null && site.producesForSale;
}

/** The date the test falls due, or null if the site is not eligible. */
export function testDueOn(site: SiteOwnershipTest): string | null {
  if (!isEligible(site) || site.deliverStartedOn === null) return null;
  return addMonths(site.deliverStartedOn, 6);
}

/**
 * The result. `asOf` is an explicit ISO date rather than the clock, so that every surface and
 * every test asks the same question and gets the same answer.
 */
export function siteTestState(site: SiteOwnershipTest, asOf: string): SiteTestState {
  const due = testDueOn(site);
  if (due === null) return 'not-eligible';
  if (asOf < due) return 'awaiting-month-6';
  const allPass = OWNERSHIP_CHECKPOINTS.every((c) => site.results[c.id] === 'pass');
  return allPass ? 'pass' : 'fail';
}

/** Which checkpoints passed. The record that makes a fail useful rather than just a no. */
export function passedCheckpoints(site: SiteOwnershipTest): CheckpointId[] {
  return OWNERSHIP_CHECKPOINTS.filter((c) => site.results[c.id] === 'pass').map((c) => c.id);
}

export function eligibleSites(): SiteOwnershipTest[] {
  return SITE_OWNERSHIP_TESTS.filter(isEligible);
}

/**
 * The sanctioned public sentence about ownership, derived rather than written.
 *
 * No surface should state the ownership claim without calling this, which is the point of the
 * file: the claim and its evidence cannot drift apart if the claim is computed from the evidence.
 */
export function ownershipClaimLine(asOf: string): string {
  const eligible = eligibleSites();
  if (eligible.length === 0) {
    return 'No site is yet eligible for the month-6 ownership test. Ownership is a pathway and no site has entered Deliver as a production site.';
  }
  const passed = eligible.filter((s) => siteTestState(s, asOf) === 'pass');
  if (passed.length === 0) {
    return `${eligible.length} site${eligible.length === 1 ? '' : 's'} eligible for the month-6 ownership test. None has passed all four checkpoints.`;
  }
  return `${passed.length} of ${eligible.length} eligible site${eligible.length === 1 ? '' : 's'} has passed all four month-6 ownership checkpoints.`;
}

/** Cross-check: every site record points at a real pathway. Enforced in the guards test. */
export function orphanedSiteIds(): string[] {
  const known = new Set(COMMUNITY_PATHWAYS.map((p) => p.id));
  return SITE_OWNERSHIP_TESTS.map((s) => s.pathwayId).filter((id) => !known.has(id));
}
