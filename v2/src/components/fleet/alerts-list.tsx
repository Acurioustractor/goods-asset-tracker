'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Alert } from '@/lib/types/database';
import { useRouter } from 'next/navigation';

interface AlertsListProps {
  alerts: Alert[];
}

const severityStyles: Record<string, string> = {
  Critical: 'bg-red-100 text-red-800',
  High: 'bg-orange-100 text-orange-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-blue-100 text-blue-800',
};

const typeLabels: Record<string, string> = {
  machine_offline: 'Machine Offline',
  high_energy_usage: 'High Energy',
  frequent_restarts: 'Frequent Restarts',
  peer_divergence: 'Peer Divergence',
  rising_energy: 'Rising Energy',
};

function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function AlertsList({ alerts }: AlertsListProps) {
  const router = useRouter();

  async function resolveAlert(alertId: string) {
    try {
      const res = await fetch('/api/admin/fleet/resolve-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alertId }),
      });
      if (!res.ok) {
        console.error('Failed to resolve alert');
        return;
      }
      router.refresh();
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  }

  if (alerts.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">No open alerts</p>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Card key={alert.id}>
          <CardContent className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center gap-3">
              <Badge className={severityStyles[alert.severity] || severityStyles.info}>
                {alert.severity}
              </Badge>
              <span className="font-medium text-sm">
                {typeLabels[alert.type] || alert.type}
              </span>
              <span className="text-sm text-gray-500 truncate max-w-xs">
                {alert.details || 'No details'}
              </span>
              <span className="text-xs text-gray-400">
                {timeAgo(alert.created_at)}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => resolveAlert(alert.id)}
            >
              Resolve
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
