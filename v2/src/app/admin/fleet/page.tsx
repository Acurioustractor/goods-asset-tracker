import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/fleet/kpi-card';
import { MachineListTable } from '@/components/fleet/machine-list-table';
import { AlertsList } from '@/components/fleet/alerts-list';
import { FleetDailyChart } from '@/components/fleet/fleet-daily-chart';
import { FleetRecommendations } from '@/components/fleet/fleet-recommendations';
import type { Alert, MachineOverview } from '@/lib/types/database';

export default async function FleetDashboardPage() {
  const supabase = await createClient();

  // Fetch fleet KPIs via database function
  const { data: kpiRows } = await supabase.rpc('get_fleet_kpis');
  const kpis = kpiRows?.[0] || {
    total_cycles: 0,
    total_kwh: 0,
    avg_kwh_per_cycle: 0,
    machines_online: 0,
    machines_total: 0,
    open_alerts: 0,
  };

  // Fetch open alerts
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .or('resolved.is.null,resolved.eq.false')
    .order('created_at', { ascending: false })
    .limit(20);

  // Get all assets with machine_id
  const { data: machineAssets } = await supabase
    .from('assets')
    .select('unique_id, machine_id, name, community, place, contact_household, supply_date')
    .not('machine_id', 'is', null);

  // Get latest usage_log per machine for status
  const { data: latestLogs } = await supabase
    .from('usage_logs')
    .select('machine_id, online, firmware_version, site_name, restart_counter, created_at')
    .not('machine_id', 'is', null)
    .order('created_at', { ascending: false });

  // Get today's cycle counts per machine
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { data: todayCycles } = await supabase
    .from('usage_logs')
    .select('machine_id')
    .eq('event_type', 'cycle_complete')
    .gte('created_at', todayStart.toISOString())
    .not('machine_id', 'is', null);

  // Get this week's kWh per machine
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const { data: weekLogs } = await supabase
    .from('usage_logs')
    .select('machine_id, power_kwh')
    .eq('event_type', 'cycle_complete')
    .gte('created_at', weekStart.toISOString())
    .not('machine_id', 'is', null);

  // Get daily rollups for fleet chart (last 14 days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const { data: dailyRollups } = await supabase
    .from('daily_machine_rollups')
    .select('*')
    .gte('rollup_date', fourteenDaysAgo.toISOString().split('T')[0])
    .order('rollup_date', { ascending: true });

  // Get alert counts per asset
  const { data: alertCounts } = await supabase
    .from('alerts')
    .select('asset_id')
    .or('resolved.is.null,resolved.eq.false');

  // Get fleet commentary
  const { data: fleetCommentary } = await supabase
    .from('machine_commentary')
    .select('machine_id, commentary, commentary_type')
    .order('created_at', { ascending: false })
    .limit(30);

  // Get related stories for fleet context
  const { data: stories } = await supabase
    .from('stories')
    .select('id, title, slug, story_type, community, published_at')
    .eq('is_published', true)
    .or('community.ilike.%Tennant Creek%,tags.cs.{washing}')
    .order('published_at', { ascending: false })
    .limit(5);

  // Build fleet daily chart data
  const dailyMap = new Map<string, { cycles: number; kwh: number; machines: Set<string> }>();
  for (const r of dailyRollups || []) {
    const date = r.rollup_date;
    const existing = dailyMap.get(date) || { cycles: 0, kwh: 0, machines: new Set<string>() };
    existing.cycles += Number(r.cycles) || 0;
    existing.kwh += Number(r.kwh_used) || 0;
    if (r.machine_id) existing.machines.add(r.machine_id);
    dailyMap.set(date, existing);
  }
  const fleetDailyData = Array.from(dailyMap.entries())
    .map(([date, d]) => ({
      date,
      cycles: d.cycles,
      kwh: Math.round(d.kwh * 100) / 100,
      machines_active: d.machines.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Build machine overviews
  const latestByMachine = new Map<string, {
    online: boolean;
    firmware_version: string | null;
    site_name: string | null;
    restart_counter: number | null;
    created_at: string;
  }>();
  for (const log of latestLogs || []) {
    if (log.machine_id && !latestByMachine.has(log.machine_id)) {
      latestByMachine.set(log.machine_id, log);
    }
  }

  const todayCountByMachine = new Map<string, number>();
  for (const log of todayCycles || []) {
    if (log.machine_id) {
      todayCountByMachine.set(log.machine_id, (todayCountByMachine.get(log.machine_id) || 0) + 1);
    }
  }

  const weekKwhByMachine = new Map<string, number>();
  const weekCyclesByMachine = new Map<string, number>();
  for (const log of weekLogs || []) {
    if (log.machine_id) {
      weekKwhByMachine.set(log.machine_id, (weekKwhByMachine.get(log.machine_id) || 0) + (log.power_kwh || 0));
      weekCyclesByMachine.set(log.machine_id, (weekCyclesByMachine.get(log.machine_id) || 0) + 1);
    }
  }

  const alertCountByAsset = new Map<string, number>();
  for (const alert of alertCounts || []) {
    if (alert.asset_id) {
      alertCountByAsset.set(alert.asset_id as string, (alertCountByAsset.get(alert.asset_id as string) || 0) + 1);
    }
  }

  const machines: MachineOverview[] = (machineAssets || []).map((asset) => {
    const latest = latestByMachine.get(asset.machine_id!);
    const weekKwh = weekKwhByMachine.get(asset.machine_id!) || 0;
    const weekCycles = weekCyclesByMachine.get(asset.machine_id!) || 0;

    return {
      machine_id: asset.machine_id!,
      asset_id: asset.unique_id,
      name: asset.name,
      community: asset.community || asset.place,
      site_name: latest?.site_name || null,
      firmware_version: latest?.firmware_version || null,
      online: latest?.online ?? false,
      last_seen_at: latest?.created_at || null,
      today_cycles: todayCountByMachine.get(asset.machine_id!) || 0,
      week_kwh: weekKwh,
      avg_kwh_per_cycle: weekCycles > 0 ? weekKwh / weekCycles : 0,
      restart_counter: latest?.restart_counter || null,
      open_alert_count: alertCountByAsset.get(asset.unique_id) || 0,
    };
  });

  // Sort: alerts first, then online, then name
  machines.sort((a, b) => {
    if (a.open_alert_count > 0 && b.open_alert_count === 0) return -1;
    if (b.open_alert_count > 0 && a.open_alert_count === 0) return 1;
    if (a.online !== b.online) return a.online ? -1 : 1;
    return (a.name || a.machine_id).localeCompare(b.name || b.machine_id);
  });

  // Calculate fleet median efficiency
  const efficiencies = machines
    .filter((m) => m.avg_kwh_per_cycle > 0)
    .map((m) => m.avg_kwh_per_cycle)
    .sort((a, b) => a - b);
  const fleetMedianKwhPerCycle = efficiencies.length > 0
    ? efficiencies[Math.floor(efficiencies.length / 2)]
    : 0;

  const onlineCount = machines.filter((m) => m.online).length;
  const offlineCount = machines.length - onlineCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fleet Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Pakkimjalki Kari washing machine fleet — {machines.length} machines across{' '}
            {new Set(machines.map((m) => m.community).filter(Boolean)).size} communities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">{onlineCount} online</Badge>
          {offlineCount > 0 && (
            <Badge className="bg-red-100 text-red-800">{offlineCount} offline</Badge>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          label="Wash Cycles"
          value={Number(kpis.total_cycles).toLocaleString()}
          subtitle="Last 7 days"
        />
        <KPICard
          label="Energy Used"
          value={`${Number(kpis.total_kwh).toFixed(1)} kWh`}
          subtitle="Last 7 days"
        />
        <KPICard
          label="Efficiency"
          value={`${Number(kpis.avg_kwh_per_cycle).toFixed(3)} kWh`}
          subtitle="Per cycle average"
        />
        <KPICard
          label="Online"
          value={`${kpis.machines_online} / ${kpis.machines_total}`}
          subtitle="Reporting last 24h"
        />
        <KPICard
          label="Open Alerts"
          value={Number(kpis.open_alerts)}
          subtitle="Requires attention"
        />
        <KPICard
          label="Fleet Median"
          value={fleetMedianKwhPerCycle > 0 ? `${fleetMedianKwhPerCycle.toFixed(3)} kWh` : 'N/A'}
          subtitle="kWh/cycle benchmark"
        />
      </div>

      {/* Fleet Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Activity — Last 14 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <FleetDailyChart data={fleetDailyData} />
        </CardContent>
      </Card>

      {/* Recommendations + Alerts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FleetRecommendations
          machines={machines}
          fleetMedianKwhPerCycle={fleetMedianKwhPerCycle}
          commentary={fleetCommentary || []}
        />

        {(alerts && alerts.length > 0) ? (
          <Card>
            <CardHeader>
              <CardTitle>Open Alerts ({alerts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertsList alerts={alerts as Alert[]} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-green-600 font-medium">All clear</p>
                <p className="text-sm text-gray-400 mt-1">No open alerts</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Machine List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Machines</CardTitle>
            <p className="text-sm text-gray-500">
              Sorted by alerts, then online status
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <MachineListTable machines={machines} />
        </CardContent>
      </Card>

      {/* Related context: Stories + Asset links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Community Stories */}
        <Card>
          <CardHeader>
            <CardTitle>Community Stories</CardTitle>
          </CardHeader>
          <CardContent>
            {!stories || stories.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No published stories from fleet communities yet
              </p>
            ) : (
              <div className="space-y-2">
                {stories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium text-sm">{story.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{story.story_type}</Badge>
                      {story.community && (
                        <span className="text-xs text-gray-400">{story.community}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/requests">
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-3">
                  <span>
                    <span className="font-medium">Support Requests</span>
                    <br />
                    <span className="text-gray-400 text-xs">View open tickets</span>
                  </span>
                </Button>
              </Link>
              <Link href="/admin/messages">
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-3">
                  <span>
                    <span className="font-medium">Messages</span>
                    <br />
                    <span className="text-gray-400 text-xs">Community comms</span>
                  </span>
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-3">
                  <span>
                    <span className="font-medium">Submit Ticket</span>
                    <br />
                    <span className="text-gray-400 text-xs">Report an issue</span>
                  </span>
                </Button>
              </Link>
              <Link href="/wiki/products/washing-machine">
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-3">
                  <span>
                    <span className="font-medium">Machine Guide</span>
                    <br />
                    <span className="text-gray-400 text-xs">Pakkimjalki Kari wiki</span>
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Notes */}
      {fleetCommentary && fleetCommentary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Operational Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fleetCommentary.slice(0, 10).map((note, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded bg-gray-50 text-sm">
                  <Badge variant="outline" className="shrink-0 mt-0.5">
                    {note.machine_id === 'fleet' ? 'Fleet' : note.machine_id}
                  </Badge>
                  <p className="text-gray-700">{note.commentary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
