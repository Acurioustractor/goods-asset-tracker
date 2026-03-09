import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MachineOverview } from '@/lib/types/database';

interface FleetRecommendationsProps {
  machines: MachineOverview[];
  fleetMedianKwhPerCycle: number;
  commentary: Array<{ machine_id: string; commentary: string; commentary_type: string }>;
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  machine?: string;
}

export function FleetRecommendations({
  machines,
  fleetMedianKwhPerCycle,
  commentary,
}: FleetRecommendationsProps) {
  const recommendations: Recommendation[] = [];

  // Offline machines
  const offlineMachines = machines.filter((m) => !m.online);
  if (offlineMachines.length > 0) {
    recommendations.push({
      priority: offlineMachines.length > 3 ? 'high' : 'medium',
      title: `${offlineMachines.length} machine${offlineMachines.length > 1 ? 's' : ''} offline`,
      description: `${offlineMachines.map((m) => m.name || m.machine_id).join(', ')} — check power and network connectivity. These machines may need a site visit.`,
    });
  }

  // Efficiency outliers (>30% above fleet median)
  const onlineMachines = machines.filter((m) => m.online && m.avg_kwh_per_cycle > 0);
  for (const m of onlineMachines) {
    if (fleetMedianKwhPerCycle > 0 && m.avg_kwh_per_cycle > fleetMedianKwhPerCycle * 1.3) {
      recommendations.push({
        priority: 'medium',
        title: `${m.name || m.machine_id} using ${((m.avg_kwh_per_cycle / fleetMedianKwhPerCycle - 1) * 100).toFixed(0)}% more energy than fleet average`,
        description: `${m.avg_kwh_per_cycle.toFixed(3)} kWh/cycle vs fleet median ${fleetMedianKwhPerCycle.toFixed(3)}. May indicate overloading, hot water use, or mechanical issue.`,
        machine: m.machine_id,
      });
    }
  }

  // Low-usage machines (online but very few cycles)
  for (const m of onlineMachines) {
    if (m.week_kwh > 0 && m.today_cycles === 0 && m.week_kwh < 0.5) {
      recommendations.push({
        priority: 'low',
        title: `${m.name || m.machine_id} has very low usage`,
        description: `Only ${m.week_kwh.toFixed(2)} kWh this week. Machine may not be accessible to the household or could have an issue.`,
        machine: m.machine_id,
      });
    }
  }

  // Maintenance flags from commentary
  const maintenanceNotes = commentary.filter(
    (c) => c.commentary_type === 'maintenance' || c.commentary.includes('firmware')
  );
  for (const note of maintenanceNotes) {
    recommendations.push({
      priority: 'low',
      title: note.machine_id === 'fleet' ? 'Fleet update' : `${note.machine_id}`,
      description: note.commentary,
    });
  }

  if (recommendations.length === 0) {
    return null;
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const priorityStyles = {
    high: 'border-l-4 border-l-red-500 bg-red-50',
    medium: 'border-l-4 border-l-yellow-500 bg-yellow-50',
    low: 'border-l-4 border-l-blue-500 bg-blue-50',
  };

  const priorityLabels = {
    high: 'Action needed',
    medium: 'Monitor',
    low: 'Info',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className={`p-3 rounded-r-lg ${priorityStyles[rec.priority]}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {priorityLabels[rec.priority]}
                </span>
              </div>
              <p className="font-medium text-sm">{rec.title}</p>
              <p className="text-sm text-gray-600 mt-0.5">{rec.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
