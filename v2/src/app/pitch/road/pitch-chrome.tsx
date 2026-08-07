'use client';

/**
 * The reading apparatus for `/pitch/road`. Content lives in `page.tsx` and `deck.ts`; this file
 * only decides what is shown, in what order, and how you move through it.
 *
 * It works on the rendered DOM by panel id rather than owning the markup, for one reason: the deck
 * is 1,253 lines of server-rendered sections with images, maps and video in them, and pulling that
 * through a client component would cost the streaming and the priority hints for no gain. Every
 * panel already carries the id this needs.
 *
 * Three modes, all driven from the query string so a link can carry them:
 *
 *   ?for=funder|supporter|press   which panels exist at all
 *   ?view=slides                  one panel per screen, arrow keys, counter
 *   (print)                       the browser's own print path, styled to one panel per page
 *
 * State is read from `window.location` in an effect and written back with `replaceState` rather
 * than through `useSearchParams`, which would force a Suspense boundary around the whole deck for
 * a nav bar.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_PACK,
  OPENER_HEADING,
  OPENER_LINES,
  PITCH_CHAPTERS,
  panelsForPack,
} from '@/lib/data/pitch-chrome';

type Mode = 'scroll' | 'slides';

export function PitchChrome() {
  const [mode, setMode] = useState<Mode>('scroll');
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [openerOpen, setOpenerOpen] = useState(false);

  const panels = useMemo(() => panelsForPack(DEFAULT_PACK), []);

  // Read the query string once on mount. Before this runs the page is the funder deck in scroll
  // mode, which is the correct no-JS result too.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const canPresent = window.matchMedia('(min-width: 640px)').matches;
    setMode(params.get('view') === 'slides' && canPresent ? 'slides' : 'scroll');
    if (!canPresent) params.delete('view');
    params.delete('for');
    const query = params.toString();
    const hash = window.location.hash;
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}${hash}` : `${window.location.pathname}${hash}`,
    );
    setReady(true);
  }, []);

  // Keep the URL honest, so any state a presenter reaches is a link they can send.
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    params.delete('for');
    if (mode === 'slides') params.set('view', 'slides');
    else params.delete('view');
    const query = params.toString();
    const hash = window.location.hash;
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}${hash}` : `${window.location.pathname}${hash}`,
    );
  }, [mode, ready]);

  /** Apply pack and mode to the rendered panels. The only place display is touched. */
  useEffect(() => {
    if (!ready) return;
    const visible = new Set(panels.map((panel) => panel.id));
    const all = document.querySelectorAll<HTMLElement>('[data-pitch-panel]');

    all.forEach((el) => {
      const id = el.dataset.pitchPanel ?? '';
      const inPack = visible.has(id);
      const isCurrent = mode === 'scroll' || panels[index]?.id === id;
      el.style.display = inPack && isCurrent ? '' : 'none';
    });

    document.body.dataset.pitchMode = mode;
    return () => {
      all.forEach((el) => {
        el.style.display = '';
      });
      delete document.body.dataset.pitchMode;
    };
  }, [panels, mode, index, ready]);

  // A pack change can leave the cursor past the end of a shorter cut.
  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(panels.length - 1, 0)));
  }, [panels.length]);

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => Math.min(Math.max(current + delta, 0), panels.length - 1));
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [panels.length],
  );

  // Arrow keys in slide mode, and Escape back to the scroll. Ignored while typing, because the
  // deck carries an inline editor.
  useEffect(() => {
    if (mode !== 'slides') return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        go(-1);
      } else if (event.key === 'Escape') {
        setMode('scroll');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, go]);

  // "Read this first" can be triggered from server-rendered markup (the cover button carries
  // data-opener-trigger); one delegated listener keeps the trigger a plain <button>. Escape
  // closes it from anywhere.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-opener-trigger]')) setOpenerOpen(true);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenerOpen(false);
    };
    document.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Scrollspy, so the nav names where you are rather than only where you can go.
  useEffect(() => {
    if (!ready || mode !== 'scroll') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const id = (hit.target as HTMLElement).dataset.pitchPanel;
        const next = panels.findIndex((panel) => panel.id === id);
        if (next >= 0) setIndex(next);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] },
    );
    document.querySelectorAll<HTMLElement>('[data-pitch-panel]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [panels, mode, ready]);

  const current = panels[index];
  const chapters = PITCH_CHAPTERS.filter((chapter) =>
    panels.some((panel) => panel.chapter === chapter.id),
  );

  return (
    <>
      {/* The "if you read nothing else" summary. Ben, 2026-08-06: as a beige block above the
          cover it read off-brand, so it is now an overlay behind a "Read this first" button
          (one on the cover via data-opener-trigger, one in the bar). Click anywhere or Escape
          to dismiss. */}
      {openerOpen && (
        <div
          data-pitch-opener
          role="dialog"
          aria-modal="true"
          aria-label={OPENER_HEADING}
          className="fixed inset-0 z-50 flex items-center justify-center bg-goods-ink/97 px-6 py-10 text-goods-cream backdrop-blur-sm"
          onClick={() => setOpenerOpen(false)}
        >
          <div className="max-h-full w-full max-w-[1000px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-goods-terracotta-light">
              {OPENER_HEADING}
            </p>
            <ol className="mt-8 space-y-6">
              {OPENER_LINES.map((line, i) => (
                <li key={line} className="flex gap-5 text-xl leading-9 md:text-2xl md:leading-10">
                  <span className="goods-pitch-display text-2xl leading-9 text-goods-terracotta-light md:text-3xl md:leading-10">{i + 1}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => setOpenerOpen(false)}
              className="mt-10 border border-white/35 px-6 py-3 text-sm font-semibold text-white hover:border-white"
            >
              Walk the road
            </button>
          </div>
        </div>
      )}

      {/* The bar. Sticky in scroll mode so wayfinding survives past the hero; fixed to the bottom
          in slide mode where it is the transport. */}
      <div
        data-pitch-bar
        className={`z-40 border-t border-white/15 bg-goods-ink/95 text-white backdrop-blur ${
          mode === 'slides' ? 'fixed inset-x-0 bottom-0' : 'sticky top-0 border-b border-t-0'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-5 gap-y-2 px-6 py-2.5 md:px-10 lg:px-14">
          {/* Fixed-width counter and buttons BEFORE the variable-width label, so Prev/Next
              never shift as the slide title changes length. */}
          <span className="w-12 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            {index + 1}/{panels.length}
          </span>

          {mode === 'slides' ? (
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="min-h-11 border border-white/25 px-3 py-2 text-xs disabled:opacity-30"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={index === panels.length - 1}
                className="min-h-11 border border-white/25 px-3 py-2 text-xs disabled:opacity-30"
              >
                Next
              </button>
              <span className="ml-3 max-w-[38vw] truncate text-sm font-semibold">{current?.label}</span>
            </span>
          ) : (
            <span className="flex items-center gap-4">
              <span className="max-w-[38vw] truncate text-sm font-semibold">{current?.label}</span>
              <button
                type="button"
                onClick={() => setNavOpen((open) => !open)}
                className="min-h-11 border border-white/25 px-3 py-2 text-xs"
                aria-expanded={navOpen}
              >
                {navOpen ? 'Hide contents' : 'Contents'}
              </button>
            </span>
          )}

          <span className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenerOpen(true)}
              className="min-h-11 border border-goods-terracotta px-3 py-2 text-xs text-goods-terracotta-light hover:border-goods-terracotta-light"
            >
              Read this first
            </button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'slides' ? 'scroll' : 'slides');
                setIndex(0);
                window.scrollTo({ top: 0 });
              }}
              className="hidden min-h-11 border border-white/25 px-3 py-2 text-xs sm:block"
            >
              {mode === 'slides' ? 'Read as page' : 'Present'}
            </button>
          </span>
        </div>

        {/* Contents, grouped by chapter so eighteen panels read as five parts. */}
        {navOpen && mode === 'scroll' && (
          <div className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-white/15 px-6 pb-5 pt-4 md:px-10 lg:max-h-none lg:px-14">
            <div className="mx-auto grid max-w-[1600px] gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {chapters.map((chapter) => (
                <div key={chapter.id}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta-light">
                    {chapter.label}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {panels
                      .filter((panel) => panel.chapter === chapter.id)
                      .map((panel) => (
                        <li key={panel.id}>
                          <a
                            href={`#${panel.id}`}
                            onClick={() => setNavOpen(false)}
                            className={`flex min-h-11 items-center py-2 text-sm hover:text-white sm:min-h-0 sm:py-0.5 ${
                              panel.id === current?.id ? 'text-white' : 'text-white/55'
                            }`}
                          >
                            {panel.label}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
