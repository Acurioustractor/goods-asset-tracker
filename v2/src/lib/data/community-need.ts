/**
 * COMMUNITY NEED — measured ABS overcrowding beside each community the register serves.
 *
 * Source: ABS Census 2021 Indigenous Profile DataPack, table I16 (Housing Suitability,
 * CNOS "requiring one or more extra bedrooms" — the standard overcrowding proxy), ILOC geography.
 *
 * ---------------------------------------------------------------------------
 * TWO LAYERS, AND ONLY ONE OF THEM IS HAND-MADE
 * ---------------------------------------------------------------------------
 * `abs-iloc-overcrowding.json` is the whole ABS table, all **1,138 ILOCs**, pulled from the shared
 * CivicGraph project on 10 September 2026. It is reference data and nobody edits it by hand.
 *
 * `CROSSWALK` is the part that needs a person: which ILOC honestly describes which community Goods
 * serves. Nine entries today. Everything in `COMMUNITY_NEED` is then read from the reference by
 * ILOC code, so a figure cannot drift from ABS by being retyped.
 *
 * That split is the point. Widening the reference from nine rows to 1,138 adds no claim about any
 * new place, because a place only enters `COMMUNITY_NEED` when somebody maps it.
 *
 * Deriving rather than retyping caught one immediately. Mount Isa carried
 * `personsPerDwelling: 3.13`, which implies 19,957 people. ABS records 18,571 persons over 6,376
 * dwellings, which is 2.91.
 *
 * Rules, learned elsewhere the hard way:
 *  - One community, one ILOC, or nothing. Where no single honest mapping exists
 *    (urban multi-ILOC Alice Springs) or the pack does not cover the frame (ACT communities),
 *    `need` is null with a stated reason — never a guessed number.
 *  - ABS small-cell randomisation: these are ABS-supplied totals, never summed components.
 *  - This measures the PLACE, not Goods demand and not outcomes. It sits beside delivered
 *    counts to size the setting; it must never be presented as orders or as impact.
 *  - The reference is a lookup, not a candidate list. A high-overcrowding ILOC is not a community
 *    Goods works in, and `place-framework.ts` will not let need alone move a place up the queue.
 */

import ilocRows from './abs-iloc-overcrowding.json';

/** One row of the ABS table, as ABS supplies it. */
export interface IlocOvercrowding {
  iloc_code: string;
  iloc_name: string;
  occupied_dwellings: number;
  need_1plus: number;
  need_1plus_pct: number | null;
  atsip_households: number;
  atsip_need_1plus: number;
  persons: number;
  persons_per_dwelling: number | null;
}

/** The whole ABS table. Reference data, never edited by hand. */
export const ABS_ILOC_OVERCROWDING = ilocRows as readonly IlocOvercrowding[];

export function ilocByCode(code: string): IlocOvercrowding | undefined {
  return ABS_ILOC_OVERCROWDING.find((r) => r.iloc_code === code);
}

/** Substring search over ILOC names. A lookup helper, and never a way to pick a community. */
export function searchIlocs(text: string): IlocOvercrowding[] {
  const q = text.trim().toLowerCase();
  if (q.length < 3) return [];
  return ABS_ILOC_OVERCROWDING.filter((r) => r.iloc_name.toLowerCase().includes(q));
}

export interface CommunityNeed {
  /** Matches COMMUNITY_BED_CANON id. */
  communityId: string;
  ilocCode: string;
  ilocName: string;
  occupiedDwellings: number;
  /** Dwellings requiring 1+ extra bedrooms (CNOS). */
  need1plus: number;
  need1plusPct: number;
  /** Aboriginal and Torres Strait Islander households, and how many of those need a bedroom. */
  atsipHouseholds: number;
  atsipNeed1plus: number;
  /** ABS-supplied person count for the ILOC. */
  persons: number;
  /** persons / occupied dwellings, from the ABS figures. Approximate. */
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

/**
 * Which ILOC honestly describes which served community. The hand-made half, and the only place a
 * new community can be added. A mapping is a judgement and carries its caveat.
 */
const CROSSWALK: readonly { communityId: string; ilocCode: string; caveat?: string }[] = [
  { communityId: 'maningrida', ilocCode: '70400301' },
  { communityId: 'utopia', ilocCode: '70901204' },
  {
    communityId: 'tennant-creek',
    ilocCode: '70700504',
    caveat: 'ILOC excludes town camps, so this understates the town camps Goods works with.',
  },
  { communityId: 'katherine', ilocCode: '70500502', caveat: 'ILOC excludes town camps.' },
  {
    communityId: 'darwin',
    ilocCode: '70300501',
    caveat: 'Central Darwin ILOC only, not greater Darwin.',
  },
  { communityId: 'palm-island', ilocCode: '31000901' },
  {
    communityId: 'kalgoorlie',
    ilocCode: '50300301',
    caveat: 'Whole-town ILOC, not the specific camps and households Goods works with.',
  },
  { communityId: 'kununurra', ilocCode: '50400601', caveat: 'ILOC excludes town camps.' },
  { communityId: 'mount-isa', ilocCode: '30400402', caveat: 'Whole-town ILOC excluding Camooweal.' },
];

function fromReference(entry: (typeof CROSSWALK)[number]): CommunityNeed {
  const r = ilocByCode(entry.ilocCode);
  if (!r) throw new Error(`community-need: ILOC ${entry.ilocCode} is not in the ABS reference`);
  return {
    communityId: entry.communityId,
    ilocCode: r.iloc_code,
    ilocName: r.iloc_name,
    occupiedDwellings: r.occupied_dwellings,
    need1plus: r.need_1plus,
    need1plusPct: r.need_1plus_pct ?? 0,
    atsipHouseholds: r.atsip_households,
    atsipNeed1plus: r.atsip_need_1plus,
    persons: r.persons,
    personsPerDwelling: r.persons_per_dwelling ?? 0,
    ...(entry.caveat ? { caveat: entry.caveat } : {}),
  };
}

/** The served communities' extract, read from the ABS reference rather than retyped. */
export const COMMUNITY_NEED: readonly CommunityNeed[] = CROSSWALK.map(fromReference);

/** Served communities the ABS ILOC pack cannot honestly cover yet, with the reason. */
export const COMMUNITY_NEED_GAPS: readonly CommunityNeedGap[] = [
  { communityId: 'canberra', reason: 'ACT: outside the remote-community frame this measure describes.' },
  { communityId: 'alice-springs', reason: 'Urban multi-ILOC area: no single honest ILOC mapping.' },
];
