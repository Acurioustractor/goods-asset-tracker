import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  DollarSign,
  Link2Off,
  FileX2,
} from 'lucide-react';
import type { CrmDeal } from '@/lib/types/database';
import {
  reconcile,
  extractInvoiceNumber,
  type XeroInvoice,
  type CrmDealRow,
  type PaymentState,
} from '@/lib/finance/xero-reconciliation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ACT_URL = process.env.ACT_INFRA_SUPABASE_URL || '';
const ACT_KEY = process.env.ACT_INFRA_SUPABASE_KEY || '';

/** Money to the cent — locked figures like 732,210.79 must render exactly. */
function currency(dollars: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(dollars) ? dollars : 0);
}

/**
 * Fetch real Xero invoices for Goods (project_code=ACT-GD), excluding
 * VOIDED/DELETED at the query — the same `fetchXero` header / `cache:no-store`
 * pattern used by lib/funders/metrics.ts and admin/trip-receipts/page.tsx.
 * Returns `{ rows, error }` so the page can show an honest banner instead of
 * a silent empty state on a misconfigured env / network failure.
 */
async function fetchXeroInvoices(): Promise<{ rows: XeroInvoice[]; error: string | null }> {
  if (!ACT_URL || !ACT_KEY) {
    return { rows: [], error: 'ACT_INFRA_SUPABASE_URL / _KEY not configured — cannot read Xero.' };
  }
  const url =
    `${ACT_URL}/rest/v1/xero_invoices` +
    `?select=date,contact_name,total,amount_paid,amount_due,status,invoice_number,income_type,type,due_date` +
    `&project_code=eq.ACT-GD` +
    `&type=in.(ACCREC,ACCPAY)` +
    `&status=not.in.(VOIDED,DELETED)` +
    `&order=date.desc`;
  try {
    const res = await fetch(url, {
      headers: { apikey: ACT_KEY, Authorization: `Bearer ${ACT_KEY}` },
      cache: 'no-store',
    });
    if (!res.ok) return { rows: [], error: `Xero query failed: ${res.status} ${await res.text()}` };
    const rows = (await res.json()) as XeroInvoice[];
    return { rows, error: null };
  } catch (e) {
    return { rows: [], error: `Xero fetch error: ${(e as Error).message}` };
  }
}

const STATE_STYLE: Record<PaymentState, { label: string; badge: string }> = {
  paid: { label: 'Paid', badge: 'bg-green-100 text-green-800' },
  overdue: { label: 'Overdue', badge: 'bg-red-100 text-red-800' },
  authorised: { label: 'Authorised', badge: 'bg-amber-100 text-amber-800' },
  draft: { label: 'Draft', badge: 'bg-gray-100 text-gray-600' },
  voided: { label: 'Voided', badge: 'bg-gray-100 text-gray-400' },
  other: { label: 'Other', badge: 'bg-gray-100 text-gray-600' },
};

function fmtDate(d: string | null): string {
  return d ? d.slice(0, 10) : '—';
}

export default async function XeroReconciliationPage() {
  const supabase = createServiceClient();

  const [dealsRes, xero] = await Promise.all([
    supabase
      .from('crm_deals')
      .select('id, title, deal_type, pipeline_stage, amount_cents, notes, source, updated_at')
      .order('amount_cents', { ascending: false }),
    fetchXeroInvoices(),
  ]);

  const dealsError = dealsRes.error?.message ?? null;
  const crmDeals: CrmDealRow[] = ((dealsRes.data as CrmDeal[] | null) || []).map((d) => ({
    id: d.id,
    title: d.title,
    deal_type: d.deal_type,
    pipeline_stage: d.pipeline_stage,
    amount_cents: d.amount_cents,
    notes: d.notes,
    source: d.source,
    updated_at: d.updated_at,
  }));

  const today = new Date();
  const result = reconcile(crmDeals, xero.rows, today);
  const { totals } = result;

  // Data-freshness: latest of the CRM deal updates and the Xero invoice dates.
  const latestCrm = crmDeals.reduce<string>((m, d) => (d.updated_at && d.updated_at > m ? d.updated_at : m), '');
  const latestXero = xero.rows.reduce<string>((m, r) => (r.date && r.date > m ? r.date : m), '');
  const dataAsAt = [latestCrm.slice(0, 10), latestXero.slice(0, 10)].filter(Boolean).sort().pop() || '—';

  const hasXero = xero.rows.length > 0;
  const empty = !hasXero && crmDeals.length === 0;

  return (
    <div className="space-y-8 pb-16">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Xero reconciliation</h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-500">
          Live Xero invoices (<code>project_code=ACT-GD</code>, VOIDED/DELETED excluded) joined to
          CRM deals by invoice number. Payment status and overdue are read from Xero
          <code className="mx-1">status</code>+<code className="mx-1">due_date</code> — never from
          deal notes. Receivables (ACCREC) are collectable; payables (ACCPAY) are{' '}
          <strong>not debt</strong>.
        </p>
        <p className="mt-1 text-xs text-gray-400">Data as at {dataAsAt}</p>
      </header>

      {/* Error banners — never let a fetch failure read as a real $0. */}
      {xero.error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span><strong>Xero unavailable.</strong> {xero.error} Figures below reflect CRM only and are not reconciled.</span>
        </div>
      )}
      {dealsError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span><strong>CRM deals unavailable.</strong> {dealsError}</span>
        </div>
      )}
      {empty && !xero.error && !dealsError && (
        <Card><CardContent className="p-6 text-sm text-gray-500">No CRM deals or Xero invoices found.</CardContent></Card>
      )}

      {/* AR (collectable) tiles */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Accounts receivable (collectable)</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'AR raised (Xero)', value: currency(totals.arRaised), icon: DollarSign, color: 'text-slate-700 bg-slate-100', sub: `${result.matched.filter((m) => m.isAr).length + result.xeroOnly.filter((r) => (r.type || '').toUpperCase() === 'ACCREC').length} ACCREC invoices` },
            { label: 'AR paid (Xero)', value: currency(totals.arPaid), icon: CheckCircle2, color: 'text-green-600 bg-green-50', sub: 'amount_paid on ACCREC' },
            { label: 'AR outstanding (Xero)', value: currency(totals.arOutstanding), icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', sub: 'amount_due on ACCREC' },
            { label: 'AR overdue (Xero)', value: currency(totals.arOverdue), icon: XCircle, color: 'text-red-600 bg-red-50', sub: `${result.arOverdue.length} past due` },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold tabular-nums text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                    <div className="text-[10px] text-gray-400">{stat.sub}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* AP — explicitly NOT debt */}
      <section>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Accounts payable — payment-matching gap (not debt)</h2>
              <p className="mt-1 max-w-2xl text-xs text-gray-500">
                AUTHORISED-but-unpaid ACCPAY bills. The 2026-05-29 Xero cross-check found AP{' '}
                <strong>~$0 owed</strong>: all spend came from ACT business accounts, with no
                director loan. An authorised-but-unpaid bill here is a Xero <em>payment-matching gap</em>{' '}
                (a bill paid from a bank account but never applied to the invoice), not collectable debt.
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold tabular-nums text-gray-700">{currency(totals.apMatchingGap)}</div>
              <div className="text-[10px] text-gray-400">{result.apMatchingGap.length} ACCPAY bills · matching gap</div>
            </div>
          </div>
        </div>
      </section>

      {/* AR overdue detail — the only genuine "follow-up" list */}
      {result.arOverdue.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-red-700">Receivables past due</h2>
            <p className="mt-1 text-sm text-gray-500">ACCREC invoices authorised with a due date before today — collectable, requires follow-up.</p>
          </div>
          <Card className="border-red-200">
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-red-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Invoice</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Contact</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Due</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Outstanding</th>
                  </tr>
                </thead>
                <tbody>
                  {result.arOverdue.map((inv) => (
                    <tr key={inv.invoice_number} className="border-b last:border-b-0">
                      <td className="px-4 py-3"><Badge className="bg-red-100 text-red-800">{inv.invoice_number}</Badge></td>
                      <td className="px-4 py-3 text-gray-900">{inv.contact_name}</td>
                      <td className="px-4 py-3 text-gray-600">{fmtDate(inv.due_date)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{currency(inv.total ?? 0)}</td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-red-700">{currency(inv.amount_due ?? 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Amount mismatches — ex-GST vs inc-GST tolerated */}
      {result.mismatches.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-orange-700">Amount mismatches</h2>
            <p className="mt-1 text-sm text-gray-500">
              CRM deal amount differs from the Xero invoice <code>total</code> by more than rounding,
              and not by the GST factor (1/11). Worth a manual check.
            </p>
          </div>
          <Card className="border-orange-200">
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Deal</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Invoice</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">CRM amount</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Xero total</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {result.mismatches.map((m) => (
                    <tr key={m.deal.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{m.deal.title}</td>
                      <td className="px-4 py-3"><Badge className="bg-orange-100 text-orange-800">{m.invoiceNumber}</Badge></td>
                      <td className="px-4 py-3 text-right tabular-nums">{currency(m.crmAmount)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{currency(m.xeroTotal)}</td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-orange-700">{currency(m.diff)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Matched */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Matched ({result.matched.length})</h2>
          <p className="mt-1 text-sm text-gray-500">CRM deals whose invoice number matched a live Xero invoice. Status from Xero.</p>
        </div>
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">Deal</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Invoice</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">AR/AP</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Xero total</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Agrees</th>
                </tr>
              </thead>
              <tbody>
                {result.matched.map((m) => (
                  <tr key={m.deal.id} className="border-b last:border-b-0 hover:bg-slate-50/50">
                    <td className="max-w-[220px] truncate px-4 py-2.5 font-medium text-gray-900">{m.deal.title}</td>
                    <td className="px-4 py-2.5"><Badge variant="outline" className="font-mono text-xs">{m.invoiceNumber}</Badge></td>
                    <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs">{m.isAr ? 'AR' : 'AP'}</Badge></td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums">{currency(m.xeroTotal)}</td>
                    <td className="px-4 py-2.5"><Badge className={`text-xs ${STATE_STYLE[m.state].badge}`}>{STATE_STYLE[m.state].label}</Badge></td>
                    <td className="px-4 py-2.5">{m.agrees ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <span className="text-xs font-semibold text-orange-700">≠ {currency(m.diff)}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* CRM-only (deal cites an invoice number with no live Xero match) */}
      {result.crmOnly.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">CRM-only ({result.crmOnly.length})</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500"><Link2Off className="h-4 w-4" /> Deal notes cite an invoice number with no matching live Xero invoice (voided, deleted, or wrong number).</p>
          </div>
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Deal</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Cited invoice</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">CRM amount</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {result.crmOnly.map((d) => (
                    <tr key={d.id} className="border-b last:border-b-0">
                      <td className="px-4 py-2.5 font-medium text-gray-900">{d.title}</td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className="font-mono text-xs">{extractInvoiceNumber(d.notes)}</Badge></td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{d.amount_cents ? currency(d.amount_cents / 100) : '—'}</td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs">{d.pipeline_stage}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Xero-only (invoice exists, no CRM deal references it) */}
      {result.xeroOnly.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Xero-only ({result.xeroOnly.length})</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-500"><FileX2 className="h-4 w-4" /> Live Xero invoices not referenced by any CRM deal — coverage gap in the CRM.</p>
          </div>
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Invoice</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Contact</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">AR/AP</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.xeroOnly.slice(0, 60).map((inv) => (
                    <tr key={inv.invoice_number} className="border-b last:border-b-0">
                      <td className="px-4 py-2.5"><Badge variant="outline" className="font-mono text-xs">{inv.invoice_number}</Badge></td>
                      <td className="max-w-[220px] truncate px-4 py-2.5 text-gray-900">{inv.contact_name}</td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs">{(inv.type || '').toUpperCase() === 'ACCREC' ? 'AR' : 'AP'}</Badge></td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{currency(inv.total ?? 0)}</td>
                      <td className="px-4 py-2.5"><Badge className={`text-xs ${STATE_STYLE[paymentStateLabel(inv.status)].badge}`}>{inv.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.xeroOnly.length > 60 && (
                <div className="px-4 py-2 text-xs text-gray-400">Showing first 60 of {result.xeroOnly.length}.</div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Deals without any invoice number — informational coverage */}
      {result.dealsWithoutInvoice.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">No invoice reference ({result.dealsWithoutInvoice.length})</h2>
            <p className="mt-1 text-sm text-gray-500">CRM deals with no invoice number in their notes — may need one raised.</p>
          </div>
          <Card>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Deal</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">CRM amount</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {result.dealsWithoutInvoice.map((d) => (
                    <tr key={d.id} className="border-b last:border-b-0 hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-medium text-gray-900">{d.title}</td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs">{d.deal_type}</Badge></td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{d.amount_cents ? currency(d.amount_cents / 100) : '—'}</td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs">{d.pipeline_stage}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

/** Map a raw Xero status string to a known style bucket for the Xero-only table. */
function paymentStateLabel(status: string): PaymentState {
  const s = (status || '').toUpperCase();
  if (s === 'PAID') return 'paid';
  if (s === 'AUTHORISED' || s === 'SUBMITTED') return 'authorised';
  if (s === 'DRAFT') return 'draft';
  if (s === 'VOIDED' || s === 'DELETED') return 'voided';
  return 'other';
}
