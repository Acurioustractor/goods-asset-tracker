'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { CommunityLocation } from '@/lib/data/content';

const CommunityMap = dynamic(
  () => import('@/components/community-map').then((module) => module.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] items-center justify-center bg-goods-cream-muted text-sm text-goods-sub">
        Loading the live community map…
      </div>
    ),
  },
);

const pathwayByLocation: Record<string, string> = {
  'utopia-homelands': 'Pathway · collect + shred',
  'tennant-creek': 'Pathway · existing shed',
  'palm-island': 'Pathway · governance first',
  'alice-springs': 'Pathway · full facility',
};

export function RoadPitchMap({ locations }: { locations: CommunityLocation[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => locations.find((location) => location.id === selectedId),
    [locations, selectedId],
  );

  return (
    <div className="grid overflow-hidden border border-[#47453f] bg-goods-ink sm:grid-cols-[minmax(0,1.45fr)_minmax(250px,0.55fr)]">
      <div className="min-h-[430px] bg-goods-cream-muted">
        <CommunityMap
          locations={locations}
          storytellers={[]}
          selectedCommunity={selectedId}
          onSelectCommunity={setSelectedId}
          heightClassName="h-[400px] md:h-[460px]"
          showCaption={false}
          showNationalExtent
        />
      </div>

      <aside className="flex flex-col justify-between p-5 text-goods-cream md:p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta-light">
            {selected ? 'Selected place' : 'The national picture'}
          </p>
          {!selected && (
            <div className="mt-4">
              <h3 className="goods-pitch-display text-2xl leading-none lg:text-3xl">
                Products delivered across Australia. Four communities exploring local production.
              </h3>
              <p className="mt-3 text-xs leading-5 text-goods-grid lg:text-sm lg:leading-6">
                The dots show where products have been delivered. The four places below are working
                through what they want to make and own.
              </p>
              <div className="mt-4 space-y-1 border-t border-[#47453f] pt-3">
                {Object.entries(pathwayByLocation).map(([id, status]) => {
                  const location = locations.find((candidate) => candidate.id === id);
                  if (!location) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedId(id)}
                      className="flex min-h-11 w-full items-center justify-between gap-2 border-b border-[#47453f] py-2 text-left"
                    >
                      <span className="text-xs text-goods-cream lg:text-sm">{location.name}</span>
                      <span className="text-right font-mono text-[7px] uppercase tracking-[0.1em] text-goods-terracotta-light lg:text-[8px]">
                        {status.replace('Pathway · ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {selected && (
            <div className="mt-7" aria-live="polite">
              <p className="text-sm text-[#b9b3a8]">{selected.region}</p>
              <h3 className="goods-pitch-display mt-2 text-4xl leading-none">{selected.name}</h3>
              <p className="mt-6 text-base leading-7 text-goods-grid">{selected.description}</p>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-[#47453f] pt-6">
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9f998f]">
                    Beds recorded
                  </dt>
                  <dd className="goods-pitch-display mt-2 text-4xl text-goods-terracotta-light">
                    {selected.bedsDelivered}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#9f998f]">
                    Cleared voices
                  </dt>
                  <dd className="goods-pitch-display mt-2 text-4xl text-goods-terracotta-light">
                    {selected.storytellerCount}
                  </dd>
                </div>
              </dl>
              <p className="mt-6 border-l border-goods-terracotta-light pl-4 text-sm leading-6 text-[#b9b3a8]">
                {selected.highlight}
              </p>
              <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-goods-terracotta-light">
                {pathwayByLocation[selected.id] ?? 'Products delivered'}
              </p>
            </div>
          )}
        </div>

        {selected && (
          <div className="mt-7">
            <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
                className="border border-[#57544d] px-3 py-2 text-left text-xs text-goods-grid transition-colors hover:border-goods-terracotta-light"
            >
                Back to all places
            </button>
            </div>
            <Link
              href={`/communities/${selected.id}`}
              className="mt-6 inline-flex border-b border-goods-terracotta-light pb-1 text-sm text-goods-cream hover:text-goods-terracotta-light"
            >
              Open the place evidence page
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
