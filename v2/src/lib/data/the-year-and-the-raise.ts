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
 *    (deliverables/finance/goods-financial-plan/WORKED-OUT-2026-09-09.md), cut on 15 September 2026:
 *    marketing confirmed at $10,000, accounting and advice set to Butterfly's actual FY26 accountancy
 *    plus audit (JAQ Minns FY26 statements, $2,200 + $1,474).
 *  - Bed price: canon `stretch-price` 750. Make cost: derived below from its components, six kits a
 *    day (Ben, 15 September 2026), provisional until Nic confirms the bought leg-panel yield.
 *  - Freight $100 a bed, all up (Ben, 15 September 2026). The organisation absorbs it out of its
 *    share of the $750, as it absorbs facilitation at $100 a bed. Ben, 15 September 2026, as a
 *    director: $750 is the only bed price. No buyer pays freight and no funder is asked for it.
 *  - Plant allowance $150,000 against modules priced $95,767 to $142,467.
 *  - Commonwealth money: the DEWR outcome letter of 12 August 2026, read 15 September 2026.
 *  - Every grant except QBE buys 133 beds: Ben, 15 September 2026, as a director.
 */

import { PRESS_SHEETS_A_DAY, PRESSED_SHEETS_PER_KIT } from './production-route';

export const READ_AT = '2026-09-15';

// ---------------------------------------------------------------------------
// Unit economics
// ---------------------------------------------------------------------------

export const BED_PRICE_AUD = 750;

/** Kits a day. Ben, 15 September 2026: six, the tab press rate, one sheet a kit. */
export const KITS_A_DAY = PRESS_SHEETS_A_DAY / PRESSED_SHEETS_PER_KIT;
export const FACTORY_LABOUR_A_DAY_AUD = 400;

/** Legacy 20 kg at $2.75, provisional until the bought leg-panel yield is known. */
export const PLASTIC_AUD = 55;
export const POLES_AUD = 27;
export const CANVAS_AUD = 93.5;
export const HARDWARE_AUD = 5.24;
export const POWER_AUD = 15;
export const LABOUR_AUD = FACTORY_LABOUR_A_DAY_AUD / KITS_A_DAY;

/** Ben, 15 September 2026: the sum of the components above. */
export const BED_MAKE_AUD = PLASTIC_AUD + POLES_AUD + CANVAS_AUD + HARDWARE_AUD + POWER_AUD + LABOUR_AUD;
export const BED_MAKE_STATUS =
  'provisional: bought leg panels and tab pressing need costing (Nic, panel yield)';

/** Ben, 15 September 2026: $100 a bed all up, absorbed by the organisation out of its share. */
export const BED_FREIGHT_AUD = 100;

export const BEDS_YEAR_ONE = 400;
export const FACILITATION_COMMUNITIES = 4;
export const FACILITATION_AUD = 40_000;

/** Facilitation a bed: $40,000 over 400 beds, absorbed by the organisation. Ben, 15 September 2026. */
export const FACILITATION_PER_BED_AUD = FACILITATION_AUD / BEDS_YEAR_ONE;

/** What reaches the organisation from a $750 bed after making, freight and facilitation. Ben, 15 September 2026. */
export const CONTRIBUTION_AUD = BED_PRICE_AUD - BED_MAKE_AUD - BED_FREIGHT_AUD - FACILITATION_PER_BED_AUD;

const aud = (n: number) => Math.round(n).toLocaleString('en-AU');

export const FREIGHT_RULE =
  `A bed is $${BED_PRICE_AUD} and nothing is added to it: the organisation absorbs freight at $${BED_FREIGHT_AUD} a bed and facilitation at $${aud(FACILITATION_PER_BED_AUD)} a bed out of its share, so $${aud(CONTRIBUTION_AUD)} of each bed reaches it. Ben, 15 September 2026.`;

// ---------------------------------------------------------------------------
// What the year does
// ---------------------------------------------------------------------------

export const PLANTS_IN_THE_ASK = 2;
export const PLANT_ALLOWANCE_AUD = 150_000;
export const PLANT_MODULES_LOW_AUD = 95_767;
export const PLANT_MODULES_HIGH_AUD = 142_467;

export interface RunningLine {
  readonly line: string;
  readonly amountAud: number;
  readonly what: string;
}

/** Whether the founders line includes superannuation has not been confirmed. */
export const FOUNDERS_SUPER_STATUS = 'unconfirmed';

/** Butterfly's FY26 accountancy plus audit, JAQ Minns FY26 statements: $2,200 + $1,474. */
export const ACCOUNTANCY_FY26_AUD = 2_200;
export const AUDIT_FY26_AUD = 1_474;

/** Running the organisation before a single bed is made. Ben's provision of 9 Sep 2026, cut 15 Sep 2026. */
export const RUNNING_LINES: readonly RunningLine[] = [
  { line: 'Founders', amountAud: 151_200, what: 'Two founders beyond the days they spend on production. Whether this includes superannuation is unconfirmed.' },
  { line: 'Getting to communities', amountAud: 51_000, what: 'Travel to eleven communities. Being on country costs what a call does not.' },
  { line: 'Accounting and advice', amountAud: ACCOUNTANCY_FY26_AUD + AUDIT_FY26_AUD, what: 'What Butterfly actually paid for its FY26 accountancy and audit, from the JAQ Minns FY26 statements.' },
  // Renamed on the way onto main, 17 September 2026: facility-naming.guards.test.ts forbids the
  // place name and the word farm anywhere a page or data module can print them. Same rent.
  { line: 'Facility rent', amountAud: 27_000, what: 'The Goods on Country facility in Queensland, where the press and the router live.' },
  { line: 'Marketing', amountAud: 10_000, what: 'The site, the deck, the print. Confirmed by Ben on 15 September 2026.' },
  { line: 'Maintenance', amountAud: 8_350, what: 'Press, router and shredder upkeep.' },
];

export const RUNNING_AUD = RUNNING_LINES.reduce((n, l) => n + l.amountAud, 0);

// ---------------------------------------------------------------------------
// One ledger. Freight and facilitation sit inside the bed.
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

/** Cash the year actually needs: plants, beds at cost, facilitation, freight and running. */
export const NEED_AUD =
  PLANTS_AUD + BEDS_AT_COST_AUD + FACILITATION_AUD + FREIGHT_ON_THE_YEAR_AUD + RUNNING_AUD;

/**
 * The overlap between the published gross and the need. It is what 400 beds hand back once
 * their making and their freight are paid: the facilitation is a cost in both figures, so it
 * is not part of the overlap.
 */
export const DOUBLE_COUNT_AUD = GROSS_AS_PUBLISHED_AUD - NEED_AUD;

export const WHAT_WENT_WRONG =
  `The $937,550 published on 11 September added 400 beds at the $750 sale price to the full running cost of that day. A bed sold at $${BED_PRICE_AUD} pays its own $${aud(BED_MAKE_AUD)} of making, its $${BED_FREIGHT_AUD} of freight and its $${aud(FACILITATION_PER_BED_AUD)} of facilitation, and hands $${aud(CONTRIBUTION_AUD)} to the organisation, so the running cost was charged twice. On today's lines the overlap is $${aud(DOUBLE_COUNT_AUD)} and the corrected figure is $${aud(NEED_AUD)}.`;

// ---------------------------------------------------------------------------
// The organisation's side of the year
// ---------------------------------------------------------------------------

/** What the organisation pays beyond plants and making: running, facilitation and freight. */
export const ORGANISATION_NEED_AUD = RUNNING_AUD + FACILITATION_AUD + FREIGHT_ON_THE_YEAR_AUD;

/** What reaches the organisation from the 400 beds after making, freight and facilitation. */
export const ORGANISATION_FROM_BEDS_AUD = BEDS_YEAR_ONE * CONTRIBUTION_AUD;

/**
 * What the organisation is short after the 400 beds. Measured against the running cost alone,
 * because freight and facilitation are already taken out of the contribution: subtracting the
 * contribution from ORGANISATION_NEED_AUD would charge both of them twice. The guard test shows
 * the same figure from the other side, the organisation's need less the beds' gross share.
 */
export const ORGANISATION_SHORT_AUD = RUNNING_AUD - ORGANISATION_FROM_BEDS_AUD;

// ---------------------------------------------------------------------------
// The raise
// ---------------------------------------------------------------------------

export type AskStage =
  | 'approved' // the money is decided and available
  | 'offered' // a written offer to a partner entity, agreement not executed
  | 'likely' // Ben's judgement as a director, no letter yet
  | 'invited' // a written invitation to apply for a named amount
  | 'applying' // a form is open and being filled
  | 'not-sent' // our number, nothing with the funder yet
  | 'no-invitation'; // an invitation-only door that has not issued one

/**
 * Ben, 15 September 2026, as a director: every grant funder except QBE buys beds, at $750 and in
 * lots of 133. No funder is asked for the running cost. The organisation is carried by the
 * contribution each bed hands back, and by trade beyond the 400. Facilitation and freight sit
 * inside the bed, so no ask carries either as a line.
 */
export const BEDS_A_GRANT = 133;
export const GRANT_LOT_AUD = BEDS_A_GRANT * BED_PRICE_AUD;

export const EVERY_GRANT_BUYS_BEDS =
  `Ben, 15 September 2026: QBE buys two facilities. Every other grant funder buys beds, ${BEDS_A_GRANT} at $${BED_PRICE_AUD}, which is $${aud(GRANT_LOT_AUD)}. Nobody is asked for the running cost; the $${aud(CONTRIBUTION_AUD)} each bed hands back is what carries the organisation.`;

export interface Ask {
  readonly funder: string;
  readonly amountAud: number;
  readonly job: 'plant' | 'beds' | 'facilitation' | 'operating';
  readonly stage: AskStage;
  readonly source: string;
  /** Grants unless said otherwise. The loan is inside the ask, Ben 15 September 2026. */
  readonly instrument?: 'grant' | 'loan';
}

/** Ben, 15 September 2026 (evening): the running gap is carried by a SEFA loan of $150,000, inside the ask. */
export const LOAN_ASK_AUD = 150_000;

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
    amountAud: GRANT_LOT_AUD,
    job: 'beds',
    stage: 'invited',
    source: `Katie Norman, 31 August 2026: a three-year grant of $300,000 in three equal payments under General Operating Support. Ben, 15 September 2026: year one buys ${BEDS_A_GRANT} beds at $${BED_PRICE_AUD}; the organisation's share is the contribution those beds hand back. The form's operating framing is a flag, not a job.`,
  },
  {
    funder: 'Brian M. Davis Charitable Foundation',
    amountAud: GRANT_LOT_AUD,
    job: 'beds',
    stage: 'invited',
    source: `Miranda Campbell, 1 September 2026: up to $100,000 for twelve months. Ben, 15 September 2026: ${BEDS_A_GRANT} beds at $${BED_PRICE_AUD}, facilitation inside, one budget line. The old 80 beds plus $40,000 facilitation split is withdrawn.`,
  },
  {
    funder: 'Snow Foundation',
    amountAud: GRANT_LOT_AUD,
    job: 'beds',
    stage: 'not-sent',
    source: 'Ben wrote $100,000 on 10 September and ruled it counts as beds, 133 at $750. Ben, 17 September 2026: the ask is the bed lot, $99,750, which is what the letter body has always said. The ask has not been sent.',
  },
  {
    funder: 'SEFA, Backing the Bold',
    amountAud: LOAN_ASK_AUD,
    job: 'operating',
    stage: 'not-sent',
    instrument: 'loan',
    source: 'Ben, 15 September 2026: the first-year running gap is carried by a SEFA loan of $150,000, inside the ask, repaid from the $288 each bed hands back. Jay\'s steer for QBE 2026 is philanthropy that unlocks capital, and this is the capital. EOI drafted; Joel Bird reviews the financials before it goes.',
  },
];

export const GRANTS_ASKED_AUD = ASKS.filter((a) => a.instrument !== 'loan').reduce((n, a) => n + a.amountAud, 0);
export const LOAN_ASKED_AUD = ASKS.filter((a) => a.instrument === 'loan').reduce((n, a) => n + a.amountAud, 0);

/**
 * SEDI is not in the raise. Both streams buy capability services (finance, legal, impact
 * measurement, advice) and exclude plant, inventory and beds, so it cannot be a bed line for any
 * applicant. The First Nations stream fits Oonchiumpa in its own right; the general stream needs
 * $50,000 of trading revenue on the applicant entity, which sits in the sole-trader ledger today.
 */
export const SEDI_RULE =
  'SEDI buys capability services, never beds, so it is outside the bed stack. Oonchiumpa can apply to the First Nations stream for its own capability; the general stream waits until the trade sits in the applicant entity.';

export const ASKED_AUD = ASKS.reduce((n, a) => n + a.amountAud, 0);
export const SECURED_AUD = 0;

/** No grant carries the running cost; a loan does. Ben, 15 September 2026. */
export const OPERATING_RULE =
  'No grant is asked for the running cost. Every grant except QBE buys beds; the organisation lives on the $288 each bed hands back, and the first-year gap is carried by a SEFA loan of $150,000 inside the ask, repaid from those beds.';

export const SECURED_CEILING =
  'Nothing in the raise is secured. Every line is an invitation, an application or a conversation. An invitation is not an award.';

// ---------------------------------------------------------------------------
// The Commonwealth money, read from the documents on 15 September 2026
// ---------------------------------------------------------------------------

/**
 * Corrected 15 September 2026 from the DEWR outcome letter (12 August 2026, Melanie Croke) and
 * the Stage Two application. The "$150,000 approved, a second $150,000 likely" of 11 and 12
 * September fused two different Commonwealth things and is withdrawn.
 */
export interface PlantMoney {
  readonly id: string;
  readonly site: string;
  readonly recipient: string;
  readonly amountAud: number;
  readonly stage: AskStage;
  readonly inTheQbeAsk: boolean;
  readonly note: string;
}

export const COMMONWEALTH_PLANT_MONEY: readonly PlantMoney[] = [
  {
    id: 'real-innovation-fund',
    site: 'Alice Springs',
    recipient: 'Oonchiumpa Consultancy & Services Pty Ltd',
    amountAud: 1_695_000,
    stage: 'offered',
    inTheQbeAsk: false,
    note: 'DEWR REAL Innovation Fund offer of $1,695,000 excluding GST to Oonchiumpa, $423,750 in each of four years to 30 June 2030, letter dated 12 August 2026. The letter says it does not constitute a grant agreement; none is executed and no cash has been received. A Curious Tractor is the named consortium member. It is Oonchiumpa\'s money, not the applicant\'s, and it is disclosed at Q1, Q2, Q8 and Q14, never counted.',
  },
  {
    id: 'niaa-local-investments',
    site: 'Alice Springs',
    recipient: 'Oonchiumpa Consultancy & Services Pty Ltd',
    amountAud: 150_000,
    stage: 'no-invitation',
    inTheQbeAsk: false,
    note: 'NIAA Local Investments Funding, up to $150,000 an activity, invitation only. Alex Cadden told Tanya and Kristy on 7 August 2026 he would explore a plastics plant proposal. That is an open door, not an invitation, and nothing has been applied for. Ben, 15 September 2026: Goods and Oonchiumpa work on this one together once the DEWR agreement is executed.',
  },
];

/** Nothing Commonwealth is approved to the applicant, and nothing is counted. */
export const COMMONWEALTH_APPROVED_AUD = 0;
export const COMMONWEALTH_LIKELY_AUD = 0;

/**
 * Ben, 15 September 2026, as a director: Oonchiumpa will pay Goods $150,000 out of the DEWR grant
 * for the development of the Alice Springs facility, and Goods and Oonchiumpa then work on the
 * NIAA grant together. It arrives once the DEWR grant agreement is executed, which it is not yet.
 */
export const OONCHIUMPA_BUILD_AUD = PLANT_ALLOWANCE_AUD;
export const OONCHIUMPA_BUILD_STATUS =
  'stated by Ben as a director on 15 September 2026: Oonchiumpa pays Goods $150,000 from the DEWR grant to develop the Alice Springs facility, payable once the DEWR grant agreement is executed';

export const REAL_RULING =
  'The REAL Innovation Fund is one offer of $1,695,000 to Oonchiumpa over four years, agreement not executed, no cash received. It is not $150,000, not approved to the applicant, and there is no second tranche. Alice Springs is not one of the two QBE sites, so no QBE activity is funded twice and Q14 and Q15 carry no double-funding disclosure. The related-party disclosure stands on its own footing, because Kristy Bloomfield sits on both boards and A Curious Tractor is the consortium member.';

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
  return plants * PLANT_ALLOWANCE_AUD + BEDS_AT_COST_AUD + FACILITATION_AUD + FREIGHT_ON_THE_YEAR_AUD + RUNNING_AUD;
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'as-asked',
    name: 'The raise as it stands',
    plants: 2,
    needAud: needForPlants(2),
    fundedAud: ASKED_AUD,
    what: 'Two plants from QBE and every other grant buying beds. Nothing is asked for the running cost. Everything is an ask and nothing is secured.',
  },
  {
    id: 'alice-in',
    name: 'Oonchiumpa commissions its Alice Springs plant',
    plants: 3,
    needAud: needForPlants(3),
    fundedAud: ASKED_AUD + OONCHIUMPA_BUILD_AUD,
    what: `If the REAL agreement is executed and Oonchiumpa pays Goods to build its plant, both sides move by the same $${aud(OONCHIUMPA_BUILD_AUD)}, so the gap does not change and the year gains a plant. ${OONCHIUMPA_BUILD_STATUS}.`,
  },
];

export function gapAud(s: Scenario): number {
  return s.needAud - s.fundedAud;
}

// ---------------------------------------------------------------------------
// Where the gap actually lives
// ---------------------------------------------------------------------------

/**
 * Ben, 12 September 2026: an ask that has not been sent does not cover a bed.
 * So the stated gap counts only the asks that are with a funder, and the Snow
 * line is what closes it from 320 to 187 once it goes out.
 */
export const BEDS_COVERED_BY_SENT_ASKS = Math.floor(
  ASKS.filter((a) => a.job === 'beds' && a.stage !== 'not-sent')
    .reduce((n, a) => n + a.amountAud, 0) / BED_PRICE_AUD,
);

/** The figure every funder-facing surface prints. */
export const BEDS_TO_FIND = BEDS_YEAR_ONE - BEDS_COVERED_BY_SENT_ASKS;
export const BEDS_TO_FIND_AUD = BEDS_TO_FIND * BED_PRICE_AUD;

/** What the unsent Snow ask would cover, at the sale price. */
export const BEDS_IN_UNSENT_ASKS = Math.floor(
  ASKS.filter((a) => a.job === 'beds' && a.stage === 'not-sent')
    .reduce((n, a) => n + a.amountAud, 0) / BED_PRICE_AUD,
);

/** Every bed ask counted, sent or not, capped at the year's 400. The raw count can exceed it. */
export const BEDS_ASKED_FOR = Math.floor(
  ASKS.filter((a) => a.job === 'beds').reduce((n, a) => n + a.amountAud, 0) / BED_PRICE_AUD,
);
export const BEDS_FUNDED = Math.min(BEDS_YEAR_ONE, BEDS_ASKED_FOR);
export const BEDS_UNFUNDED = BEDS_YEAR_ONE - BEDS_FUNDED;
export const BEDS_UNFUNDED_AUD = BEDS_UNFUNDED * BED_PRICE_AUD;

/** Beds asked for beyond the 400, once every bed ask is counted. Ben decides whether the year grows. */
export const BEDS_OVER_THE_YEAR = Math.max(0, BEDS_ASKED_FOR - BEDS_YEAR_ONE);

export const THE_GAP_STAYS =
  `The gap does not close on plant money. The Commonwealth offer is Oonchiumpa's, for Alice Springs, and Alice Springs is not a QBE site, so nothing frees a dollar of the QBE request for beds. The grants leave $${aud(NEED_AUD - GRANTS_ASKED_AUD)} of running cost uncovered; the $${aud(LOAN_ASKED_AUD)} SEFA loan inside the ask carries it and the ${BEDS_TO_FIND} beds still to find stand against the unsent asks.`;

export const BED_GAP_RULE =
  `Ben, 12 September 2026: an unsent ask covers no bed, so the stated gap counts sent asks only. Today that is ${BEDS_TO_FIND} beds. The unsent asks would cover ${BEDS_IN_UNSENT_ASKS} more. A default that switches an unsent ask on prints a funded position that does not exist.`;

/** Nothing is asked against operating. Ben, 15 September 2026. */
export const OPERATING_ASKED_AUD = ASKS
  .filter((a) => a.job === 'operating')
  .reduce((n, a) => n + a.amountAud, 0);

export const WHERE_THE_GAP_LIVES =
  `The gap is not in the plants. Plant money arrives in $150,000 pieces that match the $150,000 cost, so a plant either happens or it does not and it never leaves a hole. The gap is ${BEDS_TO_FIND} beds of first stock and the running cost that no grant is asked for. The running cost is carried by the $${aud(LOAN_ASKED_AUD)} loan inside the ask, and a loan is the right instrument for it because every bed sold repays it.`;

export const THE_LEVER =
  `Every dollar of bed money does two jobs: it pays the $${aud(BED_MAKE_AUD)} of making, the freight and the facilitation, and hands $${aud(CONTRIBUTION_AUD)} to the organisation. So the ${BEDS_TO_FIND} beds still to find carry $${aud(BEDS_TO_FIND_AUD)} of stock and $${aud(BEDS_TO_FIND * CONTRIBUTION_AUD)} of the running cost with them. Funding beds is the cheapest way to fund the organisation, and it is the only ask that a funder can see a product at the end of.`;

// ---------------------------------------------------------------------------
// Yield improvements. Ben, 15 September 2026: no second press.
// ---------------------------------------------------------------------------

export interface YieldImprovement {
  readonly id: string;
  readonly item: string;
  readonly whatItDoes: string;
  readonly amountAud: number | null;
  readonly status: 'needs-quote' | 'quoted';
  readonly owner: 'Nic';
}

export const YIELD_IMPROVEMENTS: readonly YieldImprovement[] = [
  {
    id: 'second-press-die',
    item: 'A second press die',
    whatItDoes: 'Two tab sheets press per cycle on the press already in the shed.',
    amountAud: null,
    status: 'needs-quote',
    owner: 'Nic',
  },
  {
    id: 'cnc-tooling-and-jig',
    item: 'CNC tooling and a cutting jig for bought leg panels',
    whatItDoes: 'More leg sets cut from each bought panel, and faster.',
    amountAud: null,
    status: 'needs-quote',
    owner: 'Nic',
  },
  {
    id: 'shred-handling',
    item: 'Shred handling: a bulka bag lifter and bins',
    whatItDoes: 'Moves shred from bag to press without hand-shovelling or spillage.',
    amountAud: null,
    status: 'needs-quote',
    owner: 'Nic',
  },
  {
    id: 'dust-and-fume-extraction',
    item: 'Dust and fume extraction',
    whatItDoes: 'Keeps the router and press running through a full day safely.',
    amountAud: null,
    status: 'needs-quote',
    owner: 'Nic',
  },
  {
    id: 'cold-press-canvas',
    item: 'A cold press for canvas sleeves',
    whatItDoes: 'Takes sleeve making off the bench and shortens the canvas step.',
    amountAud: null,
    status: 'needs-quote',
    owner: 'Nic',
  },
  {
    id: 'genset-or-power',
    item: 'Genset or power upgrade',
    whatItDoes: 'Lets the press and the router run at the same time.',
    amountAud: null,
    status: 'needs-quote',
    owner: 'Nic',
  },
];

/** Quoted items only. An unquoted item never enters a total. */
export const YIELD_IMPROVEMENTS_TOTAL_AUD = YIELD_IMPROVEMENTS
  .filter((y) => y.status === 'quoted' && y.amountAud !== null)
  .reduce((n, y) => n + (y.amountAud ?? 0), 0);

export const YIELD_IMPROVEMENTS_QUOTED = YIELD_IMPROVEMENTS.filter((y) => y.status === 'quoted').length;
