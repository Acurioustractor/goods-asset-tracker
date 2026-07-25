/**
 * THE ONE ASK SURFACE: data for /admin/ask
 *
 * The single canonical money surface: what we ask for, why it adds up, where
 * each dollar legally sits, what we spend on product vs people, and how the
 * model grows. Decks, one-pagers and the Notion mirror READ FROM this page;
 * they never carry their own numbers.
 *
 * Sources: wiki/investor/15-money-alignment-audit.md (the aligned spine) +
 * wiki/investor/16-ask-surface-design.md (research-backed design brief).
 * Figures come from cost-story.ts / canon.ts: no new math lives here.
 * Register: a transparency tool, not a victory lap (honesty labels everywhere).
 */
import type { Solidity } from './cost-story';
import { NORTH_STAR } from './content';

// ---------------------------------------------------------------------------
// Band 1: the one ratio (Who Gives A Crap pattern: one number + a label)
export const ASK_RATIO = {
  // RULING E (Ben 2026-07-25). Read from NORTH_STAR in content.ts, never retyped here:
  // the old line lived in four places at once and that is how it survived being retired.
  headline: NORTH_STAR.headline,
  subline: NORTH_STAR.line,
  second:
    'The mechanics: $65 of every bed stays today, $324 when we press our own legs. At ~338 beds a year the business stands without any of us, and the handover is a gift, not a burden.',
  // RULING G/H (Ben 2026-07-25): the figure stays, the adjective goes. There is no signed
  // accountant document; the carve-out is prepared with the accountant, so it is a workpaper.
  // Dropping the 'verified' label is the point: a green chip in front of a funder was the leak.
  verification: 'Revenue $713,827: Goods-only carve-out, workpaper (not accountant-signed).',
  verificationLabel: 'workpaper' as Solidity,
};

// ---------------------------------------------------------------------------
// Band 2: the ask as a sum (anti-slogan: five blocks, visible total)
export interface AskBlock {
  name: string;
  amount: string;
  fundsWhat: string;
  label: Solidity;
  open?: string;
}
export const ASK_BLOCKS: AskBlock[] = [
  {
    name: 'Equipment, net remaining',
    amount: '$2K–112K',
    fundsWhat: 'Press, shredder, CNC: $112–222K gross minus $110,046 already invested (TFN + ACT).',
    label: 'modelled',
  },
  {
    name: '50-bed measured production run',
    amount: '$60K–80K',
    fundsWhat: 'Pressing at production rate with measured per-bed costs. The capability is proven (the Maningrida Stretch run of 40 was pressed at our facility); the production-rate cost is what this run measures.',
    label: 'target',
  },
  {
    name: 'Working capital, 120 → 338 beds/yr',
    amount: 'TO BE SIZED',
    fundsWhat: 'Bridges the B2B payment cycle while volume ramps to break-even. The SEFA-shaped job.',
    label: 'modelled',
    open: 'Sized at the cost-model sense-check session: until then this line stays honest and empty.',
  },
  {
    name: 'Fixed-block cover while ramping',
    amount: '$110K–165K',
    fundsWhat: '12–18 months of the $109.5K/yr running block while bed volume climbs.',
    label: 'workpaper',
  },
  {
    name: 'Maintenance reserve + site scoping',
    amount: '$5K–8K/yr +',
    fundsWhat: '3–5% of equipment value per year, plus scoping the first on-Country site ($100–150K/site, later).',
    label: 'modelled',
  },
];
/** THE raise answer, locked by Ben 2026-07-21. Say this sentence, everywhere. */
export const ASK_HEADLINE = {
  line: 'We are raising $400K in signed commitments by 31 August. QBE matches it dollar for dollar: an $800K program that takes Goods to the point it funds itself.',
  ifMore: 'Above $400K the match stops, so extra brings the first on-Country site forward. We can put about $550K to work; past that, buy beds instead.',
  ifShort: 'QBE’s floor is $150K matched: even the small version funds the measured run. Every signed dollar lands twice.',
};

export const ASK_MATCH_VEHICLE = {
  name: 'QBE Catalysing Impact, Stage 2',
  amount: 'up to $400K ($150K floor)',
  rule: 'Must be at least matched by SIGNED external commitments. Repayable finance preferred. Match paper 31 Aug; submission due 14 September; outcomes November 2026.',
  note: 'The match vehicle that doubles every signed dollar: not the ask itself. The ask is the sum of the blocks.',
};

// ---------------------------------------------------------------------------
// Band 3: the stack (five-Ps ladder; Convergence/MacArthur vocabulary)
export interface StackLayer {
  funder: string;
  amount: string;
  instrument: string;
  concession: string; // which of the five Ps this funder gives
  status: string;
  signedPaper: string;
}
export const STACK_LAYERS: StackLayer[] = [
  {
    funder: 'SEFA',
    amount: '$300K',
    instrument: 'Repayable working-capital loan',
    concession: 'Price + Patience: below-market, patient terms. QBE’s preferred flavour.',
    status: 'Proposed, in conversation. Not signed.',
    signedPaper: 'Loan agreement: amount, term, funder legal name, a contact SIH can call.',
  },
  {
    funder: 'Snow Foundation (R4/R5)',
    amount: '$100K',
    instrument: 'Grant: fresh money',
    concession: 'Purpose: flexible use. ~$493K already delivered over three years, $0 outstanding.',
    status: 'Warm. Not signed.',
    signedPaper: 'Grant deed or letter of commitment.',
  },
  {
    funder: 'Centrecorp',
    amount: '$75K',
    instrument: 'Grant: community-anchored, separate from bed orders',
    concession: 'Purpose + Position: community-first capital. $123,332 already paid.',
    status: 'Not signed.',
    signedPaper: 'Board-minuted commitment letter.',
  },
];
// Rebuilt 2026-07-25 from all 67 Supporter Journey rows. The old $475K was a smaller and
// older picture than the CRM holds; $0 signed is the standing fact and 0 rows sit at Committed.
export const STACK_TOTAL = '$0 signed today · grants at Ask made $607.5K · repayable in Cultivating $710K';
export const STACK_EXCLUDED =
  'Not match-eligible: equity (we are not selling ownership), QBE itself, the DEWR/REAL vehicle (separate, Oonchiumpa-led), and buyer revenue (orders are the point, not the match).';
export const STACK_MIRROR_NOTE =
  'SEFA was itself born blended: a $10M government grant layered with $10M of private equity and lending, and it runs its own charity arm. We are pitching them their own story.';

// ---------------------------------------------------------------------------
// Band 4: where your money legally sits (Justice Connect three-doors)
export interface EntityDoor {
  verb: string;
  entity: string;
  what: string;
}
export const ENTITY_DOORS: EntityDoor[] = [
  {
    verb: 'Donate',
    entity: 'The Butterfly Movement Ltd (DGR)',
    // RULING J 2026-07-25, from the public register: DGR endorsed since 17 Jan 2012 and ACNC
    // registered since 3 Dec 2012. It was never "interim" or pending FY2026-27. The open
    // question is the receipting mechanics and whose name goes on the receipt.
    what: 'Tax-deductible gifts. Butterfly has been DGR-endorsed since January 2012, so the open question is receipting mechanics, not status. Gifts fund the block and community work: never company equity.',
  },
  {
    verb: 'Buy / Order',
    entity: 'A Curious Tractor Pty Ltd, selling as Goods.',
    what: 'Bed and washing-machine orders at list price. Revenue, not philanthropy. $750 a bed.',
  },
  {
    verb: 'Invest (repayable)',
    entity: 'A Curious Tractor Pty Ltd, selling as Goods.',
    what: 'Repayable finance sits in the trading company. Australian law puts it here: equity and loans go to the Pty Ltd, deductible gifts go to the DGR.',
  },
];
export const ENTITY_NOTES = [
  'How the charity and the company relate is being formalised in an inter-entity agreement: documentation aligned, completion in progress (July 2026). Once signed it is shown to funders so no one has to take it on faith. (The documented anti-social-washing pattern.)',
  // RULING J 2026-07-25: the 51% work was sequenced behind the charity landing "~end July" by
  // ASSUMPTION, and that assumption cost ~7 weeks and the 1 July Supply Nation threshold. The
  // AGM is 14 Sep; 51% never depended on it. And the distinction that must never blur:
  // Aboriginal directors on the CHARITY is not 51% First Nations ownership of the entity that
  // SELLS, which is what Supply Nation, IPP, IBA and FAC all test.
  'Ownership is a pathway: the 51% First Nations ownership decision gates IBA/FAC capital and is DECOUPLED from the charity AGM (14 Sep). Aboriginal directors on the charity is not 51% ownership of the selling entity. Stated as a pathway, never claimed complete.',
];

// ---------------------------------------------------------------------------
// Band 5: what we spend it on (charity:water structural separation)
export const SPEND_SEPARATION = {
  sentence:
    'Bed dollars make beds. Philanthropy buys the block: until ~338 beds a year makes it self-funding.',
  bed: {
    title: 'The bed (per unit, marginal)',
    lines: [
      { label: 'Direct materials (legs $344.05, canvas $93.50, steel $27, hardware $5.24)', value: '$469.79', tag: 'verified' as Solidity },
      { label: 'Freight to community', value: '~$150', tag: 'modelled' as Solidity },
      { label: 'Assembly', value: '$55.95', tag: 'verified' as Solidity },
      { label: 'Cost today (buy the legs in)', value: '$685', tag: 'verified' as Solidity },
      { label: 'Cost pressing our own legs', value: '$426', tag: 'modelled' as Solidity },
    ],
  },
  block: {
    title: 'The block (per year, fixed)',
    lines: [
      { label: 'Facility (Kirmos share)', value: '$27K', tag: 'workpaper' as Solidity },
      { label: 'Founder production time (30 days × $560)', value: '$16.8K', tag: 'workpaper' as Solidity },
      { label: 'Admin', value: '$14.7K', tag: 'workpaper' as Solidity },
      { label: 'Field travel', value: '$51K', tag: 'workpaper' as Solidity },
      { label: 'The block, total', value: '~$109.5K/yr', tag: 'workpaper' as Solidity },
    ],
  },
};

// ---------------------------------------------------------------------------
// Band 6: how it grows (three stages, one line)
export interface GrowthStage {
  stage: string;
  beds: string;
  means: string;
  fundedBy: string;
}
export const GROWTH_STAGES: GrowthStage[] = [
  {
    stage: 'Today',
    beds: '~120 beds/yr',
    means: 'Legs bought as kits. ~$65 of every bed stays. Philanthropy carries the block.',
    fundedBy: 'Orders + existing grants (Snow ~$493K delivered, Centrecorp $123,332, TFN $130K and others).',
  },
  {
    stage: 'Break-even',
    beds: '~338 beds/yr',
    means: 'Legs pressed in-house at $426. ~$324 stays. Sales alone cover the $109.5K block.',
    fundedBy: 'This raise: the stack + QBE match buy the equipment, the proof run and the ramp.',
  },
  {
    stage: 'One facility, full',
    beds: '~1,000 beds/yr',
    means: 'The plant runs at capacity and the model is provable enough to hand over. A community-owned site keeps ~$329 of every bed. What a site needs to cover its own running costs is being rebuilt from the Oonchiumpa facility budget (rent, insurance, admin, upkeep, staff). The earlier ~$24K/yr figure was a rent line only, not a full site bill.',
    fundedBy: 'Trading surplus + site capital (IBA-shaped, post-ownership-gate). Community ownership is the destination.',
  },
];

export const ASK_DOORS = [
  { label: 'The full cost story (7 chapters)', href: '/admin/cost-model' },
  { label: 'Investor room (gated)', href: '/investors' },
  { label: 'The pipeline', href: '/admin/pipeline' },
];

export const ASK_FRAME = {
  title: 'The money, work in progress',
  register: 'A transparency tool, not a victory lap.',
  updated: '2026-07-21',
  source: 'wiki/investor/15-money-alignment-audit.md',
};
