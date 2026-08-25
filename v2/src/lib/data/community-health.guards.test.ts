/**
 * Guards for community-health.ts — same contract as community-need:
 * every canon community is measured or an explained gap, nothing twice,
 * and the numbers keep their internal shape.
 */

import { describe, it, expect } from 'vitest';
import { COMMUNITY_HEALTH, COMMUNITY_HEALTH_GAPS } from './community-health';
import { COMMUNITY_BED_CANON } from './community-canonical';

const canonIds = new Set(COMMUNITY_BED_CANON.map((c) => c.id));

describe('community-health alignment with canon', () => {
  it('every row and gap names a real canon community', () => {
    for (const h of COMMUNITY_HEALTH) expect(canonIds.has(h.communityId), h.communityId).toBe(true);
    for (const g of COMMUNITY_HEALTH_GAPS) expect(canonIds.has(g.communityId), g.communityId).toBe(true);
  });

  it('every canon community is measured or an explained gap', () => {
    const covered = new Set([
      ...COMMUNITY_HEALTH.map((h) => h.communityId),
      ...COMMUNITY_HEALTH_GAPS.map((g) => g.communityId),
    ]);
    for (const c of COMMUNITY_BED_CANON) {
      expect(covered.has(c.id), `${c.id} has neither a health row nor a stated gap`).toBe(true);
    }
  });

  it('no community appears twice or as both row and gap', () => {
    const all = [...COMMUNITY_HEALTH.map((h) => h.communityId), ...COMMUNITY_HEALTH_GAPS.map((g) => g.communityId)];
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('the numbers keep their shape', () => {
  it('LGA codes are 5-digit ABS codes and SRs sit in a sane band', () => {
    for (const h of COMMUNITY_HEALTH) {
      expect(h.lgaCode, h.communityId).toMatch(/^\d{5}$/);
      expect(h.pphSr, h.communityId).toBeGreaterThan(50);
      expect(h.pphSr, h.communityId).toBeLessThan(2000);
      expect(h.medianAgeDeath, h.communityId).toBeGreaterThan(35);
      expect(h.medianAgeDeath, h.communityId).toBeLessThan(95);
    }
  });

  it('ILOC condition counts never exceed persons counted', () => {
    for (const h of COMMUNITY_HEALTH) {
      if (!h.iloc) continue;
      for (const k of ['heartDisease', 'kidneyDisease', 'diabetes'] as const) {
        expect(h.iloc[k], `${h.communityId}.${k}`).toBeLessThanOrEqual(h.iloc.personsCounted);
      }
    }
  });
});
