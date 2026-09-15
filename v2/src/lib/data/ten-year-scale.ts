/**
 * Ten years, if two community facilities open every year.
 *
 * Ben, 15 September 2026: "think about a 10 year model across these areas: what might happen
 * with two more facilities across Australia each year, and how that scales employment hours,
 * kgs of recycling, enterprises". This module is that thought, typed, with every assumption
 * named once and labelled. It is a scale study, not a forecast: see CLAIM_CEILING.
 *
 * Constants that already live in the finance worktree are quoted with their file so the two
 * do not drift. When that branch lands, import them instead of restating them.
 */

import { BED, RAISE } from './model-placemat';
import { PLASTIC_KG_PER_BED } from './products';

export type Basis = 'verified' | 'modelled' | 'target' | 'assumption';

export interface Assumption {
  key: string;
  value: number;
  unit: string;
  basis: Basis;
  /** One line an assessor could check. */
  source: string;
}

export const YEARS = 10;
export const FIRST_YEAR_LABEL = 'FY27';

export const ASSUMPTIONS = {
  facilitiesYearOne: {
    key: 'facilitiesYearOne',
    value: 2,
    unit: 'facilities',
    basis: 'target',
    source: 'QBE Stage 2 ask: two community production facilities at $150,000 each (RAISE.qbeAud).',
  },
  facilitiesAddedAYear: {
    key: 'facilitiesAddedAYear',
    value: 2,
    unit: 'facilities a year from year 2',
    basis: 'assumption',
    source: 'Ben, 15 September 2026: "two more facilities across Australia each year". Nobody has funded or sited them.',
  },
  facilityFirstYearBeds: {
    key: 'facilityFirstYearBeds',
    value: 200,
    unit: 'beds in a facility\'s first year',
    basis: 'modelled',
    source: 'goods-finance-wt v2/src/lib/data/three-year-plan.ts PLANT_FIRST_YEAR_BEDS = 200.',
  },
  facilityMatureBeds: {
    key: 'facilityMatureBeds',
    value: 720,
    unit: 'beds a year from a facility\'s second year',
    basis: 'modelled',
    source: 'goods-finance-wt v2/src/lib/data/three-year-plan.ts PLANT_MATURE_BEDS = 720.',
  },
  mainFacilityYearOneBeds: {
    key: 'mainFacilityYearOneBeds',
    value: RAISE.bedsYearOne,
    unit: 'beds of first stock in year one',
    basis: 'target',
    source: 'the-year-and-the-raise.ts BEDS_YEAR_ONE = 400; RAISE.bedsYearOne on the placemat.',
  },
  mainFacilityBedsAYear: {
    key: 'mainFacilityBedsAYear',
    value: 874,
    unit: 'beds a year from the main facility, year two on',
    basis: 'modelled',
    source: 'three-year-plan.ts BREAK_EVEN_BEDS = 874: running cost $251,224 over $288 a bed. Held here as the main facility\'s steady output.',
  },
  mainFacilityCapacity: {
    key: 'mainFacilityCapacity',
    value: 1152,
    unit: 'beds a year the main facility can make',
    basis: 'modelled',
    source: 'three-year-plan.ts WITTA_BEDS_A_YEAR = 1,152 (six kits a day, sixteen run days a month).',
  },
  hoursPerBed: {
    key: 'hoursPerBed',
    value: 2,
    unit: 'paid hours of making a bed',
    basis: 'modelled',
    source: 'QBE Q10 and Q11: "two hours of paid making a bed" is modelled from the build; the production log has no entries yet.',
  },
  kgPerBed: {
    key: 'kgPerBed',
    value: PLASTIC_KG_PER_BED,
    unit: 'kg of recycled HDPE in a bed',
    basis: 'modelled',
    source: 'products.ts PLASTIC_KG_PER_BED = 20, design mass. Neither side of the yield has been weighed.',
  },
  bedPriceAud: {
    key: 'bedPriceAud',
    value: BED.priceAud,
    unit: 'AUD a bed',
    basis: 'verified',
    source: 'model-placemat.ts BED.priceAud = 750. Ben, 15 September 2026: the only price.',
  },
  contributionAud: {
    key: 'contributionAud',
    value: BED.contributionAud,
    unit: 'AUD to Goods on Country from a main-facility bed',
    basis: 'modelled',
    source: 'model-placemat.ts BED.contributionAud = 750 - 262 - 100 - 100 = 288. Provisional while the make cost is.',
  },
  organisationsYearOne: {
    key: 'organisationsYearOne',
    value: RAISE.communityOrganisations,
    unit: 'community organisations trading from year one',
    basis: 'target',
    source: 'RAISE.communityOrganisations = 4, 100 beds each. Community enterprises trading today: 0.',
  },
} as const satisfies Record<string, Assumption>;

export interface YearRow {
  year: number;
  label: string;
  facilitiesOpen: number;
  facilitiesMature: number;
  bedsMain: number;
  bedsCommunity: number;
  bedsTotal: number;
  paidHours: number;
  kgRecycled: number;
  tonnesRecycled: number;
  enterprisesTrading: number;
  /** If every community-made bed is sold at $750, what stays in community. */
  localCapitalAud: number;
  /** What main-facility beds hand Goods on Country at $288 each. */
  contributionToGoodsAud: number;
}

const A = ASSUMPTIONS;

/** A what-if: any assumption's value replaced for one call. The deck prints the defaults. */
export type AssumptionOverrides = Partial<Record<keyof typeof ASSUMPTIONS, number>>;

function v(key: keyof typeof ASSUMPTIONS, over?: AssumptionOverrides): number {
  return over?.[key] ?? A[key].value;
}

export function facilitiesOpenInYear(year: number, over?: AssumptionOverrides): number {
  return v('facilitiesYearOne', over) + v('facilitiesAddedAYear', over) * (year - 1);
}

export function yearLabel(year: number): string {
  const fy = 27 + (year - 1);
  return `FY${fy}`;
}

export function tenYearRows(over?: AssumptionOverrides): YearRow[] {
  const rows: YearRow[] = [];
  for (let year = 1; year <= YEARS; year += 1) {
    const facilitiesOpen = facilitiesOpenInYear(year, over);
    const facilitiesNew = year === 1 ? v('facilitiesYearOne', over) : v('facilitiesAddedAYear', over);
    const facilitiesMature = facilitiesOpen - facilitiesNew;
    const bedsCommunity = facilitiesNew * v('facilityFirstYearBeds', over) + facilitiesMature * v('facilityMatureBeds', over);
    const bedsMain = year === 1 ? v('mainFacilityYearOneBeds', over) : Math.min(v('mainFacilityBedsAYear', over), v('mainFacilityCapacity', over));
    const bedsTotal = bedsMain + bedsCommunity;
    const kgRecycled = bedsTotal * v('kgPerBed', over);
    rows.push({
      year,
      label: yearLabel(year),
      facilitiesOpen,
      facilitiesMature,
      bedsMain,
      bedsCommunity,
      bedsTotal,
      paidHours: bedsTotal * v('hoursPerBed', over),
      kgRecycled,
      tonnesRecycled: kgRecycled / 1000,
      enterprisesTrading: v('organisationsYearOne', over) + facilitiesOpen,
      localCapitalAud: bedsCommunity * v('bedPriceAud', over),
      contributionToGoodsAud: bedsMain * v('contributionAud', over),
    });
  }
  return rows;
}

export interface TenYearTotals {
  facilitiesOpen: number;
  bedsMain: number;
  bedsCommunity: number;
  bedsTotal: number;
  paidHours: number;
  kgRecycled: number;
  tonnesRecycled: number;
  enterprisesTrading: number;
  localCapitalAud: number;
  contributionToGoodsAud: number;
}

export function tenYearTotals(over?: AssumptionOverrides): TenYearTotals {
  const rows = tenYearRows(over);
  const sum = (k: keyof YearRow) => rows.reduce((n, r) => n + (r[k] as number), 0);
  const last = rows[rows.length - 1];
  return {
    facilitiesOpen: last.facilitiesOpen,
    bedsMain: sum('bedsMain'),
    bedsCommunity: sum('bedsCommunity'),
    bedsTotal: sum('bedsTotal'),
    paidHours: sum('paidHours'),
    kgRecycled: sum('kgRecycled'),
    tonnesRecycled: sum('kgRecycled') / 1000,
    enterprisesTrading: last.enterprisesTrading,
    localCapitalAud: sum('localCapitalAud'),
    contributionToGoodsAud: sum('contributionToGoodsAud'),
  };
}

export const CLAIM_CEILING =
  'These are targets inside modelled capacity. They are not forecasts. No buyer has ordered beyond year one, no facility beyond the first two has a site or a funder, and the two-a-year pace is a working assumption from Ben on 15 September 2026. Hours a bed and kilograms a bed are modelled and have not yet been measured on a production run. The running cost of the organisation is not modelled here. Every community-made bed is assumed sold at $750 for the local capital line; the community organisation decides what it sells and what it gives out.';

/** Every string the page prints, for the tells gate and the guards. */
export function everyPrintedString(): string[] {
  return [CLAIM_CEILING, ...Object.values(ASSUMPTIONS).map((a) => a.source)];
}
