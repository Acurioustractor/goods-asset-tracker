'use client';

// The listening map, the closing surprise on /pitch. Places glow where people
// spoke. Tap one: its people in their own words, what that community asked for,
// where it stands and whose call it is. No roles, no stages: this is where people
// are and what they said, and Goods follows. Where a person is shown and how
// their photo is framed live in data/community-contributions.json. Data and consent rules:
// lib/data/community-contributions.ts.

import { useEffect, useMemo, useRef, useState } from 'react';
import { project } from '@/components/pitch/static-map';
import type { ListeningPlace, ListeningVoice } from '@/lib/data/community-contributions';

type Props = { outline: string; places: ListeningPlace[]; voices: ListeningVoice[]; draft: boolean };

const VIEW = { w: 620, h: 460 };
const SEAT = { x: 560, y: 70 };
const initials = (n: string) => n.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function MadeWithCommunity({ outline, places: initialPlaces, voices, draft }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [person, setPerson] = useState<ListeningVoice | null>(null);
  const [seen, setSeen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const personRef = useRef<HTMLDivElement>(null);
  // Below lg the panel sits under the map and list, so a tap would change content
  // off screen. Bring the panel, then the person's words, into view.
  const stacked = () => typeof window !== 'undefined' && window.innerWidth < 1024;
  const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => { if (selected && stacked()) panelRef.current?.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' }); }, [selected]);
  useEffect(() => { if (person && stacked()) personRef.current?.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'center' }); }, [person]);

  const byName = useMemo(() => new Map(voices.map((v) => [v.name, v])), [voices]);
  const places = useMemo(() => initialPlaces
    .map((p) => ({ ...p, ...project(p.lat, p.lng), voices: voices.filter((v) => v.place === p.name).map((v) => v.name) }))
    .filter((p) => p.voices.length || p.asked), [initialPlaces, voices]);
  const unplaced = voices.filter((v) => !v.place || !places.some((p) => p.name === v.place));
  const place = places.find((p) => p.id === selected) ?? null;
  const heard = places.filter((p) => p.voices.length).length;

  useEffect(() => {
    const el = document.getElementById('listening-map');
    if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="made-with-community" className="relative border-t border-[#e6dfd1] bg-goods-cream px-6 py-20 md:px-10 md:py-28 lg:px-14">
      {draft && (
        <p className="mx-auto mb-8 max-w-6xl rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Development only. Not yet confirmed, so this section does not render in production.
        </p>
      )}
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.14em] text-goods-terracotta">Where we listened</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-[20ch] font-display text-4xl leading-[1.08] text-balance md:text-6xl">It starts with what people ask for.</h2>
        </div>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#5d574c]">
          {voices.length} people in {heard} places, in their own words. Tap a place to hear them, and to see what that community asked for and whose call it is.
        </p>

        <div id="listening-map" className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <figure className="m-0 rounded-[22px] border border-[#e6dfd1] bg-[#fffdf9] p-4 md:p-6">
            <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-auto w-full" role="img" aria-label={`Map of Australia with ${heard} places where people spoke`}>
              <g fill="#F6F0E6" stroke="#CFC6B6" strokeWidth={1} dangerouslySetInnerHTML={{ __html: outline }} />
              {places.map((p, i) => {
                const active = p.id === selected;
                const r = 5 + Math.min(p.voices.length, 12) * 0.9;
                const left = p.x > VIEW.w * 0.62;
                return (
                  <g key={p.id} role="button" tabIndex={0} aria-label={`${p.name}: ${p.voices.length} people`} className="cursor-pointer outline-none"
                    onClick={() => { setSelected(active ? null : p.id); setPerson(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(active ? null : p.id); setPerson(null); } }}>
                    <circle cx={p.x} cy={p.y} r={r * 2.8} fill="#C45C3E" opacity={active ? 0.3 : 0.12}
                      style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: seen ? `mwc-breathe 3.2s ease-in-out ${i * 0.25}s infinite` : 'none' }} className="motion-reduce:!animate-none" />
                    <circle cx={p.x} cy={p.y} r={r} fill={p.voices.length ? '#C45C3E' : '#FBF8F1'} stroke={active ? '#2B2A26' : '#C45C3E'} strokeWidth={active ? 2.2 : 1.5} />
                    {/* Central Australia is too crowded for every name: the list beside the map names them all; the map names the one you chose. */}
                    {active && (
                      <g>
                        <text x={left ? p.x - r - 6 : p.x + r + 6} y={p.y - 2} textAnchor={left ? 'end' : 'start'} fontFamily="'Playfair Display', Georgia, serif" fontSize={active ? 15 : 12.5} fill="#2B2A26" fontWeight={active ? 700 : 500} stroke="#fffdf9" strokeWidth={3} paintOrder="stroke">{p.name}</text>
                        <text x={left ? p.x - r - 6 : p.x + r + 6} y={p.y + 11} textAnchor={left ? 'end' : 'start'} fontFamily="Inter, system-ui, sans-serif" fontSize={8.5} letterSpacing={0.6} fill="#6D6961" stroke="#fffdf9" strokeWidth={3} paintOrder="stroke">
                          {p.voices.length ? `${p.voices.length} ${p.voices.length === 1 ? 'VOICE' : 'VOICES'}` : 'ASKED'}{p.beds ? ` · ${p.beds} BEDS` : ''}
                        </text>
                      </g>
                    )}
                    <title>{p.name}</title>
                  </g>
                );
              })}
              <g style={{ opacity: seen ? 1 : 0, transition: 'opacity 1.2s 1.5s' }}>
                <circle cx={SEAT.x} cy={SEAT.y} r={14} fill="none" stroke="#C45C3E" strokeWidth={1.6} strokeDasharray="3 4"
                  style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'mwc-breathe 2.6s ease-in-out infinite' }} className="motion-reduce:!animate-none" />
                <text className="max-md:hidden" x={SEAT.x} y={SEAT.y + 30} textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontSize={12} fill="#C45C3E">the next</text>
                <text className="max-md:hidden" x={SEAT.x} y={SEAT.y + 45} textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontStyle="italic" fontSize={12} fill="#C45C3E">community to ask</text>
              </g>
            </svg>
            <style>{`@keyframes mwc-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}`}</style>
            <p className="mt-3 flex items-center gap-2 font-display text-base italic text-goods-terracotta md:hidden"><span aria-hidden="true" className="inline-block h-5 w-5 rounded-full border-2 border-dashed border-goods-terracotta motion-safe:animate-pulse" />The dashed circle: the next community to ask</p>
            <figcaption className="mt-2 text-xs text-[#5d574c]">Each dot is a place where people spoke, growing with the number heard. Tap one, or choose from the list.</figcaption>
          </figure>

          <aside ref={panelRef} className="scroll-mt-24 rounded-[22px] border border-[#e6dfd1] bg-white p-6">
            {!place ? (
              <div>
                <p className="font-display text-2xl">Tap a place</p>
                <p className="mt-2 text-sm text-[#5d574c]">Or start with one of these.</p>
                <ul className="mt-4 space-y-2">
                  {[...places].sort((a, b) => b.voices.length - a.voices.length).map((p) => (
                    <li key={p.id}>
                      <button onClick={() => setSelected(p.id)} className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-goods-cream">
                        <span className="font-display text-lg">{p.name}</span>
                        <span className="flex -space-x-2">{p.voices.slice(0, 4).map((n) => <Avatar key={n} v={byName.get(n)!} size={26} />)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <button onClick={() => { setSelected(null); setPerson(null); }} className="text-xs text-[#7a7363] hover:text-goods-ink">← All places</button>
                <p className="mt-2 font-display text-3xl leading-tight">{place.name}</p>
                {place.country && <p className="text-sm text-[#7a7363]">{place.country}</p>}
                {place.asked && (
                  <div className="mt-4 space-y-3 border-l-2 border-goods-terracotta pl-4">
                    <div><p className="text-[11px] uppercase tracking-wide text-goods-terracotta">{place.asked.field}</p><p className="text-[15px] leading-relaxed">{place.asked.body}</p></div>
                    <div><p className="text-[11px] uppercase tracking-wide text-[#7a7363]">Where it stands</p><p className="text-sm leading-relaxed text-[#4a4741]">{place.asked.standing}</p></div>
                    <div><p className="text-[11px] uppercase tracking-wide text-[#7a7363]">Whose call</p><p className="text-sm text-[#4a4741]">{place.asked.whoseCall}</p></div>
                  </div>
                )}
                {place.beds > 0 && <p className="mt-4 text-sm text-[#5d574c]">{place.beds} beds on the register here.</p>}
                <div className="mt-5 flex flex-wrap gap-3">
                  {place.voices.map((n) => {
                    const v = byName.get(n)!;
                    return (
                      <button key={n} onClick={() => setPerson(v)} className={`flex w-[4.6rem] flex-col items-center gap-1 text-center text-[11px] leading-tight ${person?.name === n ? 'font-semibold' : ''}`}>
                        <Avatar v={v} size={56} ring={person?.name === n} />{v.name}
                      </button>
                    );
                  })}
                </div>
                {person && <div ref={personRef}><PersonPanel v={person} /></div>}
              </div>
            )}
          </aside>
        </div>

        {unplaced.length > 0 && (
          <div className="mt-10 border-t border-[#e6dfd1] pt-6">
            <p className="font-display text-2xl">Across many places</p>
            <p className="text-sm text-[#7a7363]">Clinicians, practitioners and people whose work is not tied to one community.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              {unplaced.map((v) => (
                <button key={v.name} onClick={() => { setSelected(null); setPerson(v); }} className="flex w-[4.6rem] flex-col items-center gap-1 text-center text-[11px] leading-tight">
                  <Avatar v={v} size={52} />{v.name}
                </button>
              ))}
            </div>
            {person && !person.place && <div className="mt-4 max-w-md rounded-2xl border border-[#e6dfd1] bg-white p-5"><PersonPanel v={person} /></div>}
          </div>
        )}

        <p className="mt-10 text-sm text-[#5d574c]">Only people who have cleared their words for this use appear. Quotes are their own words. Portraits only where one is held and shown by choice; everyone else by initials.</p>
      </div>
    </section>
  );
}

function Avatar({ v, size, ring = false }: { v: ListeningVoice; size: number; ring?: boolean }) {
  const style = { width: size, height: size, boxShadow: ring ? '0 0 0 3px #C45C3E' : '0 0 0 2px #fff' };
  return v.portrait
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={v.portrait} alt="" className="rounded-full object-cover" style={{ ...style, objectPosition: v.photoFocus ?? 'center' }} loading="lazy" />
    : <span className="flex items-center justify-center rounded-full bg-[#efe4d6] font-display text-[#7a4527]" style={{ ...style, fontSize: size * 0.34 }}>{initials(v.name)}</span>;
}

function PersonPanel({ v }: { v: ListeningVoice }) {
  return (
    <div className="mt-5 border-t border-[#e6dfd1] pt-4">
      <p className="font-display text-xl">{v.name}</p>
      <p className="text-xs text-[#7a7363]">{v.role}</p>
      {v.quote
        ? <><blockquote className="mt-3 font-display text-lg italic leading-snug">“{v.quote.text}”</blockquote><p className="mt-1 text-xs text-[#7a7363]">{v.quote.context}</p></>
        : <p className="mt-3 text-sm text-[#7a7363]">{v.young ? 'A young maker. Their story is told with care, by the people who hold it.' : 'No quote of their own here.'}</p>}
    </div>
  );
}
