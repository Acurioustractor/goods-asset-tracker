/**
 * What a community production facility is made of, module by module, with the low and high price of
 * each and where the price comes from. Taken from the QBE Stage 2 answer at Q6 (Notion row, 15
 * September 2026) and the finance model (the-year-and-the-raise.ts PLANT_MODULES_LOW_AUD and
 * PLANT_MODULES_HIGH_AUD on the finance branch). The $150,000 a facility is a planning allowance set
 * above the high total; no site has been quoted. facility-modules.guards.test.ts holds the sums.
 */

export interface FacilityModule {
  name: string;
  lowAud: number;
  highAud: number;
  priceSource: string;
}

export const FACILITY_MODULES: readonly FacilityModule[] = [
  { name: 'Site base: 40ft and 20ft containers, genset, crane, electrical, ventilation, pad, PPE', lowAud: 31_800, highAud: 64_000, priceSource: 'Modelled. Crane and containers quoted.' },
  { name: 'Collection and sorting', lowAud: 5_000, highAud: 19_500, priceSource: 'Estimated' },
  { name: 'Shredding', lowAud: 19_800, highAud: 19_800, priceSource: 'Telford Smith quote' },
  { name: 'Pressing, CNC and finishing', lowAud: 32_780, highAud: 32_780, priceSource: 'Circularity Group INV-0054, paid 17 December 2025 for our own facility' },
  { name: 'Assembly and workshop', lowAud: 6_387, highAud: 6_387, priceSource: 'Carbatec' },
];

export const MODULES_LOW_AUD = FACILITY_MODULES.reduce((n, m) => n + m.lowAud, 0);
export const MODULES_HIGH_AUD = FACILITY_MODULES.reduce((n, m) => n + m.highAud, 0);
export const FACILITY_ALLOWANCE_AUD = 150_000;

/** From money to first bed, and output, from the QBE Q6 answer. Modelled. */
export const FACILITY_OUTPUT = {
  monthsToFirstBed: 3,
  bedsFirstYear: 200,
  bedsAtPace: 720,
  hoursPerBed: 2,
} as const;

/** The four questions asked at each site at month six, each a yes or a no (QBE Q6). */
export const MONTH_SIX_QUESTIONS = [
  'Who holds the keys?',
  'Who runs the payroll?',
  'Who invoices the buyer?',
  'Is at least half the production local?',
] as const;
