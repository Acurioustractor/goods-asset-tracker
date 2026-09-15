'use client';

/**
 * Voices as tall cards: the person's own film loops silently behind their words while the card is
 * on screen, with a button to watch it with sound; a voice with no film gets their portrait.
 * Reduced motion shows the poster and never loops.
 */

import { useEffect, useRef } from 'react';
import { VideoModal } from '@/components/pitch/video-modal';

export interface VoiceCard {
  key: string;
  quote: string;
  name: string;
  role: string;
  community: string;
  film?: { src: string; poster: string; title: string };
  portrait?: string;
}

function LoopWhileVisible({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.25 });
    io.observe(video);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline preload="none" poster={poster} src={src} aria-hidden="true" />;
}

export function VoiceFilmCards({ cards }: { cards: VoiceCard[] }) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
      {cards.map((c) => (
        <figure key={c.key} className="group relative flex aspect-[4/5] w-[80%] flex-none snap-center flex-col justify-end overflow-hidden rounded-[22px] bg-goods-ink sm:w-[60%] md:w-auto">
          {c.film ? (
            <LoopWhileVisible src={c.film.src} poster={c.film.poster} />
          ) : c.portrait ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.portrait} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" aria-hidden="true" />
          <figcaption className="relative p-6">
            <blockquote className="font-display text-2xl leading-snug text-balance text-white">“{c.quote}”</blockquote>
            <p className="mt-3 text-sm text-white/70">
              {c.name} · {c.role} · {c.community}
            </p>
            {c.film && (
              <div className="mt-4">
                <VideoModal src={c.film.src} poster={c.film.poster} title={c.film.title} label="Watch with sound" dark />
              </div>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
