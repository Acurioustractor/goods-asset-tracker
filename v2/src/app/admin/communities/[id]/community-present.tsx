'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface PresentSlide {
  kind: 'title' | 'stat' | 'want' | 'funding' | 'photo' | 'voices';
  heading?: string;
  sub?: string;
  lines?: { big: string; small: string }[];
  photo?: string;
  names?: string[];
}

/**
 * Present mode — a full-screen walk-through for sitting beside a funder or a
 * community and stepping through where a place is at and what it needs next.
 * Arrow keys / click to advance. Self-contained; data is prepared server-side.
 */
export default function CommunityPresent({ community, slides }: { community: string; slides: PresentSlide[] }) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  const next = useCallback(() => setI((v) => Math.min(v + 1, slides.length - 1)), [slides.length]);
  const prev = useCallback(() => setI((v) => Math.max(v - 1, 0)), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      else if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, next, prev]);

  return (
    <>
      <button
        onClick={() => { setI(0); setOpen(true); }}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        <Play className="h-3.5 w-3.5" /> Present
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-[#FBF8F1]" role="dialog" aria-modal="true">
          {/* progress */}
          <div className="absolute top-0 left-0 right-0 flex gap-1 p-3">
            {slides.map((_, k) => (
              <div key={k} className={`h-1 flex-1 rounded-full ${k <= i ? 'bg-primary' : 'bg-black/10'}`} />
            ))}
          </div>

          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 z-10 rounded-full bg-black/10 p-2 text-[#2B2A26] hover:bg-black/20" aria-label="Close">
            <X className="h-5 w-5" />
          </button>

          {/* click zones */}
          <button onClick={prev} className="absolute left-0 top-0 h-full w-1/4 cursor-w-resize" aria-label="Previous" />
          <button onClick={next} className="absolute right-0 top-0 h-full w-1/2 cursor-e-resize" aria-label="Next" />

          <Slide slide={slides[i]} community={community} />

          {/* controls */}
          <div className="pointer-events-none absolute bottom-5 left-0 right-0 flex items-center justify-center gap-6 text-[#6F6155]">
            <button onClick={prev} disabled={i === 0} className="pointer-events-auto disabled:opacity-30"><ChevronLeft className="h-6 w-6" /></button>
            <span className="text-xs tabular-nums">{i + 1} / {slides.length}</span>
            <button onClick={next} disabled={i === slides.length - 1} className="pointer-events-auto disabled:opacity-30"><ChevronRight className="h-6 w-6" /></button>
          </div>
        </div>
      )}
    </>
  );
}

function Slide({ slide, community }: { slide: PresentSlide; community: string }) {
  if (slide.kind === 'photo' && slide.photo) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={slide.photo} alt={slide.heading || community} className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
      {slide.sub && <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C45C3E]">{slide.sub}</p>}
      {slide.heading && (
        <h2 className="max-w-4xl font-bold text-[#2B2A26]" style={{ fontFamily: 'Georgia, serif', fontSize: slide.kind === 'title' ? '4.5rem' : '3rem', lineHeight: 1.05 }}>
          {slide.heading}
        </h2>
      )}
      {slide.lines && (
        <div className="mt-10 flex flex-wrap items-end justify-center gap-x-14 gap-y-8">
          {slide.lines.map((l, k) => (
            <div key={k}>
              <div className="font-bold tabular-nums text-[#2B2A26]" style={{ fontFamily: 'Georgia, serif', fontSize: '3.5rem', lineHeight: 1 }}>{l.big}</div>
              <div className="mt-1 text-base text-[#6F6155]">{l.small}</div>
            </div>
          ))}
        </div>
      )}
      {slide.names && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {slide.names.map((n) => (
            <span key={n} className="rounded-full bg-white px-4 py-2 text-lg text-[#2B2A26] shadow-sm" style={{ fontFamily: 'Georgia, serif' }}>{n}</span>
          ))}
        </div>
      )}
    </div>
  );
}
