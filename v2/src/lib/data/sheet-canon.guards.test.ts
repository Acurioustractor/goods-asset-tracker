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

  it('every cell names its source and carries a number or explicit status', () => {
    for (const c of CANON) {
      expect(c.from.length, c.key).toBeGreaterThan(6);
      if (typeof c.value === 'number') expect(Number.isFinite(c.value), c.key).toBe(true);
      else {
        expect(c.unit, c.key).toBe('status');
        expect(c.value.length, c.key).toBeGreaterThan(3);
      }
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
      'bed.freight', 'bed.makeStatus', 'plant.yieldImprovements',
    ]) expect(keys.has(k), k).toBe(true);
  });

  it('the second press cell is gone and the 15 September rulings are in', () => {
    const cell = (k: string) => CANON.find((c) => c.key === k)!;
    expect(CANON.some((c) => c.key === 'plant.secondPress')).toBe(false);
    expect(SRC).not.toContain('SECOND_PRESS');
    expect(cell('bed.freight').value).toBe(100);
    expect(cell('year.running').value).toBe(251_224);
    expect(String(cell('bed.makeStatus').value)).toContain('provisional');
    expect(cell('plant.yieldImprovements').value).toBe(6);
    expect(cell('plant.yieldImprovementsQuoted').value).toBe(0);
  });

  it('the running breakdown still sums to the running figure', () => {
    const total = RUNNING_BREAKDOWN.reduce((n, l) => n + l.amountAud, 0);
    expect(total).toBe(CANON.find((c) => c.key === 'year.running')!.value);
  });
});

describe('the drift list', () => {
  it('every drift note says something, and none is left behind once the workbook is fixed', () => {
    // These used to assert a fixed list of drifted cells, which meant the canon kept asserting the
    // workbook was wrong after somebody had fixed it. Verified against the live workbook on
    // 12 September 2026: availability reads 80%, the Money tab carries the year and the gap, the
    // shred break-even is present as a status, and the Calculator names the route. All those notes
    // are cleared. What the guard protects now is the shape, not a count that goes stale.
    for (const d of DRIFTED) expect(d.drift!.length).toBeGreaterThan(15);
  });

  it('every remaining drift note is about a key the Canon tab does not carry yet', () => {
    // The only real drift left is the three figures added on 12 September, which the hand-built
    // Canon tab predates. A push closes this, and the note is how anyone knows it is owed.
    for (const d of DRIFTED) expect(d.drift).toContain('Canon tab');
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
