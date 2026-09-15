'use client';

/**
 * The Stretch Bed, explorable. A full-bleed photograph with hotspots on the three parts, and a
 * full-screen zoom on click. Same interaction as the road pitch's bed image; the parts are a
 * prop so the pitch prints the spec, never a dated part price.
 */

import Image from 'next/image';
import { Maximize2, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from 'react';

export interface BedPart {
  name: string;
  detail: string;
  /** Tailwind position classes, e.g. 'left-[64%] top-[35%]'. */
  position: string;
}

function Hotspots({ parts, fullScreen = false }: { parts: BedPart[]; fullScreen?: boolean }) {
  return parts.map((part) => (
    <div
      key={part.name}
      className={`group absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block ${part.position} ${fullScreen ? 'pointer-events-auto' : ''}`}
      onPointerDown={fullScreen ? (event) => event.stopPropagation() : undefined}
      onDoubleClick={fullScreen ? (event) => event.stopPropagation() : undefined}
    >
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-goods-terracotta text-base font-bold text-white shadow-lg transition-transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={part.name}
      >
        +
      </button>
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-72 -translate-x-1/2 translate-y-2 rounded-xl border border-white/15 bg-goods-ink/95 p-4 text-white opacity-0 shadow-2xl backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <p className="font-display text-lg font-semibold">{part.name}</p>
        <p className="mt-1 text-sm leading-snug text-white/75">{part.detail}</p>
      </div>
    </div>
  ));
}

export function BedExplorer({ src, alt, parts, caption, dark = false }: { src: string; alt: string; parts: BedPart[]; caption?: string; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ pointerX: 0, pointerY: 0, imageX: 0, imageY: 0 });

  const reset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);
  const zoomBy = useCallback((amount: number) => {
    setScale((value) => {
      const next = Math.min(5, Math.max(1, value + amount));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.ctrlKey || event.metaKey) {
      zoomBy(-event.deltaY * 0.01);
      return;
    }
    setPosition((value) => ({ x: value.x - event.deltaX, y: value.y - event.deltaY }));
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { pointerX: event.clientX, pointerY: event.clientY, imageX: position.x, imageY: position.y };
    setDragging(true);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPosition({ x: dragStart.current.imageX + event.clientX - dragStart.current.pointerX, y: dragStart.current.imageY + event.clientY - dragStart.current.pointerY });
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
  };

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === '+' || event.key === '=') zoomBy(0.25);
      if (event.key === '-') zoomBy(-0.25);
      if (event.key === '0') reset();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [close, open, reset, zoomBy]);

  return (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-goods-ink md:aspect-[21/10]">
        <button type="button" onClick={() => setOpen(true)} className="group absolute inset-0 z-0 cursor-zoom-in" aria-label="Open the Stretch Bed photograph full screen">
          <Image src={src} alt={alt} fill sizes="100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.01]" />
          <span className="absolute bottom-5 left-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-black/45 px-4 text-sm font-semibold text-white backdrop-blur">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
            Full screen
          </span>
        </button>
        <Hotspots parts={parts} />
        {/* Phones: numbered marks on the photograph; the parts open in the list below. */}
        {parts.map((part, i) => (
          <span key={part.name} aria-hidden="true" className={`pointer-events-none absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-goods-terracotta text-xs font-bold text-white shadow-lg md:hidden ${part.position}`}>
            {i + 1}
          </span>
        ))}
        {caption && <p className="pointer-events-none absolute bottom-5 right-5 hidden rounded-full bg-black/45 px-4 py-2 text-xs text-white/85 backdrop-blur md:block">{caption}</p>}
      </div>
      <ol className={`mt-4 space-y-2 md:hidden ${dark ? 'text-goods-cream' : 'text-goods-ink'}`}>
        {parts.map((part, i) => (
          <li key={part.name}>
            <details className={`group rounded-2xl border px-4 py-3 ${dark ? 'border-goods-cream/20 bg-goods-cream/5' : 'border-[#e6dfd1] bg-[#fffdf9]'}`}>
              <summary className="flex min-h-9 cursor-pointer list-none items-center gap-3 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-goods-terracotta font-sans text-xs font-bold text-white">{i + 1}</span>
                {part.name}
                <span className="ml-auto text-2xl font-normal leading-none transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className={`mt-2 pl-10 text-[15px] leading-relaxed ${dark ? 'text-goods-cream/80' : 'text-[#4a4741]'}`}>{part.detail}</p>
            </details>
          </li>
        ))}
      </ol>

      {open && (
        <div
          className={`fixed inset-0 z-[200] touch-none overflow-hidden bg-black ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen Stretch Bed photograph"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={() => (scale > 1 ? reset() : zoomBy(1))}
        >
          <div className={`pointer-events-none absolute inset-0 ${dragging ? '' : 'transition-transform duration-150'}`} style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})` }}>
            <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" priority />
            <Hotspots parts={parts} fullScreen />
          </div>
          <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full border border-white/20 bg-black/70 p-1 text-white backdrop-blur" onPointerDown={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => zoomBy(-0.25)} className="rounded-full p-3 hover:bg-white/10" aria-label="Zoom out"><Minus className="h-5 w-5" /></button>
            <button type="button" onClick={reset} className="rounded-full p-3 hover:bg-white/10" aria-label="Reset zoom"><RotateCcw className="h-5 w-5" /></button>
            <button type="button" onClick={() => zoomBy(0.25)} className="rounded-full p-3 hover:bg-white/10" aria-label="Zoom in"><Plus className="h-5 w-5" /></button>
            <span className="px-2 text-xs tabular-nums text-white/70">{Math.round(scale * 100)}%</span>
            <button type="button" onClick={close} className="rounded-full p-3 hover:bg-white/10" aria-label="Close full-screen image"><X className="h-5 w-5" /></button>
          </div>
          <p className="pointer-events-none absolute bottom-5 left-1/2 w-max max-w-[90vw] -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-center text-xs text-white/70 backdrop-blur"><span className="md:hidden">Drag to move · use + and − to zoom</span><span className="hidden md:inline">Two-finger scroll or drag to move · double-click to zoom or reset</span></p>
        </div>
      )}
    </>
  );
}
