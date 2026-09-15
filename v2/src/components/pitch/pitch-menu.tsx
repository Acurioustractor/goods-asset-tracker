'use client';

/**
 * The pitch's own menu, in place of the site header. One button floats at the top of the screen
 * and names the chapter you are in. It opens a full-screen contact sheet: a tile per chapter with
 * its photograph under a dark mask, the number and the name. Tiles reveal from the bottom one
 * after another, lift their mask and sharpen on hover, and the chapter you are in is marked.
 * Press a tile to close the sheet and land on that chapter. Two columns on a phone, a mixed grid
 * on a wide screen. Escape closes it and focus goes back to the button.
 */

import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { TILE_CELLS, type TileSpan } from '@/lib/data/pitch-menu';

export interface MenuChapter {
  id: string;
  number: string;
  label: string;
  src: string;
  drawing?: boolean;
  span: TileSpan;
  position?: string;
}

const SPAN: Record<TileSpan, string> = {
  big: 'col-span-2 row-span-2',
  wide: 'col-span-2',
  one: '',
};

// Literal class names, so Tailwind sees every one: how many columns the last tile takes.
const LAST_BASE: Record<number, string> = { 1: 'col-span-1', 2: 'col-span-2' };
const LAST_SM: Record<number, string> = { 1: 'sm:col-span-1', 2: 'sm:col-span-2', 3: 'sm:col-span-3' };
const LAST_LG: Record<number, string> = { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4', 5: 'lg:col-span-5' };

/** The last tile stretches across whatever the final row has left, at each column count. */
function lastTileClass(chapters: readonly MenuChapter[]): string {
  const last = chapters[chapters.length - 1];
  if (!last) return '';
  const cells = chapters.reduce((n, c) => n + TILE_CELLS[c.span].cells, 0);
  const cols = (count: number) => Math.min(count, TILE_CELLS[last.span].cols + ((count - (cells % count)) % count));
  return `${LAST_BASE[cols(2)]} ${LAST_SM[cols(3)]} ${LAST_LG[cols(5)]}`;
}

export function PitchMenu({ chapters, title, extra }: { chapters: readonly MenuChapter[]; title: string; /** Sits beside the menu button, e.g. the Contact Goods button. */ extra?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(chapters[0]?.id ?? '');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Which chapter is on screen: the one crossing the upper third.
  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent((visible[0].target as HTMLElement).id);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Anything on the page can open the menu by dispatching a pitch-menu:open event.
  useEffect(() => {
    const openMenu = () => setOpen(true);
    window.addEventListener('pitch-menu:open', openMenu);
    return () => window.removeEventListener('pitch-menu:open', openMenu);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => {
      document.body.style.overflow = '';
      document.getElementById(id)?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  };

  const here = chapters.find((c) => c.id === current);

  return (
    <>
      <style>{`
        @keyframes pm-in{from{clip-path:inset(100% 0 0 0 round 18px);transform:translateY(24px)}to{clip-path:inset(0 0 0 0 round 18px);transform:none}}
        @keyframes pm-fade{from{opacity:0}to{opacity:1}}
        .pm-sheet{animation:pm-fade 280ms ease both}
        .pm-tile{animation:pm-in 700ms cubic-bezier(.2,.7,.2,1) both}
        @media (prefers-reduced-motion: reduce){.pm-sheet,.pm-tile{animation:none!important}.pm-img{transition:none!important}}
      `}</style>

      <div className="fixed right-4 top-4 z-[70] flex items-center gap-2 lg:right-6 lg:top-6">
      {extra}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 bg-[#16140f]/85 py-1.5 pl-2 pr-4 text-goods-cream shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors hover:bg-[#16140f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta"
      >
        <span className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded-full bg-goods-terracotta" aria-hidden="true">
          <span className="block h-0.5 w-4 rounded-full bg-white" />
          <span className="block h-0.5 w-4 rounded-full bg-white" />
          <span className="block h-0.5 w-2.5 self-center rounded-full bg-white" />
        </span>
        <span className="text-sm font-semibold">
          <span className="sr-only">Open the chapters. You are in </span>
          {here ? (
            <>
              <span className="mr-1.5 text-goods-terracotta-light">{here.number}</span>
              <span className="hidden sm:inline">{here.label}</span>
              <span className="sm:hidden">Chapters</span>
            </>
          ) : (
            'Chapters'
          )}
        </span>
      </button>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={`${title}: chapters`} className="pm-sheet fixed inset-0 z-[80] flex flex-col bg-[#16140f] text-goods-cream">
          <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">Goods on Country</p>
              <p className="mt-0.5 font-display text-xl font-semibold md:text-2xl">{title}</p>
            </div>
            <button ref={closeRef} type="button" onClick={close} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta">
              <X className="h-4 w-4" aria-hidden="true" />
              Close
            </button>
          </div>

          <nav aria-label="Chapters" className="min-h-0 flex-1 overflow-y-auto px-3 pb-8 md:px-8 lg:px-10">
            <ol className="grid grid-flow-dense auto-rows-[140px] grid-cols-2 gap-2.5 sm:auto-rows-[170px] sm:grid-cols-3 lg:auto-rows-[clamp(150px,19vh,210px)] lg:grid-cols-5 lg:gap-3">
              {chapters.map((c, i) => {
                const isHere = c.id === current;
                const isLast = i === chapters.length - 1;
                return (
                  <li key={c.id} className={`pm-tile ${isLast ? `${lastTileClass(chapters)} ${c.span === 'big' ? 'row-span-2' : ''}` : SPAN[c.span]}`} style={{ animationDelay: `${60 + i * 35}ms` }}>
                    <a
                      href={`#${c.id}`}
                      onClick={(e) => go(e, c.id)}
                      aria-current={isHere ? 'location' : undefined}
                      className={`group relative block h-full overflow-hidden rounded-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta ${c.drawing ? 'bg-[#FBF8F1]' : 'bg-[#2b2a26]'} ${isHere ? 'ring-2 ring-goods-terracotta ring-offset-2 ring-offset-[#16140f]' : ''}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.src}
                        alt=""
                        loading="lazy"
                        style={c.position ? { objectPosition: c.position } : undefined}
                        className={`pm-img absolute inset-0 h-full w-full transition duration-700 ease-out ${c.drawing ? 'object-contain px-3 pb-12 pt-3 group-hover:scale-[1.02]' : 'object-cover group-hover:scale-[1.05]'}`}
                      />
                      {!c.drawing && <span className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-500 group-hover:opacity-80" aria-hidden="true" />}
                      <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 font-display text-[15px] font-semibold md:text-base ${c.drawing ? 'bg-[#A8643F] text-white' : 'bg-black/45 text-white backdrop-blur-sm'}`}>{c.number}</span>
                      {isHere && <span className="absolute right-3 top-3 rounded-full bg-goods-terracotta px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">You are here</span>}
                      <span className={`absolute inset-x-3.5 bottom-3 font-display text-lg font-semibold leading-tight text-balance transition-transform duration-500 group-hover:-translate-y-1 md:inset-x-4 md:bottom-4 md:text-2xl ${c.drawing ? 'text-goods-ink' : 'text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]'} ${c.span === 'big' ? 'lg:text-4xl' : ''}`}>
                        {c.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      )}
    </>
  );
}
