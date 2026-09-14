'use client';

/**
 * The live map for the pitch: every place beds have gone, counted from the asset register,
 * with a ranked list beside it. Leaflet touches `window`, so the map is client-only.
 */

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { CommunityLocation } from '@/lib/data/content';

const CommunityMap = dynamic(() => import('@/components/community-map').then((m) => m.CommunityMap), {
  ssr: false,
  loading: () => <div className="flex h-[420px] items-center justify-center text-sm text-[#7a7363] md:h-[560px]">Loading the live map…</div>,
});

export function PitchMap({ locations }: { locations: CommunityLocation[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => locations.find((l) => l.id === selectedId) ?? null, [locations, selectedId]);
  const ranked = useMemo(() => locations.filter((l) => l.bedsDelivered > 0).sort((a, b) => b.bedsDelivered - a.bedsDelivered), [locations]);

  return (
    <div className="grid overflow-hidden rounded-[22px] border border-[#e6dfd1] bg-[#fffdf9] md:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.6fr)]">
      <div className="min-h-[420px] bg-goods-cream-muted">
        <CommunityMap locations={locations} storytellers={[]} selectedCommunity={selectedId} onSelectCommunity={setSelectedId} heightClassName="h-[420px] md:h-[600px]" showCaption={false} showNationalExtent />
      </div>
      <aside className="flex flex-col p-6 md:p-7">
        {!selected && (
          <>
            <p className="text-sm text-[#7a7363]">Beds on the register, by place</p>
            <ol className="mt-3">
              {ranked.map((l) => (
                <li key={l.id}>
                  <button type="button" onClick={() => setSelectedId(l.id)} className="flex min-h-11 w-full items-baseline justify-between gap-3 border-b border-[#e6dfd1] py-2 text-left hover:text-goods-terracotta">
                    <span className="font-display text-lg leading-tight">{l.name}</span>
                    <span className="text-sm tabular-nums text-[#7a7363]">{l.bedsDelivered}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-[#7a7363]">Counted from the asset register: beds deployed or allocated, by place, so the list runs ahead of the 540 reconciled as in community. Press a place or a dot.</p>
          </>
        )}
        {selected && (
          <div aria-live="polite">
            <p className="text-sm text-[#7a7363]">{selected.region}</p>
            <h3 className="mt-1 font-display text-3xl font-semibold leading-tight">{selected.name}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[#4a4741]">{selected.description}</p>
            <p className="mt-6 font-display text-5xl font-semibold leading-none text-goods-terracotta">{selected.bedsDelivered}</p>
            <p className="mt-1 text-sm text-[#7a7363]">beds on the register</p>
            <p className="mt-5 border-l-2 border-goods-terracotta pl-4 text-sm leading-relaxed text-[#4a4741]">{selected.highlight}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => setSelectedId(null)} className="min-h-11 rounded-full border border-goods-ink/30 px-4 text-sm font-semibold hover:border-goods-terracotta hover:text-goods-terracotta">
                All places
              </button>
              <Link href={`/communities/${selected.id}`} className="inline-flex min-h-11 items-center rounded-full bg-goods-ink px-4 text-sm font-semibold text-goods-cream">
                The place page
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
