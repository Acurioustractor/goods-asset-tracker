/**
 * Forward case study (`nextPhase`) invariants.
 *
 * These records say what working with each community looks like from here, and they are the ones
 * most likely to be read by someone deciding whether to fund it. Three things would degrade them
 * without breaking anything:
 *
 *   1. THE FACILITY MISREAD. Every pathway has been misread in the same direction, as a plant.
 *      Ruling D says the object is infrastructure, and of four pathways only Oonchiumpa wants a
 *      whole facility. `isNot` is the field that holds that line, so it may never be empty.
 *
 *   2. A BLOCKAGE QUIETLY BECOMING A NUMBER. Tennant Creek is blocked on a partner's decision and
 *      Palm Island prices at $0 because the model has no governance line. Both are findings.
 *      Filling either cell with an estimate would look like progress and would destroy the
 *      information. So a blocked pathway must carry no figures, and the $0 must stay labelled
 *      wrong-answer.
 *
 *   3. AN OWNERSHIP CLAIM SLIPPING INTO THE FORWARD TENSE. `ownsWhat` describes an intended
 *      destination. It must never read as though the transfer has happened.
 */

import { describe, it, expect } from 'vitest';
import { COMMUNITY_PATHWAYS, MODULES, type CommunityPathway } from '@/lib/data/community-pathways';
import { SITE_OWNERSHIP_TESTS } from '@/lib/data/ownership-test';

const withNextPhase = COMMUNITY_PATHWAYS.filter((p) => p.nextPhase);

describe('coverage', () => {
  it('every live pathway has a forward case study', () => {
    expect(withNextPhase.map((p) => p.id).sort()).toEqual(
      COMMUNITY_PATHWAYS.map((p) => p.id).sort(),
    );
  });

  it('every pathway with a forward case study also has an ownership-test record', () => {
    const tested = new Set(SITE_OWNERSHIP_TESTS.map((s) => s.pathwayId));
    for (const p of withNextPhase) {
      expect(tested.has(p.id), `${p.id} has a next phase but no ownership-test record`).toBe(true);
    }
  });
});

describe('every field earns its place', () => {
  it.each(withNextPhase.map((p) => [p.id, p] as [string, CommunityPathway]))(
    '%s states headline, isNot, ownsWhat, blockedOn and ask',
    (_id, p) => {
      const np = p.nextPhase!;
      for (const [field, value] of Object.entries({
        headline: np.headline,
        isNot: np.isNot,
        ownsWhat: np.ownsWhat,
        blockedOn: np.blockedOn,
        ask: np.ask,
      })) {
        expect(value.trim().length, `${field} is empty`).toBeGreaterThan(0);
      }
      expect(np.cost.costSource.trim().length).toBeGreaterThan(0);
    },
  );

  it('only uses module ids that exist in MODULES', () => {
    const known = new Set(MODULES.map((m) => m.id));
    for (const p of withNextPhase) {
      for (const id of p.nextPhase!.modules) {
        expect(known.has(id as never), `${p.id} references unknown module "${id}"`).toBe(true);
      }
    }
  });
});

describe('a blockage stays a blockage', () => {
  it('a pathway blocked on people carries no invented figures', () => {
    for (const p of withNextPhase) {
      const c = p.nextPhase!.cost;
      if (c.status !== 'blocked-on-people') continue;
      expect(c.capexLow, `${p.id} capexLow`).toBeNull();
      expect(c.capexHigh, `${p.id} capexHigh`).toBeNull();
      expect(c.operatingPerYear, `${p.id} operating`).toBeNull();
    }
  });

  it('Tennant Creek is blocked on people, not on numbers', () => {
    const tc = COMMUNITY_PATHWAYS.find((p) => p.id === 'tennant-creek')!;
    expect(tc.nextPhase!.cost.status).toBe('blocked-on-people');
    expect(tc.nextPhase!.blockedOn.toLowerCase()).toContain('people, not numbers');
  });

  it('Palm Island keeps $0 labelled as the wrong answer', () => {
    const pi = COMMUNITY_PATHWAYS.find((p) => p.id === 'palm-island')!;
    const c = pi.nextPhase!.cost;
    expect(c.status).toBe('wrong-answer');
    expect(c.capexLow).toBe(0);
    expect(c.note.toLowerCase()).toContain('wrong answer');
  });

  it('a wrong-answer price is never presented as modelled', () => {
    for (const p of withNextPhase) {
      const c = p.nextPhase!.cost;
      if (c.capexLow === 0 && c.capexHigh === 0 && c.operatingPerYear === 0) {
        expect(c.status, `${p.id} prices at zero but is not flagged`).toBe('wrong-answer');
      }
    }
  });
});

describe('the priced pathways', () => {
  it('exactly two of four price, which is the honest state of the portfolio', () => {
    const modelled = withNextPhase.filter((p) => p.nextPhase!.cost.status === 'modelled');
    expect(modelled.map((p) => p.id).sort()).toEqual(['oonchiumpa', 'utopia']);
  });

  it('Utopia carries a real band, low below high, and names where it is computed', () => {
    const u = COMMUNITY_PATHWAYS.find((p) => p.id === 'utopia')!;
    const c = u.nextPhase!.cost;
    expect(c.capexLow!).toBeLessThan(c.capexHigh!);
    expect(c.capexLow).toBe(24800);
    expect(c.capexHigh).toBe(39300);
    expect(c.operatingPerYear).toBe(16043);
    expect(c.costSource).toMatch(/priceModule/);
  });

  it('Utopia costs less than the full facility it is deliberately not', () => {
    const u = COMMUNITY_PATHWAYS.find((p) => p.id === 'utopia')!;
    // $79,333/yr is the bare site production block for a full facility.
    expect(u.nextPhase!.cost.operatingPerYear!).toBeLessThan(79333);
    expect(u.nextPhase!.isNot.toLowerCase()).toContain('not a complete production facility');
  });
});

describe('claims', () => {
  it('no forward case study claims the transfer has happened', () => {
    for (const p of withNextPhase) {
      const np = p.nextPhase!;
      const prose = [np.headline, np.isNot, np.ownsWhat, np.blockedOn, np.ask].join(' ');
      expect(prose.toLowerCase(), `${p.id}`).not.toMatch(
        /now owns|has taken ownership|ownership is complete|community-owned entity now/,
      );
    }
  });

  it('records that Oonchiumpa has not been asked about the seller direction', () => {
    const o = COMMUNITY_PATHWAYS.find((p) => p.id === 'oonchiumpa')!;
    expect(o.nextPhase!.ownsWhat.toLowerCase()).toContain('has not been asked');
    expect(o.nextPhase!.ownsWhat.toLowerCase()).toMatch(/direction to test|not yet a decision/);
  });

  it('carries no em dashes and none of the banned pitch words', () => {
    const banned =
      /\b(empower\w*|beneficiar\w*|ecosystem|scalable solution|transformational|game[- ]changing|co-design)\b/i;
    for (const p of withNextPhase) {
      const np = p.nextPhase!;
      for (const line of [np.headline, np.isNot, np.ownsWhat, np.blockedOn, np.ask, np.cost.note, np.cost.costSource]) {
        expect(line, `em dash in ${p.id}: ${line}`).not.toMatch(/—/);
        expect(line, `banned word in ${p.id}: ${line}`).not.toMatch(banned);
      }
    }
  });
});

describe('history layer', () => {
  it('every pathway carries dated receipts', () => {
    for (const p of COMMUNITY_PATHWAYS) {
      expect(p.history.length, `${p.id} has no history entries`).toBeGreaterThan(0);
    }
  });

  it('dates are YYYY or YYYY-MM and sorted oldest first', () => {
    for (const p of COMMUNITY_PATHWAYS) {
      for (const h of p.history) {
        expect(h.date, `${p.id}: bad date "${h.date}"`).toMatch(/^\d{4}(-\d{2})?$/);
      }
      const dates = p.history.map((h) => h.date);
      expect(dates, `${p.id} history is not oldest-first`).toEqual([...dates].sort());
    }
  });

  it('every entry names its source - no receipts from memory alone', () => {
    for (const p of COMMUNITY_PATHWAYS) {
      for (const h of p.history) {
        expect(h.source.trim().length, `${p.id}: "${h.event.slice(0, 40)}..." has no source`).toBeGreaterThan(5);
        expect(h.event, `em dash in ${p.id} history`).not.toMatch(/—/);
      }
    }
  });
});
