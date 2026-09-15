/**
 * The Goods on Country model placemat: the words, the stations, the lines
 * between them and the four side panels. One source for the QBE placemat at
 * /admin/model and, later, deck slides 13 to 19 cut from the same views.
 *
 * Words: Ben's eight lines of 14 September 2026, re-cut on 15 September 2026 to
 * the customer voice: customers are people, businesses and service providers,
 * and they pay the community organisation directly.
 * Figures: Ben's 15 September rulings. Every grant except QBE buys 133 beds at
 * $750; a $150,000 SEFA loan inside the ask carries the first-year running
 * cost (evening ruling). The same figures live in
 * the-year-and-the-raise.ts on the finance branch; when it lands, pin RAISE and
 * BED to that module. Nothing is signed.
 *
 * Rules enforced by model-placemat.guards.test.ts: the maker is named, never
 * placed; customers by type, never by organisation; money never returns to Goods;
 * households are not a station; no health outcome; no em dashes; the only
 * drawing on the sheet is the kit container cut from the accepted plant
 * workflow; every photograph is from the Media Room starred set.
 */

import { PLASTIC_KG_PER_BED } from '@/lib/data/products';

export const PLACEMAT_READ_AT = '2026-09-14';

/** A3 landscape at 96 px per inch. The deck views are cut from this sheet. */
export const SHEET_W = 1588;
export const SHEET_H = 1123;

export const RAISE = {
  qbeAud: 300_000,
  qbeFor: 'Two community production facilities',
  /** Three grants, each 133 beds at $750: Tim Fairfax year one, Brian M. Davis, Snow. Ben, 15 September 2026. */
  bedsAud: 299_750,
  bedsFor: 'Paid by philanthropy. 400 beds, 100 to each of four community organisations, theirs to sell or give out.',
  /** SEFA's loan for the first-year running cost, inside the ask. Ben, 15 September 2026 (evening ruling). */
  loanAud: 150_000,
  loanFor: 'First-year running cost, repaid from beds sold.',
  totalAud: 749_750,
  /**
   * What the placemat prints. Ben, 15 September 2026: round the sheet to $300,000 of beds. The
   * applications keep the exact figures ($99,750 a grant, $749,750 in all); the sheet rounds by
   * $250 and the guard below holds it to that.
   */
  bedsShownAud: 300_000,
  totalShownAud: 750_000,
  signedAud: 0,
  facilities: 2,
  bedsYearOne: 400,
  communityOrganisations: 4,
  bedsEach: 100,
} as const;

/**
 * One bed, the price model (Ben, 9 September 2026: a price model, never cost-plus; 15 September:
 * $750 is the only price and nothing is added to it). The make cost is PROVISIONAL until the
 * bought leg-panel yield is confirmed. Goods absorbs freight and facilitation out of its share.
 * Same figures as the-year-and-the-raise.ts on the finance branch; pin them there when it lands.
 */
export const BED = {
  priceAud: 750,
  makeAud: 262,
  makeIsProvisional: true,
  freightAud: 100,
  facilitationAud: 100,
  /** What reaches Goods on Country from a $750 bed after making, freight and facilitation. */
  contributionAud: 750 - 262 - 100 - 100,
} as const;

export function aud(n: number): string {
  return `A$${n.toLocaleString('en-AU')}`;
}

/** The placemat prints plain dollars: `$599,750`. Ben, 15 September 2026: no A on the dollars. */
export function dollars(n: number): string {
  return `$${n.toLocaleString('en-AU')}`;
}

export function audRange(low: number, high: number): string {
  return `${aud(low)} to ${high.toLocaleString('en-AU')}`;
}

export type Family = 'making' | 'community' | 'buyer' | 'money' | 'proposed' | 'support';
export type StationId = 'harvest' | 'orgs' | 'buyers' | 'money' | 'decide' | 'facility' | 'next' | 'act';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type LineKind = 'goods' | 'money' | 'future' | 'support';

export interface Station {
  id: StationId;
  title: string;
  line: string;
  family: Family;
  /** Proposed stations draw dashed: not yet, and the community decides. */
  state: 'now' | 'proposed';
  /** The one drawing allowed on the sheet: the kit container, cut from the accepted plant workflow. */
  drawing?: { src: string; alt: string };
}

export interface Flow {
  from: StationId;
  to: StationId;
  kind: LineKind;
  label: string;
  fromSide: Side;
  toSide: Side;
  /** Position along the side, 0 to 1. Default 0.5. */
  fromAt?: number;
  toAt?: number;
  /** Control-point reach in px. Default is derived from the distance. */
  bend?: number;
  /** Where along the curve the label sits, 0 to 1. Default 0.5. */
  labelAt?: number;
  /** Nudge the label off the line, in px, and anchor it. Short vertical lines need the label beside them. */
  labelDx?: number;
  labelDy?: number;
  labelAnchor?: 'start' | 'middle' | 'end';
  /** Wrap the label to this many px. A label wider than the gap it sits in wraps to two lines. */
  labelWidth?: number;
}

export interface Panel {
  id: 'employment' | 'recycling' | 'enterprise' | 'health';
  title: string;
  line: string;
  photo: {
    src: string;
    alt: string;
    place: string;
    /** Number in the Media Room starred set (kit/media-room.json). */
    starred: number;
    /** True when Ben tagged it use:placemat. False means a starred photo not yet picked for this sheet. */
    placematPick: boolean;
  };
}

/** The two marks in the footer. URLs for the page; the download and the render script embed them. */
export const LOGOS = {
  goods: { src: '/brand/goods/logos/svg/goods-on-country-grounded-mono-ink.svg', alt: 'Goods on Country', w: 741, h: 350 },
  qbe: { src: '/images/partners/qbe-light-bg.svg', alt: 'QBE', w: 330, h: 91 },
} as const;

export const SHEET = {
  title: 'The Goods on Country model.',
  subtitle: 'Community sleeping on durable, fit-for-purpose beds, building the products, and earning inside community-run enterprises.',
  raiseHeading: `Asked ${dollars(RAISE.totalShownAud)}`,
  /** Ben, 15 September 2026: no note beside the heading and no footer line on the sheet. */
  raiseNote: '',
  centre: 'Made and sold in community',
  support: {
    title: 'Support inside the price of a bed',
    items: ['customer connections', 'contracts', 'logistics', 'training', 'product development'],
  },
  /** Ben, 15 September 2026: the QBE program name sits at the bottom, beside the two logos. */
  footer: 'QBE Catalysing Impact',
} as const;

export const STATIONS: Record<StationId, Station> = {
  harvest: {
    id: 'harvest',
    // Ben, 15 Sep: no place named for the main facility; others are added as they come.
    title: 'Goods on Country facility',
    line: 'makes the first 400 beds.',
    family: 'making',
    state: 'now',
    drawing: { src: '/images/model/harvest-container.svg', alt: 'One container: shred, press, assemble' },
  },
  orgs: {
    id: 'orgs',
    title: 'Four community organisations',
    line: '100 beds each. The beds are theirs to sell.',
    family: 'community',
    state: 'now',
  },
  buyers: {
    id: 'buyers',
    title: 'The customers',
    line: 'People, businesses and service providers: health services, schools, housing providers, families.',
    family: 'buyer',
    state: 'now',
  },
  money: {
    id: 'money',
    title: 'The money stays in community.',
    line: 'Customers pay the community organisation directly.',
    family: 'money',
    state: 'now',
  },
  decide: {
    id: 'decide',
    title: 'The community decides.',
    line: 'After costs: more beds, paid local work, or making their own.',
    family: 'community',
    state: 'now',
  },
  facility: {
    id: 'facility',
    title: 'Two community production facilities.',
    // The two QBE sites are Palm Island and Maningrida (Q6 and Q7 of the application). Ben has not
    // confirmed either community's agreement, so the sheet names no place until he does.
    line: 'QBE\'s $300,000 builds the first two, $150,000 each, where a community is ready and asks.',
    family: 'proposed',
    state: 'proposed',
  },
  next: {
    id: 'next',
    title: 'The next thing they choose to make.',
    line: 'Washing machines are already being tested.',
    family: 'proposed',
    state: 'proposed',
  },
  act: {
    id: 'act',
    title: 'A Curious Tractor',
    line: 'does the R&D.',
    family: 'support',
    state: 'now',
  },
};

export const FLOWS: Flow[] = [
  // Labels find their own clear spot (placemat-svg.ts placeLabel). labelWidth wraps a label that is
  // wider than the gap it sits in; labelAt moves it along the curve. No pixel nudges live here.
  { from: 'harvest', to: 'orgs', kind: 'goods', label: '400 beds, 100 each', fromSide: 'right', toSide: 'left', labelWidth: 70 },
  { from: 'orgs', to: 'buyers', kind: 'goods', label: 'beds sold', fromSide: 'bottom', toSide: 'top', fromAt: 0.25, toAt: 0.25 },
  { from: 'buyers', to: 'money', kind: 'money', label: 'payment', fromSide: 'bottom', toSide: 'top', fromAt: 0.75, toAt: 0.75 },
  { from: 'money', to: 'decide', kind: 'money', label: 'after costs', fromSide: 'bottom', toSide: 'right', fromAt: 0.35, bend: 70, labelAt: 0.55 },
  { from: 'decide', to: 'facility', kind: 'future', label: 'if the community chooses', fromSide: 'left', toSide: 'bottom', toAt: 0.6, bend: 70, labelAt: 0.45, labelWidth: 110 },
  { from: 'facility', to: 'buyers', kind: 'future', label: 'beds made locally, same customers', fromSide: 'right', toSide: 'left', fromAt: 0.5, toAt: 0.8, bend: 80, labelAt: 0.84, labelDy: -14, labelWidth: 110 },
  { from: 'facility', to: 'next', kind: 'future', label: 'then', fromSide: 'top', toSide: 'bottom', fromAt: 0.8, toAt: 0.8 },
  { from: 'act', to: 'next', kind: 'support', label: 'R&D', fromSide: 'top', toSide: 'bottom', fromAt: 0.5, toAt: 0.3 },
];

export const PANELS: Panel[] = [
  {
    id: 'employment',
    title: 'Employment',
    line: 'Paid local work, at the plant and in community.',
    photo: {
      // Ben, 15 Sep: a production facility picture on the Employment panel.
      src: '/images/build/build-041.jpg',
      alt: 'Katrina Bloomfield and the Oonchiumpa crew fitting Stretch Bed legs, Mparntwe',
      place: 'Mparntwe',
      starred: 42,
      placematPick: true,
    },
  },
  {
    id: 'recycling',
    title: 'Recycling',
    line: `${PLASTIC_KG_PER_BED} kilograms of recycled plastic in every bed.`,
    photo: {
      src: '/images/brand/goods-20kg-plastic-one-bed.jpg',
      alt: 'The recycled plastic that goes into one Stretch Bed, beside the bed',
      place: 'The Harvest Plant',
      starred: 21,
      placematPick: false,
    },
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    line: 'Sales, repeat customers, money kept in community.',
    photo: {
      src: '/images/community/maningrida/men-over-finished-bed.jpg',
      alt: 'Men standing over a finished Stretch Bed, Maningrida',
      place: 'Maningrida',
      starred: 35,
      placematPick: true,
    },
  },
  {
    id: 'health',
    title: 'Health',
    line: 'Beds in use, checked at six and twelve months.',
    photo: {
      src: '/images/model/sleeping-on-it-1e5a8385.jpg',
      alt: 'A young man lying on a Stretch Bed outside',
      place: 'Empathy Ledger',
      starred: 15,
      placematPick: true,
    },
  },
];

/** Every string printed on the sheet, for the guards and the tells gate. */
export function everyPrintedString(): string[] {
  const out: string[] = [
    SHEET.title,
    SHEET.subtitle,
    SHEET.raiseHeading,
    SHEET.raiseNote,
    SHEET.centre,
    SHEET.support.title,
    ...SHEET.support.items,
    SHEET.footer,
    RAISE.qbeFor,
    RAISE.bedsFor,
  ];
  for (const s of Object.values(STATIONS)) out.push(s.title, s.line);
  // Empty strings are lines Ben removed; nothing prints for them.
  for (const f of FLOWS) out.push(f.label);
  for (const p of PANELS) out.push(p.title, p.line, p.photo.alt);
  return out.filter((x) => x.length > 0);
}
