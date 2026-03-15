import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductionKPIGrid } from '@/components/production/production-kpi-grid';
import { InventoryPositionCard } from '@/components/production/inventory-position-card';
import { ProductionTrendChart } from '@/components/production/production-trend-chart';
import type { ProductionInventory, ProductionShift, ProductionJournal } from '@/lib/types/database';

export const revalidate = 300; // 5 min cache

async function getProductionData() {
  const supabase = createServiceClient();

  const [shiftsRes, inventoryRes, journalRes] = await Promise.all([
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
  ]);

  return {
    shifts: (shiftsRes.data || []) as ProductionShift[],
    inventorySnapshots: (inventoryRes.data || []) as ProductionInventory[],
    journalEntries: (journalRes.data || []) as ProductionJournal[],
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
  const { shifts, inventorySnapshots, journalEntries } = await getProductionData();

  const latestInventory = inventorySnapshots[0] || null;
  const bedsPossible = latestInventory?.beds_possible ?? 0;

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
