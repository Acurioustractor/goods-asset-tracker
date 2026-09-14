import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ASKED_AUD,
  GAP_AUD,
  IF_THE_GAP_STAYS,
  LADDER,
  NEEDS,
  OPERATING_SHORTFALL_AUD,
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
import {
  NEED_AUD, ASKED_AUD as YEAR_ASKED, RUNNING_AUD, BEDS_AT_COST_AUD, BEDS_TO_FIND,
  CONTRIBUTION_AUD, ORGANISATION_NEED_AUD, FACILITATION_AUD, FREIGHT_ON_THE_YEAR_AUD,
} from './the-year-and-the-raise';
import { BREAK_EVEN_BEDS } from './three-year-plan';

const SRC = readFileSync(join(__dirname, 'capital-stack-flex.ts'), 'utf8');

describe('it ties to the year module', () => {

  it('the gap is the operating shortfall less the bed surplus, derived and not typed', () => {
    // Both halves used to be literals inside one sentence, so nothing tested either, and the wiki
    // had to cite the module by hand. The sentence now prints what the module computes.
    expect(OPERATING_SHORTFALL_AUD - bedSurplusAud()).toBeCloseTo(GAP_AUD, 6);
    const r = (n: number) => Math.round(n).toLocaleString('en-AU');
    expect(SURPLUS_EXPLAINS_THE_GAP).toContain(r(OPERATING_SHORTFALL_AUD));
    expect(SURPLUS_EXPLAINS_THE_GAP).toContain(r(GAP_AUD));
    expect(SURPLUS_EXPLAINS_THE_GAP).toContain(r(bedSurplusAud()));
  });
  it('the year costs the same in both, derived from the same lines', () => {
    expect(YEAR_COST_AUD).toBeCloseTo(NEED_AUD, 6);
    expect(NEEDS).toHaveLength(3);
    expect(NEEDS.find((n) => n.job === 'operating')!.amountAud).toBe(ORGANISATION_NEED_AUD);
    expect(ORGANISATION_NEED_AUD).toBe(RUNNING_AUD + FACILITATION_AUD + FREIGHT_ON_THE_YEAR_AUD);
    expect(NEEDS.find((n) => n.job === 'operating')!.covers).toEqual(['operating', 'facilitation']);
    expect(NEEDS.find((n) => n.job === 'beds')!.amountAud).toBeCloseTo(BEDS_AT_COST_AUD, 6);
    expect(SRC).not.toContain('297_550');
    expect(SRC).not.toContain('110_400');
    expect(SRC).not.toContain('22_500');
  });

  it('the same $600,000 is asked, and nothing is secured', () => {
    expect(ASKED_AUD).toBe(YEAR_ASKED);
    expect(ASKED_AUD).toBe(599_750);
    expect(SECURED_AUD).toBe(0);
    expect(GAP_AUD).toBeCloseTo(NEED_AUD - 599_750, 6);
  });

  it('government plant money and the loan are outside the raise, on purpose', () => {
    const out = SOURCES.filter((s) => !s.inTheRaise).map((s) => s.id).sort();
    expect(out).toEqual(['real', 'sefa']);
    expect(SOURCES.find((s) => s.id === 'real')!.stage).toBe('offered');
    expect(SOURCES.find((s) => s.id === 'real')!.amountAud).toBe(1_695_000);
  });
});

describe('every dollar has a job', () => {
  it('the three needs cover every source job, facilitation landing on the organisation', () => {
    const jobs = new Set(NEEDS.flatMap((n) => n.covers));
    for (const s of SOURCES) expect(jobs.has(s.job), s.id).toBe(true);
    for (const n of NEEDS) expect(n.covers).toContain(n.job);
  });

  it('no funder appears twice with the same job', () => {
    const keys = SOURCES.map((s) => `${s.funder}::${s.job}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('Brian M. Davis is one line of 133 beds, facilitation inside', () => {
    const bmd = SOURCES.filter((s) => s.funder.startsWith('Brian M. Davis'));
    expect(bmd).toHaveLength(1);
    expect(bmd[0].amountAud).toBe(99_750);
    expect(bmd[0].job).toBe('beds');
    expect(SOURCES.filter((s) => s.job === 'facilitation')).toHaveLength(0);
  });

  it('Tim Fairfax buys beds, counted once, and nobody is asked for operating', () => {
    const tf = SOURCES.filter((s) => s.funder.startsWith('Tim Fairfax'));
    expect(tf).toHaveLength(1);
    expect(tf[0].job).toBe('beds');
    expect(coveredFor('operating')).toBe(0);
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

  it('not sending Snow leaves the bed line still over-covered, by less', () => {
    const s = shortfalls(['snow']).find((x) => x.job === 'beds')!;
    expect(coveredFor('beds')).toBe(299_750);
    expect(coveredFor('beds', ['snow'])).toBe(199_750);
    expect(s.short).toBe(0);
  });

  it('as things stand only the operating line is short', () => {
    const short = shortfalls().filter((s) => s.short > 0).map((s) => s.job);
    expect(short).toEqual(['operating']);
  });

  it('the operating shortfall less the bed surplus is exactly the gap', () => {
    const operatingShort = shortfalls().find((s) => s.job === 'operating')!.short;
    expect(coveredFor('operating')).toBe(0);
    expect(operatingShort).toBe(ORGANISATION_NEED_AUD);
    expect(bedSurplusAud()).toBeCloseTo(299_750 - BEDS_AT_COST_AUD, 6);
    expect(operatingShort - bedSurplusAud()).toBeCloseTo(GAP_AUD, 6);
  });

  it('the surplus is the contribution carrying the organisation, and it is stated', () => {
    expect(SURPLUS_EXPLAINS_THE_GAP).toContain(`$${Math.round(bedSurplusAud()).toLocaleString('en-AU')}`);
    expect(SURPLUS_EXPLAINS_THE_GAP).toContain(`$${Math.round(GAP_AUD).toLocaleString('en-AU')}`);
    expect(SURPLUS_EXPLAINS_THE_GAP).not.toContain('147,950');
    expect(SURPLUS_EXPLAINS_THE_GAP).not.toContain('110,400');
  });

  it('without Snow the bed surplus shrinks by exactly the Snow ask', () => {
    expect(bedSurplusAud() - bedSurplusAud(['snow'])).toBeCloseTo(100_000, 6);
    expect(gapWithout(['snow']) - GAP_AUD).toBeCloseTo(100_000, 6);
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
    expect(whatBuys(25_000).aud).toBe(7_500);
    expect(LADDER.some((r) => /facilitation in one community/i.test(r.buys))).toBe(false);
    expect(whatBuys(100_000).aud).toBe(99_750);
    expect(LADDER.some((r) => /second press/i.test(r.buys))).toBe(false);
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
    expect(WHY_A_LOAN_IS_NOT_A_GRANT).toContain(`${Math.ceil(200_000 / CONTRIBUTION_AUD)} paid beds`);
    expect(WHY_A_LOAN_IS_NOT_A_GRANT).not.toContain('101 paid beds');
    expect(WHY_A_LOAN_IS_NOT_A_GRANT).toContain('which entity');
  });

  it('names four places the rest could come from, trade first, with derived figures', () => {
    expect(IF_THE_GAP_STAYS).toHaveLength(4);
    expect(IF_THE_GAP_STAYS[0]).toContain(`${BREAK_EVEN_BEDS} paid beds`);
    expect(IF_THE_GAP_STAYS[0]).not.toContain('628');
    expect(IF_THE_GAP_STAYS[1]).not.toMatch(/second press/i);
    expect(IF_THE_GAP_STAYS[3]).toContain(`${BEDS_TO_FIND} beds`);
  });

  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });
});
