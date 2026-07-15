/**
 * The Goods investor deck — one canonical, aligned sequence.
 *
 * Spine: the SIGNED 6-turn narrative foundation (wiki/outputs/2026-07-11-
 * narrative-foundation.md §1-2, §7), integrated with Ben's 14 July story-first
 * draft per wiki/outputs/2026-07-15-strategy-deck-core-messaging.md: model +
 * the loop up front, the six belief turns each carried by a named voice, the
 * truck-test hinge between Turn 4 and Turn 5, the ask once and last.
 *
 * This file is the single source of truth for the deck's words and picture
 * choices. The /pitch/deck page lets Ben edit copy live in the browser
 * (saved to localStorage, exported back here to commit) and open a Present
 * (fullscreen) view — the "main deck". Every slide carries a presenter
 * script in Ben's spoken voice; Present mode shows it as notes (N key).
 *
 * Voices resolve through storyteller-registry.ts, so every quote is
 * consent-tiered; the page never surfaces a `hold` quote (e.g. Dianne's
 * totem line). Photos are real, web-served paths under /public/images.
 *
 * Claims-status labels (observed / requested / agreed / delivered / measured
 * / proposed) ride on chip labels and notes. NO Kununurra content may enter
 * this file until the Elder clears her words and has a registry record
 * (core-messaging doc §5) — this page is public and click-to-editable, so
 * "gated in the code" is not a real gate.
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

export interface GalleryImage {
  /** Served path under /public. */
  src: string;
  alt: string;
}

export interface InlineVideo {
  /** Served path under /public/video. */
  src: string;
  poster: string;
  /** loop = silent ambient header; feature = click-to-play with controls. */
  mode: 'loop' | 'feature';
  label?: string;
}

export interface GoDeeperLink {
  label: string;
  href: string;
}

export type SlideKind = 'cover' | 'model' | 'turn' | 'hinge' | 'ask' | 'closing';

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
  /** Data chips (canon figures / quiet specs), claims-status in the label. */
  chips?: DeckChip[];
  video?: DeckVideo;
  /** Ambient loop replacing the header photo, or a featured click-to-play clip. */
  inlineVideo?: InlineVideo;
  /** Real photos shown as a strip under the slide (public page). */
  gallery?: GalleryImage[];
  /** Links to the specific live pages that carry the detail. */
  goDeeper?: GoDeeperLink[];
  /** Presenter script — Ben's spoken voice, shown as notes in Present (N). */
  script?: string;
  /** Editorial / provenance note shown in the edit margin, never in Present. */
  note: string;
}

export const deckUpdated = '15 July 2026';

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
    goDeeper: [
      { label: 'The work', href: '/the-work' },
      { label: 'The communities', href: '/communities' },
    ],
    script:
      'Goods turns community knowledge into health hardware, local work, and production that communities can own. Goods started with a bed, but the first thing we had to learn was how to sit down. From a distance it can look like Goods is a couple of people driving around Australia taking products into communities. The photographs tend to show the truck, the bed and the handover. They do not show the part that makes any of it possible. Before we arrive, someone has taken the call, spoken with families, worked out where we should go and decided to let us in. They carry the relationships. We carry the components.',
    note: 'Cover line = Ben\'s, 9 July workshop (narrative-foundation §1). Language rule: "designed in community", never "co-design".',
  },
  {
    id: 'model',
    kind: 'model',
    eyebrow: 'The model',
    headline: 'One loop, run twice. Two products, community-designed.',
    body: 'The Stretch Bed and Pakkimjalki Kari, the washing machine Dianne Stokes named in Warumungu, both came through the same loop, in different community hands each time. Every product into a home feeds back into the next design, and the plant itself is built to be handed over, place by place.',
    photo: '/images/process/factory-panorama.jpg',
    photoAlt: 'The containerised plant on Country',
    steps: [
      'Listen: the community names the need',
      'Design in community: specs from lived conditions',
      'Make on Country: the containerised plant, local makers',
      'Deliver and feed back: beds into homes, feedback into design',
      'Transfer and support: the plant moves toward community hands',
    ],
    gallery: [
      { src: '/images/process/01-source.jpg', alt: 'Plastic collected around community' },
      { src: '/images/process/shredded-chips-weighed.jpg', alt: 'Shredded HDPE, weighed' },
      { src: '/images/process/pressed-sheets.jpg', alt: 'Pressed recycled-plastic sheets' },
      { src: '/images/process/container-factory.jpg', alt: 'The containerised plant' },
    ],
    goDeeper: [
      { label: 'How it is made', href: '/process' },
      { label: 'Inside the facility', href: '/wiki/manufacturing/facility-manual' },
    ],
    script:
      'Goods is one loop, run twice. Listen. Design in community. Make on Country. Deliver and feed back. Transfer and support. The Stretch Bed came through that loop, and so did Pakkimjalki Kari, the washing machine Dianne Stokes designed and named in Warumungu. Two products, different community hands each time: Elders designing around the fire, a family building the current machines with Nic, young people building beds through Oonchiumpa. Every product into a home feeds back into the next design. And the plant itself is built to be handed over, place by place, with Goods staying on as support rather than owner.',
    note: 'Five-stage loop, narrative-foundation §1. Two-product loop: Pakkimjalki Kari is the second proof, not a side product.',
  },
  {
    id: 'turn-1',
    kind: 'turn',
    eyebrow: 'Turn 1',
    headline: 'The need is real, and people name it themselves.',
    body: 'Sit on the dirt. Leave the pen alone. Listen long enough for the idea to change. Before any bed lands, the community names the need, in its own words, not ours.',
    photo: '/images/media-pack/nic-with-elder-on-verandah.jpg',
    photoAlt: 'Nic listening with an Elder on a verandah',
    voiceNames: ['Ivy', 'Katrina Bloomfield'],
    voiceAlternates: ['Linda Turner', 'Melissa Jackson'],
    literalQuotes: [
      { text: 'We\'ve been sleeping on a door.', attribution: 'Arlparra household' },
      { text: 'Off the ground. That\'s the main thing.', attribution: 'Arlparra Elder' },
    ],
    gallery: [
      { src: '/images/media-pack/community-testing-bed-golden-hour.jpg', alt: 'Trying the bed in community, golden hour' },
      { src: '/images/media-pack/goods-early-2023-community.jpg', alt: 'Early days: listening in community, 2023' },
      { src: '/images/media-pack/community-bed-assembly.jpg', alt: 'Community members assembling a bed' },
    ],
    goDeeper: [
      { label: 'The communities', href: '/communities' },
      { label: 'Community stories', href: '/stories' },
    ],
    script:
      'We came with prototypes and more certainty than we should have had. Gary in Mount Isa described consultation as sitting on the grass or dirt, around the fire, without the pen and paper, and listening. His words exposed something uncomfortable. Asking is easy. The hard part is staying quiet when the answer begins to undo your idea. People spoke about family coming to stay and too few beds in the house. Freight. Mattresses on floors. Snakes. Sore knees. In Arlparra, a household told us they had been sleeping on a door. People already understood all of this. They did not need us to diagnose their lives. We were the ones catching up.',
    note: 'Turn 1, narrative-foundation §2. Anonymous Arlparra lines are usable unnamed (community-narrative.ts). Gary\'s fire-and-dirt description VERIFIED against his transcript 2026-07-15 (near-verbatim; interview is substantially about Goods). Narration is faithful; promoting the exact line to an on-screen registry quote is Ben\'s call.',
  },
  {
    id: 'turn-2',
    kind: 'turn',
    eyebrow: 'Turn 2',
    headline: 'The supply that already exists fails these places.',
    body: 'Freight, cost and distance break the ordinary supply chain long before it reaches the community.',
    photo: '/images/community/kalgoorlie/mattress-dumped-jerry-can.jpg',
    photoAlt: 'A failed mattress dumped on red dirt near Kalgoorlie',
    voiceNames: ['Alfred Johnson', 'Daniel Patrick Noble'],
    voiceAlternates: ['Ivy', 'Jason'],
    gallery: [
      { src: '/images/community/kalgoorlie/dump-site-dawn.jpg', alt: 'A bushland dumping ground at dawn: fridges, mattresses, a couch' },
      { src: '/images/community/kalgoorlie/mattress-ochre.jpg', alt: 'A foam mattress dyed the colour of the dirt it was abandoned on' },
      { src: '/images/community/kalgoorlie/mattress-decayed.jpg', alt: 'A sun-bleached mattress rotting into the scrub' },
    ],
    goDeeper: [{ label: 'What a bed really costs', href: '/cost-story' }],
    script:
      'A product made for a quiet suburban bedroom does not always survive a large family, constant movement, heat and dust. And most products never get there at all. Alfred Johnson on Palm Island put it plainly: you have to bring them on the barge, you have to pay for freight, and it all adds up. Daniel Patrick Noble told us what that arithmetic means: sometimes people would rather go without. Freight, cost and distance break the ordinary supply chain long before it reaches the community. Remote families pay too much for goods that fail too quickly. They can be made better.',
    note: 'Turn 2, narrative-foundation §2. Photo gap CLOSED 15 July: the Kalgoorlie dump/mattress series shows the supply failure itself, no people, place-attributed. "The two price tags" diagram draft awaits approval.',
  },
  {
    id: 'turn-3',
    kind: 'turn',
    eyebrow: 'Turn 3',
    headline: 'The products work because community designed them. Both of them.',
    body: 'Washable canvas. Replaceable parts. A height older people could get out of. The specs come from lived conditions, and the Stretch Bed and the washing machine Dianne named both carry them.',
    photo: '/images/product/stretch-bed-hero.jpg',
    photoAlt: 'The Stretch Bed, community-designed',
    voiceNames: ['Dianne Stokes', 'Dorrie Jones', 'Melissa Jackson', 'Patricia Frank'],
    voiceAlternates: ['Heather Mundo'],
    chips: [
      { label: 'Weight', value: '26kg' },
      { label: 'Capacity', value: '200kg' },
      { label: 'Assembly', value: 'No tools, ~5min' },
      { label: 'Material', value: 'Recycled HDPE + canvas' },
      { label: 'Washer base', value: 'Speed Queen, one-button' },
    ],
    inlineVideo: {
      src: '/video/stretch-bed-desktop.mp4',
      poster: '/video/stretch-bed-poster.jpg',
      mode: 'loop',
    },
    gallery: [
      { src: '/images/pitch/bed-seq-1-leg-pole.jpg', alt: 'Assembly, step one: a leg and a pole' },
      { src: '/images/pitch/bed-seq-2-legs-pole.jpg', alt: 'Assembly, step two: both legs on the pole' },
      { src: '/images/pitch/bed-seq-3-all-parts.jpg', alt: 'Every part of the Stretch Bed, laid out' },
      { src: '/images/pitch/bed-canvas.jpg', alt: 'The washable canvas sleeping surface' },
      { src: '/images/product/washing-machine-name.jpg', alt: 'Pakkimjalki Kari: the name plate on the washing machine' },
    ],
    goDeeper: [
      { label: 'The Stretch Bed', href: '/stretch-bed' },
      { label: 'Pakkimjalki Kari', href: '/wiki/products/washing-machine' },
    ],
    script:
      'People showed us what the last bed got wrong, and the next one changed. Washable canvas. Replaceable parts. A flat pack for the road. No toolbox needed. A height that gave older knees a fair chance. The Stretch Bed is made from those corrections. Every version carries the fingerprints of people who told us the last one was not good enough. The washing machine followed the bed; one without the other left the job half done. Dianne Stokes designed it and named it Pakkimjalki Kari. She says that every time she goes away, it is like it is calling her: come back home.',
    note: 'Turn 3, narrative-foundation §2-3. Dianne\'s PRIMARY quote is Pakkimjalki Kari; her totem line is HOLD — never surface it. Specs from products.ts. Health carried by Patricia Frank + Dr Boe Remenyi (labelled practitioner); the why only, never an outcome.',
  },
  {
    id: 'turn-4',
    kind: 'turn',
    eyebrow: 'Turn 4',
    headline: 'The making belongs in community hands. Young people are one proof; families are another.',
    body: 'The Bloomfield family built the current washing machines with Nic. Young makers built the Utopia beds through Oonchiumpa. Different hands, the same loop. The direction of the request is changing: from receiving products to making them.',
    photo: '/images/build/build-001.jpg',
    photoAlt: 'Young people building a bed on Country',
    voiceNames: ['Mykel', 'Fred Campbell', 'Karen Liddle', 'Kristy Bloomfield'],
    voiceAlternates: ['Katrina Bloomfield'],
    video: {
      label: 'Mykel, in his own voice',
      href: '/field-notes/utopia-may-2026',
      note: 'At his house, putting the bed together. Already live and public.',
    },
    inlineVideo: {
      src: '/video/partners/oonchiumpa/mykel-building-the-bed.mp4',
      poster: '/video/partners/oonchiumpa/mykel-building-the-bed-poster.jpg',
      mode: 'feature',
      label: 'Mykel, building his bed at home, in his own voice',
    },
    gallery: [
      { src: '/images/build/build-009.jpg', alt: 'Build day with Oonchiumpa, Alice Springs' },
      { src: '/images/build/build-025.jpg', alt: 'Young makers assembling beds' },
      { src: '/images/community/unplaced/rec-assembly-03-threading-pole.jpg', alt: 'Kids threading a steel pole through the canvas sleeve' },
      { src: '/images/community/unplaced/rec-assembly-07-wheelchair-guide.jpg', alt: 'An Elder guiding two young builders through the canvas fit' },
    ],
    goDeeper: [{ label: 'The Utopia field note', href: '/field-notes/utopia-may-2026' }],
    script:
      'The work with Oonchiumpa in Alice Springs pushed the question to the front. Young people built beds outside the office before the Utopia trip. Mykel said, "Yeah, I\'ll be rocking up every day to make them." He was not talking about attending a program. He was talking about making something his community needed. Fred, his case worker, tells the story of Xavier going back to family, so proud showing them that he can build it. And the Bloomfield family built the current washing machines with Nic. Different hands, the same loop. Mykel made us look at the supply chain from the other end: why did the making, the wage and the machinery keep beginning somewhere else?',
    note: 'Turn 4, narrative-foundation §2. Fred narrates Xavier — never a direct Xavier quote. Mykel on screen is always the registry verbatim, never a paraphrase.',
  },
  {
    id: 'hinge-truck-test',
    kind: 'hinge',
    eyebrow: 'The hinge',
    headline: 'The product is proven. The transfer is not.',
    body: 'What came in on the truck? What leaves on it? What stays? If the beds stay while the wages, tools, knowledge and decisions leave with us, the old arrangement has survived the delivery.',
    photo: '/images/utopia/utopia-09.jpg',
    photoAlt: 'A delivery day on Country, Utopia',
    chips: [
      { label: 'Delivered · beds', value: '496 across 9 communities' },
      { label: 'Delivered · washing machines', value: '16 in community' },
      { label: 'Delivered · plastic diverted', value: '2,660kg' },
    ],
    inlineVideo: {
      src: '/video/partners/centrecorp/utopia-delivery-road.mp4',
      poster: '/video/partners/centrecorp/utopia-delivery-road-poster.jpg',
      mode: 'loop',
    },
    gallery: [
      { src: '/images/utopia/utopia-02.jpg', alt: 'Delivery day, Utopia homelands' },
      { src: '/images/utopia/utopia-05.jpg', alt: 'Beds arriving on Country' },
      { src: '/images/community/palm-island/bedding-golden-hour.jpg', alt: 'Kids carrying new bedding home at golden hour, Palm Island' },
    ],
    goDeeper: [
      { label: 'Every number, audited', href: '/register' },
      { label: 'One bed\'s life', href: '/bed/GB0-156-40' },
    ],
    script:
      'The beds are real. The deliveries are real. 496 beds across nine communities. Sixteen washing machines in community. 2,660kg of plastic diverted. People have assembled them, used them and asked for more. But a delivery count does not tell us where the work, tools, contracts, margin or decisions sit. The truck is a useful test for this whole project. What came in on it? What leaves on it? What stays? If the beds stay but the jobs, tools, knowledge and decisions leave with us, then we have delivered a product and preserved the old arrangement.',
    note: 'The truck test, adopted from Ben\'s 14 July draft (core-messaging doc §2-3). The one framing device, used once — Ben\'s rule. 2,660kg is Stretch-only provenance (133 × 20kg). Photo is place-attributable (Utopia).',
  },
  {
    id: 'turn-5',
    kind: 'turn',
    eyebrow: 'Turn 5',
    headline: 'The plant makes the pattern transferable. Ownership is the promise, and it is not true yet.',
    body: 'The containerised plant is visible, teachable and movable: Alice to Tennant Creek to Katherine to Darwin. But a plant is an operating system: orders, wages, safety, maintenance, working capital, quality, governance. Handed over without that system, it becomes another dead machine at the edge of town. Ownership is a pathway. What has to move: title, contracts, margin, knowledge, decisions.',
    photo: '/images/process/heat-press-full.jpg',
    photoAlt: 'The heat press — the one move at the heart of the plant',
    voiceNames: ['Norman Frank', 'Shayne Bloomfield'],
    voiceAlternates: ['Karen Liddle', 'Dianne Stokes'],
    chips: [
      { label: 'Requested · Oonchiumpa', value: 'Interest in owning a plant' },
      { label: 'Requested · PICC', value: 'Asked to buy a facility' },
      { label: 'Requested · Dianne', value: 'Came back to self-fund 20 beds' },
    ],
    inlineVideo: {
      src: '/video/recycling-plant-desktop.mp4',
      poster: '/video/recycling-plant-poster.jpg',
      mode: 'loop',
    },
    gallery: [
      { src: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg', alt: 'The Oonchiumpa team with a finished Stretch Bed and stacked leg components' },
      { src: '/images/process/heat-press-detail.jpg', alt: 'The heat press, up close' },
      { src: '/images/process/cnc-router-full.jpg', alt: 'CNC cutting the leg components' },
      { src: '/images/process/parts-rack-sorted.jpg', alt: 'Cut parts, racked and sorted' },
      { src: '/images/process/color-samples.jpg', alt: 'Recycled-plastic colour samples' },
    ],
    goDeeper: [
      { label: 'How it is made', href: '/process' },
      { label: 'The impact model', href: '/impact' },
    ],
    script:
      'Dropping machinery in a community would be the easy part. Keeping it operating is another matter. People need wages and enough orders to support them. There is safety training, maintenance, quality control and the gap between buying materials and being paid. A facility handed over without that support can become another dead machine sitting at the edge of town. Goods is not yet a community-owned production system, and we will not use the word ownership as decoration. Oonchiumpa has asked about owning a plant. PICC has asked to buy a production facility. These are requests, not settled deals. We are moving closer to community ownership, and we have to be explicit about what Goods holds today, what can move, on what timetable, and what support remains after it does.',
    note: 'Turn 5, narrative-foundation §2 merged with the 14 July operating-system framing. Ownership is a PATHWAY, never claimed complete (locked by Ben 2026-07-10). Demand signals are labelled requested — an invitation is not a mandate.',
  },
  {
    id: 'ask',
    kind: 'ask',
    eyebrow: 'Turn 6 · The ask',
    headline: 'What the capital does, once, near the end.',
    body: 'The funding buys the bridge: the 50-bed in-source run (modelled, then measured), the first place-based ownership pathway with Oonchiumpa, the enterprise-support layer, and plant capex. AU$400K through QBE Catalysing Impact, matched at least 1:1 by signed external commitments. The target match stack (SEFA $300K, Snow $100K, Centrecorp $75K) is proposed today, not signed. Ordinary capital will not fund this stage, because the return being built is the transfer itself.',
    photo: '/images/qbe/communities-screen.png',
    photoAlt: 'The nine communities served, on the map',
    chips: [
      { label: 'Measured · revenue (accountant-signed carve-out)', value: 'AU$713,827' },
      { label: 'Proposed · the ask', value: 'AU$400K QBE Catalysing Impact' },
      { label: 'Gate', value: 'Signed LOIs by 31 Aug 2026' },
    ],
    goDeeper: [
      { label: 'Every number, audited', href: '/register' },
      { label: 'Where $750 goes', href: '/cost-story' },
      { label: 'The impact model', href: '/impact' },
    ],
    script:
      'We are not asking you to rescue a community or sponsor a delivery photograph. The funding buys the bridge: the first 50-bed production run in our own plant, taking the cost model from modelled to measured; the first place-based ownership pathway with Oonchiumpa; the enterprise-support layer; and plant capital. AU$400K through QBE Catalysing Impact, matched at least one to one by signed external commitments. We need those signed letters by 31 August. Ordinary capital will not fund this stage, because the return we are building is the transfer itself: assets, jobs and authority moving to community hands. We ask partners to accept that trust moves more slowly than a grant deadline.',
    note: 'Turn 6, narrative-foundation §2/§5. Every number audits back to /register. Revenue LOCKED to the $713,827 carve-out on all external surfaces. Match stack is PROPOSED (0 signed LOIs today) — never shown as committed. QBE prefers repayable structures; structure not settled, so "recoverable" is not promised. 31 Aug = LOI gate; application Sept, outcomes Nov.',
  },
  {
    id: 'closing',
    kind: 'closing',
    eyebrow: 'The promise',
    headline: 'We know what we need. Sit down and ask us, make it with us, and leave the making with us.',
    body: 'A Goods synthesis, assembled from what people have told us; no one person said this sentence. The funding buys the middle of the sentence, so communities can own the end of it.',
    photo: '/images/media-pack/lying-on-stretch-bed.jpg',
    photoAlt: 'Resting on a Stretch Bed, off the ground',
    gallery: [
      { src: '/images/community/alice-springs/stretch-bed-two-generations.jpg', alt: 'Two generations sharing a new Stretch Bed on Country' },
      { src: '/images/community/unplaced/rec-bed-done-joy.jpg', alt: 'Two kids laughing on the Stretch Bed they just built' },
      { src: '/images/community/alice-springs/oonchiumpa-office-joy.jpg', alt: 'The Oonchiumpa team testing a Stretch Bed, laughing' },
      { src: '/images/media-pack/woman-on-red-stretch-bed.jpg', alt: 'Resting on a red Stretch Bed' },
      { src: '/images/community/alice-springs/stretch-bed-kids-pile.jpg', alt: 'A pile of kids claiming two new Stretch Beds' },
    ],
    goDeeper: [
      { label: 'Back the work', href: '/get-involved' },
      { label: 'Talk to us', href: '/contact' },
    ],
    script:
      'We have been using one sentence to hold all of this. We know what we need. Sit down and ask us, make it with us, and leave the making with us. No one person said that whole sentence. We assembled it from what people have told us and from the direction they have pushed the work. Each part makes a demand on us: whether we believe the knowledge already in community, whether we can listen long enough to have our plans changed, who is being paid, and what stays after we leave. Community is the subject of the first beat and the last. Goods only appears in the middle, as the verb.',
    note: 'Closing. The synthesis is NEVER rendered in quotation marks and never attributed to a community member (essay rule). Credit rule (spine): they said, it changed, it returned.',
  },
];
