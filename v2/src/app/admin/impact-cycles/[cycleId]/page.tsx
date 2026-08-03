import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarClock, LockKeyhole } from 'lucide-react';
import { createServiceClient } from '@/lib/supabase/server';
import { GoalCreateForm } from './goal-create-form';
import { ObservationCreateForm } from './observation-create-form';
import { EvidencePackImport } from './evidence-pack-import';
import { DeliberationCreateForm } from './deliberation-create-form';
import { evidencePacksForCommunity } from '@/lib/impact-system/evidence-packs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type GoalRow = {
  id: string;
  local_name: string;
  why_it_matters: string;
  desired_change: string;
  unacceptable_changes: string[];
  goods_domain_mappings: string[];
  baseline_description: string | null;
  desired_direction: string | null;
  review_cadence: string | null;
  next_review_at: string | null;
  status: string;
  release_state: string;
};

type ObservationRow = {
  id: string;
  goal_id: string | null;
  observation_type: string;
  title: string;
  description: string;
  occurred_at: string;
  evidence_system: string;
  evidence_strength: string;
  speaker_name: string | null;
  consent_state: string;
  claim_boundary: string;
  restricted: boolean;
  follow_up_needed: boolean;
  source_start_seconds: number | null;
  source_end_seconds: number | null;
};

type DeliberationRow = {
  id: string;
  goal_id: string | null;
  title: string;
  held_at: string;
  participants_summary: string;
  authority_basis: string;
  observation_ids: string[];
  what_matters: string;
  selected_change: string | null;
  selection_reason: string | null;
  dissent: string[];
  harms_or_burdens: string[];
  approved_claim_ids: string[];
};

function formatDate(value: string | null) {
  if (!value) return 'Not scheduled';
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(value),
  );
}

export default async function ImpactCyclePage({
  params,
}: {
  params: Promise<{ cycleId: string }>;
}) {
  const { cycleId } = await params;
  const supabase = createServiceClient();
  const [cycleResult, goalsResult, observationsResult, deliberationsResult] = await Promise.all([
    supabase
      .from('community_impact_cycles')
      .select(
        'id, title, purpose, status, community_id, authority_summary, decision_protocol, data_custody_preference, communities(name, traditional_name)',
      )
      .eq('id', cycleId)
      .maybeSingle(),
    supabase
      .from('community_impact_goals')
      .select(
        'id, local_name, why_it_matters, desired_change, unacceptable_changes, goods_domain_mappings, baseline_description, desired_direction, review_cadence, next_review_at, status, release_state',
      )
      .eq('impact_cycle_id', cycleId)
      .order('created_at', { ascending: true }),
    supabase
      .from('community_impact_observations')
      .select(
        'id, goal_id, observation_type, title, description, occurred_at, evidence_system, evidence_strength, speaker_name, consent_state, claim_boundary, restricted, follow_up_needed, source_start_seconds, source_end_seconds',
      )
      .eq('impact_cycle_id', cycleId)
      .order('occurred_at', { ascending: false }),
    supabase
      .from('community_impact_deliberations')
      .select(
        'id, goal_id, title, held_at, participants_summary, authority_basis, observation_ids, what_matters, selected_change, selection_reason, dissent, harms_or_burdens, approved_claim_ids',
      )
      .eq('impact_cycle_id', cycleId)
      .order('held_at', { ascending: false }),
  ]);

  if (cycleResult.error || !cycleResult.data) notFound();
  const cycle = cycleResult.data;
  const relation = cycle.communities as
    | { name?: string; traditional_name?: string | null }
    | Array<{ name?: string; traditional_name?: string | null }>
    | null;
  const community = Array.isArray(relation) ? relation[0] : relation;
  const communityName = community?.traditional_name || community?.name || cycle.community_id;
  const goals = (goalsResult.data || []) as GoalRow[];
  const observations = (observationsResult.data || []) as ObservationRow[];
  const goalNames = new Map(goals.map((goal) => [goal.id, goal.local_name]));
  const evidencePacks = evidencePacksForCommunity(cycle.community_id);
  const deliberations = (deliberationsResult.data || []) as DeliberationRow[];

  return (
    <main className="mx-auto max-w-6xl space-y-8 pb-16">
      <header className="space-y-4">
        <Link
          href="/admin/impact-cycles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Impact cycles
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
            {communityName}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight">{cycle.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            {cycle.purpose}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 font-semibold">
            {cycle.status}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-muted-foreground">
            <LockKeyhole className="h-3 w-3" /> Private working record
          </span>
        </div>
      </header>

      <nav aria-label="Impact cycle steps" className="grid gap-3 sm:grid-cols-3">
        {[
          {
            step: '1',
            label: 'Set direction',
            detail: `${goals.length} ${goals.length === 1 ? 'goal' : 'goals'}`,
            href: '#goals',
            ready: goals.length > 0,
          },
          {
            step: '2',
            label: 'Add voices and facts',
            detail: `${observations.length} evidence ${observations.length === 1 ? 'item' : 'items'}`,
            href: '#evidence',
            ready: observations.length > 0,
          },
          {
            step: '3',
            label: 'Reflect together',
            detail: `${deliberations.length} ${deliberations.length === 1 ? 'reflection' : 'reflections'}`,
            href: '#reflections',
            ready: deliberations.length > 0,
          },
        ].map((item) => (
          <a
            key={item.step}
            href={item.href}
            className={`rounded-xl border p-4 transition-colors hover:border-emerald-400 ${
              item.ready ? 'border-emerald-200 bg-emerald-50' : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  item.ready
                    ? 'bg-emerald-700 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {item.ready ? '✓' : item.step}
              </span>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          </a>
        ))}
      </nav>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          ['Authority', cycle.authority_summary || 'Not yet recorded'],
          ['Decision protocol', cycle.decision_protocol || 'Not yet agreed'],
          ['Data and story custody', cycle.data_custody_preference || 'Not yet agreed'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-sm leading-6">{value}</p>
          </div>
        ))}
      </section>

      <EvidencePackImport
        cycleId={cycleId}
        packs={evidencePacks.map((pack) => {
          const consentCounts = new Map<string, number>();
          for (const observation of pack.observations) {
            consentCounts.set(
              observation.consentState,
              (consentCounts.get(observation.consentState) || 0) + 1,
            );
          }
          return {
            id: pack.id,
            title: pack.title,
            sourceLabel: pack.sourceLabel,
            warning: pack.warning,
            observationCount: pack.observations.length,
            consentSummary: Array.from(consentCounts, ([state, count]) => ({ state, count })),
          };
        })}
      />

      {goalsResult.error && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Goals could not be loaded: {goalsResult.error.message}
        </section>
      )}

      <section id="goals" className="scroll-mt-6 rounded-xl border border-border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold">Define a community goal</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start with the community&apos;s language and guardrails. Numeric targets are optional.
          </p>
        </div>
        <GoalCreateForm cycleId={cycleId} />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-serif text-2xl font-bold">Community goals</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These guide evidence collection and reflection; they are not public outcome claims.
          </p>
        </div>
        {goals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No goals have been defined for this cycle.
          </div>
        ) : (
          <div className="grid gap-4">
            {goals.map((goal) => (
              <article key={goal.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold">{goal.local_name}</h3>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">Why it matters:</span> {goal.why_it_matters}
                    </p>
                    <p className="mt-1 text-sm">
                      <span className="font-semibold">Desired change:</span> {goal.desired_change}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold">
                    {goal.release_state}
                  </span>
                </div>
                {goal.unacceptable_changes.length > 0 && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                      Guardrails
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-amber-950">
                      {goal.unacceptable_changes.map((change) => (
                        <li key={change}>{change}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {goal.goods_domain_mappings.map((domain) => (
                    <span
                      key={domain}
                      className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground">Current baseline</p>
                    <p className="mt-1 font-medium">{goal.baseline_description || 'Not recorded'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Desired direction</p>
                    <p className="mt-1 font-medium">{goal.desired_direction || 'Not decided'}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-muted-foreground">
                      <CalendarClock className="h-3.5 w-3.5" /> Next review
                    </p>
                    <p className="mt-1 font-medium">{formatDate(goal.next_review_at)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="evidence" className="scroll-mt-6 rounded-xl border border-border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold">Add evidence or reflection</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reference the canonical Goods or Empathy Ledger record. Record what it supports,
            what it does not establish, and the exact use decision.
          </p>
        </div>
        <ObservationCreateForm
          cycleId={cycleId}
          goals={goals.map((goal) => ({ id: goal.id, localName: goal.local_name }))}
        />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-serif text-2xl font-bold">Evidence and reflections</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Private source references and bounded interpretations—not automatically public claims.
          </p>
        </div>
        {observationsResult.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Observations could not be loaded: {observationsResult.error.message}
          </div>
        )}
        {observations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No evidence or reflections have been added.
          </div>
        ) : (
          <div className="grid gap-4">
            {observations.map((observation) => (
              <article key={observation.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {observation.observation_type.replaceAll('_', ' ')}
                      {observation.goal_id ? ` · ${goalNames.get(observation.goal_id) || 'Goal'}` : ''}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold">{observation.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
                      {observation.consent_state.replaceAll('_', ' ')}
                    </span>
                    {observation.restricted && (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 font-semibold text-amber-900">
                        restricted
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6">{observation.description}</p>
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                    Claim boundary
                  </p>
                  <p className="mt-1 text-sm text-amber-950">{observation.claim_boundary}</p>
                </div>
                <dl className="mt-4 grid gap-3 border-t border-border pt-4 text-xs sm:grid-cols-4">
                  <div>
                    <dt className="text-muted-foreground">Speaker / holder</dt>
                    <dd className="mt-1 font-medium">{observation.speaker_name || 'Not recorded'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Canonical system</dt>
                    <dd className="mt-1 font-medium">{observation.evidence_system.replaceAll('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Evidence strength</dt>
                    <dd className="mt-1 font-medium">{observation.evidence_strength.replaceAll('_', ' ')}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Source segment</dt>
                    <dd className="mt-1 font-medium">
                      {observation.source_start_seconds == null
                        ? 'Whole source / not set'
                        : `${observation.source_start_seconds}s–${observation.source_end_seconds ?? '?'}s`}
                    </dd>
                  </div>
                </dl>
                {observation.follow_up_needed && (
                  <p className="mt-3 text-xs font-semibold text-amber-800">Follow-up required</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="reflections" className="scroll-mt-6 rounded-xl border border-border bg-card p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold">Hold a community reflection</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Record how a legitimately convened group interpreted selected evidence, including
            burdens and views that did not become the preferred direction.
          </p>
        </div>
        <DeliberationCreateForm
          cycleId={cycleId}
          goals={goals.map((goal) => ({ id: goal.id, localName: goal.local_name }))}
          observations={observations.map((observation) => ({
            id: observation.id,
            title: observation.title,
            speakerName: observation.speaker_name,
            consentState: observation.consent_state,
            restricted: observation.restricted,
          }))}
        />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-serif text-2xl font-bold">Community reflections</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Collective interpretation stays distinct from individual testimony and publication
            approval.
          </p>
        </div>
        {deliberationsResult.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Reflections could not be loaded: {deliberationsResult.error.message}
          </div>
        )}
        {deliberations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No group reflections have been recorded.
          </div>
        ) : (
          <div className="grid gap-4">
            {deliberations.map((deliberation) => (
              <article key={deliberation.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {formatDate(deliberation.held_at)}
                      {deliberation.goal_id
                        ? ` · ${goalNames.get(deliberation.goal_id) || 'Goal reflection'}`
                        : ' · Whole cycle'}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold">{deliberation.title}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">
                    {deliberation.observation_ids.length} evidence items considered
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Participants
                    </p>
                    <p className="mt-1 leading-6">{deliberation.participants_summary}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Authority basis
                    </p>
                    <p className="mt-1 leading-6">{deliberation.authority_basis}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    What mattered
                  </p>
                  <p className="mt-1 text-sm leading-6">{deliberation.what_matters}</p>
                </div>
                {deliberation.selected_change && (
                  <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
                      Change selected for consideration
                    </p>
                    <p className="mt-1 text-sm text-emerald-950">{deliberation.selected_change}</p>
                    {deliberation.selection_reason && (
                      <p className="mt-2 text-xs text-emerald-900">{deliberation.selection_reason}</p>
                    )}
                  </div>
                )}
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    ['Harms or burdens', deliberation.harms_or_burdens],
                    ['Different or dissenting views', deliberation.dissent],
                  ].map(([label, values]) => (
                    <div key={label as string} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
                        {label as string}
                      </p>
                      {(values as string[]).length === 0 ? (
                        <p className="mt-1 text-sm text-amber-800">None recorded</p>
                      ) : (
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-amber-950">
                          {(values as string[]).map((value) => <li key={value}>{value}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Approved public claims: {deliberation.approved_claim_ids.length}. Recording this
                  reflection does not approve evidence for publication.
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
