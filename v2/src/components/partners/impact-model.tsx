/**
 * ONE MODEL FOR THE WHOLE ARGUMENT.
 *
 * Ben, 17 September 2026: this whole section should be one model, simple and powerful, so you
 * can see the impact.
 *
 * It was two chapters. Five theme cards each carrying a paragraph of prose and a shown-and-not-
 * shown pair, then a separate ownership chapter with its own drawing. Reading it took five
 * minutes and the shape of the argument was buried in the words.
 *
 * The shape is simply this: four things are measured and the fifth is zero. So the five sit on
 * one line, each holding its own number, and the fifth ring is drawn open because nothing has
 * closed it yet. The limit stays under each number, because a limit printed somewhere else
 * reads as a disclaimer, and because the open ring is the honest part of the ask.
 *
 * Drawn from the Goods kit: one terracotta line weight, paper behind it, dashed only where a
 * thing has not happened. No icons and no second colour doing decorative work.
 */

import type { Theme } from '@/lib/data/snow-partnership';

const LINE = '#A8643F';
const INK = '#2E2E2E';
const MUTED = '#6A5E54';
const FAINT = '#A2958A';

export function ImpactModel({ themes }: { themes: readonly Theme[] }) {
  if (themes.length === 0) return null;
  const W = 1000;
  const H = 188;
  const r = 52;
  const gap = (W - 2 * 80) / (themes.length - 1);
  const cx = themes.map((_, i) => 80 + i * gap);
  const cy = 86;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={themes.map((t) => `${t.title}: ${t.figure.value} ${t.figure.unit}`).join('. ')}
      >
        {themes.slice(0, -1).map((t, i) => {
          // The last leg is dashed: nothing has travelled it. An open ring is what "not yet" looks
          // like when you refuse to draw it as a plan.
          const last = i === themes.length - 2;
          return (
            <line
              key={t.id}
              x1={cx[i] + r}
              y1={cy}
              x2={cx[i + 1] - r}
              y2={cy}
              stroke={LINE}
              strokeWidth="2"
              strokeDasharray={last ? '7 7' : undefined}
            />
          );
        })}
        {themes.map((t, i) => {
          const open = t.figure.value === '0';
          return (
            <g key={t.id}>
              <circle
                cx={cx[i]}
                cy={cy}
                r={r}
                fill="none"
                stroke={LINE}
                strokeWidth="2"
                strokeDasharray={open ? '7 7' : undefined}
              />
              <text x={cx[i]} y={cy + 9} textAnchor="middle" fontSize="27" fill={INK}>
                {t.figure.value}
              </text>
              <text x={cx[i]} y={cy + r + 26} textAnchor="middle" fontSize="15" fill={INK}>
                {t.title}
              </text>
              <text x={cx[i]} y={cy + r + 44} textAnchor="middle" fontSize="12" fill={FAINT}>
                {t.figure.unit}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-8 grid gap-6 sm:grid-cols-5">
        {themes.map((t) => (
          <p key={t.id} className="m-0 text-[0.875rem] leading-[1.65]" style={{ color: MUTED }}>
            <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: LINE }}>
              Not shown
            </span>
            {t.limit}
          </p>
        ))}
      </figcaption>
    </figure>
  );
}
