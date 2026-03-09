import { Badge } from '@/components/ui/badge';
import type { UsageLog } from '@/lib/types/database';

interface EventHistoryTableProps {
  events: UsageLog[];
}

const eventTypeStyles: Record<string, string> = {
  cycle_complete: 'bg-green-100 text-green-800',
  heartbeat: 'bg-gray-100 text-gray-800',
  restart: 'bg-yellow-100 text-yellow-800',
  offline: 'bg-red-100 text-red-800',
  online: 'bg-blue-100 text-blue-800',
  firmware_update: 'bg-purple-100 text-purple-800',
};

export function EventHistoryTable({ events }: EventHistoryTableProps) {
  if (events.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">No events recorded</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2 font-medium">Time</th>
            <th className="pb-2 font-medium">Event</th>
            <th className="pb-2 font-medium text-right">kWh</th>
            <th className="pb-2 font-medium text-right">Total kWh</th>
            <th className="pb-2 font-medium text-right">RSSI</th>
            <th className="pb-2 font-medium text-right">Restarts</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b last:border-0">
              <td className="py-2 text-gray-500">
                {new Date(event.created_at).toLocaleString('en-AU', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td className="py-2">
                <Badge className={eventTypeStyles[event.event_type || ''] || eventTypeStyles.heartbeat}>
                  {event.event_type || 'unknown'}
                </Badge>
              </td>
              <td className="py-2 text-right tabular-nums">
                {event.power_kwh != null ? event.power_kwh.toFixed(2) : '\u2014'}
              </td>
              <td className="py-2 text-right tabular-nums text-gray-500">
                {event.energy_kwh_total != null
                  ? Number(event.energy_kwh_total).toFixed(1)
                  : '\u2014'}
              </td>
              <td className="py-2 text-right tabular-nums text-gray-500">
                {event.signal_rssi != null ? `${event.signal_rssi} dBm` : '\u2014'}
              </td>
              <td className="py-2 text-right tabular-nums text-gray-500">
                {event.restart_counter ?? '\u2014'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
