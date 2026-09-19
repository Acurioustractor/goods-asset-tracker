/**
 * Chapter 15 of the pitch, read as three lanes. Each lane follows one source of money from what it
 * is, to what it buys, to where it ends up; then the one line money never takes, the total, and
 * the $750 bed two ways (sold by a community organisation, sold by Goods on Country).
 *
 * Words and figures come from the money-flow sheet (money-flow.ts), the raise (model-placemat.ts)
 * and the bed split (pitch-chapters.ts), so the lanes, the deck slide and the placemat say the same
 * thing. Funder names print on the QBE door only; the overview door says what kind of money it is.
 * money-lanes.guards.test.ts holds the sums.
 */

import { FLOW_ENTITIES, FLOW_LINKS } from './money-flow';
import { BED, RAISE, dollars } from './model-placemat';

export type LaneTone = 'sage' | 'loan';

export interface MoneyLane {
  id: 'beds' | 'facilities' | 'loan';
  tone: LaneTone;
  source: { kicker: string; named: string; amount: number };
  buys: { kicker: string; title: string; line: string };
  endsUp: { kicker: string; title: string; line: string };
  /** The words on the line between source and what it buys, and between that and where it ends. */
  first: string;
  second: string;
}

const link = (from: string, to: string) => FLOW_LINKS.find((l) => l.from === from && l.to === to)?.label ?? '';

export const MONEY_LANES: readonly MoneyLane[] = [
  {
    id: 'beds',
    tone: 'sage',
    source: { kicker: 'Philanthropy · three grants', named: FLOW_ENTITIES.philanthropy.lines[0].replace(/\. 133 beds each at \$750\.$/, ''), amount: RAISE.bedsShownAud },
    buys: { kicker: 'Buys', title: `The first ${RAISE.bedsYearOne} beds`, line: `133 beds a grant, at ${dollars(BED.priceAud)} a bed.` },
    endsUp: { kicker: 'Ends up', title: FLOW_ENTITIES.orgs.title, line: FLOW_ENTITIES.orgs.lines[0] },
    first: link('philanthropy', 'goods'),
    second: link('goods', 'orgs'),
  },
  {
    id: 'facilities',
    tone: 'sage',
    source: { kicker: 'QBE Foundation', named: 'QBE Foundation, Catalysing Impact', amount: RAISE.qbeAud },
    buys: { kicker: 'Buys', title: FLOW_ENTITIES.facilities.title, line: FLOW_ENTITIES.qbe.lines[0] },
    endsUp: { kicker: 'Ends up', title: 'Beds made in community', line: FLOW_ENTITIES.facilities.lines[0] },
    first: link('qbe', 'facilities'),
    second: link('facilities', 'customers'),
  },
  {
    id: 'loan',
    tone: 'loan',
    source: { kicker: 'A loan', named: 'Repayable capital, lender to be confirmed', amount: RAISE.loanAud },
    buys: { kicker: 'Carries', title: 'The first year of running Goods on Country', line: `${RAISE.loanFor.split(',')[0]}.` },
    endsUp: { kicker: 'Comes back', title: 'Paid back', line: 'From the beds Goods on Country sells. Never from a community organisation’s sales.' },
    first: link('sefa', 'goods'),
    second: link('goods', 'sefa'),
  },
];

export const MONEY_NEVER = {
  title: link('orgs', 'goods'),
  line: `Customers pay the community organisation ${dollars(BED.priceAud)} a bed, and it stays in community.`,
};

export const MONEY_TOTAL = {
  label: 'Asked · nothing signed',
  amount: RAISE.totalShownAud,
  parts: [
    { id: 'beds', label: 'Beds', amount: RAISE.bedsShownAud, tone: 'terracotta' },
    { id: 'facilities', label: 'QBE', amount: RAISE.qbeAud, tone: 'sage' },
    { id: 'loan', label: 'Loan', amount: RAISE.loanAud, tone: 'ink' },
  ],
} as const;

/** The $750 bed, sold two ways. Making is provisional until the leg-panel yield is confirmed. */
export const BED_WAYS = {
  org: { label: 'A community organisation sells it', line: `The whole ${dollars(BED.priceAud)} is theirs.` },
  goods: { label: 'Goods on Country sells it', line: `Making, freight and facilitation come out first; ${dollars(BED.contributionAud)} carries the organisation.` },
} as const;
