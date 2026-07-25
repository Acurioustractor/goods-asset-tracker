'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AUS from '@/lib/data/australia-map.json';

export interface MapCommunity {
  id: string;
  name: string;
  lat: number;
  lng: number;
  beds: number;
  washers: number;
  signals30d: number;
  facilityInterest: string | null;
  status: string;
}

// Projection MUST match the atlas bake (australia-map.json is pre-projected to
// Web-Mercator). Kept in sync with app/admin/atlas/atlas-client.tsx.
const W: number = AUS.w;
const H: number = AUS.h;
const [LNG_MIN, LNG_MAX, LAT_MIN, LAT_MAX] = AUS.bounds as [number, number, number, number];
const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const Y_TOP = mercY(LAT_MAX);
const Y_BOT = mercY(LAT_MIN);
const px = (lng: number) => ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W;
const py = (lat: number) => ((Y_TOP - mercY(lat)) / (Y_TOP - Y_BOT)) * H;

const PLANT = { lng: 133.8807, lat: -23.698, label: 'the plant' };

const STATUS_TONE: Record<string, string> = {
  active: '#A34523',
  testing: '#B08A2E',
  exploring: '#3E7B74',
  prospect: '#8A5A40',
  administrative: '#B5A791',
};

const markerR = (beds: number) => Math.max(6, Math.min(24, 5 + Math.sqrt(beds) * 1.9));

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

/**
 * The map card on The Map home. A compact, faithful cut of the Atlas: real
 * geometry, delivery runs from the plant, dots sized by beds, washer badges,
 * facility-interest rings, live-signal halos. Click a place to drill into its
 * community page; the header link opens the full Atlas.
 */
export default function MapCard({ communities }: { communities: MapCommunity[] }) {
  const router = useRouter();
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Right-side labels for the places with the most beds, so the card stays legible.
  const labelled = new Set(
    [...communities].sort((a, b) => b.beds - a.beds).slice(0, 8).map((c) => c.id),
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="img"
      aria-label="Map of Goods communities across Australia, delivery runs from the Alice Springs plant"
    >
      <defs>
        <filter id="mapHomeLandShadow" x="-4%" y="-4%" width="108%" height="108%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#26201B" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Land */}
      <g filter="url(#mapHomeLandShadow)">
        {AUS.states.map((s: { name: string; d: string }) => (
          <path key={s.name} d={s.d} fill="#F3ECDD" stroke="none" />
        ))}
      </g>
      {AUS.states.map((s: { name: string; d: string }) => (
        <path key={`b-${s.name}`} d={s.d} fill="none" stroke="#DFD2B8" strokeWidth={0.6} strokeLinejoin="round" />
      ))}

      {/* Runs */}
      <g fill="none">
        {communities
          .filter((c) => c.beds > 0 || c.washers > 0)
          .map((c) => {
            const dim = hoverId && hoverId !== c.id;
            return (
              <path
                key={`run-${c.id}`}
                d={runPath(px(c.lng), py(c.lat))}
                stroke="#B44D2B"
                strokeWidth={c.id === hoverId ? 2.2 : 1.2}
                strokeOpacity={dim ? 0.08 : 0.26}
                strokeDasharray={c.status === 'active' || c.status === 'testing' ? undefined : '5 5'}
                strokeLinecap="round"
              />
            );
          })}
      </g>

      {/* Plant */}
      <g transform={`translate(${px(PLANT.lng)},${py(PLANT.lat)})`}>
        <rect x={-5.5} y={-5.5} width={11} height={11} rx={2.5} transform="rotate(45)" fill="#26201B" stroke="#FBF8F1" strokeWidth={2} />
        <text x={0} y={24} textAnchor="middle" fill="#6E645A" fontSize={10} fontStyle="italic" fontFamily="Georgia, serif">
          {PLANT.label}
        </text>
      </g>

      {/* Communities */}
      {communities.map((c) => {
        const x = px(c.lng);
        const y = py(c.lat);
        const r = markerR(c.beds);
        const isHover = c.id === hoverId;
        const dim = hoverId && !isHover;
        const showLabel = labelled.has(c.id) || isHover;
        const counts = [c.beds > 0 ? `${c.beds} beds` : null, c.washers > 0 ? `${c.washers} washers` : null]
          .filter(Boolean)
          .join(' · ');
        return (
          <g
            key={c.id}
            className="cursor-pointer"
            opacity={dim ? 0.4 : 1}
            onClick={() => router.push(`/admin/communities/${c.id}`)}
            onMouseEnter={() => setHoverId(c.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            {c.facilityInterest && (
              <circle cx={x} cy={y} r={r + 4.5} fill="none" stroke="#4E8F88" strokeWidth={2} strokeDasharray="4 3" />
            )}
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={isHover ? '#7E3C1D' : STATUS_TONE[c.status] || '#8A5A40'}
              stroke="#FFFFFF"
              strokeWidth={2.2}
            />
            {c.washers > 0 && (
              <circle cx={x + r * 0.72} cy={y - r * 0.72} r={3.4} fill="#4E8F88" stroke="#FFFFFF" strokeWidth={1.4} />
            )}
            {c.signals30d > 0 && (
              <circle cx={x} cy={y} r={r + 2} fill="none" stroke="#B44D2B" strokeWidth={1.2} strokeOpacity={0.55} />
            )}
            {showLabel && (
              <>
                <text
                  x={x + r + 6}
                  y={y - 1}
                  fill="#26201B"
                  fontSize={12.5}
                  fontWeight={700}
                  fontFamily="Georgia, serif"
                  paintOrder="stroke"
                  stroke="#FBF8F1"
                  strokeWidth={3}
                  strokeLinejoin="round"
                >
                  {c.name}
                </text>
                {counts && (
                  <text
                    x={x + r + 6}
                    y={y + 11}
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
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
