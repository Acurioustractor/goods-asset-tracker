'use client';

/**
 * The model, built as a loop. A stage pins to the top of the screen and the placemat's circle builds
 * one station at a time as the page scrolls. Each station springs out of the ring's edge and
 * snaps into its place with a pulse, the arc that feeds it draws itself in and then keeps moving,
 * money the raise pays clips onto its station, and the centre of the ring crossfades to the
 * photograph or figure for that moment. The last step fills the centre with the placemat's words.
 *
 * Scroll position picks the step; everything else is CSS transitions on state, so the motion is
 * the browser's and a step is never half built. Reduced motion keeps the build and drops every
 * transition and loop. The whole A3 sheet opens from the last step, and "Read the model as a
 * list" prints every box and line as text.
 */

import { ChevronDown, ChevronUp, Expand, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LoopArc, LoopStation, LoopStep } from '@/lib/data/model-walkthrough';

const SIZE = 1100;
const C = SIZE / 2;
const RING = 300;
const CARD_R = 425;
const LABEL_R = 256;
const PHOTO_R = 185;
const TRIM = 7;
const STROKE = { goods: '#A8643F', sage: '#8B9D77', future: '#A8643F' } as const;
const INK_LABEL = { goods: '#A8643F', sage: '#5E7A4C', future: '#A8643F' } as const;

const rad = (deg: number) => (deg * Math.PI) / 180;
const at = (deg: number, r: number) => ({ x: C + r * Math.sin(rad(deg)), y: C - r * Math.cos(rad(deg)) });
const f = (n: number) => n.toFixed(1);

function arcPath(a0: number, a1: number, r: number, reverse = false) {
  const s = at(reverse ? a1 : a0, r);
  const e = at(reverse ? a0 : a1, r);
  return `M${f(s.x)} ${f(s.y)} A${r} ${r} 0 0 ${reverse ? 0 : 1} ${f(e.x)} ${f(e.y)}`;
}

const CORNERS = [
  { id: 'employment', x: 16, y: 16 },
  { id: 'enterprise', x: SIZE - 16 - 230, y: 16 },
  { id: 'recycling', x: 16, y: SIZE - 16 - 112 },
  { id: 'health', x: SIZE - 16 - 230, y: SIZE - 16 - 112 },
] as const;

export function ModelLoopBuild({
  steps,
  stations,
  arcs,
  counts,
  sheetSvg,
  items,
  arrows,
}: {
  steps: readonly LoopStep[];
  stations: readonly LoopStation[];
  arcs: readonly LoopArc[];
  counts: readonly { id: string; title: string; line: string }[];
  sheetSvg: string;
  items: readonly { id: string; title: string; line: string }[];
  arrows: readonly { from: string; to: string; label: string }[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [scale, setScale] = useState(0.5);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetClose = useRef<HTMLButtonElement>(null);

  const step = steps[active];
  const shown = useMemo(() => new Set(steps.slice(0, active + 1).flatMap((s) => s.adds)), [steps, active]);
  const drawn = useMemo(() => new Set<string>(steps.slice(0, active + 1).flatMap((s) => s.arcs)), [steps, active]);
  const countsOn = steps.slice(0, active + 1).some((s) => s.counts);
  const angleOf = useMemo(() => Object.fromEntries(stations.map((s) => [s.id, s.angle])), [stations]);

  // The step is the share of the ride scrolled so far.
  useEffect(() => {
    let raf = 0;
    const read = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const pinAt = 0;
      const travel = Math.max(1, wrap.offsetHeight - (window.innerHeight - pinAt));
      const p = Math.min(1, Math.max(0, (pinAt - wrap.getBoundingClientRect().top) / travel));
      const next = Math.min(steps.length - 1, Math.floor(p * steps.length));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [steps.length]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(entry.contentRect.width, entry.contentRect.height) / SIZE));
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetClose.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheetOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [sheetOpen]);

  const jump = useCallback(
    (i: number) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const pinAt = 0;
      const travel = Math.max(1, wrap.offsetHeight - (window.innerHeight - pinAt));
      const top = wrap.getBoundingClientRect().top + window.scrollY - pinAt;
      const target = Math.max(0, Math.min(steps.length - 1, i));
      window.scrollTo({ top: top + travel * ((target + 0.5) / steps.length), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    },
    [steps.length],
  );

  const centres = useMemo(() => {
    const seen = new Set<string>();
    return steps
      .map((s, i) => ({ i, c: s.centre, key: s.centre.kind === 'photo' ? s.centre.src : `${s.centre.kind}-${i}` }))
      .filter(({ key }) => (seen.has(key) ? false : (seen.add(key), true)));
  }, [steps]);
  const centreKey = step.centre.kind === 'photo' ? step.centre.src : `${step.centre.kind}-${active}`;

  return (
    <div className="lb">
      <style>{`
        .lb-card{transition:transform 780ms cubic-bezier(.34,1.56,.64,1),opacity 380ms ease}
        .lb-fade{transition:opacity 700ms ease,transform 900ms cubic-bezier(.2,.7,.2,1)}
        .lb-draw{transition:stroke-dashoffset 1100ms cubic-bezier(.65,0,.35,1)}
        @keyframes lb-pulse{from{transform:scale(.6);opacity:.55}to{transform:scale(2.4);opacity:0}}
        .lb-pulse{animation:lb-pulse 900ms ease-out 1 both}
        @keyframes lb-march{to{stroke-dashoffset:-58}}
        .lb-march{animation:lb-march 1.6s linear infinite}
        @keyframes lb-turn{to{transform:rotate(360deg)}}
        .lb-turn{animation:lb-turn 90s linear infinite;transform-origin:${C}px ${C}px}
        @keyframes lb-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .lb-rise{animation:lb-rise 520ms cubic-bezier(.2,.7,.2,1) both}
        @media (prefers-reduced-motion: reduce){.lb *{transition:none!important;animation:none!important}}
      `}</style>

      <div ref={wrapRef} className="relative" style={{ height: `calc(${steps.length} * 72svh + 100svh)` }}>
        {/* Right padding on wide screens keeps the ring clear of the chapter rail and its label. */}
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-[#FDF8F3] lg:flex-row lg:items-center lg:gap-6 lg:pl-10 lg:pr-48 xl:pl-16 xl:pr-60">
          {/* Narration */}
          <div aria-live="polite" className="order-2 flex min-h-0 flex-1 flex-col justify-start px-5 pb-6 pt-1 sm:justify-center sm:px-10 lg:order-1 lg:w-[400px] lg:flex-none lg:justify-center lg:p-0 xl:w-[440px]">
            {/* Phones: a thin progress bar in place of the step buttons. */}
            <div className="mb-3 flex gap-1 lg:hidden" aria-hidden="true">
              {steps.map((s, i) => (
                <span key={s.id} className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-[#A8643F]' : 'bg-[#e6dfd1]'}`} />
              ))}
            </div>
            <div key={step.id} className="lb-rise">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A8643F] lg:text-[11px]">{step.kicker}</p>
              <h3 className="mt-1.5 font-display text-[1.5rem] font-semibold leading-[1.08] tracking-[-0.01em] text-goods-ink text-balance sm:text-4xl lg:mt-3 lg:text-5xl">{step.title}</h3>
              <div className="mt-2 space-y-1.5 lg:mt-4 lg:space-y-3">
                {step.lines.map((line) => (
                  <p key={line} className="text-[14px] leading-snug text-[#4a4741] sm:text-[15px] sm:leading-relaxed lg:text-lg">{line}</p>
                ))}
              </div>
              {step.money && (
                <dl className="mt-3 grid grid-cols-3 gap-3 lg:mt-6 lg:gap-4">
                  {step.money.map((m, i) => (
                    <div key={m.label} className="lb-rise border-t-2 border-[#8B9D77] pt-2" style={{ animationDelay: `${120 + i * 110}ms` }}>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5E7A4C]">{m.label}</dt>
                      <dd className="mt-0.5 font-display text-xl font-semibold tabular-nums text-goods-ink lg:text-3xl">{m.amount}</dd>
                      <dd className="mt-1 hidden text-sm leading-snug text-[#5d574c] lg:block">{m.line}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            {/* Always here: open the whole model, or skip the build to its finished loop. */}
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-3 sm:mt-5 lg:mt-6">
              <button type="button" onClick={() => setSheetOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-goods-ink px-5 text-sm font-semibold text-goods-cream transition-colors hover:bg-goods-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta">
                <Expand className="h-4 w-4" aria-hidden="true" />
                See the whole model
              </button>
              {active < steps.length - 1 && (
                <button type="button" onClick={() => jump(steps.length - 1)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-goods-ink/25 px-5 text-sm font-semibold text-goods-ink transition-colors hover:border-goods-terracotta hover:text-goods-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta">
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  Skip to the finished loop
                </button>
              )}
            </div>
            <div className="mt-5 hidden items-center gap-3 lg:flex">
              <button type="button" onClick={() => jump(active - 1)} disabled={active === 0} className="rounded-full border border-[#d9d0bf] p-2 text-goods-ink hover:border-goods-ink disabled:opacity-30" aria-label="Previous step">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => jump(active + 1)} disabled={active === steps.length - 1} className="rounded-full border border-[#d9d0bf] p-2 text-goods-ink hover:border-goods-ink disabled:opacity-30" aria-label="Next step">
                <ChevronDown className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold tabular-nums text-[#7a7363]">{String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
              <div className="flex flex-1 gap-1" aria-hidden="true">
                {steps.map((s, i) => (
                  <span key={s.id} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-[#A8643F]' : 'bg-[#e6dfd1]'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* The loop */}
          <div ref={boxRef} className="relative order-1 h-[min(100vw,62svh)] w-full flex-none lg:order-2 lg:h-full lg:flex-1" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2" style={{ width: SIZE, height: SIZE, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 overflow-visible">
                <defs>
                  {(['goods', 'sage', 'future'] as const).map((k) => (
                    <marker key={k} id={`lb-arrow-${k}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse" markerUnits="strokeWidth">
                      <path d="M1 1 L9 5 L1 9 Z" fill={STROKE[k]} />
                    </marker>
                  ))}
                  {arcs.map((a, i) => {
                    const a0 = angleOf[a.from] + TRIM;
                    const a1 = angleOf[a.to] - TRIM;
                    return (
                      <mask key={i} id={`lb-mask-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={SIZE} height={SIZE}>
                        <path d={arcPath(a0 - 3, a1 + 4, RING)} fill="none" stroke="#fff" strokeWidth="30" pathLength={1} strokeDasharray="1 1" style={{ strokeDashoffset: drawn.has(`${a.from}>${a.to}`) ? 0 : 1 }} className="lb-draw" />
                      </mask>
                    );
                  })}
                </defs>

                <circle cx={C} cy={C} r={RING} fill="none" stroke="#E6DFD1" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" className={step.whole ? 'lb-turn' : undefined} />

                {arcs.map((a, i) => {
                  const a0 = angleOf[a.from] + TRIM;
                  const a1 = angleOf[a.to] - TRIM;
                  const on = drawn.has(`${a.from}>${a.to}`);
                  const mid = (a0 + a1) / 2;
                  const bottom = mid > 90 && mid < 270;
                  return (
                    <g key={i} mask={`url(#lb-mask-${i})`}>
                      <path d={arcPath(a0, a1, RING)} fill="none" stroke={STROKE[a.kind]} strokeWidth="5" strokeLinecap="round" strokeDasharray={a.kind === 'future' ? '16 13' : undefined} markerEnd={`url(#lb-arrow-${a.kind})`} />
                      {on && a.kind !== 'future' && <path d={arcPath(a0, a1, RING)} fill="none" stroke="#FDF8F3" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 55" className="lb-march" />}
                      <path id={`lb-label-${i}`} d={arcPath(a0, a1, LABEL_R + (bottom ? 12 : 0), bottom)} fill="none" />
                      <text className="max-lg:hidden" fill={INK_LABEL[a.kind]} style={{ font: '600 15px Inter, system-ui, sans-serif', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                        <textPath href={`#lb-label-${i}`} startOffset="50%" textAnchor="middle">{a.label}</textPath>
                      </text>
                    </g>
                  );
                })}

                {stations.map((s) => {
                  const p = at(s.angle, RING);
                  const on = shown.has(s.id);
                  return (
                    <g key={s.id} style={{ transformOrigin: `${f(p.x)}px ${f(p.y)}px`, transform: on ? 'scale(1)' : 'scale(0)' }} className="lb-card">
                      <circle cx={p.x} cy={p.y} r="11" fill="#FDF8F3" stroke="#A8643F" strokeWidth="4" strokeDasharray={s.proposed ? '5 4' : undefined} />
                      <circle cx={p.x} cy={p.y} r="4.5" fill="#A8643F" />
                    </g>
                  );
                })}
              </svg>

              {/* Centre: photograph, figure or the placemat's words */}
              <div className="absolute overflow-hidden rounded-full bg-[#F1ECE4]" style={{ left: C - PHOTO_R, top: C - PHOTO_R, width: PHOTO_R * 2, height: PHOTO_R * 2 }}>
                {centres.map(({ c, key }) => {
                  const on = key === centreKey;
                  const layer = `lb-fade absolute inset-0 flex flex-col items-center justify-center text-center ${on ? 'opacity-100' : 'opacity-0'}`;
                  const style = { transform: on ? 'scale(1)' : 'scale(1.06)' };
                  if (c.kind === 'photo') {
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={key} src={c.src} alt="" className={`${layer} h-full w-full object-cover`} style={style} />
                    );
                  }
                  if (c.kind === 'disc') {
                    return (
                      <div key={key} className={`${layer} bg-[#5E7A4C] px-10`} style={style}>
                        <p className="font-display text-[44px] font-semibold leading-[1.08] text-[#FDF8F3]">{c.words}</p>
                      </div>
                    );
                  }
                  const colour = c.tone === 'sage' ? '#5E7A4C' : c.tone === 'future' ? '#A8643F' : '#2B2A26';
                  return (
                    <div key={key} className={`${layer} px-9 ${c.tone === 'future' ? 'border-4 border-dashed border-[#A8643F]/60 rounded-full' : ''}`} style={style}>
                      <p className="font-display text-[84px] font-semibold leading-none tabular-nums" style={{ color: colour, fontSize: c.big.length > 6 ? 62 : 96 }}>{c.big}</p>
                      <p className="mt-3 text-[15px] font-semibold uppercase leading-snug tracking-[0.14em] max-lg:hidden" style={{ color: colour }}>{c.small}</p>
                    </div>
                  );
                })}
              </div>

              {/* Stations */}
              {stations.map((s) => {
                const p = at(s.angle, CARD_R);
                const on = shown.has(s.id);
                const out = at(s.angle, CARD_R + 110);
                const justAdded = step.adds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className="lb-card absolute"
                    style={{
                      left: p.x - 125,
                      top: p.y - 62,
                      width: 250,
                      opacity: on ? 1 : 0,
                      transform: on ? 'translate(0,0) scale(1)' : `translate(${f(out.x - p.x)}px, ${f(out.y - p.y)}px) scale(.55)`,
                    }}
                  >
                    {justAdded && <span key={`pulse-${active}`} className="lb-pulse pointer-events-none absolute inset-0 rounded-[20px] border-2 border-[#A8643F]" />}
                    <div className={`relative rounded-[20px] border-2 bg-white px-5 py-4 shadow-[0_22px_50px_-28px_rgba(43,42,38,0.45)] ${s.proposed ? 'border-dashed border-[#A8643F]/70 bg-[#FDF8F3]' : 'border-[#E6DFD1]'} ${justAdded ? 'ring-4 ring-[#A8643F]/15' : ''}`}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#A8643F] max-lg:hidden">{s.kicker}</p>
                        <p className="font-display text-[52px] font-semibold leading-none text-[#A8643F] lg:hidden">{s.kicker.split(" · ")[0]}</p>
                        {s.piece && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.piece.src} alt="" className="h-9 w-auto max-w-[90px] object-contain max-lg:hidden" />
                        )}
                      </div>
                      <p className="mt-1.5 font-display text-[23px] font-semibold leading-[1.12] text-goods-ink max-lg:hidden">{s.title}</p>
                    </div>
                    {s.tag && (
                      <div
                        className="lb-card mx-auto mt-2 w-max rounded-full bg-[#E9EDE3] px-3.5 py-1.5 text-[14px] font-semibold tabular-nums text-[#3f5634] max-lg:hidden"
                        style={{ opacity: on ? 1 : 0, transform: on ? 'translateY(0)' : 'translateY(-16px)', transitionDelay: on ? '420ms' : '0ms' }}
                      >
                        {s.tag}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* What we count, in the corners */}
              {CORNERS.map((corner, i) => {
                const c = counts.find((x) => x.id === corner.id);
                if (!c) return null;
                return (
                  <div
                    key={corner.id}
                    className="lb-card absolute w-[230px] rounded-[18px] border-2 border-[#E6DFD1] bg-white px-4 py-3 max-lg:hidden"
                    style={{ left: corner.x, top: corner.y, opacity: countsOn ? 1 : 0, transform: countsOn ? 'scale(1)' : 'scale(.7)', transitionDelay: countsOn ? `${i * 120}ms` : '0ms' }}
                  >
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#5E7A4C]">{c.title}</p>
                    <p className="mt-1 text-[15px] leading-snug text-[#4a4741]">{c.line}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <details className="mx-auto mt-8 max-w-6xl px-6 text-[#4a4741] md:px-10 lg:px-14">
        <summary className="cursor-pointer text-sm font-semibold">Read the model as a list</summary>
        <ol className="mt-4 space-y-4 text-[15px]">
          {steps.map((s) => (
            <li key={s.id}>
              <span className="font-semibold text-goods-ink">{s.title}</span> {s.lines.join(' ')}
              {s.money && <span> {s.money.map((m) => `${m.label} ${m.amount}: ${m.line}.`).join(' ')}</span>}
            </li>
          ))}
        </ol>
        <ul className="mt-4 space-y-2 text-[15px]">
          {arrows.map((a) => (
            <li key={`${a.from}-${a.to}`}>{items.find((it) => it.id === a.from)?.title ?? a.from} to {items.find((it) => it.id === a.to)?.title ?? a.to}: {a.label}</li>
          ))}
        </ul>
      </details>

      {sheetOpen && (
        <div role="dialog" aria-modal="true" aria-label="The Goods on Country model, the whole sheet" className="fixed inset-0 z-[200] flex flex-col bg-[#FDF8F3]" onClick={() => setSheetOpen(false)}>
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A8643F]">The whole model</p>
            <button ref={sheetClose} type="button" onClick={() => setSheetOpen(false)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-goods-ink/25 px-4 text-sm font-semibold text-goods-ink hover:border-goods-ink" aria-label="Close the whole model">
              <X className="h-4 w-4" aria-hidden="true" />
              Close
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-2 pb-6 md:px-8" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto max-w-[1500px] [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: sheetSvg }} />
          </div>
        </div>
      )}
    </div>
  );
}
