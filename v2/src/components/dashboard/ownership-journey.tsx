'use client';

import { useEffect, useRef, useState } from 'react';

const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

export type JourneyStage = {
  /** Stable key, e.g. the OwnershipStage value. */
  key: string;
  /** Reader-facing label, e.g. "Community owned". */
  label: string;
  /** One editorial sentence on what this stage means for community ownership. */
  meaning: string;
  /** Facilities currently parked at this stage (name + host community). */
  facilities: { facility: string; hostCommunity: string }[];
};

/**
 * The one signature scroll interaction on the dashboard (redesign critique P1-2):
 * every productive asset travels Planned → Built → Operating → Community-run →
 * Community-owned, and the destination is the whole point. A sticky "ownership
 * ladder" pins on the left while stage panels scroll past on the right; the active
 * rung advances as you read. Named stages only, no invented ownership-percent.
 *
 * Graceful everywhere: on mobile the ladder drops and each panel carries its own
 * step header; in print the ladder is hidden and the panels collapse to a clean
 * stacked list (no 60vh gaps).
 */
export function OwnershipJourney({ stages }: { stages: JourneyStage[] }) {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Advance the active rung to the panel whose centre is nearest the viewport centre.
  useEffect(() => {
    const els = panelRefs.current.filter((el): el is HTMLLIElement => !!el);
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const mid = window.innerHeight / 2;
        const best = visible.reduce((a, b) => {
          const da = Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - mid);
          const db = Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - mid);
          return da <= db ? a : b;
        });
        const idx = Number((best.target as HTMLElement).dataset.idx);
        if (!Number.isNaN(idx)) setActive(idx);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stages.length]);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,250px)_minmax(0,1fr)] lg:gap-10">
      {/* Pinned ladder — desktop only, off in print (the panels carry it on paper).
          top-36 clears the section's own sticky header band. */}
      <div className="hidden lg:block print:hidden" aria-hidden>
        <div className="lg:sticky lg:top-36">
          <Ladder stages={stages} active={active} />
        </div>
      </div>

      {/* The stage panels: the real, semantic content. */}
      <ol className="min-w-0">
        {stages.map((s, i) => {
          const reached = i <= active;
          return (
            <li
              key={s.key}
              data-idx={i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className="flex min-h-[46vh] flex-col justify-center border-t py-8 first:border-t-0 print:min-h-0 print:break-inside-avoid print:py-4"
              style={{ borderColor: '#E8DED4' }}
            >
              {/* Step header (does the ladder's job on mobile and on paper). */}
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm transition-colors"
                  style={{
                    backgroundColor: reached ? RUST : '#FFFFFF',
                    color: reached ? '#FFFFFF' : `${CHARCOAL}80`,
                    border: `1px solid ${reached ? RUST : '#E8DED4'}`,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: `${CHARCOAL}80` }}>
                  Step {i + 1} of {stages.length}
                  {i === stages.length - 1 ? ' · the destination' : ''}
                </p>
              </div>

              <h3 className="font-display text-2xl leading-tight sm:text-3xl" style={{ color: CHARCOAL }}>
                {s.label}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
                {s.meaning}
              </p>

              {s.facilities.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {s.facilities.map((f) => (
                    <span
                      key={f.facility}
                      className="inline-flex flex-col rounded-lg px-3.5 py-2.5"
                      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
                    >
                      <span className="text-sm font-semibold" style={{ color: CHARCOAL }}>{f.facility}</span>
                      <span className="text-[11px] uppercase tracking-wide" style={{ color: SAGE }}>{f.hostCommunity}</span>
                    </span>
                  ))}
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                    style={{ backgroundColor: '#E6EDDD', color: '#4F6138', border: '1px solid #CBD8BA' }}
                  >
                    Here now
                  </span>
                </div>
              ) : (
                <p className="mt-5 text-sm italic leading-relaxed" style={{ color: `${CHARCOAL}80` }}>
                  Still ahead of us. This is where the work is going.
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** The sticky rail: a vertical ladder of stages, filling up to the active rung. */
function Ladder({ stages, active }: { stages: JourneyStage[]; active: number }) {
  return (
    <ol className="relative">
      {/* The spine */}
      <span className="absolute bottom-3 left-[7px] top-3 w-px" style={{ backgroundColor: '#E8DED4' }} aria-hidden />
      <span
        className="absolute left-[7px] top-3 w-px origin-top transition-[height] duration-300"
        style={{
          backgroundColor: RUST,
          height: `calc((100% - 1.5rem) * ${stages.length > 1 ? active / (stages.length - 1) : 0})`,
        }}
        aria-hidden
      />
      {stages.map((s, i) => {
        const reached = i <= active;
        const current = i === active;
        const isLast = i === stages.length - 1;
        return (
          <li key={s.key} className="relative flex items-start gap-3.5 pb-7 last:pb-0">
            <span
              className="relative z-10 mt-0.5 inline-block shrink-0 rounded-full transition-all duration-300"
              style={{
                height: current ? 15 : 11,
                width: current ? 15 : 11,
                marginLeft: current ? 0 : 2,
                backgroundColor: reached ? RUST : '#FFFFFF',
                border: `2px solid ${reached ? RUST : '#D8CFC4'}`,
                boxShadow: current ? `0 0 0 4px ${RUST}1f` : 'none',
              }}
            />
            <span className="min-w-0">
              <span
                className="block text-sm leading-tight transition-colors"
                style={{ color: current ? RUST : reached ? CHARCOAL : `${CHARCOAL}80`, fontWeight: current ? 700 : 500 }}
              >
                {s.label}
                {isLast ? <span className="ml-1.5" aria-hidden>★</span> : null}
              </span>
              {s.facilities.length > 0 ? (
                <span className="mt-0.5 block text-[11px] leading-tight" style={{ color: `${CHARCOAL}80` }}>
                  {s.facilities.map((f) => f.facility).join(', ')}
                </span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
