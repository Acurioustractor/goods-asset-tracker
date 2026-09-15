'use client';

/**
 * Chapter 11's road, told as six steps. The scenes are borrowed from the Utopia field note and
 * each one carries the step it shows; a step bar pinned to the foot of the window lights the
 * step whose scene is crossing the middle of the screen. Press a step to jump to its first scene.
 */

import { useEffect, useRef, useState } from 'react';
import { TripStory } from '@/components/stories/trip-story';
import type { TripStory as TripStoryData } from '@/lib/data/trip-stories';

export interface JourneyStep {
  step: string;
  who: string;
  what: string;
}

export interface JourneyScene {
  step: number;
  story: TripStoryData;
}

export function UtopiaJourney({ steps, scenes }: { steps: readonly JourneyStep[]; scenes: JourneyScene[] }) {
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrap.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    root.querySelectorAll('[data-step]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [scenes.length]);

  const jump = (i: number) => {
    const target = wrap.current?.querySelector(`[data-step="${i}"]`);
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  const current = steps[active];

  return (
    <div ref={wrap} className="relative bg-[#0e0b07]">
      {scenes.map((scene, i) => (
        <div key={i} data-step={scene.step}>
          <TripStory story={scene.story} footer={false} css={i === 0} />
        </div>
      ))}
      <div className="pointer-events-none sticky bottom-0 z-40 h-0">
        <nav
          aria-label="From purchase to the next program"
          className={`pointer-events-auto absolute inset-x-0 bottom-4 mx-auto w-[min(1120px,calc(100%-2rem))] rounded-2xl border border-white/10 bg-[#0e0b07]/80 p-1.5 text-goods-cream shadow-2xl backdrop-blur-md transition-opacity duration-500 ${active < 0 ? 'opacity-0' : 'opacity-100'}`}
        >
          <ol className="hidden grid-cols-6 gap-1 md:grid">
            {steps.map((s, i) => (
              <li key={s.step}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={i === active ? 'step' : undefined}
                  className={`h-full w-full rounded-xl px-3 py-2 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-goods-terracotta ${i === active ? 'bg-goods-terracotta text-white' : i < active ? 'text-goods-cream/80 hover:bg-white/5' : 'text-goods-cream/45 hover:bg-white/5'}`}
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-wide">0{i + 1} · {s.step}</span>
                  <span className="mt-0.5 block font-display text-sm font-semibold leading-tight">{s.who}</span>
                  <span className="mt-0.5 hidden text-xs leading-snug opacity-80 lg:block">{s.what}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="px-3 py-2 md:hidden" aria-live="polite">
            <div className="flex gap-1" aria-hidden="true">
              {steps.map((s, i) => (
                <span key={s.step} className={`h-1 flex-1 rounded-full ${i <= active ? 'bg-goods-terracotta' : 'bg-white/15'}`} />
              ))}
            </div>
            {current && (
              <p className="mt-2 text-sm">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-goods-terracotta-light">0{active + 1} · {current.step}</span>{' '}
                <span className="font-semibold">{current.who}</span> {current.what}
              </p>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
