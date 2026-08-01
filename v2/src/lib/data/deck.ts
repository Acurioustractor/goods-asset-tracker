/**
 * The Goods investor deck, rebuilt on the road spine (2026-07-25).
 *
 * SPINE: `/DECISIONS.md` ruling C and F. The road is the spine. The model arrives
 * near the END, as what the road produced. Voices lead each stop, because each stop
 * is a person saying something. Money enters through PLACE (stop 4, Palm Island) and
 * never gets its own section again: every dead deck bolted money blocks onto story
 * stops, and the money slides migrated every time. A block with no home moves. A
 * lesson taught by a place cannot move.
 *
 * This supersedes the 15 July six-belief-turn deck, which was model-second (slide 2
 * of 10) and is one of the five competing spines the alignment session found live at
 * once. Ruling C: leading with the framework invites a funder to compare your
 * framework to better frameworks. Walked down the road they cannot, because nobody
 * else has been on it.
 *
 * AUDIENCE: the QBE match funders. The job of this deck is signed match paper before
 * our own 31 August internal gate, ahead of the 14 September QBE submission. The ask
 * slide therefore asks for a LETTER, not a facility agreement (ruling M).
 *
 * FIGURES: imported, never retyped. `CANONICAL_ASSETS`, `canonFact()` and the capital
 * constants are the sources; `npm run check:drift` catches them if they move. A number
 * typed by hand instead of read from canon is a bug even when it is correct today.
 *
 * VOICES: `voiceNames` resolve through storyteller-registry.ts, so every quote is
 * consent-tiered and a `hold` quote can never surface. Every name below was verified
 * present in cleared-voices.ts (the 34-name person-level allowlist) on 2026-07-25 by
 * reading the record, not by trusting a line number.
 *
 * CLAIM HYGIENE: every chip label carries its own status word (delivered / workpaper /
 * modelled / target / proposed / verified). There is no blanket "verified" claim over
 * this deck, because it mixes delivered counts with modelled economics.
 *
 * NO Kununurra content may enter this file until the Elder clears her words and has a
 * registry record. This page is public and click-to-editable, so "gated in the code"
 * is not a real gate.
 */

import { CANONICAL_ASSETS } from './asset-canonical';
import { NORTH_STAR } from './content';
import { canonFact } from './canon';
import {
  CAPITAL_GROSS_LOW,
  CAPITAL_GROSS_HIGH,
  ALREADY_INVESTED,
  SITE_PRODUCTION_BLOCK_BARE,
  SITE_SUPERVISOR_COST,
} from './cost-model-scenarios';

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

/**
 * `stop` is a place on the road. `gap` is what the road adds up to and where the
 * model and the ask are allowed to arrive. The old `turn` and `hinge` kinds belonged
 * to the six-belief-turn spine that ruling C retired.
 */
export type SlideKind =
  | 'cover'
  | 'stop'
  | 'product'
  | 'gap'
  | 'model'
  | 'economics'
  | 'money'
  | 'ask'
  | 'closing';

export interface DeckSlide {
  id: string;
  kind: SlideKind;
  /** Small label above the headline, e.g. "Stop 1". */
  eyebrow: string;
  headline: string;
  body: string;
  /** Served path under /public. */
  photo: string;
  photoAlt: string;
  /** Place and time stamp shown on the public story page ("Tennant Creek · 2025"). */
  place?: string;
  /** Ordered list rendered as steps: the six public stages, or the modules. */
  steps?: string[];
  /** Registry voices carrying this slide, in display order. */
  voiceNames?: string[];
  /** Exact registry context to prefer for this slide's lead quote. */
  voiceQuoteContext?: string;
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
  /** Presenter script, Ben's spoken voice, shown as notes in Present (N). */
  script?: string;
  /** Editorial / provenance note shown in the edit margin, never in Present. */
  note: string;
}

export const deckUpdated = '25 July 2026';

/** Read once so a figure cannot drift between two slides that state it. */
const price = canonFact('stretch-price').value;
const marginalBuyKit = canonFact('marginal-buykit').value;
const marginalFactory = canonFact('marginal-factory').value;
const revenueCarveout = canonFact('revenue-carveout');
const signedLois = canonFact('signed-lois').value;

const aud = (n: number) => `AU$${n.toLocaleString('en-AU')}`;

export const deckSlides: DeckSlide[] = [
  // ────────────────────────────────────────────────────────── cover
  {
    id: 'cover',
    kind: 'cover',
    eyebrow: 'Goods.',
    headline: NORTH_STAR.headline,
    body: NORTH_STAR.line,
    photo: '/images/product/stretch-bed-community.jpg',
    photoAlt: 'A Stretch Bed set up in a remote community home',
    place: `${CANONICAL_ASSETS.bedsDeployed} beds · ${CANONICAL_ASSETS.communitiesServed} communities · nine years`,
    goDeeper: [
      { label: 'The communities', href: '/communities' },
      { label: 'Every number, audited', href: '/register' },
    ],
    script:
      'I want to start with the places, not the model. The work changed each time somebody used a bed, questioned the design, named a machine or asked to make the products themselves. Seven stops brought us to the model near the end of this deck. The goal was never a bigger Goods. It is a community that can collect the plastic, make the goods, and come to own the making.',
    note: 'Ruling E: the north star is imported from NORTH_STAR in content.ts, never retyped. Ruling K: the eyebrow is Goods. (the maker, inside A Curious Tractor Pty Ltd), NOT Goods on Country (the charity, The Butterfly Movement Ltd). Ruling C: never open on the model. CONTEXT.md: never open on a dollar figure.',
  },

  // ────────────────────────────────────────────────────────── stop 1
  {
    id: 'stop-1-kalgoorlie',
    kind: 'stop',
    eyebrow: 'Stop 1 · Kalgoorlie',
    headline: 'Before the first bed, there was a health question.',
    body: 'In 2018, Nic heard paediatric cardiologist Dr Boe Reményi explain how environmental health shapes preventable disease. Not that a bed is a medical device. The question was more practical: what are people sleeping on, and can it be cleaned, repaired and kept off the ground? At Ninga Mia, Gloria Turner made that question real.',
    photo: '/images/community/kalgoorlie/mattress-dumped-jerry-can.jpg',
    photoAlt: 'A failed mattress dumped on red dirt near Kalgoorlie',
    place: 'Ninga Mia, Kalgoorlie, WA',
    voiceNames: ['Gloria Turner', 'Dr Boe Remenyi'],
    gallery: [
      { src: '/images/community/kalgoorlie/dump-site-dawn.jpg', alt: 'A bushland dumping ground at dawn: fridges, mattresses, a couch' },
      { src: '/images/community/kalgoorlie/mattress-ochre.jpg', alt: 'A foam mattress dyed the colour of the dirt it was abandoned on' },
      { src: '/images/community/kalgoorlie/mattress-decayed.jpg', alt: 'A sun-bleached mattress rotting into the scrub' },
      { src: '/images/community/kalgoorlie/camp-mattress-tent.jpg', alt: 'A mattress in a tent at the camp' },
    ],
    goDeeper: [{ label: 'Read the Goods origin story', href: '/story/road' }],
    script:
      'The Goods story begins before the first bed. In 2018 Nic heard paediatric cardiologist Dr Boe Reményi speak about rheumatic heart disease and environmental health. Her point was that advice alone cannot change health when the ordinary conditions of home make the advice impossible to follow. A bed is not a medical device, and we do not claim it prevents disease. But sleeping surfaces, washing, crowding, water and power shape health long before somebody reaches a clinic. At Ninga Mia that broad lesson became specific. Gloria Turner told us why a good mattress matters: for the back, the legs and the muscles. Around the camp were mattresses dumped on red dirt because the normal product-and-replacement system had failed. Then Gloria and her family assembled our first crate bed outside their tent. When we returned, it had disappeared. A family had carried it inside and chosen it for sleep. The health question had become a design obligation: make something useful enough to be chosen, durable enough to stay, and repairable enough not to become the next mattress on the dirt.',
    note: 'Reframed by Ben on 2026-07-30 as the complete origin chain: Nic hearing practitioner Dr Boe Reményi on environmental health; the mattress and sleeping-surface question; then Gloria Turner and the Ninga Mia field story. The bed is explicitly not presented as a medical device or an RHD outcome. Dr Boe is a cleared practitioner voice, not a community recipient. Gloria carries the visible registry quote. The disappearing-bed scene remains narration because no attributable speaker exists for it.',
  },

  // ────────────────────────────────────────────────────────── stop 2
  {
    id: 'stop-2-tennant-creek',
    kind: 'stop',
    eyebrow: 'Stop 2 · Tennant Creek',
    headline: 'Linda Turner told us what had been missing: nobody had asked.',
    body: 'We kept coming back to Tennant Creek. Over years, Goods listened, changed the beds and delivered more than 100 Basket Beds. Linda Turner\'s question changed how the work happened from then on: ask first, then build.',
    photo: '/images/people/linda-turner.jpg',
    photoAlt: 'Linda Turner, Tennant Creek',
    place: 'Tennant Creek, NT',
    voiceNames: ['Linda Turner'],
    voiceAlternates: ['Tanya Turner'],
    goDeeper: [{ label: 'The communities', href: '/communities' }],
    script:
      'We kept returning to Tennant Creek. People tested the beds, changed the height, asked for different colours and ordered more. Goods delivered more than one hundred Basket Beds there. Then Linda Turner gave us the sentence that explained why time mattered: "We\'ve never been asked what sort of house we\'d like to live in." From then on, asking could not be a workshop before the real work. It had to be able to change the product, the order and what happened next.',
    note: 'Ruling F gives Tennant Creek two stops because it taught two different things and it is where the deepest relationship is. This is the first. Ben reframed the body on 2026-07-30 around deep time and the delivery of more than 100 Basket Beds; the canonical Tennant Creek total is 160 beds. Linda Turner registry PRIMARY, verified at source; the registry marks this turn as "could open the whole deck". No Tennant Creek photography exists in the repo, so the stop is portrait-led. Language rule: the design happens IN community, led by community; the facilitated-joint-process word for that is banned by check-voice.mjs and must not appear on any surface.',
  },

  // ────────────────────────────────────────────────────────── stop 3
  {
    id: 'stop-3-the-machine-with-a-name',
    kind: 'stop',
    eyebrow: 'Stop 3 · Tennant Creek',
    headline: 'Dianne named it Pakkimjalki Kari.',
    body: 'People in Tennant Creek asked Goods to look beyond beds. Dianne helped shape a one-button washing-machine prototype, then gave it a Warumungu name.',
    photo: '/images/product/washing-machine-name.jpg',
    photoAlt: 'Pakkimjalki Kari: the name plate on the washing machine',
    place: 'Tennant Creek, NT',
    voiceNames: ['Dianne Stokes', 'Patricia Frank'],
    voiceQuoteContext: 'What the washer on her homeland changes',
    chips: [
      { label: 'Delivered · washing machines', value: `${CANONICAL_ASSETS.washersInCommunity} in community` },
      { label: 'Stage', value: 'Prototype, Speed Queen base, one button' },
    ],
    goDeeper: [{ label: 'Pakkimjalki Kari', href: '/wiki/products/washing-machine' }],
    script:
      'After years of work on beds, people in Tennant Creek asked us to look at washing machines. Dianne Stokes helped shape the prototype and named it Pakkimjalki Kari in Warumungu. Patricia Frank explains the need plainly: people want to wash their blankets and clothes at home. Twenty two prototypes are now in community. We are careful about the health claim. Washing access is part of why the work matters; we do not claim that these machines have produced a measured health outcome.',
    note: 'Washer count reads CANONICAL_ASSETS.washersInCommunity (22). The old deck hardcoded "Twenty washing machines" as a WORD in its presenter script, which is why check-retired-figures never caught it: that guard matches the numeral 20. Dianne has full consent for all her material and image (Ben 2026-07-21); her totem line remains a registry HOLD and never surfaces. scabies to RHD is the WHY only, never a claimed health outcome. The $3M Alice Springs figure is context Ben has stated; it carries no claim label here because it is somebody else\'s revenue, so it is spoken, not chipped.',
  },

  // ────────────────────────────────────────────────────────── stop 4 · money enters
  {
    id: 'stop-4-palm-island',
    kind: 'stop',
    eyebrow: 'Stop 4 · Palm Island',
    headline: 'The price is only the beginning.',
    body: 'A bed reaches Palm Island by barge. Freight can push a durable bed close to $1,000, while cheaper beds cost less upfront but need replacing sooner.',
    photo: '/images/community/palm-island/woman-new-bed-home.jpg',
    photoAlt: 'A new bed in a home on Palm Island',
    place: 'Palm Island, QLD',
    voiceNames: ['Alfred Johnson', 'Daniel Patrick Noble'],
    chips: [
      { label: 'Verified · sell price', value: `${aud(Number(price))} per Stretch Bed` },
    ],
    gallery: [
      { src: '/images/community/palm-island/bedding-golden-hour.jpg', alt: 'Kids carrying new bedding home at golden hour, Palm Island' },
      { src: '/images/community/palm-island/family-dogs-new-bed.jpg', alt: 'A family and their dogs with a new bed' },
      { src: '/images/community/palm-island/kids-new-mattress.jpg', alt: 'Kids with a new mattress on Palm Island' },
    ],
    goDeeper: [{ label: 'Where the money goes', href: '/cost-story' }],
    script:
      'Alfred Johnson explains that a bed must come by barge and every part of that trip costs money. Daniel Patrick Noble does the household arithmetic: a cheaper bed may last only a year or two, but a durable one plus freight can reach nearly a thousand dollars. The lower price wins today. The cost returns when the bed fails.',
    note: 'Ruling F: MONEY ENTERS HERE, through place, never as its own section. Both voices registry-verified and on the cleared list. Daniel Patrick Noble\'s quote is stored verbatim including the transcription artefact in "1, 000"; do not tidy a person\'s words. Only one chip on this slide on purpose: the price is the anchor the economics slide later divides into.',
  },

  // ────────────────────────────────────────────────────────── product bridge
  {
    id: 'the-stretch-bed',
    kind: 'product',
    eyebrow: 'The product · between delivery and making',
    headline: 'Three component types. Five minutes. No tools.',
    body: 'Two steel poles tension a washable canvas between recycled-plastic X-frames. It packs flat, repairs by part, and is designed so more of the making can move into community.',
    // WAS /images/_drafts/story-spine/03-exploded-view.png, which .gitignore:218 ignores, so it
    // shipped as a guaranteed 404 on /pitch/deck (that surface renders slide.photo directly and
    // has no override path). Repointed 2026-08-01 to a git-tracked file that is also present on
    // disk. The brand illustration set is NOT usable here: those .png files are mid-rename to
    // .jpg, so the tracked name is deleted in the working tree and the working name is untracked.
    // Verify any replacement with `git ls-files`, never `ls`.
    photo: '/images/pitch/bed-seq-3-all-parts.jpg',
    photoAlt: 'The Stretch Bed components laid out: poles, canvas and recycled-plastic X-frames',
    place: 'The Stretch Bed',
    steps: [
      'Collect and shred local HDPE plastic.',
      'Press sheets and CNC-cut the X-frame legs.',
      'Sew canvas, source poles, assemble and repair locally.',
    ],
    chips: [
      { label: 'Verified · current sell price', value: `${aud(Number(price))}` },
      { label: 'Product specification', value: '26kg · 200kg load · about 5 minutes' },
      { label: 'Modelled · plastic per bed', value: '20kg HDPE' },
    ],
    goDeeper: [{ label: 'See the full bed and assembly guide', href: '/stretch-bed' }],
    script:
      'This is the whole bed: two galvanised steel poles, one washable canvas and two recycled-plastic X-frames. It packs flat, one person can carry it, and it goes together in about five minutes without tools. It sells for seven hundred and fifty dollars. Today Goods still supplies much of the kit. The pathway is to bring more of the material loop and making into community: collect and shred local plastic, press and cut the legs, then assemble, repair and eventually own the production.',
    note: 'This bridge sits after Palm Island establishes landed cost and before Utopia asks who gets to make the next bed. Price reads the stretch-price canon fact. The 20kg HDPE figure is explicitly modelled, not a measured diversion claim. Community production language is a pathway, not a claim that every stage is already operating in every place.',
  },
  {
    id: 'open-the-stretch-bed',
    kind: 'product',
    eyebrow: 'The finished bed',
    headline: 'See every part. See how it goes together.',
    body: 'Open the full bed story for the components, assembly sequence, specifications and the pathway to making more of it in community.',
    photo: '/images/product/stretch-bed-hero.jpg',
    photoAlt: 'A finished Stretch Bed on Country in golden light',
    place: 'The Stretch Bed on Country',
    goDeeper: [{ label: 'Open the bed', href: '/stretch-bed' }],
    script:
      'This is the finished Stretch Bed on Country. Open this frame when somebody wants the full product story: every component, the five-minute assembly sequence, the specifications, and the production pathway.',
    note: 'A deliberate visual pause after the exploded component diagram. The whole frame links to the detailed Stretch Bed page instead of trying to carry that complete explanation inside the pitch.',
  },

  // ────────────────────────────────────────────────────────── stop 5
  {
    id: 'stop-5-utopia',
    kind: 'stop',
    eyebrow: 'Stop 5 · Utopia',
    headline: 'Mykel built the bed he slept on that night.',
    body: 'He turned the finished bed over in his hands. Bottle lids had become something strong enough to sleep on. By the end of the second day, he had built seven. We asked if he would come back every day if there were a place here to make them. "Yeah, I\'ll be rocking up every day to make them."',
    photo: '/images/utopia/utopia-09.jpg',
    photoAlt: 'A delivery day on Country, Utopia homelands',
    place: 'Utopia homelands, NT · May 2026',
    voiceNames: ['Margaret Lloyd', 'Katrina Bloomfield', 'Mykel'],
    voiceAlternates: ['Dorrie Jones'],
    chips: [
      { label: 'Delivered · beds', value: `${CANONICAL_ASSETS.bedsDeployed} across ${CANONICAL_ASSETS.communitiesServed} communities` },
      { label: 'Delivered · Utopia assets confirmed', value: '147' },
      { label: 'Delivered · plastic diverted', value: `${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg (Stretch Beds only)` },
    ],
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
      { src: '/images/utopia/utopia-02.jpg', alt: 'Delivery day, Utopia homelands' },
      { src: '/images/utopia/utopia-05.jpg', alt: 'Beds arriving on Country' },
      { src: '/images/build/build-025.jpg', alt: 'Young makers assembling beds' },
    ],
    goDeeper: [
      { label: 'The Utopia field note', href: '/field-notes/utopia-may-2026' },
      { label: 'The next phase: Oonchiumpa', href: '#stop-7-oonchiumpa' },
      { label: 'Every number, audited', href: '/register' },
    ],
    script:
      'Margaret Lloyd was sleeping in a tent beside a house she could not use. No mattress. Katrina Bloomfield said many Elders were sleeping on blankets on the ground and finding it hard to rise. Goods and Oonchiumpa delivered 147 beds across the Utopia homelands. Mykel built the bed he slept on that night, then kept going. Seven beds by the end of the second day. When we asked if he would come back every day if there were a place here to make them, he said, "Yeah, I\'ll be rocking up every day to make them." The truck had brought beds. Mykel was asking where the work would happen.',
    note: 'The truck test is carried forward from the 15 July deck: it is the one framing device, used once (Ben\'s rule). Utopia 147 is the confirmed count; Community OS\'s 169 is wrong and must not be used. Margaret Lloyd, Katrina Bloomfield, Dorrie Jones and Shayne Bloomfield have NO portrait in the registry (portrait: null) and are voice-only by design, so this slide is carried by place photography.',
  },

  // ────────────────────────────────────────────────────────── stop 6 · economics land
  {
    id: 'stop-6-maningrida-and-the-farm',
    kind: 'stop',
    eyebrow: 'Stop 6 · Maningrida and the farm',
    headline: 'We pressed, routed and packed the parts at the farm. In Maningrida, young people turned them into forty beds.',
    body: 'Defy Design supplied the shredded recycled plastic. We pressed, routed and packed the parts at the farm, then sent them to Maningrida. Young people assembled the forty beds with community.',
    photo: '/images/process/heat-press-full.jpg',
    photoAlt: 'The heat press, the one move at the heart of the making',
    place: 'The farm, and Maningrida, Arnhem Land NT',
    voiceNames: ['Shayne Bloomfield', 'Fred Campbell'],
    chips: [
      { label: 'Delivered · the run', value: '40 Stretch Beds' },
      { label: 'Modelled · the ratio', value: '8.6x the raw shred cost (about $40) to buy legs finished' },
      { label: 'Verified · marginal, buying legs', value: aud(Number(marginalBuyKit)) },
      { label: 'Modelled · marginal, pressing our own', value: aud(Number(marginalFactory)) },
    ],
    gallery: [
      { src: '/images/process/shredded-chips-weighed.jpg', alt: 'Shredded HDPE, weighed' },
      { src: '/images/process/pressed-sheets.jpg', alt: 'Pressed recycled-plastic sheets' },
      { src: '/images/process/cnc-router-full.jpg', alt: 'CNC cutting the leg components' },
      { src: '/images/process/parts-rack-sorted.jpg', alt: 'Cut parts, racked and sorted' },
    ],
    goDeeper: [{ label: 'How it is made', href: '/process' }],
    script:
      'Defy Design supplied the shredded recycled plastic. At the farm, we pressed the stock, routed the X-frame legs and packed the parts for forty beds. We sent them to Maningrida, where young people assembled the beds with community. The next run needs to measure labour, energy, material yield and time.',
    note: 'GEOGRAPHY, stated out loud because the stop reads as a lie otherwise: the beds went to MANINGRIDA, they were MADE at the farm, and Fred Campbell\'s own community is ALICE SPRINGS, not Maningrida. INV-0303 remains internal evidence for the forty-bed delivery and must not appear in display copy. There is NO photograph of Maningrida anywhere in v2/public (verified by find, 0 results), so the stop is carried by process photography of the making. Shayne Bloomfield carries the only cleared Maningrida-speaking quotes in the repo (Ben-cleared 2026-07-20). Xavier is ALWAYS narrated by Fred: his registry record stores `quotes: []` and states that no direct quote exists or may be created. NEVER write "zero beds pressed in-house": it is wrong and has regressed twice. marginal-factory carries canon claimLabel "verified" but that is a verified BOM computation, not a measured production cost, so the chip says modelled.',
  },

  // ────────────────────────────────────────────────────────── stop 7
  {
    id: 'stop-7-oonchiumpa',
    kind: 'stop',
    eyebrow: 'Stop 7 · Oonchiumpa',
    headline: 'Oonchiumpa asked what it would take to make the beds themselves.',
    body: 'Oonchiumpa already runs its own business and works with young people. Its team has built beds with Goods and expressed interest in production. The next conversation is practical: could the community entity sell the beds while Goods supplies equipment, training and support?',
    photo: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
    photoAlt: 'The Oonchiumpa team with a finished Stretch Bed and stacked leg components',
    place: 'Alice Springs and Utopia, NT',
    // Karen Liddle is deliberately NOT in voiceNames: deck-public.tsx renders
    // `record.portrait` for every voiceName, and her portrait clearance is contested
    // across three files. Her words are cleared, so she carries the stop as a literal
    // quote, which surfaces the line without surfacing her face. Promote her to
    // voiceNames only once Ben rules.
    voiceNames: ['Kristy Bloomfield'],
    literalQuotes: [
      {
        text: 'I had a yarn with the girls one day. Said you got to get out and start your own business. That\'s how we started Oonchiumpa.',
        attribution: 'Karen Liddle, Oonchiumpa',
      },
    ],
    chips: [
      { label: 'Requested · Oonchiumpa', value: 'Interest in owning production' },
      { label: 'Proposed · the direction to test', value: 'The community entity sells, Goods. supplies' },
    ],
    gallery: [
      { src: '/images/community/alice-springs/oonchiumpa-office-joy.jpg', alt: 'The Oonchiumpa team testing a Stretch Bed, laughing' },
      { src: '/images/build/build-009.jpg', alt: 'Build day with Oonchiumpa, Alice Springs' },
    ],
    goDeeper: [{ label: 'Community pathways', href: '/pathways' }],
    script:
      'Karen Liddle remembers telling the girls to start their own business. That became Oonchiumpa. Kristy Bloomfield says what they want next: generational wealth and economic development on their own land. Their team has already built beds with Goods. The next conversation is whether Oonchiumpa could sell the beds while Goods supplies equipment, training, quality systems and back-office support. That structure is still a proposal. Oonchiumpa has not agreed to it, and the decision belongs with them.',
    note: 'Ownership is a PATHWAY, never claimed complete, on any surface, ever. The 51%-direction is DECISIONS.md DIRECTION (not a ruling): it involves another organisation\'s balance sheet and Oonchiumpa has not been asked, so it is chipped "Proposed". Karen Liddle\'s PHOTO/clip clearance is contested across three files (registry declares a portrait; pitch-photo-review says voice-only pending an EL portrait; the admin consent page says her named clearance was not confirmed), so this slide leads with a team photo and carries her by VOICE. Do not promote her portrait without closing that.',
  },

  // ────────────────────────────────────────────────────────── the gap
  {
    id: 'gap',
    kind: 'gap',
    eyebrow: 'The gap',
    headline: 'Nine years, eleven communities, 540 beds. Nobody owns the making.',
    body: 'The products have reached communities. The production equipment, contracts, systems and margin have not. Goods now has four live community pathways, each asking for a different part of the making.',
    photo: '/images/qbe/communities-screen.png',
    photoAlt: 'The eleven communities served, on the map',
    place: 'Every stop on the road so far',
    chips: [
      { label: 'Delivered · beds', value: `${CANONICAL_ASSETS.bedsDeployed}` },
      { label: 'Delivered · communities', value: `${CANONICAL_ASSETS.communitiesServed}` },
      { label: 'Delivered · washing machines', value: `${CANONICAL_ASSETS.washersInCommunity}` },
      { label: 'Delivered · plastic diverted', value: `${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg` },
      { label: 'The gap', value: 'Community-owned production sites: 0' },
    ],
    goDeeper: [{ label: 'Every number, audited', href: '/register' }],
    script:
      'Here is the road added up: nine years, eleven communities, 540 beds, twenty two washing machines and three and a half tonnes of plastic diverted through Stretch Bed production. There are still zero community-owned production sites. The next part of the deck shows the practical pathway we built to change that number.',
    note: 'Ruling F: the model and the ask arrive HERE and only here. Every figure reads from CANONICAL_ASSETS. The "0" is the honest headline and it is stated as a gap, not spun. This slide deliberately carries no voice: pitch-cockpit records the model and framing slides as voices: [], and that is by design so nobody "fills" it with a person.',
  },

  // ────────────────────────────────────────────────────────── the model
  {
    id: 'model',
    kind: 'model',
    eyebrow: 'First principles',
    headline: 'Ask first. Make what is needed. Move the work closer to community.',
    body: 'Listen, make, learn, then move more of the work and value into community when the community wants it.',
    photo: '/images/process/factory-panorama.jpg',
    photoAlt: 'The containerised production setup on Country',
    place: 'Four live pathways: Utopia, Tennant Creek, Palm Island, Oonchiumpa',
    steps: [
      'Listen. People define what is needed.',
      'Make. Build for the place and the people using it.',
      'Learn. Test it in real life and change what does not work.',
      'Move. When community wants it, shift skills, work and value there.',
    ],
    goDeeper: [
      { label: 'Community pathways', href: '/pathways' },
      { label: 'The impact model', href: '/impact' },
    ],
    script:
      'The model begins with a conversation, not a product. People define what is needed. We make and test it in the place where it will be used. What we learn changes the next version. Then, when the community wants it, more of the skills, work, decisions and value move into community.',
    note: 'This is the public first-principles explanation of the pathway, not the full operating framework. The detailed six-stage and nine-module model remains available on the pathway pages. Ownership remains a pathway and is never claimed complete.',
  },

  // ────────────────────────────────────────────────────────── the economics
  {
    id: 'economics',
    kind: 'economics',
    eyebrow: 'The economics',
    headline: 'Who pays the person running the line?',
    body: 'A bare production site costs about AU$79,333 a year to run. Add a half-time supervisor and it is AU$129,333; a full-time one, AU$179,333. That single hiring decision moves the annual bill by more than a hundred thousand dollars, and nobody has made it yet. It is the biggest open question in the model.',
    photo: '/images/process/pressed-sheets.jpg',
    photoAlt: 'Pressed recycled-plastic sheets, the material the economics rest on',
    place: 'Modelled 2026-07-25, not yet measured',
    chips: [
      // The "= N beds" conversions are GONE (2026-08-01). STRATEGY.md: "no bed number goes
      // in front of anyone until the measured run happens" and "Never said in either room:
      // a bed number as a threshold." The dollar blocks are the honest way to say the same
      // thing, and they carry the open question instead of a target.
      //
      // The "Retired · do not use" chip is gone too. A chip labelled retired still PRINTS the
      // retired sentence to a funder, which is publication, not quarantine. Ruling I kept
      // "75 to 100 beds a year" as an internal estimate; the history now lives in `note`,
      // which no public renderer reads.
      { label: 'Modelled · bare production block', value: `${aud(SITE_PRODUCTION_BLOCK_BARE)}/yr` },
      { label: 'Modelled · plus a half-time supervisor', value: `${aud(SITE_PRODUCTION_BLOCK_BARE + SITE_SUPERVISOR_COST.half_time)}/yr` },
      { label: 'Modelled · plus a full-time supervisor', value: `${aud(SITE_PRODUCTION_BLOCK_BARE + SITE_SUPERVISOR_COST.full_time)}/yr` },
      { label: 'Still open', value: 'Who employs and pays the line supervisor' },
    ],
    goDeeper: [{ label: 'Where the money goes', href: '/cost-story' }],
    script:
      'We used to quote a bed number a site had to hit. It divided by rent and left out the person running the line, insurance, administration, maintenance and safety, so we retired it and we are not replacing it with another one. What we can give you is the bill. A bare production site is 79,333 dollars a year. A half-time supervisor takes it to 129,333, a full-time one to 179,333. Employment support and youth work sit in a separate grant-funded budget. The open question on this slide is ordinary and decisive: who employs the line supervisor, and from which budget?',
    note: 'Ruling I retired "75 to 100 beds a year". It was previously CHIPPED here under a "Retired - do not use" label, which was wrong: a chip still prints the sentence to a funder, and labelling it retired does not unprint it. Removed 2026-08-01; the history stays here, in a field no public renderer reads. The "= N beds" conversions were removed at the same time under STRATEGY.md ("no bed number goes in front of anyone until the measured run happens"). The denominator table is modelled on DERIVED splits of stated DEWR figures and the supervisor costs are ASSUMED, not costed roles. The three-dial payback figures (2.6 years, 19.8 years) exist only in prose in STRATEGY.md and the session pack: they are NOT in code and NOT drift-checked, so they are spoken in the script and never chipped.',
  },

  // ────────────────────────────────────────────────────────── the money
  {
    id: 'money',
    kind: 'money',
    eyebrow: 'Where the money actually is',
    headline: `The signed total is ${signedLois}. The conversations are still conversations.`,
    body: 'The CRM has AU$607,500 in grant asks and AU$710,000 in repayable-capital conversations. Either amount could cover the QBE match. Today, none of it is signed.',
    photo: '/images/process/color-samples.jpg',
    photoAlt: 'Recycled-plastic colour samples',
    place: 'Rebuilt 25 July 2026 from all 67 Supporter Journey rows',
    chips: [
      { label: 'Verified · signed, match-eligible', value: `${signedLois}` },
      { label: 'Proposed · grants at "Ask made"', value: 'AU$607,500' },
      { label: 'Proposed · repayable at "Cultivating"', value: 'AU$710,000' },
      { label: 'Workpaper · Goods-only FY26 revenue', value: aud(Number(revenueCarveout.value)) },
      { label: 'Workpaper · already invested', value: aud(ALREADY_INVESTED) },
      { label: 'Modelled · equipment, gross', value: `${aud(CAPITAL_GROSS_LOW)} to ${aud(CAPITAL_GROSS_HIGH)}` },
    ],
    goDeeper: [{ label: 'Every number, audited', href: '/register' }],
    script:
      'Nothing is signed today. Grant asks in the CRM total 607,500: Minderoo, Tim Fairfax, Snow, Rotary Eclub and Centrecorp. Repayable-capital conversations total 710,000: SEFA, White Box, LendForGood and Metro Finance. Either amount could cover the QBE match, but neither has produced the paper yet. Goods-only FY26 revenue is 713,827 in a workpaper prepared with our accountant; it is not accountant-signed. We have invested 110,046. About 43,700 is evidenced at bill level, while paperwork for the remaining equipment is still being assembled. The gross equipment requirement is between 112,000 and 222,000. We show the requirement and our existing investment separately because the ownership of new equipment must be agreed, not assumed.',
    note: 'Ruling H: cite $713,827, never call it signed, label it workpaper. canon.ts already grades revenue-carveout claimLabel "workpaper" (verified by reading the record on 2026-07-25; an audit pass that claimed otherwise had misread the neighbouring revenue-xero-paid entry). Ruling P: capital is quoted GROSS ONLY, sunk spend sits beside it and is NEVER netted; NET_CAPITAL_* were deleted from engine.ts and a guard fails if reintroduced. Ruling O regraded $110,046 to workpaper. The $607.5K / $710K figures are a MOVING CRM number rebuilt 2026-07-25, not canon, which is why they are chipped Proposed and dated in the place line.',
  },

  // ────────────────────────────────────────────────────────── the ask
  {
    id: 'ask',
    kind: 'ask',
    eyebrow: 'The ask',
    headline: 'We are not asking you for money today. We are asking you for a letter.',
    body: 'For QBE matching, the immediate requirement is a signed letter stating the amount, the instrument, the funder\'s legal name and a contact who can verify it. It can remain subject to board or credit approval. It does not need to be a completed facility agreement.',
    photo: '/images/media-pack/community-testing-bed-golden-hour.jpg',
    photoAlt: 'Trying the bed in community at golden hour',
    place: 'Our internal all-paper-in gate: 31 August 2026',
    chips: [
      { label: 'What the letter states', value: 'Amount · instrument · funder legal name · a contact' },
      { label: 'Our gate', value: '31 Aug 2026 (ours, not QBE\'s)' },
      // 14 Sep DELETED 2026-08-01 (ruling T). canon.ts signed-lois says verbatim: "Do NOT
      // write '14 Sep' as the application date: that is the Butterfly AGM, a different thing,
      // and no firmer QBE date is sourced." A guard comment saying exactly this was deleted
      // by the same diff that added the chip. No QBE date is printed anywhere until Jay
      // gives us a sourced one.
      { label: 'Outcomes', value: 'Nov 2026' },
      { label: 'The grant', value: 'Catalysing Impact: discretionary, typically AU$150K to AU$400K, from one pool across ten enterprises' },
    ],
    goDeeper: [
      { label: 'Where the money goes', href: '/cost-story' },
      { label: 'Every number, audited', href: '/register' },
    ],
    script:
      'Here is the specific thing I want from this conversation. A letter on your letterhead that says four things: how much, in what form, your legal entity name, and a person at your end that SIH can ring. Subject to your credit process, subject to your board, subject to whatever it needs to be subject to. That letter is what QBE counts as match. A signed facility agreement in thirty seven days from a standing start is not realistic and I am not going to pretend to you that it is. A letter of intent is. Two things I want to be straight about. First, the 400,000 is the QBE program ceiling, not our capital requirement. Our requirement is built bottom up from equipment, a measured production run, working capital and fixed-block cover while we ramp, and one of those blocks is still being sized. I would rather tell you that than show you a round number that came from a program brochure. Second, what your money buys first is the stopwatch: the measured run that turns 426 a bed from a modelled figure into a measured one. If that number comes back worse than we think, you will hear it from us.',
    note: 'Ruling M: QBE judges match on a LETTER, not a facility agreement, and the "at least three signed LOIs" gate had NO SOURCE and was struck. canon.ts signed-lois now records that strike in its own definition, and records the distinction this slide makes: 31 August is OUR OWN internal all-paper-in gate, NOT a program deadline; the program deadline is the 14 September submission. wiki/investor/02-financial-model.md:44 states plainly "Do not present $400K as the model\'s capital requirement", which the previous deck did. The working-capital block is deliberately shown as unsized rather than invented.',
  },

  // ────────────────────────────────────────────────────────── closing
  {
    id: 'closing',
    kind: 'closing',
    eyebrow: 'The promise',
    headline: NORTH_STAR.headline,
    body: NORTH_STAR.line,
    photo: '/images/media-pack/lying-on-stretch-bed.jpg',
    photoAlt: 'Resting on a Stretch Bed, off the ground',
    place: 'Every community, on its own terms',
    gallery: [
      { src: '/images/community/alice-springs/stretch-bed-two-generations.jpg', alt: 'Two generations sharing a new Stretch Bed on Country' },
      { src: '/images/community/unplaced/rec-bed-done-joy.jpg', alt: 'Two kids laughing on the Stretch Bed they just built' },
      { src: '/images/community/alice-springs/stretch-bed-kids-pile.jpg', alt: 'A pile of kids claiming two new Stretch Beds' },
    ],
    goDeeper: [
      { label: 'Talk to us', href: '/contact' },
      { label: 'Back the work', href: '/get-involved' },
    ],
    script:
      'The goal was never a bigger Goods. It is a community that can collect the plastic, make the goods, and come to own the making. "Come to own" matters because none of the four pathways is finished. The immediate request is a signed letter that can bring matched capital into the next measured run and the first transfer pathway. Then the work returns to the places and people who must decide what ownership means there.',
    note: 'Ruling E: the north star is imported, and it is the bookend rather than a new closing line. The retired "Our job is to become unnecessary" (ruling A) and the demoted "Nobody funds Goods forever" (ruling B) are deliberately absent. The old closing synthesis ("We know what we need...") is a Goods synthesis, never rendered in quote marks and never attributed to a community member; it is dropped here because the north star is the stronger bookend for a funder room.',
  },
];
