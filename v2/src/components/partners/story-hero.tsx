'use client';

/**
 * The opening: a full-bleed aerial with the title on it, and the archive running underneath.
 *
 * The first attempt put a mosaic beside the headline and Ben did not like it, which was fair.
 * A grid of nine small tiles next to text reads as a component where an opening was wanted.
 * This is one image at full height with the words over it, in the same register as /pitch, and
 * the photographs get their own band below where they can be big enough to read.
 *
 * The band scrolls on its own and stops the moment you point at it or tab into it, so nothing
 * moves out from under someone reading a caption. Reduced motion never starts it and turns it
 * into a normal horizontally scrollable strip, which loses nothing.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export interface HeroFrame {
  src: string;
  alt: string;
  caption: string;
}

export function StoryHero({
  frames,
  film,
  children,
}: {
  frames: readonly HeroFrame[];
  film: { src: string; poster: string; alt: string; caption: string };
  children: React.ReactNode;
}) {
  const [still, setStill] = useState(true);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState<string | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const offset = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setStill(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (still || paused) return;
    let raf = 0;
    const tick = () => {
      const el = strip.current;
      if (el) {
        offset.current += 0.4;
        if (offset.current >= el.scrollWidth / 2) offset.current = 0;
        el.scrollLeft = offset.current;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [still, paused]);

  // Doubled so the loop has somewhere to go without a visible jump.
  const belt = [...frames, ...frames];

  return (
    <header>
      <div className="relative h-[100svh] w-full overflow-hidden bg-goods-ink">
        <div className="absolute inset-0">
          {still ? (
            <Image src={film.poster} alt={film.alt} fill sizes="100vw" className="object-cover" priority />
          ) : (
            <video
              src={film.src}
              poster={film.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-goods-ink via-goods-ink/70 to-goods-ink/25" />
        </div>

        <div className="relative flex h-full items-end px-6 pb-16 md:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-6xl text-goods-cream">{children}</div>
        </div>

        <p className="absolute bottom-4 right-6 max-w-md text-right text-xs leading-relaxed text-goods-cream/60">
          {film.caption}
        </p>
      </div>

      <div
        className="border-y bg-goods-cream-muted py-4"
        style={{ borderColor: '#E8DED4' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => { setPaused(false); setHeld(null); }}
      >
        <div
          ref={strip}
          className="flex gap-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {belt.map((f, i) => (
            <button
              key={`${f.src}-${i}`}
              type="button"
              className="relative h-40 w-64 shrink-0 overflow-hidden rounded-lg sm:h-52 sm:w-80"
              style={{ backgroundColor: '#E8DED4' }}
              onFocus={() => { setPaused(true); setHeld(f.caption); }}
              onBlur={() => { setPaused(false); setHeld(null); }}
              onMouseEnter={() => setHeld(f.caption)}
              aria-label={f.caption}
            >
              <Image src={f.src} alt={f.alt} fill sizes="320px" className="object-cover" />
            </button>
          ))}
        </div>
        <p className="mx-auto mt-3 min-h-[2.25rem] max-w-6xl px-4 text-xs leading-relaxed" style={{ color: '#6A5E54' }}>
          {held ?? `${frames.length} frames from two years. Point at one to see where it is from.`}
        </p>
      </div>
    </header>
  );
}
