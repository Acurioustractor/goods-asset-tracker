/**
 * The model placemat as one SVG, rendered from the typed data in
 * @/lib/data/model-placemat. No pixel is typed by hand: every station, panel
 * and band sits in a cell of a 12-column by 13-row grid, and every arrow is
 * computed from the edges of the cells it joins. Change a word in the data
 * file and the box re-wraps; move a station to another cell in LAYOUT and its
 * arrows follow. Arrow labels find their own clear spot: each one is tried at
 * a series of offsets from the curve and the first that clears every card and
 * every other label by LABEL_CLEARANCE wins.
 *
 * This module is plain TypeScript with no JSX and no DOM, so the same function
 * runs in the browser (the /admin/model page), in a Node script
 * (scripts/render-placemat.mjs writes the catalog SVG and PNG) and in the
 * guards test. Photographs sit inside the four panels as <image> elements when
 * `photoHrefs` is given; the page passes URLs, the script and the download
 * pass data URIs so the file stands alone.
 *
 * Colours are the brand tokens in design/brand/tokens.css. Fonts are Playfair
 * Display for headings and Inter for body, with Georgia and system fallbacks.
 */

import {
  BED,
  FLOWS,
  LOGOS,
  PANELS,
  PLACEMAT_READ_AT,
  RAISE,
  SHEET,
  SHEET_H,
  SHEET_W,
  STATIONS,
  dollars,
  type Family,
  type Flow,
  type LineKind,
  type Panel,
  type Side,
  type StationId,
} from '@/lib/data/model-placemat';

export type PanelId = Panel['id'];

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
  support: '#5D574C',
} as const;

export const FONT = {
  // Single quotes inside, because the font list is written into a double-quoted style attribute.
  display: "'Playfair Display', Georgia, 'Times New Roman', serif",
  body: "Inter, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
} as const;

const FAMILY_STYLE: Record<Family, { fill: string; stroke: string }> = {
  making: { fill: COLOUR.sageTint, stroke: COLOUR.rail },
  community: { fill: COLOUR.clayTint, stroke: COLOUR.rail },
  buyer: { fill: COLOUR.card, stroke: COLOUR.rail },
  money: { fill: COLOUR.sageTint, stroke: COLOUR.rail },
  proposed: { fill: COLOUR.muted, stroke: COLOUR.terracotta },
  support: { fill: COLOUR.card, stroke: COLOUR.support },
};

const LINE: Record<LineKind, { stroke: string; width: number; dash?: string }> = {
  goods: { stroke: COLOUR.terracotta, width: 4 },
  money: { stroke: COLOUR.green, width: 4 },
  future: { stroke: COLOUR.clay, width: 3, dash: '10 8' },
  support: { stroke: COLOUR.support, width: 2, dash: '2 6' },
};

/** Cards and labels keep this much clear air between them, in px. */
export const LABEL_CLEARANCE = 8;
/** Text inside a card stays this far from the card edge. */
export const CARD_PAD = 18;
/** The centre circle's words keep this much clear of its rim. */
export const CENTRE_CLEARANCE = 36;

/* -------------------------------------------------------------------- grid */

export interface Cell {
  /** 1-based column, inclusive span. */
  col: number;
  colSpan: number;
  /** 1-based row, inclusive span. */
  row: number;
  rowSpan: number;
  /** Shrink the box inside its cell, in px each side. Default is the grid gutter. */
  inset?: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Ben, 15 Sep: text in the station cards and raise pills is centred. Flip to 'left' to compare. */
export const TEXT_ALIGN: 'centre' | 'left' = 'centre';

/** The one place the sheet's geometry is decided. */
export const LAYOUT = {
  sheet: { w: SHEET_W, h: SHEET_H },
  margin: 40,
  /** The header (title and subtitle) sits above the grid. */
  headerH: 118,
  /** Space below the grid. The sheet has no footer line; this keeps the band off the edge. */
  footerH: 64,
  cols: 12,
  rows: 13,
  gutter: 10,
  cells: {
    raise: { col: 3, colSpan: 8, row: 1, rowSpan: 2, inset: 2 },
    employment: { col: 1, colSpan: 2, row: 3, rowSpan: 5 },
    recycling: { col: 1, colSpan: 2, row: 8, rowSpan: 5 },
    enterprise: { col: 11, colSpan: 2, row: 3, rowSpan: 5 },
    health: { col: 11, colSpan: 2, row: 8, rowSpan: 5 },
    next: { col: 3, colSpan: 2, row: 3, rowSpan: 3 },
    act: { col: 3, colSpan: 1, row: 6, rowSpan: 2, inset: 8 },
    facility: { col: 3, colSpan: 2, row: 8, rowSpan: 4 },
    harvest: { col: 5, colSpan: 3, row: 3, rowSpan: 2 },
    orgs: { col: 9, colSpan: 2, row: 3, rowSpan: 2 },
    buyers: { col: 9, colSpan: 2, row: 6, rowSpan: 2 },
    money: { col: 9, colSpan: 2, row: 9, rowSpan: 2 },
    decide: { col: 5, colSpan: 3, row: 11, rowSpan: 2 },
    centre: { col: 5, colSpan: 3, row: 5, rowSpan: 6 },
    band: { col: 1, colSpan: 12, row: 13, rowSpan: 1 },
  } satisfies Record<string, Cell>,
} as const;

export type CellId = keyof typeof LAYOUT.cells;

function gridArea(): Rect {
  const { margin, headerH, footerH, sheet } = LAYOUT;
  return {
    x: margin,
    y: margin + headerH,
    w: sheet.w - margin * 2,
    h: sheet.h - margin * 2 - headerH - footerH,
  };
}

/** The rectangle a cell occupies, inset by the gutter (or its own inset). */
export function cellRect(id: CellId): Rect {
  const c: Cell = LAYOUT.cells[id];
  const g = gridArea();
  const colW = g.w / LAYOUT.cols;
  const rowH = g.h / LAYOUT.rows;
  const inset = c.inset ?? LAYOUT.gutter;
  return {
    x: g.x + (c.col - 1) * colW + inset,
    y: g.y + (c.row - 1) * rowH + inset,
    w: c.colSpan * colW - inset * 2,
    h: c.rowSpan * rowH - inset * 2,
  };
}

/** A point on one side of a rectangle, `at` from 0 to 1 along that side. */
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

/** A cubic curve that leaves one side and arrives at another, as path data and its control points. */
export function flowPath(flow: Flow): { d: string; p0: Pt; p1: Pt; p2: Pt; p3: Pt } {
  const a = cellRect(flow.from as CellId);
  const b = cellRect(flow.to as CellId);
  const p0 = anchor(a, flow.fromSide, flow.fromAt);
  const p3 = anchor(b, flow.toSide, flow.toAt);
  const dist = Math.hypot(p3.x - p0.x, p3.y - p0.y);
  const bend = flow.bend ?? Math.max(24, dist / 2.5);
  const o0 = outward(flow.fromSide);
  const o3 = outward(flow.toSide);
  const p1 = { x: p0.x + o0.x * bend, y: p0.y + o0.y * bend };
  const p2 = { x: p3.x + o3.x * bend, y: p3.y + o3.y * bend };
  return {
    d: `M${f(p0.x)} ${f(p0.y)} C${f(p1.x)} ${f(p1.y)}, ${f(p2.x)} ${f(p2.y)}, ${f(p3.x)} ${f(p3.y)}`,
    p0,
    p1,
    p2,
    p3,
  };
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

/** Approximate advance per character as a fraction of font size. Generous, so wraps err short. */
const ADVANCE = { display: 0.6, body: 0.56 } as const;

function textWidth(s: string, size: number, face: keyof typeof ADVANCE): number {
  return s.length * size * ADVANCE[face];
}

/** Greedy word wrap to a pixel width. */
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
  italic?: boolean;
}

/* ------------------------------------------------------------- the report */

export type ReportKind = 'text' | 'card' | 'photo' | 'circle' | 'line';

/** One thing drawn on the sheet, with the box it occupies and what it belongs to. */
export interface Placed {
  kind: ReportKind;
  /** The station, panel, flow or part of the sheet this belongs to. */
  owner: string;
  /** What the text says, for readable test failures. */
  label?: string;
  rect: Rect;
}

let report: Placed[] = [];

function place(p: Placed): void {
  report.push(p);
}

/** The box a text block occupies, from its baseline, size and anchor. */
function textRect(lines: string[], x: number, y: number, o: TextOpts): Rect {
  const lh = o.lineHeight ?? o.size * 1.25;
  const w = Math.max(...lines.map((l) => textWidth(l, o.size, o.face)));
  const h = (lines.length - 1) * lh + o.size;
  const top = y - o.size * 0.8;
  const left = o.anchor === 'middle' ? x - w / 2 : o.anchor === 'end' ? x - w : x;
  return { x: left, y: top, w, h };
}

/** Lines of text as one <text> with <tspan> rows. Returns the markup, the height used and the box. */
function textBlock(lines: string[], x: number, y: number, o: TextOpts, owner: string): { svg: string; height: number; rect: Rect } {
  const lh = o.lineHeight ?? o.size * 1.25;
  const font = o.face === 'display' ? FONT.display : FONT.body;
  const spans = lines
    .map((l, i) => `<tspan x="${f(x)}" ${i === 0 ? `y="${f(y)}"` : `dy="${f(lh)}"`}>${esc(l)}</tspan>`)
    .join('');
  const style = `font-family:${font};font-size:${o.size}px;font-weight:${o.weight ?? 400};${o.italic ? 'font-style:italic;' : ''}`;
  const rect = textRect(lines, x, y, o);
  place({ kind: 'text', owner, label: lines.join(' '), rect });
  return {
    svg: `<text style="${style}" fill="${o.fill ?? COLOUR.ink}" text-anchor="${o.anchor ?? 'start'}">${spans}</text>`,
    height: lines.length * lh,
    rect,
  };
}

/* ------------------------------------------------------------------- boxes */

function card(r: Rect, fill: string, stroke: string, owner: string, dashed = false, radius = 14): string {
  place({ kind: 'card', owner, rect: r });
  return `<rect x="${f(r.x)}" y="${f(r.y)}" width="${f(r.w)}" height="${f(r.h)}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${dashed ? 1.5 : 1}"${dashed ? ' stroke-dasharray="6 5"' : ''}/>`;
}

/** A station: title in Playfair, line in Inter, wrapped to the cell, drawing on the left if it has one. */
function station(id: StationId, opts: RenderOptions): string {
  const s = STATIONS[id];
  const r = cellRect(id as CellId);
  const style = FAMILY_STYLE[s.family];
  const pad = s.family === 'support' ? 12 : CARD_PAD;
  const owner = `station:${id}`;
  let textX = r.x + pad;
  let textW = r.w - pad * 2;
  const parts = [card(r, style.fill, style.stroke, owner, s.state === 'proposed' || s.family === 'support')];

  if (s.drawing) {
    const drawW = Math.min(r.w * 0.34, 150);
    const drawH = r.h - pad * 1.5;
    const dx = r.x + pad;
    // The container drawing's own viewBox is 1241 by 488; keep its ratio inside the slot.
    const ratio = 488 / 1241;
    const h = Math.min(drawH, drawW * ratio);
    const w = h / ratio;
    const dy = r.y + (r.h - h) / 2;
    place({ kind: 'photo', owner, label: s.drawing.alt, rect: { x: dx, y: dy, w, h } });
    if (opts.inlineDrawing) {
      parts.push(
        `<svg x="${f(dx)}" y="${f(dy)}" width="${f(w)}" height="${f(h)}" viewBox="0 0 1241 488" role="img" aria-label="${esc(s.drawing.alt)}">${opts.inlineDrawing}</svg>`,
      );
    } else {
      parts.push(
        `<image href="${esc(s.drawing.src)}" x="${f(dx)}" y="${f(dy)}" width="${f(w)}" height="${f(h)}" preserveAspectRatio="xMidYMid meet"><title>${esc(s.drawing.alt)}</title></image>`,
      );
    }
    textX = dx + w + pad;
    textW = r.x + r.w - pad - textX;
  }

  const titleSize = s.family === 'support' ? 14 : s.drawing ? 17 : 19;
  const lineSize = 13;
  const titleLines = wrap(s.title, textW, titleSize, 'display');
  const lineLines = wrap(s.line, textW, lineSize, 'body');
  const titleLh = titleSize * 1.15;
  const lineLh = lineSize * 1.3;
  const gap = 8;
  const total = (titleLines.length - 1) * titleLh + titleSize + gap + (lineLines.length - 1) * lineLh + lineSize;
  const top = r.y + Math.max(pad, (r.h - total) / 2) + titleSize * 0.8;
  const centred = TEXT_ALIGN === 'centre';
  const ax = centred ? textX + textW / 2 : textX;
  const anchor = centred ? ('middle' as const) : undefined;
  const t = textBlock(titleLines, ax, top, { size: titleSize, face: 'display', weight: 600, lineHeight: titleLh, anchor }, owner);
  const l = textBlock(
    lineLines,
    ax,
    top + (titleLines.length - 1) * titleLh + gap + lineSize,
    { size: lineSize, face: 'body', fill: COLOUR.ink2, lineHeight: lineLh, anchor },
    owner,
  );
  parts.push(t.svg, l.svg);
  return `<g data-station="${id}">${parts.join('')}</g>`;
}

/** A side panel: the photograph on top, the outcome word and its line below. */
function panel(id: PanelId, opts: RenderOptions): string {
  const p = PANELS.find((x) => x.id === id);
  if (!p) return '';
  const r = cellRect(id);
  const owner = `panel:${id}`;
  const pad = CARD_PAD;
  const w = r.w - pad * 2;
  const radius = 14;
  const titleSize = 22;
  const lineSize = 13.5;
  const titleLines = wrap(p.title, w, titleSize, 'display');
  const lineLines = wrap(p.line, w, lineSize, 'body');
  const titleLh = 25;
  const lineLh = 18;
  // Words take a fixed room at the bottom, the same on every panel; the photograph takes the rest.
  const wordsH = pad + titleSize + 6 + 2 * lineLh + pad;
  const slotH = r.h - wordsH;
  const slot: Rect = { x: r.x, y: r.y, w: r.w, h: slotH };
  place({ kind: 'photo', owner, label: p.photo.alt, rect: slot });
  const href = opts.photoHrefs?.[id];
  let photo: string;
  if (href) {
    const clipId = `clip-${id}`;
    // Rounded at the top only: the card's own corners carry the bottom.
    const path = `M${f(slot.x)} ${f(slot.y + slot.h)} V${f(slot.y + radius)} A${radius} ${radius} 0 0 1 ${f(slot.x + radius)} ${f(slot.y)} H${f(slot.x + slot.w - radius)} A${radius} ${radius} 0 0 1 ${f(slot.x + slot.w)} ${f(slot.y + radius)} V${f(slot.y + slot.h)} Z`;
    photo = `<clipPath id="${clipId}"><path d="${path}"/></clipPath><image href="${esc(href)}" x="${f(slot.x)}" y="${f(slot.y)}" width="${f(slot.w)}" height="${f(slot.h)}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"><title>${esc(p.photo.alt)}</title></image>`;
  } else {
    // No photograph supplied: a labelled slot, so the sheet reads the same shape.
    const slotRect = `<rect x="${f(slot.x + 1)}" y="${f(slot.y + 1)}" width="${f(slot.w - 2)}" height="${f(slot.h)}" rx="13" fill="${COLOUR.muted}" stroke="none"/>`;
    const slotLabel = textBlock([p.photo.place], slot.x + slot.w / 2, slot.y + slot.h / 2 + 4, { size: 12, face: 'body', fill: COLOUR.ink3, anchor: 'middle' }, owner);
    photo = slotRect + slotLabel.svg;
  }
  const titleY = r.y + slotH + pad + titleSize * 0.8;
  const t = textBlock(titleLines, r.x + pad, titleY, { size: titleSize, face: 'display', weight: 600, lineHeight: titleLh }, owner);
  const l = textBlock(
    lineLines,
    r.x + pad,
    titleY + (titleLines.length - 1) * titleLh + 6 + lineSize,
    { size: lineSize, face: 'body', fill: COLOUR.ink2, lineHeight: lineLh },
    owner,
  );
  return `<g data-panel="${id}">${card(r, COLOUR.card, COLOUR.rail, owner, false, radius)}${photo}${t.svg}${l.svg}</g>`;
}

function raiseBox(): string {
  const r = cellRect('raise');
  const owner = 'raise';
  const pad = CARD_PAD;
  const headSize = 22;
  const headY = r.y + pad + headSize * 0.8;
  const head = textBlock([SHEET.raiseHeading], r.x + r.w / 2, headY, { size: headSize, face: 'display', weight: 600, anchor: 'middle' }, owner);
  const note = SHEET.raiseNote
    ? textBlock([`· ${SHEET.raiseNote}`], head.rect.x + head.rect.w + 10, headY, { size: 13, face: 'body', fill: COLOUR.ink3 }, owner)
    : { svg: '' };
  const pillY = headY + 12;
  const pillH = r.y + r.h - pad - pillY;
  const plusW = 40;
  // Three pills: QBE, beds, the SEFA loan. The beds pill carries the longer line, so it takes the wider share.
  const avail = r.w - pad * 2 - plusW * 2;
  const leftW = avail * 0.24;
  const rightW = avail * 0.50;
  const loanW = avail - leftW - rightW;
  const left: Rect = { x: r.x + pad, y: pillY, w: leftW, h: pillH };
  const right: Rect = { x: r.x + pad + leftW + plusW, y: pillY, w: rightW, h: pillH };
  const loan: Rect = { x: right.x + rightW + plusW, y: pillY, w: loanW, h: pillH };
  const pill = (pr: Rect, fill: string, title: string, line: string, id: string) => {
    const innerPad = 14;
    const innerW = pr.w - innerPad * 2;
    const titleSize = 17;
    const lineSize = 12.5;
    const lines = wrap(line, innerW, lineSize, 'body');
    const total = titleSize + 6 + (lines.length - 1) * 16 + lineSize;
    const top = pr.y + (pr.h - total) / 2 + titleSize * 0.8;
    const centred = TEXT_ALIGN === 'centre';
    const ax = centred ? pr.x + pr.w / 2 : pr.x + innerPad;
    const anchor = centred ? ('middle' as const) : undefined;
    const t = textBlock([title], ax, top, { size: titleSize, face: 'display', weight: 600, anchor }, `${owner}:${id}`);
    const l = textBlock(lines, ax, top + 6 + lineSize, { size: lineSize, face: 'body', fill: COLOUR.ink2, lineHeight: 16, anchor }, `${owner}:${id}`);
    return `${card(pr, fill, 'none', `${owner}:${id}`, false, 10)}${t.svg}${l.svg}`;
  };
  const plusSize = 30;
  const plusAt = (x: number) => textBlock(['+'], x, pillY + pillH / 2 + plusSize * 0.35, { size: plusSize, face: 'body', fill: COLOUR.ink3, anchor: 'middle' }, owner);
  const plus = plusAt(r.x + pad + leftW + plusW / 2);
  const plus2 = plusAt(right.x + rightW + plusW / 2);
  return `<g data-raise="true">${card(r, COLOUR.card, COLOUR.ink, owner, false, 16)}${head.svg}${note.svg}${pill(left, COLOUR.sageTint, `QBE ${dollars(RAISE.qbeAud)}`, RAISE.qbeFor, 'qbe')}${plus.svg}${pill(right, COLOUR.clayTint, `Beds ${dollars(RAISE.bedsShownAud)}`, RAISE.bedsFor, 'beds')}${plus2.svg}${pill(loan, COLOUR.sageTint, `Loan ${dollars(RAISE.loanAud)}`, RAISE.loanFor, 'loan')}</g>`;
}

function centre(): string {
  const r = cellRect('centre');
  const rad = Math.min(r.w, r.h) / 2 - 8;
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const owner = 'centre';
  // The largest size whose lines sit CENTRE_CLEARANCE inside the rim.
  const limit = rad - CENTRE_CLEARANCE;
  let size = 30;
  let lines = wrap(SHEET.centre, limit * 1.8, size, 'display');
  for (; size >= 18; size -= 1) {
    lines = wrap(SHEET.centre, limit * 1.8, size, 'display');
    const lh = size * 1.15;
    const halfW = Math.max(...lines.map((l) => textWidth(l, size, 'display'))) / 2;
    const halfH = ((lines.length - 1) * lh + size) / 2;
    // The block's corner must sit inside the circle of radius `limit`.
    if (Math.hypot(halfW, halfH) <= limit) break;
  }
  const lh = size * 1.15;
  const blockH = (lines.length - 1) * lh + size;
  const firstBaseline = cy - blockH / 2 + size * 0.8;
  const t = textBlock(lines, cx, firstBaseline, { size, face: 'display', weight: 600, fill: COLOUR.paper, anchor: 'middle', lineHeight: lh }, owner);
  place({ kind: 'circle', owner, rect: { x: cx - rad, y: cy - rad, w: rad * 2, h: rad * 2 } });
  return `<g data-centre="true"><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rad)}" fill="${COLOUR.green}"/>${t.svg}</g>`;
}

function band(): string {
  const r = cellRect('band');
  const owner = 'band';
  const pad = 20;
  const titleSize = 17;
  const itemSize = 13.5;
  const baseline = r.y + r.h / 2 + titleSize * 0.35;
  const title = textBlock([SHEET.support.title], r.x + pad, baseline, { size: titleSize, face: 'display', weight: 600 }, owner);
  // Items spaced evenly across the rest of the band, a dot midway between neighbours, one baseline.
  const startX = title.rect.x + title.rect.w + 36;
  const endX = r.x + r.w - pad;
  const items = SHEET.support.items;
  const widths = items.map((s) => textWidth(s, itemSize, 'body'));
  const free = endX - startX - widths.reduce((a, b) => a + b, 0);
  // Even spacing, capped so the items read as one list rather than five islands.
  const gap = items.length > 1 ? Math.min(44, free / (items.length - 1)) : 0;
  let x = startX;
  const parts: string[] = [];
  items.forEach((s, i) => {
    parts.push(textBlock([s], x, baseline, { size: itemSize, face: 'body', fill: COLOUR.ink2 }, owner).svg);
    if (i < items.length - 1) {
      const dotX = x + widths[i] + gap / 2;
      parts.push(`<circle cx="${f(dotX)}" cy="${f(baseline - itemSize * 0.3)}" r="1.6" fill="${COLOUR.ink3}"/>`);
    }
    x += widths[i] + gap;
  });
  return `<g data-band="true">${card(r, COLOUR.muted, 'none', owner, false, 12)}${title.svg}${parts.join('')}</g>`;
}

/* ------------------------------------------------------------------ labels */

function intersects(a: Rect, b: Rect, margin = 0): boolean {
  return !(a.x + a.w + margin <= b.x || b.x + b.w + margin <= a.x || a.y + a.h + margin <= b.y || b.y + b.h + margin <= a.y);
}

function insideRect(inner: Rect, outer: Rect, tolerance = 0.5): boolean {
  return (
    inner.x >= outer.x - tolerance &&
    inner.y >= outer.y - tolerance &&
    inner.x + inner.w <= outer.x + outer.w + tolerance &&
    inner.y + inner.h <= outer.y + outer.h + tolerance
  );
}

/**
 * Where an arrow label goes. Candidates fan out from the curve point along the
 * curve's normal, then along its tangent, at growing distances; the first that
 * clears every card, photo and label already placed wins. The data file's
 * labelDx/labelDy, when given, is tried first, so a hand nudge still counts.
 */
function placeLabel(fl: Flow, idx: number, curve: ReturnType<typeof flowPath>): { svg: string } {
  const st = LINE[fl.kind];
  const size = 12;
  const owner = `flow:${idx}`;
  const t = fl.labelAt ?? 0.5;
  const p = bezierAt(t, curve.p0, curve.p1, curve.p2, curve.p3);
  const tan = bezierTangent(t, curve.p0, curve.p1, curve.p2, curve.p3);
  const nrm = { x: -tan.y, y: tan.x };
  // A label wider than its gap wraps to two lines.
  const maxW = fl.labelWidth ?? 200;
  const lines = wrap(fl.label, maxW, size, 'body');
  const lh = size * 1.2;
  const blockH = (lines.length - 1) * lh + size;

  type Cand = { x: number; y: number; anchor: 'start' | 'middle' | 'end' };
  const cands: Cand[] = [];
  if (fl.labelDx !== undefined || fl.labelDy !== undefined) {
    cands.push({ x: p.x + (fl.labelDx ?? 0), y: p.y + (fl.labelDy ?? -8), anchor: fl.labelAnchor ?? 'middle' });
  }
  const horizontal = Math.abs(tan.x) >= Math.abs(tan.y);
  for (const d of [LABEL_CLEARANCE, 14, 20, 28, 40, 56, 72, 96]) {
    for (const sign of [-1, 1]) {
      const cx = p.x + nrm.x * sign * d;
      const cy = p.y + nrm.y * sign * d;
      if (horizontal) {
        // Above or below the line: centred, the block stacked away from the line.
        const up = nrm.y * sign < 0;
        const baseline = up ? cy - (blockH - size) - size * 0.2 : cy + size * 0.8;
        cands.push({ x: cx, y: baseline, anchor: 'middle' });
      } else {
        // Beside the line: start anchor to the right, end anchor to the left, centred on the point.
        const right = nrm.x * sign > 0;
        cands.push({ x: cx, y: cy - blockH / 2 + size * 0.8, anchor: right ? 'start' : 'end' });
      }
    }
  }
  // Along the tangent, for the curves whose normals point into cards on both sides.
  for (const d of [24, 40, 64]) {
    for (const sign of [-1, 1]) {
      cands.push({ x: p.x + tan.x * sign * d, y: p.y + tan.y * sign * d - blockH / 2 + size * 0.8, anchor: tan.x * sign > 0 ? 'start' : 'end' });
    }
  }

  const obstacles = report.slice();
  const sheet: Rect = { x: LAYOUT.margin, y: LAYOUT.margin, w: SHEET_W - LAYOUT.margin * 2, h: SHEET_H - LAYOUT.margin * 2 };
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
  const label = textBlock(lines, c.x, c.y, { size, face: 'body', weight: 600, fill: st.stroke, anchor: c.anchor, lineHeight: lh }, owner);
  return { svg: label.svg };
}

function flows(): string {
  const markers = (Object.keys(LINE) as LineKind[])
    .map(
      (k) =>
        `<marker id="arrow-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M1 1 L9 5 L1 9 Z" fill="${LINE[k].stroke}"/></marker>`,
    )
    .join('');
  const curves = FLOWS.map((fl) => flowPath(fl));
  // Every line is an obstacle to every label, sampled as small boxes along the curve.
  curves.forEach((c, i) => {
    for (let k = 0; k <= 24; k++) {
      const pt = bezierAt(k / 24, c.p0, c.p1, c.p2, c.p3);
      place({ kind: 'line', owner: `flow:${i}`, rect: { x: pt.x - 3, y: pt.y - 3, w: 6, h: 6 } });
    }
  });
  const paths = FLOWS.map((fl, i) => {
    const curve = curves[i];
    const st = LINE[fl.kind];
    const label = placeLabel(fl, i, curve);
    // Each line and its label share a group named from>to, so a walkthrough can light one flow at a time.
    return `<g data-flow="${fl.from}>${fl.to}" data-kind="${fl.kind}"><path id="placemat-flow-${i}" d="${curve.d}" fill="none" stroke="${st.stroke}" stroke-width="${st.width}"${st.dash ? ` stroke-dasharray="${st.dash}"` : ''} stroke-linecap="round" marker-end="url(#arrow-${fl.kind})"/>${label.svg}</g>`;
  }).join('');
  return `<defs>${markers}</defs><g data-flows="true">${paths}</g>`;
}

function header(): string {
  const { margin } = LAYOUT;
  const cx = SHEET_W / 2;
  const t = textBlock([SHEET.title], cx, margin + 44, { size: 44, face: 'display', weight: 700, anchor: 'middle' }, 'header');
  const s = textBlock(wrap(SHEET.subtitle, 1040, 16, 'body'), cx, margin + 74, { size: 16, face: 'body', fill: COLOUR.ink2, anchor: 'middle' }, 'header');
  return `<g data-header="true">${t.svg}${s.svg}</g>`;
}

function footer(opts: RenderOptions): string {
  if (!SHEET.footer) return '';
  const { margin, footerH } = LAYOUT;
  const cy = SHEET_H - margin - footerH / 2 + 10;
  const logoH = 34;
  const goodsW = logoH * (LOGOS.goods.w / LOGOS.goods.h);
  const qbeH = 26;
  const qbeW = qbeH * (LOGOS.qbe.w / LOGOS.qbe.h);
  const gap = 18;
  let x = margin;
  const parts: string[] = [];
  const img = (href: string, alt: string, w: number, h: number) =>
    `<image href="${esc(href)}" xlink:href="${esc(href)}" x="${f(x)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}" preserveAspectRatio="xMinYMid meet" aria-label="${esc(alt)}"/>`;
  if (opts.logoHrefs?.goods) { parts.push(img(opts.logoHrefs.goods, LOGOS.goods.alt, goodsW, logoH)); x += goodsW + gap; }
  const cross = textBlock(['×'], x + 8, cy + 6, { size: 18, face: 'body', fill: COLOUR.ink3, anchor: 'middle' }, 'footer');
  parts.push(cross.svg); x += 16 + gap;
  if (opts.logoHrefs?.qbe) { parts.push(img(opts.logoHrefs.qbe, LOGOS.qbe.alt, qbeW, qbeH)); x += qbeW + gap; }
  const t = textBlock([SHEET.footer], x, cy + 5, { size: 14, face: 'display', weight: 600, fill: COLOUR.ink2 }, 'footer');
  parts.push(t.svg);
  return `<g data-footer="true">${parts.join('')}</g>`;
}

/* ----------------------------------------------------------------- render */

export interface RenderOptions {
  /** The inner markup of /images/model/harvest-container.svg. When absent the sheet references the file by URL. */
  inlineDrawing?: string;
  /** Photograph per panel: a URL for the page, a data URI for a file that stands alone. Absent: a labelled slot. */
  photoHrefs?: Partial<Record<PanelId, string>>;
  /** The two footer marks: URLs for the page, data URIs for a standalone file. Absent: text only. */
  logoHrefs?: { goods?: string; qbe?: string };
  /** Adds the xmlns attribute for a standalone file. On by default. */
  standalone?: boolean;
}

/** The whole sheet as one SVG string. */
export function renderPlacematSvg(opts: RenderOptions = {}): string {
  report = [];
  const xmlns = opts.standalone === false ? '' : ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
  const stationOrder: StationId[] = ['harvest', 'orgs', 'buyers', 'money', 'decide', 'facility', 'next', 'act'];
  const body = [
    `<rect width="${SHEET_W}" height="${SHEET_H}" fill="${COLOUR.paper}"/>`,
    header(),
    raiseBox(),
    panel('employment', opts),
    panel('recycling', opts),
    panel('enterprise', opts),
    panel('health', opts),
    ...stationOrder.map((id) => station(id, opts)),
    band(),
    footer(opts),
    // Flows before the circle, so a line that must pass the middle runs behind it; labels still see every card.
    flows(),
    centre(),
  ].join('\n');
  const desc = `Asked ${dollars(RAISE.totalShownAud)}, nothing signed. One bed is ${dollars(BED.priceAud)}; ${dollars(BED.contributionAud)} reaches Goods on Country after making, freight and facilitation.`;
  return `<svg${xmlns} viewBox="0 0 ${SHEET_W} ${SHEET_H}" width="${SHEET_W}" height="${SHEET_H}" role="img" aria-labelledby="placemat-title placemat-desc" data-placemat="svg" data-read-at="${PLACEMAT_READ_AT}">
<title id="placemat-title">${esc(SHEET.title)}</title>
<desc id="placemat-desc">${esc(desc)}</desc>
${body}
</svg>`;
}

/** Everything the last render placed, for the guards: every text, card, photo and circle with its box and owner. */
export function layoutReport(opts: RenderOptions = {}): Placed[] {
  renderPlacematSvg(opts);
  return report.map((p) => ({ ...p, rect: { ...p.rect } }));
}

/** True when two boxes overlap, allowing `margin` px of clear air. Exported for the guards. */
export function rectsIntersect(a: Rect, b: Rect, margin = 0): boolean {
  return intersects(a, b, margin);
}

/** True when `inner` sits inside `outer`. Exported for the guards. */
export function rectInside(inner: Rect, outer: Rect, tolerance = 0.5): boolean {
  return insideRect(inner, outer, tolerance);
}

/** Every visible string the SVG prints, for the guards. */
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
