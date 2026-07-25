/**
 * Helpers for resolving EL storytellers by human-readable slug.
 *
 * EL stores storytellers with UUID `id` + `displayName` ("Ray Nelson").
 * Field-notes voice cards reference storytellers by a slug
 * ("ray-nelson") so URLs stay readable. This helper does the slug ↔ UUID
 * lookup against the Goods project's storyteller list (cheap-ish — only
 * ~20-30 storytellers).
 *
 * The list endpoint returns the lightweight EmpathyLedgerStoryteller
 * shape; the rich profile (themes, quotes, analysis) comes from
 * empathyLedger.getStoryteller(id) at page render time.
 */

import { empathyLedger } from './empathy-ledger';
import type { EmpathyLedgerStoryteller } from './empathy-ledger/types';
import { isClearedForExternal } from './data/cleared-voices';

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

let cache: EmpathyLedgerStoryteller[] | null = null;

export async function getGoodsStorytellers(): Promise<EmpathyLedgerStoryteller[]> {
  if (cache) return cache;
  try {
    const all = await empathyLedger.getStorytellers();
    cache = all;
    return all;
  } catch {
    return [];
  }
}

/**
 * The consent-gated set: only storytellers cleared for the open web.
 *
 * Use this for anything public. `getGoodsStorytellers()` above is the RAW set
 * and is correct only for admin surfaces, which need to see uncleared people in
 * order to spot gaps.
 *
 * The gate is `isClearedForExternal`, a name allowlist, because Empathy Ledger
 * has no per-storyteller consent field. Its clearance signal counts STORIES
 * passing the syndication RPC, which is a different question from whether this
 * person may be named on the site, and as at 2026-07-25 it resolved to one
 * person out of the whole project. See the header of `cleared-voices.ts`.
 */
export async function getPublicStorytellers(): Promise<EmpathyLedgerStoryteller[]> {
  const all = await getGoodsStorytellers();
  return all.filter((s) => isClearedForExternal(s.displayName));
}

/**
 * Slug lookup for the PUBLIC storyteller route. Gated, so an uncleared person
 * cannot be reached by typing their slug directly. Returns null for them, which
 * the route turns into a 404.
 */
export async function getStorytellerBySlug(slug: string): Promise<EmpathyLedgerStoryteller | null> {
  const all = await getPublicStorytellers();
  return all.find((s) => slugify(s.displayName) === slug) || null;
}

/**
 * Slugs to pre-render for the public route. Gated: an uncleared storyteller must
 * not get a static page, a title, a bio or an OpenGraph image built for them.
 */
export async function listStorytellerSlugs(): Promise<{ slug: string; name: string }[]> {
  const all = await getPublicStorytellers();
  return all.map((s) => ({ slug: slugify(s.displayName), name: s.displayName }));
}

export type StorytellerClearance = { cleared: number; candidate: number };
export type GoodsStorytellerRow = EmpathyLedgerStoryteller & { clearance: StorytellerClearance };

/**
 * Storytellers + their EL syndication verdict. Admin surfaces only, and
 * currently unused by anything.
 *
 * NOT a consent gate for a directory of people: `cleared` counts this person's
 * STORIES that pass EL's syndication RPC. As at 2026-07-25 the Goods project had
 * 10 published stories, 2 of which passed the gate, belonging to 1 storyteller,
 * so filtering people on it would empty a page rather than gate it. Use
 * `getPublicStorytellers()` for that.
 */
export async function getGoodsStorytellersWithClearance(): Promise<GoodsStorytellerRow[]> {
  const [tellers, clearance] = await Promise.all([
    getGoodsStorytellers(),
    empathyLedger.getGoodsSiteClearance(),
  ]);
  return tellers.map((s) => ({
    ...s,
    clearance: clearance[s.id] ?? { cleared: 0, candidate: 0 },
  }));
}
