/**
 * The Goods investor deck — one canonical, aligned sequence.
 *
 * Spine: the SIGNED 6-turn narrative foundation (wiki/outputs/2026-07-11-
 * narrative-foundation.md §1-2, §7): model + the loop up front, then the six
 * belief turns each carried by a named voice, the ask once and last.
 *
 * This file is the single source of truth for the deck's words and picture
 * choices. The /pitch/deck page lets Ben edit copy live in the browser
 * (saved to localStorage, exported back here to commit) and open a Present
 * (fullscreen) view — the "main deck".
 *
 * Voices resolve through storyteller-registry.ts, so every quote is
 * consent-tiered; the page never surfaces a `hold` quote (e.g. Dianne's
 * totem line). Photos are real, web-served paths under /public/images.
 */

export interface DeckChip {
  label: string;
  value: string;
}

export interface LiteralQuote {
  /** Verbatim line not tied to a registry portrait (anonymous / field line). */
  text: string;
  attribution: string;
}

export interface DeckVideo {
  label: string;
  href: string;
  note: string;
}

export type SlideKind = 'cover' | 'model' | 'turn' | 'ask' | 'closing';

export interface DeckSlide {
  id: string;
  kind: SlideKind;
  /** Small label above the headline, e.g. "Turn 1". */
  eyebrow: string;
  headline: string;
  body: string;
  /** Served path under /public. */
  photo: string;
  photoAlt: string;
  /** The five loop stages, model slide only. */
  steps?: string[];
  /** Registry voices carrying this slide, in display order. */
  voiceNames?: string[];
  /** Other cleared voices worth trying in a voice slot (swap picker). */
  voiceAlternates?: string[];
  /** Verbatim field/anonymous lines shown as pull-quotes. */
  literalQuotes?: LiteralQuote[];
  /** Data chips (canon figures / quiet specs). */
  chips?: DeckChip[];
  video?: DeckVideo;
  /** Editorial / provenance note shown in the edit margin, never in Present. */
  note: string;
}

export const deckUpdated = '14 July 2026';

export const deckSlides: DeckSlide[] = [
  {
    id: 'cover',
    kind: 'cover',
    eyebrow: 'Goods on Country',
    headline:
      'Goods turns community knowledge into health hardware, local work, and production that communities can own.',
    body: 'Quality furniture and appliances for remote Indigenous communities. Designed in community, made on Country, moving toward community ownership.',
    photo: '/images/product/stretch-bed-community.jpg',
    photoAlt: 'A Stretch Bed set up in a remote community home',
    note: 'Cover line = Ben\'s, 9 July workshop (narrative-foundation §1). Language rule: "designed in community", never "co-design".',
  },
  {
    id: 'model',
    kind: 'model',
    eyebrow: 'The model',
    headline: 'One loop, run twice. Two products, community-designed.',
    body: 'The Stretch Bed and Pakkimjalki Kari, the washing machine Dianne Stokes named in Warumungu, both came through the same loop, in different community hands each time. Every product into a home feeds back into the next design, and the plant itself is built to be handed over, place by place.',
    photo: '/images/process/factory-panorama.jpg',
    photoAlt: 'The containerised on-Country plant',
    steps: [
      'Listen: the community names the need',
      'Design in community: specs from lived conditions',
      'Make on Country: the containerised plant, local makers',
      'Deliver and feed back: beds into homes, feedback into design',
      'Transfer and support: the plant moves toward community hands',
    ],
    note: 'Five-stage loop, narrative-foundation §1. Two-product loop: Pakkimjalki Kari is the second proof, not a side product.',
  },
  {
    id: 'turn-1',
    kind: 'turn',
    eyebrow: 'Turn 1',
    headline: 'The need is real, and people name it themselves.',
    body: 'Before any bed lands, the community names the need, in its own words, not ours.',
    photo: '/images/media-pack/nic-with-elder-on-verandah.jpg',
    photoAlt: 'Nic listening with an Elder on a verandah',
    voiceNames: ['Ivy', 'Katrina Bloomfield'],
    voiceAlternates: ['Linda Turner', 'Melissa Jackson'],
    literalQuotes: [
      { text: 'We\'ve been sleeping on a door.', attribution: 'Arlparra household' },
      { text: 'Off the ground. That\'s the main thing.', attribution: 'Arlparra Elder' },
    ],
    note: 'Turn 1, narrative-foundation §2. Anonymous Arlparra lines are usable unnamed (community-narrative.ts).',
  },
  {
    id: 'turn-2',
    kind: 'turn',
    eyebrow: 'Turn 2',
    headline: 'The supply that already exists fails these places.',
    body: 'Freight, cost and distance break the ordinary supply chain long before it reaches the community.',
    photo: '/images/media-pack/deadly-heart-trek-aug-2025.jpg',
    photoAlt: 'Remote community, the problem of reach and cost',
    voiceNames: ['Alfred Johnson', 'Daniel Patrick Noble'],
    voiceAlternates: ['Ivy', 'Jason'],
    note: 'Turn 2, narrative-foundation §2. "The two price tags" diagram belongs here.',
  },
  {
    id: 'turn-3',
    kind: 'turn',
    eyebrow: 'Turn 3',
    headline: 'The products work because community designed them. Both of them.',
    body: 'Specs come from lived conditions: washable, low for Elders, no tools, built to survive remote. The Stretch Bed and the washing machine Dianne named both prove it.',
    photo: '/images/product/stretch-bed-hero.jpg',
    photoAlt: 'The Stretch Bed, community-designed',
    voiceNames: ['Dianne Stokes', 'Dorrie Jones', 'Melissa Jackson', 'Patricia Frank'],
    voiceAlternates: ['Heather Mundo'],
    chips: [
      { label: 'Weight', value: '26 kg' },
      { label: 'Capacity', value: '200 kg' },
      { label: 'Assembly', value: 'No tools, ~5 min' },
      { label: 'Material', value: 'Recycled HDPE + canvas' },
      { label: 'Washer base', value: 'Speed Queen, one-button' },
    ],
    note: 'Turn 3, narrative-foundation §2-3. Dianne\'s PRIMARY quote is Pakkimjalki Kari; her totem line is HOLD — never surface it. Specs from products.ts.',
  },
  {
    id: 'turn-4',
    kind: 'turn',
    eyebrow: 'Turn 4',
    headline: 'The making belongs in community hands. Young people are one proof; families are another.',
    body: 'The Bloomfield family built the five current machines with Nic. Young makers built the Utopia beds through Oonchiumpa. Different hands, the same loop.',
    photo: '/images/build/build-001.jpg',
    photoAlt: 'Young people building a bed on Country',
    voiceNames: ['Mykel', 'Fred Campbell', 'Karen Liddle', 'Kristy Bloomfield'],
    voiceAlternates: ['Katrina Bloomfield'],
    video: {
      label: 'Mykel, in his own voice',
      href: '/field-notes/utopia-may-2026',
      note: 'At his house, putting the bed together. Already live and public.',
    },
    note: 'Turn 4, narrative-foundation §2. Fred narrates Xavier — never a direct Xavier quote.',
  },
  {
    id: 'turn-5',
    kind: 'turn',
    eyebrow: 'Turn 5',
    headline: 'The plant makes the pattern transferable. Ownership is the promise.',
    body: 'The containerised plant is visible, teachable and movable — Alice to Tennant Creek to Katherine to Darwin. It is built to be handed over, place by place, with Goods staying on as support, not owner. PICC has asked to buy a production facility of its own; Dianne received one bed and came back to self-fund twenty.',
    photo: '/images/process/heat-press-full.jpg',
    photoAlt: 'The heat press — the one move at the heart of the plant',
    voiceNames: ['Norman Frank', 'Shayne Bloomfield'],
    voiceAlternates: ['Karen Liddle', 'Dianne Stokes'],
    note: 'Turn 5, narrative-foundation §2. Ownership is a PATHWAY, never claimed complete (locked by Ben 2026-07-10).',
  },
  {
    id: 'ask',
    kind: 'ask',
    eyebrow: 'Turn 6 · The ask',
    headline: 'What the capital does — once, near the end.',
    body: 'The funding buys the bridge: the 50-bed in-source run (modelled, then measured), the first place-based ownership pathway with Oonchiumpa, the enterprise-support layer, and plant capex. AU$400K recoverable, at least 1:1 match-eligible, through QBE Catalysing Impact, on top of SEFA $300K, Snow $100K and Centrecorp $75K.',
    photo: '/images/qbe/communities-screen.png',
    photoAlt: 'The nine communities served, on the map',
    chips: [
      { label: 'Beds delivered', value: '496 across 9 communities' },
      { label: 'Washing machines in community', value: '16' },
      { label: 'Plastic diverted', value: '2,660 kg' },
      { label: 'Revenue (accountant-signed carve-out)', value: 'AU$713,827' },
      { label: 'Current ask', value: 'AU$400K (QBE, by 31 Aug 2026)' },
    ],
    note: 'Turn 6, narrative-foundation §2/§5. Every number audits back to /register. Revenue LOCKED to the $713,827 carve-out on all external surfaces.',
  },
  {
    id: 'closing',
    kind: 'closing',
    eyebrow: 'The promise',
    headline: 'The funding buys the middle of the sentence, so communities can own the end of it.',
    body: 'Community is the subject of the first beat and the last. Goods only appears in the middle, as the verb.',
    photo: '/images/media-pack/lying-on-stretch-bed.jpg',
    photoAlt: 'Resting on a Stretch Bed, off the ground',
    note: 'Closing. Credit rule (spine): they said, it changed, it returned.',
  },
];
