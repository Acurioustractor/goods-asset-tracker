/**
 * The year, and the raise that has to pay for it.
 *
 * Built 11 September 2026, after the published figure of $937,550 was found to count the bed
 * money twice. A bed sold at $750 pays for its own making and carries the rest of the business.
 * Adding "400 beds at $750" to the full running cost charges the organisation twice for the
 * same dollars. This module keeps the two views apart and makes the arithmetic a guard.
 *
 * Sources
 *  - Running cost lines: Ben's trimmed provision, 9 September 2026
 *    (deliverables/finance/goods-financial-plan/WORKED-OUT-2026-09-09.md).
 *  - Bed price and make cost: canon `stretch-price` 750, `marginal-factory` 426 = 276 + 150
 *    freight (deliverables/finance/goods-financial-plan/README.md, alignment with Matt Allen).
 *  - Freight $150 all up, $100 factory leg plus $50 community leg, see demand-and-buyers.ts FREIGHT_RULING.
 *  - Plant allowance $150,000 against modules priced $95,767 to $142,467.
 *  - Commonwealth plant money: Ben, 11 September 2026, stated as a director.
 */

export const READ_AT = '2026-09-11';

// ---------------------------------------------------------------------------
// Unit economics
// ---------------------------------------------------------------------------

export const BED_PRICE_AUD = 750;
export const BED_MAKE_AUD = 276;
export const BED_FREIGHT_AUD = 150;

/** What a bed contributes to the organisation when the buyer pays freight. */
export const CONTRIBUTION_BUYER_FREIGHT_AUD = BED_PRICE_AUD - BED_MAKE_AUD;
/** What a bed contributes when Goods carries freight. */
export const CONTRIBUTION_GOODS_FREIGHT_AUD = BED_PRICE_AUD - BED_MAKE_AUD - BED_FREIGHT_AUD;

export const FREIGHT_IS_THE_SWING =
  'Freight is the only line that moves the answer by a plant. Every invoice so far has put freight on the buyer. If Goods carries it on 400 beds that is $60,000, and the contribution a bed makes drops from $474 to $324.';

// ---------------------------------------------------------------------------
// What the year does
// ---------------------------------------------------------------------------

export const PLANTS_IN_THE_ASK = 2;
export const PLANT_ALLOWANCE_AUD = 150_000;
export const PLANT_MODULES_LOW_AUD = 95_767;
export const PLANT_MODULES_HIGH_AUD = 142_467;

export const BEDS_YEAR_ONE = 400;
export const FACILITATION_COMMUNITIES = 4;
export const FACILITATION_AUD = 40_000;

export interface RunningLine {
  readonly line: string;
  readonly amountAud: number;
  readonly what: string;
}

/** Running the organisation before a single bed is made. Ben's trimmed provision, 9 Sep 2026. */
export const RUNNING_LINES: readonly RunningLine[] = [
  { line: 'Founders', amountAud: 151_200, what: 'Two founders beyond the days they spend on production.' },
  { line: 'Getting to communities', amountAud: 51_000, what: 'Travel to eleven communities. Being on country costs what a call does not.' },
  { line: 'Accounting and advice', amountAud: 50_000, what: 'Bookkeeping, the FY26 repair, the entity work and the audit-readiness the funders are asking for.' },
  { line: 'Witta rent', amountAud: 27_000, what: 'The Harvest shed, where the press and the router live.' },
  { line: 'Marketing', amountAud: 10_000, what: 'The site, the deck, the print.' },
  { line: 'Maintenance', amountAud: 8_350, what: 'Press, router and shredder upkeep.' },
];

export const RUNNING_AUD = RUNNING_LINES.reduce((n, l) => n + l.amountAud, 0);

// ---------------------------------------------------------------------------
// Two ledgers. They differ only in who pays freight.
// ---------------------------------------------------------------------------

export const PLANTS_AUD = PLANTS_IN_THE_ASK * PLANT_ALLOWANCE_AUD;
export const BEDS_AT_PRICE_AUD = BEDS_YEAR_ONE * BED_PRICE_AUD;
export const BEDS_AT_COST_AUD = BEDS_YEAR_ONE * BED_MAKE_AUD;
export const FREIGHT_ON_THE_YEAR_AUD = BEDS_YEAR_ONE * BED_FREIGHT_AUD;

/**
 * The figure published on 11 September, kept so nobody re-derives it by accident.
 * Plants + beds at the sale price + facilitation + the whole running cost.
 */
export const GROSS_AS_PUBLISHED_AUD =
  PLANTS_AUD + BEDS_AT_PRICE_AUD + FACILITATION_AUD + RUNNING_AUD;

/** The overlap: what the 400 beds hand back to the organisation. */
export const BED_CONTRIBUTION_BUYER_FREIGHT_AUD = BEDS_YEAR_ONE * CONTRIBUTION_BUYER_FREIGHT_AUD;
export const BED_CONTRIBUTION_GOODS_FREIGHT_AUD = BEDS_YEAR_ONE * CONTRIBUTION_GOODS_FREIGHT_AUD;

/** Cash the year actually needs, buyer pays freight. */
export const NEED_BUYER_FREIGHT_AUD =
  PLANTS_AUD + BEDS_AT_COST_AUD + FACILITATION_AUD + RUNNING_AUD;

/** Cash the year actually needs, Goods carries freight. */
export const NEED_GOODS_FREIGHT_AUD = NEED_BUYER_FREIGHT_AUD + FREIGHT_ON_THE_YEAR_AUD;

export const DOUBLE_COUNT_AUD = GROSS_AS_PUBLISHED_AUD - NEED_BUYER_FREIGHT_AUD;

export const WHAT_WENT_WRONG =
  'The $937,550 published on 11 September added 400 beds at the $750 sale price to the full $297,550 running cost. A bed sold at $750 pays its own $276 of making and hands $474 to the organisation, so the running cost was charged twice. The overlap is $189,600 and the corrected figure is $747,950 with the buyer paying freight.';

// ---------------------------------------------------------------------------
// The raise
// ---------------------------------------------------------------------------

export type AskStage =
  | 'approved' // the money is decided and available
  | 'likely' // Ben's judgement as a director, no letter yet
  | 'invited' // a written invitation to apply for a named amount
  | 'applying' // a form is open and being filled
  | 'not-sent'; // our number, nothing with the funder yet

export interface Ask {
  readonly funder: string;
  readonly amountAud: number;
  readonly job: 'plant' | 'beds' | 'facilitation' | 'operating';
  readonly stage: AskStage;
  readonly source: string;
}

export const ASKS: readonly Ask[] = [
  {
    funder: 'QBE Foundation, Stage 2',
    amountAud: 300_000,
    job: 'plant',
    stage: 'applying',
    source: 'QBE!D14 and Funding F01. Two plants at the $150,000 allowance. Closes 25 September, noon.',
  },
  {
    funder: 'Tim Fairfax Family Foundation',
    amountAud: 100_000,
    job: 'operating',
    stage: 'invited',
    source: 'Katie Norman, 31 August 2026: a three-year grant of $300,000 in three equal payments, naming the resilience of organisations. Year one is $100,000 and it belongs on the operating line alone.',
  },
  {
    funder: 'Brian M. Davis Charitable Foundation',
    amountAud: 60_000,
    job: 'beds',
    stage: 'invited',
    source: 'Miranda Campbell, 1 September 2026: up to $100,000 for twelve months. 80 beds at $750.',
  },
  {
    funder: 'Brian M. Davis Charitable Foundation',
    amountAud: 40_000,
    job: 'facilitation',
    stage: 'invited',
    source: 'The other half of the same invitation. Facilitation in four communities.',
  },
  {
    funder: 'Snow Foundation',
    amountAud: 100_000,
    job: 'beds',
    stage: 'not-sent',
    source: 'Ben wrote $100,000 on 10 September and ruled it counts as beds. The ask has not been sent.',
  },
];

export const ASKED_AUD = ASKS.reduce((n, a) => n + a.amountAud, 0);
export const SECURED_AUD = 0;

export const SECURED_CEILING =
  'Nothing in the raise is secured. Every line is an invitation, an application or a conversation. An invitation is not an award.';

// ---------------------------------------------------------------------------
// The Commonwealth plant money, stated by Ben on 11 September 2026
// ---------------------------------------------------------------------------

export interface PlantMoney {
  readonly id: string;
  readonly site: string;
  readonly amountAud: number;
  readonly stage: AskStage;
  readonly inTheQbeAsk: boolean;
  readonly note: string;
}

export const COMMONWEALTH_PLANT_MONEY: readonly PlantMoney[] = [
  {
    id: 'alice-springs',
    site: 'Alice Springs',
    amountAud: 150_000,
    stage: 'approved',
    inTheQbeAsk: false,
    note: 'Approved and ready, through Oonchiumpa against the DEWR offer. Alice Springs is not one of the two sites in the QBE ask, so this builds a third plant and does not overlap the application.',
  },
  {
    id: 'second-facility',
    site: 'unnamed',
    amountAud: 150_000,
    stage: 'likely',
    inTheQbeAsk: false,
    note: 'The same route again, for a Goods facility. Ben judges it highly likely. Which site it lands on is the open question: a third or fourth site leaves QBE untouched, and Palm Island or Maningrida means QBE funds one plant, and the other $150,000 moves to beds.',
  },
];

export const COMMONWEALTH_APPROVED_AUD = COMMONWEALTH_PLANT_MONEY
  .filter((p) => p.stage === 'approved')
  .reduce((n, p) => n + p.amountAud, 0);

export const COMMONWEALTH_LIKELY_AUD = COMMONWEALTH_PLANT_MONEY
  .filter((p) => p.stage === 'likely')
  .reduce((n, p) => n + p.amountAud, 0);

export const THE_OPEN_QUESTION =
  'If the second $150,000 lands on Palm Island or Maningrida it funds an activity QBE is being asked to fund, and it has to be disclosed at Q14 and Q15 as other funding for the same purpose. If it lands on a third site it is additional capacity and QBE is unaffected. Ben names the site.';

// ---------------------------------------------------------------------------
// Scenarios. The plant lines are the only place where the ask equals the cost.
// ---------------------------------------------------------------------------

export interface Scenario {
  readonly id: string;
  readonly name: string;
  readonly plants: number;
  readonly needAud: number;
  readonly fundedAud: number;
  readonly what: string;
}

function needForPlants(plants: number): number {
  return plants * PLANT_ALLOWANCE_AUD + BEDS_AT_COST_AUD + FACILITATION_AUD + RUNNING_AUD;
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'as-asked',
    name: 'The raise as it stands',
    plants: 2,
    needAud: needForPlants(2),
    fundedAud: ASKED_AUD,
    what: 'Two plants from QBE, 213 of the 400 beds covered, one year of operating from Tim Fairfax. Everything is an ask and nothing is secured.',
  },
  {
    id: 'alice-in',
    name: 'Alice Springs counted in',
    plants: 3,
    needAud: needForPlants(3),
    fundedAud: ASKED_AUD + COMMONWEALTH_APPROVED_AUD,
    what: 'The approved $150,000 builds a third plant. Both sides move by the same $150,000, so the gap does not change and the year gains a plant.',
  },
  {
    id: 'both-commonwealth',
    name: 'Alice Springs, and the second facility lands',
    plants: 4,
    needAud: needForPlants(4),
    fundedAud: ASKED_AUD + COMMONWEALTH_APPROVED_AUD + COMMONWEALTH_LIKELY_AUD,
    what: 'Four plants instead of two, and the gap still does not move. Plant money is the one line where the grant and the cost are the same number.',
  },
  {
    id: 'second-replaces-qbe',
    name: 'The second facility takes a QBE site',
    plants: 3,
    needAud: needForPlants(3),
    fundedAud: ASKED_AUD + COMMONWEALTH_APPROVED_AUD + COMMONWEALTH_LIKELY_AUD,
    what: 'Alice Springs plus the two in the ask, one of them paid by the Commonwealth. QBE has to be told, and $150,000 of the QBE ask moves from plants to beds. This is the only scenario that closes the gap, because it puts new money against a cost that was already funded.',
  },
];

export function gapAud(s: Scenario): number {
  return s.needAud - s.fundedAud;
}

// ---------------------------------------------------------------------------
// Where the gap actually lives
// ---------------------------------------------------------------------------

export const BEDS_FUNDED = Math.floor(
  ASKS.filter((a) => a.job === 'beds').reduce((n, a) => n + a.amountAud, 0) / BED_PRICE_AUD,
);
export const BEDS_UNFUNDED = BEDS_YEAR_ONE - BEDS_FUNDED;
export const BEDS_UNFUNDED_AUD = BEDS_UNFUNDED * BED_PRICE_AUD;

export const OPERATING_ASKED_AUD = ASKS
  .filter((a) => a.job === 'operating')
  .reduce((n, a) => n + a.amountAud, 0);

export const WHERE_THE_GAP_LIVES =
  'The gap is not in the plants. Plant money arrives in $150,000 pieces that match the $150,000 cost, so a plant either happens or it does not and it never leaves a hole. The gap is 187 beds of first stock and a year of running the organisation, and those are the two hardest things to raise against because one looks like working capital and the other looks like overhead.';

export const THE_LEVER =
  'Every dollar of bed money does two jobs: it pays the $276 of making and hands $474 to the organisation. So 187 unfunded beds are not just $140,250 of stock, they are $88,638 of the running cost as well. Funding beds is the cheapest way to fund the organisation, and it is the only ask that a funder can see a product at the end of.';

export const SECOND_PRESS_AUD = 22_500;
export const SECOND_PRESS_NOTE =
  'The second press is in no ask. About $22,500, unpriced until Monday, and it decides whether the 400 beds land in June or August.';
