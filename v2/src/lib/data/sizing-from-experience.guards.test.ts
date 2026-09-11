import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  COMPARATORS,
  HOMELANDS,
  HOW_TO_SAY_IT,
  NOBODY_HAS_SAID_ENOUGH,
  PLANNING_HIGH,
  PLANNING_LOW,
  THE_CEILING,
  THE_COINCIDENCE,
  TOWNS,
  WORKED_THROUGH_RATE_HIGH,
  WORKED_THROUGH_RATE_LOW,
  peoplePerBedDelivered,
  peoplePerBedWithAsk,
  sizeTown,
} from './sizing-from-experience';
import { COMMUNITY_BED_CANON } from './community-canonical';
import { COMMUNITY_NEED } from './community-need';

const SRC = readFileSync(join(__dirname, 'sizing-from-experience.ts'), 'utf8');
const ID: Record<string, string> = {
  'Palm Island': 'palm-island',
  'Tennant Creek': 'tennant-creek',
  Maningrida: 'maningrida',
  Utopia: 'utopia',
};

describe('the comparators tie to the register and the Census', () => {
  it('every delivered count matches community-canonical', () => {
    for (const c of COMPARATORS) {
      const k = COMMUNITY_BED_CANON.find((x) => x.id === ID[c.place])!;
      expect(k, c.place).toBeTruthy();
      expect(c.delivered).toBe((k.basketBeds ?? 0) + (k.stretchBeds ?? 0));
    }
  });

  it('every population matches community-need', () => {
    for (const c of COMPARATORS) {
      const n = COMMUNITY_NEED.find((x) => x.communityId === ID[c.place])!;
      expect(c.people).toBe(Math.round(n.occupiedDwellings * n.personsPerDwelling));
    }
  });
});

describe('the observation', () => {
  it('Palm Island and Tennant Creek land within a tenth of each other', () => {
    const pi = COMPARATORS.find((c) => c.place === 'Palm Island')!;
    const tc = COMPARATORS.find((c) => c.place === 'Tennant Creek')!;
    expect(peoplePerBedDelivered(pi)).toBeCloseTo(16.0, 1);
    expect(peoplePerBedDelivered(tc)).toBeCloseTo(15.9, 1);
    expect(Math.abs(peoplePerBedDelivered(pi) - peoplePerBedDelivered(tc))).toBeLessThan(0.2);
    expect(WORKED_THROUGH_RATE_LOW).toBeLessThan(WORKED_THROUGH_RATE_HIGH);
  });

  it('the planning range is one per 12 to one per 21, a spread under two', () => {
    expect(PLANNING_LOW).toBeCloseTo(12.3, 1);
    expect(PLANNING_HIGH).toBeCloseTo(20.5, 1);
    expect(PLANNING_HIGH / PLANNING_LOW).toBeLessThan(2);
  });

  it('it is much tighter than the recorded asks alone, which span 43', () => {
    const raw = COMPARATORS.map((c) => c.people / c.askedNext);
    expect(Math.max(...raw) / Math.min(...raw)).toBeGreaterThan(10);
    expect(PLANNING_HIGH / PLANNING_LOW).toBeLessThan(2);
  });

  it('Utopia is held out and is four times denser than any town', () => {
    expect(HOMELANDS).toHaveLength(1);
    expect(HOMELANDS[0].place).toBe('Utopia');
    const u = peoplePerBedDelivered(HOMELANDS[0]);
    for (const t of TOWNS) expect(peoplePerBedDelivered(t)).toBeGreaterThan(u * 4);
  });

  it('every town has asked for more, so the range is a floor', () => {
    for (const c of COMPARATORS) expect(c.askedNext).toBeGreaterThan(0);
    for (const c of COMPARATORS) {
      expect(peoplePerBedWithAsk(c)).toBeLessThan(peoplePerBedDelivered(c));
    }
  });
});

describe('using it', () => {
  it('sizes a 2,000-person town at roughly 100 to 160 beds', () => {
    const s = sizeTown(2_000);
    expect(s.low).toBe(98);
    expect(s.high).toBe(163);
    expect(s.workedThrough).toBe(125);
    expect(s.low).toBeLessThan(s.workedThrough);
    expect(s.workedThrough).toBeLessThan(s.high);
  });

  it('reproduces Maningrida inside its own range', () => {
    const m = COMPARATORS.find((c) => c.place === 'Maningrida')!;
    const s = sizeTown(m.people);
    expect(m.delivered + m.askedNext).toBeGreaterThanOrEqual(s.low);
    expect(m.delivered + m.askedNext).toBeLessThanOrEqual(s.high);
  });

  it('every sizing carries its basis and says it is a floor', () => {
    expect(sizeTown(1_000).basis).toContain('floor');
    expect(sizeTown(1_000).basis).toContain('Census population');
  });
});

describe('honesty', () => {
  it('says out loud that it is not a need measure', () => {
    expect(THE_CEILING).toContain('not a measure of need');
    expect(THE_CEILING).toContain('floor rather than a ceiling');
    expect(THE_CEILING).toContain('household count');
  });

  it('names what bounded the numbers', () => {
    expect(THE_CEILING).toContain('what we could afford to make');
  });

  it('keeps the plainest claim, which needs no model', () => {
    expect(NOBODY_HAS_SAID_ENOUGH).toContain('eleven communities');
    expect(NOBODY_HAS_SAID_ENOUGH.toLowerCase()).toContain('not one');
  });

  it('records why the two earlier attempts failed', () => {
    const flat = SRC.replace(/\s*\n\s*\*?\s*/g, ' ');
    expect(flat).toContain('place-denominator.ts');
    expect(flat).toContain('bed-need-and-order.ts');
  });

  it('the coincidence is stated as a coincidence, with both figures', () => {
    expect(THE_COINCIDENCE).toContain('16.0');
    expect(THE_COINCIDENCE).toContain('15.9');
    expect(THE_COINCIDENCE).toContain('no coordination');
  });

  it('five ways to say it, and the last one is the count', () => {
    expect(HOW_TO_SAY_IT).toHaveLength(5);
    expect(HOW_TO_SAY_IT[4]).toContain('household count');
  });

  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });
});
