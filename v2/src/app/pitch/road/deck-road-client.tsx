'use client';

/**
 * Presentation shell for the road deck.
 *
 * Deliberately thin: every word and every figure comes from `deck-road.ts`, which resolves them
 * from canon. This file decides layout and nothing else. If you find yourself wanting to type a
 * sentence here, it belongs in the data module where the guards can see it.
 *
 * Layout conventions match `/deck` (fixed shell, progress bar, click-zones, dot nav) so the two
 * feel like the same product while the older one is still live.
 */

import { useCallback, useEffect, useState } from 'react';
import { DECK_ROAD, type Figure } from '@/lib/data/deck-road';

const CLAIM_STYLES: Record<string, string> = {
  verified: 'border-accent/40 bg-accent/20 text-accent-foreground',
  workpaper: 'border-[color:var(--goods-gold)]/50 bg-[color:var(--goods-gold)]/10 text-[color:var(--goods-gold)]',
  modelled: 'border-[color:var(--goods-gold)]/50 bg-[color:var(--goods-gold)]/10 text-[color:var(--goods-gold)]',
  target: 'border-[color:var(--goods-clay)]/50 bg-[color:var(--goods-clay)]/10 text-[color:var(--goods-clay)]',
  future: 'border-[color:var(--goods-teal)]/50 bg-[color:var(--goods-teal)]/10 text-[color:var(--goods-teal)]',
};

function FigureBlock({ f }: { f: Figure }) {
  return (
    <div className="min-w-[8rem] flex-1">
      <p
        className="text-4xl font-light leading-none text-foreground md:text-5xl"
        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
      >
        {f.value}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{f.label}</p>
      <span
        className={`mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
          CLAIM_STYLES[f.claim] ?? 'border-border text-muted-foreground'
        }`}
      >
        {f.claim}
      </span>
    </div>
  );
}

export function DeckRoadClient() {
  const [i, setI] = useState(0);
  const last = DECK_ROAD.length - 1;
  const go = useCallback((n: number) => setI(Math.max(0, Math.min(last, n))), [last]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        setI((c) => Math.min(last, c + 1));
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        setI((c) => Math.max(0, c - 1));
      } else if (e.key === 'Home') setI(0);
      else if (e.key === 'End') setI(last);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [last]);

  const slide = DECK_ROAD[i];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground select-none">
      <div className="h-1 w-full bg-border/60">
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${((i + 1) / DECK_ROAD.length) * 100}%` }}
        />
      </div>

      <div className="relative flex-1 overflow-hidden">
        <button
          aria-label="Previous slide"
          onClick={() => go(i - 1)}
          className="absolute left-0 top-0 z-10 h-full w-1/4 cursor-w-resize focus:outline-none"
        />
        <button
          aria-label="Next slide"
          onClick={() => go(i + 1)}
          className="absolute right-0 top-0 z-10 h-full w-1/4 cursor-e-resize focus:outline-none"
        />

        <div key={slide.n} className="deck-fade h-full overflow-y-auto">
          <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-6 py-16 sm:px-12">
            <p className="mb-5 text-sm uppercase tracking-[0.2em] text-accent">{slide.eyebrow}</p>
            <h2
              className="mb-6 text-3xl font-light leading-tight text-foreground md:text-5xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {slide.headline}
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{slide.body}</p>

            {slide.figures && (
              <div className="mt-12 flex flex-wrap gap-8 border-t border-border pt-8">
                {slide.figures.map((f) => (
                  <FigureBlock key={f.canonId} f={f} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-6 py-3 text-xs text-muted-foreground sm:px-12">
        <span className="font-medium tracking-wide text-foreground">Goods</span>
        <div className="hidden items-center gap-1.5 sm:flex">
          {DECK_ROAD.map((s, n) => (
            <button
              key={s.n}
              aria-label={`Slide ${s.n}`}
              onClick={() => go(n)}
              className={`h-1.5 rounded-full transition-all ${
                n === i ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
        <span className="tabular-nums">
          {i + 1} / {DECK_ROAD.length}
        </span>
      </div>
    </div>
  );
}
