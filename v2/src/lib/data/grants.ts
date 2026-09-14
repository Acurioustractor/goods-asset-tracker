/**
 * THE RAISE, line by line: every application, invitation, loan and report in play on
 * 14 September 2026, and the money position they add up to.
 *
 * Sources: the Notion front door "Goods on Country, the raise, start here"
 * (3d8ebcf981cf8128bd9aee918f49733f, 12 September), the four-applications note
 * (deliverables/master/sources/the-four-applications-2026-09-11.md), the QBE opportunity record
 * (13 September) and the finance ledger of 12 September. Figures here are asked, invited or
 * modelled; nothing is secured, and the year-cost arithmetic is legacy pending the flat-pack
 * route costing. They are not interchangeable: QBE buys plants, Tim Fairfax buys the
 * organisation, Brian M. Davis buys beds, SEFA lends.
 *
 * Ruling, Ben, 14 September 2026: facilitation and support for the workshopping in community sit
 * inside the price of a bed. Every bed comes with it. There is no separate facilitation line and
 * no A$10,000-a-community rung. The finance model, the sheet and the Brian M. Davis budget still
 * carry the old split and need re-cutting.
 */

export const FACILITATION_RULING =
  'Every bed comes with facilitation and support for the workshopping in community. It sits inside the price of a bed (Ben, 14 September 2026).';

export type Instrument = 'grant' | 'loan' | 'report' | 'grant to a partner';

/** The conservative labels deck slide S16 uses. Nothing here is secured. */
export type FundingStatus = 'proposed' | 'invited' | 'conversation' | 'approved to a partner' | 'received';

export interface FundingLine {
  id: string;
  funder: string;
  instrument: Instrument;
  amount: string;
  /** The one job this money does, short enough for a slide. */
  job: string;
  status: FundingStatus;
  buys: string;
  due: string;
  state: string;
  owner: string;
  /** What has to exist before it can go. */
  needs: string[];
  /** Which QBE answers or documents it reuses, so one answer never has two homes. */
  reuses: string[];
  condition?: string;
  decides?: string;
  notion?: string;
  artifact?: string;
}

export const FUNDING_LINES: readonly FundingLine[] = [
  {
    id: 'qbe',
    funder: 'QBE Foundation, Catalysing Impact, Stage 2',
    instrument: 'grant',
    amount: 'A$300,000',
    job: 'Two proposed production facilities',
    status: 'proposed',
    buys: 'Two proposed community production facilities, A$150,000 each as a planning allowance. Palm Island and Maningrida first; Tennant Creek, Mount Isa and others as options (ruling AD).',
    due: 'Friday 25 September 2026, 12pm AEST',
    state: 'Preparing the application. Nine answers written and checker-clean; reconciliation to the 12 September route and entity decisions, attachments and the four declarations outstanding.',
    owner: 'Ben',
    needs: ['Butterfly’s constitution (Q12, Q22)', 'Site letter, quote basis and cash milestone schedule per plant (Q19)', 'Current management cashflow and opening balances (Q20, Q21)', 'Kristy Bloomfield’s related-party minute (Q8, Q22)', 'Funder bundle refreshed (Q14, Q15)', 'The deck and attachments re-exported after the route change (Q23)'],
    reuses: ['All 25 questions on this page'],
    condition: 'One pool of up to A$1.1M shared across ten enterprises. The grant is catalytic, never a dollar-for-dollar match (ruling V), so A$300,000 is the top of a range. No guarantee of award (clauses 5.1, 6.5); SIH retains a co-investment right for three years after the program (clause 5.3).',
    decides: 'Interviews 6 and 7 October; conditional outcomes 23 October; preconditions by 13 November',
    notion: '392ebcf981cf8189a85cfbdda8d38f1c',
  },
  {
    id: 'bmd',
    funder: 'Brian M. Davis Charitable Foundation',
    instrument: 'grant',
    amount: 'A$100,000',
    job: 'First stock: 80 beds, facilitation inside',
    status: 'invited',
    buys: '80 beds, and every bed comes with facilitation and support for the workshopping in community. One line, no split (Ben, 14 September). The draft budget still shows 80 beds at A$60,000 plus A$40,000 of youth facilitation; it is rewritten as the one line before it goes. On this grant that is A$1,250 a bed all in, against a A$750 sale price, so the finance model needs an all-in first-stock price or a facilitation-per-bed figure. Ben to rule which.',
    due: '25 September 2026',
    state: 'Drafted against their form. The child safety process is still a draft; do not submit until it is finished. The budget is rewritten as one line: 80 beds with facilitation inside.',
    owner: 'Ben',
    needs: ['Child safety process, finished', 'The budget names QBE as the other funding body', 'Budget rewritten as one line: 80 beds with facilitation inside'],
    reuses: ['Q8 related parties', 'Q10 impact to date', 'Q11 materials', 'Q19 readiness'],
    condition: 'BMDCF pays out a grant only once all funding for a project has been confirmed (budget template, sheet INSTRUCTIONS, cell B16). The project must cover its complete scope; a QBE invitation or conditional outcome must not be assumed to satisfy it.',
    decides: 'Grants committee October; board 19 November',
    notion: '3d8ebcf981cf81dbb2defb430458ea50',
  },
  {
    id: 'tff',
    funder: 'Tim Fairfax Family Foundation, FY27 Resilience: Multi-Year General Operating Support',
    instrument: 'grant',
    amount: 'A$300,000 over three years',
    job: 'The organisation, three years',
    status: 'proposed',
    buys: 'The organisation: operating support, three years. Never beds.',
    due: '9 October 2026, 5pm',
    state: '14 required attachments, we hold 3. It tests governance, not the model, and requires an AI-use declaration.',
    owner: 'Ben',
    needs: ['Butterfly’s constitution (their 4.1, required)', 'The eleven attachments not yet held'],
    reuses: ['Q19 governance and team', 'Q20 and Q21 financials', 'Q22 governance documents'],
    decides: 'Late November, the funder’s own words',
    notion: '3d8ebcf981cf81c9ada9c61eabed022a',
  },
  {
    id: 'sefa',
    funder: 'SEFA, Backing the Bold',
    instrument: 'loan',
    amount: 'A$50,000 to 200,000',
    job: 'Repayable capital: the second press and working capital',
    status: 'conversation',
    buys: 'Repayable capital: the second press (about A$22,500) and working capital at a provisional A$276 a bed. A first ask of A$50,000 to 100,000 sits inside the programme band.',
    due: 'Open, rolling. Queensland stream open.',
    state: 'Expression of interest drafted and unsent. Since the one-entity ruling of 12 September the form is answered as a charity, FY26 EBITDA about −A$42,854, so the call with Joel Bird and Tanya Wong carries it. Next step: a lender review of the charity’s financials, transition and repayment case, then the EOI.',
    owner: 'Ben',
    needs: ['Four years of EBITDA', 'Share of revenue from trade', 'A lender review'],
    reuses: ['Q19 financial readiness', 'Q20 and Q21'],
    condition: 'Debt, not a grant: it asks whether the money generates enough to repay itself. 101 paid beds a year services A$200,000 at the provisional A$474 a bed, and that alone does not establish affordability.',
    notion: '3d8ebcf981cf8147aef9c629e6107483',
  },
  {
    id: 'snow',
    funder: 'Snow Foundation',
    instrument: 'grant',
    amount: 'A$100,000',
    job: 'Beds, in one named scope',
    status: 'conversation',
    buys: 'Beds, in one named scope. No Snow percentage prints anywhere; the dollars print with the scope named.',
    due: 'No date. Unsent.',
    state: 'One-page proposal drafted 11 September, unsent.',
    owner: 'Ben',
    needs: ['Send it'],
    reuses: ['Q10 impact to date', 'Q18 the chain'],
  },
  {
    id: 'commonwealth',
    funder: 'Commonwealth, DEWR through Oonchiumpa (and NIAA in train)',
    instrument: 'grant to a partner',
    amount: 'A$150,000 approved, a second A$150,000 likely',
    job: 'The Alice Springs plant, through Oonchiumpa',
    status: 'approved to a partner',
    buys: 'The Alice Springs plant, built by Goods on Country for Oonchiumpa under its A$1,695,000 four-year Commonwealth offer of 12 August 2026.',
    due: 'Not ours to submit',
    state: 'First tranche approved per director statement; second likely. Both are Alice Springs, outside the two QBE sites, so they neither release QBE money for beds nor close the gap. Disclosed at Q8. If a second tranche ever lands on a QBE site it must be declared at Q14 and Q15.',
    owner: 'Ben',
    needs: ['Original evidence, recipient, conditions and cash timing for each tranche'],
    reuses: ['Q8 related entities', 'Q14 and Q15 disclosure'],
  },
  {
    id: 'tfn',
    funder: 'The Funding Network, 12-month impact report',
    instrument: 'report',
    amount: 'Reporting on a grant already received',
    job: 'Reporting on a past grant',
    status: 'received',
    buys: 'Nothing new. It keeps a past funder’s reporting current.',
    due: 'Per TFN',
    state: 'Answers drafted 11 September, to cut and paste into their form.',
    owner: 'Ben',
    needs: ['Paste the answers into TFN’s form'],
    reuses: ['Q10 impact to date'],
    artifact: 'https://claude.ai/code/artifact/eb4bd86c-20b7-4027-a3b4-1a77ca49477c',
  },
];

/** The money position as the front door states it on 12 September. Legacy arithmetic, labelled. */
export const MONEY_POSITION = {
  asAt: '2026-09-12',
  yearNeedsAud: 747_950,
  coreLinesAud: 500_000,
  withSnowAud: 600_000,
  securedAud: 0,
  gapSnowOffAud: 247_950,
  gapSnowOnAud: 147_950,
  bedsUnfunded: 187,
  caveat: 'The year cost and the gap use the legacy fixed scope at the old A$276 making allowance and A$474 contribution. The 12 September flat-pack route makes the cost of a bed provisional until the bought leg-panel yield is confirmed. Recalculate before using the margin, the gap or the break-even as evidence. Not a confirmed current cash shortfall.',
} as const;

/** Every rung is a real unit with a real price. Nothing is a share of a total. */
export const LADDER: readonly { amount: string; buys: string }[] = [
  { amount: 'A$750', buys: 'one bed' },
  { amount: 'A$7,500', buys: 'ten beds' },
  { amount: 'A$22,500', buys: 'the second press' },
  { amount: 'A$75,000', buys: 'a hundred-bed pool' },
  { amount: 'A$150,000', buys: 'one plant' },
  { amount: 'A$300,000', buys: 'two plants' },
];
