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
  PITCH_APPENDICES,
  PITCH_CHAPTERS,
  PITCH_PACKS,
  panelsForPack,
  pitchPack,
  resolvePack,
  type PitchPackId,
} from '@/lib/data/pitch-chrome';

type Mode = 'scroll' | 'slides';

export function PitchChrome() {
  const [pack, setPack] = useState<PitchPackId>(DEFAULT_PACK);
  const [mode, setMode] = useState<Mode>('scroll');
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const panels = useMemo(() => panelsForPack(pack), [pack]);

  // Read the query string once on mount. Before this runs the page is the funder deck in scroll
  // mode, which is the correct no-JS result too.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPack(resolvePack(params.get('for') ?? undefined));
    setMode(params.get('view') === 'slides' ? 'slides' : 'scroll');
    setReady(true);
  }, []);

  // Keep the URL honest, so any state a presenter reaches is a link they can send.
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    if (pack === DEFAULT_PACK) params.delete('for');
    else params.set('for', pack);
    if (mode === 'slides') params.set('view', 'slides');
    else params.delete('view');
    const query = params.toString();
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }, [pack, mode, ready]);

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
      {/* The "if you read nothing else" block. First panel only, and never in slide mode, where
          the cover carries the same job with a photograph. */}
      {mode === 'scroll' && (
        <aside
          data-pitch-opener
          className="border-b border-[#d9d1c3] bg-[#f1ece4] px-6 py-10 md:px-10 lg:px-14"
        >
          <div className="mx-auto max-w-[1100px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
              {OPENER_HEADING}
            </p>
            <ol className="mt-6 space-y-4">
              {OPENER_LINES.map((line, i) => (
                <li key={line} className="flex gap-4 text-lg leading-8 text-[#2b2a26] md:text-xl md:leading-9">
                  <span className="font-mono text-[11px] leading-9 text-[#c45c3e]">{i + 1}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      )}

      {/* The bar. Sticky in scroll mode so wayfinding survives past the hero; fixed to the bottom
          in slide mode where it is the transport. */}
      <div
        data-pitch-bar
        className={`z-40 border-t border-white/15 bg-[#171714]/95 text-white backdrop-blur ${
          mode === 'slides' ? 'fixed inset-x-0 bottom-0' : 'sticky top-0 border-b border-t-0'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-5 gap-y-2 px-6 py-2.5 md:px-10 lg:px-14">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            {index + 1}/{panels.length}
          </span>
          <span className="max-w-[42vw] truncate text-sm font-semibold">{current?.label}</span>

          {mode === 'slides' ? (
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="border border-white/25 px-3 py-1 text-xs disabled:opacity-30"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={index === panels.length - 1}
                className="border border-white/25 px-3 py-1 text-xs disabled:opacity-30"
              >
                Next
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setNavOpen((open) => !open)}
              className="border border-white/25 px-3 py-1 text-xs"
              aria-expanded={navOpen}
            >
              {navOpen ? 'Hide contents' : 'Contents'}
            </button>
          )}

          <span className="ml-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="pitch-pack">Reader</label>
            <select
              id="pitch-pack"
              value={pack}
              onChange={(event) => {
                setPack(event.target.value as PitchPackId);
                setIndex(0);
              }}
              className="border border-white/25 bg-transparent px-2 py-1 text-xs text-white [&>option]:text-black"
              title={pitchPack(pack).blurb}
            >
              {PITCH_PACKS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'slides' ? 'scroll' : 'slides');
                setIndex(0);
                window.scrollTo({ top: 0 });
              }}
              className="border border-white/25 px-3 py-1 text-xs"
            >
              {mode === 'slides' ? 'Read as page' : 'Present'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-white/25 px-3 py-1 text-xs"
            >
              PDF
            </button>
          </span>
        </div>

        {/* Contents, grouped by chapter so eighteen panels read as five parts. */}
        {navOpen && mode === 'scroll' && (
          <div className="border-t border-white/15 px-6 pb-5 pt-4 md:px-10 lg:px-14">
            <div className="mx-auto grid max-w-[1600px] gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {chapters.map((chapter) => (
                <div key={chapter.id}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d97a59]">
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
                            className={`block truncate py-0.5 text-sm hover:text-white ${
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

            {/* Appendices. Named here so the supporting surfaces stay reachable FROM the deck
                rather than competing with it as separate front doors. */}
            <div className="mx-auto mt-5 max-w-[1600px] border-t border-white/15 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d97a59]">
                Appendices
              </p>
              <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                {PITCH_APPENDICES.map((appendix) => (
                  <li key={appendix.href}>
                    <a
                      href={appendix.href}
                      title={appendix.answers}
                      className="text-sm text-white/55 underline-offset-4 hover:text-white hover:underline"
                    >
                      {appendix.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
