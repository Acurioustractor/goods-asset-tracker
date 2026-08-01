'use client';

// Digital deck player: arrows / space / click to advance, F fullscreen,
// N presenter notes (the talk track from the deck plan), Esc exits.

import { useCallback, useEffect, useState } from 'react';

interface Slide { n: number; src: string; name: string; talkTrack: string }

export function SimpleDeckClient({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [notes, setNotes] = useState(false);

  const go = useCallback((d: number) => setI((v) => Math.min(slides.length - 1, Math.max(0, v + d))), [slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
      else if (e.key === 'Home') setI(0);
      else if (e.key === 'End') setI(slides.length - 1);
      else if (e.key.toLowerCase() === 'n') setNotes((v) => !v);
      else if (e.key.toLowerCase() === 'f') {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, slides.length]);

  if (!slides.length) {
    return <div className="flex h-screen items-center justify-center text-sm">No rendered slides. Run: node scripts/render-deck.mjs</div>;
  }
  const s = slides[i];

  return (
    <div className="flex h-screen w-screen flex-col bg-[#33302a] text-white" onClick={() => go(1)}>
      <div className="relative flex min-h-0 flex-1 items-center justify-center p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.src} alt={s.name} className="max-h-full max-w-full rounded shadow-2xl" />
        {/* preload neighbours */}
        {slides[i + 1] && <link rel="preload" as="image" href={slides[i + 1].src} />}
      </div>
      {notes && (
        <div className="max-h-40 overflow-y-auto border-t border-white/20 bg-black/70 px-6 py-3 text-sm leading-relaxed" onClick={(e) => e.stopPropagation()}>
          <span className="mr-2 font-semibold text-amber-300">{s.n}. {s.name}</span>
          {s.talkTrack}
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-white/60" onClick={(e) => e.stopPropagation()}>
        <span>{s.n} / {slides.length} · {s.name}</span>
        <span>← → navigate · N notes · F fullscreen</span>
        <span className="flex gap-3">
          <button onClick={() => go(-1)} className="hover:text-white">prev</button>
          <button onClick={() => go(1)} className="hover:text-white">next</button>
          <a href="/deck-slides/goods-simple-deck.pdf" className="hover:text-white" download>PDF</a>
        </span>
      </div>
    </div>
  );
}
