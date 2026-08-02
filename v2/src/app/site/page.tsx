/**
 * Site picker. Most people have exactly one site, so this page usually just
 * forwards. It exists for Goods staff, who see all of them.
 */
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getViewer } from '@/lib/sites/site-access';

export const metadata: Metadata = {
  title: 'Your production site',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function SiteIndexPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/login?next=/site');

  if (viewer.sites.length === 0) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-3">No site yet</h1>
          <p className="text-stone-600 mb-6">
            You are signed in, but you are not on a production site yet. Give Ben a call and he will
            add you.
          </p>
          <a href="tel:+61422883943" className="text-green-700 font-medium">
            Call Ben
          </a>
        </div>
      </main>
    );
  }

  if (viewer.sites.length === 1) redirect(`/site/${viewer.sites[0].siteId}`);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-stone-900 mb-6">Which site?</h1>
        <div className="grid gap-3">
          {viewer.sites.map((site) => (
            <Link
              key={site.siteId}
              href={`/site/${site.siteId}`}
              className="block p-5 bg-white rounded-xl border border-stone-200 hover:border-stone-300 active:scale-[0.98] transition"
            >
              <span className="block text-lg font-semibold text-stone-900">{site.siteName}</span>
              <span className="block text-sm text-stone-500">
                {site.communityName ?? 'Not in a community'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
