/**
 * Guards for expansion-need.ts — same rot classes as community-need.guards:
 * a need row naming a target that does not exist, a target silently uncovered,
 * double coverage, or arithmetic drifting from the ABS-supplied totals.
 */

import { describe, it, expect } from 'vitest';
import { EXPANSION_NEED, EXPANSION_NEED_GAPS } from './expansion-need';
import { expansionTargets } from './expansion-targets';

const targetNames = new Set(expansionTargets.map((t) => t.community));

describe('expansion-need alignment with expansion targets', () => {
  it('every need row and gap names a real expansion target', () => {
    for (const n of EXPANSION_NEED) expect(targetNames.has(n.community), n.community).toBe(true);
    for (const g of EXPANSION_NEED_GAPS) expect(targetNames.has(g.community), g.community).toBe(true);
  });

  it('every expansion target is either measured or an explained gap, never silently missing', () => {
    const covered = new Set([
      ...EXPANSION_NEED.map((n) => n.community),
      ...EXPANSION_NEED_GAPS.map((g) => g.community),
    ]);
    for (const t of expansionTargets) {
      expect(covered.has(t.community), `${t.community} has neither a need row nor a stated gap`).toBe(true);
    }
  });

  it('no target appears twice or as both row and gap', () => {
    const all = [...EXPANSION_NEED.map((n) => n.community), ...EXPANSION_NEED_GAPS.map((g) => g.community)];
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('the numbers hold together', () => {
  it('pct is need over occupied, to one decimal', () => {
    for (const n of EXPANSION_NEED) {
      expect(n.need1plusPct, n.community).toBeCloseTo((100 * n.need1plus) / n.occupiedDwellings, 0);
    }
  });

  it('need never exceeds occupied dwellings', () => {
    for (const n of EXPANSION_NEED) {
      expect(n.need1plus, n.community).toBeLessThanOrEqual(n.occupiedDwellings);
    }
  });

  it('every row carries a real ILOC code', () => {
    for (const n of EXPANSION_NEED) {
      expect(n.ilocCode, n.community).toMatch(/^\d{8}$/);
    }
  });
});
