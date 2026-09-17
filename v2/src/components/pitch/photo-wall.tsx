'use client';

/**
 * The trip in pictures, edge to edge, the way a photo library lays out a day: justified rows that
 * keep every photograph's own shape, each with a small tag for the place. Place chips filter the
 * wall. Press any photo, or "View full screen", to step through them one at a time: arrow keys,
 * swipe, a slideshow, the browser's full screen, and a strip of thumbnails.
 *
 * Shapes are read from tiny renders first (48 px wide, a kilobyte or two each) so the rows are laid
 * out once, without jumping as the real thumbnails arrive. Thumbnails come from Supabase's image
 * renderer at a width bucket for the tile; the viewer loads the original.
 */

import { ChevronLeft, ChevronRight, Expand, Pause, Play, Shrink, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface WallPhoto {
  src: string;
  alt: string;
  caption?: string;
}

export interface WallGroup {
  label: string;
  photos: WallPhoto[];
}

const GAP = 4;
const SLIDE_MS = 4500;

/**
 * A Supabase public object rendered at a width; any other URL is returned as it is. `resize=contain`
 * matters: with a width alone Supabase keeps the original height and crops, so a 2000 x 1333
 * photo comes back 48 x 1333 and the wall draws slivers.
 */
function thumb(src: string, width: number): string {
  const marker = '/storage/v1/object/public/';
  if (!src.includes(marker)) return src;
  return `${src.replace(marker, '/storage/v1/render/image/public/')}?width=${width}&resize=contain&quality=72`;
}

function rowHeight(width: number): number {
  if (width >= 1400) return 330;
  if (width >= 1024) return 280;
  if (width >= 640) return 210;
  return 140;
}

type Tile = { i: number; w: number; h: number };

/** Greedy justified rows: fill a row until it would be shorter than the target, then fit it to the width. */
function justify(ratios: number[], order: number[], width: number): Tile[][] {
  const target = rowHeight(width);
  const rows: Tile[][] = [];
  let row: number[] = [];
  let sum = 0;
  const place = (items: number[], h: number, fill: boolean) => {
    const tiles = items.map((j) => ({ i: j, w: Math.floor(ratios[j] * h), h: Math.round(h) }));
    if (fill && tiles.length > 0) {
      const used = tiles.slice(0, -1).reduce((n, t) => n + t.w, 0) + GAP * (tiles.length - 1);
      tiles[tiles.length - 1].w = width - used;
    }
    rows.push(tiles);
  };
  for (const i of order) {
    row.push(i);
    sum += ratios[i];
    const h = (width - GAP * (row.length - 1)) / sum;
    if (h <= target) {
      place(row, h, true);
      row = [];
      sum = 0;
    }
  }
  if (row.length > 0) place(row, Math.min(target, (width - GAP * (row.length - 1)) / sum), false);
  return rows;
}

export function PhotoWall({ groups, title, sub }: { groups: WallGroup[]; title: string; sub?: string }) {
  const flat = useMemo(() => groups.flatMap((g) => g.photos.map((p) => ({ ...p, group: g.label }))), [groups]);
  const [filter, setFilter] = useState<string | null>(null);
  const visible = useMemo(() => flat.map((_, i) => i).filter((i) => !filter || flat[i].group === filter), [flat, filter]);
  const [ratios, setRatios] = useState<number[] | null>(null);
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [full, setFull] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all(
      flat.map(
        (p) =>
          new Promise<number>((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1.5);
            img.onerror = () => resolve(1.5);
            img.src = thumb(p.src, 48);
          }),
      ),
    ).then((r) => alive && setRatios(r));
    return () => {
      alive = false;
    };
  }, [flat]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo(() => (ratios && width > 0 ? justify(ratios, visible, width) : []), [ratios, width, visible]);

  const step = useCallback(
    (delta: number) =>
      setOpen((o) => {
        if (o === null || visible.length === 0) return o;
        const at = Math.max(0, visible.indexOf(o));
        return visible[(at + delta + visible.length) % visible.length];
      }),
    [visible],
  );

  const openAt = (i: number, slideshow = false) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setPlaying(slideshow);
    setOpen(i);
  };

  const close = useCallback(() => {
    setOpen(null);
    setPlaying(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    returnFocus.current?.focus();
  }, []);

  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') { setPlaying(false); step(1); }
      else if (e.key === 'ArrowLeft') { setPlaying(false); step(-1); }
      else if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p); }
    };
    const onFull = () => setFull(Boolean(document.fullscreenElement));
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFull);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFull);
    };
  }, [isOpen, close, step]);

  // Slideshow, and warm the neighbours so the next photo is already there.
  useEffect(() => {
    if (open === null) return;
    const at = visible.indexOf(open);
    [at + 1, at - 1].forEach((n) => {
      const p = flat[visible[(n + visible.length) % visible.length]];
      if (p) new window.Image().src = p.src;
    });
    stripRef.current?.querySelector(`[data-t="${open}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    if (!playing) return;
    const t = window.setTimeout(() => step(1), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [open, playing, flat, visible, step]);

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void dialogRef.current?.requestFullscreen?.().catch(() => {});
  };

  if (flat.length === 0) return null;
  const current = open === null ? null : flat[open];
  const dpr = typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  const bucket = (w: number) => (w * dpr <= 600 ? 600 : w * dpr <= 1000 ? 1000 : 1600);

  return (
    <section aria-label={title}>
      <style>{'@keyframes pw-rise{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:no-preference){.pw-tile{animation:pw-rise .7s cubic-bezier(.2,.7,.2,1) both}.pw-in{animation:pw-rise .45s ease-out both}}@keyframes pw-bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}'}</style>

      <div className="px-6 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-4xl font-semibold leading-tight md:text-5xl">{title}</h3>
            {sub && <p className="mt-2 text-[#5d574c]">{sub}</p>}
          </div>
          <button type="button" onClick={() => openAt(visible[0] ?? 0, true)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-goods-ink px-5 text-sm font-semibold text-goods-cream transition-colors hover:bg-goods-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta">
            <Expand className="h-4 w-4" aria-hidden="true" />
            View full screen
          </button>
        </div>
        <div className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-2" role="group" aria-label="Show photos from">
          {[{ label: 'All', value: null as string | null, count: flat.length }, ...groups.map((g) => ({ label: g.label, value: g.label as string | null, count: g.photos.length }))].map((chip) => {
            const on = filter === chip.value;
            return (
              <button
                key={chip.label}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(chip.value)}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta ${on ? 'border-goods-ink bg-goods-ink text-goods-cream' : 'border-[#d9d0bf] text-[#4a4741] hover:border-goods-ink'}`}
              >
                {chip.label}
                <span className={on ? 'text-goods-cream/60' : 'text-[#9a917f]'}>{chip.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={gridRef} className="mt-6 px-1 md:px-1.5">
        {rows.length === 0 ? (
          <div className="grid h-[60vh] place-items-center rounded-md bg-[#efe9dd] text-sm text-[#7a7363]">Laying out the photographs</div>
        ) : (
          <div className="flex flex-col" style={{ gap: GAP }}>
            {rows.map((row, r) => (
              <div key={r} className="flex" style={{ gap: GAP }}>
                {row.map(({ i, w, h }, k) => {
                  const p = flat[i];
                  return (
                    <button
                      key={p.src}
                      type="button"
                      onClick={() => openAt(i)}
                      style={{ width: w, height: h, animationDelay: `${Math.min(r * 2 + k, 30) * 35}ms` }}
                      className="pw-tile group relative shrink-0 overflow-hidden bg-[#e6dfd1] focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta"
                      aria-label={`Open photo: ${p.alt}. ${p.group}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb(p.src, bucket(w))} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
                      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" aria-hidden="true" />
                      {/*
                        * The badge used to print the GROUP on every tile, so forty photographs in
                        * a set all claimed the same place and most of them were wrong about it
                        * (Ben, 17 September). A photo's own alt is the only per-photo description
                        * we hold, so it says that, and falls back to the group when there is none.
                        */}
                      <span className="pointer-events-none absolute bottom-2 left-2 line-clamp-1 max-w-[calc(100%-1rem)] rounded-full bg-black/45 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm" aria-hidden="true">
                        {p.alt || p.group}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {current && open !== null && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`${title}, photo ${visible.indexOf(open) + 1} of ${visible.length}`} className="fixed inset-0 z-[200] flex flex-col bg-[#0b0a08] text-goods-cream">
          <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
            <p className="text-sm">
              <span className="font-semibold tabular-nums">{visible.indexOf(open) + 1} / {visible.length}</span>
              <span className="text-goods-cream/60"> · {current.group}</span>
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setPlaying((p) => !p)} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm hover:bg-white/10" aria-pressed={playing}>
                {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                <span className="hidden sm:inline">{playing ? 'Pause' : 'Slideshow'}</span>
              </button>
              <button type="button" onClick={toggleFull} className="rounded-full p-3 hover:bg-white/10" aria-label={full ? 'Leave full screen' : 'Full screen'}>
                {full ? <Shrink className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
              </button>
              <button ref={closeRef} type="button" onClick={close} className="rounded-full p-3 hover:bg-white/10" aria-label="Close the photos">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20"
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) { setPlaying(false); step(dx < 0 ? 1 : -1); }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={open} src={current.src} alt={current.alt} className="pw-in max-h-full max-w-full select-none rounded-sm object-contain" draggable={false} />
            <button type="button" onClick={() => { setPlaying(false); step(-1); }} className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 md:block" aria-label="Previous photo">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button type="button" onClick={() => { setPlaying(false); step(1); }} className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 md:block" aria-label="Next photo">
              <ChevronRight className="h-6 w-6" />
            </button>
            {playing && <span key={`bar-${open}`} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-goods-terracotta" style={{ animation: `pw-bar ${SLIDE_MS}ms linear` }} aria-hidden="true" />}
          </div>

          {current.caption && <p className="px-6 pt-3 text-center text-sm text-goods-cream/75">{current.caption}</p>}

          <div ref={stripRef} className="flex gap-1.5 overflow-x-auto px-4 py-3 md:px-6" aria-label="All photos">
            {visible.map((i) => (
              <button
                key={`t-${flat[i].src}`}
                data-t={i}
                type="button"
                onClick={() => { setPlaying(false); setOpen(i); }}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded ${i === open ? 'ring-2 ring-goods-terracotta' : 'opacity-50 hover:opacity-90'}`}
                aria-label={`Photo ${visible.indexOf(i) + 1}, ${flat[i].group}`}
                aria-current={i === open ? 'true' : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(flat[i].src, 160)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
