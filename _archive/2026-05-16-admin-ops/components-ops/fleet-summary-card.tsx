import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FleetSummary } from '@/app/admin/ops/actions';

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function FleetSummaryCard({ data }: { data: FleetSummary }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Fleet Status</h3>
          <Link href="/admin/fleet" className="text-sm text-blue-600 hover:underline">
            Full dashboard &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Online</p>
            <p className="text-xl font-bold">
              {data.machinesOnline}
              <span className="text-sm font-normal text-gray-400"> / {data.machinesTotal}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Cycles (7d)</p>
            <p className="text-xl font-bold">{data.weekCycles}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Open Alerts</p>
            <p className={`text-xl font-bold ${data.openAlerts > 0 ? 'text-red-600' : ''}`}>
              {data.openAlerts}
            </p>
          </div>
        </div>

        {data.machines.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-medium">Machine</th>
                  <th className="pb-2 font-medium">Community</th>
                  <th className="pb-2 font-medium text-center">Status</th>
                  <th className="pb-2 font-medium text-right">Last Seen</th>
                  <th className="pb-2 font-medium text-right">Today</th>
                </tr>
              </thead>
              <tbody>
                {data.machines.map((m) => (
                  <tr key={m.name} className="border-b last:border-0">
                    <td className="py-2 font-medium">{m.name}</td>
                    <td className="py-2 text-gray-500">{m.community || '-'}</td>
                    <td className="py-2 text-center">
                      <Badge
                        variant="outline"
                        className={m.online ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                      >
                        {m.online ? 'Online' : 'Offline'}
                      </Badge>
                    </td>
                    <td className="py-2 text-right text-gray-500">{timeAgo(m.lastSeen)}</td>
                    <td className="py-2 text-right tabular-nums font-medium">{m.todayCycles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
