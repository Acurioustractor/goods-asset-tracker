'use client';

/**
 * Chapter 15, where each dollar goes, as three lanes you can read left to right: what the money is,
 * what it buys, where it ends up. As the chapter comes into view each lane's amount counts up and
 * its lines draw across one after the other, then keep a slow dash moving in the direction the
 * money travels. Below: the one line money never takes, the whole ask as one bar, and the $750 bed
 * two ways, with a switch between a community organisation selling it and Goods on Country
 * selling it. The switch plays once by itself and then belongs to the reader.
 */

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/components/pitch/use-in-view';
import type { MoneyLane } from '@/lib/data/money-lanes';

const SAGE = '#8B9D77';
const SAGE_INK = '#5E7A4C';
const CLAY = '#A8643F';

const money = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`;

function Counting({ to, on, delay = 0 }: { to: number; on: boolean; delay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(to);
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 1300));
      setN(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to, delay]);
  return <span className="tabular-nums">{money(n)}</span>;
}

/** A line between two lane blocks: across on wide screens, down on phones. */
function Flow({ on, delay, label, tone }: { on: boolean; delay: number; label: string; tone: 'sage' | 'loan' }) {
  const colour = tone === 'sage' ? SAGE : CLAY;
  const ink = tone === 'sage' ? SAGE_INK : CLAY;
  const dash = tone === 'loan' ? '10 8' : undefined;
  const draw = { strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 900ms cubic-bezier(.65,0,.35,1) ${delay}ms` };
  return (
    <div className="relative flex items-center justify-center py-2 lg:py-0">
      {/* Across */}
      <svg className="hidden h-10 w-full overflow-visible lg:block" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <mask id={`ml-across-${label.replace(/\W/g, '')}`}>
            <path d="M2 24 H112" stroke="#fff" strokeWidth="14" pathLength={1} style={draw} />
          </mask>
        </defs>
        <g mask={`url(#ml-across-${label.replace(/\W/g, '')})`}>
          <path d="M2 24 H108" stroke={colour} strokeWidth="3" strokeDasharray={dash} fill="none" vectorEffect="non-scaling-stroke" />
          <path d="M104 18 L114 24 L104 30" stroke={colour} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {on && tone === 'sage' && <path d="M2 24 H108" stroke="#FDF8F3" strokeWidth="1.5" strokeDasharray="2 18" fill="none" className="ml-march" vectorEffect="non-scaling-stroke" />}
        </g>
      </svg>
      {/* Down */}
      <svg className="h-12 w-10 overflow-visible lg:hidden" viewBox="0 0 40 48" aria-hidden="true">
        <defs>
          <mask id={`ml-down-${label.replace(/\W/g, '')}`}>
            <path d="M20 2 V46" stroke="#fff" strokeWidth="14" pathLength={1} style={draw} />
          </mask>
        </defs>
        <g mask={`url(#ml-down-${label.replace(/\W/g, '')})`}>
          <path d="M20 2 V40" stroke={colour} strokeWidth="3" strokeDasharray={dash} fill="none" />
          <path d="M14 36 L20 46 L26 36" stroke={colour} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <span
        className="absolute left-[calc(50%+1.75rem)] right-0 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] lg:left-1/2 lg:right-auto lg:top-0 lg:w-max lg:max-w-[11rem] lg:-translate-x-1/2 lg:-translate-y-1 lg:text-center"
        style={{ color: ink, opacity: on ? 1 : 0, transition: `opacity 500ms ease ${delay + 500}ms` }}
      >
        {label}
      </span>
    </div>
  );
}

function Block({ kicker, title, line, tone, on, delay }: { kicker: string; title: string; line: string; tone: 'sage' | 'loan'; on: boolean; delay: number }) {
  return (
    <div className="ml-rise" style={{ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(14px)', transitionDelay: `${delay}ms` }}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: tone === 'sage' ? SAGE_INK : CLAY }}>{kicker}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold leading-tight text-goods-ink">{title}</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-[#4a4741]">{line}</p>
    </div>
  );
}

export function MoneyLanesView({
  lanes,
  never,
  total,
  split,
  price,
  ways,
  named,
}: {
  lanes: readonly MoneyLane[];
  never: { title: string; line: string };
  total: { label: string; amount: number; parts: readonly { id: string; label: string; amount: number; tone: string }[] };
  split: readonly { id: string; label: string; aud: number; colour: string }[];
  price: number;
  ways: { org: { label: string; line: string }; goods: { label: string; line: string } };
  /** Print funder names: the QBE door only. */
  named: boolean;
}) {
  const [lanesRef, lanesOn] = useInView<HTMLDivElement>(0.2);
  const [bedRef, bedOn] = useInView<HTMLDivElement>(0.4);
  const [way, setWay] = useState<'org' | 'goods'>('org');
  const touched = useRef(false);

  // Play the switch once: the organisation's whole $750, then Goods on Country's split.
  useEffect(() => {
    if (!bedOn || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setTimeout(() => {
      if (!touched.current) setWay('goods');
    }, 2200);
    return () => window.clearTimeout(t);
  }, [bedOn]);

  const choose = (w: 'org' | 'goods') => {
    touched.current = true;
    setWay(w);
  };

  const toneBg = (tone: string) => (tone === 'sage' ? 'bg-[#8B9D77]' : tone === 'terracotta' ? 'bg-[#C45C3E]' : 'bg-goods-ink');

  return (
    <div>
      <style>{`
        .ml-rise{transition:opacity 600ms ease,transform 700ms cubic-bezier(.2,.7,.2,1)}
        @keyframes ml-march{to{stroke-dashoffset:-40}}
        .ml-march{animation:ml-march 1.4s linear infinite}
        @media (prefers-reduced-motion: reduce){.ml-rise,.ml-bar{transition:none!important}.ml-march{animation:none!important}}
      `}</style>

      {/* The three lanes */}
      <div ref={lanesRef} className="mt-12 space-y-5">
        {lanes.map((lane, i) => {
          const base = i * 420;
          return (
            <section
              key={lane.id}
              aria-label={`${lane.source.kicker}: ${money(lane.source.amount)}. ${lane.buys.title}. ${lane.endsUp.title}.`}
              className={`grid items-center gap-1 rounded-[24px] border bg-white p-6 md:p-8 lg:grid-cols-[1fr_120px_1.15fr_120px_1.15fr] lg:gap-4 ${lane.tone === 'loan' ? 'border-dashed border-[#A8643F]/50' : 'border-[#E6DFD1]'}`}
            >
              <div className="ml-rise" style={{ opacity: lanesOn ? 1 : 0, transform: lanesOn ? 'none' : 'translateY(14px)', transitionDelay: `${base}ms` }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: lane.tone === 'sage' ? SAGE_INK : CLAY }}>{lane.source.kicker}</p>
                <p className="mt-1 font-display text-5xl font-semibold leading-none text-goods-ink md:text-6xl">
                  <Counting to={lane.source.amount} on={lanesOn} delay={base} />
                </p>
                {named && <p className="mt-2 text-[13px] leading-snug text-[#7a7363]">{lane.source.named}</p>}
              </div>
              <Flow on={lanesOn} delay={base + 350} label={lane.first} tone={lane.tone} />
              <Block kicker={lane.buys.kicker} title={lane.buys.title} line={lane.buys.line} tone={lane.tone} on={lanesOn} delay={base + 700} />
              <Flow on={lanesOn} delay={base + 1000} label={lane.second} tone={lane.tone} />
              <Block kicker={lane.endsUp.kicker} title={lane.endsUp.title} line={lane.endsUp.line} tone={lane.tone} on={lanesOn} delay={base + 1300} />
            </section>
          );
        })}

        {/* The line money never takes */}
        <div
          className="ml-rise flex flex-col gap-3 rounded-[24px] bg-goods-ink px-6 py-5 text-goods-cream md:flex-row md:items-center md:gap-6 md:px-8"
          style={{ opacity: lanesOn ? 1 : 0, transform: lanesOn ? 'none' : 'translateY(14px)', transitionDelay: `${lanes.length * 420 + 900}ms` }}
        >
          <svg className="h-6 w-28 flex-none" viewBox="0 0 112 24" aria-hidden="true">
            <path d="M4 12 H100" stroke="#E6DFD1" strokeWidth="2.5" strokeDasharray="6 6" />
            <path d="M94 6 L104 12 L94 18" stroke="#E6DFD1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M46 2 L66 22 M66 2 L46 22" stroke="#E07A5F" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E07A5F]">{never.title}</p>
          <p className="text-[15px] text-goods-cream/85">{never.line}</p>
        </div>

        {/* The whole ask */}
        <div className="ml-rise pt-4" style={{ opacity: lanesOn ? 1 : 0, transitionDelay: `${lanes.length * 420 + 1200}ms` }}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7363]">{total.label}</p>
            <p className="font-display text-3xl font-semibold text-goods-ink">{money(total.amount)}</p>
          </div>
          <div className="mt-3 flex h-4 w-full gap-1 overflow-hidden rounded-full" role="img" aria-label={total.parts.map((p) => `${p.label} ${money(p.amount)}`).join(', ')}>
            {total.parts.map((p, i) => (
              <span
                key={p.id}
                className={`ml-bar block h-full rounded-full ${toneBg(p.tone)}`}
                style={{ width: lanesOn ? `${(p.amount / total.amount) * 100}%` : '0%', transition: `width 1000ms cubic-bezier(.65,0,.35,1) ${lanes.length * 420 + 1300 + i * 180}ms` }}
              />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#4a4741]">
            {total.parts.map((p) => (
              <li key={p.id} className="inline-flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${toneBg(p.tone)}`} />
                {p.label} {money(p.amount)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The $750 bed, two ways */}
      <div ref={bedRef} className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-3xl font-semibold leading-tight md:text-4xl">Where the {money(price)} goes</h3>
          <div role="radiogroup" aria-label="Who sells the bed" className="grid w-full grid-cols-2 gap-1 rounded-2xl border border-[#d9d0bf] bg-white p-1 sm:inline-flex sm:w-auto sm:rounded-full">
            {(['org', 'goods'] as const).map((w) => (
              <button
                key={w}
                type="button"
                role="radio"
                aria-checked={way === w}
                onClick={() => choose(w)}
                className={`min-h-11 rounded-xl px-3 py-1.5 text-[13px] font-semibold leading-tight transition-colors sm:rounded-full sm:px-4 sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta ${way === w ? 'bg-goods-ink text-goods-cream' : 'text-[#4a4741] hover:text-goods-ink'}`}
              >
                {ways[w].label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-lg text-[#4a4741]" aria-live="polite">{ways[way].line}</p>

        <div className="mt-6 flex h-16 w-full overflow-hidden rounded-[18px] bg-[#efe9dd]" role="img" aria-label={way === 'org' ? `${money(price)} to the community organisation` : split.map((s) => `${s.label} ${money(s.aud)}`).join(', ')}>
          {split.map((s, i) => {
            const last = i === split.length - 1;
            const width = !bedOn ? 0 : way === 'org' ? (last ? 100 : 0) : (s.aud / price) * 100;
            const colour = way === 'org' && last ? SAGE_INK : s.colour;
            return (
              <div
                key={s.id}
                className="ml-bar flex h-full items-center justify-center overflow-hidden whitespace-nowrap font-display text-sm font-semibold text-white sm:text-lg"
                style={{ width: `${width}%`, backgroundColor: colour, transition: `width 900ms cubic-bezier(.65,0,.35,1) ${way === 'goods' ? i * 120 : 0}ms, background-color 600ms ease` }}
              >
                {width > 9 && (way === "org" && last ? (<><span className="sm:hidden">{money(price)} stays in community</span><span className="hidden sm:inline">{money(price)} stays with the community organisation</span></>) : money(s.aud))}
              </div>
            );
          })}
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" style={{ opacity: way === 'goods' ? 1 : 0.35, transition: 'opacity 500ms ease' }}>
          {split.map((s) => (
            <li key={s.id} className="flex items-start gap-2.5 text-[15px] text-[#4a4741]">
              <span className="mt-1.5 inline-block h-3 w-3 flex-none rounded-sm" style={{ backgroundColor: s.colour }} />
              <span>
                <span className="font-semibold text-goods-ink">{s.label}</span> {money(s.aud)}{s.id === "making" && <span className="ml-1.5 text-xs uppercase tracking-wide text-[#7a7363]">provisional</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
