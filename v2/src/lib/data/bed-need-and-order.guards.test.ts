import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  COUNT_IS_THE_MISSING_PIECE,
  FIGURES,
  HOUSEHOLD_COUNT_FORM,
  NEEDS,
  NEVER_ADD_THEM,
  ORDERS,
  ORDER_RATE_MEAN,
  ORDER_SPREAD_PER_CROWDED,
  QUESTIONS,
  RULES,
  SPREAD_PER_CROWDED,
  SPREAD_PER_HEAD,
  THE_FINDING,
  THE_RATE_IS_NOT_A_FORMULA,
  WHO_COUNTS,
  bedsPerCrowdedDwelling,
  bedsPerDwelling,
  peoplePerBed,
} from './bed-need-and-order';
import { COMMUNITY_NEED } from './community-need';
import { PLACE_DENOMINATORS } from './place-denominator';

const SRC = readFileSync(join(__dirname, 'bed-need-and-order.ts'), 'utf8');

describe('the figures match their sources', () => {
  it('every ABS figure ties to community-need.ts', () => {
    for (const f of FIGURES) {
      const n = COMMUNITY_NEED.find((x) => x.communityId === f.communityId)!;
      expect(n, f.communityId).toBeTruthy();
      expect(f.occupiedDwellings).toBe(n.occupiedDwellings);
      expect(f.needOneOrMoreBedrooms).toBe(n.need1plus);
      expect(f.peopleApprox).toBe(Math.round(n.occupiedDwellings * n.personsPerDwelling));
    }
  });

  it('every bed figure ties to place-denominator.ts', () => {
    for (const f of FIGURES) {
      const d = PLACE_DENOMINATORS.find((x) => x.communityId === f.communityId)! as any;
      expect(d, f.communityId).toBeTruthy();
      expect(d.beds ?? d.unattributedFigure).toBe(f.beds);
    }
  });

  it('only Tennant Creek has both a rule and a name, which is the state of the record', () => {
    const owned = FIGURES.filter((f) => f.rule !== null && f.setBy !== null);
    expect(owned).toHaveLength(1);
    expect(owned[0].communityId).toBe('tennant-creek');
  });
});

describe('the finding', () => {
  it('per head the four span a factor of about 43', () => {
    expect(SPREAD_PER_HEAD).toBeGreaterThan(40);
    expect(SPREAD_PER_HEAD).toBeLessThan(45);
  });

  it('per crowded dwelling the three order figures agree within 1.4', () => {
    expect(ORDER_SPREAD_PER_CROWDED).toBeLessThan(1.4);
    expect(ORDER_RATE_MEAN).toBeCloseTo(0.26, 2);
  });

  it('mixing the questions back in widens it by more than ten times', () => {
    expect(SPREAD_PER_CROWDED / ORDER_SPREAD_PER_CROWDED).toBeGreaterThan(10);
  });

  it('Utopia is the outlier and it is the only need figure', () => {
    expect(NEEDS).toHaveLength(1);
    expect(NEEDS[0].communityId).toBe('utopia');
    const u = bedsPerCrowdedDwelling(NEEDS[0]);
    for (const o of ORDERS) expect(u).toBeGreaterThan(bedsPerCrowdedDwelling(o) * 10);
  });

  it('states the finding in words, with both spreads', () => {
    expect(THE_FINDING).toContain('43');
    expect(THE_FINDING).toContain('4.41');
  });
});

describe('the arithmetic', () => {
  it('Utopia is about one bed per three people and Tennant Creek one per 128', () => {
    expect(peoplePerBed(FIGURES.find((f) => f.communityId === 'utopia')!)).toBeCloseTo(2.96, 2);
    expect(peoplePerBed(FIGURES.find((f) => f.communityId === 'tennant-creek')!)).toBeCloseTo(127.45, 2);
  });

  it('beds per dwelling never gets used as the comparison, because it is the worst of the three', () => {
    const perDw = FIGURES.map(bedsPerDwelling);
    expect(Math.max(...perDw) / Math.min(...perDw)).toBeGreaterThan(SPREAD_PER_CROWDED);
  });
});

describe('what the module refuses to do', () => {
  it('says the rate is a check and never a generator', () => {
    expect(THE_RATE_IS_NOT_A_FORMULA).toContain('never a way to generate one');
    expect(THE_RATE_IS_NOT_A_FORMULA).toContain('place-denominator');
  });

  it('forbids summing need and order', () => {
    expect(NEVER_ADD_THEM).toContain('never be summed');
    expect(NEVER_ADD_THEM).toContain('778');
  });

  it('does not reopen the ruling against deriving beds from overcrowding', () => {
    expect(SRC).toContain('that ruling stands');
    expect(SRC).toContain('CNOS counts BEDROOMS');
  });

  it('exports no total of any kind', () => {
    expect(SRC).not.toMatch(/export const [A-Z_]*TOTAL/);
  });
});

describe('the count that does not exist yet', () => {
  it('is four questions, short enough to walk', () => {
    expect(HOUSEHOLD_COUNT_FORM).toHaveLength(4);
    for (const f of HOUSEHOLD_COUNT_FORM) {
      expect(f.ask.length).toBeGreaterThan(20);
      expect(f.why.length).toBeGreaterThan(40);
    }
  });

  it('counts who sleeps there, which the Census does not', () => {
    expect(HOUSEHOLD_COUNT_FORM[0].why).toContain('Census counts who lives here');
  });

  it('the person counting is local and paid', () => {
    expect(WHO_COUNTS).toContain('A local person paid');
    expect(WHO_COUNTS).toContain('stays with the community organisation');
  });

  it('admits nobody has done it', () => {
    expect(COUNT_IS_THE_MISSING_PIECE).toContain('No community has done this count');
  });
});

describe('the rules that come out of it', () => {
  it('there are five and siting is not one of the things demand decides', () => {
    expect(RULES).toHaveLength(5);
    expect(RULES.some((r) => r.includes('Demand size sites nothing'))).toBe(true);
  });

  it('both questions say who answers them and what they are for', () => {
    for (const q of Object.values(QUESTIONS)) {
      expect(q.ask.length).toBeGreaterThan(25);
      expect(q.answeredBy.length).toBeGreaterThan(25);
      expect(q.usedFor.length).toBeGreaterThan(25);
    }
  });

  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });
});
