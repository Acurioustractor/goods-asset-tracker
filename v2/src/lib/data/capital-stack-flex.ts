/**
 * What each funder covers, what breaks if one drops out, and what any amount of money buys.
 *
 * Ben, 11 September 2026: build a model that scales up and down depending on who else we need and
 * which funds are missing.
 *
 * Four applications are in flight and they are not interchangeable. QBE buys plants. Tim Fairfax
 * buys the organisation. Brian M. Davis buys beds and facilitation. SEFA lends, which is a
 * different instrument with a repayment test attached. Treating them as one pool is what produced
 * the double count corrected earlier today, so this module keeps the job on every dollar.
 *
 * Two things it is built to answer quickly:
 *   1. If a funder says no, what exactly stops.
 *   2. If a new funder appears with $X, what can they buy that nobody else is buying.
 */

// the-year-and-the-raise imports nothing, so there is no cycle here.
import { BED_PRICE_AUD, BED_MAKE_AUD } from './the-year-and-the-raise';

export const READ_AT = '2026-09-11';

// ---------------------------------------------------------------------------
// What the year costs
// ---------------------------------------------------------------------------

export type Job = 'plant' | 'beds' | 'facilitation' | 'operating';

export interface Need {
  readonly job: Job;
  readonly what: string;
  readonly amountAud: number;
  /** The smallest thing a funder can buy on this line, and what it costs. */
  readonly unit: string;
  readonly unitAud: number;
  readonly ifUnfunded: string;
}

export const NEEDS: readonly Need[] = [
  {
    job: 'plant',
    what: 'Two community plants',
    amountAud: 300_000,
    unit: 'one plant',
    unitAud: 150_000,
    ifUnfunded:
      'No community makes its own beds this year. Witta keeps making them and the ownership pathway stalls, which is the whole point of the model.',
  },
  {
    job: 'beds',
    what: 'Making 400 beds of first stock',
    amountAud: 110_400,
    unit: 'one bed',
    unitAud: 750,
    ifUnfunded:
      'Community enterprises have nothing to sell. Each bed is bought at the published $750, of which $276 makes it and $474 carries the organisation.',
  },
  {
    job: 'facilitation',
    what: 'Facilitation in four communities',
    amountAud: 40_000,
    unit: 'one community',
    unitAud: 10_000,
    ifUnfunded:
      'Beds arrive without the trips, build days, training and delivery around them. $50,000 has already been billed and paid at this rate, so it is a proven number.',
  },
  {
    job: 'operating',
    what: 'Running the organisation',
    amountAud: 297_550,
    unit: 'a month of the organisation',
    unitAud: 24_796,
    ifUnfunded:
      'Carried by trade. 628 paid beds a year covers it entirely, and the year plans 400, so the shortfall is the distance between those two numbers.',
  },
];

export const YEAR_COST_AUD = NEEDS.reduce((n, x) => n + x.amountAud, 0);

// ---------------------------------------------------------------------------
// Who is asked, and what each one is for
// ---------------------------------------------------------------------------

export type Instrument = 'grant' | 'loan' | 'government';
export type Stage = 'approved' | 'likely' | 'invited' | 'applying' | 'not-sent' | 'no-ask-yet';

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
    job: 'operating',
    instrument: 'grant',
    stage: 'invited',
    inTheRaise: true,
    note: 'Year one of $300,000 over three years. Katie Norman names the resilience of organisations, so it sits here alone. SmartyGrants closes 9 October.',
  },
  {
    id: 'bmd-beds',
    funder: 'Brian M. Davis Charitable Foundation',
    amountAud: 60_000,
    job: 'beds',
    instrument: 'grant',
    stage: 'invited',
    inTheRaise: true,
    note: '80 beds at the published price. Due 25 September, board 19 November.',
  },
  {
    id: 'bmd-facilitation',
    funder: 'Brian M. Davis Charitable Foundation',
    amountAud: 40_000,
    job: 'facilitation',
    instrument: 'grant',
    stage: 'invited',
    inTheRaise: true,
    note: 'The other half of the same $100,000 invitation.',
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
    id: 'alice',
    funder: 'Commonwealth, through Oonchiumpa',
    amountAud: 150_000,
    job: 'plant',
    instrument: 'government',
    stage: 'approved',
    inTheRaise: false,
    note: 'Approved and ready for the Alice Springs facility. A third site, outside the QBE request.',
  },
  {
    id: 'second-commonwealth',
    funder: 'Commonwealth, second facility',
    amountAud: 150_000,
    job: 'plant',
    instrument: 'government',
    stage: 'likely',
    inTheRaise: false,
    note: 'Ben judges it highly likely. The site is unnamed, and naming it is the single most valuable answer available.',
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

export function coveredFor(job: Job, without: readonly string[] = []): number {
  return SOURCES.filter((s) => s.inTheRaise && s.job === job && !without.includes(s.id))
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
 * Bed money is asked at the $750 sale price and the bed cost line is the $276 of making, so the
 * beds line is deliberately over-covered and the surplus is what carries the organisation. This is
 * the $474 doing its job, and it is the relationship the first version of the year model lost.
 */
export function bedSurplusAud(without: readonly string[] = []): number {
  const need = NEEDS.find((n) => n.job === 'beds')!.amountAud;
  return Math.max(0, coveredFor('beds', without) - need);
}

/**
 * What the operating line is short.
 *
 * It was a literal inside the sentence below and nowhere else, so nothing tested it and the wiki
 * had to cite the module by hand. Derived here and given a canon key, because it is half of the
 * only explanation of the gap that reads from the other end.
 */
export const OPERATING_SHORTFALL_AUD =
  NEEDS.find((n) => n.job === 'operating')!.amountAud - coveredFor('operating');

export const SURPLUS_EXPLAINS_THE_GAP =
  `Beds are bought at $${BED_PRICE_AUD} and cost $${BED_MAKE_AUD} to make, so $160,000 of bed money over-covers the $110,400 making line by $${bedSurplusAud().toLocaleString('en-AU')}. The operating line is short $${OPERATING_SHORTFALL_AUD.toLocaleString('en-AU')}. The difference between those two is the $${GAP_AUD.toLocaleString('en-AU')} gap, and it is the same arithmetic seen from the other end.`;

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
  { aud: 750, buys: 'One bed', andThen: 'One household off the floor, and $474 toward the organisation that makes the next one.' },
  { aud: 7_500, buys: 'Ten beds', andThen: 'Twenty hours of paid making, and 200 kg of plastic kept out of landfill.' },
  { aud: 10_000, buys: 'Facilitation in one community', andThen: 'The trips, the build days, the training and the delivery. Already proven at this rate on a paid invoice.' },
  { aud: 22_500, buys: 'The second press', andThen: 'Forty more kits a month, from 96 to 136. Assembly is no longer the ceiling because it happens in community, so the router becomes the constraint at 8.56 kits a day.' },
  { aud: 75_000, buys: 'A hundred beds, one community pool', andThen: 'A community enterprise with stock to sell and $75,000 of local capital when it does.' },
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
  'Trade. 628 paid beds a year covers the organisation with no grant at all, and the year plans 400. The distance between those numbers is the operating shortfall.',
  'SEFA Backing the Bold. $50,000 to $200,000 of debt, which suits the second press and working capital because both have a repayment source in the $474 a bed. Blocked on the entity question Joel Bird raised on 21 August.',
  'Dusseldorp Forum at $50,000 and Minderoo at $100,000, both figures we wrote. Neither funder has named one.',
  'Selling more beds. The gap is 187 beds at the published price, and four organisations have already bought 320.',
];

export const WHY_A_LOAN_IS_NOT_A_GRANT =
  'Debt has a repayment test that a grant does not. Joel Bird put it plainly: the question is whether the capital drives enough growth to repay it. At $474 a bed, 101 paid beds a year services $200,000, which is inside one plant\'s output. What is not settled is which entity the revenue flows through, and that decides where the debt can sit.';
