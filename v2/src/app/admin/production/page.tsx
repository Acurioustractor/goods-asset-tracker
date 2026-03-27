import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductionKPIGrid } from '@/components/production/production-kpi-grid';
import { InventoryPositionCard } from '@/components/production/inventory-position-card';
import { ProductionTrendChart } from '@/components/production/production-trend-chart';
import { SupplyDemandCard, type CommittedOrder, type SupplierQuote } from '@/components/production/supply-demand-card';
import { BedReconciliation, type AssetSummary, type DemandSummary } from '@/components/production/bed-reconciliation';
import type { ProductionInventory, ProductionShift, ProductionJournal } from '@/lib/types/database';

export const revalidate = 300; // 5 min cache

async function getProductionData() {
  const supabase = createServiceClient();

  const [shiftsRes, inventoryRes, journalRes, dealsRes, assetsRes] = await Promise.all([
    supabase
      .from('production_shifts')
      .select('*')
      .order('shift_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('production_inventory')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('production_journal')
      .select('*')
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10),
    // Deals with bed units for supply/demand tracking
    supabase
      .from('crm_deals')
      .select('id, title, deal_type, pipeline_stage, amount_cents, units, maker, delivery_status, notes, crm_contacts(name, organization)')
      .gt('units', 0)
      .order('units', { ascending: false }),
    // All assets for reconciliation
    supabase
      .from('assets')
      .select('unique_id, status, community, quantity, product, notes'),
  ]);

  // Parse deals
  const bedDeals = ((dealsRes.data || []) as Array<Record<string, unknown>>).map(d => ({
    id: d.id as string,
    title: d.title as string,
    deal_type: d.deal_type as string,
    pipeline_stage: d.pipeline_stage as string,
    amount_cents: d.amount_cents as number,
    units: (d.units as number) || 0,
    maker: (d.maker as string) || null,
    delivery_status: (d.delivery_status as string) || null,
    notes: (d.notes as string) || null,
    crm_contacts: Array.isArray(d.crm_contacts) && d.crm_contacts.length > 0
      ? d.crm_contacts[0] as { name: string; organization: string }
      : d.crm_contacts as { name: string; organization: string } | null,
  }));

  // Build asset summary for reconciliation
  const rawAssets = (assetsRes.data || []) as Array<{ unique_id: string; status: string; community: string; quantity: number; product: string; notes: string | null }>;
  const communityMap = new Map<string, number>();
  const productMap = new Map<string, { deployed: number; demo: number; allocated: number; requested: number; retired: number }>();
  let deployed = 0, demo = 0, allocated = 0, requested = 0, retired = 0, inTransitCount = 0;

  for (const a of rawAssets) {
    const qty = a.quantity || 1;
    const product = a.product || 'Unknown';
    const isInTransit = (a.notes || '').toLowerCase().includes('transit');

    // Per-product tracking
    if (!productMap.has(product)) {
      productMap.set(product, { deployed: 0, demo: 0, allocated: 0, requested: 0, retired: 0 });
    }
    const pm = productMap.get(product)!;

    if (isInTransit) {
      inTransitCount += qty;
    } else {
      switch (a.status) {
        case 'deployed': deployed += qty; pm.deployed += qty; break;
        case 'demo': demo += qty; pm.demo += qty; break;
        case 'allocated': allocated += qty; pm.allocated += qty; break;
        case 'requested': requested += qty; pm.requested += qty; break;
        case 'retired': retired += qty; pm.retired += qty; break;
      }
    }
    if (a.community && a.status === 'deployed') {
      communityMap.set(a.community, (communityMap.get(a.community) || 0) + qty);
    }
  }

  const byCommunity = [...communityMap.entries()]
    .map(([community, count]) => ({ community, count }))
    .sort((a, b) => b.count - a.count);

  const byProduct = [...productMap.entries()]
    .map(([product, counts]) => ({
      product,
      ...counts,
      total: counts.deployed + counts.demo + counts.allocated + counts.requested + counts.retired,
    }))
    .sort((a, b) => b.total - a.total);

  // Beds being manufactured by external partners (from deals)
  const inProduction = bedDeals
    .filter(d => d.delivery_status === 'in-production')
    .reduce((sum, d) => sum + d.units, 0);

  const assetSummary: AssetSummary = {
    deployed,
    demo,
    allocated,
    requested,
    retired,
    inTransit: inTransitCount,
    inProduction,
    total: deployed + demo + allocated + requested + retired + inProduction + inTransitCount,
    byCommunity,
    byProduct,
  };

  // Build demand summary from ALL deals (including units=0 for deal counts)
  const allDealsRes = await supabase
    .from('crm_deals')
    .select('pipeline_stage, units, deal_type')
    .in('deal_type', ['sale', 'procurement'])
    .not('pipeline_stage', 'eq', 'lost');

  const allSaleDeals = (allDealsRes.data || []) as Array<{ pipeline_stage: string; units: number; deal_type: string }>;

  const demandByStage: Record<string, { count: number; units: number }> = {
    won: { count: 0, units: 0 },
    negotiation: { count: 0, units: 0 },
    proposal: { count: 0, units: 0 },
    qualified: { count: 0, units: 0 },
    lead: { count: 0, units: 0 },
  };

  let totalDemandUnits = 0;
  let totalDemandDeals = 0;

  for (const d of allSaleDeals) {
    const stage = d.pipeline_stage;
    if (demandByStage[stage]) {
      demandByStage[stage].count++;
      demandByStage[stage].units += d.units || 0;
      totalDemandUnits += d.units || 0;
      totalDemandDeals++;
    }
  }

  const demandSummary: DemandSummary = {
    won: demandByStage.won,
    negotiation: demandByStage.negotiation,
    proposal: demandByStage.proposal,
    qualified: demandByStage.qualified,
    lead: demandByStage.lead,
    totalUnits: totalDemandUnits,
    totalDeals: totalDemandDeals,
  };

  return {
    shifts: (shiftsRes.data || []) as ProductionShift[],
    inventorySnapshots: (inventoryRes.data || []) as ProductionInventory[],
    journalEntries: (journalRes.data || []) as ProductionJournal[],
    bedDeals,
    assetSummary,
    demandSummary,
  };
}

const DIESEL_COLORS: Record<string, string> = {
  low: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  full: 'bg-green-100 text-green-800',
};

const ENTRY_TYPE_BADGES: Record<string, string> = {
  reflection: 'bg-blue-100 text-blue-800',
  issue: 'bg-red-100 text-red-800',
  cost_idea: 'bg-amber-100 text-amber-800',
  general: 'bg-gray-100 text-gray-800',
};

export default async function AdminProductionPage() {
  const { shifts, inventorySnapshots, journalEntries, bedDeals, assetSummary, demandSummary } = await getProductionData();

  const latestInventory = inventorySnapshots[0] || null;
  const bedsPossible = latestInventory?.beds_possible ?? 0;

  // Build committed orders from live deals that have units > 0
  const committedOrders: CommittedOrder[] = bedDeals.map(d => {
    // Derive delivery status from deal data
    let status: CommittedOrder['status'] = 'awaiting-stock';
    if (d.delivery_status === 'in-production') status = 'in-production';
    else if (d.delivery_status === 'shipped') status = 'delivered'; // close enough
    else if (d.delivery_status === 'delivered') status = 'delivered';
    else if (d.pipeline_stage === 'won' && !d.delivery_status) status = 'awaiting-stock';
    else if (d.pipeline_stage === 'negotiation' || d.pipeline_stage === 'proposal') status = 'quoted';
    else if (d.pipeline_stage === 'qualified' || d.pipeline_stage === 'lead') status = 'quoted';

    const contact = d.crm_contacts;
    const customer = contact?.organization || contact?.name || d.title.split('—')[0].trim();

    return {
      id: d.id,
      title: d.title,
      customer,
      beds: d.units,
      value: d.amount_cents / 100,
      maker: (d.maker as 'defy' | 'act' | 'tbc') || 'tbc',
      status,
      notes: d.notes || undefined,
    };
  });

  // Pending supplier quotes — these stay semi-static since quotes aren't in the DB yet
  // TODO: Add a supplier_quotes table when volume justifies it
  const pendingQuotes: SupplierQuote[] = [
    {
      id: 'qu-0380',
      reference: 'QU-0380',
      supplier: 'Defy Manufacturing',
      description: '1,200kg recycled plastic shred (2 bulka bags) + 20x 1200x1200x19mm Jungle Mix panels + freight (3 pallets to Witta)',
      amount: 8525,
      bedsEquivalent: 60,
      expires: '2026-04-23',
      status: 'pending',
    },
    {
      id: 'qu-0381',
      reference: 'QU-0381',
      supplier: 'Defy Manufacturing',
      description: '50 bed kits in 19mm Jungle recycled plastic — CNC cut & finished. Does not include assembly, hardware, packing, or freight.',
      amount: 18923,
      bedsEquivalent: 50,
      expires: '2026-04-23',
      status: 'pending',
    },
  ];

  // KPI calculations
  const last30DaysShifts = shifts.filter((s) => {
    const d = new Date(s.shift_date);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return d >= cutoff;
  });
  
  const uniqueDays = new Set(last30DaysShifts.map((s) => s.shift_date)).size;
  const totalSheets30Days = last30DaysShifts.reduce((sum, s) => sum + s.sheets_produced, 0);
  
  // Average across active shift days
  const avgSheetsPerDay = uniqueDays > 0 ? Math.round(totalSheets30Days / uniqueDays) : 0;
  
  // Plastic Burn Rate calculations
  const totalPlasticShredded30Days = last30DaysShifts.reduce((sum, s) => sum + (s.plastic_shredded_kg || 0), 0);
  const avgDailyBurnKg = uniqueDays > 0 ? Math.round(totalPlasticShredded30Days / uniqueDays) : 0;
  const rawPlasticStock = latestInventory?.raw_plastic_kg || 0;
  const plasticRunwayDays = avgDailyBurnKg > 0 ? Math.floor(rawPlasticStock / avgDailyBurnKg) : -1;

  const latestDiesel = shifts[0]?.diesel_level || '-';
  const openIssues = journalEntries.filter((e) => e.entry_type === 'issue' && !e.is_resolved).length;
  const daysSinceCount = latestInventory
    // eslint-disable-next-line react-hooks/purity
    ? Math.floor((Date.now() - new Date(latestInventory.snapshot_date + 'T00:00:00').getTime()) / 86400000)
    : -1;

  const kpis = [
    { 
      label: 'Plastic Runway', 
      value: plasticRunwayDays >= 0 ? `${plasticRunwayDays} Days` : 'N/A', 
      subtitle: `${rawPlasticStock}kg stock @ ${avgDailyBurnKg}kg/day burn` 
    },
    { label: 'Beds Possible', value: bedsPossible, subtitle: 'from current stock' },
    { label: 'Avg Sheets/Day', value: avgSheetsPerDay, subtitle: 'last 30 days' },
    { label: 'Days Since Count', value: daysSinceCount >= 0 ? daysSinceCount : '-', subtitle: daysSinceCount > 7 ? 'overdue' : undefined },
    { label: 'Diesel', value: latestDiesel.charAt(0).toUpperCase() + latestDiesel.slice(1), subtitle: 'last shift' },
    { label: 'Open Issues', value: openIssues },
  ];

  // Recent shifts for table (last 10)
  const recentShifts = shifts.slice(0, 10);

  // Trend data (last 30 days of shifts)
  const trendData = last30DaysShifts.map((s) => ({
    shift_date: s.shift_date,
    sheets_produced: s.sheets_produced,
    plastic_shredded_kg: s.plastic_shredded_kg,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Production</h1>

      {/* KPIs */}
      <ProductionKPIGrid kpis={kpis} />

      {/* Bed Reconciliation */}
      <BedReconciliation data={{
        assets: assetSummary,
        demand: demandSummary,
        bedsPossible,
        rawPlasticKg: rawPlasticStock,
      }} />

      {/* Supply & Demand */}
      <SupplyDemandCard
        bedsPossible={bedsPossible}
        orders={committedOrders}
        quotes={pendingQuotes}
        rawPlasticKg={rawPlasticStock}
      />

      {/* Inventory Position */}
      <InventoryPositionCard 
        snapshot={latestInventory} 
        avgDailyBurnKg={avgDailyBurnKg} 
        plasticRunwayDays={plasticRunwayDays} 
      />

      {/* Production Trend Chart */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Production Trend (30 days)</h3>
          <ProductionTrendChart data={trendData} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shifts */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Recent Shifts</h3>
            {recentShifts.length === 0 ? (
              <p className="text-gray-500 text-sm">No shifts logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Operator</th>
                      <th className="pb-2 font-medium text-right">Sheets</th>
                      <th className="pb-2 font-medium text-right">kg</th>
                      <th className="pb-2 font-medium text-right">Diesel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentShifts.map((shift) => (
                      <tr key={shift.id} className="border-b last:border-0">
                        <td className="py-2">
                          {new Date(shift.shift_date + 'T00:00:00').toLocaleDateString('en-AU', {
                            day: 'numeric', month: 'short',
                          })}
                        </td>
                        <td className="py-2">{shift.operator}</td>
                        <td className="py-2 text-right font-medium tabular-nums">{shift.sheets_produced}</td>
                        <td className="py-2 text-right tabular-nums">{shift.plastic_shredded_kg}</td>
                        <td className="py-2 text-right">
                          <Badge className={DIESEL_COLORS[shift.diesel_level] || ''} variant="outline">
                            {shift.diesel_level}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Process Journal */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Process Journal</h3>
            {journalEntries.length === 0 ? (
              <p className="text-gray-500 text-sm">No journal entries yet.</p>
            ) : (
              <div className="space-y-3">
                {journalEntries.slice(0, 8).map((entry) => (
                  <div key={entry.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{entry.title}</p>
                        <p className="text-xs text-gray-400">
                          {entry.operator} &middot;{' '}
                          {new Date(entry.entry_date + 'T00:00:00').toLocaleDateString('en-AU', {
                            day: 'numeric', month: 'short',
                          })}
                        </p>
                      </div>
                      <Badge className={ENTRY_TYPE_BADGES[entry.entry_type] || ''} variant="outline">
                        {entry.entry_type === 'cost_idea' ? 'Cost' : entry.entry_type}
                      </Badge>
                    </div>
                    {entry.content && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{entry.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
