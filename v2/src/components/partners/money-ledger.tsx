/**
 * EVERY PAYMENT, IN ORDER, AS A LEDGER.
 *
 * Ben, 17 September 2026, on a step chart of the same data: "this is shit, make a better version
 * of something else." He is right that it was a widget. A chart of eleven points is a picture of
 * a list, and the list is better, because a foundation reading a report about its own money
 * wants the rows.
 *
 * WHAT IT ARGUES, WITHOUT ARGUING. The rows are in date order and each is marked given or
 * bought. You read down: given, given, given, given, then eleven months of nothing bought, then
 * the first invoice, and after that both lanes run. Nobody writes the word catalytic anywhere
 * near it. The order does the work, and every row is a payment that cleared.
 *
 * The gap is drawn once, where it happens, because it is the only editorial line in the whole
 * table and it earns its place by being the thing the table is for.
 */

import type { MoneyEventData } from '@/lib/data/snow-partnership';

const RUST = '#C45C3E';
const INK = '#2E2E2E';
const MUTED = '#A2958A';
const RULE = '#E8DED4';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const stamp = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
};
const money = (n: number) =>
  `$${n.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export function MoneyLedger({ events, monthsBefore }: { events: readonly MoneyEventData[]; monthsBefore: number }) {
  const rows = events.slice().sort((a, b) => a.on.localeCompare(b.on));
  const firstBought = rows.findIndex((r) => r.kind === 'bought');

  return (
    <div className="overflow-hidden rounded-lg" style={{ border: `1px solid ${RULE}`, backgroundColor: '#FFFFFF' }}>
      {rows.map((r, i) => (
        <div key={`${r.on}-${r.label}`}>
          {i === firstBought && firstBought > 0 && (
            <div className="flex items-baseline gap-4 px-5 py-4 sm:px-7" style={{ backgroundColor: '#F6F0E6', borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}>
              <span className="font-display text-2xl leading-none tabular-nums" style={{ color: RUST }}>{monthsBefore}</span>
              <p className="text-sm leading-relaxed" style={{ color: `${INK}cc` }}>
                months, and not one bed had been bought by anybody. Everything above this line was
                given.
              </p>
            </div>
          )}
          <div
            className="grid gap-2 px-5 py-5 sm:grid-cols-[7.5rem_5.5rem_1fr_auto] sm:items-baseline sm:gap-5 sm:px-7"
            style={{ borderTop: i === 0 ? undefined : `1px solid ${RULE}` }}
          >
            <p className="text-xs tabular-nums" style={{ color: MUTED }}>{stamp(r.on)}</p>
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: r.kind === 'given' ? RUST : `${INK}99` }}>
              <span
                className="block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: r.kind === 'given' ? RUST : 'transparent', border: `2px solid ${RUST}` }}
              />
              {r.kind}
            </p>
            <div className="min-w-0">
              <p className="font-display text-base leading-snug" style={{ color: INK }}>{r.label}</p>
              <p className="mt-1 text-[0.8125rem] leading-[1.6]" style={{ color: `${INK}99` }}>{r.detail}</p>
            </div>
            <p className="font-display text-base tabular-nums sm:text-right" style={{ color: r.amountAud ? INK : MUTED }}>
              {r.amountAud ? money(r.amountAud) : ''}
              {r.reference && <span className="ml-2 text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>{r.reference}</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
