/**
 * THE SEPTEMBER 2026 RAISE: 1,000 beds, five community pools, and the stack behind it.
 *
 * Why this file exists. Ben's Notion page carried the stack by hand (QBE $400K, BMDF $100K,
 * TFFF $100K, Dusseldorp $50K, Snow $100K) and the deck carried $750K twice, once as the cost
 * of the beds and once as "maximum gross sales". A figure typed in two places does two jobs.
 * This module is the one home for the raise: every line carries a status, every total is
 * computed, and raise-stack.guards.test.ts fails the build on the ways this has gone wrong.
 *
 * Rules kept here, each broken by something that shipped before:
 *  - $0 signed is the standing fact and is derived, never typed (SIGNED_TOTAL_AUD).
 *  - A line may only be `signed` with an `evidence` field naming the letter.
 *  - QBE is a discretionary grant that sits on top of signed external paper. It does not double,
 *    trigger or guarantee anything, and this file never describes it that way (ruling V).
 *  - The program cost is the price times the beds, read from canon, and it is a cost. It is
 *    never a sales figure and never community income.
 *  - No pool line names a community. Ruling S cleared four communities to be named with what
 *    each asked for; nobody has asked for 200 beds, and no price sits next to a name.
 *  - TFFF is $300,000 over three years (Katie Norman, 31 Aug 2026), not the $100,000-a-year
 *    line Ben wrote first, and its stated purpose is the resilience of the organisation.
 *
 * Sources: deliverables/qbe-750k-strategy-2026-09-02.md (the reasoning), the TFFF and BMDF
 * invitation emails, the HighLevel GOODS Funding pipeline (pulled 2026-09-02), canon.ts.
 */
import { canonValue } from './canon';
import type { Solidity } from './cost-story';

// ---------------------------------------------------------------------------
// Vocabulary

/** Where a line sits today. `signed` needs `evidence`; nothing is signed on 2026-09-02. */
export type CommitmentStatus =
  | 'invited' // a written invitation to apply for a named amount, with a callable contact
  | 'ask-made' // an ask is with the funder; no written amount back yet
  | 'target' // our number, nothing from the funder yet
  | 'paid' // money received, evidenced in Xero
  | 'excluded' // never counts toward external commitments
  | 'signed'; // a letter naming amount, instrument, legal name and a contact SIH can call

export type Instrument = 'grant' | 'catalytic-grant' | 'purchase' | 'repayable';

export type LegalHome =
  | 'The Butterfly Movement Ltd (Goods on Country)'
  | 'A Curious Tractor Pty Ltd'
  | 'Oonchiumpa'
  | 'TBC';

/** What the money does. `pool` lines buy beds; only they count toward the 1,000. */
export type StackJob = 'pool' | 'proofs' | 'block' | 'demand' | 'equipment' | 'related';

export interface StackLine {
  id: string;
  funder: string;
  /** Total in AUD. Null when no amount exists yet. */
  amountAud: number | null;
  /** When one grant does two jobs, the split. Sums to amountAud. */
  split?: { poolAud: number; proofsAud: number };
  /** Purchases carry their bed count explicitly; grants derive it from the price. */
  beds?: number;
  instrument: Instrument;
  status: CommitmentStatus;
  /** Required when status is `signed`: the letter, its date, the person SIH can call. */
  evidence?: string;
  legalHome: LegalHome;
  job: StackJob;
  label: Solidity;
  source: string;
  asAt: string;
  note: string;
}

// ---------------------------------------------------------------------------
// The program

/** Read from canon (the live products row), never typed. */
export const BED_PRICE_AUD = Number(canonValue('stretch-price'));

export const PROGRAM = {
  beds: 1000,
  pools: 5,
  bedsPerPool: 200,
  /** The cost of the beds. A cost, never a sales figure, never community income. */
  costAud: 1000 * BED_PRICE_AUD,
  sentence:
    'Goods on Country is raising $750,000 to put 1,000 beds into five communities, with each community deciding what is given, what is sold, who is paid and what comes next.',
  honesty:
    'The rules for sales money, resale and who holds the beds are being agreed with each community. Until they are, the numbers are a design, not a promise.',
  /** Bed money makes beds. This raise funds none of the block. */
  twoPots:
    'On the kit path a delivered bed costs about $685, so the pool leaves roughly $65 a bed and funds none of the network block. Bed money makes beds. Philanthropy buys the block.',
  label: 'proposed' as Solidity,
  source: 'deliverables/goods-deck-diagram-system-2026-08-26.md; Ben Notion note 2026-09-02',
  asAt: '2026-09-02',
} as const;

/** The block this raise does not fund, and who is recommended to. Figures are already public on /pitch/road (road-ending.ts THE_RUNNING_COST) and are not retyped here. */
export const THE_BLOCK = {
  line: 'About $109,500 a year runs Goods before a bed is made; about $300,000 a year is the public network ask.',
  label: 'workpaper' as Solidity,
  recommendedFunder: 'tfff',
  why: 'TFFF offers $100,000 a year for three years and names the resilience of the organisation as the reason. That is the block in their words.',
};

// ---------------------------------------------------------------------------
// Ben's stack as he wrote it (Notion, 2026-09-02). Kept for traceability; the coincidence
// the whole raise rests on is that it sums to the cost of 1,000 beds.

export const BEN_STACK_AS_WRITTEN: ReadonlyArray<{ funder: string; amountAud: number }> = [
  { funder: 'QBE', amountAud: 400_000 },
  { funder: 'BMDF', amountAud: 100_000 },
  { funder: 'TFFF', amountAud: 100_000 },
  { funder: 'Dusseldorp', amountAud: 50_000 },
  { funder: 'Snow Foundation', amountAud: 100_000 },
];

// ---------------------------------------------------------------------------
// The stack, by line

export const STACK: readonly StackLine[] = [
  {
    id: 'qbe',
    funder: 'QBE Foundation, Catalysing Impact Stage 2',
    amountAud: 400_000,
    split: { poolAud: 300_000, proofsAud: 100_000 },
    instrument: 'catalytic-grant',
    status: 'ask-made',
    legalHome: 'TBC',
    job: 'pool',
    label: 'target',
    source: 'Jay Boolkin to the cohort, 24 Aug 2026; wiki/investor/20-qbe-program-economics.md',
    asAt: '2026-09-02',
    note: 'Typically $150,000 to $400,000 from a pool of up to $1.1 million across ten enterprises. Discretionary. It sits on top of signed external commitments and does not double them. Applicant entity to be settled with Jay on 3 Sep. Form closes Fri 25 Sep 12pm AEST; review meeting Wed 7 Oct.',
  },
  {
    id: 'bmdf',
    funder: 'Brian M. Davis Charitable Foundation',
    amountAud: 100_000,
    instrument: 'grant',
    status: 'invited',
    legalHome: 'The Butterfly Movement Ltd (Goods on Country)',
    job: 'pool',
    label: 'target',
    source: 'Miranda Campbell to Nic, cc Ben, 1 Sep 2026: "an initial 12-month grant of up to $100,000". Application due Fri 25 Sep; board 19 Nov.',
    asAt: '2026-09-01',
    note: 'Pool three, youth-led. Highlight youth employment, school and community engagement for children and young people, and recycling of plastics. HighLevel still shows $0 and needs updating.',
  },
  {
    id: 'snow',
    funder: 'Snow Foundation',
    amountAud: 100_000,
    instrument: 'grant',
    status: 'ask-made',
    legalHome: 'The Butterfly Movement Ltd (Goods on Country)',
    job: 'pool',
    label: 'target',
    source: 'HighLevel: first-mover pathway, ask made, $150,000 estimate. "Goods and Snow catch up" booked by Sally Grimsley-Ballard, 1 Sep 2026.',
    asAt: '2026-09-02',
    note: 'Pool four. Ben wrote $100,000; HighLevel carries $150,000. The shortest path to a first letter: a one-page note subject to board, amount, grant, legal name, a person SIH can call.',
  },
  {
    id: 'minderoo',
    funder: 'Minderoo Foundation',
    amountAud: 100_000,
    instrument: 'grant',
    status: 'ask-made',
    legalHome: 'The Butterfly Movement Ltd (Goods on Country)',
    job: 'pool',
    label: 'target',
    source: 'HighLevel: catalytic QBE-aligned grant, ask made, $100,000 estimate.',
    asAt: '2026-09-02',
    note: 'Pool five. Not in Ben\'s hand stack; carried because the ask is live and the record calls it catalytic.',
  },
  {
    id: 'dusseldorp',
    funder: 'Dusseldorp Forum',
    amountAud: 50_000,
    instrument: 'grant',
    status: 'target',
    legalHome: 'The Butterfly Movement Ltd (Goods on Country)',
    job: 'pool',
    label: 'target',
    source: 'Ben Notion note 2026-09-02. Rachel Fyfe released $15,000 for CONTAINED on 25 Jun 2026; a check-in is booked for the first week of September.',
    asAt: '2026-09-02',
    note: 'Top-up. $50,000 is our number, nothing from the funder yet.',
  },
  {
    id: 'alive',
    funder: 'ALIVE National Centre, University of Melbourne',
    amountAud: 92_000,
    beds: 100,
    instrument: 'purchase',
    status: 'paid',
    legalHome: 'A Curious Tractor Pty Ltd',
    job: 'demand',
    label: 'verified',
    source: 'INV-0342: 100 Stretch Beds plus four shared visits, $92,000 ex GST. Paid, confirmed by Ben 30 Aug 2026 (deliverables/alive-100-beds-community-led-year-one.md).',
    asAt: '2026-08-30',
    note: 'Revenue, not an external commitment. The demand proof: a buyer paid for 100 beds up front.',
  },
  {
    id: 'tfff',
    funder: 'Tim Fairfax Family Foundation',
    amountAud: 300_000,
    instrument: 'grant',
    status: 'invited',
    legalHome: 'The Butterfly Movement Ltd (Goods on Country)',
    job: 'block',
    label: 'target',
    source: 'Katie Norman to Nic and Ben, 31 Aug 2026: "invite The Butterfly Movement to apply for a three-year grant of $300,000.00 in three equal payments". SmartyGrants due Fri 9 Oct 5pm; board late Nov.',
    asAt: '2026-08-31',
    note: 'The block, three years. Katie names the resilience of organisations as the reason. Ben wrote $100,000 for beds; the invitation is $300,000 and points at the organisation. HighLevel still shows $150,000 and needs updating.',
  },
  {
    id: 'sefa',
    funder: 'SEFA',
    amountAud: 300_000,
    instrument: 'repayable',
    status: 'target',
    legalHome: 'TBC',
    job: 'equipment',
    label: 'target',
    source: 'HighLevel: repayable finance anchor, cultivating, $300,000 estimate. Note: blocked on entity.',
    asAt: '2026-09-02',
    note: 'After the measured run. Cannot proceed while the cost is modelled and the borrower is unsettled.',
  },
  {
    id: 'white-box',
    funder: 'White Box SELF',
    amountAud: 150_000,
    instrument: 'repayable',
    status: 'target',
    legalHome: 'TBC',
    job: 'equipment',
    label: 'target',
    source: 'HighLevel: social enterprise loan pathway, cultivating, $150,000 estimate.',
    asAt: '2026-09-02',
    note: 'Second lender if SEFA lands short. Same entity gate.',
  },
  {
    id: 'real',
    funder: 'REAL Innovation Fund (DEWR), Oonchiumpa-led',
    amountAud: 1_995_000,
    instrument: 'grant',
    status: 'excluded',
    legalHome: 'Oonchiumpa',
    job: 'related',
    label: 'conflict',
    source: 'CONTEXT.md: applied at about $2M over three years, not secured. HighLevel: committed. Ben reported about $2M received on 13 Aug 2026; no deed in the record.',
    asAt: '2026-09-02',
    note: 'Oonchiumpa\'s grant, not a Goods stack line. Disclose as related on the QBE form; ask Jay whether it is a commitment, a conflict, or neither.',
  },
  {
    id: 'frrr-palm',
    funder: 'FRRR',
    amountAud: 20_000,
    instrument: 'grant',
    status: 'target',
    legalHome: 'The Butterfly Movement Ltd (Goods on Country)',
    job: 'pool',
    label: 'target',
    source: 'Ben Notion note 2026-09-02 ("FRRR Palm $20k"). HighLevel: Strengthening Rural Communities, qualified, note says resize to $10,000.',
    asAt: '2026-09-02',
    note: 'Unverified beyond Ben\'s note. Excluded from the pool arithmetic until confirmed.',
  },
  {
    id: 'ev-fleet',
    funder: 'Luke, EV Fleet',
    amountAud: 20_000,
    instrument: 'grant',
    status: 'target',
    legalHome: 'TBC',
    job: 'pool',
    label: 'target',
    source: 'Ben Notion note 2026-09-02 ("Luke EV Fleet $20k"). Nothing in HighLevel, Gmail or the repo.',
    asAt: '2026-09-02',
    note: 'Unverified. Ask Ben what it is. Excluded from the pool arithmetic until confirmed.',
  },
];

// ---------------------------------------------------------------------------
// Derived, never typed

export function lineById(id: string): StackLine {
  const l = STACK.find((x) => x.id === id);
  if (!l) throw new Error(`Unknown stack line "${id}".`);
  return l;
}

/** Lines that count toward external commitments once signed. */
export const EXTERNAL_LINES: readonly StackLine[] = STACK.filter(
  (l) => l.id !== 'qbe' && l.status !== 'excluded' && l.instrument !== 'purchase',
);

/** The standing fact. Derived from status, so it moves when a letter exists and not before. */
export const SIGNED_TOTAL_AUD = STACK.filter((l) => l.status === 'signed').reduce(
  (sum, l) => sum + (l.amountAud ?? 0),
  0,
);

/** Lines carried on Ben's note with no second source. Never summed. */
export const UNVERIFIED_LINE_IDS: readonly string[] = ['frrr-palm', 'ev-fleet'];

/** Beds a line funds: its pool share divided by the price, or its explicit count for purchases. */
export function bedsFunded(line: StackLine): number {
  if (typeof line.beds === 'number') return line.beds;
  if (line.amountAud === null) return 0;
  const poolAud = line.split ? line.split.poolAud : line.amountAud;
  return Math.floor(poolAud / BED_PRICE_AUD);
}

/** Pool lines that count: job `pool`, not excluded, not unverified. */
export const POOL_LINES: readonly StackLine[] = STACK.filter(
  (l) => l.job === 'pool' && l.status !== 'excluded' && !UNVERIFIED_LINE_IDS.includes(l.id),
);

/** Beds if every pool line and the paid purchase land. Computed, and it is below 1,000. */
export const POOL_BEDS_IF_ALL_LAND =
  POOL_LINES.reduce((sum, l) => sum + bedsFunded(l), 0) + bedsFunded(lineById('alive'));

export const POOL_SHORTFALL_BEDS = PROGRAM.beds - POOL_BEDS_IF_ALL_LAND;

// ---------------------------------------------------------------------------
// The QBE ask, both tiers (form Q5 and Q7)

export interface AskTier {
  aud: number;
  poolAud: number;
  proofsAud: number;
  /** Derived from poolAud and the price. */
  beds: number;
  buys: string;
}

function tier(aud: number, poolAud: number, buys: string): AskTier {
  const proofsAud = aud - poolAud;
  return { aud, poolAud, proofsAud, beds: poolAud / BED_PRICE_AUD, buys };
}

export const QBE_ASK = {
  full: tier(
    400_000,
    300_000,
    'Two community pools (400 beds) and the proof layer: the first fifty beds pressed at the farm at production rate, timed and costed with receipts; five community rules agreements; product traceability and the accounting repair that gives Goods on Country a gross margin on paper.',
  ),
  smaller: tier(
    200_000,
    150_000,
    'One community pool (200 beds), the measured run and the rules work for that one community. The proofs survive the cut; the second pool does not.',
  ),
  framing:
    'A discretionary Catalysing Impact grant, typically $150,000 to $400,000 from a pool of up to $1.1 million across ten enterprises. It sits on top of signed external commitments and does not double them. $0 is signed today.',
  leverageChain: [
    'QBE funds two pools and the proofs.',
    'That work produces community agreements, a measured cost, buyer paper and a governed pool.',
    'Three invitations are already in hand: TFFF $300,000 for the block, BMDF $100,000 for pool three, and a Snow letter for pool four. Minderoo and Dusseldorp are in conversation.',
    'After the measured run, SEFA $300,000 and White Box $150,000 for equipment and working capital, which cannot proceed while the cost is modelled and the borrower is unsettled.',
    'Demand already paying: ALIVE bought 100 beds up front; Centrecorp\'s 130-bed quote is deferred pending community feedback.',
  ],
} as const;

// ---------------------------------------------------------------------------
// The entity route (form Q1, Q2, Q3, Q8), subject to Jay on 3 Sep

export const ENTITY_ROUTE = {
  recommended: {
    applicant: 'The Butterfly Movement Ltd (Goods on Country)',
    abn: '22 155 132 684',
    why: 'Ruling X moved the whole model into Goods on Country. TFFF invited Butterfly, BMDF invited Goods On Country, and Snow\'s grants land in Butterfly, so every external dollar lands there. Butterfly is an Australian public company and DGR-endorsed since 2012.',
    related: [
      'A Curious Tractor Pty Ltd (ABN 36 697 347 676): the cohort entrant, holder of the historic trading record, transferring assets under ruling X.',
      'Nicholas Marchesi, sole trader (ABN 21 591 780 066): the historic trading vehicle whose books carry FY26.',
    ],
    diagram: 'Three boxes and two arrows: sole trader to A Curious Tractor to Butterfly, with the transfer dated.',
  },
  fallback: {
    applicant: 'A Curious Tractor Pty Ltd',
    why: 'If Jay says the cohort entrant must apply. The grant lands in the company and the external commitments land in the charity, so Q2 and Q8 rest on the inter-entity agreement, which is unsigned. Needs MinterEllison and a signature before 13 Nov. Weaker, and said so.',
  },
  tradingFacts:
    'Beds are sold at $750 to buyers; ALIVE paid for 100 up front; Centrecorp has a 130-bed quote open; a repayable equipment raise follows the measured run.',
} as const;

// ---------------------------------------------------------------------------
// The questions only people can answer

export const JAY_QUESTIONS: readonly string[] = [
  'Can The Butterfly Movement Ltd (Goods on Country) be the applicant and recipient, given the cohort entrant was A Curious Tractor and the operating home has moved?',
  'Do written invitations to apply for a named amount, with callable contacts and boards deciding after 13 November, count as conditional commitments, and can the pre-condition window extend to those board dates?',
  'Does a letter subject to board or credit approval count?',
  'What must the accountant\'s letter cover: the applicant, the carve-out, or both?',
  'Is the Oonchiumpa-led REAL grant a commitment, a conflict to disclose, or neither?',
];

export const BEN_DECISIONS: readonly string[] = [
  'TFFF to the block or to the beds. Recommendation: the block.',
  'The QBE tiers, $400,000 and $200,000, as written or different.',
  'Which communities can be named against a pool today. Recommendation: name the mechanism, name a community only once it has seen its pool.',
  'Luke EV Fleet $20,000 and FRRR Palm $20,000: what are they.',
  'Who owns the QBE volunteer project.',
];

export const KEY_DATES = {
  checkIn: '2026-09-03',
  qbeClose: '2026-09-25',
  bmdfClose: '2026-09-25',
  qbeReview: '2026-10-07',
  tfffClose: '2026-10-09',
  qbeOutcomes: '2026-10-23',
  qbePreconditions: '2026-11-13',
} as const;
