import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  BY_REMOTENESS,
  EMPLOYMENT_CLAIM_CEILING,
  REMOTE_PROGRAMS,
  TARGET_8,
  allEmploymentFigures,
  needsPrimarySource,
} from './employment-problem';
import { MODELLED_LABOUR_HOURS_PER_BED } from './impact-model';

const SRC = readFileSync(join(__dirname, 'employment-problem.ts'), 'utf8');

describe('every figure is sourced, dated and graded', () => {
  it('carries all four', () => {
    for (const f of allEmploymentFigures()) {
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

describe('the gradient never travels without the national figure, or the other way round', () => {
  it('holds both, because either alone misleads', () => {
    // 55.7% and on track reads as solved. 35% alone reads as national. Both are needed.
    expect(TARGET_8.some((f) => f.value.includes('55.7%'))).toBe(true);
    expect(BY_REMOTENESS[0].value).toMatch(/62% in major cities/);
    expect(BY_REMOTENESS[0].value).toMatch(/35% in very remote/);
  });

  it('says where Goods communities sit on it', () => {
    expect(BY_REMOTENESS[0].note).toMatch(/very remote end of this gradient/i);
  });
});

describe('nothing here becomes a job Goods created', () => {
  it('the ceiling forbids it', () => {
    expect(EMPLOYMENT_CLAIM_CEILING).toMatch(/no figure here may be presented as a job Goods created/i);
    expect(EMPLOYMENT_CLAIM_CEILING).toMatch(/never been time-studied/i);
  });

  it('exports no function that multiplies a rate by beds', () => {
    const fns = (SRC.match(/^export function (\w+)/gm) ?? []).map((l) =>
      l.replace('export function ', ''),
    );
    expect(fns.sort()).toEqual(['allEmploymentFigures', 'needsPrimarySource'].sort());
    expect(SRC).not.toMatch(/beds?\s*\*/i);
    expect(SRC).not.toMatch(/\*\s*beds?\b/i);
  });

  it('keeps the per-bed hours where they belong and does not import them', () => {
    // Two modelled hours a bed lives in impact-model. Importing it here would invite someone to
    // multiply a national employment rate by a bed count.
    expect(MODELLED_LABOUR_HOURS_PER_BED).toBe(2);
    expect(SRC).not.toContain('MODELLED_LABOUR_HOURS_PER_BED');
  });

  it('no figure description claims a Goods outcome', () => {
    for (const f of allEmploymentFigures()) {
      expect(f.what).not.toMatch(/Goods (created|delivered|generated|produced)/i);
    }
  });
});

describe('the policy window is recorded as positioning, not as impact', () => {
  it('carries the date the old program ended', () => {
    const raes = REMOTE_PROGRAMS.find((f) => f.value.includes('1 November 2025'))!;
    expect(raes.what).toMatch(/Community Development Program was replaced/i);
    expect(raes.grade).toBe('verified');
  });

  it('carries the jobs the new program funds', () => {
    const rjed = REMOTE_PROGRAMS.find((f) => f.value.includes('6,000 jobs'))!;
    expect(rjed.what).toMatch(/superannuation and leave/i);
  });

  it('the module frames the fit as positioning', () => {
    expect(SRC).toMatch(/positioning fact, not an impact claim/i);
  });
});
