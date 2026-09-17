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
  /**
   * The deadline as a person says it, including the hour and the timezone.
   *
   * A date is a date and a label is a label (lib/data/as-at.ts). This field is the label: it
   * holds "Open, rolling", "Not ours to submit" and "No date. Unsent." as often as it holds a
   * day, so nothing can sort or count down on it. `dueDate` beside it is the sortable one, and
   * it is absent for every line that has no actual deadline.
   */
  due: string;
  /** YYYY-MM-DD, present only when there is a real deadline. Drives the countdown on /admin. */
  dueDate?: string;
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
    dueDate: '2026-09-25',
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
    amount: 'A$99,750',
    job: '133 beds at $750, facilitation and freight inside',
    status: 'invited',
    buys: '133 beds at $750, A$99,750, one budget line. The work around every bed and the freight sit inside the price (Ben, 15 September). The 80 beds plus A$40,000 facilitation split is withdrawn.',
    due: '25 September 2026',
    dueDate: '2026-09-25',
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
    job: '133 beds a year, three years',
    status: 'invited',
    buys: 'Each year buys 133 beds at $750, A$99,750 (Ben, 15 and 17 September). Katie Norman offered $100,000 a year, so their number and our ask differ by $250 a year. The form is General Operating Support; what it supports is the A$288 those beds hand the organisation.',
    due: '9 October 2026, 5pm',
    dueDate: '2026-10-09',
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
    amount: 'A$150,000',
    job: 'The first-year running cost, repaid from the beds',
    status: 'invited',
    buys: 'A A$150,000 loan that carries the first-year running cost while the grants buy beds and facilities. Repaid from the beds Goods sells; no community sale repays it (Ben, 15 September 2026, evening ruling: the loan sits inside the ask).',
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
    amount: 'A$99,750',
    job: '133 beds at $750',
    status: 'invited',
    buys: '133 beds at $750, A$99,750, the same lot as every other bed funder (Ben, 17 September). Drafted, unsent.',
    due: 'No date. Unsent.',
    state: 'One-page proposal drafted 11 September, unsent.',
    owner: 'Ben',
    needs: ['Send it'],
    reuses: ['Q10 impact to date', 'Q18 the chain'],
  },
  {
    id: 'commonwealth',
    funder: 'REAL Innovation Fund (DEWR), offered to Oonchiumpa',
    instrument: 'grant to a partner',
    amount: 'A$1,695,000 over four years, unsigned',
    job: 'The Alice Springs facility, through Oonchiumpa. A$150,000 to Goods once signed',
    status: 'approved to a partner',
    buys: 'Oonchiumpa\'s Alice Springs facility, under its A$1,695,000 four-year Commonwealth offer of 12 August 2026, agreement unsigned. Once signed, Oonchiumpa pays Goods A$150,000 to develop it. Never counted in the raise.',
    due: 'Not ours to submit',
    state: 'Offer dated 12 August 2026, agreement not executed, no cash received. Alice Springs is outside the two QBE sites, so it neither releases QBE money for beds nor closes the gap. Disclosed at Q8.',
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
  { amount: 'A$75,000', buys: 'a hundred-bed pool' },
  { amount: 'A$99,750', buys: '133 beds, the standard grant lot' },
  { amount: 'A$150,000', buys: 'one production facility' },
  { amount: 'A$300,000', buys: 'two production facilities' },
];
