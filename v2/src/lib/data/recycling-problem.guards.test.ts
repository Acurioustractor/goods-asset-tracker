import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  NATIONAL_PLASTIC,
  RECYCLING_CLAIM_CEILING,
  REMOTE_BARRIERS,
  REMOTE_SERVICE,
  allRecyclingFigures,
  needsPrimarySource,
} from './recycling-problem';
import { KG_IN_BED } from './place-feedstock';

const SRC = readFileSync(join(__dirname, 'recycling-problem.ts'), 'utf8');

describe('every figure is sourced, dated and graded', () => {
  it('carries all four', () => {
    for (const f of allRecyclingFigures()) {
      expect(f.value.length).toBeGreaterThan(0);
      expect(f.what.length).toBeGreaterThan(20);
      expect(f.asAt.length).toBeGreaterThan(3);
      expect(f.sourceUrl).toMatch(/^https:\/\//);
      expect(['verified', 'unverified']).toContain(f.grade);
    }
  });

  it('says why anything unverified is unverified', () => {
    const pending = needsPrimarySource();
    expect(pending.length).toBeGreaterThan(0);
    for (const f of pending) expect(f.note && f.note.length > 25).toBe(true);
  });

  it('refuses the 20% HDPE figure until its primary is read', () => {
    const hdpe = NATIONAL_PLASTIC.find((f) => f.what.includes('HDPE'))!;
    expect(hdpe.value).toBe('15.0%');
    expect(hdpe.asAt).toBe('2017–18');
    expect(hdpe.note).toMatch(/not used here until the primary is opened/i);
  });
});

describe('the national rate is never presented as a Goods community rate', () => {
  it('records the absence of service rather than inventing a remote rate', () => {
    for (const f of REMOTE_SERVICE) {
      expect(f.value).not.toMatch(/^\d+(\.\d+)?%$/);
    }
    const kerbside = REMOTE_SERVICE.find((f) => f.what.includes('kerbside'))!;
    expect(kerbside.what).toMatch(/Remote Indigenous communities are outside it/);
  });

  it('the ceiling says no recovery rate here describes a Goods community', () => {
    expect(RECYCLING_CLAIM_CEILING).toMatch(/no recovery rate here describes a Goods community/i);
  });

  it('names the barriers as infrastructure and freight, not behaviour', () => {
    const joined = REMOTE_BARRIERS.join(' ').toLowerCase();
    expect(joined).toContain('freight');
    expect(joined).toContain('scale');
    expect(joined).not.toMatch(/attitude|awareness|education|care about/);
  });
});

describe('nothing joins a national figure to a bed', () => {
  it('exports no function that multiplies', () => {
    const fns = (SRC.match(/^export function (\w+)/gm) ?? []).map((l) =>
      l.replace('export function ', ''),
    );
    expect(fns.sort()).toEqual(['allRecyclingFigures', 'needsPrimarySource'].sort());
    expect(SRC).not.toMatch(/beds?\s*\*/i);
    expect(SRC).not.toMatch(/\*\s*beds?\b/i);
  });

  it('no figure description mentions a bed count', () => {
    for (const f of allRecyclingFigures()) {
      expect(f.what).not.toMatch(/\d+\s*beds?\b/i);
    }
  });

  it('the per-bed mass stays where it belongs, in place-feedstock', () => {
    // 20 kg a bed is a design mass and lives with the production model, not with the national
    // waste figures, so nobody is tempted to multiply one by the other.
    expect(KG_IN_BED).toBe(20);
    expect(SRC).not.toContain('KG_IN_BED');
  });
});

describe('the West Arnhem row is the one that names a Goods place', () => {
  it('links Maningrida to five landfills across 50,000 square kilometres', () => {
    const wa = REMOTE_SERVICE.find((f) => f.value.includes('50,000'))!;
    expect(wa.value).toMatch(/five remote landfill sites/);
    expect(wa.note).toMatch(/Maningrida/);
    expect(wa.grade).toBe('verified');
  });
});
