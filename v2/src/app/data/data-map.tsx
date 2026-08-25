'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { CommunityLocation } from '@/lib/data/content';

const CommunityMap = dynamic(
  () => import('@/components/community-map').then((module) => module.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[460px] items-center justify-center bg-goods-cream-muted text-sm text-goods-sub">
        Loading the community map…
      </div>
    ),
  },
);

/** Serializable per-place read, built server-side from canon + community-need. */
export interface PlaceRead {
  /** communityLocations id (utopia-homelands, tennant-creek, …). */
  locationId: string;
  name: string;
  beds: number;
  bedsSplit: string;
  washers: number;
  plasticKg: number;
  /** null = unmeasured; reason says why. */
  need: {
    pct: number;
    short: number;
    occupied: number;
    ilocName: string;
    caveat?: string;
  } | null;
  gapReason?: string;
}

export function DataMap({ locations, reads }: { locations: CommunityLocation[]; reads: PlaceRead[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const byId = useMemo(() => new Map(reads.map((r) => [r.locationId, r])), [reads]);
  const selected = selectedId ? byId.get(selectedId) : null;

  return (
    <div className="grid overflow-hidden rounded-2xl border border-goods-grid bg-goods-card sm:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.55fr)]">
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

      <aside className="flex flex-col p-5 md:p-6">
        {!selected ? (
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-goods-terracotta">
              The national picture
            </p>
            <p className="mt-3 text-sm leading-relaxed text-goods-sub">
              Each dot is a place the register holds delivered products for. Select one to see
              its delivered counts beside the measured setting. The table below carries the
              same numbers with their sources.
            </p>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-goods-terracotta">
              Selected place
            </p>
            <h3 className="mt-2 text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
              {selected.name}
            </h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-goods-sub">Beds delivered</dt>
                <dd className="text-right font-semibold tabular-nums">
                  {selected.beds}
                  <span className="block text-xs font-normal text-goods-sub">{selected.bedsSplit}</span>
                </dd>
              </div>
              {selected.washers > 0 ? (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-goods-sub">Washing machines</dt>
                  <dd className="font-semibold tabular-nums">{selected.washers}</dd>
                </div>
              ) : null}
              {selected.plasticKg > 0 ? (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-goods-sub">HDPE diverted</dt>
                  <dd className="font-semibold tabular-nums">~{selected.plasticKg.toLocaleString()}kg</dd>
                </div>
              ) : null}
              {selected.need ? (
                <div className="border-t border-goods-grid pt-3">
                  <dt className="text-goods-sub">Households short a bedroom · ABS 2021</dt>
                  <dd className="mt-1 font-semibold tabular-nums">
                    {selected.need.short.toLocaleString()} of {selected.need.occupied.toLocaleString()}{' '}
                    ({selected.need.pct}%)
                  </dd>
                  <dd className="mt-1 text-xs text-goods-sub">
                    ILOC {selected.need.ilocName}
                    {selected.need.caveat ? ` · ${selected.need.caveat}` : ''}
                  </dd>
                </div>
              ) : (
                <div className="border-t border-goods-grid pt-3">
                  <dt className="text-goods-sub">Households short a bedroom</dt>
                  <dd className="mt-1 text-xs leading-snug text-goods-sub">
                    {selected.gapReason ?? 'Not yet measured.'}
                  </dd>
                </div>
              )}
            </dl>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="mt-auto pt-4 text-left text-xs text-goods-terracotta underline underline-offset-2"
            >
              Back to the national picture
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
