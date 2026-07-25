/**
 * Claim-hygiene invariants for the content data layer.
 *
 * The standing rule is "do not fabricate: no invented quotes, no invented names,
 * no invented numbers". The failure this test exists for is subtler than an
 * outright lie, and it had already happened:
 *
 *   content.ts carried a `kristyQuote` whose words were invented and attributed
 *   by name to Kristy Bloomfield, a real Traditional Owner and Oonchiumpa
 *   director. It was marked `verified: false` with a TODO. Nothing rendered it,
 *   so nothing caught it, but it sat in the data layer shaped exactly like real
 *   quote data, one import away from a pitch page.
 *
 * `verified: false` is a legitimate state for a STATISTIC. The press page uses it
 * correctly: the 10-year design life is stated as intent and rendered without a
 * Verified badge. It is not a legitimate state for words in a named person's
 * mouth. A quote is either real, and traceable to the storyteller registry, or it
 * does not exist in the codebase. There is no "draft attribution" state, because
 * the draft is indistinguishable from the real thing at the point someone wires
 * it up.
 */

import { describe, it, expect } from 'vitest';
import * as content from '@/lib/data/content';

type Found = { path: string; author: string; text: string };

const AUTHOR_KEYS = ['author', 'attribution', 'attributedTo', 'speaker', 'by'];
const TEXT_KEYS = ['text', 'quote', 'body'];

const str = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** Walk every plain object reachable from the module's exports. */
function collectAttributedQuotes(root: unknown): Found[] {
  const out: Found[] = [];
  const seen = new WeakSet<object>();

  const visit = (node: unknown, path: string) => {
    if (node === null || typeof node !== 'object') return;
    if (seen.has(node as object)) return;
    seen.add(node as object);

    if (Array.isArray(node)) {
      node.forEach((child, i) => visit(child, `${path}[${i}]`));
      return;
    }

    const rec = node as Record<string, unknown>;
    const authorKey = AUTHOR_KEYS.find((k) => str(rec[k]));
    const textKey = TEXT_KEYS.find((k) => str(rec[k]));

    if (authorKey && textKey && rec.verified === false) {
      out.push({ path, author: rec[authorKey] as string, text: rec[textKey] as string });
    }

    for (const [key, value] of Object.entries(rec)) visit(value, `${path}.${key}`);
  };

  visit(root, 'content');
  return out;
}

describe('content.ts claim hygiene', () => {
  it('no quote attributed to a named person is marked unverified', () => {
    const offenders = collectAttributedQuotes(content).map(
      (f) => `${f.path} attributes to "${f.author}": "${f.text.slice(0, 70)}…"`,
    );

    expect(
      offenders,
      'An unverified attributed quote is a placeholder in a real person\'s mouth. ' +
        'Either source the real words (storyteller-registry.ts is the canonical home) ' +
        'or delete the object. Do not ship it marked false.',
    ).toEqual([]);
  });

  it('the walker actually finds this shape, so a green result means something', () => {
    // Guards the guard: if the traversal silently stopped matching, the test
    // above would pass for the wrong reason.
    const decoy = {
      nested: { block: { text: 'invented words', author: 'A Real Person', verified: false } },
    };

    const found = collectAttributedQuotes(decoy);
    expect(found).toHaveLength(1);
    expect(found[0].author).toBe('A Real Person');
    expect(found[0].path).toBe('content.nested.block');
  });
});
