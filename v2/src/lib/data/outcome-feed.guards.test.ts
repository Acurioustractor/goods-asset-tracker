import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { canonFact } from './canon';
import {
  OUTCOME_FEEDS, PROPOSED_OUTCOMES, assertFeedable, resolveFeeds, resolveProposed,
} from './outcome-feed';

/**
 * The pipe writes into another production database. These guards are what stop it writing
 * something it should not, and they test the two rules the module exists for.
 */

describe('only green facts cross into another system', () => {
  it('throws on an amber or red fact, and never skips it quietly', () => {
    // cleared-voices is RED, which means recipient and storyteller data that never auto-publishes.
    expect(() => assertFeedable(canonFact('cleared-voices'))).toThrow(/only green facts cross/);
    // signed-lois is AMBER: internal pipeline tracking.
    expect(() => assertFeedable(canonFact('signed-lois'))).toThrow(/only green facts cross/);
    expect(() => assertFeedable(canonFact('beds-deployed'))).not.toThrow();
  });

  it('every proposed outcome rests on a green fact', () => {
    for (const p of PROPOSED_OUTCOMES) {
      expect(canonFact(p.canonId).dataClass, p.canonId).toBe('green');
    }
    expect(resolveProposed()).toHaveLength(PROPOSED_OUTCOMES.length);
  });

  it('resolves only the feeds marked `feeds`, and every one carries a method', () => {
    const feeds = resolveFeeds();
    expect(feeds).toHaveLength(OUTCOME_FEEDS.filter((f) => f.verdict === 'feeds').length);
    for (const f of feeds) {
      expect(f.method.length, f.outcomeId).toBeGreaterThan(40);
      expect(f.source.length, f.outcomeId).toBeGreaterThan(10);
    }
  });
});

describe('a held feed says why, and a fed one does not need to', () => {
  it('every verdict other than `feeds` carries a reason', () => {
    for (const f of OUTCOME_FEEDS) {
      if (f.verdict === 'feeds') continue;
      expect(f.why?.length, f.outcomeTitle).toBeGreaterThan(40);
    }
  });

  it('the two near-misses stay held, because the same word is not the same measure', () => {
    const inventory = OUTCOME_FEEDS.find((f) => f.outcomeTitle.includes('inventory'));
    expect(inventory?.verdict).toBe('different-measure');
    const voices = OUTCOME_FEEDS.find((f) => f.outcomeTitle.includes('voices'));
    expect(voices?.verdict).toBe('not-green');
  });

  it('every outcome id is a uuid and appears once', () => {
    const ids = OUTCOME_FEEDS.map((f) => f.outcomeId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[0-9a-f-]{36}$/);
  });
});

/**
 * The script cannot import TypeScript, so it mirrors these literals with a regex. If the two ever
 * disagree the pipe writes from a stale copy, which is the failure this catches.
 */
describe('the script and the module agree', () => {
  it('the parser in push-outcome-values.mjs finds every feed', () => {
    const src = readFileSync(join(process.cwd(), 'src/lib/data/outcome-feed.ts'), 'utf8');
    const parsed = [...src.matchAll(/outcomeId: '([^']+)',\s*\n\s*outcomeTitle: '((?:[^'\\]|\\.)*)',\s*\n\s*verdict: '([^']+)',/g)];
    expect(parsed).toHaveLength(OUTCOME_FEEDS.length);
    expect(parsed.map((m) => m[1])).toEqual(OUTCOME_FEEDS.map((f) => f.outcomeId));
    expect(parsed.map((m) => m[3])).toEqual(OUTCOME_FEEDS.map((f) => f.verdict));
  });
});
