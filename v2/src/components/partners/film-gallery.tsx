'use client';

/**
 * The films, with the story each one carries.
 *
 * A grid of posters that plays in place. No modal: a reader should be able to watch four of
 * them in a row without losing where they were. Only one plays at a time: starting a second pauses the first, which is what people
 * expect and what stops a page of overlapping audio.
 *
 * The voice under each film is resolved by the server and passed in, so nothing here decides
 * what may be published.
 */

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

export interface GalleryFilm {
  src: string;
  poster: string;
  title: string;
  why: string;
  story: string;
  place: string;
  voice: { name: string; role: string; text: string } | null;
}

export function FilmGallery({ films }: { films: readonly GalleryFilm[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});

  function play(src: string) {
    for (const [k, el] of Object.entries(refs.current)) {
      if (k !== src && el) el.pause();
    }
    setPlaying(src);
    const el = refs.current[src];
    if (el) void el.play().catch(() => setPlaying(null));
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {films.map((f) => {
        const isPlaying = playing === f.src;
        return (
          <figure key={f.src} className="m-0">
            <div className="relative overflow-hidden rounded-lg" style={{ backgroundColor: '#000' }}>
              <video
                ref={(el) => { refs.current[f.src] = el; }}
                src={f.src}
                poster={f.poster}
                controls={isPlaying}
                playsInline
                preload="none"
                onPause={() => isPlaying && setPlaying(null)}
                className="aspect-video w-full object-cover"
              />
              {!isPlaying && (
                <button
                  type="button"
                  onClick={() => play(f.src)}
                  className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/10 motion-reduce:transition-none"
                  aria-label={`Play ${f.title}`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90">
                    <Play className="h-6 w-6 translate-x-0.5" style={{ color: '#2E2E2E' }} fill="#2E2E2E" />
                  </span>
                </button>
              )}
            </div>
            <figcaption className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#A99C8F' }}>{f.place}</p>
              <p className="mt-1 font-display text-xl leading-snug" style={{ color: '#2E2E2E' }}>{f.title}</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed" style={{ color: '#C45C3E' }}>{f.why}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: '#2E2E2Ecc' }}>{f.story}</p>
              {f.voice && (
                <blockquote className="mt-4 border-l-2 pl-4" style={{ borderColor: '#8B9D77' }}>
                  <p className="font-display text-base leading-snug" style={{ color: '#2E2E2E' }}>&ldquo;{f.voice.text}&rdquo;</p>
                  <cite className="mt-1.5 block text-xs not-italic uppercase tracking-wide" style={{ color: '#8B9D77' }}>
                    {f.voice.name}, {f.voice.role}
                  </cite>
                </blockquote>
              )}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
