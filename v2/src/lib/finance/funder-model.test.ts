import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildWorkbook, numericCells, rowByLabel, inputValue, REGISTRY, MODEL_VERSION, FILE_NAME, EXTERNAL_INPUTS,
  type FormulaCell, type NumberCell,
} from './funder-model';
import {
  RUNNING_AUD, BED_MAKE_AUD, BED_FREIGHT_AUD, BED_PRICE_AUD, NEED_AUD,
  ASKED_AUD, ASKS, SECURED_AUD, BEDS_TO_FIND, BEDS_UNFUNDED, PLANTS_AUD, FACILITATION_AUD, BEDS_AT_COST_AUD,
  FREIGHT_ON_THE_YEAR_AUD, CONTRIBUTION_AUD, FACILITATION_PER_BED_AUD, KITS_A_DAY, BEDS_YEAR_ONE,
  ORGANISATION_NEED_AUD, ORGANISATION_FROM_BEDS_AUD, ORGANISATION_SHORT_AUD,
} from '../data/the-year-and-the-raise';
import { BREAK_EVEN_BEDS, YEARS, contributionAud } from '../data/three-year-plan';
import { GAP_AUD, SEFA_LOAN_MAX_AUD } from '../data/capital-stack-flex';
import { factoryKitsAMonth } from '../data/production-route';

const wb = buildWorkbook();
const SRC = readFileSync(join(__dirname, 'funder-model.ts'), 'utf8');

const value = (sheet: string, label: string, col: number): number => {
  const c = rowByLabel(wb, sheet, label).cells[col];
  if (!c || c.kind === 'text') throw new Error(`${sheet} "${label}" col ${col} is not numeric`);
  return c.value;
};

describe('shape', () => {
  it('has the eight sheets in order and a dated file name', () => {
    expect(wb.sheets.map((s) => s.name)).toEqual([
      'Read me', 'Inputs', 'One bed', 'The year', 'Monthly cash FY27', 'Three years', 'Yield improvements', 'Sources',
    ]);
    expect(MODEL_VERSION).toBe('2026-09-15');
    expect(FILE_NAME).toBe(`goods-funder-model-${MODEL_VERSION}.xlsx`);
    expect(wb.version).toBe(MODEL_VERSION);
  });

  it('no em dashes anywhere, in the module or the workbook text', () => {
    expect(SRC).not.toContain('\u2014');
    for (const s of wb.sheets) for (const r of s.rows) for (const c of r.cells) {
      if (c?.kind === 'text') expect(c.value, `${s.name}: ${c.value}`).not.toContain('\u2014');
    }
  });

  it('no buyer-pays-freight case anywhere in the workbook, Ben 15 September', () => {
    expect(SRC).not.toMatch(/BUYER_FREIGHT|GOODS_FREIGHT/);
    for (const s of wb.sheets) for (const r of s.rows) for (const c of r.cells) {
      if (c?.kind === 'text') expect(c.value, `${s.name}: ${c.value}`).not.toMatch(/buyer pays freight|Goods carries freight|charged on top/i);
    }
  });

  it('every input row carries a unit, a status, a note and a source', () => {
    const inputs = wb.sheets.find((s) => s.name === 'Inputs')!;
    for (const r of inputs.rows) {
      if (r.style !== 'input' && r.style !== 'formula') continue;
      expect(r.cells.length).toBe(7);
      for (const i of [0, 1, 3, 4, 5, 6]) expect(r.cells[i]?.kind).toBe('text');
      expect(['settled', 'provisional', 'unconfirmed', 'scenario']).toContain((r.cells[4] as { value: string }).value);
    }
  });
});

describe('every number traces to a module', () => {
  it('no numeric cell is a retyped literal: each is a registry lookup or a formula over registry keys', () => {
    const cells = numericCells(wb);
    expect(cells.length).toBeGreaterThan(200);
    for (const { sheet, address, cell } of cells) {
      if (cell.kind === 'number') {
        expect(cell.source in REGISTRY, `${sheet}!${address} source ${cell.source}`).toBe(true);
        expect(cell.value, `${sheet}!${address}`).toBe(REGISTRY[cell.source]);
      } else {
        expect(cell.sources.length, `${sheet}!${address} formula ${cell.formula}`).toBeGreaterThan(0);
        for (const k of cell.sources) expect(k in REGISTRY, `${sheet}!${address} source ${k}`).toBe(true);
        // No figure typed into a formula: once cell references are stripped, nothing of two digits or more remains.
        const stripped = cell.formula.replace(/'[^']+'![A-Z]+\d+/g, '').replace(/\b[A-Z]+\d+\b/g, '');
        expect(stripped, `${sheet}!${address} formula ${cell.formula}`).not.toMatch(/\d{2,}/);
      }
    }
  });

  it('the only figures outside a data module are the calendar and Butterfly FY26 closing cash, and it says so', () => {
    const modules = new Set(Object.keys(REGISTRY).map((k) => k.split(':')[0]));
    expect([...modules].sort()).toEqual([
      'calendar', 'capital-stack-flex', 'demand-and-buyers', 'external', 'production-route', 'raise-stack',
      'the-year-and-the-raise', 'three-year-plan',
    ]);
    expect(EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.status).toBe('Butterfly whole entity, unaudited');
    const open = rowByLabel(wb, 'Inputs', 'Opening cash, 1 July 2026');
    expect((open.cells[5] as { value: string }).value).toContain('unaudited');
  });

  it('the Sources sheet lists every key the other sheets use', () => {
    const listed = new Set(rowsOf('Sources').filter((r) => r.style === 'plain').map((r) => `${(r.cells[1] as { value: string }).value}|${(r.cells[0] as { value: string }).value}`));
    for (const { sheet, cell } of numericCells(wb)) {
      if (sheet === 'Sources') continue;
      const keys = cell.kind === 'number' ? [cell.source] : cell.sources;
      for (const k of keys) {
        const [mod, ...rest] = k.split(':');
        const modLabel = mod === 'external' ? `external (${EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.status})` : mod === 'calendar' ? 'calendar' : `v2/src/lib/data/${mod}.ts`;
        expect(listed.has(`${modLabel}|${rest.join(':')}`), k).toBe(true);
      }
    }
  });
});

function rowsOf(sheet: string) {
  return wb.sheets.find((s) => s.name === sheet)!.rows;
}

describe('key cells equal the module constants', () => {
  it('Inputs', () => {
    expect(inputValue(wb, 'bed.price')).toBe(BED_PRICE_AUD);
    expect(inputValue(wb, 'bed.kitsADay')).toBe(KITS_A_DAY);
    expect(inputValue(wb, 'bed.make')).toBe(BED_MAKE_AUD);
    expect(inputValue(wb, 'bed.freight')).toBe(BED_FREIGHT_AUD);
    expect(inputValue(wb, 'bed.facilitation')).toBe(FACILITATION_PER_BED_AUD);
    expect(inputValue(wb, 'bed.contribution')).toBe(CONTRIBUTION_AUD);
    expect(inputValue(wb, 'run.total')).toBe(RUNNING_AUD);
    expect(inputValue(wb, 'org.need')).toBe(ORGANISATION_NEED_AUD);
    expect(inputValue(wb, 'org.fromBeds')).toBe(ORGANISATION_FROM_BEDS_AUD);
    expect(inputValue(wb, 'org.short')).toBe(ORGANISATION_SHORT_AUD);
    expect(inputValue(wb, 'year.freight')).toBe(FREIGHT_ON_THE_YEAR_AUD);
    expect(inputValue(wb, 'fac.total')).toBe(FACILITATION_AUD);
    expect(inputValue(wb, 'prod.kitsAMonth')).toBe(factoryKitsAMonth());
    expect(inputValue(wb, 'year.beds')).toBe(BEDS_YEAR_ONE);
    expect(inputValue(wb, 'loan.max')).toBe(SEFA_LOAN_MAX_AUD);
    expect((rowByLabel(wb, 'Inputs', 'Rate and term').cells[2] as { value: string }).value).toBe('not set');
    expect((rowByLabel(wb, 'Inputs', 'Founders').cells[5] as { value: string }).value).toContain('unconfirmed');
  });

  it('One bed: break-even is a module value and a formula over Inputs cells', () => {
    const r = rowByLabel(wb, 'One bed', 'Beds a year that carry it');
    expect((r.cells[1] as NumberCell).value).toBe(BREAK_EVEN_BEDS);
    const f = r.cells[2] as FormulaCell;
    expect(f.value).toBe(BREAK_EVEN_BEDS);
    expect(f.formula).toMatch(/^CEILING\('Inputs'!C\d+\/'Inputs'!C\d+,1\)$/);
    expect(value('One bed', 'Making cost', 1)).toBe(BED_MAKE_AUD);
    expect(value('One bed', 'Freight, absorbed', 1)).toBe(BED_FREIGHT_AUD);
    expect(value('One bed', 'Facilitation, absorbed', 1)).toBe(FACILITATION_PER_BED_AUD);
    expect(value('One bed', 'Contribution', 1)).toBe(CONTRIBUTION_AUD);
    expect(rowsOf('One bed').some((x) => x.cells[0]?.kind === 'text' && /Goods carries freight/.test(x.cells[0].value))).toBe(false);
  });

  it('The year: three jobs, need, asked, secured, gap, beds to find, beds unfunded, four funder lines plus Dusseldorp and SEFA', () => {
    expect(value('The year', 'The year needs', 1)).toBe(NEED_AUD);
    expect(value('The year', 'The year needs', 2)).toBe(ASKED_AUD);
    const org = rowByLabel(wb, 'The year', 'Organisation: running it, and the freight and facilitation it absorbs');
    expect((org.cells[1] as FormulaCell).value).toBe(ORGANISATION_NEED_AUD);
    expect((org.cells[2] as NumberCell).value).toBe(0);
    expect(rowsOf('The year').some((x) => x.cells[0]?.kind === 'text' && x.cells[0].value.startsWith('Facilitation in'))).toBe(false);
    expect(value('The year', 'The organisation pays', 1)).toBe(ORGANISATION_NEED_AUD);
    expect(value('The year', `What ${BEDS_YEAR_ONE} beds hand it`, 1)).toBe(ORGANISATION_FROM_BEDS_AUD);
    expect(value('The year', 'Running cost less what the beds hand back', 1)).toBe(ORGANISATION_SHORT_AUD);
    expect(value('The year', 'Asked', 1)).toBe(ASKED_AUD);
    expect(value('The year', 'Secured', 1)).toBe(SECURED_AUD);
    expect(value('The year', 'Gap to the year', 1)).toBe(GAP_AUD);
    expect(value('The year', 'Beds to find (sent asks only)', 1)).toBe(BEDS_TO_FIND);
    expect(value('The year', 'Beds unfunded (every bed ask counted)', 1)).toBe(BEDS_UNFUNDED);
    const funderRows = rowsOf('The year').filter((r) => r.style === 'input' || r.style === 'note').filter((r) => r.cells.length === 7 && r.cells[1]?.kind === 'number');
    const amounts = funderRows.map((r) => [(r.cells[0] as { value: string }).value, (r.cells[1] as NumberCell).value]);
    expect(amounts).toEqual([
      ...ASKS.map((a) => [a.funder, a.amountAud]),
      ['Dusseldorp Forum', 50_000],
      ['SEFA, Backing the Bold, up to', SEFA_LOAN_MAX_AUD],
      ['Secured', SECURED_AUD],
    ]);
    // The no-Snow, no-Dusseldorp column: asked drops by the unsent Snow line, gap rises by it.
    const snow = ASKS.find((a) => a.stage === 'not-sent')!.amountAud;
    expect(value('The year', 'Asked', 2)).toBe(ASKED_AUD - snow);
    expect(value('The year', 'Gap to the year', 2)).toBe(GAP_AUD + snow);
    expect(value('The year', 'Beds to find (sent asks only)', 2)).toBe(BEDS_TO_FIND);
  });

  it('Monthly cash: totals column equals the year, opening cash is Butterfly FY26, runway is closing over a month of running', () => {
    const T = 13;
    expect(value('Monthly cash FY27', 'Plant capex (two plants)', T)).toBe(PLANTS_AUD);
    expect(value('Monthly cash FY27', `Making beds (${BEDS_YEAR_ONE} at the making cost)`, T)).toBeCloseTo(BEDS_AT_COST_AUD, 6);
    expect(value('Monthly cash FY27', 'Facilitation, absorbed by the organisation', T)).toBe(FACILITATION_AUD);
    expect(value('Monthly cash FY27', 'Running the organisation', T)).toBe(RUNNING_AUD);
    expect(value('Monthly cash FY27', `Freight, absorbed by the organisation (${BEDS_YEAR_ONE} beds)`, T)).toBe(FREIGHT_ON_THE_YEAR_AUD);
    expect(value('Monthly cash FY27', 'Total payments', T)).toBe(NEED_AUD);
    // Receipts carry no freight line: nothing comes back from a buyer for freight.
    const receiptLabels = rowsOf('Monthly cash FY27').map((r) => (r.cells[0] as { value?: string })?.value ?? '');
    const receiptsBlock = receiptLabels.slice(receiptLabels.indexOf('Receipts'), receiptLabels.indexOf('Payments'));
    expect(receiptsBlock.some((l) => /freight/i.test(l))).toBe(false);
    expect(value('Monthly cash FY27', 'Grants for beds (Snow, Dusseldorp)', T)).toBe(0);
    expect(value('Monthly cash FY27', 'Loan drawn (SEFA)', T)).toBe(0);
    expect(value('Monthly cash FY27', 'Opening cash', 1)).toBe(EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.value);
    // Making runs at capacity from January 2027 (column 8 is Jan: Jul=1 ... Jan=7).
    const make = rowByLabel(wb, 'Monthly cash FY27', `Making beds (${BEDS_YEAR_ONE} at the making cost)`);
    expect((make.cells[7] as FormulaCell).value).toBeCloseTo(factoryKitsAMonth() * BED_MAKE_AUD, 6);
    expect((make.cells[6] as NumberCell).value).toBe(0);
    const closeJune = value('Monthly cash FY27', 'Closing cash', 12);
    const net = value('Monthly cash FY27', 'Net cash', T);
    expect(closeJune).toBeCloseTo(EXTERNAL_INPUTS.BUTTERFLY_FY26_CLOSING_CASH_AUD.value + net, 6);
    expect(value('Monthly cash FY27', 'Runway at June 2027, months of running cost', 12)).toBeCloseTo(closeJune / (RUNNING_AUD / 12), 6);
  });

  it('Three years follows YEARS', () => {
    const r = rowByLabel(wb, 'Three years', 'Contribution from trade');
    YEARS.forEach((y, i) => expect((r.cells[i + 1] as NumberCell).value).toBe(contributionAud(y)));
    expect(value('Three years', 'Break-even beds a year', 1)).toBe(BREAK_EVEN_BEDS);
    expect(rowsOf('Three years').filter((r) => r.cells[0]?.kind === 'text' && /Break-even/.test(r.cells[0].value))).toHaveLength(1);
  });

  it('Yield improvements carry no amount while none is quoted', () => {
    const rows = rowsOf('Yield improvements').filter((r) => r.style === 'input');
    expect(rows.length).toBe(6);
    for (const r of rows) expect(r.cells[1]).toBeNull();
    expect(value('Yield improvements', 'Quoted items, total', 1)).toBe(0);
  });
});
