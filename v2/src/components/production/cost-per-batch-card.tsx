import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { stretchBedBOM, stretchBedCOGS, supplierQuotes } from '@/lib/data/supplier-quotes';
import type { SupplierActuals } from '@/lib/data/supplier-cost-actuals';

const INSTITUTIONAL_PRICE = 560;
const RETAIL_PRICE = 600;

type BatchSummary = {
  batch: string;
  bedCount: number;
  cogs: number;
  marginAtInstitutional: number;
};

type SupplierQuoteAlert = {
  supplier: string;
  component: string;
  unitPrice: number;
  expiresIn: number | null;
  status: 'active' | 'expired' | 'pending' | 'historical';
};

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const target = new Date(iso + 'T00:00:00').getTime();
  return Math.floor((target - Date.now()) / 86400000);
}

export function CostPerBatchCard({
  batches,
  actuals,
  bedsLifetime,
}: {
  batches: BatchSummary[];
  actuals?: SupplierActuals | null;
  bedsLifetime?: number;
}) {
  const totalCost = batches.reduce((s, b) => s + b.cogs, 0);
  const totalMargin = batches.reduce((s, b) => s + b.marginAtInstitutional, 0);
  const totalBeds = batches.reduce((s, b) => s + b.bedCount, 0);

  // Actual $/bed: total BOM-supplier spend / lifetime beds in register
  const actualSpend = actuals?.source === 'live' ? actuals.totalSpend : 0;
  const denom = bedsLifetime && bedsLifetime > 0 ? bedsLifetime : 0;
  const actualPerBed = denom > 0 ? actualSpend / denom : 0;
  const variancePct = stretchBedCOGS > 0 ? ((actualPerBed - stretchBedCOGS) / stretchBedCOGS) * 100 : 0;

  // Supplier quote signal: anything expiring within 60 days OR pending
  const quoteAlerts: SupplierQuoteAlert[] = supplierQuotes
    .map((q) => ({
      supplier: q.supplier,
      component: q.component,
      unitPrice: q.unitPrice,
      expiresIn: daysUntil(q.validUntil),
      status: q.status,
    }))
    .filter((q) => q.status === 'pending' || (q.expiresIn !== null && q.expiresIn <= 60))
    .sort((a, b) => (a.expiresIn ?? 9999) - (b.expiresIn ?? 9999));

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Cost Per Bed</h3>
            <p className="text-xs text-gray-500">
              Live BOM from <code>supplier-quotes.ts</code>. Anchors all margin maths and capital-stack assumptions.
            </p>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">COGS</div>
              <div className="text-2xl font-bold text-gray-900">${stretchBedCOGS.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Margin @ ${INSTITUTIONAL_PRICE}</div>
              <div className="text-2xl font-bold text-emerald-700">
                {Math.round(((INSTITUTIONAL_PRICE - stretchBedCOGS) / INSTITUTIONAL_PRICE) * 100)}%
              </div>
              <div className="text-xs text-gray-500">${(INSTITUTIONAL_PRICE - stretchBedCOGS).toFixed(2)} per bed</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Margin @ ${RETAIL_PRICE}</div>
              <div className="text-xl font-bold text-emerald-700">
                {Math.round(((RETAIL_PRICE - stretchBedCOGS) / RETAIL_PRICE) * 100)}%
              </div>
              <div className="text-xs text-gray-500">${(RETAIL_PRICE - stretchBedCOGS).toFixed(2)} per bed</div>
            </div>
          </div>
        </div>

        {/* BOM breakdown */}
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="py-2 px-3 font-medium">Component</th>
                <th className="py-2 px-3 font-medium">Supplier</th>
                <th className="py-2 px-3 font-medium text-right">Qty</th>
                <th className="py-2 px-3 font-medium text-right">Unit Cost</th>
                <th className="py-2 px-3 font-medium text-right">Per Bed</th>
                <th className="py-2 px-3 font-medium text-right">% of COGS</th>
              </tr>
            </thead>
            <tbody>
              {stretchBedBOM.map((item) => {
                const lineCost = item.qty * item.unitCost;
                const pct = (lineCost / stretchBedCOGS) * 100;
                return (
                  <tr key={item.component} className="border-b last:border-0">
                    <td className="py-2 px-3 font-medium">{item.component}</td>
                    <td className="py-2 px-3 text-xs text-gray-600">{item.supplier}</td>
                    <td className="py-2 px-3 text-right font-mono">{item.qty}</td>
                    <td className="py-2 px-3 text-right font-mono">${item.unitCost.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-mono">${lineCost.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-xs text-gray-500">{pct.toFixed(0)}%</td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-2 px-3" colSpan={4}>Total COGS per bed</td>
                <td className="py-2 px-3 text-right font-mono">${stretchBedCOGS.toFixed(2)}</td>
                <td className="py-2 px-3 text-right font-mono">100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actual cost vs canonical (from Xero ACCPAY) */}
        {actuals && actuals.source === 'live' && denom > 0 && (
          <div className="rounded-md border bg-gray-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Actual supplier spend (Xero ACCPAY, all-time)
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  ${actualSpend.toLocaleString('en-AU', { maximumFractionDigits: 0 })} across {actuals.invoiceCount} invoices · {denom.toLocaleString('en-AU')} beds in register
                  {actuals.earliestDate && actuals.latestDate && (
                    <> · {actuals.earliestDate} → {actuals.latestDate}</>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-gray-500">Actual $/bed</div>
                <div className="text-2xl font-bold text-gray-900">${actualPerBed.toFixed(2)}</div>
                <div className={`text-xs font-medium ${Math.abs(variancePct) < 20 ? 'text-gray-500' : variancePct > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {variancePct > 0 ? '+' : ''}{variancePct.toFixed(0)}% vs canonical ${stretchBedCOGS.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-3">
              {actuals.bySupplier.map((s) => (
                <div key={s.supplier} className="flex items-baseline justify-between rounded border bg-white px-2 py-1.5 text-xs">
                  <span className="truncate text-gray-700">{s.supplier}</span>
                  <span className="font-mono text-gray-900">${s.total.toLocaleString('en-AU', { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
              Actual includes BOM, freight, training, prototype iterations, and setup costs across the supplier accounts.
              Treat as a <strong>directional</strong> signal vs. the canonical $149.20 per-unit BOM. True per-batch COGS
              requires Xero line-items to carry a batch code.
            </p>
          </div>
        )}
        {actuals && actuals.source === 'unavailable' && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Actual supplier spend not loaded ({actuals.error || 'no data'}). Showing canonical BOM only.
          </div>
        )}

        {/* Supplier quote drift / alerts */}
        {quoteAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Supplier signals</div>
            <div className="flex flex-wrap gap-2">
              {quoteAlerts.map((a, i) => {
                const tone = a.status === 'pending'
                  ? 'border-blue-200 bg-blue-50 text-blue-800'
                  : a.expiresIn !== null && a.expiresIn < 30
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-amber-200 bg-amber-50 text-amber-800';
                const tag = a.status === 'pending'
                  ? 'pending quote'
                  : a.expiresIn !== null && a.expiresIn < 0
                    ? `expired ${Math.abs(a.expiresIn)}d ago`
                    : `expires in ${a.expiresIn}d`;
                return (
                  <span key={i} className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs ${tone}`}>
                    <span className="font-semibold">{a.supplier}</span>
                    <span className="text-gray-600">·</span>
                    <span>{a.component}</span>
                    <span className="text-gray-500">·</span>
                    <span>${a.unitPrice.toFixed(2)}</span>
                    <Badge variant="outline" className="text-[10px]">{tag}</Badge>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Batch view */}
        {batches.length > 0 && (
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Cost by Batch</div>
              <div className="text-xs text-gray-500">
                {totalBeds.toLocaleString()} beds · ${totalCost.toLocaleString('en-AU', { maximumFractionDigits: 0 })} COGS
                · ${totalMargin.toLocaleString('en-AU', { maximumFractionDigits: 0 })} potential margin
              </div>
            </div>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="py-2 px-3 font-medium">Batch</th>
                    <th className="py-2 px-3 font-medium text-right">Beds</th>
                    <th className="py-2 px-3 font-medium text-right">COGS @ ${stretchBedCOGS.toFixed(2)}/bed</th>
                    <th className="py-2 px-3 font-medium text-right">Margin @ ${INSTITUTIONAL_PRICE} sale</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => (
                    <tr key={b.batch} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-2 px-3 font-mono">GB0-{b.batch}</td>
                      <td className="py-2 px-3 text-right font-mono">{b.bedCount}</td>
                      <td className="py-2 px-3 text-right font-mono">${b.cogs.toLocaleString('en-AU', { maximumFractionDigits: 0 })}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-700">${b.marginAtInstitutional.toLocaleString('en-AU', { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type { BatchSummary };
