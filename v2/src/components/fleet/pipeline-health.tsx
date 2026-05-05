import { Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface PipelineHealth {
  reportingMachines: number;
  totalMachinesWithHardware: number;
  lastEventAt: string | null;
  webhookReceiptsLast24h: number;
}

function hoursAgo(iso: string | null) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60)));
}

export function PipelineHealthDiagram({ health }: { health: PipelineHealth }) {
  const lastEventHours = hoursAgo(health.lastEventAt);
  const ourSideHealthy = health.lastEventAt && lastEventHours !== null && lastEventHours <= 48;
  const onlyOneAlive = health.reportingMachines <= 1 && health.totalMachinesWithHardware > 1;

  const stages = [
    {
      name: 'Particle Photons',
      sub: `${health.totalMachinesWithHardware} devices in fleet`,
      health: onlyOneAlive
        ? ('failing' as const)
        : health.reportingMachines === 0
        ? ('failing' as const)
        : health.reportingMachines === health.totalMachinesWithHardware
        ? ('healthy' as const)
        : ('degraded' as const),
      detail: `${health.reportingMachines} of ${health.totalMachinesWithHardware} reporting`,
    },
    {
      name: 'Particle Cloud',
      sub: 'api.particle.io',
      health: ourSideHealthy ? ('healthy' as const) : ('unknown' as const),
      detail: ourSideHealthy
        ? 'Forwarding events for at least one device'
        : 'No events received from any device recently',
    },
    {
      name: 'Zapier zap',
      sub: 'Goods Washer',
      health: ourSideHealthy ? ('healthy' as const) : ('unknown' as const),
      detail: ourSideHealthy
        ? 'Firing for healthy devices'
        : 'No incoming webhooks observed',
    },
    {
      name: 'Our webhook',
      sub: 'POST /api/webhooks/particle',
      health: ourSideHealthy ? ('healthy' as const) : ('unknown' as const),
      detail:
        health.webhookReceiptsLast24h > 0
          ? `${health.webhookReceiptsLast24h} receipts in 24h`
          : 'Webhook receipt logging just started',
    },
    {
      name: 'usage_logs',
      sub: 'Supabase',
      health: 'healthy' as const,
      detail:
        lastEventHours === null
          ? 'never'
          : lastEventHours === 0
          ? 'last event just now'
          : `last event ${lastEventHours}h ago`,
    },
  ];

  const colour = (h: 'healthy' | 'degraded' | 'failing' | 'unknown') => {
    switch (h) {
      case 'healthy':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'degraded':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'failing':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };
  const dot = (h: 'healthy' | 'degraded' | 'failing' | 'unknown') => {
    switch (h) {
      case 'healthy':
        return 'bg-emerald-500';
      case 'degraded':
        return 'bg-amber-500';
      case 'failing':
        return 'bg-red-500';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Pipeline Health</CardTitle>
          <p className="text-xs text-gray-500">
            Each wash event must traverse all 5 stages. Trace failures left-to-right.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex items-stretch gap-2 min-w-max pb-2">
            {stages.map((s, i) => (
              <Fragment key={s.name}>
                <div
                  className={`flex-1 min-w-[180px] border rounded-lg px-3 py-3 ${colour(s.health)}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${dot(s.health)}`} />
                    <Badge variant="outline" className="text-xs bg-white/50">{i + 1}</Badge>
                    <span className="font-medium text-sm">{s.name}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{s.sub}</div>
                  <div className="text-xs">{s.detail}</div>
                </div>
                {i < stages.length - 1 && (
                  <div className="flex items-center text-gray-400 text-xl px-1">→</div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
        {onlyOneAlive && (
          <div className="mt-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm">
            <p className="font-semibold text-red-800 mb-1">
              Staggered device-side failure detected.
            </p>
            <p className="text-red-700 leading-relaxed">
              {health.reportingMachines} of {health.totalMachinesWithHardware} machines is
              still reporting. Because at least one device IS still producing events end-to-end,
              the pipeline (Particle Cloud → Zapier → our webhook → DB) is healthy. The break
              is at the device end of the chain. Most likely causes: per-device SIM data
              exhaustion, individual claim transfer issues after a Particle account ownership
              change, or per-household power loss.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
