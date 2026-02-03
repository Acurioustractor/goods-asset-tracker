import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Impact',
  description: 'See the real impact of Goods on Country. Live statistics on beds delivered, communities served, and lives changed.',
};

interface ImpactStats {
  totalAssets: number;
  totalBeds: number;
  totalWashingMachines: number;
  communitiesServed: number;
  communityBreakdown: { community: string; count: number }[];
}

async function getImpactStats(): Promise<ImpactStats> {
  const supabase = await createClient();

  // Get total assets count
  const { count: totalAssets } = await supabase
    .from('assets')
    .select('*', { count: 'exact', head: true });

  // Get beds count
  const { count: totalBeds } = await supabase
    .from('assets')
    .select('*', { count: 'exact', head: true })
    .ilike('product_type', '%bed%');

  // Get washing machines count
  const { count: totalWashingMachines } = await supabase
    .from('assets')
    .select('*', { count: 'exact', head: true })
    .ilike('product_type', '%washing%');

  // Get community breakdown
  const { data: communityData } = await supabase
    .from('assets')
    .select('community');

  // Count by community
  const communityCounts = (communityData || []).reduce((acc, asset) => {
    const community = asset.community || 'Unknown';
    acc[community] = (acc[community] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const communityBreakdown = Object.entries(communityCounts)
    .map(([community, count]) => ({ community, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalAssets: totalAssets || 0,
    totalBeds: totalBeds || 0,
    totalWashingMachines: totalWashingMachines || 0,
    communitiesServed: Object.keys(communityCounts).length,
    communityBreakdown,
  };
}

async function ImpactDashboard() {
  const stats = await getImpactStats();

  return (
    <>
      {/* Main Stats */}
      <section className="py-12" style={{ backgroundColor: '#C45C3E' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-light text-white mb-1">{stats.totalAssets}</p>
              <p className="text-sm text-white/90 font-medium">Items Delivered</p>
              <p className="text-xs text-white/60 mt-1">Total assets tracked</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-light text-white mb-1">{stats.totalBeds}</p>
              <p className="text-sm text-white/90 font-medium">Beds</p>
              <p className="text-xs text-white/60 mt-1">Stretch & basket beds</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-light text-white mb-1">{stats.totalWashingMachines}</p>
              <p className="text-sm text-white/90 font-medium">Washing Machines</p>
              <p className="text-xs text-white/60 mt-1">Essential appliances</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-light text-white mb-1">{stats.communitiesServed}</p>
              <p className="text-sm text-white/90 font-medium">Communities</p>
              <p className="text-xs text-white/60 mt-1">Across Australia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Breakdown */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                Where We Work
              </p>
              <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                Deliveries by Community
              </h2>
            </div>

            <div className="space-y-6">
              {stats.communityBreakdown.map(({ community, count }) => {
                const percentage = Math.round((count / stats.totalAssets) * 100);
                return (
                  <div key={community}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium" style={{ color: '#2E2E2E' }}>{community}</span>
                      <span style={{ color: '#5E5E5E' }}>{count} items ({percentage}%)</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#E8DED4' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percentage}%`, backgroundColor: '#C45C3E' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Multiplier */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Ripple Effect
            </p>
            <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              The Bigger Picture
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <Card className="border-0 shadow-sm" style={{ backgroundColor: '#FDF8F3' }}>
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#C45C3E' }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-light mb-2" style={{ color: '#C45C3E' }}>
                  {Math.round(stats.totalAssets * 2.5)}+
                </p>
                <p className="font-medium" style={{ color: '#2E2E2E' }}>People Impacted</p>
                <p className="text-sm" style={{ color: '#5E5E5E' }}>Avg. 2.5 people per bed</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm" style={{ backgroundColor: '#FDF8F3' }}>
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#8B9D77' }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <p className="text-3xl font-light mb-2" style={{ color: '#8B9D77' }}>
                  {(stats.totalBeds * 365 * 8).toLocaleString()}+
                </p>
                <p className="font-medium" style={{ color: '#2E2E2E' }}>Hours of Better Sleep</p>
                <p className="text-sm" style={{ color: '#5E5E5E' }}>Per year across all beds</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm" style={{ backgroundColor: '#FDF8F3' }}>
              <CardContent className="p-6 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#C45C3E' }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-3xl font-light mb-2" style={{ color: '#C45C3E' }}>
                  {Math.round(stats.totalBeds * 21)}kg
                </p>
                <p className="font-medium" style={{ color: '#2E2E2E' }}>Plastic Diverted</p>
                <p className="text-sm" style={{ color: '#5E5E5E' }}>21kg per bed from landfill</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Progress to 1000 */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-white/60 mb-4">Our Goal</p>
            <h2 className="text-3xl font-light text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Progress to 1,000 Beds
            </h2>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/80 mb-2">
                <span>Current Progress</span>
                <span>{stats.totalBeds} / 1,000 beds</span>
              </div>
              <div className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(stats.totalBeds / 1000) * 100}%`, backgroundColor: '#C45C3E' }}
                />
              </div>
            </div>

            <p className="text-white/70">
              {1000 - stats.totalBeds} beds to go. Help us reach our goal.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function ImpactSkeleton() {
  return (
    <section className="py-12" style={{ backgroundColor: '#C45C3E' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="h-12 bg-white/20 rounded animate-pulse mx-auto w-24 mb-2" />
              <div className="h-4 bg-white/20 rounded animate-pulse mx-auto w-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ImpactPage() {
  return (
    <main style={{ backgroundColor: '#FDF8F3' }}>
      {/* Header */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Live Data
            </p>
            <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Our Impact
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#5E5E5E' }}>
              Real-time statistics from our asset tracking system. Every number represents
              a real item delivered to a real family.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <Suspense fallback={<ImpactSkeleton />}>
        <ImpactDashboard />
      </Suspense>

      {/* How We Track */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                Transparency
              </p>
              <h2 className="text-3xl font-light mb-4" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                How We Track Our Impact
              </h2>
              <p style={{ color: '#5E5E5E' }}>
                Every item we deliver is tracked from creation to delivery and beyond
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: 'QR Code Tracking',
                  description: 'Every item has a unique QR code that links to its full history.',
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  ),
                },
                {
                  title: 'Check-in System',
                  description: 'Regular check-ins ensure items are still in use and in good condition.',
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  ),
                },
                {
                  title: 'Real-time Dashboard',
                  description: 'All data feeds directly from our operational database.',
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#C45C3E' }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: '#5E5E5E' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#C45C3E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Be Part of This Impact
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Every bed purchased or sponsored adds to these numbers and changes a family&apos;s life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-white/90" style={{ color: '#C45C3E' }} asChild>
              <Link href="/shop">Shop Beds</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/sponsor">Sponsor a Bed</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
