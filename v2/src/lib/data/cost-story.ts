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
 * with a `target`. If a new conflict appears, quote the range and say so. The
 * retired $600/bed figure gets redirected, not repeated.
 *
 * ONE MODEL, RESOLVED 17 September 2026. For a few hours this file printed four `conflict`
 * rows, because Ben's 15 September rulings had built a second model on a branch nobody had
 * merged while this page still showed cost model v6. Both were defensible arithmetic over
 * different scopes, which is exactly what made them dangerous side by side: v6 counted only
 * the production share of the organisation, so break-even came out at a third of the real
 * number.
 *
 * The ruled model now lives on main in `the-year-and-the-raise.ts` and this file reads from
 * it. The v6 figures are named as retired where somebody might still quote them. Nothing here
 * types a figure that the model can derive.
 */

import {
  BED_MAKE_AUD,
  BED_FREIGHT_AUD,
  FACILITATION_PER_BED_AUD,
  CONTRIBUTION_AUD,
  RUNNING_AUD,
} from './the-year-and-the-raise';

const aud = (n: number) => Math.round(n).toLocaleString('en-AU');

/** Break-even is the running cost over what one bed hands the organisation. One model, one answer. */
const BREAK_EVEN_BEDS = Math.ceil(RUNNING_AUD / CONTRIBUTION_AUD);

/**
 * The kit path measured on the same basis. $65 is what is left before the organisation absorbs
 * freight and facilitation, and those are $200 a bed, so buying legs finished does not cover them
 * at all. That is the whole argument for in-sourcing, stated in the model's own arithmetic rather
 * than against a different running cost.
 */
const KIT_PATH_LEFT_AUD = 65;
const KIT_PATH_ABSORBED_AUD = BED_FREIGHT_AUD + FACILITATION_PER_BED_AUD;

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
  `Press the legs ourselves and the bed costs $${aud(BED_MAKE_AUD)} to make, and $${aud(CONTRIBUTION_AUD)} reaches the organisation `
    + 'after it absorbs freight and facilitation. The Maningrida Stretch run (40 beds, INV-0303) was pressed at the Goods on Country '
    + 'facility in Queensland, so the capability is proven. What we have not yet done is press at production rate with measured '
    + 'per-bed costs, and the make cost stays provisional until the bought leg-panel yield is known. That honesty is the pitch, not a weakness.',
  `Running the organisation costs $${aud(RUNNING_AUD)} a year before any bed is made. At $${aud(CONTRIBUTION_AUD)} a bed that is `
    + `${BREAK_EVEN_BEDS.toLocaleString('en-AU')} beds a year to break even. Buying the legs finished never breaks even at any volume, `
    + 'which is exactly why we in-source.',
  'The equipment costs $112–222K gross. $110,046 is already invested and sits beside that figure as evidence of skin in the game, never netted off it. We do not spend it until ~300+ beds/yr are committed.',
  'Plastic is a paid input today (~$55/bed), not free. Free community feedstock is the end state of the ladder, not the current state.',
  'The proof: 540 beds in 11 communities, 177 of them the Stretch Bed this model costs, and a paid bed trade of 320 beds to four buyers worth $247,770 ex GST. '
    + 'The $713,827 revenue workpaper is held off the applications until Standard Ledger rules on it.',
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
        value: `$${aud(CONTRIBUTION_AUD)}`,
        solidity: 'modelled',
        means:
          `Press the legs ourselves and the bed costs $${aud(BED_MAKE_AUD)} to make. The organisation ` +
          `absorbs freight at $${BED_FREIGHT_AUD} and facilitation at $${aud(FACILITATION_PER_BED_AUD)} out ` +
          `of its share, so $${aud(CONTRIBUTION_AUD)} of every bed reaches it. Nothing is ever added to the $750.`,
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
        value: `$${BED_FREIGHT_AUD} a bed, absorbed`,
        solidity: 'modelled',
        means:
          'Ben, 15 September 2026: freight is $100 a bed all up, absorbed by the organisation out of its share ' +
          'rather than added to the price a community pays.',
        watchOut:
          'Variable by destination, and exactly what the retired $600/bed figure left out. The earlier ~$150 ' +
          'modelled estimate is retired. It is never added to the $750.',
        source: 'Ben ruling 15 September 2026 (the-year-and-the-raise.ts)',
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
    lede: 'The capability is proven — the Maningrida run was pressed at the Goods on Country facility in Queensland. What is not yet proven is the cost at production rate. The measured run is what converts it.',
    facts: [
      {
        label: 'Beds pressed at our own facility',
        value: '40 (the Maningrida Stretch run, INV-0303)',
        solidity: 'verified',
        means: 'The Maningrida beds were pressed at the Goods on Country facility in Queensland and assembled in community. In-house pressing is a demonstrated capability, not a hypothesis.',
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
        label: 'Running the organisation for a year',
        value: `$${aud(RUNNING_AUD)}`,
        solidity: 'workpaper',
        means:
          'The whole organisation before a single bed is made: founders $151,200, getting to communities ' +
          '$51,000, accounting and audit $3,674 (Butterfly\u2019s FY26 actual), rent on the Goods on Country ' +
          'facility in Queensland $27,000, marketing $10,000, maintenance $8,350.',
        watchOut:
          'RETIRED, and do not quote it: the old $109,500 counted only the production share and excluded the ' +
          'founder days spent fundraising, which made break-even look like a third of what it is. Whether the ' +
          'founders line includes superannuation is still unconfirmed.',
        source: 'Ben provision 9 September 2026, cut 15 September (the-year-and-the-raise.ts)',
      },
      {
        label: 'Break-even — today’s method',
        value: 'never',
        solidity: 'modelled',
        means:
          `Buying the legs finished leaves about $${KIT_PATH_LEFT_AUD} a bed before the organisation absorbs ` +
          `$${aud(KIT_PATH_ABSORBED_AUD)} of freight and facilitation. It does not cover them at any volume, ` +
          `so there is no bed count that breaks even on the kit path. That is the argument for in-sourcing, ` +
          `and it is the model's own arithmetic rather than a comparison across two models.`,
        watchOut:
          'The retired ~1,679 came from dividing the old production-only running cost by the same $65. Do not ' +
          'quote it, and do not restate this line as a loss per bed on beds already sold: it is the forward ' +
          'model at a full year of organisation cost.',
        source: 'Derived from the-year-and-the-raise.ts and the v6 bill of materials',
      },
      {
        label: 'Break-even — pressing in-house',
        value: `${BREAK_EVEN_BEDS.toLocaleString('en-AU')} beds/yr`,
        solidity: 'modelled',
        means:
          `The running cost over what one bed hands the organisation: $${aud(RUNNING_AUD)} over ` +
          `$${aud(CONTRIBUTION_AUD)}. Derived, never typed, so it moves when either number does.`,
        watchOut:
          'RETIRED, and do not quote it: ~338 divided the old production-only running cost by a per-bed figure ' +
          'taken before freight and facilitation. Two different scopes, one number, and it flattered us.',
        source: 'Derived from the-year-and-the-raise.ts (Ben rulings 15 September 2026)',
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
    lede: 'The equipment is $112–222K gross, a rough range with a lot of variables in it that could plausibly reach about $200K. Separately, $110,046 is already invested. We quote both side by side and never net one off the other, and we don’t spend it until ~300+ beds/yr are committed.',
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
        solidity: 'workpaper',
        means: 'Actual spend standing up the Goods on Country facility in Queensland, mostly bought second hand. About $43,700 of it is evidenced at bill level in the connected Xero; the balance is plant we own whose paperwork is still catching up, chiefly the shredder ($19,800, running, invoice not yet located) and a recently bought larger CNC. A filing job, not a fiction.',
        watchOut: 'Present this BESIDE the gross ask as evidence of skin in the game, never subtracted from it. Not “verified”: only the $43,700 is bill-evidenced. The ~$75K in the minimal-viable-facility note is a bill-level subtotal, not a competing total.',
        source: 'Ben ruling 2026-07-25 (Matt model input 2); Xero bill-level pull 2026-07-22',
      },
      {
        label: 'QBE Stage 2 ask',
        value: '$300,000 · two production facilities',
        solidity: 'target',
        means:
          'QBE is asked for plant, not beds: two facilities at a $150,000 allowance each. Every other funder ' +
          'is asked for 133 beds at the published $750, which is $99,750, and nobody is asked for running cost.',
        watchOut:
          'The catalytic grant is NOT a dollar-for-dollar match (ruling V), and the $1.1M is ONE pool shared ' +
          'across ten enterprises, so $400K was the top of a range and never a plan. Not secured until ' +
          'awarded. Closes Friday 25 September, 12pm AEST; board 19 November.',
        source: 'Ben rulings 2026-09-15 (two facilities, beds elsewhere) · ruling V · QBE Stage 2 terms',
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
        value: '20kg',
        solidity: 'workpaper',
        means: 'How much recycled HDPE goes into one bed’s legs. Ben ruling 2026-08-24: 20kg; the Envirobank brief’s ~25kg is retired. Becomes measured when the measured run weighs batches per run (material_traceability_schema).',
        watchOut: 'One tonne of clean HDPE ≈ 50 leg-sets. Never use 45kg/bed or anything derived from it — see research/nt-plastics-overcrowding-facts-2026-08-24.md.',
        source: 'Product spec; Ben ruling 2026-08-24, superseding Envirobank correspondence',
      },
    ],
  },
  {
    slug: 'proof',
    title: 'Proof & demand',
    lede: 'This is not a pre-revenue pitch: real beds in real communities, and beds people have paid for. The demand line is withdrawn; trade is the only record.',
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
        // RULING G/H 2026-07-25: no signed accountant document exists. Figure stays, word goes.
        solidity: 'workpaper',
        means:
          'Goods-only revenue on a workpaper basis. HELD since 17 September 2026: the FY26 carve-out found ' +
          'the file behind it was $590,091 of which $276,132 (46.8%) is philanthropy invoiced as sales, and ' +
          'real FY26 Goods trading income is $313,960 ex GST across 13 invoices to 7 buyers.',
        watchOut:
          'Off all five applications until Standard Ledger rules. Lead with the paid bed trade instead: 320 ' +
          'beds, four buyers, $247,770 ex GST (revenue basis) or $273,966 inc GST (bank basis) — name the ' +
          'basis every time. Never “signed”, and never the $403,901 “surplus”.',
        source: 'FY26 carve-out reconciliation 2026-09-17 · Standard Ledger scope sent same day',
      },
      {
        label: 'Demand on the table',
        value: 'withdrawn',
        solidity: 'retired',
        means:
          'Ben, 15 September 2026: the bed figures behind this line were made up, and they are not repeated ' +
          'here, because a withdrawn number quoted inside its own withdrawal is still a number somebody can ' +
          'copy. The delivered Centrecorp beds were among them, and delivered beds are a track record, never ' +
          'demand. The only demand record is the paid trade.',
        watchOut:
          'If a demand number is needed, use the paid trade: 320 beds to four buyers. Anything else is a ' +
          'conversation, and a conversation is not a number.',
        source: 'Ben ruling 2026-09-15 (withdrawal) · Ben 2026-09-11 (Centrecorp delivered)',
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
  'Approval for advisors to contact other plastic producers (Replas, Plastic Forests) — Q10.',
] as const;
