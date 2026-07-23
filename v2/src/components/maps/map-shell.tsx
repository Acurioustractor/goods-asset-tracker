import type { ReactNode } from 'react';
import { MAP_H, MAP_STATES, MAP_W, PLANT, px, py, INK } from './map-geo';

export interface HeaderFigure {
  value: string;
  label: string;
}

/**
 * One frame for every map view. `chrome === 'off'` drops the app furniture
 * (nav, legend chrome, footnote links) and locks the page to a 1280x720 slide
 * box so a headless screenshot lands deck-ready with no Menu button, no search
 * box and no toggles.
 */
export function MapShell({
  title,
  standfirst,
  figures,
  chrome,
  legend,
  footnote,
  children,
}: {
  title: string;
  standfirst: string;
  figures: HeaderFigure[];
  chrome: boolean;
  legend?: ReactNode;
  footnote?: string;
  children: ReactNode;
}) {
  const frame = chrome
    ? 'min-h-screen w-full'
    : 'h-[720px] w-[1280px] overflow-hidden';

  return (
    <div className={`${frame} bg-[#FBF8F1] text-[#26201B]`}>
      <div className="flex h-full flex-col px-10 py-7">
        <header className="flex items-start justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="font-display text-[28px] font-bold leading-tight">{title}</h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#6E645A]">{standfirst}</p>
          </div>
          <div className="flex shrink-0 items-start gap-6">
            {figures.map((f) => (
              <div key={f.label} className="text-center">
                <div className="font-display text-[26px] font-bold leading-none text-[#B44D2B]">{f.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wide text-[#8A7F72]">{f.label}</div>
              </div>
            ))}
          </div>
        </header>

        <div className="relative mt-3 min-h-0 flex-1">
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-full w-full" role="img" aria-label={title}>
            <defs>
              <filter id="mapLandShadow" x="-4%" y="-4%" width="108%" height="108%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#26201B" floodOpacity="0.08" />
              </filter>
            </defs>
            <g filter="url(#mapLandShadow)">
              {MAP_STATES.map((s) => (
                <path key={s.name} d={s.d} fill={INK.land} stroke="none" />
              ))}
            </g>
            {MAP_STATES.map((s) => (
              <path key={`b-${s.name}`} d={s.d} fill="none" stroke={INK.landEdge} strokeWidth={0.6} strokeLinejoin="round" />
            ))}
            <g transform={`translate(${px(PLANT.lng)},${py(PLANT.lat)})`}>
              <rect x={-5.5} y={-5.5} width={11} height={11} rx={2.5} transform="rotate(45)" fill="#26201B" stroke="#FBF8F1" strokeWidth={2} />
              <text x={0} y={24} textAnchor="middle" fill="#6E645A" fontSize={10} fontStyle="italic" fontFamily="Georgia, serif">
                {PLANT.label}
              </text>
            </g>
            {children}
          </svg>
        </div>

        <footer className="mt-2 flex items-end justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#6E645A]">{legend}</div>
          <p className="shrink-0 text-[10px] text-[#A79C8C]">
            {footnote ? `${footnote} · ` : ''}Boundaries: ABS ASGS (CC-BY 4.0)
          </p>
        </footer>
      </div>
    </div>
  );
}

export function LegendSwatch({ children, mark }: { children: ReactNode; mark: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      {mark}
      {children}
    </span>
  );
}
