import { describe, expect, it } from 'vitest';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { CANON, DRIFTED, RUNNING_BREAKDOWN, WHAT_STAYS_EDITABLE, WHY_THE_CODE_IS_THE_CORE } from './sheet-canon';

const SRC = readFileSync(join(__dirname, 'sheet-canon.ts'), 'utf8');
const OUT = join(__dirname, '..', '..', '..', '..', 'deliverables', 'qbe-stage2', 'sheet-canon.json');

describe('the canon list', () => {
  it('every key is unique and stable in shape', () => {
    const keys = CANON.map((c) => c.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of keys) expect(k).toMatch(/^[a-z]+(\.[A-Za-z]+)+$/);
  });

  it('every cell names where it came from and carries a real number', () => {
    for (const c of CANON) {
      expect(c.from.length, c.key).toBeGreaterThan(6);
      expect(Number.isFinite(c.value), c.key).toBe(true);
      expect(c.label.length, c.key).toBeGreaterThan(4);
    }
  });

  it('nothing is retyped: every value is imported, never a literal', () => {
    const literals = SRC.match(/value: [0-9][0-9_.]*/g) || [];
    expect(literals).toEqual([]);
  });

  it('covers the figures the workbook actually uses', () => {
    const keys = new Set(CANON.map((c) => c.key));
    for (const k of [
      'bed.price', 'bed.make', 'bed.contribution', 'bed.pressedKg',
      'line.runDaysPerMonth', 'line.bedsPerMonth', 'line.wittaPerYear',
      'plant.allowance', 'year.running', 'year.breakEvenBeds', 'year.needs',
      'year.asked', 'year.gap', 'plastic.panelPerBed', 'trade.bedsPaid',
    ]) expect(keys.has(k), k).toBe(true);
  });

  it('the running breakdown still sums to the running figure', () => {
    const total = RUNNING_BREAKDOWN.reduce((n, l) => n + l.amountAud, 0);
    expect(total).toBe(CANON.find((c) => c.key === 'year.running')!.value);
  });
});

describe('the drift list', () => {
  it('names where the workbook is wrong today', () => {
    expect(DRIFTED.length).toBeGreaterThanOrEqual(5);
    for (const d of DRIFTED) expect(d.drift!.length).toBeGreaterThan(15);
  });

  it('includes the availability cell, which drives three others', () => {
    const run = CANON.find((c) => c.key === 'line.runDaysPerMonth')!;
    expect(run.drift).toContain('100%');
  });

  it('includes D06, still recording 40 kg against a 36 kg ruling', () => {
    expect(CANON.find((c) => c.key === 'bed.pressedKg')!.drift).toContain('40 kg');
  });
});

describe('the arrangement is stated', () => {
  it('says the modules are the core and why', () => {
    expect(WHY_THE_CODE_IS_THE_CORE).toContain('no guards');
    expect(WHY_THE_CODE_IS_THE_CORE).toContain('never retyped');
  });

  it('says what stays editable, so the sheet keeps its job', () => {
    expect(WHAT_STAYS_EDITABLE).toContain('Scenarios');
    expect(WHAT_STAYS_EDITABLE).toContain('input cells');
  });

  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });
});

describe('the export', () => {
  it('writes the canon to disk so the push tool has something to read', () => {
    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(
      OUT,
      JSON.stringify(
        {
          generated: 'v2/src/lib/data/sheet-canon.ts',
          note: 'Written by the test suite. Do not edit by hand; change the module and re-run the tests.',
          cells: CANON,
          runningBreakdown: RUNNING_BREAKDOWN,
        },
        null,
        2,
      ) + '\n',
      'utf8',
    );
    const back = JSON.parse(readFileSync(OUT, 'utf8'));
    expect(back.cells).toHaveLength(CANON.length);
  });
});
