'use client';

/**
 * A model drawing you can read with your hands. Takes the SVG string one of the renderers
 * produces (placemat-svg.ts, money-flow-svg.ts), draws the arrows in as it scrolls into view,
 * and turns every station or entity into a focusable target: hover, tap or tab to it and the
 * sentence behind it appears beside the drawing. Reduced motion skips the draw-in. Under the
 * drawing, "Read this as a list" prints every box and arrow as text for screen readers and for
 * anyone who wants the words without the picture.
 */

import { useEffect, useMemo, useRef, useState } from 'react';

export interface DiagramItem {
  id: string;
  title: string;
  line: string;
}

export interface DiagramArrow {
  from: string;
  to: string;
  label: string;
}

export function InteractiveDiagram({
  svg,
  w,
  h,
  items,
  arrows,
  itemAttr,
  linkGroupAttr,
  title,
  dark = false,
}: {
  svg: string;
  w: number;
  h: number;
  items: readonly DiagramItem[];
  arrows: readonly DiagramArrow[];
  /** The data attribute the renderer put on each box group, e.g. "data-station". */
  itemAttr: string;
  /** The data attribute on the group holding the arrows, e.g. "data-flows". */
  linkGroupAttr: string;
  title: string;
  dark?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const shown = byId.get(pinned ?? active ?? '') ?? null;

  const markup = useMemo(() => svg.replace('<svg ', '<svg style="width:100%;height:auto;display:block" '), [svg]);

  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const groups = Array.from(root.querySelectorAll<SVGGElement>(`[${itemAttr}]`));
    const cleanups: (() => void)[] = [];
    for (const g of groups) {
      const id = g.getAttribute(itemAttr) ?? '';
      const item = byId.get(id);
      if (!item) continue;
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `${item.title}. ${item.line}`);
      g.style.cursor = 'pointer';
      g.style.outline = 'none';
      const on = () => setActive(id);
      const off = () => setActive(null);
      const toggle = (e: Event) => {
        e.preventDefault();
        setPinned((p) => (p === id ? null : id));
      };
      const key = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') toggle(e);
        if (e.key === 'Escape') setPinned(null);
      };
      g.addEventListener('mouseenter', on);
      g.addEventListener('mouseleave', off);
      g.addEventListener('focus', on);
      g.addEventListener('blur', off);
      g.addEventListener('click', toggle);
      g.addEventListener('keydown', key);
      cleanups.push(() => {
        g.removeEventListener('mouseenter', on);
        g.removeEventListener('mouseleave', off);
        g.removeEventListener('focus', on);
        g.removeEventListener('blur', off);
        g.removeEventListener('click', toggle);
        g.removeEventListener('keydown', key);
      });
    }

    // Arrows draw themselves in, one after another, the first time the drawing is on screen.
    const paths = Array.from(root.querySelectorAll<SVGPathElement>(`[${linkGroupAttr}] path`));
    if (!reduce && paths.length > 0) {
      for (const p of paths) {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = `${len}`;
        p.style.transition = 'none';
      }
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          paths.forEach((p, i) => {
            p.style.transition = `stroke-dashoffset 900ms cubic-bezier(.4,0,.2,1) ${i * 180}ms`;
            p.style.strokeDashoffset = '0';
          });
          // Dashed lines keep their own pattern once drawn.
          window.setTimeout(() => {
            for (const p of paths) {
              p.style.transition = 'none';
              p.style.strokeDasharray = p.getAttribute('stroke-dasharray') ?? '';
              p.style.strokeDashoffset = '';
            }
          }, 900 + paths.length * 180 + 50);
          io.disconnect();
        },
        { threshold: 0.35 },
      );
      io.observe(root);
      cleanups.push(() => io.disconnect());
    }
    return () => cleanups.forEach((fn) => fn());
  }, [markup, byId, itemAttr, linkGroupAttr]);

  // Dim everything but the active box.
  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const groups = Array.from(root.querySelectorAll<SVGGElement>(`[${itemAttr}]`));
    const current = pinned ?? active;
    for (const g of groups) {
      const id = g.getAttribute(itemAttr);
      g.style.transition = 'opacity 200ms ease';
      g.style.opacity = current && id !== current ? '0.45' : '1';
    }
  }, [active, pinned, itemAttr, markup]);

  const ink = dark ? 'text-goods-cream' : 'text-goods-ink';
  const soft = dark ? 'text-goods-cream/70' : 'text-[#5d574c]';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
      <figure className="m-0">
        <div
          ref={host}
          style={{ width: '100%', aspectRatio: `${w} / ${h}`, lineHeight: 0 }}
          // One <svg> string from the renderer; nothing user-supplied is in it.
          dangerouslySetInnerHTML={{ __html: markup }}
        />
        <figcaption className={`mt-3 text-sm ${soft}`}>{title}. Hover, tap or tab to a box to read it.</figcaption>
      </figure>
      <aside aria-live="polite" className={`rounded-[18px] border p-5 ${dark ? 'border-goods-cream/20 bg-goods-cream/5' : 'border-[#e6dfd1] bg-[#fffdf9]'} lg:sticky lg:top-32`}>
        {shown ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-goods-terracotta">{pinned ? 'Pinned' : 'Reading'}</p>
            <h3 className={`mt-2 font-display text-2xl font-semibold leading-tight ${ink}`}>{shown.title}</h3>
            <p className={`mt-3 text-[15px] leading-relaxed ${soft}`}>{shown.line}</p>
            {pinned && (
              <button type="button" onClick={() => setPinned(null)} className={`mt-4 text-sm underline underline-offset-2 ${soft}`}>
                Unpin
              </button>
            )}
          </>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-goods-terracotta">The drawing</p>
            <p className={`mt-3 text-[15px] leading-relaxed ${soft}`}>Every box is a place the beds or the money go. Point at one to read what it does. Click to keep it open.</p>
          </>
        )}
        <details className="mt-5">
          <summary className={`cursor-pointer text-sm font-semibold ${ink}`}>Read this as a list</summary>
          <dl className="mt-3 space-y-3">
            {items.map((i) => (
              <div key={i.id}>
                <dt className={`text-sm font-semibold ${ink}`}>{i.title}</dt>
                <dd className={`text-sm ${soft}`}>{i.line}</dd>
              </div>
            ))}
          </dl>
          <ul className={`mt-4 space-y-1 text-sm ${soft}`} aria-label="Arrows">
            {arrows.map((a, i) => (
              <li key={`${a.from}-${a.to}-${i}`}>
                {byId.get(a.from)?.title ?? a.from} to {byId.get(a.to)?.title ?? a.to}: {a.label}.
              </li>
            ))}
          </ul>
        </details>
      </aside>
    </div>
  );
}
