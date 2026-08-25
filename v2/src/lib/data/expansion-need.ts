/**
 * EXPANSION NEED — measured ABS overcrowding beside each expansion target.
 *
 * Same source and rules as community-need.ts: ABS Census 2021 Indigenous Profile
 * DataPack table I16 (Housing Suitability, CNOS "requiring one or more extra
 * bedrooms"), ILOC geography. The national 1,138-ILOC dataset lives in CivicGraph
 * (`abs_iloc_overcrowding`, loaded 2026-08-24/25); these rows are the expansion
 * targets' extract, transcribed 2026-08-25.
 *
 *  - One community, one ILOC, or nothing. Groote Archipelago spans three ILOCs and
 *    the Torres Strait spans fourteen islands: both are stated gaps, never a sum —
 *    ABS small-cell randomisation makes cross-ILOC arithmetic dishonest.
 *  - This measures the PLACE, not Goods demand and not outcomes. It sits beside the
 *    researched reason lines to size the setting; it must never be presented as
 *    orders, coverage or impact.
 *  - Where measurement disagrees with a researched reason line, the measurement is
 *    shown as-is: at ILOC grain Galiwin'ku (63.8%) and Ngukurr (62.9%) both exceed
 *    Wadeye (53.7%), whose "worst overcrowding" line rests on homes-short and
 *    people-per-house counts, not this proxy.
 */

export interface ExpansionNeed {
  /** Matches expansionTargets[].community exactly. */
  community: string;
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

export interface ExpansionNeedGap {
  community: string;
  reason: string;
}

export const EXPANSION_NEED_SOURCE =
  'ABS Census 2021 Indigenous Profile DataPack, table I16 (ILOC), housing suitability (CNOS); as at Census night 10 August 2021';

export const EXPANSION_NEED: readonly ExpansionNeed[] = [
  {
    community: 'Wadeye (Port Keats)',
    ilocCode: '70400502',
    ilocName: 'Wadeye',
    occupiedDwellings: 339,
    need1plus: 182,
    need1plusPct: 53.7,
    personsPerDwelling: 5.68,
    caveat: 'Wadeye township ILOC; surrounding Thamarrurr outstations are a separate ILOC.',
  },
  {
    community: 'Yarrabah',
    ilocCode: '30901201',
    ilocName: 'Yarrabah',
    occupiedDwellings: 486,
    need1plus: 199,
    need1plusPct: 40.9,
    personsPerDwelling: 5.15,
  },
  {
    community: "Galiwin'ku (Elcho Island)",
    ilocCode: '70600401',
    ilocName: 'Galiwinku',
    occupiedDwellings: 309,
    need1plus: 197,
    need1plusPct: 63.8,
    personsPerDwelling: 7.12,
    caveat: 'Galiwinku township ILOC; Marthakal Homelands are a separate ILOC.',
  },
  {
    community: 'Aurukun',
    ilocCode: '30300101',
    ilocName: 'Aurukun',
    occupiedDwellings: 236,
    need1plus: 68,
    need1plusPct: 28.8,
    personsPerDwelling: 4.67,
  },
  {
    community: 'Gunbalanya (Oenpelli)',
    ilocCode: '70400402',
    ilocName: 'Gunbalanya',
    occupiedDwellings: 217,
    need1plus: 112,
    need1plusPct: 51.6,
    personsPerDwelling: 5.31,
  },
  {
    community: 'Doomadgee',
    ilocCode: '30400202',
    ilocName: 'Doomadgee',
    occupiedDwellings: 285,
    need1plus: 105,
    need1plusPct: 36.8,
    personsPerDwelling: 4.87,
  },
  {
    community: 'Borroloola',
    ilocCode: '70500101',
    ilocName: 'Borroloola exc. Mara - Yanyula',
    occupiedDwellings: 116,
    need1plus: 41,
    need1plusPct: 35.3,
    personsPerDwelling: 3.77,
    caveat: 'ILOC excludes the Mara and Yanyula town camps, so this understates the camps.',
  },
  {
    community: 'Ngukurr',
    ilocCode: '70500701',
    ilocName: 'Ngukurr',
    occupiedDwellings: 167,
    need1plus: 105,
    need1plusPct: 62.9,
    personsPerDwelling: 6.51,
  },
  {
    community: 'Ramingining',
    ilocCode: '70600704',
    ilocName: 'Ramingining',
    occupiedDwellings: 126,
    need1plus: 68,
    need1plusPct: 54.0,
    personsPerDwelling: 6.46,
    caveat: 'Ramingining township ILOC; the Milingimbi outstations are a separate ILOC.',
  },
  {
    community: 'Kowanyama',
    ilocCode: '30300501',
    ilocName: 'Kowanyama',
    occupiedDwellings: 247,
    need1plus: 85,
    need1plusPct: 34.4,
    personsPerDwelling: 4.37,
  },
  {
    community: 'Woorabinda',
    ilocCode: '30500404',
    ilocName: 'Woorabinda',
    occupiedDwellings: 273,
    need1plus: 51,
    need1plusPct: 18.7,
    personsPerDwelling: 3.73,
  },
  {
    community: 'Cherbourg',
    ilocCode: '30600301',
    ilocName: 'Cherbourg',
    occupiedDwellings: 307,
    need1plus: 55,
    need1plusPct: 17.9,
    personsPerDwelling: 3.89,
  },
  {
    community: 'Lajamanu',
    ilocCode: '70500601',
    ilocName: 'Lajamanu',
    occupiedDwellings: 115,
    need1plus: 63,
    need1plusPct: 54.8,
    personsPerDwelling: 5.68,
  },
  {
    community: 'Yuendumu',
    ilocCode: '70901701',
    ilocName: 'Yuendumu and Outstations',
    occupiedDwellings: 160,
    need1plus: 45,
    need1plusPct: 28.1,
    personsPerDwelling: 4.62,
    caveat: 'ILOC includes outstations around Yuendumu.',
  },
];

/** Expansion targets the ILOC frame cannot honestly cover, with the reason. */
export const EXPANSION_NEED_GAPS: readonly ExpansionNeedGap[] = [
  {
    community: 'Groote Archipelago',
    reason:
      'Spans three ILOCs (Angurugu 40.6%, Angurugu Outstations 35.9%, Umbakumba 35.2%): no single honest figure, and summing randomised cells is banned.',
  },
  {
    community: 'Torres Strait (via TSIRC)',
    reason: 'Fourteen islands, each its own geography: no single honest ILOC mapping.',
  },
];
