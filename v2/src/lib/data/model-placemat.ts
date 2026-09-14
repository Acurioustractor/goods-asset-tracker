/**
 * The Goods on Country model placemat: the words, the stations, the lines
 * between them and the four side panels. One source for the QBE placemat at
 * /admin/model and, later, deck slides 13 to 19 cut from the same views.
 *
 * Words: Ben's eight lines of 14 September 2026
 * (thoughts/shared/handoffs/goods-visual-model/current.md), awaiting his markup.
 * Figures: the raise as ruled in VISUAL-DECISION-RECORD-2026-09-14 item 6. The
 * same figures live in the-year-and-the-raise.ts on the finance branch
 * (feat/ai-tells-gate-and-goods-model), which is not on main yet; when it
 * lands, the guards test should pin RAISE to that module. Nothing is signed.
 *
 * Rules enforced by model-placemat.guards.test.ts: The Harvest Plant, never
 * Witta; buyers by type, never by organisation; money never returns to Goods;
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
  otherLowAud: 200_000,
  otherHighAud: 300_000,
  otherFor: 'The first 400 beds. Every bed comes with facilitation and support for the workshopping in community.',
  totalLowAud: 500_000,
  totalHighAud: 600_000,
  signedAud: 0,
  facilities: 2,
  bedsYearOne: 400,
  communityOrganisations: 4,
  bedsEach: 100,
} as const;

/**
 * One bed, the price model (Ben, 9 September 2026: a price model, never cost-plus). The make cost
 * is PROVISIONAL on the flat-pack route until the bought leg-panel yield is confirmed. Freight is
 * shown beside the bed and left out of the make cost. Same figures as the-year-and-the-raise.ts
 * on the finance branch; pin them there when it lands.
 */
export const BED = {
  priceAud: 750,
  makeAud: 276,
  makeIsProvisional: true,
  freightAud: 150,
  /** What stays with the community organisation on a bed sold at list, freight paid by the buyer. */
  staysAud: 750 - 276,
} as const;

export function aud(n: number): string {
  return `A$${n.toLocaleString('en-AU')}`;
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

export const SHEET = {
  title: 'How the trade works',
  subtitle: 'Beds start it. The money stays in community. The community decides what comes next.',
  raiseHeading: `Proposed total raise ${audRange(RAISE.totalLowAud, RAISE.totalHighAud)}`,
  raiseNote: 'nothing signed yet',
  centre: 'Community-owned trade',
  support: {
    title: 'Shared support around the trade',
    items: ['buyer connections', 'contracts', 'logistics', 'training', 'product development'],
  },
  footer: 'Goods on Country · proposed model, nothing signed · figures from canon.ts and DECISIONS.md AC and AD · dashed means not yet, and the community decides',
} as const;

export const STATIONS: Record<StationId, Station> = {
  harvest: {
    id: 'harvest',
    title: 'The Harvest Plant',
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
    title: 'The buyers',
    line: 'Health services, schools, housing providers. The places that buy beds for people.',
    family: 'buyer',
    state: 'now',
  },
  money: {
    id: 'money',
    title: 'The money stays in community.',
    line: 'The buyer pays the community organisation.',
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
    title: 'A production facility comes to them.',
    line: 'Where a community is ready. Palm Island and Maningrida first.',
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
  { from: 'harvest', to: 'orgs', kind: 'goods', label: '400 beds, 100 each', fromSide: 'right', toSide: 'left', labelDy: -66 },
  { from: 'orgs', to: 'buyers', kind: 'goods', label: 'beds sold', fromSide: 'bottom', toSide: 'top', fromAt: 0.22, toAt: 0.22, labelDx: -12, labelAnchor: 'end' },
  { from: 'buyers', to: 'money', kind: 'money', label: 'payment', fromSide: 'bottom', toSide: 'top', fromAt: 0.78, toAt: 0.78, labelDx: 12, labelAnchor: 'start' },
  { from: 'money', to: 'decide', kind: 'money', label: 'after costs', fromSide: 'bottom', toSide: 'right', fromAt: 0.35, bend: 70, labelAt: 0.5, labelDx: 16, labelDy: 10, labelAnchor: 'start' },
  { from: 'decide', to: 'facility', kind: 'future', label: 'if the community chooses', fromSide: 'left', toSide: 'bottom', toAt: 0.6, bend: 70, labelAt: 0.5, labelDx: -16, labelDy: 10, labelAnchor: 'end' },
  { from: 'facility', to: 'next', kind: 'future', label: 'then', fromSide: 'top', toSide: 'bottom', fromAt: 0.8, toAt: 0.8, labelDx: 12, labelAnchor: 'start' },
  { from: 'act', to: 'next', kind: 'support', label: 'R&D', fromSide: 'top', toSide: 'bottom', fromAt: 0.5, toAt: 0.3, labelDx: 10, labelAnchor: 'start' },
];

export const PANELS: Panel[] = [
  {
    id: 'employment',
    title: 'Employment',
    line: 'Paid local work, at the plant and in community.',
    photo: {
      src: '/images/community/unplaced/rec-assembly-05-pole-sleeve.jpg',
      alt: 'Threading a pole through the canvas sleeve of a Stretch Bed, Maningrida',
      place: 'Maningrida',
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
    line: 'Sales, repeat buyers, money kept in community.',
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
    RAISE.otherFor,
  ];
  for (const s of Object.values(STATIONS)) out.push(s.title, s.line);
  for (const f of FLOWS) out.push(f.label);
  for (const p of PANELS) out.push(p.title, p.line, p.photo.alt);
  return out;
}
