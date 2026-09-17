/**
 * THE SETTING: how many remote places there are, and how many people live in them.
 *
 * Ben, 18 September 2026: under the members model, the number of remote communities we have
 * already counted, which gives a total number of places and then a total population. It sizes
 * the setting the ten-year model reaches into. It is printed beside what is served today so the
 * distance is visible.
 *
 * TWO SOURCES, KEPT APART.
 *
 * The places are OUR count: the `goods_communities` table in the shared ACT project
 * (`tednluwflfhxyucgwigh`), built from the Australian Government Indigenous Locations gazetteer
 * (AGIL) with Bushtel for the Northern Territory and postcode geography, 1,543 rows, queried
 * 18 September 2026. Rows are filtered to the ABS remoteness classes Remote Australia and Very
 * Remote Australia and grouped by the table's own `community_type`.
 *
 * The people are the ABS: estimated resident population of Aboriginal and Torres Strait
 * Islander Australians at 30 June 2021, by remoteness area. The estimate corrects the Census
 * undercount, which is largest in remote Australia; the raw Census count is carried beside it so
 * nobody has to wonder which series a figure is from.
 *
 * WHAT THIS MODULE REFUSES TO DO. The table has an `estimated_population` column and it is 150
 * for 988 of the 1,434 very remote rows: a placeholder, never a measurement, so it is never
 * summed here. The same table carries `demand_beds`, `demand_washers` and `demand_fridges`
 * computed as households times 1.2, the derivation Ben withdrew on 15 September 2026 and that a
 * guard already fails the build on. Nothing in this module derives a bed, a machine or an order
 * from a population, and the guard test checks that no export is named like one.
 *
 * This measures the PLACE. It is never presented as demand, coverage or impact.
 */

export const QUERIED_AT = '2026-09-18';

export interface PlaceCount {
  /** The table's `community_type`, in plain words. */
  kind: 'communities' | 'outstations' | 'town camps' | 'other';
  count: number;
}

export interface StateCount {
  state: 'NT' | 'WA' | 'QLD' | 'SA' | 'NSW';
  name: string;
  places: number;
}

export const REMOTE_PLACES = {
  source:
    'goods_communities in the shared ACT Supabase project, from the Australian Government Indigenous Locations gazetteer with Bushtel and postcode geography; rows in ABS remoteness classes Remote Australia and Very Remote Australia; queried 18 September 2026.',
  total: 1452,
  byKind: [
    { kind: 'communities', count: 874 },
    { kind: 'outstations', count: 542 },
    { kind: 'town camps', count: 34 },
    /** One village and one town in the remote classes. */
    { kind: 'other', count: 2 },
  ] as readonly PlaceCount[],
  byState: [
    { state: 'NT', name: 'Northern Territory', places: 790 },
    { state: 'WA', name: 'Western Australia', places: 338 },
    { state: 'QLD', name: 'Queensland', places: 181 },
    { state: 'SA', name: 'South Australia', places: 138 },
    { state: 'NSW', name: 'New South Wales', places: 5 },
  ] as readonly StateCount[],
  /** The Northern Territory's own list, `nt_communities`, marks 72 places as official remote communities. */
  ntOfficialRemoteCommunities: 72,
} as const;

export const REMOTE_PEOPLE = {
  /** ABS estimated resident population, Aboriginal and Torres Strait Islander Australians, 30 June 2021. */
  estimate: {
    source: 'ABS, Estimates of Aboriginal and Torres Strait Islander Australians, 30 June 2021, by remoteness area.',
    url: 'https://www.abs.gov.au/statistics/people/aboriginal-and-torres-strait-islander-peoples/estimates-aboriginal-and-torres-strait-islander-australians/latest-release',
    asAt: '2021-06-30',
    australia: 983_700,
    remote: 58_700,
    veryRemote: 92_100,
    remoteAndVeryRemote: 58_700 + 92_100,
    remoteAndVeryRemotePct: 6.0 + 9.4,
  },
  /** The raw 2021 Census count, before the undercount adjustment. Carried so the two series are never confused. */
  census: {
    source: 'ABS, Census of Population and Housing: Counts of Aboriginal and Torres Strait Islander Australians, 2021, by remoteness area.',
    url: 'https://www.abs.gov.au/statistics/people/aboriginal-and-torres-strait-islander-peoples/census-population-and-housing-counts-aboriginal-and-torres-strait-islander-australians/latest-release',
    asAt: '2021-08-10',
    australia: 812_728,
    remote: 44_072,
    veryRemote: 74_135,
    remoteAndVeryRemote: 44_072 + 74_135,
  },
} as const;

export const SETTING_MEASURES_THE_PLACE =
  'These figures measure the place. Nothing here is an order, and no bed number is made from a population.';

/** Every string the page prints, for the tells gate and the guards. */
export function everyPrintedString(): string[] {
  return [REMOTE_PLACES.source, REMOTE_PEOPLE.estimate.source, REMOTE_PEOPLE.census.source, SETTING_MEASURES_THE_PLACE];
}
