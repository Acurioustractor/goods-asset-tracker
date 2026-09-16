'use client';

/**
 * The opening. A headline beside a mosaic of the archive that quietly changes while you read.
 *
 * Ben, 16 September 2026: the hero was a headline on cream with half the screen empty, and
 * this report is about two years of being in places together. So the places are the hero.
 *
 * How it behaves. Nine tiles, one of which runs the Gamardi film muted and looping so there
 * is motion without a full-screen video fighting the words. Every few seconds one tile, never
 * the film and never the tile you are pointing at, crossfades to another frame from the pool.
 * Pointing at a tile or tabbing to it holds it still and names it, because a photograph that
 * changes while you are reading its caption is worse than one that never moved.
 *
 * Reduced motion turns the whole thing into a still grid. No crossfade, no cycling, and the
 * film gets its poster instead of playing. The page loses nothing that carries meaning.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

export interface HeroFrame {
  src: string;
  alt: string;
  caption: string;
}

/** Tiles that keep their place in the grid. The film sits at index 0 and never cycles. */
const SPANS = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
] as const;

const CYCLE_MS = 3600;

export function StoryHero({
  frames,
  film,
  children,
}: {
  frames: readonly HeroFrame[];
  film: { src: string; poster: string; alt: string; caption: string };
  children: React.ReactNode;
}) {
  const slots = SPANS.length;
  const [shown, setShown] = useState<number[]>(() => frames.map((_, i) => i).slice(0, slots));
  const [held, setHeld] = useState<number | null>(null);
  const [still, setStill] = useState(true);
  const heldRef = useRef<number | null>(null);
  heldRef.current = held;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setStill(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (still || frames.length <= slots) return;
    const t = setInterval(() => {
      setShown((prev) => {
        const candidates = prev.map((_, i) => i).filter((i) => i !== heldRef.current);
        if (candidates.length === 0) return prev;
        const slot = candidates[Math.floor(Math.random() * candidates.length)];
        const unused = frames.map((_, i) => i).filter((i) => !prev.includes(i));
        if (unused.length === 0) return prev;
        const next = [...prev];
        next[slot] = unused[Math.floor(Math.random() * unused.length)];
        return next;
      });
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, [frames, slots, still]);

  const caption = useMemo(() => {
    if (held === null) return null;
    if (held === -1) return film.caption;
    const f = frames[shown[held]];
    return f ? f.caption : null;
  }, [held, shown, frames, film.caption]);

  const hold = useCallback((i: number | null) => setHeld(i), []);

  return (
    <header className="px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
        <div>{children}</div>

        <div>
          <div className="grid grid-cols-3 grid-rows-4 gap-2 sm:gap-3" style={{ aspectRatio: '4 / 5' }}>
            {/* The film. Muted, looping, never cycles, poster only under reduced motion. */}
            <div
              className="relative col-span-2 row-span-2 overflow-hidden rounded-lg"
              style={{ backgroundColor: '#E8DED4' }}
              onMouseEnter={() => hold(-1)}
              onMouseLeave={() => hold(null)}
              onFocus={() => hold(-1)}
              onBlur={() => hold(null)}
              tabIndex={0}
              role="img"
              aria-label={film.alt}
            >
              {still ? (
                <Image src={film.poster} alt={film.alt} fill sizes="40vw" className="object-cover" priority />
              ) : (
                <video
                  src={film.src}
                  poster={film.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={film.alt}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {SPANS.slice(1).map((span, i) => {
              const slot = i + 1;
              const f = frames[shown[slot]];
              if (!f) return null;
              return (
                <button
                  key={slot}
                  type="button"
                  className={`relative overflow-hidden rounded-lg ${span}`}
                  style={{ backgroundColor: '#E8DED4' }}
                  onMouseEnter={() => hold(slot)}
                  onMouseLeave={() => hold(null)}
                  onFocus={() => hold(slot)}
                  onBlur={() => hold(null)}
                  aria-label={f.caption}
                >
                  <Image
                    key={f.src}
                    src={f.src}
                    alt={f.alt}
                    fill
                    sizes="25vw"
                    className="object-cover transition-opacity duration-700 motion-reduce:transition-none"
                  />
                </button>
              );
            })}
          </div>

          {/* Reserved line, so the grid never jumps when a caption appears. */}
          <p className="mt-3 min-h-[2.5rem] text-xs leading-relaxed" style={{ color: '#6A5E54' }}>
            {caption ?? 'Two years of it. Point at a frame to see where it is from.'}
          </p>
        </div>
      </div>
    </header>
  );
}
