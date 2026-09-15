/**
 * The story of Goods on Country, in the order the deck tells it. Nine chapters, each naming the
 * deck slides it feeds (S01 to S19 in the QBE deck master, Notion, 14 September 2026), so the
 * slides are cut from this page and not the other way round.
 *
 * Words: the deck master's "say it simply" lines and slide notes (Ben, 13 and 14 September 2026),
 * Ben's eight model lines (thoughts/shared/handoffs/goods-visual-model/current.md), and the
 * rulings in VISUAL-DECISION-RECORD-2026-09-14. A chapter is `draft` until Ben has read its words
 * on this page; `settled` means the words are already his from the deck master.
 *
 * Figures: only from @/lib/data/model-placemat (the raise) and products.ts. No other number is
 * printed here until it has been opened at its source.
 */

import { RAISE, SHEET, STATIONS, type StationId, aud } from '@/lib/data/model-placemat';
import { SUPPLY_FACTS } from '@/lib/data/supply-context';

export type ChapterId = 'crux' | 'problem' | 'method' | 'road' | 'make' | 'trade' | 'money' | 'evidence' | 'close' | 'questions';

export interface StoryPhoto {
  src: string;
  alt: string;
  place: string;
  /** starred: the Media Room starred set (number given). live: already on the public road pitch. */
  source: 'starred' | 'live';
  starred?: number;
}

export interface StoryChapter {
  id: ChapterId;
  number: number;
  /** Short, for the contents bar. */
  label: string;
  title: string;
  lines: readonly string[];
  slides: readonly string[];
  status: 'settled' | 'draft';
  /** What is still owed before the words can be called settled. */
  open?: string;
  photo?: StoryPhoto;
}

export const STORY_UPDATED = '2026-09-14';

export const CHAPTERS: readonly StoryChapter[] = [
  {
    id: 'crux',
    number: 1,
    label: 'The crux',
    title: 'Useful goods start community enterprise.',
    lines: [
      'Community sleeping on durable, fit-for-purpose beds, building the products, and earning inside community-run enterprises.',
      'The Harvest Plant makes the first stock. Community organisations trade it. Customers pay the community organisation. The money stays local. The community decides what comes next.',
    ],
    slides: ['S01'],
    status: 'settled',
    photo: {
      src: '/images/community/maningrida/men-over-finished-bed.jpg',
      alt: 'Men standing over a finished Stretch Bed at Gamardi, Maningrida',
      place: 'Gamardi, Maningrida',
      source: 'starred',
      starred: 35,
    },
  },
  {
    id: 'problem',
    number: 2,
    label: 'The problem',
    title: 'Remote communities import useful goods and export too much of the value.',
    lines: [
      'Distance, freight, early failure, difficult repair and waste left on Country.',
      'One broken supply system creates pressure across health, housing, waste and local work.',
    ],
    slides: ['S02', 'S03'],
    status: 'settled',
    photo: {
      src: '/images/community/kalgoorlie/mattress-dumped-jerry-can.jpg',
      alt: 'A failed mattress dumped on red dirt near Kalgoorlie',
      place: 'Ninga Mia, Kalgoorlie',
      source: 'live',
    },
  },
  {
    id: 'method',
    number: 3,
    label: 'How Goods works',
    title: 'Listen, make something useful, test it on Country, improve it and keep supporting it.',
    lines: ['Local decisions guide the work. Goods provides shared capability.'],
    slides: ['S04', 'S05'],
    status: 'draft',
    open: 'Audrey’s and Jeremy’s portraits are their official profile photographs, credited. Confirm they may print here.',
    photo: {
      src: '/images/media-pack/speed-queen-controls.jpg',
      alt: 'Elder Dianne Stokes at the controls of the washing machine she helped design',
      place: 'Tennant Creek',
      source: 'starred',
      starred: 52,
    },
  },
  {
    id: 'road',
    number: 4,
    label: 'The road',
    title: 'Each place changed the product and the way the work is done.',
    lines: [
      'The work has travelled across Country, while production currently sits at The Harvest Plant.',
      'Flat-packed parts can travel and become useful beds through local hands.',
      'A purchase moved through local hands, reached homes and created the next conversation.',
    ],
    slides: ['S06', 'S08', 'S10', 'S11'],
    status: 'settled',
    open: 'The Utopia bed quantity stays off the page until it is reconciled.',
  },
  {
    id: 'make',
    number: 5,
    label: 'What we make',
    title: 'Start with beds. Build the capability to make other useful products.',
    lines: ['Waste plastic becomes a durable bed through one compact, teachable production line.'],
    slides: ['S07', 'S09'],
    status: 'settled',
    photo: {
      src: '/images/process/factory-panorama.jpg',
      alt: 'The Goods on Country production facility at The Harvest Plant',
      place: 'The Harvest Plant',
      source: 'starred',
      starred: 61,
    },
  },
  {
    id: 'trade',
    number: 6,
    label: 'The trade',
    title: SHEET.title,
    lines: [SHEET.subtitle],
    slides: ['S12', 'S13'],
    status: 'draft',
    open: 'The eight lines await Ben’s markup. The centre title is unconfirmed.',
  },
  {
    id: 'money',
    number: 7,
    label: 'The money',
    title: 'Keep each dollar in its own lane.',
    lines: [
      'First stock funds the beds and their facilitation together. QBE funds proposed facilities. Buyer receipts stay with the community organisation.',
      'Give each source one job and state its real status.',
    ],
    slides: ['S15', 'S16', 'S18'],
    status: 'settled',
  },
  {
    id: 'evidence',
    number: 8,
    label: 'What we will measure',
    title: 'What we will measure.',
    lines: ['Track enterprise, paid work, recycling, and health and daily life.', 'Agree, cost, confirm, establish, test, review and decide.'],
    slides: ['S14', 'S17'],
    status: 'settled',
  },
  {
    id: 'close',
    number: 9,
    label: 'The close',
    title: 'The next community starts smarter because the learning travels.',
    lines: ['Help make the next beds, and build the plant that makes the ones after.'],
    slides: ['S19'],
    status: 'settled',
    photo: {
      src: '/images/media-pack/lying-on-stretch-bed.jpg',
      alt: 'Lying on a Stretch Bed',
      place: 'On Country',
      source: 'starred',
      starred: 48,
    },
  },
  {
    id: 'questions',
    number: 10,
    label: 'The questions',
    title: 'What we get asked, and what we say.',
    lines: ['The questions every room asks, with our answers as they stand on 14 September. Open means we do not yet have an answer we would say out loud.'],
    slides: [],
    status: 'draft',
    open: 'Answers rewritten to the September rulings. Ben reads them aloud before they ship.',
  },
];

export function chapter(id: ChapterId): StoryChapter {
  const found = CHAPTERS.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown chapter: ${id}`);
  return found;
}

// ---------------------------------------------------------------------------
// The problem, four figures (deck slide S03). Context only: none is an outcome of Goods' work.
// Health and waste are read from supply-context.ts (verified 24 August 2026). Enterprise and
// employment come from thoughts/shared/research/2026-08-26-slide-02-four-problem-evidence.md,
// primary sources opened 26 August 2026; the finance branch holds them as employment-problem.ts
// and rhd-problem.ts, which this file should import once that branch lands.

export interface ProblemFigure {
  id: 'health' | 'enterprise' | 'employment' | 'waste';
  area: string;
  value: string;
  what: string;
  /** The line under the figure that keeps it honest. */
  note?: string;
  source: string;
  sourceUrl: string;
  asAt: string;
  grade: 'verified';
}

function supplyFact(id: string) {
  const fact = SUPPLY_FACTS.find((f) => f.id === id);
  if (!fact) throw new Error(`supply-context has no fact ${id}`);
  return fact;
}

const overcrowding = supplyFact('nt-overcrowding-very-remote');
const landfill = supplyFact('nt-waste-to-landfill');

export const PROBLEM_FIGURES: readonly ProblemFigure[] = [
  {
    id: 'health',
    area: 'Health',
    value: '51.3%',
    what: 'of First Nations households in very remote NT needed at least one more bedroom.',
    note: 'The NT also carries Australia’s highest recorded ARF and RHD prevalence. Crowding is the reason for the work. We claim no outcome from it.',
    source: overcrowding.source,
    sourceUrl: overcrowding.sourceUrl,
    asAt: overcrowding.asAt,
    grade: 'verified',
  },
  {
    id: 'enterprise',
    area: 'Enterprise',
    value: '3.1%',
    what: 'of employed First Nations people in the NT managed their own business, the lowest share of any state or territory.',
    note: 'A proxy for how little enterprise is locally owned. Official data does not isolate community-led production.',
    source: 'ABS, Aboriginal and Torres Strait Islander people who managed their own business, 2021 Census',
    sourceUrl: 'https://www.abs.gov.au/articles/aboriginal-and-torres-strait-islander-people-who-managed-their-own-business-2021',
    asAt: '2021-08-10',
    grade: 'verified',
  },
  {
    id: 'employment',
    area: 'Employment',
    value: '38%',
    what: 'of First Nations people aged 15 to 64 in very remote Australia were employed, against 68% in major cities.',
    note: 'Whole numbers, as the publisher prints them. The 2021 Census, a different instrument, returns a lower very-remote rate.',
    source: 'AIHW, Employment of First Nations people, from the ABS National Aboriginal and Torres Strait Islander Health Survey 2022 to 2023',
    sourceUrl: 'https://www.aihw.gov.au/reports/australias-welfare/indigenous-employment',
    asAt: '2023-06-30',
    grade: 'verified',
  },
  {
    id: 'waste',
    area: 'Waste',
    value: '275,190 tonnes',
    what: 'of NT waste went to landfill in the year to June 2024, more than half of everything processed.',
    source: landfill.source,
    sourceUrl: landfill.sourceUrl,
    asAt: landfill.asAt,
    grade: 'verified',
  },
];

// ---------------------------------------------------------------------------
// The trade, one step at a time. Ben's eight lines, each revealing its station on the loop.

export interface ModelStep {
  id: string;
  title: string;
  line?: string;
  /** Stations that come into view at this step (cumulative down the list). */
  reveal: readonly StationId[];
  /** Stations ringed while this step is active. */
  focus: readonly StationId[];
}

export const MODEL_STEPS: readonly ModelStep[] = [
  { id: 'make', title: `${STATIONS.harvest.title} ${STATIONS.harvest.line}`, reveal: ['harvest'], focus: ['harvest'] },
  {
    id: 'orgs',
    title: 'Four community organisations get 100 beds each.',
    line: 'The beds are theirs to sell.',
    reveal: ['orgs'],
    focus: ['orgs'],
  },
  {
    id: 'sell',
    title: 'They sell to the places that buy beds for people.',
    line: 'Health services, schools, housing providers.',
    reveal: ['buyers'],
    focus: ['buyers'],
  },
  {
    id: 'pay',
    title: 'The buyer pays the community organisation.',
    line: 'The money stays in community.',
    reveal: ['money'],
    focus: ['money'],
  },
  {
    id: 'decide',
    title: 'After costs, the community decides what the money does.',
    line: 'More beds, paid local work, or making their own.',
    reveal: ['decide'],
    focus: ['decide'],
  },
  {
    id: 'facility',
    title: 'Where a community is ready, a production facility comes to them.',
    line: 'Palm Island and Maningrida first.',
    reveal: ['facility'],
    focus: ['facility'],
  },
  {
    id: 'next',
    title: 'Then the next thing they choose to make.',
    line: 'Washing machines are already being tested. A Curious Tractor does the R&D.',
    reveal: ['next', 'act'],
    focus: ['next'],
  },
  {
    id: 'raise',
    title: 'The raise pays for the start.',
    line: `QBE ${aud(RAISE.qbeAud)} for the two facilities. ${aud(RAISE.bedsShownAud)} for the first ${RAISE.bedsYearOne} beds, from three grants each buying 133 beds at $750 with the work around them and the freight inside the price. A loan of ${aud(RAISE.loanAud)} for the first-year running cost, repaid from the beds Goods on Country sells. ${aud(RAISE.totalShownAud)} asked in total. Nothing is signed yet.`,
    reveal: [],
    focus: [],
  },
];

// ---------------------------------------------------------------------------
// The making, four steps in one line (deck slide S09).

export interface MakeStep {
  id: string;
  title: string;
  photo: StoryPhoto;
}

export const MAKE_STEPS: readonly MakeStep[] = [
  { id: 'shred', title: 'Sort and shred', photo: { src: '/images/process/shredder-granulator.jpg', alt: 'The shredder and granulator', place: 'The Harvest Plant', source: 'live' } },
  { id: 'press', title: 'Heat, press and cool', photo: { src: '/images/process/heat-press-full.jpg', alt: 'The heat press', place: 'The Harvest Plant', source: 'live' } },
  { id: 'cut', title: 'CNC cut and finish', photo: { src: '/images/process/cnc-cutting-closeup.jpg', alt: 'The CNC router cutting an X-leg from a pressed sheet', place: 'The Harvest Plant', source: 'live' } },
  { id: 'assemble', title: 'Assemble, test and pack', photo: { src: '/images/pitch/bed-assembled.jpg', alt: 'A Stretch Bed assembled', place: 'The Harvest Plant', source: 'starred', starred: 53 } },
];

// ---------------------------------------------------------------------------
// The money, four lanes (deck slide S15) and the request (S18).

export const MONEY_LANES = [
  { id: 'first-stock', title: 'First stock and support', line: 'Pays for the first beds, with facilitation and support for the workshopping in community, together.' },
  { id: 'qbe', title: 'QBE', line: 'Funds the two proposed facilities.' },
  { id: 'receipts', title: 'Buyer receipts', line: 'Stay with the community organisation after local costs.' },
] as const;

export const REQUEST = {
  headline: `${aud(RAISE.qbeAud)} for two proposed production facilities.`,
  note: `${aud(RAISE.qbeAud / RAISE.facilities)} per site is a planning allowance and no site has been quoted. Sites, costs and agreements remain to settle. First stock and its facilitation are funded together, as one line.`,
} as const;

// ---------------------------------------------------------------------------
// The gates (deck slide S17). Decision gates. No dates.

export const GATES = [
  'Agree responsibilities',
  'Cost and approve',
  'Confirm stock, buyers and allocations',
  'Establish, test and learn',
  'Review and decide the next step',
] as const;
