/**
 * Buying plastic from Defy, and what it is worth against making it at Witta.
 *
 * Defy Manufacturing in Botany supplies the recycled HDPE the Stretch Bed legs are made from.
 * There are three ways to get that plastic and they cost very different amounts and move at very
 * different speeds. This module holds the invoice evidence for each and the comparison between
 * them, because the choice decides both the bed cost and whether the 400 land in June or August.
 *
 * The three paths
 *   1. FINISHED KIT. Defy presses, cuts and finishes a leg kit. $344.05 a bed, verified on two
 *      invoices. Witta assembles only.
 *   2. PANELS. Defy presses sheets and cuts them to size. Witta routes them to shape and
 *      assembles. This is what INV-2021 buys and what Witta does today.
 *   3. OUR OWN PRESS. Witta shreds and presses its own sheets. Cheapest per bed and the slowest,
 *      because the press is the bottleneck at three beds a day.
 *
 * Sources
 *   - INV-2021, Defy Manufacturing Pty Limited to A Curious Tractor, issued 11 September 2026.
 *   - INV-1602 and INV-1732 for the $344.05 finished kit, already in supplier-quotes.ts.
 *   - Capacity figures from the 80% availability ruling, Ben 10 September 2026.
 */

export const READ_AT = '2026-09-11';

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

export const PANELS_PER_BED = 2;
export const PRESSED_KG_PER_BED = 36;

export const MASS_CHECK =
  'Two 800 by 1200 panels weigh about 34.7 kg, against the 36 kg of shred the workbook says is pressed for one bed. Close enough to confirm that two panels make a bed, and the difference is the offcut the press figure includes.';

// ---------------------------------------------------------------------------
// Cost per bed on each path
// ---------------------------------------------------------------------------

export const SHEET_ALL_IN_AUD = INV_2021.subtotalAud / INV_2021.sheets;
export const PANEL_ALL_IN_AUD = SHEET_ALL_IN_AUD / PANELS_PER_SHEET;
export const PANEL_PATH_PER_BED_AUD = PANEL_ALL_IN_AUD * PANELS_PER_BED;

/** Verified on INV-1602 and INV-1732. */
export const FINISHED_KIT_PER_BED_AUD = 344.05;

/** Raw plastic in a set of legs, modelled, from the cost story. */
export const OWN_PRESS_PLASTIC_LOW_AUD = 40;
export const OWN_PRESS_PLASTIC_HIGH_AUD = 55;

export const PANEL_SAVING_VS_KIT_AUD = FINISHED_KIT_PER_BED_AUD - PANEL_PATH_PER_BED_AUD;

export const OWN_PRESS_SAVING_VS_PANEL_LOW_AUD =
  PANEL_PATH_PER_BED_AUD - OWN_PRESS_PLASTIC_HIGH_AUD;
export const OWN_PRESS_SAVING_VS_PANEL_HIGH_AUD =
  PANEL_PATH_PER_BED_AUD - OWN_PRESS_PLASTIC_LOW_AUD;

export const OWN_PRESS_CEILING =
  'The $40 to $55 is raw plastic only and is modelled, never invoiced. It excludes press time, power, the labour of shredding and the collection that puts feedstock in the bag. Treat it as the floor of the own press path rather than its cost.';

// ---------------------------------------------------------------------------
// What each path does to speed
// ---------------------------------------------------------------------------

export const PRESS_BEDS_A_DAY = 3;
export const CNC_BEDS_A_DAY = 8.56;
export const ASSEMBLY_BEDS_A_DAY = 5;
export const RUN_DAYS_A_MONTH = 16;

export interface SupplyPath {
  readonly id: 'kit' | 'panel' | 'own-press';
  readonly name: string;
  readonly perBedAud: number;
  readonly bedsADay: number;
  readonly limitedBy: string;
  readonly note: string;
}

export const PATHS: readonly SupplyPath[] = [
  {
    id: 'kit',
    name: 'Finished kit from Defy',
    perBedAud: FINISHED_KIT_PER_BED_AUD,
    bedsADay: ASSEMBLY_BEDS_A_DAY,
    limitedBy: 'Assembly at Witta',
    note: 'Defy presses, cuts and finishes. Witta assembles. The most expensive plastic and the least work here. Verified on two invoices.',
  },
  {
    id: 'panel',
    name: 'Panels from Defy, routed at Witta',
    perBedAud: PANEL_PATH_PER_BED_AUD,
    bedsADay: ASSEMBLY_BEDS_A_DAY,
    limitedBy: 'Assembly at Witta',
    note: 'What INV-2021 buys and what Witta does now. The router handles 8.56 beds a day, so it never becomes the constraint. Same speed as the kit path for less money.',
  },
  {
    id: 'own-press',
    name: 'Pressed at Witta from our own shred',
    perBedAud: (OWN_PRESS_PLASTIC_LOW_AUD + OWN_PRESS_PLASTIC_HIGH_AUD) / 2,
    bedsADay: PRESS_BEDS_A_DAY,
    limitedBy: 'One press',
    note: 'The cheapest plastic and the slowest line. Needs 36 kg of shred a bed, so 400 beds is 14.4 tonnes through the shredder before anything is pressed.',
  },
];

export function bedsAMonth(p: SupplyPath): number {
  return p.bedsADay * RUN_DAYS_A_MONTH;
}

export function monthsFor(p: SupplyPath, beds: number): number {
  return beds / bedsAMonth(p);
}

export function plasticCostFor(p: SupplyPath, beds: number): number {
  return p.perBedAud * beds;
}

// ---------------------------------------------------------------------------
// The order in front of us, and the run behind it
// ---------------------------------------------------------------------------

export const BEDS_ON_THIS_INVOICE = Math.floor(PANELS_ON_THE_INVOICE / PANELS_PER_BED);
export const SPARE_PANELS = PANELS_ON_THE_INVOICE - BEDS_ON_THIS_INVOICE * PANELS_PER_BED;

export const ALIVE_BEDS_DUE = 100;
export const FIRST_STOCK_BEDS = 400;

export function sheetsFor(beds: number): number {
  return Math.ceil((beds * PANELS_PER_BED) / PANELS_PER_SHEET);
}

export function panelOrderCostAud(beds: number): number {
  return sheetsFor(beds) * SHEET_ALL_IN_AUD;
}

// ---------------------------------------------------------------------------
// The second press, priced against the panel premium
// ---------------------------------------------------------------------------

export const SECOND_PRESS_AUD = 22_500;

/** Extra paid per bed for buying panels instead of pressing our own, at the cheap end. */
export const PANEL_PREMIUM_PER_BED_AUD = PANEL_PATH_PER_BED_AUD - OWN_PRESS_PLASTIC_HIGH_AUD;

export const PRESS_PAYBACK_BEDS = Math.ceil(SECOND_PRESS_AUD / PANEL_PREMIUM_PER_BED_AUD);

export const THE_TRADE =
  'A second press costs about $22,500 once and takes press capacity to six beds a day, at which point assembly at five a day becomes the constraint and no bought panel adds anything. The panel premium is about $199 a bed, so the press pays for itself in 113 beds, and on the 400 the premium is about $79,800 against $22,500 of machine. The press wins on money. Panels win on time and on feedstock, because they arrive in weeks and need no shred at all.';

export const THE_CATCH =
  'Pressing our own needs feedstock. 400 beds is 14.4 tonnes of shred, which is about 21 bulka bags, and collection is not costed anywhere in the raise. The panel path buys the plastic problem away at a known price.';

// ---------------------------------------------------------------------------
// The correction that matters: panels ADD to the press, they do not replace it
// ---------------------------------------------------------------------------

export const PANELS_ARE_ADDITIVE =
  'Witta is pressing today and burning 450 kg of shred a week, which is about three beds a day and the press running near flat out. Bought panels do not replace that. They go through the router alongside it and lift the line to the assembly ceiling of five a day. The question to answer is whether the two beds a day that only bought panels can make are worth what the panels cost.';

/** The beds a day that exist only because panels were bought. */
export const MARGINAL_BEDS_A_DAY = ASSEMBLY_BEDS_A_DAY - PRESS_BEDS_A_DAY;
export const MARGINAL_BEDS_A_MONTH = MARGINAL_BEDS_A_DAY * RUN_DAYS_A_MONTH;

export const BED_PRICE_AUD = 750;

export const MARGINAL_PANEL_SPEND_A_MONTH_AUD =
  MARGINAL_BEDS_A_MONTH * PANEL_PATH_PER_BED_AUD;
export const MARGINAL_SALES_A_MONTH_AUD = MARGINAL_BEDS_A_MONTH * BED_PRICE_AUD;

export const THE_MARGIN_ANSWER =
  'Thirty two extra beds a month need about $8,142 of panels and sell for $24,000. Even if every other cost of those beds is the full $276 of making, they clear about $220 each. While assembly has idle capacity, buying panels is a margin decision and it is clearly positive.';

export const WHAT_TO_ASK_DEFY: readonly string[] = [
  'Confirm the remaining 80 sheets of the 105 and whether the production slot still stands, because the 4 September deposit date has passed.',
  'Whether the 20% scale discount holds for a 267-sheet order, which is what 400 beds needs.',
  'What the lead time is on 267 sheets, because 21 days on 50 kits is the only lead time we have on record.',
  'Whether they will quote cutting to the finished leg profile rather than to 800 by 1200, and what that does to the $344.05 kit price.',
];
