import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  DollarSign,
  FileText,
  Clock,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function currency(cents: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(cents / 100);
}

// Extract Xero invoice number from notes
function extractInvoice(notes: string | null): string | null {
  if (!notes) return null;
  const match = notes.match(/INV-\d+|QU-\d+/);
  return match ? match[0] : null;
}

// Extract payment status from notes
function extractStatus(notes: string | null): 'paid' | 'authorised' | 'overdue' | 'draft' | 'unknown' {
  if (!notes) return 'unknown';
  const upper = notes.toUpperCase();
  if (upper.includes('PAID')) return 'paid';
  if (upper.includes('OVERDUE')) return 'overdue';
  if (upper.includes('AUTHORISED')) return 'authorised';
  if (upper.includes('DRAFT')) return 'draft';
  return 'unknown';
}

// Extract amount from notes (e.g. "$132,000" or "$82,500")
function extractNotesAmount(notes: string | null): number | null {
  if (!notes) return null;
  const match = notes.match(/\$[\d,]+(?:\.\d{2})?/);
  if (!match) return null;
  return Math.round(parseFloat(match[0].replace(/[$,]/g, '')) * 100);
}

export default async function XeroReconciliationPage() {
  const supabase = createServiceClient();

  const { data: deals } = await supabase
    .from('crm_deals')
    .select('id, title, deal_type, pipeline_stage, amount_cents, notes, source, updated_at')
    .order('amount_cents', { ascending: false });

  const allDeals = deals || [];

  // Categorize deals
  const withInvoice = allDeals.filter((d) => extractInvoice(d.notes));
  const withoutInvoice = allDeals.filter((d) => !extractInvoice(d.notes));

  // Find amount mismatches
  const mismatches = withInvoice.filter((d) => {
    const notesAmount = extractNotesAmount(d.notes);
    if (!notesAmount || !d.amount_cents) return false;
    // Allow 10% tolerance for GST differences
    const diff = Math.abs(notesAmount - d.amount_cents);
    const tolerance = Math.max(notesAmount, d.amount_cents) * 0.10;
    return diff > tolerance;
  });

  // Overdue invoices
  const overdue = withInvoice.filter((d) => extractStatus(d.notes) === 'overdue');

  // Awaiting payment
  const authorised = withInvoice.filter((d) => extractStatus(d.notes) === 'authorised');

  // Paid
  const paid = withInvoice.filter((d) => extractStatus(d.notes) === 'paid');

  // Stats
  const totalWon = allDeals.filter((d) => d.pipeline_stage === 'won').reduce((s, d) => s + (d.amount_cents || 0), 0);
  const totalPaid = paid.reduce((s, d) => s + (d.amount_cents || 0), 0);
  const totalOverdue = overdue.reduce((s, d) => s + (d.amount_cents || 0), 0);
  const totalAuthorised = authorised.reduce((s, d) => s + (d.amount_cents || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Won', value: currency(totalWon), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50', badge: `${allDeals.filter((d) => d.pipeline_stage === 'won').length} deals` },
          { label: 'Paid (Xero)', value: currency(totalPaid), icon: CheckCircle2, color: 'text-green-600 bg-green-50', badge: `${paid.length} invoices` },
          { label: 'Awaiting Payment', value: currency(totalAuthorised), icon: Clock, color: 'text-amber-600 bg-amber-50', badge: `${authorised.length} invoices` },
          { label: 'Overdue', value: currency(totalOverdue), icon: XCircle, color: 'text-red-600 bg-red-50', badge: `${overdue.length} invoices` },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                  <Badge variant="outline" className="text-[10px] mt-1">{stat.badge}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overdue Invoices */}
      {overdue.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-red-700">Overdue Invoices</h2>
            <p className="mt-1 text-sm text-gray-500">Invoices past due — requires follow-up</p>
          </div>
          <Card className="border-red-200">
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-red-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Deal</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Invoice</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">CRM Amount</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {overdue.map((d) => (
                    <tr key={d.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{d.title}</td>
                      <td className="px-4 py-3"><Badge className="bg-red-100 text-red-800">{extractInvoice(d.notes)}</Badge></td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">{currency(d.amount_cents || 0)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[300px] truncate">{d.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Awaiting Payment */}
      {authorised.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-amber-700">Awaiting Payment</h2>
            <p className="mt-1 text-sm text-gray-500">Authorised but not yet paid</p>
          </div>
          <Card className="border-amber-200">
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-amber-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Deal</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Invoice</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Amount</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {authorised.map((d) => (
                    <tr key={d.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{d.title}</td>
                      <td className="px-4 py-3"><Badge className="bg-amber-100 text-amber-800">{extractInvoice(d.notes)}</Badge></td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">{currency(d.amount_cents || 0)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 max-w-[300px] truncate">{d.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Amount Mismatches */}
      {mismatches.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-orange-700">Amount Mismatches</h2>
            <p className="mt-1 text-sm text-gray-500">CRM amount differs from invoice amount by &gt;10% (may be GST)</p>
          </div>
          <Card className="border-orange-200">
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-orange-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Deal</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Invoice</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">CRM Amount</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Invoice Amount</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {mismatches.map((d) => {
                    const notesAmt = extractNotesAmount(d.notes) || 0;
                    return (
                      <tr key={d.id} className="border-b last:border-b-0">
                        <td className="px-4 py-3 font-medium text-gray-900">{d.title}</td>
                        <td className="px-4 py-3"><Badge className="bg-orange-100 text-orange-800">{extractInvoice(d.notes)}</Badge></td>
                        <td className="px-4 py-3 text-right tabular-nums">{currency(d.amount_cents || 0)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{currency(notesAmt)}</td>
                        <td className="px-4 py-3 text-right tabular-nums font-bold text-orange-700">
                          {currency(Math.abs(notesAmt - (d.amount_cents || 0)))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* All Invoiced Deals */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">All Invoiced Deals ({withInvoice.length})</h2>
          <p className="mt-1 text-sm text-gray-500">CRM deals with Xero invoice references</p>
        </div>
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">Deal</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Invoice</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">Amount</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Payment</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Stage</th>
                </tr>
              </thead>
              <tbody>
                {withInvoice.map((d) => {
                  const status = extractStatus(d.notes);
                  const statusColors: Record<string, string> = {
                    paid: 'bg-green-100 text-green-800',
                    authorised: 'bg-amber-100 text-amber-800',
                    overdue: 'bg-red-100 text-red-800',
                    draft: 'bg-gray-100 text-gray-600',
                    unknown: 'bg-gray-100 text-gray-600',
                  };
                  const typeColors: Record<string, string> = {
                    sale: 'bg-blue-100 text-blue-800',
                    funding: 'bg-emerald-100 text-emerald-800',
                    procurement: 'bg-purple-100 text-purple-800',
                    partnership: 'bg-indigo-100 text-indigo-800',
                  };
                  return (
                    <tr key={d.id} className="border-b last:border-b-0 hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-medium text-gray-900 max-w-[200px] truncate">{d.title}</td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs font-mono">{extractInvoice(d.notes)}</Badge></td>
                      <td className="px-4 py-2.5"><Badge className={`text-xs ${typeColors[d.deal_type] || 'bg-gray-100'}`}>{d.deal_type}</Badge></td>
                      <td className="px-4 py-2.5 text-right font-bold tabular-nums">{currency(d.amount_cents || 0)}</td>
                      <td className="px-4 py-2.5"><Badge className={`text-xs ${statusColors[status]}`}>{status}</Badge></td>
                      <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs">{d.pipeline_stage}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Deals Without Invoices */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">No Xero Invoice ({withoutInvoice.length})</h2>
          <p className="mt-1 text-sm text-gray-500">CRM deals without a linked Xero invoice — may need one</p>
        </div>
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">Deal</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">Amount</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Stage</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {withoutInvoice.map((d) => (
                  <tr key={d.id} className="border-b last:border-b-0 hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{d.title}</td>
                    <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs">{d.deal_type}</Badge></td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums">{d.amount_cents ? currency(d.amount_cents) : '—'}</td>
                    <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs">{d.pipeline_stage}</Badge></td>
                    <td className="px-4 py-2.5 text-xs text-gray-500 max-w-[250px] truncate">{d.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
