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
import { project } from '@/components/pitch/static-map';

export interface PlaceBeat {
  id: string;
  /** The place this beat is about. Drives the credit line and the map. */
  place: string;
  when: string;
  title: string;
  body: string;
  film: { src: string; poster: string; alt: string };
  /** Everyone who speaks on this stop. First one leads, the rest sit under it smaller. */
  voices: readonly { name: string; role: string; community: string; text: string; portrait: string | null }[];
  photos: readonly { src: string; alt: string }[];
  /** Draw the map of every place over this beat. Only the closing beat asks for it. */
  showMap?: boolean;
}

export interface MapDot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  beds: number;
  washers: number;
}

export function PlaceFilms({ beats, mapOutline, mapDots }: {
  beats: readonly PlaceBeat[];
  mapOutline?: string;
  mapDots?: readonly MapDot[];
}) {
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
                {b.voices.map((v, vi) => (
                  <figure key={v.name} className={`m-0 flex items-start gap-4 ${vi === 0 ? 'mt-8' : 'mt-6'}`}>
                    {v.portrait && (
                      <Image
                        src={v.portrait} alt={v.name} width={160} height={160}
                        className={`shrink-0 rounded-full object-cover ring-2 ring-goods-cream/60 ${vi === 0 ? 'h-16 w-16 sm:h-20 sm:w-20' : 'h-11 w-11 sm:h-12 sm:w-12'}`}
                      />
                    )}
                    <div>
                      <blockquote className={`font-display leading-snug text-goods-cream ${vi === 0 ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
                        &ldquo;{v.text}&rdquo;
                      </blockquote>
                      <figcaption className={`text-goods-cream/80 ${vi === 0 ? 'mt-3 text-sm' : 'mt-2 text-xs'}`}>
                        {[v.name, v.role, v.community].filter(Boolean).join(' \u00b7 ')}
                      </figcaption>
                    </div>
                  </figure>
                ))}
                {b.showMap && mapOutline && mapDots && mapDots.length > 0 && (
                  <figure className="m-0 mt-8 max-w-xl">
                    <svg viewBox="0 0 620 460" className="h-auto w-full" role="img" aria-label={`${mapDots.length} places on the map`}>
                      <g fill="rgba(253,248,243,0.07)" stroke="rgba(253,248,243,0.4)" strokeWidth={1} dangerouslySetInnerHTML={{ __html: mapOutline }} />
                      {mapDots.map((d) => {
                        const { x, y } = project(d.lat, d.lng);
                        const r = d.beds >= 100 ? 9 : d.beds >= 30 ? 7 : 5.5;
                        return (
                          <g key={d.id}>
                            <circle cx={x} cy={y} r={r * 2.6} fill="#C45C3E" opacity={0.28} />
                            {d.washers > 0 && <circle cx={x} cy={y} r={r + 4} fill="none" stroke="#A9BE90" strokeWidth={2} />}
                            <circle cx={x} cy={y} r={r} fill="#C45C3E" stroke="rgba(253,248,243,0.85)" strokeWidth={1.5} />
                            <text x={x + r + 7} y={y + 4} fontSize={13} fill="rgba(253,248,243,0.92)">{d.name}</text>
                          </g>
                        );
                      })}
                    </svg>
                    <figcaption className="mt-2 text-xs text-goods-cream/60">
                      A sage ring marks a place with washing machines in it.
                    </figcaption>
                  </figure>
                )}
                {b.photos.length > 0 && (
                  <ul className="m-0 mt-8 flex list-none gap-3 p-0">
                    {b.photos.map((ph) => (
                      <li key={ph.src} className="min-w-0 flex-1">
                        <Image
                          src={ph.src} alt={ph.alt} width={480} height={360}
                          sizes="(min-width: 768px) 10rem, 25vw"
                          className="aspect-[4/3] w-full rounded-md object-cover ring-1 ring-goods-cream/25"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
