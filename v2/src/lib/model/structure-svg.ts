/**
 * The QBE Q3 structure and funding-flow diagram as one SVG, drawn from the typed
 * data in @/lib/data/structure-diagram. Same method as the placemat renderer
 * (placemat-svg.ts): every entity sits in a cell of a 20 by 15 grid, every arrow
 * is computed from the edges of the cells it joins, and every arrow label finds
 * its own clear spot. Plain TypeScript, no DOM, so the page, the render script
 * and the guards share one function.
 *
 * The helpers are a copy of the placemat's rather than an import, because that
 * module keeps its own placement report and the two sheets must not share it.
 */

import {
  ENTITIES,
  LINKS,
  SHEET,
  STRUCTURE_H,
  STRUCTURE_READ_AT,
  STRUCTURE_W,
  type EntityId,
  type EntityStyle,
  type Link,
  type LinkKind,
  type Side,
} from '@/lib/data/structure-diagram';

/* ------------------------------------------------------------------ tokens */

export const COLOUR = {
  paper: '#FBF8F1',
  card: '#FFFFFF',
  muted: '#F1ECE4',
  rail: '#E6DFD1',
  ink: '#2B2A26',
  ink2: '#4A4741',
  ink3: '#7A7363',
  terracotta: '#C45C3E',
  clay: '#A8643F',
  sage: '#8B9D77',
  green: '#5E7A4C',
  sageTint: '#E9EDE3',
  clayTint: '#F3E4DA',
  warn: '#A33C22',
} as const;

export const FONT = {
  display: "'Playfair Display', Georgia, 'Times New Roman', serif",
  body: "Inter, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
} as const;

const STYLE: Record<EntityStyle, { fill: string; stroke: string; strokeWidth: number; dashed: boolean; ink: string }> = {
  applicant: { fill: COLOUR.sageTint, stroke: COLOUR.ink, strokeWidth: 1.5, dashed: false, ink: COLOUR.ink },
  related: { fill: COLOUR.card, stroke: COLOUR.rail, strokeWidth: 1, dashed: false, ink: COLOUR.ink },
  dormant: { fill: COLOUR.muted, stroke: COLOUR.rail, strokeWidth: 1, dashed: true, ink: COLOUR.ink3 },
  outside: { fill: COLOUR.card, stroke: COLOUR.rail, strokeWidth: 1, dashed: false, ink: COLOUR.ink },
  money: { fill: COLOUR.clayTint, stroke: COLOUR.rail, strokeWidth: 1, dashed: false, ink: COLOUR.ink },
};

const LINE: Record<LinkKind, { stroke: string; width: number; dash?: string; marker: boolean }> = {
  money: { stroke: COLOUR.green, width: 3, marker: true },
  goods: { stroke: COLOUR.terracotta, width: 3, marker: true },
  transfer: { stroke: COLOUR.clay, width: 2.5, marker: true },
  future: { stroke: COLOUR.green, width: 2.5, dash: '9 7', marker: true },
  never: { stroke: COLOUR.warn, width: 2, dash: '5 5', marker: false },
};

export const LABEL_CLEARANCE = 8;
export const CARD_PAD = 16;

/* -------------------------------------------------------------------- grid */

export interface Cell {
  col: number;
  colSpan: number;
  row: number;
  rowSpan: number;
  inset?: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The one place the sheet's geometry is decided. */
export const LAYOUT = {
  sheet: { w: STRUCTURE_W, h: STRUCTURE_H },
  margin: 32,
  headerH: 72,
  footerH: 32,
  cols: 20,
  rows: 20,
  gutter: 8,
  /**
   * Columns 6 to 7 and 15 to 16 are channels for the sideways arrows and their
   * labels; rows 5 and 6 (under the funders), row 6 (right side) and row 17 are channels
   * for the vertical ones. The dashed boundary wraps rows 5 to 16 of columns 1 to 14.
   */
  cells: {
    funders: { col: 6, colSpan: 11, row: 1, rowSpan: 4 },
    dewr: { col: 17, colSpan: 4, row: 1, rowSpan: 5 },
    act: { col: 1, colSpan: 5, row: 7, rowSpan: 4 },
    sole: { col: 1, colSpan: 5, row: 11, rowSpan: 4 },
    akt: { col: 1, colSpan: 5, row: 15, rowSpan: 2 },
    centre: { col: 8, colSpan: 7, row: 7, rowSpan: 10 },
    oonchiumpa: { col: 17, colSpan: 4, row: 7, rowSpan: 10 },
    orgs: { col: 7, colSpan: 5, row: 18, rowSpan: 3 },
    customers: { col: 14, colSpan: 5, row: 18, rowSpan: 3 },
  } satisfies Record<EntityId, Cell>,
  /** The dashed boundary around the applicant and its related entities, in grid terms. */
  boundary: { col: 1, colSpan: 14, row: 5, rowSpan: 12 } satisfies Cell,
} as const;

function gridArea(): Rect {
  const { margin, headerH, footerH, sheet } = LAYOUT;
  return { x: margin, y: margin + headerH, w: sheet.w - margin * 2, h: sheet.h - margin * 2 - headerH - footerH };
}

function rectOf(c: Cell): Rect {
  const g = gridArea();
  const colW = g.w / LAYOUT.cols;
  const rowH = g.h / LAYOUT.rows;
  const inset = c.inset ?? LAYOUT.gutter;
  return { x: g.x + (c.col - 1) * colW + inset, y: g.y + (c.row - 1) * rowH + inset, w: c.colSpan * colW - inset * 2, h: c.rowSpan * rowH - inset * 2 };
}

export function cellRect(id: EntityId): Rect {
  return rectOf(LAYOUT.cells[id]);
}

export function anchor(r: Rect, side: Side, at = 0.5): { x: number; y: number } {
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

function outward(side: Side): { x: number; y: number } {
  return side === 'top' ? { x: 0, y: -1 } : side === 'bottom' ? { x: 0, y: 1 } : side === 'left' ? { x: -1, y: 0 } : { x: 1, y: 0 };
}

type Pt = { x: number; y: number };

export function linkPath(link: Link): { d: string; p0: Pt; p1: Pt; p2: Pt; p3: Pt } {
  const a = cellRect(link.from);
  const b = cellRect(link.to);
  const p0 = anchor(a, link.fromSide, link.fromAt);
  const p3 = anchor(b, link.toSide, link.toAt);
  const dist = Math.hypot(p3.x - p0.x, p3.y - p0.y);
  const bend = link.bend ?? Math.max(16, dist / 2.5);
  const o0 = outward(link.fromSide);
  const o3 = outward(link.toSide);
  const p1 = { x: p0.x + o0.x * bend, y: p0.y + o0.y * bend };
  const p2 = { x: p3.x + o3.x * bend, y: p3.y + o3.y * bend };
  return { d: `M${f(p0.x)} ${f(p0.y)} C${f(p1.x)} ${f(p1.y)}, ${f(p2.x)} ${f(p2.y)}, ${f(p3.x)} ${f(p3.y)}`, p0, p1, p2, p3 };
}

function bezierAt(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function bezierTangent(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
  const u = 1 - t;
  const x = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const y = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  const n = Math.hypot(x, y) || 1;
  return { x: x / n, y: y / n };
}

/* -------------------------------------------------------------------- text */

const ADVANCE = { display: 0.6, body: 0.56 } as const;

function textWidth(s: string, size: number, face: keyof typeof ADVANCE): number {
  return s.length * size * ADVANCE[face];
}

export function wrap(text: string, widthPx: number, fontSize: number, face: keyof typeof ADVANCE): string[] {
  const maxChars = Math.max(6, Math.floor(widthPx / (fontSize * ADVANCE[face])));
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function f(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

interface TextOpts {
  size: number;
  face: keyof typeof ADVANCE;
  weight?: number;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
  lineHeight?: number;
}

/* ------------------------------------------------------------- the report */

export type ReportKind = 'text' | 'card' | 'line';

export interface Placed {
  kind: ReportKind;
  owner: string;
  label?: string;
  rect: Rect;
}

let report: Placed[] = [];

function place(p: Placed): void {
  report.push(p);
}

function textRect(lines: string[], x: number, y: number, o: TextOpts): Rect {
  const lh = o.lineHeight ?? o.size * 1.25;
  const w = Math.max(...lines.map((l) => textWidth(l, o.size, o.face)));
  const h = (lines.length - 1) * lh + o.size;
  const top = y - o.size * 0.8;
  const left = o.anchor === 'middle' ? x - w / 2 : o.anchor === 'end' ? x - w : x;
  return { x: left, y: top, w, h };
}

function textBlock(lines: string[], x: number, y: number, o: TextOpts, owner: string): { svg: string; height: number; rect: Rect } {
  const lh = o.lineHeight ?? o.size * 1.25;
  const font = o.face === 'display' ? FONT.display : FONT.body;
  const spans = lines.map((l, i) => `<tspan x="${f(x)}" ${i === 0 ? `y="${f(y)}"` : `dy="${f(lh)}"`}>${esc(l)}</tspan>`).join('');
  const style = `font-family:${font};font-size:${o.size}px;font-weight:${o.weight ?? 400};`;
  const rect = textRect(lines, x, y, o);
  place({ kind: 'text', owner, label: lines.join(' '), rect });
  return { svg: `<text style="${style}" fill="${o.fill ?? COLOUR.ink}" text-anchor="${o.anchor ?? 'start'}">${spans}</text>`, height: lines.length * lh, rect };
}

/* ------------------------------------------------------------------- boxes */

function card(r: Rect, s: { fill: string; stroke: string; strokeWidth: number; dashed: boolean }, owner: string, radius = 12): string {
  place({ kind: 'card', owner, rect: r });
  return `<rect x="${f(r.x)}" y="${f(r.y)}" width="${f(r.w)}" height="${f(r.h)}" rx="${radius}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}"${s.dashed ? ' stroke-dasharray="6 5"' : ''}/>`;
}

/** An entity card: title in Playfair, lines in Inter, the block centred vertically. Type shrinks in steps until it fits the card. */
function entity(id: EntityId): string {
  const e = ENTITIES[id];
  const r = cellRect(id);
  const st = STYLE[e.style];
  const owner = `entity:${id}`;
  const big = id === 'centre';
  const pad = big ? CARD_PAD : 14;
  const textX = r.x + pad;
  const textW = r.w - pad * 2;
  const baseTitle = big ? 19 : 14;
  const baseLine = big ? 11.5 : 11;
  let fit = { titleSize: baseTitle, lineSize: baseLine, titleLines: [] as string[], bodyLines: [] as string[], total: Infinity };
  for (const scale of [1, 0.95, 0.9, 0.85, 0.8, 0.75]) {
    const titleSize = Math.round(baseTitle * scale * 2) / 2;
    const lineSize = Math.round(baseLine * scale * 2) / 2;
    const titleLines = wrap(e.title, textW, titleSize, 'display');
    const bodyLines = e.lines.flatMap((l) => wrap(l, textW, lineSize, 'body'));
    const total = (titleLines.length - 1) * titleSize * 1.15 + titleSize + 6 + (bodyLines.length - 1) * lineSize * 1.3 + lineSize;
    fit = { titleSize, lineSize, titleLines, bodyLines, total };
    if (total <= r.h - pad * 2) break;
  }
  const { titleSize, lineSize, titleLines, bodyLines, total } = fit;
  const titleLh = titleSize * 1.15;
  const lineLh = lineSize * 1.3;
  const gap = 6;
  const top = r.y + Math.max(pad, (r.h - total) / 2) + titleSize * 0.8;
  const t = textBlock(titleLines, textX, top, { size: titleSize, face: 'display', weight: 600, fill: st.ink, lineHeight: titleLh }, owner);
  const l = textBlock(bodyLines, textX, top + (titleLines.length - 1) * titleLh + gap + lineSize, { size: lineSize, face: 'body', fill: e.style === 'dormant' ? COLOUR.ink3 : COLOUR.ink2, lineHeight: lineLh }, owner);
  return `<g data-entity="${id}">${card(r, st, owner)}${t.svg}${l.svg}</g>`;
}

/** The dashed line around the applicant and its related entities, with its label in the gap above the centre. */
function boundary(): string {
  const r = rectOf({ ...LAYOUT.boundary, inset: 0 });
  const owner = 'boundary';
  const label = textBlock([SHEET.boundary], r.x + 10, r.y + 14, { size: 11, face: 'body', fill: COLOUR.ink3 }, owner);
  // The four edges are obstacles for labels, sampled as small boxes; the area inside is not.
  const step = 12;
  for (let x = r.x; x <= r.x + r.w; x += step) {
    place({ kind: 'line', owner, rect: { x: x - 2, y: r.y - 2, w: 4, h: 4 } });
    place({ kind: 'line', owner, rect: { x: x - 2, y: r.y + r.h - 2, w: 4, h: 4 } });
  }
  for (let y = r.y; y <= r.y + r.h; y += step) {
    place({ kind: 'line', owner, rect: { x: r.x - 2, y: y - 2, w: 4, h: 4 } });
    place({ kind: 'line', owner, rect: { x: r.x + r.w - 2, y: y - 2, w: 4, h: 4 } });
  }
  return `<g data-boundary="true"><rect x="${f(r.x)}" y="${f(r.y)}" width="${f(r.w)}" height="${f(r.h)}" rx="16" fill="none" stroke="${COLOUR.clay}" stroke-width="1.5" stroke-dasharray="8 6"/>${label.svg}</g>`;
}

/* ------------------------------------------------------------------ labels */

function intersects(a: Rect, b: Rect, margin = 0): boolean {
  return !(a.x + a.w + margin <= b.x || b.x + b.w + margin <= a.x || a.y + a.h + margin <= b.y || b.y + b.h + margin <= a.y);
}

function insideRect(inner: Rect, outer: Rect, tolerance = 0.5): boolean {
  return inner.x >= outer.x - tolerance && inner.y >= outer.y - tolerance && inner.x + inner.w <= outer.x + outer.w + tolerance && inner.y + inner.h <= outer.y + outer.h + tolerance;
}

function placeLabel(link: Link, idx: number, curve: ReturnType<typeof linkPath>): string {
  const st = LINE[link.kind];
  const size = 11;
  const owner = `link:${idx}`;
  const t = link.labelAt ?? 0.5;
  const p = bezierAt(t, curve.p0, curve.p1, curve.p2, curve.p3);
  const tan = bezierTangent(t, curve.p0, curve.p1, curve.p2, curve.p3);
  const nrm = { x: -tan.y, y: tan.x };
  const lines = wrap(link.label, link.labelWidth ?? 180, size, 'body');
  const lh = size * 1.2;
  const blockH = (lines.length - 1) * lh + size;
  type Cand = { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
  const cands: Cand[] = [];
  const horizontal = Math.abs(tan.x) >= Math.abs(tan.y);
  // Normal offsets first, then the same offsets nudged along the tangent, so a slanted line in a tight channel still finds a spot.
  for (const shift of [0, -8, 8, -16, 16, -24, 24]) {
  for (const d of [LABEL_CLEARANCE, 12, 18, 26, 36, 50, 66, 88]) {
    for (const sign of [-1, 1]) {
      const cx = p.x + nrm.x * sign * d + tan.x * shift;
      const cy = p.y + nrm.y * sign * d + tan.y * shift;
      if (horizontal) {
        const up = nrm.y * sign < 0;
        const baseline = up ? cy - (blockH - size) - size * 0.2 : cy + size * 0.8;
        cands.push({ x: cx, y: baseline, anchor: 'middle' });
      } else {
        const right = nrm.x * sign > 0;
        cands.push({ x: cx, y: cy - blockH / 2 + size * 0.8, anchor: right ? 'start' : 'end' });
      }
    }
  }
  }
  for (const d of [20, 36, 56]) {
    for (const sign of [-1, 1]) {
      cands.push({ x: p.x + tan.x * sign * d, y: p.y + tan.y * sign * d - blockH / 2 + size * 0.8, anchor: tan.x * sign > 0 ? 'start' : 'end' });
    }
  }
  const obstacles = report.slice();
  const sheet: Rect = { x: LAYOUT.margin, y: LAYOUT.margin, w: STRUCTURE_W - LAYOUT.margin * 2, h: STRUCTURE_H - LAYOUT.margin * 2 };
  let chosen: Cand | undefined;
  for (const c of cands) {
    const rect = textRect(lines, c.x, c.y, { size, face: 'body', anchor: c.anchor, lineHeight: lh });
    if (!insideRect(rect, sheet)) continue;
    if (obstacles.every((o) => !intersects(rect, o.rect, o.kind === 'line' ? 3 : LABEL_CLEARANCE))) {
      chosen = c;
      break;
    }
  }
  const c = chosen ?? cands[0];
  return textBlock(lines, c.x, c.y, { size, face: 'body', weight: 600, fill: st.stroke, anchor: c.anchor, lineHeight: lh }, owner).svg;
}

function links(): string {
  const markers = (Object.keys(LINE) as LinkKind[])
    .filter((k) => LINE[k].marker)
    .map((k) => `<marker id="s-arrow-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M1 1 L9 5 L1 9 Z" fill="${LINE[k].stroke}"/></marker>`)
    .join('');
  const curves = LINKS.map((l) => linkPath(l));
  curves.forEach((c, i) => {
    for (let k = 0; k <= 24; k++) {
      const pt = bezierAt(k / 24, c.p0, c.p1, c.p2, c.p3);
      place({ kind: 'line', owner: `link:${i}`, rect: { x: pt.x - 3, y: pt.y - 3, w: 6, h: 6 } });
    }
  });
  const paths = LINKS.map((l, i) => {
    const c = curves[i];
    const st = LINE[l.kind];
    const label = placeLabel(l, i, c);
    let cross = '';
    if (l.kind === 'never') {
      // A cross on the line where it would cross the boundary: money does not come back this way.
      const m = bezierAt(0.5, c.p0, c.p1, c.p2, c.p3);
      const s = 7;
      cross = `<g stroke="${st.stroke}" stroke-width="2.5" stroke-linecap="round"><line x1="${f(m.x - s)}" y1="${f(m.y - s)}" x2="${f(m.x + s)}" y2="${f(m.y + s)}"/><line x1="${f(m.x - s)}" y1="${f(m.y + s)}" x2="${f(m.x + s)}" y2="${f(m.y - s)}"/></g>`;
    }
    return `<path d="${c.d}" fill="none" stroke="${st.stroke}" stroke-width="${st.width}"${st.dash ? ` stroke-dasharray="${st.dash}"` : ''} stroke-linecap="round"${st.marker ? ` marker-end="url(#s-arrow-${l.kind})"` : ''}/>${cross}${label}`;
  }).join('');
  return `<defs>${markers}</defs><g data-links="true">${paths}</g>`;
}

function header(): string {
  const { margin } = LAYOUT;
  const t = textBlock([SHEET.title], margin, margin + 26, { size: 26, face: 'display', weight: 700 }, 'header');
  const s = textBlock([SHEET.subtitle], margin, margin + 52, { size: 13, face: 'body', fill: COLOUR.ink2 }, 'header');
  return `<g data-header="true">${t.svg}${s.svg}</g>`;
}

function footer(): string {
  const { margin, footerH } = LAYOUT;
  const lines = wrap(SHEET.footer, STRUCTURE_W - margin * 2, 10.5, 'body');
  const t = textBlock(lines, margin, STRUCTURE_H - margin - footerH + 12, { size: 10.5, face: 'body', fill: COLOUR.ink3, lineHeight: 13 }, 'footer');
  return `<g data-footer="true">${t.svg}</g>`;
}

/* ----------------------------------------------------------------- render */

export interface RenderOptions {
  standalone?: boolean;
}

export function renderStructureSvg(opts: RenderOptions = {}): string {
  report = [];
  const xmlns = opts.standalone === false ? '' : ' xmlns="http://www.w3.org/2000/svg"';
  const order: EntityId[] = ['funders', 'dewr', 'act', 'sole', 'akt', 'centre', 'oonchiumpa', 'orgs', 'customers'];
  const body = [
    `<rect width="${STRUCTURE_W}" height="${STRUCTURE_H}" fill="${COLOUR.paper}"/>`,
    header(),
    boundary(),
    ...order.map((id) => entity(id)),
    footer(),
    links(),
  ].join('\n');
  return `<svg${xmlns} viewBox="0 0 ${STRUCTURE_W} ${STRUCTURE_H}" width="${STRUCTURE_W}" height="${STRUCTURE_H}" role="img" aria-labelledby="structure-title structure-desc" data-structure="svg" data-read-at="${STRUCTURE_READ_AT}">
<title id="structure-title">${esc(SHEET.title)}</title>
<desc id="structure-desc">${esc(SHEET.subtitle)}</desc>
${body}
</svg>`;
}

export function layoutReport(opts: RenderOptions = {}): Placed[] {
  renderStructureSvg(opts);
  return report.map((p) => ({ ...p, rect: { ...p.rect } }));
}

export function rectsIntersect(a: Rect, b: Rect, margin = 0): boolean {
  return intersects(a, b, margin);
}

export function rectInside(inner: Rect, outer: Rect, tolerance = 0.5): boolean {
  return insideRect(inner, outer, tolerance);
}

export function renderedText(svg: string): string {
  return svg
    .replace(/<title[^>]*>[\s\S]*?<\/title>/g, ' ')
    .replace(/<desc[^>]*>[\s\S]*?<\/desc>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ');
}
