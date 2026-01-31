'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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
  fetchLive?: boolean;
}

const defaultStats: ImpactStat[] = [
  { value: 389, label: 'Beds Delivered' },
  { value: 8, label: 'Communities Served' },
  { value: 1500, label: 'Lives Impacted', prefix: '~' },
  { value: 100, label: 'Australian Made', suffix: '%' },
];

export function ImpactStats({
  stats: propStats,
  title = 'Our Impact',
  subtitle = 'Every bed tells a story of comfort, dignity, and care.',
  fetchLive = false,
}: ImpactStatsProps) {
  const [stats, setStats] = useState<ImpactStat[]>(propStats || defaultStats);
  const [loading, setLoading] = useState(fetchLive);

  useEffect(() => {
    if (!fetchLive) return;

    async function fetchStats() {
      try {
        const supabase = createClient();

        // Fetch total assets
        const { count: totalAssets } = await supabase
          .from('assets')
          .select('*', { count: 'exact', head: true });

        // Fetch unique communities
        const { data: communities } = await supabase
          .from('assets')
          .select('community')
          .not('community', 'is', null);

        const uniqueCommunities = new Set(communities?.map((a) => a.community)).size;

        // Estimate lives impacted (avg 4 people per household)
        const livesImpacted = (totalAssets || 0) * 4;

        setStats([
          { value: totalAssets || 0, label: 'Beds Delivered' },
          { value: uniqueCommunities, label: 'Communities Served' },
          { value: livesImpacted, label: 'Lives Impacted', prefix: '~' },
          { value: 100, label: 'Australian Made', suffix: '%' },
        ]);
      } catch (error) {
        console.error('Error fetching impact stats:', error);
        // Keep default stats on error
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [fetchLive]);

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
                {loading ? (
                  <span className="inline-block h-12 w-24 animate-pulse rounded bg-primary-foreground/20" />
                ) : (
                  <>
                    {stat.prefix}
                    {typeof stat.value === 'number'
                      ? stat.value.toLocaleString()
                      : stat.value}
                    {stat.suffix}
                  </>
                )}
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
