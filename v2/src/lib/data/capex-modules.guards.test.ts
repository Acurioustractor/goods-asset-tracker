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
import {
  CAPEX_MODULES,
  priceModuleSelection,
  priceModuleOperating,
  SITE_PRODUCTION_BLOCK_BARE,
} from './cost-model-scenarios';

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
  // Only these four come FROM the MVF replication table. Collection was added on 2026-07-25 at
  // estimated market rates and is an ADDITION to that total, not part of it, so it is excluded
  // here on purpose. Including it would silently break the reconciliation this guard exists for.
  const MVF_SOURCED = ['shredding', 'pressing_cnc', 'assembly', 'sales_delivery'];

  // The MVF replication table totals ~$90,800 to ~$123,000 for a new-site minimal viable
  // facility. MVF-sourced modules + base must land there, because that is an ALLOCATION of an
  // evidenced total. (The ~$33 at each end is the MVF's own rounding of its stated headline.)
  it('MVF-sourced modules plus the base reconcile to the MVF replication total', () => {
    const p = priceModuleSelection(MVF_SOURCED);

    expect(p.withBaseLow).toBeGreaterThan(90_700);
    expect(p.withBaseLow).toBeLessThan(90_900);
    expect(p.withBaseHigh).toBeGreaterThan(122_900);
    expect(p.withBaseHigh).toBeLessThan(123_100);
  });

  it('collection sits OUTSIDE the MVF total, so adding it must increase the figure', () => {
    const mvfOnly = priceModuleSelection(MVF_SOURCED);
    const withCollection = priceModuleSelection([...MVF_SOURCED, 'collection_baling']);
    expect(withCollection.withBaseLow).toBeGreaterThan(mvfOnly.withBaseLow);
    expect(withCollection.capexLow - mvfOnly.capexLow).toBe(5_000);
  });

  it('module capex excludes the base when asked', () => {
    const withBase = priceModuleSelection(MVF_SOURCED);
    const without = priceModuleSelection(MVF_SOURCED, { includeSiteBase: false });

    expect(without.capexLow).toBe(without.withBaseLow);
    expect(withBase.withBaseLow - without.withBaseLow).toBe(CAPEX_MODULES.site_base.capex_low);
  });
});

describe('capex modules: pricing, and the unpriced guard that still protects it', () => {
  it('collection is graded estimate, matching how the MVF treats its own unquoted lines', () => {
    // It sat at null until 2026-07-25, which was stricter than the precedent: the MVF already
    // carries electrical fit-out, ventilation, site prep and PPE as estimates and nobody treats
    // those as blockers. A real quote replaces this and narrows the band.
    const collection = CAPEX_MODULES.modules.find((m) => m.key === 'collection_baling')!;
    expect(collection.grade).toBe('estimate');
    expect(collection.capex_low).toBe(5_000);
    expect(collection.capex_high).toBe(19_500);
  });

  it('collection band is the sum of its own lines', () => {
    const collection = CAPEX_MODULES.modules.find((m) => m.key === 'collection_baling')!;
    const low = collection.lines!.reduce((t, l) => t + l.low, 0);
    const high = collection.lines!.reduce((t, l) => t + l.high, 0);
    expect(low).toBe(collection.capex_low);
    expect(high).toBe(collection.capex_high);
  });

  it('the baler is the swing item, and may not be needed at all', () => {
    // Baling is for film and PET. Rigid HDPE is caged and transported, then shredded. If Utopia
    // needs no baler the module lands near the bottom of the band, so the high end must never be
    // quoted without asking. This guard exists so the caveat cannot be quietly deleted.
    const collection = CAPEX_MODULES.modules.find((m) => m.key === 'collection_baling')!;
    const baler = collection.lines!.find((l) => l.item.includes('Baler'))!;
    expect(baler.item).toMatch(/OPTIONAL/);
    const spread = collection.capex_high! - collection.capex_low!;
    expect(baler.high - baler.low).toBeGreaterThan(spread / 2);
  });

  it('Utopia is now priceable, which is the point of pricing collection', () => {
    // Utopia's own answer to "what would you want to own first" was a shredder. The old ladder
    // could not price that at all. Now: collection 5,000-19,500 (estimate) + shredder 19,800
    // (evidenced), before whatever site base Utopia actually needs.
    const utopia = CAPEX_MODULES.live_pathways.find((p) => p.key === 'utopia')!;
    const p = priceModuleSelection(utopia.modules);
    expect(p.priceable).toBe(true);
    expect(p.unpriced).toEqual([]);
    expect(p.capexLow).toBe(24_800);
    expect(p.capexHigh).toBe(39_300);
  });

  it('the unpriced guard still bites if any module is ever nulled again', () => {
    // The mechanism that protected Utopia has not been removed, only satisfied. Treating a
    // missing quote as $0 is how a pathway looks cheaper than it is.
    const p = priceModuleSelection(['definitely-not-a-real-module']);
    expect(p.capexLow).toBe(0);
    const anyNull = CAPEX_MODULES.modules.some((m) => m.capex_low === null);
    expect(anyNull).toBe(false);
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

  it('two of four now price; the two that do not are blocked on people, not numbers', () => {
    // Was three-of-four unpriceable when the basket was built. Pricing collection moved Utopia.
    // Tennant Creek waits on what the partner supplies, which is their call, not a missing
    // figure. Palm Island waits on a governance cost line that is not plant. Neither is fixable
    // by estimating harder.
    const blocked = CAPEX_MODULES.live_pathways.filter((p) => p.priceable.startsWith('no'));
    expect(blocked.map((p) => p.key)).toEqual(['tennant_creek', 'palm_island']);
  });
});

/**
 * PER-MODULE OPERATING SPLIT (added 2026-07-25).
 *
 * This is what made a PARTIAL pathway priceable. Before it, the $79,333 bare block assumed
 * the full module set, so the model could price Utopia's capex but not its running cost,
 * which is most of what decides whether a site is viable.
 *
 * The load-bearing guard is the reconciliation: selecting every module must reproduce the
 * bare block exactly. If it does not, the split has invented or lost cost.
 */
describe('per-module operating split', () => {
  const ALL = CAPEX_MODULES.operating_allocation.per_module.map((m) => m.key);

  it('reconciles exactly to the bare production block: 35,000 + 44,333 = 79,333', () => {
    const alloc = CAPEX_MODULES.operating_allocation;
    const moduleSum = alloc.per_module.reduce((t, m) => t + m.total, 0);

    expect(alloc.site_floor.total).toBe(35_000);
    expect(moduleSum).toBe(44_333);
    expect(alloc.site_floor.total + moduleSum).toBe(SITE_PRODUCTION_BLOCK_BARE);
  });

  it('the site floor is the sum of its own lines', () => {
    const sum = CAPEX_MODULES.operating_allocation.site_floor.lines.reduce((t, l) => t + l.amount, 0);
    expect(sum).toBe(CAPEX_MODULES.operating_allocation.site_floor.total);
  });

  it('each module total is its two drivers added', () => {
    for (const m of CAPEX_MODULES.operating_allocation.per_module) {
      expect(m.plant_value_share + m.floor_space_share).toBe(m.total);
    }
  });

  it('selecting every module reproduces the full block', () => {
    expect(priceModuleOperating(ALL).total).toBe(SITE_PRODUCTION_BLOCK_BARE);
  });

  it('a partial pathway carries LESS, which is the whole point', () => {
    const utopia = CAPEX_MODULES.live_pathways.find((p) => p.key === 'utopia')!;
    const op = priceModuleOperating(utopia.modules);

    // collection 3,600 + shredding 12,443 + the 35,000 floor
    expect(op.moduleShare).toBe(16_043);
    expect(op.total).toBe(51_043);
    expect(op.total).toBeLessThan(SITE_PRODUCTION_BLOCK_BARE);
  });

  it('no modules means no site floor either, not a bare-floor charge', () => {
    // Palm Island. There is no production site, so there is no production block. Its real
    // cost is governance, which is deliberately not priced as production.
    const pi = CAPEX_MODULES.live_pathways.find((p) => p.key === 'palm_island')!;
    const op = priceModuleOperating(pi.modules);
    expect(op.siteFloor).toBe(0);
    expect(op.total).toBe(0);
  });

  it('the floor is charged once, not per module', () => {
    const one = priceModuleOperating(['shredding']);
    const two = priceModuleOperating(['shredding', 'assembly']);
    expect(one.siteFloor).toBe(two.siteFloor);
    expect(two.total - one.total).toBe(6_452); // assembly's own share only
  });

  it('pressing_cnc is the most expensive module to run, as well as to buy', () => {
    // The argument for a community starting earlier in the chain if it wants to.
    const totals = CAPEX_MODULES.operating_allocation.per_module.map((m) => m.total);
    const press = CAPEX_MODULES.operating_allocation.per_module.find((m) => m.key === 'pressing_cnc')!;
    expect(press.total).toBe(Math.max(...totals));
  });
});
