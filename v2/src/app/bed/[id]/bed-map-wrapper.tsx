'use client';

import dynamic from 'next/dynamic';

const BedMap = dynamic(() => import('./bed-map').then((m) => m.BedMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] md:h-[400px] rounded-2xl bg-muted animate-pulse flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Loading map...</p>
    </div>
  ),
});

interface BedMapWrapperProps {
  currentAssetId: string;
  assets: { unique_id: string; community: string; gps: string; product: string; status: string }[];
}

export function BedMapWrapper({ currentAssetId, assets }: BedMapWrapperProps) {
  return <BedMap currentAssetId={currentAssetId} assets={assets} />;
}
