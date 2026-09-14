/**
 * Defy invoice evidence and the current purchased-leg supply route.
 * Ben, 12 September: only tab sheets are pressed here. Leg sheets are bought,
 * routed and flat packed; young people assemble the kits in community.
 * Invoice sheet quantities do not establish the number of leg sets per panel.
 */
import {
  ROUTE_READ_AT, PRESS_SHEETS_A_DAY, PRESSED_SHEETS_PER_KIT, CNC_KITS_A_DAY,
  TAB_SHEET_GROSS_KG, RUN_DAYS_A_MONTH as ROUTE_RUN_DAYS,
  FACTORY_ASSEMBLY_LIMIT, BOUGHT_LEG_PANEL_YIELD,
} from './production-route';

export const READ_AT = ROUTE_READ_AT;

// ---------------------------------------------------------------------------
// INV-2021, read off the invoice
// ---------------------------------------------------------------------------

export const INV_2021 = {
  number: 'INV-2021',
  supplier: 'Defy Manufacturing Pty Limited',
  supplierAbn: '48 644 178 423',
  billedTo: 'A Curious Tractor',
  reference: '105 x 19mm Panels',
  issued: '2026-09-11',
  due: '2026-09-18',
  sheets: 25,
  sheetSizeMm: { w: 1200, l: 2400, t: 19 },
  sheetListPriceAud: 446.1,
  scaleDiscount: 0.2,
  sheetNetPriceAud: 356.88,
  panelLineAud: 8_922,
  discountGivenAud: 2_230.5,
  cutToMm: { w: 800, l: 1200 },
  cuttingPerSheetAud: 20,
  cuttingLineAud: 500,
  palletCount: 2,
  palletEachAud: 60,
  palletLineAud: 120,
  subtotalAud: 9_542,
  gstAud: 954.2,
  totalAud: 10_496.2,
  terms: 'Work commences after receipt of payment. Card payments carry a 1.7% Stripe fee.',
} as const;

/** The reference line and the quantities do not agree. */
export const PANELS_PER_SHEET =
  (INV_2021.sheetSizeMm.l / INV_2021.cutToMm.w) * (INV_2021.sheetSizeMm.w / INV_2021.cutToMm.l);

export const PANELS_ON_THE_INVOICE = INV_2021.sheets * PANELS_PER_SHEET;

/**
 * The 105 in the reference is the parent order, resolved from the email thread on 11 September.
 * Nic asked Sam Davies on 26 August 2026 for "another 105 sheets and 8 bulka bags". So 105 counts
 * SHEETS, and this invoice is 25 of them. Sam's covering note calls it "another 25 panels", using
 * panel and sheet interchangeably, which is where the confusion comes from.
 */
export const REFERENCE_RESOLVED =
  'The reference reads "105 x 19mm Panels" and bills 25 sheets. The 105 is the parent order Nic asked for on 26 August, 105 sheets and 8 bulka bags of shred. This invoice is 25 sheets of that, so 80 sheets are still to come.';

export const PARENT_ORDER_SHEETS = 105;
export const PARENT_ORDER_BULKA_BAGS = 8;
export const SHEETS_STILL_TO_COME = PARENT_ORDER_SHEETS - INV_2021.sheets;

/** Sam Davies, 27 August 2026. */
export const SLOT_TERMS =
  'Defy needed the order confirmed and deposits paid by 4 September to hold the production slot, then held it seven more days from 28 August. Both quotes, QU0494 and QU0495, complete late October to early November. Xanthe Mitchell runs panel operations and was still to confirm timing.';

/** Nic to Sam, 28 August 2026. */
export const SHRED_BURN_KG_A_WEEK = 450;
export const SHRED_WEEKS_LEFT_AT_28_AUG = 3;
export const SHRED_RUNS_OUT = '2026-09-18';

export const SHRED_WARNING =
  'Nic told Defy on 28 August that Witta burns about 450 kg of shred a week and had three weeks of stock. That runs out on 18 September, which is the same day this invoice falls due.';

/** A bulka bag, from the 630-beds-against-Witta reckoning of 21 bags for 22,680 kg. */
export const BULKA_BAG_KG = 1_000;

// ---------------------------------------------------------------------------
// What a panel is, and how many a bed takes
// ---------------------------------------------------------------------------

/** Recycled HDPE, near enough for a mass check. */
export const HDPE_DENSITY_KG_M3 = 950;

function massKg(w: number, l: number, t: number): number {
  return (w / 1000) * (l / 1000) * (t / 1000) * HDPE_DENSITY_KG_M3;
}

export const SHEET_MASS_KG = massKg(1200, 2400, 19);
export const PANEL_MASS_KG = massKg(800, 1200, 19);

export const PANELS_PER_BED: number | null = BOUGHT_LEG_PANEL_YIELD === null ? null : 1 / BOUGHT_LEG_PANEL_YIELD;
export const PRESSED_KG_PER_BED = TAB_SHEET_GROSS_KG;

export const MASS_CHECK =
  'Panel dimensions establish panel mass, not leg yield. The previous two-panels-per-bed inference is withdrawn. Confirm how many leg sets come from an 800 by 1200 panel. Factory press mass counts the tab sheet only.';

// ---------------------------------------------------------------------------
// Cost per bed on each path
// ---------------------------------------------------------------------------

export const SHEET_ALL_IN_AUD = INV_2021.subtotalAud / INV_2021.sheets;
export const PANEL_ALL_IN_AUD = SHEET_ALL_IN_AUD / PANELS_PER_SHEET;
export const PANEL_PATH_PER_BED_AUD = PANELS_PER_BED === null ? null : PANEL_ALL_IN_AUD * PANELS_PER_BED;

/** Verified on INV-1602 and INV-1732. */
export const FINISHED_KIT_PER_BED_AUD = 344.05;

/** Raw plastic in a set of legs, modelled, from the cost story. */
export const OWN_PRESS_PLASTIC_LOW_AUD = 40;
export const OWN_PRESS_PLASTIC_HIGH_AUD = 55;

export const PANEL_SAVING_VS_KIT_AUD = PANEL_PATH_PER_BED_AUD === null ? null : FINISHED_KIT_PER_BED_AUD - PANEL_PATH_PER_BED_AUD;

/** Withdrawn: the old comparison substituted tab pressing for bought legs. */
export const OWN_PRESS_SAVING_VS_PANEL_LOW_AUD = null;
export const OWN_PRESS_SAVING_VS_PANEL_HIGH_AUD = null;
export const OWN_PRESS_CEILING =
  'The former $40 to $55 raw-plastic floor was modelled for another route. It is not the cost of bought legs plus pressed tabs. Current hybrid production needs its own BOM; do not use the legacy floor as a complete kit cost.';

// ---------------------------------------------------------------------------
// What each path does to speed
// ---------------------------------------------------------------------------

export const PRESS_BEDS_A_DAY = PRESS_SHEETS_A_DAY / PRESSED_SHEETS_PER_KIT;
export const CNC_BEDS_A_DAY = CNC_KITS_A_DAY;
export const ASSEMBLY_BEDS_A_DAY = FACTORY_ASSEMBLY_LIMIT;
export const RUN_DAYS_A_MONTH = ROUTE_RUN_DAYS;

export interface SupplyPath {
  readonly id: 'kit' | 'panel' | 'own-press';
  readonly name: string;
  /** Purchased leg cost only, not the complete bed-kit cost. */
  readonly perBedAud: number | null;
  readonly bedsADay: number;
  readonly limitedBy: string;
  readonly note: string;
}
export const PATHS: readonly SupplyPath[] = [
  { id: 'kit', name: 'Finished leg kit from Defy; tabs pressed here',
    perBedAud: FINISHED_KIT_PER_BED_AUD, bedsADay: Math.min(PRESS_BEDS_A_DAY, CNC_BEDS_A_DAY),
    limitedBy: 'Tab press',
    note: 'Supplier leg-kit price only. Tabs and other parts are additional. Flat-packed dispatch precedes community assembly.' },
  { id: 'panel', name: 'Leg panels from Defy; tabs pressed here',
    perBedAud: PANEL_PATH_PER_BED_AUD, bedsADay: Math.min(PRESS_BEDS_A_DAY, CNC_BEDS_A_DAY),
    limitedBy: 'Tab press',
    note: 'Current route. The invoice proves the panel price; leg sets per panel still need confirmation. Bought legs and pressed tabs belong to the same kits.' },
  { id: 'own-press', name: 'Tab production within the purchased-leg route',
    perBedAud: null, bedsADay: Math.min(PRESS_BEDS_A_DAY, CNC_BEDS_A_DAY),
    limitedBy: 'Tab press',
    note: 'This is the tab stage of the same route, not an alternative to buying legs. Never add its output to the panel-path output.' },
];
export function bedsAMonth(p: SupplyPath): number { return Math.floor(p.bedsADay * RUN_DAYS_A_MONTH); }
export function monthsFor(p: SupplyPath, beds: number): number { return beds / bedsAMonth(p); }
export function plasticCostFor(p: SupplyPath, beds: number): number | null {
  return p.perBedAud === null ? null : p.perBedAud * beds;
}

// ---------------------------------------------------------------------------
// The order in front of us, and the run behind it
// ---------------------------------------------------------------------------

export const BEDS_ON_THIS_INVOICE = PANELS_PER_BED === null ? null : Math.floor(PANELS_ON_THE_INVOICE / PANELS_PER_BED);
export const SPARE_PANELS = PANELS_PER_BED === null || BEDS_ON_THIS_INVOICE === null ? null : PANELS_ON_THE_INVOICE - BEDS_ON_THIS_INVOICE * PANELS_PER_BED;
export const ALIVE_BEDS_DUE = 100;
export const FIRST_STOCK_BEDS = 400;

/** Explicit yield input allows a confirmed cut plan to determine a purchase quantity. */
export function sheetsFor(beds: number, kitsPerPanel: number | null = BOUGHT_LEG_PANEL_YIELD): number | null {
  if (kitsPerPanel === null) return null;
  if (!Number.isFinite(kitsPerPanel) || kitsPerPanel <= 0 || !Number.isFinite(beds) || beds < 0) throw new RangeError('Invalid panel yield or kit count');
  return Math.ceil(beds / kitsPerPanel / PANELS_PER_SHEET);
}
export function panelOrderCostAud(beds: number, kitsPerPanel: number | null = BOUGHT_LEG_PANEL_YIELD): number | null {
  const sheets = sheetsFor(beds, kitsPerPanel);
  return sheets === null ? null : sheets * SHEET_ALL_IN_AUD;
}
/** Ben, 15 September 2026: no second press. */
export const SECOND_PRESS_STATUS = 'Ruled out by Ben on 15 September 2026; see YIELD_IMPROVEMENTS in the-year-and-the-raise';
export const PANEL_PREMIUM_PER_BED_AUD = null;
export const PRESS_PAYBACK_BEDS = null;
export const THE_TRADE =
  'A second tab press raises modelled dispatch to the router rate. It does not replace purchased legs. The old panel-premium payback is withdrawn until the corrected route is costed.';
export const THE_CATCH =
  'At the current planning mass, 400 tab sheets require 6 tonnes through the factory press. Bought leg material is additional. Recovery has not been credited and collection is not costed.';
export const PANELS_ARE_ADDITIVE =
  'Bought leg panels and pressed tab sheets are complementary parts of the same bed kit. Extra leg panels can cover a supply shortage, but cannot be counted as extra finished kits above tab capacity.';
export const MARGINAL_BEDS_A_DAY = 0;
export const MARGINAL_BEDS_A_MONTH = MARGINAL_BEDS_A_DAY * RUN_DAYS_A_MONTH;
export const BED_PRICE_AUD = 750;
export const MARGINAL_PANEL_SPEND_A_MONTH_AUD = null;
export const MARGINAL_SALES_A_MONTH_AUD = MARGINAL_BEDS_A_MONTH * BED_PRICE_AUD;
export const THE_MARGIN_ANSWER =
  'No additional complete kits arise from adding leg panels to a tab-constrained line. Price bought legs and tab production separately before claiming a per-kit margin.';
export const WHAT_TO_ASK_DEFY: readonly string[] = [
  'Confirm the remaining 80 sheets of the 105 and the current production slot.',
  'Confirm how many complete leg sets come from one 800 by 1200 panel.',
  'Confirm current shred prices and the quantities and timing on QU0494 and QU0495.',
  'Confirm what the finished leg-kit price includes; factory tabs and other bed parts remain separate.',
];
