/**
 * Who has already paid for this, read from the books.
 *
 * Chapter 15 sets out where each future dollar goes, and on the overview variant the
 * lane sources are deliberately blanked so one funder never sees who else is being
 * asked. That is right, and it left the page with philanthropy as an abstract noun
 * while QBE was named ten times over. A reader learned that Goods wants money and
 * never that money has been well used.
 *
 * This is the other list: money RECEIVED, every line tied to the books, which carries
 * no confidentiality problem at all. It reads GRANTS_RECEIVED directly, so it cannot
 * drift from the reconciliation.
 *
 * Framing (Ben, 2026-09-16): the order funders arrived in is the argument. Amounts come
 * second, and philanthropy is never written up as a phase Goods outgrew. Snow's most
 * recent invoice is four months old and there is an open raise on this same page.
 */

import { GRANTS_RECEIVED, GRANTS_RECEIVED_TOTAL_AUD, GRANTS_RECEIVED_AS_AT, GRANT_BASIS_LABEL } from '@/lib/data/grants-received';

const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;

export function FundersSoFar({ dark = false }: { dark?: boolean }) {
  const rows = [...GRANTS_RECEIVED].sort((a, b) => b.amountAud - a.amountAud);
  const ink = dark ? 'text-goods-cream' : 'text-goods-ink';
  const mute = dark ? 'text-goods-cream/70' : 'text-[#5d574c]';
  const body = dark ? 'text-goods-cream/85' : 'text-[#4a4741]';
  const rule = dark ? 'border-goods-cream/20' : 'border-[#e6dfd1]';

  return (
    <div className="mt-14">
      <h3 className={`font-display text-2xl font-semibold ${ink}`}>Who has already paid for this.</h3>
      <p className={`mt-3 max-w-3xl text-lg leading-relaxed ${body}`}>
        Seven funders, {aud(GRANTS_RECEIVED_TOTAL_AUD)}. The Snow Foundation paid the first invoice in
        October 2023, before there was a product, a register, a charity, a board or a customer, and has
        paid ten since. Everything below that first line arrived after someone was willing to go first.
      </p>

      <table className="mt-8 w-full text-left">
        <caption className="sr-only">Grants received, tied to the books at {GRANTS_RECEIVED_AS_AT}</caption>
        <thead>
          <tr className={`border-b ${rule}`}>
            <th scope="col" className={`py-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.15em] ${mute}`}>Funder</th>
            <th scope="col" className={`hidden py-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.15em] sm:table-cell ${mute}`}>When</th>
            <th scope="col" className={`py-2 text-right text-[11px] font-semibold uppercase tracking-[0.15em] ${mute}`}>Received</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((g) => (
            <tr key={g.funder} className={`border-b ${rule}`}>
              <th scope="row" className={`py-3 pr-4 align-top font-normal ${ink}`}>
                <span className="font-display text-lg font-semibold">{g.funder.split(',')[0]}</span>
                <span className={`mt-0.5 block text-[13px] sm:hidden ${mute}`}>{g.when}</span>
                <span className={`mt-0.5 block text-[13px] ${mute}`}>{GRANT_BASIS_LABEL[g.basis]}</span>
              </th>
              <td className={`hidden py-3 pr-4 align-top text-[15px] sm:table-cell ${body}`}>{g.when}</td>
              <td className={`py-3 text-right align-top font-display text-lg font-semibold tabular-nums ${ink}`}>{aud(g.amountAud)}</td>
            </tr>
          ))}
          <tr>
            <th scope="row" className={`py-3 pr-4 text-left font-display text-lg font-semibold ${ink}`}>Total</th>
            <td className="hidden sm:table-cell" />
            <td className={`py-3 text-right font-display text-xl font-semibold tabular-nums ${ink}`}>{aud(GRANTS_RECEIVED_TOTAL_AUD)}</td>
          </tr>
        </tbody>
      </table>

      <p className={`mt-4 text-[13px] leading-snug ${mute}`}>
        Every line tied to the books at {GRANTS_RECEIVED_AS_AT}. FRRR and the Vincent Fairfax Family
        Foundation are one joint grant, counted once. Beds that communities and organisations buy are
        trade, and are counted separately.
      </p>
    </div>
  );
}
