'use client';

import dynamic from 'next/dynamic';
import { communityLocations } from '@/lib/data/content';

// Leaflet touches `window` at import time, so the map must be client-only.
const CommunityMap = dynamic(
  () => import('@/components/community-map').then((m) => m.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[480px] flex items-center justify-center text-sm"
        style={{ backgroundColor: '#FDF8F3', color: '#8B9D77' }}
      >
        Loading map…
      </div>
    ),
  }
);

export function FunderMap() {
  return (
    <div className="h-[480px]">
      <CommunityMap locations={communityLocations} storytellers={[]} />
    </div>
  );
}
