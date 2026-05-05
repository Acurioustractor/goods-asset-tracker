import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface SilenceEvent {
  machine_id: string;
  display_name: string;
  community: string | null;
  last_seen_at: string | null;
  total_cycle_events: number;
  last_firmware: string | null;
  status: string;
}

function daysAgo(iso: string | null) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function SilenceTimeline({ events }: { events: SilenceEvent[] }) {
  const withDates = events
    .filter((e) => e.last_seen_at)
    .sort(
      (a, b) =>
        new Date(b.last_seen_at!).getTime() - new Date(a.last_seen_at!).getTime()
    );

  if (withDates.length === 0) return null;

  const maxEvents = Math.max(...withDates.map((e) => e.total_cycle_events || 1));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Silence Timeline — When Each Machine Last Reported</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Sorted most-recent-first. Bar length shows lifetime activity. A staggered
          tail means a per-device problem; a single cliff means a global problem.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {withDates.map((e) => {
            const days = daysAgo(e.last_seen_at) ?? 0;
            const widthPct = Math.max(2, ((e.total_cycle_events || 0) / maxEvents) * 100);
            const isAlive = days < 2;
            const isRecent = days < 14 && !isAlive;
            const colour = isAlive
              ? 'bg-emerald-500'
              : isRecent
              ? 'bg-amber-500'
              : 'bg-red-400';
            const textColour = isAlive
              ? 'text-emerald-800'
              : isRecent
              ? 'text-amber-800'
              : 'text-red-700';
            return (
              <div key={e.machine_id} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3 text-sm">
                  <div className="font-medium truncate">{e.display_name}</div>
                  <div className="text-xs text-gray-400 truncate">{e.community || '—'}</div>
                </div>
                <div className="col-span-6 relative h-6 bg-gray-100 rounded">
                  <div
                    className={`absolute left-0 top-0 bottom-0 ${colour} rounded`}
                    style={{ width: `${widthPct}%` }}
                  />
                  <span className="absolute left-2 top-0 bottom-0 flex items-center text-xs text-white font-medium drop-shadow">
                    {e.total_cycle_events} events lifetime
                  </span>
                </div>
                <div className={`col-span-3 text-xs ${textColour}`}>
                  <div className="font-medium">
                    {isAlive
                      ? 'Reporting now'
                      : days === 1
                      ? 'silent 1 day'
                      : `silent ${days} days`}
                  </div>
                  <div className="text-gray-400">
                    last {new Date(e.last_seen_at!).toISOString().slice(0, 10)}
                    {e.last_firmware ? ` · fw ${e.last_firmware}` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
