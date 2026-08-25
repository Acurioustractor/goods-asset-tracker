/**
 * COMMUNITY HEALTH SETTING — measured regional health burden beside each served community.
 *
 * Two grains, kept visibly separate:
 *  - LGA grain (PHIDU Social Health Atlas, June 2026 edition): median age at death
 *    (2019-2023) and potentially-preventable hospital admissions (2020/21, SR = indirectly
 *    standardised ratio vs Australia = 100). An LGA is bigger than a community — the row
 *    names the LGA so nobody reads West Arnhem's number as Maningrida's alone.
 *  - ILOC grain (ABS Census 2021 IP DataPack I12): self-reported long-term conditions for
 *    Aboriginal and/or Torres Strait Islander persons, community grain; NT pack ingested 2026-08-24, QLD + WA 2026-08-25.
 *
 * Values verified against CivicGraph reference tables (phidu_lga_health,
 * abs_nt_iloc_health) 2026-08-25. ABS small-cell randomisation applies to ILOC counts.
 *
 * ATTRIBUTION (licence condition): PHIDU data © PHIDU, Torrens University Australia,
 * CC BY-NC-SA 3.0 AU — the rendering surface must credit PHIDU.
 *
 * CLAIM CEILING, non-negotiable: this measures the SETTING. It is the why behind beds as
 * health hardware; it is never an outcome of the work and never a causal claim. Where no
 * honest mapping exists (Canberra is outside the frame) the community carries a stated
 * gap, never a guessed number. Utopia's LGA was ruled 2026-08-25 by convergent public
 * evidence: Barkly Regional Council's own communities page (Arlparra is one of its
 * elected local authorities), Wikipedia Utopia NT, Urapuntja Health Service. Its Barkly
 * figures are shared with Tennant Creek — same region, named on both rows.
 */

export interface CommunityHealthSetting {
  /** Matches COMMUNITY_BED_CANON id. */
  communityId: string;
  lgaCode: string;
  lgaName: string;
  /** Median age at death, persons, 2019-2023 (PHIDU). */
  medianAgeDeath: number;
  deaths: number;
  /** PPH standardised ratio vs Australia=100, 2020/21 (PHIDU). */
  pphSr: number;
  /** Why community-grain data is absent, when it is. */
  ilocGapReason?: string;
  /** Community-grain Census conditions (NT ILOCs only). */
  iloc?: {
    ilocName: string;
    personsCounted: number;
    heartDisease: number;
    kidneyDisease: number;
    diabetes: number;
    medianAge: number;
  };
}

export interface CommunityHealthGap {
  communityId: string;
  reason: string;
}

export const HEALTH_SOURCE_LGA =
  'PHIDU Social Health Atlas of Australia (June 2026 edition), LGA grain; median age at death 2019-2023, potentially preventable hospitalisations 2020/21. © PHIDU, Torrens University Australia, CC BY-NC-SA 3.0 AU';
export const HEALTH_SOURCE_LGA_URL = 'https://phidu.torrens.edu.au/social-health-atlases/data';
export const HEALTH_SOURCE_ILOC =
  'ABS Census 2021 Indigenous Profile DataPack, table I12 (self-reported long-term health conditions, Aboriginal and/or Torres Strait Islander persons), ILOC grain';

export const NATIONAL_MEDIAN_AGE_DEATH_NOTE =
  'Across Australia the median age at death is in the early 80s; the SR baseline for admissions is Australia = 100.';

export const COMMUNITY_HEALTH: readonly CommunityHealthSetting[] = [
  {
    communityId: 'maningrida',
    lgaCode: '74660',
    lgaName: 'West Arnhem',
    medianAgeDeath: 52,
    deaths: 178,
    pphSr: 419,
    iloc: {
      ilocName: 'Maningrida',
      personsCounted: 2297,
      heartDisease: 256,
      kidneyDisease: 72,
      diabetes: 100,
      medianAge: 27,
    },
  },
  {
    communityId: 'tennant-creek',
    lgaCode: '70420',
    lgaName: 'Barkly',
    medianAgeDeath: 59,
    deaths: 252,
    pphSr: 949,
    iloc: {
      ilocName: 'Tennant Creek exc. Town Camps',
      personsCounted: 1189,
      heartDisease: 75,
      kidneyDisease: 62,
      diabetes: 126,
      medianAge: 35,
    },
  },
  {
    communityId: 'utopia',
    lgaCode: '70420',
    lgaName: 'Barkly',
    medianAgeDeath: 59,
    deaths: 252,
    pphSr: 949,
    iloc: {
      ilocName: 'Utopia - Arawerr - Arlparra',
      personsCounted: 372,
      heartDisease: 4,
      kidneyDisease: 5,
      diabetes: 17,
      medianAge: 28,
    },
  },
  {
    communityId: 'palm-island',
    lgaCode: '35790',
    lgaName: 'Palm Island',
    medianAgeDeath: 61,
    deaths: 83,
    pphSr: 359,
    iloc: {
      ilocName: 'Palm Island',
      personsCounted: 1918,
      heartDisease: 83,
      kidneyDisease: 23,
      diabetes: 145,
      medianAge: 26,
    },
  },
  {
    communityId: 'alice-springs',
    ilocGapReason: 'Urban multi-ILOC area: no single honest community mapping.',
    lgaCode: '70200',
    lgaName: 'Alice Springs',
    medianAgeDeath: 69,
    deaths: 704,
    pphSr: 381,
  },
  {
    communityId: 'kalgoorlie',
    lgaCode: '54280',
    lgaName: 'Kalgoorlie-Boulder',
    medianAgeDeath: 69,
    deaths: 761,
    pphSr: 151,
    iloc: {
      ilocName: 'Kalgoorlie (whole town)',
      personsCounted: 2228,
      heartDisease: 65,
      kidneyDisease: 41,
      diabetes: 178,
      medianAge: 34,
    },
  },
  {
    communityId: 'katherine',
    ilocGapReason: 'The Katherine ILOC excludes town camps, so a community-grain figure would misdescribe who Goods works with.',
    lgaCode: '72200',
    lgaName: 'Katherine',
    medianAgeDeath: 66,
    deaths: 339,
    pphSr: 422,
  },
  {
    communityId: 'mount-isa',
    lgaCode: '35300',
    lgaName: 'Mount Isa',
    medianAgeDeath: 69,
    deaths: 497,
    pphSr: 345,
    iloc: {
      ilocName: 'Mount Isa exc. Camooweal',
      personsCounted: 3939,
      heartDisease: 172,
      kidneyDisease: 64,
      diabetes: 313,
      medianAge: 31,
    },
  },
  {
    communityId: 'darwin',
    ilocGapReason: 'Urban multi-ILOC area: no single honest community mapping.',
    lgaCode: '71000',
    lgaName: 'Darwin',
    medianAgeDeath: 73,
    deaths: 1880,
    pphSr: 157,
  },
  {
    communityId: 'kununurra',
    lgaCode: '59340',
    lgaName: 'Wyndham-East Kimberley',
    medianAgeDeath: 61,
    deaths: 204,
    pphSr: 523,
    iloc: {
      ilocName: 'Kununurra exc. Town Camps',
      personsCounted: 1149,
      heartDisease: 37,
      kidneyDisease: 19,
      diabetes: 70,
      medianAge: 33,
    },
  },
];

export const COMMUNITY_HEALTH_GAPS: readonly CommunityHealthGap[] = [
  { communityId: 'canberra', reason: 'Outside the remote-community frame this measure describes.' },
];
