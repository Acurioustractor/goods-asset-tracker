/**
 * RECYCLING PROBLEM DATA — what happens to plastic in Australia, and what happens to it in the
 * places Goods works.
 *
 * Same discipline as `rhd-problem.ts`. Every figure carries what it counts, the period, the source
 * and a grade. Nothing here is an outcome and nothing may be multiplied by a bed count.
 *
 * ---------------------------------------------------------------------------
 * THE LINE THAT MATTERS IS NOT THE NATIONAL RATE
 * ---------------------------------------------------------------------------
 * Australia recovers 14% of the plastic leaving use, so about 87% goes straight to landfill. That
 * is the national number and it is not the number for a remote community.
 *
 * Kerbside collection in the Northern Territory reaches Darwin, Palmerston, Alice Springs,
 * Katherine, Tennant Creek and Nhulunbuy. Remote Indigenous communities are outside it. So in the
 * places Goods works the recovery rate is not 14%, and the honest thing to say is that no service
 * exists rather than to quote a number nobody has measured.
 *
 * That is the gap a plant on Country closes, and it is why the recycling story is about
 * infrastructure and freight rather than about behaviour.
 */

export type FigureGrade =
  /** Read from the primary source. */
  | 'verified'
  /** Reported consistently by secondary sources; the primary was not opened. */
  | 'unverified';

export interface RecyclingFigure {
  value: string;
  what: string;
  asAt: string;
  sourceUrl: string;
  grade: FigureGrade;
  note?: string;
}

const APFF = 'https://www.dcceew.gov.au/environment/protection/waste/plastics-and-packaging/australian-plastic-flows-fates-reporting';
const APRS_2017 = 'https://www.dcceew.gov.au/sites/default/files/documents/australian-plastics-recycling-survey-report-2017-18.pdf';
const NEPC_REMOTE = 'https://www.nepc.gov.au/sites/default/files/2022-09/regional-remote-case-studies.pdf';

/** The claim ceiling for this area, as a constant. */
export const RECYCLING_CLAIM_CEILING =
  'These figures describe what happens to plastic nationally and what services exist in remote ' +
  'communities. Goods diverts a design mass of HDPE per bed, which is modelled and has never been ' +
  'weighed as landfill diversion. No national figure here may be multiplied by a bed count, and ' +
  'no recovery rate here describes a Goods community.';

export const NATIONAL_PLASTIC: readonly RecyclingFigure[] = [
  {
    value: '3.2 million tonnes',
    what: 'plastic reaching end of life in Australia',
    asAt: '2023–24',
    sourceUrl: APFF,
    grade: 'verified',
  },
  {
    value: '446 kilotonnes, a 14% recovery rate',
    what: 'plastic recovered, being 423 kt recycled and 23 kt sent to energy recovery',
    asAt: '2023–24',
    sourceUrl: APFF,
    grade: 'verified',
  },
  {
    value: 'about 87%',
    what: 'of plastic leaving the use stage goes directly to landfill',
    asAt: '2023–24',
    sourceUrl: APFF,
    grade: 'verified',
  },
  {
    value: '300 kt reprocessed here, 145 kt exported',
    what: 'where recovered plastic actually goes, being 67% domestic and 33% shipped offshore',
    asAt: '2023–24',
    sourceUrl: APFF,
    grade: 'verified',
  },
  {
    value: '15.0%',
    what: 'HDPE recycling rate, the polymer a Stretch Bed leg is pressed from, second only to PET',
    asAt: '2017–18',
    sourceUrl: APRS_2017,
    grade: 'verified',
    note:
      'The most recent HDPE-specific rate read from a primary source. Secondary summaries report ' +
      'about 20% for 2023–24; that figure is not used here until the primary is opened.',
  },
];

/**
 * What exists in the places Goods works. The absence is the finding, so it is recorded as an
 * absence rather than as a rate.
 */
export const REMOTE_SERVICE: readonly RecyclingFigure[] = [
  {
    value: 'Darwin, Palmerston, Alice Springs, Katherine, Tennant Creek and Nhulunbuy',
    what: 'the Northern Territory towns with kerbside collection. Remote Indigenous communities are outside it',
    asAt: 'NT Waste Management Strategy',
    sourceUrl: NEPC_REMOTE,
    grade: 'unverified',
    note: 'Reported consistently across the NT EPA strategy and the NEPC case studies. The NEPC PDF timed out on fetch and has not been read line by line.',
  },
  {
    value: 'five remote landfill sites across 50,000 km²',
    what: 'waste infrastructure in the West Arnhem region, with limited recycling options',
    asAt: '2024',
    sourceUrl: 'https://www.rdant.com.au/remote-community-recycling-hubs/',
    grade: 'verified',
    note: 'Maningrida is in West Arnhem.',
  },
];

/**
 * Why remote recycling does not happen, stated as the barrier rather than as a behaviour. Held as
 * prose because these are qualitative findings and inventing a number for them would be worse
 * than having none.
 */
export const REMOTE_BARRIERS: readonly string[] = [
  'Freight. Moving recyclables out costs more than the material is worth, so it stays.',
  'Scale. Small populations mean the fixed cost of a facility has too few tonnes to sit on.',
  'Service. Collection is sporadic or absent, so material never enters a stream at all.',
];

/** Every numeric figure, for a guard to walk. */
export function allRecyclingFigures(): RecyclingFigure[] {
  return [...NATIONAL_PLASTIC, ...REMOTE_SERVICE];
}

/** Figures that still need their primary source opened. */
export function needsPrimarySource(): RecyclingFigure[] {
  return allRecyclingFigures().filter((f) => f.grade === 'unverified');
}
