/**
 * CAPEX MODULES (Matt model input 7, added 2026-07-25).
 *
 * The module basket exists because the `build_method` ladder can price exactly one of the
 * four live pathways. These guards lock two things:
 *
 *   1. The reassembly is LOSSLESS. Modules plus site base must reconcile to the MVF
 *      replication total, because this is an allocation of an evidenced figure, not a new
 *      estimate. If a line is dropped or double counted during a future edit, this fails.
 *   2. An unpriced module is never silently treated as $0. Collection and baling has no
 *      quote, and it is upstream of the shredder, so Utopia (the pathway asking for the
 *      earliest module) must come back NOT priceable rather than cheap.
 *
 * These tests do NOT bless the module list: it is proposed, not agreed.
 */
import { describe, it, expect } from 'vitest';
import { CAPEX_MODULES, priceModuleSelection } from './cost-model-scenarios';

describe('capex modules: the site base', () => {
  it('base band is the sum of its own lines: $31,800 to $64,000', () => {
    const low = CAPEX_MODULES.site_base.lines.reduce((t, l) => t + l.low, 0);
    const high = CAPEX_MODULES.site_base.lines.reduce((t, l) => t + l.high, 0);
    expect(low).toBe(CAPEX_MODULES.site_base.capex_low);
    expect(high).toBe(CAPEX_MODULES.site_base.capex_high);
    expect(low).toBe(31_800);
    expect(high).toBe(64_000);
  });

  it('every base line is a band, low never above high', () => {
    for (const l of CAPEX_MODULES.site_base.lines) {
      expect(l.low).toBeLessThanOrEqual(l.high);
    }
  });
});

describe('capex modules: the reassembly is lossless', () => {
  // The MVF replication table totals ~$90,800 to ~$123,000 for a new-site minimal viable
  // facility. Modules + base must land there, because this is an ALLOCATION of that total.
  // (The ~$33 difference at each end is the MVF's own rounding of its stated headline.)
  it('all priced modules plus the base reconcile to the MVF replication total', () => {
    const allPriced = CAPEX_MODULES.modules
      .filter((m) => m.capex_low !== null)
      .map((m) => m.key);
    const p = priceModuleSelection(allPriced);

    expect(p.withBaseLow).toBeGreaterThan(90_700);
    expect(p.withBaseLow).toBeLessThan(90_900);
    expect(p.withBaseHigh).toBeGreaterThan(122_900);
    expect(p.withBaseHigh).toBeLessThan(123_100);
  });

  it('module capex excludes the base when asked', () => {
    const allPriced = CAPEX_MODULES.modules.filter((m) => m.capex_low !== null).map((m) => m.key);
    const withBase = priceModuleSelection(allPriced);
    const without = priceModuleSelection(allPriced, { includeSiteBase: false });

    expect(without.capexLow).toBe(without.withBaseLow);
    expect(withBase.withBaseLow - without.withBaseLow).toBe(CAPEX_MODULES.site_base.capex_low);
  });
});

describe('capex modules: an unpriced module is never silently $0', () => {
  it('collection and baling is unpriced, which is a real gap not an oversight', () => {
    const collection = CAPEX_MODULES.modules.find((m) => m.key === 'collection_baling')!;
    expect(collection.capex_low).toBeNull();
    expect(collection.grade).toBe('unpriced');
  });

  it('a selection containing it comes back NOT priceable', () => {
    const p = priceModuleSelection(['collection_baling', 'shredding']);
    expect(p.priceable).toBe(false);
    expect(p.unpriced).toContain('collection_baling');
  });

  it('Utopia, the pathway wanting the earliest module, is the one still unpriceable', () => {
    // Utopia's own answer to "what would you want to own first" was a shredder. The old
    // ladder could not price that at all; the basket can price the shredder but not the
    // collection upstream of it. That is progress and it is not done.
    const utopia = CAPEX_MODULES.live_pathways.find((p) => p.key === 'utopia')!;
    const p = priceModuleSelection(utopia.modules);
    expect(p.priceable).toBe(false);
    // The shredder itself IS priced, so the gap is specifically collection.
    expect(p.capexLow).toBe(19_800);
  });

  it('Tennant Creek prices its modules even though its base is partner-supplied', () => {
    const tc = CAPEX_MODULES.live_pathways.find((p) => p.key === 'tennant_creek')!;
    const p = priceModuleSelection(tc.modules, { includeSiteBase: false });
    // shredding 19,800 + pressing_cnc 32,780 + assembly 6,387 + sales 0
    expect(p.priceable).toBe(true);
    expect(p.capexLow).toBe(58_967);
  });

  it('Palm Island selects no modules, and zero plant must not read as zero cost', () => {
    const pi = CAPEX_MODULES.live_pathways.find((p) => p.key === 'palm_island')!;
    expect(pi.modules).toEqual([]);
    const p = priceModuleSelection(pi.modules, { includeSiteBase: false });
    expect(p.capexLow).toBe(0);
    // The model returning $0 here is exactly why the pathway is recorded as not priceable:
    // governance work has a real cost that is not plant, and no line for it exists yet.
    expect(pi.priceable).toMatch(/^no/);
  });
});

describe('capex modules: the four live pathways are all represented', () => {
  it('names Oonchiumpa, Utopia, Tennant Creek and Palm Island', () => {
    const keys = CAPEX_MODULES.live_pathways.map((p) => p.key);
    expect(keys).toEqual(['oonchiumpa', 'utopia', 'tennant_creek', 'palm_island']);
  });

  it('every pathway references only modules that exist', () => {
    const known = new Set(CAPEX_MODULES.modules.map((m) => m.key));
    for (const path of CAPEX_MODULES.live_pathways) {
      for (const k of path.modules) expect(known.has(k)).toBe(true);
    }
  });

  it('only Oonchiumpa is anywhere near priceable, which is the point of item 7', () => {
    const fully = CAPEX_MODULES.live_pathways.filter((p) => p.priceable.startsWith('no'));
    expect(fully).toHaveLength(3);
  });
});
