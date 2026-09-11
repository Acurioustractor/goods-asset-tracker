import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ASSEMBLY_BEDS_A_DAY,
  BREAK_EVEN_ON_THE_400,
  BULKA_BAG_KG,
  CNC_BEDS_A_DAY,
  DO_NOT_DO_BOTH,
  FINISHED_KIT_PER_BED_AUD,
  FIRST_STOCK_BEDS,
  PANEL_PLASTIC_PER_BED_AUD,
  PANEL_ALL_IN_PER_KG_AUD,
  PANEL_MATERIAL_PER_KG_AUD,
  THE_RULE_OF_THUMB,
  PRESSED_KG_PER_BED,
  PRESS_BEDS_A_DAY,
  RUN_DAYS_A_MONTH,
  SCENARIOS,
  SECOND_PRESS_AUD,
  THE_MISSING_NUMBER,
  WHAT_THE_PRESS_DOES_NOT_SOLVE,
  bagsOverRun,
  bedsADay,
  bedsAMonth,
  boughtBedsAMonth,
  boughtBedsOverRun,
  breakEvenShredPriceKg,
  capitalAud,
  knownSpendOverRun,
  limitedBy,
  monthsFor,
  pressedBedsAMonth,
  shredKgAMonth,
} from './production-scenarios';

const SRC = readFileSync(join(__dirname, 'production-scenarios.ts'), 'utf8');
const S = (id: string) => SCENARIOS.find((x) => x.id === id)!;

describe('the line', () => {
  it('the press is the slowest machine and assembly the second slowest', () => {
    expect(PRESS_BEDS_A_DAY).toBeLessThan(ASSEMBLY_BEDS_A_DAY);
    expect(ASSEMBLY_BEDS_A_DAY).toBeLessThan(CNC_BEDS_A_DAY);
  });

  it('doing nothing runs at three a day and 48 a month', () => {
    expect(bedsADay(S('A'))).toBe(3);
    expect(bedsAMonth(S('A'))).toBe(48);
    expect(limitedBy(S('A'))).toBe('One press');
  });

  it('either lift reaches five a day and 80 a month, and no further', () => {
    for (const id of ['B', 'C', 'D', 'E']) {
      expect(bedsADay(S(id))).toBe(5);
      expect(bedsAMonth(S(id))).toBe(80);
      expect(limitedBy(S(id))).toBe('Assembly');
    }
  });

  it('run days come from the availability ruling', () => {
    expect(RUN_DAYS_A_MONTH).toBe(16);
    expect(SRC).toContain('80% on 10 September 2026');
  });
});

describe('doing both buys nothing', () => {
  it('two presses and panels make exactly what either makes alone', () => {
    expect(bedsAMonth(S('D'))).toBe(bedsAMonth(S('B')));
    expect(bedsAMonth(S('D'))).toBe(bedsAMonth(S('C')));
    expect(DO_NOT_DO_BOTH).toContain('wasted');
  });

  it('and it still pays for the press', () => {
    expect(capitalAud(S('D'))).toBe(SECOND_PRESS_AUD);
  });
});

describe('what each scenario consumes', () => {
  it('panels supply the 32 beds a month the press cannot', () => {
    expect(boughtBedsAMonth(S('B'))).toBe(32);
    expect(pressedBedsAMonth(S('B'))).toBe(48);
    expect(boughtBedsAMonth(S('A'))).toBe(0);
  });

  it('a second press buys the same beds with shred instead of money', () => {
    expect(boughtBedsAMonth(S('C'))).toBe(0);
    expect(shredKgAMonth(S('C'))).toBe(2_880);
    expect(shredKgAMonth(S('B'))).toBe(1_728);
  });

  it('the second press needs two thirds more shred a month', () => {
    expect(shredKgAMonth(S('C')) / shredKgAMonth(S('B'))).toBeCloseTo(5 / 3, 3);
    expect(WHAT_THE_PRESS_DOES_NOT_SOLVE).toContain('2,880 kg');
  });

  it('kits cost more than panels for the same beds', () => {
    expect(FINISHED_KIT_PER_BED_AUD).toBeGreaterThan(PANEL_PLASTIC_PER_BED_AUD);
    expect(knownSpendOverRun(S('E'), FIRST_STOCK_BEDS)).toBeGreaterThan(
      knownSpendOverRun(S('B'), FIRST_STOCK_BEDS),
    );
  });
});

describe('the 400-bed run', () => {
  it('takes 8.3 months on one press and 5 on either lift', () => {
    expect(monthsFor(S('A'), FIRST_STOCK_BEDS)).toBeCloseTo(8.33, 2);
    expect(monthsFor(S('B'), FIRST_STOCK_BEDS)).toBe(5);
    expect(monthsFor(S('C'), FIRST_STOCK_BEDS)).toBe(5);
  });

  it('160 of the 400 come off bought panels in scenario B', () => {
    expect(boughtBedsOverRun(S('B'), FIRST_STOCK_BEDS)).toBe(160);
  });

  it('scenario C needs 14.4 tonnes of shred, scenario B needs 8.6', () => {
    expect(bagsOverRun(S('C'), FIRST_STOCK_BEDS)).toBeCloseTo(14.4, 1);
    expect(bagsOverRun(S('B'), FIRST_STOCK_BEDS)).toBeCloseTo(8.64, 2);
  });

  it('known spend is panels in B and the machine in C', () => {
    expect(knownSpendOverRun(S('B'), FIRST_STOCK_BEDS)).toBeCloseTo(40_712, 0);
    expect(knownSpendOverRun(S('C'), FIRST_STOCK_BEDS)).toBe(SECOND_PRESS_AUD);
  });
});

describe('the number that decides it', () => {
  it('shred has to beat about $3.16 a kilogram for the press to win the 400', () => {
    expect(BREAK_EVEN_ON_THE_400).toBeCloseTo(3.16, 2);
    expect(breakEvenShredPriceKg(FIRST_STOCK_BEDS)).toBe(BREAK_EVEN_ON_THE_400);
    expect(THE_RULE_OF_THUMB).toContain('$3.16');
  });

  it('a longer run makes the press look better, because the machine is bought once', () => {
    expect(breakEvenShredPriceKg(800)).toBeGreaterThan(breakEvenShredPriceKg(400));
  });

  it('both prices a kilogram we hold are finished panel, and both sit well above the line', () => {
    expect(PANEL_MATERIAL_PER_KG_AUD).toBeCloseTo(6.87, 2);
    expect(PANEL_ALL_IN_PER_KG_AUD).toBeCloseTo(7.34, 2);
    expect(PANEL_MATERIAL_PER_KG_AUD).toBeGreaterThan(BREAK_EVEN_ON_THE_400);
  });

  it('names the two quotes that carry the missing bag price', () => {
    expect(THE_MISSING_NUMBER).toContain('QU0494');
    expect(THE_MISSING_NUMBER).toContain('QU0495');
  });
});

describe('house style', () => {
  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });

  it('a bulka bag is a stated assumption', () => {
    expect(BULKA_BAG_KG).toBe(1_000);
    expect(PRESSED_KG_PER_BED).toBe(36);
  });
});
