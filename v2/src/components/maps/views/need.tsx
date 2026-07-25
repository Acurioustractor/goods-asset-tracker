import { getNeedMap } from '@/lib/data/map-views';
import { MapShell } from '@/components/maps/map-shell';
import { INK, placeLabels, px, py } from '@/components/maps/map-geo';

/**
 * VIEW 3 — NEED OVERLAY. Who has asked, laid over the beds communities have
 * told us they want. Weight carries the story here: heavy shaded blooms for
 * recorded demand, a ring on top for the places that also asked for a plant.
 * Every reference figure is Modelled and labelled as such; nothing is an order.
 * Clean deck render: /admin/maps/need?chrome=off
 */
export default async function NeedMapView({ chrome }: { chrome: boolean }) {
  const { places, askedIds, wantedTotal, breakEvenBedsPerYear, handoverBedsPerSite } = await getNeedMap();

  const maxWanted = Math.max(...places.map((p) => p.wanted), 1);
  const bloomR = (wanted: number) => 12 + (wanted / maxWanted) * 34;

  const placed = placeLabels(
    places.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, r: bloomR(p.wanted), weight: p.wanted, label: p.name, sub: 'wanted' })),
  );

  const figures = [{ value: String(wantedTotal), label: 'beds asked for' }];
  if (breakEvenBedsPerYear !== null) {
    figures.push({ value: `~${breakEvenBedsPerYear}`, label: 'break-even beds/yr' });
  }
  figures.push({ value: `${handoverBedsPerSite.low}-${handoverBedsPerSite.high}`, label: 'beds/yr per site' });

  return (
    <MapShell
      chrome={chrome}
      title="What has been asked for, and what it would take"
      standfirst={
        'The beds communities have told us they want, with a ring on the places that also asked for a plant of their own. ' +
        'Recorded requests, never orders. Reference figures are Modelled.'
      }
      figures={figures}
      legend={
        <>
          <span className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full" style={{ background: `${INK.terracotta}55` }} /> beds asked for, heavier where more
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: INK.sageLight }} /> also asked for a facility
          </span>
          <span className="font-medium" style={{ color: INK.sage }}>
            Modelled: {breakEvenBedsPerYear !== null ? `~${breakEvenBedsPerYear} beds/yr covers the block, ` : ''}
            a community site stands at ~{handoverBedsPerSite.low}-{handoverBedsPerSite.high} beds/yr
          </span>
        </>
      }
      footnote="Requests from community_rollup.open_demand_qty · break-even derived from the cost model · handover band Modelled"
    >
      {places.map((p) => {
        const x = px(p.lng);
        const y = py(p.lat);
        const r = bloomR(p.wanted);
        return (
          <g key={`bloom-${p.id}`}>
            <circle cx={x} cy={y} r={r} fill={INK.terracotta} fillOpacity={0.1} />
            <circle cx={x} cy={y} r={r * 0.62} fill={INK.terracotta} fillOpacity={0.22} />
            <circle cx={x} cy={y} r={r * 0.3} fill={INK.terracotta} fillOpacity={0.5} />
            {askedIds.has(p.id) && (
              <circle cx={x} cy={y} r={r + 5} fill="none" stroke={INK.sageLight} strokeWidth={2.2} strokeDasharray="5 4" />
            )}
          </g>
        );
      })}
      {places.map((p) => {
        const pos = placed.get(p.id);
        if (!pos) return null;
        const lx = pos.x + pos.side * (pos.r + 13);
        const ly = pos.y + pos.lift;
        return (
          <g key={p.id}>
            <text
              x={lx}
              y={ly}
              textAnchor={pos.side === 1 ? 'start' : 'end'}
              fill={INK.text}
              fontSize={13}
              fontWeight={700}
              fontFamily="Georgia, serif"
              paintOrder="stroke"
              stroke={INK.paper}
              strokeWidth={3.5}
              strokeLinejoin="round"
            >
              {p.name}
            </text>
            <text
              x={lx}
              y={ly + 13}
              textAnchor={pos.side === 1 ? 'start' : 'end'}
              fill={INK.muted}
              fontSize={10}
              paintOrder="stroke"
              stroke={INK.paper}
              strokeWidth={3.5}
              strokeLinejoin="round"
            >
              {p.wanted} beds asked for{p.beds > 0 ? ` · ${p.beds} delivered` : ''}
            </text>
            {askedIds.has(p.id) && (
              <text
                x={lx}
                y={ly + 25}
                textAnchor={pos.side === 1 ? 'start' : 'end'}
                fill={INK.sage}
                fontSize={9.5}
                fontStyle="italic"
                paintOrder="stroke"
                stroke={INK.paper}
                strokeWidth={3.5}
                strokeLinejoin="round"
              >
                asked about a plant of their own
              </text>
            )}
          </g>
        );
      })}
    </MapShell>
  );
}
