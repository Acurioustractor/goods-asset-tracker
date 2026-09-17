/**
 * THE GROWTH, AND WHO MADE IT HAPPEN.
 *
 * Ben, 17 September 2026: show growth over time, and how it grows when it is led from Indigenous
 * community. Get rid of the writing and draw the thing.
 *
 * Every step on this line is a real invoice. What the labels do is the argument: the buyers are
 * an Aboriginal charitable trust, an Aboriginal community controlled health service and a
 * homelands school company, and two of them came back. Nobody has to assert that community
 * leadership is what makes this grow, because the names on the steps say it.
 *
 * A step, never a slope. A smooth curve between invoices would draw beds that were never bought,
 * and the flat stretches are part of the truth: this grows in jumps, when an organisation decides.
 *
 * Nothing continues past the last invoice. A dashed line heading up and to the right is a
 * forecast wearing a drawing's clothes, and we do not have one.
 */

import { PAID_INVOICES } from '@/lib/data/paid-trade';

const LINE = '#C45C3E';
const FILL = '#F6E4DE';
const INK = '#2E2E2E';
const FAINT = '#A2958A';
const RULE = '#E8DED4';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const when = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
/** "Mala'la Health Service Aboriginal Corporation" will not fit over a marker. Its first two words will. */
const shortBuyer = (b: string) => (b.length <= 22 ? b : `${b.split(' ').slice(0, 2).join(' ')}`);

export function GrowthOverTime() {
  const sorted = [...PAID_INVOICES].sort((a, b) => a.invoiceDate.localeCompare(b.invoiceDate));
  if (sorted.length === 0) return null;
  const pts = sorted.map((inv, idx) => ({
    date: inv.invoiceDate,
    total: sorted.slice(0, idx + 1).reduce((sum, x) => sum + x.beds, 0),
    added: inv.beds,
    buyer: inv.buyer,
    place: inv.forPlace,
  }));

  const W = 1000;
  const H = 430;
  const L = 52;
  const R = 116;
  const T = 104;
  const B = 74;
  const t0 = Date.parse(pts[0].date);
  const t1 = Date.parse(pts[pts.length - 1].date);
  const span = Math.max(t1 - t0, 1);
  const top = pts[pts.length - 1].total;
  const x = (iso: string) => L + ((Date.parse(iso) - t0) / span) * (W - L - R);
  const y = (v: number) => H - B - (v / top) * (H - T - B);

  const steps = pts
    .map((p, i) => (i === 0 ? `M ${x(p.date)} ${y(0)} L ${x(p.date)} ${y(p.total)}` : `L ${x(p.date)} ${y(pts[i - 1].total)} L ${x(p.date)} ${y(p.total)}`))
    .join(' ');
  const area = `${steps} L ${x(pts[pts.length - 1].date)} ${y(0)} Z`;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Beds bought and paid for, rising to ${top} across ${pts.length} invoices between ${when(pts[0].date)} and ${when(pts[pts.length - 1].date)}.`}
      >
        <line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke={RULE} strokeWidth="1" />
        <path d={area} fill={FILL} />
        <path d={steps} fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" />

        {pts.map((p, i) => {
          const lift = i % 2 === 0 ? 34 : 74;
          return (
            <g key={p.date}>
              <line x1={x(p.date)} y1={y(p.total)} x2={x(p.date)} y2={y(p.total) - lift + 16} stroke={RULE} strokeWidth="1" />
              <text x={x(p.date)} y={y(p.total) - lift} textAnchor="middle" fontSize="14" fill={INK}>
                {shortBuyer(p.buyer)}
              </text>
              <text x={x(p.date)} y={y(p.total) - lift + 16} textAnchor="middle" fontSize="12" fill={FAINT}>
                {p.place}
              </text>
              <circle cx={x(p.date)} cy={y(p.total)} r="6" fill="#FDF8F3" stroke={LINE} strokeWidth="2" />
              <text x={x(p.date)} y={H - B + 22} textAnchor="middle" fontSize="12" fill={FAINT}>
                {when(p.date)}
              </text>
              <text x={x(p.date)} y={H - B + 40} textAnchor="middle" fontSize="13" fill={LINE}>
                +{p.added}
              </text>
            </g>
          );
        })}

        <text x={W - R + 14} y={y(top) + 4} fontSize="34" fill={INK}>{top}</text>
        <text x={W - R + 14} y={y(top) + 26} fontSize="13" fill={FAINT}>beds bought</text>
        <text x={W - R + 14} y={y(top) + 44} fontSize="13" fill={FAINT}>and paid for</text>
      </svg>
    </figure>
  );
}
