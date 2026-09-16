import type { Metadata } from 'next';
import Link from 'next/link';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildOpportunities } from '@/lib/data/procurement-board';
import { JURISDICTIONS } from '@/lib/data/procurement-model';
import { ProcurementBoard } from '@/components/partners/procurement-board';

/**
 * THE BOARD. One screen to play with all of it.
 *
 * Ben, 16 September 2026: one place in the admin, tables and insights, like a social media
 * dashboard but for procurement, covering communities, population, the size of the problem,
 * procurement, organisations, and then ideas for engagement.
 *
 * The reference page at /admin/procurement is the evidence and the rules. This is the thing you
 * sort. They share the same data files, so they cannot disagree.
 */

export const metadata: Metadata = {
  title: 'Procurement board | Goods admin',
  robots: { index: false, follow: false },
};

async function readJson<T>(rel: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(join(process.cwd(), rel), 'utf8')) as T;
  } catch {
    return null;
  }
}

export default async function BoardPage() {
  const intel = await readJson<{ communities: { community: string; state: string | null; overcrowdedPct: number | null; personsPerDwelling: number | null }[] }>('data/community-intel.json');
  const buyers = await readJson<{ communities: { community: string; valueAud: number; topBuyer: string | null }[] }>('data/procurement-buyers.json');

  const rows = buildOpportunities(intel?.communities ?? [], buyers?.communities ?? []);
  const done = JURISDICTIONS.filter((j) => j.status === 'done');

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Admin &middot; internal</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">Procurement board</h1>
        <Link href="/admin/procurement" className="text-sm underline text-muted-foreground">
          The evidence and the rules behind it
        </Link>
      </div>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        Every community we work in, against how crowded it is, how easy that jurisdiction makes a purchase, whether
        the organisation there already holds government contracts, and what to do about it. Sort it, filter it, open
        a row. The score is an ordering for the next phone call and every row shows how it was made.
      </p>

      {/* The jurisdictions, as the frame. */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {done.map((j) => (
          <div key={j.id} className="rounded-lg border p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{j.name}</p>
            <p className="mt-1 font-display text-2xl leading-none">
              {j.directPurchase ? (j.directPurchase.beds > 0 ? `${j.directPurchase.beds} beds` : 'No cap') : 'unknown'}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">bought with no tender</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <ProcurementBoard rows={rows} />
      </div>

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        Government spend is what a government has already spent in that place on housing-adjacent work. It is a
        measure of where money and obligation already sit and it is never a bed order. No demand figure appears
        anywhere on this page, modelled or otherwise. Crowding is ABS Census 2021, table I16, per Indigenous
        Location, on the Canadian National Occupancy Standard.
      </p>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed" style={{ color: '#9A4023' }}>
        One caveat that actively moves this ranking. Several Indigenous Locations EXCLUDE town camps, so Tennant
        Creek reads 10 per cent crowded and Kalgoorlie 2. Those are not low-crowding places and both sit lower here
        than they should. The measure is looking past exactly the part of town we work in.
      </p>
    </main>
  );
}
