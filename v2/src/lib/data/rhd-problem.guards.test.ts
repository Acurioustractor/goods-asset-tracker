import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ARF_INCIDENCE,
  CROWDING_BY_REGION,
  CROWDING_RISK,
  RHD_BURDEN,
  RHD_CLAIM_CEILING,
  allFigures,
} from './rhd-problem';
import { COMMUNITY_NEED } from './community-need';

const SRC = readFileSync(join(__dirname, 'rhd-problem.ts'), 'utf8');

describe('every figure is sourced and dated', () => {
  it('carries a value, what it counts, a period and an AIHW url', () => {
    for (const f of allFigures()) {
      expect(f.value.length).toBeGreaterThan(0);
      expect(f.what.length).toBeGreaterThan(20);
      expect(f.asAt.length).toBeGreaterThan(3);
      expect(f.sourceUrl).toMatch(/^https:\/\/www\.aihw\.gov\.au\//);
    }
  });

  it('has both the burden and the incidence, because one alone misleads', () => {
    // Prevalence alone reads as historical. New diagnoses say it is happening now.
    expect(RHD_BURDEN.length).toBeGreaterThan(3);
    expect(ARF_INCIDENCE.length).toBeGreaterThan(3);
  });
});

describe('the claim ceiling is in the module, not in a comment somewhere', () => {
  it('says Goods has run no study and claims no prevented case', () => {
    expect(RHD_CLAIM_CEILING).toMatch(/never run a clinical study/i);
    expect(RHD_CLAIM_CEILING).toMatch(/never\s+claims/i);
  });

  it('forbids multiplying a health figure by beds', () => {
    expect(RHD_CLAIM_CEILING).toMatch(/may be multiplied by a bed count/i);
  });

  it('exports nothing that joins a health figure to a bed count', () => {
    const fns = (SRC.match(/^export function (\w+)/gm) ?? []).map((l) =>
      l.replace('export function ', ''),
    );
    expect(fns).toEqual(['allFigures']);
    expect(SRC).not.toMatch(/beds?\s*\*/i);
    expect(SRC).not.toMatch(/\*\s*beds?\b/i);
    // Check the figures themselves, not the prose: the ceiling text has to contain the words it
    // forbids in order to forbid them.
    for (const f of allFigures()) {
      expect(f.what).not.toMatch(/prevented|averted|reduced|interrupted/i);
      expect(f.what).not.toMatch(/\bbed\b/i);
    }
  });
});

describe('the risk factor is the measure we already hold', () => {
  it('AIHW names crowding as strongly associated with Strep A', () => {
    expect(CROWDING_RISK.aihwOnCrowding).toMatch(/associated strongly with Strep A/);
  });

  it('AIHW defines crowding by CNOS, which is what the ABS extract uses', () => {
    expect(CROWDING_RISK.cnosDefinition).toMatch(/Canadian National Occupancy Standard/);
    expect(CROWDING_RISK.cnosDefinition).toMatch(/at least one additional bedroom/);
    // community-need.ts carries CNOS "requiring one or more extra bedrooms" for 1,138 ILOCs.
    // Same standard, so our per-community figures are the risk-factor measure itself.
    expect(COMMUNITY_NEED.length).toBeGreaterThan(0);
    for (const c of COMMUNITY_NEED) expect(c.need1plus).toBeGreaterThanOrEqual(0);
  });

  it('carries the washing standard, which is the washing machine in AIHW words', () => {
    expect(CROWDING_RISK.acceptableHouse).toContain('Working facilities for washing people');
    expect(CROWDING_RISK.acceptableHouse).toContain('Working facilities for washing clothes or bedding');
  });
});

describe('the regions Goods works in are the worst in the country', () => {
  it('puts Arnhem Land and Central Australia far above the national figure', () => {
    const byRegion = new Map(CROWDING_BY_REGION.map((r) => [r.region, r.pct]));
    const national = byRegion.get('Australia, all First Nations people')!;
    expect(national).toBe(15);
    expect(byRegion.get('Arnhem Land and Groote Eylandt')!).toBe(70);
    expect(byRegion.get('Central Australia')!).toBe(49);
    expect(byRegion.get('Arnhem Land and Groote Eylandt')! / national).toBeGreaterThan(4);
  });

  it('names which Goods communities sit in which region', () => {
    const notes = CROWDING_BY_REGION.map((r) => r.note ?? '').join(' ');
    for (const place of ['Maningrida', 'Utopia', 'Alice Springs', 'Kununurra']) {
      expect(notes).toContain(place);
    }
  });
});
