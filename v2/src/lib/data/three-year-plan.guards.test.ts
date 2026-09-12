import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  BREAK_EVEN_BEDS,
  BREAK_EVEN_BEDS_GOODS_FREIGHT,
  BREAK_EVEN_NOTE,
  CONTRIBUTION_GOODS_FREIGHT_AUD,
  FACILITATION_IS_COST_NEUTRAL,
  CLAIM_CEILING,
  CONTRIBUTION_AUD,
  FACILITATION_PER_COMMUNITY_AUD,
  GRANT_TOTAL_AUD,
  PLANT_FIRST_YEAR_BEDS,
  PLANT_MATURE_BEDS,
  RUNNING_YEAR_ONE_AUD,
  TRADE_SHARE,
  WHAT_NEEDS_A_RULING,
  WITTA_BEDS_A_YEAR,
  YEARS,
  afterGrantAud,
  contributionAud,
  facilitationAud,
  shortfallAud,
  tradeIncomeAud,
} from './three-year-plan';

const SRC = readFileSync(join(__dirname, 'three-year-plan.ts'), 'utf8');

describe('the spine', () => {
  it('a bed contributes $474 and 628 beds carry the organisation', () => {
    expect(CONTRIBUTION_AUD).toBe(474);
    expect(BREAK_EVEN_BEDS).toBe(628);
    expect(BREAK_EVEN_BEDS * CONTRIBUTION_AUD).toBeGreaterThanOrEqual(RUNNING_YEAR_ONE_AUD);
    expect((BREAK_EVEN_BEDS - 1) * CONTRIBUTION_AUD).toBeLessThan(RUNNING_YEAR_ONE_AUD);
  });

  it('year two is set at exactly the break-even, which is the point of the story', () => {
    const fy28 = YEARS.find((y) => y.id === 'fy28')!;
    expect(fy28.bedsSold).toBe(BREAK_EVEN_BEDS);
  });
});

describe('capacity', () => {
  it('no year sells more beds than it can make', () => {
    for (const y of YEARS) expect(y.bedsSold).toBeLessThanOrEqual(y.capacityBeds);
  });

  it('capacity is built from Witta plus plants, never asserted', () => {
    expect(WITTA_BEDS_A_YEAR).toBe(1152);
    expect(YEARS.find((y) => y.id === 'fy27')!.capacityBeds).toBe(WITTA_BEDS_A_YEAR);
    expect(YEARS.find((y) => y.id === 'fy28')!.capacityBeds).toBe(
      WITTA_BEDS_A_YEAR + 2 * PLANT_FIRST_YEAR_BEDS,
    );
    expect(YEARS.find((y) => y.id === 'fy29')!.capacityBeds).toBe(
      WITTA_BEDS_A_YEAR + 2 * PLANT_MATURE_BEDS + PLANT_FIRST_YEAR_BEDS,
    );
  });

  it('year one has no plant making beds, because the money arrives during it', () => {
    expect(YEARS.find((y) => y.id === 'fy27')!.plants).toBe(0);
  });
});

describe('the arithmetic of each year', () => {
  it('year one is short $107,950 and the grant nearly closes it', () => {
    const y = YEARS.find((v) => v.id === 'fy27')!;
    expect(contributionAud(y)).toBe(189_600);
    expect(facilitationAud(y)).toBe(40_000);
    expect(tradeIncomeAud(y)).toBe(189_600);
    expect(shortfallAud(y)).toBe(107_950);
    expect(afterGrantAud(y)).toBe(-7_950);
  });

  it('break-even when Goods carries freight covers the running cost, and one bed fewer does not', () => {
    // It was a literal 918 inside the note and nowhere else, so nothing caught that 918 beds leave
    // the organisation $118 short. Derived now, and asserted from both sides.
    expect(BREAK_EVEN_BEDS_GOODS_FREIGHT * CONTRIBUTION_GOODS_FREIGHT_AUD).toBeGreaterThanOrEqual(
      RUNNING_YEAR_ONE_AUD,
    );
    expect((BREAK_EVEN_BEDS_GOODS_FREIGHT - 1) * CONTRIBUTION_GOODS_FREIGHT_AUD).toBeLessThan(
      RUNNING_YEAR_ONE_AUD,
    );
    expect(BREAK_EVEN_BEDS_GOODS_FREIGHT).toBeGreaterThan(BREAK_EVEN_BEDS);
  });

  it('the break-even note prints the two figures it derives, and never a retired one', () => {
    expect(BREAK_EVEN_NOTE).toContain(String(BREAK_EVEN_BEDS));
    expect(BREAK_EVEN_NOTE).toContain(String(BREAK_EVEN_BEDS_GOODS_FREIGHT));
    // 796 is the workbook's figure and 918 is the rounding that was typed here. Neither returns.
    expect(BREAK_EVEN_NOTE).not.toContain('796');
    expect(BREAK_EVEN_NOTE).not.toContain('918');
  });

  it('year two carries itself before the grant is counted', () => {
    const y = YEARS.find((v) => v.id === 'fy28')!;
    expect(shortfallAud(y)).toBeLessThanOrEqual(0);
  });

  it('year three earns more than it costs by a clear margin', () => {
    const y = YEARS.find((v) => v.id === 'fy29')!;
    expect(tradeIncomeAud(y) - y.runningAud).toBeGreaterThan(100_000);
  });

  it('trade covers a larger share of the organisation every year', () => {
    const pct = TRADE_SHARE.map((t) => t.percent);
    expect(pct[0]).toBeLessThan(pct[1]);
    expect(pct[1]).toBeLessThan(pct[2]);
    expect(pct[0]).toBeGreaterThan(50);
  });
});

describe('the ask', () => {
  it('is the invitation: three equal payments totalling $300,000', () => {
    expect(GRANT_TOTAL_AUD).toBe(300_000);
    expect(new Set(YEARS.map((y) => y.grantSoughtAud)).size).toBe(1);
  });

  it('every year says what its payment buys, and the three jobs differ', () => {
    const notes = YEARS.map((y) => y.grantNote);
    expect(new Set(notes).size).toBe(3);
    for (const n of notes) expect(n.length).toBeGreaterThan(80);
  });

  it('facilitation is priced at the rate already proven on an invoice', () => {
    expect(FACILITATION_PER_COMMUNITY_AUD).toBe(10_000);
  });
});

describe('honesty', () => {
  it('every bed volume is a target, never a forecast', () => {
    for (const y of YEARS) expect(y.bedsSold > 0 ? y.bedsBasis : 'target').toBe('target');
    expect(SRC).toContain('NEVER FORECASTS');
  });

  it('only year one claims a locked running cost', () => {
    expect(YEARS.filter((y) => y.runningBasis === 'locked')).toHaveLength(1);
    expect(YEARS.find((y) => y.runningBasis === 'locked')!.id).toBe('fy27');
  });

  it('the flat running cost is named as an assumption nobody has ruled on', () => {
    expect(CLAIM_CEILING).toContain('assumption nobody has ruled on');
    expect(WHAT_NEEDS_A_RULING.length).toBeGreaterThanOrEqual(4);
  });

  it('facilitation is kept out of the income line, with the reason stated', () => {
    expect(FACILITATION_IS_COST_NEUTRAL).toContain('costs about the same');
    const y = YEARS.find((v) => v.id === 'fy27')!;
    expect(tradeIncomeAud(y)).toBe(contributionAud(y));
    expect(facilitationAud(y)).toBe(40_000);
  });

  it('freight is named as the thing that moves break-even', () => {
    expect(SRC).toContain('918');
  });

  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });
});
