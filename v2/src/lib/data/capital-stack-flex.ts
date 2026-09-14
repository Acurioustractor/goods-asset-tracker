/**
 * What each funder covers, what breaks if one drops out, and what any amount of money buys.
 *
 * Ben, 11 September 2026: build a model that scales up and down depending on who else we need and
 * which funds are missing.
 *
 * The applications in flight are not interchangeable. QBE buys plants. Every other grant buys beds,
 * 133 at $750 (Ben, 15 September 2026): Tim Fairfax, Brian M. Davis and Snow. Nobody is asked for
 * the running cost; the contribution inside each bed carries it. SEFA lends, which is a different
 * instrument with a repayment test attached. Treating them as one pool is what produced the double
 * count corrected on 11 September, so this module keeps the job on every dollar.
 *
 * Two things it is built to answer quickly:
 *   1. If a funder says no, what exactly stops.
 *   2. If a new funder appears with $X, what can they buy that nobody else is buying.
 */

import {
  BED_PRICE_AUD, BED_MAKE_AUD, BED_FREIGHT_AUD, FACILITATION_PER_BED_AUD, BEDS_AT_COST_AUD,
  BEDS_YEAR_ONE, BEDS_TO_FIND, CONTRIBUTION_AUD, ORGANISATION_NEED_AUD, GRANT_LOT_AUD, BEDS_A_GRANT,
  OONCHIUMPA_BUILD_STATUS,
} from './the-year-and-the-raise';
import { BREAK_EVEN_BEDS, PLANT_MATURE_BEDS } from './three-year-plan';

export const READ_AT = '2026-09-15';

const aud = (n: number) => Math.round(n).toLocaleString('en-AU');

// ---------------------------------------------------------------------------
// What the year costs
// ---------------------------------------------------------------------------

export type Job = 'plant' | 'beds' | 'facilitation' | 'operating';

export interface Need {
  readonly job: Job;
  /** The source jobs that land on this line. Facilitation lands on the organisation. */
  readonly covers: readonly Job[];
  readonly what: string;
  readonly amountAud: number;
  /** The smallest thing a funder can buy on this line, and what it costs. */
  readonly unit: string;
  readonly unitAud: number;
  readonly ifUnfunded: string;
}

/**
 * Three jobs, not four. Ben, 15 September 2026: the organisation absorbs freight and facilitation
 * at $100 a bed each out of its share of the $750, so both sit on the organisation line and a
 * funder is never asked for a freight or facilitation line. Nobody is asked for the organisation
 * line at all; it is carried by the contribution inside every bed that is bought.
 */
export const NEEDS: readonly Need[] = [
  {
    job: 'plant',
    covers: ['plant'],
    what: 'Two community plants',
    amountAud: 300_000,
    unit: 'one plant',
    unitAud: 150_000,
    ifUnfunded:
      'No community makes its own beds this year. Witta keeps making them and the ownership pathway stalls, which is the whole point of the model.',
  },
  {
    job: 'beds',
    covers: ['beds'],
    what: `Making ${BEDS_YEAR_ONE} beds of first stock`,
    amountAud: BEDS_AT_COST_AUD,
    unit: 'one bed',
    unitAud: BED_PRICE_AUD,
    ifUnfunded:
      `Community enterprises have nothing to sell. Each bed is bought at the published $${BED_PRICE_AUD}, of which $${aud(BED_MAKE_AUD)} makes it, $${BED_FREIGHT_AUD} moves it, $${aud(FACILITATION_PER_BED_AUD)} pays the facilitation around it and $${aud(CONTRIBUTION_AUD)} carries the organisation.`,
  },
  {
    job: 'operating',
    covers: ['operating', 'facilitation'],
    what: 'The organisation: running it, and the freight and facilitation it absorbs',
    amountAud: ORGANISATION_NEED_AUD,
    unit: 'a month of the organisation',
    unitAud: Math.round(ORGANISATION_NEED_AUD / 12),
    ifUnfunded:
      `Carried by trade. ${BREAK_EVEN_BEDS} paid beds a year covers the running cost entirely, and the year plans ${BEDS_YEAR_ONE}, so the shortfall is the distance between those two numbers. Freight and facilitation come out of the bed before it reaches the organisation.`,
  },
];

export const YEAR_COST_AUD = NEEDS.reduce((n, x) => n + x.amountAud, 0);

// ---------------------------------------------------------------------------
// Who is asked, and what each one is for
// ---------------------------------------------------------------------------

export type Instrument = 'grant' | 'loan' | 'government';
export type Stage = 'approved' | 'offered' | 'likely' | 'invited' | 'applying' | 'not-sent' | 'no-ask-yet';

export interface Source {
  readonly id: string;
  readonly funder: string;
  readonly amountAud: number;
  readonly job: Job;
  readonly instrument: Instrument;
  readonly stage: Stage;
  /** Counted in the $600,000 asked. Government plant money and untouched conversations are not. */
  readonly inTheRaise: boolean;
  readonly note: string;
}

export const SOURCES: readonly Source[] = [
  {
    id: 'qbe',
    funder: 'QBE Foundation, Stage 2',
    amountAud: 300_000,
    job: 'plant',
    instrument: 'grant',
    stage: 'applying',
    inTheRaise: true,
    note: 'Closes 25 September at noon. Allocated to two plants and to nothing else.',
  },
  {
    id: 'tfff',
    funder: 'Tim Fairfax Family Foundation',
    amountAud: 100_000,
    job: 'beds',
    instrument: 'grant',
    stage: 'invited',
    inTheRaise: true,
    note: `Year one of $300,000 over three years. Ben, 15 September 2026: it buys ${BEDS_A_GRANT} beds at $${BED_PRICE_AUD}. Katie Norman's form is General Operating Support, so the answer says what the beds hand the organisation. SmartyGrants closes 9 October.`,
  },
  {
    id: 'bmd-beds',
    funder: 'Brian M. Davis Charitable Foundation',
    amountAud: GRANT_LOT_AUD,
    job: 'beds',
    instrument: 'grant',
    stage: 'invited',
    inTheRaise: true,
    note: `${BEDS_A_GRANT} beds at the published price, facilitation inside, one budget line. Due 25 September, board 19 November.`,
  },
  {
    id: 'snow',
    funder: 'Snow Foundation',
    amountAud: 100_000,
    job: 'beds',
    instrument: 'grant',
    stage: 'not-sent',
    inTheRaise: true,
    note: '133 beds. One page would send it and it has not been written until today.',
  },
  {
    id: 'real',
    funder: 'DEWR REAL Innovation Fund, to Oonchiumpa',
    amountAud: 1_695_000,
    job: 'plant',
    instrument: 'government',
    stage: 'offered',
    inTheRaise: false,
    note: `Oonchiumpa's offer, four years, agreement not executed, no cash. A Curious Tractor is the consortium member. Never counted; disclosed. ${OONCHIUMPA_BUILD_STATUS}.`,
  },
  {
    id: 'sefa',
    funder: 'SEFA, Backing the Bold',
    amountAud: 0,
    job: 'beds',
    instrument: 'loan',
    stage: 'no-ask-yet',
    inTheRaise: false,
    note: '$50,000 to $200,000 of debt for impact-led organisations with traction, Queensland focused. Joel Bird, 21 August. Debt needs a repayment source and an entity, and both are open.',
  },
];

export const ASKED_AUD = SOURCES.filter((s) => s.inTheRaise).reduce((n, s) => n + s.amountAud, 0);
export const SECURED_AUD = 0;
export const GAP_AUD = YEAR_COST_AUD - ASKED_AUD;

// ---------------------------------------------------------------------------
// What breaks if one drops
// ---------------------------------------------------------------------------

/** What is asked against a need line. A source job that lands on the line counts for it. */
export function coveredFor(job: Job, without: readonly string[] = []): number {
  const covers = NEEDS.find((n) => n.job === job)?.covers ?? [job];
  return SOURCES.filter((s) => s.inTheRaise && covers.includes(s.job) && !without.includes(s.id))
    .reduce((n, s) => n + s.amountAud, 0);
}

export function gapWithout(ids: readonly string[]): number {
  const asked = SOURCES.filter((s) => s.inTheRaise && !ids.includes(s.id))
    .reduce((n, s) => n + s.amountAud, 0);
  return YEAR_COST_AUD - asked;
}

/** Every line's shortfall, as things stand. */
export function shortfalls(without: readonly string[] = []) {
  return NEEDS.map((n) => ({
    job: n.job,
    what: n.what,
    needed: n.amountAud,
    covered: coveredFor(n.job, without),
    short: Math.max(0, n.amountAud - coveredFor(n.job, without)),
  }));
}

/**
 * Bed money is asked at the sale price and the bed cost line is the making cost, so the beds line
 * is deliberately over-covered and the surplus is what carries the organisation. This is the
 * contribution doing its job, and it is the relationship the first version of the year model lost.
 */
export function bedSurplusAud(without: readonly string[] = []): number {
  const need = NEEDS.find((n) => n.job === 'beds')!.amountAud;
  return Math.max(0, coveredFor('beds', without) - need);
}

/**
 * What the organisation line is short: running, freight and facilitation less the operating and
 * facilitation asks.
 *
 * It was a literal inside the sentence below and nowhere else, so nothing tested it and the wiki
 * had to cite the module by hand. Derived here and given a canon key, because it is half of the
 * only explanation of the gap that reads from the other end.
 */
export const OPERATING_SHORTFALL_AUD =
  NEEDS.find((n) => n.job === 'operating')!.amountAud - coveredFor('operating');

export const SURPLUS_EXPLAINS_THE_GAP =
  `Beds are bought at $${BED_PRICE_AUD} and cost $${aud(BED_MAKE_AUD)} to make, so $${aud(coveredFor('beds'))} of bed money over-covers the $${aud(BEDS_AT_COST_AUD)} making line by $${aud(bedSurplusAud())}. The organisation line, running plus the freight and facilitation it absorbs, is short $${aud(OPERATING_SHORTFALL_AUD)}. The difference between those two is the $${aud(GAP_AUD)} gap, and it is the same arithmetic seen from the other end.`;

export const PLANT_MONEY_IS_DIFFERENT =
  'A plant costs $150,000 and a plant grant brings $150,000, so plant money never leaves a hole and never fills one. Adding a plant adds a cost and a source in the same breath. The gap only moves when new plant money lands on a plant somebody else was already funding.';

// ---------------------------------------------------------------------------
// What any amount buys, for a funder we have not met
// ---------------------------------------------------------------------------

export interface Rung {
  readonly aud: number;
  readonly buys: string;
  readonly andThen: string;
}

export const LADDER: readonly Rung[] = [
  { aud: BED_PRICE_AUD, buys: 'One bed', andThen: `One household off the floor, freight and facilitation paid, and $${aud(CONTRIBUTION_AUD)} toward the organisation that makes the next one.` },
  { aud: 7_500, buys: 'Ten beds', andThen: 'Twenty hours of paid making, and 200 kg of plastic kept out of landfill. Facilitation and freight are inside the price.' },
  { aud: 75_000, buys: 'A hundred beds, one community pool', andThen: 'A community enterprise with stock to sell and $75,000 of local capital when it does.' },
  { aud: GRANT_LOT_AUD, buys: `${BEDS_A_GRANT} beds, the standard grant lot`, andThen: `What every grant funder except QBE is asked for. Ben, 15 September 2026. Hands the organisation $${aud(BEDS_A_GRANT * CONTRIBUTION_AUD)} once the beds are made and moved.` },
  { aud: 150_000, buys: 'One community plant', andThen: '200 beds in its first year, reaching 720 on the same press, and a local crew that owns the making.' },
  { aud: 300_000, buys: 'Two plants', andThen: 'What QBE is being asked for, and the year in which two communities start making beds themselves.' },
];

export function whatBuys(aud: number): Rung {
  const afford = LADDER.filter((r) => r.aud <= aud);
  return afford.length ? afford[afford.length - 1] : LADDER[0];
}

export const THE_SCALE =
  'Every rung is a real unit with a real price, so a funder at any size has something specific to buy. Nothing on this ladder is a share of a total.';

// ---------------------------------------------------------------------------
// Where the rest could come from
// ---------------------------------------------------------------------------

export const IF_THE_GAP_STAYS: readonly string[] = [
  `Trade. ${BREAK_EVEN_BEDS} paid beds a year covers the organisation with no grant at all, and the year plans ${BEDS_YEAR_ONE}. The distance between those numbers is the operating shortfall.`,
  `SEFA Backing the Bold. $50,000 to $200,000 of debt, which suits yield improvements and working capital because both have a repayment source in the $${aud(CONTRIBUTION_AUD)} a bed. Blocked on the entity question Joel Bird raised on 21 August.`,
  'Dusseldorp Forum at $50,000 and Minderoo at $100,000, both figures we wrote. Neither funder has named one.',
  `Selling more beds. The gap is ${BEDS_TO_FIND} beds at the published price, and four organisations have already bought 320.`,
];

/** SEFA Backing the Bold lends $50,000 to $200,000. Joel Bird, 21 August 2026. Rate and term are not set. */
export const SEFA_LOAN_MIN_AUD = 50_000;
export const SEFA_LOAN_MAX_AUD = 200_000;
export const SEFA_LOAN_TERMS_STATUS = 'not set';

export const BEDS_TO_REPAY_200K = Math.ceil(SEFA_LOAN_MAX_AUD / CONTRIBUTION_AUD);

export const WHY_A_LOAN_IS_NOT_A_GRANT =
  `Debt has a repayment test that a grant does not. Joel Bird put it plainly: the question is whether the capital drives enough growth to repay it. At $${aud(CONTRIBUTION_AUD)} a bed, ${BEDS_TO_REPAY_200K} paid beds repay $200,000, which is inside one mature plant's ${PLANT_MATURE_BEDS} beds a year. What is not settled is which entity the revenue flows through, and that decides where the debt can sit.`;
