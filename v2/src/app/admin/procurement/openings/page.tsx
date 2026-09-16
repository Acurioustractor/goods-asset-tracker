import type { Metadata } from 'next';
import Link from 'next/link';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { OPENING_KINDS, OPENINGS, type Expiry } from '@/lib/data/procurement-openings';

/**
 * WHERE THE OPPORTUNITIES ARE. The third and last procurement surface.
 *
 * /admin/procurement is the rules and the evidence. /admin/procurement/board is the communities
 * ranked. This is the calendar: everything with a date on it, plus the contract expiries
 * computed from the NT workbook, and an honest note about why there is no live feed.
 */

export const metadata: Metadata = {
  title: 'Procurement openings | Goods admin',
  robots: { index: false, follow: false },
};

const money = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${n.toLocaleString('en-AU')}`);
const monthLabel = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, 1).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
};

export default async function OpeningsPage() {
  let nt: { expiries?: Expiry[]; expiryTotal?: number } | null = null;
  try {
    nt = JSON.parse(await readFile(join(process.cwd(), 'data/nt-housing-contractors.json'), 'utf8'));
  } catch { nt = null; }

  const openings = [...OPENINGS].sort((a, b) => a.when.localeCompare(b.when));
  const expiries = (nt?.expiries ?? []).slice(0, 40);

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Admin &middot; internal</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">Procurement openings</h1>
        <span className="text-sm text-muted-foreground">
          <Link href="/admin/procurement/board" className="underline">The board</Link>
          {' · '}
          <Link href="/admin/procurement" className="underline">The rules</Link>
        </span>
      </div>

      {/* The honest note, first. */}
      <div className="mt-6 rounded-lg border border-dashed p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Read this before trusting the list</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed">
          <strong>There is no live tender feed here, and one cannot be built today.</strong> The AusTender API
          exposes awarded contracts only; its date types are contractPublished, contractLastModified, contractStart
          and contractEnd. Open approaches to market live on the website and never reach the feed. The shared
          graph&rsquo;s state tender table is 199,679 Queensland rows out of 199,719. Every South Australian
          government domain returns 403 to automated fetching, and several Territory and Queensland ones do too.
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          So the portals need a person: tendersonline.nt.gov.au, tenders.sa.gov.au, Tenders WA, QTenders, and
          VendorPanel for the Queensland councils. What is below is better than a feed for deciding what to do this
          week: dated openings from the research, and contract expiries computed from the Territory&rsquo;s own
          workbook.
        </p>
      </div>

      {/* The dated openings. */}
      <section className="mt-8">
        <h2 className="font-display text-2xl">Everything with a date on it</h2>
        <ol className="mt-4 border-l" style={{ borderColor: '#E8DED4' }}>
          {openings.map((o) => {
            const k = OPENING_KINDS[o.kind];
            return (
              <li key={o.id} className="relative pb-7 pl-6 sm:pl-8">
                <span aria-hidden className="absolute left-0 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full" style={{ backgroundColor: k.colour }} />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: k.colour }}>{o.whenLabel}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: `${k.colour}22`, color: k.colour }}>{k.label}</span>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: '#EEE9E3', color: '#6A5E54' }}>{o.jurisdiction}</span>
                </div>
                <p className="mt-1.5 font-display text-xl leading-snug">{o.title}</p>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{o.what}</p>
                {o.action && (
                  <p className="mt-2 max-w-3xl rounded-lg p-3 text-sm leading-relaxed" style={{ backgroundColor: '#F6E4DE', color: '#7A3418' }}>
                    {o.action}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">{o.source}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Computed expiries. */}
      {expiries.length > 0 && (
        <section className="mt-10 mb-16">
          <h2 className="font-display text-2xl">Northern Territory contracts running out</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            {nt?.expiryTotal} housing and maintenance contracts state their own term in the description, so an end
            date is computable from that and the award date. A re-tender is the moment a new supplier can get onto a
            list. The nearest {expiries.length} are below, and the Territory Enterprise flag is the Government&rsquo;s
            own.
          </p>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3 font-semibold">Ends</th>
                <th className="py-2 pr-3 text-right font-semibold">Value</th>
                <th className="py-2 pr-3 font-semibold">Holder</th>
                <th className="py-2 font-semibold">What</th>
              </tr>
            </thead>
            <tbody>
              {expiries.map((e, i) => (
                <tr key={`${e.contractor}-${e.expires}-${i}`} className="border-b last:border-0 align-top">
                  <td className="py-2 pr-3 whitespace-nowrap font-medium">{monthLabel(e.expires)}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{money(e.valueAud)}</td>
                  <td className="py-2 pr-3">
                    {e.contractor}
                    {e.territoryEnterprise && (
                      <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide" style={{ backgroundColor: '#E6EDDD', color: '#4F6138' }}>TE</span>
                    )}
                  </td>
                  <td className="py-2 text-muted-foreground">{e.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">
            A term stated in prose is not a contract end date in a register. Treat these as when to start asking,
            never as a deadline.
          </p>
        </section>
      )}
    </main>
  );
}
