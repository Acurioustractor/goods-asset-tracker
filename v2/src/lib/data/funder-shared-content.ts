/**
 * Shared content used across all funder landing pages.
 * Update these in one place. Every funder page picks up the change.
 */

export const TRACTION_STATS = [
  { label: 'Beds shipped to date', value: '600+', sub: 'Centrecorp, Homeland Schools, community deployments' },
  { label: 'HDPE diverted per bed', value: '20kg', sub: 'Recycled into leg components On Country' },
  { label: 'Grant funding to date', value: '$445K', sub: 'Past support from Snow, FRRR, VFFF, TFN, AMP' },
  { label: 'Capital stack target', value: '~$3M', sub: 'QBE blended finance, close mid-2026' },
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
      'Stretch Bed v2.3 is in production. Sale price sits around $750 a bed with cost-to-make well below that thanks to On-Country HDPE processing and the simplified flat-pack design. Strong gross margin that improves further as production volume scales.',
    image: '/images/product/stretch-bed-hero.jpg',
    imageAlt: 'The Stretch Bed: flat-pack, washable, 10-year design',
    link: { href: '/shop/stretch-bed-single', label: 'See the product' },
  },
  {
    title: 'Built for remote conditions',
    body:
      '20kg of recycled HDPE per bed. 200kg load capacity, 5-year warranty, 10+ year design life. Recycled HDPE legs, galvanised steel poles, heavy-duty Australian canvas. Assembles in five minutes. No tools.',
    image: '/images/product/stretch-bed-assembled.jpg',
    imageAlt: 'A fully assembled Stretch Bed showing the canvas, steel poles and HDPE legs',
    link: { href: '/process', label: 'How it is made' },
  },
  {
    title: 'Pakkimjalki Kari, the washing machine',
    body:
      'Companion product. Named in Warumungu by Elder Dianne Stokes. 11 machines deployed in Tennant Creek with real cycle telemetry flowing via Particle.io. Designed in conversation with the Elders who use it.',
    image: '/images/product/washing-machine-hero.jpg',
    imageAlt: 'The Pakkimjalki Kari washing machine in a remote community',
    link: { href: '/story', label: 'Read the full story' },
  },
];

// Kept for back-compat with anything still importing PRODUCT_BLURB
export const PRODUCT_BLURB = PRODUCT_CARDS.map((c) => c.body);

export const BUYER_PIPELINE = [
  { buyer: 'Centrecorp', volume: '107 beds (repeat)', value: '$80,250', status: 'Locked. Delivery in 1 month' },
  { buyer: 'Miwatj Health', volume: '8-clinic fleet', value: 'TBD', status: 'EOI being requested' },
  { buyer: "NPY Women's Council", volume: '200 to 350 beds', value: '$150K to $262K', status: 'LOI being requested' },
  { buyer: 'WHSAC / Groote Eylandt', volume: '500 Stretch Beds, 300 washers', value: '$1.5M+', status: 'Procurement pathway open' },
  { buyer: 'Homeland Schools', volume: 'Interested', value: '$34,086', status: 'In conversation' },
];

export const CAPITAL_STACK = [
  { layer: 'Catalytic blended', source: 'Minderoo (this ask)', amount: '$1.5M', status: 'In conversation', highlight: true },
  { layer: 'Subordinated debt', source: 'SEFA working capital (BOLD agreement)', amount: '$300K', status: 'Outreach this week' },
  { layer: 'Match grant', source: 'QBE Foundation Stage 2', amount: '$400K', status: 'Conditional on raise' },
  { layer: 'To be raised', source: 'Additional philanthropic and community partners', amount: '$1M', status: 'Pipeline' },
  { layer: 'Guarantee', source: 'Snow Foundation letter of support', amount: '·', status: 'In conversation' },
];

export const QBE_PROGRAM = {
  title: 'QBE Catalysing Impact 2026',
  description:
    "Goods is in the QBE Foundation's blended finance accelerator, run by Social Impact Hub. We were selected on alignment with climate resilience and inclusion. Stage 2 includes a dollar-for-dollar match up to $400K against capital we raise from elsewhere.",
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
    "First Nations led, On-Country manufacturing model. Products designed for actual remote conditions, not for catalogues. Real telemetry data, real revenue, real Elders and communities co-designing the product line. We've shipped the beds. The proof is in the houses.",
  achievable:
    "At roughly $750 a bed, 1,500 beds delivered in year one is over $1.1M of revenue against a committed buyer pipeline already in active conversation. The $3M stack covers facility build, working capital, and the runway to scale into On-Country production at a defensible margin.",
};
