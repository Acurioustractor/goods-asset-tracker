'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PanelLeftOpen, X, Search } from 'lucide-react';
import AUS from '@/lib/data/australia-map.json';

export interface AtlasCommunity {
  id: string;
  name: string;
  traditionalName: string | null;
  state: string;
  status: string;
  lat: number;
  lng: number;
  beds: number;
  basket: number;
  stretch: number;
  washers: number;
  signals30d: number;
  outstanding: number;
  demand: number;
  facilityInterest: string | null;
  facilityNotes: string | null;
  keyPeople: Array<{ name: string; role?: string; org?: string; storytellerSlug?: string; note?: string }>;
  procurement: Array<{ name: string; org?: string; note?: string }>;
}

interface Canon {
  beds: number;
  stretch: number;
  washers: number;
  communities: number;
  plasticKg: number;
}

/**
 * Real geometry: ABS-derived state boundaries (CC-BY 4.0), pre-projected to
 * Web-Mercator SVG paths at build time (scratchpad script 2026-07-20) into
 * australia-map.json. The projection here MUST match that bake exactly.
 */
const W: number = AUS.w;
const H: number = AUS.h;
const [LNG_MIN, LNG_MAX, LAT_MIN, LAT_MAX] = AUS.bounds as [number, number, number, number];
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const Y_TOP = mercY(LAT_MAX);
const Y_BOT = mercY(LAT_MIN);
const px = (lng: number) => ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
const py = (lat: number) => ((Y_TOP - mercY(lat)) / (Y_TOP - Y_BOT)) * H;

/** The on-Country plant (Kirmos facility, Alice Springs) — the runs start here. */
const PLANT = { lng: 133.8807, lat: -23.698, label: 'Alice Springs · the plant' };

const STATUS_TONE: Record<string, string> = {
  active: '#B0673B',
  testing: '#C2A85A',
  exploring: '#4E8F88',
  prospect: '#9A6B52',
  administrative: '#C9BCA8',
};

/** Curved "run" from the plant to a community — a gentle bow, not a straight spider leg. */
function runPath(cx: number, cy: number) {
  const x0 = px(PLANT.lng);
  const y0 = py(PLANT.lat);
  const mx = (x0 + cx) / 2;
  const my = (y0 + cy) / 2;
  // bow perpendicular to the chord, proportional to distance
  const dx = cx - x0;
  const dy = cy - y0;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return '';
  const bow = Math.min(60, dist * 0.14);
  const qx = mx - (dy / dist) * bow;
  const qy = my + (dx / dist) * bow;
  return `M${x0},${y0} Q${qx.toFixed(1)},${qy.toFixed(1)} ${cx},${cy}`;
}

export default function AtlasClient({ communities, canon }: { communities: AtlasCommunity[]; canon: Canon }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const selected = communities.find((c) => c.id === selectedId) || null;
  const q = query.trim().toLowerCase();
  const matches = q
    ? communities.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.keyPeople.some((p) => p.name.toLowerCase().includes(q)) ||
          c.procurement.some((p) => p.name.toLowerCase().includes(q)),
      )
    : null;

  /**
   * Label layout: side + vertical stagger so the Central Desert cluster
   * (Alice / Tennant / Utopia / Ampilatwatja, all within a few degrees)
   * fans out instead of colliding. Communities within 46px of each other
   * form a cluster; members alternate sides and step vertically.
   */
  const placed = useMemo(() => {
    const pts = communities.map((c) => ({ c, x: px(c.lng), y: py(c.lat) }));
    const clusters: (typeof pts)[] = [];
    for (const p of pts) {
      const home = clusters.find((cl) => cl.some((m) => Math.hypot(m.x - p.x, m.y - p.y) < 46));
      if (home) home.push(p);
      else clusters.push([p]);
    }
    const out = new Map<string, { x: number; y: number; side: 1 | -1; lift: number }>();
    for (const cl of clusters) {
      cl.sort((a, b) => a.y - b.y);
      cl.forEach((p, i) => {
        // near the east coast, labels go left so they stay on the canvas
        const baseSide: 1 | -1 = p.x > W * 0.78 ? -1 : 1;
        const side: 1 | -1 = cl.length > 1 && i % 2 === 1 ? ((-baseSide) as 1 | -1) : baseSide;
        const lift = cl.length > 1 ? (i - (cl.length - 1) / 2) * 26 : 0;
        out.set(p.c.id, { x: p.x, y: p.y, side, lift });
      });
    }
    return out;
  }, [communities]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBF8F1]">
      {/* Top bar */}
      <div className="flex items-center gap-4 border-b border-[#E5DCCB] bg-[#F5EEE4] px-5 py-3">
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-lg border border-[#E0D5C2] px-3 py-1.5 text-sm text-[#6E645A] hover:bg-[#EAE0D0]"
          title="Back to admin (shows the menu again)"
        >
          <PanelLeftOpen className="h-4 w-4" /> Menu
        </Link>
        <h1 className="font-display text-xl font-bold text-[#26201B]">Goods Atlas</h1>
        <div className="relative flex max-w-md flex-1 items-center gap-2 rounded-xl bg-white/70 px-3 py-2">
          <Search className="h-4 w-4 text-[#A79C8C]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities and people…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#A79C8C]"
          />
          {matches && (
            <div className="absolute left-0 top-full z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-[#E0D5C2] bg-white shadow-lg">
              {matches.length === 0 && <p className="px-3 py-2 text-sm text-[#A79C8C]">No matches</p>}
              {matches.map((c) => (
                <button
                  key={c.id}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-[#FBF8F1]"
                  onClick={() => {
                    setSelectedId(c.id);
                    setQuery('');
                  }}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-[#A79C8C]"> · {c.beds} beds · {c.washers} washers</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Canon strip — live from CANONICAL_ASSETS via the server page */}
        <div className="ml-auto hidden items-center gap-4 lg:flex">
          {[
            [canon.beds, 'beds'],
            [canon.stretch, 'Stretch'],
            [canon.washers, 'washers'],
            [canon.communities, 'communities'],
            [`${canon.plasticKg.toLocaleString()}kg`, 'HDPE'],
          ].map(([v, l]) => (
            <div key={String(l)} className="text-center">
              <div className="font-display text-lg font-bold leading-none text-[#B44D2B]">{v}</div>
              <div className="text-[10px] text-[#8A7F72]">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body: map + drill panel */}
      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-full w-full"
            role="img"
            aria-label="Map of Goods communities across Australia, with delivery runs from the Alice Springs plant"
          >
            <defs>
              <radialGradient id="landGlow" cx="46%" cy="38%" r="75%">
                <stop offset="0%" stopColor="#F3EADA" />
                <stop offset="70%" stopColor="#EDE2CC" />
                <stop offset="100%" stopColor="#E7DAC0" />
              </radialGradient>
              <filter id="landShadow" x="-4%" y="-4%" width="108%" height="108%">
                <feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#26201B" floodOpacity="0.10" />
              </filter>
            </defs>

            {/* Land — one soft mass, then hairline internal borders */}
            <g filter="url(#landShadow)">
              {AUS.states.map((s: { name: string; d: string }) => (
                <path key={s.name} d={s.d} fill="url(#landGlow)" stroke="none" />
              ))}
            </g>
            {AUS.states.map((s: { name: string; d: string }) => (
              <path key={`b-${s.name}`} d={s.d} fill="none" stroke="#D8C9AC" strokeWidth={0.7} strokeLinejoin="round" />
            ))}

            {/* The runs — plant → community, the distance IS the story */}
            <g fill="none">
              {communities
                .filter((c) => c.beds > 0 || c.washers > 0)
                .map((c) => {
                  const dim = hoverId && hoverId !== c.id && selectedId !== c.id;
                  return (
                    <path
                      key={`run-${c.id}`}
                      d={runPath(px(c.lng), py(c.lat))}
                      stroke="#B44D2B"
                      strokeWidth={c.id === (hoverId || selectedId) ? 2.2 : 1.4}
                      strokeOpacity={dim ? 0.12 : 0.34}
                      strokeDasharray={c.status === 'active' || c.status === 'testing' ? undefined : '5 5'}
                      strokeLinecap="round"
                    />
                  );
                })}
            </g>

            {/* The plant */}
            <g transform={`translate(${px(PLANT.lng)},${py(PLANT.lat)})`}>
              <rect x={-5.5} y={-5.5} width={11} height={11} rx={2.5} transform="rotate(45)" fill="#26201B" stroke="#FBF8F1" strokeWidth={2} />
              <text x={0} y={26} textAnchor="middle" fill="#6E645A" fontSize={10.5} fontStyle="italic" fontFamily="Georgia, serif">
                {PLANT.label}
              </text>
            </g>

            {/* Communities — sized markers + leader-line callouts */}
            {communities
              .slice()
              .sort((a, b) => b.beds - a.beds)
              .map((c) => {
                const pos = placed.get(c.id);
                if (!pos) return null;
                const r = Math.max(7, Math.min(26, 6 + Math.sqrt(c.beds) * 1.9));
                const isSel = c.id === selectedId;
                const isHover = c.id === hoverId;
                const dim = (hoverId || selectedId) && !isSel && !isHover;
                const lx = pos.x + pos.side * (r + 14);
                const ly = pos.y + pos.lift;
                const counts = [c.beds > 0 ? `${c.beds} beds` : null, c.washers > 0 ? `${c.washers} washers` : null]
                  .filter(Boolean)
                  .join(' · ');
                return (
                  <g
                    key={c.id}
                    className="cursor-pointer"
                    opacity={dim ? 0.45 : 1}
                    onClick={() => setSelectedId(isSel ? null : c.id)}
                    onMouseEnter={() => setHoverId(c.id)}
                    onMouseLeave={() => setHoverId(null)}
                  >
                    {c.facilityInterest && (
                      <circle cx={pos.x} cy={pos.y} r={r + 4.5} fill="none" stroke="#4E8F88" strokeWidth={2} strokeDasharray="4 3" />
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={r}
                      fill={isSel || isHover ? '#8A4B26' : STATUS_TONE[c.status] || '#9A6B52'}
                      fillOpacity={0.92}
                      stroke="#FBF8F1"
                      strokeWidth={2.5}
                    />
                    {c.signals30d > 0 && <circle cx={pos.x} cy={pos.y} r={r + 1.5} fill="none" stroke="#B44D2B" strokeWidth={1} strokeOpacity={0.5} />}

                    {/* leader + label */}
                    <path
                      d={`M${pos.x + pos.side * (r + 2)},${pos.y} L${lx - pos.side * 4},${ly}`}
                      stroke="#A79C8C"
                      strokeWidth={0.9}
                      fill="none"
                    />
                    <text
                      x={lx}
                      y={ly - 1.5}
                      textAnchor={pos.side === 1 ? 'start' : 'end'}
                      fill="#26201B"
                      fontSize={12.5}
                      fontWeight={700}
                      fontFamily="Georgia, serif"
                    >
                      {c.name}
                    </text>
                    {counts && (
                      <text x={lx} y={ly + 11} textAnchor={pos.side === 1 ? 'start' : 'end'} fill="#8A7F72" fontSize={10}>
                        {counts}
                      </text>
                    )}
                  </g>
                );
              })}
          </svg>

          <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-xl border border-[#E5DCCB] bg-[#F5EEE4]/95 px-4 py-2 text-xs text-[#6E645A]">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#B0673B]" /> active</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#26201B]" /> the plant</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-0 w-5 border-t-2 border-[#B44D2B]/50" /> delivery run</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-[#4E8F88]" /> facility interest</span>
            <span>marker size = beds</span>
          </div>
          <p className="absolute bottom-4 right-4 text-[10px] text-[#A79C8C]">
            Boundaries: ABS ASGS (CC-BY 4.0)
          </p>
        </div>

        {/* Drill panel */}
        {selected && (
          <aside className="flex w-[380px] flex-col overflow-y-auto border-l border-[#E5DCCB] bg-white">
            <div className="flex items-start justify-between gap-2 p-5 pb-3">
              <div>
                <h2 className="font-display text-2xl font-bold">{selected.name}</h2>
                {selected.traditionalName && <p className="text-sm italic text-[#8A7F72]">{selected.traditionalName} country</p>}
              </div>
              <button onClick={() => setSelectedId(null)} className="rounded-lg p-1.5 text-[#A79C8C] hover:bg-[#F5EEE4]" aria-label="Close panel">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 px-5">
              <Stat v={selected.beds} l={`beds · ${selected.basket}B / ${selected.stretch}S`} />
              <Stat v={selected.washers} l="washers (register)" />
              <Stat v={selected.signals30d} l="signals, last 30d" live={selected.signals30d > 0} />
              <Stat v={selected.outstanding} l="ready / allocated" warn={selected.outstanding > 0} />
            </div>
            {selected.demand > 0 && (
              <p className="mx-5 mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                {selected.demand} beds of documented open demand
              </p>
            )}
            {selected.facilityInterest && (
              <div className="mx-5 mt-3 rounded-xl bg-emerald-50 px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Facility: {selected.facilityInterest}</p>
                {selected.facilityNotes && <p className="mt-1 text-xs leading-relaxed text-emerald-900/80">{selected.facilityNotes}</p>}
              </div>
            )}
            {(selected.keyPeople.length > 0 || selected.procurement.length > 0) && (
              <div className="px-5 pt-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#A79C8C]">People</h3>
                <ul className="mt-2 space-y-2">
                  {selected.keyPeople.map((p) => (
                    <li key={p.name} className="text-sm">
                      {p.storytellerSlug ? (
                        <Link href={`/storytellers/${p.storytellerSlug}`} className="font-medium hover:underline">
                          {p.name}
                        </Link>
                      ) : (
                        <span className="font-medium">{p.name}</span>
                      )}
                      <span className="text-xs text-[#8A7F72]">
                        {p.role ? ` · ${p.role}` : ''}{p.org ? ` · ${p.org}` : ''}
                      </span>
                      {p.note && <div className="text-[11px] text-[#A79C8C]">{p.note}</div>}
                    </li>
                  ))}
                  {selected.procurement.map((p) => (
                    <li key={p.name} className="text-sm">
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-1.5 rounded-full bg-[#4E8F88]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#2F6B65]">procurement</span>
                      {p.note && <div className="text-[11px] text-[#A79C8C]">{p.note}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-auto p-5">
              <Link
                href={`/admin/communities/${selected.id}`}
                className="block rounded-xl bg-[#B44D2B] px-4 py-2.5 text-center text-sm font-semibold text-[#FBF8F1] hover:bg-[#8A4B26]"
              >
                Open full {selected.name} dashboard →
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Stat({ v, l, live, warn }: { v: number; l: string; live?: boolean; warn?: boolean }) {
  return (
    <div className="rounded-xl bg-[#F5EEE4] px-3 py-2.5">
      <div className={`font-display text-xl font-bold ${live ? 'text-emerald-700' : warn ? 'text-amber-700' : 'text-[#26201B]'}`}>{v}</div>
      <div className="text-[10px] leading-tight text-[#8A7F72]">{l}</div>
    </div>
  );
}
