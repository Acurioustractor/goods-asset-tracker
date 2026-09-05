'use client';

/**
 * The reading apparatus for the QBE story: a contents bar that names where you are, a slide mode
 * (`?view=slides`, one chapter per screen, arrow keys), and the browser's print path styled to one
 * chapter per page. Same shape as `/pitch/road`'s chrome, over the chapters in `qbe-story.ts`, and
 * like it working on the rendered DOM by `data-story-chapter` id so the page itself stays server
 * rendered with its images, maps and video.
 */
import { useCallback, useEffect, useState } from 'react';
import { STORY_PARTS, type StoryChapter } from '@/lib/data/qbe-story';

type Mode = 'scroll' | 'slides';

export function StoryChrome({ chapters }: { chapters: readonly StoryChapter[] }) {
  const [mode, setMode] = useState<Mode>('scroll');
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const canPresent = window.matchMedia('(min-width: 640px)').matches;
    // The query string is external state read once on mount; the no-JS render is the scroll mode.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(params.get('view') === 'slides' && canPresent ? 'slides' : 'scroll');
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    if (mode === 'slides') params.set('view', 'slides');
    else params.delete('view');
    const query = params.toString();
    const hash = window.location.hash;
    window.history.replaceState(null, '', query ? `${window.location.pathname}?${query}${hash}` : `${window.location.pathname}${hash}`);
  }, [mode, ready]);

  useEffect(() => {
    if (!ready) return;
    const all = document.querySelectorAll<HTMLElement>('[data-story-chapter]');
    all.forEach((el) => {
      const id = el.dataset.storyChapter ?? '';
      const isCurrent = mode === 'scroll' || chapters[index]?.id === id;
      el.style.display = isCurrent ? '' : 'none';
    });
    document.body.dataset.storyMode = mode;
    return () => {
      all.forEach((el) => {
        el.style.display = '';
      });
      delete document.body.dataset.storyMode;
    };
  }, [chapters, mode, index, ready]);

  const go = useCallback(
    (delta: number) => {
      setIndex((current) => Math.min(Math.max(current + delta, 0), chapters.length - 1));
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [chapters.length],
  );

  useEffect(() => {
    if (mode !== 'slides') return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return;
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

  useEffect(() => {
    if (!ready || mode !== 'scroll') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const id = (hit.target as HTMLElement).dataset.storyChapter;
        const next = chapters.findIndex((c) => c.id === id);
        if (next >= 0) setIndex(next);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.1, 0.25] },
    );
    document.querySelectorAll<HTMLElement>('[data-story-chapter]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [chapters, mode, ready]);

  const current = chapters[index];

  return (
    <div
      data-story-bar
      className={`z-40 border-white/15 bg-goods-ink/95 text-white backdrop-blur print:hidden ${
        mode === 'slides' ? 'fixed inset-x-0 bottom-0 border-t' : 'sticky top-0 border-b'
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-5 gap-y-2 px-6 py-2.5 md:px-10 lg:px-14">
        <span className="w-12 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
          {index + 1}/{chapters.length}
        </span>
        {mode === 'slides' ? (
          <span className="flex items-center gap-2">
            <button type="button" onClick={() => go(-1)} disabled={index === 0} className="min-h-11 border border-white/25 px-3 py-2 text-xs disabled:opacity-30">
              Prev
            </button>
            <button type="button" onClick={() => go(1)} disabled={index === chapters.length - 1} className="min-h-11 border border-white/25 px-3 py-2 text-xs disabled:opacity-30">
              Next
            </button>
            <span className="ml-3 max-w-[38vw] truncate text-sm font-semibold">{current?.label}</span>
          </span>
        ) : (
          <span className="flex items-center gap-4">
            <span className="max-w-[38vw] truncate text-sm font-semibold">{current?.label}</span>
            <button type="button" onClick={() => setNavOpen((o) => !o)} className="min-h-11 border border-white/25 px-3 py-2 text-xs" aria-expanded={navOpen}>
              {navOpen ? 'Hide contents' : 'Contents'}
            </button>
          </span>
        )}
        <span className="ml-auto flex items-center gap-2">
          <a href="#faq" className="hidden min-h-11 items-center border border-goods-terracotta px-3 py-2 text-xs text-goods-terracotta-light hover:border-goods-terracotta-light sm:flex">
            Questions
          </a>
          <button type="button" onClick={() => window.print()} className="hidden min-h-11 border border-white/25 px-3 py-2 text-xs sm:block">
            Print
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

      {navOpen && mode === 'scroll' && (
        <div className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-white/15 px-6 pb-5 pt-4 md:px-10 lg:max-h-none lg:px-14">
          <div className="mx-auto grid max-w-[1500px] gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STORY_PARTS.map((part) => (
              <div key={part.id}>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta-light">{part.label}</p>
                <ul className="mt-2 space-y-1">
                  {chapters
                    .filter((c) => c.part === part.id)
                    .map((c) => (
                      <li key={c.id}>
                        <a
                          href={`#${c.id}`}
                          onClick={() => setNavOpen(false)}
                          className={`flex min-h-11 items-center py-2 text-sm hover:text-white sm:min-h-0 sm:py-0.5 ${c.id === current?.id ? 'text-white' : 'text-white/55'}`}
                        >
                          {c.label}
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
  );
}
