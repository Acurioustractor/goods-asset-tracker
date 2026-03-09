import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MachineStatusBadge } from './machine-status-badge';
import type { MachineOverview } from '@/lib/types/database';

interface MachineListTableProps {
  machines: MachineOverview[];
}

function timeAgo(dateString: string | null): string {
  if (!dateString) return 'Never';
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function MachineListTable({ machines }: MachineListTableProps) {
  if (machines.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No machines registered. Link machines by setting machine_id on assets.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-medium">Machine</th>
            <th className="pb-3 font-medium">Community</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Last Seen</th>
            <th className="pb-3 font-medium text-right">Today</th>
            <th className="pb-3 font-medium text-right">Week kWh</th>
            <th className="pb-3 font-medium text-right">kWh/cycle</th>
            <th className="pb-3 font-medium text-right">Alerts</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {machines.map((machine) => (
            <tr key={machine.machine_id} className="border-b last:border-0">
              <td className="py-4">
                <Link
                  href={`/admin/fleet/${encodeURIComponent(machine.machine_id)}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {machine.name || machine.machine_id}
                </Link>
                {machine.firmware_version && (
                  <span className="ml-2 text-xs text-gray-400">
                    {machine.firmware_version}
                  </span>
                )}
              </td>
              <td className="py-4 text-sm text-gray-600">
                {machine.community || machine.site_name || '\u2014'}
              </td>
              <td className="py-4">
                <MachineStatusBadge
                  lastSeenAt={machine.last_seen_at}
                  online={machine.online}
                />
              </td>
              <td className="py-4 text-sm text-gray-500">
                {timeAgo(machine.last_seen_at)}
              </td>
              <td className="py-4 text-right tabular-nums">
                {machine.today_cycles}
              </td>
              <td className="py-4 text-right tabular-nums">
                {machine.week_kwh.toFixed(1)}
              </td>
              <td className="py-4 text-right tabular-nums">
                {machine.avg_kwh_per_cycle > 0
                  ? machine.avg_kwh_per_cycle.toFixed(2)
                  : '\u2014'}
              </td>
              <td className="py-4 text-right">
                {machine.open_alert_count > 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                    {machine.open_alert_count}
                  </span>
                )}
              </td>
              <td className="py-4">
                <Link href={`/admin/fleet/${encodeURIComponent(machine.machine_id)}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
