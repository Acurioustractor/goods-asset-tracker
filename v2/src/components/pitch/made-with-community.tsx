'use client';

// The closing surprise on /pitch: every cleared voice placed on the stage of
// Goods they shaped, their words linked to what Goods counts, and one thread
// drawn through them all to an empty seat, the next community to ask.
// Data and its consent rules live in lib/data/community-contributions.ts.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CommunityVoice, Contribution, Stage } from '@/lib/data/community-contributions';

type Props = {
  voices: CommunityVoice[];
  stages: readonly { id: Stage; label: string; line: string }[];
  measures: { id: string; area: string; title: string }[];
  colours: Record<Contribution, string>;
  draft: boolean;
};

const W = 1180;
const TOP = 70;
const NODE_TOP = 150;
const R = 22;
const DIM_Y = 660;
const NEXT_Y = 790;

const initials = (n: string) => n.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function MadeWithCommunity({ voices, stages, measures, colours, draft }: Props) {
  const [open, setOpen] = useState<CommunityVoice | null>(null);
  const [go, setGo] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(4000);

  const colW = W / stages.length;
  const placed = useMemo(() => {
    const out: (CommunityVoice & { x: number; y: number })[] = [];
    stages.forEach((s, si) => {
      const list = voices.filter((v) => v.stage === s.id).sort((a, b) => a.did.localeCompare(b.did) || a.name.localeCompare(b.name));
      const cols = list.length > 12 ? 3 : list.length > 5 ? 2 : 1;
      const gapY = cols > 2 ? 66 : 62;
      const cw = colW / cols;
      list.forEach((v, i) => {
        out.push({ ...v, x: si * colW + cw * (i % cols) + cw / 2, y: NODE_TOP + Math.floor(i / cols) * gapY + (cols > 1 ? (i % cols) * (gapY / cols) : 0) });
      });
    });
    return out;
  }, [voices, stages, colW]);

  const dimW = (W - 80) / measures.length;
  const dimX = (id: string) => 40 + measures.findIndex((m) => m.id === id) * dimW + dimW / 2;
  const seat = { x: colW * (stages.length - 1) + colW / 2, y: NODE_TOP + 40 };

  const threadD = useMemo(() => {
    if (!placed.length) return '';
    let d = `M ${placed[0].x} ${placed[0].y}`;
    for (let i = 1; i < placed.length; i++) {
      const a = placed[i - 1], b = placed[i];
      d += ` Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 26} ${b.x} ${b.y}`;
    }
    const last = placed[placed.length - 1];
    return `${d} Q ${(last.x + seat.x) / 2} ${seat.y + 120} ${seat.x} ${seat.y}`;
  }, [placed, seat.x, seat.y]);

  useEffect(() => {
    if (threadRef.current) setLen(Math.ceil(threadRef.current.getTotalLength()));
    const node = wrap.current;
    if (!node) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setGo(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(node);
    return () => io.disconnect();
  }, [threadD]);

  const counts = Object.entries(voices.reduce<Record<string, number>>((m, v) => ({ ...m, [v.did]: (m[v.did] ?? 0) + 1 }), {}));

  return (
    <section id="made-with-community" className="relative border-t border-[#e6dfd1] bg-goods-cream px-6 py-20 md:px-10 md:py-28 lg:px-14">
      {draft && (
        <p className="mx-auto mb-8 max-w-6xl rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Development only. Who did what is a draft reading waiting for confirmation; this section does not render in production.
        </p>
      )}
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.14em] text-goods-terracotta">Made with community</p>
        <h2 className="mt-3 max-w-[18ch] font-display text-4xl leading-[1.08] text-balance md:text-6xl">None of this started with us.</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#5d574c]">
          Every bed began with someone who asked, someone who shaped it, someone who backed it and someone who built it. Tap a face to hear them.
        </p>
        <ul className="mt-6 flex flex-wrap gap-4 text-sm text-[#5d574c]">
          {(Object.keys(colours) as Contribution[]).map((k) => (
            <li key={k} className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: colours[k] }} />{k}</li>
          ))}
        </ul>
      </div>

      {/* Wide screens: the whole picture at once */}
      <div ref={wrap} className="mx-auto mt-8 hidden max-w-6xl md:block">
        <svg viewBox={`0 0 ${W} 880`} className="h-auto w-full" role="img" aria-label="People placed on the stage of Goods they shaped, linked to what Goods counts">
          {stages.map((s, i) => (
            <g key={s.id}>
              {i > 0 && <line x1={i * colW} y1={TOP - 30} x2={i * colW} y2={DIM_Y - 70} stroke="#e6dfd1" strokeDasharray="2 6" />}
              <text x={i * colW + colW / 2} y={TOP} textAnchor="middle" className="fill-goods-ink font-display text-[22px] italic">{s.label}</text>
              <text x={i * colW + colW / 2} y={TOP + 20} textAnchor="middle" className="fill-[#7a7363] text-[12px]">{s.line}</text>
            </g>
          ))}

          <g>
            {placed.map((v) => v.measures.map((m) => (
              <path key={v.name + m} d={`M ${v.x} ${v.y + R} C ${v.x} ${v.y + 180}, ${dimX(m)} ${DIM_Y - 160}, ${dimX(m)} ${DIM_Y - 26}`} fill="none" stroke={colours[v.did]} strokeOpacity={open?.name === v.name ? 0.8 : 0.14} strokeWidth={open?.name === v.name ? 2.2 : 1.3} />
            )))}
            <path ref={threadRef} d={threadD} fill="none" stroke="#b5553a" strokeWidth={2.4} strokeLinecap="round"
              style={{ strokeDasharray: len, strokeDashoffset: go ? 0 : len, transition: 'stroke-dashoffset 5.6s cubic-bezier(.45,.05,.3,1)' }}
              className="motion-reduce:!transition-none motion-reduce:[stroke-dashoffset:0]" />
          </g>

          {placed.map((v, i) => (
            <g key={v.name} role="button" tabIndex={0} aria-label={`${v.name}, ${v.did}`} className="cursor-pointer outline-none"
              onClick={() => setOpen(v)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(v); } }}>
              <clipPath id={`mwc-${i}`}><circle cx={v.x} cy={v.y} r={R} /></clipPath>
              {v.portrait
                ? <image href={v.portrait} x={v.x - R} y={v.y - R} width={R * 2} height={R * 2} clipPath={`url(#mwc-${i})`} preserveAspectRatio="xMidYMid slice" />
                : <><circle cx={v.x} cy={v.y} r={R} fill="#efe4d6" /><text x={v.x} y={v.y + 5} textAnchor="middle" className="fill-[#7a4527] font-display text-[14px]">{initials(v.name)}</text></>}
              <circle cx={v.x} cy={v.y} r={R + 2} fill="none" stroke={colours[v.did]} strokeWidth={open?.name === v.name ? 5 : 3} />
              <text x={v.x} y={v.y + R + 14} textAnchor="middle" className="fill-goods-ink text-[11px]">{v.name.split(' ')[0]}</text>
            </g>
          ))}

          <g style={{ opacity: go ? 1 : 0, transition: 'opacity 1s 5.2s' }} className="motion-reduce:!opacity-100">
            <circle cx={seat.x} cy={seat.y} r={26} fill="none" stroke="#b5553a" strokeWidth={2} strokeDasharray="4 5" className="origin-center animate-pulse [transform-box:fill-box]" />
            <text x={seat.x} y={seat.y + 50} textAnchor="middle" className="fill-goods-terracotta font-display text-[16px] italic">the next</text>
            <text x={seat.x} y={seat.y + 70} textAnchor="middle" className="fill-goods-terracotta font-display text-[16px] italic">community to ask</text>
          </g>

          <text x={40} y={DIM_Y - 40} className="fill-[#7a7363] text-[12px]">What their words speak to: what Goods counts</text>
          {measures.map((m) => (
            <a key={m.id} href="#measure">
              <rect x={dimX(m.id) - dimW / 2 + 6} y={DIM_Y - 26} width={dimW - 12} height={52} rx={10} fill="#fff" stroke="#e6dfd1" />
              <text x={dimX(m.id)} y={DIM_Y + 5} textAnchor="middle" className="fill-goods-ink text-[14px]">{m.area}</text>
            </a>
          ))}
          {measures.map((m) => (
            <path key={'n' + m.id} d={`M ${dimX(m.id)} ${DIM_Y + 26} C ${dimX(m.id)} ${NEXT_Y - 60}, ${W / 2} ${NEXT_Y - 70}, ${W / 2} ${NEXT_Y - 30}`} fill="none" stroke="#b5553a" strokeOpacity={0.35} />
          ))}
          <a href="#request">
            <rect x={W / 2 - 220} y={NEXT_Y - 30} width={440} height={60} rx={30} className="fill-goods-ink" />
            <text x={W / 2} y={NEXT_Y + 6} textAnchor="middle" className="fill-goods-cream font-display text-[17px]">Where it goes next: the request</text>
          </a>
        </svg>
      </div>

      {/* Phones: the same people, stage by stage */}
      <div className="mx-auto mt-8 max-w-6xl space-y-8 md:hidden">
        {stages.map((s) => {
          const list = voices.filter((v) => v.stage === s.id);
          return (
            <div key={s.id} className="border-t border-[#e6dfd1] pt-4">
              <p className="font-display text-2xl italic">{s.label}</p>
              <p className="text-sm text-[#7a7363]">{s.line}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {list.map((v) => (
                  <button key={v.name} onClick={() => setOpen(v)} className="flex w-[4.5rem] flex-col items-center gap-1 text-[11px]">
                    <Face v={v} ring={colours[v.did]} size={48} />
                    <span className="line-clamp-1">{v.name.split(' ')[0]}</span>
                  </button>
                ))}
                {s.id === 'grow' && (
                  <div className="flex w-[4.5rem] flex-col items-center gap-1 text-center text-[11px] italic text-goods-terracotta">
                    <span className="h-12 w-12 animate-pulse rounded-full border-2 border-dashed border-goods-terracotta motion-reduce:animate-none" />
                    the next community to ask
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-sm text-[#5d574c]">
        {voices.length} voices cleared for this use: {counts.map(([k, n]) => `${n} ${k}`).join(', ')}. Quotes are their own words, approved. Portraits only where the person&apos;s portrait is held.
      </p>

      {open && (
        <div role="dialog" aria-modal="false" aria-label={open.name} className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl border border-[#e6dfd1] bg-white p-5 shadow-2xl md:inset-x-auto md:right-6">
          <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-3 top-2 text-2xl text-[#7a7363]">×</button>
          <div className="flex items-center gap-3">
            <Face v={open} ring={colours[open.did]} size={60} />
            <div>
              <p className="font-display text-xl">{open.name}</p>
              <p className="text-xs text-[#7a7363]">{open.role} · {open.community}</p>
            </div>
          </div>
          {open.quote
            ? <><blockquote className="mt-4 font-display text-lg italic leading-snug">“{open.quote.text}”</blockquote><p className="mt-1 text-xs text-[#7a7363]">{open.quote.context}</p></>
            : <p className="mt-4 text-sm text-[#7a7363]">{open.young ? 'A young maker. Their story is told with care, by the people who hold it.' : 'No quote of their own here.'}</p>}
          <p className="mt-3 text-xs text-[#5d574c]"><span className="font-semibold capitalize">{open.did}</span> · {stages.find((s) => s.id === open.stage)?.label}</p>
          {draft && <p className="mt-3 rounded bg-amber-50 px-2 py-1 text-xs text-amber-900">Draft reading: {open.basis}. To confirm.</p>}
        </div>
      )}
    </section>
  );
}

function Face({ v, ring, size }: { v: CommunityVoice; ring: string; size: number }) {
  return v.portrait
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={v.portrait} alt="" width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size, boxShadow: `0 0 0 3px ${ring}` }} />
    : <span className="flex items-center justify-center rounded-full bg-[#efe4d6] font-display text-[#7a4527]" style={{ width: size, height: size, boxShadow: `0 0 0 3px ${ring}` }}>{initials(v.name)}</span>;
}
