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
// geography: see ORG_AS_PLACE below.

import { PLACES, placeById } from './place-registry';

export interface CommunityLite {
  id: string;
  name: string;
  traditional_name?: string | null;
}

/**
 * Organisation names that stand in for a place in a media title.
 *
 * Oonchiumpa is an organisation. It is here because the Alice Springs production partner's media
 * is filed under the org name, and no registry of places will ever contain it.
 *
 * MEDIA FOLLOWS THE REGISTRY (Ben, 17 September 2026). This map used to fold Ampilatwatja into
 * Utopia, and Angurugu and Umbakumba into Groote, which is how the May-trip galleries were
 * titled. The registry holds all three as communities in their own right, because that is what
 * the NT contract record calls them, and Ben ruled the registry wins. Counted before the change:
 * one media asset is titled with Ampilatwatja and none with the other two, so this moved one row.
 * It belongs to Ampilatwatja now and will surface when Ampilatwatja is a community row.
 */
const ORG_AS_PLACE: Record<string, string[]> = {
  'alice-springs': ['oonchiumpa'],
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
 * Every spelling the registry holds for one place id, plus any organisation name that stands in
 * for it. A traditional name is deliberately not included, because the column holds people and
 * language names as often as place names and Warlpiri is two communities.
 */
export function spellingsFor(id: string): string[] {
  const place = placeById(id);
  return [...(place ? [place.name, ...(place.aliases ?? [])] : []), ...(ORG_AS_PLACE[id] ?? [])];
}

/**
 * Places the matcher will name even though no row exists for them yet. A media title that says
 * Ampilatwatja resolves to Ampilatwatja, and a caller keyed on the live community rows simply
 * finds nothing, which is the honest answer: we know where it belongs and we have no page for it.
 * Folding it into a parent so it had somewhere to land was the thing Ben ruled against.
 */
const MATCHABLE_KINDS = new Set(['community', 'homelands', 'town']);

export function makeCommunityMatcher(communities: CommunityLite[]): CommunityMatcher {
  // normalized key -> place id, longest keys first so the most specific wins
  // (e.g. "kalgoorlie" beats a short alias).
  const keys: { key: string; id: string }[] = [];
  const add = (raw: string | null | undefined, id: string) => {
    if (!raw) return;
    const k = norm(raw);
    if (k.length >= 4 && !GENERIC.has(k)) keys.push({ key: k, id });
  };
  for (const c of communities) {
    // The row's own name still counts, so a community absent from the registry keeps matching.
    add(c.name, c.id);
    for (const spelling of spellingsFor(c.id)) add(spelling, c.id);
  }
  const named = new Set(communities.map((c) => c.id));
  for (const p of PLACES) {
    if (named.has(p.id) || !MATCHABLE_KINDS.has(p.kind)) continue;
    for (const spelling of [p.name, ...(p.aliases ?? [])]) add(spelling, p.id);
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
