'use client';

/**
 * The arc, told as places. One aerial per beat, pinned behind the words, swapping as you move.
 *
 * Ben, 16 September 2026: a series of drone shots from different places, more voices, and a
 * map that grows underneath. The first cut ran one film for four beats, which produced the
 * exact problem that prompted this: the words said Tennant Creek while the caption said
 * Maningrida. A beat now owns its place, its footage, its credit and its voice, so the two
 * can never disagree again.
 *
 * Only the active film is mounted, so four aerials do not all download at once, and each is
 * muted, looping and `playsInline`. Reduced motion holds the poster instead and the beats
 * simply stack.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export interface PlaceBeat {
  id: string;
  /** The place this beat is about. Drives the credit line and the map. */
  place: string;
  when: string;
  title: string;
  body: string;
  film: { src: string; poster: string; alt: string };
  voice: { name: string; role: string; community: string; text: string; portrait: string | null } | null;
}

export function PlaceFilms({ beats }: { beats: readonly PlaceBeat[] }) {
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(true);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setStill(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const els = stepRefs.current.filter((e): e is HTMLDivElement => e !== null);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!seen[0]) return;
        const i = els.indexOf(seen[0].target as HTMLDivElement);
        if (i >= 0) setActive(i);
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25, 0.6, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [beats.length]);

  const current = beats[active];

  return (
    <div className="relative">
      {/* Follows sticky-film.tsx exactly: no negative z-index (the page background would cover
          the film) and the arbitrary -mt-[100svh], because -mt-screen is not a Tailwind class
          and silently did nothing, which is what put cream text on a cream page. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-goods-ink">
        <div className="absolute inset-0">
          {still ? (
            <Image src={current.film.poster} alt={current.film.alt} fill sizes="100vw" className="object-cover" priority />
          ) : (
            <video
              key={current.film.src}
              src={current.film.src}
              poster={current.film.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-goods-ink/75 md:bg-transparent md:bg-gradient-to-r md:from-goods-ink md:via-goods-ink/80 md:to-goods-ink/45" />
          <div className="absolute inset-0 bg-goods-ink/20" />
          <p className="absolute bottom-4 right-6 max-w-md text-right text-xs leading-relaxed text-goods-cream/70">
            {current.place}
          </p>
        </div>
      </div>

      <div className="relative -mt-[100svh]">
        {beats.map((b, i) => (
          <div
            key={b.id}
            ref={(el) => { stepRefs.current[i] = el; }}
            className="flex min-h-[100svh] items-center px-6 py-16 md:px-10 lg:px-14"
          >
            <div className="mx-auto w-full max-w-6xl">
              <div className="max-w-2xl text-goods-cream">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-goods-cream/70">{b.when}</p>
                <p className="mt-3 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">{b.title}</p>
                <p className="mt-5 text-base leading-relaxed text-goods-cream/85 sm:text-lg">{b.body}</p>
                {b.voice && (
                  <figure className="m-0 mt-8 flex items-start gap-4">
                    {b.voice.portrait && (
                      <Image src={b.voice.portrait} alt={b.voice.name} width={160} height={160} className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-goods-cream/60 sm:h-20 sm:w-20" />
                    )}
                    <div>
                      <blockquote className="font-display text-xl leading-snug text-goods-cream md:text-2xl">&ldquo;{b.voice.text}&rdquo;</blockquote>
                      <figcaption className="mt-3 text-sm text-goods-cream/80">
                        {[b.voice.name, b.voice.role, b.voice.community].filter(Boolean).join(' \u00b7 ')}
                      </figcaption>
                    </div>
                  </figure>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
