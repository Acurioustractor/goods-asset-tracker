/**
 * Shared content used across all funder landing pages.
 * Update these in one place. Every funder page picks up the change.
 */

export const TRACTION_STATS = [
  { label: 'Bed units deployed', value: '496', sub: 'Tracked across 10 communities (Stretch + legacy Basket)' },
  { label: 'HDPE diverted per bed', value: '20kg', sub: 'Recycled HDPE in each bed; On-Country processing is the target pathway' },
  { label: 'Grant funding to date', value: '$450K+', sub: 'Verified paid: Snow, Centrecorp, VFFF, QIC and others (Xero)' },
  { label: 'Capital stack target', value: '~$3M', sub: 'Blended-finance target via QBE Catalysing Impact 2026 (raising, not committed)' },
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

export const BUYER_PIPELINE = [
  { buyer: 'Centrecorp', volume: '107 beds (repeat)', value: '$80,250', status: 'Repeat buyer confirmed ($123K paid); next order in discussion' },
  { buyer: 'Miwatj Health', volume: '8-clinic fleet', value: 'TBD', status: 'EOI being requested' },
  { buyer: "NPY Women's Council", volume: '200 to 350 beds', value: '$150K to $262K', status: 'LOI being requested' },
  { buyer: 'WHSAC / Groote Eylandt', volume: '500 Stretch Beds, 300 washers', value: '$1.5M+', status: 'Procurement pathway open' },
  { buyer: 'Homeland Schools', volume: 'Locked', value: '$34,086', status: 'Approved. Delivery scheduled' },
];

export const CAPITAL_STACK = [
  { layer: 'Catalytic blended', source: 'Minderoo (this ask)', amount: '$1.5M', status: 'In conversation', highlight: true },
  { layer: 'Subordinated debt', source: 'SEFA working capital (BOLD agreement)', amount: '$300K', status: 'Outreach this week' },
  { layer: 'Match grant', source: 'QBE Foundation Stage 2', amount: '$200K–$400K (cap TBC)', status: 'Conditional on raise' },
  { layer: 'To be raised', source: 'Additional philanthropic and community partners', amount: '$1M', status: 'Pipeline' },
  { layer: 'Guarantee', source: 'Snow Foundation letter of support', amount: '·', status: 'In conversation' },
];

export const QBE_PROGRAM = {
  title: 'QBE Catalysing Impact 2026',
  description:
    "Goods is in the QBE Foundation's blended finance accelerator, run by Social Impact Hub. We were selected on alignment with climate resilience and inclusion. Stage 2 includes a dollar-for-dollar match (cap to be confirmed, indicatively $200K–$400K) against capital we raise from elsewhere.",
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
