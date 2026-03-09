import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/fleet/kpi-card';
import { MachineStatusBadge } from '@/components/fleet/machine-status-badge';
import { MachineTimeseriesChart } from '@/components/fleet/machine-timeseries-chart';
import { EventHistoryTable } from '@/components/fleet/event-history-table';
import { EfficiencyComparison } from '@/components/fleet/efficiency-comparison';
import { AlertsList } from '@/components/fleet/alerts-list';
import type { Alert, DailyMachineRollup, UsageLog } from '@/lib/types/database';

interface PageProps {
  params: Promise<{ machine_id: string }>;
}

export default async function MachineDetailPage({ params }: PageProps) {
  const { machine_id } = await params;
  const decodedMachineId = decodeURIComponent(machine_id);
  const supabase = await createClient();

  // Find asset by machine_id
  const { data: asset } = await supabase
    .from('assets')
    .select('*')
    .eq('machine_id', decodedMachineId)
    .single();

  if (!asset) {
    notFound();
  }

  // Get latest telemetry event for machine info
  const { data: latestEvent } = await supabase
    .from('usage_logs')
    .select('*')
    .eq('machine_id', decodedMachineId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Get daily rollups for chart (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { data: rollups } = await supabase
    .from('daily_machine_rollups')
    .select('*')
    .eq('machine_id', decodedMachineId)
    .gte('rollup_date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('rollup_date', { ascending: true });

  // Get recent events (last 50)
  const { data: recentEvents } = await supabase
    .from('usage_logs')
    .select('*')
    .eq('machine_id', decodedMachineId)
    .order('created_at', { ascending: false })
    .limit(50);

  // Get open alerts for this asset
  const { data: alerts } = await supabase
    .from('alerts')
    .select('*')
    .eq('asset_id', asset.unique_id)
    .or('resolved.is.null,resolved.eq.false')
    .order('created_at', { ascending: false });

  // Get linked tickets
  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('asset_id', asset.unique_id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get linked checkins
  const { data: checkins } = await supabase
    .from('checkins')
    .select('*')
    .eq('asset_id', asset.unique_id)
    .order('checkin_date', { ascending: false })
    .limit(10);

  // Get user_assets (who owns it)
  const { data: userAssets } = await supabase
    .from('user_assets')
    .select('*, profiles(*)')
    .eq('asset_id', asset.unique_id)
    .eq('claim_status', 'active');

  // Get commentary for this machine
  const { data: commentary } = await supabase
    .from('machine_commentary')
    .select('*')
    .eq('machine_id', decodedMachineId)
    .order('created_at', { ascending: false })
    .limit(20);

  // Get all machines' weekly efficiency for comparison chart
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const { data: allWeekLogs } = await supabase
    .from('usage_logs')
    .select('machine_id, power_kwh')
    .eq('event_type', 'cycle_complete')
    .gte('created_at', weekStart.toISOString())
    .not('machine_id', 'is', null);

  // Get related community stories
  const community = asset.community || asset.place;
  const { data: stories } = community
    ? await supabase
        .from('stories')
        .select('id, title, slug, story_type, community, published_at')
        .eq('is_published', true)
        .or(`community.ilike.%${community}%,tags.cs.{washing}`)
        .order('published_at', { ascending: false })
        .limit(5)
    : { data: null };

  // Calculate summary stats
  const weekRollups = (rollups || []).filter(
    (r) => new Date(r.rollup_date) >= weekStart
  );
  const weekCycles = weekRollups.reduce((sum, r) => sum + (r.cycles || 0), 0);
  const weekKwh = weekRollups.reduce((sum, r) => sum + Number(r.kwh_used || 0), 0);
  const kwhPerCycle = weekCycles > 0 ? weekKwh / weekCycles : 0;

  // Build efficiency comparison data
  const machineEffMap = new Map<string, { kwh: number; cycles: number }>();
  for (const log of allWeekLogs || []) {
    if (log.machine_id) {
      const existing = machineEffMap.get(log.machine_id) || { kwh: 0, cycles: 0 };
      existing.kwh += log.power_kwh || 0;
      existing.cycles += 1;
      machineEffMap.set(log.machine_id, existing);
    }
  }

  const efficiencyData = Array.from(machineEffMap.entries())
    .filter(([, d]) => d.cycles > 0)
    .map(([mid, d]) => ({
      name: mid,
      kwhPerCycle: d.kwh / d.cycles,
      isCurrent: mid === decodedMachineId,
    }));

  const allEfficiencies = efficiencyData.map((d) => d.kwhPerCycle).sort((a, b) => a - b);
  const fleetMedian = allEfficiencies.length > 0
    ? allEfficiencies[Math.floor(allEfficiencies.length / 2)]
    : 0;

  const onlineStatus = latestEvent?.online ?? false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/admin/fleet">
              <Button variant="outline" size="sm">
                &larr; Fleet
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              {asset.name || decodedMachineId}
            </h1>
            <MachineStatusBadge
              lastSeenAt={latestEvent?.created_at || null}
              online={latestEvent?.online}
            />
          </div>
          <p className="text-gray-500 mt-1">
            {community || 'Unknown community'}
            {latestEvent?.site_name && ` — ${latestEvent.site_name}`}
            {asset.contact_household && ` · ${asset.contact_household}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/assets/${asset.unique_id}`}>
            <Button variant="outline" size="sm">View Asset</Button>
          </Link>
          <Link href="/support">
            <Button variant="outline" size="sm">Submit Ticket</Button>
          </Link>
        </div>
      </div>

      {/* Asset Info Bar */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <span>Asset ID: <span className="font-mono text-gray-700">{asset.unique_id}</span></span>
        {asset.product && <Badge variant="outline">{asset.product}</Badge>}
        {asset.supply_date && (
          <span>Supplied: {new Date(asset.supply_date).toLocaleDateString('en-AU')}</span>
        )}
        {latestEvent?.firmware_version && (
          <span>Firmware: <span className="font-mono">{latestEvent.firmware_version}</span></span>
        )}
        {latestEvent?.signal_rssi != null && (
          <span>Signal: {latestEvent.signal_rssi} dBm</span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Week Cycles" value={weekCycles} subtitle="Last 7 days" />
        <KPICard label="Week kWh" value={weekKwh.toFixed(2)} subtitle="Last 7 days" />
        <KPICard
          label="kWh / Cycle"
          value={kwhPerCycle > 0 ? kwhPerCycle.toFixed(3) : '—'}
          subtitle={fleetMedian > 0 ? `Fleet median: ${fleetMedian.toFixed(3)}` : 'Avg efficiency'}
        />
        <KPICard
          label="Restarts"
          value={latestEvent?.restart_counter != null ? latestEvent.restart_counter : 'N/A'}
          subtitle="Total count"
        />
      </div>

      {/* Open alerts */}
      {alerts && alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Open Alerts ({alerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertsList alerts={alerts as Alert[]} />
          </CardContent>
        </Card>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Usage — Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <MachineTimeseriesChart data={(rollups || []) as DailyMachineRollup[]} />
          </CardContent>
        </Card>

        {/* Efficiency Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Efficiency vs Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <EfficiencyComparison machines={efficiencyData} fleetMedian={fleetMedian} />
          </CardContent>
        </Card>
      </div>

      {/* Event History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <EventHistoryTable events={(recentEvents || []) as UsageLog[]} />
        </CardContent>
      </Card>

      {/* Linked Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Support Tickets</CardTitle>
              <Link href={`/admin/requests?asset=${asset.unique_id}`}>
                <Button variant="ghost" size="sm" className="text-xs">View all</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {!tickets || tickets.length === 0 ? (
              <p className="text-gray-500 text-sm">No tickets for this machine</p>
            ) : (
              <div className="space-y-2">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 rounded-lg bg-gray-50 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{ticket.issue_description}</span>
                      <Badge className={
                        ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        ''
                      }>
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-1.5 text-xs text-gray-400">
                      {ticket.priority && <Badge variant="outline" className="text-xs">{ticket.priority}</Badge>}
                      <span>{new Date(ticket.created_at).toLocaleDateString('en-AU')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checkins */}
        <Card>
          <CardHeader>
            <CardTitle>Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            {!checkins || checkins.length === 0 ? (
              <p className="text-gray-500 text-sm">No inspections recorded</p>
            ) : (
              <div className="space-y-2">
                {checkins.map((checkin) => (
                  <div key={checkin.id} className="p-3 rounded-lg bg-gray-50 text-sm">
                    <div className="flex justify-between items-start">
                      <span>{checkin.comments || 'Routine inspection'}</span>
                      <Badge className={
                        checkin.status === 'good' ? 'bg-green-100 text-green-800' :
                        checkin.status === 'needs_repair' ? 'bg-red-100 text-red-800' :
                        ''
                      }>
                        {checkin.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(checkin.checkin_date).toLocaleDateString('en-AU')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Owner / Household */}
        <Card>
          <CardHeader>
            <CardTitle>Household</CardTitle>
          </CardHeader>
          <CardContent>
            {asset.contact_household ? (
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="font-medium text-sm">{asset.contact_household}</p>
                {community && <p className="text-xs text-gray-500 mt-1">{community}</p>}
              </div>
            ) : !userAssets || userAssets.length === 0 ? (
              <p className="text-gray-500 text-sm">No household linked</p>
            ) : (
              <div className="space-y-2">
                {userAssets.map((ua) => (
                  <div key={ua.id} className="p-3 rounded-lg bg-gray-50 text-sm">
                    <span className="font-medium">
                      {(ua.profiles as Record<string, string>)?.display_name || 'Unknown'}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      Claimed {new Date(ua.claimed_at).toLocaleDateString('en-AU')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Stories */}
        <Card>
          <CardHeader>
            <CardTitle>Community Stories</CardTitle>
          </CardHeader>
          <CardContent>
            {!stories || stories.length === 0 ? (
              <p className="text-gray-500 text-sm">No published stories from this community</p>
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
      </div>

      {/* Operational Notes */}
      {commentary && commentary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Operational Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {commentary.map((note) => (
                <div key={note.id} className="p-3 rounded-lg bg-gray-50 text-sm">
                  <p className="text-gray-700">{note.commentary}</p>
                  <div className="flex gap-2 mt-1.5">
                    <Badge variant="outline" className="text-xs">{note.commentary_type}</Badge>
                    {note.report_date && (
                      <span className="text-xs text-gray-400">
                        {new Date(note.report_date).toLocaleDateString('en-AU')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/fleet">
          <Button variant="outline" size="sm">&larr; Back to Fleet</Button>
        </Link>
        <Link href="/wiki/products/washing-machine">
          <Button variant="outline" size="sm">Machine Guide</Button>
        </Link>
        <Link href="/support">
          <Button variant="outline" size="sm">Report Issue</Button>
        </Link>
        <Link href="/admin/messages">
          <Button variant="outline" size="sm">Messages</Button>
        </Link>
      </div>
    </div>
  );
}
