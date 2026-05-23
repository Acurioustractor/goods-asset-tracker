import Link from 'next/link';
import type { Metadata } from 'next';
import { communityLocations } from '@/lib/data/content';
import { CommunityMapClient } from './map-wrapper';

export const metadata: Metadata = {
  title: 'Communities — Goods on Country',
  description: 'Every community where Goods on Country beds and washing machines are in homes.',
};

export default function CommunitiesIndex() {
  const sorted = [...communityLocations].sort((a, b) => b.bedsDelivered - a.bedsDelivered);
  const total = sorted.reduce((s, c) => s + c.bedsDelivered, 0);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-amber-700">Where the beds have gone</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Communities</h1>
        <p className="mt-4 max-w-prose text-base text-stone-700">
          Every community where Goods on Country beds and washing machines are in homes.
          {' '}
          <strong className="text-amber-700">{total.toLocaleString()} beds</strong> across{' '}
          <strong className="text-amber-700">{sorted.length} places</strong>.
        </p>
      </header>

      <section className="mb-12 overflow-hidden rounded-xl border border-stone-200 bg-card shadow-sm">
        <CommunityMapClient locations={communityLocations} />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">All communities</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {sorted.map((c) => (
            <li key={c.id}>
              <Link
                href={`/communities/${c.id}`}
                className="block rounded-lg border border-stone-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-medium text-stone-900">{c.name}</h3>
                  <span className="shrink-0 text-sm font-bold text-amber-700">{c.bedsDelivered} beds</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">{c.region}</p>
                <p className="mt-2 line-clamp-2 text-sm text-stone-600">{c.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
