/**
 * Guards for known, logged disagreements inside the cost model.
 *
 * These tests are unusual: they assert that a KNOWN DEFECT still exists in exactly
 * the shape it was logged in. That is deliberate. A conflict worth $20 a bed on a
 * figure quoted to funders should not be resolved silently by whoever next edits the
 * file, and it should not be rediscovered from scratch in three months either.
 *
 * When the measured week settles it: pick the number, make the three sources agree,
 * delete FACTORY_THROUGHPUT_CONFLICT, and delete this file's first describe block.
 * The test failing is the signal that a human decision was made, which is the point.
 */
import { describe, expect, it } from 'vitest';

import scenarios from './cost-model-scenarios.json';
import { CostModelDefaults, FACTORY_THROUGHPUT_CONFLICT } from './cost-model-scenarios';

describe('the factory throughput conflict (LOGGED, UNRESOLVED)', () => {
  const state = scenarios.build_states.state_4_factory;

  it('still disagrees with itself, in the shape it was logged in', () => {
    // If this fails, someone changed one of the three sources. Good, but it means a
    // decision was made: check it was deliberate, then retire the constant.
    expect(CostModelDefaults.factory_beds_per_day).toBe(FACTORY_THROUGHPUT_CONFLICT.defaultsSays);
    expect(state.throughput_beds_per_day).toBe(FACTORY_THROUGHPUT_CONFLICT.buildStateSays);
    expect(FACTORY_THROUGHPUT_CONFLICT.defaultsSays).not.toBe(FACTORY_THROUGHPUT_CONFLICT.buildStateSays);
  });

  it('has a labour line that follows the defaults, not the build state', () => {
    // "$400/day ÷ 5 beds" = $80. This is why direct_total is $275.74 and not $295.74:
    // the state's own throughput figure is not the one its cost line uses.
    const labour = state.components.find((c) => c.label.includes('Labour'))!;
    expect(labour.amount).toBe(80);
    expect(labour.label).toContain('5 beds');
    expect(scenarios.labour_rates_in_house.production_operator_per_day / FACTORY_THROUGHPUT_CONFLICT.defaultsSays)
      .toBe(labour.amount);
  });

  it('costs exactly $20 a bed, which is what makes it worth logging', () => {
    const perDay = scenarios.labour_rates_in_house.production_operator_per_day;
    const atFive = perDay / FACTORY_THROUGHPUT_CONFLICT.defaultsSays;
    const atFour = perDay / FACTORY_THROUGHPUT_CONFLICT.buildStateSays;
    expect(atFour - atFive).toBe(20);
    expect(FACTORY_THROUGHPUT_CONFLICT.costPerBedAtFour - FACTORY_THROUGHPUT_CONFLICT.costPerBedAtFive).toBe(20);
  });

  it('names who resolves it and how, so it is not rediscovered', () => {
    expect(FACTORY_THROUGHPUT_CONFLICT.resolvedBy).toMatch(/measured/i);
    expect(FACTORY_THROUGHPUT_CONFLICT.owner.length).toBeGreaterThan(3);
  });
});

describe('the factory direct build, which the Maningrida run checks', () => {
  const state = scenarios.build_states.state_4_factory;

  it('sums to $275.74 from its own components', () => {
    const sum = state.components.reduce((t, c) => t + c.amount, 0);
    expect(Number(sum.toFixed(2))).toBe(state.direct_total);
    expect(state.direct_total).toBe(275.74);
  });

  it('plus long-haul freight gives the $425.74 quoted externally', () => {
    // $150/bed of the $425.74 is long-haul freight, which is 35% of the marginal
    // cost and more than HDPE, diesel and labour together. INV-0303 puts $5,900 of
    // freight against 40 beds, which is $147.50, so this is the best-evidenced
    // input in the model and nobody put it there deliberately.
    expect(state.direct_total + CostModelDefaults.long_haul_freight_per_bed).toBe(425.74);
  });
});
