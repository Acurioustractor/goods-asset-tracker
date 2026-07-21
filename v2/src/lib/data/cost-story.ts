/**
 * THE COST STORY — the single narrative cost model for /admin/cost-model.
 *
 * Source of truth chain:
 *   - Notion "Goods by the numbers — first principles" DB (86afc4cf…, pulled 2026-07-20)
 *   - Advisor Q&A draft (QBE cost advisors, 12 questions, e7e3e0a0…)
 *   - Cost model v6 (engine-locked, `@/lib/cost-model/engine`) + 01 Bill of Materials
 *   - Proof figures corrected to code canon (`canon.ts`) where Notion was stale
 *     (Notion said 496 beds / 9 communities; canon = 540 / 11).
 *
 * Every figure carries an honesty label. NEVER quote a `workpaper` figure as
 * exact ("about" it), never present `modelled` as measured, and never lead
 * with a `target`. The two `conflict` rows are unresolved — quote the range
 * and say so. The retired $600/bed figure gets redirected, not repeated.
 */

export type Solidity =
  | 'verified' // invoice or signed doc
  | 'workpaper' // our math, checkable, accountant endorsement pending
  | 'modelled' // built from verified inputs, not yet demonstrated
  | 'target' // future state
  | 'conflict' // two figures coexist — pick one
  | 'retired'; // not ours / do not use

export const SOLIDITY_LABEL: Record<Solidity, string> = {
  verified: 'Verified',
  workpaper: 'Workpaper',
  modelled: 'Modelled',
  target: 'Target',
  conflict: 'Conflict',
  retired: 'Retired',
};

export interface CostFact {
  label: string; // plain-words name
  value: string; // the figure
  solidity: Solidity;
  means: string; // one sentence anyone can read
  watchOut?: string; // the confusion trap
  source: string; // where it comes from
}

export interface CostChapter {
  slug: string;
  title: string;
  /** The one-breath version of this chapter — funder-readable. */
  lede: string;
  facts: CostFact[];
}

/** The 30-second version, in order. Say this before showing any table. */
export const COST_STORY_SPINE = [
  'A bed sells for $750. Made the current way (legs bought as a finished kit), the next bed costs about $685 and only ~$65 stays with Goods.',
  'The one hard fact under the whole model: we pay 8.6× the raw-material cost to buy legs finished. The plastic itself is $40–55.',
  'Press the legs ourselves and the next bed costs about $426 — ~$324 stays. Five times more than today. The Maningrida Stretch run (40 beds, INV-0303) was pressed at our own facility at the farm — the capability is proven. What we have not yet done is press at production rate with measured per-bed costs. That honesty is the pitch, not a weakness.',
  'Running the business costs about $109.5K a year before any bed is made. At $324/bed that is ~338 beds a year to break even; at $65/bed it is ~1,679 — which is exactly why we in-source.',
  'The equipment costs $112–222K gross; $110,046 is already invested, so the remaining ask is $2–112K net. We do not spend it until ~300+ beds/yr are committed.',
  'Plastic is a paid input today (~$55/bed), not free. Free community feedstock is the end state of the ladder, not the current state.',
  'The proof: 540 beds in 11 communities, $713,827 accountant-signed revenue, and 1,000+ beds of named demand on the table.',
] as const;

export const COST_CHAPTERS: CostChapter[] = [
  {
    slug: 'selling',
    title: 'Selling a bed',
    lede: 'Every bed sells for $750, whichever way we make it. The way we make it decides how much stays.',
    facts: [
      {
        label: 'What a bed sells for',
        value: '$750',
        solidity: 'verified',
        means: 'Every bed sells for $750, whichever way we make it.',
        source: 'Price list / Area 11 canon',
      },
      {
        label: 'Left over per bed — today',
        value: '~$65',
        solidity: 'workpaper',
        means: 'Make a bed the current way (buy the legs as a kit) and only about $65 stays with Goods.',
        source: '03 · Cost Model & Build Paths',
      },
      {
        label: 'Left over per bed — if we press our own legs',
        value: '~$324',
        solidity: 'modelled',
        means: 'Press the legs ourselves and about $324 of every bed stays — five times more than today.',
        source: '03 · Cost Model & Build Paths',
      },
    ],
  },
  {
    slug: 'making-today',
    title: 'Making a bed today',
    lede: 'Nearly half the cost of a bed is the one part we buy finished. The plastic in it is cheap; what we pay for is someone else’s pressing.',
    facts: [
      {
        label: 'The 8.6× markup on legs (the “idiot index”)',
        value: '8.6×',
        solidity: 'verified',
        means: 'We pay 8.6 times the raw-material cost to buy legs finished. The one hard fact under the whole model.',
        watchOut: 'This is the model’s only fully verified pillar — lead with it.',
        source: '01 Bill of Materials',
      },
      {
        label: 'Legs kit from the supplier (Defy)',
        value: '$344.05',
        solidity: 'verified',
        means: 'Nearly half the bed’s cost is the one part we buy finished — the recycled HDPE legs.',
        source: 'Defy invoice / 01 BOM',
      },
      {
        label: 'Raw plastic in a set of legs',
        value: '$40–55',
        solidity: 'modelled',
        means: 'The plastic itself is cheap. What we pay for today is someone else’s pressing.',
        source: '03 · Cost Model & Build Paths',
      },
      {
        label: 'Direct materials total (all parts)',
        value: '$469.79',
        solidity: 'verified',
        means: '$344.05 legs + $27 steel + $93.50 canvas + $3.20 caps + $1.04 screws + $1.00 bolts. Materials only.',
        watchOut: 'Materials only — don’t quote this as “the cost of a bed”.',
        source: '01 BOM (sum check)',
      },
      {
        label: 'Cost to make one more bed today',
        value: '$684.79',
        solidity: 'workpaper',
        means: 'Kit legs + steel + canvas + hardware + assembly + freight: the next bed costs about $685.',
        watchOut: 'This is the cost of the NEXT bed. Dividing all annual costs by beds made gives ~$1,780 — arithmetically real but misleading. Don’t mix the two.',
        source: '01 BOM + 03 build paths',
      },
      {
        label: 'Long-haul freight (Sydney → remote)',
        value: '~$150',
        solidity: 'modelled',
        means: 'Moving the Defy kit from Sydney to remote communities — what takes the next bed to ~$685.',
        watchOut: 'Variable by destination — and exactly what the retired $600/bed figure left out.',
        source: '01 Bill of Materials',
      },
      {
        label: 'Saving per bed if we press legs ourselves',
        value: '$194',
        solidity: 'modelled',
        means: 'Kit costs $344; pressing our own costs about $150. About $194 stays with Goods on every bed.',
        watchOut: 'Modelled from verified inputs. Becomes a measured number after the 50-bed run.',
        source: '03 · Cost Model & Build Paths',
      },
    ],
  },
  {
    slug: 'making-ourselves',
    title: 'Making it ourselves',
    lede: 'The capability is proven — the Maningrida run was pressed at our own facility at the farm. What is not yet proven is the cost at production rate. The measured run is what converts it.',
    facts: [
      {
        label: 'Beds pressed at our own facility',
        value: '40 (the Maningrida Stretch run, INV-0303)',
        solidity: 'verified',
        means: 'The Maningrida beds were pressed at our production facility at the farm and assembled in community. In-house pressing is a demonstrated capability, not a hypothesis.',
        watchOut: 'What we have NOT yet done: pressed at production rate with measured per-bed costs — that is what the $426 figure still models, and what the measured run proves. Say this before anyone else does.',
        source: 'Ben ruling 2026-07-21; invoice INV-0303: 40 Stretch Beds, Xero-verified 2026-07-13 (register total 58 = 40 Stretch + 18 Basket; Basket has no pressed legs). Supersedes the "0 pressed" Area 11 note.',
      },
      {
        label: 'Cost per bed — our own factory',
        value: '$425.74',
        solidity: 'modelled',
        means: 'With pressing and CNC in-house, the next bed costs about $426 instead of $685.',
        source: '03 · Cost Model & Build Paths (engine-locked)',
      },
      {
        label: 'Cost per bed — community-owned site',
        value: '~$421',
        solidity: 'modelled',
        means: 'Same economics moved onto Country: local feedstock, fair wages, and the margin stays in community.',
        watchOut: 'Each site adds ~$24K/yr overhead (modelled). Site capex still needs quote-backed verification.',
        source: '03 · v6 community parity',
      },
      {
        label: 'The 50-bed test run',
        value: '~$60–80K',
        solidity: 'target',
        means: 'The experiment that turns the modelled in-house cost into a measured one.',
        source: 'Area 11 key points',
      },
    ],
  },
  {
    slug: 'running',
    title: 'Running the business',
    lede: 'About $109.5K a year keeps the lights on before any bed is made. The margin per bed decides how many beds cover it — that is the whole investment case.',
    facts: [
      {
        label: 'Fixed running costs per year',
        value: '~$109,500',
        solidity: 'workpaper',
        means: 'Facility share $27K + founder production time $16.8K + admin $14.7K + field travel $51K.',
        watchOut: 'Accountant sign-off pending — say “about”, never an exact figure. Only 30 founder production days sit in bed economics; fundraising days are deliberately excluded.',
        source: '04 · Verified Financials + advisor Q&A (Q1)',
      },
      {
        label: 'Break-even — today’s method',
        value: '~1,679 beds/yr',
        solidity: 'modelled',
        means: 'At $65 left per bed we’d need ~1,679 beds a year to cover fixed costs. Not viable — that’s the point.',
        source: '03 · Cost Model & Build Paths',
      },
      {
        label: 'Break-even — pressing in-house',
        value: '~338 beds/yr',
        solidity: 'modelled',
        means: 'At $324 left per bed, about 338 beds a year covers the fixed block. The whole investment case in one number.',
        source: '03 · Cost Model & Build Paths',
      },
      {
        label: 'Beds made per year right now',
        value: '~120',
        solidity: 'verified',
        means: 'Today’s actual run-rate, before any new capital.',
        watchOut: 'This is the volume the advisors’ 7.2-year payback assumes stays flat — it won’t.',
        source: 'Production telemetry',
      },
      {
        label: 'One facility’s capacity',
        value: '~1,000 beds/yr',
        solidity: 'target',
        means: 'What a fitted-out facility could make per year once equipment and people are in place.',
        source: '03 · Cost Model & Build Paths',
      },
    ],
  },
  {
    slug: 'capital',
    title: 'The capital ask',
    lede: 'The equipment is $112–222K gross. $110,046 is already invested, so the remaining ask is small — and we don’t spend it until ~300+ beds/yr are committed.',
    facts: [
      {
        label: 'Factory set-up cost (gross)',
        value: '$112–222K (midpoint ~$167K)',
        solidity: 'modelled',
        means: 'Shredder $15–30K, hot press $80–150K, CNC $15–40K, benches ~$2K.',
        watchOut: 'Never say “quoted” or “actual”. Three vendor quotes pending — getting them is the single biggest credibility upgrade.',
        source: '03 · Cost Model & Build Paths',
      },
      {
        label: 'Already invested in the facility',
        value: '$110,046',
        solidity: 'verified',
        means: 'Facility and tooling already paid for — the reason the remaining ask can be small. (~$80K TFN + ~$20K ACT.)',
        source: 'Xero / 04 · Verified Financials',
      },
      {
        label: 'Net remaining ask',
        value: '$2–112K',
        solidity: 'modelled',
        means: 'Gross set-up cost minus what’s already invested.',
        watchOut: 'Always say whether you’re quoting gross or net. Mixing them is the #1 source of confusion in past conversations.',
        source: 'Area 11 key points',
      },
      {
        label: 'QBE Stage 2 ask',
        value: 'up to $400K · matched ≥1:1',
        solidity: 'target',
        means: 'Up to $400K from QBE, at least matched by signed external capital.',
        watchOut: 'Not secured until awarded — always say so. Stage 2 closes late September; LOIs due 31 Aug.',
        source: 'QBE Stage 2 brief',
      },
      {
        label: 'The advisors’ 7.2-year payback',
        value: '~7.2 years',
        solidity: 'retired',
        means: 'Their math: capex ~$167K ÷ savings at today’s 120 beds/yr. At 338 beds/yr it’s ~2.5 years; at 500, ~1.7.',
        watchOut: 'Not our figure. It is a capex payback at flat current volume, not an operating breakeven — and the capex is volume-gated anyway. Confirm the definition with the advisors (Q4).',
        source: 'Reconstructed in advisor Q&A (Q4)',
      },
      {
        label: 'Equipment maintenance allowance',
        value: '3–5% of capex/yr (~$5–8K)',
        solidity: 'modelled',
        means: 'Blades, filters, CNC bits, software licences, annual service.',
        watchOut: 'Placeholder (advisor Q9) until vendor service schedules land — then fold into unit costs. The maintenance regime itself is lived daily practice, documented in the plant handover pack.',
        source: 'Advisor Q&A (Q9)',
      },
    ],
  },
  {
    slug: 'plastic',
    title: 'Plastic & recycling',
    lede: 'Plastic is a paid input today, not free. The recycling benefit is a ladder we are already climbing — free feedstock is the end state, not the current state.',
    facts: [
      {
        label: 'What we pay for plastic today',
        value: '$2.75/kg (~$55/bed)',
        solidity: 'verified',
        means: 'Plastic is a paid input today ($2.00/kg + $0.75 delivery) — community collection is what changes that.',
        watchOut: 'Don’t claim feedstock is free today — it isn’t. The ladder down: free HDPE offer (ADN Street), $0.80/kg pellets (Envirobank quote), council collection fees flipping it to revenue.',
        source: 'Supplier quotes / plastic sheet calcs',
      },
      {
        label: 'Plastic in one bed',
        value: '20kg vs 25kg',
        solidity: 'conflict',
        means: 'How much recycled HDPE goes into one bed’s legs.',
        watchOut: 'Canon says ~20kg; the Envirobank brief said ~25kg. Pick one and fix it everywhere.',
        source: 'Product spec vs Envirobank correspondence',
      },
    ],
  },
  {
    slug: 'proof',
    title: 'Proof & demand',
    lede: 'This is not a pre-revenue pitch: real beds in real communities, accountant-signed revenue, and named demand bigger than one year of full-facility output.',
    facts: [
      {
        label: 'Delivered so far',
        value: '540 beds · 11 communities · 3,540kg HDPE',
        solidity: 'verified',
        means: 'Real beds in real communities — the track record the whole case stands on. (363 Basket + 177 Stretch; HDPE is Stretch-only at 20kg/bed.)',
        watchOut: 'The Notion numbers DB still says 496/9 — stale; register-verified canon is 540/11.',
        source: 'Asset register / canon.ts (Ben rulings 2026-07-19)',
      },
      {
        label: 'Revenue to date',
        value: 'AU$713,827',
        solidity: 'verified',
        means: 'Accountant-signed Goods-only revenue. The business already trades.',
        watchOut: 'Externally, ONLY this figure — never the $403,901 “surplus” (entity P&L is a net loss).',
        source: 'Accountant letter / 04 · Verified Financials',
      },
      {
        label: 'Demand on the table',
        value: '1,000+ beds + 300 washers',
        solidity: 'target',
        means: 'Centrecorp ~237, NPY 200–350, WHSAC/Groote ~500 beds + 300 washers (~$1.7M), Homeland Schools 65, PICC 141.',
        watchOut: 'Conversations and LOIs, not signed orders — say so. LOIs due 31 Aug for Stage 2.',
        source: 'Capital Pipeline Master DB',
      },
      {
        label: 'The old $600/bed figure',
        value: 'retired',
        solidity: 'retired',
        means: 'Excluded long-haul freight and fixed-cost absorption. If someone quotes it, redirect to $685 / $426.',
        watchOut: 'Still circulating in older decks and conversations.',
        source: 'Area 11 guardrails',
      },
    ],
  },
];

/** The open items that block "signed-off": what Ben/accountant still have to call. */
export const COST_OPEN_ITEMS = [
  'Accountant endorses the fixed-block split ($27K facility / $16.8K founder production / $14.7K admin / $51K travel) — advisor Q1.',
  'Confirm the 7.2-year reconstruction and volume scenario with the advisors — Q4.',
  'Three vendor quotes (shredder, hot press, CNC) land → replace the 3–5% maintenance placeholder and the $112–222K range — Q9.',
  'Capex conflict: $110,046 confirmed vs $112–222K range — accountant to confirm how they nest.',
  'Plastic per bed: 20kg (canon) vs 25kg (Envirobank brief) — pick one, sweep everywhere.',
  'Approval for advisors to contact other plastic producers (Replas, Plastic Forests) — Q10.',
] as const;
