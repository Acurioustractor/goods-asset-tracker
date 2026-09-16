import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildOpportunities } from '@/lib/data/procurement-board';
import { JURISDICTIONS, MODEL_GAPS } from '@/lib/data/procurement-model';
import { OPENINGS } from '@/lib/data/procurement-openings';
import { PROCUREMENT_STATE } from '@/lib/data/procurement';
import { ProcurementDashboard } from '@/components/partners/procurement-dashboard';
import type { Org } from '@/components/partners/org-list';

/**
 * PROCUREMENT. One route, one filter bar, four views of the same question.
 *
 * Ben, 17 September 2026, chose this over the four separate pages built the day before:
 * organisations, communities, openings and rules are lenses on one dataset, and splitting them
 * across four URLs meant four filter bars and no shareable state.
 *
 * Everything loads on the server from the three JSON pulls plus the typed modules, so the
 * client component holds no data-fetching and the filter work is pure.
 */

export const metadata: Metadata = {
  title: 'Procurement | Goods admin',
  robots: { index: false, follow: false },
};

async function readJson<T>(rel: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(join(process.cwd(), rel), 'utf8')) as T;
  } catch {
    return null;
  }
}

export default async function ProcurementPage() {
  const [orgData, intel, buyers] = await Promise.all([
    readJson<{ organisations: Org[] }>('data/organisations.json'),
    readJson<{ communities: { community: string; state: string | null; overcrowdedPct: number | null; personsPerDwelling: number | null }[] }>('data/community-intel.json'),
    readJson<{ communities: { community: string; valueAud: number; topBuyer: string | null }[] }>('data/procurement-buyers.json'),
  ]);

  const data = {
    orgs: orgData?.organisations ?? [],
    places: buildOpportunities(intel?.communities ?? [], buyers?.communities ?? []),
    openings: OPENINGS,
    jurisdictions: JURISDICTIONS,
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Admin &middot; internal</p>
      <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">Procurement</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        Who can buy a bed, who could sell one, where the need is, and what is open. Filter once and every view
        answers the same question.
      </p>

      {/* The blocker stays at the top, because it governs everything below it. */}
      <div className="mt-6 rounded-lg border p-5" style={{ borderColor: '#C45C3E' }}>
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>The thing that governs all of this</p>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed">
          Every Indigenous procurement instrument tests the entity that <strong>sells</strong>, and orders are
          invoiced by {PROCUREMENT_STATE.sellerEntity}, which does not pass. The community organisations we work with
          do. So beds handed over as stock a community organisation owns are what makes them a supplier into a
          channel Goods cannot reach. Two jurisdictions, Queensland and Western Australia, instead test the
          composition of the <strong>board</strong>, which Goods on Country Ltd may already satisfy. That is
          unresolved and is a question for the Industry Capability Network.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
          <ProcurementDashboard data={data} />
        </Suspense>
      </div>

      <section className="mt-10 rounded-lg border border-dashed p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">What this cannot tell you</p>
        <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
          {MODEL_GAPS.map((g) => <li key={g}>{g}</li>)}
          <li>
            There is no live tender feed. The AusTender API exposes awarded contracts only, the shared graph&rsquo;s
            state tender table is 99.98 per cent Queensland, and most state portals refuse automated fetching. The
            openings view is dated research and computed contract expiries, and the portals still need a person.
          </li>
          <li>
            No demand figure appears anywhere here. Government spend is what a government has already spent on
            housing-adjacent work in a place, and it is never a bed order.
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Pulls: <code className="rounded bg-muted px-1 py-0.5">pull-organisations.py</code>,{' '}
          <code className="rounded bg-muted px-1 py-0.5">pull-procurement.mjs</code>,{' '}
          <code className="rounded bg-muted px-1 py-0.5">pull-nt-contracts.py</code>,{' '}
          <code className="rounded bg-muted px-1 py-0.5">pull-community-intel.py</code>.{' '}
          <Link href="/admin" className="underline">Back to admin</Link>
        </p>
      </section>
    </main>
  );
}
