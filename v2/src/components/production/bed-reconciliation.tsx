'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  Package,
  Truck,
  Home,
  Eye,
  Warehouse,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Factory,
  HelpCircle,
} from 'lucide-react';

export interface ProductBreakdown {
  product: string;
  deployed: number;
  demo: number;
  allocated: number;
  requested: number;
  retired: number;
  total: number;
}

export interface AssetSummary {
  deployed: number;
  demo: number;
  allocated: number;
  requested: number;
  retired: number;
  inTransit: number;
  inProduction: number; // beds being manufactured (e.g. by Defy)
  total: number;
  byCommunity: { community: string; count: number }[];
  byProduct: ProductBreakdown[];
}

export interface DemandSummary {
  won: { count: number; units: number };
  negotiation: { count: number; units: number };
  proposal: { count: number; units: number };
  qualified: { count: number; units: number };
  lead: { count: number; units: number };
  totalUnits: number;
  totalDeals: number;
}

export interface ReconciliationData {
  assets: AssetSummary;
  demand: DemandSummary;
  bedsPossible: number;
  rawPlasticKg: number;
}

function formatNum(n: number): string {
  return n.toLocaleString('en-AU');
}

export function BedReconciliation({ data }: { data: ReconciliationData }) {
  const { assets, demand, bedsPossible, rawPlasticKg } = data;

  // Where beds are now
  const accounted = assets.deployed + assets.demo + assets.allocated + assets.inTransit + assets.inProduction;
  const totalTracked = accounted + assets.retired;

  // Demand pipeline
  const committedUnits = demand.won.units;
  const activeUnits = demand.negotiation.units + demand.proposal.units;
  const pipelineUnits = demand.qualified.units + demand.lead.units;
  const totalDemand = committedUnits + activeUnits;

  // Gap
  const gap = totalDemand - bedsPossible;
  const plasticForGap = gap > 0 ? gap * 20 : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-1">Bed Reconciliation</h3>
        <p className="text-xs text-gray-400 mb-5">Full picture across all systems — assets, deals, inventory</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Where beds are */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" /> Where Beds Are
            </h4>
            <div className="space-y-2">
              <ReconcRow icon={Home} label="Deployed in communities" value={assets.deployed} color="text-green-600" />
              {assets.inProduction > 0 && (
                <ReconcRow icon={Factory} label="Being manufactured (Defy)" value={assets.inProduction} color="text-blue-600" />
              )}
              <ReconcRow icon={Truck} label="In transit" value={assets.inTransit} color="text-blue-600" />
              <ReconcRow icon={Eye} label="Demo / display" value={assets.demo} color="text-purple-600" />
              <ReconcRow icon={Warehouse} label="Allocated (awaiting delivery)" value={assets.allocated} color="text-amber-600" />
              <ReconcRow icon={AlertTriangle} label="Requested (not allocated)" value={assets.requested} color="text-orange-600" />
              {assets.retired > 0 && (
                <ReconcRow icon={HelpCircle} label="Retired / damaged" value={assets.retired} color="text-gray-400" />
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total tracked</span>
                  <span className="text-lg font-bold text-gray-900">{formatNum(totalTracked)}</span>
                </div>
              </div>
            </div>

            {/* By product type */}
            {assets.byProduct.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">By product</p>
                <div className="space-y-1">
                  {assets.byProduct.map(p => (
                    <div key={p.product} className="flex justify-between text-xs">
                      <span className="text-gray-600">{p.product}</span>
                      <span className="font-medium text-gray-900 tabular-nums">
                        {p.total} <span className="text-gray-400">({p.deployed} deployed)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top communities */}
            {assets.byCommunity.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">Top communities</p>
                <div className="space-y-1">
                  {assets.byCommunity.slice(0, 6).map(c => (
                    <div key={c.community} className="flex justify-between text-xs">
                      <span className="text-gray-600">{c.community}</span>
                      <span className="font-medium text-gray-900 tabular-nums">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Demand pipeline */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Outstanding Demand
            </h4>
            <div className="space-y-2">
              <DemandRow
                label="Committed (won)"
                deals={demand.won.count}
                units={demand.won.units}
                color="bg-green-100 text-green-700"
              />
              <DemandRow
                label="In negotiation"
                deals={demand.negotiation.count}
                units={demand.negotiation.units}
                color="bg-purple-100 text-purple-700"
              />
              <DemandRow
                label="Proposal"
                deals={demand.proposal.count}
                units={demand.proposal.units}
                color="bg-amber-100 text-amber-700"
              />
              <DemandRow
                label="Qualified interest"
                deals={demand.qualified.count}
                units={demand.qualified.units}
                color="bg-blue-100 text-blue-700"
              />
              <DemandRow
                label="Early leads"
                deals={demand.lead.count}
                units={demand.lead.units}
                color="bg-gray-100 text-gray-600"
              />
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total demand</span>
                  <span className="text-lg font-bold text-gray-900">{formatNum(demand.totalUnits)} beds</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  across {demand.totalDeals} deals
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Can we fulfil? */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Factory className="h-3.5 w-3.5" /> Can We Fulfil?
            </h4>

            <div className="space-y-3">
              {/* Committed + active vs stock */}
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500 mb-2">Need to deliver (committed + active)</p>
                <p className="text-2xl font-bold text-gray-900">{formatNum(totalDemand)} beds</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500 mb-2">Can make from current stock</p>
                <p className="text-2xl font-bold text-gray-900">{formatNum(bedsPossible)} beds</p>
                <p className="text-xs text-gray-400">{formatNum(rawPlasticKg)}kg raw plastic on hand</p>
              </div>

              <div className={`rounded-lg p-3 ${gap > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center gap-2">
                  {gap > 0
                    ? <AlertTriangle className="h-4 w-4 text-red-600" />
                    : <CheckCircle className="h-4 w-4 text-green-600" />
                  }
                  <div>
                    <p className={`text-sm font-semibold ${gap > 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {gap > 0 ? `Gap: ${formatNum(gap)} beds` : `Surplus: ${formatNum(Math.abs(gap))} beds`}
                    </p>
                    {gap > 0 && (
                      <p className="text-xs text-red-600 mt-0.5">
                        Need ~{formatNum(plasticForGap)}kg more plastic
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pipeline (not yet committed) */}
              {pipelineUnits > 0 && (
                <div className="rounded-lg bg-blue-50/50 p-3 border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium">
                    + {formatNum(pipelineUnits)} beds in early pipeline
                  </p>
                  <p className="text-xs text-blue-400">
                    Qualified + leads — not yet committed
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReconcRow({ icon: Icon, label, value, color }: {
  icon: typeof Package; label: string; value: number; color: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900 tabular-nums">{formatNum(value)}</span>
    </div>
  );
}

function DemandRow({ label, deals, units, color }: {
  label: string; deals: number; units: number; color: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${color}`}>
          {deals}
        </span>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900 tabular-nums">
        {units > 0 ? `${formatNum(units)} beds` : '—'}
      </span>
    </div>
  );
}
