'use client';

/**
 * The trade, drawn once. Eight stations on a grid around one dark centre, with the lines between
 * them measured from the cards after layout, so moving a card moves its arrows. The placemat
 * renders every station; the story reveals them one step at a time through `visible` and `focus`.
 * Words, stations and flows come from @/lib/data/model-placemat.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FLOWS, SHEET, STATIONS, type Flow, type LineKind, type Side, type Station, type StationId } from '@/lib/data/model-placemat';
import styles from './model-placemat.module.css';

export const LOOP_W = 940;
export const LOOP_H = 640;

type Rect = { x: number; y: number; w: number; h: number };
type Pt = { x: number; y: number };

const NORMAL: Record<Side, Pt> = {
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const LINE: Record<LineKind, { stroke: string; width: number; dash?: string }> = {
  goods: { stroke: '#c45c3e', width: 5 },
  money: { stroke: '#5e7a4c', width: 5 },
  future: { stroke: '#a8643f', width: 3.5, dash: '10 8' },
  support: { stroke: '#5d574c', width: 2, dash: '2 6' },
};

function anchor(r: Rect, side: Side, at = 0.5): Pt {
  switch (side) {
    case 'top':
      return { x: r.x + r.w * at, y: r.y };
    case 'bottom':
      return { x: r.x + r.w * at, y: r.y + r.h };
    case 'left':
      return { x: r.x, y: r.y + r.h * at };
    case 'right':
      return { x: r.x + r.w, y: r.y + r.h * at };
  }
}

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  };
}

type Drawn = { flow: Flow; d: string; label: Pt };

function draw(flow: Flow, rects: Partial<Record<StationId, Rect>>): Drawn | null {
  const from = rects[flow.from];
  const to = rects[flow.to];
  if (!from || !to) return null;
  const a0 = anchor(from, flow.fromSide, flow.fromAt);
  const b0 = anchor(to, flow.toSide, flow.toAt);
  // Lift the ends off the card edges so the arrowhead does not sit on the border.
  const a = { x: a0.x + NORMAL[flow.fromSide].x * 3, y: a0.y + NORMAL[flow.fromSide].y * 3 };
  const b = { x: b0.x + NORMAL[flow.toSide].x * 6, y: b0.y + NORMAL[flow.toSide].y * 6 };
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const reach = flow.bend ?? Math.max(36, Math.min(160, dist * 0.45));
  const c1 = { x: a.x + NORMAL[flow.fromSide].x * reach, y: a.y + NORMAL[flow.fromSide].y * reach };
  const c2 = { x: b.x + NORMAL[flow.toSide].x * reach, y: b.y + NORMAL[flow.toSide].y * reach };
  const r = (n: number) => Math.round(n * 10) / 10;
  return {
    flow,
    d: `M${r(a.x)},${r(a.y)} C${r(c1.x)},${r(c1.y)} ${r(c2.x)},${r(c2.y)} ${r(b.x)},${r(b.y)}`,
    label: bezier(a, c1, c2, b, flow.labelAt ?? 0.5),
  };
}

export type Visible = 'all' | ReadonlySet<StationId>;

const PLACE: Record<StationId, string> = {
  harvest: styles.harvest,
  next: styles.next,
  orgs: styles.orgs,
  act: styles.act,
  buyers: styles.buyers,
  facility: styles.facility,
  money: styles.moneyCard,
  decide: styles.decide,
};

function Card({ station, active, focus }: { station: Station; active: boolean; focus: boolean }) {
  const family = styles[station.family] ?? '';
  const className = `${styles.card} ${family} ${PLACE[station.id]}`;
  if (station.drawing) {
    return (
      <div className={className} data-station={station.id} data-active={active} data-focus={focus}>
        {/* The kit container: the one drawing on the sheet. Plain img so the SVG keeps its own line. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.harvestDrawing} src={station.drawing.src} alt={station.drawing.alt} />
        <div className={styles.harvestText}>
          <h3>{station.title}</h3>
          <p>{station.line}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-station={station.id} data-active={active} data-focus={focus}>
      <h3>{station.title}</h3>
      <p>{station.line}</p>
    </div>
  );
}

function Arrows({ drawn, size, show }: { drawn: Drawn[]; size: { w: number; h: number }; show: (id: StationId) => boolean }) {
  return (
    <svg className={styles.arrows} viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden="true">
      <defs>
        {(Object.keys(LINE) as LineKind[]).map((kind) => (
          <marker
            key={kind}
            id={`placemat-head-${kind}`}
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth={kind === 'support' ? 6 : 4.2}
            markerHeight={kind === 'support' ? 6 : 4.2}
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M1 1 L9 5 L1 9 Z" fill={LINE[kind].stroke} />
          </marker>
        ))}
      </defs>
      {drawn.map(({ flow, d, label }) => {
        const active = show(flow.from) && show(flow.to);
        return (
          <g key={`${flow.from}-${flow.to}`} className={styles.flow} data-active={active}>
            <path
              d={d}
              fill="none"
              stroke={LINE[flow.kind].stroke}
              strokeWidth={LINE[flow.kind].width}
              strokeDasharray={LINE[flow.kind].dash}
              strokeLinecap="round"
              markerEnd={`url(#placemat-head-${flow.kind})`}
            />
            <text
              className={styles.label}
              x={label.x + (flow.labelDx ?? 0)}
              y={label.y + (flow.labelDy ?? 0)}
              dy="0.35em"
              textAnchor={flow.labelAnchor ?? 'middle'}
              fill={LINE[flow.kind].stroke}
            >
              {flow.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ModelLoop({ visible = 'all', focus = [], standalone = false }: { visible?: Visible; focus?: readonly StationId[]; standalone?: boolean }) {
  const loopRef = useRef<HTMLElement>(null);
  const [drawn, setDrawn] = useState<Drawn[]>([]);
  const [size, setSize] = useState({ w: LOOP_W, h: LOOP_H });

  const measure = useCallback(() => {
    const loop = loopRef.current;
    if (!loop) return;
    // The loop may sit inside a scaled frame; measure in layout px, relative to itself.
    const base = loop.getBoundingClientRect();
    const scale = base.width / loop.offsetWidth || 1;
    const rects: Partial<Record<StationId, Rect>> = {};
    loop.querySelectorAll<HTMLElement>('[data-station]').forEach((el) => {
      const r = el.getBoundingClientRect();
      rects[el.dataset.station as StationId] = {
        x: (r.left - base.left) / scale,
        y: (r.top - base.top) / scale,
        w: r.width / scale,
        h: r.height / scale,
      };
    });
    setSize({ w: base.width / scale, h: base.height / scale });
    setDrawn(FLOWS.map((f) => draw(f, rects)).filter((x): x is Drawn => x !== null));
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const loop = loopRef.current;
    if (!loop) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(loop);
    loop.querySelectorAll<HTMLElement>('[data-station]').forEach((el) => ro.observe(el));
    // Fonts swap after first paint and change every card's height.
    document.fonts?.ready.then(() => measure()).catch(() => undefined);
    return () => ro.disconnect();
  }, [measure]);

  const show = (id: StationId) => visible === 'all' || visible.has(id);
  const isFocus = (id: StationId) => focus.includes(id);

  return (
    <section ref={loopRef} className={`${styles.loop} ${standalone ? styles.loopStandalone : ''}`} aria-label="The trade">
      {(Object.keys(STATIONS) as StationId[]).map((id) => (
        <Card key={id} station={STATIONS[id]} active={show(id)} focus={isFocus(id)} />
      ))}
      <div className={styles.centre} data-active={visible === 'all' || visible.size > 0}>
        {SHEET.centre}
      </div>
      <Arrows drawn={drawn} size={size} show={show} />
    </section>
  );
}
