/**
 * The one list of figures the live workbook is allowed to hold.
 *
 * Ben, 12 September 2026: make the sheet the core that aligns all numbers at all times.
 *
 * The sheet cannot be that core, and it is worth saying why. It has no guards and nobody can run a
 * test against it. On 10 September it had drifted from the modules in eleven places, including an
 * availability cell reading 100% four days after Ben set 80%. A surface that anyone can edit and
 * nothing can check will always drift, and the point is not that it did once: it is that nothing
 * would have told you.
 *
 * As at 12 September the workbook is back in step, rebuilt to the flat-pack route, and the Canon tab
 * matches these figures except for the three added that day. The `drift` field below is the record
 * of what is out of step RIGHT NOW, so it is cleared as each one is fixed. A stale drift note is the
 * same failure in the other direction: canon asserting the sheet is wrong after somebody fixed it.
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
  BED_PRICE_AUD, BED_MAKE_AUD, BED_FREIGHT_AUD, FACILITATION_PER_BED_AUD, CONTRIBUTION_AUD,
  RUNNING_AUD, RUNNING_LINES, PLANTS_IN_THE_ASK, PLANT_ALLOWANCE_AUD,
  PLANT_MODULES_LOW_AUD, PLANT_MODULES_HIGH_AUD, BEDS_YEAR_ONE,
  FACILITATION_COMMUNITIES, FACILITATION_AUD, FREIGHT_ON_THE_YEAR_AUD,
  NEED_AUD, ORGANISATION_NEED_AUD, ORGANISATION_FROM_BEDS_AUD, ORGANISATION_SHORT_AUD,
  ASKED_AUD, SECURED_AUD,
  BEDS_UNFUNDED, BEDS_UNFUNDED_AUD, BEDS_TO_FIND, BEDS_TO_FIND_AUD,
  BED_MAKE_STATUS, KITS_A_DAY, LABOUR_AUD, YIELD_IMPROVEMENTS, YIELD_IMPROVEMENTS_TOTAL_AUD,
} from './the-year-and-the-raise';
import {
  BREAK_EVEN_BEDS, WITTA_BEDS_A_YEAR, PLANT_FIRST_YEAR_BEDS, PLANT_MATURE_BEDS,
  FACILITATION_PER_COMMUNITY_AUD,
} from './three-year-plan';
import {
  PRESS_BEDS_A_DAY, CNC_BEDS_A_DAY, ASSEMBLY_LOCATION, RUN_DAYS_A_MONTH,
  PRESS_SHEETS_A_DAY, PRESSED_SHEETS_PER_KIT, BOUGHT_LEG_COST_STATUS, SHRED_BREAK_EVEN_STATUS,
  PRESSED_KG_PER_BED, PANEL_PLASTIC_PER_BED_AUD, FINISHED_KIT_PER_BED_AUD,
  BULKA_BAG_KG,
} from './production-scenarios';
import { BATCH_COST_STATUS, BOUGHT_LEG_PANEL_YIELD } from './production-route';
import { PANEL_ALL_IN_AUD } from './defy-supply';
import { GAP_AUD, OPERATING_SHORTFALL_AUD, bedSurplusAud } from './capital-stack-flex';
import { BEDS_PAID_FOR, PAID_NET_AUD, PAID_INCL_GST_AUD } from './demand-and-buyers';

export interface CanonCell {
  /** Stable key. The workbook references this, so it must never be renamed casually. */
  readonly key: string;
  readonly label: string;
  readonly value: number | string;
  readonly unit: 'AUD' | 'beds' | 'kg' | 'days' | 'count' | 'AUD/kg' | 'percent' | 'status';
  readonly from: string;
  /** Where in the workbook this figure is wrong today, when it is. */
  readonly drift?: string;
}

export const CANON: readonly CanonCell[] = [
  // The bed
  { key: 'bed.price', label: 'Bed price', value: BED_PRICE_AUD, unit: 'AUD', from: 'canon stretch-price' },
  { key: 'bed.make', label: 'Making cost, derived from components at six kits a day; provisional', value: BED_MAKE_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep' },
  { key: 'bed.makeStatus', label: 'Status of the making cost', value: BED_MAKE_STATUS, unit: 'status', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet' },
  { key: 'bed.kitsPerDay', label: 'Kits a day the making cost divides labour by', value: KITS_A_DAY, unit: 'beds', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet' },
  { key: 'bed.labour', label: 'Factory labour a bed, $400 a day over the kits a day', value: LABOUR_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet' },
  { key: 'bed.freight', label: 'Freight a bed, all up, absorbed by the organisation', value: BED_FREIGHT_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep' },
  { key: 'bed.facilitationPerBed', label: 'Facilitation a bed, absorbed by the organisation', value: FACILITATION_PER_BED_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet' },
  { key: 'bed.contribution', label: 'Provisional contribution after making, freight and facilitation', value: CONTRIBUTION_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep' },
  { key: 'bed.pressedKg', label: 'Gross tab shred per dispatched kit', value: PRESSED_KG_PER_BED, unit: 'kg', from: 'production-scenarios' },

  // The line
  { key: 'line.pressPerDay', label: 'Tab press, kits a day', value: PRESS_BEDS_A_DAY, unit: 'beds', from: 'production-scenarios' },
  { key: 'line.cncPerDay', label: 'Router, kits a day', value: CNC_BEDS_A_DAY, unit: 'beds', from: 'production-scenarios' },
  { key: 'line.assemblyPerDay', label: 'Assembly location; no factory limit', value: ASSEMBLY_LOCATION, unit: 'status', from: 'production-scenarios' },
  { key: 'line.runDaysPerMonth', label: 'Run days a month, at 80% availability', value: RUN_DAYS_A_MONTH, unit: 'days', from: 'Ben ruling 10 Sep' },
  { key: 'line.bedsPerMonth', label: 'Flat-packed kits a month today', value: PRESS_BEDS_A_DAY * RUN_DAYS_A_MONTH, unit: 'beds', from: 'derived' },
  { key: 'line.bedsPerMonthLifted', label: 'Kits a month at the router ceiling', value: Math.floor(CNC_BEDS_A_DAY * RUN_DAYS_A_MONTH), unit: 'beds', from: 'derived' },
  { key: 'line.wittaPerYear', label: 'Current facility kits a year, modelled', value: WITTA_BEDS_A_YEAR, unit: 'beds', from: 'three-year-plan' },
  { key: 'line.bulkaBagKg', label: 'A bulka bag of shred', value: BULKA_BAG_KG, unit: 'kg', from: 'production-scenarios' },

  { key: 'line.pressSheetsPerDay', label: 'Tab sheets pressed each productive day', value: PRESS_SHEETS_A_DAY, unit: 'count', from: 'production-route Ben 12 Sep' },
  { key: 'line.pressedSheetsPerKit', label: 'Pressed tab sheets per dispatched kit', value: PRESSED_SHEETS_PER_KIT, unit: 'count', from: 'production-route Ben 12 Sep' },
  { key: 'bed.costStatus', label: 'Status of the current route cost', value: BATCH_COST_STATUS, unit: 'status', from: 'production-route Ben 12 Sep' },

  { key: 'plastic.panelEach', label: 'Invoiced 800 x 1200 panel, ex GST', value: PANEL_ALL_IN_AUD, unit: 'AUD', from: 'defy-supply INV-2021' },
  { key: 'plastic.kitsPerPanel', label: 'Leg kits per purchased panel', value: BOUGHT_LEG_PANEL_YIELD ?? BOUGHT_LEG_COST_STATUS, unit: 'status', from: 'production-route awaiting cut yield' },

  // Plants
  { key: 'plant.count', label: 'Plants in the QBE ask', value: PLANTS_IN_THE_ASK, unit: 'count', from: 'the-year-and-the-raise' },
  { key: 'plant.allowance', label: 'Plant allowance', value: PLANT_ALLOWANCE_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'plant.modulesLow', label: 'Plant modules, low', value: PLANT_MODULES_LOW_AUD, unit: 'AUD', from: 'Matt Allen modules' },
  { key: 'plant.modulesHigh', label: 'Plant modules, high', value: PLANT_MODULES_HIGH_AUD, unit: 'AUD', from: 'Matt Allen modules' },
  { key: 'plant.firstYearBeds', label: 'A plant, beds in year one', value: PLANT_FIRST_YEAR_BEDS, unit: 'beds', from: 'three-year-plan' },
  { key: 'plant.matureBeds', label: 'A plant, beds at maturity', value: PLANT_MATURE_BEDS, unit: 'beds', from: 'three-year-plan' },
  { key: 'plant.yieldImprovements', label: 'Yield improvements listed, none quoted yet', value: YIELD_IMPROVEMENTS.length, unit: 'count', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet; replaces the second press cell' },
  { key: 'plant.yieldImprovementsQuoted', label: 'Yield improvements, quoted items only', value: YIELD_IMPROVEMENTS_TOTAL_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet; replaces the second press cell' },

  // The year
  { key: 'year.beds', label: 'Beds of first stock', value: BEDS_YEAR_ONE, unit: 'beds', from: 'the-year-and-the-raise' },
  { key: 'year.pools', label: 'Community pools', value: FACILITATION_COMMUNITIES, unit: 'count', from: 'ruling 7' },
  { key: 'year.poolSize', label: 'Beds in a pool', value: BEDS_YEAR_ONE / FACILITATION_COMMUNITIES, unit: 'beds', from: 'derived' },
  { key: 'year.facilitationEach', label: 'Facilitation a community', value: FACILITATION_PER_COMMUNITY_AUD, unit: 'AUD', from: 'three-year-plan' },
  { key: 'year.facilitation', label: 'Facilitation, all four', value: FACILITATION_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'year.running', label: 'Running the organisation', value: RUNNING_AUD, unit: 'AUD', from: 'Ben provision 9 Sep, cut 15 Sep' },
  { key: 'year.freight', label: 'Freight on the year, absorbed by the organisation', value: FREIGHT_ON_THE_YEAR_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet' },
  { key: 'year.breakEvenBeds', label: 'Beds a year that carry the organisation', value: BREAK_EVEN_BEDS, unit: 'beds', from: 'three-year-plan' },
  { key: 'year.needs', label: 'The year needs', value: NEED_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'year.organisationNeed', label: 'The organisation pays: running, facilitation and freight', value: ORGANISATION_NEED_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet' },
  { key: 'year.organisationFromBeds', label: 'What 400 beds hand the organisation', value: ORGANISATION_FROM_BEDS_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet' },
  { key: 'year.organisationShort', label: 'Running cost less what 400 beds hand back', value: ORGANISATION_SHORT_AUD, unit: 'AUD', from: 'the-year-and-the-raise, Ben 15 Sep', drift: 'Not in the Canon tab yet' },
  { key: 'year.asked', label: 'Asked across five lines', value: ASKED_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'year.secured', label: 'Secured', value: SECURED_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'year.gap', label: 'Still to find', value: GAP_AUD, unit: 'AUD', from: 'capital-stack-flex' },
  { key: 'year.operatingShort', label: 'Operating line, short', value: OPERATING_SHORTFALL_AUD, unit: 'AUD', from: 'capital-stack-flex', drift: 'Not in the Canon tab yet' },
  { key: 'year.bedSurplus', label: 'Bed money over the making line', value: bedSurplusAud(), unit: 'AUD', from: 'capital-stack-flex' },
  { key: 'year.bedsUnfunded', label: 'Beds unfunded', value: BEDS_UNFUNDED, unit: 'beds', from: 'the-year-and-the-raise' },
  { key: 'year.bedsUnfundedAud', label: 'Beds unfunded, at the price', value: BEDS_UNFUNDED_AUD, unit: 'AUD', from: 'the-year-and-the-raise' },
  { key: 'year.bedsToFind', label: 'Beds still to find', value: BEDS_TO_FIND, unit: 'beds', from: 'the-year-and-the-raise', drift: 'Not in the Canon tab yet' },
  { key: 'year.bedsToFindAud', label: 'Beds still to find, at the price', value: BEDS_TO_FIND_AUD, unit: 'AUD', from: 'the-year-and-the-raise', drift: 'Not in the Canon tab yet' },

  // Plastic supply
  { key: 'plastic.panelPerBed', label: 'Bought leg panels per kit: cost status', value: PANEL_PLASTIC_PER_BED_AUD ?? BOUGHT_LEG_COST_STATUS, unit: 'status', from: 'defy-supply INV-2021' },
  { key: 'plastic.kitPerBed', label: 'Defy finished leg kit, excluding tabs', value: FINISHED_KIT_PER_BED_AUD, unit: 'AUD', from: 'defy-supply INV-1602' },
  { key: 'plastic.breakEvenShred', label: 'Shred break-even: withdrawn for old route', value: SHRED_BREAK_EVEN_STATUS, unit: 'status', from: 'production-scenarios' },

  // Trade
  { key: 'trade.bedsPaid', label: 'Beds bought and paid for', value: BEDS_PAID_FOR, unit: 'beds', from: 'demand-and-buyers' },
  { key: 'trade.paidNet', label: 'Paid, net', value: PAID_NET_AUD, unit: 'AUD', from: 'demand-and-buyers' },
  { key: 'trade.paidInclGst', label: 'Paid, including GST', value: PAID_INCL_GST_AUD, unit: 'AUD', from: 'demand-and-buyers', drift: 'Not in the Canon tab yet' },
];

export const RUNNING_BREAKDOWN = RUNNING_LINES;

export const DRIFTED = CANON.filter((c) => c.drift !== undefined);

export const WHY_THE_CODE_IS_THE_CORE =
  'The workbook has no guards and nothing can run a test against it. It drifted from these figures in eleven places, including an availability cell reading 100% four days after Ben set 80%. Every figure here is imported from a guarded module and never retyped, so this list cannot disagree with them. The workbook gets a Canon tab written from it, every other tab references that tab, and a drift check compares the two.';

export const WHAT_STAYS_EDITABLE =
  'Scenarios, input cells and anything somebody wants to type into. The Canon tab holds only figures that are settled, and a settled figure changes by changing the module and re-running the push.';
