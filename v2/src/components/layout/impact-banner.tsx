'use client';

import { usePathname } from 'next/navigation';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';

const stats = [
  { value: String(CANONICAL_ASSETS.bedsDeployed), label: 'beds across Australia' },
  { value: String(CANONICAL_ASSETS.communitiesServed), label: 'communities' },
  { value: '20kg', label: 'plastic diverted per bed' },
];

export function ImpactBanner() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-2.5 text-xs sm:text-sm overflow-x-auto gap-6 sm:gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-bold">{stat.value}</span>
              <span className="text-background/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
