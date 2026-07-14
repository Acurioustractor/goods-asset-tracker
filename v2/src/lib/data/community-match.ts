// Map free-text EL location / media-title strings onto the canonical Goods
// community list. Empathy Ledger stores a storyteller's (and story's) location as
// free text ("Tennant Creek, Northern Territory, Australia") and only carries a
// media asset's place inside its title / gallery name — there is no clean FK. So
// community coverage has to be *derived* by matching. Deterministic, read-time,
// no writes. Add new spelling / language variants to ALIASES as they surface.

export interface CommunityLite {
  id: string;
  name: string;
  traditional_name?: string | null;
}

// Extra match keys per canonical community name — traditional/language names and
// spelling variants actually seen in the EL data (storyteller locations, media
// titles, gallery names). Traditional names in the communities table are matched
// automatically; these cover the rest.
const ALIASES: Record<string, string[]> = {
  // Oonchiumpa is the Alice Springs production partner (Karen Liddle) — its media
  // is filed under the org name, which is an Alice Springs place-proxy.
  'Alice Springs': ['mparntwe', 'oonchiumpa'],
  'Tennant Creek': ['wumpurrarni'],
  'Palm Island': ['bwgcolman'],
  'Kalgoorlie': ['ninga mia', 'wongatha'],
  'Mt Isa': ['mount isa'],
  "Galiwin'ku": ['elcho island', 'galiwinku'],
  'Groote Archipelago': ['groote eylandt', 'groote', 'angurugu', 'umbakumba'],
  // Ampilatwatja + Arlparra are homelands in the Utopia region; the May-trip media
  // is titled with them. Remove from here if they should be their own community.
  'Utopia Homelands': ['utopia', 'ampilatwatja', 'arlparra'],
  'Torres Strait': ['thursday island'],
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
    add(c.name);
    add(c.traditional_name);
    for (const a of ALIASES[c.name] ?? []) add(a);
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
