/**
 * Cost-model scenarios card v4 — Notion BK 4-path supply model + Idiot Index
 * + founder allocation + fundraising offset. Mounted on /admin/production
 * below the CostPerBatchCard. Source data: `cost-model-scenarios.json`
 * reconciles against `supplier-quotes.ts` (canonical BOM).
 */
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  listBuildStates,
  getIdiotIndex,
  getOverheadPerVolume,
  getFullyLoadedGrid,
  getMarginGridAt750,
  getFounderAllocation,
  getFundraisingOffset,
  getCanonicalBOM,
  reconcileAgainstCanonicalBOM,
  fmtMoney,
} from '@/lib/data/cost-model-scenarios';

const BUILD_STATE_BADGES: Record<string, string> = {
  state_1_defy_fully_fabricated: 'bg-gray-100 text-gray-800 border-gray-300',
  state_2_defy_kits: 'bg-blue-50 text-blue-700 border-blue-300',
  state_3_defy_panels: 'bg-amber-50 text-amber-700 border-amber-300',
  state_4_factory: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  state_5_community: 'bg-purple-50 text-purple-700 border-purple-300',
};

function idiotIndexClass(indexHigh: number): string {
  if (indexHigh >= 5) return 'text-red-700 font-semibold';
  if (indexHigh >= 3) return 'text-orange-600 font-semibold';
  if (indexHigh >= 2) return 'text-blue-700';
  return 'text-gray-600';
}

function allocationClass(target: string): string {
  if (target === 'bed-overhead') return 'bg-red-50 text-red-700 border-red-300';
  if (target === 'funding-side-offset') return 'bg-emerald-50 text-emerald-700 border-emerald-300';
  return 'bg-gray-100 text-gray-700 border-gray-300';
}

export function CostModelScenariosCard() {
  const buildStates = listBuildStates();
  const idiotIndex = getIdiotIndex();
  const overhead = getOverheadPerVolume();
  const fullyLoaded = getFullyLoadedGrid();
  const margin = getMarginGridAt750();
  const founderAllocation = getFounderAllocation();
  const fundraisingOffset = getFundraisingOffset();
  const canonicalBOM = getCanonicalBOM();
  const reconciliation = reconcileAgainstCanonicalBOM();

  const totalFounderDays = founderAllocation.split.reduce((sum, s) => sum + s.days, 0);
  const totalFounderCost = totalFounderDays * founderAllocation.rate_per_day;

  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Cost model v6 — 4-path supply model (Notion BK locked)</h3>
          <p className="text-xs text-gray-500 mt-1">
            Verified from Defy invoice OCR + Notion BK review (Ben + BK, 2026-05-28). Reconciled against{' '}
            <code>supplier-quotes.ts</code>. Numbers read live from the canonical data:{' '}
            {fmtMoney(canonicalBOM.canvas.amount)} canvas, {fmtMoney(canonicalBOM.steel_poles.amount)} steel,{' '}
            {fmtMoney(canonicalBOM.hdpe_kit_defy.amount)} Defy kit ({fmtMoney(canonicalBOM.defy_kit_direct_total)} direct
            materials), {fmtMoney(reconciliation.canonicalFactoryMaterials)} factory-path direct.
          </p>
          {!reconciliation.matches && (
            <div className="mt-2 inline-flex items-center gap-2 rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800">
              ⚠ Drift: Factory direct {fmtMoney(reconciliation.factoryTotal)} vs canonical{' '}
              {fmtMoney(reconciliation.canonicalFactoryMaterials)} — keep these aligned with supplier-quotes.ts.
            </div>
          )}
        </div>

        {/* Margin at $750 retail */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Margin at $750 retail — 4 supply paths</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="pb-2 font-medium">Path</th>
                  <th className="pb-2 font-medium text-right">Direct cost</th>
                  <th className="pb-2 font-medium text-right">Margin</th>
                  <th className="pb-2 font-medium text-right">Margin %</th>
                </tr>
              </thead>
              <tbody>
                {margin.map((row) => {
                  const isFactory = row.path.startsWith('Factory');
                  const isCommunity = row.path.startsWith('Community');
                  return (
                    <tr
                      key={row.path}
                      className={`border-b last:border-0 ${isFactory ? 'bg-emerald-50/40' : ''} ${
                        isCommunity ? 'bg-purple-50/40' : ''
                      }`}
                    >
                      <td className="py-2 font-medium">{row.path}</td>
                      <td className="py-2 text-right tabular-nums">{fmtMoney(row.direct)}</td>
                      <td className="py-2 text-right tabular-nums font-medium">{fmtMoney(row.margin)}</td>
                      <td className="py-2 text-right tabular-nums">{row.margin_pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Factory path is the in-house target. 63% margin at $750 vs 28% on Defy kits = $260/bed saved when we own the
            press + CNC.
          </p>
        </div>

        {/* Fully-loaded by volume */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Fully-loaded $/bed by volume (incl. overhead + freight + founder time)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="pb-2 font-medium">Volume</th>
                  <th className="pb-2 font-medium text-right">Defy Kits</th>
                  <th className="pb-2 font-medium text-right">Defy Panels</th>
                  <th className="pb-2 font-medium text-right">Factory</th>
                  <th className="pb-2 font-medium text-right">Community</th>
                </tr>
              </thead>
              <tbody>
                {fullyLoaded.map((row, i) => (
                  <tr key={row.volume_label} className={`border-b last:border-0 ${i === 2 ? 'bg-emerald-50/30' : ''}`}>
                    <td className="py-2 font-medium">{row.volume_label}</td>
                    <td className="py-2 text-right tabular-nums">{fmtMoney(row.state_2_defy_kits)}</td>
                    <td className="py-2 text-right tabular-nums">{fmtMoney(row.state_3_defy_panels)}</td>
                    <td className="py-2 text-right tabular-nums font-medium text-emerald-700">
                      {fmtMoney(row.state_4_factory)}
                    </td>
                    <td className="py-2 text-right tabular-nums font-medium text-purple-700">
                      {fmtMoney(row.state_5_community)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Commercial counterfactual: $1,500–$2,000. Factory @ 1,000/yr ($465/bed) is{' '}
            <strong>2.5–4× better cost than commercial</strong>. Today (100/yr) is competitive at the high end of the
            commercial band.
          </p>
        </div>

        {/* Build states grid */}
        <div>
          <h4 className="text-sm font-semibold mb-3">5 supply states — component cost lines</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {buildStates.map((state) => (
              <div key={state.key} className="border rounded p-3 text-sm">
                <Badge variant="outline" className={BUILD_STATE_BADGES[state.key]}>
                  {state.label.split('(')[0].trim().slice(0, 28)}
                </Badge>
                <div className="mt-2 text-lg font-semibold tabular-nums">{fmtMoney(state.direct_total)}</div>
                <div className="mt-1 text-xs text-gray-500">direct cost / bed</div>
                {state.throughput_beds_per_day && (
                  <div className="mt-1 text-xs text-gray-600">{state.throughput_beds_per_day} beds/day throughput</div>
                )}
                <div className="mt-3 text-xs space-y-1">
                  {state.components.map((c) => (
                    <div key={c.label} className="flex justify-between gap-2">
                      <span className="text-gray-600 truncate" title={c.label}>
                        {c.label}
                      </span>
                      <span className="tabular-nums text-gray-800">{fmtMoney(c.amount)}</span>
                    </div>
                  ))}
                </div>
                {state.capital_added > 0 && (
                  <div className="mt-3 pt-2 border-t text-xs text-gray-500">
                    + {fmtMoney(state.capital_added)} capex (cumul. {fmtMoney(state.capital_cumulative)})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Idiot Index */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Idiot Index — markup per element</h4>
          <p className="text-xs text-gray-500 mb-3">
            Ratio of what we pay over the raw-material cost. Biggest ratios = biggest in-house cost-reduction
            opportunities.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="pb-2 font-medium">Element</th>
                  <th className="pb-2 font-medium text-right">Raw</th>
                  <th className="pb-2 font-medium text-right">We pay</th>
                  <th className="pb-2 font-medium text-right">Index</th>
                  <th className="pb-2 font-medium">Markup pays for</th>
                </tr>
              </thead>
              <tbody>
                {idiotIndex.map((row) => {
                  const rawDisplay =
                    row.raw_low === row.raw_high
                      ? fmtMoney(row.raw_low)
                      : `${fmtMoney(row.raw_low)}–${fmtMoney(row.raw_high)}`;
                  const indexDisplay =
                    row.index_low === row.index_high
                      ? `${row.index_low.toFixed(1)}×`
                      : `${row.index_low.toFixed(1)}–${row.index_high.toFixed(1)}×`;
                  return (
                    <tr key={row.element} className="border-b last:border-0">
                      <td className="py-2 font-medium">{row.element}</td>
                      <td className="py-2 text-right tabular-nums text-gray-600">{rawDisplay}</td>
                      <td className="py-2 text-right tabular-nums">{fmtMoney(row.current)}</td>
                      <td className={`py-2 text-right tabular-nums ${idiotIndexClass(row.index_high)}`}>
                        {indexDisplay}
                      </td>
                      <td className="py-2 text-xs text-gray-600">{row.markup_pays_for}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overhead breakdown by volume */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Overhead per bed by annual volume</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="pb-2 font-medium">Volume</th>
                  <th className="pb-2 font-medium text-right">Kirmos (50%)</th>
                  <th className="pb-2 font-medium text-right">Founder (30d prod)</th>
                  <th className="pb-2 font-medium text-right">Admin</th>
                  <th className="pb-2 font-medium text-right">Field travel</th>
                  <th className="pb-2 font-medium text-right">Freight</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {overhead.map((row) => (
                  <tr key={row.label} className="border-b last:border-0">
                    <td className="py-2 font-medium">{row.label}</td>
                    <td className="py-2 text-right tabular-nums">{fmtMoney(row.kirmos_per_bed)}</td>
                    <td className="py-2 text-right tabular-nums">{fmtMoney(row.founder_production_per_bed)}</td>
                    <td className="py-2 text-right tabular-nums">{fmtMoney(row.admin_per_bed)}</td>
                    <td className="py-2 text-right tabular-nums">{fmtMoney(row.field_travel_per_bed)}</td>
                    <td className="py-2 text-right tabular-nums">{fmtMoney(row.long_haul_freight_per_bed)}</td>
                    <td className="py-2 text-right tabular-nums font-medium">{fmtMoney(row.overhead_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Founder allocation + Fundraising offset */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">Founder time — properly allocated</h4>
            <p className="text-xs text-gray-500 mb-3">
              {totalFounderDays} days × ${founderAllocation.rate_per_day}/day = {fmtMoney(totalFounderCost)} modelled.
              Only production-related days go on beds.
            </p>
            <div className="space-y-2">
              {founderAllocation.split.map((entry) => (
                <div key={entry.label} className="border rounded p-3 text-sm">
                  <div className="flex justify-between items-start gap-2">
                    <div className="text-xs text-gray-700 flex-1">{entry.label}</div>
                    <Badge variant="outline" className={allocationClass(entry.allocate_to)}>
                      {entry.allocate_to.replaceAll('-', ' ')}
                    </Badge>
                  </div>
                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-500">{entry.days} days × ${founderAllocation.rate_per_day}/day</span>
                    <span className="tabular-nums font-medium">{fmtMoney(entry.annual_cost)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Fundraising offset</h4>
            <p className="text-xs text-gray-500 mb-3">
              Fundraising founder-days are an investment — dollars raised subsidise bed cost.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="border rounded p-3">
                <div className="text-xs text-gray-500">Philanthropy</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">
                  {fmtMoney(fundraisingOffset.philanthropy_annual_estimate)}
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  {fundraisingOffset.philanthropy_days_per_year} founder-days/yr × ~$5K/day
                </div>
              </div>
              <div className="border rounded p-3">
                <div className="text-xs text-gray-500">Commercial buyer</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">
                  {fmtMoney(fundraisingOffset.commercial_buyer_benchmark_per_bed)} / bed
                </div>
                <div className="mt-1 text-xs text-gray-600">{fundraisingOffset.commercial_buyer_source}</div>
              </div>
              <div className="border rounded p-3 border-emerald-300 bg-emerald-50">
                <div className="text-xs text-emerald-700">Subsidy @ 100/yr</div>
                <div className="mt-1 text-lg font-semibold tabular-nums text-emerald-700">
                  {fmtMoney(fundraisingOffset._per_bed_subsidy_at_100_per_year)} / bed
                </div>
              </div>
              <div className="border rounded p-3 border-emerald-300 bg-emerald-50">
                <div className="text-xs text-emerald-700">Subsidy @ 500/yr</div>
                <div className="mt-1 text-lg font-semibold tabular-nums text-emerald-700">
                  {fmtMoney(fundraisingOffset._per_bed_subsidy_at_500_per_year)} / bed
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-4 border-t">
          Open questions for Defy: volume-quote sheet (100/500/1000/5000 beds/yr); build-to-supply with our steel +
          canvas; in-house assembly payback volume; INV-1731 freight confirmation. Source:{' '}
          <code>v2/src/lib/data/cost-model-scenarios.json</code> · canonical BOM in{' '}
          <code>supplier-quotes.ts</code>.
        </p>
      </CardContent>
    </Card>
  );
}
