import Link from 'next/link';
import type { Metadata } from 'next';
import { getGoodsStorytellers, slugify } from '@/lib/storytellers';

export const metadata: Metadata = {
  title: 'Storytellers (EL) · Goods admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function ElStorytellersIndex() {
  const tellers = await getGoodsStorytellers();
  return (
    <div className="space-y-6 pb-16">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Storytellers in Empathy Ledger (Goods)</h1>
          <p className="mt-1 text-sm text-gray-500 max-w-prose">
            Every Goods storyteller in EL. Click any to see how voice cards in
            <code className="mx-1 rounded bg-gray-100 px-1">trip-stories.ts</code> can reference them
            via <code className="rounded bg-gray-100 px-1">storytellerSlug</code>.
          </p>
        </div>
        <Link
          href="/admin/el-storytellers/new"
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
        >
          + New storyteller
        </Link>
      </header>

      {tellers.length === 0 ? (
        <p className="rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
          No storytellers loaded (EL API may be rate-limited). Refresh in a moment.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Community</th>
                <th className="px-4 py-2 text-left">Elder</th>
                <th className="px-4 py-2 text-left">Slug (use this on voice cards)</th>
                <th className="px-4 py-2 text-left">Public page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tellers.map((s) => {
                const slug = slugify(s.displayName);
                return (
                  <tr key={s.id} className="hover:bg-amber-50/30">
                    <td className="px-4 py-2 font-medium text-gray-900">{s.displayName}</td>
                    <td className="px-4 py-2 text-gray-600">{s.community || '—'}</td>
                    <td className="px-4 py-2">{s.elderStatus ? '✓' : ''}</td>
                    <td className="px-4 py-2 font-mono text-xs text-amber-700">{slug}</td>
                    <td className="px-4 py-2">
                      <Link href={`/storytellers/${slug}`} target="_blank" className="text-blue-700 hover:underline">
                        /storytellers/{slug} ↗
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
