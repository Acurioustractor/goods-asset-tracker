import { Badge } from '@/components/ui/badge';

type MachineStatus = 'online' | 'offline' | 'stale';

interface MachineStatusBadgeProps {
  lastSeenAt: string | null;
  online?: boolean;
}

function getMachineStatus(lastSeenAt: string | null, online?: boolean): MachineStatus {
  if (online === false) return 'offline';
  if (!lastSeenAt) return 'offline';

  const hoursSinceLastSeen =
    (Date.now() - new Date(lastSeenAt).getTime()) / (1000 * 60 * 60);

  if (hoursSinceLastSeen > 48) return 'offline';
  if (hoursSinceLastSeen > 24) return 'stale';
  return 'online';
}

const statusStyles: Record<MachineStatus, string> = {
  online: 'bg-green-100 text-green-800',
  stale: 'bg-yellow-100 text-yellow-800',
  offline: 'bg-red-100 text-red-800',
};

const statusLabels: Record<MachineStatus, string> = {
  online: 'Online',
  stale: 'Stale',
  offline: 'Offline',
};

export function MachineStatusBadge({ lastSeenAt, online }: MachineStatusBadgeProps) {
  const status = getMachineStatus(lastSeenAt, online);

  return (
    <Badge className={statusStyles[status]}>
      {statusLabels[status]}
    </Badge>
  );
}
