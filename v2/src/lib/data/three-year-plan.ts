/**
 * Three years of the organisation, for the Tim Fairfax application.
 *
 * Katie Norman's invitation names the resilience of organisations and offers $300,000 in three
 * equal payments. Nothing in the repo answered that, because every model here runs one year.
 * This is the three-year shape: what it costs to be Goods on Country, what trade carries, and
 * how a grant that steps down as trade steps up looks on paper.
 *
 * The spine is one arithmetic fact already locked: running the organisation costs what the year
 * module says it costs, and a bed hands back its contribution, so the break-even below is the
 * number of paid beds a year that carries the whole thing. Year one plans 400. The three years are
 * the distance between those two numbers.
 *
 * What is locked and what is a target
 *  - Running cost, bed price, make cost and contribution are imported from the-year-and-the-raise
 *    and never retyped here.
 *  - Capacity is the 80% availability ruling: current facility 1,152 kits a year, with bought legs and community assembly.
 *  - BED VOLUMES ARE TARGETS, NEVER FORECASTS. They are capacity-checked and nothing more.
 *    Every one carries `basis` saying which.
 */

import { factoryKitsAMonth } from './production-route';
import {
  BED_PRICE_AUD, BED_MAKE_AUD, BED_FREIGHT_AUD, BED_MAKE_STATUS,
  FACILITATION_PER_BED_AUD, CONTRIBUTION_AUD, RUNNING_AUD, BEDS_A_GRANT, GRANT_LOT_AUD,
} from './the-year-and-the-raise';

export { BED_PRICE_AUD, BED_MAKE_AUD, BED_FREIGHT_AUD, FACILITATION_PER_BED_AUD, CONTRIBUTION_AUD };

export const READ_AT = '2026-09-15';

export const WHY_THIS_EXISTS =
  'Tim Fairfax invited a three-year application on 31 August 2026 and named the resilience of organisations as the reason. Every model in the repo runs one year, so there was nothing to answer it with.';

/**
 * Ben, 15 September 2026: each Tim Fairfax payment buys 133 beds at $750. The form is General
 * Operating Support, and what it operates is the contribution those beds hand the organisation.
 */
export const TFFF_BEDS_A_YEAR = BEDS_A_GRANT;
export const TFFF_BEDS_AUD = GRANT_LOT_AUD;
export const TFFF_HANDS_BACK_AUD = TFFF_BEDS_A_YEAR * CONTRIBUTION_AUD;
export const TFFF_RULING =
  `Ben, 15 September 2026: each $100,000 payment buys ${TFFF_BEDS_A_YEAR} beds at $${BED_PRICE_AUD}, which is $${(TFFF_BEDS_AUD).toLocaleString('en-AU')}. The beds are community trading stock, and $${Math.round(TFFF_HANDS_BACK_AUD).toLocaleString('en-AU')} of the payment reaches the organisation as the contribution inside them. The form asks for general operating support; that is what the contribution is.`;

export const RUNNING_YEAR_ONE_AUD = RUNNING_AUD;

/**
 * The number that decides everything. The contribution already has freight and facilitation
 * taken out of it (Ben, 15 September 2026), so there is one break-even and not two.
 */
export const BREAK_EVEN_BEDS = Math.ceil(RUNNING_YEAR_ONE_AUD / CONTRIBUTION_AUD);

const aud = (n: number) => Math.round(n).toLocaleString('en-AU');

export const BREAK_EVEN_NOTE =
  `Running the organisation costs $${aud(RUNNING_YEAR_ONE_AUD)} and a bed hands back $${aud(CONTRIBUTION_AUD)} once its making, its $${BED_FREIGHT_AUD} of freight and its $${aud(FACILITATION_PER_BED_AUD)} of facilitation are paid, so ${BREAK_EVEN_BEDS} paid beds a year carries it. The figure is provisional while the making cost is, because it derives from it: ${BED_MAKE_STATUS}.`;

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

const YEAR_ONE_BEDS = 400;
const YEAR_THREE_BEDS = 900;
const GRANT_A_YEAR_AUD = 100_000;
const YEAR_ONE_SHORT_AUD = RUNNING_AUD - YEAR_ONE_BEDS * CONTRIBUTION_AUD;
const YEAR_THREE_OVER_AUD = YEAR_THREE_BEDS * CONTRIBUTION_AUD - RUNNING_AUD;

export const YEARS: readonly PlanYear[] = [
  {
    id: 'fy27',
    label: 'Year one, to June 2027',
    story:
      `The plants are built and commissioned and Witta makes the first stock. Trade covers about ${Math.round((YEAR_ONE_BEDS * CONTRIBUTION_AUD / RUNNING_AUD) * 100)}% of the organisation and a grant covers the rest.`,
    plants: 0,
    capacityBeds: WITTA_BEDS_A_YEAR,
    bedsSold: YEAR_ONE_BEDS,
    bedsBasis: 'target',
    facilitationCommunities: 4,
    runningAud: RUNNING_AUD,
    runningBasis: 'locked',
    grantSoughtAud: GRANT_A_YEAR_AUD,
    grantNote:
      `The gap between what ${YEAR_ONE_BEDS} beds contribute and what the year costs is $${aud(YEAR_ONE_SHORT_AUD)}. Year one of the Tim Fairfax grant is $${aud(GRANT_A_YEAR_AUD)} and buys ${TFFF_BEDS_A_YEAR} of those ${YEAR_ONE_BEDS} beds as first stock; $${aud(TFFF_HANDS_BACK_AUD)} of it reaches the organisation as the contribution inside them.`,
  },
  {
    id: 'fy28',
    label: 'Year two, to June 2028',
    story:
      'Two community plants are running and Witta presses parts for them. The organisation reaches the number that carries it, and the grant stops being the thing that keeps the lights on.',
    plants: 2,
    capacityBeds: WITTA_BEDS_A_YEAR + 2 * PLANT_FIRST_YEAR_BEDS,
    bedsSold: BREAK_EVEN_BEDS,
    bedsBasis: 'target',
    facilitationCommunities: 4,
    runningAud: RUNNING_AUD,
    runningBasis: 'assumption',
    grantSoughtAud: GRANT_A_YEAR_AUD,
    grantNote:
      `At ${BREAK_EVEN_BEDS} beds trade covers the organisation. Year two of the grant buys another ${TFFF_BEDS_A_YEAR} beds of stock for the two new plants' communities, and the contribution inside them is the reserve that lets a bad quarter happen without a redundancy, which is what resilience means on a cashflow.`,
  },
  {
    id: 'fy29',
    label: 'Year three, to June 2029',
    story:
      'The plants move toward community hands. Goods earns more than it costs to run, and the grant turns to paying for the handover.',
    plants: 3,
    capacityBeds: WITTA_BEDS_A_YEAR + 2 * PLANT_MATURE_BEDS + PLANT_FIRST_YEAR_BEDS,
    bedsSold: YEAR_THREE_BEDS,
    bedsBasis: 'target',
    facilitationCommunities: 6,
    runningAud: RUNNING_AUD,
    runningBasis: 'assumption',
    grantSoughtAud: GRANT_A_YEAR_AUD,
    grantNote:
      `Trade covers the organisation with $${aud(YEAR_THREE_OVER_AUD)} over. Year three of the grant buys ${TFFF_BEDS_A_YEAR} beds of first stock for the communities taking the plants over, so the handover starts with something to sell.`,
  },
];

export function contributionAud(y: PlanYear): number {
  return y.bedsSold * CONTRIBUTION_AUD;
}

export function facilitationAud(y: PlanYear): number {
  return y.facilitationCommunities * FACILITATION_PER_COMMUNITY_AUD;
}

/**
 * Facilitation is inside the bed. Ben, 15 September 2026: the organisation absorbs it at $100 a
 * bed out of its share of the $750, so the contribution above already has it taken out and no
 * income line carries it. $50,000 has already been billed and paid across four communities at
 * $10,000 each, which is the same $40,000 on 400 beds. Counting it as income here without its
 * cost would be the same mistake that produced the $937,550.
 */
export const FACILITATION_IS_COST_NEUTRAL =
  `Facilitation is $${aud(FACILITATION_PER_BED_AUD)} a bed, taken out of the contribution before it reaches the organisation, and it costs about the same to deliver as the $10,000 a community already billed. It neither funds the organisation nor drains it, so no line here carries it.`;

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
  `The $${aud(BED_MAKE_AUD)} making cost and its contribution remain provisional for the corrected bought-leg route. Bed volumes are targets that fit inside modelled capacity. They are not forecasts and no buyer has ordered year two or year three. The running cost is Ben's provision for year one and is held flat across three years, which is an assumption nobody has ruled on: it holds founders, travel, accounting, rent, marketing and maintenance at today's level while the work grows.`;

export const WHAT_NEEDS_A_RULING: readonly string[] = [
  `Does the running cost stay at $${aud(RUNNING_AUD)} for three years while two plants and six communities are added, or does it grow.`,
  'Does founder pay move off $151,200 once trade carries the organisation, and does that figure include superannuation.',
  `Whether facilitation stays at $${aud(FACILITATION_PER_BED_AUD)} a bed past year one, because at 900 beds across six communities the per-bed figure and the $10,000 a community figure part company.`,
  'Whether year three of the grant pays for the handover, which is the only line here that is not an operating cost.',
];

export const THE_ARGUMENT =
  `A three-year grant that buys ${TFFF_BEDS_A_YEAR} beds a year is the resilience Katie Norman named, because the same beds do a different job each year as trade grows underneath them. In year one they are first stock and their contribution is a third of what the organisation costs. In year two they are the reserve. In year three they are the stock a community starts with when it takes the plant. Nothing is asked for the running cost itself.`;
