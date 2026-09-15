/**
 * The QBE Stage 2 Q3 structure and funding-flow diagram: who applies, who owns
 * what, how money moves. Every string on the sheet is typed here once and
 * drawn by src/lib/model/structure-svg.ts. The words follow the Q1, Q2 and Q8
 * answers on the QBE opportunity row as they stood on 15 September 2026
 * (deliverables/funder-rows-2026-09-15/qbe-clean.md). Change a word here and
 * the sheet redraws; the guards in structure-diagram.guards.test.ts check that
 * every entity named at Q1 is on it.
 */

import { ORGANISATION } from './organisation';

export const STRUCTURE_READ_AT = '2026-09-15';

/** A4 landscape at 96 px per inch. */
export const STRUCTURE_W = 1123;
export const STRUCTURE_H = 794;

export type EntityId = 'funders' | 'centre' | 'act' | 'sole' | 'akt' | 'dewr' | 'oonchiumpa' | 'orgs' | 'customers';
export type EntityStyle = 'applicant' | 'related' | 'dormant' | 'outside' | 'money';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type LinkKind = 'money' | 'goods' | 'transfer' | 'future' | 'never';

export interface Entity {
  id: EntityId;
  title: string;
  lines: readonly string[];
  style: EntityStyle;
}

export interface Link {
  from: EntityId;
  to: EntityId;
  kind: LinkKind;
  label: string;
  fromSide: Side;
  toSide: Side;
  fromAt?: number;
  toAt?: number;
  bend?: number;
  labelAt?: number;
  labelWidth?: number;
}

export const APPLICANT = {
  name: 'Goods on Country Ltd',
  tradingAs: 'formerly The Butterfly Movement Ltd',
  abn: '22 155 132 684',
  acn: '155 132 684',
} as const;

export const SHEET = {
  title: 'Goods on Country: who applies, who owns what, how money moves',
  subtitle: 'Goods on Country Ltd, formerly The Butterfly Movement Ltd, applies and receives. Every related entity is shown.',
  boundary: 'The applicant and its related entities, as disclosed at Q1, Q2 and Q8',
  footer: 'QBE Foundation Catalysing Impact Stage 2, Q3. Outside the dashed line: independent organisations with their own boards. Checked against the ASIC and ACNC extracts before attachment.',
} as const;

export const ENTITIES: Record<EntityId, Entity> = {
  centre: {
    id: 'centre',
    title: `${APPLICANT.name}, ${APPLICANT.tradingAs}`,
    lines: [
      `ABN ${APPLICANT.abn}. ACN ${APPLICANT.acn}. Registered charity since 2012, deductible gift recipient.`,
      'Applicant and recipient. Holds the products, the intellectual property, the contracts, the making and the money.',
      'Board at submission: Kristy Bloomfield, Audrey Deemal, Sonia Mascolo.',
      'AGM 12 October 2026 elects Kristy Bloomfield, Audrey Deemal, Jeremy Donovan.',
      'Ben Knight and Nic Marchesi are employees running Goods on Country. Neither is a director.',
    ],
    style: 'applicant',
  },
  act: {
    id: 'act',
    title: 'A Curious Tractor Pty Ltd',
    lines: [
      'Owned by Ben Knight and Nicholas Marchesi. Made the first beds. Catalysing Impact cohort member since March 2026.',
      'Research and development. Invoices bed orders for now. Consortium member on Oonchiumpa’s REAL offer.',
    ],
    style: 'related',
  },
  sole: {
    id: 'sole',
    title: 'Nicholas Marchesi, sole trader',
    lines: ['ABN 21 591 780 066. The ledger part of the Goods trading history sits in.'],
    style: 'related',
  },
  akt: {
    id: 'akt',
    title: 'A Kind Tractor Ltd',
    lines: ['Dormant. No activity, no money, no arrows.'],
    style: 'dormant',
  },
  funders: {
    id: 'funders',
    title: 'Grant funders and lender. Asked, nothing signed.',
    lines: [
      'QBE Foundation Stage 2, $300,000, two production facilities.',
      'Tim Fairfax Family Foundation, Brian M. Davis Charitable Foundation, Snow Foundation: 133 beds at $750 each.',
      'SEFA Backing the Bold, $150,000 loan, first-year running cost.',
    ],
    style: 'money',
  },
  dewr: {
    id: 'dewr',
    title: 'Department of Employment and Workplace Relations, REAL Innovation Fund',
    lines: ['Offer to Oonchiumpa of $1,695,000 over four years, dated 12 August 2026. Agreement not executed. No cash received.'],
    style: 'outside',
  },
  oonchiumpa: {
    id: 'oonchiumpa',
    title: 'Oonchiumpa Consultancy & Services Pty Ltd',
    lines: [
      'Aboriginal community-controlled organisation, Alice Springs. Own board.',
      'Kristy Bloomfield is a director of both. Her interest is declared at both boards. She takes no part in a decision between them.',
    ],
    style: 'outside',
  },
  orgs: {
    id: 'orgs',
    title: 'Community organisations',
    lines: ['Independent, with their own boards. Hold the bed stock, sell it or give it out, keep every dollar of a sale.', ORGANISATION.membership.short],
    style: 'outside',
  },
  customers: {
    id: 'customers',
    title: 'Customers',
    lines: ['People, businesses and service providers: health services, schools, housing providers, families.'],
    style: 'outside',
  },
};

export const LINKS: readonly Link[] = [
  { from: 'funders', to: 'centre', kind: 'money', label: 'grants and loan land in the charity', fromSide: 'bottom', toSide: 'top', fromAt: 0.5, toAt: 0.5, labelWidth: 120 },
  { from: 'act', to: 'centre', kind: 'transfer', label: 'production equipment transferring in, no payment', fromSide: 'right', toSide: 'left', fromAt: 0.5, toAt: 0.22, labelWidth: 80 },
  { from: 'sole', to: 'centre', kind: 'transfer', label: 'FY26 trading history carved out by Standard Ledger', fromSide: 'right', toSide: 'left', fromAt: 0.5, toAt: 0.62, labelWidth: 80 },
  { from: 'dewr', to: 'oonchiumpa', kind: 'money', label: '$1,695,000 offer, 12 Aug 2026. Not executed, no cash', fromSide: 'bottom', toSide: 'top', fromAt: 0.1, toAt: 0.1, labelWidth: 175 },
  { from: 'oonchiumpa', to: 'centre', kind: 'future', label: '$150,000 to develop the Alice Springs facility, once executed', fromSide: 'left', toSide: 'right', fromAt: 0.5, toAt: 0.55, labelWidth: 80 },
  { from: 'centre', to: 'orgs', kind: 'goods', label: 'beds, 100 each to four organisations', fromSide: 'bottom', toSide: 'top', fromAt: 0.4, toAt: 0.75, labelWidth: 150 },
  { from: 'customers', to: 'orgs', kind: 'money', label: 'payment stays there', fromSide: 'left', toSide: 'right', fromAt: 0.5, toAt: 0.5, labelWidth: 70 },
  { from: 'orgs', to: 'centre', kind: 'never', label: 'no money returns to Goods', fromSide: 'top', toSide: 'bottom', fromAt: 0.22, toAt: 0.06, labelAt: 0.45, labelWidth: 110 },
];

/** Every string printed on the sheet, for the guards and the tells gate. */
export function everyPrintedString(): string[] {
  const out: string[] = [SHEET.title, SHEET.subtitle, SHEET.boundary, SHEET.footer];
  for (const e of Object.values(ENTITIES)) out.push(e.title, ...e.lines);
  for (const l of LINKS) out.push(l.label);
  return out.filter((s) => s.length > 0);
}
