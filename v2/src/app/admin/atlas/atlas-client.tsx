'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PanelLeftOpen, X, Search, Landmark } from 'lucide-react';
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
  photos: string[];
  photoCount: number;
  videoCount: number;
  voices: Array<{ name: string; elder: boolean; portrait: string | null }>;
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
 * Web-Mercator SVG paths at build time into australia-map.json. The
 * projection here MUST match that bake exactly.
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
const PLANT = { lng: 133.8807, lat: -23.698, label: 'the plant' };

const STATUS_TONE: Record<string, string> = {
  active: '#A34523',
  testing: '#B08A2E',
  exploring: '#3E7B74',
  prospect: '#8A5A40',
  administrative: '#B5A791',
};

const markerR = (beds: number) => Math.max(6, Math.min(24, 5 + Math.sqrt(beds) * 1.9));

/** Curved "run" from the plant to a community. */
function runPath(cx: number, cy: number) {
  const x0 = px(PLANT.lng);
  const y0 = py(PLANT.lat);
  const dx = cx - x0;
  const dy = cy - y0;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return '';
  const bow = Math.min(60, dist * 0.14);
  const qx = (x0 + cx) / 2 - (dy / dist) * bow;
  const qy = (y0 + cy) / 2 + (dx / dist) * bow;
  return `M${x0},${y0} Q${qx.toFixed(1)},${qy.toFixed(1)} ${cx},${cy}`;
}

interface Rect { x1: number; y1: number; x2: number; y2: number }
const overlaps = (a: Rect, b: Rect) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;

interface Placement { x: number; y: number; r: number; side: 1 | -1; lift: number; small: boolean }

export default function AtlasClient({ communities, canon }: { communities: AtlasCommunity[]; canon: Canon }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [showCountry, setShowCountry] = useState(false);

  const selected = communities.find((c) => c.id === selectedId) || null;
  const q = query.trim().toLowerCase();
  const matches = q
    ? communities.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.keyPeople.some((p) => p.name.toLowerCase().includes(q)) ||
          c.voices.some((v) => v.name.toLowerCase().includes(q)) ||
          c.procurement.some((p) => p.name.toLowerCase().includes(q)),
      )
    : null;

  /**
   * Greedy collision-free label layout. Biggest communities place first;
   * each label tries side × vertical-step candidates until it finds a spot
   * that doesn't overlap any marker or already-placed label. Small
   * communities (no beds/washers) get a compact single-line label.
   */
  const placed = useMemo(() => {
    const items = communities
      .map((c) => ({ c, x: px(c.lng), y: py(c.lat), r: markerR(c.beds) }))
      .sort((a, b) => b.c.beds + b.c.washers * 3 - (a.c.beds + a.c.washers * 3));
    const rects: Rect[] = items.map((p) => ({ x1: p.x - p.r - 2, y1: p.y - p.r - 2, x2: p.x + p.r + 2, y2: p.y + p.r + 2 }));
    // reserve the plant label zone
    const plx = px(PLANT.lng);
    const ply = py(PLANT.lat);
    rects.push({ x1: plx - 40, y1: ply - 12, x2: plx + 40, y2: ply + 30 });

    const out = new Map<string, Placement>();
    for (const p of items) {
      const small = p.c.beds === 0 && p.c.washers === 0;
      const nameW = p.c.name.length * (small ? 5.8 : 7.2);
      const w = Math.max(nameW, small ? 0 : 74) + 10;
      const h = small ? 15 : 27;
      const lifts = [0, -16, 16, -30, 30, -46, 46, -64, 64];
      let chosen: { side: 1 | -1; lift: number } | null = null;
      outer: for (const lift of lifts) {
        for (const side of (p.x > W * 0.5 ? [-1, 1] : [1, -1]) as Array<1 | -1>) {
          const lx = p.x + side * (p.r + 11);
          const ly = p.y + lift;
          const rect: Rect =
            side === 1
              ? { x1: lx - 2, y1: ly - 12, x2: lx + w, y2: ly - 12 + h }
              : { x1: lx - w, y1: ly - 12, x2: lx + 2, y2: ly - 12 + h };
          if (rect.x1 < 4 || rect.x2 > W - 4 || rect.y1 < 4 || rect.y2 > H - 4) continue;
          if (!rects.some((r) => overlaps(r, rect))) {
            rects.push(rect);
            chosen = { side, lift };
            break outer;
          }
        }
      }
      const fallback = { side: (p.x > W * 0.5 ? -1 : 1) as 1 | -1, lift: 0 };
      const pick = chosen || fallback;
      out.set(p.c.id, { x: p.x, y: p.y, r: p.r, side: pick.side, lift: pick.lift, small });
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
            placeholder="Search communities, people, voices…"
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
        <button
          onClick={() => setShowCountry((v) => !v)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
            showCountry
              ? 'border-[#4E8F88] bg-[#4E8F88]/10 text-[#2F6B65]'
              : 'border-[#E0D5C2] text-[#6E645A] hover:bg-[#EAE0D0]'
          }`}
          title="Show the Country name each community has told us, alongside the town name"
        >
          <Landmark className="h-4 w-4" /> Country names
        </button>
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
              <filter id="landShadow" x="-4%" y="-4%" width="108%" height="108%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#26201B" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* Land — flat pale mass so the terracotta markers own the contrast */}
            <g filter="url(#landShadow)">
              {AUS.states.map((s: { name: string; d: string }) => (
                <path key={s.name} d={s.d} fill="#F3ECDD" stroke="none" />
              ))}
            </g>
            {AUS.states.map((s: { name: string; d: string }) => (
              <path key={`b-${s.name}`} d={s.d} fill="none" stroke="#DFD2B8" strokeWidth={0.6} strokeLinejoin="round" />
            ))}

            {/* The runs — plant → community */}
            <g fill="none">
              {communities
                .filter((c) => c.beds > 0 || c.washers > 0)
                .map((c) => {
                  const dim = (hoverId || selectedId) && hoverId !== c.id && selectedId !== c.id;
                  return (
                    <path
                      key={`run-${c.id}`}
                      d={runPath(px(c.lng), py(c.lat))}
                      stroke="#B44D2B"
                      strokeWidth={c.id === (hoverId || selectedId) ? 2.2 : 1.2}
                      strokeOpacity={dim ? 0.08 : 0.28}
                      strokeDasharray={c.status === 'active' || c.status === 'testing' ? undefined : '5 5'}
                      strokeLinecap="round"
                    />
                  );
                })}
            </g>

            {/* The plant */}
            <g transform={`translate(${px(PLANT.lng)},${py(PLANT.lat)})`}>
              <rect x={-5.5} y={-5.5} width={11} height={11} rx={2.5} transform="rotate(45)" fill="#26201B" stroke="#FBF8F1" strokeWidth={2} />
              <text x={0} y={24} textAnchor="middle" fill="#6E645A" fontSize={10} fontStyle="italic" fontFamily="Georgia, serif">
                {PLANT.label}
              </text>
            </g>

            {/* Communities — collision-free callouts */}
            {communities.map((c) => {
              const pos = placed.get(c.id);
              if (!pos) return null;
              const isSel = c.id === selectedId;
              const isHover = c.id === hoverId;
              const dim = (hoverId || selectedId) && !isSel && !isHover;
              const lx = pos.x + pos.side * (pos.r + 11);
              const ly = pos.y + pos.lift;
              const counts = [c.beds > 0 ? `${c.beds} beds` : null, c.washers > 0 ? `${c.washers} washers` : null]
                .filter(Boolean)
                .join(' · ');
              return (
                <g
                  key={c.id}
                  className="cursor-pointer"
                  opacity={dim ? 0.38 : 1}
                  onClick={() => setSelectedId(isSel ? null : c.id)}
                  onMouseEnter={() => setHoverId(c.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  {c.facilityInterest && (
                    <circle cx={pos.x} cy={pos.y} r={pos.r + 4.5} fill="none" stroke="#4E8F88" strokeWidth={2} strokeDasharray="4 3" />
                  )}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={pos.r}
                    fill={isSel || isHover ? '#7E3C1D' : STATUS_TONE[c.status] || '#8A5A40'}
                    stroke="#FFFFFF"
                    strokeWidth={2.2}
                  />
                  {c.signals30d > 0 && (
                    <circle cx={pos.x} cy={pos.y} r={pos.r + 2} fill="none" stroke="#B44D2B" strokeWidth={1.2} strokeOpacity={0.55} />
                  )}

                  {/* leader + label */}
                  {pos.lift !== 0 && (
                    <path
                      d={`M${pos.x + pos.side * (pos.r + 1)},${pos.y} L${lx - pos.side * 3},${ly - 4}`}
                      stroke="#B5A791"
                      strokeWidth={0.9}
                      fill="none"
                    />
                  )}
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={pos.side === 1 ? 'start' : 'end'}
                    fill={pos.small ? '#7A6F62' : '#26201B'}
                    fontSize={pos.small ? 10.5 : 12.5}
                    fontWeight={pos.small ? 500 : 700}
                    fontFamily="Georgia, serif"
                    paintOrder="stroke"
                    stroke="#FBF8F1"
                    strokeWidth={3}
                    strokeLinejoin="round"
                  >
                    {c.name}
                  </text>
                  {!pos.small && counts && (
                    <text
                      x={lx}
                      y={ly + 12}
                      textAnchor={pos.side === 1 ? 'start' : 'end'}
                      fill="#8A7F72"
                      fontSize={10}
                      paintOrder="stroke"
                      stroke="#FBF8F1"
                      strokeWidth={3}
                      strokeLinejoin="round"
                    >
                      {counts}
                    </text>
                  )}
                  {showCountry && c.traditionalName && (
                    <text
                      x={lx}
                      y={ly + (pos.small ? 11 : counts ? 24 : 12)}
                      textAnchor={pos.side === 1 ? 'start' : 'end'}
                      fill="#2F6B65"
                      fontSize={10}
                      fontStyle="italic"
                      fontFamily="Georgia, serif"
                      paintOrder="stroke"
                      stroke="#FBF8F1"
                      strokeWidth={3}
                      strokeLinejoin="round"
                    >
                      {c.traditionalName} country
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-xl border border-[#E5DCCB] bg-[#F5EEE4]/95 px-4 py-2 text-xs text-[#6E645A]">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#A34523]" /> active</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#3E7B74]" /> exploring</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#26201B]" /> the plant</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-0 w-5 border-t-2 border-[#B44D2B]/50" /> delivery run</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-[#4E8F88]" /> facility interest</span>
          </div>
          {showCountry && (
            <p className="absolute bottom-14 left-4 max-w-md rounded-lg bg-[#4E8F88]/10 px-3 py-1.5 text-[11px] text-[#2F6B65]">
              Country names as each community has told us. Language-group boundaries need an AIATSIS licence — a Ben/community decision, tracked on the QBE hub.
            </p>
          )}
          <p className="absolute bottom-4 right-4 text-[10px] text-[#A79C8C]">Boundaries: ABS ASGS (CC-BY 4.0)</p>
        </div>

        {/* Drill panel */}
        {selected && (
          <aside className="flex w-[400px] flex-col overflow-y-auto border-l border-[#E5DCCB] bg-white">
            <div className="flex items-start justify-between gap-2 p-5 pb-3">
              <div>
                <h2 className="font-display text-2xl font-bold">{selected.name}</h2>
                {selected.traditionalName && <p className="text-sm italic text-[#8A7F72]">{selected.traditionalName} country</p>}
              </div>
              <button onClick={() => setSelectedId(null)} className="rounded-lg p-1.5 text-[#A79C8C] hover:bg-[#F5EEE4]" aria-label="Close panel">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Photos first — the place should look like a place */}
            {selected.photos.length > 0 && (
              <div className="px-5">
                <div className="grid grid-cols-4 gap-1 overflow-hidden rounded-xl">
                  {selected.photos.map((src, i) => (
                    <img key={i} src={src} alt="" className="aspect-square w-full object-cover" loading="lazy" />
                  ))}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#8A7F72]">
                  <span>
                    {selected.photoCount} photos{selected.videoCount > 0 ? ` · ${selected.videoCount} videos` : ''}
                  </span>
                  <Link href="/admin/media-library" className="font-medium text-[#B44D2B] hover:underline">
                    Open in media library →
                  </Link>
                </div>
              </div>
            )}
            {selected.photos.length === 0 && (
              <p className="mx-5 rounded-lg bg-[#F5EEE4] px-3 py-2 text-xs text-[#8A7F72]">
                No community-tagged media yet — tag some in the <Link href="/admin/media-library" className="font-medium text-[#B44D2B] hover:underline">media library</Link>.
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 px-5">
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

            {/* Voices — storytellers from this place */}
            {selected.voices.length > 0 && (
              <div className="px-5 pt-4">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#A79C8C]">
                  Voices ({selected.voices.length})
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {selected.voices.map((v) => (
                    <li key={v.name} className="flex items-center gap-2.5 text-sm">
                      {v.portrait ? (
                        <img src={v.portrait} alt="" className="h-7 w-7 rounded-full object-cover" loading="lazy" />
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5EEE4] text-[10px] font-semibold text-[#8A7F72]">
                          {v.name.slice(0, 1)}
                        </span>
                      )}
                      <span className="font-medium">{v.name}</span>
                      {v.elder && (
                        <span className="rounded-full bg-[#B44D2B]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#B44D2B]">Elder</span>
                      )}
                    </li>
                  ))}
                </ul>
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

            <div className="mt-auto space-y-2 p-5">
              <Link
                href={`/admin/communities/${selected.id}`}
                className="block rounded-xl bg-[#B44D2B] px-4 py-2.5 text-center text-sm font-semibold text-[#FBF8F1] hover:bg-[#8A4B26]"
              >
                Open full {selected.name} dashboard →
              </Link>
              <div className="flex gap-2 text-center text-xs">
                <Link href="/admin/voice-impact" className="flex-1 rounded-lg border border-[#E0D5C2] px-2 py-1.5 text-[#6E645A] hover:bg-[#F5EEE4]">
                  Voice impact
                </Link>
                <Link href="/admin/community-stories" className="flex-1 rounded-lg border border-[#E0D5C2] px-2 py-1.5 text-[#6E645A] hover:bg-[#F5EEE4]">
                  Stories
                </Link>
              </div>
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
