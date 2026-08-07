'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Maximize2, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from 'react';

type ZoomableBedImageProps = {
  src: string;
  alt: string;
};

const bedParts = [
  {
    name: 'Canvas',
    cost: '$93.50 per bed',
    detail:
      'One heavy-duty Australian canvas surface. Washable, quick-drying and structural: its tension braces the frame.',
    position: 'left-[64%] top-[35%]',
  },
  {
    name: 'Steel poles',
    cost: '$27 per bed set',
    detail:
      'Two galvanised steel poles, 26.9mm diameter. They thread through the canvas sleeves and carry the load.',
    position: 'left-[37%] top-[48%]',
  },
  {
    name: 'Recycled-plastic legs',
    cost: '$344.05 bought finished',
    detail:
      'Two X-trestles made from 20kg of recycled HDPE. The raw plastic is modelled at $40–55; pressing and cutting these locally is the biggest cost-down and community-making opportunity.',
    position: 'left-[80%] top-[52%]',
  },
];

function BedPartHotspots({ fullScreen = false }: { fullScreen?: boolean }) {
  return bedParts.map((part) => (
    <div
      key={part.name}
      className={`group absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block ${part.position} ${
        fullScreen ? 'pointer-events-auto' : ''
      }`}
      onPointerDown={fullScreen ? (event) => event.stopPropagation() : undefined}
      onDoubleClick={fullScreen ? (event) => event.stopPropagation() : undefined}
    >
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-goods-terracotta text-xs font-bold text-white shadow-lg transition-transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={`${part.name}: ${part.cost}`}
      >
        +
      </button>
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-64 -translate-x-1/2 translate-y-2 border border-white/15 bg-goods-ink/95 p-4 text-white opacity-0 shadow-2xl backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-goods-terracotta-light">
          {part.name}
        </p>
        <p className="mt-1 text-sm font-semibold">{part.cost}</p>
        <p className="mt-2 text-xs leading-5 text-white/70">{part.detail}</p>
      </div>
    </div>
  ));
}

export function ZoomableBedImage({ src, alt }: ZoomableBedImageProps) {
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
    setPosition((value) => ({
      x: value.x - event.deltaX,
      y: value.y - event.deltaY,
    }));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      imageX: position.x,
      imageY: position.y,
    };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPosition({
      x: dragStart.current.imageX + event.clientX - dragStart.current.pointerX,
      y: dragStart.current.imageY + event.clientY - dragStart.current.pointerY,
    });
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
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
      <section
        id="open-the-stretch-bed"
        className="relative min-h-screen scroll-mt-16 overflow-hidden bg-goods-ink"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group absolute inset-0 z-0 cursor-zoom-in"
          aria-label="Open the Stretch Bed photograph full screen"
        >
          <div data-road-media="open-the-stretch-bed.photo" className="absolute inset-0">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain transition-transform duration-700 group-hover:scale-[1.01] md:object-cover"
            />
          </div>
          <span className="absolute bottom-8 left-6 inline-flex min-h-11 items-center gap-2 border-b border-white/70 pb-2 text-sm font-semibold text-white drop-shadow-md md:bottom-12 md:left-12">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
            View full screen
          </span>
        </button>

        <BedPartHotspots />

        <Link
          href="/stretch-bed"
          className="absolute bottom-8 right-6 z-10 inline-flex min-h-11 items-center gap-2 border-b border-goods-terracotta-light pb-2 text-sm font-semibold text-white drop-shadow-md md:bottom-12 md:right-12"
        >
          Open the bed
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      {open && (
        <div
          className={`fixed inset-0 z-[200] touch-none overflow-hidden bg-black ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen Stretch Bed photograph"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={() => {
            if (scale > 1) reset();
            else zoomBy(1);
          }}
        >
          <div
            className={`pointer-events-none absolute inset-0 ${
              dragging ? '' : 'transition-transform duration-150'
            }`}
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            }}
          >
            <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" priority />
            <BedPartHotspots fullScreen />
          </div>

          <div
            className="absolute right-5 top-5 flex items-center gap-1 rounded-full border border-white/20 bg-black/70 p-1 text-white backdrop-blur"
            onPointerDown={(event) => event.stopPropagation()}
            onDoubleClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => zoomBy(-0.25)}
              className="rounded-full p-3 hover:bg-white/10"
              aria-label="Zoom out"
            >
              <Minus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-full p-3 hover:bg-white/10"
              aria-label="Reset zoom"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => zoomBy(0.25)}
              className="rounded-full p-3 hover:bg-white/10"
              aria-label="Zoom in"
            >
              <Plus className="h-5 w-5" />
            </button>
            <span className="px-2 text-xs tabular-nums text-white/70">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={close}
              className="rounded-full p-3 hover:bg-white/10"
              aria-label="Close full-screen image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs text-white/70 backdrop-blur">
            Pinch to zoom · two-finger scroll or drag to move · double-click to reset
          </p>
        </div>
      )}
    </>
  );
}
