import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createServiceClient } from '@/lib/supabase/server';
import { getFundingSummary, getDeploymentTotals, financialSnapshot, deployments } from '@/lib/data/compendium';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = createServiceClient();
  const fundingSummary = getFundingSummary();
  const depTotals = getDeploymentTotals();

  // Fetch live data in parallel
  const [wonRes, activeRes, assetsRes, inventoryRes] = await Promise.all([
    supabase
      .from('crm_deals')
      .select('title, amount_cents, deal_type, pipeline_stage, units, notes')
      .eq('pipeline_stage', 'won')
      .order('amount_cents', { ascending: false }),
    supabase
      .from('crm_deals')
      .select('title, amount_cents, deal_type, pipeline_stage, units, notes, updated_at')
      .neq('pipeline_stage', 'won')
      .neq('pipeline_stage', 'lost')
      .order('amount_cents', { ascending: false }),
    supabase
      .from('assets')
      .select('status, quantity, community')
      .ilike('product', '%bed%'),
    supabase
      .from('production_inventory')
      .select('beds_possible, raw_plastic_kg, snapshot_date')
      .order('snapshot_date', { ascending: false })
      .limit(1),
  ]);

  const wonDeals = wonRes.data || [];
  const activeDeals = activeRes.data || [];
  const assets = assetsRes.data || [];
  const latestInventory = inventoryRes.data?.[0] || null;

  // Compute metrics
  const totalFundingWon = wonDeals.filter(d => d.deal_type === 'funding').reduce((s, d) => s + (d.amount_cents || 0), 0);
  const totalSalesWon = wonDeals.filter(d => d.deal_type === 'sale').reduce((s, d) => s + (d.amount_cents || 0), 0);
  const totalUnitsWon = wonDeals.filter(d => d.deal_type === 'sale').reduce((s, d) => s + (d.units || 0), 0);
  const activePipelineValue = activeDeals.reduce((s, d) => s + (d.amount_cents || 0), 0);

  // Status breakdown from deals
  const paidDeals = wonDeals.filter(d => (d.notes || '').toUpperCase().includes('PAID'));
  const overdueDeals = wonDeals.filter(d => (d.notes || '').toUpperCase().includes('OVERDUE'));
  const awaitingDeals = wonDeals.filter(d => (d.notes || '').toUpperCase().includes('AUTHORISED') && !(d.notes || '').toUpperCase().includes('PAID'));
  const overdueTotal = overdueDeals.reduce((s, d) => s + (d.amount_cents || 0), 0);
  const paidTotal = paidDeals.reduce((s, d) => s + (d.amount_cents || 0), 0);

  // Asset counts
  const bedsDeployed = assets.filter(a => a.status === 'deployed').reduce((s, a) => s + (a.quantity || 1), 0);
  const bedsInPipeline = assets.filter(a => a.status === 'requested' || a.status === 'allocated').reduce((s, a) => s + (a.quantity || 1), 0);

  // Community breakdown
  const communityMap = new Map<string, number>();
  for (const a of assets.filter(a => a.status === 'deployed')) {
    if (a.community) communityMap.set(a.community, (communityMap.get(a.community) || 0) + (a.quantity || 1));
  }
  const topCommunities = [...communityMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Urgent items
  const urgentItems: { label: string; detail: string; color: string; href: string }[] = [];

  for (const d of overdueDeals) {
    urgentItems.push({
      label: d.title,
      detail: `$${((d.amount_cents || 0) / 100).toLocaleString('en-AU', { maximumFractionDigits: 0 })} OVERDUE`,
      color: 'bg-red-100 text-red-800 border-red-200',
      href: '/admin/strategy',
    });
  }

  for (const d of awaitingDeals) {
    urgentItems.push({
      label: d.title,
      detail: `$${((d.amount_cents || 0) / 100).toLocaleString('en-AU', { maximumFractionDigits: 0 })} awaiting payment`,
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      href: '/admin/strategy',
    });
  }

  // Top active deals (biggest pipeline items)
  const topDeals = activeDeals.filter(d => d.amount_cents > 0).slice(0, 5);

  const fmtK = (cents: number) => {
    const val = cents / 100;
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Command Center</h1>
        <p className="text-gray-500 mt-1">
          Goods on Country — live operational overview
        </p>
      </div>

      {/* Row 1: Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Revenue</div>
            <div className="text-2xl font-bold mt-1">${(financialSnapshot.tradeRevenue / 1000).toFixed(0)}K</div>
            <div className="text-xs text-green-600 mt-1">Xero-verified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Funding Won</div>
            <div className="text-2xl font-bold mt-1">{fmtK(totalFundingWon)}</div>
            <div className="text-xs text-gray-500 mt-1">{wonDeals.filter(d => d.deal_type === 'funding').length} grants</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Receivables</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">${(financialSnapshot.outstandingReceivables / 1000).toFixed(0)}K</div>
            <div className="text-xs text-gray-500 mt-1">{awaitingDeals.length + overdueDeals.length} unpaid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pipeline</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{fmtK(activePipelineValue)}</div>
            <div className="text-xs text-gray-500 mt-1">{activeDeals.length} active deals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Beds Deployed</div>
            <div className="text-2xl font-bold mt-1">{bedsDeployed}</div>
            <div className="text-xs text-gray-500 mt-1">{depTotals.communities} communities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Units Sold</div>
            <div className="text-2xl font-bold mt-1">{totalUnitsWon}</div>
            <div className="text-xs text-gray-500 mt-1">beds + washers</div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Urgent Actions + Top Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Actions */}
        <Card className={urgentItems.length > 0 ? 'border-red-200' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              {overdueDeals.length > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              Urgent Actions
              {urgentItems.length > 0 && (
                <Badge className="bg-red-100 text-red-800 ml-auto">{urgentItems.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {urgentItems.length === 0 ? (
              <p className="text-sm text-green-600">All clear — no overdue items</p>
            ) : (
              <div className="space-y-2">
                {urgentItems.map((item, i) => (
                  <Link key={i} href={item.href}>
                    <div className={`p-3 rounded-lg border ${item.color} hover:opacity-80 transition-opacity cursor-pointer`}>
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs mt-0.5 opacity-80">{item.detail}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Active Deals */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Top Pipeline Deals</CardTitle>
              <Link href="/admin/strategy" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                View all &rarr;
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {topDeals.length === 0 ? (
              <p className="text-sm text-gray-400">No active deals</p>
            ) : (
              <div className="space-y-2">
                {topDeals.map((d, i) => {
                  const stageColors: Record<string, string> = {
                    negotiation: 'bg-amber-100 text-amber-800',
                    proposal: 'bg-blue-100 text-blue-800',
                    qualified: 'bg-purple-100 text-purple-800',
                    lead: 'bg-gray-100 text-gray-800',
                  };
                  return (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{d.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge className={d.deal_type === 'funding' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}>
                            {d.deal_type}
                          </Badge>
                          <Badge className={stageColors[d.pipeline_stage] || 'bg-gray-100 text-gray-800'}>
                            {d.pipeline_stage}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right pl-4 shrink-0">
                        <div className="font-bold tabular-nums">{fmtK(d.amount_cents)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Community Deployments + Production Status + Funding */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Community Deployments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Deployments</CardTitle>
              <Link href="/admin/communities" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                Details &rarr;
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCommunities.map(([community, count], i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{community}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${Math.min(100, (count / (topCommunities[0]?.[1] || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium tabular-nums w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t text-xs text-gray-500">
                {bedsDeployed} beds across {communityMap.size} communities
                {bedsInPipeline > 0 && ` · ${bedsInPipeline} in pipeline`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Production</CardTitle>
              <Link href="/admin/production" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                Details &rarr;
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {latestInventory ? (
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Beds possible</span>
                  <span className="text-xl font-bold">{latestInventory.beds_possible}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Raw plastic</span>
                  <span className="text-lg font-semibold">{latestInventory.raw_plastic_kg}kg</span>
                </div>
                <div className="pt-2 border-t text-xs text-gray-500">
                  Last count: {new Date(latestInventory.snapshot_date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No inventory data</p>
            )}
          </CardContent>
        </Card>

        {/* Funding Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Funding</CardTitle>
              <Link href="/admin/grants" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                Details &rarr;
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Received</span>
                <span className="text-lg font-bold text-green-700">${(fundingSummary.received / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-lg font-semibold text-amber-700">${(fundingSummary.pending / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600">Receivables</span>
                <span className="text-lg font-semibold text-orange-700">${(fundingSummary.receivables / 1000).toFixed(0)}K</span>
              </div>
              <div className="pt-2 border-t flex justify-between items-baseline">
                <span className="text-sm font-medium text-gray-700">Total tracked</span>
                <span className="text-lg font-bold">${((fundingSummary.received + fundingSummary.pending + fundingSummary.receivables) / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { name: 'Strategy', href: '/admin/strategy', desc: 'Sales & pipeline', highlight: true },
          { name: 'Network', href: '/admin/network', desc: 'CRM & contacts' },
          { name: 'Production', href: '/admin/production', desc: 'Factory ops' },
          { name: 'Economics', href: '/admin/economics', desc: 'Unit costs' },
          { name: 'Compendium', href: '/admin/compendium', desc: 'Master data' },
          { name: 'Storefront', href: '/', desc: 'Live website', external: true },
        ].map((item) => (
          <Link key={item.name} href={item.href} target={'external' in item ? '_blank' : undefined}>
            <Card className={`hover:border-orange-300 transition-colors cursor-pointer h-full ${item.highlight ? 'bg-orange-50/50 border-orange-200' : ''}`}>
              <CardContent className="pt-4 pb-3">
                <h3 className="font-medium text-sm">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
