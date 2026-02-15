// Canonical product data — THE single source of truth for all product specs.
// Every page should import from here instead of hardcoding values.
// NO PRICES — pricing is handled separately via Stripe/Supabase.

export const STRETCH_BED = {
  name: 'The Stretch Bed',
  slug: 'stretch-bed',
  productType: 'stretch_bed' as const,
  status: 'available' as const,
  tagline:
    'A flat-packable, washable bed made from recycled plastic, heavy-duty canvas, and galvanised steel.',
  shortDescription:
    'A flat-packable, washable bed designed for remote Australia. Made from recycled plastic, galvanised steel, and heavy-duty canvas.',
  specs: {
    weight: '26kg',
    loadCapacity: '200kg',
    dimensions: '188 × 92 × 25cm',
    assemblyTime: '~5 minutes',
    toolsRequired: 'None',
    designLifespan: '10+ years',
    warranty: '5 years',
    plasticDiverted: '20kg HDPE per bed',
  },
  materials: {
    frame: {
      name: 'Galvanised steel pipe',
      detail: '26.9mm OD × 2.6mm wall, 1950mm length',
      supplier: 'DNA Steel Direct, Alice Springs',
    },
    sleepingSurface: {
      name: 'Heavy-duty Australian canvas',
      detail: 'Fully washable, quick-drying',
      supplier: 'Centre Canvas, Alice Springs',
    },
    legs: {
      name: 'Recycled HDPE plastic panels',
      detail: 'Pressed from community-collected plastic waste',
      supplier: 'Defy Design, Sydney (current) / On-country (future)',
    },
    endCaps: {
      name: 'Round ribbed tube end caps, 27mm',
      supplier: 'Hardware supplier',
    },
    joinery: {
      name: 'Slot-together "T" section',
      detail: 'No screws or hardware needed',
      supplier: 'Custom manufactured',
    },
  },
  features: [
    'Flat-packs for easy transport',
    'Washable canvas sleeping surface',
    'No tools required for assembly',
    'Recycled plastic legs — virtually indestructible',
    'Galvanised steel poles — 200kg capacity',
    'Designed with 500+ minutes of community feedback',
  ],
} as const;

export const WASHING_MACHINE = {
  name: 'Pakkimjalki Kari',
  slug: 'pakkimjalki-kari',
  productType: 'washing_machine' as const,
  status: 'prototype' as const,
  tagline:
    'Commercial-grade Speed Queen in recycled plastic housing. Named in Warumungu language by Elder Dianne Stokes.',
  shortDescription:
    'Commercial-grade Speed Queen base, one-button operation, named in Warumungu language. Currently in prototype with communities.',
  specs: {
    baseUnit: 'Commercial-grade Speed Queen',
  },
} as const;

export const BASKET_BED = {
  name: 'Basket Bed',
  slug: 'basket-bed',
  productType: 'basket_bed' as const,
  status: 'open-source' as const,
  tagline:
    'Our first prototype — collapsible baskets with zip ties and toppers. Now open source.',
  shortDescription:
    'Original prototype bed design using collapsible baskets. Now open-source — download plans for free.',
  variants: ['Single', 'Double', 'Stackable'],
} as const;

export const PRODUCTION_FACILITY = {
  type: 'Containerised mobile plastic re-production facility',
  investment: '~$100K invested (TFN + ACT funding)',
  capacity: '~30 beds/week when deployed for 2 months',
  model: 'Two-container system (shredder container + production container)',
  machines: [
    'Shredder',
    'Heat Press (190°C, ~5,000 PSI)',
    'Cooling Rack',
    'CNC Router',
    'Flip Table',
  ],
  future:
    'Same facility can produce washing machine/fridge components with different moulds',
} as const;

export const ENTERPRISE = {
  model: 'Community ownership transfer (not licensing)',
  philosophy: 'Our goal is to become unnecessary',
  pathways: [
    'Sponsor beds',
    'License/transfer model',
    'Distribution partner',
    'Grant/Investment',
  ],
  keyPartners: [
    'Snow Foundation',
    'VFFF',
    'FRRR',
    'AMP Spark',
    'TFN',
    'Anyinginyi Health',
    'Miwatj Health',
    'Purple House',
    'Red Dust',
  ],
} as const;

export const ALL_PRODUCTS = [STRETCH_BED, WASHING_MACHINE, BASKET_BED] as const;
