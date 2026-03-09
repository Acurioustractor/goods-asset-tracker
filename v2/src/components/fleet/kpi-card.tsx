import { Card, CardContent } from '@/components/ui/card';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function KPICard({ label, value, subtitle, trend }: KPICardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-bold">{value}</p>
          {trend && trend !== 'neutral' && (
            <span
              className={
                trend === 'up'
                  ? 'text-sm text-green-600'
                  : 'text-sm text-red-600'
              }
            >
              {trend === 'up' ? '\u2191' : '\u2193'}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
