import { CAPITAL_STACK, QBE_PROGRAM, RAISE_TARGET } from '@/lib/data/funder-shared-content';
import { MATCH_TARGET } from '@/lib/data/loi-pipeline';
import { ConfidenceChip } from './confidence-chip';

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

// Pull a number-of-millions out of "$1.5M" / "$300K" / "Up to $400K"; null for "·".
function parseAmountM(s: string): number | null {
  const m = s.match(/([\d.]+)\s*([MK])/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2].toUpperCase() === 'M' ? n : n / 1000;
}

// Forward registers, never "secured". Live pursuit vs the match vs still-to-raise.
function registerFor(status: string): { fill: string; track: string; pill: string; pillFg: string } {
  const s = status.toLowerCase();
  if (s.includes('conditional') || s.includes('match')) {
    return { fill: 'transparent', track: RUST, pill: '#F6E4DE', pillFg: '#9A4023' }; // the match, distinct hatch register
  }
  if (s.includes('pipeline') || s.includes('raised')) {
    return { fill: 'transparent', track: '#CFC6BB', pill: '#EEE9E3', pillFg: '#6A5E54' }; // to raise
  }
  return { fill: SAGE, track: SAGE, pill: '#E6EDDD', pillFg: '#4F6138' }; // in conversation / outreach
}

const fmtAUD = (n: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);

/**
 * The forward funding picture, abstracted: layers + amounts + status, with no
 * live-prospect funder names. Committed/matched/target sit in distinct visual
 * registers so nothing forward reads as money in the bank. The only secured
 * figure (passed in, Xero-reconciled) is shown separately and COUNTED.
 */
export function CapitalStack({ securedToDate }: { securedToDate: number }) {
  const rows = CAPITAL_STACK.filter((r) => parseAmountM(r.amount) !== null).map((r) => ({
    layer: r.layer,
    amount: r.amount,
    status: r.status,
    value: parseAmountM(r.amount) as number,
  }));
  const max = Math.max(...rows.map((r) => r.value));
  const matchK = Math.round(MATCH_TARGET.cap / 1000);

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-display text-2xl sm:text-3xl" style={{ color: CHARCOAL }}>
          Target <span style={{ color: RUST }}>{RAISE_TARGET.label}</span>
        </p>
        <p className="text-sm" style={{ color: `${CHARCOAL}99` }}>{RAISE_TARGET.note}</p>
      </div>

      {/* The QBE lever */}
      <div className="mt-5 rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: `1px solid ${RUST}33` }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>The lever</p>
        <p className="mt-1 text-base leading-relaxed" style={{ color: CHARCOAL }}>
          {QBE_PROGRAM.title} will match up to <span className="font-semibold">${matchK}K</span>, but only against capital we
          raise alongside it. It is matched, not yet awarded. Closing that match is what unlocks the next stage.
        </p>
      </div>

      {/* The stack, abstracted */}
      <div className="mt-6 space-y-3">
        {rows.map((r) => {
          const reg = registerFor(r.status);
          const solid = reg.fill !== 'transparent';
          return (
            <div key={r.layer} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[180px_1fr_auto]">
              <p className="text-sm font-medium leading-snug" style={{ color: CHARCOAL }}>{r.layer}</p>
              <div className="order-3 h-2.5 w-full overflow-hidden rounded-full sm:order-none" style={{ backgroundColor: '#EFE9E2' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(6, (r.value / max) * 100)}%`,
                    backgroundColor: solid ? reg.fill : 'transparent',
                    border: solid ? 'none' : `1.5px dashed ${reg.track}`,
                  }}
                />
              </div>
              <div className="flex items-center gap-2 justify-self-end">
                <span className="text-sm font-semibold tabular-nums" style={{ color: CHARCOAL }}>{r.amount}</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: reg.pill, color: reg.pillFg }}>
                  {r.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secured so far — the one figure that is real money, kept separate */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg p-4" style={{ backgroundColor: CREAM, border: '1px solid #E8DED4' }}>
        <p className="font-display text-2xl" style={{ color: SAGE }}>{fmtAUD(securedToDate)}</p>
        <p className="text-sm" style={{ color: CHARCOAL }}>secured to date</p>
        <ConfidenceChip grade="counted" note="Xero-reconciled receipts to date. The forward figures above are targets and live conversations, not money in the bank." />
      </div>
      <p className="mt-3 text-xs leading-relaxed" style={{ color: `${CHARCOAL}80` }}>
        Forward figures are targets and live conversations, shown without naming the funders we are in discussion with. Only the secured figure is money received.
      </p>
    </div>
  );
}
