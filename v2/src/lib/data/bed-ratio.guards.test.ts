/**
 * Guards for the unit and the ratio. Each figure on slide 10C is derived here; if a source
 * moves, the slide is wrong and this fails first.
 */
import { describe, it, expect } from 'vitest';
import {
  BED_PRICE_AUD,
  BED_UNIT,
  BEDS_PER_TONNE,
  FAIR_WAGE_PER_BED_AUD,
  HDPE_KG_PER_BED,
  LOCAL_HOURS_PER_BED,
  RATIO_GUARDRAIL,
  RATIO_NOTE,
  SCALE_AMOUNTS,
  SCALE_ROWS,
  UNLOCK,
  scale,
} from './bed-ratio';
import { canonValue } from './canon';
import { MODELLED_LABOUR_HOURS_PER_BED } from './impact-model';

const BANNED = /\b(empower\w*|beneficiar\w*|ecosystem|scalable solution|transformational|unlock(s|ed|ing)?\b(?! panel)|journey|game-changing|co-design\w*)\b/i;

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

describe('the unit reads its inputs', () => {
  it('takes the price, the plastic and the hours from their sources', () => {
    expect(BED_PRICE_AUD).toBe(Number(canonValue('stretch-price')));
    expect(HDPE_KG_PER_BED).toBe(20);
    expect(BEDS_PER_TONNE).toBe(50);
    expect(LOCAL_HOURS_PER_BED).toBe(MODELLED_LABOUR_HOURS_PER_BED);
    expect(LOCAL_HOURS_PER_BED).toBeCloseTo(6.5, 5);
    expect(FAIR_WAGE_PER_BED_AUD).toBe(130);
  });

  it('says what one bed does, with a label on each line', () => {
    expect(BED_UNIT.length).toBe(4);
    expect(BED_UNIT[1].body).toContain('one tonne');
    expect(BED_UNIT[2].title).toContain('6.5');
    expect(BED_UNIT[3].title).toContain(`$${BED_PRICE_AUD}`);
    expect(BED_UNIT.map((u) => u.label)).toEqual(['verified', 'workpaper', 'modelled', 'target']);
  });
});

describe('any amount scales the same way', () => {
  it('turns $750,000 into 1,000 beds, five pools, 20 tonnes and 6,500 hours', () => {
    const r = scale(750_000);
    expect(r.beds).toBe(1000);
    expect(r.pools).toBe(5);
    expect(r.hdpeTonnes).toBe(20);
    expect(r.localHours).toBeCloseTo(6500, 5);
    expect(r.fairWageAud).toBe(130_000);
    expect(r.staysLocalIfAllSoldAud).toBe(750_000);
  });

  it('carries the four amounts the slide shows', () => {
    expect([...SCALE_AMOUNTS]).toEqual([150_000, 250_000, 400_000, 750_000]);
    expect(SCALE_ROWS.map((r) => r.beds)).toEqual([200, 333, 533, 1000]);
    expect(SCALE_ROWS[0].pools).toBe(1);
    expect(SCALE_ROWS[1].hdpeTonnes).toBeCloseTo(6.66, 2);
    expect(Math.round(SCALE_ROWS[2].localHours)).toBe(3465);
  });

  it('never lets money that stays local exceed the amount', () => {
    for (const r of SCALE_ROWS) expect(r.staysLocalIfAllSoldAud).toBeLessThanOrEqual(r.amountAud);
    expect(() => scale(-1)).toThrow();
  });
});

describe('what the slide says', () => {
  it('never calls sales income and says the beds go first', () => {
    for (const s of strings({ BED_UNIT, RATIO_NOTE, UNLOCK, RATIO_GUARDRAIL })) {
      expect(s).not.toMatch(/community income(?! until)/i);
      expect(s).not.toMatch(/profit/i);
    }
    expect(UNLOCK.body).toMatch(/go in first/);
    expect(RATIO_GUARDRAIL).toMatch(/real sites do not/);
  });

  it('uses no em dashes, arrows or banned words', () => {
    for (const s of strings({ BED_UNIT, RATIO_NOTE, UNLOCK, RATIO_GUARDRAIL })) {
      expect(s, s).not.toMatch(/[—→]/);
      expect(s, s).not.toMatch(BANNED);
    }
  });
});
