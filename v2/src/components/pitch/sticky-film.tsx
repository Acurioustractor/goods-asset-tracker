'use client';

/**
 * A film that stays put while the words scroll over it. The video is pinned to the viewport
 * for the height of the chapter; each step is a screen tall, so the reader walks through the
 * lines while the drone keeps moving underneath. A step can carry a photograph, which rises
 * beside the words, and a voice: a portrait with the person's own sentence over the film.
 * The film plays only while on screen, muted, and never under reduced motion, where the
 * poster stands in. Text sits on a dark scrim so it stays readable over sky and red dirt.
 */

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface FilmStep {
  id: string;
  body: ReactNode;
  image?: { src: string; alt: string; place?: string };
  voice?: { portrait?: string; name: string; role: string; community: string; quote: string };
}

/**
 * `scrim` darkens the film under the words. The default suits a dark film (the Kalgoorlie
 * dump footage it was built for). Over a bright one, like the Tingkkarli sunset, the default
 * leaves the text washed out and a logo almost invisible, so that caller passes 'heavy'.
 */
export function StickyFilm({ src, poster, alt, credit, steps, scrim = 'default' }: { src: string; poster: string; alt: string; credit?: string; steps: FilmStep[]; scrim?: 'default' | 'heavy' }) {
  const ref = useRef<HTMLVideoElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const root = host.current;
    if (!el || !root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setMotion(true);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => undefined);
          else el.pause();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="relative">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-goods-ink">
        <div className="absolute inset-0">
        <Image src={poster} alt={alt} fill sizes="100vw" className={`object-cover ${motion ? 'opacity-0' : 'opacity-100'}`} priority />
        <video ref={ref} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${motion ? 'opacity-100' : 'opacity-0'}`} muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
          <source src={src} type="video/mp4" />
        </video>
        <div
          className={
            scrim === 'heavy'
              ? 'absolute inset-0 bg-goods-ink/75 md:bg-transparent md:bg-gradient-to-r md:from-goods-ink md:via-goods-ink/80 md:to-goods-ink/45'
              : 'absolute inset-0 bg-goods-ink/55 md:bg-transparent md:bg-gradient-to-r md:from-goods-ink/80 md:via-goods-ink/40 md:to-goods-ink/10'
          }
        />
        {scrim === 'heavy' && <div className="absolute inset-0 bg-goods-ink/25" />}
        {credit && <p className="absolute bottom-4 right-6 text-xs text-goods-cream/70">{credit}</p>}
        </div>
      </div>
      <div className="relative -mt-[100svh]">
        {steps.map((step) => (
          <div key={step.id} className="flex min-h-[100svh] items-center px-6 py-16 md:px-10 lg:px-14">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-12">
              <div className={`text-goods-cream ${step.image || step.voice ? 'md:col-span-6' : 'md:col-span-8'}`}>
                {step.body}
                {step.voice && (
                  <figure className="mt-8 flex items-start gap-4">
                    {step.voice.portrait && <Image src={step.voice.portrait} alt={step.voice.name} width={160} height={160} className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-goods-cream/60 sm:h-24 sm:w-24" />}
                    <div>
                      <blockquote className="font-display text-2xl leading-snug text-goods-cream md:text-3xl">“{step.voice.quote}”</blockquote>
                      <figcaption className="mt-3 text-sm text-goods-cream/80">
                        {step.voice.name} · {step.voice.role} · {step.voice.community}
                      </figcaption>
                    </div>
                  </figure>
                )}
              </div>
              {step.image && (
                <figure className="m-0 md:col-span-5 md:col-start-8">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] shadow-2xl shadow-goods-ink/60 ring-1 ring-goods-cream/20">
                    <Image src={step.image.src} alt={step.image.alt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
                  </div>
                  {step.image.place && <figcaption className="mt-2 text-xs text-goods-cream/75">{step.image.place}</figcaption>}
                </figure>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
