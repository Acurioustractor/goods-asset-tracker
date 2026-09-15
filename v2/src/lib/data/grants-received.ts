/**
 * Grants received for the Goods work, line by line, with how each line is known. Two bases exist and
 * they do not add up to one number, so no total is printed here:
 *   xero: in the Xero receipts reconciled on 3 June 2026 (grant-content.ts fundingHistory, canon
 *         revenue-received).
 *   row:  listed on the SEFA application row (Notion, 15 September 2026) and confirmed by the
 *         founders, but not in that Xero receipt set.
 * A funder attachment prints each line with its basis. Ben decides which total, if any, is quoted.
 */

export type GrantBasis = 'xero' | 'row';

export interface GrantReceived {
  funder: string;
  amountAud: number;
  when: string;
  basis: GrantBasis;
}

export const GRANTS_RECEIVED: readonly GrantReceived[] = [
  { funder: 'Snow Foundation', amountAud: 493_130, when: '2023 to 2026', basis: 'xero' },
  { funder: 'Vincent Fairfax Family Foundation', amountAud: 50_000, when: '2025', basis: 'xero' },
  { funder: 'QIC', amountAud: 12_000, when: '2026', basis: 'xero' },
  { funder: 'The John Villiers Trust', amountAud: 1_200, when: '2026', basis: 'xero' },
  { funder: 'The Funding Network', amountAud: 130_000, when: '2025', basis: 'row' },
  { funder: 'FRRR', amountAud: 50_000, when: 'before 2026', basis: 'row' },
  { funder: 'AMP Foundation, Spark', amountAud: 21_900, when: 'before 2026', basis: 'row' },
  { funder: 'QBE Foundation, Catalysing Impact Stage 1', amountAud: 50_000, when: '2026', basis: 'row' },
];

export const GRANT_BASIS_LABEL: Record<GrantBasis, string> = {
  xero: 'In the reconciled Xero receipts, 3 June 2026',
  row: 'Founder-confirmed; not in that Xero receipt set',
};
