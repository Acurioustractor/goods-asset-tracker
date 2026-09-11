/**
 * How fast Witta can make beds, and what each way of getting there costs.
 *
 * Three machines and one choice. The press makes three beds a day, the router 8.56 and assembly
 * five, so the press is the constraint and the line runs at three. There are two ways to lift it
 * to the assembly ceiling of five, and they cost very different things:
 *
 *   BUY PANELS from Defy, which arrive ready to route and need no shred at all.
 *   BUY A SECOND PRESS, which is a one-off and needs 66% more shred a month to feed it.
 *
 * Doing both buys nothing, because assembly caps the line at five a day either way.
 *
 * The decision turns on the price of a bulka bag of shred, which we do not have. Quotes QU0494 and
 * QU0495 carry it. `breakEvenShredPriceKg` says what that price has to beat.
 */

export const READ_AT = '2026-09-11';

// ---------------------------------------------------------------------------
// The line
// ---------------------------------------------------------------------------

export const PRESS_BEDS_A_DAY = 3;
export const CNC_BEDS_A_DAY = 8.56;
export const ASSEMBLY_BEDS_A_DAY = 5;
export const RUN_DAYS_A_MONTH = 16;

export const AVAILABILITY_RULING =
  'Twenty planning days a month at 80% availability, which is sixteen run days. Ben set the 80% on 10 September 2026.';

export const PRESSED_KG_PER_BED = 36;
export const BED_PRICE_AUD = 750;

/** This invoice: $381.68 a sheet all up, three panels a sheet, two panels a bed. */
export const PANEL_PLASTIC_PER_BED_AUD = 254.45;
export const FINISHED_KIT_PER_BED_AUD = 344.05;
export const SECOND_PRESS_AUD = 22_500;
export const BULKA_BAG_KG = 1_000;

// ---------------------------------------------------------------------------
// The four ways to run it
// ---------------------------------------------------------------------------

export type DefyChoice = 'none' | 'panels' | 'kits';
export type WittaChoice = 'one-press' | 'two-presses';

export interface Scenario {
  readonly id: string;
  readonly name: string;
  readonly defy: DefyChoice;
  readonly witta: WittaChoice;
  readonly what: string;
}

export const SCENARIOS: readonly Scenario[] = [
  {
    id: 'A',
    name: 'One press, nothing bought in',
    defy: 'none',
    witta: 'one-press',
    what: 'What Witta does today. Every bed pressed here from our own shred, and the press decides the pace.',
  },
  {
    id: 'B',
    name: 'One press, panels from Defy',
    defy: 'panels',
    witta: 'one-press',
    what: 'The press keeps running and bought panels go through the router beside it. The extra beds exist only because the panels were bought.',
  },
  {
    id: 'C',
    name: 'Two presses, nothing bought in',
    defy: 'none',
    witta: 'two-presses',
    what: 'A second press reaches the same output with no bought plastic at all, and needs two thirds more shred a month to do it.',
  },
  {
    id: 'D',
    name: 'Two presses and panels',
    defy: 'panels',
    witta: 'two-presses',
    what: 'Buys nothing. Assembly caps the line at five a day whatever is feeding it, so the panels sit in the yard.',
  },
  {
    id: 'E',
    name: 'One press, finished kits from Defy',
    defy: 'kits',
    witta: 'one-press',
    what: 'The fallback. Same speed as panels and $89.60 a bed more, because Defy does the routing we can already do.',
  },
];

export function pressBedsADay(s: Scenario): number {
  return s.witta === 'two-presses' ? PRESS_BEDS_A_DAY * 2 : PRESS_BEDS_A_DAY;
}

/** Bought plastic can feed the router up to its own ceiling, so the line is capped by assembly. */
export function bedsADay(s: Scenario): number {
  const fed = s.defy === 'none' ? pressBedsADay(s) : Math.min(CNC_BEDS_A_DAY, ASSEMBLY_BEDS_A_DAY);
  return Math.min(fed, ASSEMBLY_BEDS_A_DAY, CNC_BEDS_A_DAY);
}

export function bedsAMonth(s: Scenario): number {
  return bedsADay(s) * RUN_DAYS_A_MONTH;
}

export function limitedBy(s: Scenario): string {
  const d = bedsADay(s);
  if (d === ASSEMBLY_BEDS_A_DAY) return 'Assembly';
  if (d === pressBedsADay(s)) return s.witta === 'two-presses' ? 'Two presses' : 'One press';
  return 'The router';
}

/** Beds a month that come off bought plastic, over and above what the press makes. */
export function boughtBedsAMonth(s: Scenario): number {
  return Math.max(0, bedsAMonth(s) - pressBedsADay(s) * RUN_DAYS_A_MONTH);
}

export function pressedBedsAMonth(s: Scenario): number {
  return bedsAMonth(s) - boughtBedsAMonth(s);
}

export function shredKgAMonth(s: Scenario): number {
  return pressedBedsAMonth(s) * PRESSED_KG_PER_BED;
}

export function boughtPlasticPerBedAud(s: Scenario): number {
  if (s.defy === 'kits') return FINISHED_KIT_PER_BED_AUD;
  if (s.defy === 'panels') return PANEL_PLASTIC_PER_BED_AUD;
  return 0;
}

export function boughtPlasticAMonthAud(s: Scenario): number {
  return boughtBedsAMonth(s) * boughtPlasticPerBedAud(s);
}

export function capitalAud(s: Scenario): number {
  return s.witta === 'two-presses' ? SECOND_PRESS_AUD : 0;
}

// ---------------------------------------------------------------------------
// The run
// ---------------------------------------------------------------------------

export const FIRST_STOCK_BEDS = 400;
export const ALIVE_BEDS = 100;

export function monthsFor(s: Scenario, beds: number): number {
  return beds / bedsAMonth(s);
}

export function boughtBedsOverRun(s: Scenario, beds: number): number {
  return boughtBedsAMonth(s) * monthsFor(s, beds);
}

export function shredKgOverRun(s: Scenario, beds: number): number {
  return (beds - boughtBedsOverRun(s, beds)) * PRESSED_KG_PER_BED;
}

export function bagsOverRun(s: Scenario, beds: number): number {
  return shredKgOverRun(s, beds) / BULKA_BAG_KG;
}

/** Bought plastic plus capital. Excludes shred, which has no price yet. */
export function knownSpendOverRun(s: Scenario, beds: number): number {
  return boughtBedsOverRun(s, beds) * boughtPlasticPerBedAud(s) + capitalAud(s);
}

// ---------------------------------------------------------------------------
// The number that decides it, and the one we are missing
// ---------------------------------------------------------------------------

/**
 * Panels and the second press reach the same output. Over a run of `beds`, panels cost the panel
 * price on the marginal beds; the press costs $22,500 once plus the shred those same beds need.
 * They are equal at this shred price a kilogram. Below it the press wins, above it the panels do.
 */
export function breakEvenShredPriceKg(beds: number): number {
  const panels = SCENARIOS.find((s) => s.id === 'B')!;
  const press = SCENARIOS.find((s) => s.id === 'C')!;
  const marginal = boughtBedsOverRun(panels, beds);
  const extraShredKg = marginal * PRESSED_KG_PER_BED;
  return (boughtBedsOverRun(panels, beds) * PANEL_PLASTIC_PER_BED_AUD - capitalAud(press)) / extraShredKg;
}

export const BREAK_EVEN_ON_THE_400 = breakEvenShredPriceKg(FIRST_STOCK_BEDS);

/**
 * The only prices a kilogram we hold. Both are for finished pressed panel, and shred is a different material at a different price.
 * A 1200 by 2400 by 19mm sheet weighs about 51.98 kg.
 */
export const PANEL_MATERIAL_PER_KG_AUD = 356.88 / 51.98;
export const PANEL_ALL_IN_PER_KG_AUD = 381.68 / 51.98;

export const THE_MISSING_NUMBER =
  'We do not know what a bulka bag of shred costs. Quotes QU0494 and QU0495 from Sam Davies on 27 August price the 105 sheets and the 8 bags, and neither is in the repo. Without the bag price the choice between a second press and bought panels cannot be closed, because that is the only variable it turns on.';

export const THE_RULE_OF_THUMB =
  'On the 400, panels and a second press cost the same when shred lands at about $3.16 a kilogram. Below that the press wins and above it the panels do. The only prices a kilogram we hold are $6.87 for panel material and $7.34 with the cutting. Both are for finished pressed panel, and shred should come in well under either, so the press is the likely answer once the bag price arrives. A longer run moves the line further in the press\'s favour, because the machine is bought once.';

export const WHAT_THE_PRESS_DOES_NOT_SOLVE =
  'A second press only helps if there is shred to feed it. At the assembly ceiling it needs 2,880 kg a month, which is two thirds more than the line burns today, and Witta had three weeks of stock on 28 August. Buying the press without buying the bags changes nothing.';

export const DO_NOT_DO_BOTH =
  'Scenario D adds a second press and bought panels together and produces exactly what either produces alone, because assembly caps the line at five beds a day. Whichever is chosen, the other is wasted.';
