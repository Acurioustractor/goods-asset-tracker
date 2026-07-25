/**
 * The public storyteller route is consent-gated at the data layer.
 *
 * `/storytellers` and `/storytellers/[slug]` render a person's name, photo, bio,
 * community and Elder badge on the open web, and the detail route also emits
 * their name, bio and avatar into OpenGraph tags and pre-renders a static page
 * per slug. Before 2026-07-25 none of that consulted a consent gate: it showed
 * whatever Empathy Ledger returned.
 *
 * Gating the index alone would not have been enough. `generateStaticParams()`
 * builds a page per slug and `generateMetadata()` writes the OG tags, so an
 * uncleared person stayed reachable by typing their slug. All three entry points
 * therefore go through `getPublicStorytellers()`, and these tests hold that.
 *
 * Why a name allowlist rather than EL's own signal: EL has no per-storyteller
 * consent column. Its clearance number counts STORIES passing the syndication
 * RPC, which as at 2026-07-25 resolved to 1 person across the whole Goods
 * project. That empties a directory rather than gating it.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { EmpathyLedgerStoryteller } from '@/lib/empathy-ledger/types';

const getStorytellers = vi.fn();

vi.mock('@/lib/empathy-ledger', () => ({
  empathyLedger: {
    getStorytellers: () => getStorytellers(),
    getGoodsSiteClearance: async () => ({}),
  },
}));

/** Minimal shape: these helpers only read id and displayName. */
const teller = (displayName: string, id = displayName): EmpathyLedgerStoryteller =>
  ({ id, displayName }) as unknown as EmpathyLedgerStoryteller;

// One name on the cleared-voices allowlist, one deliberately not on it.
const CLEARED = 'Dianne Stokes';
const UNCLEARED = 'Someone Not Cleared';

/** Fresh module each time: getGoodsStorytellers memoises in a module-level cache. */
async function loadModule() {
  vi.resetModules();
  return import('@/lib/storytellers');
}

beforeEach(() => {
  getStorytellers.mockReset();
  getStorytellers.mockResolvedValue([teller(CLEARED), teller(UNCLEARED)]);
});

describe('getPublicStorytellers', () => {
  it('keeps cleared voices and drops uncleared ones', async () => {
    const { getPublicStorytellers } = await loadModule();
    const names = (await getPublicStorytellers()).map((s) => s.displayName);

    expect(names).toContain(CLEARED);
    expect(names).not.toContain(UNCLEARED);
  });

  it('returns nothing when Empathy Ledger fails, rather than falling open', async () => {
    getStorytellers.mockRejectedValue(new Error('EL 404'));
    const { getPublicStorytellers } = await loadModule();

    expect(await getPublicStorytellers()).toEqual([]);
  });

  it('leaves the raw accessor ungated, because admin surfaces need to see the gaps', async () => {
    const { getGoodsStorytellers } = await loadModule();
    const names = (await getGoodsStorytellers()).map((s) => s.displayName);

    expect(names).toEqual([CLEARED, UNCLEARED]);
  });
});

describe('getStorytellerBySlug: the direct-URL hole', () => {
  it('resolves a cleared storyteller', async () => {
    const { getStorytellerBySlug } = await loadModule();
    expect(await getStorytellerBySlug('dianne-stokes')).not.toBeNull();
  });

  it('returns null for an uncleared storyteller, so the route 404s', async () => {
    // Gating only the index would leave this reachable by typing the slug.
    const { getStorytellerBySlug } = await loadModule();
    expect(await getStorytellerBySlug('someone-not-cleared')).toBeNull();
  });
});

describe('listStorytellerSlugs: no static page or OpenGraph tags for uncleared people', () => {
  it('lists only cleared storytellers', async () => {
    const { listStorytellerSlugs } = await loadModule();
    const slugs = await listStorytellerSlugs();

    expect(slugs.map((s) => s.slug)).toEqual(['dianne-stokes']);
    expect(slugs.map((s) => s.name)).not.toContain(UNCLEARED);
  });
});
