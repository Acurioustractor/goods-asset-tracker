/**
 * Canon lockstep for facts derived from in-repo computation.
 *
 * canon.ts records `marginal-community` as a number. The number is not a
 * judgement: it is what the cost engine computes for the community build under
 * the default inputs. Left as check: 'manual' it drifts silently the moment an
 * input assumption changes, which is exactly how the cleared-voices fact sat
 * wrong for five weeks.
 *
 * The .mjs drift scripts cannot import the TypeScript engine, so this lockstep
 * lives in the test suite, which already runs the engine and already runs in CI.
 *
 * A note for whoever compares these numbers next, because I got it wrong first:
 * the engine emits THREE marginals and they are not interchangeable.
 *
 *   marginalKit       684.79   flat-packed kits shipped in
 *   marginalFactory   425.74   Goods-run factory
 *   marginalCommunity 420.74   community build, free feedstock + fair-wage labour
 *
 * `marginal-community` is the third. The QBE sweep's "~$426/bed" is the second.
 * They describe different build methods and reconciling them would be an error,
 * not a fix.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { computeModel, DEFAULTS } from '@/lib/cost-model/engine';

/** Pull a fact's numeric value straight from the canon source. */
function canonValue(id: string): number {
  const src = readFileSync(new URL('./canon.ts', import.meta.url), 'utf8');
  const m = src.match(new RegExp(`id: '${id}'[\\s\\S]{0,400}?value:\\s*([\\d._]+)`));
  if (!m) throw new Error(`canon fact '${id}' not found, or its value is not a plain number`);
  return Number(m[1].replace(/_/g, ''));
}

describe('canon marginal-community tracks the cost engine', () => {
  const model = computeModel(DEFAULTS);

  it('equals the engine marginalCommunity, rounded', () => {
    expect(
      canonValue('marginal-community'),
      `canon 'marginal-community' must equal Math.round(computeModel(DEFAULTS).marginalCommunity) ` +
        `= ${Math.round(model.marginalCommunity)}. If the engine's inputs changed on purpose, ` +
        `update the fact's value and asAt.`,
    ).toBe(Math.round(model.marginalCommunity));
  });

  it('is the community build, not the factory or kit one', () => {
    // Guards against the mistake of "reconciling" this fact to a nearby number.
    expect(model.marginalCommunity).not.toBe(model.marginalFactory);
    expect(model.marginalCommunity).not.toBe(model.marginalKit);
    expect(canonValue('marginal-community')).not.toBe(Math.round(model.marginalFactory));
  });

  it('is built from free feedstock and a fair-wage labour line, as the definition claims', () => {
    // The definition promises $0 feedstock and a $100-160 wage band. If either
    // stops being true the fact's wording is wrong even when its number is right.
    expect(DEFAULTS.community_labour_per_bed).toBeGreaterThanOrEqual(100);
    expect(DEFAULTS.community_labour_per_bed).toBeLessThanOrEqual(160);
    expect(model.marginalCommunity).toBeLessThan(model.marginalFactory);
  });
});
