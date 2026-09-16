import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildOpportunities } from '@/lib/data/procurement-board';
import { JURISDICTIONS, MODEL_GAPS } from '@/lib/data/procurement-model';
import { OPENINGS } from '@/lib/data/procurement-openings';
import { ProcurementDashboard } from '@/components/partners/procurement-dashboard';
import type { IntelRow } from '@/components/partners/procurement-dashboard';
import type { Org } from '@/components/partners/org-list';

/**
 * PROCUREMENT. One route, one filter bar, many lenses on the same question.
 *
 * Ben, 17 September 2026, chose this over the four separate pages built the day before, then
 * asked for the whole thing to be designed in Pencil and brought back. The design file is
 * design/Goods Dashboard.pen, frame "Desk Overview".
 *
 * Everything loads on the server from the three JSON pulls plus the typed modules, so the
 * client component holds no data-fetching and the filter work is pure. The blocker, the charts
 * and the timeline all live inside the dashboard now, because each one moves with the filter.
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

interface IntelFile { communities: IntelRow[] }
interface BuyerFile { totals?: { contracts?: number }; communities: { community: string; valueAud: number; topBuyer: string | null }[] }
interface NtFile {
  totals?: { allContracts?: number };
  furnishingGap?: { housingAgencyValueAud?: number; housingAgencyFurnitureContracts?: number };
  expiryTotal?: number;
}

export default async function ProcurementPage() {
  const [orgData, intel, buyers, nt] = await Promise.all([
    readJson<{ organisations: Org[] }>('data/organisations.json'),
    readJson<IntelFile>('data/community-intel.json'),
    readJson<BuyerFile>('data/procurement-buyers.json'),
    readJson<NtFile>('data/nt-housing-contractors.json'),
  ]);

  const data = {
    orgs: orgData?.organisations ?? [],
    places: buildOpportunities(intel?.communities ?? [], buyers?.communities ?? []),
    openings: OPENINGS,
    jurisdictions: JURISDICTIONS,
    intel: intel?.communities ?? [],
    read: {
      contracts: (nt?.totals?.allContracts ?? 0) + (buyers?.totals?.contracts ?? 0),
      ntHousingAgencyValueAud: nt?.furnishingGap?.housingAgencyValueAud ?? 0,
      ntHousingAgencyFurnitureContracts: nt?.furnishingGap?.housingAgencyFurnitureContracts ?? 0,
      expiries: nt?.expiryTotal ?? 0,
    },
  };

  return (
    <main className="mx-auto max-w-[1600px] px-4 sm:px-6">
      <Suspense fallback={<p className="py-10 text-sm text-muted-foreground">Loading…</p>}>
        <ProcurementDashboard data={data} />
      </Suspense>

      <section className="my-10 rounded-xl border border-dashed p-5">
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
