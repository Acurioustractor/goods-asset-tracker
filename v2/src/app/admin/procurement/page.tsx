import type { Metadata } from 'next';
import {
  BUYER_CHANNELS, IPP_COMPLIANCE, PROCUREMENT_RULES, PROCUREMENT_STATE, REPEAT_BUYERS,
  SELLER_PATHWAY,
} from '@/lib/data/procurement';

/**
 * WHERE WE ARE WITH PROCUREMENT. Admin, internal.
 *
 * Ben, 16 September 2026: review where we are at with counting the procurement, lean into
 * Indigenous procurement, and work out how the community does the selling.
 *
 * The page leads on the blocker, because the blocker is the finding: every Indigenous procurement channel tests the entity that SELLS, and the entity
 * that sells is A Curious Tractor Pty Ltd. Until that changes, or until a community
 * organisation is the seller, the set-aside and the three per cent targets are somebody
 * else's advantage.
 */

export const metadata: Metadata = {
  title: 'Procurement | Goods admin',
  robots: { index: false, follow: false },
};

const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;

export default function ProcurementPage() {
  const coverage = Math.round((PROCUREMENT_STATE.withProcurementContact / PROCUREMENT_STATE.communities) * 100);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Admin &middot; internal</p>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Procurement</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Who can buy a bed, what obliges them to look at an Aboriginal supplier first, and why that supplier should
        be a community organisation. Read {PROCUREMENT_STATE.readAt}.
      </p>

      {/* The blocker, first. */}
      <section className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-destructive">The blocker</p>
        <h2 className="mt-2 font-display text-xl leading-snug">
          Every Indigenous procurement channel tests the entity that sells. That entity is {PROCUREMENT_STATE.sellerEntity}.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Ruling J, 25 July 2026: Aboriginal directors on the charity is not 51 per cent First Nations ownership of
          the selling entity, which is what Supply Nation, the Indigenous Procurement Policy, IBA and FAC all test.
          Supply Nation status today: {PROCUREMENT_STATE.supplyNationStatus}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed">
          The community organisations we already work with do meet that test. So beds handed to a community
          organisation as stock they own are not a donation. They are what makes that organisation a supplier into a
          channel Goods cannot reach, and the margin stays there.
        </p>
      </section>

      {/* Counting. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">What we have actually counted</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-5">
            <p className="font-display text-3xl leading-none">{PROCUREMENT_STATE.withProcurementContact} of {PROCUREMENT_STATE.communities}</p>
            <p className="mt-2 text-xs text-muted-foreground">Communities with a procurement contact recorded. {coverage} per cent.</p>
          </div>
          <div className="rounded-lg border p-5">
            <p className="font-display text-3xl leading-none">{PROCUREMENT_STATE.withKeyPeople}</p>
            <p className="mt-2 text-xs text-muted-foreground">Communities with any key person recorded at all.</p>
          </div>
          <div className="rounded-lg border p-5">
            <p className="font-display text-3xl leading-none">4</p>
            <p className="mt-2 text-xs text-muted-foreground">Buyers who have ever paid. Every other number on this page is a target.</p>
          </div>
        </div>
        <table className="mt-5 w-full text-left text-sm">
          <thead>
            <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-4 font-semibold">Community</th>
              <th className="py-2 pr-4 font-semibold">Organisation</th>
              <th className="py-2 font-semibold">Already</th>
            </tr>
          </thead>
          <tbody>
            {PROCUREMENT_STATE.contacts.map((c) => (
              <tr key={c.community} className="border-b last:border-0">
                <td className="py-2.5 pr-4 font-medium">{c.community}</td>
                <td className="py-2.5 pr-4">{c.org}</td>
                <td className="py-2.5 text-muted-foreground">{c.already}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">
          Two of the four already hold or have bought product. That is the pattern to grow, and the other
          twenty-seven communities have nobody recorded at all.
        </p>
      </section>

      {/* The rules. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">What obliges a buyer to look at an Aboriginal supplier</h2>
        <div className="mt-4 space-y-3">
          {PROCUREMENT_RULES.map((r) => (
            <div key={r.id} className="rounded-lg border p-5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{r.jurisdiction}</span>
                <p className="font-semibold">{r.name}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed">&ldquo;{r.rule}&rdquo;</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.soWhat}</p>
              <p className="mt-2 text-[11px] text-muted-foreground">Source: {r.sourceDetail}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-dashed p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">How well any of this is complied with</p>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>{IPP_COMPLIANCE.exemptedShare}</li>
            <li>{IPP_COMPLIANCE.otherCategory}</li>
            <li>{IPP_COMPLIANCE.worstPortfolios}</li>
            <li>{IPP_COMPLIANCE.bestPortfolios}</li>
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">Source: {IPP_COMPLIANCE.source}.</p>
        </div>
      </section>

      {/* Channels. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">The channels</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Six routes with a real path for a bed. Three are proven by an invoice; three are not.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {BUYER_CHANNELS.map((c) => (
            <div key={c.id} className="rounded-lg border p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold leading-snug">{c.label}</p>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={c.proven ? { backgroundColor: '#E6EDDD', color: '#4F6138' } : { backgroundColor: '#EEE9E3', color: '#6A5E54' }}
                >
                  {c.proven ? 'sold one' : 'never sold'}
                </span>
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">Buys by {c.method}</p>
              <p className="mt-2 text-sm leading-relaxed">{c.what}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.examples}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Named targets. */}
      <section className="mt-10">
        <h2 className="font-display text-2xl">Agencies that already buy beds</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          From a scan of 823,620 federal contracts: 10,626 matched the things Goods makes, across 366 buyers. These
          are the top of the shortlist with a housing, community or First Nations remit. Contracts awarded, not
          opportunities open, and nobody here has been approached.
        </p>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-4 font-semibold">Agency</th>
              <th className="py-2 pr-4 text-right font-semibold">Contracts</th>
              <th className="py-2 pr-4 text-right font-semibold">Value</th>
              <th className="py-2 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {REPEAT_BUYERS.map((b) => (
              <tr key={b.name} className="border-b last:border-0 align-top">
                <td className="py-2.5 pr-4 font-medium">{b.name}<span className="block text-[11px] font-normal text-muted-foreground">{b.years}</span></td>
                <td className="py-2.5 pr-4 text-right tabular-nums">{b.contracts}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums">{aud(b.valueAud)}</td>
                <td className="py-2.5 text-muted-foreground">{b.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* The pathway. */}
      <section className="mt-10 mb-16">
        <h2 className="font-display text-2xl">What has to be true for a community organisation to sell one</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {SELLER_PATHWAY.map((s, i) => (
            <div key={s.step} className="rounded-lg border p-5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={s.state === 'started' ? { backgroundColor: '#F6E4DE', color: '#9A4023' } : { backgroundColor: '#EEE9E3', color: '#6A5E54' }}
                >
                  {s.state === 'started' ? 'started' : 'nothing yet'}
                </span>
              </div>
              <p className="mt-2 font-semibold leading-snug">{s.step}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
