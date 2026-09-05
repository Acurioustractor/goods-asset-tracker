/**
 * MONEY LANES: the one place that says what every dollar actually is.
 *
 * Ben, 5 September 2026: "We need a very specific way to know exactly what these are broken up
 * into so that we can have a refined way to always recall this." He named the confusions himself:
 * Rotary is "just overdue and fucked" and had been sitting in a ledger of buyers; the Fairfax and
 * Brian M. Davis invitations are new money coming in and were filed beside cold conversations;
 * Snow and the rest are potentials; and none of that is the same thing as beds we have sold.
 *
 * The failure this module exists to stop is addition. On 4 September Nic told a business mentor
 * that two philanthropies had "committed $100,000 each". Neither had. TFFF wrote an invitation to
 * apply for $300,000 over three years with the board deciding in late November, and Brian M. Davis
 * wrote an invitation to apply for up to $100,000 with the board deciding on 19 November. Both are
 * real, both are strong, and neither is money. A surface that adds an invitation to a paid invoice
 * produces a number nobody can defend, and leverage is the criterion the QBE form says the
 * Steering Committee weights most.
 *
 * So every line here carries a lane, the lane carries a rule, and `total()` refuses to add lanes
 * that must not be added. Guards in `money-lanes.guards.test.ts` fail the build if a lane is
 * summed wrongly or a line claims to be signed without a letter.
 *
 * Sources. Invoice lines are read from Xero contact by contact against the aged receivables report
 * of 5 September 2026. Funder lines come from `raise-stack.ts`, which carries the email each
 * invitation arrived in. Nothing here is typed twice: the bed invoices live in `qbe-story.ts` and
 * the funder lines in `raise-stack.ts`, and this module classifies them. The one exception is a
 * washers-only sale, which no other module carries, so it is typed once here and nowhere else.
 */
import { STACK, type Instrument, type StackLine } from './raise-stack';
import { BUYING_AS_AT, BUYING_STORY } from './qbe-story';
import type { Solidity } from './cost-story';

// ---------------------------------------------------------------------------
// The lanes

export type MoneyLane =
  | 'earned' // we made a thing, someone bought it, the money is in
  | 'owed' // invoiced and collectable, not yet paid
  | 'bad-debt' // invoiced so long ago that it is not coming without a fight
  | 'invited' // the funder wrote to us naming an amount and a date they decide
  | 'asked' // our ask is with them and nothing has come back with a number on it
  | 'potential' // a conversation. No application, no amount from them
  | 'excluded'; // in the record, never ours to count

export interface LaneRule {
  label: string;
  /** What the lane is, in the words we would say it out loud. */
  means: string;
  /** True only for money that has actually arrived. */
  isCash: boolean;
  /** True only for the lane that may be called revenue. */
  isRevenue: boolean;
  /** The lanes this one may legitimately be added to. Anything else is a made-up number. */
  addsTo: MoneyLane[];
  /** The sentence to use when this lane is named to somebody outside. */
  sayItLike: string;
}

export const LANES: Record<MoneyLane, LaneRule> = {
  earned: {
    label: 'Earned',
    means: 'Beds and machines we made and sold, on an invoice that has been paid.',
    isCash: true,
    isRevenue: true,
    addsTo: ['earned'],
    sayItLike: 'Organisations have bought these and paid for them.',
  },
  owed: {
    label: 'Owed',
    means: 'Invoiced, authorised and collectable. Real, and not yet money.',
    isCash: false,
    isRevenue: false,
    addsTo: ['owed'],
    sayItLike: 'Invoiced and still to be collected.',
  },
  'bad-debt': {
    label: 'Bad debt',
    means: 'Invoiced so far back that it is not coming without a fight. Overdue and stuck.',
    isCash: false,
    isRevenue: false,
    addsTo: [],
    sayItLike: 'A receivable we have not been able to collect. We do not count it.',
  },
  invited: {
    label: 'Invited',
    means: 'The funder wrote to us, named an amount, and named the date they decide. Not ours yet.',
    isCash: false,
    isRevenue: false,
    addsTo: ['invited', 'asked', 'potential'],
    sayItLike: 'Invited to apply for this amount, with a decision due on a date we can name.',
  },
  asked: {
    label: 'Asked',
    means: 'Our ask is with them. Nothing has come back with a number on it.',
    isCash: false,
    isRevenue: false,
    addsTo: ['invited', 'asked', 'potential'],
    sayItLike: 'An application is in. The amount is ours, not theirs.',
  },
  potential: {
    label: 'Potential',
    means: 'A conversation, an intention, a warm room. No application and no amount from them.',
    isCash: false,
    isRevenue: false,
    addsTo: ['invited', 'asked', 'potential'],
    sayItLike: 'A live conversation. Nothing has been asked for or offered in writing.',
  },
  excluded: {
    label: 'Excluded',
    means: 'In the record so nobody goes looking for it twice, and never ours to count.',
    isCash: false,
    isRevenue: false,
    addsTo: [],
    sayItLike: 'Held by somebody else. It is not part of our raise.',
  },
};

/** Reading order, weakest claim last. */
export const LANE_ORDER: MoneyLane[] = ['earned', 'owed', 'bad-debt', 'invited', 'asked', 'potential', 'excluded'];

export interface MoneyLine {
  id: string;
  who: string;
  what: string;
  amountAud: number | null;
  /** Invoices are stated including GST; grant invitations have no GST. */
  gst: 'inc' | 'ex' | 'n/a';
  lane: MoneyLane;
  /**
   * What KIND of money it is. The lane says how solid a line is; the instrument says what it does
   * to us if it lands. `repayable` is debt and has to be paid back out of margin, so it must never
   * be read as philanthropy just because it sits in the same lane.
   */
  instrument: Instrument;
  /** The document, or the email. What an assessor would be shown if they asked. */
  paper: string;
  when: string;
  /** Invited lines only: the date the funder decides. Before it, the money is not ours. */
  decisionDue?: string;
  label: Solidity;
  source: string;
}

// ---------------------------------------------------------------------------
// Earned and owed: what the beds have actually done, from the buying ledger

const BED_LINES: MoneyLine[] = BUYING_STORY.filter((b) => b.status === 'paid').map((b) => ({
  id: `bed-${b.paper.split(',')[0].toLowerCase()}`,
  who: b.who,
  what: b.what,
  amountAud: b.documentTotalIncGstAud,
  gst: 'inc' as const,
  lane: 'earned' as MoneyLane,
  instrument: 'purchase' as Instrument,
  paper: b.paper,
  when: b.when,
  label: b.label,
  source: `Xero, read ${BUYING_AS_AT}`,
}));

/**
 * Machines sold on their own, without beds.
 *
 * The bed invoices come from `BUYING_STORY`, which is the buyers ledger behind slide 05 and is beds
 * by definition. A paid invoice for washing machines alone never reaches it, so until 5 September it
 * never reached this lane either, although the lane's own rule says "beds and machines". Julalikari
 * Council bought two washing machines for Tennant Creek in June 2026 and paid.
 *
 * RULED (Ben, 5 September 2026): ALIVE and Julalikari "are sales which showcase how we can sell beds
 * and how communities can as well, and washing machines, same as the Centrecorp sales". So it is
 * earned, it is inside the funding-received figure, and it is typed here because no other module can
 * carry it without turning the buyers ledger into something it is not.
 */
const MACHINE_LINES: MoneyLine[] = [
  {
    id: 'machine-inv-0335',
    who: 'Julalikari Council Aboriginal Corporation',
    what: 'Two washing machines and delivery for Tennant Creek, $13,540 ex GST.',
    amountAud: 15_000,
    gst: 'inc',
    lane: 'earned',
    instrument: 'purchase',
    paper: 'INV-0335, paid, issued 19 June 2026',
    when: 'June 2026',
    label: 'verified',
    source: `Xero, read ${BUYING_AS_AT}`,
  },
];

/**
 * Rotary eClub Outback Australia, and why it is not a buyer.
 *
 * INV-0222, 10 April 2025, 200 crate beds at $350 plus a $5,000 project, $82,500 including GST.
 * Authorised, unpaid, due 24 April 2025. On the aged receivables of 5 September 2026 it is the
 * single largest debtor at 29.4% of everything outstanding, sitting in the 3+ month bucket at
 * roughly 500 days late. It had been carried in the match stack as though it were capital, and in
 * a ledger of buyers as though it were demand.
 *
 * RULED (Ben, 5 September 2026): "just overdue and fucked". It is bad debt. It stays in the record
 * because pretending it never happened is its own kind of lie, and it adds to nothing.
 */
const BAD_DEBT: MoneyLine[] = [
  {
    id: 'rotary-inv-0222',
    who: 'Rotary eClub Outback Australia, Division 9560',
    what: '200 crate beds at $350 and a $5,000 project. Invoiced April 2025 and never paid.',
    amountAud: 82_500,
    gst: 'inc',
    lane: 'bad-debt',
    instrument: 'purchase',
    paper: 'INV-0222, authorised, due 24 April 2025',
    when: 'April 2025',
    label: 'verified',
    source: `Xero aged receivables, ${BUYING_AS_AT}: largest single debtor, 3+ month bucket`,
  },
];

/**
 * Receivables that are not beds and are still collectable.
 *
 * THIS LANE IS EMPTY, and that is the finding. Xero's aged receivables of 5 September 2026 total
 * $281,048.84 across twelve invoices with 99.7% of it overdue, and once the rulings of that day are
 * applied not one dollar of it is a collectable Goods receivable:
 *
 *   Homeland INV-0303  $44,000  PAID (Ben: "this has been paid"). It is in the earned lane.
 *   Regional Arts INV-0302      A Harvest project receivable, not Goods (Ben, 5 Sep).
 *   Rotary INV-0222    $82,500  Bad debt, below.
 *   Everything else             Other ACT work: Sonas, Tandanya, Social Impact Hub, Berry
 *                               Obsession, Brodie Germaine, Joy House, Jenn Brazier.
 *
 * So the honest sentence is that Goods has $0 of collectable receivables and $82,500 of bad debt.
 * Leave the lane in place: the next invoice that goes out lands here.
 */
const OWED: MoneyLine[] = [];

// ---------------------------------------------------------------------------
// The funders, classified off what they have actually put in writing

/**
 * `raise-stack.ts` already carries the status the funder put in writing. This maps it onto a lane
 * without restating any amount, so a change there moves the lane here rather than creating a
 * second version of the truth.
 */
function laneForStackLine(l: StackLine): MoneyLane {
  if (l.status === 'excluded') return 'excluded';
  if (l.status === 'paid') return 'earned';
  if (l.status === 'signed') return 'invited';
  if (l.status === 'invited') return 'invited';
  if (l.status === 'ask-made') return 'asked';
  return 'potential';
}

/** When the funder has told us the date they decide. Nothing is ours before it. */
const DECISION_DUE: Record<string, string> = {
  tfff: 'Board decides late November 2026. Application due 9 October 2026, 5pm AEST.',
  bmdf: 'Board decides 19 November 2026. Application due 25 September 2026.',
  qbe: 'Applications close 25 September 2026, 12pm AEST.',
};

const FUNDER_LINES: MoneyLine[] = STACK.filter((l) => l.status !== 'paid').map((l) => ({
  id: l.id,
  who: l.funder,
  what: l.note,
  amountAud: l.amountAud,
  gst: 'n/a' as const,
  lane: laneForStackLine(l),
  instrument: l.instrument,
  paper: l.evidence ?? l.source,
  when: l.asAt,
  decisionDue: DECISION_DUE[l.id],
  label: l.label,
  source: l.source,
}));

/**
 * Relationships Ben names out loud that the raise stack has never carried.
 *
 * THE BRYAN FOUNDATION IS NOT BRIAN M. DAVIS. Two different organisations with names that sound
 * alike. When Ben said "Bryan Foundation incoming" on 5 September he meant Brian M. Davis, and
 * confirmed it the same day. Brian M. Davis Charitable
 * Foundation (Melbourne, Miranda Campbell) has written an invitation to apply for up to $100,000
 * and sits in `invited`. The Bryan Foundation (Michael Cox, and Matt Taylor at Bryan Family Group,
 * introduced through Chris Titley at Sub11) met Ben and Nic on 26 May 2026 and nothing has been
 * asked for or offered since. It is a warm room, and that is all it is until somebody writes
 * something down.
 */
const RELATIONSHIPS: MoneyLine[] = [
  {
    id: 'bryan-foundation',
    who: 'The Bryan Foundation',
    what: 'Met 26 May 2026 through Chris Titley at Sub11. No application, no amount, nothing in writing since.',
    amountAud: null,
    gst: 'n/a',
    lane: 'potential',
    instrument: 'grant',
    paper: 'Calendar invitation "BFF + Goods", 26 May 2026, with Michael Cox and Matt Taylor',
    when: '2026-05-26',
    label: 'target',
    source: 'Gmail, calendar invitation 14 May 2026; funder-discovery handoff',
  },
];

export const MONEY_LINES: readonly MoneyLine[] = [...BED_LINES, ...MACHINE_LINES, ...OWED, ...BAD_DEBT, ...FUNDER_LINES, ...RELATIONSHIPS];

/** Debt is not philanthropy. Every repayable line, whatever lane it sits in. */
export const REPAYABLE_LINES = MONEY_LINES.filter((l) => l.instrument === 'repayable');

// ---------------------------------------------------------------------------
// Reading the lanes, and the one rule about adding them up

export function linesIn(lane: MoneyLane): MoneyLine[] {
  return MONEY_LINES.filter((l) => l.lane === lane);
}

/**
 * Add up one or more lanes, and refuse when the lanes must not be added.
 *
 * This throws rather than returning a wrong number, because the wrong number is the whole problem.
 * `total(['earned'])` is revenue. `total(['invited', 'asked', 'potential'])` is a pipeline.
 * `total(['earned', 'invited'])` throws, because that sentence has never been true.
 */
export function total(lanes: MoneyLane[]): number {
  for (const a of lanes) {
    for (const b of lanes) {
      if (a !== b && !LANES[a].addsTo.includes(b)) {
        throw new Error(`money-lanes: "${LANES[a].label}" may not be added to "${LANES[b].label}". ${LANES[a].means}`);
      }
    }
  }
  return MONEY_LINES.filter((l) => lanes.includes(l.lane)).reduce((t, l) => t + (l.amountAud ?? 0), 0);
}

/** Beds sold and paid for: the count, the bed money and the whole-invoice money. */
export const BEDS_SOLD = {
  organisations: new Set(BUYING_STORY.filter((b) => b.status === 'paid').map((b) => b.who)).size,
  beds: BUYING_STORY.filter((b) => b.status === 'paid').reduce((t, b) => t + b.beds, 0),
  /** The bed lines only, ex GST. The honest "what have the beds earned" number. */
  bedRevenueExGstAud: BUYING_STORY.filter((b) => b.status === 'paid').reduce((t, b) => t + (b.bedRevenueExGstAud ?? 0), 0),
  /** The whole documents including GST, workshops, washers and freight. */
  documentsIncGstAud: BUYING_STORY.filter((b) => b.status === 'paid').reduce((t, b) => t + (b.documentTotalIncGstAud ?? 0), 0),
  asAt: BUYING_AS_AT,
} as const;

/**
 * Nothing is signed. A line may only be called committed, signed or secured when it carries a
 * letter naming the amount, the instrument, the legal entity and a person a funder can call.
 * `raise-stack.ts` requires `evidence` for status `signed`, and no line has it today.
 */
export const SIGNED_TODAY_AUD = STACK.filter((l) => l.status === 'signed' && l.evidence).reduce((t, l) => t + (l.amountAud ?? 0), 0);

/** The three words that must never be used for anything outside the earned lane. */
export const BANNED_FOR_UNSIGNED = ['committed', 'secured', 'locked in'] as const;

/**
 * What to say when somebody asks "how much have you got?". Written to be read out loud, because
 * the version that went wrong went wrong in a conversation and not on a page.
 */
export function theHonestAnswer(): string {
  const pipeline = total(['invited', 'asked', 'potential']);
  return [
    `Beds sold and paid for: ${money(BEDS_SOLD.bedRevenueExGstAud)} ex GST, ${BEDS_SOLD.beds} beds, ${BEDS_SOLD.organisations} organisations.`,
    `Invited to apply, with an amount and a decision date in writing: ${money(total(['invited']))}.`,
    `Asks in with no amount back: ${money(total(['asked']))}.`,
    `Conversations, nothing in writing: ${money(total(['potential']))}.`,
    `Signed today: ${money(SIGNED_TODAY_AUD)}.`,
    `The pipeline adds to ${money(pipeline)} and none of it is money.`,
  ].join(' ');
}

function money(n: number): string {
  return `$${Math.round(n).toLocaleString('en-AU')}`;
}
