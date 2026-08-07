'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from 'react';

const facilityStages = [
  {
    number: '01',
    name: 'Sort + shred',
    body: 'Local HDPE is sorted, cleaned and reduced to consistent chip.',
    image: '/images/process/shredder-granulator.jpg',
  },
  {
    number: '02',
    name: 'Weigh + prepare',
    body: 'Chip is weighed and spread evenly so each sheet begins consistently.',
    image: '/images/process/shredded-chips-weighed.jpg',
  },
  {
    number: '03',
    name: 'Press the sheet',
    body: 'Heat and pressure fuse the chip into dense, weather-resistant stock.',
    image: '/images/process/heat-press-full.jpg',
  },
  {
    number: '04',
    name: 'CNC cut',
    body: 'The router cuts repeatable X-frame parts from each pressed sheet.',
    image: '/images/process/cnc-router-full.jpg',
  },
  {
    number: '05',
    name: 'Finish + check',
    body: 'Edges, holes and dimensions are finished and checked before assembly.',
    image: '/images/process/cnc-cutting-closeup.jpg',
  },
  {
    number: '06',
    name: 'Return the offcuts',
    body: 'Cutting waste returns to the shredder and re-enters the material loop.',
    image: '/images/process/cnc-offcuts-jigsaw.jpg',
  },
] as const;

const facilityHotspots = [
  {
    name: 'Finishing workstation',
    detail:
      'The bench at the left holds tools, controls and finishing work. This is where cut parts are checked and prepared for assembly.',
    position: 'left-[25%] top-[58%]',
  },
  {
    name: 'CNC router',
    detail:
      'The router cuts pressed plastic sheet into repeatable X-frame profiles. Dust extraction captures particles and offcuts return to the material loop.',
    position: 'left-[44%] top-[60%]',
  },
  {
    name: 'Hydraulic heat press',
    detail:
      'Heat and pressure turn weighed HDPE chip into dense sheet stock. Sheet consistency here determines the quality of every later cut.',
    position: 'left-[68%] top-[58%]',
  },
  {
    name: 'Sheet + parts buffer',
    detail:
      'Pressed sheets, cut parts and reusable offcuts are kept beside the line so production can flow without losing material.',
    position: 'left-[89%] top-[61%]',
  },
] as const;

function FacilityHotspots({ fullScreen = false }: { fullScreen?: boolean }) {
  return facilityHotspots.map((item) => (
    <div
      key={item.name}
      className={`group absolute z-20 -translate-x-1/2 -translate-y-1/2 ${item.position} ${
        fullScreen ? 'pointer-events-auto' : ''
      }`}
      onPointerDown={fullScreen ? (event) => event.stopPropagation() : undefined}
      onDoubleClick={fullScreen ? (event) => event.stopPropagation() : undefined}
    >
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-goods-terracotta text-xs font-bold text-white shadow-lg transition-transform hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={`${item.name}: ${item.detail}`}
      >
        +
      </button>
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 w-64 -translate-x-1/2 translate-y-2 border border-white/15 bg-goods-ink/95 p-4 text-white opacity-0 shadow-2xl backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-goods-terracotta-light">
          {item.name}
        </p>
        <p className="mt-2 text-xs leading-5 text-white/75">{item.detail}</p>
      </div>
    </div>
  ));
}

export function ProductionFacilityExperience() {
  const [open, setOpen] = useState(false);
  const [stageOpenIndex, setStageOpenIndex] = useState<number | null>(null);
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
    if (!open && stageOpenIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (stageOpenIndex !== null) setStageOpenIndex(null);
        else close();
      }
      if (stageOpenIndex !== null && event.key === 'ArrowLeft') {
        setStageOpenIndex((stageOpenIndex + facilityStages.length - 1) % facilityStages.length);
      }
      if (stageOpenIndex !== null && event.key === 'ArrowRight') {
        setStageOpenIndex((stageOpenIndex + 1) % facilityStages.length);
      }
      if (event.key === '+' || event.key === '=') zoomBy(0.25);
      if (event.key === '-') zoomBy(-0.25);
      if (event.key === '0') reset();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [close, open, reset, stageOpenIndex, zoomBy]);

  return (
    <>
      <section
        id="production-facility"
        className="min-h-screen bg-goods-cream px-6 py-8 md:px-10 md:py-10 lg:px-14"
      >
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px] flex-col justify-center">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta">
                The production facility
              </p>
              <h2
                data-road-text="production-facility.headline"
                className="goods-pitch-display mt-3 max-w-3xl text-5xl leading-[0.98] md:text-6xl lg:text-7xl"
              >
                One line. Six moves. The offcuts come back.
              </h2>
            </div>
            <div>
              <p
                data-road-text="production-facility.body"
                className="max-w-3xl text-base leading-7 text-goods-sub lg:text-lg lg:leading-8"
              >
                The facility turns sorted local plastic into the X-frames that carry a Stretch
                Bed. Shredding, sheet-making, CNC cutting, finishing and quality checks sit in one
                connected workflow. The material left by each cut goes around again.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-y border-goods-sand py-4 font-mono text-[9px] uppercase tracking-[0.17em] text-goods-sub">
                <span>Containerised</span>
                <span>Repairable by station</span>
                <span>Designed to transfer</span>
              </div>
            </div>
          </div>

          <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {facilityStages.map((stage, stageIndex) => (
              <li
                key={stage.name}
                className="group relative grid min-h-36 grid-cols-[0.9fr_1.1fr] overflow-hidden border border-goods-sand bg-goods-cream-muted"
              >
                <button
                  type="button"
                  onClick={() => setStageOpenIndex(stageIndex)}
                  className="absolute inset-0 z-10 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-inset focus:ring-goods-terracotta"
                  aria-label={`Open ${stage.number} ${stage.name} full screen`}
                >
                  <span className="sr-only">Open {stage.name} full screen</span>
                </button>
                <div
                  data-road-media={`production-facility.${stage.number}.photo`}
                  className="relative min-h-36 overflow-hidden"
                >
                  <Image
                    src={stage.image}
                    alt={stage.name}
                    fill
                    sizes="(max-width: 640px) 45vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-3 left-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-goods-ink/75 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex flex-col justify-between bg-goods-cream p-4">
                  <span className="goods-pitch-display text-3xl text-goods-terracotta">
                    {stage.number}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{stage.name}</h3>
                    <p className="mt-2 text-xs leading-5 text-goods-sub">{stage.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex items-center justify-end border-t border-goods-sand pt-4">
            <Link
              href="/process"
              className="inline-flex shrink-0 items-center gap-2 border-b border-goods-terracotta pb-1 text-sm font-semibold"
            >
              Open the process
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="open-production-facility"
        className="relative min-h-screen overflow-hidden bg-goods-ink"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group absolute inset-0 z-0 cursor-zoom-in"
          aria-label="Open the production facility photograph full screen"
        >
          <div data-road-media="open-production-facility.photo" className="absolute inset-0">
            <Image
              src="/images/process/20260329-factory-panorama.jpg"
              alt="The full containerised Goods production facility"
              fill
              sizes="100vw"
              className="object-contain transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>
          <span className="absolute bottom-8 left-8 inline-flex items-center gap-2 border-b border-white/70 pb-2 text-sm font-semibold text-white drop-shadow-md md:bottom-12 md:left-12">
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
            Explore the facility full screen
          </span>
        </button>

        <FacilityHotspots />

        <div className="pointer-events-none absolute left-8 top-8 z-10 max-w-md text-white md:left-12 md:top-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta-light">
            Inside the line
          </p>
          <h2 className="goods-pitch-display mt-3 text-4xl leading-none drop-shadow-lg md:text-5xl">
            Every station has a job.
          </h2>
        </div>
      </section>

      {stageOpenIndex !== null && (
        <div
          className="fixed inset-0 z-[210] grid bg-goods-ink text-white"
          role="dialog"
          aria-modal="true"
          aria-label={`${facilityStages[stageOpenIndex].name} full-screen photograph`}
        >
          <div className="relative min-h-0">
            <Image
              src={facilityStages[stageOpenIndex].image}
              alt={facilityStages[stageOpenIndex].name}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-black via-black/85 to-transparent px-6 pb-7 pt-24 md:px-10">
            <div className="max-w-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-goods-terracotta-light">
                {facilityStages[stageOpenIndex].number} · The production facility
              </p>
              <h3 className="goods-pitch-display mt-2 text-3xl md:text-5xl">
                {facilityStages[stageOpenIndex].name}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 md:text-base">
                {facilityStages[stageOpenIndex].body}
              </p>
            </div>
            <p className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-white/45 md:block">
              {stageOpenIndex + 1} / {facilityStages.length}
            </p>
          </div>

          <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full border border-white/20 bg-black/70 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() =>
                setStageOpenIndex(
                  (stageOpenIndex + facilityStages.length - 1) % facilityStages.length,
                )
              }
              className="rounded-full p-3 hover:bg-white/10"
              aria-label="Previous production stage"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setStageOpenIndex((stageOpenIndex + 1) % facilityStages.length)}
              className="rounded-full p-3 hover:bg-white/10"
              aria-label="Next production stage"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setStageOpenIndex(null)}
              className="rounded-full p-3 hover:bg-white/10"
              aria-label="Close production stage"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {open && (
        <div
          className={`fixed inset-0 z-[200] touch-none overflow-hidden bg-black ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen production facility photograph"
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
            <Image
              src="/images/process/20260329-factory-panorama.jpg"
              alt="The full containerised Goods production facility"
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            <FacilityHotspots fullScreen />
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
