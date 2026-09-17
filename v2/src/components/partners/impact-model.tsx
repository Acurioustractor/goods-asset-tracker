/**
 * FOUR THINGS STANDING ON ONE.
 *
 * Ben, 17 September 2026: show the four areas, and then how Indigenous ownership and leadership
 * supports it all.
 *
 * Earlier versions put all five side by side, which was wrong about the relationship. Health,
 * the plastic, paid work and enterprise are not peers of Indigenous ownership; they rest on it.
 * A board of Indigenous directors is why there is a purpose to hold and a decision to make, and
 * a community organisation keeping the whole price is why the trade is worth having. So the four
 * sit on a base, and the base is the fifth.
 *
 * The base is drawn in two halves because only one of them is done. Leadership is solid: three
 * Indigenous directors, a charity, an ABN. Ownership of the making is dashed, because no site is
 * owned where it stands. Nothing about that is softened by where it sits on the page: it holds
 * the other four up and it is the half that is still open.
 *
 * Kit rules: one terracotta line weight, paper behind, dashed only for what has not happened.
 */

import type { Theme } from '@/lib/data/snow-partnership';

const LINE = '#A8643F';
const INK = '#2E2E2E';
const MUTED = '#6A5E54';
const FAINT = '#A2958A';
const WASH = '#F6E4DE';

export function ImpactModel({ themes }: { themes: readonly Theme[] }) {
  const above = themes.filter((t) => t.id !== 'ownership');
  const base = themes.find((t) => t.id === 'ownership');
  if (above.length === 0 || !base) return null;

  const W = 1000;
  const H = 360;
  const M = 40;
  const gap = 18;
  const colW = (W - M * 2 - gap * (above.length - 1)) / above.length;
  const colTop = 16;
  const colH = 150;
  const baseTop = 232;
  const baseH = 68;
  // Leadership is done and ownership is not, so the base is split where the truth splits it.
  const solidW = (W - M * 2) * 0.55;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`${above.map((t) => `${t.title}, ${t.figure.value} ${t.figure.unit}`).join('. ')}. All four rest on Indigenous ownership and leadership, which is ${base.figure.value} ${base.figure.unit}.`}
      >
        {above.map((t, i) => {
          const x = M + i * (colW + gap);
          return (
            <g key={t.id}>
              <rect x={x} y={colTop} width={colW} height={colH} rx="6" fill="none" stroke={LINE} strokeWidth="2" />
              <text x={x + colW / 2} y={colTop + 62} textAnchor="middle" fontSize="34" fill={INK}>
                {t.figure.value}
              </text>
              <text x={x + colW / 2} y={colTop + 88} textAnchor="middle" fontSize="12" fill={FAINT}>
                {t.figure.unit}
              </text>
              <text x={x + colW / 2} y={colTop + 122} textAnchor="middle" fontSize="16" fill={INK}>
                {t.title}
              </text>
              {/* Each one standing on the base, so the drawing has to be read downwards. */}
              <line x1={x + colW / 2} y1={colTop + colH} x2={x + colW / 2} y2={baseTop} stroke={LINE} strokeWidth="2" />
            </g>
          );
        })}

        <rect x={M} y={baseTop} width={solidW} height={baseH} fill={WASH} stroke={LINE} strokeWidth="2" />
        <rect
          x={M + solidW}
          y={baseTop}
          width={W - M * 2 - solidW}
          height={baseH}
          fill="none"
          stroke={LINE}
          strokeWidth="2"
          strokeDasharray="7 7"
        />
        <text x={M + solidW / 2} y={baseTop + 30} textAnchor="middle" fontSize="17" fill={INK}>
          Indigenous leadership
        </text>
        <text x={M + solidW / 2} y={baseTop + 52} textAnchor="middle" fontSize="12" fill={MUTED}>
          three Indigenous directors hold the purpose, the assets and the decisions
        </text>
        <text x={M + solidW + (W - M * 2 - solidW) / 2} y={baseTop + 30} textAnchor="middle" fontSize="17" fill={INK}>
          Indigenous ownership
        </text>
        <text x={M + solidW + (W - M * 2 - solidW) / 2} y={baseTop + 52} textAnchor="middle" fontSize="12" fill={MUTED}>
          {base.figure.value} {base.figure.unit}
        </text>
        <text x={W / 2} y={baseTop + baseH + 30} textAnchor="middle" fontSize="12" fill={FAINT}>
          Everything above rests on this. Half of it is done.
        </text>
      </svg>

      <figcaption className="mt-10 grid gap-6 sm:grid-cols-4">
        {above.map((t) => (
          <p key={t.id} className="m-0 text-[0.875rem] leading-[1.65]" style={{ color: MUTED }}>
            <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: LINE }}>
              Not shown
            </span>
            {t.limit}
          </p>
        ))}
      </figcaption>
      <p className="mt-6 max-w-[62ch] text-[0.875rem] leading-[1.65]" style={{ color: MUTED }}>
        <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: LINE }}>
          Not shown
        </span>
        {base.limit}
      </p>
    </figure>
  );
}
