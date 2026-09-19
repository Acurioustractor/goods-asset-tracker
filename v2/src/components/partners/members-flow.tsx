/**
 * THE FLOW. One drawing for the board, the members, the company behind them and the loop.
 *
 * Ben, 18 September 2026: the table drawing was confusing, so this is the plainest shape there
 * is. Three boxes left to right. The charity, with what it gives every member. A member
 * organisation, with what it does. Its community, with the four things that adds to. One
 * line loops back underneath: the shared story, which is what brings the next member. Behind
 * the middle box are two dashed boxes, because the whole point is that there are more of them,
 * and the count under it comes from the same ten-year model as the drawing above.
 *
 * Second pass, same morning: the text fits the boxes now (every line under 36 characters at
 * this width), the titles are set in the page's display face, the eyebrows are the page's rust
 * small caps, the two money-and-plastic lines take the sage the visual system reserves for
 * them, and the loop is one unbroken line with its label under it.
 *
 * Kit rules: one terracotta line weight, paper behind, dashed only for what has not happened,
 * no people drawn.
 */

import { PAID_INVOICES } from '@/lib/data/paid-trade';
import { tenYearTotals } from '@/lib/data/ten-year-scale';
import { goodsBoard } from '@/lib/data/goods-board';

const LINE = '#A8643F';
const RUST = '#C45C3E';
const INK = '#2E2E2E';
const MUTED = '#6A5E54';
const FAINT = '#A2958A';
const WASH = '#F6E4DE';
const PAPER = '#FDF8F3';
const SAGE_INK = '#5E7A4C';
const DISPLAY = 'var(--font-display), Georgia, serif';

interface Line { text: string; sage?: boolean }

export function MembersFlow() {
  const today = new Set(PAID_INVOICES.map((i) => i.buyer)).size;
  const yearTen = tenYearTotals().enterprisesTrading;
  const directors = goodsBoard.length;
  const words = ['zero', 'one', 'two', 'three', 'four', 'five'][directors] ?? String(directors);

  const W = 1000;
  const H = 470;
  const top = 78;
  const h = 214;
  const boxW = 284;
  const gap = 46;
  const x1 = 40;
  const x2 = x1 + boxW + gap;
  const x3 = x2 + boxW + gap;
  const mid = top + h / 2;
  const loopY = top + h + 62;

  const Box = ({ x, eyebrow, title, sub, lines, dashedBehind = false }: {
    x: number; eyebrow: string; title: string; sub: string; lines: Line[]; dashedBehind?: boolean;
  }) => (
    <g>
      {dashedBehind && (
        <>
          <rect x={x + 14} y={top - 14} width={boxW} height={h} rx="6" fill="none" stroke={LINE} strokeWidth="2" strokeDasharray="6 6" />
          <rect x={x + 7} y={top - 7} width={boxW} height={h} rx="6" fill={PAPER} stroke={LINE} strokeWidth="2" strokeDasharray="6 6" />
        </>
      )}
      <text x={x} y={top - 26} fontSize="10" fontWeight="600" fill={RUST} letterSpacing="1.6">{eyebrow}</text>
      <rect x={x} y={top} width={boxW} height={h} rx="6" fill={WASH} stroke={LINE} strokeWidth="2" />
      <text x={x + 20} y={top + 38} fontSize="20" fill={INK} fontFamily={DISPLAY}>{title}</text>
      <text x={x + 20} y={top + 58} fontSize="11" fill={FAINT}>{sub}</text>
      <line x1={x + 20} y1={top + 74} x2={x + boxW - 20} y2={top + 74} stroke={LINE} strokeWidth="1" opacity="0.5" />
      {lines.map((l, i) => (
        <text key={l.text} x={x + 20} y={top + 100 + i * 24} fontSize="13" fill={l.sage ? SAGE_INK : MUTED}>{l.text}</text>
      ))}
    </g>
  );

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`The charity gives every member design and research, the story told with consent, reporting a funder can check, and the market. A member organisation makes on Country with its own plastic, sells at the whole price, pays local people and decides what comes next. Its community gets beds off floors, plastic out of the tip, paid work and an enterprise that keeps what it earns. The shared story loops back and brings the next member. ${today} organisations today, ${yearTen} by year ten.`}
      >
        <defs>
          <marker id="mf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
          </marker>
        </defs>

        <Box
          x={x1}
          eyebrow="THE CHARITY GIVES EVERY MEMBER"
          title="Goods on Country, the charity"
          sub={`${words} Indigenous directors hold it`}
          lines={[
            { text: 'design and research, with' },
            { text: 'A Curious Tractor behind it' },
            { text: 'the story, told with consent' },
            { text: 'reporting a funder can check' },
            { text: 'the brand, the buyers, the funders' },
          ]}
        />
        <line x1={x1 + boxW + 3} y1={mid} x2={x2 - 7} y2={mid} stroke={LINE} strokeWidth="2" markerEnd="url(#mf-arrow)" />

        <Box
          x={x2}
          eyebrow="A MEMBER DOES"
          title="A community organisation"
          sub="proposed as a member of the charity"
          lines={[
            { text: 'makes on Country, with its own plastic', sage: true },
            { text: 'sells the beds, keeps the whole $750', sage: true },
            { text: 'pays local people for the build days' },
            { text: 'decides what comes next' },
          ]}
          dashedBehind
        />
        <text x={x2 + boxW / 2} y={top + h + 30} textAnchor="middle" fontSize="15" fill={INK} fontFamily={DISPLAY}>
          {`${today} today. ${yearTen} by year ten.`}
        </text>
        <line x1={x2 + boxW + 3} y1={mid} x2={x3 - 7} y2={mid} stroke={LINE} strokeWidth="2" markerEnd="url(#mf-arrow)" />

        <Box
          x={x3}
          eyebrow="ITS COMMUNITY GETS ALL FOUR"
          title="Its own community"
          sub="first, and then the next one"
          lines={[
            { text: 'beds off floors' },
            { text: 'plastic out of the tip', sage: true },
            { text: 'paid work' },
            { text: 'an enterprise that keeps what it earns', sage: true },
          ]}
        />

        {/* The loop back, one unbroken line, the label under it */}
        <path
          d={`M ${x3 + boxW / 2} ${top + h} L ${x3 + boxW / 2} ${loopY} L ${x1 + boxW / 2} ${loopY} L ${x1 + boxW / 2} ${top + h + 8}`}
          fill="none"
          stroke={LINE}
          strokeWidth="2"
          markerEnd="url(#mf-arrow)"
        />
        <circle cx={W / 2} cy={loopY} r="5" fill={RUST} />
        <text x={W / 2} y={loopY + 26} textAnchor="middle" fontSize="14" fill={INK} fontFamily={DISPLAY}>The shared story</text>
        <text x={W / 2} y={loopY + 44} textAnchor="middle" fontSize="11" fill={MUTED}>voices, films and case studies, with consent. It brings the next buyer, the next funder and the next member.</text>
      </svg>
    </figure>
  );
}
