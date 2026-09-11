import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ASKED_AUD,
  GAP_AUD,
  IF_THE_GAP_STAYS,
  LADDER,
  NEEDS,
  PLANT_MONEY_IS_DIFFERENT,
  SECURED_AUD,
  SOURCES,
  THE_SCALE,
  WHY_A_LOAN_IS_NOT_A_GRANT,
  YEAR_COST_AUD,
  coveredFor,
  gapWithout,
  shortfalls,
  whatBuys,
  bedSurplusAud,
  SURPLUS_EXPLAINS_THE_GAP,
} from './capital-stack-flex';
import { NEED_BUYER_FREIGHT_AUD, ASKED_AUD as YEAR_ASKED } from './the-year-and-the-raise';

const SRC = readFileSync(join(__dirname, 'capital-stack-flex.ts'), 'utf8');

describe('it ties to the year module', () => {
  it('the year costs the same $747,950 in both', () => {
    expect(YEAR_COST_AUD).toBe(NEED_BUYER_FREIGHT_AUD);
    expect(YEAR_COST_AUD).toBe(747_950);
  });

  it('the same $600,000 is asked, and nothing is secured', () => {
    expect(ASKED_AUD).toBe(YEAR_ASKED);
    expect(ASKED_AUD).toBe(600_000);
    expect(SECURED_AUD).toBe(0);
    expect(GAP_AUD).toBe(147_950);
  });

  it('government plant money and the loan are outside the raise, on purpose', () => {
    const out = SOURCES.filter((s) => !s.inTheRaise).map((s) => s.id).sort();
    expect(out).toEqual(['alice', 'second-commonwealth', 'sefa']);
  });
});

describe('every dollar has a job', () => {
  it('the four needs cover every source job', () => {
    const jobs = new Set(NEEDS.map((n) => n.job));
    for (const s of SOURCES) expect(jobs.has(s.job), s.id).toBe(true);
  });

  it('no funder appears twice with the same job', () => {
    const keys = SOURCES.map((s) => `${s.funder}::${s.job}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('Brian M. Davis splits deliberately and sums to the invitation', () => {
    const bmd = SOURCES.filter((s) => s.funder.startsWith('Brian M. Davis'));
    expect(bmd).toHaveLength(2);
    expect(bmd.reduce((n, s) => n + s.amountAud, 0)).toBe(100_000);
    expect(new Set(bmd.map((s) => s.job)).size).toBe(2);
  });

  it('Tim Fairfax is operating only, which is where the double count was', () => {
    const tf = SOURCES.filter((s) => s.funder.startsWith('Tim Fairfax'));
    expect(tf).toHaveLength(1);
    expect(tf[0].job).toBe('operating');
  });

  it('every need says what stops if it is unfunded', () => {
    for (const n of NEEDS) expect(n.ifUnfunded.length).toBeGreaterThan(60);
  });
});

describe('what breaks if one drops', () => {
  it('losing Tim Fairfax widens the gap by exactly their ask', () => {
    expect(gapWithout(['tfff']) - GAP_AUD).toBe(100_000);
  });

  it('losing QBE leaves the plant line entirely uncovered', () => {
    expect(coveredFor('plant')).toBe(300_000);
    expect(coveredFor('plant', ['qbe'])).toBe(0);
  });

  it('not sending Snow leaves 187 beds short at the published price', () => {
    const s = shortfalls(['snow']).find((x) => x.job === 'beds')!;
    expect(coveredFor('beds')).toBe(160_000);
    expect(coveredFor('beds', ['snow'])).toBe(60_000);
    expect(s.short).toBe(50_400);
  });

  it('as things stand only the operating line is short', () => {
    const short = shortfalls().filter((s) => s.short > 0).map((s) => s.job);
    expect(short).toEqual(['operating']);
  });

  it('the operating shortfall less the bed surplus is exactly the gap', () => {
    const operatingShort = shortfalls().find((s) => s.job === 'operating')!.short;
    expect(operatingShort).toBe(197_550);
    expect(bedSurplusAud()).toBe(49_600);
    expect(operatingShort - bedSurplusAud()).toBe(GAP_AUD);
  });

  it('the surplus is the $474 carrying the organisation, and it is stated', () => {
    expect(SURPLUS_EXPLAINS_THE_GAP).toContain('$49,600');
    expect(SURPLUS_EXPLAINS_THE_GAP).toContain('$147,950');
  });

  it('without Snow the bed line stops over-covering and starts short', () => {
    expect(bedSurplusAud(['snow'])).toBe(0);
    expect(shortfalls(['snow']).find((s) => s.job === 'beds')!.short).toBe(50_400);
  });
});

describe('the ladder', () => {
  it('runs from one bed to two plants, always ascending', () => {
    expect(LADDER[0].aud).toBe(750);
    expect(LADDER[LADDER.length - 1].aud).toBe(300_000);
    for (let i = 1; i < LADDER.length; i++) expect(LADDER[i].aud).toBeGreaterThan(LADDER[i - 1].aud);
  });

  it('every rung says what it buys and what follows from it', () => {
    for (const r of LADDER) {
      expect(r.buys.length).toBeGreaterThan(5);
      expect(r.andThen.length).toBeGreaterThan(40);
    }
  });

  it('picks the largest rung an amount can afford', () => {
    expect(whatBuys(1_000).aud).toBe(750);
    expect(whatBuys(25_000).aud).toBe(22_500);
    expect(whatBuys(160_000).aud).toBe(150_000);
    expect(whatBuys(500).aud).toBe(750);
  });

  it('nothing on the ladder is a share of a total', () => {
    expect(THE_SCALE).toContain('real unit with a real price');
    for (const r of LADDER) expect(/\b\d+%|percent|share of/.test(r.buys)).toBe(false);
  });
});

describe('honesty', () => {
  it('says why plant money never moves the gap', () => {
    expect(PLANT_MONEY_IS_DIFFERENT).toContain('never leaves a hole');
    expect(PLANT_MONEY_IS_DIFFERENT).toContain('already funding');
  });

  it('treats the loan as a different instrument with a test attached', () => {
    const sefa = SOURCES.find((s) => s.id === 'sefa')!;
    expect(sefa.instrument).toBe('loan');
    expect(sefa.amountAud).toBe(0);
    expect(WHY_A_LOAN_IS_NOT_A_GRANT).toContain('101 paid beds');
    expect(WHY_A_LOAN_IS_NOT_A_GRANT).toContain('which entity');
  });

  it('names four places the rest could come from, trade first', () => {
    expect(IF_THE_GAP_STAYS).toHaveLength(4);
    expect(IF_THE_GAP_STAYS[0]).toContain('628');
  });

  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });
});
