/**
 * COMMUNITY NEED — measured ABS overcrowding beside each community the register serves.
 *
 * Source: ABS Census 2021 Indigenous Profile DataPack, table I16 (Housing Suitability,
 * CNOS "requiring one or more extra bedrooms" — the standard overcrowding proxy), ILOC
 * geography; NT pack ingested 2026-08-24, QLD + WA packs 2026-08-25. The full 189-ILOC dataset lives in CivicGraph
 * (`abs_nt_iloc_overcrowding`); the rows here are the served communities' extract, each
 * carrying its ILOC and any geography caveat. persons/dwelling is derived I02/I16 and
 * approximate.
 *
 * Rules, learned elsewhere the hard way:
 *  - One community, one ILOC, or nothing. Where no single honest mapping exists
 *    (urban multi-ILOC Alice Springs) or the pack does not cover the state (QLD/WA/ACT
 *    communities), `need` is null with a stated reason — never a guessed number.
 *  - ABS small-cell randomisation: these are ABS-supplied totals, never summed components.
 *  - This measures the PLACE, not Goods demand and not outcomes. It sits beside delivered
 *    counts to size the setting; it must never be presented as orders or as impact.
 */

export interface CommunityNeed {
  /** Matches COMMUNITY_BED_CANON id. */
  communityId: string;
  ilocCode: string;
  ilocName: string;
  occupiedDwellings: number;
  /** Dwellings requiring 1+ extra bedrooms (CNOS). */
  need1plus: number;
  need1plusPct: number;
  /** Derived I02/I16, approximate. */
  personsPerDwelling: number;
  caveat?: string;
}

export interface CommunityNeedGap {
  communityId: string;
  reason: string;
}

export const NEED_SOURCE =
  'ABS Census 2021 Indigenous Profile DataPack, table I16 (ILOC), housing suitability (CNOS); as at Census night 10 August 2021';
export const NEED_SOURCE_URL = 'https://www.abs.gov.au/census/find-census-data/datapacks';

export const COMMUNITY_NEED: readonly CommunityNeed[] = [
  {
    communityId: 'maningrida',
    ilocCode: '70400301',
    ilocName: 'Maningrida',
    occupiedDwellings: 394,
    need1plus: 237,
    need1plusPct: 60.2,
    personsPerDwelling: 6.39,
  },
  {
    communityId: 'utopia',
    ilocCode: '70901204',
    ilocName: 'Utopia - Arawerr - Arlparra',
    occupiedDwellings: 82,
    need1plus: 34,
    need1plusPct: 41.5,
    personsPerDwelling: 5.41,
  },
  {
    communityId: 'tennant-creek',
    ilocCode: '70700504',
    ilocName: 'Tennant Creek exc. Town Camps',
    occupiedDwellings: 864,
    need1plus: 90,
    need1plusPct: 10.4,
    personsPerDwelling: 2.95,
    caveat: 'ILOC excludes town camps, so this understates the town camps Goods works with.',
  },
  {
    communityId: 'katherine',
    ilocCode: '70500502',
    ilocName: 'Katherine exc. Town Camps',
    occupiedDwellings: 2759,
    need1plus: 176,
    need1plusPct: 6.4,
    personsPerDwelling: 3.29,
    caveat: 'ILOC excludes town camps.',
  },
  {
    communityId: 'darwin',
    ilocCode: '70300501',
    ilocName: 'Darwin - Central',
    occupiedDwellings: 2984,
    need1plus: 226,
    need1plusPct: 7.6,
    personsPerDwelling: 2.4,
    caveat: 'Central Darwin ILOC only, not greater Darwin.',
  },
  {
    communityId: 'palm-island',
    ilocCode: '31000901',
    ilocName: 'Palm Island',
    occupiedDwellings: 491,
    need1plus: 134,
    need1plusPct: 27.3,
    personsPerDwelling: 4.27,
  },
  {
    communityId: 'kalgoorlie',
    ilocCode: '50300301',
    ilocName: 'Kalgoorlie',
    occupiedDwellings: 9974,
    need1plus: 233,
    need1plusPct: 2.3,
    personsPerDwelling: 2.91,
    caveat: 'Whole-town ILOC, not the specific camps and households Goods works with.',
  },
  {
    communityId: 'kununurra',
    ilocCode: '50400601',
    ilocName: 'Kununurra exc. Town Camps',
    occupiedDwellings: 1361,
    need1plus: 97,
    need1plusPct: 7.1,
    personsPerDwelling: 3.34,
    caveat: 'ILOC excludes town camps.',
  },
  {
    communityId: 'mount-isa',
    ilocCode: '30400402',
    ilocName: 'Mount Isa exc. Camooweal',
    occupiedDwellings: 6376,
    need1plus: 293,
    need1plusPct: 4.6,
    personsPerDwelling: 3.13,
    caveat: 'Whole-town ILOC excluding Camooweal.',
  },
];

/** Served communities the ABS ILOC pack cannot honestly cover yet, with the reason. */
export const COMMUNITY_NEED_GAPS: readonly CommunityNeedGap[] = [
  { communityId: 'canberra', reason: 'ACT: outside the remote-community frame this measure describes.' },
  { communityId: 'alice-springs', reason: 'Urban multi-ILOC area: no single honest ILOC mapping.' },
];
