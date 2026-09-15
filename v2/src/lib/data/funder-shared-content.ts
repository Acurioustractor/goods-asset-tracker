/**
 * Shared content used across all funder landing pages.
 * Update these in one place. Every funder page picks up the change.
 */

import { RAISE, dollars } from './model-placemat';
import { MONEY_LANES } from './money-lanes';
import { BUYERS } from './pitch-chapters';
import { CANONICAL_ASSETS } from './asset-canonical';

export const TRACTION_STATS = [
  { label: 'Beds delivered', value: String(CANONICAL_ASSETS.bedsDeployed), sub: `Across ${CANONICAL_ASSETS.communitiesServed} communities` },
  { label: 'Communities reached', value: String(CANONICAL_ASSETS.communitiesServed), sub: 'Across Australia' },
  { label: 'The ask', value: dollars(RAISE.totalShownAud), sub: `Beds, two facilities and the first year. ${dollars(RAISE.signedAud)} signed.` },
];

export interface ProductCard {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  link?: { href: string; label: string };
}

export const PRODUCT_CARDS: ProductCard[] = [
  {
    title: 'The Stretch Bed',
    body:
      'Stretch Bed v2.3 is in production. Sale price sits around $750 a bed, with marginal cost well below that and a clear path to lower it further as we move HDPE processing On-Country and volume scales. Margin improves as we in-source production.',
    image: '/images/product/stretch-bed-hero.jpg',
    imageAlt: 'The Stretch Bed: flat-pack, washable, 10-year design',
    link: { href: '/shop/stretch-bed-single', label: 'See the product' },
  },
  {
    title: 'Built for remote conditions',
    body:
      '20kg of recycled HDPE per bed. 200kg load capacity, designed to last 10+ years. Recycled HDPE legs, galvanised steel poles, heavy-duty Australian canvas. Assembles in five minutes. No tools.',
    image: '/images/product/stretch-bed-assembled.jpg',
    imageAlt: 'A fully assembled Stretch Bed showing the canvas, steel poles and HDPE legs',
    link: { href: '/process', label: 'How it is made' },
  },
  {
    title: 'Pakkimjalki Kari, the washing machine',
    body:
      'Companion product. Named in Warumungu by Elder Dianne Stokes. Prototype machines deployed in Tennant Creek and other communities, with cycle telemetry coming online via Particle.io. Designed in conversation with the Elders who use it.',
    image: '/images/product/washing-machine-hero.jpg',
    imageAlt: 'The Pakkimjalki Kari washing machine in a remote community',
    link: { href: '/story', label: 'Read the full story' },
  },
];

// Kept for back-compat with anything still importing PRODUCT_BLURB
export const PRODUCT_BLURB = PRODUCT_CARDS.map((c) => c.body);

/**
 * Who has bought, from the paid trade only (pitch-chapters.ts BUYERS). Ben, 15 September 2026: the
 * "who has asked" figures were withdrawn and are never printed, and Centrecorp's beds are delivered,
 * so no row here is demand.
 */
export const BUYER_PIPELINE = BUYERS.rows.map((row) => ({
  buyer: row.buyer,
  volume: `${row.beds} beds`,
  value: 'Paid',
  status: row.line,
}));

/** The raise as three lanes (money-lanes.ts), the same figures as /pitch and /partner. */
export const CAPITAL_STACK = MONEY_LANES.map((lane) => ({
  layer: lane.id === 'beds' ? 'Philanthropy' : lane.source.kicker,
  source: `${lane.source.named}: ${lane.buys.title.toLowerCase()}`,
  amount: `$${lane.source.amount / 1000}K`,
  status: 'Asked, not signed',
  highlight: false,
}));

/** The raise headline, from RAISE. Replaces the retired "~$3M" blended target. */
export const RAISE_TARGET = {
  label: `$${RAISE.totalShownAud / 1000}K`,
  note: `asked across three parts, ${dollars(RAISE.signedAud)} signed`,
};

export const QBE_PROGRAM = {
  title: 'QBE Catalysing Impact 2026',
  description:
    "Goods is in the QBE Foundation's blended finance accelerator, run by Social Impact Hub. We were selected on alignment with climate resilience and inclusion. Stage 2 includes funding of up to $400,000 from a $1M pool, which must be at least matched by external capital we raise from elsewhere. Repayable finance is prioritised over grants.",
  contacts: [
    'Lauren at QBE Foundation (climate and inclusion)',
    'Alex at QBE Ventures ($5 to $15M check sizes)',
    'Hannah, CEO of SEFA ($9M undeployed impact debt)',
    'Rebecca Parkinson, impact investment advisor',
    'Jess Grebenschikoff, Social Impact Hub facilitator',
  ],
};

export const INVESTMENT_THESIS = {
  why: "Remote Indigenous communities buy roughly $3M a year of washing machines from one Alice Springs supplier, and most of them end up in dumps within months. Beds in remote houses are typically replaced every 18 months. The unit economics of disposable goods in remote Australia are broken, and the social cost (sleep, hygiene, dignity, household function) compounds.",
  whoWeAre:
    "First Nations led, with On-Country manufacturing as the core model we are building toward. Products designed in community for actual remote conditions, not in an office for catalogues. Telemetry piloting on prototype washing machine fleet, real revenue, real Elders and communities leading the design of the product line. We've shipped the beds. The proof is in the houses.",
  achievable:
    "At roughly $750 a bed, a Year 1 target of 1,500 beds is over $1.1M of revenue, against an institutional buyer pipeline in active conversation (not yet committed). The ~$3M target stack covers facility build, working capital, and the runway to scale toward On-Country production at a defensible margin.",
};
