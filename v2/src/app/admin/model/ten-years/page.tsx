import Link from 'next/link';
import { ASSUMPTIONS, CLAIM_CEILING, tenYearRows, tenYearTotals } from '@/lib/data/ten-year-scale';

export const metadata = {
  title: 'Ten years, two facilities a year | Goods admin',
  robots: { index: false, follow: false },
};

const MAIN = '#C45C3E';
const COMMUNITY = '#8B9D77';
const INK = '#2B2A26';
const INK_2 = '#7A7363';
const RAIL = '#E6DFD1';

const n = (v: number) => v.toLocaleString('en-AU');
const aud = (v: number) => `$${Math.round(v).toLocaleString('en-AU')}`;

/**
 * A scale study, drawn from src/lib/data/ten-year-scale.ts. One axis, two series,
 * a legend, and the value labelled on the last bar only. Every figure carries its
 * basis; the claim ceiling sits under the chart.
 */
export default function TenYearScalePage() {
  const rows = tenYearRows();
  const totals = tenYearTotals();
  const W = 960;
  const H = 360;
  const padL = 64;
  const padB = 44;
  const padT = 16;
  const plotW = W - padL - 16;
  const plotH = H - padT - padB;
  const max = Math.max(...rows.map((r) => r.bedsTotal));
  const step = 4000;
  const top = Math.ceil(max / step) * step;
  const barW = Math.floor(plotW / rows.length) - 14;
  const y = (v: number) => padT + plotH - (v / top) * plotH;
  const last = rows[rows.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold">Ten years, if two facilities open every year</h1>
        <p className="text-sm text-muted-foreground">
          A scale study from the model. <Link href="/admin/model">The placemat</Link>.
        </p>
      </div>

      <div className="rounded-xl border p-4" style={{ borderColor: RAIL, background: '#FBF8F1' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Beds made each year, main facility and community facilities">
          {Array.from({ length: top / step + 1 }, (_, i) => i * step).map((v) => (
            <g key={v}>
              <line x1={padL} x2={W - 16} y1={y(v)} y2={y(v)} stroke={RAIL} strokeWidth={1} />
              <text x={padL - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fill={INK_2} fontFamily="Inter, system-ui, sans-serif">
                {n(v)}
              </text>
            </g>
          ))}
          {rows.map((r, i) => {
            const x = padL + i * (plotW / rows.length) + 7;
            const hMain = y(0) - y(r.bedsMain);
            const hComm = y(0) - y(r.bedsCommunity);
            const yMain = y(r.bedsMain);
            const yComm = yMain - hComm - 2;
            return (
              <g key={r.year}>
                <rect x={x} y={yMain} width={barW} height={hMain} fill={MAIN} rx={3} />
                {hComm > 0 ? <rect x={x} y={yComm} width={barW} height={hComm} fill={COMMUNITY} rx={3} /> : null}
                <text x={x + barW / 2} y={H - padB + 18} textAnchor="middle" fontSize={12} fill={INK} fontFamily="Inter, system-ui, sans-serif">
                  {r.label}
                </text>
                <text x={x + barW / 2} y={H - padB + 34} textAnchor="middle" fontSize={11} fill={INK_2} fontFamily="Inter, system-ui, sans-serif">
                  {r.facilitiesOpen} facilities
                </text>
                {i === rows.length - 1 ? (
                  <text x={x + barW / 2} y={yComm - 8} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK} fontFamily="Inter, system-ui, sans-serif">
                    {n(r.bedsTotal)} beds
                  </text>
                ) : null}
              </g>
            );
          })}
          <line x1={padL} x2={W - 16} y1={y(0)} y2={y(0)} stroke={INK} strokeWidth={1} />
        </svg>
        <div className="mt-3 flex flex-wrap gap-6 text-sm" style={{ color: INK_2 }}>
          <span className="inline-flex items-center gap-2">
            <i className="inline-block h-3 w-3 rounded-sm" style={{ background: MAIN }} /> Beds made at the Goods on Country facility
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="inline-block h-3 w-3 rounded-sm" style={{ background: COMMUNITY }} /> Beds made at community facilities
          </span>
        </div>
        <p className="mt-4 max-w-4xl text-sm" style={{ color: INK_2 }}>
          {CLAIM_CEILING}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide" style={{ color: INK_2 }}>
              <th className="py-2 pr-3">Year</th>
              <th className="py-2 pr-3 text-right">Facilities open</th>
              <th className="py-2 pr-3 text-right">Beds, main</th>
              <th className="py-2 pr-3 text-right">Beds, community</th>
              <th className="py-2 pr-3 text-right">Beds, total</th>
              <th className="py-2 pr-3 text-right">Paid hours</th>
              <th className="py-2 pr-3 text-right">Tonnes recycled</th>
              <th className="py-2 pr-3 text-right">Enterprises trading</th>
              <th className="py-2 pr-3 text-right">Local capital if all sold</th>
              <th className="py-2 pr-3 text-right">To Goods at $288</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className="border-t" style={{ borderColor: RAIL }}>
                <td className="py-2 pr-3">{r.label}</td>
                <td className="py-2 pr-3 text-right">{r.facilitiesOpen}</td>
                <td className="py-2 pr-3 text-right">{n(r.bedsMain)}</td>
                <td className="py-2 pr-3 text-right">{n(r.bedsCommunity)}</td>
                <td className="py-2 pr-3 text-right">{n(r.bedsTotal)}</td>
                <td className="py-2 pr-3 text-right">{n(r.paidHours)}</td>
                <td className="py-2 pr-3 text-right">{r.tonnesRecycled.toFixed(1)}</td>
                <td className="py-2 pr-3 text-right">{r.enterprisesTrading}</td>
                <td className="py-2 pr-3 text-right">{aud(r.localCapitalAud)}</td>
                <td className="py-2 pr-3 text-right">{aud(r.contributionToGoodsAud)}</td>
              </tr>
            ))}
            <tr className="border-t font-semibold" style={{ borderColor: INK }}>
              <td className="py-2 pr-3">Ten years</td>
              <td className="py-2 pr-3 text-right">{totals.facilitiesOpen}</td>
              <td className="py-2 pr-3 text-right">{n(totals.bedsMain)}</td>
              <td className="py-2 pr-3 text-right">{n(totals.bedsCommunity)}</td>
              <td className="py-2 pr-3 text-right">{n(totals.bedsTotal)}</td>
              <td className="py-2 pr-3 text-right">{n(totals.paidHours)}</td>
              <td className="py-2 pr-3 text-right">{totals.tonnesRecycled.toFixed(1)}</td>
              <td className="py-2 pr-3 text-right">{totals.enterprisesTrading}</td>
              <td className="py-2 pr-3 text-right">{aud(totals.localCapitalAud)}</td>
              <td className="py-2 pr-3 text-right">{aud(totals.contributionToGoodsAud)}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-xs" style={{ color: INK_2 }}>
          Last two columns: local capital assumes every community-made bed is sold at $750 and stays with the community organisation; the Goods column is main-facility beds at $288 each and is the only money that reaches Goods on Country.
        </p>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold">Every assumption, and where it comes from</h2>
        <table className="mt-2 w-full text-sm">
          <tbody>
            {Object.values(ASSUMPTIONS).map((a) => (
              <tr key={a.key} className="border-t align-top" style={{ borderColor: RAIL }}>
                <td className="py-2 pr-3 whitespace-nowrap">
                  {n(a.value)} {a.unit}
                </td>
                <td className="py-2 pr-3 whitespace-nowrap uppercase text-xs" style={{ color: INK_2 }}>
                  {a.basis}
                </td>
                <td className="py-2" style={{ color: INK_2 }}>
                  {a.source}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
