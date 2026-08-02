import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getViewer } from '@/lib/sites/site-access';
import { EquipmentForm } from './equipment-form';

export const metadata: Metadata = {
  title: 'Something is broken',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

/**
 * The machines on the line, named as the facility manual names them. Kept here
 * rather than in a table because the list is short, stable, and a free-text box
 * on a form used mid-breakdown produces "shreder", "shredder " and "the green
 * one" for the same machine.
 */
const LINE_EQUIPMENT = ['Shredder', 'Press', 'Oven', 'CNC router', 'Generator', 'Cooling rack'];

export default async function EquipmentPage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=/site/${siteId}/equipment`);

  const site = viewer.sites.find((s) => s.siteId === siteId);
  if (!site) notFound();
  if (!site.canWrite) redirect(`/site/${siteId}`);

  return (
    <main className="min-h-screen bg-stone-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <header className="bg-stone-900 text-stone-50 px-4 py-5">
        <div className="max-w-md mx-auto">
          <Link href={`/site/${siteId}`} className="text-sm text-stone-400">
            &larr; {site.siteName}
          </Link>
          <h1 className="text-2xl font-bold mt-1">Something is broken</h1>
        </div>
      </header>
      <div className="max-w-md mx-auto px-4 py-6">
        <EquipmentForm siteId={siteId} equipmentOptions={LINE_EQUIPMENT} />
      </div>
    </main>
  );
}
