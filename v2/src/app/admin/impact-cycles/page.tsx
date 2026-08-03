import Link from 'next/link';
import { ArrowLeft, CalendarClock, LockKeyhole, UsersRound } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/server';
import { ImpactCycleCreateForm } from './impact-cycle-create-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CommunityRow = {
  id: string;
  name: string;
  traditional_name: string | null;
  state: string | null;
};

type CycleRow = {
  id: string;
  community_id: string;
  title: string;
  purpose: string;
  status: string;
  lead_organisation: string | null;
  review_cadence: string | null;
  next_review_at: string | null;
  approved_for_public_summary: boolean;
  updated_at: string;
};

function formatDate(value: string | null) {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(value),
  );
}

export default async function ImpactCyclesPage() {
  const supabase = createServiceClient();
  const [communitiesResult, cyclesResult] = await Promise.all([
    supabase
      .from('communities')
      .select('id, name, traditional_name, state')
      .order('name', { ascending: true }),
    supabase
      .from('community_impact_cycles')
      .select(
        'id, community_id, title, purpose, status, lead_organisation, review_cadence, next_review_at, approved_for_public_summary, updated_at',
      )
      .order('updated_at', { ascending: false }),
  ]);

  const communities = (communitiesResult.data || []) as CommunityRow[];
  const cycles = (cyclesResult.data || []) as CycleRow[];
  const communityNames = new Map(
    communities.map((community) => [
      community.id,
      community.traditional_name || community.name,
    ]),
  );
  const persistenceReady = !cyclesResult.error;

  return (
    <main className="mx-auto max-w-6xl space-y-8 pb-16">
      <header className="space-y-4">
        <Link
          href="/admin/impact-system"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Impact system
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Community-led intake
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight">Impact cycles</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Begin with purpose, authority and data custody before choosing measures. Every new
            cycle is private and cannot become a public impact claim from this screen.
          </p>
        </div>
      </header>

      {!persistenceReady && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">The impact-cycle migration has not been applied here.</p>
          <p className="mt-1 text-amber-800">
            Apply <code>20260727090000_community_impact_cycles.sql</code> before using this form.
            Database response: {cyclesResult.error?.message}
          </p>
        </section>
      )}

      {communitiesResult.error && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Communities could not be loaded: {communitiesResult.error.message}
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <UsersRound className="h-5 w-5 text-emerald-700" />
          <p className="mt-3 text-2xl font-bold">{cycles.length}</p>
          <p className="text-xs text-muted-foreground">Private cycles</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <CalendarClock className="h-5 w-5 text-emerald-700" />
          <p className="mt-3 text-2xl font-bold">
            {cycles.filter((cycle) => cycle.next_review_at).length}
          </p>
          <p className="text-xs text-muted-foreground">Reviews scheduled</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <LockKeyhole className="h-5 w-5 text-emerald-700" />
          <p className="mt-3 text-2xl font-bold">
            {cycles.filter((cycle) => cycle.approved_for_public_summary).length}
          </p>
          <p className="text-xs text-muted-foreground">Public summaries approved</p>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold">Start a cycle</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Leave fields blank when the community has not yet decided. Unknown is valid data.
          </p>
        </div>
        <ImpactCycleCreateForm
          communities={communities}
          persistenceReady={persistenceReady && !communitiesResult.error}
        />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-serif text-2xl font-bold">Existing cycles</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Working records only. Publication requires separate evidence and community approval.
          </p>
        </div>
        {cycles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No impact cycles have been created.
          </div>
        ) : (
          <div className="grid gap-3">
            {cycles.map((cycle) => (
              <article key={cycle.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {communityNames.get(cycle.community_id) || cycle.community_id}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold">{cycle.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {cycle.purpose}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {cycle.status}
                  </span>
                </div>
                <Link
                  href={`/admin/impact-cycles/${cycle.id}`}
                  className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  Open cycle and goals →
                </Link>
                <dl className="mt-4 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">Lead organisation</dt>
                    <dd className="mt-1 font-medium">{cycle.lead_organisation || 'Not recorded'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Review cadence</dt>
                    <dd className="mt-1 font-medium">{cycle.review_cadence || 'Not agreed'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Next review</dt>
                    <dd className="mt-1 font-medium">{formatDate(cycle.next_review_at)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
