'use client';

/**
 * Where the beds have gone, drawn as one SVG: the Australia outline and a dot for every place,
 * sized by beds on the register. No tiles, so nothing to seam or load; the outline comes from
 * public/images/maps/australia-outline.svg (equirectangular, 620 by 460), read on the server
 * and passed in as a path string. Press a dot or a name in the list to read the place.
 */

import { useMemo, useState } from 'react';
import type { CommunityLocation } from '@/lib/data/content';

/** The outline's projection: equirectangular, fitted to the mainland and Tasmanian extremes. */
const VIEW = { w: 620, h: 460 };
const PROJ = { x0: 53.4, lon0: 113.2, lonPerPx: 0.07725, y0: 8.7, lat0: -10.7, latPerPx: 0.07678 };

export function project(lat: number, lng: number): { x: number; y: number } {
  return { x: PROJ.x0 + (lng - PROJ.lon0) / PROJ.lonPerPx, y: PROJ.y0 + (PROJ.lat0 - lat) / PROJ.latPerPx };
}

function dotRadius(beds: number): number {
  if (beds >= 100) return 9;
  if (beds >= 30) return 7;
  if (beds > 0) return 5.5;
  return 3.5;
}

export function StaticMap({ outline, locations }: { outline: string; locations: CommunityLocation[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => locations.find((l) => l.id === selectedId) ?? null, [locations, selectedId]);
  const ranked = useMemo(() => locations.filter((l) => l.bedsDelivered > 0).sort((a, b) => b.bedsDelivered - a.bedsDelivered), [locations]);
  const placed = useMemo(() => locations.map((l) => ({ ...l, ...project(l.lat, l.lng), r: dotRadius(l.bedsDelivered) })), [locations]);

  return (
    <div className="grid overflow-hidden rounded-[22px] border border-[#e6dfd1] bg-[#fffdf9] md:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.6fr)]">
      <figure className="m-0 bg-goods-cream-muted p-4 md:p-6">
        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label={`Map of Australia with ${ranked.length} places where beds have gone`} className="h-auto w-full">
          <g fill="#F6F0E6" stroke="#CFC6B6" strokeWidth={1} dangerouslySetInnerHTML={{ __html: outline }} />
          {placed.map((l) => {
            const active = l.id === selectedId;
            const labelLeft = l.tooltipDirection === 'left';
            return (
              <g key={l.id} className="cursor-pointer" onClick={() => setSelectedId(active ? null : l.id)} tabIndex={0} role="button" aria-label={`${l.name}, ${l.bedsDelivered} beds`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedId(active ? null : l.id); } }} style={{ outline: 'none' }}>
                <circle cx={l.x} cy={l.y} r={l.r * 2.6} fill="#C45C3E" opacity={active ? 0.28 : 0.14} />
                <circle cx={l.x} cy={l.y} r={l.r} fill="#C45C3E" stroke={active ? '#2B2A26' : '#FBF8F1'} strokeWidth={active ? 2 : 1.5} />
                <text x={labelLeft ? l.x - l.r - 6 : l.x + l.r + 6} y={l.y - 2} textAnchor={labelLeft ? 'end' : 'start'} fontFamily="'Playfair Display', Georgia, serif" fontSize={12} fill="#2B2A26" fontWeight={active ? 700 : 500}>
                  {l.name}
                </text>
                <text x={labelLeft ? l.x - l.r - 6 : l.x + l.r + 6} y={l.y + 10} textAnchor={labelLeft ? 'end' : 'start'} fontFamily="Inter, system-ui, sans-serif" fontSize={8.5} letterSpacing={0.6} fill="#6D6961">
                  {l.bedsDelivered > 0 ? `${l.bedsDelivered} ${l.bedsDelivered === 1 ? 'BED' : 'BEDS'}` : 'RELATIONSHIP'}
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className="mt-2 text-xs text-[#5d574c]">Beds on the register by place. Dots sized by count.</figcaption>
      </figure>
      <aside className="flex flex-col p-6 md:p-7">
        {!selected && (
          <>
            <p className="text-sm text-[#5d574c]">Beds on the register, by place</p>
            <ol className="mt-3">
              {ranked.map((l) => (
                <li key={l.id}>
                  <button type="button" onClick={() => setSelectedId(l.id)} className="flex min-h-11 w-full items-baseline justify-between gap-3 border-b border-[#e6dfd1] py-2 text-left hover:text-goods-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta">
                    <span className="font-display text-lg leading-tight">{l.name}</span>
                    <span className="text-sm tabular-nums text-[#5d574c]">{l.bedsDelivered}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-[#5d574c]">Counted from the asset register: beds deployed or allocated, by place, so the list runs ahead of the 540 reconciled as in community. Press a place or a dot.</p>
          </>
        )}
        {selected && (
          <div aria-live="polite">
            <p className="text-sm text-[#5d574c]">{selected.region}</p>
            <h3 className="mt-1 font-display text-3xl font-semibold leading-tight">{selected.name}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[#4a4741]">{selected.description}</p>
            <p className="mt-6 font-display text-5xl font-semibold leading-none text-goods-terracotta">{selected.bedsDelivered}</p>
            <p className="mt-1 text-sm text-[#5d574c]">beds on the register</p>
            <p className="mt-5 border-l-2 border-goods-terracotta pl-4 text-sm leading-relaxed text-[#4a4741]">{selected.highlight}</p>
            <button type="button" onClick={() => setSelectedId(null)} className="mt-6 min-h-11 rounded-full border border-goods-ink/30 px-4 text-sm font-semibold hover:border-goods-terracotta hover:text-goods-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta">
              All places
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
