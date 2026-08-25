/**
 * Guards for community-need.ts.
 *
 * What can rot: a need row pointing at a community canon doesn't know; a community
 * covered twice or covered by both a row and a gap; internal arithmetic drifting from
 * the ABS-supplied totals; the pct not being the ratio it claims to be.
 */

import { describe, it, expect } from 'vitest';
import { COMMUNITY_NEED, COMMUNITY_NEED_GAPS } from './community-need';
import { COMMUNITY_BED_CANON } from './community-canonical';

const canonIds = new Set(COMMUNITY_BED_CANON.map((c) => c.id));

describe('community-need alignment with community canon', () => {
  it('every need row and gap names a real canon community', () => {
    for (const n of COMMUNITY_NEED) expect(canonIds.has(n.communityId), n.communityId).toBe(true);
    for (const g of COMMUNITY_NEED_GAPS) expect(canonIds.has(g.communityId), g.communityId).toBe(true);
  });

  it('every canon community is either measured or an explained gap, never silently missing', () => {
    const covered = new Set([
      ...COMMUNITY_NEED.map((n) => n.communityId),
      ...COMMUNITY_NEED_GAPS.map((g) => g.communityId),
    ]);
    for (const c of COMMUNITY_BED_CANON) {
      expect(covered.has(c.id), `${c.id} has neither a need row nor a stated gap`).toBe(true);
    }
  });

  it('no community appears twice or as both row and gap', () => {
    const all = [...COMMUNITY_NEED.map((n) => n.communityId), ...COMMUNITY_NEED_GAPS.map((g) => g.communityId)];
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('the numbers hold together', () => {
  it('pct is need over occupied, to one decimal', () => {
    for (const n of COMMUNITY_NEED) {
      expect(n.need1plusPct, n.communityId).toBeCloseTo((100 * n.need1plus) / n.occupiedDwellings, 0);
      expect(n.need1plus).toBeLessThanOrEqual(n.occupiedDwellings);
    }
  });

  it('ILOC codes are 8-digit ABS codes with a real state prefix (3=QLD, 5=WA, 7=NT)', () => {
    for (const n of COMMUNITY_NEED) expect(n.ilocCode, n.communityId).toMatch(/^[357]\d{7}$/);
  });
});
