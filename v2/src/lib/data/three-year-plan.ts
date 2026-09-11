/**
 * Three years of the organisation, for the Tim Fairfax application.
 *
 * Katie Norman's invitation names the resilience of organisations and offers $300,000 in three
 * equal payments. Nothing in the repo answered that, because every model here runs one year.
 * This is the three-year shape: what it costs to be Goods on Country, what trade carries, and
 * how a grant that steps down as trade steps up looks on paper.
 *
 * The spine is one arithmetic fact already locked: running the organisation costs $297,550 and
 * a bed hands back $474, so 628 paid beds a year carries the whole thing. Year one plans 400.
 * The three years are the distance between those two numbers.
 *
 * What is locked and what is a target
 *  - Running cost, bed price, make cost and contribution are canon and guarded elsewhere.
 *  - Capacity is the 80% availability ruling: current facility 1,152 kits a year, with bought legs and community assembly.
 *  - BED VOLUMES ARE TARGETS, NEVER FORECASTS. They are capacity-checked and nothing more.
 *    Every one carries `basis` saying which.
 */

import { factoryKitsAMonth } from './production-route';

export const READ_AT = '2026-09-12';

export const WHY_THIS_EXISTS =
  'Tim Fairfax invited a three-year application on 31 August 2026 and named the resilience of organisations as the reason. Every model in the repo runs one year, so there was nothing to answer it with.';

export const BED_PRICE_AUD = 750;
export const BED_MAKE_AUD = 276;
export const CONTRIBUTION_AUD = BED_PRICE_AUD - BED_MAKE_AUD;

export const RUNNING_YEAR_ONE_AUD = 297_550;

/** The number that decides everything. */
export const BREAK_EVEN_BEDS = Math.ceil(RUNNING_YEAR_ONE_AUD / CONTRIBUTION_AUD);

export const BREAK_EVEN_NOTE =
  'Running the organisation costs $297,550 and a bed hands back $474, so 628 paid beds a year carries it. This assumes the buyer pays freight, which every invoice so far has done. If Goods carries freight the contribution is $324 and the number is 918.';

// ---------------------------------------------------------------------------
// Capacity, so no target is written that cannot be made
// ---------------------------------------------------------------------------

export const WITTA_BEDS_A_YEAR = factoryKitsAMonth() * 12;
export const PLANT_FIRST_YEAR_BEDS = 200;
export const PLANT_MATURE_BEDS = 720;

export const CAPACITY_NOTE =
  'The current facility models 96 flat-packed kits a month, or 1,152 over twelve months: six tab sheets a day, one per kit, at 80% availability. Leg sheets are bought and young people assemble in community. This is capacity, not orders or measured output. Future-plant ramp assumptions remain separate.';

// ---------------------------------------------------------------------------
// The three years
// ---------------------------------------------------------------------------

export type Basis = 'locked' | 'target' | 'assumption';

export interface PlanYear {
  readonly id: 'fy27' | 'fy28' | 'fy29';
  readonly label: string;
  readonly story: string;
  /** Plants making beds during the year, Witta not counted. */
  readonly plants: number;
  readonly capacityBeds: number;
  readonly bedsSold: number;
  readonly bedsBasis: Basis;
  readonly facilitationCommunities: number;
  readonly runningAud: number;
  readonly runningBasis: Basis;
  readonly grantSoughtAud: number;
  readonly grantNote: string;
}

export const FACILITATION_PER_COMMUNITY_AUD = 10_000;

export const YEARS: readonly PlanYear[] = [
  {
    id: 'fy27',
    label: 'Year one, to June 2027',
    story:
      'The plants are built and commissioned and Witta makes the first stock. Trade covers two thirds of the organisation and a grant covers the rest.',
    plants: 0,
    capacityBeds: WITTA_BEDS_A_YEAR,
    bedsSold: 400,
    bedsBasis: 'target',
    facilitationCommunities: 4,
    runningAud: 297_550,
    runningBasis: 'locked',
    grantSoughtAud: 100_000,
    grantNote:
      'The gap between what 400 beds contribute and what the year costs is $107,950. Year one of the Tim Fairfax grant is $100,000 and closes almost all of it.',
  },
  {
    id: 'fy28',
    label: 'Year two, to June 2028',
    story:
      'Two community plants are running and Witta presses parts for them. The organisation reaches the number that carries it, and the grant stops being the thing that keeps the lights on.',
    plants: 2,
    capacityBeds: WITTA_BEDS_A_YEAR + 2 * PLANT_FIRST_YEAR_BEDS,
    bedsSold: 628,
    bedsBasis: 'target',
    facilitationCommunities: 4,
    runningAud: 297_550,
    runningBasis: 'assumption',
    grantSoughtAud: 100_000,
    grantNote:
      'At 628 beds trade covers the organisation exactly. Year two of the grant becomes the reserve that lets a bad quarter happen without a redundancy, which is what resilience means on a cashflow.',
  },
  {
    id: 'fy29',
    label: 'Year three, to June 2029',
    story:
      'The plants move toward community hands. Goods earns more than it costs to run, and the grant turns to paying for the handover.',
    plants: 3,
    capacityBeds: WITTA_BEDS_A_YEAR + 2 * PLANT_MATURE_BEDS + PLANT_FIRST_YEAR_BEDS,
    bedsSold: 900,
    bedsBasis: 'target',
    facilitationCommunities: 6,
    runningAud: 297_550,
    runningBasis: 'assumption',
    grantSoughtAud: 100_000,
    grantNote:
      'Trade covers the organisation with $128,050 over. Year three of the grant funds the handover: the legal work, the training and the asset transfer that turn a plant Goods owns into a plant a community owns.',
  },
];

export function contributionAud(y: PlanYear): number {
  return y.bedsSold * CONTRIBUTION_AUD;
}

export function facilitationAud(y: PlanYear): number {
  return y.facilitationCommunities * FACILITATION_PER_COMMUNITY_AUD;
}

/**
 * Facilitation is billed and spent at about the same rate, so it is carried as cost neutral and
 * kept out of this line. $50,000 has already been billed and paid across four communities at
 * $10,000 each; the same $10,000 pays for the trip, the days and the delivery. Counting it as
 * income here without its cost would be the same mistake that produced the $937,550.
 */
export const FACILITATION_IS_COST_NEUTRAL =
  'Facilitation is billed at $10,000 a community and costs about the same to deliver, so it neither funds the organisation nor drains it. It sits beside this ledger instead of inside it.';

export function tradeIncomeAud(y: PlanYear): number {
  return contributionAud(y);
}

/** Positive means trade alone does not cover the year. */
export function shortfallAud(y: PlanYear): number {
  return y.runningAud - tradeIncomeAud(y);
}

export function afterGrantAud(y: PlanYear): number {
  return tradeIncomeAud(y) + y.grantSoughtAud - y.runningAud;
}

export const GRANT_TOTAL_AUD = YEARS.reduce((n, y) => n + y.grantSoughtAud, 0);

export const TRADE_SHARE = YEARS.map((y) => ({
  id: y.id,
  percent: Math.round((tradeIncomeAud(y) / y.runningAud) * 100),
}));

// ---------------------------------------------------------------------------
// What this is not
// ---------------------------------------------------------------------------

export const CLAIM_CEILING =
  'The $276 making cost and its contribution remain provisional for the corrected bought-leg route. Bed volumes are targets that fit inside modelled capacity. They are not forecasts and no buyer has ordered year two or year three. The running cost is Ben\'s provision for year one and is held flat across three years, which is an assumption nobody has ruled on: it holds founders, travel, accounting, rent, marketing and maintenance at today\'s level while the work grows.';

export const WHAT_NEEDS_A_RULING: readonly string[] = [
  'Does the running cost stay at $297,550 for three years while two plants and six communities are added, or does it grow.',
  'Does founder pay move off $151,200 once trade carries the organisation.',
  'Who carries freight from year two, because it moves break-even from 628 beds to 918.',
  'Whether year three of the grant pays for the handover, which is the only line here that is not an operating cost.',
];

export const THE_ARGUMENT =
  'A three-year grant that shrinks as a share of the budget is the resilience Katie Norman named. In year one it is a third of what the organisation costs. In year two it is a reserve. In year three it pays for giving the plants away. The same $100,000 does a different job each year because trade has grown underneath it.';
