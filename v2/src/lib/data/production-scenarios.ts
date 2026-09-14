/**
 * Flat-packed kits from the current production facility.
 * Ben corrected the route on 12 September: tabs pressed here, legs bought,
 * assembly by young people in community. A bought leg panel is not another
 * complete bed and cannot be added to tab output.
 */
import {
  ROUTE_READ_AT, ROUTE_RULING, PRESS_SHEETS_A_DAY, PRESSED_SHEETS_PER_KIT,
  CNC_KITS_A_DAY, TAB_SHEET_GROSS_KG, RUN_DAYS_A_MONTH as ROUTE_RUN_DAYS,
  ASSEMBLY_LOCATION, FACTORY_ASSEMBLY_LIMIT, BOUGHT_LEG_COST_STATUS,
  SHRED_BREAK_EVEN_STATUS, factoryKitsADay, factoryKitsAMonth,
} from './production-route';
export { ROUTE_RULING, PRESS_SHEETS_A_DAY, PRESSED_SHEETS_PER_KIT, ASSEMBLY_LOCATION,
  BOUGHT_LEG_COST_STATUS, SHRED_BREAK_EVEN_STATUS };
export const READ_AT = ROUTE_READ_AT;
export const PRESS_BEDS_A_DAY = PRESS_SHEETS_A_DAY / PRESSED_SHEETS_PER_KIT;
export const CNC_BEDS_A_DAY = CNC_KITS_A_DAY;
export const ASSEMBLY_BEDS_A_DAY = FACTORY_ASSEMBLY_LIMIT;
export const RUN_DAYS_A_MONTH = ROUTE_RUN_DAYS;
export const AVAILABILITY_RULING =
  'Twenty planning days at 80% availability give sixteen run days. Ben set the 80% on 10 September 2026.';
export const PRESSED_KG_PER_BED = TAB_SHEET_GROSS_KG;
export const BED_PRICE_AUD = 750;
/** Invoice cost per purchased leg kit cannot be derived before panel yield is confirmed. */
export const PANEL_PLASTIC_PER_BED_AUD: number | null = null;
/** Supplier finished leg kit only; excludes factory tab production and other bed parts. */
export const FINISHED_KIT_PER_BED_AUD = 344.05;
/** Ben, 15 September 2026: no second press. Two-press scenarios carry no priced capital. */
export const SECOND_PRESS_STATUS = 'Ruled out by Ben on 15 September 2026; see YIELD_IMPROVEMENTS in the-year-and-the-raise';
export const BULKA_BAG_KG = 1_000;

export type DefyChoice = 'panels' | 'kits';
export type WittaChoice = 'one-press' | 'two-presses';
export interface Scenario {
  readonly id: string;
  readonly name: string;
  readonly defy: DefyChoice;
  readonly witta: WittaChoice;
  readonly what: string;
}
export const SCENARIOS: readonly Scenario[] = [
  { id: 'A', name: 'Tabs pressed here, leg panels bought', defy: 'panels', witta: 'one-press',
    what: 'Current route. One pressed tab sheet per kit. Leg panels are bought, routed and packed with the tabs and other parts. Young people assemble in community.' },
  { id: 'B', name: 'More bought leg panels, same press', defy: 'panels', witta: 'one-press',
    what: 'Additional leg stock can remove a material shortage but does not increase tab-press capacity.' },
  { id: 'C', name: 'Two tab presses, leg panels bought', defy: 'panels', witta: 'two-presses',
    what: 'Two presses can feed the router to its entered rate. Bought legs, feedstock, staffing and packing still need to support dispatch.' },
  { id: 'D', name: 'Two tab presses and more leg stock', defy: 'panels', witta: 'two-presses',
    what: 'Same equipment rate as C. Extra purchased stock affects supply coverage, not the router rate.' },
  { id: 'E', name: 'Tabs pressed here, finished leg kits bought', defy: 'kits', witta: 'one-press',
    what: 'Defy supplies finished legs. The tab sheets are still pressed here. Kits are dispatched for community assembly.' },
];
export function pressBedsADay(s: Scenario): number {
  return PRESS_BEDS_A_DAY * (s.witta === 'two-presses' ? 2 : 1);
}
export function bedsADay(s: Scenario): number {
  return factoryKitsADay(s.witta === 'two-presses' ? 2 : 1);
}
export function bedsAMonth(s: Scenario): number {
  return factoryKitsAMonth(s.witta === 'two-presses' ? 2 : 1);
}
export function limitedBy(s: Scenario): string {
  return pressBedsADay(s) <= CNC_BEDS_A_DAY ? 'Tab press' : 'The router';
}
/** All kits need bought legs. These are the SAME kits counted by pressedBedsAMonth. */
export function boughtBedsAMonth(s: Scenario): number { return bedsAMonth(s); }
/** All kits need a factory-pressed tab sheet; never add this to boughtBedsAMonth. */
export function pressedBedsAMonth(s: Scenario): number { return bedsAMonth(s); }
export function shredKgAMonth(s: Scenario): number { return bedsAMonth(s) * PRESSED_KG_PER_BED; }
export function boughtPlasticPerBedAud(s: Scenario): number | null {
  return s.defy === 'kits' ? FINISHED_KIT_PER_BED_AUD : PANEL_PLASTIC_PER_BED_AUD;
}
export function boughtPlasticAMonthAud(s: Scenario): number | null {
  const unit = boughtPlasticPerBedAud(s);
  return unit === null ? null : bedsAMonth(s) * unit;
}
/** Null for a two-press scenario: the press is ruled out and carries no price. */
export function capitalAud(s: Scenario): number | null { return s.witta === 'two-presses' ? null : 0; }
export const FIRST_STOCK_BEDS = 400;
export const ALIVE_BEDS = 100;
export function monthsFor(s: Scenario, beds: number): number { return beds / bedsAMonth(s); }
export function boughtBedsOverRun(_s: Scenario, beds: number): number { return beds; }
export function shredKgOverRun(_s: Scenario, beds: number): number { return beds * PRESSED_KG_PER_BED; }
export function bagsOverRun(s: Scenario, beds: number): number { return shredKgOverRun(s, beds) / BULKA_BAG_KG; }
/** Bought legs plus capital only. Null preserves the missing panel-to-kit yield. */
export function knownSpendOverRun(s: Scenario, beds: number): number | null {
  const unit = boughtPlasticPerBedAud(s);
  const capital = capitalAud(s);
  return unit === null || capital === null ? null : beds * unit + capital;
}
/** The retired calculation compared purchased legs with tab pressing as substitutes. */
export function breakEvenShredPriceKg(_beds: number): null { return null; }
export const BREAK_EVEN_ON_THE_400 = breakEvenShredPriceKg(FIRST_STOCK_BEDS);
export const PANEL_MATERIAL_PER_KG_AUD = 356.88 / 51.98;
export const PANEL_ALL_IN_PER_KG_AUD = 381.68 / 51.98;
export const THE_MISSING_NUMBER =
  'Quotes QU0494 and QU0495 are still needed for current shred pricing. Confirm the number of leg sets cut from each invoiced panel, then cost purchased legs and factory tab production separately.';
export const THE_RULE_OF_THUMB =
  'The previous shred break-even is withdrawn. Purchased leg panels and pressed tab sheets are complementary inputs, not alternative ways to make an entire kit.';
export const WHAT_THE_PRESS_DOES_NOT_SOLVE =
  'A second tab press still needs bought legs, sufficient shred, staff and packing capacity. Its modelled ceiling is the router; community assembly is separate. The tab sheet mass remains a planning assumption until weighed.';
export const DO_NOT_DO_BOTH =
  'Compare a second tab press with the actual tab bottleneck. Bought leg stock is needed on both routes and must never be counted as extra complete kits.';
