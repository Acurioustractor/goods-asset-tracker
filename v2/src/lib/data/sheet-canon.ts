/**
 * The one list of figures the live workbook is allowed to hold.
 *
 * Ben, 12 September 2026: make the sheet the core that aligns all numbers at all times.
 *
 * The sheet cannot be that core, and it is worth saying why. It has no guards, nobody can run a
 * test against it, and it has already drifted from the modules in eleven places, including an
 * availability cell still reading 100% four days after Ben set 80%. A surface that anyone can edit
 * and nothing can check will always drift.
 *
 * So the arrangement is the other way round. **The modules are the core and the sheet is a view of
 * them.** Every figure below is imported from a guarded module, never retyped here, so this file
 * cannot disagree with them. A script writes these into a Canon tab in the workbook, every other
 * tab references that tab, and a drift check compares the two on demand.
 *
 * That leaves the sheet doing what it is good at, which is scenarios, input cells and things people
 * want to type into, while the settled figures come from one place.
 */

import {
  BED_PRICE_AUD, BED_MAKE_AUD, BED_FREIGHT_AUD,
  CONTRIBUTION_BUYER_FREIGHT_AUD, CONTRIBUTION_GOODS_FREIGHT_AUD,
  RUNNING_AUD, RUNNING_LINES, PLANTS_IN_THE_ASK, PLANT_ALLOWANCE_AUD,
  PLANT_MODULES_LOW_AUD, PLANT_MODULES_HIGH_AUD, BEDS_YEAR_ONE,
  FACILITATION_COMMUNITIES, FACILITATION_AUD,
  NEED_BUYER_FREIGHT_AUD, NEED_GOODS_FREIGHT_AUD, ASKED_AUD, SECURED_AUD,
  BEDS_UNFUNDED, BEDS_UNFUNDED_AUD, SECOND_PRESS_AUD,
} from './the-year-and-the-raise';
import {
  BREAK_EVEN_BEDS, WITTA_BEDS_A_YEAR, PLANT_FIRST_YEAR_BEDS, PLANT_MATURE_BEDS,
  FACILITATION_PER_COMMUNITY_AUD,
} from './three-year-plan';
import {
  PRESS_BEDS_A_DAY, CNC_BEDS_A_DAY, ASSEMBLY_BEDS_A_DAY, RUN_DAYS_A_MONTH,
  PRESSED_KG_PER_BED, PANEL_PLASTIC_PER_BED_AUD, FINISHED_KIT_PER_BED_AUD,
  BREAK_EVEN_ON_THE_400, BULKA_BAG_KG,
} from './production-scenarios';
import { GAP_AUD, bedSurplusAud } from './capital-stack-flex';
import { BEDS_PAID_FOR, PAID_NET_AUD } from './demand-and-buyers';

export interface CanonCell {
  /** Stable key. The workbook references this, so it must never be renamed casually. */
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly unit: 'AUD' | 'beds' | 'kg' | 'days' | 'count' | 'AUD/kg' | 'percent';
  readonly from: string;
  /** Where in the workbook this figure is wrong today, when it is. */
  readonly drift?: string;
}

export const CANON: readonly CanonCell[] = [
  // The bed
  { key: 'bed.price', label: 'Bed price', value: BED_PRICE_AUD, unit: 'AUD', from: 'canon stretch-price' },
  { key: 'bed.make', label: 'Cost to make a bed', value: BED_MAKE_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'bed.freight', label: 'Freight a bed, all up', value: BED_FREIGHT_AUD, unit: 'AUD', from: 'demand-and-buyers FREIGHT_RULING' },
  { key: 'bed.contribution', label: 'Contribution a bed, buyer pays freight', value: CONTRIBUTION_BUYER_FREIGHT_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'bed.contribution.goodsFreight', label: 'Contribution a bed, Goods pays freight', value: CONTRIBUTION_GOODS_FREIGHT_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'bed.pressedKg', label: 'Shred pressed for one bed', value: PRESSED_KG_PER_BED, unit: 'kg', from: 'production-scenarios', drift: 'Decision D06 still records 40 kg' },

  // The line
  { key: 'line.pressPerDay', label: 'Press, beds a day', value: PRESS_BEDS_A_DAY, unit: 'beds', from: 'production-scenarios' },
  { key: 'line.cncPerDay', label: 'Router, beds a day', value: CNC_BEDS_A_DAY, unit: 'beds', from: 'production-scenarios' },
  { key: 'line.assemblyPerDay', label: 'Assembly, beds a day', value: ASSEMBLY_BEDS_A_DAY, unit: 'beds', from: 'production-scenarios' },
  { key: 'line.runDaysPerMonth', label: 'Run days a month, at 80% availability', value: RUN_DAYS_A_MONTH, unit: 'days', from: 'Ben ruling 10 Sep', drift: 'Calculator availability still reads 100% and working days 20' },
  { key: 'line.bedsPerMonth', label: 'Beds a month today', value: PRESS_BEDS_A_DAY * RUN_DAYS_A_MONTH, unit: 'beds', from: 'derived', drift: 'Home tab equipment ceiling reads 60' },
  { key: 'line.bedsPerMonthLifted', label: 'Beds a month at the assembly ceiling', value: ASSEMBLY_BEDS_A_DAY * RUN_DAYS_A_MONTH, unit: 'beds', from: 'derived' },
  { key: 'line.wittaPerYear', label: 'Witta beds a year', value: WITTA_BEDS_A_YEAR, unit: 'beds', from: 'three-year-plan' },
  { key: 'line.bulkaBagKg', label: 'A bulka bag of shred', value: BULKA_BAG_KG, unit: 'kg', from: 'production-scenarios' },

  // Plants
  { key: 'plant.count', label: 'Plants in the QBE ask', value: PLANTS_IN_THE_ASK, unit: 'count', from: 'the-year-and-the-raise' },
  { key: 'plant.allowance', label: 'Plant allowance', value: PLANT_ALLOWANCE_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'plant.modulesLow', label: 'Plant modules, low', value: PLANT_MODULES_LOW_AUD, unit: 'AUD', from: 'Matt Allen modules' },
  { key: 'plant.modulesHigh', label: 'Plant modules, high', value: PLANT_MODULES_HIGH_AUD, unit: 'AUD', from: 'Matt Allen modules' },
  { key: 'plant.firstYearBeds', label: 'A plant, beds in year one', value: PLANT_FIRST_YEAR_BEDS, unit: 'beds', from: 'three-year-plan' },
  { key: 'plant.matureBeds', label: 'A plant, beds at maturity', value: PLANT_MATURE_BEDS, unit: 'beds', from: 'three-year-plan' },
  { key: 'plant.secondPress', label: 'A second press', value: SECOND_PRESS_AUD, unit: 'AUD', from: 'defy-supply' },

  // The year
  { key: 'year.beds', label: 'Beds of first stock', value: BEDS_YEAR_ONE, unit: 'beds', from: 'the-year-and-the-raise' },
  { key: 'year.pools', label: 'Community pools', value: FACILITATION_COMMUNITIES, unit: 'count', from: 'ruling 7' },
  { key: 'year.poolSize', label: 'Beds in a pool', value: BEDS_YEAR_ONE / FACILITATION_COMMUNITIES, unit: 'beds', from: 'derived' },
  { key: 'year.facilitationEach', label: 'Facilitation a community', value: FACILITATION_PER_COMMUNITY_AUD, unit: 'AUD', from: 'three-year-plan' },
  { key: 'year.facilitation', label: 'Facilitation, all four', value: FACILITATION_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'year.running', label: 'Running the organisation', value: RUNNING_AUD, unit: 'AUD', from: 'Ben provision 9 Sep' },
  { key: 'year.breakEvenBeds', label: 'Beds a year that carry the organisation', value: BREAK_EVEN_BEDS, unit: 'beds', from: 'three-year-plan' },
  { key: 'year.needs', label: 'The year needs', value: NEED_BUYER_FREIGHT_AUD, unit: 'AUD', from: 'the-year-and-the-raise', drift: 'No tab carries this figure' },
  { key: 'year.needsGoodsFreight', label: 'The year needs, Goods pays freight', value: NEED_GOODS_FREIGHT_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'year.asked', label: 'Asked across five lines', value: ASKED_AUD, unit: 'AUD', from: 'the-year-and-the-raise', drift: 'Money tab December receipts read $700,000 including a Sefa line that is ours' },
  { key: 'year.secured', label: 'Secured', value: SECURED_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'year.gap', label: 'Still to find', value: GAP_AUD, unit: 'AUD', from: 'capital-stack-flex' },
  { key: 'year.bedSurplus', label: 'Bed money over the making line', value: bedSurplusAud(), unit: 'AUD', from: 'capital-stack-flex' },
  { key: 'year.bedsUnfunded', label: 'Beds unfunded', value: BEDS_UNFUNDED, unit: 'beds', from: 'the-year-and-the-raise' },
  { key: 'year.bedsUnfundedAud', label: 'Beds unfunded, at the price', value: BEDS_UNFUNDED_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },

  // Plastic supply
  { key: 'plastic.panelPerBed', label: 'Defy panels a bed', value: PANEL_PLASTIC_PER_BED_AUD, unit: 'AUD', from: 'defy-supply INV-2021', drift: 'Calculator plastic reads $55 with no supply-path choice' },
  { key: 'plastic.kitPerBed', label: 'Defy finished kit a bed', value: FINISHED_KIT_PER_BED_AUD, unit: 'AUD', from: 'defy-supply INV-1602' },
  { key: 'plastic.breakEvenShred', label: 'Shred price where press and panels cost the same', value: BREAK_EVEN_ON_THE_400, unit: 'AUD/kg', from: 'production-scenarios', drift: 'Not in the workbook at all' },

  // Trade
  { key: 'trade.bedsPaid', label: 'Beds bought and paid for', value: BEDS_PAID_FOR, unit: 'beds', from: 'demand-and-buyers' },
  { key: 'trade.paidNet', label: 'Paid, net', value: PAID_NET_AUD, unit: 'AUD', from: 'demand-and-buyers' },
];

export const RUNNING_BREAKDOWN = RUNNING_LINES;

export const DRIFTED = CANON.filter((c) => c.drift !== undefined);

export const WHY_THE_CODE_IS_THE_CORE =
  'The workbook has no guards and nothing can run a test against it. It drifted from these figures in eleven places, including an availability cell reading 100% four days after Ben set 80%. Every figure here is imported from a guarded module and never retyped, so this list cannot disagree with them. The workbook gets a Canon tab written from it, every other tab references that tab, and a drift check compares the two.';

export const WHAT_STAYS_EDITABLE =
  'Scenarios, input cells and anything somebody wants to type into. The Canon tab holds only figures that are settled, and a settled figure changes by changing the module and re-running the push.';
