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
  FIGURES_WITHDRAWN,
  THE_RATE_IS_NOT_A_FORMULA,
  WHO_COUNTS,
  bedsPerCrowdedDwelling,
  bedsPerDwelling,
  peoplePerBed,
} from './bed-need-and-order';

const SRC = readFileSync(join(__dirname, 'bed-need-and-order.ts'), 'utf8');

describe('the figures were withdrawn on 15 September 2026', () => {
  it('holds no figure, and every derived list is empty', () => {
    expect(FIGURES).toHaveLength(0);
    expect(ORDERS).toHaveLength(0);
    expect(NEEDS).toHaveLength(0);
    expect(COMPARABLE).toHaveLength(0);
    expect(SCOPE_NOT_STATED).toHaveLength(0);
    expect(SPREAD_PER_HEAD).toBe(0);
    expect(SPREAD_PER_CROWDED).toBe(0);
    expect(FIGURES_WITHDRAWN).toContain('withdrawn');
  });

  it('keeps the classification so the next real figure is recorded with all three fields', () => {
    expect(SRC).toMatch(/interface PlaceFigure \{[^}]*answers: Question;/);
    expect(SRC).toMatch(/interface PlaceFigure \{[^}]*scope: Scope;/);
    expect(SRC).toMatch(/interface PlaceFigure \{[^}]*setBy: string \| null;/);
    expect(typeof isComparable).toBe('function');
    expect(typeof peoplePerBed).toBe('function');
    expect(typeof bedsPerDwelling).toBe('function');
    expect(typeof bedsPerCrowdedDwelling).toBe('function');
  });

  it('names the near miss so nobody rediscovers it as a rate', () => {
    expect(NO_RATE_EXISTS).toContain('0.22 and 0.30');
    expect(NO_RATE_EXISTS).toContain('They are not');
  });

  it('states the finding without claiming a rate', () => {
    expect(THE_FINDING).toContain('withdrew');
    expect(THE_FINDING).not.toMatch(/0\.2[0-9]/);
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
