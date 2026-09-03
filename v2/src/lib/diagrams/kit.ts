/**
 * THE DIAGRAM KIT: how a model drawing is made, once.
 *
 * Every model diagram in the QBE story is an SVG string produced here, from figures read out of the
 * guarded modules (`raise-stack.ts`, `community-loop.ts`, `bed-ratio.ts`, `canon.ts`). The same
 * string is rendered inline on `/sites/qbe/story`, downloaded from the page as SVG or PNG for the
 * Pencil deck, and can be written to disk by a script. One renderer, so a figure cannot drift
 * between the page and the slide, and so a new drawing is a few lines of data rather than a
 * morning in a design tool.
 *
 * This replaces `deliverables/qbe-stage2/diagrams/build.mjs`, which drew the same seven diagrams
 * with the figures typed in by hand. The frame, tokens and text-wrapping arithmetic are kept so the
 * drawings still match the deck (1600 x 900, cream ground, Playfair for titles, Inter for body,
 * mono for kickers and status chips).
 *
 * Primitives, from small to large:
 *   text, para        one line, or a wrapped paragraph that reports its height
 *   box, arrow, path  the marks
 *   kicker, chip      the small mono labels and the status pill
 *   panel             a titled card with an optional status chip
 *   chainRow          n linked cards in a row (a chain, a loop with `returnTo`)
 *   columns           n columns of line items with a note beneath
 *   layers            stacked full-width rows
 *   timeline          events on a dated axis
 *   band              a full-width tinted statement
 *   frame             the 16:9 page: kicker, title, rule, subtitle, body, footer, stamp
 *
 * Text is wrapped by character-width estimate, the same as the deck script did. It is not a layout
 * engine; it is enough for slides, and it means the output is a plain SVG any tool can open.
 */

export const W = 1600;
export const H = 900;
/** Left and right margin of the frame; body drawings run from MX to W - MX. */
export const MX = 70;
export const BODY_W = W - 2 * MX;

export const C = {
  cream: '#FBF8F1',
  ink: '#2B2A26',
  terra: '#C45C3E',
  sand: '#EDE5D8',
  sage: '#DDE2D2',
  clay: '#B8875C',
  mute: '#6B6862',
  white: '#FFFFFF',
  line: '#CFC7B8',
} as const;

/**
 * Inline in the page the CSS variables resolve to the fonts `layout.tsx` loads; in a downloaded
 * file they fall through to the named faces, and from there to Georgia and Helvetica.
 */
export const F = {
  display: "var(--font-display, 'Playfair Display'), 'Playfair Display', Georgia, 'Times New Roman', serif",
  body: "var(--font-inter, Inter), Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'Roboto Mono', Menlo, 'Courier New', monospace",
} as const;

export type Font = (typeof F)[keyof typeof F];

const esc = (s: unknown) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function wrapWords(str: string, maxChars: number): string[] {
  const words = String(str).split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

export interface TextOpts {
  size?: number;
  font?: Font;
  fill?: string;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  ls?: number;
  italic?: boolean;
}

export function text(x: number, y: number, str: string, o: TextOpts = {}): string {
  const { size = 16, font = F.body, fill = C.ink, weight = 400, anchor = 'start', ls = 0, italic = false } = o;
  return `<text x="${x}" y="${y}" style="font-family:${esc(font)}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${ls}"${italic ? ' font-style="italic"' : ''}>${esc(str)}</text>`;
}

export interface ParaOpts extends TextOpts {
  width?: number;
  lh?: number;
}

/** A wrapped paragraph. Returns the markup and the height it used, so callers can flow. */
export function para(x: number, y: number, str: string, o: ParaOpts = {}): { svg: string; height: number } {
  const { size = 16, width = 300, lh = 1.35, font = F.body, fill = C.ink, weight = 400, anchor = 'start', italic } = o;
  const cw = font === F.display ? 0.56 : font === F.mono ? 0.62 : 0.52;
  const lines = wrapWords(str, Math.max(8, Math.floor(width / (size * cw))));
  const svg = lines.map((l, i) => text(x, y + i * size * lh, l, { size, font, fill, weight, anchor, italic })).join('');
  return { svg, height: lines.length * size * lh };
}

export interface BoxOpts {
  fill?: string;
  stroke?: string;
  sw?: number;
  r?: number;
}

export function box(x: number, y: number, w: number, h: number, o: BoxOpts = {}): string {
  const { fill = C.white, stroke = C.line, sw = 1.5, r = 6 } = o;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

export function line(x1: number, y1: number, x2: number, y2: number, color: string = C.line, sw = 1): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}"/>`;
}

function markerFor(color: string) {
  return color === C.terra ? 'url(#ah-t)' : 'url(#ah-i)';
}

export function arrow(x1: number, y1: number, x2: number, y2: number, o: { color?: string; sw?: number; dash?: string } = {}): string {
  const { color = C.terra, sw = 2.5, dash = '' } = o;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" marker-end="${markerFor(color)}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

export function path(d: string, o: { color?: string; sw?: number; dash?: string; end?: boolean } = {}): string {
  const { color = C.terra, sw = 2.5, dash = '', end = true } = o;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}"${end ? ` marker-end="${markerFor(color)}"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

export function circle(cx: number, cy: number, r: number, fill: string = C.terra): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
}

/** Numbered dot with the number inside, as the loop and chain steps carry. */
export function numberDot(cx: number, cy: number, n: number | string, r = 16): string {
  return circle(cx, cy, r) + text(cx, cy + r * 0.38, String(n), { size: r, font: F.mono, fill: C.white, anchor: 'middle', weight: 700 });
}

/** Small mono label in caps. */
export function kicker(x: number, y: number, str: string, o: { fill?: string; anchor?: TextOpts['anchor'] } = {}): string {
  return text(x, y, String(str).toUpperCase(), { size: 12, font: F.mono, fill: o.fill || C.terra, ls: 1.5, anchor: o.anchor || 'start' });
}

/** Status chip: verified / workpaper / modelled / target / invited / ask made / paid. */
export function chip(x: number, y: number, str: string, o: { fill?: string } = {}): string {
  const w = chipWidth(str);
  const fill = o.fill || C.sage;
  return `${box(x, y - 12, w, 18, { fill, stroke: fill, r: 9 })}${text(x + w / 2, y + 1, String(str).toUpperCase(), { size: 10, font: F.mono, fill: C.ink, anchor: 'middle', ls: 1 })}`;
}

export function chipWidth(str: string): number {
  return str.length * 7.4 + 18;
}

/** The fill a status chip takes. Paid and verified read as settled; invited as warm; the rest quiet. */
export function chipFill(status: string): string {
  const s = status.toLowerCase();
  if (s === 'paid' || s === 'verified' || s === 'signed') return C.sage;
  if (s === 'invited' || s === 'workpaper') return C.sand;
  return C.cream;
}

export interface PanelOpts {
  k?: string;
  t?: string;
  b?: string;
  label?: string;
  labelFill?: string;
  fill?: string;
  stroke?: string;
  tsize?: number;
  bsize?: number;
}

/** A titled card: kicker, display title, body paragraph, optional status chip at the foot. */
export function panel(x: number, y: number, w: number, h: number, o: PanelOpts): string {
  const { k, t, b, label, labelFill, fill = C.white, stroke = C.line, tsize = 19, bsize = 14 } = o;
  let s = box(x, y, w, h, { fill, stroke, sw: stroke === C.terra ? 2.5 : 1.5 });
  let cy = y + 28;
  if (k) {
    s += kicker(x + 18, cy, k);
    cy += 26;
  }
  if (t) {
    const p = para(x + 18, cy + 4, t, { size: tsize, width: w - 36, font: F.display, weight: 600, lh: 1.2 });
    s += p.svg;
    cy += p.height + 12;
  }
  if (b) {
    const p = para(x + 18, cy + 4, b, { size: bsize, width: w - 36, lh: 1.4 });
    s += p.svg;
    cy += p.height;
  }
  if (label) s += chip(x + 18, y + h - 16, label, { fill: labelFill });
  return s;
}

// ---------------------------------------------------------------------------
// Composites

export interface ChainLink {
  title: string;
  body: string;
  /** Status chip text at the foot of the card. */
  label?: string;
  labelFill?: string;
  /** Draw this card with the terracotta stroke. */
  lead?: boolean;
}

export interface ChainRowOpts {
  x?: number;
  y: number;
  w?: number;
  h: number;
  gap?: number;
  /** Number the cards 1..n with a dot. */
  numbered?: boolean;
  /** Draw a return arrow beneath the row from the last card to this card index (0-based). */
  returnTo?: number;
  returnText?: string;
  tsize?: number;
  bsize?: number;
}

/** n linked cards in a row. With `returnTo` it is a loop. */
export function chainRow(links: readonly ChainLink[], o: ChainRowOpts): string {
  const { x = MX, y, w = BODY_W, h, gap = 18, numbered = true, returnTo, returnText, tsize = 17, bsize = 13.5 } = o;
  const n = links.length;
  const bw = (w - (n - 1) * gap) / n;
  let s = '';
  links.forEach((l, i) => {
    const bx = x + i * (bw + gap);
    s += box(bx, y, bw, h, { fill: C.white, stroke: l.lead ? C.terra : C.line, sw: l.lead ? 2.5 : 1.5 });
    if (numbered) {
      s += numberDot(bx + 30, y + 34, i + 1);
      s += para(bx + 56, y + 40, l.title, { size: tsize, width: bw - 70, font: F.display, weight: 600, lh: 1.15 }).svg;
    } else {
      s += para(bx + 18, y + 36, l.title, { size: tsize, width: bw - 36, font: F.display, weight: 600, lh: 1.15 }).svg;
    }
    const titleLines = wrapWords(l.title, Math.max(8, Math.floor((bw - (numbered ? 70 : 36)) / (tsize * 0.56)))).length;
    const bodyY = y + (numbered ? 40 : 36) + Math.max(titleLines, 2) * tsize * 1.15 + 18;
    s += para(bx + 18, bodyY, l.body, { size: bsize, width: bw - 36, lh: 1.42 }).svg;
    if (l.label) s += chip(bx + 18, y + h - 16, l.label, { fill: l.labelFill });
    if (i < n - 1) s += arrow(bx + bw + 2, y + (numbered ? 34 : 36), bx + bw + gap - 2, y + (numbered ? 34 : 36), { sw: 2 });
  });
  if (typeof returnTo === 'number') {
    const fromX = x + (n - 1) * (bw + gap) + bw / 2;
    const toX = x + returnTo * (bw + gap) + bw / 2;
    s += path(`M${fromX},${y + h + 2} L${fromX},${y + h + 34} L${toX},${y + h + 34} L${toX},${y + h + 6}`);
    if (returnText) s += text((fromX + toX) / 2, y + h + 54, returnText, { size: 13, fill: C.terra, anchor: 'middle', italic: true });
  }
  return s;
}

export interface ColumnLine {
  name: string;
  amount: string;
  status: string;
}

export interface Column {
  k: string;
  t: string;
  lines: readonly ColumnLine[];
  note: string;
  lead?: boolean;
}

/** n columns of line items (name, amount, status chip) with a note beneath. */
export function columns(cols: readonly Column[], o: { x?: number; y: number; w?: number; h: number; gap?: number }): string {
  const { x = MX, y, w = BODY_W, h, gap = 20 } = o;
  const cw = (w - (cols.length - 1) * gap) / cols.length;
  let s = '';
  cols.forEach((c, i) => {
    const cx = x + i * (cw + gap);
    s += box(cx, y, cw, h, { fill: C.white, stroke: c.lead ? C.terra : C.line, sw: c.lead ? 2.5 : 1.5 });
    s += kicker(cx + 20, y + 32, c.k);
    s += para(cx + 20, y + 64, c.t, { size: 20, width: cw - 40, font: F.display, weight: 600, lh: 1.2 }).svg;
    let ly = y + 122;
    c.lines.forEach((l) => {
      s += text(cx + 20, ly, l.name, { size: 13 });
      s += text(cx + cw - 20, ly, l.amount, { size: 14, anchor: 'end', weight: 600 });
      s += chip(cx + 20, ly + 18, l.status, { fill: chipFill(l.status) });
      s += line(cx + 20, ly + 34, cx + cw - 20, ly + 34);
      ly += 48;
    });
    s += para(cx + 20, ly + 14, c.note, { size: 12.5, width: cw - 40, lh: 1.4, fill: C.mute }).svg;
  });
  return s;
}

export interface Layer {
  k: string;
  t: string;
  d: string;
  fill?: string;
  stroke?: string;
}

/** Stacked full-width rows, top to bottom. */
export function layers(rows: readonly Layer[], o: { x?: number; y: number; w?: number; h?: number; gap?: number }): string {
  const { x = MX, y, w = 1000, h = 150, gap = 14 } = o;
  let s = '';
  let cy = y;
  rows.forEach((l) => {
    const fill = l.fill ?? C.white;
    const stroke = l.stroke ?? C.line;
    s += box(x, cy, w, h, { fill, stroke, sw: stroke === C.terra ? 2.5 : 1.5 });
    s += kicker(x + 24, cy + 32, l.k);
    s += text(x + 24, cy + 70, l.t, { size: 26, font: F.display, weight: 600 });
    s += para(x + 24, cy + 98, l.d, { size: 13.5, width: w - 48, lh: 1.4 }).svg;
    cy += h + gap;
  });
  return s;
}

export interface TimelineEvent {
  date: string;
  when: string;
  what: string;
  dir: 'up' | 'down';
  level: 1 | 2;
  big?: boolean;
}

/** Events on a dated axis between `from` and `to` (ISO dates). */
export function timeline(events: readonly TimelineEvent[], o: { from: string; to: string; y?: number; x0?: number; x1?: number; months: readonly [string, string][] }): string {
  const { from, to, y = 470, x0 = 110, x1 = 1490, months } = o;
  const d0 = new Date(from).getTime();
  const d1 = new Date(to).getTime();
  const X = (d: string) => x0 + ((new Date(d).getTime() - d0) / (d1 - d0)) * (x1 - x0);
  let s = line(x0, y, x1, y, C.ink, 2);
  months.forEach(([d, n]) => {
    const x = X(d);
    s += line(x, y - 8, x, y + 8, C.ink, 2);
    s += text(x + 8, y + 30, n.toUpperCase(), { size: 12, font: F.mono, fill: C.mute, ls: 1.5 });
  });
  events.forEach((ev) => {
    const x = X(ev.date);
    const big = Boolean(ev.big);
    s += circle(x, y, big ? 9 : 6, big ? C.terra : C.ink);
    const ly = ev.dir === 'up' ? y - 40 - (ev.level - 1) * 120 : y + 60 + (ev.level - 1) * 120;
    s += line(x, y, x, ev.dir === 'up' ? ly + 12 : ly - 30, C.line, 1.5);
    const bw = 240;
    const bx = Math.min(Math.max(x - bw / 2, MX), W - MX - bw);
    const by = ev.dir === 'up' ? ly - 92 : ly - 30;
    s += box(bx, by, bw, 104, { fill: big ? C.sand : C.white, stroke: big ? C.terra : C.line, sw: big ? 2 : 1.2 });
    s += text(bx + 12, by + 24, ev.when, { size: 14, font: F.display, weight: 600, fill: big ? C.terra : C.ink });
    s += para(bx + 12, by + 46, ev.what, { size: 12, width: bw - 24, lh: 1.35 }).svg;
  });
  return s;
}

/** A full-width tinted statement with a kicker. */
export function band(y: number, h: number, k: string, body: string, o: { fill?: string; x?: number; w?: number; size?: number } = {}): string {
  const { fill = C.sage, x = MX, w = BODY_W, size = 14.5 } = o;
  let s = box(x, y, w, h, { fill, stroke: fill });
  s += kicker(x + 20, y + 30, k);
  s += para(x + 20, y + 60, body, { size, width: w - 40, lh: 1.42 }).svg;
  return s;
}

export interface FrameOpts {
  /** Small mono line above the title: which form question, which module the figures come from. */
  page: string;
  title: string;
  sub?: string;
  body: string;
  footer: string;
  /** The stamp at the bottom right. */
  stamp?: string;
}

export const DEFAULT_STAMP = 'Goods on Country, QBE Catalysing Impact Stage 2';

/** The 16:9 page every diagram sits on. */
export function frame(o: FrameOpts): string {
  const { page, title, sub, body, footer, stamp = DEFAULT_STAMP } = o;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">
<defs>
  <marker id="ah-t" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="${C.terra}"/></marker>
  <marker id="ah-i" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="${C.ink}"/></marker>
</defs>
<rect width="${W}" height="${H}" fill="${C.cream}"/>
${kicker(MX, 62, page)}
${text(MX, 108, title, { size: 38, font: F.display, weight: 600 })}
${line(MX, 126, MX + 80, 126, C.terra, 3)}
${sub ? para(MX, 152, sub, { size: 17, width: BODY_W, fill: C.mute }).svg : ''}
${body}
${line(MX, H - 62, W - MX, H - 62, C.line, 1)}
${para(MX, H - 38, footer, { size: 13, width: BODY_W, fill: C.mute }).svg}
${text(W - MX, H - 20, stamp, { size: 11, font: F.mono, fill: C.mute, anchor: 'end' })}
</svg>`;
}

/** Australian dollars, no cents, with the thousands comma. */
export function aud(n: number): string {
  return `$${Math.round(n).toLocaleString('en-AU')}`;
}

/** Whole numbers with the thousands comma. */
export function num(n: number, dp = 0): string {
  return n.toLocaleString('en-AU', { maximumFractionDigits: dp, minimumFractionDigits: 0 });
}
