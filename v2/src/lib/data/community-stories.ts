/**
 * Helpers to surface human stories on the per-community drill-in page.
 *
 * Combines:
 *   1. compendium.communityVoices (typed, alias-aware quotes already in the repo)
 *   2. Empathy Ledger stories (live API, filtered by community name match
 *      against title / content / tags / themes / excerpt)
 *
 * Single source of canonical community names lives in the `communities` table.
 * Pass the row in so we can match against name + name_aliases.
 */

import { communityVoices, type CommunityVoice } from '@/lib/data/compendium';
import { empathyLedger } from '@/lib/empathy-ledger/client';
import type { EmpathyLedgerStory } from '@/lib/empathy-ledger/types';

export type CommunityMatch = {
  name: string;
  aliases: string[];
};

function buildHaystack(s: EmpathyLedgerStory): string {
  const themes = (s.themes || []).map((t) => (typeof t === 'string' ? t : t.name)).join(' ');
  return [s.title, s.summary, s.excerpt, s.content, themes, (s.tags || []).join(' '), s.storytellerName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function matchesCommunity(haystack: string, names: string[]): boolean {
  return names.some((n) => haystack.includes(n.toLowerCase()));
}

export function getCommunityVoices(community: CommunityMatch): CommunityVoice[] {
  const names = [community.name, ...(community.aliases || [])].map((n) => n.toLowerCase());
  return communityVoices.filter((v) => names.includes(v.community.toLowerCase()));
}

export async function getCommunityStories(
  community: CommunityMatch,
  opts: { limit?: number } = {}
): Promise<EmpathyLedgerStory[]> {
  const allStories = await empathyLedger.getStories({ limit: 100 }).catch(() => [] as EmpathyLedgerStory[]);
  const names = [community.name, ...(community.aliases || [])];
  const matched = allStories.filter((s) => matchesCommunity(buildHaystack(s), names));
  return opts.limit ? matched.slice(0, opts.limit) : matched;
}
