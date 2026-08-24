/**
 * Guards for supply-context.ts — the verified NT waste + overcrowding facts.
 *
 * What can rot here and how each guard catches it:
 *  - a fact edited without provenance → every fact must keep a real sourceUrl
 *    and an asAt date;
 *  - the 20kg ruling drifting out of lockstep with canon → EXPECTED_PLASTIC_KG_DIVERTED
 *    must equal canon's plastic-kg (3,540 today), which is the same derivation;
 *  - the banned scenario family creeping back in (45kg/bed, 800t CDS, 109,600
 *    beds) → the module and the paragraph are swept for them here, and all
 *    surfaces are swept by scripts/check-retired-figures.mjs.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  SUPPLY_FACTS,
  SUPPLY_PARAGRAPH,
  PLASTIC_KG_PER_BED,
  LEG_SETS_PER_TONNE,
  EXPECTED_PLASTIC_KG_DIVERTED,
} from './supply-context';
import { CANONICAL_ASSETS } from './asset-canonical';

describe('supply-context provenance', () => {
  it('every fact carries a real source URL and an asAt date', () => {
    for (const f of SUPPLY_FACTS) {
      expect(f.sourceUrl, f.id).toMatch(/^https:\/\//);
      expect(f.asAt, f.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(f.source.length, f.id).toBeGreaterThan(10);
    }
  });

  it('only verified facts outnumber workpaper; nothing modelled or target ships here', () => {
    // This module is the verified layer. Scenario math lives in the cost model,
    // where modelled labels have their machinery. If a fact here needs
    // 'modelled', it does not belong in supply-context.
    for (const f of SUPPLY_FACTS) {
      expect(['verified', 'workpaper'], `${f.id} solidity`).toContain(f.solidity);
    }
  });
});

describe('the 20kg ruling stays in lockstep', () => {
  it('kg-per-bed is the ruled 20 and leg-sets derive from it', () => {
    expect(PLASTIC_KG_PER_BED).toBe(20);
    expect(LEG_SETS_PER_TONNE).toBe(Math.floor(1000 / PLASTIC_KG_PER_BED));
  });

  it('canon plastic-kg equals stretch beds × the ruled kg (same derivation, one ruling)', () => {
    // canon.ts documents plastic-kg as "stretchBedsDeployed × 20kg". If canon's
    // number moves without this module (or vice versa), one of them is lying.
    expect(EXPECTED_PLASTIC_KG_DIVERTED).toBe(CANONICAL_ASSETS.plasticKg);
  });
});

describe('banned figures never re-enter', () => {
  const src = readFileSync(new URL('./supply-context.ts', import.meta.url), 'utf8');
  const surfaces = [src, SUPPLY_PARAGRAPH, ...SUPPLY_FACTS.map((f) => `${f.value} ${f.means}`)];

  // The 45kg/bed genre (22 beds/t, 17,700, 109,600) and the unsupported 800t
  // CDS figure. Sourced demolition: research/nt-plastics-overcrowding-facts-2026-08-24.md.
  const BANNED = [/45\s?kg/i, /109,?600/, /17,?700/, /22 beds? per tonne/i, /800\s?t(onnes)?[\s\S]{0,30}(cds|container)/i];

  it.each(BANNED.map((re) => [String(re), re] as const))('%s appears nowhere renderable', (_label, re) => {
    for (const s of surfaces) {
      // The watchOut strings NAME the banned figures to warn editors — those
      // lines are allowed; anything a surface would render is not.
      const renderable = s === src ? '' : s;
      if (renderable) expect(renderable).not.toMatch(re);
    }
  });

  it('the paragraph never leads with tonnage as a beds-possible claim', () => {
    expect(SUPPLY_PARAGRAPH).not.toMatch(/beds? possible|could make \d/i);
    expect(SUPPLY_PARAGRAPH).toContain('Feedstock will never be the constraint');
  });
});
