import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS,
  OWNERSHIP_CLAIM_CEILING,
  OWNERSHIP_THRESHOLD,
  SECTOR_SCALE,
  allOwnershipFigures,
  needsPrimarySource,
} from './ownership-problem';

const SRC = readFileSync(join(__dirname, 'ownership-problem.ts'), 'utf8');

describe('every figure is sourced, dated and graded', () => {
  it('carries all four', () => {
    for (const f of allOwnershipFigures()) {
      expect(f.value.length).toBeGreaterThan(0);
      expect(f.what.length).toBeGreaterThan(20);
      expect(f.asAt.length).toBeGreaterThan(3);
      expect(f.sourceUrl).toMatch(/^https:\/\//);
      expect(['verified', 'unverified']).toContain(f.grade);
    }
  });

  it('says why anything unverified is unverified', () => {
    for (const f of needsPrimarySource()) expect(f.note && f.note.length > 25).toBe(true);
  });
});

describe('the headline is the figure read directly, not the striking one', () => {
  it('grades 68.4% verified and the 40-to-100-times claim unverified', () => {
    const rate = INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS.find((f) => f.value === '68.4%')!;
    expect(rate.grade).toBe('verified');
    const multiple = INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS.find((f) =>
      f.value.includes('40 to 100'),
    )!;
    expect(multiple.grade).toBe('unverified');
    expect(multiple.note).toMatch(/safer line to use/i);
  });

  it('keeps the comparison beside it, because a rate alone means nothing', () => {
    const comparison = INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS.find((f) =>
      f.value.includes('3 to 5%'),
    )!;
    expect(comparison.grade).toBe('verified');
  });

  it('carries the fall with business size, which cuts against us', () => {
    const bySize = INDIGENOUS_EMPLOYMENT_IN_INDIGENOUS_BUSINESS.find((f) =>
      f.value.includes('38.3%'),
    )!;
    expect(bySize.note).toMatch(/drifts toward the average/i);
  });

  it('grades the sector scale unverified, since it came from reporting', () => {
    expect(SECTOR_SCALE.every((f) => f.grade === 'unverified')).toBe(true);
  });
});

describe('nothing here becomes a Goods result', () => {
  it('the ceiling says no plant has transferred and no test has run', () => {
    expect(OWNERSHIP_CLAIM_CEILING).toMatch(/transferred no plant/i);
    expect(OWNERSHIP_CLAIM_CEILING).toMatch(/never run its month-six ownership test/i);
    expect(OWNERSHIP_CLAIM_CEILING).toMatch(/nothing here is a Goods result/i);
  });

  it('exports no function that multiplies or applies a rate', () => {
    const fns = (SRC.match(/^export function (\w+)/gm) ?? []).map((l) =>
      l.replace('export function ', ''),
    );
    expect(fns.sort()).toEqual(['allOwnershipFigures', 'needsPrimarySource'].sort());
    expect(SRC).not.toMatch(/beds?\s*\*/i);
    expect(SRC).not.toMatch(/\*\s*beds?\b/i);
  });
});

describe('the 50% threshold is both the definition and the finance gate', () => {
  it('quotes the statistical definition', () => {
    expect(OWNERSHIP_THRESHOLD.definition).toMatch(/at least 50% Aboriginal and \/ or Torres Strait Islander ownership/);
  });

  it('records that the same threshold gates IBA and turns on the constitution', () => {
    expect(OWNERSHIP_THRESHOLD.alsoGates).toMatch(/ownership or membership/i);
    expect(OWNERSHIP_THRESHOLD.alsoGates).toMatch(/constitution/i);
    expect(OWNERSHIP_THRESHOLD.alsoGates).toMatch(/has not been read/i);
  });
});
