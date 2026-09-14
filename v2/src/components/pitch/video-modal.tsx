'use client';

/**
 * A film that opens in a modal. Click-to-play with controls, never autoplay on the page.
 * `cover` renders the poster as a tile with a play mark; otherwise a text button.
 */

import Image from 'next/image';
import { Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function VideoModal({
  src,
  poster,
  title,
  captions,
  cover = false,
  dark = false,
  label,
}: {
  src: string;
  poster: string;
  title: string;
  captions?: string | null;
  cover?: boolean;
  dark?: boolean;
  /** Button text when not a cover tile. Defaults to "Watch: {title}". */
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {cover ? (
        <button type="button" onClick={() => setOpen(true)} className="group relative block aspect-video w-full overflow-hidden rounded-[22px] bg-goods-ink text-left" aria-label={`Play: ${title}`}>
          <Image src={poster} alt="" fill sizes="(min-width: 1024px) 1100px, 100vw" className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.02]" />
          <span className="absolute inset-0 bg-gradient-to-t from-goods-ink/70 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-goods-terracotta text-white shadow-2xl transition-transform group-hover:scale-105">
            <Play className="ml-1 h-8 w-8" fill="currentColor" aria-hidden="true" />
          </span>
          <span className="absolute bottom-5 left-5 right-5 font-display text-xl text-goods-cream md:text-2xl">{title}</span>
        </button>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${dark ? 'border-goods-cream/40 text-goods-cream' : 'border-goods-ink/30 text-goods-ink'} hover:border-goods-terracotta hover:text-goods-terracotta`}>
          <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
          {label ?? `Watch: ${title}`}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 md:p-10" role="dialog" aria-modal="true" aria-label={title} onClick={() => setOpen(false)}>
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <p className="font-display text-lg md:text-xl">{title}</p>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-3 hover:bg-white/10" aria-label="Close the film">
                <X className="h-5 w-5" />
              </button>
            </div>
            <video className="aspect-video w-full rounded-[14px] bg-black" controls autoPlay playsInline poster={poster} src={src}>
              {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
            </video>
          </div>
        </div>
      )}
    </>
  );
}
