/**
 * Guards for community-need.ts.
 *
 * What can rot: a need row pointing at a community canon doesn't know; a community
 * covered twice or covered by both a row and a gap; internal arithmetic drifting from
 * the ABS-supplied totals; the pct not being the ratio it claims to be.
 */

import { describe, it, expect } from 'vitest';
import {
  ABS_ILOC_OVERCROWDING,
  COMMUNITY_NEED,
  COMMUNITY_NEED_GAPS,
  ilocByCode,
  searchIlocs,
} from './community-need';
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

describe('the reference is whole and the crosswalk is the only way in', () => {
  it('carries every ABS ILOC', () => {
    expect(ABS_ILOC_OVERCROWDING.length).toBe(1138);
  });

  it('has no duplicate ILOC codes', () => {
    const codes = ABS_ILOC_OVERCROWDING.map((r) => r.iloc_code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('adds no community by widening the reference', () => {
    // 1,138 ILOCs, nine mapped communities. A place enters only when somebody maps it.
    expect(COMMUNITY_NEED.length).toBe(9);
  });

  it('reads every figure from the reference rather than a retyped literal', () => {
    for (const c of COMMUNITY_NEED) {
      const r = ilocByCode(c.ilocCode)!;
      expect(r).toBeDefined();
      expect(c.occupiedDwellings).toBe(r.occupied_dwellings);
      expect(c.need1plus).toBe(r.need_1plus);
      expect(c.persons).toBe(r.persons);
      expect(c.atsipNeed1plus).toBe(r.atsip_need_1plus);
    }
  });

  it('holds the Mount Isa correction that deriving caught', () => {
    // The hand-typed value was 3.13, implying 19,957 people. ABS records 18,571 over 6,376.
    const mi = COMMUNITY_NEED.find((c) => c.communityId === 'mount-isa')!;
    expect(mi.persons).toBe(18571);
    expect(mi.personsPerDwelling).toBeCloseTo(2.91, 2);
  });

  it('separates ATSIP need from whole-population need, because they diverge', () => {
    const darwin = COMMUNITY_NEED.find((c) => c.communityId === 'darwin')!;
    expect(darwin.need1plus).toBe(226);
    expect(darwin.atsipNeed1plus).toBe(10);
    // If these are ever collapsed into one figure, urban places look twenty times needier.
    expect(darwin.need1plus / darwin.atsipNeed1plus).toBeGreaterThan(20);
  });

  it('searchIlocs is a lookup and refuses a short query', () => {
    expect(searchIlocs('ma')).toEqual([]);
    expect(searchIlocs('Maningrida').length).toBe(2);
  });
});
