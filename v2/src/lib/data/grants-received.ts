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
}

export const GRANTS_RECEIVED: readonly GrantReceived[] = [
  { funder: 'Snow Foundation', amountAud: 493_130, when: 'October 2023 to May 2026', basis: 'xero', source: 'ten paid invoices, INV-0092 to INV-0321, $493,129.79' },
  { funder: 'The Funding Network', amountAud: 144_558, when: 'November and December 2025', basis: 'xero', source: 'two reconciled receipts, $89,361 on 28 Nov 2025 and $55,197 on 19 Dec 2025, account 262' },
  { funder: 'Vincent Fairfax Family Foundation with FRRR, Backing the Future', amountAud: 50_000, when: 'July 2025', basis: 'xero', source: 'INV-0253, paid 24 Jul 2025' },
  { funder: 'QBE Foundation, Catalysing Impact Stage 1', amountAud: 50_000, when: '2025 to 2026', basis: 'charity-fy26', source: 'the Grant - QBE line, prepared by Jaquillard Minns, unaudited' },
  { funder: 'AMP Foundation, Tomorrow Makers Spark', amountAud: 21_900, when: 'July to December 2024', basis: 'xero', source: 'five paid invoices to AMP, 2024' },
  { funder: 'QIC', amountAud: 12_000, when: 'June 2025', basis: 'xero', source: 'INV-0232, paid 30 Jun 2025' },
  { funder: 'The John Villiers Trust', amountAud: 1_200, when: 'May 2026', basis: 'xero', source: 'INV-0327, paid 3 May 2026' },
];

export const GRANTS_RECEIVED_TOTAL_AUD = GRANTS_RECEIVED.reduce((n, g) => n + g.amountAud, 0);

export const GRANTS_RECEIVED_AS_AT = '16 September 2026';

export const GRANT_BASIS_LABEL: Record<GrantBasis, string> = {
  xero: 'In Xero',
  'charity-fy26': "In the charity's FY26 statements",
};
