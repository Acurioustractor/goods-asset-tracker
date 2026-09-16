import type { Metadata } from 'next';
import Link from 'next/link';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { OrgList, type Org } from '@/components/partners/org-list';

/**
 * THE LIST. Organisations we could ring about beds and whitegoods.
 *
 * The other three procurement pages answer questions about rules, places and dates. This one
 * just lists organisations, because that is what was actually asked for.
 */

export const metadata: Metadata = {
  title: 'Organisations | Goods admin',
  robots: { index: false, follow: false },
};

export default async function OrganisationsPage() {
  let data: { readAt: string; organisations: Org[]; note: string } | null = null;
  try {
    data = JSON.parse(await readFile(join(process.cwd(), 'data/organisations.json'), 'utf8'));
  } catch { data = null; }

  const orgs = data?.organisations ?? [];

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Admin &middot; internal</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">Organisations</h1>
        <span className="text-sm text-muted-foreground">
          <Link href="/admin/procurement" className="underline">The rules</Link>
          {' · '}
          <Link href="/admin/procurement/board" className="underline">The board</Link>
          {' · '}
          <Link href="/admin/procurement/openings" className="underline">Openings</Link>
        </span>
      </div>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        Everyone in or serving a community who we could ring about where they buy beds and whitegoods. Councils,
        health services, land councils, stores, builders, housing providers and our own partners. Search it, filter
        it, and start at the top.
      </p>
      {data && (
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-muted-foreground">
          {data.note} Built {data.readAt} by{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-[11px]">scripts/pull-organisations.py</code> from the NT
          awarded-contracts workbook, the community-controlled rows of the shared graph, and the organisations named
          in the jurisdiction research.
        </p>
      )}
      <p className="mt-2 max-w-3xl text-xs leading-relaxed" style={{ color: '#8A6A2F' }}>
        Rows marked <strong>proximity only</strong> come solely from the shared graph, which matches organisations
        to communities on postcode with no ABN or name resolution. That table once fanned one remote retail network
        out to 128 separate &ldquo;buyers&rdquo;, and the pattern that caused it is still in its seeding list. Those
        rows are real organisations; whether they belong to the community beside them is unchecked.
      </p>

      <div className="mt-7">
        {orgs.length > 0
          ? <OrgList orgs={orgs} />
          : <p className="text-sm text-muted-foreground">No organisation data. Run the script.</p>}
      </div>
    </main>
  );
}
