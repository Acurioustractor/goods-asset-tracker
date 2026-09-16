/**
 * THE PLACE REGISTRY. One token per place, and one resolver every pull must go through.
 *
 * Ben, 17 September 2026, looking at the admin sidebar: a better way to align the different data
 * in a contact and tokenised way. The sweep behind this is
 * thoughts/shared/reviews/2026-09-17-admin-ia-sweep.md.
 *
 * WHAT WAS WRONG, with the measurements. Across the community intel, the organisation
 * list, the federal contract pull and the NT contracts workbook there are 150 distinct place
 * strings. The Supabase `communities` table holds 31 rows. So 99 strings resolved to nothing,
 * and every surface that tried to join on a place name quietly dropped most of its data.
 * `organisations.json` resolved 19 of 62. `procurement-buyers.json` resolved 11 of 58.
 *
 * THE TWO CAUSES NEEDED DIFFERENT FIXES, which is why this file has a `kind`.
 *
 *   1. The registry was too small. Angurugu, Gapuwiyak, Hermannsburg, Barunga, Ampilatwatja and
 *      about forty more are real communities in the contract record and were simply absent.
 *
 *   2. `place` was overloaded. One string column held communities, regions ("Barkly Region"),
 *      jurisdictions ("Territory wide"), buildings ("Royal Darwin Hospital") and fragments of
 *      contract titles ("Panel Contract for Repairs, Ma"). A community and a region are
 *      different kinds of thing and a join that treats them as one will always be wrong.
 *      `kind` makes the difference checkable: a surface that needs a community can require
 *      `kind === 'community'` and get a real answer when the data hands it a region.
 *
 * WHAT THIS FILE IS NOT. It is not a geography. `within` is set only where a source says so, so
 * most communities carry no region. Traditional names come from the `traditional_name` column of
 * the live table and nothing here invents one. Aliases are only spellings actually seen in the
 * data. An empty field means we do not hold it, never that it does not exist.
 *
 * THE PATTERN IS BORROWED. `storyteller-registry.ts` already resolves aliases with guard
 * tests that stop a variant spelling dodging a consent tier, and `community-match.ts` already
 * maps free-text Empathy Ledger locations onto canonical communities. Both were scoped to one
 * source. This is the same idea with every source pointed at it.
 *
 * NOT_A_PLACE is the part that makes the guard bite. Without it, an unresolved string is
 * indistinguishable from a string nobody has mapped yet, so nothing can fail. With it,
 * scripts/check-place-registry.mjs can assert that every place string in every data file either
 * resolves or is listed here on purpose, and a new pull that invents a place breaks the build.
 */

export type PlaceKind =
  /** A discrete remote community or Aboriginal shire. */
  | 'community'
  /** A homelands group: many small outstations counted as one place. */
  | 'homelands'
  /** A town or regional centre. */
  | 'town'
  /** A service region. Never a community, and never a valid answer to "which community". */
  | 'region'
  /** A whole jurisdiction, or a contract that covers all of one. */
  | 'jurisdiction'
  /** A named building or precinct. It sits in a place; it is not one. */
  | 'facility'
  /** Not a place at all. Kept because a live table uses the id. See the note on the row. */
  | 'sentinel';

export interface Place {
  /** The token. Kebab-case, stable, and the only thing another module should store. */
  id: string;
  name: string;
  kind: PlaceKind;
  state: string | null;
  /**
   * From the `traditional_name` column of the live communities table. Never invented here, and
   * deliberately NOT a resolution key: the column holds two different kinds of name. Some are
   * place names (Mparntwe for Alice Springs, Elcho Island for Galiwin'ku) and most are people or
   * language names (Warlpiri, Anangu, Wik). Warlpiri is Lajamanu and Yuendumu both, so indexing
   * this field made one community resolve to the other. A traditional name that is genuinely used
   * as a place name is listed in `aliases` as well, by hand.
   */
  traditionalName?: string;
  /** Spellings actually seen in the data. Resolving one of these returns this place. */
  aliases?: string[];
  /** The id of a place this sits inside, set only where a source says so. */
  within?: string;
  /** True when a row with this id exists in the Supabase `communities` table. */
  inRegister?: boolean;
  note?: string;
}

export const PLACES: readonly Place[] = [

  // ── Communities ───────────────────────────────────────────────
  { id: 'alpurrurulam', name: 'Alpurrurulam', kind: 'community', state: 'NT' },
  { id: 'amanbidji', name: 'Amanbidji', kind: 'community', state: 'NT' },
  { id: 'ampilatwatja', name: 'Ampilatwatja', kind: 'community', state: 'NT' },
  { id: 'angurugu', name: 'Angurugu', kind: 'community', state: 'NT', within: 'groote-archipelago' },
  { id: 'areyonga', name: 'Areyonga', kind: 'community', state: 'NT' },
  { id: 'atitjere', name: 'Atitjere', kind: 'community', state: 'NT' },
  { id: 'aurukun', name: 'Aurukun', kind: 'community', state: 'QLD', traditionalName: 'Wik', inRegister: true },
  { id: 'barunga', name: 'Barunga', kind: 'community', state: 'NT' },
  { id: 'belyuen', name: 'Belyuen', kind: 'community', state: 'NT' },
  { id: 'beswick', name: 'Beswick', kind: 'community', state: 'NT' },
  { id: 'binjari', name: 'Binjari', kind: 'community', state: 'NT' },
  { id: 'borroloola', name: 'Borroloola', kind: 'community', state: 'NT', traditionalName: 'Yanyuwa', inRegister: true },
  { id: 'bulla', name: 'Bulla', kind: 'community', state: 'NT' },
  { id: 'bulman', name: 'Bulman', kind: 'community', state: 'NT' },
  { id: 'cherbourg', name: 'Cherbourg', kind: 'community', state: 'QLD', inRegister: true },
  { id: 'doomadgee', name: 'Doomadgee', kind: 'community', state: 'QLD', aliases: ['Old Doomadgee'], inRegister: true },
  { id: 'engawala', name: 'Engawala', kind: 'community', state: 'NT' },
  { id: 'finke', name: 'Finke', kind: 'community', state: 'NT' },
  { id: 'galiwinku', name: 'Galiwin\'ku', kind: 'community', state: 'NT', traditionalName: 'Elcho Island', aliases: ['Elcho Island', 'Galiwinku'], inRegister: true },
  { id: 'gapuwiyak', name: 'Gapuwiyak', kind: 'community', state: 'NT' },
  { id: 'groote-archipelago', name: 'Groote Archipelago', kind: 'community', state: 'NT', traditionalName: 'Warnindilyakwa', aliases: ['Groote', 'Groote Eylandt'], inRegister: true },
  { id: 'gunbalanya', name: 'Gunbalanya', kind: 'community', state: 'NT', aliases: ['Oenpelli'], inRegister: true },
  { id: 'gunyangara', name: 'Gunyangara', kind: 'community', state: 'NT' },
  { id: 'hermannsburg', name: 'Hermannsburg', kind: 'community', state: 'NT' },
  { id: 'imanpa', name: 'Imanpa', kind: 'community', state: 'NT' },
  { id: 'kalkarindji', name: 'Kalkarindji', kind: 'community', state: 'NT', aliases: ['Kalkarindji Community'] },
  { id: 'kaltukatjara', name: 'Kaltukatjara', kind: 'community', state: 'NT' },
  { id: 'kintore', name: 'Kintore', kind: 'community', state: 'NT' },
  { id: 'kowanyama', name: 'Kowanyama', kind: 'community', state: 'QLD', inRegister: true },
  { id: 'lajamanu', name: 'Lajamanu', kind: 'community', state: 'NT', traditionalName: 'Warlpiri', inRegister: true },
  { id: 'laramba', name: 'Laramba', kind: 'community', state: 'NT' },
  { id: 'maningrida', name: 'Maningrida', kind: 'community', state: 'NT', inRegister: true },
  { id: 'manyallaluk', name: 'Manyallaluk', kind: 'community', state: 'NT' },
  { id: 'milikapiti', name: 'Milikapiti', kind: 'community', state: 'NT' },
  { id: 'milingimbi', name: 'Milingimbi', kind: 'community', state: 'NT' },
  { id: 'minjilang', name: 'Minjilang', kind: 'community', state: 'NT' },
  { id: 'minyerri', name: 'Minyerri', kind: 'community', state: 'NT' },
  { id: 'mt-liebig', name: 'Mt Liebig', kind: 'community', state: 'NT' },
  { id: 'mutitjulu', name: 'Mutitjulu', kind: 'community', state: 'NT', traditionalName: 'Anangu', inRegister: true },
  { id: 'nauiyu', name: 'Nauiyu', kind: 'community', state: 'NT' },
  { id: 'nganmarriyanga', name: 'Nganmarriyanga', kind: 'community', state: 'NT' },
  { id: 'ngukurr', name: 'Ngukurr', kind: 'community', state: 'NT', inRegister: true },
  { id: 'numbulwar', name: 'Numbulwar', kind: 'community', state: 'NT' },
  { id: 'nyirripi', name: 'Nyirripi', kind: 'community', state: 'NT' },
  { id: 'palm-island', name: 'Palm Island', kind: 'community', state: 'QLD', traditionalName: 'Bwgcolman', aliases: ['Bwgcolman'], inRegister: true },
  { id: 'papunya', name: 'Papunya', kind: 'community', state: 'NT' },
  { id: 'pigeon-hole', name: 'Pigeon Hole', kind: 'community', state: 'NT' },
  { id: 'pirlangimpi', name: 'Pirlangimpi', kind: 'community', state: 'NT' },
  { id: 'ramingining', name: 'Ramingining', kind: 'community', state: 'NT', inRegister: true },
  { id: 'rittarangu', name: 'Rittarangu', kind: 'community', state: 'NT' },
  { id: 'robinson-river', name: 'Robinson River', kind: 'community', state: 'NT' },
  { id: 'santa-teresa', name: 'Santa Teresa', kind: 'community', state: 'NT' },
  { id: 'titjikala', name: 'Titjikala', kind: 'community', state: 'NT' },
  { id: 'torres-strait', name: 'Torres Strait', kind: 'community', state: 'QLD', aliases: ['Thursday Island'], inRegister: true },
  { id: 'umbakumba', name: 'Umbakumba', kind: 'community', state: 'NT', within: 'groote-archipelago' },
  { id: 'wadeye', name: 'Wadeye', kind: 'community', state: 'NT', traditionalName: 'Murrinhpatha', aliases: ['Port Keats'], inRegister: true },
  { id: 'warruwi', name: 'Warruwi', kind: 'community', state: 'NT' },
  { id: 'wilora', name: 'Wilora', kind: 'community', state: 'NT' },
  { id: 'woorabinda', name: 'Woorabinda', kind: 'community', state: 'QLD', inRegister: true },
  { id: 'wurrumiyanga', name: 'Wurrumiyanga', kind: 'community', state: 'NT' },
  { id: 'yarrabah', name: 'Yarrabah', kind: 'community', state: 'QLD', inRegister: true },
  { id: 'yarralin', name: 'Yarralin', kind: 'community', state: 'NT' },
  { id: 'yirrkala', name: 'Yirrkala', kind: 'community', state: 'NT' },
  { id: 'yuendumu', name: 'Yuendumu', kind: 'community', state: 'NT', traditionalName: 'Warlpiri', inRegister: true },

  // ── Homelands ─────────────────────────────────────────────────
  { id: 'utopia', name: 'Utopia Homelands', kind: 'homelands', state: 'NT', aliases: ['Arlparra', 'Utopia'], inRegister: true },

  // ── Towns and regional centres ────────────────────────────────
  { id: 'alice-springs', name: 'Alice Springs', kind: 'town', state: 'NT', traditionalName: 'Mparntwe', aliases: ['Alice Homelands', 'Mparntwe'], inRegister: true },
  { id: 'broome', name: 'Broome', kind: 'town', state: 'WA' },
  { id: 'canberra', name: 'Canberra', kind: 'town', state: 'ACT', traditionalName: 'Ngunnawal', inRegister: true },
  { id: 'ceduna', name: 'Ceduna', kind: 'town', state: 'SA', aliases: ['Ceduna Town Camp'], inRegister: true },
  { id: 'darwin', name: 'Darwin', kind: 'town', state: 'NT', traditionalName: 'Larrakia', inRegister: true },
  { id: 'derby', name: 'Derby', kind: 'town', state: 'WA' },
  { id: 'halls-creek', name: 'Halls Creek', kind: 'town', state: 'WA' },
  { id: 'kalgoorlie', name: 'Kalgoorlie', kind: 'town', state: 'WA', traditionalName: 'Ninga Mia', aliases: ['Ninga Mia', 'Wongatha'], inRegister: true },
  { id: 'katherine', name: 'Katherine', kind: 'town', state: 'NT', traditionalName: 'Jawoyn', inRegister: true },
  { id: 'kununurra', name: 'Kununurra', kind: 'town', state: 'WA', traditionalName: 'Miriwoong', inRegister: true },
  { id: 'mt-isa', name: 'Mt Isa', kind: 'town', state: 'QLD', traditionalName: 'Kalkadoon', aliases: ['Mount Isa'], inRegister: true },
  { id: 'nhulunbuy', name: 'Nhulunbuy', kind: 'town', state: 'NT' },
  { id: 'palmerston', name: 'Palmerston', kind: 'town', state: 'NT' },
  { id: 'port-augusta', name: 'Port Augusta', kind: 'town', state: 'SA', inRegister: true },
  { id: 'tennant-creek', name: 'Tennant Creek', kind: 'town', state: 'NT', traditionalName: 'Wumpurrarni', aliases: ['Wumpurrarni'], inRegister: true },

  // ── Regions. Never an answer to "which community". ────────────
  { id: 'apy-lands', name: 'APY Lands', kind: 'region', state: 'SA' },
  { id: 'alice-springs-region', name: 'Alice Springs Region', kind: 'region', state: 'NT' },
  { id: 'arafura-region', name: 'Arafura Region', kind: 'region', state: 'NT' },
  { id: 'arnhem-region', name: 'Arnhem Region', kind: 'region', state: 'NT' },
  { id: 'barkly-region', name: 'Barkly Region', kind: 'region', state: 'NT' },
  { id: 'big-rivers-region', name: 'Big Rivers Region', kind: 'region', state: 'NT', aliases: ['Big Rivers'] },
  { id: 'central-australia-region', name: 'Central Australia Region', kind: 'region', state: 'NT', aliases: ['Central Australia'] },
  { id: 'central-region', name: 'Central Region', kind: 'region', state: 'NT' },
  { id: 'darwin-region', name: 'Darwin Region', kind: 'region', state: 'NT', aliases: ['Greater Darwin Region'] },
  { id: 'east-arnhem-region', name: 'East Arnhem Region', kind: 'region', state: 'NT', aliases: ['East Arnhem'] },
  { id: 'katherine-region', name: 'Katherine Region', kind: 'region', state: 'NT' },
  { id: 'kimberley', name: 'Kimberley', kind: 'region', state: 'WA' },
  { id: 'ngaanyatjarra-lands', name: 'Ngaanyatjarra Lands', kind: 'region', state: 'WA' },
  { id: 'northern-region', name: 'Northern Region', kind: 'region', state: 'NT' },
  { id: 'pilbara', name: 'Pilbara', kind: 'region', state: 'WA' },
  { id: 'southern-region', name: 'Southern Region', kind: 'region', state: 'NT' },
  { id: 'tennant-creek-region', name: 'Tennant Creek Region', kind: 'region', state: 'NT' },
  { id: 'tiwi-islands', name: 'Tiwi Islands', kind: 'region', state: 'NT' },
  { id: 'top-end', name: 'Top End', kind: 'region', state: 'NT' },

  // ── Whole jurisdictions ───────────────────────────────────────
  { id: 'multi-jurisdiction', name: 'NT, WA, QLD', kind: 'jurisdiction', state: null },
  { id: 'sa-wide', name: 'South Australia', kind: 'jurisdiction', state: 'SA' },
  { id: 'nt-wide', name: 'Territory wide', kind: 'jurisdiction', state: 'NT', aliases: ['All Centres', 'All Regions'] },

  // ── Buildings and precincts. They sit in a place. ─────────────
  { id: 'darwin-port', name: 'Darwin Port Corporation', kind: 'facility', state: 'NT', within: 'darwin' },
  { id: 'darwin-waterfront', name: 'Darwin Waterfront Precinct', kind: 'facility', state: 'NT', within: 'darwin' },
  { id: 'health-house', name: 'Health House', kind: 'facility', state: 'NT', within: 'darwin' },
  { id: 'katherine-court-house', name: 'Katherine Court House', kind: 'facility', state: 'NT', within: 'katherine' },
  { id: 'royal-darwin-hospital', name: 'Royal Darwin Hospital', kind: 'facility', state: 'NT', aliases: ['Royal Darwin Hospital Campus', 'Royal Darwin Hospital and Palm'], within: 'darwin' },

  // ── Not a place ───────────────────────────────────────────────
  { id: 'pending-delivery', name: 'Pending Delivery', kind: 'sentinel', state: 'NT', inRegister: true, note: 'Not a place. The asset register uses it for stock that has left the plant and has no destination yet.' },
];

/**
 * Strings that appear in a place column and are not places. Listed so the drift check can tell
 * "nobody has mapped this yet" from "this was never a place", and fail on the first.
 */
export const NOT_A_PLACE: readonly string[] = [
  // The NT contracts workbook truncates its place column at 30 characters, which is why several
  // of these end mid-word. Each one is a fragment of a contract title.
  '27 remote locations',
  'Consultancy',
  'Housing Maintenance Program',
  'Implementation, Support and Ma',
  'Panel Contract for Repairs, Ma',
  'Repairs and Maintenance of Chi',
  'Darwin, Palmerston and Coolalinga',
  'Alice Springs, Darwin',
  'Adelaide and Whyalla',
];

/** Fold a place string to its comparison key: ASCII, lower case, letters and digits only. */
export function placeKey(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

const BY_KEY: ReadonlyMap<string, Place> = (() => {
  const m = new Map<string, Place>();
  for (const p of PLACES) {
    for (const spelling of [p.id, p.name, ...(p.aliases ?? [])]) {
      if (spelling) m.set(placeKey(spelling), p);
    }
  }
  return m;
})();

const NOT_A_PLACE_KEYS: ReadonlySet<string> = new Set(NOT_A_PLACE.map(placeKey));

/**
 * The one resolver. Every pull script and every surface goes through this instead of comparing
 * place strings to each other.
 *
 * Returns null for something we have never mapped AND for something listed in NOT_A_PLACE, so
 * call `isNotAPlace` when you need to tell those two apart. Callers rendering to a person want
 * null either way; the drift check is the only thing that needs the distinction.
 */
export function resolvePlace(input: string | null | undefined): Place | null {
  if (!input) return null;
  return BY_KEY.get(placeKey(input)) ?? null;
}

/** True when this string is a known non-place, such as a fragment of a contract title. */
export function isNotAPlace(input: string | null | undefined): boolean {
  return Boolean(input) && NOT_A_PLACE_KEYS.has(placeKey(input as string));
}

/**
 * Resolve, but only accept a place somebody could deliver a bed to. A region, a jurisdiction and
 * a building all return null, which is the point: a surface asking "which community" gets an
 * honest no instead of "Barkly Region".
 */
export function resolveCommunity(input: string | null | undefined): Place | null {
  const p = resolvePlace(input);
  if (!p) return null;
  return p.kind === 'community' || p.kind === 'homelands' || p.kind === 'town' ? p : null;
}

export function placeById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

export const PLACE_REGISTRY_SOURCE =
  'Supabase `communities` (31 rows, read 17 Sep 2026) widened with every place string in data/community-intel.json, data/organisations.json, data/procurement-buyers.json and data/nt-housing-contractors.json.';
