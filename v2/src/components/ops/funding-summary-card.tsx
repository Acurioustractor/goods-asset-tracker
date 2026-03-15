import { Card, CardContent } from '@/components/ui/card';
import type { FundingSummary } from '@/app/admin/ops/actions';

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function FundingSummaryCard({ data }: { data: FundingSummary }) {
  const totalFunding = data.tradeRevenue + data.totalInvestment;
  const selfSufficiency = totalFunding > 0 ? (data.tradeRevenue / totalFunding) * 100 : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Funding & Revenue</h3>

        <div className="grid grid-cols-2 gap-6">
          {/* Trade Revenue */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Trade Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(data.tradeRevenue)}</p>
            <p className="text-xs text-gray-400">all time</p>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">This month</span>
                <span className="font-medium tabular-nums">{data.ordersThisMonth} orders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg order</span>
                <span className="font-medium tabular-nums">{formatCurrency(data.avgOrderValue)}</span>
              </div>
            </div>
          </div>

          {/* Philanthropic */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Philanthropic & Grants</p>
            <p className="text-2xl font-bold">{formatCurrency(data.totalInvestment)}</p>
            <p className="text-xs text-gray-400">total investment to date</p>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Partner contributions</span>
                <span className="font-medium tabular-nums">{formatCurrency(data.partnerContributions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sponsored beds</span>
                <span className="font-medium tabular-nums">{data.partnerSponsoredBeds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plant investment</span>
                <span className="font-medium tabular-nums">{formatCurrency(data.productionPlantInvestment)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Combined view */}
        <div className="mt-5 pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Funding</span>
            <span className="font-bold">{formatCurrency(totalFunding)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Self-sufficiency</span>
            <span className="font-medium tabular-nums">{selfSufficiency.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Cost per bed</span>
            <span className="font-medium tabular-nums">${data.costPerBed}</span>
          </div>
        </div>

        {/* Partners */}
        {data.partners.length > 0 && (
          <div className="mt-5 pt-4 border-t">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Active Partners</p>
            <div className="space-y-1">
              {data.partners.map((p) => (
                <div key={p.name} className="flex justify-between text-sm">
                  <span className="text-gray-700">{p.name}</span>
                  <span className="text-gray-500 tabular-nums">
                    {p.contribution > 0 && formatCurrency(p.contribution)}
                    {p.contribution > 0 && p.beds > 0 && ' · '}
                    {p.beds > 0 && `${p.beds} beds`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent orders */}
        {data.recentOrders.length > 0 && (
          <div className="mt-5 pt-4 border-t">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Recent Orders</p>
            <div className="space-y-1">
              {data.recentOrders.map((o) => (
                <div key={o.id} className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    {new Date(o.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="font-medium tabular-nums">{formatCurrency(o.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
