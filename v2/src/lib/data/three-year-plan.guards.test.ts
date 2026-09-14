import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  BREAK_EVEN_BEDS,
  BREAK_EVEN_NOTE,
  FACILITATION_PER_BED_AUD,
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
  TFFF_BEDS_A_YEAR,
  TFFF_HANDS_BACK_AUD,
  TFFF_RULING,
  THE_ARGUMENT,
  afterGrantAud,
  contributionAud,
  facilitationAud,
  shortfallAud,
  tradeIncomeAud,
} from './three-year-plan';
import * as year from './the-year-and-the-raise';

const SRC = readFileSync(join(__dirname, 'three-year-plan.ts'), 'utf8');

describe('the spine', () => {
  it('the contribution and the running cost are imported from the year module, never retyped', () => {
    expect(CONTRIBUTION_AUD).toBe(year.CONTRIBUTION_AUD);
    expect(CONTRIBUTION_AUD).toBeCloseTo(750 - year.BED_MAKE_AUD - 100 - 100, 6);
    expect(FACILITATION_PER_BED_AUD).toBe(100);
    expect(RUNNING_YEAR_ONE_AUD).toBe(year.RUNNING_AUD);
    expect(RUNNING_YEAR_ONE_AUD).toBe(251_224);
    expect(SRC).not.toMatch(/RUNNING_YEAR_ONE_AUD = \d/);
    expect(SRC).not.toMatch(/BED_MAKE_AUD = \d/);
    expect(SRC).not.toMatch(/BED_FREIGHT_AUD = \d/);
    expect(SRC).not.toContain('297_550');
    expect(SRC).not.toContain('628');
    expect(SRC).not.toContain('918');
  });

  it('break-even is the running cost over the contribution, rounded up', () => {
    expect(BREAK_EVEN_BEDS).toBe(Math.ceil(RUNNING_YEAR_ONE_AUD / CONTRIBUTION_AUD));
    expect(BREAK_EVEN_BEDS * CONTRIBUTION_AUD).toBeGreaterThanOrEqual(RUNNING_YEAR_ONE_AUD);
    expect((BREAK_EVEN_BEDS - 1) * CONTRIBUTION_AUD).toBeLessThan(RUNNING_YEAR_ONE_AUD);
    expect(BREAK_EVEN_BEDS).toBe(874);
  });

  it('there is one break-even, because freight and facilitation sit inside the contribution', () => {
    expect(SRC).not.toMatch(/GOODS_FREIGHT|BUYER_FREIGHT/);
    expect(SRC).not.toMatch(/buyer pays freight|Goods carries freight/);
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
  it('year one is short the running cost less what 400 beds contribute, and the grant note prints it', () => {
    const y = YEARS.find((v) => v.id === 'fy27')!;
    expect(contributionAud(y)).toBeCloseTo(400 * CONTRIBUTION_AUD, 6);
    expect(facilitationAud(y)).toBe(40_000);
    expect(tradeIncomeAud(y)).toBeCloseTo(contributionAud(y), 6);
    expect(shortfallAud(y)).toBeCloseTo(RUNNING_YEAR_ONE_AUD - 400 * CONTRIBUTION_AUD, 6);
    expect(afterGrantAud(y)).toBeCloseTo(shortfallAud(y) * -1 + 100_000, 6);
    expect(y.grantNote).toContain(Math.round(shortfallAud(y)).toLocaleString('en-AU'));
    expect(y.grantNote).not.toContain('107,950');
  });

  it('the break-even note prints the figures it derives, and never a retired one', () => {
    expect(BREAK_EVEN_NOTE).toContain(String(BREAK_EVEN_BEDS));
    expect(BREAK_EVEN_NOTE).toContain(`$${Math.round(CONTRIBUTION_AUD).toLocaleString('en-AU')}`);
    expect(BREAK_EVEN_NOTE).toContain('$100 of freight');
    // 796 is the workbook's figure and 918 and 919 were the Goods-freight roundings. None returns.
    expect(BREAK_EVEN_NOTE).not.toMatch(/796|918|919/);
  });

  it('year two carries itself before the grant is counted', () => {
    const y = YEARS.find((v) => v.id === 'fy28')!;
    expect(shortfallAud(y)).toBeLessThanOrEqual(0);
  });

  it('year three earns more than it costs, and the note prints the margin it derives', () => {
    // With freight and facilitation inside the contribution (Ben, 15 September 2026) the 900-bed
    // target clears the running cost by a few thousand dollars, not the six figures it once did.
    // The target is Ben's to move; the guard holds the sign and the derivation.
    const y = YEARS.find((v) => v.id === 'fy29')!;
    const over = tradeIncomeAud(y) - y.runningAud;
    expect(over).toBeGreaterThan(0);
    expect(y.grantNote).toContain(`$${Math.round(over).toLocaleString('en-AU')} over`);
  });

  it('trade covers a larger share of the organisation every year', () => {
    const pct = TRADE_SHARE.map((t) => t.percent);
    expect(pct[0]).toBeLessThan(pct[1]);
    expect(pct[1]).toBeLessThan(pct[2]);
    expect(pct[0]).toBe(Math.round((400 * CONTRIBUTION_AUD / RUNNING_YEAR_ONE_AUD) * 100));
    expect(pct[1]).toBeGreaterThanOrEqual(100);
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

  it('each payment buys 133 beds and the notes say so, Ben 15 September', () => {
    expect(TFFF_BEDS_A_YEAR).toBe(133);
    expect(TFFF_HANDS_BACK_AUD).toBeCloseTo(133 * CONTRIBUTION_AUD, 6);
    for (const y of YEARS) expect(y.grantNote).toMatch(/133 (beds|of those)/);
    expect(TFFF_RULING).toContain('$99,750');
    expect(THE_ARGUMENT).toContain('133 beds');
    expect(THE_ARGUMENT).toMatch(/Nothing is asked for the running cost/);
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
    expect(FACILITATION_IS_COST_NEUTRAL).toContain('$100 a bed');
    const y = YEARS.find((v) => v.id === 'fy27')!;
    expect(tradeIncomeAud(y)).toBe(contributionAud(y));
    expect(facilitationAud(y)).toBe(40_000);
  });

  it('freight is no longer an open ruling; facilitation past year one is', () => {
    expect(WHAT_NEEDS_A_RULING.some((s) => s.startsWith('Who carries freight'))).toBe(false);
    const line = WHAT_NEEDS_A_RULING.find((s) => s.startsWith('Whether facilitation'))!;
    expect(line).toContain('$100 a bed');
    expect(WHAT_NEEDS_A_RULING[0]).toContain(RUNNING_YEAR_ONE_AUD.toLocaleString('en-AU'));
    expect(CLAIM_CEILING).toContain(`$${Math.round(year.BED_MAKE_AUD).toLocaleString('en-AU')}`);
    expect(CLAIM_CEILING).not.toContain('$276');
  });

  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });
});
