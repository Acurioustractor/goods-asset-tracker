import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { stretchBedBOM, stretchBedDirectMaterials, supplierQuotes, WEBSITE_PRICE } from '@/lib/data/supplier-quotes';
import { getFullyLoadedToday, getMarginalToday } from '@/lib/data/cost-model-scenarios';
import type { SupplierActuals } from '@/lib/data/supplier-cost-actuals';

// HONEST lead = the MARGINAL (cash) cost of one more bed today, Buy-Kit path —
// the same figure the cost-model explorer headlines ($684.79 = $534.79 direct
// + $150 long-haul freight). Contribution at the institutional price is positive
// against this. SSOT: cost-model-scenarios.ts.
const MARGINAL_PER_BED = getMarginalToday('state_2_defy_kits');
// Fully-loaded cost/bed at today's (~100/yr) volume, Buy-Kit path — DEMOTED to a
// labelled reference: it is fixed-cost absorption at pilot volume, NOT a marginal
// cost. It must not headline the card (matches the explorer's framing).
const FULLY_LOADED_PER_BED = getFullyLoadedToday('state_2_defy_kits');
const CONTRIBUTION_PER_BED = WEBSITE_PRICE - MARGINAL_PER_BED;

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

  // Actual $/bed: total BOM-supplier spend / lifetime Stretch beds in register.
  // This is a LOWER-BOUND directional signal (Defy + Goods-tagged steel only;
  // misses the Alice Springs canvas/steel chain invoiced in Notion), so we do
  // NOT compute a variance % against the fully-loaded cost — the bases aren't
  // comparable. We show it as a standalone directional figure only.
  const actualSpend = actuals?.source === 'live' ? actuals.totalSpend : 0;
  const denom = bedsLifetime && bedsLifetime > 0 ? bedsLifetime : 0;
  const actualPerBed = denom > 0 ? actualSpend / denom : 0;

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
            <h3 className="text-lg font-semibold">Stretch-Bed COGS</h3>
            <p className="text-xs text-gray-500">
              Leads with the <strong>marginal (cash) cost of one more bed</strong> — direct materials from{' '}
              <code>supplier-quotes.ts</code> + per-bed long-haul freight, Buy-Kit path, from the canonical
              cost model (<code>cost-model-scenarios.json</code>). This matches the cost-model explorer.
              The fully-loaded figure below is fixed-cost absorption at pilot volume (~100/yr), <strong>not</strong>{' '}
              the marginal cost — see the explorer for the breakeven story.
            </p>
          </div>
          <div className="flex gap-4 text-right">
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Direct materials</div>
              <div className="text-xl font-bold text-gray-700">${stretchBedDirectMaterials.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Marginal cost / bed</div>
              <div className="text-2xl font-bold text-gray-900">${MARGINAL_PER_BED.toLocaleString('en-AU')}</div>
              <div className="text-xs text-gray-500">Buy-Kit, cash cost of +1 bed</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Contribution @ ${WEBSITE_PRICE}</div>
              <div className={`text-2xl font-bold ${CONTRIBUTION_PER_BED >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {Math.round((CONTRIBUTION_PER_BED / WEBSITE_PRICE) * 100)}%
              </div>
              <div className="text-xs text-gray-500">${CONTRIBUTION_PER_BED.toLocaleString('en-AU')} per bed (price − marginal)</div>
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
                <th className="py-2 px-3 font-medium text-right">% of materials</th>
              </tr>
            </thead>
            <tbody>
              {stretchBedBOM.map((item) => {
                const lineCost = item.qty * item.unitCost;
                const pct = (lineCost / stretchBedDirectMaterials) * 100;
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
                <td className="py-2 px-3" colSpan={4}>Direct materials per bed</td>
                <td className="py-2 px-3 text-right font-mono">${stretchBedDirectMaterials.toFixed(2)}</td>
                <td className="py-2 px-3 text-right font-mono">100%</td>
              </tr>
              <tr className="bg-emerald-50 font-semibold">
                <td className="py-2 px-3" colSpan={4}>+ per-bed long-haul freight → <span className="text-emerald-800">marginal (cash) cost / bed</span></td>
                <td className="py-2 px-3 text-right font-mono text-emerald-800">${MARGINAL_PER_BED.toLocaleString('en-AU')}</td>
                <td className="py-2 px-3 text-right" />
              </tr>
              <tr className="border-t text-xs text-gray-400">
                <td className="py-2 px-3" colSpan={4}>
                  Reference only — + facility, founder &amp; admin overhead absorbed at pilot volume → fully-loaded @ ~100/yr
                  (<span className="italic">fixed-cost absorption, NOT the marginal cost</span>)
                </td>
                <td className="py-2 px-3 text-right font-mono">${FULLY_LOADED_PER_BED.toLocaleString('en-AU')}</td>
                <td className="py-2 px-3 text-right" />
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
                  ${actualSpend.toLocaleString('en-AU', { maximumFractionDigits: 0 })} across {actuals.invoiceCount} invoices · {denom.toLocaleString('en-AU')} Stretch beds in register
                  {actuals.earliestDate && actuals.latestDate && (
                    <> · {actuals.earliestDate} → {actuals.latestDate}</>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-gray-500">Actual $/bed</div>
                <div className="text-2xl font-bold text-gray-900">${actualPerBed.toFixed(2)}</div>
                <div className="text-xs font-medium text-gray-500">lower-bound · not comparable to fully-loaded</div>
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
              <strong>Directional only.</strong> Xero ACCPAY here is Defy + steel (Goods-tagged) and folds in freight,
              training, prototype and setup. It MISSES the Alice Springs canvas &amp; steel supply chain (invoiced in
              Notion, not the Xero mirror), so it is a LOWER BOUND on real per-bed supplier spend. Reconciled 2026-05-28 — see
              <code> wiki/outputs/2026-05-28-bed-cogs-xero-reconciliation.md</code>.
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
                    <th className="py-2 px-3 font-medium text-right">Marginal COGS @ ${MARGINAL_PER_BED.toLocaleString('en-AU')}/bed</th>
                    <th className="py-2 px-3 font-medium text-right">Contribution @ ${WEBSITE_PRICE} sale</th>
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
