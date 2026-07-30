'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';

type MykelStoryMediaProps = {
  mediaKey: string;
  coverSrc: string;
  makingSrc: string;
  videoSrc: string;
  videoPoster: string;
  label: string;
  place: string;
};

export function MykelStoryMedia({
  mediaKey,
  coverSrc,
  makingSrc,
  videoSrc,
  videoPoster,
  label,
  place,
}: MykelStoryMediaProps) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open) void videoRef.current?.play();
  }, [open]);

  return (
    <>
      <div className="grid h-full grid-rows-[minmax(0,1fr)_30%] gap-1 bg-[#11110f] p-4 md:p-5">
        <button
          data-road-media={`${mediaKey}.photo`}
          type="button"
          onClick={() => setOpen(true)}
          className="group relative min-h-0 overflow-hidden text-left"
          aria-label={`Play ${label}`}
        >
          <Image
            src={coverSrc}
            alt="Mykel sitting on the Stretch Bed he assembled at home"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition duration-500 group-hover:scale-[1.015]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
            <span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#e88461]">
                Film · 1:29
              </span>
              <span className="goods-pitch-display mt-2 block max-w-md text-3xl leading-tight text-white md:text-4xl">
                Mykel, on the bed he made.
              </span>
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#c45c3e] text-white transition group-hover:scale-105 group-hover:bg-[#d36a49]">
              <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
            </span>
          </span>
        </button>

        <div className="grid min-h-0 grid-cols-[42%_1fr]">
          <div data-road-media={`${mediaKey}.making-photo`} className="relative overflow-hidden">
            <Image
              src={makingSrc}
              alt="Mykel and the team assembling a Stretch Bed"
              fill
              sizes="(max-width: 1024px) 42vw, 21vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center bg-[#22211e] px-5 text-white md:px-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#e88461]">
              The making
            </p>
            <p className="goods-pitch-display mt-2 text-2xl leading-tight md:text-3xl">
              Seven beds by the end of day two.
            </p>
            <p className="mt-3 text-xs text-white/55">{place}</p>
          </div>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 p-4 md:p-10"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/20"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Close
          </button>
          <video
            ref={videoRef}
            src={videoSrc}
            poster={videoPoster}
            controls
            playsInline
            preload="metadata"
            className="max-h-full max-w-full bg-black object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
