import { getDeployedMap } from '@/lib/data/map-views';
import { MapShell } from '@/components/maps/map-shell';
import { INK, placeLabels, px, py, runPath } from '@/components/maps/map-geo';

/**
 * VIEW 1 — DEPLOYED. Filled dots sized by bed volume, with a small solid
 * washer dot tucked against each place that has machines. Live from the
 * assets register; washers per community come from the canon 22 ruling.
 * Clean deck render: /admin/maps/deployed?chrome=off
 */
export default async function DeployedMapView({ chrome }: { chrome: boolean }) {
  const { places, canon, washersReconcile, washerSum } = await getDeployedMap();

  const bedR = (beds: number) => Math.max(6, Math.min(26, 5 + Math.sqrt(beds) * 2));
  const placed = placeLabels(
    places.map((p) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      r: bedR(p.beds),
      weight: p.beds + p.washers * 3,
      label: p.name,
      sub: 'counts',
    })),
  );

  return (
    <MapShell
      chrome={chrome}
      title="Where the beds are"
      standfirst="Every bed and every washing machine sitting in a community today, counted off the register."
      figures={[
        { value: String(canon.bedsDeployed), label: 'beds' },
        { value: String(canon.stretchBedsDeployed), label: 'Stretch' },
        { value: String(canon.basketBedsDeployed), label: 'Basket' },
        { value: String(canon.washersInCommunity), label: 'washers' },
        { value: String(canon.communitiesServed), label: 'communities' },
        { value: `${canon.plasticKg.toLocaleString()}kg`, label: 'HDPE' },
      ]}
      legend={
        <>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: INK.terracotta }} /> beds in community, sized by number
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: INK.sage }} /> washing machines
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0 w-5 border-t-2" style={{ borderColor: `${INK.terracotta}80` }} /> delivery run from the plant
          </span>
        </>
      }
      footnote={washersReconcile ? undefined : `washer dots sum to ${washerSum}, header says ${canon.washersInCommunity}`}
    >
      <g fill="none">
        {places.map((p) => (
          <path
            key={`run-${p.id}`}
            d={runPath(px(p.lng), py(p.lat))}
            stroke={INK.terracotta}
            strokeWidth={1.2}
            strokeOpacity={0.26}
            strokeLinecap="round"
          />
        ))}
      </g>
      {places.map((p) => {
        const pos = placed.get(p.id);
        if (!pos) return null;
        const lx = pos.x + pos.side * (pos.r + 11);
        const ly = pos.y + pos.lift;
        const counts = [
          p.beds > 0 ? `${p.beds} bed${p.beds === 1 ? '' : 's'}` : null,
          p.washers > 0 ? `${p.washers} washer${p.washers === 1 ? '' : 's'}` : null,
        ]
          .filter(Boolean)
          .join(' · ');
        return (
          <g key={p.id}>
            <circle cx={pos.x} cy={pos.y} r={pos.r} fill={INK.terracotta} fillOpacity={0.92} stroke="#FFFFFF" strokeWidth={2.2} />
            {p.washers > 0 && (
              <circle cx={pos.x + pos.r * 0.72} cy={pos.y - pos.r * 0.72} r={5} fill={INK.sage} stroke="#FFFFFF" strokeWidth={1.8} />
            )}
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
              fill={INK.text}
              fontSize={12.5}
              fontWeight={700}
              fontFamily="Georgia, serif"
              paintOrder="stroke"
              stroke={INK.paper}
              strokeWidth={3}
              strokeLinejoin="round"
            >
              {p.name}
            </text>
            <text
              x={lx}
              y={ly + 12}
              textAnchor={pos.side === 1 ? 'start' : 'end'}
              fill={INK.muted}
              fontSize={10}
              paintOrder="stroke"
              stroke={INK.paper}
              strokeWidth={3}
              strokeLinejoin="round"
            >
              {counts}
            </text>
          </g>
        );
      })}
    </MapShell>
  );
}
