/**
 * PITCH COCKPIT — the one data spine behind /admin/pitch-cockpit and /pitch/simple.
 *
 * Why this file exists: the pitch kept falling over at the last 20% because the
 * deck plan, the storyteller quotes, the media, the ask and the numbers lived on
 * different surfaces. This file pins the deck slide-by-slide (with WHY each
 * slide exists and what we say over it) and the ask model, and everything else
 * is IMPORTED from its own source of truth, never re-typed:
 *
 *   numbers        -> canon.ts (asset figures auto-guarded against the register)
 *   storytellers   -> storyteller-registry.ts (consent tiers + verbatim quotes)
 *   transcripts    -> transcript-provenance.ts
 *   supporters $   -> grant-content.ts fundingHistory
 *   prospects      -> outreach-targets.ts
 *   advisory board -> compendium.ts advisoryBoard
 *
 * The deck itself renders from v2/public/deck-slides/slides-source.html via
 * scripts/render-deck.mjs. The slide list below MUST mirror that file's order —
 * if you add/remove/reorder a slide, change both, then re-render.
 */

// ── The deck, slide by slide ─────────────────────────────────────────────────

export type SlideVisual = 'type' | 'story' | 'diagram' | 'stats' | 'quote-grid';

export interface DeckSlide {
  n: number;
  id: string;
  name: string;
  /** Why the deck needs this slide — the job it does for the investor. */
  why: string;
  /** What we actually say while it is up (the talk track). */
  talkTrack: string;
  /** Voices quoted on the slide (registry canonical names). */
  voices: string[];
  /** What carries the slide visually right now. */
  visual: SlideVisual;
  /** Hand-drawn illustration on the slide, if one is placed. */
  illustration?: string;
  /** Open swap options for the visual (starred photo / other drawing). */
  visualNotes?: string;
}

export const DECK_PLAN: DeckSlide[] = [
  {
    n: 1, id: 'the-line', name: 'The goal was never a bigger Goods',
    why: 'The handover line is the opener AND the destination (Ben, locked 2026-07-21). It frames every number that follows as being in service of the transfer, not of growth. Never open on a dollar.',
    talkTrack: 'The goal was never a bigger Goods. It is a community that can collect the plastic, make the goods, and come to own the making. Communities choose what they need; we supply proven products and production capability; then we hand the making over. Six stages, and the fifth one is Transfer.',
    voices: [], visual: 'type',
  },
  {
    n: 2, id: 'first-bed', name: 'The first bed disappeared overnight',
    why: 'Open on an object, never a claim. This scene proves the founding behaviour (we came back, we listened, we were changed) before anything is asserted.',
    talkTrack: 'The Ninga Mia scene told plainly: the nervous rainy night, the missing bed, the family who carried it inside, six ladies sharing it, the immediate request for two more, the rope repairs that changed the design. Land on the line: it entered the tent as a prototype and came out as an obligation.',
    voices: ['Gloria Turner'], visual: 'story',
  },
  {
    n: 3, id: 'the-default', name: 'The hardware kept arriving, the question never did',
    why: 'Earns stage one (Yarn). Names the 60-year default of goods arriving without anyone asking, and states the health why inside the claim ceiling.',
    talkTrack: 'Remote homes are sold fragile goods designed for a suburb that cannot be repaired locally. About $3M of washing machines a year into communities near Alice, most in a dump within months, and that is a provider estimate not an audited figure. Sleeping on the floor is where scabies starts and scabies is the road toward rheumatic heart disease. That is the why. We do not claim the cure. So every pathway starts with a yarn.',
    voices: ['Dianne Stokes'], visual: 'quote-grid',
  },
  {
    n: 4, id: 'what-they-chose', name: 'The Stretch Bed',
    why: 'The product arrives as the thing communities chose and changed, not as a catalogue item. Real photography only: generated bed anatomy is banned because Gemini cannot hold the X-trestle mechanism.',
    talkTrack: '26kg so one person carries it, 200kg load, about five minutes to build with no tools, $750. Two crossed recycled-plastic legs, two steel poles, washable canvas: tension the poles and the canvas braces the frame. The height, the washing, the repair and the transport all came back as feedback and changed it.',
    voices: ['Dorrie Jones'], visual: 'diagram',
    visualNotes: 'THE explainer is v2/public/images/product/stretch-bed-overview.png (canon key assembly-sequence). Moving version: design/deck-assets/video/assembly-timelapse-2026-07-04.mov.',
  },
  {
    n: 5, id: 'proof', name: 'Already shipped, and every one is trackable',
    why: 'Canon proof before the model, so the model is read as a description of something real. Every figure labelled.',
    talkTrack: '540 beds: 177 Stretch and 363 Basket. 22 washing machines. 11 communities. 3,540kg of plastic, which is Stretch only at 20kg each because Basket Beds count zero. $713,827 of Goods revenue FY26 to date on a Goods-only carve-out, which is a workpaper prepared with the accountant, not a signed document. Newest run: 40 Stretch Beds and 2 washers to Maningrida, legs pressed at our own plant, invoiced on INV-0303. And 200 to 350 bed requests we have not filled.',
    voices: ['Annie Morrison'], visual: 'stats',
    visualNotes: 'Map: design/deck-photos/map-deployed.png (chrome-free export from /export/map/deployed, washers sum to 22).',
  },
  {
    n: 6, id: 'pathway-board', name: 'The Pathway Board',
    why: 'THE ONE DIAGRAM in the deck. The model carries four structural ideas (six stages, nine modules, three entities, four money lanes) and a room can only hold one picture. Stages plus modules plus what-the-community-holds collapse into a single readable object.',
    talkTrack: 'Goods is not a product company with a distribution problem. It is a menu a community picks from. Six stages, and at the end of each one the community holds something: the agenda, the design, the terms, the making, the enterprise, then the story and the surplus. Nine modules, and you take only what you want. Communities can begin anywhere and move at their own pace. Not every community needs the whole system.',
    voices: [], visual: 'diagram',
    visualNotes: 'Rendered natively from pathway-stages.ts so it cannot drift. If a hand-drawn version is wanted later, Gemini generates the composition and it gets redrawn as vector: raster output is reference, not shipping art.',
  },
  {
    n: 7, id: 'four-boards', name: 'Four communities, four different orders',
    why: 'Proves the model is not a diagram by showing the same menu producing four genuinely different shapes, each with a named next decision. This is what makes "communities choose" credible rather than rhetorical.',
    talkTrack: 'Urapuntja took equipment, skills and people and asked for a shredder. Tennant Creek is building through the shed that already exists. Oonchiumpa took almost the whole menu and has REAL at Stage Two for about $2M over three years, applied not secured. Palm Island starts with Council and listening, and nothing else, because that is what they asked for. Four next decisions, one per community.',
    voices: [], visual: 'diagram',
    visualNotes: 'These are interest and requests, NOT signed agreements. Say so on the slide and out loud.',
  },
  {
    n: 8, id: 'making-is-handover', name: 'The making is the first thing we hand over',
    why: 'Connects Deliver to Transfer. Assembly already happens on Country, so the handover has already started; it is not a future promise.',
    talkTrack: '$130 fair wage per bed is already inside the community cost path. Assembly is already happening on Country and it is the first module that moves, before any press does. A production role runs at about $100 a day next to more than $3,600 a day for youth detention, per the Productivity Commission early 2026.',
    voices: ['Mykel'], visual: 'story',
    visualNotes: 'Photo: v2/public/images/build/build-041.jpg. Video option in the room: partners/oonchiumpa/mykel-building-the-bed.mp4.',
  },
  {
    n: 9, id: 'the-hinge', name: 'Pressing on Country is the whole argument',
    why: 'The economic hinge. Everything before it is why, everything after is how much. The honesty about $426/$324 being modelled is the strongest thing on the slide, not the weakest.',
    talkTrack: '$65 of a $750 bed stays in community today because we buy the legs finished. $324 when the pressing happens on Country. The block is $109,500 a year to run Goods before a single bed is made, so break-even is 338 beds once pressing is ours. Then say the honest thing: the $324 is modelled from verified part prices, not measured at production rate, and the first thing your money buys is the measured run that proves it.',
    voices: ['Dianne Stokes'], visual: 'stats',
    visualNotes: 'Plastic loop winner: generated-images/goods-illustrations/process-anchors/01-plastic-loop-v2.png. The four old chart PNGs are RETIRED (Ben 2026-07-21): charts are redrawn native.',
  },
  {
    n: 10, id: 'three-doors', name: 'Three doors, all ending in the same place',
    why: 'A funder needs to know which entity they transact with before they can say yes. Four money lanes mapped onto three entities plus the community owner.',
    talkTrack: 'Give to Goods on Country, the Butterfly Movement: gifts buy time. Buy from Goods., A Curious Tractor: sales carry the middle and prove the product is bought because it works. Lend through ACT: loans bridge orders and site capital finishes the transfer. And community entities own the making, as members of the charity rather than clients of it. Equity is not sold, and gifts never fund the company.',
    voices: [], visual: 'diagram',
    visualNotes: 'Inter-entity agreement: say "being formalised, completion in progress", never present tense. Butterfly AGM targeted around 14 September.',
  },
  {
    n: 11, id: 'the-ask', name: 'AU$400,000 signed by 31 August',
    why: 'The ask sits LAST, after the hinge and the doors have earned it. The $400K is what gets signed; QBE is the match vehicle, not the ask.',
    talkTrack: '$400,000 in signed commitments by 31 August, and QBE matches it dollar for dollar: an $800,000 program that takes Goods to the point it funds itself. Submission 14 September, outcomes November. It buys the measured run, plant capital at $100K to $150K a site, the first on-Country operator roles, and working capital. The stack we are asking to sign is SEFA $300K repayable, Snow $100K, Centrecorp $75K, which is $475K against a $400K target. Signed to date: zero. We say so.',
    voices: [], visual: 'stats',
    visualNotes: 'Floor is $150K matched. Above $400K the match stops. REAL is a separate vehicle, excluded from the match.',
  },
  {
    n: 12, id: 'the-close', name: 'Leave the making with us',
    why: 'Returns to the handover line so the deck closes where it opened. The synthesis line is labelled as a Goods synthesis and never attributed to a person.',
    talkTrack: 'We know what we need. Sit down and ask us, make it with us, and leave the making with us. That is a Goods synthesis of community direction across eleven communities, not anyone\'s quote. The design principle: nobody funds Goods forever.',
    voices: [], visual: 'type',
  },
];

// ── Quote topic tagging (for the storyteller browser) ───────────────────────

export const QUOTE_TOPICS = [
  'washing machines',
  'beds & sleep',
  'making & work',
  'design feedback',
  'freight & cost',
  'health',
  'home & country',
  'demand',
] as const;
export type QuoteTopic = (typeof QUOTE_TOPICS)[number];

const TOPIC_PATTERNS: [QuoteTopic, RegExp][] = [
  ['washing machines', /wash(ing|er)|laundry|blanket|kari/i],
  ['beds & sleep', /\bbed|mattress|sleep|swag|off the (floor|ground)/i],
  ['making & work', /\bmak(e|ing)|build|rocking up|job|work|factory|training|skill/i],
  ['design feedback', /lower|higher|comfy|comfortable|put together|easy to|design|stronger|repair/i],
  ['freight & cost', /freight|barge|boat|cost|price|pay|adds up|afford/i],
  ['health', /health|sick|scabies|skin|infection|back|legs|muscles|doctor|clinic/i],
  ['home & country', /country|home|calling me|community|family|our (people|land|ways)/i],
  ['demand', /make (one|some) for|can i|want(ed)? (one|a|to have)|asked? for|another/i],
];

export function quoteTopics(text: string): QuoteTopic[] {
  return TOPIC_PATTERNS.filter(([, re]) => re.test(text)).map(([t]) => t);
}

// ── The ask, reviewed ────────────────────────────────────────────────────────

export interface AskBucket {
  name: string;
  amount: string;
  what: string;
  label: 'modelled' | 'target' | 'verified';
}

export const ASK_REVIEW = {
  headline: 'AU$400,000 of signed, match-eligible capital by 31 August 2026',
  match: 'QBE Catalysing Impact Stage 2: up to $400K, at least matched by signed external capital, repayable finance prioritised. Applied Sept 2026, outcomes Nov 2026. NOT secured — never present it as cash.',
  matchGate: 'The match gate needs signed LOIs — the headline conversion metric (currently 0; see canon signed-lois). EOI, LOI and term sheet all count as scoring evidence.',
  buckets: [
    { name: 'Prove', amount: '$60-80K', what: 'A measured 50-bed production run in our own plant: cost, cycle time, quality, paid hours — modelled numbers become measured ones.', label: 'modelled' },
    { name: 'Lock', amount: 'within round', what: 'Vendor quotes for shredder / press / CNC, signed demand, contracting structure.', label: 'target' },
    { name: 'Build', amount: '$112-222K gross', what: 'First production facility + workforce pathway. $110,046 already invested, so the net plant ask is $2-112K pending quotes.', label: 'modelled' },
    { name: 'Transfer', amount: 'the return', what: 'Plant, commercial rights, margin, knowledge and decisions moving to community hands (Oonchiumpa first). A pathway, never claimed complete.', label: 'target' },
  ] as AskBucket[],
  modelledEconomics: [
    { item: 'Marginal cost / bed, buy-kit path', figure: '$684.79', label: 'verified (engine-locked)' },
    { item: 'Marginal cost / bed, own factory', figure: '$425.74', label: 'verified (engine-locked)' },
    { item: 'Marginal cost / bed, community fair-wage path', figure: '$420.74', label: 'modelled' },
    { item: 'Leg-kit markup captured by pressing in-house', figure: '8.6x (~$194/bed)', label: 'verified (engine-locked)' },
    { item: 'Fair wage inside the community path', figure: '$130/bed', label: 'modelled' },
    { item: 'Container plant capital', figure: '~$125K mid-range ($112-222K gross)', label: 'modelled, pending vendor quotes' },
    { item: 'Break-even, factory path', figure: '~338 beds/yr', label: 'modelled' },
    { item: 'One container at 500 beds/yr', figure: '~$140K site surplus after ~$24K overhead; ~$65K wages; 10t plastic', label: 'modelled' },
  ],
};

// ── The new direction (entity + charity) ─────────────────────────────────────

export const DIRECTION = {
  headline: 'One trading company, one charity, ownership moving to community',
  points: [
    'Trading today: Nicholas Marchesi sole trader (ABN 21 591 780 066) — the migration starting point, not the destination.',
    'Go-forward: A Curious Tractor Pty Ltd (ACN 697 347 676) trading as Goods., the maker and seller; operations migrate FY2026-27. "Goods on Country" is the CHARITY, a business name of The Butterfly Movement Ltd (ruling K). Not finished — never present it as done.',
    'DGR / charity home: The Butterfly Movement Ltd (ABN 22 155 132 684) — the ONLY deductible vehicle, operational from FY2026-27. No DGR claims before the handover.',
    'A Kind Tractor Ltd is dormant. Never cite it.',
    'The 51% First Nations ownership decision gates IBA / First Australians Capital; target is post-Butterfly (~end July, MinterEllison).',
    'Community ownership is a pathway: plant, contracts, margin, knowledge and decisions transfer — Oonchiumpa is the first pathway.',
  ],
};
