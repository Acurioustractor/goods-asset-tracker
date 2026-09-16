// Map free-text EL location / media-title strings onto the canonical Goods
// community list. Empathy Ledger stores a storyteller's (and story's) location as
// free text ("Tennant Creek, Northern Territory, Australia") and only carries a
// media asset's place inside its title or gallery name. There is no clean FK, so
// community coverage has to be *derived* by matching. Deterministic, read-time,
// no writes.
//
// SPELLINGS NOW COME FROM place-registry.ts (17 Sep 2026). This file used to keep its own
// ALIASES map, which made three alias lists in the repo counting the Supabase `name_aliases`
// column. A spelling added to one did not reach the others. Add a new spelling to the registry
// and it works here, on the procurement desk and in every drift check at the same time.
//
// What stays here is the part that is a FILING DECISION about media, and no claim about
// geography: see ROLLUP below.

import { PLACES, placeById } from './place-registry';

export interface CommunityLite {
  id: string;
  name: string;
  traditional_name?: string | null;
}

/**
 * Where media about a smaller place gets filed. These are not claims that one place is another.
 *
 * OPEN FOR BEN. The registry now holds Ampilatwatja, Angurugu and Umbakumba as communities in
 * their own right, because that is what the NT contract record calls them. This map still files
 * their media under a parent, which is what the May-trip galleries were titled with. Those two
 * answers can both be right, and the previous version of this file already flagged it:
 * "Remove from here if they should be their own community."
 *
 * Oonchiumpa is an organisation. It is here because the Alice Springs production
 * partner's media is filed under the org name.
 */
const ROLLUP: Record<string, string[]> = {
  'alice-springs': ['oonchiumpa'],
  'utopia': ['ampilatwatja'],
  'groote-archipelago': ['angurugu', 'umbakumba'],
};

// Strings too broad to attribute to one community (EL defaults many rows to these).
const GENERIC = new Set([
  '', 'australia', 'northern territory', 'queensland', 'western australia',
  'south australia', 'new south wales', 'victoria', 'tasmania',
  'nt', 'qld', 'wa', 'sa', 'nsw', 'vic', 'tas', 'act',
]);

const norm = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\p{Letter}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

export interface CommunityMatcher {
  /** Best community id for a free-text location string, or null. */
  matchLocation(loc: string | null | undefined): string | null;
  /** Community id if a title/gallery string names a place, or null. */
  matchText(text: string | null | undefined): string | null;
}

/**
 * Every spelling the registry holds for one community id: its name, its aliases, and any place
 * rolled up into it. A traditional name is deliberately not included, because the column holds
 * people and language names as often as place names and Warlpiri is two communities.
 */
export function spellingsFor(id: string): string[] {
  const place = placeById(id);
  const rolled = (ROLLUP[id] ?? []).flatMap((childId) => {
    const child = PLACES.find((p) => p.id === childId);
    return child ? [child.name, ...(child.aliases ?? [])] : [childId];
  });
  return [...(place ? [place.name, ...(place.aliases ?? [])] : []), ...rolled];
}

export function makeCommunityMatcher(communities: CommunityLite[]): CommunityMatcher {
  // normalized key -> community id, longest keys first so the most specific wins
  // (e.g. "kalgoorlie" beats a short alias).
  const keys: { key: string; id: string }[] = [];
  for (const c of communities) {
    const add = (raw: string | null | undefined) => {
      if (!raw) return;
      const k = norm(raw);
      if (k.length >= 4 && !GENERIC.has(k)) keys.push({ key: k, id: c.id });
    };
    // The row's own name still counts, so a community absent from the registry keeps matching.
    add(c.name);
    for (const spelling of spellingsFor(c.id)) add(spelling);
  }
  keys.sort((a, b) => b.key.length - a.key.length);

  // key present in haystack on word boundaries (norm has collapsed all
  // punctuation to spaces, so a leading/trailing non-letter is enough).
  const containsWord = (hay: string, key: string): boolean => {
    let from = 0;
    for (;;) {
      const i = hay.indexOf(key, from);
      if (i < 0) return false;
      const before = i === 0 ? ' ' : hay[i - 1];
      const after = i + key.length >= hay.length ? ' ' : hay[i + key.length];
      if (!/\p{Letter}/u.test(before) && !/\p{Letter}/u.test(after)) return true;
      from = i + 1;
    }
  };

  const matchIn = (text: string | null | undefined): string | null => {
    if (!text) return null;
    const h = norm(text);
    if (GENERIC.has(h)) return null;
    for (const { key, id } of keys) if (containsWord(h, key)) return id;
    return null;
  };

  return {
    matchLocation: (loc) => {
      if (!loc) return null;
      // The place is the first comma-segment ("Tennant Creek, NT, Australia").
      // Try it first so a trailing ", Australia" can't win as generic.
      return matchIn(loc.split(',')[0]) ?? matchIn(loc);
    },
    matchText: matchIn,
  };
}
