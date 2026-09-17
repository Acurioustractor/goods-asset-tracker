/**
 * THE REGISTER MUST STAY DEDUPED.
 *
 * The source table, `goods_procurement_entities` in the ACT infrastructure project, is an
 * entity x community cross-join: 4,562 rows for 1,049 organisations, with Northern Land Council
 * present 338 times and its $7.1M of contracts repeated in every one. Sum it raw and you get
 * $17.07bn of government contracts. The deduped truth is $1.87bn — a ninth.
 *
 * That gap is the whole reason this register exists as a generated file. A number that is wrong
 * by 9x is not a rounding problem; it is the difference between a real opportunity and one we
 * would be inventing in front of a funder. These tests fail if a duplicate ever creeps back in,
 * or if the shape of the data shifts far enough that the generator needs looking at again.
 */
import { describe, it, expect } from 'vitest';
import {
  PROCUREMENT_REGISTER,
  CAN_SELL_AND_HOLDS_CONTRACTS,
  PROCUREMENT_REGISTER_STATS,
} from './procurement-register';

describe('procurement register', () => {
  it('has no duplicate ABNs — the defect the source table is made of', () => {
    const abns = PROCUREMENT_REGISTER.map((e) => e.abn).filter(Boolean);
    const dupes = abns.filter((a, i) => abns.indexOf(a) !== i);
    expect(dupes, `duplicate ABNs: ${[...new Set(dupes)].join(', ')}`).toEqual([]);
  });

  /**
   * A shared NAME is allowed; a shared ABN is not.
   *
   * This test originally demanded unique names and failed on its first run, correctly. Two rows
   * are both called "QinetiQ Pty Ltd (68 125 805 839)" while carrying ABNs 94006238839 and
   * 16006092646 — two different legal entities under one label, and the ABN baked into that label
   * belongs to neither of them. That is wrong in grantscope, upstream of this repo, and it is not
   * ours to silently merge: collapsing them would destroy $31.5M of contracts against a real ABN.
   *
   * So the invariant is the one that is actually true: rows sharing a name must be distinct
   * entities. If two rows ever share a name AND an ABN, dedupe has failed.
   */
  it('rows sharing a name are genuinely different entities', () => {
    const byName = new Map<string, Set<string | null>>();
    for (const e of PROCUREMENT_REGISTER) {
      if (!byName.has(e.name)) byName.set(e.name, new Set());
      byName.get(e.name)!.add(e.abn);
    }
    const collapsed = [...byName.entries()].filter(
      ([name, abns]) => abns.size < PROCUREMENT_REGISTER.filter((e) => e.name === name).length,
    );
    expect(collapsed.map(([n]) => n), 'same name AND same ABN means dedupe failed').toEqual([]);
  });

  it('stats match the rows actually present', () => {
    expect(PROCUREMENT_REGISTER).toHaveLength(PROCUREMENT_REGISTER_STATS.entities);
    expect(PROCUREMENT_REGISTER.filter((e) => e.communityControlled)).toHaveLength(
      PROCUREMENT_REGISTER_STATS.communityControlled,
    );
    expect(PROCUREMENT_REGISTER.filter((e) => e.govtContractCount > 0)).toHaveLength(
      PROCUREMENT_REGISTER_STATS.withContracts,
    );
    expect(CAN_SELL_AND_HOLDS_CONTRACTS).toHaveLength(PROCUREMENT_REGISTER_STATS.both);
  });

  it('every entity is a pathway: community-controlled, or holding a contract', () => {
    const neither = PROCUREMENT_REGISTER.filter(
      (e) => !e.communityControlled && e.govtContractCount === 0,
    );
    expect(neither.map((e) => e.name)).toEqual([]);
  });

  it('total contract value stays an order of magnitude below the raw table', () => {
    // The raw cross-join sums to $17.07bn. Anything approaching that means dedupe has failed.
    expect(PROCUREMENT_REGISTER_STATS.totalContractValue).toBeLessThan(5_000_000_000);
  });

  it('the prospect set stays small enough to be a list of people to ring', () => {
    // 15 today. If this ever returns hundreds, the cross-join is back.
    expect(CAN_SELL_AND_HOLDS_CONTRACTS.length).toBeGreaterThan(0);
    expect(CAN_SELL_AND_HOLDS_CONTRACTS.length).toBeLessThan(100);
  });
});
