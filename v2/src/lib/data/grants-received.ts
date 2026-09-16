/**
 * Grants received for the Goods work, line by line, each tied to the books on 16 September 2026.
 * Six lines are in the Xero file the Goods trading ran through (Nicholas Marchesi, sole trader); one
 * is in the charity's own FY26 statements. Every line ties, so one total is printed.
 *
 * Corrected 16 September 2026 against the first version of this list:
 *   - FRRR is not a separate $50,000. FRRR and the Vincent Fairfax Family Foundation are one joint
 *     Backing the Future grant, paid once on INV-0253. Listing both counted it twice.
 *   - The Funding Network is $144,558, the two receipts banked (28 Nov and 19 Dec 2025, account 262
 *     Grants Received), not the $130,000 on the SEFA application row.
 * Bed sales are trade, not grants (paid-trade.ts). The site's $741,111 and $901,311 include buyer
 * receipts and are never quoted as grants.
 */

export type GrantBasis = 'xero' | 'charity-fy26';

export interface GrantReceived {
  funder: string;
  amountAud: number;
  when: string;
  basis: GrantBasis;
  /** What was read to tie the line. */
  source: string;
  /**
   * What the money paid for, in one phrase, for surfaces that name funders without
   * printing amounts (Ben, 2026-09-16: no dollar figures on the funder surfaces).
   * Only filled where there is a source for it. Undefined means we do not know yet,
   * so the surface renders nothing there. A guess would be worse than a gap.
   */
  bought?: string;
  /**
   * Sort key, YYYY-MM, for the month the FIRST money under this line arrived. The
   * order funders came in is the argument on the funder surfaces, so it needs to be
   * sortable, so it is stored here instead of parsed out of the `when` prose. QBE is
   * the only soft one:
   * its line reads "2025 to 2026" from the charity's FY26 statements and no month is
   * recorded, so it sorts at the start of that financial year and should not be
   * quoted as a month.
   */
  since: string;
}

export const GRANTS_RECEIVED: readonly GrantReceived[] = [
  { funder: 'Snow Foundation', amountAud: 493_130, when: 'October 2023 to May 2026', since: '2023-10', basis: 'xero', source: 'ten paid invoices, INV-0092 to INV-0321, $493,129.79', bought: 'Three years of the work itself: the visits, the bed from V1 to V4, the washing machine, and the on-Country plant. The split across those is indicative only.' },
  { funder: 'The Funding Network', amountAud: 144_558, when: 'November and December 2025', since: '2025-11', basis: 'xero', source: 'two reconciled receipts, $89,361 on 28 Nov 2025 and $55,197 on 19 Dec 2025, account 262', bought: 'The on-Country production facility. Raised in one room at Healthy People Healthy Planet on 2 September 2025, with a Bupa match, which is why it arrived in two payments.' },
  { funder: 'Vincent Fairfax Family Foundation with FRRR, Backing the Future', amountAud: 50_000, when: 'July 2025', since: '2025-07', basis: 'xero', source: 'INV-0253, paid 24 Jul 2025', bought: "The Palm Island youth pilot: 25 beds, three community sessions, 30 young people. FRRR's youth program. Acquitted in March 2026." },
  { funder: 'QBE Foundation, Catalysing Impact Stage 1', amountAud: 50_000, when: '2025 to 2026', since: '2025-07', basis: 'charity-fy26', source: 'the Grant - QBE line, prepared by Jaquillard Minns, unaudited', bought: 'Stage one of Catalysing Impact, the blended finance program run by the Social Impact Hub.' },
  { funder: 'AMP Foundation, Tomorrow Makers Spark', amountAud: 21_900, when: 'July to December 2024', since: '2024-07', basis: 'xero', source: 'five paid invoices to AMP, 2024' },
  { funder: 'QIC', amountAud: 12_000, when: 'June 2025', since: '2025-06', basis: 'xero', source: 'INV-0232, paid 30 Jun 2025' },
  { funder: 'The John Villiers Trust', amountAud: 1_200, when: 'May 2026', since: '2026-05', basis: 'xero', source: 'INV-0327, paid 3 May 2026', bought: 'Travel to Palm Island to film the work: flights through Townsville and accommodation.' },
];

export const GRANTS_RECEIVED_TOTAL_AUD = GRANTS_RECEIVED.reduce((n, g) => n + g.amountAud, 0);

export const GRANTS_RECEIVED_AS_AT = '16 September 2026';

export const GRANT_BASIS_LABEL: Record<GrantBasis, string> = {
  xero: 'In Xero',
  'charity-fy26': "In the charity's FY26 statements",
};
