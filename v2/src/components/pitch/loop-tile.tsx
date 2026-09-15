'use client';

/**
 * A photograph that comes alive: a short muted loop plays while the tile is on screen and the
 * viewer has not asked for reduced motion; otherwise the still shows. No controls, no sound,
 * no autoplay before it is visible, so a page with several tiles stays light.
 */

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function LoopTile({ src, poster, still, alt, className = '', sizes = '(min-width: 1024px) 33vw, 50vw' }: { src?: string; poster?: string; still: string; alt: string; className?: string; sizes?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setPlay(true);
            el.play().catch(() => undefined);
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-goods-sand ${className}`}>
      <Image src={still} alt={alt} fill sizes={sizes} unoptimized={still.startsWith('http')} className={`object-cover transition-opacity duration-500 ${play ? 'opacity-0' : 'opacity-100'}`} />
      {src && (
        <video ref={ref} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${play ? 'opacity-100' : 'opacity-0'}`} muted loop playsInline preload="none" poster={poster} aria-hidden="true">
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
