/**
 * The money-flow diagram for deck slide S15 ("Keep each dollar in its own
 * lane"): who puts money in, where it lands, what comes back and what never
 * does. Every string is typed here once and drawn by
 * src/lib/model/money-flow-svg.ts. Figures follow RAISE in model-placemat.ts
 * and Ben's 15 September rulings: three grants buy 133 beds each at $750, QBE
 * builds two community facilities at $150,000 each, SEFA's $150,000 loan
 * carries the first-year running cost and is repaid from the beds Goods sells.
 * The loan sits inside the ask (Ben, 15 September 2026 evening ruling).
 */

import { RAISE, dollars } from './model-placemat';

export const FLOW_READ_AT = '2026-09-15';

/** Fills the slide body under a Pencil headline: 1920 wide, 700 tall. */
export const FLOW_W = 1920;
export const FLOW_H = 700;

export type FlowEntityId = 'philanthropy' | 'qbe' | 'sefa' | 'goods' | 'facilities' | 'orgs' | 'customers';
export type FlowEntityStyle = 'applicant' | 'related' | 'dormant' | 'outside' | 'money';
export type Side = 'top' | 'right' | 'bottom' | 'left';
export type FlowLinkKind = 'money' | 'goods' | 'transfer' | 'future' | 'never';

export interface FlowEntity {
  id: FlowEntityId;
  title: string;
  amount?: string;
  lines: readonly string[];
  style: FlowEntityStyle;
}

export interface FlowLink {
  from: FlowEntityId;
  to: FlowEntityId;
  kind: FlowLinkKind;
  label: string;
  fromSide: Side;
  toSide: Side;
  fromAt?: number;
  toAt?: number;
  bend?: number;
  labelAt?: number;
  labelWidth?: number;
}

export const LOAN_AUD = RAISE.loanAud;
export const FACILITY_AUD = 150_000;
export const BED_PRICE_AUD = 750;
export const BED_SPLIT = { making: 262, freight: 100, facilitation: 100, toGoods: 288 } as const;

export const FLOW_SHEET = {
  /** Empty on purpose: the slide carries its own footer (Ben, 15 Sep 2026). */
  footer: '',
} as const;

export const FLOW_ENTITIES: Record<FlowEntityId, FlowEntity> = {
  philanthropy: {
    id: 'philanthropy',
    title: 'Philanthropy buys the first beds',
    amount: dollars(RAISE.bedsShownAud),
    lines: ['Tim Fairfax Family Foundation, Brian M. Davis Charitable Foundation, Snow Foundation. 133 beds each at $750.'],
    style: 'money',
  },
  qbe: {
    id: 'qbe',
    title: 'QBE Foundation builds two facilities',
    amount: dollars(FACILITY_AUD * 2),
    lines: [`${dollars(FACILITY_AUD)} each, where a community is ready and asks.`],
    style: 'money',
  },
  sefa: {
    id: 'sefa',
    title: 'SEFA lends the first-year running cost',
    amount: dollars(LOAN_AUD),
    lines: ['Backing the Bold loan. Repaid from the beds Goods sells.'],
    style: 'money',
  },
  goods: {
    id: 'goods',
    title: 'Goods on Country',
    lines: [
      'Goods on Country Ltd, a DGR1 charity. Makes the beds at its Queensland facility and hands them to community organisations as stock.',
      `Every $${BED_PRICE_AUD} bed: making $${BED_SPLIT.making}, freight $${BED_SPLIT.freight}, facilitation $${BED_SPLIT.facilitation}, $${BED_SPLIT.toGoods} carries the organisation.`,
    ],
    style: 'applicant',
  },
  facilities: {
    id: 'facilities',
    title: 'Two community production facilities',
    lines: ['Community-run. Make beds locally for the same customers, and employ local people.'],
    style: 'related',
  },
  orgs: {
    id: 'orgs',
    title: 'Four community organisations',
    lines: ['100 beds each. Theirs to sell or give out. They invoice the customer and keep every dollar.'],
    style: 'outside',
  },
  customers: {
    id: 'customers',
    title: 'Customers',
    lines: ['Health services, schools, housing programs, families. They pay the community organisation.'],
    style: 'outside',
  },
};

export const FLOW_LINKS: readonly FlowLink[] = [
  { from: 'philanthropy', to: 'goods', kind: 'money', label: `${dollars(RAISE.bedsShownAud)} for 400 beds`, fromSide: 'right', toSide: 'left', fromAt: 0.5, toAt: 0.25, labelWidth: 130 },
  { from: 'sefa', to: 'goods', kind: 'future', label: `${dollars(LOAN_AUD)} loan`, fromSide: 'right', toSide: 'left', fromAt: 0.35, toAt: 0.7, labelWidth: 120 },
  { from: 'goods', to: 'sefa', kind: 'future', label: 'repaid from beds Goods sells', fromSide: 'left', toSide: 'right', fromAt: 0.92, toAt: 0.7, labelWidth: 130 },
  { from: 'qbe', to: 'facilities', kind: 'money', label: `${dollars(FACILITY_AUD * 2)}, two facilities`, fromSide: 'right', toSide: 'left', fromAt: 0.5, toAt: 0.5, labelWidth: 160 },
  { from: 'goods', to: 'orgs', kind: 'goods', label: '400 beds as stock, 100 each', fromSide: 'right', toSide: 'left', fromAt: 0.35, toAt: 0.5, labelWidth: 140 },
  { from: 'goods', to: 'facilities', kind: 'transfer', label: 'presses, training, the plans', fromSide: 'bottom', toSide: 'top', fromAt: 0.7, toAt: 0.7, labelWidth: 140 },
  { from: 'customers', to: 'orgs', kind: 'money', label: '$750 a bed, stays in community', fromSide: 'top', toSide: 'bottom', fromAt: 0.5, toAt: 0.5, labelWidth: 150 },
  { from: 'facilities', to: 'customers', kind: 'future', label: 'beds made locally', fromSide: 'right', toSide: 'left', fromAt: 0.5, toAt: 0.5, labelWidth: 120 },
  { from: 'orgs', to: 'goods', kind: 'never', label: 'no money back to Goods', fromSide: 'left', toSide: 'right', fromAt: 0.15, toAt: 0.1, labelWidth: 120 },
];

/** Every string printed on the sheet, for the guards and the tells gate. */
export function everyFlowString(): string[] {
  const out: string[] = [FLOW_SHEET.footer];
  for (const e of Object.values(FLOW_ENTITIES)) out.push(e.title, ...(e.amount ? [e.amount] : []), ...e.lines);
  for (const l of FLOW_LINKS) out.push(l.label);
  return out.filter((s) => s.length > 0);
}
