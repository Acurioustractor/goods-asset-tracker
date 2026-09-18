/**
 * ANNUAL REPORT, FY26 (1 July 2025 to 30 June 2026), public at /annual-report.
 *
 * Ben, 18 September 2026: "just call it annual report", built from the pitch material and the
 * records, with quotes and photos. A narrative report. The charity's audited FY26 statements
 * follow the October 2026 AGM and are added here then; until they are, the money section says
 * so and prints no unaudited figures. Funders are named in order of arrival with no
 * dollar figures, the same rule as /pitch. Quotes are looked up from curated-quotes.ts at
 * render, never copied, and every speaker is on the cleared-voices list.
 */
import { PAID_INVOICES } from './paid-trade';
import { PAID_WASHERS } from './pitch-chapters';
import { GRANTS_RECEIVED } from './grants-received';
import { CANONICAL_ASSETS } from './asset-canonical';

export const AR_YEAR = { label: 'FY26', from: '2025-07-01', to: '2026-06-30', span: '1 July 2025 to 30 June 2026' } as const;

const inYear = (iso: string) => iso >= AR_YEAR.from && iso <= AR_YEAR.to;

/** Beds invoiced inside the year, from the paid invoice record. */
export const AR_INVOICES = PAID_INVOICES.filter((i) => inYear(i.invoiceDate));
export const AR_BEDS_SOLD = AR_INVOICES.reduce((n, i) => n + i.beds, 0);
export const AR_BUYERS = [...new Set(AR_INVOICES.map((i) => i.buyer))];

/** Grants that began inside the year, plus the Snow Foundation, whose support ran through it. */
export const AR_FUNDERS = GRANTS_RECEIVED.filter((g) => g.since >= '2025-07' && g.since <= '2026-06' || g.funder === 'Snow Foundation')
  .sort((a, b) => a.since.localeCompare(b.since));

export const AR_NUMBERS = [
  { value: `${AR_BEDS_SOLD}`, line: `beds bought and paid for, by ${AR_BUYERS.length} organisations` },
  { value: `${PAID_WASHERS}`, line: 'washing machines paid for, in Tennant Creek and Maningrida' },
  { value: '40', line: 'beds pressed at our own facility and assembled in Maningrida' },
  { value: `${CANONICAL_ASSETS.bedsDeployed}`, line: `beds in homes across ${CANONICAL_ASSETS.communitiesServed} communities, all years, by 30 June` },
] as const;

export interface ArChapter { when: string; title: string; body: string; photo: string; alt: string; voice?: { name: string; place: string; portrait: string } }

export const AR_CHAPTERS: readonly ArChapter[] = [
  {
    when: 'July to November 2025',
    title: 'Utopia, 167 beds for the homelands',
    body: 'Centrecorp Foundation bought beds for the Utopia homelands in two orders. Oonchiumpa held the build, and young people in Alice Springs and Utopia made beds for Elders. It was the largest run we have done.',
    photo: '/images/community/alice-springs/stretch-bed-two-generations.jpg',
    alt: 'Two generations on a Stretch Bed, Central Australia',
    voice: { name: 'Fred Campbell', place: 'Alice Springs', portrait: '/images/people/fred-campbell.png' },
  },
  {
    when: 'July 2025 to March 2026',
    title: 'Palm Island, a youth pilot',
    body: 'With the Vincent Fairfax Family Foundation and FRRR, 25 beds, three community sessions and 30 young people on Palm Island. The pilot was acquitted in March 2026.',
    photo: '/images/community/palm-island/kids-new-mattress.jpg',
    alt: 'Children on a new bed, Palm Island',
    voice: { name: 'Daniel Patrick Noble', place: 'Palm Island', portrait: '/images/people/daniel-patrick-noble.jpg' },
  },
  {
    when: 'September to December 2025',
    title: 'A room that raised a facility',
    body: 'At Healthy People Healthy Planet, The Funding Network raised the money for our production facility in one room, with a Bupa match.',
    photo: '/images/brand/goods-20kg-plastic-one-bed.jpg',
    alt: 'The recycled plastic that goes into one Stretch Bed',
  },
  {
    when: 'May 2026',
    title: 'Maningrida, the first run off our own press',
    body: 'Forty beds pressed at our facility in Queensland and assembled at Gamardi by local young workers with Homeland School Company, which bought the beds and two washing machines. In Tennant Creek, Julalikari Council bought six washing machines.',
    photo: '/images/community/maningrida/gamardi-build-day-wide.jpg',
    alt: 'Build day at Gamardi, Maningrida',
  },
  {
    when: 'June 2026',
    title: 'An Aboriginal-led board',
    body: 'Kristy Bloomfield and Audrey Deemal joined the board, and the founders work for the charity as employees and do not sit on its board, so the board is independent of the people who run the work.',
    photo: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
    alt: 'The Oonchiumpa team with a Stretch Bed',
    voice: { name: 'Kristy Bloomfield', place: 'Mparntwe', portrait: '/images/people/kristy-bloomfield.jpg' },
  },
];

export const AR_MONEY = {
  headline: 'The money',
  body: 'Through FY26 the Goods on Country work traded through a founder\'s sole-trader books while the charity was readied to take it on. It moved into the charity in August 2026. Beds and washing machines were sold at a published price, and grants paid for the work around them: the visits, the design and the facility. The charity\'s FY26 financial statements are being audited for the AGM in October 2026 and will be published here when they are signed.',
} as const;

export const AR_SINCE = [
  'July to August 2026. The ALIVE National Centre at the University of Melbourne paid for 100 beds in full before one was made.',
  'August 2026. The work moved into the charity.',
  'September 2026. The production log opened, so paid hours and plastic weights become measured numbers.',
] as const;

export const AR_NOT_CLAIMED = [
  'No health outcome. Scabies and rheumatic heart disease are why the bed is washable and off the ground; the claim stops there.',
  'Community ownership of the making is a pathway, and it has not moved yet.',
  'Plastic per bed is a design figure of 20 kg until the production log weighs it.',
] as const;

export const AR_VOICE_NAMES = ['Fred Campbell', 'Daniel Patrick Noble', 'Dianne Stokes', 'Kristy Bloomfield', 'Gloria Turner', 'Jimmy Frank'] as const;
