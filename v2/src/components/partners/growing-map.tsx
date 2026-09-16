'use client';

/**
 * The map that grows. Places arrive in the order the work reached them, and you can scrub it.
 *
 * Ben, 16 September 2026: a live map that grows under the arc. The point it makes is the one
 * the funder is actually in: Snow's money was there before most of these dots existed, so
 * watching them appear in time order is the catalytic argument without anyone asserting it.
 *
 * Reuses `project()` from the pitch map, so this and /pitch put a place in the same spot.
 * Autoplay only starts once the map is on screen, and reduced motion skips straight to the
 * full map with the scrubber still available.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { project } from '@/components/pitch/static-map';

export interface MapPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** YYYY-MM, when the work first reached here. Drives the order things appear. */
  since: string;
  beds: number;
  note: string;
}

const VIEW = { w: 620, h: 460 };
const STEP_MS = 900;

export function GrowingMap({ outline, places }: { outline: string; places: readonly MapPlace[] }) {
  const ordered = useMemo(() => places.slice().sort((a, b) => a.since.localeCompare(b.since)), [places]);
  const [upto, setUpto] = useState(0);
  const [running, setRunning] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) { setUpto(ordered.length); return; }
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setRunning(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [ordered.length]);

  useEffect(() => {
    if (!running || upto >= ordered.length) return;
    const t = setTimeout(() => setUpto((n) => n + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [running, upto, ordered.length]);

  const shown = ordered.slice(0, upto);
  const latest = shown[shown.length - 1] ?? null;
  const beds = shown.reduce((n, p) => n + p.beds, 0);

  return (
    <div ref={host} className="overflow-hidden rounded-[22px] border" style={{ borderColor: '#E8DED4', backgroundColor: '#FFFDF9' }}>
      <div className="grid md:grid-cols-[minmax(0,1.5fr)_minmax(250px,0.6fr)]">
        <figure className="m-0 p-4 md:p-6" style={{ backgroundColor: '#F6F0E6' }}>
          <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label={`Places reached, ${shown.length} of ${ordered.length}`} className="h-auto w-full">
            <g fill="#F6F0E6" stroke="#CFC6B6" strokeWidth={1} dangerouslySetInnerHTML={{ __html: outline }} />
            {shown.map((p, i) => {
              const { x, y } = project(p.lat, p.lng);
              const r = p.beds >= 100 ? 9 : p.beds >= 30 ? 7 : 5.5;
              const isLatest = i === shown.length - 1;
              return (
                <g key={p.id}>
                  <circle cx={x} cy={y} r={r * 2.6} fill="#C45C3E" opacity={isLatest ? 0.3 : 0.14} />
                  <circle cx={x} cy={y} r={r} fill="#C45C3E" stroke={isLatest ? '#2B2A26' : '#FBF8F1'} strokeWidth={isLatest ? 2 : 1.5} />
                  {isLatest && (
                    <text x={x + r + 6} y={y + 4} fontSize={13} fill="#2B2A26" style={{ fontWeight: 600 }}>{p.name}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </figure>

        <div className="p-5 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>
            {latest ? latest.since.replace('-', ' · ') : 'Before any of it'}
          </p>
          <p className="mt-2 font-display text-2xl leading-snug" style={{ color: '#2E2E2E' }}>
            {latest ? latest.name : 'One funder, no places yet'}
          </p>
          <p className="mt-2 min-h-[3.5rem] text-sm leading-relaxed" style={{ color: '#2E2E2E99' }}>
            {latest ? latest.note : 'Snow committed before there was a product, a register, a charity, a board or a customer.'}
          </p>
          <dl className="mt-5 flex gap-6">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#A99C8F' }}>Places</dt>
              <dd className="mt-1 font-display text-2xl leading-none" style={{ color: '#2E2E2E' }}>{shown.length}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#A99C8F' }}>Beds</dt>
              <dd className="mt-1 font-display text-2xl leading-none" style={{ color: '#2E2E2E' }}>{beds}</dd>
            </div>
          </dl>
          <label className="mt-5 block">
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#A99C8F' }}>Scrub the years</span>
            <input
              type="range"
              min={0}
              max={ordered.length}
              value={upto}
              onChange={(e) => { setRunning(false); setUpto(Number(e.target.value)); }}
              className="mt-2 w-full"
              aria-label="How far through the years to show"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
