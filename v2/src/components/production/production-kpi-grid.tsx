import { Card, CardContent } from '@/components/ui/card';

interface KPI {
  label: string;
  value: string | number;
  subtitle?: string;
}

interface ProductionKPIGridProps {
  kpis: KPI[];
}

export function ProductionKPIGrid({ kpis }: ProductionKPIGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
            <p className="text-2xl font-bold mt-1">{kpi.value}</p>
            {kpi.subtitle && (
              <p className="text-xs text-gray-400 mt-1">{kpi.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
