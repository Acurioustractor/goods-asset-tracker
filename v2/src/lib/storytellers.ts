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

export async function getStorytellerBySlug(slug: string): Promise<EmpathyLedgerStoryteller | null> {
  const all = await getGoodsStorytellers();
  return all.find((s) => slugify(s.displayName) === slug) || null;
}

export async function listStorytellerSlugs(): Promise<{ slug: string; name: string }[]> {
  const all = await getGoodsStorytellers();
  return all.map((s) => ({ slug: slugify(s.displayName), name: s.displayName }));
}

export type StorytellerClearance = { cleared: number; candidate: number };
export type GoodsStorytellerRow = EmpathyLedgerStoryteller & { clearance: StorytellerClearance };

/**
 * Storytellers + their "cleared for the Goods public surface" verdict, derived
 * from EL's canonical syndication gate. For the admin cockpit only.
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
