/**
 * Current dispatch route, corrected by Ben on 12 September 2026.
 * Tabs are pressed here; leg sheets are bought. Kits are flat packed and sent
 * to community, where young people assemble them. Factory capacity ends at dispatch.
 */
export const ROUTE_READ_AT = '2026-09-12';
export const ROUTE_RULING =
  'Ben, 12 September 2026: press the tab sheets only, buy the leg sheets, and dispatch flat-packed kits for young people to assemble in community.';
export const PRESS_SHEETS_A_DAY = 6;
export const PRESSED_SHEETS_PER_KIT = 1;
export const CNC_KITS_A_DAY = 8.56;
/** A current workbook planning input, not a measured production-run result. */
export const TAB_SHEET_GROSS_KG = 15;
export const TAB_MASS_BASIS = 'Capacity B39: Ben 9 September, 15 kg per tab sheet; still to weigh.';
export const PLANNING_DAYS_A_MONTH = 20;
export const AVAILABILITY = 0.8;
export const RUN_DAYS_A_MONTH = PLANNING_DAYS_A_MONTH * AVAILABILITY;
export const ASSEMBLY_LOCATION = 'In community';
/** Null means this stage does not constrain factory dispatch, never zero output. */
export const FACTORY_ASSEMBLY_LIMIT = null;
export const BOUGHT_LEG_PANEL_YIELD = null;
export const BOUGHT_LEG_COST_STATUS = 'Needs panel yield';
export const SHRED_BREAK_EVEN_STATUS = 'Needs route costing';
export const BATCH_COST_STATUS = 'Provisional: bought legs and tab production need costing';

export function factoryKitsADay(presses = 1): number {
  if (!Number.isFinite(presses) || presses < 0) throw new RangeError('Invalid press count');
  return Math.min(PRESS_SHEETS_A_DAY * presses / PRESSED_SHEETS_PER_KIT, CNC_KITS_A_DAY);
}
export function factoryKitsAMonth(presses = 1): number {
  return Math.floor(factoryKitsADay(presses) * RUN_DAYS_A_MONTH);
}
