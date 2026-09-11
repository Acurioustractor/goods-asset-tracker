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
  NO_RATE_EXISTS,
  COMPARABLE,
  SCOPE_NOT_STATED,
  isComparable,
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
  it('per head the four span a factor of about 43, which is not a measure of anything', () => {
    expect(SPREAD_PER_HEAD).toBeGreaterThan(40);
    expect(SPREAD_PER_HEAD).toBeLessThan(45);
  });

  it('names the near miss so nobody rediscovers it as a rate', () => {
    expect(NO_RATE_EXISTS).toContain('0.22 and 0.30');
    expect(NO_RATE_EXISTS).toContain('They are not');
    expect(NO_RATE_EXISTS).toContain('homelands');
  });

  it('only one figure carries a question, a scope and an owner', () => {
    expect(COMPARABLE).toHaveLength(1);
    expect(COMPARABLE[0].communityId).toBe('tennant-creek');
    for (const f of FIGURES) expect(isComparable(f)).toBe(f.communityId === 'tennant-creek');
  });

  it('Palm Island states no scope at all, and it is the one in the QBE application', () => {
    expect(SCOPE_NOT_STATED).toHaveLength(1);
    expect(SCOPE_NOT_STATED[0].communityId).toBe('palm-island');
  });

  it('the two need figures are both scoped to a part of a community', () => {
    expect(NEEDS).toHaveLength(2);
    for (const n of NEEDS) expect(n.scope).toBe('a-part-of-it');
    expect(NEEDS.map((n) => n.communityId).sort()).toEqual(['maningrida', 'utopia']);
  });

  it('every figure says what its scope covers, in words', () => {
    for (const f of FIGURES) expect(f.scopeNote.length).toBeGreaterThan(50);
  });

  it('states the finding without claiming a rate', () => {
    expect(THE_FINDING).toContain('scope');
    expect(THE_FINDING).not.toMatch(/0\.2[0-9]/);
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
  it('forbids generating a number for a community we have not spoken to', () => {
    expect(THE_RATE_IS_NOT_A_FORMULA).toContain('may be used to generate');
    expect(THE_RATE_IS_NOT_A_FORMULA).toContain('place-denominator');
  });

  it('keeps the wrong first reading on the record instead of deleting it', () => {
    expect(SRC).toContain('THE FIRST READING WAS WRONG');
    expect(SRC).toContain('artefact');
  });

  it('forbids summing need and order', () => {
    expect(NEVER_ADD_THEM).toContain('never be summed');
    expect(NEVER_ADD_THEM).toContain('778');
  });

  it('does not reopen the ruling against deriving beds from overcrowding', () => {
    const flat = SRC.replace(/\s*\n\s*\*?\s*/g, ' ');
    expect(flat).toContain('that ruling stands');
    expect(flat).toContain('CNOS counts BEDROOMS');
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
  it('there are six and siting is not one of the things demand decides', () => {
    expect(RULES).toHaveLength(6);
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
