/**
 * THE QBE MODEL DIAGRAMS, drawn from the modules.
 *
 * Nine drawings. Seven are the ones the QBE application already carries (entity, unit, loop, three
 * jobs, who decides, the chain, the calendar), redrawn here so every figure is read from
 * `raise-stack.ts`, `community-loop.ts`, `bed-ratio.ts`, `canon.ts` and `qbe-story.ts` instead of
 * typed. Two are new: the snowball (where it goes if it works) and who buys (the question every
 * room asks). Each returns an SVG string; the page renders it inline and offers it as a download,
 * so the slide in Pencil is the same drawing.
 *
 * To add a drawing: write a function that composes kit primitives from module data, add it to
 * QBE_DIAGRAMS with an id, title and the chapter it belongs to. The guards render every entry
 * and assert the figures in the SVG match the modules.
 */
import { BED_UNIT, SCALE_ROWS, UNLOCK, RATIO_GUARDRAIL } from '@/lib/data/bed-ratio';
import {
  BED_PRICE_AUD,
  FACILITY_BAND,
  KIT_COST_AUD,
  LOOP_GATES,
  LOOP_RETURN,
  LOOP_STEPS,
  POOL,
  PRESSED_COST_AUD,
  STAYS_KIT_AUD,
  STAYS_PRESSED_AUD,
} from '@/lib/data/community-loop';
import {
  ENTITY_ROUTE,
  PROGRAM,
  QBE_ASK,
  SIGNED_TOTAL_AUD,
  STACK,
  THE_BLOCK,
  UNVERIFIED_LINE_IDS,
  bedsFunded,
  lineById,
  type StackLine,
} from '@/lib/data/raise-stack';
import {
  BUYERS,
  CALENDAR,
  CALENDAR_FAULT,
  MONTH_SIX_QUESTIONS,
  SNOWBALL,
  SNOWBALL_BEDS_PER_YEAR,
  SNOWBALL_MARGIN_PER_YEAR_AUD,
  SNOWBALL_STEPS,
  THREE_DOORS,
  type StoryChapterId,
} from '@/lib/data/qbe-story';
import {
  BODY_W,
  C,
  F,
  MX,
  W,
  arrow,
  aud,
  band,
  box,
  chainRow,
  chip,
  chipFill,
  chipWidth,
  columns,
  frame,
  kicker,
  layers,
  line,
  num,
  numberDot,
  panel,
  para,
  path,
  text,
  timeline,
} from './kit';

export interface QbeDiagram {
  id: string;
  title: string;
  chapter: StoryChapterId;
  /** What the drawing is for, one line under the figure on the page. */
  caption: string;
  /** The Pencil frame it feeds. */
  slide: string;
  svg: () => string;
}

const statusWord = (s: StackLine['status']) => (s === 'ask-made' ? 'ask made' : s);
const K = (n: number) => `$${Math.round(n / 1000)}K`;

// ---------------------------------------------------------------------------
// 01 The entity, and how the money moves

export function entityAndMoney(): string {
  let b = '';
  b += kicker(MX, 205, 'The lineage, dated');
  const ry = 220, rh = 150;
  b += panel(MX, ry, 400, rh, { k: 'Historic trading vehicle', t: 'Nicholas Marchesi, sole trader', b: 'ABN 21 591 780 066. The FY26 books sit here. No Goods activity after the transfer.', fill: C.sand, stroke: C.sand, tsize: 17, bsize: 13 });
  b += arrow(478, ry + rh / 2, 590, ry + rh / 2);
  b += text(534, ry + rh / 2 - 10, 'migrating, FY27', { size: 11, font: F.mono, fill: C.mute, anchor: 'middle' });
  b += panel(600, ry, 400, rh, { k: 'Related entity, cohort entrant', t: 'A Curious Tractor Pty Ltd', b: 'ABN 36 697 347 676. Entered the 2026 cohort; historic maker; transferring assets. Delivers nothing under the grant after transfer.', fill: C.sand, stroke: C.sand, tsize: 17, bsize: 13 });
  b += arrow(1008, ry + rh / 2, 1120, ry + rh / 2);
  b += text(1064, ry + rh / 2 - 10, 'ruling X, 28 Aug', { size: 11, font: F.mono, fill: C.mute, anchor: 'middle' });
  b += panel(1130, ry, 400, rh, { k: 'Applicant and recipient', t: `${ENTITY_ROUTE.recommended.applicant.replace(' (Goods on Country)', '')}, trading as Goods on Country`, b: `ABN ${ENTITY_ROUTE.recommended.abn}. Company limited by guarantee. ACNC charity since 2012, DGR since 17 Jan 2012. Business name from 23 Jul 2026.`, fill: C.white, stroke: C.terra, tsize: 17, bsize: 13 });

  const y2 = 418;
  b += kicker(MX, y2 - 8, 'Money in, one home, five community partners');
  const inX = MX, inW = 400, ih = 88, gap = 10;
  const ins: [string, string, string][] = [
    ['Catalytic grant', `QBE Catalysing Impact. ${aud(QBE_ASK.recommended.aud)} asked: ${QBE_ASK.recommended.beds} beds.`, statusWord(lineById('qbe').status)],
    ['Philanthropy', 'Tim Fairfax Family Foundation, Brian M. Davis, Snow, Minderoo, Dusseldorp. Grants land in the charity.', 'invited / ask made'],
    ['Buyers', `ALIVE National Centre paid for ${lineById('alive').beds} beds up front. Centrecorp has a 130-bed quote open.`, 'paid / quote'],
    ['Repayable finance', 'SEFA and White Box, for equipment and working capital, after the measured run. Borrower to be settled.', 'target'],
  ];
  ins.forEach(([t, d, l], i) => {
    const y = y2 + i * (ih + gap);
    b += panel(inX, y, inW, ih, { t, b: d, tsize: 15, bsize: 11.5 });
    b += chip(inX + inW - 18 - chipWidth(l), y + 20, l, { fill: chipFill(l) });
    b += arrow(inX + inW + 8, y + ih / 2, 596, y + ih / 2);
  });
  const hx = 606, hw = 430, hy = y2, hh = 4 * ih + 3 * gap;
  b += box(hx, hy, hw, hh, { fill: C.white, stroke: C.terra, sw: 2.5 });
  b += kicker(hx + 20, hy + 30, 'Goods on Country holds the work');
  b += para(hx + 20, hy + 62, 'One home for the work', { size: 22, width: hw - 40, font: F.display, weight: 600 }).svg;
  const holds = [
    'The board governs purpose, shared assets, appointments and reinvestment. Directors: Kristy Bloomfield, Audrey Deemal, Jeremy Donovan. Indigenous-led. Ownership stays a pathway.',
    'It holds the products, IP, contracts, making, sales, delivery, capital, register and evidence.',
    'It buys the beds, agrees the rules with each community, runs the measured run, and reports.',
    'It repays any equipment debt from its own margin on buyer orders. Never from a community pool. No equity is sold.',
  ];
  let hyy = hy + 92;
  for (const h of holds) {
    const p = para(hx + 20, hyy, h, { size: 13.5, width: hw - 40, lh: 1.4 });
    b += p.svg;
    hyy += p.height + 10;
  }
  const cx = 1100, cw = 430;
  b += arrow(hx + hw + 8, hy + hh / 2, cx - 10, hy + hh / 2);
  b += box(cx, hy, cw, hh, { fill: C.sage, stroke: C.sage });
  b += kicker(cx + 20, hy + 30, `${PROGRAM.pools} community partners`);
  b += para(cx + 20, hy + 62, 'Independent organisations, not subsidiaries', { size: 20, width: cw - 40, font: F.display, weight: 600, lh: 1.2 }).svg;
  const cs = [
    `Each holds a pool of ${POOL.beds} beds under rules agreed before any bed moves: allocation, sales money, resale, paid work and stock.`,
    'Each decides what is given, what is sold, who is paid and what comes next. Sales money stays local.',
    `No community is named beside a pool until it has seen the design. Nobody has been promised ${POOL.beds} beds.`,
  ];
  let cyy = hy + 122;
  for (const c of cs) {
    const p = para(cx + 20, cyy, c, { size: 13.5, width: cw - 40, lh: 1.4 });
    b += p.svg;
    cyy += p.height + 10;
  }
  for (let i = 0; i < PROGRAM.pools; i++) b += box(cx + 20 + i * 40, hy + hh - 44, 30, 30, { fill: C.white, stroke: C.terra, sw: 2 });
  b += text(cx + 20 + PROGRAM.pools * 40 + 6, hy + hh - 23, `× ${POOL.beds} beds each`, { size: 12, font: F.mono, fill: C.mute });

  return frame({
    page: 'Form Q2, Q3, Q8. Recommended route, subject to Social Impact Hub',
    title: 'The entity, and how the money moves',
    sub: 'Three entities in a dated line, one home for the work, and five community partners who make the local decisions. Every external dollar lands in the charity.',
    body: b,
    footer: `A Kind Tractor Ltd (ABN 73 669 029 341) is dormant and has no role. The REAL Innovation Fund grant (about $2M, DEWR) is Oonchiumpa's, related and disclosed, not a Goods line. Fallback: ${ENTITY_ROUTE.fallback.applicant} applies, and the answer to Q8 rests on the inter-entity agreement, which is not yet signed.`,
  });
}

// ---------------------------------------------------------------------------
// 02 The unit: one bed, four things, any amount

export function theUnit(): string {
  let b = '';
  const lx = MX, ly = 200, lw = 560, lh = 560;
  b += box(lx, ly, lw, lh, { fill: C.white, stroke: C.terra, sw: 2.5 });
  b += kicker(lx + 24, ly + 34, 'The unit');
  b += text(lx + 24, ly + 92, `One bed, ${aud(BED_PRICE_AUD)}`, { size: 44, font: F.display, weight: 600 });
  let uy = ly + 130;
  BED_UNIT.forEach((u, i) => {
    b += numberDot(lx + 40, uy + 2, i + 1, 14);
    b += text(lx + 68, uy + 7, u.title, { size: 19, font: F.display, weight: 600 });
    const p = para(lx + 68, uy + 32, u.body, { size: 13.5, width: lw - 110, lh: 1.4 });
    b += p.svg;
    b += chip(lx + 68, uy + 32 + p.height + 10, u.label, { fill: chipFill(u.label) });
    uy += 32 + p.height + 40;
  });

  const tx = 680, ty = 200, tw = 850;
  b += kicker(tx, ty + 14, 'The same ratio at any amount');
  const cols = ['Amount', 'Beds', 'Pools', 'Plastic', 'Local work', 'Stays local if all sold'];
  const cw = [150, 100, 100, 110, 150, 240];
  const what: Record<number, string> = {
    150_000: "one community's pool",
    [QBE_ASK.smaller.aud]: 'the smaller amount, Q7',
    [QBE_ASK.recommended.aud]: 'the ask, Q5',
    [PROGRAM.costAud]: 'the whole program',
  };
  let y = ty + 40;
  let x = tx;
  cols.forEach((c, i) => {
    b += text(x + 10, y + 18, c.toUpperCase(), { size: 11, font: F.mono, fill: C.mute, ls: 1 });
    x += cw[i];
  });
  y += 30;
  b += line(tx, y, tx + tw, y, C.ink, 1.5);
  SCALE_ROWS.forEach((r) => {
    const rh = 74;
    const isAsk = r.amountAud === QBE_ASK.recommended.aud;
    if (isAsk) b += box(tx, y + 2, tw, rh - 4, { fill: C.sand, stroke: C.terra, sw: 2, r: 4 });
    const cells = [aud(r.amountAud), num(r.beds), num(r.pools, 1), `${num(r.hdpeTonnes, 1)} t`, `${num(r.localHours)} h`, `up to ${aud(r.staysLocalIfAllSoldAud)}`];
    let xx = tx;
    cells.forEach((cell, i) => {
      b += text(xx + 10, y + 34, cell, { size: i === 0 ? 20 : 18, font: i === 0 ? F.display : F.body, weight: i === 0 ? 600 : 400 });
      xx += cw[i];
    });
    b += text(tx + 10, y + 58, what[r.amountAud] ?? '', { size: 12, font: F.mono, fill: isAsk ? C.terra : C.mute, ls: 0.5 });
    y += rh;
    b += line(tx, y, tx + tw, y);
  });
  const py = y + 30;
  b += box(tx, py, tw, 760 - py, { fill: C.sage, stroke: C.sage });
  b += kicker(tx + 20, py + 30, UNLOCK.title);
  b += para(tx + 20, py + 60, UNLOCK.body, { size: 14.5, width: tw - 40, lh: 1.45 }).svg;

  return frame({
    page: `Form Q5, Q6, Q7. Figures from bed-ratio.ts. The ask buys beds; ${aud(QBE_ASK.recommended.aud)} is ${QBE_ASK.recommended.beds}`,
    title: 'One bed, four things, any amount',
    sub: 'Every dollar buys beds. Every bed does four things. Any amount scales the same way, and every figure keeps its label.',
    body: b,
    footer: RATIO_GUARDRAIL,
  });
}

// ---------------------------------------------------------------------------
// 03 One catalyst, five loops

export function theLoop(): string {
  let b = '';
  const y1 = 190, h1 = 112;
  b += kicker(MX, y1 - 10, 'The catalyst, once');
  b += panel(MX, y1, 400, h1, { t: 'A funder backs the beds', b: `${aud(PROGRAM.costAud)} is the cost of ${num(PROGRAM.beds)} beds at ${aud(BED_PRICE_AUD)} each. Not sales, not community income.`, tsize: 17, bsize: 13 });
  b += arrow(478, y1 + h1 / 2, 590, y1 + h1 / 2);
  b += panel(600, y1, 400, h1, { t: 'The Goods on Country board holds the rules', b: 'Purpose, shared assets, appointments, reinvestment. Indigenous-led today; ownership stays a pathway.', tsize: 17, bsize: 13 });
  b += arrow(1008, y1 + h1 / 2, 1120, y1 + h1 / 2);
  b += panel(1130, y1, 400, h1, { t: `${PROGRAM.pools} community pools of ${POOL.beds} beds`, b: 'Each held by a community partner under rules agreed before any bed moves.', tsize: 17, bsize: 13 });
  b += path(`M1330,${y1 + h1 + 4} L1330,${y1 + h1 + 44} L1420,${y1 + h1 + 44}`, { end: false });
  b += text(1300, y1 + h1 + 48, `× ${PROGRAM.pools} into the loop`, { size: 12, font: F.mono, fill: C.terra, anchor: 'end' });

  const y2 = 372, h2 = 236;
  b += kicker(MX, y2 - 10, `One community loop, shown once, run ${PROGRAM.pools} times`);
  b += chainRow(
    LOOP_STEPS.map((s) => ({ title: s.title, body: s.body, label: s.label, labelFill: chipFill(s.label) })),
    { y: y2, h: h2, gap: 20, returnTo: 1, returnText: `${LOOP_RETURN.title}. ${LOOP_RETURN.body}` },
  );

  const y3 = 700, h3 = 92, gw3 = 16, gbw = (BODY_W - 3 * gw3) / 4;
  b += kicker(MX, y3 - 10, 'Four gates before the loop is real at a named site');
  LOOP_GATES.forEach((g, i) => {
    const x = MX + i * (gbw + gw3);
    b += panel(x, y3, gbw, h3, { t: g.title, b: g.body, fill: C.sand, stroke: C.sand, tsize: 16, bsize: 13 });
  });

  return frame({
    page: 'The model. Figures from community-loop.ts',
    title: 'One catalyst starts five loops a community controls',
    sub: 'The funder acts once. The board holds the rules. Each community decides what is given, what is sold, who is paid and what the sales money builds next.',
    body: b,
    footer: `${PROGRAM.honesty} Gross sales are gross: only sold beds create them, and nothing has been deducted.`,
  });
}

// ---------------------------------------------------------------------------
// 04 Capital with three jobs

export function threeJobs(): string {
  const poolLines = STACK.filter((l) => (l.job === 'pool' || l.job === 'demand') && l.status !== 'excluded' && !UNVERIFIED_LINE_IDS.includes(l.id));
  const blockLines = STACK.filter((l) => l.job === 'block');
  const debtLines = STACK.filter((l) => l.job === 'equipment');
  const bedsIfAll = poolLines.reduce((s, l) => s + bedsFunded(l), 0);
  const bedsAtSmaller = bedsIfAll - QBE_ASK.recommended.beds + QBE_ASK.smaller.beds;
  const debtTotal = debtLines.reduce((s, l) => s + (l.amountAud ?? 0), 0);
  const bedsPerYearToRepay = Math.round(debtTotal / STAYS_PRESSED_AUD / 3 / 10) * 10;

  const asLine = (l: StackLine) => ({
    name: l.id === 'alive' ? `ALIVE National Centre, ${l.beds} beds` : l.id === 'qbe' ? 'QBE Catalysing Impact, the ask' : l.funder.replace(' Charitable Foundation', ' Charitable Foundation').replace(' Family Foundation, three years', ''),
    amount: aud(l.amountAud ?? 0),
    status: statusWord(l.status),
  });

  const y = 200, h = 470;
  let b = columns(
    [
      {
        k: 'Money that buys beds',
        t: 'Gifts and purchases that buy beds into pools',
        lines: poolLines.map(asLine),
        note: `If every line lands, the thousand is covered with room to spare (${num(bedsIfAll)}). At ${aud(QBE_ASK.smaller.aud)} from QBE the count is ${num(bedsAtSmaller)} and the last pool waits.`,
        lead: true,
      },
      {
        k: 'Money that runs the organisation',
        t: "Three years of support, the organisation's resilience",
        lines: blockLines.map((l) => ({ name: `${l.funder}, three years`, amount: aud(l.amountAud ?? 0), status: statusWord(l.status) })),
        note: `${THE_BLOCK.line} Bed money never funds this. Katie Norman named the resilience of organisations as the reason for the invitation. Recommended: the organisation, not beds. Ben has not yet ruled.`,
      },
      {
        k: 'Money we borrow for the plants',
        t: 'Equipment and working capital, once the cost is measured',
        lines: debtLines.map((l) => ({ name: l.funder, amount: aud(l.amountAud ?? 0), status: statusWord(l.status) })),
        note: `Cannot be written today: the pressed cost is modelled and the borrower is unsettled. Repaid from Goods on Country's margin on buyer orders, never from a community's pool. At the pressed margin (about ${aud(STAYS_PRESSED_AUD)}, modelled) ${aud(debtTotal)} needs about ${num(bedsPerYearToRepay)} buyer-bought beds a year for three years; at the kit margin (about ${aud(STAYS_KIT_AUD)}) it cannot be repaid.`,
      },
    ],
    { y, h },
  );
  b += band(y + h + 24, 96, 'The measured cost, and it comes with the first pool', 'The first fifty beds go through our own press and get costed properly: plastic per bed, press time and power, CNC hours, operator hours, scrap. That gives a measured cost for a locally made bed, the number every lender has asked for and nobody has. The rules with each community are agreed before its beds move.', { size: 14 });

  return frame({
    page: 'Form Q14, Q18. Figures from raise-stack.ts',
    title: 'Capital with three jobs',
    sub: 'Philanthropy buys the beds and runs the organisation. Debt buys the machines and is repaid by buyers. Communities keep what their pools earn. Nobody is buying shares.',
    body: b,
    footer: `${aud(SIGNED_TOTAL_AUD)} is signed today, and it is stated first. ${QBE_ASK.framing} Two lines on Ben's note, FRRR Palm $20K and Luke EV Fleet $20K, have no second source and are not summed.`,
  });
}

// ---------------------------------------------------------------------------
// 05 Who decides what

export function whoDecides(): string {
  let b = layers(
    [
      { k: 'Layer 1, governs', t: 'An Indigenous-led board', d: 'Purpose, shared assets, appointments and reinvestment. Directors of The Butterfly Movement Ltd: Kristy Bloomfield, Audrey Deemal and Jeremy Donovan; Kristy and Audrey appointed June and July 2026. The stated aim is full Indigenous directorship. The chair will be an Aboriginal director.', stroke: C.terra },
      { k: 'Layer 2, holds', t: 'Goods on Country', d: 'The charity, the brand, the product system, the IP, fundraising, shared services, the register and the evidence. It agrees the rules with each community, buys the beds, runs the measured run, and reports once against one set of numbers.' },
      { k: 'Layer 3, decides', t: 'Each community partner', d: 'Allocation, local sales, local work, where the sales money goes, and whether and when to move toward production. Independent local decision-makers, not departments inside the charity.', fill: C.sage, stroke: C.sage },
    ],
    { y: 200 },
  );
  const rx = 1110, rw = 420;
  b += box(rx, 200, rw, 478, { fill: C.sand, stroke: C.sand });
  b += kicker(rx + 20, 232, 'The test that lets the ownership claim fail');
  b += para(rx + 20, 266, 'Month six, four questions', { size: 22, width: rw - 40, font: F.display, weight: 600 }).svg;
  let qy = 316;
  MONTH_SIX_QUESTIONS.forEach((q, i) => {
    b += text(rx + 20, qy, `${i + 1}.  ${q}`, { size: 14.5 });
    qy += 30;
  });
  b += para(rx + 20, qy + 10, 'Partial counts as no. Ownership stays a pathway wherever it is not legally complete, and no surface says otherwise.', { size: 13, width: rw - 40, lh: 1.4, fill: C.mute }).svg;
  b += line(rx + 20, qy + 70, rx + rw - 20, qy + 70);
  b += kicker(rx + 20, qy + 100, 'Alongside, advice not authority');
  b += para(rx + 20, qy + 126, 'An eleven-member advisory committee meets monthly. It gives challenge and openings. It holds no fiduciary authority, and is never called a board.', { size: 12.5, width: rw - 40, lh: 1.4 }).svg;

  return frame({
    page: 'Form Q19, Q22. Governance, from the 26 August deck brief and CONTEXT.md',
    title: 'Who decides what',
    sub: 'One shared system. Local decisions stay local. Shown as three layers, never as three organisations in a row and never as a tree with communities beneath the charity.',
    body: b,
    footer: 'Status language that holds on every surface: Indigenous-led today; two Indigenous directors appointed; the aim is full Indigenous directorship; ownership remains a pathway. No Supply Nation, IPP, IBA or First Australians Capital eligibility is inferred from board composition alone.',
  });
}

// ---------------------------------------------------------------------------
// 06 The catalytic chain

export function theChain(): string {
  const tfff = lineById('tfff');
  const bmdf = lineById('bmdf');
  const sefa = lineById('sefa');
  const wb = lineById('white-box');
  const alive = lineById('alive');
  const links = [
    { title: "QBE's beds go in first", body: `${QBE_ASK.recommended.beds} beds into the first two communities. The first fifty go through our own press and get costed, so the cost of a locally made bed is measured.`, label: `the ask, ${aud(QBE_ASK.recommended.aud)}`, lead: true },
    { title: 'The first pools give the lenders something to read', body: `Communities selling beds under signed rules, a cost per bed, buyer paper. The modelled ${aud(PRESSED_COST_AUD)} pressed-path cost becomes a measured one.`, label: 'follows link 1' },
    { title: 'Three foundations have already asked us to apply', body: `Tim Fairfax ${aud(tfff.amountAud ?? 0)} over three years (due 9 Oct). Brian M. Davis up to ${aud(bmdf.amountAud ?? 0)} (due 25 Sep). Snow, catch-up booked. Minderoo and Dusseldorp in conversation.`, label: `${aud(SIGNED_TOTAL_AUD)} signed today` },
    { title: 'Then the plant money', body: `SEFA ${aud(sefa.amountAud ?? 0)} and White Box ${aud(wb.amountAud ?? 0)} for equipment and working capital, once the cost is measured and the borrower is settled.`, label: 'after link 2' },
    { title: 'Buyers are already paying', body: `ALIVE National Centre bought ${alive.beds} beds up front (${aud(alive.amountAud ?? 0)}, paid). Centrecorp has 130 on quote, waiting on community feedback. More than 200 requests each in Tennant Creek and Mparntwe.`, label: 'verified purchase' },
  ];
  let b = chainRow(links, { y: 200, h: 400, gap: 18, tsize: 17, bsize: 13.5 });
  b += band(626, 130, 'The test of catalytic, as CONTEXT.md defines it: what remains after the first spend', 'After this money is spent, five communities hold beds, paid assembly and delivery work, sales money where they chose to sell, and the right to decide the next step. The lenders hold a measured cost, so the plants can be financed.');

  return frame({
    page: 'Form Q14, Q18. Leverage is the metric the program publishes: 3.7x in 2025',
    title: 'How the grant is catalytic: a chain, with a condition on every link',
    sub: 'Stated as a chain, never as a total. QBE is never described as doubling, triggering or guaranteeing anything.',
    body: b,
    footer: 'Statuses from raise-stack.ts: invited means a written invitation to apply for a named amount with a callable contact; ask made means an ask is with the funder and no written amount is back; target means our number and nothing from the funder yet; paid means money received and evidenced in Xero.',
  });
}

// ---------------------------------------------------------------------------
// 07 The calendar

export function theCalendar(): string {
  const b = timeline(
    CALENDAR.map((e, i) => ({
      date: e.date,
      when: e.when,
      what: e.what,
      dir: i % 2 === 0 ? 'up' : 'down',
      level: ([1, 1, 2, 2, 1, 1, 1, 2, 1, 2][i] ?? 1) as 1 | 2,
      big: e.big,
    })),
    { from: '2026-09-01', to: '2026-11-30', months: [['2026-09-01', 'September'], ['2026-10-01', 'October'], ['2026-11-01', 'November']] },
  );
  return frame({
    page: "Sourced dates: Jay Boolkin 24 Aug; Miranda Campbell 1 Sep; Katie Norman 31 Aug; Adam's invite 28 Aug",
    title: 'The calendar: three applications inside fourteen days',
    sub: 'One strategy, three cuts. QBE and Brian M. Davis close on the same Friday; Tim Fairfax two weeks later. All three want the same program described the same way.',
    body: b,
    footer: CALENDAR_FAULT,
  });
}

// ---------------------------------------------------------------------------
// 08 The snowball: where it goes if it works (new)

export function theSnowball(): string {
  let b = '';
  b += kicker(MX, 195, 'The four steps, as the founders say them');
  b += chainRow(
    SNOWBALL_STEPS.map((s, i) => ({ title: s.title, body: s.body, label: i < 2 ? 'target' : 'modelled', labelFill: chipFill(i < 2 ? 'target' : 'modelled') })),
    { y: 210, h: 200, gap: 20, returnTo: 0, returnText: 'Then the same again, and the washers. The money goes round inside the community.' },
  );
  // The direction, as three big figures
  const y = 500, h = 200, gap = 20, w = (BODY_W - 2 * gap) / 3;
  const figs: [string, string, string][] = [
    [`${SNOWBALL.plants} plants`, `${SNOWBALL.bedsPerWeekPerPlant} beds a week each`, 'Once five communities have sold their pools and started on a plant.'],
    [`about ${num(SNOWBALL_BEDS_PER_YEAR)} beds a year`, `${SNOWBALL.plants} × ${SNOWBALL.bedsPerWeekPerPlant} × ${SNOWBALL.weeksPerYear} weeks`, `About ${num((SNOWBALL_BEDS_PER_YEAR * 20) / 1000)} tonnes of plastic a year kept in use, at 20kg a bed.`],
    [`around ${K(SNOWBALL_MARGIN_PER_YEAR_AUD).replace('K', ',000,000').replace('$1,000,000', '$1 million')} a year`, `in margin, at about ${aud(SNOWBALL.marginPerBedProseAud)} a bed`, `The model says about ${aud(SNOWBALL.marginPerBedModelAud)} a bed pressed locally. Nobody has measured it. Communities reinvest what they make.`],
  ];
  figs.forEach(([big, small, body], i) => {
    const x = MX + i * (w + gap);
    b += box(x, y, w, h, { fill: i === 2 ? C.sand : C.white, stroke: i === 2 ? C.terra : C.line, sw: i === 2 ? 2 : 1.5 });
    b += text(x + 22, y + 58, big, { size: 30, font: F.display, weight: 600 });
    b += text(x + 22, y + 84, small, { size: 12, font: F.mono, fill: C.terra, ls: 1 });
    b += para(x + 22, y + 118, body, { size: 13.5, width: w - 44, lh: 1.42 }).svg;
    b += chip(x + 22, y + h - 18, 'target', { fill: chipFill('target') });
  });
  b += band(724, 92, 'The direction, said once', `${SNOWBALL.direction} ${SNOWBALL.honesty}`, { size: 14 });

  return frame({
    page: 'The crux, 3 September 2026. Figures from qbe-story.ts and community-loop.ts',
    title: 'Where it goes if it works',
    sub: 'Told as a snowball, never as a forecast. Every figure on this page is a target until a plant has run for a year.',
    body: b,
    footer: `One pool sold in full reaches the bottom of the ${FACILITY_BAND.publicPrice} plant range and no further. A bed pressed locally costs about ${aud(PRESSED_COST_AUD)} against ${aud(KIT_COST_AUD)} to buy in; that margin is modelled and the measured run proves it.`,
  });
}

// ---------------------------------------------------------------------------
// 09 Who buys (new): the question every room asks

export function whoBuys(): string {
  let b = '';
  // Left: the buyers we can name
  const lx = MX, ly = 195, lw = 760;
  b += kicker(lx, ly, 'Buyers we can name today');
  let y = ly + 20;
  BUYERS.forEach((buyer) => {
    const h = 96;
    b += box(lx, y, lw, h, { fill: buyer.label === 'verified' ? C.white : C.cream, stroke: buyer.label === 'verified' ? C.terra : C.line, sw: buyer.label === 'verified' ? 2 : 1.5 });
    b += text(lx + 20, y + 32, buyer.who, { size: 19, font: F.display, weight: 600 });
    b += para(lx + 20, y + 56, buyer.what, { size: 13, width: lw - 200, lh: 1.38 }).svg;
    b += chip(lx + lw - 20 - chipWidth(buyer.status), y + 30, buyer.status, { fill: chipFill(buyer.status) });
    b += chip(lx + lw - 20 - chipWidth(buyer.label), y + 56, buyer.label, { fill: chipFill(buyer.label) });
    y += h + 12;
  });
  // Right: the three doors and who sells
  const rx = 870, rw = 660;
  b += kicker(rx, ly, 'Three ways to back the work');
  let ry = ly + 20;
  THREE_DOORS.forEach((d, i) => {
    const h = 104;
    b += box(rx, ry, rw, h, { fill: C.white, stroke: C.line });
    b += numberDot(rx + 30, ry + 34, i + 1);
    b += text(rx + 56, ry + 40, d.who, { size: 18, font: F.display, weight: 600 });
    b += para(rx + 20, ry + 68, d.does, { size: 13, width: rw - 40, lh: 1.38 }).svg;
    ry += h + 12;
  });
  b += box(rx, ry + 4, rw, 120, { fill: C.sage, stroke: C.sage });
  b += kicker(rx + 20, ry + 34, 'Who sells the pool');
  b += para(rx + 20, ry + 60, 'Each community sells its own pool under its own rules, to whoever it chooses. Who is buying the sold beds is the first of the four gates, named per place before any bed moves.', { size: 13.5, width: rw - 40, lh: 1.4 }).svg;

  return frame({
    page: 'The question we get asked most. Sources: raise-stack.ts, QU-0014, the QBE page (Ben, 3 Sep)',
    title: 'Where are they selling?',
    sub: `Two buyers have paid or quoted. Two towns hold more than 200 requests each. From there, each community's pool sells under its own rules at ${aud(BED_PRICE_AUD)} a bed.`,
    body: b,
    footer: 'Requests are counted as stated by the founders on 3 September and are not yet tied to a request register; they carry the workpaper label until they are. No community is named beside a price. Which community sells first is agreed with that community, once it has seen the design.',
  });
}

// ---------------------------------------------------------------------------

export const QBE_DIAGRAMS: readonly QbeDiagram[] = [
  { id: 'the-unit', title: 'One bed, four things, any amount', chapter: 'bed', caption: 'The unit, and the same ratio at any amount. The highlighted row is the ask.', slide: '10C mX9er', svg: theUnit },
  { id: 'the-loop', title: 'One catalyst starts five loops a community controls', chapter: 'loop', caption: 'The catalyst row, the five-step loop shown once and run five times, the return arrow, and the four gates.', slide: '08C JCreO', svg: theLoop },
  { id: 'who-buys', title: 'Where are they selling?', chapter: 'buyers', caption: 'The buyers we can name, the three ways to back the work, and who sells the pool.', slide: '10A hJgxH', svg: whoBuys },
  { id: 'three-jobs', title: 'Capital with three jobs', chapter: 'money', caption: 'Three kinds of money, each with one job, and the measured cost beneath.', slide: '10 (from 08B Lnlxh)', svg: threeJobs },
  { id: 'the-chain', title: 'How the grant is catalytic', chapter: 'catalytic', caption: "What follows, in order, once QBE's beds go in first.", slide: 'Appendix: the chain', svg: theChain },
  { id: 'the-snowball', title: 'Where it goes if it works', chapter: 'snowball', caption: 'The four steps of the snowball and the direction, said once, as targets.', slide: '09B u09Eoy', svg: theSnowball },
  { id: 'who-decides', title: 'Who decides what', chapter: 'decides', caption: 'Three layers: the board governs, Goods on Country holds, each community decides. The month-six test beside them.', slide: '07 LhlJr', svg: whoDecides },
  { id: 'entity-and-money', title: 'The entity, and how the money moves', chapter: 'entity', caption: 'Three entities in a dated line, one home, five community partners. Recommended route, subject to Social Impact Hub.', slide: '07 LhlJr (footer)', svg: entityAndMoney },
  { id: 'the-calendar', title: 'The calendar', chapter: 'calendar', caption: 'Three applications inside fourteen days.', slide: 'none yet', svg: theCalendar },
];

export function diagramsForChapter(chapter: StoryChapterId): QbeDiagram[] {
  return QBE_DIAGRAMS.filter((d) => d.chapter === chapter);
}

export function diagramById(id: string): QbeDiagram {
  const found = QBE_DIAGRAMS.find((d) => d.id === id);
  if (!found) throw new Error(`Unknown diagram: ${id}`);
  return found;
}

// Kept exported so a script or test can reach the frame size.
export { W };
