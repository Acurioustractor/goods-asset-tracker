/**
 * Lockstep between the two canon layers.
 *
 * asset-canonical.ts holds the headline totals; community-canonical.ts holds
 * the per-community rulings. If either is edited without the other, the
 * per-community lines could sum to something other than the headline the site
 * and funder documents state — the Utopia-169 class of error, one level up.
 * These tests make that state unrepresentable in a green build.
 */
import { describe, it, expect } from 'vitest';
import {
  COMMUNITY_BED_CANON,
  WASHER_STALE_DEPLOYED_ROWS,
  communityCanonTotals,
} from './community-canonical';
import { CANONICAL_ASSETS, WASHERS_IN_COMMUNITY_BY_COMMUNITY } from './asset-canonical';

describe('community canon sums to headline canon', () => {
  const totals = communityCanonTotals();

  it('beds tie to CANONICAL_ASSETS', () => {
    expect(totals.basketBeds).toBe(CANONICAL_ASSETS.basketBedsDeployed);
    expect(totals.stretchBeds).toBe(CANONICAL_ASSETS.stretchBedsDeployed);
    expect(totals.beds).toBe(CANONICAL_ASSETS.bedsDeployed);
  });

  it('washers tie to the 2026-07-21 ruling of 22', () => {
    expect(totals.washersInCommunity).toBe(CANONICAL_ASSETS.washersInCommunity);
  });

  it('communities served ties to canon', () => {
    expect(totals.communitiesServed).toBe(CANONICAL_ASSETS.communitiesServed);
  });

  it('community ids are unique and slugged', () => {
    const ids = COMMUNITY_BED_CANON.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('every entry carries a non-empty ruling citation', () => {
    for (const c of COMMUNITY_BED_CANON) expect(c.ruling.length).toBeGreaterThan(10);
  });

  it('Utopia is 147, never Community OS’s 169', () => {
    const utopia = COMMUNITY_BED_CANON.find((c) => c.id === 'utopia')!;
    expect(utopia.basketBeds + utopia.stretchBeds).toBe(147);
  });

  it('washer stale rows only name communities that have a washer ruling', () => {
    for (const id of Object.keys(WASHER_STALE_DEPLOYED_ROWS)) {
      expect(WASHERS_IN_COMMUNITY_BY_COMMUNITY).toHaveProperty(id);
    }
  });
});
