'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PanelLeftOpen, X, Search } from 'lucide-react';

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

// Simplified mainland coastline (lng, lat) — recognisable silhouette, not survey-grade.
const COAST: Array<[number, number]> = [
  [113.2, -26.2], [113.7, -22.5], [114.9, -21.1], [116.7, -20.6], [118.7, -20.3],
  [121.0, -19.6], [122.3, -18.1], [123.6, -17.3], [124.8, -16.4], [126.1, -14.5],
  [127.5, -14.2], [128.2, -15.3], [129.7, -14.9], [130.8, -12.4], [132.6, -12.1],
  [132.5, -11.6], [134.2, -12.0], [135.4, -12.3], [136.9, -12.3], [136.6, -13.8],
  [135.9, -14.9], [137.0, -16.2], [138.6, -16.8], [139.9, -17.7], [140.8, -17.4],
  [141.6, -15.0], [141.4, -13.5], [142.2, -11.3], [142.6, -10.7], [143.6, -14.2],
  [144.6, -14.3], [145.3, -15.3], [146.3, -18.9], [148.8, -20.2], [149.5, -22.3],
  [150.8, -23.5], [153.1, -25.9], [153.6, -28.2], [152.5, -32.4], [151.3, -33.9],
  [150.1, -37.1], [147.9, -37.9], [146.4, -39.0], [144.7, -38.3], [143.5, -38.8],
  [141.0, -38.1], [139.7, -37.3], [139.1, -35.6], [137.8, -35.1], [138.5, -34.3],
  [137.4, -34.9], [136.9, -33.7], [135.7, -34.9], [134.2, -32.9], [131.1, -31.6],
  [127.3, -32.3], [123.6, -33.9], [121.9, -33.9], [119.5, -34.5], [117.9, -35.1],
  [115.0, -34.3], [115.6, -33.2], [115.7, -31.7], [114.6, -28.6], [113.2, -26.2],
];

const W = 900;
const H = 760;
const LNG_MIN = 112, LNG_MAX = 155, LAT_MAX = -9.5, LAT_MIN = -40.5;
const px = (lng: number) => ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
const py = (lat: number) => ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H;

const STATUS_TONE: Record<string, string> = {
  active: '#B0673B',
  testing: '#C2A85A',
  exploring: '#4E8F88',
  prospect: '#9A6B52',
  administrative: '#C9BCA8',
};

export default function AtlasClient({ communities, canon }: { communities: AtlasCommunity[]; canon: Canon }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const selected = communities.find((c) => c.id === selectedId) || null;
  const coastPath = useMemo(
    () => 'M' + COAST.map(([lng, lat]) => `${px(lng).toFixed(1)},${py(lat).toFixed(1)}`).join(' L') + ' Z',
    [],
  );
  const q = query.trim().toLowerCase();
  const matches = q
    ? communities.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.keyPeople.some((p) => p.name.toLowerCase().includes(q)) ||
          c.procurement.some((p) => p.name.toLowerCase().includes(q)),
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBFAF5]">
      {/* Top bar */}
      <div className="flex items-center gap-4 border-b bg-white px-5 py-3">
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50"
          title="Back to admin (shows the menu again)"
        >
          <PanelLeftOpen className="h-4 w-4" /> Menu
        </Link>
        <h1 className="font-display text-xl font-bold">Goods Atlas</h1>
        <div className="relative flex max-w-md flex-1 items-center gap-2 rounded-xl bg-stone-100 px-3 py-2">
          <Search className="h-4 w-4 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities and people…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
          />
          {matches && (
            <div className="absolute left-0 top-full z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
              {matches.length === 0 && <p className="px-3 py-2 text-sm text-stone-400">No matches</p>}
              {matches.map((c) => (
                <button
                  key={c.id}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-stone-50"
                  onClick={() => {
                    setSelectedId(c.id);
                    setQuery('');
                  }}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-xs text-stone-400"> · {c.beds} beds · {c.washers} washers</span>
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
              <div className="font-display text-lg font-bold leading-none text-orange-800">{v}</div>
              <div className="text-[10px] text-stone-500">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body: map + drill panel */}
      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Map of Goods communities across Australia">
            <path d={coastPath} fill="#EDE7DA" stroke="#C9BCA8" strokeWidth={1.5} />
            {communities
              .slice()
              .sort((a, b) => b.beds - a.beds)
              .map((c) => {
                const r = Math.max(9, Math.min(30, 8 + Math.sqrt(c.beds) * 2.2));
                const isSel = c.id === selectedId;
                return (
                  <g
                    key={c.id}
                    transform={`translate(${px(c.lng)},${py(c.lat)})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(isSel ? null : c.id)}
                  >
                    {c.facilityInterest && (
                      <circle r={r + 5} fill="none" stroke="#7E9A68" strokeWidth={2.5} strokeDasharray="4 3" />
                    )}
                    <circle r={r} fill={isSel ? '#8A4B26' : STATUS_TONE[c.status] || '#9A6B52'} stroke="#fff" strokeWidth={2.5} />
                    {c.beds > 0 && (
                      <text textAnchor="middle" dy="0.35em" fill="#fff" fontSize={r > 16 ? 13 : 10} fontWeight={700}>
                        {c.beds}
                      </text>
                    )}
                    {c.washers > 0 && (
                      <g transform={`translate(${r * 0.75},${-r * 0.75})`}>
                        <circle r={7.5} fill="#4E8F88" stroke="#fff" strokeWidth={1.5} />
                        <text textAnchor="middle" dy="0.35em" fill="#fff" fontSize={8} fontWeight={700}>
                          {c.washers}
                        </text>
                      </g>
                    )}
                    <text textAnchor="middle" y={r + 14} fill="#2A2620" fontSize={11} fontWeight={600}>
                      {c.name}
                    </text>
                  </g>
                );
              })}
          </svg>
          <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-xl bg-white/90 px-4 py-2 text-xs text-stone-500">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#B0673B]" /> active</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#4E8F88]" /> washers badge</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-[#7E9A68]" /> facility interest</span>
            <span>marker size = beds delivered</span>
          </div>
        </div>

        {/* Drill panel */}
        {selected && (
          <aside className="flex w-[380px] flex-col overflow-y-auto border-l bg-white">
            <div className="flex items-start justify-between gap-2 p-5 pb-3">
              <div>
                <h2 className="font-display text-2xl font-bold">{selected.name}</h2>
                {selected.traditionalName && <p className="text-sm italic text-stone-500">{selected.traditionalName} country</p>}
              </div>
              <button onClick={() => setSelectedId(null)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100" aria-label="Close panel">
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
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">People</h3>
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
                      <span className="text-xs text-stone-500">
                        {p.role ? ` · ${p.role}` : ''}{p.org ? ` · ${p.org}` : ''}
                      </span>
                      {p.note && <div className="text-[11px] text-stone-400">{p.note}</div>}
                    </li>
                  ))}
                  {selected.procurement.map((p) => (
                    <li key={p.name} className="text-sm">
                      <span className="font-medium">{p.name}</span>
                      <span className="ml-1.5 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">procurement</span>
                      {p.note && <div className="text-[11px] text-stone-400">{p.note}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-auto p-5">
              <Link
                href={`/admin/communities/${selected.id}`}
                className="block rounded-xl bg-stone-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-stone-800"
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
    <div className="rounded-xl bg-stone-50 px-3 py-2.5">
      <div className={`font-display text-xl font-bold ${live ? 'text-emerald-700' : warn ? 'text-amber-700' : 'text-stone-900'}`}>{v}</div>
      <div className="text-[10px] leading-tight text-stone-500">{l}</div>
    </div>
  );
}
