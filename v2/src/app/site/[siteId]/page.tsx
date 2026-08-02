/**
 * The community production site — one screen, three jobs.
 *
 * The three things a person opens this app to do are: log today's shift, see
 * what is running low, and flag a broken machine. Everything else (goals,
 * stories, the ownership pathway, training) is a second screen, reached from
 * "More". A nine-tile front door is a menu, not a tool.
 *
 * This page composes what already exists rather than replacing it: the shift
 * log, journal and inventory forms under /production are the ones that work
 * offline and carry voice notes, and they are left alone.
 */
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getViewer } from '@/lib/sites/site-access';

export const metadata: Metadata = {
  title: 'Your production site',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export default async function SitePage({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=/site/${siteId}`);

  const site = viewer.sites.find((s) => s.siteId === siteId);
  // Not a 403: RLS already decided this, and a person who cannot see a site has
  // no business learning that it exists.
  if (!site) notFound();

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [todayShift, recentShifts, inventory, openFaults] = await Promise.all([
    supabase
      .from('production_shifts')
      .select('id, operator, sheets_produced, beds_assembled, handover_notes')
      .eq('site_id', siteId)
      .eq('shift_date', today)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('production_shifts')
      .select('shift_date, sheets_produced, beds_assembled')
      .eq('site_id', siteId)
      .gte('shift_date', daysAgo(7)),
    supabase
      .from('production_inventory')
      .select('beds_possible, snapshot_date, legs_ready, tabs_ready, steel_poles, canvas_ready')
      .eq('site_id', siteId)
      .order('snapshot_date', { ascending: false })
      .limit(1),
    supabase
      .from('site_maintenance_requests')
      .select('id, equipment, severity, created_at')
      .eq('site_id', siteId)
      .eq('status', 'open')
      .order('created_at', { ascending: false }),
  ]);

  const shift = todayShift.data?.[0] ?? null;
  const stock = inventory.data?.[0] ?? null;
  const faults = openFaults.data ?? [];
  const week = recentShifts.data ?? [];
  const bedsThisWeek = week.reduce((t, r) => t + (Number(r.beds_assembled) || 0), 0);
  const lineStopped = faults.some((f) => f.severity === 'stopped');

  return (
    <main className="min-h-screen bg-stone-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <header className="bg-stone-900 text-stone-50 px-4 py-5">
        <div className="max-w-md mx-auto">
          <p className="text-sm text-stone-400">{site.communityName ?? 'Goods production'}</p>
          <h1 className="text-2xl font-bold">{site.siteName}</h1>
          <p className="text-sm text-stone-400 mt-1">
            {viewer.displayName ? `G'day ${viewer.displayName}. ` : ''}
            {site.canWrite ? 'You can log work here.' : 'You can look, not log.'}
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {lineStopped && (
          <div className="rounded-xl border-2 border-red-600 bg-red-50 p-4">
            <p className="font-bold text-red-900">The line is down</p>
            <p className="text-sm text-red-800 mt-1">
              {faults
                .filter((f) => f.severity === 'stopped')
                .map((f) => f.equipment)
                .join(', ')}{' '}
              — Goods has been told.
            </p>
          </div>
        )}

        {/* 1. Today's work */}
        <section className="rounded-xl bg-white border border-stone-200 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">Today</h2>
          {shift ? (
            <>
              <p className="text-stone-900">
                <span className="text-3xl font-bold">{shift.sheets_produced ?? 0}</span>{' '}
                <span className="text-stone-600">sheets pressed, logged by {shift.operator}</span>
              </p>
              {shift.handover_notes && (
                <p className="text-sm text-stone-600 mt-2 border-l-2 border-stone-200 pl-3">
                  {shift.handover_notes}
                </p>
              )}
            </>
          ) : (
            <p className="text-stone-600">Nothing logged yet today.</p>
          )}
          <p className="text-sm text-stone-500 mt-3">
            {bedsThisWeek} bed{bedsThisWeek === 1 ? '' : 's'} assembled in the last seven days.
          </p>
          {site.canWrite && (
            <Link
              href="/production"
              className="mt-4 block text-center bg-stone-900 text-white font-semibold rounded-lg py-3 active:scale-[0.98] transition"
            >
              {shift ? 'Log another shift' : "Log today's shift"}
            </Link>
          )}
        </section>

        {/* 2. What's running low */}
        <section className="rounded-xl bg-white border border-stone-200 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">Stock</h2>
          {stock ? (
            <>
              <p className="text-stone-900">
                <span className="text-3xl font-bold">{stock.beds_possible ?? 0}</span>{' '}
                <span className="text-stone-600">beds from what is on the ground</span>
              </p>
              <p className="text-sm text-stone-500 mt-2">
                {stock.legs_ready ?? 0} legs · {stock.tabs_ready ?? 0} tabs · {stock.steel_poles ?? 0}{' '}
                poles · {stock.canvas_ready ?? 0} canvas. Counted {stock.snapshot_date}.
              </p>
            </>
          ) : (
            <p className="text-stone-600">No count yet. Walk the site and count what is there.</p>
          )}
          {site.canWrite && (
            <Link
              href="/production/inventory"
              className="mt-4 block text-center border border-stone-300 text-stone-900 font-semibold rounded-lg py-3 active:scale-[0.98] transition"
            >
              Count stock
            </Link>
          )}
        </section>

        {/* 3. Broken things */}
        <section className="rounded-xl bg-white border border-stone-200 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 mb-3">
            Equipment
          </h2>
          {faults.length === 0 ? (
            <p className="text-stone-600">Everything is running.</p>
          ) : (
            <ul className="space-y-2">
              {faults.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3">
                  <span className="text-stone-900">{f.equipment}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      f.severity === 'stopped'
                        ? 'bg-red-100 text-red-800'
                        : f.severity === 'degraded'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {f.severity}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {site.canWrite && (
            <Link
              href={`/site/${siteId}/equipment`}
              className="mt-4 block text-center border border-stone-300 text-stone-900 font-semibold rounded-lg py-3 active:scale-[0.98] transition"
            >
              Something is broken
            </Link>
          )}
        </section>

        {/* Everything else, deliberately on the second screen */}
        <nav className="rounded-xl bg-white border border-stone-200 divide-y divide-stone-100">
          {[
            { href: '/production/journal', label: 'Journal — what happened, what to change' },
            { href: '/portal/ask-goods', label: 'Ask Goods a question' },
            { href: '/portal/goals', label: 'Where we are heading' },
            { href: '/wiki/manufacturing/facility-manual', label: 'Facility manual and safety' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-5 py-4 text-stone-700 hover:bg-stone-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
