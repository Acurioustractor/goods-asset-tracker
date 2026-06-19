import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';

interface ImpactStat {
  value: number | string;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface ImpactStatsProps {
  stats?: ImpactStat[];
  title?: string;
  subtitle?: string;
}

// Canon quartet. Single source of truth: asset-canonical.ts. These are CURATED
// figures, deliberately NOT raw register row counts (the register holds more
// rows than the curated totals, e.g. washers). Claim ceiling: we show what we
// have placed, never a claimed health outcome such as "lives impacted".
const defaultStats: ImpactStat[] = [
  { value: CANONICAL_ASSETS.bedsDeployed, label: 'Beds delivered' },
  { value: CANONICAL_ASSETS.communitiesServed, label: 'Communities' },
  { value: CANONICAL_ASSETS.washersInCommunity, label: 'Washing machines in community' },
  { value: CANONICAL_ASSETS.plasticKg, label: 'Plastic diverted', suffix: 'kg' },
];

export function ImpactStats({
  stats = defaultStats,
  title = 'Our Impact',
  subtitle = 'Beds and washing machines in homes across remote Australia.',
}: ImpactStatsProps) {
  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-lg text-primary-foreground/80">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary-foreground md:text-5xl">
                {stat.prefix}
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                {stat.suffix}
              </div>
              <div className="mt-2 text-sm font-medium text-primary-foreground/80 md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
