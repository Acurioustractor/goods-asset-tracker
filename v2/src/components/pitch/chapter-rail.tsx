'use client';

/**
 * Where you are in the pitch on a wide screen: a thin rail down the right edge, one dot per
 * chapter, the current one filled and named, the rest revealing their name on hover or focus.
 * Phones have no rail: the floating chapter menu (pitch-menu.tsx) names the chapter and jumps
 * anywhere (Ben, 15 Sep 2026: drop the bottom bar, give the screen back). Driven by an
 * IntersectionObserver over the chapter sections; reduced motion only removes the transitions.
 */

import { useEffect, useState } from 'react';

export interface RailChapter {
  id: string;
  number: string;
  label: string;
}

export function ChapterRail({ chapters }: { chapters: readonly RailChapter[] }) {
  const [active, setActive] = useState<string>(chapters[0]?.id ?? '');

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // The chapter whose top edge most recently crossed the upper third of the window.
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive((visible[0].target as HTMLElement).id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  const index = Math.max(0, chapters.findIndex((c) => c.id === active));

  return (
    <nav aria-label="Chapters" className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block xl:right-8">
      <ol className="flex flex-col items-end gap-2">
        {chapters.map((c, i) => {
          const isActive = c.id === active;
          return (
            <li key={c.id} className="group flex items-center justify-end gap-3">
              <a
                href={`#${c.id}`}
                aria-current={isActive ? 'location' : undefined}
                className="flex items-center gap-3 rounded-full py-1 pl-3 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-goods-terracotta"
              >
                <span
                  className={`whitespace-nowrap rounded-full bg-goods-ink/90 px-3 py-1 text-xs font-semibold text-goods-cream shadow-sm transition-opacity duration-200 motion-reduce:transition-none ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                  }`}
                >
                  <span className="mr-1.5 text-goods-terracotta-light">{c.number}</span>
                  {c.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`block rounded-full border-2 transition-all duration-200 motion-reduce:transition-none ${
                    isActive ? 'h-3.5 w-3.5 border-goods-terracotta bg-goods-terracotta' : i < index ? 'h-2.5 w-2.5 border-goods-terracotta/70 bg-goods-terracotta/70' : 'h-2.5 w-2.5 border-goods-ink/40 bg-transparent group-hover:border-goods-terracotta'
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
