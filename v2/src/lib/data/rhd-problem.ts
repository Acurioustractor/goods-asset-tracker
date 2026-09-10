/**
 * RHD PROBLEM DATA — the measured problem Goods responds to, from AIHW.
 *
 * Every figure here is the PROBLEM or the RISK FACTOR. None of it is an outcome, and nothing in
 * this module may be joined to a bed count. The claim ceiling stands: scabies to rheumatic heart
 * disease is why the hardware exists, and Goods has never run a clinical study.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS THE STRONGEST PROBLEM DATA GOODS HAS
 * ---------------------------------------------------------------------------
 * AIHW names household overcrowding as the risk factor, and defines it using the **Canadian
 * National Occupancy Standard**. That is the same standard the ABS extract in
 * `community-need.ts` uses. So the overcrowding figures already in this codebase are not a proxy
 * for the risk factor; they are the risk-factor measure itself, community by community.
 *
 * AIHW also defines an acceptable house as one with "Working facilities for washing people" and
 * "Working facilities for washing clothes or bedding". That is the washing machine's justification
 * in the national standard's own words.
 *
 * ---------------------------------------------------------------------------
 * WHAT MAY AND MAY NOT BE SAID
 * ---------------------------------------------------------------------------
 * May: this is the disease burden, these are the rates, overcrowding is the named risk factor,
 * and a bed off the ground and a working washing machine act on that risk factor.
 *
 * May not: any claim that a Goods bed reduced ARF or RHD in any person or place; any figure that
 * multiplies beds by a health rate; any implication that a delivered bed is a prevented case.
 */

export interface SourcedFigure {
  /** The figure as AIHW states it. */
  value: string;
  /** What it counts, in plain words. */
  what: string;
  /** The period the figure covers. */
  asAt: string;
  sourceUrl: string;
}

const ARF_RHD = 'https://www.aihw.gov.au/reports/indigenous-australians/arf-rhd';
const FACTORS = `${ARF_RHD}/contents/introduction/socioeconomic-and-environmental-factors`;
const STATE = `${ARF_RHD}/contents/rhd/rhd-in-qld-wa`;

/** The claim ceiling, as a constant so no surface can soften it. */
export const RHD_CLAIM_CEILING =
  'These figures describe the disease and the risk factor. They are why a bed off the ground and ' +
  'a working washing machine are health hardware. Goods has never run a clinical study and never ' +
  'claims a bed prevented or interrupted a case. No figure here may be multiplied by a bed count.';

/** How many people are living with RHD, and who they are. */
export const RHD_BURDEN: readonly SourcedFigure[] = [
  {
    value: '7,510',
    what: 'people recorded as having rheumatic heart disease on the Queensland, Western Australia, South Australia and Northern Territory registers',
    asAt: 'as at 31 December 2024',
    sourceUrl: STATE,
  },
  {
    value: '78% (5,867)',
    what: 'of those on the registers are First Nations people',
    asAt: 'as at 31 December 2024',
    sourceUrl: STATE,
  },
  {
    value: '3,398.7 per 100,000',
    what: 'rheumatic heart disease prevalence among First Nations people in the Northern Territory',
    asAt: '2024',
    sourceUrl: STATE,
  },
  {
    value: '731.8 / 678.1 / 540.0 per 100,000',
    what: 'the same prevalence in Western Australia, Queensland and South Australia',
    asAt: '2024',
    sourceUrl: STATE,
  },
  {
    value: 'over 1,100 per 100,000',
    what: 'rheumatic heart disease prevalence in remote and very remote areas',
    asAt: '2024',
    sourceUrl: STATE,
  },
  {
    value: '28% (2,071)',
    what: 'of people on the registers are under 25 years old',
    asAt: 'as at 31 December 2024',
    sourceUrl: STATE,
  },
];

/** New acute rheumatic fever diagnoses. This is the part that says the problem is current. */
export const ARF_INCIDENCE: readonly SourcedFigure[] = [
  {
    value: '506 diagnoses in 501 people',
    what: 'new acute rheumatic fever diagnoses across New South Wales, Queensland, Western Australia, South Australia and the Northern Territory',
    asAt: '2024',
    sourceUrl: ARF_RHD,
  },
  {
    value: '93% (472)',
    what: 'of those diagnoses were in Aboriginal and Torres Strait Islander people, a rate of 51.8 per 100,000',
    asAt: '2024',
    sourceUrl: ARF_RHD,
  },
  {
    value: '211 diagnoses, 110.8 per 100,000',
    what: 'in children aged 5 to 14, the most affected age group',
    asAt: '2024',
    sourceUrl: ARF_RHD,
  },
  {
    value: '16.5 years',
    what: 'median age at diagnosis for First Nations people',
    asAt: '2024',
    sourceUrl: ARF_RHD,
  },
  {
    value: 'about 29%',
    what: 'of acute rheumatic fever diagnoses were recurrent cases',
    asAt: '2024',
    sourceUrl: ARF_RHD,
  },
];

/**
 * The risk factor, in AIHW's words, and the reason the ABS overcrowding figures in
 * `community-need.ts` are the same measure.
 */
export const CROWDING_RISK = {
  aihwOnCrowding: 'Household overcrowding is a risk factor that is associated strongly with Strep A.',
  cnosDefinition:
    'An overcrowded dwelling is defined here using the Canadian National Occupancy Standard (CNOS) ' +
    'as one that requires at least one additional bedroom to accommodate the people who usually ' +
    'live there, given their ages, sex and relationships to each other.',
  acceptableHouse: [
    'Working facilities for washing people',
    'Working facilities for washing clothes or bedding',
  ],
  sourceUrl: FACTORS,
  asAt: '2022–23',
} as const;

/** Overcrowding by region, from AIHW. The regions Goods works in are the worst in the country. */
export const CROWDING_BY_REGION: readonly { region: string; pct: number; note?: string }[] = [
  { region: 'Arnhem Land and Groote Eylandt', pct: 70, note: 'Maningrida sits here' },
  { region: 'Central Australia', pct: 49, note: 'Utopia and Alice Springs sit here' },
  { region: 'Kimberley', pct: 35, note: 'Kununurra sits here' },
  { region: 'Top End and Tiwi Islands', pct: 31 },
  { region: 'Northern Territory, all', pct: 44 },
  { region: 'Australia, all First Nations people', pct: 15, note: 'about 1 in 6' },
];

export const CROWDING_BY_REGION_SOURCE = { url: FACTORS, asAt: '2022–23' } as const;

/** Every figure in this module, for a guard to walk. */
export function allFigures(): SourcedFigure[] {
  return [...RHD_BURDEN, ...ARF_INCIDENCE];
}
