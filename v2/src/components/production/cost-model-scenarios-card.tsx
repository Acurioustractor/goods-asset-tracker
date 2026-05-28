/**
 * Cost-model scenarios card: 5 build-states × 3 volume scenarios + Idiot
 * Index + founder allocation + fundraising offset. Mounted on the
 * /admin/production page below the CostPerBatchCard. Source data lives in
 * `lib/data/cost-model-scenarios.{ts,json}` and reconciles against the
 * canonical BOM in `lib/data/supplier-quotes.ts`.
 */
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  listBuildStates,
  getIdiotIndex,
  getVolumeScenarios,
  getFounderAllocation,
  getFundraisingOffset,
  reconcileAgainstCanonicalBOM,
  fmtMoney,
} from '@/lib/data/cost-model-scenarios';

const BUILD_STATE_BADGES: Record<string, string> = {
  state_1_defy_everything: 'bg-gray-100 text-gray-800 border-gray-300',
  state_2_buy_kit_assemble: 'bg-blue-50 text-blue-700 border-blue-300',
  state_3_buy_sheets_cut_assemble: 'bg-amber-50 text-amber-700 border-amber-300',
  state_4_all_in_house: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  state_5_community_plastic: 'bg-purple-50 text-purple-700 border-purple-300',
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
  const volumeScenarios = getVolumeScenarios();
  const founderAllocation = getFounderAllocation();
  const fundraisingOffset = getFundraisingOffset();
  const reconciliation = reconcileAgainstCanonicalBOM();

  const totalFounderDays = founderAllocation.split.reduce((sum, s) => sum + s.days, 0);
  const totalFounderCost = totalFounderDays * founderAllocation.rate_per_day;

  return (
    <Card>
      <CardContent className="pt-6 space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Cost model — scenarios, Idiot Index, founder allocation</h3>
          <p className="text-xs text-gray-500 mt-1">
            Verified from Defy invoice OCR (act-infra <code>scripts/ocr-defy-bills.mjs</code>). Reconciled against the
            canonical BOM in <code>supplier-quotes.ts</code>. Numbers reflect verified Defy quote rates as of 2026-05-28.
          </p>
          {!reconciliation.matches && (
            <div className="mt-2 inline-flex items-center gap-2 rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-800">
              ⚠ Drift: State-1 total {fmtMoney(reconciliation.state1Total)} vs canonical {fmtMoney(reconciliation.canonicalFullyLoaded)} — keep these aligned.
            </div>
          )}
        </div>

        {/* Volume scenarios */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Volume scenarios — today → target → vision</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="pb-2 font-medium">Scenario</th>
                  <th className="pb-2 font-medium text-right">Direct (S1)</th>
                  <th className="pb-2 font-medium text-right">Direct (S4)</th>
                  <th className="pb-2 font-medium text-right">Direct (S5)</th>
                  <th className="pb-2 font-medium text-right">Founder</th>
                  <th className="pb-2 font-medium text-right">Admin</th>
                  <th className="pb-2 font-medium text-right">Field</th>
                  <th className="pb-2 font-medium text-right">Freight</th>
                  <th className="pb-2 font-medium text-right">Full S1</th>
                  <th className="pb-2 font-medium text-right">Full S4</th>
                  <th className="pb-2 font-medium text-right">Full S5</th>
                </tr>
              </thead>
              <tbody>
                {volumeScenarios.map((vs, i) => {
                  const s1 = buildStates.find((b) => b.key === 'state_1_defy_everything')!.direct_total;
                  const s4 = buildStates.find((b) => b.key === 'state_4_all_in_house')!.direct_total;
                  const s5 = buildStates.find((b) => b.key === 'state_5_community_plastic')!.direct_total;
                  return (
                    <tr key={vs.label} className={`border-b last:border-0 ${i === 1 ? 'bg-emerald-50/40' : ''}`}>
                      <td className="py-2 font-medium">{vs.label}</td>
                      <td className="py-2 text-right tabular-nums">{fmtMoney(s1)}</td>
                      <td className="py-2 text-right tabular-nums">{fmtMoney(s4)}</td>
                      <td className="py-2 text-right tabular-nums">{fmtMoney(s5)}</td>
                      <td className="py-2 text-right tabular-nums">{fmtMoney(vs.production_founder_per_bed)}</td>
                      <td className="py-2 text-right tabular-nums">{fmtMoney(vs.admin_per_bed)}</td>
                      <td className="py-2 text-right tabular-nums">{fmtMoney(vs.field_travel_per_bed)}</td>
                      <td className="py-2 text-right tabular-nums">{fmtMoney(vs.freight_per_bed)}</td>
                      <td className="py-2 text-right tabular-nums font-medium">{fmtMoney(vs.fully_loaded_state_1)}</td>
                      <td className="py-2 text-right tabular-nums font-medium text-emerald-700">{fmtMoney(vs.fully_loaded_state_4)}</td>
                      <td className="py-2 text-right tabular-nums font-medium text-purple-700">{fmtMoney(vs.fully_loaded_state_5)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Counterfactual commercial steel-frame bed AU 2026: $1,500–$2,000. S1 today already competitive at volume; S4 at 500/yr beats commercial by 2–3×.
          </p>
        </div>

        {/* Build states */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Build states — Defy-everything → community-plastic in-house</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {buildStates.map((state) => (
              <div key={state.key} className="border rounded p-3 text-sm">
                <Badge variant="outline" className={BUILD_STATE_BADGES[state.key]}>
                  {state.label.split('(')[0].trim().slice(0, 30)}
                </Badge>
                <div className="mt-2 text-lg font-semibold tabular-nums">{fmtMoney(state.direct_total)}</div>
                <div className="mt-1 text-xs text-gray-500">direct cost / bed</div>
                <div className="mt-3 text-xs space-y-1">
                  {state.components.map((c) => (
                    <div key={c.label} className="flex justify-between gap-2">
                      <span className="text-gray-600 truncate" title={c.label}>{c.label}</span>
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
          <h4 className="text-sm font-semibold mb-3">Idiot Index — where Defy's markup actually is</h4>
          <p className="text-xs text-gray-500 mb-3">
            Ratio of what we pay over the raw-material cost. Biggest ratios = biggest in-house opportunities.
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
                      <td className={`py-2 text-right tabular-nums ${idiotIndexClass(row.index_high)}`}>{indexDisplay}</td>
                      <td className="py-2 text-xs text-gray-600">{row.markup_pays_for}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Founder allocation + Fundraising offset */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">Founder time — properly allocated</h4>
            <p className="text-xs text-gray-500 mb-3">
              {totalFounderDays} days × ${founderAllocation.rate_per_day}/day = {fmtMoney(totalFounderCost)} modelled. Only production-related days go on beds.
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
              Every $1 raised funds a bed PLUS capex toward the in-house target.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="border rounded p-3">
                <div className="text-xs text-gray-500">Philanthropy</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">{fmtMoney(fundraisingOffset.philanthropy_annual_estimate)}</div>
                <div className="mt-1 text-xs text-gray-600">{fundraisingOffset.philanthropy_days_per_year} founder-days/yr × ~$5K/day</div>
              </div>
              <div className="border rounded p-3">
                <div className="text-xs text-gray-500">Commercial buyer</div>
                <div className="mt-1 text-lg font-semibold tabular-nums">{fmtMoney(fundraisingOffset.commercial_buyer_benchmark_per_bed)} / bed</div>
                <div className="mt-1 text-xs text-gray-600">{fundraisingOffset.commercial_buyer_source}</div>
              </div>
              <div className="border rounded p-3 border-emerald-300 bg-emerald-50">
                <div className="text-xs text-emerald-700">Subsidy @ 100/yr</div>
                <div className="mt-1 text-lg font-semibold tabular-nums text-emerald-700">{fmtMoney(fundraisingOffset._per_bed_subsidy_at_100_per_year)} / bed</div>
              </div>
              <div className="border rounded p-3 border-emerald-300 bg-emerald-50">
                <div className="text-xs text-emerald-700">Subsidy @ 500/yr</div>
                <div className="mt-1 text-lg font-semibold tabular-nums text-emerald-700">{fmtMoney(fundraisingOffset._per_bed_subsidy_at_500_per_year)} / bed</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-4 border-t">
          Open questions for Defy: volume-quote sheet (100/500/1000/5000 beds/yr); build-to-supply pricing if ACT sources steel + canvas direct; in-house assembly payback volume; sheets/bed confirmation (currently 20kg HDPE/bed locked).
          Source: <code>act-infra/thoughts/shared/analysis/2026-05-28-goods-bed-cost-model-v3.json</code>
        </p>
      </CardContent>
    </Card>
  );
}
