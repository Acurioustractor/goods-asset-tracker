import { Card, CardContent } from '@/components/ui/card';
import type { ImpactKPIs } from '@/app/admin/ops/actions';

interface KPIItem {
  label: string;
  value: string | number;
  subtitle?: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function OpsKPIGrid({ kpis }: { kpis: ImpactKPIs }) {
  const items: KPIItem[] = [
    { label: 'Beds in Communities', value: kpis.bedsInCommunities, subtitle: 'deployed' },
    { label: 'Washing Machines', value: kpis.washingMachinesDeployed, subtitle: 'deployed' },
    { label: 'Communities Served', value: kpis.communitiesServed },
    { label: 'Lives Impacted', value: formatNumber(kpis.livesImpacted), subtitle: 'assets x 2.5' },
    { label: 'Wash Cycles', value: formatNumber(kpis.washCyclesAllTime), subtitle: 'all time' },
    { label: 'Plastic Diverted', value: `${formatNumber(kpis.plasticDivertedKg)} kg`, subtitle: '20kg per bed' },
    { label: 'Published Stories', value: kpis.publishedStories, subtitle: 'Empathy Ledger' },
    { label: 'Beds Possible', value: kpis.bedsPossibleFromStock, subtitle: 'from current stock' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
            <p className="text-2xl font-bold mt-1 tabular-nums">{item.value}</p>
            {item.subtitle && (
              <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
