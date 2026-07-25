/**
 * Shared map geometry for every Goods map surface.
 *
 * Extracted from src/app/admin/atlas/atlas-client.tsx so the Atlas and the
 * three deck map views project identically. Real geometry: ABS-derived state
 * boundaries (CC-BY 4.0), pre-projected to Web-Mercator SVG paths at build
 * time into australia-map.json. The projection here MUST match that bake.
 */
import AUS from '@/lib/data/australia-map.json';

export const MAP_W: number = AUS.w;
export const MAP_H: number = AUS.h;
export const MAP_STATES = AUS.states as Array<{ name: string; d: string }>;

const [LNG_MIN, LNG_MAX, LAT_MIN, LAT_MAX] = AUS.bounds as [number, number, number, number];
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const Y_TOP = mercY(LAT_MAX);
const Y_BOT = mercY(LAT_MIN);

export const px = (lng: number) => ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * MAP_W;
export const py = (lat: number) => ((Y_TOP - mercY(lat)) / (Y_TOP - Y_BOT)) * MAP_H;

/** The on-Country plant (Kirmos facility, Alice Springs). The runs start here. */
export const PLANT = { lng: 133.8807, lat: -23.698, label: 'the plant' };

/** Curved "run" from the plant to a community. */
export function runPath(cx: number, cy: number) {
  const x0 = px(PLANT.lng);
  const y0 = py(PLANT.lat);
  const dx = cx - x0;
  const dy = cy - y0;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return '';
  const bow = Math.min(60, dist * 0.14);
  const qx = (x0 + cx) / 2 - (dy / dist) * bow;
  const qy = (y0 + cy) / 2 + (dx / dist) * bow;
  return `M${x0},${y0} Q${qx.toFixed(1)},${qy.toFixed(1)} ${cx},${cy}`;
}

interface Rect { x1: number; y1: number; x2: number; y2: number }
const overlaps = (a: Rect, b: Rect) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;

export interface LabelPoint { id: string; lat: number; lng: number; r: number; weight: number; label: string; sub?: string; subLines?: number }
export interface Placement { x: number; y: number; r: number; side: 1 | -1; lift: number }

/**
 * Greedy collision-free label layout, ported from the Atlas. Heaviest place
 * goes first; each label tries side x vertical-step candidates until it finds
 * a box that clears every marker and every already-placed label.
 */
export function placeLabels(points: LabelPoint[]): Map<string, Placement> {
  const items = points
    .map((p) => ({ p, x: px(p.lng), y: py(p.lat) }))
    .sort((a, b) => b.p.weight - a.p.weight);
  const rects: Rect[] = items.map(({ p, x, y }) => ({ x1: x - p.r - 2, y1: y - p.r - 2, x2: x + p.r + 2, y2: y + p.r + 2 }));
  const plx = px(PLANT.lng);
  const ply = py(PLANT.lat);
  rects.push({ x1: plx - 40, y1: ply - 12, x2: plx + 40, y2: ply + 30 });

  const out = new Map<string, Placement>();
  for (const { p, x, y } of items) {
    const w = Math.max(p.label.length * 7.2, p.sub ? 78 : 0) + 10;
    const h = p.sub ? 16 + (p.subLines ?? 1) * 12 : 16;
    const lifts = [0, -16, 16, -30, 30, -46, 46, -64, 64, -84, 84];
    let chosen: { side: 1 | -1; lift: number } | null = null;
    outer: for (const lift of lifts) {
      for (const side of (x > MAP_W * 0.5 ? [-1, 1] : [1, -1]) as Array<1 | -1>) {
        const lx = x + side * (p.r + 11);
        const ly = y + lift;
        const rect: Rect =
          side === 1
            ? { x1: lx - 2, y1: ly - 12, x2: lx + w, y2: ly - 12 + h }
            : { x1: lx - w, y1: ly - 12, x2: lx + 2, y2: ly - 12 + h };
        if (rect.x1 < 4 || rect.x2 > MAP_W - 4 || rect.y1 < 4 || rect.y2 > MAP_H - 4) continue;
        if (!rects.some((r) => overlaps(r, rect))) {
          rects.push(rect);
          chosen = { side, lift };
          break outer;
        }
      }
    }
    const pick = chosen || { side: (x > MAP_W * 0.5 ? -1 : 1) as 1 | -1, lift: 0 };
    out.set(p.id, { x, y, r: p.r, side: pick.side, lift: pick.lift });
  }
  return out;
}

export const INK = {
  paper: '#FBF8F1',
  land: '#F3ECDD',
  landEdge: '#DFD2B8',
  terracotta: '#B44D2B',
  terracottaDeep: '#7E3C1D',
  sage: '#3E7B74',
  sageLight: '#4E8F88',
  text: '#26201B',
  muted: '#8A7F72',
} as const;
