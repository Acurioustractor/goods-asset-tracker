import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface WebhookHealth {
  source: string;
  last_24h: number;
  last_7d: number;
  errors_24h: number;
  last_received_at: string | null;
  distinct_machines_24h: number;
}

function hoursAgo(iso: string | null) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60)));
}

export function WebhookHealthBanner({ health }: { health: WebhookHealth[] }) {
  if (!health || health.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">Webhook receipts (last 24h)</h3>
            <p className="text-xs text-gray-500">
              How much telemetry actually landed on our endpoint, regardless of whether
              it ended up in `usage_logs`. Catches Zapier-side outages early.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {health.map((h) => {
              const last = hoursAgo(h.last_received_at);
              const isStale = last === null || last > 6;
              return (
                <div
                  key={h.source}
                  className={`rounded-lg border px-4 py-2 ${
                    isStale ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{h.source}</Badge>
                    {isStale && (
                      <Badge className="bg-amber-100 text-amber-800 text-xs">stale</Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold">{h.last_24h}</div>
                  <div className="text-xs text-gray-500">
                    {h.distinct_machines_24h} unique device(s)
                    {h.errors_24h > 0 && (
                      <span className="text-red-700"> · {h.errors_24h} errors</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {last === null ? 'never' : last === 0 ? 'just now' : `${last}h ago`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
