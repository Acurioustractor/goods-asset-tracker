import type { SystemCheck, HealthStatus } from '@/app/admin/ops/actions';

const STATUS_STYLES: Record<HealthStatus, string> = {
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

const STATUS_BG: Record<HealthStatus, string> = {
  green: 'bg-green-50 border-green-200',
  amber: 'bg-amber-50 border-amber-200',
  red: 'bg-red-50 border-red-200',
};

export function SystemHealthStrip({ checks }: { checks: SystemCheck[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {checks.map((check) => (
        <div
          key={check.label}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${STATUS_BG[check.status]}`}
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_STYLES[check.status]}`} />
          <span className="font-medium text-gray-700">{check.label}</span>
          <span className="text-gray-500">{check.detail}</span>
        </div>
      ))}
    </div>
  );
}
