/**
 * Who has already paid for this, read from the books, in the order they arrived.
 *
 * Chapter 15 sets out where each future dollar goes, and on the overview door the lane
 * sources are deliberately blanked so one funder never sees who else is being asked.
 * That is right. It also left the chapter naming QBE repeatedly while philanthropy
 * stayed an abstract noun, so a reader learned that Goods wants money and never that
 * money has been well used. This is the other list.
 *
 * NO DOLLAR FIGURES (Ben, 2026-09-16). An amount invites the next funder to anchor on
 * it, and it turns a record of trust into a league table. What each funder bought is
 * the useful part, and the order they came in is the argument: the first line arrived
 * before there was a product, a register, a charity, a board or a customer, and
 * everything under it followed someone willing to go first.
 *
 * Reads GRANTS_RECEIVED directly, so the list cannot drift from the reconciliation
 * even though it prints none of its numbers.
 */

import { GRANTS_RECEIVED, GRANTS_RECEIVED_AS_AT } from '@/lib/data/grants-received';

export function FundersSoFar() {
  const rows = [...GRANTS_RECEIVED].sort((a, b) => a.since.localeCompare(b.since));

  return (
    <div className="mt-16">
      <h3 className="font-display text-2xl font-semibold text-goods-ink">
        Who backed this, and in what order.
      </h3>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-[#4a4741]">
        Seven funders. The Snow Foundation paid the first invoice in October 2023 and has paid ten
        since, the most recent in May 2026. Everything below that first line arrived after someone
        was willing to go first.
      </p>

      <ol className="mt-10 space-y-0">
        {rows.map((g, i) => (
          <li key={g.funder} className="grid gap-x-8 gap-y-2 border-t border-[#e6dfd1] py-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-display text-sm text-goods-terracotta">{String(i + 1).padStart(2, '0')}</p>
              <p className="mt-1 font-display text-xl font-semibold leading-tight text-goods-ink">
                {g.funder.split(',')[0]}
              </p>
              <p className="mt-1 text-[14px] text-[#5d574c]">{g.when}</p>
            </div>
            <div className="md:col-span-8">
              {g.bought ? (
                <p className="text-[16px] leading-relaxed text-[#4a4741]">{g.bought}</p>
              ) : (
                <p className="text-[16px] leading-relaxed text-[#7a7363]">
                  Recorded in the books. What it paid for is not written down yet.
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 border-t border-[#e6dfd1] pt-4 text-[13px] leading-snug text-[#5d574c]">
        Every line tied to the books at {GRANTS_RECEIVED_AS_AT}. FRRR and the Vincent Fairfax Family
        Foundation are one joint grant, counted once. Beds that communities and organisations buy are
        trade, and are counted separately.
      </p>
    </div>
  );
}
