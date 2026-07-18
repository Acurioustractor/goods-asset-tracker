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
    n: 1, id: 'main-idea', name: 'From waste to ownership',
    why: 'One line that frames the whole investment before a single number. If an investor remembers nothing else, they remember this ladder.',
    talkTrack: 'Goods makes durable beds and washing machines from local waste plastic, designed and built with remote communities, and the making itself is moving into community hands. Waste, product, skill, work, ownership — that is the whole company in five words.',
    voices: [], visual: 'type',
  },
  {
    n: 2, id: 'first-bed', name: 'The first bed disappeared overnight',
    why: 'Investors remember stories, not stats. This scene proves the founding behaviour — we returned, listened, and were changed by what the family did — before we claim anything.',
    talkTrack: 'The Ninga Mia scene, told plainly: the nervous rainy night, the missing bed, the family who carried it inside, six ladies sharing it, the immediate request for two more, the rope repairs that changed the design. Land on the line: it entered the tent as a prototype and came out as an obligation.',
    voices: ['Gloria Turner'], visual: 'story',
    visualNotes: 'Candidate for a starred Kalgoorlie/Ninga Mia photo breather if one is cleared.',
  },
  {
    n: 3, id: 'why-health', name: 'A bed is health hardware, not furniture',
    why: 'Elevates the product from furniture to health infrastructure — the reason philanthropic and catalytic capital belongs here — while staying inside the claim ceiling.',
    talkTrack: 'Crowding and dirty bedding sit upstream of skin infections, rheumatic fever and rheumatic heart disease. We build the upstream conditions. Say explicitly: we never claim to cure or reduce RHD — the pathway is the why, not an outcome we count.',
    voices: ['Gloria Turner'], visual: 'diagram', illustration: 'goods-ill-health-chain.png',
  },
  {
    n: 4, id: 'problem', name: 'The $3M dumping cycle',
    why: 'Quantifies the market failure: money already flows into remote hardware, it just buys things that die. We are not creating demand, we are redirecting waste.',
    talkTrack: 'Around $3M of washing machines are sold into communities near Alice Springs each year and most are dumped within months. 59% of surveyed remote homes have no working washer. Remote families pay more for products designed for suburbs.',
    voices: [], visual: 'stats',
    visualNotes: 'External estimate + FRRR 2022 survey — keep the source tag visible.',
  },
  {
    n: 5, id: 'product', name: 'The Stretch Bed',
    why: 'Shows the flagship is real, engineered and liked — specs an operator can verify, a voice a person can trust.',
    talkTrack: '26kg so one person carries it, 200kg rated, about five minutes to build with no tools, 10-year design life. Recycled-plastic X-trestle legs, steel poles, structural canvas. Designed in community, washable, repairable.',
    voices: ['Dorrie Jones'], visual: 'stats', illustration: 'goods-ill-x-leg.png',
  },
  {
    n: 6, id: 'authorship', name: 'Communities did not validate the design. They changed it.',
    why: 'The moat. Anyone can press plastic; the design authority and feedback loop with community is the asset capital cannot buy elsewhere.',
    talkTrack: 'Basket Bed became Stretch Bed because of height, washing, repair and transport feedback. The washer is named Pakkimjalki Kari in Warumungu by Elder Dianne Stokes. Every change traces to a person and a place.',
    voices: ['Melissa Jackson', 'Heather Mundo', 'Dianne Stokes'], visual: 'quote-grid',
  },
  {
    n: 7, id: 'how-made', name: 'Local waste becomes a bed',
    why: 'Makes the unit economics physical: once an investor can see the loop, the cost model stops being abstract.',
    talkTrack: 'Collect plastic, shred it, press sheets, cut and assemble. 20kg of plastic per Stretch Bed — counted on Stretch Beds only, never Basket. Offcuts go back into the next press.',
    voices: [], visual: 'diagram', illustration: 'goods-ill-plastic-loop.png',
  },
  {
    n: 8, id: 'model', name: 'The making moves on Country',
    why: 'The investment thesis in one ladder: this is not a product company scaling output, it is a transfer company moving productive capacity.',
    talkTrack: 'Waste to product to skill to work to ownership. Community designs it, builds it, and over time owns the making. Our goal is to become unnecessary.',
    voices: [], visual: 'diagram',
    visualNotes: 'CSS chips now; goods-ill-flywheel.png or containers-fund-containers available if Ben prefers drawn.',
  },
  {
    n: 9, id: 'proof', name: 'Already shipped, and every one is trackable',
    why: 'Traction that survives diligence: every figure is register-backed and labelled, and the newest delivery was made in our own plant — the exact capability the ask funds.',
    talkTrack: '556 beds (193 Stretch + 363 Basket), 9 communities, 18 washers, 3,860kg plastic — Stretch only, 193 by 20kg. Newest: 60 Stretch Beds and 2 washers to Maningrida Homelands with Homeland School Company, made at our farm plant. Every bed has a QR digital twin.',
    voices: ['Annie Morrison'], visual: 'stats',
  },
  {
    n: 10, id: 'impact', name: 'Every bed carries a fixed impact payload',
    why: 'Turns impact from a mood into a countable unit: fund N beds, get N payloads. The verified/modelled labels are themselves the credibility.',
    talkTrack: '20kg plastic kept off Country (modelled), one family off the floor (verified), $130 fair wage per locally made bed (modelled), a consented story (verified). We label every number and never overclaim — that honesty is the impact product.',
    voices: [], visual: 'diagram', illustration: 'goods-ill-impact-per-bed.png',
  },
  {
    n: 11, id: 'ask', name: 'AU$400,000, matched one to one',
    why: 'The specific, dated request. Everything before it earned this slide; everything after it de-risks it.',
    talkTrack: 'AU$400K of signed, match-eligible capital by 31 August 2026, matched through QBE Catalysing Impact to roughly $800K working. It buys the bridge: a measured 50-bed run, the first ownership pathway with Oonchiumpa, the enterprise-support layer, and plant capital. QBE is applied for, not secured — say so.',
    voices: [], visual: 'stats',
  },
  {
    n: 12, id: 'anchor', name: 'Fair wages cost the model nothing',
    why: 'The one economic fact a funder retells at their next meeting. It collapses the assumed trade-off between ethics and viability.',
    talkTrack: 'Community production paying a fair wage lands about $5 a bed below the factory path: $420.74 vs $425.74, both modelled. Mykel is the human proof the wage buys real intent to make.',
    voices: ['Mykel'], visual: 'stats',
  },
  {
    n: 13, id: 'best-case', name: 'One signed round seeds a fleet that funds itself',
    why: 'Shows the compounding upside honestly — labelled modelled, constraint named — so ambition reads as engineering, not hype.',
    talkTrack: '$800K working seeds 3 containers, about 1,500 beds a year, about $312K annual surplus that self-funds roughly 2.5 more containers a year. Year five: 5,000+ beds, 100+ tonnes diverted, $650K+ community wages. Then containers transfer. The constraint is signed demand, not cost.',
    voices: [], visual: 'diagram',
    visualNotes: 'CSS flow now; goods-ill-flywheel.png available as the drawn swap.',
  },
  {
    n: 14, id: 'close', name: 'We know what we need',
    why: 'Ends on community authority, not our projection — and states what the return actually is.',
    talkTrack: 'The synthesis line — always labelled a Goods synthesis of community direction, never an individual quote. Close: the return we are building is the transfer itself.',
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
    'Go-forward: A Curious Tractor Pty Ltd (ACN 697 347 676) trading as Goods on Country; operations migrate FY2026-27. Not finished — never present it as done.',
    'DGR / charity home: The Butterfly Movement Ltd (ABN 22 155 132 684) — the ONLY deductible vehicle, operational from FY2026-27. No DGR claims before the handover.',
    'A Kind Tractor Ltd is dormant. Never cite it.',
    'The 51% First Nations ownership decision gates IBA / First Australians Capital; target is post-Butterfly (~end July, MinterEllison).',
    'Community ownership is a pathway: plant, contracts, margin, knowledge and decisions transfer — Oonchiumpa is the first pathway.',
  ],
};
