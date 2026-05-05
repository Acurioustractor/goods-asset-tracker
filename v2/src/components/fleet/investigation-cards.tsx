import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface InvestigationMachine {
  machine_id: string;
  display_name: string;
  community: string | null;
  household: string | null;
  asset_id: string | null;
  last_seen_at: string | null;
  last_event_type: string | null;
  last_firmware: string | null;
  total_cycle_events: number;
  monthly_activity: { month: string; events: number }[];
}

function daysAgo(iso: string | null) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function inferCause(m: InvestigationMachine): { label: string; reasoning: string; colour: string } {
  const days = daysAgo(m.last_seen_at);
  if (days === null) {
    return {
      label: 'Never reported',
      reasoning:
        'No telemetry has ever arrived for this coreid. Either the device was never installed, never powered, or it was never claimed under the active Particle account.',
      colour: 'bg-slate-100 text-slate-800',
    };
  }
  if (days < 2) {
    return {
      label: 'Healthy',
      reasoning: 'Reporting normally. This is the control case for the rest of the fleet.',
      colour: 'bg-emerald-100 text-emerald-800',
    };
  }
  if (m.total_cycle_events < 10 && days > 30) {
    return {
      label: 'Likely never properly commissioned',
      reasoning:
        'This device only ever produced a handful of events before going silent. Likely never installed properly, or was a test bench, or had a hardware fault from new.',
      colour: 'bg-purple-100 text-purple-800',
    };
  }
  if (m.last_event_type === 'heartbeat') {
    return {
      label: 'Cellular alive when it died',
      reasoning:
        "The very last message we received was a heartbeat, not a wash. That means the device's network connection was working at the moment it stopped — the break is unlikely to be wifi/cellular signal. More likely: the device was unplugged, the household power went out, or the SIM data plan exhausted shortly after.",
      colour: 'bg-amber-100 text-amber-800',
    };
  }
  if (m.total_cycle_events > 200) {
    return {
      label: 'Heavy use → possible SIM exhaustion',
      reasoning:
        'This device produced hundreds of events. Particle SIMs include a fixed monthly data quota; heavy users hit that ceiling first. F25 (still alive) likely sits on a different SIM plan.',
      colour: 'bg-amber-100 text-amber-800',
    };
  }
  if (days >= 30 && days <= 60) {
    return {
      label: 'In the late-March silence cluster',
      reasoning:
        'This device went silent within the March 21 – April 21 window, the same as several others. Most likely cause: the Particle account ownership change on March 3 expired this device\'s claim before F25\'s.',
      colour: 'bg-orange-100 text-orange-800',
    };
  }
  return {
    label: 'Silent — cause unclear',
    reasoning:
      "Investigate via the standard checklist: Particle Cloud last-seen → Zapier task history → physical inspection.",
    colour: 'bg-red-100 text-red-800',
  };
}

const INVESTIGATION_STEPS = [
  {
    title: 'LED check at the machine (5 min, no tech needed)',
    detail:
      'Open the access panel and look at the Particle Photon LED. Cyan breathing slowly = device is on Particle Cloud right now (it\'s a pipeline / claim issue). Cyan flashing fast = trying to connect (cellular/wifi issue). Green = wifi unavailable. Red = firmware crash. Off = power problem.',
  },
  {
    title: 'Particle Cloud "last seen"',
    detail:
      'Log into console.particle.io with the account that owns these devices. If the device shows recent activity there but our DB doesn\'t, the break is between Particle Cloud and our webhook (Zapier auth). If both show old, the device has stopped publishing entirely.',
  },
  {
    title: 'Particle SIM data balance',
    detail:
      'Particle SIMs have monthly data quotas. Console shows usage per device. If this one is at 100% of its plan, top up.',
  },
  {
    title: 'Zapier task history for this coreid',
    detail:
      'In the Zapier dashboard, filter the "Goods Washer" zap\'s task history by this coreid. If tasks are still firing → our side rejected them; check Vercel logs. If tasks stopped firing on a specific date → match it against any account / billing changes.',
  },
];

function Sparkline({ data }: { data: { month: string; events: number }[] }) {
  if (data.length === 0) {
    return <div className="text-xs text-gray-400">No recent activity</div>;
  }
  const max = Math.max(...data.map((d) => d.events), 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center" title={`${d.month}: ${d.events} events`}>
          <div
            className={`w-full ${d.events > 0 ? 'bg-blue-400' : 'bg-gray-200'} rounded-sm`}
            style={{ height: `${Math.max(2, (d.events / max) * 100)}%` }}
          />
          <div className="text-[9px] text-gray-400 mt-0.5">{d.month.slice(5)}</div>
        </div>
      ))}
    </div>
  );
}

export function InvestigationCards({ machines }: { machines: InvestigationMachine[] }) {
  if (machines.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Per-Machine Investigation</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Every machine that has ever sent a wash event. Use the cause hypothesis to pick a
          starting point, then work down the investigation checklist below each card.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {machines.map((m) => {
          const days = daysAgo(m.last_seen_at);
          const cause = inferCause(m);
          const isAlive = days !== null && days < 2;
          return (
            <details
              key={m.machine_id}
              className="border rounded-lg"
              open={!isAlive && (days ?? 0) < 30}
            >
              <summary className="cursor-pointer px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <div>
                    <div className="font-medium">
                      {m.display_name}
                      <span className="text-xs text-gray-400 ml-2">{m.machine_id}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {m.community || '—'}
                      {m.household ? ` · ${m.household}` : ''}
                      {m.asset_id ? ` · ${m.asset_id}` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cause.colour}>{cause.label}</Badge>
                  <span className="text-xs text-gray-500">
                    {days === null
                      ? 'never reported'
                      : isAlive
                      ? 'reporting now'
                      : `${days}d silent`}
                  </span>
                </div>
              </summary>
              <div className="border-t px-4 py-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs uppercase text-gray-500 font-medium">Last seen</div>
                    <div className="font-mono">
                      {m.last_seen_at
                        ? new Date(m.last_seen_at).toISOString().replace('T', ' ').slice(0, 19)
                        : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500 font-medium">Lifetime events</div>
                    <div className="font-mono">{m.total_cycle_events}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500 font-medium">Last event type</div>
                    <div className="font-mono">{m.last_event_type || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-gray-500 font-medium">Last firmware</div>
                    <div className="font-mono">{m.last_firmware || '—'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase text-gray-500 font-medium mb-1">
                    Activity, last 12 months
                  </div>
                  <Sparkline data={m.monthly_activity} />
                </div>

                <div className="rounded-lg bg-gray-50 p-3 text-sm leading-relaxed">
                  <div className="font-medium mb-1">Why probably {cause.label.toLowerCase()}</div>
                  <p className="text-gray-700">{cause.reasoning}</p>
                </div>

                {!isAlive && (
                  <div>
                    <div className="text-xs uppercase text-gray-500 font-medium mb-2">
                      Investigation checklist
                    </div>
                    <ol className="space-y-2 text-sm">
                      {INVESTIGATION_STEPS.map((step, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-mono text-xs bg-gray-200 rounded px-1.5 py-0.5 mt-0.5 shrink-0">
                            {i + 1}
                          </span>
                          <div>
                            <div className="font-medium">{step.title}</div>
                            <div className="text-gray-600 text-xs">{step.detail}</div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </CardContent>
    </Card>
  );
}
