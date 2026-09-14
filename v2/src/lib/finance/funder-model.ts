/**
 * The funder-facing financial model, described as a workbook.
 *
 * Pure: this module returns a typed description of every sheet, row and cell. It does no I/O.
 * `build-funder-model.test.ts` writes the description to an .xlsx with exceljs when FUNDER_MODEL_BUILD=1.
 *
 * The rule that makes it worth having: every number in the workbook is either a module constant
 * looked up by name from REGISTRY, or an Excel formula over cells that are. A cell cannot be built
 * from a bare literal, because `num()` takes a registry key and not a value. The one figure no
 * module holds, Butterfly's FY26 closing cash, is registered under the `external` module with its
 * provenance and its status, so the test can see it for what it is.
 *
 * Style is Standard Ledger's: inputs pale turquoise, section headers turquoise with white text,
 * formulas dark grey, a notes column beside every input. No em dashes. Plain Australian English.
 */

import {
  BED_PRICE_AUD, PLASTIC_AUD, POLES_AUD, CANVAS_AUD, HARDWARE_AUD, POWER_AUD, LABOUR_AUD,
  FACTORY_LABOUR_A_DAY_AUD, KITS_A_DAY, BED_MAKE_AUD, BED_MAKE_STATUS, BED_FREIGHT_AUD,
  FACILITATION_PER_BED_AUD, CONTRIBUTION_AUD,
  FACILITATION_AUD, FACILITATION_COMMUNITIES, RUNNING_LINES, RUNNING_AUD, FOUNDERS_SUPER_STATUS,
  PLANTS_IN_THE_ASK, PLANT_ALLOWANCE_AUD, PLANT_MODULES_LOW_AUD, PLANT_MODULES_HIGH_AUD, PLANTS_AUD,
  BEDS_YEAR_ONE, BEDS_AT_COST_AUD, FREIGHT_ON_THE_YEAR_AUD,
  NEED_AUD, ORGANISATION_NEED_AUD, ORGANISATION_FROM_BEDS_AUD, ORGANISATION_SHORT_AUD,
  ASKS, ASKED_AUD, SECURED_AUD,
  BEDS_TO_FIND, BEDS_UNFUNDED, BEDS_FUNDED, BEDS_COVERED_BY_SENT_ASKS,
  YIELD_IMPROVEMENTS, YIELD_IMPROVEMENTS_TOTAL_AUD,
} from '../data/the-year-and-the-raise';
import {
  YEARS, BREAK_EVEN_BEDS, FACILITATION_PER_COMMUNITY_AUD,
  WITTA_BEDS_A_YEAR, contributionAud, shortfallAud, afterGrantAud, TRADE_SHARE, GRANT_TOTAL_AUD,
} from '../data/three-year-plan';
import {
  GAP_AUD, OPERATING_SHORTFALL_AUD, SEFA_LOAN_MIN_AUD, SEFA_LOAN_MAX_AUD, SEFA_LOAN_TERMS_STATUS,
  bedSurplusAud,
} from '../data/capital-stack-flex';
import { PAID_TRADE, BEDS_PAID_FOR, PAID_NET_AUD } from '../data/demand-and-buyers';
import { STACK } from '../data/raise-stack';
import {
  PRESS_SHEETS_A_DAY, PRESSED_SHEETS_PER_KIT, PLANNING_DAYS_A_MONTH, AVAILABILITY, RUN_DAYS_A_MONTH,
  factoryKitsAMonth, BOUGHT_LEG_COST_STATUS,
} from '../data/production-route';

export const MODEL_VERSION = '2026-09-15';
export const FILE_NAME = `goods-funder-model-${MODEL_VERSION}.xlsx`;

// ---------------------------------------------------------------------------
// The registry. Every number a cell can hold, by "module:CONSTANT".
// ---------------------------------------------------------------------------

/** Butterfly FY26 closing cash. No module holds it; the FY26 statements do. */
export const EXTERNAL_INPUTS = {
  BUTTERFLY_FY26_CLOSING_CASH_AUD: {
    value: 4_041,
    status: 'Butterfly whole entity, unaudited',
    from: 'JAQ Minns FY26 statements, as read in deliverables/finance/goods-financial-plan/WORKED-OUT-2026-09-09.md',
  },
} as const;

const DUSSELDORP = STACK.find((s) => s.id === 'dusseldorp');
if (!DUSSELDORP || DUSSELDORP.amountAud === null) throw new Error('raise-stack has no Dusseldorp line');
const DUSSELDORP_AUD: number = DUSSELDORP.amountAud;
const DUSSELDORP_NOTE: string = DUSSELDORP.note;

const KITS_A_MONTH = factoryKitsAMonth();
const MONTHS_IN_A_YEAR = 12;
const ZERO = 0;

/** The FY27 window the cash sheet runs over. */
export const FY27_START = '2026-07';
export const FY27_END = '2027-06';

/** Bed sales with a dated payment inside FY27, each placed in the month it was paid. */
const PAID_IN_FY27 = PAID_TRADE.filter((i) => i.fullyPaidOn >= `${FY27_START}-01` && i.fullyPaidOn <= `${FY27_END}-31`);
const PAID_IN_FY27_BED_LINE_AUD = PAID_IN_FY27.reduce((n, i) => n + i.bedLineNetAud, 0);
const invoiceKey = (invoiceNumber: string) => `demand-and-buyers:PAID_TRADE[${invoiceNumber}].bedLineNetAud`;
/** Zero-based month from July 2026. */
const monthIndex = (isoDate: string) => (Number(isoDate.slice(0, 4)) - 2026) * 12 + Number(isoDate.slice(5, 7)) - 7;

export const REGISTRY: Readonly<Record<string, number>> = {
  'the-year-and-the-raise:BED_PRICE_AUD': BED_PRICE_AUD,
  'the-year-and-the-raise:PLASTIC_AUD': PLASTIC_AUD,
  'the-year-and-the-raise:POLES_AUD': POLES_AUD,
  'the-year-and-the-raise:CANVAS_AUD': CANVAS_AUD,
  'the-year-and-the-raise:HARDWARE_AUD': HARDWARE_AUD,
  'the-year-and-the-raise:POWER_AUD': POWER_AUD,
  'the-year-and-the-raise:LABOUR_AUD': LABOUR_AUD,
  'the-year-and-the-raise:FACTORY_LABOUR_A_DAY_AUD': FACTORY_LABOUR_A_DAY_AUD,
  'the-year-and-the-raise:KITS_A_DAY': KITS_A_DAY,
  'the-year-and-the-raise:BED_MAKE_AUD': BED_MAKE_AUD,
  'the-year-and-the-raise:BED_FREIGHT_AUD': BED_FREIGHT_AUD,
  'the-year-and-the-raise:FACILITATION_PER_BED_AUD': FACILITATION_PER_BED_AUD,
  'the-year-and-the-raise:CONTRIBUTION_AUD': CONTRIBUTION_AUD,
  'the-year-and-the-raise:FACILITATION_AUD': FACILITATION_AUD,
  'the-year-and-the-raise:FACILITATION_COMMUNITIES': FACILITATION_COMMUNITIES,
  'the-year-and-the-raise:RUNNING_AUD': RUNNING_AUD,
  'the-year-and-the-raise:PLANTS_IN_THE_ASK': PLANTS_IN_THE_ASK,
  'the-year-and-the-raise:PLANT_ALLOWANCE_AUD': PLANT_ALLOWANCE_AUD,
  'the-year-and-the-raise:PLANT_MODULES_LOW_AUD': PLANT_MODULES_LOW_AUD,
  'the-year-and-the-raise:PLANT_MODULES_HIGH_AUD': PLANT_MODULES_HIGH_AUD,
  'the-year-and-the-raise:PLANTS_AUD': PLANTS_AUD,
  'the-year-and-the-raise:BEDS_YEAR_ONE': BEDS_YEAR_ONE,
  'the-year-and-the-raise:BEDS_AT_COST_AUD': BEDS_AT_COST_AUD,
  'the-year-and-the-raise:FREIGHT_ON_THE_YEAR_AUD': FREIGHT_ON_THE_YEAR_AUD,
  'the-year-and-the-raise:NEED_AUD': NEED_AUD,
  'the-year-and-the-raise:ORGANISATION_NEED_AUD': ORGANISATION_NEED_AUD,
  'the-year-and-the-raise:ORGANISATION_FROM_BEDS_AUD': ORGANISATION_FROM_BEDS_AUD,
  'the-year-and-the-raise:ORGANISATION_SHORT_AUD': ORGANISATION_SHORT_AUD,
  'the-year-and-the-raise:ASKED_AUD': ASKED_AUD,
  'the-year-and-the-raise:SECURED_AUD': SECURED_AUD,
  'the-year-and-the-raise:BEDS_TO_FIND': BEDS_TO_FIND,
  'the-year-and-the-raise:BEDS_UNFUNDED': BEDS_UNFUNDED,
  'the-year-and-the-raise:BEDS_FUNDED': BEDS_FUNDED,
  'the-year-and-the-raise:BEDS_COVERED_BY_SENT_ASKS': BEDS_COVERED_BY_SENT_ASKS,
  'the-year-and-the-raise:YIELD_IMPROVEMENTS_TOTAL_AUD': YIELD_IMPROVEMENTS_TOTAL_AUD,
  'three-year-plan:BREAK_EVEN_BEDS': BREAK_EVEN_BEDS,
  'three-year-plan:FACILITATION_PER_COMMUNITY_AUD': FACILITATION_PER_COMMUNITY_AUD,
  'three-year-plan:WITTA_BEDS_A_YEAR': WITTA_BEDS_A_YEAR,
  'three-year-plan:GRANT_TOTAL_AUD': GRANT_TOTAL_AUD,
  'capital-stack-flex:GAP_AUD': GAP_AUD,
  'capital-stack-flex:OPERATING_SHORTFALL_AUD': OPERATING_SHORTFALL_AUD,
  'capital-stack-flex:bedSurplusAud()': bedSurplusAud(),
  'capital-stack-flex:SEFA_LOAN_MIN_AUD': SEFA_LOAN_MIN_AUD,
  'capital-stack-flex:SEFA_LOAN_MAX_AUD': SEFA_LOAN_MAX_AUD,
  'demand-and-buyers:BEDS_PAID_FOR': BEDS_PAID_FOR,
  'demand-and-buyers:PAID_NET_AUD': PAID_NET_AUD,
  'demand-and-buyers:PAID_TRADE[fullyPaidOn in FY27].bedLineNetAud': PAID_IN_FY27_BED_LINE_AUD,
  ...Object.fromEntries(PAID_IN_FY27.map((i) => [invoiceKey(i.invoiceNumber), i.bedLineNetAud])),
  'raise-stack:STACK[dusseldorp].amountAud': DUSSELDORP_AUD,
  'production-route:PRESS_SHEETS_A_DAY': PRESS_SHEETS_A_DAY,
  'production-route:PRESSED_SHEETS_PER_KIT': PRESSED_SHEETS_PER_KIT,
  'production-route:PLANNING_DAYS_A_MONTH': PLANNING_DAYS_A_MONTH,
  'production-route:AVAILABILITY': AVAILABILITY,
  'production-route:RUN_DAYS_A_MONTH': RUN_DAYS_A_MONTH,
  'production-route:factoryKitsAMonth()': KITS_A_MONTH,
  'external:BUTTERFLY_FY26_CLOSING_CASH_AUD': EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.value,
  'calendar:MONTHS_IN_A_YEAR': MONTHS_IN_A_YEAR,
  'calendar:ZERO': ZERO,
  ...Object.fromEntries(RUNNING_LINES.map((l, i) => [`the-year-and-the-raise:RUNNING_LINES[${i}].amountAud`, l.amountAud])),
  ...Object.fromEntries(ASKS.map((a, i) => [`the-year-and-the-raise:ASKS[${i}].amountAud`, a.amountAud])),
  ...Object.fromEntries(YEARS.flatMap((y) => [
    [`three-year-plan:YEARS[${y.id}].bedsSold`, y.bedsSold],
    [`three-year-plan:YEARS[${y.id}].capacityBeds`, y.capacityBeds],
    [`three-year-plan:YEARS[${y.id}].plants`, y.plants],
    [`three-year-plan:YEARS[${y.id}].runningAud`, y.runningAud],
    [`three-year-plan:YEARS[${y.id}].grantSoughtAud`, y.grantSoughtAud],
    [`three-year-plan:contributionAud(${y.id})`, contributionAud(y)],
    [`three-year-plan:shortfallAud(${y.id})`, shortfallAud(y)],
    [`three-year-plan:afterGrantAud(${y.id})`, afterGrantAud(y)],
    [`three-year-plan:TRADE_SHARE[${y.id}].percent`, TRADE_SHARE.find((t) => t.id === y.id)!.percent],
  ])),
  ...Object.fromEntries(YIELD_IMPROVEMENTS.filter((y) => y.amountAud !== null)
    .map((y) => [`the-year-and-the-raise:YIELD_IMPROVEMENTS[${y.id}].amountAud`, y.amountAud as number])),
};

// ---------------------------------------------------------------------------
// Cells, rows and sheets
// ---------------------------------------------------------------------------

export type NumberFormat = 'aud' | 'int' | 'dec' | 'pct';

export interface NumberCell {
  readonly kind: 'number';
  readonly value: number;
  /** A REGISTRY key. The only way to put a number in the workbook. */
  readonly source: string;
  readonly format: NumberFormat;
}
export interface FormulaCell {
  readonly kind: 'formula';
  /** Excel formula without the leading '='. */
  readonly formula: string;
  /** What the modules say it should evaluate to. Written as the cached result. */
  readonly value: number;
  /** REGISTRY keys the formula's inputs come from. */
  readonly sources: readonly string[];
  readonly format: NumberFormat;
}
export interface TextCell {
  readonly kind: 'text';
  readonly value: string;
}
export type Cell = NumberCell | FormulaCell | TextCell | null;

export type RowStyle = 'title' | 'section' | 'header' | 'input' | 'formula' | 'total' | 'note' | 'plain';

export interface Row {
  readonly style: RowStyle;
  readonly cells: readonly Cell[];
}

export interface Sheet {
  readonly name: string;
  readonly widths: readonly number[];
  readonly rows: readonly Row[];
}

export interface Workbook {
  readonly version: string;
  readonly fileName: string;
  readonly sheets: readonly Sheet[];
}

export const STYLE = {
  inputFill: 'D9F2F4',
  sectionFill: '00ACBA',
  sectionText: 'FFFFFF',
  formulaText: '333E48',
  audFormat: '"$"#,##0;[Red]-"$"#,##0',
  decFormat: '#,##0.00',
  intFormat: '#,##0',
  pctFormat: '0%',
} as const;

export function num(source: string, format: NumberFormat = 'aud'): NumberCell {
  if (!(source in REGISTRY)) throw new Error(`Not in the registry: ${source}`);
  return { kind: 'number', value: REGISTRY[source], source, format };
}
export function text(value: string): TextCell {
  return { kind: 'text', value };
}
export function formula(f: string, value: number, sources: readonly string[], format: NumberFormat = 'aud'): FormulaCell {
  for (const s of sources) if (!(s in REGISTRY)) throw new Error(`Not in the registry: ${s}`);
  return { kind: 'formula', formula: f, value, sources, format };
}

/** Column letter for a zero-based index. */
export function col(i: number): string {
  let s = '';
  let n = i;
  do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return s;
}

function ref(sheet: string, c: number, r: number): string {
  return `'${sheet}'!${col(c)}${r}`;
}

class SheetBuilder {
  readonly rows: Row[] = [];
  constructor(readonly name: string, readonly widths: readonly number[]) {}
  get next(): number { return this.rows.length + 1; }
  add(style: RowStyle, ...cells: Cell[]): number {
    this.rows.push({ style, cells });
    return this.rows.length;
  }
  blank(): void { this.add('plain'); }
  build(): Sheet { return { name: this.name, widths: this.widths, rows: this.rows }; }
}

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------

type Status = 'settled' | 'provisional' | 'unconfirmed' | 'scenario';

interface InputSpec {
  readonly id: string;
  readonly label: string;
  readonly cell: NumberCell | FormulaCell | TextCell;
  readonly unit: string;
  readonly status: Status;
  readonly note: string;
}

const INPUT_SHEET = 'Inputs';
const INPUT_VALUE_COL = 2; // C

function inputRow(id: string, label: string, cell: NumberCell | FormulaCell | TextCell, unit: string, status: Status, note: string): InputSpec {
  return { id, label, cell, unit, status, note };
}

function sourceOf(cell: NumberCell | FormulaCell | TextCell): string {
  if (cell.kind === 'number') return cell.source;
  if (cell.kind === 'formula') return `formula of ${cell.sources.join(', ')}`;
  return 'text';
}

export function buildWorkbook(): Workbook {
  // ---- Inputs -------------------------------------------------------------
  const inputs = new SheetBuilder(INPUT_SHEET, [34, 10, 16, 12, 14, 52, 60]);
  const rowOf = new Map<string, number>();
  const I = (id: string) => {
    const r = rowOf.get(id);
    if (!r) throw new Error(`No input row ${id}`);
    return ref(INPUT_SHEET, INPUT_VALUE_COL, r);
  };

  inputs.add('title', text(`Inputs. Every driver in the model, with where it comes from. Built ${MODEL_VERSION}.`));
  inputs.add('header', text('Driver'), text('Id'), text('Value'), text('Unit'), text('Status'), text('Notes'), text('Source (module and constant)'));

  const section = (name: string) => inputs.add('section', text(name));
  const put = (s: InputSpec) => {
    const r = inputs.add(s.cell.kind === 'formula' ? 'formula' : 'input', text(s.label), text(s.id), s.cell, text(s.unit), text(s.status), text(s.note), text(sourceOf(s.cell)));
    rowOf.set(s.id, r);
  };

  section('The bed');
  put(inputRow('bed.price', 'Bed price', num('the-year-and-the-raise:BED_PRICE_AUD'), 'AUD', 'settled', 'The published price. Every invoice since INV-0303 has carried it or more.'));
  put(inputRow('bed.plastic', 'Plastic', num('the-year-and-the-raise:PLASTIC_AUD'), 'AUD a bed', 'provisional', 'Legacy 20 kg at $2.75 a kg. Provisional until Nic confirms the bought leg-panel yield.'));
  put(inputRow('bed.poles', 'Poles', num('the-year-and-the-raise:POLES_AUD'), 'AUD a bed', 'settled', 'Two galvanised steel poles.'));
  put(inputRow('bed.canvas', 'Canvas', num('the-year-and-the-raise:CANVAS_AUD'), 'AUD a bed', 'settled', 'Canvas with sewn sleeves. The canvas is structural.'));
  put(inputRow('bed.hardware', 'Hardware', num('the-year-and-the-raise:HARDWARE_AUD'), 'AUD a bed', 'settled', 'Fixings.'));
  put(inputRow('bed.power', 'Power', num('the-year-and-the-raise:POWER_AUD'), 'AUD a bed', 'settled', 'Press and router power for one kit.'));
  put(inputRow('bed.labourADay', 'Factory labour a day', num('the-year-and-the-raise:FACTORY_LABOUR_A_DAY_AUD'), 'AUD a day', 'settled', 'One paid day on the press and router.'));
  put(inputRow('prod.sheetsADay', 'Tab sheets pressed a day', num('production-route:PRESS_SHEETS_A_DAY', 'int'), 'sheets', 'settled', 'Ben, 12 September 2026.'));
  put(inputRow('prod.sheetsPerKit', 'Pressed sheets a kit', num('production-route:PRESSED_SHEETS_PER_KIT', 'int'), 'sheets', 'settled', 'One tab sheet makes one kit.'));
  put(inputRow('bed.kitsADay', 'Kits a day', formula(`${I('prod.sheetsADay')}/${I('prod.sheetsPerKit')}`, KITS_A_DAY, ['the-year-and-the-raise:KITS_A_DAY'], 'dec'), 'kits', 'settled', 'Ben, 15 September 2026: six, the tab press rate.'));
  put(inputRow('bed.labour', 'Labour a bed', formula(`${I('bed.labourADay')}/${I('bed.kitsADay')}`, LABOUR_AUD, ['the-year-and-the-raise:LABOUR_AUD']), 'AUD a bed', 'settled', 'Factory labour a day over the kits a day.'));
  put(inputRow('bed.make', 'Making cost, a bed', formula(`SUM(${I('bed.plastic')},${I('bed.poles')},${I('bed.canvas')},${I('bed.hardware')},${I('bed.power')},${I('bed.labour')})`, BED_MAKE_AUD, ['the-year-and-the-raise:BED_MAKE_AUD']), 'AUD a bed', 'provisional', BED_MAKE_STATUS));
  put(inputRow('bed.freight', 'Freight a bed, absorbed', num('the-year-and-the-raise:BED_FREIGHT_AUD'), 'AUD a bed', 'settled', 'All up. The organisation absorbs it out of its share of the $750; no buyer pays it. Ben, 15 September 2026.'));
  put(inputRow('bed.facilitation', 'Facilitation a bed, absorbed', num('the-year-and-the-raise:FACILITATION_PER_BED_AUD'), 'AUD a bed', 'settled', '$40,000 over 400 beds. The organisation absorbs it out of its share of the $750. Ben, 15 September 2026.'));
  put(inputRow('bed.contribution', 'Contribution a bed', formula(`${I('bed.price')}-${I('bed.make')}-${I('bed.freight')}-${I('bed.facilitation')}`, CONTRIBUTION_AUD, ['the-year-and-the-raise:CONTRIBUTION_AUD']), 'AUD a bed', 'provisional', 'What reaches the organisation from a $750 bed after making, freight and facilitation. Ben, 15 September 2026.'));

  section('The year');
  put(inputRow('year.beds', 'Beds of first stock', num('the-year-and-the-raise:BEDS_YEAR_ONE', 'int'), 'beds', 'settled', 'Four pools of one hundred.'));
  put(inputRow('year.pools', 'Community pools', num('the-year-and-the-raise:FACILITATION_COMMUNITIES', 'int'), 'pools', 'settled', 'Ruling 7.'));
  put(inputRow('year.poolSize', 'Beds in a pool', formula(`${I('year.beds')}/${I('year.pools')}`, BEDS_YEAR_ONE / FACILITATION_COMMUNITIES, ['the-year-and-the-raise:BEDS_YEAR_ONE', 'the-year-and-the-raise:FACILITATION_COMMUNITIES'], 'int'), 'beds', 'settled', 'Derived.'));
  put(inputRow('year.freight', 'Freight on the year, absorbed', formula(`${I('year.beds')}*${I('bed.freight')}`, FREIGHT_ON_THE_YEAR_AUD, ['the-year-and-the-raise:FREIGHT_ON_THE_YEAR_AUD']), 'AUD', 'settled', 'Beds of first stock at the freight a bed. Paid by the organisation.'));
  put(inputRow('cal.months', 'Months in a year', num('calendar:MONTHS_IN_A_YEAR', 'int'), 'months', 'settled', 'Calendar.'));

  section('Facilitation');
  put(inputRow('fac.communities', 'Communities', num('the-year-and-the-raise:FACILITATION_COMMUNITIES', 'int'), 'communities', 'settled', 'Four community pools in year one.'));
  put(inputRow('fac.each', 'Facilitation a community', num('three-year-plan:FACILITATION_PER_COMMUNITY_AUD'), 'AUD', 'settled', 'Billed and paid at this rate on four invoices already.'));
  put(inputRow('fac.total', 'Facilitation, the year, absorbed', formula(`${I('bed.facilitation')}*${I('year.beds')}`, FACILITATION_AUD, ['the-year-and-the-raise:FACILITATION_AUD']), 'AUD', 'settled', 'Facilitation a bed across the beds of first stock, which is also four communities at $10,000. Paid by the organisation.'));

  section('Running the organisation');
  RUNNING_LINES.forEach((l, i) => {
    const note = l.line === 'Founders' ? `${l.what} Superannuation status: ${FOUNDERS_SUPER_STATUS}.` : l.what;
    put(inputRow(`run.${i}`, l.line, num(`the-year-and-the-raise:RUNNING_LINES[${i}].amountAud`), 'AUD a year', l.line === 'Founders' ? 'unconfirmed' : 'settled', note));
  });
  put(inputRow('run.total', 'Running the organisation, a year', formula(`SUM(${RUNNING_LINES.map((_, i) => I(`run.${i}`)).join(',')})`, RUNNING_AUD, ['the-year-and-the-raise:RUNNING_AUD']), 'AUD a year', 'settled', 'Ben\'s provision of 9 September 2026, cut 15 September 2026.'));
  put(inputRow('org.need', 'The organisation pays, a year', formula(`${I('run.total')}+${I('fac.total')}+${I('year.freight')}`, ORGANISATION_NEED_AUD, ['the-year-and-the-raise:ORGANISATION_NEED_AUD']), 'AUD a year', 'settled', 'Running, plus the facilitation and freight it absorbs.'));
  put(inputRow('org.fromBeds', 'What the beds hand the organisation', formula(`${I('year.beds')}*${I('bed.contribution')}`, ORGANISATION_FROM_BEDS_AUD, ['the-year-and-the-raise:ORGANISATION_FROM_BEDS_AUD']), 'AUD a year', 'provisional', 'Beds of first stock at the contribution, which already has freight and facilitation taken out.'));
  put(inputRow('org.short', 'Running cost less what the beds hand back', formula(`${I('run.total')}-${I('org.fromBeds')}`, ORGANISATION_SHORT_AUD, ['the-year-and-the-raise:ORGANISATION_SHORT_AUD']), 'AUD a year', 'provisional', 'Measured against running alone, because freight and facilitation are already out of the contribution. Taking them off twice was the kind of error that produced the $937,550.'));

  section('Facilities');
  put(inputRow('plant.count', 'Plants in the ask', num('the-year-and-the-raise:PLANTS_IN_THE_ASK', 'int'), 'plants', 'settled', 'Two community plants in the QBE application.'));
  put(inputRow('plant.allowance', 'Allowance a plant', num('the-year-and-the-raise:PLANT_ALLOWANCE_AUD'), 'AUD', 'settled', 'Against modules priced from low to high below.'));
  put(inputRow('plant.low', 'Plant modules, low', num('the-year-and-the-raise:PLANT_MODULES_LOW_AUD'), 'AUD', 'settled', 'Matt Allen modules.'));
  put(inputRow('plant.high', 'Plant modules, high', num('the-year-and-the-raise:PLANT_MODULES_HIGH_AUD'), 'AUD', 'settled', 'Matt Allen modules.'));
  put(inputRow('plant.total', 'Plants, the year', formula(`${I('plant.count')}*${I('plant.allowance')}`, PLANTS_AUD, ['the-year-and-the-raise:PLANTS_AUD']), 'AUD', 'settled', 'Two plants at the allowance.'));

  section('Production');
  put(inputRow('prod.planningDays', 'Planning days a month', num('production-route:PLANNING_DAYS_A_MONTH', 'int'), 'days', 'settled', 'Twenty working days.'));
  put(inputRow('prod.availability', 'Availability', num('production-route:AVAILABILITY', 'pct'), 'share', 'settled', 'Ben set 80% on 10 September 2026.'));
  put(inputRow('prod.runDays', 'Run days a month', formula(`${I('prod.planningDays')}*${I('prod.availability')}`, RUN_DAYS_A_MONTH, ['production-route:RUN_DAYS_A_MONTH'], 'dec'), 'days', 'settled', 'Planning days at availability.'));
  put(inputRow('prod.kitsAMonth', 'Kits a month', formula(`FLOOR(${I('bed.kitsADay')}*${I('prod.runDays')},1)`, KITS_A_MONTH, ['production-route:factoryKitsAMonth()'], 'int'), 'kits', 'settled', 'Modelled capacity. No order or measured output stands behind it. Bought leg panels: ' + BOUGHT_LEG_COST_STATUS + '.'));
  put(inputRow('prod.kitsAYear', 'Kits a year', formula(`${I('prod.kitsAMonth')}*${I('cal.months')}`, WITTA_BEDS_A_YEAR, ['three-year-plan:WITTA_BEDS_A_YEAR'], 'int'), 'kits', 'settled', 'Twelve months at the monthly capacity.'));

  section('Loan');
  put(inputRow('loan.min', 'SEFA Backing the Bold, from', num('capital-stack-flex:SEFA_LOAN_MIN_AUD'), 'AUD', 'settled', 'Joel Bird, 21 August 2026. Not applied for.'));
  put(inputRow('loan.max', 'SEFA Backing the Bold, up to', num('capital-stack-flex:SEFA_LOAN_MAX_AUD'), 'AUD', 'settled', 'Debt needs a repayment source and an entity, and both are open.'));
  put(inputRow('loan.terms', 'Rate and term', text(SEFA_LOAN_TERMS_STATUS), 'status', 'unconfirmed', 'No rate or term is defined in any module. Nothing is drawn in this model.'));

  section('Bed sales paid inside FY27');
  for (const i of PAID_IN_FY27) {
    put(inputRow(`sale.${i.invoiceNumber}`, `${i.invoiceNumber}, ${i.buyer}`, num(invoiceKey(i.invoiceNumber)), 'AUD', 'settled', `${i.beds} beds for ${i.forPlace}, bed line net of GST, fully paid ${i.fullyPaidOn}. Facilitation on the same invoice is cost neutral and left out.`));
  }

  section('Opening position');
  put(inputRow('cash.opening', 'Opening cash, 1 July 2026', num('external:BUTTERFLY_FY26_CLOSING_CASH_AUD'), 'AUD', 'unconfirmed', EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.status + '. ' + EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.from));

  // ---- One bed ------------------------------------------------------------
  const bed = new SheetBuilder('One bed', [36, 16, 16, 60]);
  bed.add('title', text('One bed. Price, cost, contribution and the number of beds a year that carries the organisation.'));
  bed.add('header', text('Line'), text('Module value'), text('Sheet formula'), text('Notes'));
  const bedLine = (label: string, key: string, inputId: string, note: string, fmt: NumberFormat = 'aud') =>
    bed.add('formula', text(label), num(key, fmt), formula(I(inputId), REGISTRY[key], [key], fmt), text(note));
  bed.add('section', text('Price'));
  bedLine('Bed price', 'the-year-and-the-raise:BED_PRICE_AUD', 'bed.price', 'Published, and paid on every invoice since INV-0303.');
  bed.add('section', text('Cost to make'));
  bedLine('Plastic', 'the-year-and-the-raise:PLASTIC_AUD', 'bed.plastic', 'Provisional.');
  bedLine('Poles', 'the-year-and-the-raise:POLES_AUD', 'bed.poles', '');
  bedLine('Canvas', 'the-year-and-the-raise:CANVAS_AUD', 'bed.canvas', '');
  bedLine('Hardware', 'the-year-and-the-raise:HARDWARE_AUD', 'bed.hardware', '');
  bedLine('Power', 'the-year-and-the-raise:POWER_AUD', 'bed.power', '');
  bedLine('Labour', 'the-year-and-the-raise:LABOUR_AUD', 'bed.labour', 'Factory labour a day over kits a day.');
  bedLine('Making cost', 'the-year-and-the-raise:BED_MAKE_AUD', 'bed.make', BED_MAKE_STATUS);
  bed.add('section', text('What the organisation absorbs out of its share'));
  bedLine('Freight, absorbed', 'the-year-and-the-raise:BED_FREIGHT_AUD', 'bed.freight', 'All up. No buyer pays it and no funder is asked for it. Ben, 15 September 2026.');
  bedLine('Facilitation, absorbed', 'the-year-and-the-raise:FACILITATION_PER_BED_AUD', 'bed.facilitation', '$40,000 over 400 beds. Ben, 15 September 2026.');
  bed.add('section', text('What a bed hands to the organisation'));
  bedLine('Contribution', 'the-year-and-the-raise:CONTRIBUTION_AUD', 'bed.contribution', 'Price less making, freight and facilitation.');
  bed.add('section', text('Break-even'));
  bed.add('formula', text('Running the organisation, a year'), num('the-year-and-the-raise:RUNNING_AUD'), formula(I('run.total'), RUNNING_AUD, ['the-year-and-the-raise:RUNNING_AUD']), text('From Inputs.'));
  bed.add('total', text('Beds a year that carry it'), num('three-year-plan:BREAK_EVEN_BEDS', 'int'), formula(`CEILING(${I('run.total')}/${I('bed.contribution')},1)`, BREAK_EVEN_BEDS, ['three-year-plan:BREAK_EVEN_BEDS'], 'int'), text('Running cost over contribution, rounded up. Recomputes from the Inputs cells.'));

  // ---- The year -----------------------------------------------------------
  const year = new SheetBuilder('The year', [40, 16, 16, 16, 12, 12, 56]);
  year.add('title', text('The year to June 2027. Three jobs, who is asked to pay for each, and what is still to find.'));
  year.add('section', text('The three jobs'));
  year.add('header', text('Job'), text('Need'), text('Asked'), text('Short'), text(''), text(''), text('Funded by'));
  const askKey = (i: number) => `the-year-and-the-raise:ASKS[${i}].amountAud`;
  const askedFor = (jobs: readonly string[]) => ASKS.map((a, i) => ({ a, i })).filter(({ a }) => jobs.includes(a.job));
  const sumKeys = (items: { i: number }[]) => items.map(({ i }) => askKey(i));

  // The register sits below the jobs. Its first line's row is fixed by the layout:
  // three rows so far, three job rows, the need total, a blank, the section bar and the
  // header. The assertion below catches any drift.
  const REG_AMOUNT_COL = 'B';
  interface RegLine { funder: string; amountKey: string; amount: number; job: string; stage: string; note: string; instrument: string; inAsk: boolean }
  const register: RegLine[] = [
    ...ASKS.map((a, i) => ({ funder: a.funder, amountKey: askKey(i), amount: a.amountAud, job: a.job, stage: a.stage, note: a.source, instrument: 'grant', inAsk: true })),
    { funder: 'Dusseldorp Forum', amountKey: 'raise-stack:STACK[dusseldorp].amountAud', amount: DUSSELDORP_AUD, job: 'beds', stage: 'not-sent', note: DUSSELDORP_NOTE, instrument: 'grant', inAsk: false },
    { funder: 'SEFA, Backing the Bold, up to', amountKey: 'capital-stack-flex:SEFA_LOAN_MAX_AUD', amount: SEFA_LOAN_MAX_AUD, job: 'beds', stage: 'not applied', note: 'A loan. It is never counted in the ask, the gap or the beds covered. Debt needs a repayment source and an entity, both open.', instrument: 'loan', inAsk: false },
  ];
  const jobs: { label: string; needKey: string; needFormula: string; jobs: readonly string[]; fundedBy: string }[] = [
    { label: 'Facilities: two community plants', needKey: 'the-year-and-the-raise:PLANTS_AUD', needFormula: I('plant.total'), jobs: ['plant'], fundedBy: 'QBE Foundation, Stage 2.' },
    { label: `Beds: making ${BEDS_YEAR_ONE} of first stock`, needKey: 'the-year-and-the-raise:BEDS_AT_COST_AUD', needFormula: `${I('year.beds')}*${I('bed.make')}`, jobs: ['beds'], fundedBy: 'Brian M. Davis (invited), Snow (not sent). Bed money is asked at the price, so this line over-covers the making cost and the surplus carries the organisation.' },
    { label: 'Organisation: running it, and the freight and facilitation it absorbs', needKey: 'the-year-and-the-raise:ORGANISATION_NEED_AUD', needFormula: I('org.need'), jobs: ['operating', 'facilitation'], fundedBy: `Tim Fairfax (invited, year one of three) and the facilitation half of the Brian M. Davis invitation. The rest is carried by ${BEDS_YEAR_ONE} beds at the contribution.` },
  ];
  const registerStart = year.next + jobs.length + 1 + 1 + 2;
  const regRefs = (pred: (l: RegLine) => boolean) => register.map((l, i) => ({ l, i })).filter(({ l }) => pred(l)).map(({ i }) => `${REG_AMOUNT_COL}${registerStart + i}`);
  const inAsk = (l: RegLine) => l.inAsk;

  const jobRows: number[] = [];
  for (const j of jobs) {
    const items = askedFor(j.jobs);
    const asked = items.reduce((n, { a }) => n + a.amountAud, 0);
    const need = REGISTRY[j.needKey];
    const r = year.next;
    const refs = regRefs((l) => inAsk(l) && j.jobs.includes(l.job));
    year.add('formula', text(j.label),
      formula(j.needFormula, need, [j.needKey]),
      formula(`SUM(${refs.join(',')})`, asked, sumKeys(items)),
      formula(`MAX(0,B${r}-C${r})`, Math.max(0, need - asked), [j.needKey, ...sumKeys(items)]),
      null, null, text(j.fundedBy));
    jobRows.push(r);
  }
  const needTotalRow = year.add('total', text('The year needs'),
    formula(`SUM(${jobRows.map((r) => `B${r}`).join(',')})`, NEED_AUD, ['the-year-and-the-raise:NEED_AUD']),
    formula(`SUM(${jobRows.map((r) => `C${r}`).join(',')})`, ASKED_AUD, ['the-year-and-the-raise:ASKED_AUD']),
    formula(`B${year.next}-C${year.next}`, NEED_AUD - ASKED_AUD, ['capital-stack-flex:GAP_AUD']),
    null, null, text('Plants, beds at cost, and the organisation with the freight and facilitation it absorbs. Never beds at price plus running: that counts the bed money twice.'));
  year.blank();
  year.add('section', text('Who is asked'));
  year.add('header', text('Funder'), text('Amount'), text('Job'), text('Stage'), text('Beds at price'), text('In the ask'), text('Source'));
  if (year.next !== registerStart) throw new Error(`register row drift: expected ${registerStart}, got ${year.next}`);
  register.forEach((l) => {
    const r = year.next;
    year.add(l.instrument === 'loan' ? 'note' : 'input', text(l.funder), num(l.amountKey), text(l.job), text(l.stage),
      l.instrument === 'loan' ? text('not counted') : l.job !== 'beds' ? text('not beds') : formula(`FLOOR(B${r}/${I('bed.price')},1)`, Math.floor(l.amount / BED_PRICE_AUD), [l.amountKey, 'the-year-and-the-raise:BED_PRICE_AUD'], 'int'),
      text(inAsk(l) ? 'yes' : 'no'), text(l.note));
  });
  year.blank();
  year.add('section', text('Totals'));
  year.add('header', text('Line'), text('As it stands'), text('No Snow, no Dusseldorp'), text(''), text(''), text(''), text('Notes'));
  const askedRefs = regRefs(inAsk);
  const askedSentRefs = regRefs((l) => inAsk(l) && l.stage !== 'not-sent');
  const askedRow = year.add('total', text('Asked'),
    formula(`SUM(${askedRefs.join(',')})`, ASKED_AUD, ['the-year-and-the-raise:ASKED_AUD']),
    formula(`SUM(${askedSentRefs.join(',')})`, ASKED_AUD - ASKS.filter((a) => a.stage === 'not-sent').reduce((n, a) => n + a.amountAud, 0), sumKeys(ASKS.map((a, i) => ({ a, i })).filter(({ a }) => a.stage !== 'not-sent'))),
    null, null, null, text('Five lines, all grants. Dusseldorp and SEFA are outside the ask.'));
  year.add('input', text('Secured'), num('the-year-and-the-raise:SECURED_AUD'), num('the-year-and-the-raise:SECURED_AUD'), null, null, null, text('Nothing is secured. An invitation is not an award.'));
  year.add('total', text('Gap to the year'),
    formula(`B${needTotalRow}-B${askedRow}`, GAP_AUD, ['capital-stack-flex:GAP_AUD']),
    formula(`B${needTotalRow}-C${askedRow}`, NEED_AUD - (ASKED_AUD - ASKS.filter((a) => a.stage === 'not-sent').reduce((n, a) => n + a.amountAud, 0)), ['the-year-and-the-raise:NEED_AUD', 'the-year-and-the-raise:ASKED_AUD']),
    null, null, null, text('Need less asked. The gap is beds of first stock and a year of running the organisation. Plant money never leaves a hole.'));
  const bedRefsSent = regRefs((l) => inAsk(l) && l.job === 'beds' && l.stage !== 'not-sent');
  const bedRefsAll = regRefs((l) => inAsk(l) && l.job === 'beds');
  year.add('total', text('Beds covered by asks at the price'),
    formula(`FLOOR(SUM(${bedRefsAll.join(',')})/${I('bed.price')},1)`, BEDS_FUNDED, ['the-year-and-the-raise:BEDS_FUNDED'], 'int'),
    formula(`FLOOR(SUM(${bedRefsSent.join(',')})/${I('bed.price')},1)`, BEDS_COVERED_BY_SENT_ASKS, ['the-year-and-the-raise:BEDS_COVERED_BY_SENT_ASKS'], 'int'),
    null, null, null, text('Bed asks divided by the price. The first column counts Snow, the second only asks that have been sent.'));
  year.add('total', text('Beds to find (sent asks only)'),
    formula(`${I('year.beds')}-C${year.next - 1}`, BEDS_TO_FIND, ['the-year-and-the-raise:BEDS_TO_FIND'], 'int'),
    formula(`${I('year.beds')}-C${year.next - 1}`, BEDS_TO_FIND, ['the-year-and-the-raise:BEDS_TO_FIND'], 'int'),
    null, null, null, text('The figure every funder-facing surface prints. An unsent ask covers no bed. Ben, 12 September 2026.'));
  year.add('total', text('Beds unfunded (every bed ask counted)'),
    formula(`${I('year.beds')}-B${year.next - 2}`, BEDS_UNFUNDED, ['the-year-and-the-raise:BEDS_UNFUNDED'], 'int'),
    formula(`${I('year.beds')}-C${year.next - 2}`, BEDS_TO_FIND, ['the-year-and-the-raise:BEDS_TO_FIND'], 'int'),
    null, null, null, text('The position after Snow lands. Same as beds to find in the second column, because Snow is the only unsent bed ask.'));
  year.add('formula', text('Organisation line, short'), num('capital-stack-flex:OPERATING_SHORTFALL_AUD'), null, null, null, null, text('The organisation need less the operating and facilitation asks.'));
  year.add('formula', text('Bed money over the making line'), num('capital-stack-flex:bedSurplusAud()'), null, null, null, null, text('The contribution doing its job. Organisation short less this surplus is the gap, seen from the other end.'));
  year.blank();
  year.add('section', text('The organisation and the beds'));
  year.add('header', text('Line'), text('Amount'), text(''), text(''), text(''), text(''), text('Notes'));
  year.add('formula', text('The organisation pays'), formula(I('org.need'), ORGANISATION_NEED_AUD, ['the-year-and-the-raise:ORGANISATION_NEED_AUD']), null, null, null, null, text('Running, plus the freight and facilitation it absorbs at $100 a bed each.'));
  year.add('formula', text(`What ${BEDS_YEAR_ONE} beds hand it`), formula(I('org.fromBeds'), ORGANISATION_FROM_BEDS_AUD, ['the-year-and-the-raise:ORGANISATION_FROM_BEDS_AUD']), null, null, null, null, text('Beds at the contribution, after making, freight and facilitation.'));
  year.add('total', text('Running cost less what the beds hand back'), formula(I('org.short'), ORGANISATION_SHORT_AUD, ['the-year-and-the-raise:ORGANISATION_SHORT_AUD']), null, null, null, null, text('Against running alone, because the contribution already carries the freight and facilitation. Tim Fairfax year one goes against this.'));

  // ---- Monthly cash FY27 --------------------------------------------------
  const cash = new SheetBuilder('Monthly cash FY27', [40, ...Array<number>(12).fill(12), 14, 56]);
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 6 + i, 1));
    return d.toLocaleString('en-AU', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  });
  const SCENARIO_MONTH = 5; // December 2026, zero-based from July
  const paidInMonth = (m: number) => PAID_IN_FY27.filter((i) => monthIndex(i.fullyPaidOn) === m);
  const PRODUCTION_FROM = SCENARIO_MONTH + 1; // January 2027, the month after the scenario receipts
  const productionMonths = Math.ceil(BEDS_YEAR_ONE / KITS_A_MONTH);
  const bedsIn = (m: number): number => {
    if (m < PRODUCTION_FROM || m >= PRODUCTION_FROM + productionMonths) return 0;
    const made = (m - PRODUCTION_FROM) * KITS_A_MONTH;
    return Math.min(KITS_A_MONTH, BEDS_YEAR_ONE - made);
  };
  const C = (m: number) => col(1 + m);
  const TOTAL = col(13);
  cash.add('title', text(`Monthly cash, July 2026 to June 2027. A scenario laid out from the Inputs sheet. Nobody has forecast these months. Built ${MODEL_VERSION}.`));
  cash.add('header', text('Line'), ...months.map((m) => text(m)), text('FY27'), text('Notes'));
  const monthly = (style: RowStyle, label: string, cells: (m: number) => Cell, total: number, totalSources: readonly string[], note: string, fmt: NumberFormat = 'aud') => {
    const r = cash.next;
    const cellsArr = Array.from({ length: 12 }, (_, m) => cells(m));
    cash.add(style, text(label), ...cellsArr, formula(`SUM(${C(0)}${r}:${C(11)}${r})`, total, totalSources, fmt), text(note));
    return r;
  };
  const zero = () => num('calendar:ZERO');
  const atMonth = (target: number, key: string, fmt: NumberFormat = 'aud') => (m: number) => (m === target ? num(key, fmt) : zero());

  cash.add('section', text('Receipts'));
  const qbeIdx = ASKS.findIndex((a) => a.funder.startsWith('QBE'));
  const tfffIdx = ASKS.findIndex((a) => a.funder.startsWith('Tim Fairfax'));
  const bmdBedsIdx = ASKS.findIndex((a) => a.funder.startsWith('Brian') && a.job === 'beds');
  const bmdFacIdx = ASKS.findIndex((a) => a.funder.startsWith('Brian') && a.job === 'facilitation');
  const rQbe = monthly('input', 'Grants for facilities (QBE)', atMonth(SCENARIO_MONTH, askKey(qbeIdx)), ASKS[qbeIdx].amountAud, [askKey(qbeIdx)], 'Scenario month only. No receipt date exists. Applying; closes 25 September.');
  const rBeds = monthly('input', 'Grants for beds (Brian M. Davis)', atMonth(SCENARIO_MONTH, askKey(bmdBedsIdx)), ASKS[bmdBedsIdx].amountAud, [askKey(bmdBedsIdx)], 'Scenario month only. No receipt date exists. Invited; board 19 November.');
  const rBedsFac = monthly('input', 'Grants for facilitation (Brian M. Davis)', atMonth(SCENARIO_MONTH, askKey(bmdFacIdx)), ASKS[bmdFacIdx].amountAud, [askKey(bmdFacIdx)], 'Scenario month only. No receipt date exists. The other half of the same invitation.');
  const rSnow = monthly('input', 'Grants for beds (Snow, Dusseldorp)', () => zero(), 0, ['calendar:ZERO'], 'Untimed and zero. Neither ask has been sent, so no month is honest.');
  const rOps = monthly('input', 'Grants for operations (Tim Fairfax, year one)', atMonth(SCENARIO_MONTH, askKey(tfffIdx)), ASKS[tfffIdx].amountAud, [askKey(tfffIdx)], 'Scenario month only. No receipt date exists. Invited; SmartyGrants closes 9 October, board late November.');
  const rLoan = monthly('input', 'Loan drawn (SEFA)', () => zero(), 0, ['calendar:ZERO'], 'Zero until applied for. Up to the Inputs loan cap; no rate or term is set.');
  const rSales = monthly('input', 'Bed sales to buyers', (m) => {
    const paid = paidInMonth(m);
    if (paid.length === 0) return zero();
    return formula(`SUM(${paid.map((i) => I(`sale.${i.invoiceNumber}`)).join(',')})`, paid.reduce((n, i) => n + i.bedLineNetAud, 0), paid.map((i) => invoiceKey(i.invoiceNumber)));
  }, PAID_IN_FY27_BED_LINE_AUD, ['demand-and-buyers:PAID_TRADE[fullyPaidOn in FY27].bedLineNetAud'], `Only orders with a dated payment inside FY27: ${PAID_IN_FY27.map((i) => `${i.invoiceNumber} ${i.buyer}, ${i.beds} beds, paid ${i.fullyPaidOn}`).join('; ') || 'none'}. Bed line net of GST; facilitation billed on the same invoice is cost neutral and left out. No other buyer has a dated order.`);
  const receiptRows = [rQbe, rBeds, rBedsFac, rSnow, rOps, rLoan, rSales];
  const rReceipts = monthly('total', 'Total receipts', (m) => formula(`SUM(${C(m)}${rQbe}:${C(m)}${rSales})`, receiptRows.reduce((n, r) => n + ((cash.rows[r - 1].cells[1 + m] as NumberCell).value), 0), ['the-year-and-the-raise:ASKED_AUD']), ASKED_AUD - ASKS.filter((a) => a.stage === 'not-sent').reduce((n, a) => n + a.amountAud, 0) + PAID_IN_FY27_BED_LINE_AUD, ['the-year-and-the-raise:ASKED_AUD', 'demand-and-buyers:PAID_TRADE[fullyPaidOn in FY27].bedLineNetAud'], 'Sent asks plus dated bed sales.');

  cash.add('section', text('Payments'));
  const rPlant = monthly('formula', 'Plant capex (two plants)', (m) => m === SCENARIO_MONTH ? formula(I('plant.total'), PLANTS_AUD, ['the-year-and-the-raise:PLANTS_AUD']) : zero(), PLANTS_AUD, ['the-year-and-the-raise:PLANTS_AUD'], 'Spent in the QBE scenario month. A plant costs what its grant brings, so this line never moves the gap.');
  const rMake = monthly('formula', `Making beds (${BEDS_YEAR_ONE} at the making cost)`, (m) => bedsIn(m) ? formula(`${bedsIn(m) === KITS_A_MONTH ? I('prod.kitsAMonth') : `(${I('year.beds')}-${productionMonths - 1}*${I('prod.kitsAMonth')})`}*${I('bed.make')}`, bedsIn(m) * BED_MAKE_AUD, ['production-route:factoryKitsAMonth()', 'the-year-and-the-raise:BED_MAKE_AUD', 'the-year-and-the-raise:BEDS_YEAR_ONE']) : zero(), BEDS_AT_COST_AUD, ['the-year-and-the-raise:BEDS_AT_COST_AUD'], `Kits a month capacity from January 2027, the month after the scenario receipts, until ${BEDS_YEAR_ONE} are made (${productionMonths} months). Making cost is provisional.`);
  const rFac = monthly('formula', 'Facilitation, absorbed by the organisation', () => formula(`${I('fac.total')}/${I('cal.months')}`, FACILITATION_AUD / 12, ['the-year-and-the-raise:FACILITATION_AUD', 'calendar:MONTHS_IN_A_YEAR']), FACILITATION_AUD, ['the-year-and-the-raise:FACILITATION_AUD'], 'Spread evenly. $100 a bed, paid by the organisation out of its share of the $750. Ben, 15 September 2026.');
  const rRun = monthly('formula', 'Running the organisation', () => formula(`${I('run.total')}/${I('cal.months')}`, RUNNING_AUD / 12, ['the-year-and-the-raise:RUNNING_AUD', 'calendar:MONTHS_IN_A_YEAR']), RUNNING_AUD, ['the-year-and-the-raise:RUNNING_AUD'], 'One twelfth each month. Founders line includes superannuation: ' + FOUNDERS_SUPER_STATUS + '.');
  const rFreight = monthly('formula', `Freight, absorbed by the organisation (${BEDS_YEAR_ONE} beds)`, (m) => bedsIn(m) ? formula(`${bedsIn(m) === KITS_A_MONTH ? I('prod.kitsAMonth') : `(${I('year.beds')}-${productionMonths - 1}*${I('prod.kitsAMonth')})`}*${I('bed.freight')}`, bedsIn(m) * BED_FREIGHT_AUD, ['production-route:factoryKitsAMonth()', 'the-year-and-the-raise:BED_FREIGHT_AUD', 'the-year-and-the-raise:BEDS_YEAR_ONE']) : zero(), FREIGHT_ON_THE_YEAR_AUD, ['the-year-and-the-raise:FREIGHT_ON_THE_YEAR_AUD'], 'Follows the making months. $100 a bed, paid by the organisation out of its share of the $750. Nothing comes back through sales. Ben, 15 September 2026.');
  const payRows = [rPlant, rMake, rFac, rRun, rFreight];
  const payAt = (m: number) => payRows.reduce((n, r) => n + ((cash.rows[r - 1].cells[1 + m] as NumberCell | FormulaCell).value), 0);
  const recAt = (m: number) => receiptRows.reduce((n, r) => n + ((cash.rows[r - 1].cells[1 + m] as NumberCell).value), 0);
  const rPayments = monthly('total', 'Total payments', (m) => formula(`SUM(${C(m)}${rPlant}:${C(m)}${rFreight})`, payAt(m), ['the-year-and-the-raise:NEED_AUD']), NEED_AUD, ['the-year-and-the-raise:NEED_AUD'], 'Equals the year\'s need: plants, beds at cost, facilitation, running and freight.');

  cash.blank();
  const NET_SOURCES = ['the-year-and-the-raise:ASKED_AUD', 'the-year-and-the-raise:NEED_AUD', 'demand-and-buyers:PAID_TRADE[fullyPaidOn in FY27].bedLineNetAud'];
  const netTotal = Array.from({ length: 12 }, (_, m) => recAt(m) - payAt(m)).reduce((a, b) => a + b, 0);
  const rNet = monthly('total', 'Net cash', (m) => formula(`${C(m)}${rReceipts}-${C(m)}${rPayments}`, recAt(m) - payAt(m), NET_SOURCES), netTotal, NET_SOURCES, 'Receipts less payments.');
  const opening: number[] = [];
  const closing: number[] = [];
  for (let m = 0; m < 12; m++) {
    opening[m] = m === 0 ? EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.value : closing[m - 1];
    closing[m] = opening[m] + recAt(m) - payAt(m);
  }
  const rOpen = cash.next;
  const rClose = rOpen + 1;
  cash.add('formula', text('Opening cash'), ...Array.from({ length: 12 }, (_, m) => m === 0
    ? formula(I('cash.opening'), opening[0], ['external:BUTTERFLY_FY26_CLOSING_CASH_AUD'])
    : formula(`${C(m - 1)}${rClose}`, opening[m], ['external:BUTTERFLY_FY26_CLOSING_CASH_AUD'])), null, text(EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.status + '. Butterfly FY26 closing cash from the Inputs sheet.'));
  cash.add('total', text('Closing cash'), ...Array.from({ length: 12 }, (_, m) => formula(`${C(m)}${rOpen}+${C(m)}${rNet}`, closing[m], ['external:BUTTERFLY_FY26_CLOSING_CASH_AUD'])), null, text('Opening plus net. Negative months mean the making runs ahead of the money and need either earlier receipts, a loan, or later making.'));
  const runway = closing[11] / (RUNNING_AUD / 12);
  cash.add('total', text('Runway at June 2027, months of running cost'), ...Array<Cell>(11).fill(null), formula(`${C(11)}${rClose}/(${I('run.total')}/${I('cal.months')})`, runway, ['external:BUTTERFLY_FY26_CLOSING_CASH_AUD', 'the-year-and-the-raise:RUNNING_AUD'], 'dec'), null, text('Closing cash over one month of running the organisation. Beds already made and unsold are not counted as cash.'));

  // ---- Three years --------------------------------------------------------
  const three = new SheetBuilder('Three years', [40, 16, 16, 16, 60]);
  three.add('title', text('Three years, for the Tim Fairfax application. Bed volumes are targets inside modelled capacity. No buyer has ordered them.'));
  three.add('header', text('Line'), ...YEARS.map((y) => text(y.label)), text('Notes'));
  const yr = (label: string, key: (y: typeof YEARS[number]) => string, note: string, fmt: NumberFormat = 'aud', style: RowStyle = 'formula') =>
    three.add(style, text(label), ...YEARS.map((y) => num(key(y), fmt)), text(note));
  yr('Plants making beds', (y) => `three-year-plan:YEARS[${y.id}].plants`, 'Witta not counted.', 'int', 'input');
  yr('Capacity, beds', (y) => `three-year-plan:YEARS[${y.id}].capacityBeds`, 'Witta plus plants at first-year and mature rates.', 'int');
  yr('Beds sold (target)', (y) => `three-year-plan:YEARS[${y.id}].bedsSold`, 'Targets, capacity-checked. Year two is the break-even number.', 'int', 'input');
  yr('Contribution from trade', (y) => `three-year-plan:contributionAud(${y.id})`, 'Beds sold at the contribution, after making, freight and facilitation.');
  yr('Running the organisation', (y) => `three-year-plan:YEARS[${y.id}].runningAud`, 'Held flat across three years. An assumption nobody has ruled on.');
  yr('Trade share of running cost', (y) => `three-year-plan:TRADE_SHARE[${y.id}].percent`, 'Contribution over running cost, in percent.', 'int');
  yr('Grant sought', (y) => `three-year-plan:YEARS[${y.id}].grantSoughtAud`, 'Tim Fairfax, three equal payments.', 'aud', 'input');
  yr('Shortfall before grant (positive is short)', (y) => `three-year-plan:shortfallAud(${y.id})`, 'Running less contribution.');
  yr('After grant (positive is surplus)', (y) => `three-year-plan:afterGrantAud(${y.id})`, 'Contribution plus grant less running.', 'aud', 'total');
  three.blank();
  three.add('total', text('Break-even beds a year'), num('three-year-plan:BREAK_EVEN_BEDS', 'int'), null, null, text('Running cost over contribution, rounded up.'));
  three.add('formula', text('Grant sought over three years'), num('three-year-plan:GRANT_TOTAL_AUD'), null, null, text('The invitation is $300,000 in three equal payments.'));

  // ---- Yield improvements -------------------------------------------------
  const yields = new SheetBuilder('Yield improvements', [44, 16, 14, 8, 60]);
  yields.add('title', text('Yield improvements. Ben, 15 September 2026: no second press. Nothing here is quoted, so nothing here enters a total.'));
  yields.add('header', text('Item'), text('Amount'), text('Status'), text('Owner'), text('What it does'));
  for (const y of YIELD_IMPROVEMENTS) {
    yields.add('input', text(y.item), y.amountAud === null ? null : num(`the-year-and-the-raise:YIELD_IMPROVEMENTS[${y.id}].amountAud`), text(y.status), text(y.owner), text(y.whatItDoes));
  }
  yields.add('total', text('Quoted items, total'), num('the-year-and-the-raise:YIELD_IMPROVEMENTS_TOTAL_AUD'), null, null, text('An unquoted item never enters a total.'));

  // ---- Read me --------------------------------------------------------------
  const readme = new SheetBuilder('Read me', [110]);
  const lines = [
    'Goods on Country, financial model for funders',
    '',
    `Goods on Country is a registered business name of The Butterfly Movement Ltd, which applies for and receives the grants. This workbook was built from the repository's guarded data modules on ${MODEL_VERSION}. Every number is a module constant looked up by name, or a formula over cells that are. The Sources sheet lists each one.`,
    '',
    'What it does: one bed (price, cost, contribution, break-even), the year to June 2027 (three jobs, who is asked, the gap), a monthly cash scenario for FY27, a three-year shape for the Tim Fairfax application, and the yield improvements list.',
    '',
    'What it does not do: no GST, no balance sheet, no tax, no depreciation, no receivables. Bed sales are counted only where a buyer has a dated paid order inside FY27. Grant receipt months are scenario months and no receipt date exists for any of them.',
    '',
    'The bed is $750 and nothing is added to it. The organisation absorbs freight at $100 a bed and facilitation at $100 a bed out of its share, so a buyer is never charged freight and no funder is asked for a freight line. Ben, 15 September 2026, as a director.',
    '',
    'Provisional lines: the making cost and every figure derived from it (contribution, break-even, the beds line of the year) until Nic confirms the bought leg-panel yield; the bought leg panel yield itself, which is unknown; and whether the founders line includes superannuation, which is unconfirmed. Opening cash is Butterfly whole-entity FY26 closing cash and is unaudited.',
    '',
    'Colours: pale turquoise cells are inputs, turquoise bars are sections, dark grey figures are formulas. Change an input on the Inputs sheet and the One bed, The year and Monthly cash sheets recompute. Module values sit beside the formulas on One bed so a reviewer can see they agree.',
    '',
    'Nothing in the raise is secured. Every line is an invitation, an application or a conversation. An invitation is not an award.',
    '',
    `Version ${MODEL_VERSION}. Regenerate from v2 with FUNDER_MODEL_BUILD=1 npx vitest run src/lib/finance/build-funder-model.test.ts. Do not edit the numbers by hand; change the module and rebuild.`,
  ];
  for (const l of lines) readme.add(l === lines[0] ? 'title' : 'plain', text(l));

  // ---- Sources --------------------------------------------------------------
  const sources = new SheetBuilder('Sources', [56, 34, 18, 16]);
  sources.add('title', text(`Every constant the workbook uses, by module. Model version ${MODEL_VERSION}.`));
  sources.add('header', text('Constant'), text('Module'), text('Value'), text('Version'));
  const used = new Set<string>();
  for (const s of [inputs, bed, year, cash, three, yields]) for (const r of s.rows) for (const c of r.cells) {
    if (!c) continue;
    if (c.kind === 'number') used.add(c.source);
    if (c.kind === 'formula') c.sources.forEach((k) => used.add(k));
  }
  for (const key of [...used].sort()) {
    const [mod, ...rest] = key.split(':');
    sources.add('plain', text(rest.join(':')), text(mod === 'external' ? `external (${EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.status})` : mod === 'calendar' ? 'calendar' : `v2/src/lib/data/${mod}.ts`), num(key, Number.isInteger(REGISTRY[key]) ? 'int' : 'dec'), text(MODEL_VERSION));
  }

  return {
    version: MODEL_VERSION,
    fileName: FILE_NAME,
    sheets: [readme.build(), inputs.build(), bed.build(), year.build(), cash.build(), three.build(), yields.build(), sources.build()],
  };
}

/** Every number-bearing cell in the workbook, with its sheet and address. */
export function numericCells(wb: Workbook): { sheet: string; address: string; cell: NumberCell | FormulaCell }[] {
  const out: { sheet: string; address: string; cell: NumberCell | FormulaCell }[] = [];
  for (const s of wb.sheets) s.rows.forEach((r, ri) => r.cells.forEach((c, ci) => {
    if (c && (c.kind === 'number' || c.kind === 'formula')) out.push({ sheet: s.name, address: `${col(ci)}${ri + 1}`, cell: c });
  }));
  return out;
}

/** Find a row on a sheet by its first-column label. */
export function rowByLabel(wb: Workbook, sheet: string, label: string): Row {
  const s = wb.sheets.find((x) => x.name === sheet);
  if (!s) throw new Error(`No sheet ${sheet}`);
  const r = s.rows.find((x) => x.cells[0]?.kind === 'text' && x.cells[0].value === label);
  if (!r) throw new Error(`No row "${label}" on ${sheet}`);
  return r;
}

export function inputValue(wb: Workbook, id: string): number {
  const s = wb.sheets.find((x) => x.name === INPUT_SHEET)!;
  const r = s.rows.find((x) => x.cells[1]?.kind === 'text' && x.cells[1].value === id);
  if (!r) throw new Error(`No input ${id}`);
  const c = r.cells[INPUT_VALUE_COL];
  if (!c || c.kind === 'text') throw new Error(`Input ${id} is not numeric`);
  return c.value;
}
