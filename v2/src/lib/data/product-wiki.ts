// Product wiki — the full, well-written page content for each Goods product and
// the plant, plus the long-form Goods story. Narrative is drawn from the Notion
// "Full Project History" page and the compendium; EVERY figure is held to the
// current canon (asset-canonical.ts + products.ts), never the older 496/133/16
// numbers the source history was written against. Prose follows the brand voice:
// no em dashes, straight quotes, "On Country" capitalised, "co-design" banned,
// ownership as a pathway, scabies-to-RHD as the why only (never a health claim).
//
// Media paths are web-servable (v2/public/images + v2/public/video). Voices are
// pointers to named storytellers, not fabricated quotes — cleared quote text
// renders from the registry / Voice Impact model, which is the consent authority.

import { STRETCH_BED, WASHING_MACHINE, BASKET_BED } from './products';
import { CANONICAL_ASSETS } from './asset-canonical';

export type ProductStatus = 'flagship' | 'prototype' | 'open-source' | 'plant';

export interface WikiMedia {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  caption: string;
}

export interface WikiSpec { label: string; value: string }
export interface WikiMaterial { name: string; detail: string; image?: string }
export interface WikiVoice { name: string; role: string; note: string }

export interface WikiSection {
  id: string;
  title: string;
  body: string[];
  image?: string;
  video?: string;
  videoPoster?: string;
  pullQuote?: { text: string; who: string };
}

export interface ProductWiki {
  slug: string;
  name: string;
  status: ProductStatus;
  statusLabel: string;
  eyebrow: string;
  tagline: string;
  hero: { image?: string; video?: string; poster?: string };
  jumpSections: { id: string; label: string }[];
  intro: string[];
  sections: WikiSection[];
  specs?: WikiSpec[];
  materials?: WikiMaterial[];
  media: WikiMedia[];
  voices?: WikiVoice[];
  cost?: { line: string; href: string };
  knowledgeSources: string[];
}

const V = '/video';
const P = '/images';

// ---------------------------------------------------------------------------
// The Stretch Bed — flagship
// ---------------------------------------------------------------------------
const STRETCH: ProductWiki = {
  slug: 'stretch-bed',
  name: STRETCH_BED.name,
  status: 'flagship',
  statusLabel: 'Flagship · for sale',
  eyebrow: 'The bed that holds the whole idea',
  tagline: STRETCH_BED.tagline,
  hero: { video: `${V}/stretch-bed-desktop.mp4`, poster: `${V}/stretch-bed-poster.jpg`, image: `${P}/product/stretch-bed-hero.jpg` },
  jumpSections: [
    { id: 'story', label: 'The story' },
    { id: 'how', label: 'How it stands' },
    { id: 'assembly', label: 'Assembly' },
    { id: 'materials', label: 'Materials' },
    { id: 'media', label: 'Media' },
    { id: 'voices', label: 'Voices' },
    { id: 'costs', label: 'Costs' },
  ],
  intro: [
    'The Stretch Bed is the current flagship and the first product Goods sells directly. It is a flat-packable, washable bed built for the conditions of remote Australia: heat, dust, crowding, hard travel and a repair network that is often hundreds of kilometres away.',
    'It is not a cheaper version of a city bed. It is a different object, designed around what communities said they needed and what the place actually demands.',
  ],
  sections: [
    {
      id: 'story',
      title: 'Why the bed exists',
      body: [
        'Goods started with a bed because a bed is immediate and understandable. Beds and mattresses are not neutral commodities in remote communities. Field notes and community voices describe overcrowding, family visits, too few beds, and mattresses on the floor, alongside the high price of bringing bulky goods a long way from a city retailer.',
        'The point of the bed was never to dramatise hardship. It was to treat sleep, space, dignity and household life as legitimate design requirements, and to sit upstream of the environmental-health pathway that runs from crowding and washing access toward scabies and rheumatic heart disease. The bed is health hardware. It is not a medical device, and Goods does not claim a bed prevents disease.',
        `The Stretch Bed is the answer to the first generation of prototypes. Its design changes came from practical corrections: a washable canvas surface, replaceable parts, flat packing, no toolbox required, and a height that is kinder to older knees. It carries the material story too, diverting ${STRETCH_BED.specs.plasticDiverted} into every bed.`,
      ],
      image: `${P}/product/stretch-bed-community.jpg`,
      pullQuote: {
        text: 'Goods started with a bed because a bed is immediate and understandable.',
        who: 'Full project history',
      },
    },
    {
      id: 'how',
      title: 'How it stands: the X-trestle tension design',
      body: [
        'The Stretch Bed is an X-trestle tension design. Two galvanised steel poles thread through the canvas long-edge sleeves and the top holes of two recycled-plastic X-trestle legs. Tensioning the assembly pulls the poles deep into the leg holes, and the canvas becomes structural: it braces the frame. The bed will not stand without it.',
        'There are no screws, no fasteners and no tools. That is a deliberate design decision for a place where a lost bolt or a missing allen key can strand a product. The whole thing goes together in about five minutes and comes apart just as fast for washing or transport.',
      ],
      image: `${P}/product/stretch-bed-legs.jpg`,
    },
    {
      id: 'assembly',
      title: 'Five minutes, no tools',
      body: [
        'Assembly was tested against hundreds of minutes of community feedback. Thread the poles, seat the legs, pull the tension, and the bed is ready. Children build them. Elders build them. The canvas washes and dries quickly, so the bed can be stripped, cleaned and rebuilt without special equipment.',
      ],
      video: `${V}/stretch-bed/assembly.mp4`,
      videoPoster: `${V}/stretch-bed/assembly-poster.jpg`,
    },
  ],
  specs: [
    { label: 'Weight', value: STRETCH_BED.specs.weight },
    { label: 'Load capacity', value: STRETCH_BED.specs.loadCapacity },
    { label: 'Dimensions', value: STRETCH_BED.specs.dimensions },
    { label: 'Assembly', value: `${STRETCH_BED.specs.assemblyTime}, no tools` },
    { label: 'Design life', value: STRETCH_BED.specs.designLifespan },
    { label: 'Warranty', value: '5 years' },
    { label: 'Plastic diverted', value: STRETCH_BED.specs.plasticDiverted },
    { label: 'Price', value: '$750' },
  ],
  materials: [
    { name: STRETCH_BED.materials.legs.name, detail: STRETCH_BED.materials.legs.detail, image: `${P}/product/stretch-bed-legs.jpg` },
    { name: STRETCH_BED.materials.frame.name, detail: STRETCH_BED.materials.frame.detail, image: `${P}/product/stretch-bed-poles.jpg` },
    { name: STRETCH_BED.materials.sleepingSurface.name, detail: STRETCH_BED.materials.sleepingSurface.detail, image: `${P}/product/stretch-bed-detail.jpg` },
    { name: STRETCH_BED.materials.joinery.name, detail: STRETCH_BED.materials.joinery.detail },
  ],
  media: [
    { type: 'video', src: `${V}/stretch-bed-desktop.mp4`, poster: `${V}/stretch-bed-poster.jpg`, caption: 'The Stretch Bed in community' },
    { type: 'video', src: `${V}/partners/oonchiumpa/mykel-building-the-bed.mp4`, poster: `${V}/partners/oonchiumpa/mykel-building-the-bed-poster.jpg`, caption: 'Mykel building the bed' },
    { type: 'image', src: `${P}/product/stretch-bed-in-use.jpg`, caption: 'In use' },
    { type: 'image', src: `${P}/product/stretch-bed-kids-building.jpg`, caption: 'Kids building a bed' },
    { type: 'image', src: `${P}/product/stretch-bed-assembled.jpg`, caption: 'Assembled' },
    { type: 'image', src: `${P}/build/build-073.jpg`, caption: 'Build day' },
  ],
  voices: [
    { name: 'Dianne Stokes', role: 'Warumungu Elder, Tennant Creek', note: 'Received a bed and returned within two weeks asking for more for her community. Demand as design evidence.' },
    { name: 'Mykel', role: 'Oonchiumpa, builder', note: 'Filmed building the bed on Country.' },
    { name: 'Karen Liddle', role: 'Oonchiumpa', note: 'Speaks to what the beds mean in community.' },
  ],
  cost: { line: 'Sells for $750. In-house marginal cost modelled at $426. See the full breakdown.', href: '/admin/cost-model' },
  knowledgeSources: ['products.ts', 'cost engine', 'asset register', 'media_links', 'Voice Impact', 'Notion project history'],
};

// ---------------------------------------------------------------------------
// Pakkimjalki Kari — washer, prototype
// ---------------------------------------------------------------------------
const WASHER: ProductWiki = {
  slug: 'pakkimjalki-kari',
  name: WASHING_MACHINE.name,
  status: 'prototype',
  statusLabel: 'Prototype · register interest',
  eyebrow: 'A clean bed needs washing access',
  tagline: WASHING_MACHINE.tagline,
  hero: { image: `${P}/product/washing-machine-hero.jpg` },
  jumpSections: [
    { id: 'story', label: 'The story' },
    { id: 'name', label: 'The name' },
    { id: 'media', label: 'Media' },
    { id: 'voices', label: 'Voices' },
  ],
  intro: [
    'Pakkimjalki Kari is the washing-machine companion to the bed. A clean bed without washing access leaves part of the household-health problem unsolved, so the washer sits inside the same environmental-health pathway as the Stretch Bed.',
    'It is built on a commercial-grade Speed Queen base with simplified, one-button operation, and it is in prototype with several communities collecting feedback.',
  ],
  sections: [
    {
      id: 'story',
      title: 'Why a washing machine',
      body: [
        'Goods research describes washing machines lasting roughly one to two years in some remote settings, against ten to fifteen years in the general Australian population. Dust, power variation, hard water, heavy use, vermin, incorrect installation, a lack of repair access and cheaper low-quality machines all contribute.',
        'One Alice Springs provider sells around three million dollars a year of washing machines into remote communities, and many end up in the dump within months. Durable here does not mean only a stronger casing. It means simplifying components, designing for maintenance, documenting repair, and fitting the machine to the actual place.',
        'The goal is to bring the price point down while holding reliability. The washer is not for direct sale yet; communities and partners register interest while the prototype is tested.',
      ],
      image: `${P}/product/washing-machine-installed.jpg`,
    },
    {
      id: 'name',
      title: 'Named in Warumungu',
      body: [
        'Pakkimjalki Kari was named in Warumungu language by Elder Dianne Stokes. The name matters: it is a small, concrete example of the product belonging to the people who use it, rather than arriving branded from somewhere else.',
      ],
      image: `${P}/product/washing-machine-name.jpg`,
      pullQuote: { text: 'Named in Warumungu language by Elder Dianne Stokes.', who: 'Product record' },
    },
  ],
  specs: [
    { label: 'Base unit', value: WASHING_MACHINE.specs.baseUnit },
    { label: 'Operation', value: 'Simplified, one button' },
    { label: 'Status', value: 'Prototype in community' },
    { label: 'In community', value: `${CANONICAL_ASSETS.washersInCommunity} washing machines` },
  ],
  media: [
    { type: 'image', src: `${P}/product/washing-machine-community.jpg`, caption: 'In community' },
    { type: 'image', src: `${P}/product/washing-machine-installed.jpg`, caption: 'Installed' },
    { type: 'image', src: `${P}/product/washing-machine.jpg`, caption: 'The machine' },
  ],
  voices: [
    { name: 'Dianne Stokes', role: 'Warumungu Elder, Tennant Creek', note: 'Named the washing machine in Warumungu language.' },
  ],
  knowledgeSources: ['products.ts', 'asset register', 'fleet telemetry', 'Voice Impact', 'Notion project history'],
};

// ---------------------------------------------------------------------------
// Basket Bed — open source
// ---------------------------------------------------------------------------
const BASKET: ProductWiki = {
  slug: 'basket-bed',
  name: BASKET_BED.name,
  status: 'open-source',
  statusLabel: 'Open source · download the plans',
  eyebrow: 'The first bed, now given away',
  tagline: BASKET_BED.tagline,
  hero: { image: `${P}/product/basket-bed-hero.jpg` },
  jumpSections: [
    { id: 'story', label: 'The story' },
    { id: 'media', label: 'Media' },
  ],
  intro: [
    'The Basket Bed is where Goods began. It is the older, most deployed bed in the register: collapsible plastic baskets, ties and a topper. It was practical, transportable and able to get into community quickly.',
    `${CANONICAL_ASSETS.basketBedsDeployed} Basket Beds are in the field, tested over years. Goods is discontinuing sales and open-sourcing the design so anyone can build one.`,
  ],
  sections: [
    {
      id: 'story',
      title: 'The first real field base',
      body: [
        'The Basket Bed created the first real field base for the whole project. It also exposed the next set of problems: toppers that could not be fully washed, questions about long-term durability, and the difference between delivering a useful prototype and having a product system that can be repaired, supported and reproduced.',
        'Everything learned from the Basket Bed fed directly into the Stretch Bed. Rather than retire the design quietly, Goods is open-sourcing the documentation so the knowledge stays in circulation.',
      ],
      image: `${P}/product/basket-bed-hero.jpg`,
    },
  ],
  specs: [
    { label: 'Variants', value: (BASKET_BED.variants as readonly string[]).join(', ') },
    { label: 'In the field', value: `${CANONICAL_ASSETS.basketBedsDeployed} Basket Beds` },
    { label: 'Status', value: 'Open source' },
  ],
  media: [
    { type: 'image', src: `${P}/product/basket-bed-hero.jpg`, caption: 'The Basket Bed' },
    { type: 'image', src: `${P}/build/build-001.jpg`, caption: 'Early builds' },
  ],
  knowledgeSources: ['products.ts', 'asset register', 'Notion project history'],
};

// ---------------------------------------------------------------------------
// The Plant — the one move
// ---------------------------------------------------------------------------
const PLANT: ProductWiki = {
  slug: 'the-plant',
  name: 'The Plant',
  status: 'plant',
  statusLabel: 'The one move',
  eyebrow: 'Make it On Country',
  tagline: 'Collect plastic, shred, press, build. The plant that makes the legs can move to community ownership.',
  hero: { video: `${V}/recycling-plant-desktop.mp4`, poster: `${V}/recycling-plant-poster.jpg`, image: `${P}/process/containers-wide-angle.jpg` },
  jumpSections: [
    { id: 'story', label: 'The one move' },
    { id: 'process', label: 'The process' },
    { id: 'machines', label: 'The machines' },
    { id: 'ownership', label: 'Ownership' },
    { id: 'media', label: 'Media' },
  ],
  intro: [
    'The plant is the move that changes the story. It is a containerised, mobile plastic re-production facility: two containers, one for shredding and one for pressing and building. It turns community-collected plastic waste into the recycled-HDPE parts that make a bed.',
    'When the making happens On Country, the wages, the tools, the contracts, the margin and the knowledge can stay there too. That is the difference between delivering a product and moving an industry.',
  ],
  sections: [
    {
      id: 'story',
      title: 'The one move',
      body: [
        'For most of the project, the question was whether Goods could make and deliver a useful product. The plant moves the question to a harder and more valuable place: what machinery, skills, documentation, cost evidence and operating support would let the making happen closer to Country?',
        'Owning the plastic processing is also what turns the economics around. When a bed is assembled from bought-in parts, almost nothing stays in community. When the plant presses its own legs from free, community-collected plastic, the same bed leaves far more behind.',
      ],
      image: `${P}/process/container-factory.jpg`,
      pullQuote: {
        text: 'Better goods are not enough if the knowledge, income, machinery and decisions still leave on the same truck they arrived on.',
        who: 'Full project history',
      },
    },
    {
      id: 'process',
      title: 'Collect, shred, press, build',
      body: [
        'Community-collected HDPE waste is sorted and shredded into flake. The flake is heat-pressed at 180 degrees into solid sheet. The sheet is cut and formed into the X-trestle legs, which are assembled with the steel poles and canvas into a finished bed. The same press can make other HDPE goods with different moulds: wall panels, shelving, table tops and more.',
      ],
      video: `${V}/recycling-plant-desktop.mp4`,
      videoPoster: `${V}/recycling-plant-poster.jpg`,
    },
    {
      id: 'ownership',
      title: 'A pathway to community ownership',
      body: [
        'The plant is designed to move to community ownership. That transfer has not happened yet, and Goods is careful never to claim it has. The pathway is being built through a first measured production run, a first community operator on payroll, quality control and maintenance, working capital, and a clear transfer of rights and decisions.',
        'The stated goal of the whole enterprise is to become unnecessary: to move title, contracts, margin, knowledge and decisions into community hands, and then step back.',
      ],
      image: `${P}/process/01-source.jpg`,
    },
  ],
  specs: [
    { label: 'Type', value: 'Containerised mobile facility' },
    { label: 'System', value: 'Two containers: shred + press/build' },
    { label: 'Press temperature', value: '180°C' },
    { label: 'Capacity', value: '~30 beds/week when deployed' },
    { label: 'Plastic per bed', value: '20kg HDPE' },
    { label: 'Investment', value: '~$100K to date (TFN + ACT)' },
  ],
  materials: [
    { name: 'Shredder', detail: 'Reduces collected HDPE to flake', image: `${P}/process/shredded-plastic-tubs.jpg` },
    { name: 'Heat press', detail: '180°C, presses flake into solid sheet', image: `${P}/process/hydraulic-press.jpg` },
    { name: 'CNC router', detail: 'Cuts sheet into the X-trestle leg forms', image: `${P}/process/cnc-emergency-stop.jpg` },
    { name: 'Cooling rack + flip table', detail: 'Sets and handles the pressed sheet' },
  ],
  media: [
    { type: 'video', src: `${V}/recycling-plant-desktop.mp4`, poster: `${V}/recycling-plant-poster.jpg`, caption: 'The plant' },
    { type: 'image', src: `${P}/process/shredded-plastic-tubs.jpg`, caption: 'Shredded HDPE flake' },
    { type: 'image', src: `${P}/process/hydraulic-press.jpg`, caption: 'The heat press' },
    { type: 'image', src: `${P}/process/containers-wide-angle.jpg`, caption: 'The two-container system' },
    { type: 'image', src: `${P}/process/cnc-emergency-stop.jpg`, caption: 'CNC cutting' },
  ],
  cost: { line: 'Owning the plastic processing turns a $65 contribution per bed into $324. See the cost story.', href: '/admin/cost-model' },
  knowledgeSources: ['products.ts', 'cost engine', 'facility page', 'Notion project history'],
};

export const PRODUCT_WIKIS: ProductWiki[] = [STRETCH, WASHER, BASKET, PLANT];

export function getProductWiki(slug: string): ProductWiki | undefined {
  return PRODUCT_WIKIS.find((p) => p.slug === slug);
}

// ---------------------------------------------------------------------------
// The full Goods story — long-form, current-canon-safe.
// ---------------------------------------------------------------------------
export interface StorySection { id: string; heading: string; body: string[]; image?: string; video?: string; videoPoster?: string }

export const GOODS_STORY: { intro: string[]; oneSentence: string; sections: StorySection[] } = {
  intro: [
    'Goods is a remote-community product and production project that began with a simple but difficult question: what happens when the essential things a household needs, a bed, a washing machine, a fridge, are expensive to freight, poorly matched to local conditions, hard to repair, and repeatedly replaced?',
    'The answer is not only to make a better product. It is to build a different loop: sit down and listen in community, design around what people say and what the place demands, make or assemble it with community participation, deliver it and learn from what happens after the handover, track repair and movement and condition without turning households into surveillance subjects, and move the work, wages, tools, contracts, margin, knowledge and decisions closer to community control.',
  ],
  oneSentence:
    'Goods started with a bed because a bed is immediate and understandable. It became a washing-machine and household-goods project because one product cannot solve a broken home supply chain. It became an asset-tracking project because delivery is not the end of care. It became a production and ownership project because better goods are not enough if the knowledge, income, machinery and decisions still leave the community on the same truck they arrived on.',
  sections: [
    {
      id: 'where-it-came-from',
      heading: 'Where the project came from',
      body: [
        'The origin runs through three connected threads. First, Nicholas Marchesi heard Dr Bo Reményi speak about rheumatic heart disease and the relationship between preventable disease and environmental health. The point was not that a bed is a medical device. It was that the conditions in which people live, sleeping surfaces, washing access, crowding, water and power, shape health long before a patient reaches a clinic.',
        'Second, Nicholas’s work with Orange Sky between 2016 and 2020 exposed the dignity and practical value wrapped up in ordinary household goods. A working washing machine affects connection, confidence, routine and a family’s ability to care for itself.',
        'Third, Ben Knight’s background in youth refuges, corrective services, AIME and storytelling brought a parallel lesson: community knowledge cannot be an afterthought attached to a product designed somewhere else. The work has to let people change the product, the story and the direction of the project.',
        'The written history records the spark in 2018, the first advisory session on 24 November 2022, and the formal founding of A Curious Tractor in September 2023, with Goods as one of its core projects.',
      ],
      image: `${P}/media-pack/goods-early-2023-community.jpg`,
    },
    {
      id: 'the-problem',
      heading: 'The problem Goods is trying to solve',
      body: [
        'Remote supply chains are expensive and fragile. Ordinary household goods are often priced as though the household sits next to a city retailer and a repair network. In remote communities the product may arrive by barge or long road freight, and the real cost includes delay, installation, replacement, missing parts, missing repair labour and the cost of disposing of the failed product. On Palm Island, community testimony describes beds arriving by barge with freight that is "very, very dear".',
        'Products fail in conditions they were never designed for. Washing machines that should last ten to fifteen years last one to two in some remote settings. Durable, for Goods, does not mean only a stronger casing. It means simplifying components, designing for maintenance, documenting repair, and fitting the product to the actual place.',
        'Waste is the other side of the procurement problem. A product that fails quickly is a waste problem, a repeat-spend problem and a freight problem at once. Goods links the product to a material loop: what is made, what fails, what can be repaired, what is replaced, what is dumped, and what material can return to production.',
      ],
      image: `${P}/process/01-source.jpg`,
    },
    {
      id: 'products',
      heading: 'From Basket Bed to Stretch Bed to Pakkimjalki Kari',
      body: [
        'The Basket Bed was the first deployed product: collapsible baskets, ties and a topper, practical and transportable. It built the first field base and exposed the next problems, which the Stretch Bed answered with a washable canvas surface, replaceable parts, flat packing and no tools.',
        `The current canon splits ${CANONICAL_ASSETS.bedsDeployed} deployed beds into ${CANONICAL_ASSETS.basketBedsDeployed} Basket Beds and ${CANONICAL_ASSETS.stretchBedsDeployed} Stretch Beds. The Stretch Bed carries the material story: ${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg of modelled HDPE diversion at 20kg per Stretch Bed. This is modelled diversion from the specification, not a weighbridge measurement.`,
        'Pakkimjalki Kari, named in Warumungu language by Elder Dianne Stokes, is the washing-machine companion: a clean bed without washing access leaves part of the household-health problem unsolved.',
      ],
      video: `${V}/stretch-bed-desktop.mp4`,
      videoPoster: `${V}/stretch-bed-poster.jpg`,
    },
    {
      id: 'the-tracker',
      heading: 'Why the asset tracker had to exist',
      body: [
        'The key shift was from tracking orders to tracking physical goods. An order tells you 100 beds were bought. It cannot tell you which bed is in which community, whether it is in use, whether it needs repair, whether it has moved, what failed, or whether the same problem is being paid for again.',
        'Each item has an identity, a place, a lifecycle and an honest record. The system is deliberately care infrastructure, not surveillance infrastructure: the purpose is to repair what can be repaired, replace what must be replaced, learn what fails, avoid waste, and let people give feedback without being monitored. Household-level data, raw scans and precise locations stay behind consent and access rules.',
      ],
      image: `${P}/build/build-105.jpg`,
    },
    {
      id: 'the-plant',
      heading: 'The plant, and the meaning of ownership',
      body: [
        'The centre of gravity moved from "can we make and deliver a useful product?" to "what would let the making happen closer to Country?" The containerised plant shreds community-collected plastic and presses its own bed legs, which is also what turns the economics around: the same bed leaves far more behind when the plastic processing is owned in community.',
        'Goods describes A Curious Tractor as the hub for IP, brand, shared services and capital; Goods on Country as the venture in transition; and future community-controlled production entities as spokes that are not yet established. The ambition is to become unnecessary by moving title, contracts, margin, knowledge and decisions. It is not accurate to say that transfer has already happened. Ownership is a pathway.',
      ],
      video: `${V}/recycling-plant-desktop.mp4`,
      videoPoster: `${V}/recycling-plant-poster.jpg`,
    },
    {
      id: 'honesty',
      heading: 'How to read the evidence',
      body: [
        'Goods labels claims by status: observed, requested, agreed, delivered, measured, modelled, working estimate, proposed. That discipline matters because the system holds historical snapshots, working models, live registers, requests and public claims all at once.',
        'Every number needs a source or an explicit working-estimate label. Every quote, photo and video needs a consent pass. Every external artifact separates proof from ambition. The Deadly Heart Trek of August 2025 is part of the why, not a claimed outcome: Goods explains the environmental-health rationale but never claims a bed prevents disease.',
      ],
      image: `${P}/build/build-089.jpg`,
    },
  ],
};
