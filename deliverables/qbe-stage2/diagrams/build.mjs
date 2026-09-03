// QBE Stage 2 model diagrams. Brand tokens from the Pencil deck: cream, ink, terracotta, sand, sage.
// Every figure here is copied from raise-stack.ts, community-loop.ts, bed-ratio.ts and canon.ts.
import { writeFileSync, mkdirSync } from 'node:fs';

const W = 1600, H = 900;
const C = { cream: '#FBF8F1', ink: '#2B2A26', terra: '#C45C3E', sand: '#EDE5D8', sage: '#DDE2D2', clay: '#B8875C', mute: '#6B6862', white: '#FFFFFF', line: '#CFC7B8' };
const F = {
  display: "'Playfair Display', Georgia, 'Times New Roman', serif",
  body: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'Roboto Mono', Menlo, 'Courier New', monospace",
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrapWords(str, maxChars) {
  const words = String(str).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

function text(x, y, str, o = {}) {
  const { size = 16, font = F.body, fill = C.ink, weight = 400, anchor = 'start', ls = 0, italic = false } = o;
  return `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${ls}"${italic ? ' font-style="italic"' : ''}>${esc(str)}</text>`;
}

/** Wrapped paragraph. Returns { svg, height }. */
function para(x, y, str, o = {}) {
  const { size = 16, width = 300, lh = 1.35, font = F.body, fill = C.ink, weight = 400, anchor = 'start' } = o;
  const cw = font === F.display ? 0.56 : font === F.mono ? 0.62 : 0.52;
  const lines = wrapWords(str, Math.max(8, Math.floor(width / (size * cw))));
  const svg = lines.map((l, i) => text(x, y + i * size * lh, l, { size, font, fill, weight, anchor })).join('');
  return { svg, height: lines.length * size * lh };
}

function box(x, y, w, h, o = {}) {
  const { fill = C.white, stroke = C.line, sw = 1.5, r = 6 } = o;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function arrow(x1, y1, x2, y2, o = {}) {
  const { color = C.terra, sw = 2.5, dash = '' } = o;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" marker-end="url(#ah-${color === C.terra ? 't' : 'i'})"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

function path(d, o = {}) {
  const { color = C.terra, sw = 2.5, dash = '', end = true } = o;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}"${end ? ` marker-end="url(#ah-${color === C.terra ? 't' : 'i'})"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

/** Small mono label in caps. */
function kicker(x, y, str, o = {}) {
  return text(x, y, String(str).toUpperCase(), { size: 12, font: F.mono, fill: o.fill || C.terra, ls: 1.5, anchor: o.anchor || 'start' });
}

/** Status chip: verified / workpaper / modelled / target / invited / ask made / paid */
function chip(x, y, str, o = {}) {
  const w = str.length * 7.4 + 18;
  const fill = o.fill || C.sage;
  return `${box(x, y - 12, w, 18, { fill, stroke: fill, r: 9 })}${text(x + w / 2, y + 1, str.toUpperCase(), { size: 10, font: F.mono, fill: C.ink, anchor: 'middle', ls: 1 })}`;
}

function frame({ title, sub, body, footer, page }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <marker id="ah-t" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="${C.terra}"/></marker>
  <marker id="ah-i" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="${C.ink}"/></marker>
</defs>
<rect width="${W}" height="${H}" fill="${C.cream}"/>
${kicker(70, 62, page)}
${text(70, 108, title, { size: 38, font: F.display, weight: 600 })}
<line x1="70" y1="126" x2="150" y2="126" stroke="${C.terra}" stroke-width="3"/>
${sub ? para(70, 152, sub, { size: 17, width: 1460, fill: C.mute }).svg : ''}
${body}
<line x1="70" y1="${H - 62}" x2="${W - 70}" y2="${H - 62}" stroke="${C.line}" stroke-width="1"/>
${para(70, H - 38, footer, { size: 13, width: 1460, fill: C.mute }).svg}
${text(W - 70, H - 20, 'Goods on Country, QBE Catalysing Impact Stage 2, 3 September 2026', { size: 11, font: F.mono, fill: C.mute, anchor: 'end' })}
</svg>`;
}

// Panel: a titled box with a kicker, a title, a body paragraph and an optional chip.
function panel(x, y, w, h, { k, t, b, label, fill = C.white, stroke = C.line, tsize = 19, bsize = 14 }) {
  let s = box(x, y, w, h, { fill, stroke, sw: stroke === C.terra ? 2.5 : 1.5 });
  let cy = y + 28;
  if (k) { s += kicker(x + 18, cy, k); cy += 26; }
  if (t) { const p = para(x + 18, cy + 4, t, { size: tsize, width: w - 36, font: F.display, weight: 600, lh: 1.2 }); s += p.svg; cy += p.height + 12; }
  if (b) { const p = para(x + 18, cy + 4, b, { size: bsize, width: w - 36, lh: 1.4 }); s += p.svg; cy += p.height; }
  if (label) s += chip(x + 18, y + h - 16, label);
  return s;
}

const out = {};

// ---------------------------------------------------------------------------
// 01 The entity and how money moves (form Q2, Q3, Q8)
{
  let b = '';
  // Row 1: the lineage
  b += kicker(70, 205, 'The lineage, dated');
  const ry = 220, rh = 150;
  b += panel(70, ry, 400, rh, { k: 'Historic trading vehicle', t: 'Nicholas Marchesi, sole trader', b: 'ABN 21 591 780 066. The FY26 books sit here. No Goods activity after the transfer.', fill: C.sand, stroke: C.sand, tsize: 17, bsize: 13 });
  b += arrow(478, ry + rh / 2, 590, ry + rh / 2);
  b += text(534, ry + rh / 2 - 10, 'migrating, FY27', { size: 11, font: F.mono, fill: C.mute, anchor: 'middle' });
  b += panel(600, ry, 400, rh, { k: 'Related entity, cohort entrant', t: 'A Curious Tractor Pty Ltd', b: 'ABN 36 697 347 676. Entered the 2026 cohort; historic maker; transferring assets. Delivers nothing under the grant after transfer.', fill: C.sand, stroke: C.sand, tsize: 17, bsize: 13 });
  b += arrow(1008, ry + rh / 2, 1120, ry + rh / 2);
  b += text(1064, ry + rh / 2 - 10, 'ruling X, 28 Aug', { size: 11, font: F.mono, fill: C.mute, anchor: 'middle' });
  b += panel(1130, ry, 400, rh, { k: 'Applicant and recipient', t: 'The Butterfly Movement Ltd, trading as Goods on Country', b: 'ABN 22 155 132 684. Company limited by guarantee. ACNC charity since 2012, DGR since 17 Jan 2012. Business name from 23 Jul 2026.', fill: C.white, stroke: C.terra, tsize: 17, bsize: 13 });

  // Row 2: money in, the home, the communities
  const y2 = 418;
  b += kicker(70, y2 - 8, 'Money in, one home, five community partners');
  const inX = 70, inW = 400, ih = 88, gap = 10;
  const ins = [
    ['Catalytic grant', 'QBE Catalysing Impact. $250,000 asked: one pool and the proof.', 'ask made'],
    ['Philanthropy', 'Tim Fairfax Family Foundation, Brian M. Davis, Snow, Minderoo, Dusseldorp. Grants land in the charity.', 'invited / ask made'],
    ['Buyers', 'ALIVE National Centre paid for 100 beds up front. Centrecorp has a 130-bed quote open.', 'paid / quote'],
    ['Repayable finance', 'SEFA and White Box, for equipment and working capital, after the measured run. Borrower to be settled.', 'target'],
  ];
  ins.forEach(([t, d, l], i) => {
    const y = y2 + i * (ih + gap);
    b += panel(inX, y, inW, ih, { t, b: d, tsize: 15, bsize: 11.5 });
    b += chip(inX + inW - 18 - (l.length * 7.4 + 18), y + 20, l);
    b += arrow(inX + inW + 8, y + ih / 2, 596, y + ih / 2);
  });
  const hx = 606, hw = 430, hy = y2, hh = 4 * ih + 3 * gap;
  b += box(hx, hy, hw, hh, { fill: C.white, stroke: C.terra, sw: 2.5 });
  b += kicker(hx + 20, hy + 30, 'Goods on Country holds the work');
  b += para(hx + 20, hy + 62, 'One operating home', { size: 22, width: hw - 40, font: F.display, weight: 600 }).svg;
  const holds = [
    'The board governs purpose, shared assets, appointments and reinvestment. Directors: Kristy Bloomfield, Audrey Deemal, Jeremy Donovan. Indigenous-led. Ownership stays a pathway.',
    'It holds the products, IP, contracts, making, sales, delivery, capital, register and evidence.',
    'It buys the beds, agrees the rules with each community, runs the measured run, and reports.',
    'It repays any equipment debt from its own margin on buyer orders. Never from a community pool. No equity is sold.',
  ];
  let hyy = hy + 92;
  for (const h of holds) { const p = para(hx + 20, hyy, h, { size: 13.5, width: hw - 40, lh: 1.4 }); b += p.svg; hyy += p.height + 10; }

  const cx = 1100, cw = 430;
  b += arrow(hx + hw + 8, hy + hh / 2, cx - 10, hy + hh / 2);

  b += box(cx, hy, cw, hh, { fill: C.sage, stroke: C.sage });
  b += kicker(cx + 20, hy + 30, 'Five community partners');
  b += para(cx + 20, hy + 62, 'Independent organisations, not subsidiaries', { size: 20, width: cw - 40, font: F.display, weight: 600, lh: 1.2 }).svg;
  const cs = [
    'Each holds a pool of 200 beds under rules agreed before any bed moves: allocation, sales money, resale, paid work and stock.',
    'Each decides what is given, what is sold, who is paid and what comes next. Sales money stays local.',
    'No community is named beside a pool until it has seen the design. Nobody has been promised 200 beds.',
  ];
  let cyy = hy + 122;
  for (const c of cs) { const p = para(cx + 20, cyy, c, { size: 13.5, width: cw - 40, lh: 1.4 }); b += p.svg; cyy += p.height + 10; }
  // five small squares
  for (let i = 0; i < 5; i++) b += box(cx + 20 + i * 40, hy + hh - 44, 30, 30, { fill: C.white, stroke: C.terra, sw: 2 });
  b += text(cx + 20 + 5 * 40 + 6, hy + hh - 23, '× 200 beds each', { size: 12, font: F.mono, fill: C.mute });

  out['01-entity-and-money'] = frame({
    page: 'Form Q2, Q3, Q8. Recommended route, subject to Social Impact Hub confirming on 3 September',
    title: 'The entity, and how the money moves',
    sub: 'Three entities in a dated line, one operating home, and five community partners who make the local decisions. Every external dollar lands in the charity.',
    body: b,
    footer: 'A Kind Tractor Ltd (ABN 73 669 029 341) is dormant and has no role. The REAL Innovation Fund grant (about $2M, DEWR) is Oonchiumpa\'s, related and disclosed, not a Goods line. Fallback if the cohort entrant must apply: A Curious Tractor applies, and the answer to Q8 rests on the inter-entity agreement, which is not yet signed.',
  });
}

// ---------------------------------------------------------------------------
// 02 The unit: one bed, four things, any amount (form Q5, Q6, Q7)
{
  let b = '';
  // Left card
  const lx = 70, ly = 200, lw = 560, lh = 560;
  b += box(lx, ly, lw, lh, { fill: C.white, stroke: C.terra, sw: 2.5 });
  b += kicker(lx + 24, ly + 34, 'The unit');
  b += text(lx + 24, ly + 92, 'One bed, $750', { size: 44, font: F.display, weight: 600 });
  const unit = [
    ['A bed off the ground', 'Washable, repairable, about five minutes to assemble.', 'verified'],
    ['20kg of recycled plastic', 'Fifty beds is one tonne of HDPE kept in use. Weighed batch by batch in the measured run.', 'workpaper'],
    ['About 6.5 hours of local work', 'Collect, shred, press, cut, assemble, deliver. Not yet timed; 3.5 of those hours are CNC and the stopwatch decides. About $130 of fair-wage labour a bed in the community cost state.', 'modelled'],
    ['Up to $750 that stays local', 'If the community sells the bed. Given beds meet need instead. The mix is the community\'s call, and none of it is income until the rules are agreed.', 'target'],
  ];
  let uy = ly + 130;
  unit.forEach(([t, d, l], i) => {
    b += `<circle cx="${lx + 40}" cy="${uy + 2}" r="14" fill="${C.terra}"/>` + text(lx + 40, uy + 7, String(i + 1), { size: 14, font: F.mono, fill: C.white, anchor: 'middle', weight: 700 });
    b += text(lx + 68, uy + 7, t, { size: 19, font: F.display, weight: 600 });
    const p = para(lx + 68, uy + 32, d, { size: 13.5, width: lw - 110, lh: 1.4 });
    b += p.svg;
    b += chip(lx + 68, uy + 32 + p.height + 10, l);
    uy += 32 + p.height + 40;
  });

  // Right: the scale table
  const tx = 680, ty = 200, tw = 850;
  b += kicker(tx, ty + 14, 'The same ratio at any amount');
  const cols = ['Amount', 'Beds', 'Pools', 'Plastic', 'Local work', 'Stays local if all sold'];
  const cw = [150, 100, 100, 110, 150, 240];
  const rows = [
    ['$150,000', '200', '1', '4 t', '1,300 h', 'up to $150,000', 'the smaller amount, Q7'],
    ['$250,000', '333', '1.7', '6.7 t', '2,170 h', 'up to $250,000', 'the ask, Q5'],
    ['$400,000', '533', '2.7', '10.7 t', '3,470 h', 'up to $400,000', 'the ceiling, never the plan'],
    ['$750,000', '1,000', '5', '20 t', '6,500 h', 'up to $750,000', 'the whole program'],
  ];
  let y = ty + 40;
  let x = tx;
  cols.forEach((c, i) => { b += text(x + 10, y + 18, c.toUpperCase(), { size: 11, font: F.mono, fill: C.mute, ls: 1 }); x += cw[i]; });
  y += 30;
  b += `<line x1="${tx}" y1="${y}" x2="${tx + tw}" y2="${y}" stroke="${C.ink}" stroke-width="1.5"/>`;
  rows.forEach((r, ri) => {
    const rh = 74;
    if (ri === 1) b += box(tx, y + 2, tw, rh - 4, { fill: C.sand, stroke: C.terra, sw: 2, r: 4 });
    let xx = tx;
    r.slice(0, 6).forEach((cell, i) => {
      b += text(xx + 10, y + 34, cell, { size: i === 0 ? 20 : 18, font: i === 0 ? F.display : F.body, weight: i === 0 ? 600 : 400 });
      xx += cw[i];
    });
    b += text(tx + 10, y + 58, r[6], { size: 12, font: F.mono, fill: ri === 1 ? C.terra : C.mute, ls: 0.5 });
    y += rh;
    b += `<line x1="${tx}" y1="${y}" x2="${tx + tw}" y2="${y}" stroke="${C.line}" stroke-width="1"/>`;
  });
  // Unlock panel
  const py = y + 30;
  b += box(tx, py, tw, 760 - py, { fill: C.sage, stroke: C.sage });
  b += kicker(tx + 20, py + 30, 'What one catalytic grant starts that nothing else in the stack does');
  b += para(tx + 20, py + 60, 'Every other dollar in the stack buys beds or keeps the organisation standing. A catalytic grant is the only money that buys the proof: the first fifty beds pressed and timed, and the rules each pool runs on. Without it the pools are a gift. With it they are the first step of an enterprise, and the equipment loan behind them can be written.', { size: 14.5, width: tw - 40, lh: 1.45 }).svg;

  out['02-the-unit'] = frame({
    page: 'Form Q5, Q6, Q7. Figures from bed-ratio.ts',
    title: 'One bed, four things, any amount',
    sub: 'Every dollar buys beds. Every bed does four things. Any amount scales the same way, and every figure keeps its label.',
    body: b,
    footer: 'Working proposal. Beds at $750 each; plastic at 20kg a bed; local work at about 6.5 modelled hours a bed when made locally. Money that stays local is gross sales at $750 and only for beds the community chooses to sell. Ratios are per bed and scale in a straight line; real sites do not. The measured run replaces the modelled hours and the design plastic figure with measured ones.',
  });
}

// ---------------------------------------------------------------------------
// 03 One catalyst, five loops (form Q6, the model)
{
  let b = '';
  // Row 1: catalyst
  const y1 = 190, h1 = 112;
  b += kicker(70, y1 - 10, 'The catalyst, once');
  b += panel(70, y1, 400, h1, { t: 'A funder backs the beds', b: '$750,000 is the cost of 1,000 beds at $750 each. Not sales, not community income.', tsize: 17, bsize: 13 });
  b += arrow(478, y1 + h1 / 2, 590, y1 + h1 / 2);
  b += panel(600, y1, 400, h1, { t: 'The Goods on Country board holds the rules', b: 'Purpose, shared assets, appointments, reinvestment. Indigenous-led today; ownership stays a pathway.', tsize: 17, bsize: 13 });
  b += arrow(1008, y1 + h1 / 2, 1120, y1 + h1 / 2);
  b += panel(1130, y1, 400, h1, { t: 'Five community pools of 200 beds', b: 'Each held by a community partner under rules agreed before any bed moves.', tsize: 17, bsize: 13 });
  // x5 arrow down
  b += path(`M1330,${y1 + h1 + 4} L1330,${y1 + h1 + 44} L1420,${y1 + h1 + 44}`, { end: false });
  b += text(1300, y1 + h1 + 48, '× 5 into the loop', { size: 12, font: F.mono, fill: C.terra, anchor: 'end' });

  // Row 2: the loop
  const y2 = 372, h2 = 236, gw = 20, bw = (1460 - 4 * gw) / 5;
  b += kicker(70, y2 - 10, 'One community loop, shown once, run five times');
  const steps = [
    ['200 beds arrive', 'Cost $150,000. Useful stock that lasts, held locally.', 'target'],
    ['The community sets the mix', 'Give some to meet immediate need. Sell some to pay local work.', 'target'],
    ['Sales money stays local', 'Up to $150,000 if all 200 sell at $750. Less when beds are given. A design number until the rules are agreed.', 'target'],
    ['The community decides what comes next', 'More beds, a shredder or a press, the washer. A full facility is $150,000 to $220,000, so one pool sold in full reaches the bottom of that band and no further.', 'modelled'],
    ['Making moves closer', 'About $324 stays on a bed pressed locally against about $65 on a kit. Modelled, not yet measured; the measured run is what proves it.', 'modelled'],
  ];
  steps.forEach(([t, d, l], i) => {
    const x = 70 + i * (bw + gw);
    b += box(x, y2, bw, h2, { fill: C.white, stroke: C.line });
    b += `<circle cx="${x + 30}" cy="${y2 + 34}" r="16" fill="${C.terra}"/>` + text(x + 30, y2 + 40, String(i + 1), { size: 15, font: F.mono, fill: C.white, anchor: 'middle', weight: 700 });
    b += para(x + 56, y2 + 40, t, { size: 17, width: bw - 70, font: F.display, weight: 600, lh: 1.15 }).svg;
    b += para(x + 18, y2 + 100, d, { size: 13, width: bw - 36, lh: 1.4 }).svg;
    b += chip(x + 18, y2 + h2 - 16, l);
    if (i < 4) b += arrow(x + bw + 2, y2 + 60, x + bw + gw - 2, y2 + 60, { sw: 2 });
  });
  // return arrow from step 5 under to step 2
  const rx5 = 70 + 4 * (bw + gw) + bw / 2, rx2 = 70 + (bw + gw) + bw / 2;
  b += path(`M${rx5},${y2 + h2 + 2} L${rx5},${y2 + h2 + 34} L${rx2},${y2 + h2 + 34} L${rx2},${y2 + h2 + 6}`);
  b += text((rx5 + rx2) / 2, y2 + h2 + 54, 'Then the community decides again. The return arrow stays inside the community, never back to the funder.', { size: 13, fill: C.terra, anchor: 'middle', italic: true });

  // Row 3: gates
  const y3 = 700, h3 = 92, gw3 = 16, gbw = (1460 - 3 * gw3) / 4;
  b += kicker(70, y3 - 10, 'Four gates before the loop is real at a named site');
  const gates = [
    ['Buyers', 'Who is buying the sold beds, named.'],
    ['Rules', 'Allocation, sales money, resale and stock, agreed and signed.'],
    ['An operator and a place', 'Who runs the line, where, and who pays them.'],
    ['A measured cost', 'Fifty beds pressed at production rate, timed and costed.'],
  ];
  gates.forEach(([t, d], i) => {
    const x = 70 + i * (gbw + gw3);
    b += panel(x, y3, gbw, h3, { t, b: d, fill: C.sand, stroke: C.sand, tsize: 16, bsize: 13 });
  });

  out['03-one-catalyst-five-loops'] = frame({
    page: 'The model. Figures from community-loop.ts',
    title: 'One catalyst starts five loops a community controls',
    sub: 'The funder acts once. The board holds the rules. Each community decides what is given, what is sold, who is paid and what the sales money builds next.',
    body: b,
    footer: 'Working proposal. The rules for sales money, resale and who holds the beds are being agreed with each community. Until they are, the numbers are a design, not a promise. Gross sales are gross: only sold beds create them, and nothing has been deducted.',
  });
}

// ---------------------------------------------------------------------------
// 04 Capital with three jobs (form Q14, Q18)
{
  let b = '';
  const y = 200, h = 470, gap = 20, w = (1460 - 2 * gap) / 3;
  const colsD = [
    { k: 'Bed money', t: 'Gifts and purchases that buy beds into pools', lines: [
      ['QBE, pool share of the $250K ask', '$150,000', 'ask made'],
      ['Brian M. Davis Charitable Foundation', '$100,000', 'invited'],
      ['Snow Foundation', '$100,000', 'ask made'],
      ['Minderoo Foundation', '$100,000', 'ask made'],
      ['Dusseldorp Forum', '$50,000', 'target'],
      ['ALIVE National Centre, 100 beds', '$92,000', 'paid'],
    ], note: 'If every line lands: 765 beds at the $250K ask, 965 at the $400K ceiling. The rest waits for the next yes.' },
    { k: 'Block money', t: 'Three years of network support, the organisation\'s resilience', lines: [
      ['Tim Fairfax Family Foundation, three years', '$300,000', 'invited'],
    ], note: 'About $109,500 a year runs Goods on Country before a bed is made; about $300,000 a year is the public network ask. Bed money never funds this. Katie Norman named the resilience of organisations as the reason for the invitation, so this is the block in the funder\'s own words. Recommended: the block, not beds. Ben has not yet ruled.' },
    { k: 'Repayable finance', t: 'Equipment and working capital, after the measured run', lines: [
      ['SEFA', '$300,000', 'target'],
      ['White Box SELF', '$150,000', 'target'],
    ], note: 'Cannot be written today: the pressed cost is modelled and the borrower is unsettled. Repaid from Goods on Country\'s margin on buyer orders, never from a community\'s pool. At the pressed margin (about $324, modelled) $450,000 needs about 460 buyer-bought beds a year for three years; at the kit margin (about $65) it cannot be repaid.' },
  ];
  colsD.forEach((c, i) => {
    const x = 70 + i * (w + gap);
    b += box(x, y, w, h, { fill: C.white, stroke: i === 0 ? C.terra : C.line, sw: i === 0 ? 2.5 : 1.5 });
    b += kicker(x + 20, y + 32, c.k);
    b += para(x + 20, y + 64, c.t, { size: 20, width: w - 40, font: F.display, weight: 600, lh: 1.2 }).svg;
    let ly = y + 122;
    c.lines.forEach(([n, a, s]) => {
      b += text(x + 20, ly, n, { size: 13 });
      b += text(x + w - 20, ly, a, { size: 14, anchor: 'end', weight: 600 });
      b += chip(x + 20, ly + 18, s, { fill: s === 'paid' ? C.sage : s === 'invited' ? C.sand : C.cream });
      b += `<line x1="${x + 20}" y1="${ly + 34}" x2="${x + w - 20}" y2="${ly + 34}" stroke="${C.line}" stroke-width="1"/>`;
      ly += 48;
    });
    b += para(x + 20, ly + 14, c.note, { size: 12.5, width: w - 40, lh: 1.4, fill: C.mute }).svg;
  });
  // The proof band
  const py = y + h + 24, ph = 96;
  b += box(70, py, 1460, ph, { fill: C.sage, stroke: C.sage });
  b += kicker(90, py + 30, 'The proof, and only a catalytic grant buys it');
  b += para(90, py + 58, '$100,000 of the $250,000 QBE ask: the first fifty beds pressed at the farm at production rate, timed and costed with receipts; five community rules agreements; product traceability so kilograms per bed become a measurement; and the accounting repair that gives Goods on Country a gross margin on paper. This is the input every lender has asked for and nobody has.', { size: 14, width: 1420, lh: 1.4 }).svg;

  out['04-capital-three-jobs'] = frame({
    page: 'Form Q14, Q18. Figures from raise-stack.ts, pulled 2 September 2026',
    title: 'Capital with three jobs',
    sub: 'Philanthropy buys the beds and the block. Debt buys the machines and is repaid by buyers. Communities keep what their pools earn. Nobody is buying shares.',
    body: b,
    footer: '$0 is signed today, and it is stated first. A Catalysing Impact grant is discretionary, typically $150,000 to $400,000 from a pool of up to $1.1 million across ten enterprises. It sits on top of signed external paper and does not double, trigger or guarantee anything. Two lines on Ben\'s note, FRRR Palm $20K and Luke EV Fleet $20K, have no second source and are not summed.',
  });
}

// ---------------------------------------------------------------------------
// 05 Who decides what (form Q19, Q22)
{
  let b = '';
  const x = 70, w = 1000;
  const layers = [
    { k: 'Layer 1, governs', t: 'An Indigenous-led board', d: 'Purpose, shared assets, appointments and reinvestment. Directors of The Butterfly Movement Ltd: Kristy Bloomfield, Audrey Deemal and Jeremy Donovan; Kristy and Audrey appointed June and July 2026. The stated aim is full Indigenous directorship. The chair will be an Aboriginal director.', fill: C.white, stroke: C.terra },
    { k: 'Layer 2, holds', t: 'Goods on Country', d: 'The charity, the brand, the product system, the IP, fundraising, shared services, the register and the evidence. It agrees the rules with each community, buys the beds, runs the measured run, and reports once against one set of numbers.', fill: C.white, stroke: C.line },
    { k: 'Layer 3, decides', t: 'Each community partner', d: 'Allocation, local sales, local work, where the sales money goes, and whether and when to move toward production. Independent local decision-makers, not departments inside the charity.', fill: C.sage, stroke: C.sage },
  ];
  let y = 200;
  layers.forEach((l) => {
    const h = 150;
    b += box(x, y, w, h, { fill: l.fill, stroke: l.stroke, sw: l.stroke === C.terra ? 2.5 : 1.5 });
    b += kicker(x + 24, y + 32, l.k);
    b += text(x + 24, y + 70, l.t, { size: 26, font: F.display, weight: 600 });
    b += para(x + 24, y + 98, l.d, { size: 13.5, width: w - 48, lh: 1.4 }).svg;
    y += h + 14;
  });
  // Right column: how we know control moved
  const rx = 1110, rw = 420;
  b += box(rx, 200, rw, 478, { fill: C.sand, stroke: C.sand });
  b += kicker(rx + 20, 232, 'The test that lets the ownership claim fail');
  b += para(rx + 20, 266, 'Month six, four questions', { size: 22, width: rw - 40, font: F.display, weight: 600 }).svg;
  const qs = ['Who holds the keys to the site?', 'Who runs the payroll for the local work?', 'Who invoices the buyer?', 'Is at least half of production done locally?'];
  let qy = 316;
  qs.forEach((q, i) => { b += text(rx + 20, qy, `${i + 1}.  ${q}`, { size: 14.5 }); qy += 30; });
  b += para(rx + 20, qy + 10, 'Partial counts as no. Ownership stays a pathway wherever it is not legally complete, and no surface says otherwise.', { size: 13, width: rw - 40, lh: 1.4, fill: C.mute }).svg;
  b += `<line x1="${rx + 20}" y1="${qy + 70}" x2="${rx + rw - 20}" y2="${qy + 70}" stroke="${C.line}"/>`;
  b += kicker(rx + 20, qy + 100, 'Alongside, advice not authority');
  b += para(rx + 20, qy + 126, 'An eleven-member advisory committee meets monthly: Kristy Bloomfield, Nicholas Marchesi OAM, Sally Grimsley-Ballard, Daniel Pittman, Sam Davies, Judith Meiklejohn, Corey Tutt, April Long, Susan Clear, Nina Fitzgerald, Shaun Fisher. It gives challenge and openings. It holds no fiduciary authority, and is never called a board.', { size: 12.5, width: rw - 40, lh: 1.4 }).svg;

  out['05-who-decides-what'] = frame({
    page: 'Form Q19, Q22. Governance, from the 26 August deck brief and CONTEXT.md',
    title: 'Who decides what',
    sub: 'One shared system. Local decisions stay local. Shown as three layers, never as three organisations in a row and never as a tree with communities beneath the charity.',
    body: b,
    footer: 'Status language that holds on every surface: Indigenous-led today; two Indigenous directors appointed; the aim is full Indigenous directorship; ownership remains a pathway. No Supply Nation, IPP, IBA or First Australians Capital eligibility is inferred from board composition alone.',
  });
}

// ---------------------------------------------------------------------------
// 06 The catalytic chain (form Q14, Q18)
{
  let b = '';
  const links = [
    { t: 'QBE funds the first pool and the proofs', d: 'One governed pool of 200 beds and the proof block. Every other dollar in the stack buys beds at the same ratio or keeps the organisation standing. Nothing else buys the proof.', s: 'the ask, $250,000' },
    { t: 'That work produces the paper a lender can read', d: 'Community agreements, a measured cost per bed, buyer paper and a governed pool. The modelled $426 pressed-path cost becomes a measured one.', s: 'released by link 1' },
    { t: 'Three invitations already in hand', d: 'Tim Fairfax $300,000 for the block (due 9 Oct). Brian M. Davis $100,000 for pool three (due 25 Sep). Snow, ask made and a catch-up booked. Minderoo and Dusseldorp in conversation.', s: '$0 signed today' },
    { t: 'After the measured run, the equipment finance', d: 'SEFA $300,000 and White Box $150,000 for equipment and working capital. Neither can proceed while the cost is modelled and the borrower is unsettled.', s: 'gated on link 2' },
    { t: 'Demand already paying', d: 'ALIVE National Centre bought 100 beds up front ($92,000, paid). Centrecorp holds a 130-bed quote, deferred pending community feedback. More than 200 requests in each of Tennant Creek and Mparntwe.', s: 'verified purchase' },
  ];
  const gap = 18, w = (1460 - 4 * gap) / 5, y = 200, h = 400;
  links.forEach((l, i) => {
    const x = 70 + i * (w + gap);
    b += box(x, y, w, h, { fill: i === 0 ? C.white : C.white, stroke: i === 0 ? C.terra : C.line, sw: i === 0 ? 2.5 : 1.5 });
    b += `<circle cx="${x + 32}" cy="${y + 36}" r="18" fill="${C.terra}"/>` + text(x + 32, y + 42, String(i + 1), { size: 16, font: F.mono, fill: C.white, anchor: 'middle', weight: 700 });
    b += para(x + 62, y + 42, l.t, { size: 17, width: w - 80, font: F.display, weight: 600, lh: 1.15 }).svg;
    b += para(x + 20, y + 130, l.d, { size: 13.5, width: w - 40, lh: 1.42 }).svg;
    b += chip(x + 20, y + h - 18, l.s);
    if (i < 4) b += arrow(x + w + 2, y + 36, x + w + gap - 2, y + 36, { sw: 2 });
  });
  // What remains
  const py = y + h + 26;
  b += box(70, py, 1460, 130, { fill: C.sage, stroke: C.sage });
  b += kicker(90, py + 30, 'The test of catalytic, as CONTEXT.md defines it: what remains after the first spend');
  b += para(90, py + 60, 'After this money is spent, five communities hold beds, paid assembly and delivery work, sales money where they chose to sell, and the right to decide the next step. The equipment loan behind them can be written, because the cost is measured and the pool is governed. Without the grant the pools are a gift. With it they are the first step of an enterprise.', { size: 14.5, width: 1420, lh: 1.42 }).svg;

  out['06-the-catalytic-chain'] = frame({
    page: 'Form Q14, Q18. Leverage is the metric the program publishes: 3.7x in 2025',
    title: 'How the grant is catalytic: a chain with a release condition on every link',
    sub: 'Stated as a chain, never as a total. QBE is never described as doubling, triggering or guaranteeing anything.',
    body: b,
    footer: 'Statuses from raise-stack.ts on 2 September 2026: invited means a written invitation to apply for a named amount with a callable contact; ask made means an ask is with the funder and no written amount is back; target means our number and nothing from the funder yet; paid means money received and evidenced in Xero.',
  });
}

// ---------------------------------------------------------------------------
// 07 The calendar
{
  let b = '';
  const x0 = 110, x1 = 1490, y = 470;
  const d0 = new Date('2026-09-01'), d1 = new Date('2026-11-30');
  const X = (d) => x0 + ((new Date(d) - d0) / (d1 - d0)) * (x1 - x0);
  b += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${C.ink}" stroke-width="2"/>`;
  // month ticks
  [['2026-09-01', 'September'], ['2026-10-01', 'October'], ['2026-11-01', 'November']].forEach(([d, n]) => {
    const x = X(d);
    b += `<line x1="${x}" y1="${y - 8}" x2="${x}" y2="${y + 8}" stroke="${C.ink}" stroke-width="2"/>`;
    b += text(x + 8, y + 30, n.toUpperCase(), { size: 12, font: F.mono, fill: C.mute, ls: 1.5 });
  });
  const ev = [
    ['2026-09-03', 'Thu 3 Sep', 'Final cohort check-in with Social Impact Hub, 2pm Sydney. Ben with Eloise on Butterfly\'s books.', 'up', 1],
    ['2026-09-09', '7 to 11 Sep', 'Philanthropy Australia conference, Brisbane. Miranda from Brian M. Davis sees a bed.', 'down', 1],
    ['2026-09-14', 'Mon 14 Sep', 'Butterfly Movement AGM, tentative. Directors resign and are reappointed.', 'up', 2],
    ['2026-09-25', 'Fri 25 Sep, 12pm', 'QBE Stage 2 form closes. Brian M. Davis application closes the same day.', 'down', 2],
    ['2026-10-07', 'Wed 7 Oct', 'QBE application review meeting, 9:45 Sydney, booked.', 'up', 1],
    ['2026-10-09', 'Fri 9 Oct, 5pm', 'Tim Fairfax Family Foundation application closes.', 'down', 1],
    ['2026-10-23', 'Fri 23 Oct', 'QBE conditional outcomes.', 'up', 1],
    ['2026-11-13', 'Fri 13 Nov', 'QBE deadline to meet any pre-conditions.', 'down', 2],
    ['2026-11-19', 'Thu 19 Nov', 'Brian M. Davis board decides.', 'up', 1],
    ['2026-11-26', 'Late Nov', 'Tim Fairfax board decides (date unconfirmed).', 'up', 2],
  ];
  ev.forEach(([d, when, what, dir, lvl]) => {
    const x = X(d);
    const big = when.includes('25 Sep') || when.includes('13 Nov');
    b += `<circle cx="${x}" cy="${y}" r="${big ? 9 : 6}" fill="${big ? C.terra : C.ink}"/>`;
    const ly = dir === 'up' ? y - 40 - (lvl - 1) * 120 : y + 60 + (lvl - 1) * 120;
    b += `<line x1="${x}" y1="${y}" x2="${x}" y2="${dir === 'up' ? ly + 12 : ly - 30}" stroke="${C.line}" stroke-width="1.5"/>`;
    const bw = 240, bx = Math.min(Math.max(x - bw / 2, 70), 1530 - bw);
    const by = dir === 'up' ? ly - 92 : ly - 30;
    b += box(bx, by, bw, 104, { fill: big ? C.sand : C.white, stroke: big ? C.terra : C.line, sw: big ? 2 : 1.2 });
    b += text(bx + 12, by + 24, when, { size: 14, font: F.display, weight: 600, fill: big ? C.terra : C.ink });
    b += para(bx + 12, by + 46, what, { size: 12, width: bw - 24, lh: 1.35 }).svg;
  });

  out['07-the-calendar'] = frame({
    page: 'Sourced dates: Jay Boolkin 24 Aug; Miranda Campbell 1 Sep; Katie Norman 31 Aug; Adam\'s invite 28 Aug',
    title: 'The calendar: three applications inside fourteen days',
    sub: 'One strategy, three cuts. QBE and Brian M. Davis close on the same Friday; Tim Fairfax two weeks later. All three want the same program described the same way.',
    body: b,
    footer: 'The timing fault to raise with Social Impact Hub: both foundation boards decide after QBE\'s 13 November pre-condition date. Question two for Jay is whether written invitations with callable contacts count as conditional commitments, and whether the pre-condition window can extend to those board dates.',
  });
}

mkdirSync('svg', { recursive: true });
for (const [name, svg] of Object.entries(out)) writeFileSync(`svg/${name}.svg`, svg);
console.log(Object.keys(out).join('\n'));
