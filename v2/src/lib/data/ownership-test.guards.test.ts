/**
 * Month-6 ownership test invariants.
 *
 * This test exists because the ownership claim is the centre of the pitch, and the failure mode
 * is not a crash. It is a checkpoint quietly getting easier. Every softening below would compile,
 * ship, and read fine on a slide:
 *
 *   - adding a 'partial' result, which is the exact thing the original ruling forbids
 *   - letting a site be tested before it produces for sale, which makes several sites eligible
 *     at once and costs nothing at the type level
 *   - putting "factory" back into checkpoint 1, which silently excludes every module pathway
 *   - a public surface stating the ownership claim from a hardcoded string rather than from
 *     the evidence
 *
 * So these are invariants, not unit tests. Failure direction matters: a test that gets harder is
 * a decision someone made, and a test that gets easier is almost always an accident.
 */

import { describe, it, expect } from 'vitest';
import { COMMUNITY_PATHWAYS } from '@/lib/data/community-pathways';
import {
  OWNERSHIP_CHECKPOINTS,
  SITE_OWNERSHIP_TESTS,
  SCORING_RULE,
  CLOCK_RULE,
  PRODUCTION_SITE_RULE,
  SOVEREIGNTY_GATE,
  FIFTY_ONE_PERCENT_IS_A_DIFFERENT_TEST,
  addMonths,
  isEligible,
  testDueOn,
  siteTestState,
  passedCheckpoints,
  eligibleSites,
  ownershipClaimLine,
  orphanedSiteIds,
  type SiteOwnershipTest,
  type CheckpointId,
} from '@/lib/data/ownership-test';

const ALL_PASS: Record<CheckpointId, 'pass'> = {
  keys: 'pass',
  payroll: 'pass',
  invoice: 'pass',
  decision: 'pass',
};

function siteFixture(over: Partial<SiteOwnershipTest> = {}): SiteOwnershipTest {
  return {
    pathwayId: 'oonchiumpa',
    siteName: 'Test site',
    deliverStartedOn: '2026-01-01',
    producesForSale: true,
    results: { ...ALL_PASS },
    note: 'fixture',
    ...over,
  };
}

describe('the four checkpoints', () => {
  it('is exactly four, and they are the ruled four', () => {
    expect(OWNERSHIP_CHECKPOINTS.map((c) => c.id)).toEqual([
      'keys',
      'payroll',
      'invoice',
      'decision',
    ]);
  });

  it('never reintroduces "factory", which would exclude every module pathway (ruling D)', () => {
    for (const c of OWNERSHIP_CHECKPOINTS) {
      expect(`${c.label} ${c.passesWhen} ${c.why}`.toLowerCase()).not.toContain('factory');
    }
  });

  it('checkpoint 4 is Decision, not a production percentage, so it cannot collide with the 51% test', () => {
    const decision = OWNERSHIP_CHECKPOINTS.find((c) => c.id === 'decision');
    expect(decision).toBeDefined();
    expect(decision!.passesWhen).not.toMatch(/\d+\s*%|\bper cent\b|\bpercent\b/i);
  });

  it('keeps the two ownership tests explicitly distinguished', () => {
    expect(FIFTY_ONE_PERCENT_IS_A_DIFFERENT_TEST).toMatch(/supplier entity/i);
    expect(FIFTY_ONE_PERCENT_IS_A_DIFFERENT_TEST).toMatch(/51%/);
  });

  it('states the clock, the production-site boundary and the sovereignty gate', () => {
    expect(CLOCK_RULE).toMatch(/six months/i);
    expect(CLOCK_RULE).toMatch(/deliver/i);
    expect(PRODUCTION_SITE_RULE).toMatch(/for sale only/i);
    expect(SOVEREIGNTY_GATE).toMatch(/published/i);
    expect(SCORING_RULE).toMatch(/four of four/i);
  });
});

describe('binary scoring - partial counts as NO', () => {
  it('passes only when all four pass', () => {
    expect(siteTestState(siteFixture(), '2026-12-01')).toBe('pass');
  });

  it.each(['keys', 'payroll', 'invoice', 'decision'] as CheckpointId[])(
    'fails when only %s is missing, however close the rest are',
    (missing) => {
      const site = siteFixture({ results: { ...ALL_PASS, [missing]: 'fail' } });
      expect(siteTestState(site, '2026-12-01')).toBe('fail');
    },
  );

  it('treats not-assessed as a fail, never as a pass', () => {
    const site = siteFixture({ results: { ...ALL_PASS, invoice: 'not-assessed' } });
    expect(siteTestState(site, '2026-12-01')).toBe('fail');
  });

  it('still records which checkpoints passed, because that is what makes a fail useful', () => {
    const site = siteFixture({ results: { ...ALL_PASS, decision: 'fail' } });
    expect(passedCheckpoints(site)).toEqual(['keys', 'payroll', 'invoice']);
  });
});

describe('eligibility and the clock', () => {
  it('is not eligible before Deliver starts', () => {
    const site = siteFixture({ deliverStartedOn: null });
    expect(isEligible(site)).toBe(false);
    expect(testDueOn(site)).toBeNull();
    expect(siteTestState(site, '2030-01-01')).toBe('not-eligible');
  });

  it('is not eligible when the site does not produce for sale (assembly is not production)', () => {
    const site = siteFixture({ producesForSale: false });
    expect(isEligible(site)).toBe(false);
    expect(siteTestState(site, '2030-01-01')).toBe('not-eligible');
  });

  it('falls due exactly six months after Deliver starts', () => {
    expect(testDueOn(siteFixture({ deliverStartedOn: '2026-01-01' }))).toBe('2026-07-01');
    expect(addMonths('2026-12-15', 6)).toBe('2027-06-15');
  });

  it('clamps to the end of the month rather than overflowing it', () => {
    // 31 Aug + 6 months is 28 Feb, not 3 March. Naive Date arithmetic gets this wrong.
    expect(addMonths('2026-08-31', 6)).toBe('2027-02-28');
    expect(addMonths('2027-08-31', 6)).toBe('2028-02-29');
    expect(addMonths('2026-07-31', 6)).toBe('2027-01-31');
  });

  it('withholds a verdict until month 6, rather than reporting an early fail', () => {
    const site = siteFixture({ deliverStartedOn: '2026-01-01', results: { ...ALL_PASS, keys: 'fail' } });
    expect(siteTestState(site, '2026-06-30')).toBe('awaiting-month-6');
    expect(siteTestState(site, '2026-07-01')).toBe('fail');
  });
});

describe('the live site records', () => {
  it('every site points at a real pathway', () => {
    expect(orphanedSiteIds()).toEqual([]);
  });

  it('covers every live pathway, so a new community cannot be invisible to the test', () => {
    expect(SITE_OWNERSHIP_TESTS.map((s) => s.pathwayId).sort()).toEqual(
      COMMUNITY_PATHWAYS.map((p) => p.id).sort(),
    );
  });

  it('no site is yet eligible, which is the honest current state', () => {
    expect(eligibleSites()).toEqual([]);
  });
});

describe('the public claim is derived, never written', () => {
  it('says not-yet-eligible rather than not-yet-met while nothing is eligible', () => {
    const line = ownershipClaimLine('2026-07-26');
    expect(line).toMatch(/no site is yet eligible/i);
    // "not yet met" reads as four failures. It is not what is true.
    expect(line.toLowerCase()).not.toContain('not yet met');
  });

  it('never claims ownership is complete, on any state of the data', () => {
    const line = ownershipClaimLine('2026-07-26');
    expect(line.toLowerCase()).not.toMatch(/community-owned|now owns|ownership complete|handed over/);
  });

  it('reports passes against the eligible denominator, not the whole portfolio', () => {
    // Guards the honest-denominator habit: a pass is 1 of the eligible, never 1 of 4 communities.
    const line = ownershipClaimLine('2026-07-26');
    expect(line).not.toMatch(/of 4\b/);
  });
});
