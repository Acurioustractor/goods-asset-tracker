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
  /** Machines in community here. Zero is a real answer and draws no sage ring. */
  washers: number;
  note: string;
}

const VIEW = { w: 620, h: 460 };
const STEP_MS = 900;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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
  const washers = shown.reduce((n, p) => n + p.washers, 0);
  const allBeds = ordered.reduce((n, p) => n + p.beds, 0);
  /** Month to something a person reads: 2024-10 becomes October 2024. */
  const readable = (since: string) => {
    const [y, m] = since.split('-');
    return `${MONTHS[Number(m) - 1] ?? ''} ${y}`.trim();
  };

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
                  {p.washers > 0 && (
                    <circle cx={x} cy={y} r={r + 4} fill="none" stroke="#8B9D77" strokeWidth={2} opacity={0.9} />
                  )}
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
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[
              { k: 'Places', v: shown.length, c: '#2E2E2E' },
              { k: 'Beds', v: beds, c: '#C45C3E' },
              { k: 'Machines', v: washers, c: '#6F8257' },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#A99C8F' }}>{s.k}</dt>
                <dd className="mt-1.5 font-display text-4xl leading-none tabular-nums" style={{ color: s.c }}>{s.v}</dd>
              </div>
            ))}
          </dl>

          {/* Growth, as the thing itself: one segment per place, sized by its beds, filling
              left to right as the years run. A bar of totals would have said less. */}
          <div className="mt-5 flex h-2 gap-0.5 overflow-hidden rounded-full" style={{ backgroundColor: '#EFE7DB' }}>
            {ordered.map((p, i) => (
              <span
                key={p.id}
                className="block h-full transition-opacity duration-500"
                style={{
                  width: `${(p.beds / allBeds) * 100}%`,
                  backgroundColor: i === shown.length - 1 ? '#A8492C' : '#C45C3E',
                  opacity: i < shown.length ? 1 : 0.12,
                }}
              />
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#A99C8F' }}>Scrub the years</span>
              <span className="font-display text-sm" style={{ color: '#C45C3E' }}>
                {latest ? readable(latest.since) : 'Before any of it'}
              </span>
            </div>
            <div className="relative mt-3.5 h-4">
              <span className="absolute inset-x-1 top-1.5 block h-px" style={{ backgroundColor: '#E0D6C8' }} />
              <span
                className="absolute left-1 top-1.5 block h-px transition-all duration-500"
                style={{
                  width: `calc(${ordered.length > 1 ? (Math.max(0, shown.length - 1) / (ordered.length - 1)) * 100 : 0}% - 0.25rem)`,
                  backgroundColor: '#C45C3E',
                }}
              />
              {ordered.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setRunning(false); setUpto(i + 1); }}
                  className="absolute top-0 flex h-4 w-4 -translate-x-1/2 items-center justify-center"
                  style={{ left: `calc(0.25rem + ${ordered.length > 1 ? (i / (ordered.length - 1)) * 100 : 0}% - ${ordered.length > 1 ? (i / (ordered.length - 1)) * 0.5 : 0}rem)` }}
                  aria-label={`${p.name}, ${readable(p.since)}`}
                  aria-current={i === shown.length - 1}
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: i === shown.length - 1 ? 11 : 8,
                      height: i === shown.length - 1 ? 11 : 8,
                      backgroundColor: i < shown.length ? '#C45C3E' : '#E0D6C8',
                      boxShadow: i === shown.length - 1 ? '0 0 0 3px rgba(196,92,62,0.22)' : 'none',
                    }}
                  />
                </button>
              ))}
            </div>
            <label className="sr-only" htmlFor="scrub-years">How far through the years to show</label>
            <input
              id="scrub-years" type="range" min={0} max={ordered.length} value={upto}
              onChange={(e) => { setRunning(false); setUpto(Number(e.target.value)); }}
              className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full opacity-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
