/**
 * The Goods story, long form, on the road spine.
 *
 * SOURCE: the Notion page "Goods on Country // The Work That Stays (Full History,
 * 2026)" (3a4ebcf981cf81199636e03a290597fa, working narrative edition 21 July 2026).
 * Ben named it as the story of record on 2026-07-25. Prose here is condensed from
 * that page, not paraphrased away from it.
 *
 * SPINE: `/DECISIONS.md` ruling C. The road is the spine, voices lead each stop, and
 * the model arrives near the END as what the road produced. This file is the SAME
 * seven stops as `deck.ts`, at a different length: the deck carries the compressed
 * slide, this carries the history. `story-road.spine.test.ts` asserts the two stop-id
 * lists stay identical, so a stop cannot be added to one road and not the other.
 *
 * A shared `road-spine.ts` imported by both would be cleaner. It was not done because
 * `deck.ts` was under concurrent edit when this was written; the test is the stand-in
 * and the refactor is safe to do once that work lands.
 *
 * FIGURES: imported from canon, never retyped, per the deck.ts rule. Note that the
 * Notion page carries a FOUNDER-CONFIRMED post-register update (560 beds / 197 stretch
 * / 3,940 kg) which is deliberately NOT used here. Its own header says figures pending
 * register sync must not be restated as audited results, and it names the published
 * register as the public audit surface. Canon follows the register: 540 / 177 / 3,540.
 *
 * TWO CORRECTIONS APPLIED AGAINST THE SOURCE, both from `/DECISIONS.md`:
 *   - Notion calls $713,827 "accountant-signed". Ruling H: it is NOT accountant-signed.
 *     The figure stays, the adjective is `workpaper`. Do not restore Notion's wording.
 *   - Notion states 20 washing machines. Canon is 22 (Ben's 2026-07-21 per-community
 *     ruling). Canon wins.
 *
 * VOICES: `voiceNames` resolve through storyteller-registry.ts, so every quote is
 * consent-tiered and a `hold` voice can never surface. Every name below was checked
 * against cleared-voices.ts when this file was written.
 *
 * MEDIA: every `photo` path below was verified present under `v2/public/` at authoring
 * time. A stop with no cleared asset carries `photo: null` and renders a visible gap
 * rather than a silent fallback, so what is missing stays countable.
 */

import { CANONICAL_ASSETS } from './asset-canonical';

// ── Figures read once, so two chapters cannot state the same number differently ──
const BEDS = CANONICAL_ASSETS.bedsDeployed;
const STRETCH_BEDS = CANONICAL_ASSETS.stretchBedsDeployed;
const BASKET_BEDS = CANONICAL_ASSETS.basketBedsDeployed;
const WASHERS = CANONICAL_ASSETS.washersInCommunity;
const COMMUNITIES = CANONICAL_ASSETS.communitiesServed;
const PLASTIC_KG = CANONICAL_ASSETS.plasticKg;

/** Claims status. Mirrors canon's ClaimLabel; every figure on the page wears one. */
export type StoryClaim = 'verified' | 'workpaper' | 'modelled' | 'target' | 'proposed';

export interface StoryFigure {
  value: string;
  label: string;
  claim: StoryClaim;
}

export interface StoryImage {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * A gap is a slot we know should hold media and does not. Rendered visibly.
 * Silent fallback is how you stop knowing what you are short of.
 */
export interface StoryGap {
  slot: 'photo' | 'video' | 'voice';
  wanted: string;
  reason: string;
}

/**
 * Either a file we host (click-to-play behind a poster) or a Descript embed from
 * the Notion media record. Local is preferred where it exists: it needs no third
 * party, and the poster means nothing downloads until somebody asks for it.
 */
export type StoryVideo =
  | { kind: 'local'; label: string; src: string; poster: string; caption?: string }
  | { kind: 'descript'; label: string; embedUrl: string; caption?: string };

export type StopKind = 'stop' | 'gap' | 'model' | 'economics' | 'money' | 'closing';

export interface StoryStop {
  /** MUST match the corresponding id in deck.ts. Guarded by test. */
  id: string;
  kind: StopKind;
  eyebrow: string;
  headline: string;
  place?: string;
  /** Long-form prose, one string per paragraph. Condensed from the Notion source. */
  chapters: string[];
  /** Registry voices carrying this stop, in display order. Consent-tiered on read. */
  voiceNames?: string[];
  /** Lead image, or null where no cleared asset exists. */
  photo: StoryImage | null;
  gallery?: StoryImage[];
  /**
   * Clips for this stop, in display order.
   *
   * Local clips are click-to-play behind a poster, never autoplaying ambient
   * backgrounds. This is a page somebody reads: the largest ambient files in
   * public/video are 15 to 25MB each, and four of them on one page is a story
   * nobody on a remote connection gets to finish. Poster first, bytes on demand.
   */
  videos?: StoryVideo[];
  figures?: StoryFigure[];
  /** Known missing media, surfaced rather than hidden. */
  gaps?: StoryGap[];
  /** Editorial / provenance note. Never rendered publicly. */
  note: string;
}

export const storyUpdated = '25 July 2026';
export const storySource =
  'Goods on Country // The Work That Stays (Full History, 2026), working narrative edition 21 July 2026';

/**
 * The opening. Deliberately not a stop: the Notion page heads it "A note before the
 * road", and its job is to refuse the arrives-carrying-the-answer frame before any
 * place is named.
 */
export const storyOpening = {
  headline: 'This is not a story in which Goods on Country arrives carrying the answer.',
  chapters: [
    'It is a story about people asking for ordinary things that work, and about a small project learning that a bed can be useful without being the end of the work. A bed can lift a body from the ground. A washing machine can bring the blanket home. A factory can turn discarded plastic into something a family needs.',
    'But if the wages, machinery, contracts, knowledge, margin and decisions still leave the community, the old arrangement remains standing behind the new object.',
    'The deepest ambition of Goods is not to become the largest manufacturer in the centre of the map. It is to build the conditions in which the making can move outward and stay there.',
    'The community voices quoted here are drawn from the cleared Goods storyteller record. They are not decoration around the argument. They are the record of how the argument changed.',
  ],
  photo: {
    src: '/images/product/stretch-bed-community.jpg',
    alt: 'A Stretch Bed in community',
    caption: 'The product is visible. The relationship that changed it is the story.',
  } satisfies StoryImage,
  note: 'Opening image and caption are the Notion page\'s own. The caption is the thesis of the whole page and should not be swapped for a product line.',
};

export const storyStops: StoryStop[] = [
  // ────────────────────────────────────────────────────────── stop 1
  {
    id: 'stop-1-kalgoorlie',
    kind: 'stop',
    eyebrow: 'Stop 1 · Kalgoorlie',
    headline: 'The morning the bed disappeared',
    place: 'Ninga Mia, Kalgoorlie, WA · late 2024',
    chapters: [
      'Before the product had a settled name, Ben Knight and Nic Marchesi brought a strange first bed to Ninga Mia. It was made from collapsible plastic crates, joined beneath a mattress system. It could come apart. It could travel. Parts could be replaced. In the records it moves through several names: the Greate Bed, the Great Bed, the crate bed, and finally the Basket Bed. The name moved because the object was still learning what it was.',
      'Gloria Turner and her relatives helped put it together outside their tent. Then the family went into town, and the bed was left out the front. The visitors had heard kind words about the prototype, but kindness is not proof. A person can say they like an object while its makers are standing there and leave it untouched once the vehicle turns away.',
      'That night the weather came in. Wind. Rain. The team lay awake wondering whether the bed would hold, whether anybody would use it, and whether they had understood anything at all. They returned in the morning. The bed was gone.',
      'They drove around looking for it. Perhaps the wind had taken it. Perhaps it had broken. Perhaps the family had decided the thing was useless. Then they looked inside the tent. Gloria and her relatives had pulled the Basket Bed in so they could sleep together around it.',
      'The two surviving records remember the arrangement differently. The contemporaneous field recording says six people were sleeping in the tent, with three on the first mattress. A later team retelling remembers all six women sleeping on it together. The difference should remain visible. Memory does not become more truthful because a storyteller sands it smooth.',
      'The proof was not that a crate bed had solved housing, or that one night had become a health outcome. The proof was choice. Gloria and her family used it when nobody from Goods was watching.',
    ],
    voiceNames: ['Gloria Turner'],
    photo: {
      src: '/images/people/gloria-turner.jpg',
      alt: 'Gloria Turner, Kalgoorlie',
    },
    gallery: [
      { src: '/images/community/kalgoorlie/dump-site-dawn.jpg', alt: 'A bushland dumping ground at dawn: fridges, mattresses, a couch' },
      { src: '/images/community/kalgoorlie/mattress-ochre.jpg', alt: 'A foam mattress dyed the colour of the dirt it was abandoned on' },
      { src: '/images/community/kalgoorlie/mattress-decayed.jpg', alt: 'A sun-bleached mattress rotting into the scrub' },
    ],
    note: 'The disappearing-bed scene is narration, not a quote: no attributable speaker exists for it. Gloria Turner carries the stop with her registry PRIMARY quote. The two-records discrepancy is kept deliberately per the Notion source; do not resolve it to the cleaner version. Gallery is place-attributed with no people in it, which is why it can carry the supply failure without a consent question.',
  },

  // ────────────────────────────────────────────────────────── stop 2
  {
    id: 'stop-2-tennant-creek',
    kind: 'stop',
    eyebrow: 'Stop 2 · Tennant Creek',
    headline: 'Who gets asked?',
    place: 'Tennant Creek, NT',
    chapters: [
      'In Tennant Creek, Linda Turner asked the question that sits beneath the entire project. The sentence is about housing, but it opens into every ordinary object inside a house.',
      'Who decides what is practical? Who decides what is beautiful? Who decides whether a bed should be lower for an Elder, whether a cover must be washable, whether parts should be replaceable, whether an appliance can be repaired without flying in a technician, whether the name on the object belongs to the place where it will live?',
      'Tennant Creek became a place of repeated return, design and relationship. Jimmy Frank helped push the early bed through experiments. Melissa Jackson made the height question explicit: they like to have lower beds, especially for older people. Annie Morrison looked at the beds and turned interest into demand.',
      'The project was learning that community design is not a workshop stage before manufacturing. It continues through use, language, ordering, repair, employment and the decision about what should be made next.',
      'Goods has learned to distrust consultation that cannot alter the thing being consulted on. If the visit produces photographs and signatures but the product, timetable, contract, ownership and budget remain unchanged, the work has not listened. It has collected evidence for a decision already made.',
      'Gary, a community partner and practitioner, described another way. Sit on the grass. Sit in the dirt. Sit beside the fire. Put down the pen and paper. Explain what you are doing. Let people look and listen. When they are ready, they will try. The first design tool is time.',
    ],
    voiceNames: ['Linda Turner', 'Annie Morrison', 'Gary', 'Norman Frank'],
    photo: {
      src: '/images/people/linda-turner.jpg',
      alt: 'Linda Turner, Tennant Creek',
    },
    note: 'Ruling F gives Tennant Creek two stops because it taught two different things. This is the first. Melissa Jackson and Jimmy Frank are named in the Notion source but are NOT in cleared-voices.ts, so they are referred to in narration only and carry no quote slot; do not promote them to voiceNames without a clearance check. Language rule: the design happens IN community, led by community.',
  },

  // ────────────────────────────────────────────────────────── stop 3
  {
    id: 'stop-3-the-machine-with-a-name',
    kind: 'stop',
    eyebrow: 'Stop 3 · Tennant Creek',
    headline: 'The machine with a name',
    place: 'Tennant Creek, NT · January 2026',
    chapters: [
      'The washing machine entered the work because a bed is not the whole house. A raised, washable bed helps. A family still needs to wash the canvas, blankets, clothes and towels. Advice about hygiene becomes hollow when the machine is absent, broken or four hours away.',
      'Dianne Stokes, a Warumungu and Warlmanpa Elder and Traditional Owner, helped shape the machine and gave it a name in Warumungu: Pakkimjalki Kari. The name is not a label applied after the engineering. It is authorship. The machine enters the world carrying language from the place where its purpose was understood.',
      'The Bloomfield family built five of the current Pakkimjalki Kari machines with Nic in January 2026. The design uses a commercial-grade Speed Queen base, simplified operation and a repair pathway suited to distance. Health organisations then used and reordered machines, turning an idea into early institutional demand.',
      'The machine remains a prototype and register-interest product, not a mature national sales line. The strongest claim is not that it is indestructible. It is that its life is being designed with the people who must use, maintain and repair it.',
    ],
    voiceNames: ['Dianne Stokes', 'Dr Boe Remenyi', 'Patricia Frank'],
    photo: {
      src: '/images/people/dianne-stokes.jpg',
      alt: 'Dianne Stokes, Tennant Creek',
    },
    gallery: [
      {
        src: '/images/product/washing-machine-name.jpg',
        alt: 'The name Pakkimjalki Kari on the machine',
        caption: 'The name is authorship, not a label applied after the engineering.',
      },
      {
        src: '/images/community/maningrida/washer-lid-dusk.jpg',
        alt: 'Opening the washing machine lid at dusk, Maningrida',
        caption: 'Pakkimjalki Kari in use.',
      },
      {
        src: '/images/community/maningrida/group-beside-washer.jpg',
        alt: 'Four people beside a Pakkimjalki Kari washing machine, Maningrida',
      },
    ],
    figures: [
      { value: String(WASHERS), label: 'washing machines in community', claim: 'verified' },
    ],
    gaps: [
      {
        slot: 'video',
        wanted: 'Dianne Stokes on the washing machine',
        reason: 'A Dianne Stokes washing-machine cut is referenced in older material but has never been wired to a playable URL, and it is not in the current media record.',
      },
    ],
    note: 'Dr Boe Remenyi is a PRACTITIONER and must be labelled as such in the UI, not as a community recipient (cleared-voices.ts rule). Washer count is 22 from canon, NOT the 20 in the Notion source: Ben\'s 2026-07-21 per-community ruling supersedes it. Washer count is curated, never row-derived.',
  },

  // ────────────────────────────────────────────────────────── stop 4
  {
    id: 'stop-4-palm-island',
    kind: 'stop',
    eyebrow: 'Stop 4 · Palm Island',
    headline: 'The sea enters the price',
    place: 'Palm Island, QLD',
    chapters: [
      'Palm Island does not need to be introduced as a problem. Ivy begins with the beauty of the island, her grandchildren, the heat and the beach. Then she speaks about what it costs to bring ordinary things home.',
      'Alfred Johnson makes the freight plain, and the phrase is simple. It all adds up. The cost of the bed. The cost of the barge. The cost of bulky packaging. The cost of replacing a product that fails. The cost of a family arriving when there is nowhere obvious to sleep. The cost of an object that cannot be packed, repaired, carried outside or moved into the back of a car.',
      'Daniel Patrick Noble names the choice that follows: sometimes people would rather go without.',
      'Ivy does not become a grateful recipient inside the story. She becomes an evaluator. She notices whether the bed is easier to rise from. She notices whether it can go outside, to camp or beneath shade. She notices whether it is easy to make. Then she places a condition on expansion: it is best to work with more community, like people who want to.',
      'More community, but with people who want to. That sentence is part of the model. Consent is not only a permission form for a photograph. It is the right to decide whether the project comes into the room at all.',
      'Palm Island gave Goods two enduring design requirements. First, the freight route belongs inside the product design. Second, the home is larger than four walls. A bed may have to serve a room, a verandah, a camp, a visit and the movement of kin.',
    ],
    voiceNames: ['Ivy Johnson', 'Alfred Johnson', 'Daniel Patrick Noble'],
    photo: {
      src: '/images/community/palm-island/bedding-golden-hour.jpg',
      alt: 'Bedding carried home on Palm Island',
      caption: 'Palm Island, late light. The last distance between delivery and use still has to be carried.',
    },
    note: 'Ruling C: money enters the story through PLACE, and this is the place. Freight is not a cost slide, it is what Alfred and Daniel describe. Do not lift these figures into a separate economics block; that migration is exactly what ruling C forbids.',
  },

  // ────────────────────────────────────────────────────────── stop 5
  {
    id: 'stop-5-utopia',
    kind: 'stop',
    eyebrow: 'Stop 5 · Utopia',
    headline: 'Arrival is not the ending',
    place: 'Utopia and Urapuntja homelands, NT · May 2026',
    chapters: [
      'In May 2026, Oonchiumpa and Goods travelled the Utopia and Urapuntja homelands with beds supported through the Centrecorp pathway.',
      'Oonchiumpa did not act as a distribution contractor. The organisation carried cultural authority, relationships, the route, the people waiting, the young makers and the meaning of the visit. Beds were built with young people and moved into households through people who knew the Country and families.',
      'The road is part of the work. It is not the ending. A production machine placed at the edge of a town can become another dead machine if there are no orders, wages, safety systems, maintenance, quality standards, transport, working capital and decision rights around it.',
      'Goods began asking a harder question after each delivery. What came in on the truck? What left on it? What stayed?',
      'The beds stayed. Some skills stayed. Relationships deepened. The evidence improved. But the plant, contracts, order book, margin and ownership pathway were not yet held in community. The product had proof. The transfer still needed one.',
    ],
    voiceNames: ['Margaret Lloyd', 'Ray Nelson'],
    photo: {
      src: '/images/utopia/utopia-09.jpg',
      alt: 'Utopia field work, May 2026',
    },
    figures: [
      { value: '147', label: 'beds in the Utopia pathway', claim: 'verified' },
    ],
    videos: [
      {
        kind: 'local',
        label: 'The road out to the homelands',
        src: '/video/partners/centrecorp/utopia-delivery-road.mp4',
        poster: '/video/partners/centrecorp/utopia-delivery-road-poster.jpg',
        caption: 'The road is part of the work. It is not the ending.',
      },
      {
        kind: 'local',
        label: 'Building the beds at Utopia',
        src: '/video/partners/centrecorp/utopia-bed-building.mp4',
        poster: '/video/partners/centrecorp/utopia-bed-building-poster.jpg',
      },
    ],
    note: 'Margaret Lloyd carries this stop: hers is the strongest before-the-delivery line in the corpus and it was unused on every existing surface. Utopia is 147 CONFIRMED. Community OS says 169 and is wrong; do not reconcile toward it. The Notion source notes historical records differ on order and delivery tranches, which is why the register rather than a remembered headline is the count authority. "What came in / what left / what stayed" is the hinge of the whole page: it is where the road turns from product proof to transfer proof.',
  },

  // ────────────────────────────────────────────────────────── stop 6
  {
    id: 'stop-6-maningrida-and-the-farm',
    kind: 'stop',
    eyebrow: 'Stop 6 · The farm and Maningrida',
    headline: 'The first production run',
    place: 'The farm, and Maningrida homelands, NT · July 2026',
    chapters: [
      'The next proof arrived at the farm. Goods had invested in a containerised recycled-plastic production facility: shredding, heating and pressing material into sheets, cutting components, preparing the frame and canvas, assembling, checking and packing the finished bed.',
      'The facility turned the production story from a diagram into work. The July 2026 Maningrida homelands batch was made there: 60 Stretch Beds, accompanied by two washing machines, delivered with Homeland School Company.',
      'This moment changes the investment case. The next proof is no longer whether Goods can make beds through its own production facility. It has. The next proof is what those 60 beds actually cost to make, and whether the line can repeat the result safely, reliably and at a cost that supports local wages and future transfer.',
      'The current cost model remains a model until the Maningrida run ledger is closed. The materials, labour hours, electricity, yield, rejected components, maintenance, packaging, freight and support cost need to be reconciled against the 60 finished beds. A real production run is proof of capability. A closed run ledger is proof of economics.',
      'The Maningrida story also shows the model\'s two-sided demand. Homeland School Company did not ask for an abstract circular-economy demonstration. It needed beds and machines across homelands. The production facility did not make a showcase object. It made a batch with a destination.',
    ],
    photo: {
      src: '/images/community/maningrida/whole-run-at-sunset.jpg',
      alt: 'The whole run of finished Stretch Beds at Gamardi, people sitting on them at sunset',
      caption:
        'Gamardi, build day. The batch had a destination before it was made.',
    },
    gallery: [
      {
        src: '/images/community/maningrida/wordmark-wall.jpg',
        alt: 'A young person drilling beside the Goods wordmark sprayed on a wall at Gamardi',
        caption: 'The community sprayed the wordmark on their own wall.',
      },
      {
        src: '/images/community/maningrida/unrolling-canvas-with-elder.jpg',
        alt: 'Unrolling the brown canvas with an Elder helping, Gamardi School',
      },
      {
        src: '/images/community/maningrida/tensioning-canvas.jpg',
        alt: 'Tensioning the canvas onto the X-legs at Gamardi School',
        caption: 'The canvas is structural. The bed does not stand without it.',
      },
      {
        src: '/images/community/maningrida/kids-carrying-orange-bed.jpg',
        alt: 'Three young people carrying an orange-canvas Stretch Bed across sandy ground',
      },
      {
        src: '/images/process/container-factory.jpg',
        alt: 'The containerised production facility at the farm where the batch was pressed',
      },
      {
        src: '/images/process/hydraulic-press.jpg',
        alt: 'Hydraulic press used in the recycled-plastic process',
      },
    ],
    figures: [
      { value: '60', label: 'Stretch Beds in the first in-house run', claim: 'verified' },
      { value: 'pending', label: 'run ledger closed', claim: 'target' },
    ],
    videos: [
      // Descript, not the local recycling-plant cut, and deliberately so: the
      // top-level mp4s in public/video are gitignored (v2/.gitignore:45, which
      // matches `public/video/*.mp4` and therefore NOT the partner subdirectories).
      // The local file plays perfectly in development and 404s in production. CI
      // caught it. Anything under /video/partners/ or /video/stretch-bed/ IS
      // tracked and safe to use.
      {
        kind: 'descript',
        label: 'Inside the recycling production facility',
        embedUrl: 'https://share.descript.com/embed/haRZJbfJadJ',
        caption: 'Shredding, heating and pressing recycled HDPE into sheet.',
      },
      {
        kind: 'descript',
        label: 'On Country Production Facility, part one',
        embedUrl: 'https://share.descript.com/embed/j6PXvhBP62i',
      },
    ],
    gaps: [
      {
        slot: 'voice',
        wanted: 'A Maningrida voice',
        reason:
          'Confirmed by Ben, 2026-07-25: there is no Maningrida voice yet. This is the one stop on the road carried entirely by our own account of it, and it should say so rather than read as though nobody had anything to say.',
      },
    ],
    note: 'VOICE: none exists, confirmed by Ben 2026-07-25. The only East Arnhem record in the registry is tier `hold` and must not be reached for. The consent-tier detail is kept HERE and deliberately not in the rendered gap text: gap markers are public, and the internal consent state of a named person is not something to publish. Getting a Maningrida voice is a field job, not a data job. PHOTOS: the 10 Maningrida/Gamardi trip photos, consent obtained and evidenced per Ben\'s 2026-07-21 ruling (CONTEXT.md:77), cleared for external use INCLUDING the children, the Elder and the identifiable faces. They lived only in `design/starred-images/`, which is gitignored (.gitignore:80), which is why they had never reached any public surface. Originals stay at `design/deck-photos/maningrida-trip/`. ONE THING STILL OPEN on that ruling: the consent evidence is not pointed at from the repo, so when Ben names where it lives (registry entry, EL consent record or signed form) the reference belongs on the manifest rows. THE FACTORY PATH IS PROVEN: 40+ beds pressed and assembled in-house at the farm, and this batch was 60. NEVER write "zero beds pressed in-house" on any surface; that claim has regressed twice. The before/after framing is the Notion source\'s own and is the honest version: capability proven, economics not yet measured.',
  },

  // ────────────────────────────────────────────────────────── stop 7
  {
    id: 'stop-7-oonchiumpa',
    kind: 'stop',
    eyebrow: 'Stop 7 · Alice Springs',
    headline: 'When the hands changed',
    place: 'Alice Springs, NT',
    chapters: [
      'The decisive turn came when the bed was no longer only carried into community. People in community began making it.',
      'Oonchiumpa Consultancy in Alice Springs became the cultural and relational backbone of this phase. The Bloomfield and Liddle families held the relationships. Young people assembled beds. Families watched. Elders judged the result. The object became evidence that the people in the room could make, not merely proof that Goods could deliver.',
      'Oonchiumpa works with young people who have often been rejected by ordinary employment pathways. The work begins before a shift starts: transport, family, court, trust, mentoring, Country, the pace of the young person and the rule that the door stays open.',
      'Fred Campbell carries Xavier\'s story. Fred describes a young person who understood the pattern, put the bed together, took it back to family and showed them what he could build.',
      'Then there is Mykel. The material begins as discarded plastic. It is shredded and pressed. Steel poles pass through canvas. Legs click into place. Mykel tests the finished bed in the plain language of use. An Elder watches him work and speaks about the possibility of employment. Asked whether he would turn up every day if a place existed to make the beds, he answers without theatre.',
      'That is not a claim that a factory job already exists. It is a door a young person can see himself walking through.',
      'Oonchiumpa is the clearest first partner for the full transfer model. The proposed pathway is concrete: Oonchiumpa leads the young-person and community work, Goods brings the production engine, quality system, buyers, product support and capital pathway. Young people move from short tasters into supervised rotations, paid production and ongoing roles at award rates.',
    ],
    voiceNames: ['Mykel', 'Kristy Bloomfield', 'Karen Liddle', 'Fred Campbell'],
    photo: {
      src: '/images/people/mykel.jpg',
      alt: 'Mykel with the Stretch Bed he helped make',
    },
    gallery: [
      { src: '/images/build/build-001.jpg', alt: 'The build is part of the product' },
      {
        src: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
        alt: 'Oonchiumpa team with a finished Stretch Bed and components',
      },
    ],
    figures: [
      { value: '45 to 60', label: 'young people over three years', claim: 'proposed' },
      { value: '30 beds/week', label: 'mature facility', claim: 'proposed' },
    ],
    videos: [
      {
        kind: 'local',
        label: 'Mykel building the bed',
        src: '/video/partners/oonchiumpa/mykel-building-the-bed.mp4',
        poster: '/video/partners/oonchiumpa/mykel-building-the-bed-poster.jpg',
        caption: 'The hands changed. This is what that looks like.',
      },
      {
        kind: 'local',
        label: 'Karen Liddle on the beds',
        src: '/video/partners/oonchiumpa/karen-liddle-on-beds.mp4',
        poster: '/video/partners/oonchiumpa/karen-liddle-on-beds-poster.jpg',
      },
      {
        kind: 'descript',
        label: 'Community Voices, Fred from Oonchiumpa',
        embedUrl: 'https://share.descript.com/embed/YQwAcYfxzkn',
      },
    ],
    note: 'Xavier is NARRATED BY Fred Campbell and must never be given a borrowed first-person quote, however much cleaner the slide would read; the registry records him as narratedBy. The 45-60 young people and 30 beds/week are PROPOSAL figures, not outcomes, and the Notion source says so explicitly. Ownership is a pathway, never claimed complete.',
  },

  // ────────────────────────────────────────────────────────── the gap
  {
    id: 'gap',
    kind: 'gap',
    eyebrow: 'The gap',
    headline: 'The product had proof. The transfer still needed one.',
    chapters: [
      'Between the Basket Bed and the current Stretch Bed came intermediate woven and frame trials. Community feedback made the same request in different ways: the next bed had to be desirable as well as functional, washable, easier to rise from, flat-packable, repairable and strong enough for real household use. The bed was becoming a small country of corrections.',
      'The Basket Bed was the project\'s first field instrument, and the register holds 363 of them. It was simple enough to make, move and test. It got the team out of the studio and into the harder intelligence of use. People sat on it. Children jumped on it. Families carried it outside. Older people tested the height.',
      'It also revealed its limits. A mattress topper that cannot be fully washed carries a problem into the next night. Cable ties and crate connections raise questions about safety and durability. A prototype that can be distributed quickly is not the same as a product that can be supported for years.',
      'The Basket Bed is therefore part of the achievement and part of the correction. It should not be erased from the history, and it should not be presented as the current Stretch Bed. It has been archived and open-sourced, and it is not counted in the recycled-HDPE claim.',
      'As the bed moved beyond the Basket prototype, Goods formed a partnership with Defy Design in Sydney. The relationship mattered because Defy did not remain in Sydney. The designers came into community, listened directly and worked on the product with the people who would test it. Canvas could be removed and washed. Steel poles could be replaced. Recycled-HDPE legs could be pressed from material otherwise headed toward waste. The parts could travel flat. Assembly could happen without a toolbox. The height could be kinder to older knees.',
    ],
    voiceNames: ['Dorrie Jones', 'Heather Mundo'],
    photo: null,
    figures: [
      { value: String(BASKET_BEDS), label: 'Basket Beds, archived and open-sourced', claim: 'verified' },
      { value: '20kg', label: 'recycled HDPE per Stretch Bed', claim: 'verified' },
    ],
    videos: [
      {
        kind: 'local',
        label: 'Assembling the Stretch Bed',
        src: '/video/stretch-bed/assembly.mp4',
        poster: '/video/stretch-bed/assembly-poster.jpg',
        caption: 'Flat-packed, no toolbox, about five minutes.',
      },
    ],
    gaps: [
      {
        slot: 'photo',
        wanted: 'A Basket Bed in use, and one intermediate woven/frame trial',
        reason: 'No cleared Basket Bed photography exists. The product this stop corrects is invisible on the page, which weakens the correction.',
      },
    ],
    note: 'The Weave Bed is DISCONTINUED and must not be named as a product; the intermediate trials are described generically for that reason. Basket Beds are excluded from the recycled-HDPE total, which is why the plastic figure is Stretch-Bed-only. This stop deliberately holds no lead photo rather than borrowing a Stretch Bed image, which would illustrate the wrong object.',
  },

  // ────────────────────────────────────────────────────────── the model
  {
    id: 'model',
    kind: 'model',
    eyebrow: 'What the road produced',
    headline: 'Goods is not one product and it is not one program.',
    chapters: [
      'It is a connected operating model with five movements. Each one is the residue of a place, not a frame imposed on the road.',
      'Listen. Community names the need, the conditions and the test. This includes the need for the object and the larger conditions around it: family, heat, dust, freight, movement, language, repair, safety and the role of older people and young people.',
      'Shape. The product is designed in community. Feedback changes specifications, not just messaging. The bed becomes lower, washable, flat-packable and repairable. The machine becomes simpler to operate and easier to service. A person in community can name the object.',
      'Make. The making moves into visible, teachable work: collect and sort plastic, shred, press, cut, route components, assemble, check quality and pack. The task is designed around real jobs and fair wages, not volunteer labour hidden inside a social-enterprise margin.',
      'Deliver, track and learn. Each item has an identity. QR-linked records support delivery, condition checks, repair, movement, replacement and feedback. The register is care infrastructure, not a surveillance system. Household data and story-linked records remain governed by consent and access rules.',
      'Transfer and support. The plant, production capability, local employment, repair pathway, contracts, margin and decisions move toward Aboriginal-controlled or locally owned community enterprises. Goods remains useful as a shared support layer for design, quality, sales, evidence, capital, procurement and learning across places.',
      'The model must travel. The decisions must stay.',
    ],
    photo: null,
    figures: [
      { value: String(BEDS), label: 'beds deployed', claim: 'verified' },
      { value: String(STRETCH_BEDS), label: 'Stretch Beds', claim: 'verified' },
      { value: String(COMMUNITIES), label: 'communities', claim: 'verified' },
      { value: `${PLASTIC_KG.toLocaleString()}kg`, label: 'recycled HDPE diverted', claim: 'verified' },
    ],
    gaps: [
      {
        slot: 'photo',
        wanted: 'A single image that reads as the five movements',
        reason: 'The model is earned, not asserted, and a diagram here would assert it. Left empty pending a real photo of the transfer work.',
      },
    ],
    note: 'CLAIM CEILING. Goods can say the products support household conditions connected to rest, hygiene, skin health and environmental health. It CANNOT say the beds have reduced rheumatic heart disease, scabies or hospitalisation without a partner-led evaluation measuring those outcomes. scabies-to-RHD is the WHY, never a claimed outcome. Figures are canon (the register), not the Notion page\'s founder-confirmed post-register update.',
  },

  // ────────────────────────────────────────────────────────── economics
  {
    id: 'economics',
    kind: 'economics',
    eyebrow: 'The hard arithmetic',
    headline: 'The numbers become useful when their status stays attached.',
    chapters: [
      'The Goods model can be read as three linked shifts, and the economic one is the least understood.',
      'A material shift. Remote communities carry a high cost for imported goods and a high cost when those goods fail. Plastic and broken products accumulate locally while value leaves through freight and replacement. Goods turns one part of that waste stream into durable product components. The purpose is not only diversion. It is to create a local input that can become a paid collection stream, a production skill and a useful product.',
      'An economic shift. Today, Goods can buy completed recycled-plastic components from an external supplier and assemble the bed. That keeps production simple, but it captures very little contribution at the current price. Pressing components through the Goods facility is expected to reduce marginal cost materially. In a community-production path, free local feedstock and a fair local wage are designed into the economics. The wage is not a trade-off against viability: in the model it fits inside a lower total cost, because the city-factory markup and duplicated freight fall away.',
      'A story and authority shift. The old story says an outside organisation designed a product and delivered it to people in need. The Goods story says something more precise: people named the need, changed the product, tested it, built it, ordered it and now have the opportunity to hold the productive asset.',
      'The model identifies a particular cost leak. A finished recycled-plastic leg kit costs about $344 bought from a city factory. The raw shredded-plastic input is about $40. Labour, energy, yield and processing still have to be paid, but bringing the process in-house removes a large markup and a freight loop.',
      'The capital case in one sentence: the first facility has produced a real 60-bed batch. The next job is to close the run ledger, prove the cost-down, and build enough purchase-backed volume to support transfer.',
    ],
    photo: null,
    figures: [
      { value: '$750', label: 'Stretch Bed price', claim: 'verified' },
      { value: '$684.79', label: 'marginal cost, bought-in kit', claim: 'workpaper' },
      { value: '$425.74', label: 'marginal cost, central production', claim: 'modelled' },
      { value: '$420.74', label: 'marginal cost, community production', claim: 'modelled' },
      { value: '$109,500', label: 'annual fixed production block', claim: 'modelled' },
    ],
    note: 'EVERY figure here wears its status, and the statuses are not decorative: bought-in is workpaper (engine-locked), both cost-down figures are MODELLED with the 60-bed run ledger still open. The break-even figures from the Notion source (1,679 beds bought-in, 333-338 cost-down) are deliberately omitted: they are computed against a fixed block that the July model work re-cut into three pots, and the honest denominator is now a BAND. Do not reinstate a single break-even number here; read lib/cost-model/engine. The retired "75-100 beds/yr" figure must never reappear on any surface.',
  },

  // ────────────────────────────────────────────────────────── money
  {
    id: 'money',
    kind: 'money',
    eyebrow: 'The money that carried the work here',
    headline: 'Grant funding was not a mistake. It paid for the cost of learning.',
    chapters: [
      'The Goods-only revenue figure to date is $713,827. It is a management figure and a project carve-out, prepared with the accountant. It is not an audited set of accounts and it is not accountant-signed.',
      'The funding mix tells the truth about the stage of the venture. About 89 per cent has come through grants and philanthropy. Direct online shop revenue in the historical record is only $90, from three orders. Institutional purchases and partner-funded deployments sit between those two categories, and that is the channel that now needs to become repeatable.',
      'Grant funding paid for work a young product business could not responsibly place on community buyers: listening, design, failed prototypes, repeated travel, community participation, first-batch risk, evidence systems and the cost of learning how ownership might transfer.',
      'Snow Foundation was an early anchor partner. The Funding Network\'s Healthy People, Healthy Planet event in September 2025 raised about $130,000 toward the On-Country production facility. Centrecorp Foundation backed the Central Australian and Utopia pathway and helped move the work from a request into beds on Country. AMP Spark and other philanthropic partners supported design, delivery, evidence and operating work.',
      'Goods has also invested about $110,046 in verified facility and press capital. That is the cleanest skin-in-the-game figure in the record.',
      'The next capital should not be described as money to scale impact. That phrase hides the work. The money has jobs: close the economics on the 60-bed run, make the facility repeatable, carry purchase-backed working capital, build the first transfer with Oonchiumpa, and build the shared support layer.',
      'You are not funding another prototype. You are funding the bridge between a working product and a community-held production enterprise: the measured cost, the first order book, the first paid roles, the first transfer agreement and the first set of keys.',
    ],
    photo: null,
    figures: [
      { value: '$713,827', label: 'Goods-only revenue to date', claim: 'workpaper' },
      { value: '$110,046', label: 'facility and press capital invested', claim: 'verified' },
      { value: '89%', label: 'from grants and philanthropy', claim: 'workpaper' },
    ],
    note: 'RULING H APPLIED. The Notion source calls $713,827 "accountant-signed". It is NOT. No signed accountant document exists; the word came off 8 surfaces and must not return through this page. The figure is correct, the label is workpaper. RULING O: $110,046 IS the actual sunk spend; the ~$75K MVF figure is a bill-level subtotal, not a competing total. The live capital ask (the $400K match, QBE, the stack) is deliberately NOT on this page: it is dated, it moves weekly, and it belongs on the pitch surfaces, not in the history.',
  },

  // ────────────────────────────────────────────────────────── closing
  {
    id: 'closing',
    kind: 'closing',
    eyebrow: 'The road ahead',
    headline: 'The goal was never a bigger Goods.',
    chapters: [
      'It is a community that can collect the plastic, make the goods, and come to own the making.',
      'The long-term model is a network of place-based production facilities, not one central factory serving every community forever. A facility has to earn its right to move. It needs a buyer base, a local operating partner, material supply, safe work, maintenance, reliable power, quality control and a pathway to ownership. A container by itself is not an enterprise.',
      'The current model suggests a facility can repay its capital cost within a year at sufficient volume, then help finance the next. That remains a model. It is the replication hypothesis, not a realised result, until the Maningrida run cost and a year of orders prove it.',
      'Three different jobs require three different forms: the trading company that sells useful products, the charitable home for the public-good work, and the community production enterprise that makes, repairs and sells the goods and over time holds the machinery and the local decisions.',
      'The model must travel. The decisions must stay.',
    ],
    photo: null,
    gaps: [
      {
        slot: 'photo',
        wanted: 'A closing image: the handover, or the road out',
        reason: 'No image we hold reads as transfer rather than delivery. Using a delivery photo here would undercut the sentence it sits beneath.',
      },
    ],
    note: 'The north star is imported as one constant elsewhere in the codebase (NORTH_STAR in content.ts) and is restated here as prose only. If the north star changes, this stop changes with it. "Come to own the making" is the pathway framing and must never harden into a completed claim.',
  },
];

/** Every known media gap on the page, for the admin view and the build report. */
export function storyGaps(): Array<StoryGap & { stopId: string }> {
  return storyStops.flatMap((stop) =>
    (stop.gaps ?? []).map((gap) => ({ ...gap, stopId: stop.id }))
  );
}

/** Stop ids in road order. Asserted against deck.ts by story-road.spine.test.ts. */
export function storyStopIds(): string[] {
  return storyStops.map((s) => s.id);
}
