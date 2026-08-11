/**
 * CANONICAL OFFERS — the approved public and diligence-facing cost blocks.
 *
 * This module answers the practical questions that recur across the shop,
 * one-pagers, the Road, community packs and relationship emails:
 * what it costs, what is included, what is additional, and which legal door
 * the payment uses. Surfaces import these records; they do not retype them.
 *
 * Ruling: Ben, 2026-08-10. Financial basis: GoC Entity Financial Model v1.
 */

export type OfferAudience = 'public' | 'community-review' | 'investor-diligence';
export type OfferStatus = 'approved' | 'planning-assumption';
export type PaymentDoorId = 'buy' | 'give' | 'lend' | 'community-facility';

export interface CanonicalOffer {
  id: 'stretch-bed' | 'complete-facility' | 'governance-scoping' | 'working-capital' | 'goods-network';
  name: string;
  publicPrice: string;
  lowAud: number;
  highAud: number;
  cadence: 'per bed' | 'one-off' | 'revolving' | 'per year';
  audience: OfferAudience;
  status: OfferStatus;
  includes: readonly string[];
  additional: readonly string[];
  paymentDoor: PaymentDoorId;
  publicLine: string;
  source: string;
  asAt: string;
}

export const OFFERS = {
  stretchBed: {
    id: 'stretch-bed',
    name: 'Stretch Bed',
    publicPrice: '$750 per bed',
    lowAud: 750,
    highAud: 750,
    cadence: 'per bed',
    audience: 'public',
    status: 'approved',
    includes: ['One complete Stretch Bed'],
    additional: ['Delivery, quoted separately for the destination'],
    paymentDoor: 'buy',
    publicLine: 'Stretch Beds are $750 each. Delivery is quoted separately.',
    source: 'Supabase products row `stretch-bed-single`; delivery ruling Ben 2026-08-10',
    asAt: '2026-08-10',
  },
  completeFacility: {
    id: 'complete-facility',
    name: 'Complete community production facility',
    publicPrice: '$150,000–$220,000',
    lowAud: 150_000,
    highAud: 220_000,
    cadence: 'one-off',
    audience: 'public',
    status: 'approved',
    includes: ['Production equipment', 'Container or workspace setup', 'Commissioning', 'Initial support'],
    additional: ['Exceptional freight', 'Site-specific civil works', 'Requirements identified during scoping'],
    paymentDoor: 'community-facility',
    publicLine: 'A complete community production facility generally costs $150,000–$220,000, depending on location and scope.',
    source: 'GoC Entity Financial Model v1; simplified public band ruled by Ben 2026-08-10',
    asAt: '2026-08-10',
  },
  governanceScoping: {
    id: 'governance-scoping',
    name: 'Governance and initial community scoping',
    publicPrice: 'From approximately $35,000',
    lowAud: 25_000,
    highAud: 50_000,
    cadence: 'one-off',
    audience: 'community-review',
    status: 'planning-assumption',
    includes: ['Listening', 'Governance design', 'Needs assessment', 'Facility scope', 'Budget and pathway brief'],
    additional: ['Detailed design', 'Construction', 'Equipment and delivery'],
    paymentDoor: 'give',
    publicLine: 'Start with governance and community scoping from approximately $35,000.',
    source: 'Planning range agreed for model use by Ben 2026-08-10; validate against first completed scopes',
    asAt: '2026-08-10',
  },
  workingCapital: {
    id: 'working-capital',
    name: 'Working capital',
    publicPrice: '$80,000–$145,000',
    lowAud: 80_000,
    highAud: 145_000,
    cadence: 'revolving',
    audience: 'investor-diligence',
    status: 'planning-assumption',
    includes: ['Materials', 'Production timing', 'Wages', 'Delivery costs before customer payment arrives'],
    additional: ['Annual Goods network support', 'Facility capital'],
    paymentDoor: 'lend',
    publicLine: 'Working capital of $80,000–$145,000 bridges the gap between making and delivering orders and receiving payment.',
    source: 'GoC Entity Financial Model v1; base planning case $105,000, ruled by Ben 2026-08-10',
    asAt: '2026-08-10',
  },
  goodsNetwork: {
    id: 'goods-network',
    name: 'Goods network support',
    publicPrice: 'Approximately $300,000 a year',
    lowAud: 290_200,
    highAud: 300_000,
    cadence: 'per year',
    audience: 'public',
    status: 'approved',
    includes: ['Founder leadership and salaries', 'Head office and administration', 'Marketing and communications', 'Field travel'],
    additional: ['A separate $50,000 consulting and accounting provision until overlap is reconciled'],
    paymentDoor: 'give',
    publicLine: 'Goods requires approximately $300,000 a year to coordinate production, relationships, travel, administration and community support across the network.',
    source: 'GoC Entity Financial Model v1: $151.2K salaries + $53K head office + $35K marketing + $51K field travel = $290.2K',
    asAt: '2026-08-10',
  },
} as const satisfies Record<string, CanonicalOffer>;

export const OFFER_LIST: readonly CanonicalOffer[] = Object.values(OFFERS);

export interface PaymentDoor {
  id: PaymentDoorId;
  label: string;
  receivingEntity: string;
  use: string;
  note: string;
}

export const PAYMENT_DOORS: Record<PaymentDoorId, PaymentDoor> = {
  buy: {
    id: 'buy',
    label: 'Buy beds or production services',
    receivingEntity: 'The current legal seller named on the Goods. quote or invoice',
    use: 'Product and production-service revenue.',
    note: 'Goods currently sells through the existing sole-trader structure while trading moves into A Curious Tractor Pty Ltd. Never imply that migration is complete.',
  },
  give: {
    id: 'give',
    label: 'Give or make a charitable grant',
    receivingEntity: 'The Butterfly Movement Ltd, operating as Goods on Country',
    use: 'Charitable community capability, governance, scoping and network support.',
    note: 'Confirm grant purpose and receipting mechanics before paperwork is issued.',
  },
  lend: {
    id: 'lend',
    label: 'Lend or provide recoverable capital',
    receivingEntity: 'A Curious Tractor Pty Ltd',
    use: 'Working capital or repayable production finance.',
    note: 'The instrument must state terms, repayment source and borrower.',
  },
  'community-facility': {
    id: 'community-facility',
    label: 'Fund a community facility',
    receivingEntity: 'The relevant community-controlled entity, wherever practicable',
    use: 'A facility shaped with, held for and ideally owned by the community.',
    note: 'Goods on Country may support scoping and establishment. Never imply that Goods on Country automatically owns the facility.',
  },
};

export const NAMED_COMMUNITY_COST_RULE =
  'Do not publish a named community cost until that community has reviewed and approved it.';

