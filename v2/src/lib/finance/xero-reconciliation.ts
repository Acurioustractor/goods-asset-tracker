/**
 * Pure, unit-testable reconciliation between CRM deals (Goods Supabase
 * `crm_deals`) and real Xero invoices (ACT-infra `xero_invoices`).
 *
 * Honesty contract (enforced by the admin page that consumes this):
 *  - Payment status (paid / authorised / overdue) is derived ONLY from the
 *    Xero `status` + `due_date`, never from the CRM free-text `notes` column.
 *  - AR (ACCREC) is collectable; AP (ACCPAY) is NOT debt. An AP invoice that
 *    is AUTHORISED-but-unpaid is a Xero payment-matching gap, not money owed.
 *    The canonical position is AP ~= $0 (all spend came from ACT business
 *    accounts; no director loan). Only past-due ACCREC is ever "overdue".
 *  - Money is carried in dollars (Xero `total`/`amount_paid`/`amount_due` are
 *    AUD dollars, not cents) and rendered to 2 dp by the consumer.
 *
 * Nothing in this module reads the DOM, env, or network — it takes already
 * fetched rows so it can be exercised in a test with fixtures.
 */

/** Subset of Xero `xero_invoices` columns this module relies on. */
export interface XeroInvoice {
  invoice_number: string | null;
  type: 'ACCREC' | 'ACCPAY' | string;
  status: string; // PAID | AUTHORISED | DRAFT | VOIDED | DELETED | SUBMITTED ...
  total: number | null;
  amount_paid: number | null;
  amount_due: number | null;
  due_date: string | null; // YYYY-MM-DD
  date: string | null; // YYYY-MM-DD
  contact_name: string | null;
  income_type: string | null; // 'grant' | 'commercial' | null
}

/** Subset of `crm_deals` columns this module relies on. */
export interface CrmDealRow {
  id: string;
  title: string | null;
  deal_type: string | null;
  pipeline_stage: string | null;
  amount_cents: number | null;
  notes: string | null;
  source: string | null;
  updated_at: string | null;
}

/**
 * Australian GST is 1/11 of a GST-inclusive amount. When a CRM amount was
 * captured ex-GST and the Xero invoice is inc-GST (or vice-versa) the two
 * differ by exactly this factor; that is an expected basis difference, not a
 * data error, so the mismatch detector tolerates it.
 */
export const GST_FACTOR = 1 / 11;

/**
 * Absolute tolerance (in dollars) for "amounts agree". Covers rounding to the
 * cent on either side of the GST conversion. Named so the page and any test
 * read the same threshold.
 */
export const MISMATCH_EPSILON_DOLLARS = 0.05;

/** Extract a Xero invoice number (INV-####) from CRM free-text notes. */
export function extractInvoiceNumber(notes: string | null | undefined): string | null {
  if (!notes) return null;
  const match = notes.match(/INV-\d+/i);
  return match ? match[0].toUpperCase() : null;
}

const VOID_STATUSES = new Set(['VOIDED', 'DELETED']);

/** A live invoice is one Xero still counts — not voided or deleted. */
export function isLiveInvoice(inv: Pick<XeroInvoice, 'status'>): boolean {
  return !VOID_STATUSES.has((inv.status || '').toUpperCase());
}

/**
 * Shared "overdue" predicate, sourced from Xero status + due date — the single
 * definition imported by the reconciliation page AND the admin dashboard, so
 * the two can never drift to different totals.
 *
 * Overdue == an authorised (issued, unpaid-in-full) invoice whose due date is
 * strictly before `today`. Paid, draft, voided and deleted invoices are never
 * overdue. `today` is injected (default = now) to keep this pure/testable.
 */
export function isOverdue(
  inv: Pick<XeroInvoice, 'status' | 'due_date' | 'amount_due'>,
  today: Date = new Date(),
): boolean {
  const status = (inv.status || '').toUpperCase();
  if (status !== 'AUTHORISED' && status !== 'SUBMITTED') return false;
  if ((inv.amount_due ?? 0) <= 0) return false;
  if (!inv.due_date) return false;
  const due = new Date(`${inv.due_date.slice(0, 10)}T23:59:59`);
  if (Number.isNaN(due.getTime())) return false;
  return due.getTime() < today.getTime();
}

export type PaymentState = 'paid' | 'overdue' | 'authorised' | 'draft' | 'voided' | 'other';

/** Derive a single payment state from Xero status + due date (never notes). */
export function paymentState(inv: XeroInvoice, today: Date = new Date()): PaymentState {
  const status = (inv.status || '').toUpperCase();
  if (VOID_STATUSES.has(status)) return 'voided';
  if (status === 'PAID') return 'paid';
  if (status === 'DRAFT') return 'draft';
  if (isOverdue(inv, today)) return 'overdue';
  if (status === 'AUTHORISED' || status === 'SUBMITTED') return 'authorised';
  return 'other';
}

/** True when two amounts agree directly OR differ by exactly the GST factor. */
export function amountsAgree(
  a: number,
  b: number,
  epsilon: number = MISMATCH_EPSILON_DOLLARS,
): boolean {
  if (Math.abs(a - b) <= epsilon) return true;
  // ex-GST vs inc-GST: the larger should be ~11/10 of the smaller.
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  if (lo <= 0) return false;
  const grossedUp = lo * (1 + GST_FACTOR * 11 / 10); // lo + 10% GST = lo * 1.1
  return Math.abs(grossedUp - hi) <= epsilon;
}

export interface MatchedRow {
  invoiceNumber: string;
  deal: CrmDealRow;
  invoice: XeroInvoice;
  /** Xero invoice total in dollars (authoritative amount). */
  xeroTotal: number;
  /** CRM deal amount in dollars (amount_cents / 100). */
  crmAmount: number;
  /** Whether the two amounts agree (direct or via GST factor). */
  agrees: boolean;
  /** Signed difference (Xero − CRM) in dollars when they do not agree. */
  diff: number;
  state: PaymentState;
  isAr: boolean;
}

export interface ReconciliationTotals {
  /** ACCREC raised (live), in dollars. */
  arRaised: number;
  /** ACCREC paid (live), in dollars. */
  arPaid: number;
  /** ACCREC still due — collectable receivables, in dollars. */
  arOutstanding: number;
  /** ACCREC past-due (the only genuine "overdue"), in dollars. */
  arOverdue: number;
  /** ACCPAY authorised-but-unpaid — a payment-matching GAP, not debt. */
  apMatchingGap: number;
}

export interface ReconciliationResult {
  /** Deals whose extracted invoice number matched a live Xero invoice. */
  matched: MatchedRow[];
  /** Deals carrying an invoice number with no live Xero match. */
  crmOnly: CrmDealRow[];
  /** Live Xero invoices not referenced by any CRM deal. */
  xeroOnly: XeroInvoice[];
  /** Deals with no invoice number at all (informational coverage gap). */
  dealsWithoutInvoice: CrmDealRow[];
  /** Matched rows whose CRM amount disagrees with Xero (beyond GST tolerance). */
  mismatches: MatchedRow[];
  /** Live ACCREC invoices that are past due. */
  arOverdue: MatchedRow['invoice'][];
  /** Live ACCPAY invoices that are authorised-but-unpaid (matching gap). */
  apMatchingGap: XeroInvoice[];
  totals: ReconciliationTotals;
}

/**
 * Reconcile CRM deals against live Xero invoices.
 *
 * `xeroInvoices` should already be filtered to the relevant project, but this
 * function defensively drops VOIDED/DELETED so a caller that forgets the
 * status filter cannot resurrect the void-summation bug.
 */
export function reconcile(
  crmDeals: CrmDealRow[],
  xeroInvoices: XeroInvoice[],
  today: Date = new Date(),
): ReconciliationResult {
  const live = xeroInvoices.filter(isLiveInvoice);

  // Index live invoices by upper-cased invoice number for joining.
  const byNumber = new Map<string, XeroInvoice>();
  for (const inv of live) {
    const num = (inv.invoice_number || '').toUpperCase();
    if (num) byNumber.set(num, inv);
  }

  const matched: MatchedRow[] = [];
  const crmOnly: CrmDealRow[] = [];
  const dealsWithoutInvoice: CrmDealRow[] = [];
  const matchedNumbers = new Set<string>();

  for (const deal of crmDeals) {
    const num = extractInvoiceNumber(deal.notes);
    if (!num) {
      dealsWithoutInvoice.push(deal);
      continue;
    }
    const inv = byNumber.get(num);
    if (!inv) {
      crmOnly.push(deal);
      continue;
    }
    matchedNumbers.add(num);
    const xeroTotal = inv.total ?? 0;
    const crmAmount = (deal.amount_cents ?? 0) / 100;
    const agrees = amountsAgree(xeroTotal, crmAmount);
    matched.push({
      invoiceNumber: num,
      deal,
      invoice: inv,
      xeroTotal,
      crmAmount,
      agrees,
      diff: xeroTotal - crmAmount,
      state: paymentState(inv, today),
      isAr: (inv.type || '').toUpperCase() === 'ACCREC',
    });
  }

  const xeroOnly = live.filter((inv) => {
    const num = (inv.invoice_number || '').toUpperCase();
    return num && !matchedNumbers.has(num);
  });

  const ar = live.filter((inv) => (inv.type || '').toUpperCase() === 'ACCREC');
  const ap = live.filter((inv) => (inv.type || '').toUpperCase() === 'ACCPAY');

  const arOverdueInvoices = ar.filter((inv) => isOverdue(inv, today));
  // AP authorised-but-unpaid = the payment-matching gap (NOT debt).
  const apMatchingGap = ap.filter((inv) => {
    const status = (inv.status || '').toUpperCase();
    return (status === 'AUTHORISED' || status === 'SUBMITTED') && (inv.amount_due ?? 0) > 0;
  });

  const totals: ReconciliationTotals = {
    arRaised: sum(ar.map((r) => r.total ?? 0)),
    arPaid: sum(ar.map((r) => r.amount_paid ?? 0)),
    arOutstanding: sum(ar.map((r) => r.amount_due ?? 0)),
    arOverdue: sum(arOverdueInvoices.map((r) => r.amount_due ?? 0)),
    apMatchingGap: sum(apMatchingGap.map((r) => r.amount_due ?? 0)),
  };

  return {
    matched,
    crmOnly,
    xeroOnly,
    dealsWithoutInvoice,
    mismatches: matched.filter((m) => !m.agrees && m.crmAmount > 0),
    arOverdue: arOverdueInvoices,
    apMatchingGap,
    totals,
  };
}

function sum(xs: number[]): number {
  return xs.reduce((s, x) => s + (Number.isFinite(x) ? x : 0), 0);
}
