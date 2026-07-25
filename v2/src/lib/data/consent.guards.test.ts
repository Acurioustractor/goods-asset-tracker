/**
 * Consent gate invariants.
 *
 * Two independent default-deny gates decide whether a community voice may be
 * shown, and nothing until now checked that they agree with each other:
 *
 *   1. `isClearedForExternal(name)` (cleared-voices.ts) — an allowlist of names
 *      Ben cleared for the open web. Unknown name = denied.
 *   2. `getVoiceTier(name)` (storyteller-registry.ts) — per-person tier, where
 *      an unknown name falls through to 'hold'. Denied.
 *
 * Each carries its own private copy of the same name-normalising function. They
 * are identical today. If one is ever edited without the other, a held voice can
 * start passing the allowlist, or a cleared voice can silently vanish from the
 * site. Neither failure raises an error at runtime, which is why they are tested
 * here rather than left as convention.
 *
 * The rule these encode: a consent decision is only real if the code cannot
 * quietly reverse it. Failure direction matters. Showing a held voice is a harm
 * to a person; hiding a cleared voice is a bug we can fix. The tests below treat
 * those asymmetrically and say so where it matters.
 *
 * `check-storyteller-registry.mjs` covers adjacent ground (banned fragments,
 * misspellings, held names in rendered surfaces) but does it by regex-parsing
 * the TypeScript source. These tests import the real modules, so they see the
 * data the app actually loads.
 */

import { describe, it, expect } from 'vitest';
import { isClearedForExternal } from '@/lib/data/cleared-voices';
import {
  STORYTELLER_REGISTRY,
  getStoryteller,
  getVoiceTier,
  type VoiceTier,
} from '@/lib/data/storyteller-registry';

/** Tiers that must never reach an external surface, whatever else changes. */
const DENIED_TIERS: VoiceTier[] = ['hold', 'pending', 'internal'];

const recordsWithTier = (tier: VoiceTier) =>
  STORYTELLER_REGISTRY.filter((r) => r.tier === tier);

describe('isClearedForExternal: default-deny posture', () => {
  it('denies empty and missing names', () => {
    expect(isClearedForExternal(null)).toBe(false);
    expect(isClearedForExternal(undefined)).toBe(false);
    expect(isClearedForExternal('')).toBe(false);
    expect(isClearedForExternal('   ')).toBe(false);
  });

  it('denies a name that is simply not on the list', () => {
    expect(isClearedForExternal('Someone Not On The List')).toBe(false);
  });

  it('denies a name that only partially matches a cleared one', () => {
    // Substring matching would be a consent breach: the gate is exact-after-
    // normalising, not fuzzy-contains.
    expect(isClearedForExternal('Dianne')).toBe(false);
    expect(isClearedForExternal('Stokes')).toBe(false);
    expect(isClearedForExternal('Dianne Stokes Jr')).toBe(false);
  });

  it('allows a known cleared voice', () => {
    expect(isClearedForExternal('Dianne Stokes')).toBe(true);
  });
});

describe('isClearedForExternal: the spelling tolerances it promises', () => {
  it('ignores case', () => {
    expect(isClearedForExternal('dianne stokes')).toBe(true);
    expect(isClearedForExternal('DIANNE STOKES')).toBe(true);
  });

  it('strips parentheticals, which is how Empathy Ledger sends skin names', () => {
    expect(isClearedForExternal('Norman Frank (Jupurrurla)')).toBe(true);
  });

  it('strips honorific punctuation', () => {
    expect(isClearedForExternal('Dr. Boe Remenyi')).toBe(true);
  });

  it('collapses doubled whitespace', () => {
    expect(isClearedForExternal('Alfred  Johnson')).toBe(true);
  });

  it('accepts both "&" and "and" for joint credits', () => {
    // NOTE: this tolerance comes from listing both spellings, not from the
    // normaliser, which does not touch "&". Any new joint credit must add both
    // spellings or this tolerance silently does not apply to it.
    expect(isClearedForExternal('Carmelita & Colette')).toBe(true);
    expect(isClearedForExternal('Carmelita and Colette')).toBe(true);
  });
});

describe('getVoiceTier: default-deny posture', () => {
  it('falls through to hold for unknown and missing names', () => {
    expect(getVoiceTier(null)).toBe('hold');
    expect(getVoiceTier(undefined)).toBe('hold');
    expect(getVoiceTier('')).toBe('hold');
    expect(getVoiceTier('Someone Not In The Registry')).toBe('hold');
  });

  it('resolves aliases to the canonical record, so a variant spelling cannot dodge a tier', () => {
    const withAliases = STORYTELLER_REGISTRY.filter((r) => (r.aliases?.length ?? 0) > 0);
    expect(withAliases.length).toBeGreaterThan(0);

    for (const record of withAliases) {
      for (const alias of record.aliases ?? []) {
        expect(getStoryteller(alias)?.slug, `alias "${alias}" of ${record.name}`).toBe(record.slug);
        expect(getVoiceTier(alias), `alias "${alias}" of ${record.name}`).toBe(record.tier);
      }
    }
  });
});

describe('the two gates agree (this is the one that prevents a breach)', () => {
  it.each(DENIED_TIERS)('no voice at tier "%s" is cleared for external display', (tier) => {
    const records = recordsWithTier(tier);
    expect(records.length, `expected at least one ${tier} record to make this test meaningful`)
      .toBeGreaterThan(0);

    for (const record of records) {
      expect(
        isClearedForExternal(record.name),
        `CONSENT BREACH: "${record.name}" is tier '${tier}' but passes the external allowlist`,
      ).toBe(false);

      for (const alias of record.aliases ?? []) {
        expect(
          isClearedForExternal(alias),
          `CONSENT BREACH: alias "${alias}" of held voice "${record.name}" passes the allowlist`,
        ).toBe(false);
      }
    }
  });

  it('every voice at tier "external" is on the allowlist', () => {
    // Failure here is the safe direction (a cleared person goes missing from the
    // site rather than a held person appearing) but it is still wrong, and it is
    // invisible without this test.
    const missing = recordsWithTier('external')
      .filter((r) => !isClearedForExternal(r.name))
      .map((r) => r.name);

    expect(missing, 'tier external but not on the cleared-voices allowlist').toEqual([]);
  });
});

describe('registry data integrity', () => {
  it('every record carries a known tier', () => {
    const valid: VoiceTier[] = ['external', 'website', 'funder', 'hold', 'pending', 'internal'];
    for (const record of STORYTELLER_REGISTRY) {
      expect(valid, `${record.name} has tier "${record.tier}"`).toContain(record.tier);
    }
  });

  it('slugs are unique', () => {
    const slugs = STORYTELLER_REGISTRY.map((r) => r.slug);
    expect(slugs.length).toBe(new Set(slugs).size);
  });

  it('no two records claim the same name or alias, which would make lookups ambiguous', () => {
    const seen = new Map<string, string>();
    const collisions: string[] = [];
    const norm = (s: string) =>
      s.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[.,]/g, ' ').replace(/\s+/g, ' ').trim();

    for (const record of STORYTELLER_REGISTRY) {
      for (const spelling of [record.name, ...(record.aliases ?? [])]) {
        const key = norm(spelling);
        const owner = seen.get(key);
        if (owner && owner !== record.slug) {
          collisions.push(`"${spelling}" claimed by both ${owner} and ${record.slug}`);
        }
        seen.set(key, record.slug);
      }
    }

    expect(collisions).toEqual([]);
  });

  it('a misspelling is never also a real name or alias somewhere else', () => {
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
    const realNames = new Set(
      STORYTELLER_REGISTRY.flatMap((r) => [r.name, ...(r.aliases ?? [])]).map(norm),
    );

    const conflicts = STORYTELLER_REGISTRY.flatMap((r) =>
      (r.misspellings ?? [])
        .filter((m) => realNames.has(norm(m)))
        .map((m) => `${r.name}: banned misspelling "${m}" is a real name elsewhere`),
    );

    expect(conflicts).toEqual([]);
  });

  it('the set of held voices awaiting a tier decision does not grow unnoticed', () => {
    // `tier` and `quote.status` answer different questions. tier = may this
    // PERSON be quoted externally. status = is this LINE usable at all. So a
    // held person holding an approved line is legitimate: the line is fine, the
    // attribution is not yet decided.
    //
    // Both current cases came from the same 2026-07-21 cleanup, where quotes
    // misfiled under Georgina Byron were reattributed to newly created records.
    // Each record's own note says the tier is Ben's call, and neither call has
    // been made.
    //
    // Pinning them here turns "Ben still has to decide" from a note nobody
    // re-reads into a failing test. A third one appearing means someone parked a
    // real person's words without resolving whether they may be published.
    // Asserted as a subset, not an exact match. Exact equality would also fail
    // when one of these is RESOLVED, turning good news into a red build, and it
    // fails on any branch where these records do not exist yet. What we actually
    // care about is that nothing is awaiting a decision we have not written down.
    const KNOWN_PENDING_TIER_DECISIONS = ['kylie-bloomfield', 'katherine-deadly-heart-trek'];

    const unexpected = STORYTELLER_REGISTRY.filter(
      (r) => r.tier === 'hold' && r.quotes.some((q) => q.status === 'primary' || q.status === 'approved'),
    )
      .map((r) => r.slug)
      .filter((slug) => !KNOWN_PENDING_TIER_DECISIONS.includes(slug));

    expect(
      unexpected.sort(),
      'a held voice has a usable quote and is not a known pending decision. Get the tier ruling before this line reaches a deck, then add the slug here or change the tier.',
    ).toEqual([]);
  });
});
