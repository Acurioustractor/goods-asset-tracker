'use client';

import dynamic from 'next/dynamic';
import type { CommunityLocation } from '@/lib/data/content';

// Leaflet touches `window` at import time, so the map must be client-only.
// Wrapped here so server components can render the page shell.
const CommunityMap = dynamic(
  () => import('@/components/community-map').then((m) => m.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center text-sm text-stone-500">
        Loading map…
      </div>
    ),
  },
);

export function CommunityMapClient({ locations }: { locations: CommunityLocation[] }) {
  return <CommunityMap locations={locations} storytellers={[]} />;
}
