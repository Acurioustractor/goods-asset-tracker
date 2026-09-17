/**
 * THE OWNERSHIP PATHWAY, DRAWN.
 *
 * Ben, 17 September 2026: this is the most important part of the page. Make it the thing that
 * shows what happens when you back Indigenous communities and let them lead.
 *
 * It was a card in a four-up grid, which is where the argument went to die. The problem with
 * saying "ownership is a pathway" in a sentence is that a reader cannot see how far along it we
 * are, so the sentence reads as either a promise or an excuse. Drawn, it reads as neither: two
 * rings closed, one open, and the open one is the whole reason for the ask.
 *
 * Built from the Goods kit, not from icons: one line weight in terracotta, paper behind it,
 * sage only where money moves, and dashed only where a thing has not happened. No people, no
 * houses, no glyphs. The words are live text so they can be read out and corrected.
 */

const LINE = '#A8643F';
const INK = '#2E2E2E';
const MUTED = '#6A5E54';
const SAGE = '#8B9D77';
const PAPER = '#FDF8F3';

interface Stage {
  n: string;
  title: string;
  state: string;
  detail: string;
  /** Open ring: this has not happened. */
  open?: boolean;
}

const STAGES: readonly Stage[] = [
  {
    n: '1',
    title: 'Sold in community',
    state: 'Happening',
    detail: 'A community organisation holds the beds, sells them and keeps the whole price. After costs it decides what happens next.',
  },
  {
    n: '2',
    title: 'Made in community',
    state: 'Once',
    detail: 'Forty beds for Maningrida were built at Gamardi by young people from the community. The pressing was still ours.',
  },
  {
    n: '3',
    title: 'Owned in community',
    state: 'Not yet',
    detail: 'A production site owned where it operates, on the Supply Nation 51 per cent path. No site has reached this.',
    open: true,
  },
];

export function OwnershipPath() {
  const cx = [160, 480, 800];
  const cy = 120;
  const r = 66;

  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 960 232"
        className="w-full"
        role="img"
        aria-label="Three stages: sold in community, happening. Made in community, once. Owned in community, not yet."
        style={{ backgroundColor: PAPER }}
      >
        {/* The road the beds travel. It stops where the third ring is still open. */}
        <line x1={cx[0] + r} y1={cy} x2={cx[1] - r} y2={cy} stroke={LINE} strokeWidth="2" />
        <line
          x1={cx[1] + r}
          y1={cy}
          x2={cx[2] - r}
          y2={cy}
          stroke={LINE}
          strokeWidth="2"
          strokeDasharray="7 7"
        />
        {STAGES.map((s, i) => (
          <g key={s.n}>
            <circle
              cx={cx[i]}
              cy={cy}
              r={r}
              fill="none"
              stroke={LINE}
              strokeWidth="2"
              strokeDasharray={s.open ? '7 7' : undefined}
            />
            <text
              x={cx[i]}
              y={cy - 10}
              textAnchor="middle"
              fontSize="13"
              letterSpacing="1.6"
              fill={MUTED}
              style={{ textTransform: 'uppercase' }}
            >
              {s.state}
            </text>
            <text x={cx[i]} y={cy + 20} textAnchor="middle" fontSize="19" fill={INK}>
              {s.title.split(' ')[0]}
            </text>
            <text x={cx[i]} y={cy + 42} textAnchor="middle" fontSize="19" fill={INK}>
              {s.title.split(' ').slice(1).join(' ')}
            </text>
          </g>
        ))}
        {/* The money that comes back to the first ring, which is the part that already works. */}
        <path
          d={`M ${cx[0]} ${cy + r} C ${cx[0] - 90} ${cy + r + 70}, ${cx[0] + 90} ${cy + r + 70}, ${cx[0]} ${cy + r}`}
          fill="none"
          stroke={SAGE}
          strokeWidth="2"
        />
        <text x={cx[0]} y={cy + r + 62} textAnchor="middle" fontSize="13" fill={SAGE}>
          the price stays here
        </text>
      </svg>
      <figcaption className="mt-6 grid gap-5 sm:grid-cols-3">
        {STAGES.map((s) => (
          <p key={s.n} className="m-0 text-[0.9375rem] leading-[1.7]" style={{ color: `${INK}cc` }}>
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: s.open ? LINE : SAGE }}>
              {s.state}
            </span>
            {s.detail}
          </p>
        ))}
      </figcaption>
    </figure>
  );
}
