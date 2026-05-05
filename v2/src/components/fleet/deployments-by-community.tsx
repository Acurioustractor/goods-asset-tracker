import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface WashingDeployment {
  unique_id: string;
  name: string | null;
  community: string | null;
  place: string | null;
  contact_household: string | null;
  product: string | null;
  supply_date: string | null;
  last_checkin_date: string | null;
  asset_status: string | null;
  machine_id: string | null;
  has_telemetry_hw: boolean;
  last_seen_at: string | null;
  cycles_7d: number;
  kwh_7d: number;
  total_cycle_events?: number;
  last_event_type?: string | null;
  last_firmware?: string | null;
  connectivity_status:
    | 'reporting'
    | 'lagging'
    | 'silent'
    | 'never_reported'
    | 'placeholder_only'
    | 'no_telemetry_hw'
    | 'pending_assignment';
}

const STATUS_LABEL: Record<WashingDeployment['connectivity_status'], string> = {
  reporting: 'Reporting',
  lagging: 'Lagging',
  silent: 'Silent',
  never_reported: 'Never reported',
  placeholder_only: 'Placeholder (no real device)',
  no_telemetry_hw: 'No telemetry HW',
  pending_assignment: 'Pending assignment',
};

const STATUS_COLOUR: Record<WashingDeployment['connectivity_status'], string> = {
  reporting: 'bg-emerald-100 text-emerald-800',
  lagging: 'bg-amber-100 text-amber-800',
  silent: 'bg-red-100 text-red-800',
  never_reported: 'bg-rose-100 text-rose-800',
  placeholder_only: 'bg-purple-100 text-purple-800',
  no_telemetry_hw: 'bg-slate-100 text-slate-700',
  pending_assignment: 'bg-blue-50 text-blue-800',
};

function daysAgo(iso: string | null) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function DeploymentsByCommunity({
  deployments,
}: {
  deployments: WashingDeployment[];
}) {
  if (!deployments || deployments.length === 0) return null;

  const grouped = new Map<string, WashingDeployment[]>();
  for (const d of deployments) {
    const key = d.community || 'Unknown';
    const arr = grouped.get(key) || [];
    arr.push(d);
    grouped.set(key, arr);
  }

  const summary = Array.from(grouped.entries())
    .map(([community, items]) => {
      const counts = items.reduce(
        (acc, d) => {
          acc.total += 1;
          acc[d.connectivity_status] = (acc[d.connectivity_status] || 0) + 1;
          return acc;
        },
        { total: 0 } as Record<string, number>
      );
      return { community, items, counts };
    })
    .sort((a, b) => b.counts.total - a.counts.total);

  const totals = deployments.reduce(
    (acc, d) => {
      acc.total += 1;
      acc[d.connectivity_status] = (acc[d.connectivity_status] || 0) + 1;
      return acc;
    },
    { total: 0 } as Record<string, number>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Washing Machine Deployments</CardTitle>
          <p className="text-sm text-gray-500">
            {totals.total} machines across {grouped.size} communities ·{' '}
            <span className="text-emerald-700">{totals.reporting || 0} reporting</span> ·{' '}
            <span className="text-red-700">{totals.silent || 0} silent</span> ·{' '}
            <span className="text-slate-700">{totals.no_telemetry_hw || 0} no-telemetry</span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-gray-500 border-b">
              <tr>
                <th className="text-left py-2 pr-4">Community</th>
                <th className="text-right px-2">Total</th>
                <th className="text-right px-2">Reporting</th>
                <th className="text-right px-2">Lagging</th>
                <th className="text-right px-2">Silent</th>
                <th className="text-right px-2">No HW</th>
                <th className="text-right px-2">Pending</th>
                <th className="text-right pl-2">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {summary.map(({ community, counts }) => {
                const withHw =
                  counts.total - (counts.no_telemetry_hw || 0) - (counts.pending_assignment || 0);
                const coverage =
                  withHw === 0 ? 0 : Math.round(((counts.reporting || 0) / withHw) * 100);
                return (
                  <tr key={community} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{community}</td>
                    <td className="text-right px-2">{counts.total}</td>
                    <td className="text-right px-2 text-emerald-700">{counts.reporting || 0}</td>
                    <td className="text-right px-2 text-amber-700">{counts.lagging || 0}</td>
                    <td className="text-right px-2 text-red-700">
                      {(counts.silent || 0) + (counts.never_reported || 0)}
                    </td>
                    <td className="text-right px-2 text-slate-700">
                      {counts.no_telemetry_hw || 0}
                    </td>
                    <td className="text-right px-2 text-blue-700">
                      {counts.pending_assignment || 0}
                    </td>
                    <td className="text-right pl-2">
                      {withHw === 0 ? (
                        <span className="text-gray-400">no HW</span>
                      ) : (
                        <span
                          className={
                            coverage >= 80
                              ? 'text-emerald-700 font-medium'
                              : coverage >= 30
                              ? 'text-amber-700 font-medium'
                              : 'text-red-700 font-medium'
                          }
                        >
                          {coverage}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {summary.map(({ community, items }) => (
          <details key={community} className="border rounded-lg" open={summary.length <= 3}>
            <summary className="px-4 py-3 font-medium cursor-pointer flex items-center justify-between">
              <span>
                {community}{' '}
                <span className="text-sm text-gray-500 font-normal">({items.length})</span>
              </span>
            </summary>
            <div className="overflow-x-auto border-t">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-gray-500">
                  <tr>
                    <th className="text-left py-2 px-4">Asset</th>
                    <th className="text-left px-2">Household / Site</th>
                    <th className="text-left px-2">Status</th>
                    <th className="text-right px-2">Last seen</th>
                    <th className="text-right px-2">7d cycles</th>
                    <th className="text-right px-2">Total cycles</th>
                    <th className="text-left px-2">Last event</th>
                    <th className="text-left px-2">FW</th>
                    <th className="text-right pr-4">Supplied</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((d) => {
                    const last = daysAgo(d.last_seen_at);
                    const supplied = daysAgo(d.supply_date);
                    return (
                      <tr key={d.unique_id} className="border-t">
                        <td className="py-2 px-4">
                          <div className="font-medium">{d.name || d.unique_id}</div>
                          <div className="text-xs text-gray-400">{d.unique_id}</div>
                        </td>
                        <td className="px-2 text-gray-600">{d.contact_household || '—'}</td>
                        <td className="px-2">
                          <Badge className={STATUS_COLOUR[d.connectivity_status]}>
                            {STATUS_LABEL[d.connectivity_status]}
                          </Badge>
                        </td>
                        <td className="text-right px-2 text-gray-600">
                          {last === null ? '—' : `${last}d ago`}
                        </td>
                        <td className="text-right px-2 text-gray-600">
                          {d.has_telemetry_hw ? d.cycles_7d : '—'}
                        </td>
                        <td className="text-right px-2 text-gray-600">
                          {d.has_telemetry_hw ? (d.total_cycle_events ?? 0) : '—'}
                        </td>
                        <td className="px-2 text-xs text-gray-500">
                          {d.last_event_type || '—'}
                        </td>
                        <td className="px-2 text-xs text-gray-500">
                          {d.last_firmware || '—'}
                        </td>
                        <td className="text-right pr-4 text-gray-500">
                          {supplied === null ? '—' : `${supplied}d ago`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </CardContent>
    </Card>
  );
}
