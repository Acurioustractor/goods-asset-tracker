import { getAskMap } from '@/lib/data/map-views';
import { MapShell } from '@/components/maps/map-shell';
import { INK, placeLabels, px, py } from '@/components/maps/map-geo';

/** Strip the "interested: " prefix and the "(Ben, date)" attribution the
 *  register stores, keep the reason in plain words. */
function reason(interest: string) {
  const cleaned = interest
    .replace(/^interested:\s*/i, '')
    .replace(/\s*\([^)]*\d{4}-\d{2}-\d{2}\)\s*$/, '')
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/** Wrap a reason into short label lines. */
function wrap(text: string, max: number) {
  const lines: string[] = [];
  let line = '';
  for (const w of text.split(' ')) {
    if ((`${line} ${w}`).trim().length > max) {
      if (line.trim()) lines.push(line.trim());
      line = w;
    } else {
      line = `${line} ${w}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

/**
 * VIEW 2 — THE ASK. Communities and organisations that have asked about a
 * production facility of their own. Drawn as open rings, deliberately unlike
 * the filled dots of the deployed view: nothing here is filled in yet.
 * Live from communities.facility_interest. Interest, not agreements.
 * Clean deck render: /admin/maps/ask?chrome=off
 */
export default async function AskMapView({ chrome }: { chrome: boolean }) {
  const { asked, context } = await getAskMap();

  // Wrap at 32 and do NOT truncate. A silent slice(0,3) here used to cut Tennant Creek's
  // reason mid-phrase ("making products for social" losing "enterprise"), which reads as
  // carelessness on a funder slide. placeLabels sizes the collision box from subLines, so
  // a longer reason pushes neighbours apart instead of being clipped. Keep the entries in
  // communities.facility_interest short and the labels stay tidy on their own.
  const lineMap = new Map(asked.map((p) => [p.id, wrap(reason(p.interest), 32)]));
  const placed = placeLabels(
    asked.map((p) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      r: 17,
      weight: p.beds,
      label: p.name,
      sub: 'reason',
      subLines: lineMap.get(p.id)?.length ?? 1,
    })),
  );

  return (
    <MapShell
      chrome={chrome}
      title="Who has asked for a plant of their own"
      standfirst="Communities and organisations that have asked us about running their own production facility. This is interest voiced to us, not signed agreements and not orders."
      figures={[
        { value: String(asked.length), label: 'have asked' },
        { value: '0', label: 'signed' },
      ]}
      legend={
        <>
          <span className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: INK.sageLight }} /> asked about a facility
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: '#C9BCA6' }} /> other places we work
          </span>
          <span className="font-medium" style={{ color: INK.sage }}>
            Demand signal. No commitment implied.
          </span>
        </>
      }
      footnote="Source: communities.facility_interest, Goods register"
    >
      {context.map((p) => (
        <circle key={p.id} cx={px(p.lng)} cy={py(p.lat)} r={3.2} fill="#C9BCA6" />
      ))}
      {asked.map((p) => {
        const pos = placed.get(p.id);
        if (!pos) return null;
        const lx = pos.x + pos.side * (pos.r + 12);
        const ly = pos.y + pos.lift;
        const lines = lineMap.get(p.id) ?? [];
        return (
          <g key={p.id}>
            <circle cx={pos.x} cy={pos.y} r={pos.r + 7} fill="none" stroke={INK.sageLight} strokeWidth={1} strokeOpacity={0.35} />
            <circle cx={pos.x} cy={pos.y} r={pos.r} fill={INK.paper} fillOpacity={0.65} stroke={INK.sageLight} strokeWidth={2.6} strokeDasharray="5 4" />
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
              strokeWidth={3}
              strokeLinejoin="round"
            >
              {p.name}
            </text>
            {lines.map((l, i) => (
              <text
                key={i}
                x={lx}
                y={ly + 13 + i * 11}
                textAnchor={pos.side === 1 ? 'start' : 'end'}
                fill={INK.muted}
                fontSize={9.5}
                paintOrder="stroke"
                stroke={INK.paper}
                strokeWidth={3}
                strokeLinejoin="round"
              >
                {l}
              </text>
            ))}
          </g>
        );
      })}
    </MapShell>
  );
}
