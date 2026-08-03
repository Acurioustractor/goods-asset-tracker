import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Database,
  ShieldCheck,
} from 'lucide-react';
import {
  IMPACT_SURFACES,
  type ImpactSurfaceDefinition,
  type ImpactSurfaceStatus,
} from '@/lib/impact-system/surface-registry';

export const dynamic = 'force-dynamic';

const STATUS_STYLE: Record<ImpactSurfaceStatus, { label: string; className: string }> = {
  live: {
    label: 'Live',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  migrate: {
    label: 'Migrate',
    className: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  retire: {
    label: 'Retire',
    className: 'border-rose-200 bg-rose-50 text-rose-800',
  },
  internal_only: {
    label: 'Internal only',
    className: 'border-slate-200 bg-slate-100 text-slate-700',
  },
};

function gateState(
  surface: ImpactSurfaceDefinition,
  key: 'consentGate' | 'culturalGate' | 'communityApprovalGate',
) {
  const value = surface[key];
  if (value === 'required') {
    return { label: 'Required', className: 'text-emerald-700', Icon: ShieldCheck };
  }
  if (value === 'incomplete') {
    return { label: 'Incomplete', className: 'text-amber-700', Icon: AlertTriangle };
  }
  return { label: 'N/A', className: 'text-slate-400', Icon: CircleDashed };
}

function routeHref(route: string): string | null {
  if (!route.startsWith('/') || route.includes('[')) return null;
  return route;
}

export default function ImpactSystemPage() {
  const counts = IMPACT_SURFACES.reduce<Record<ImpactSurfaceStatus, number>>(
    (result, surface) => {
      result[surface.status] += 1;
      return result;
    },
    { live: 0, migrate: 0, retire: 0, internal_only: 0 },
  );
  const incompleteApproval = IMPACT_SURFACES.filter(
    (surface) => surface.communityApprovalGate === 'incomplete',
  ).length;
  const unsafeFallbacks = IMPACT_SURFACES.filter(
    (surface) =>
      surface.fallbackBehavior === 'target_substitution' ||
      surface.fallbackBehavior === 'unknown',
  ).length;

  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-16">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Community Impact Cycle
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
          Impact surface registry
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          One control room for every Goods surface that carries impact evidence. It shows where
          each route gets its data, which governance gates apply, how missing data behaves and
          which surfaces must move onto the shared claim graph.
        </p>
        <Link
          href="/admin/impact-cycles"
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          Start a private impact cycle
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ['live', counts.live],
            ['migrate', counts.migrate],
            ['internal_only', counts.internal_only],
            ['retire', counts.retire],
          ] as Array<[ImpactSurfaceStatus, number]>
        ).map(([status, value]) => (
          <div key={status} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {STATUS_STYLE[status].label}
            </p>
            <p className="mt-2 font-serif text-3xl font-bold">{value}</p>
          </div>
        ))}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-800">
            Approval gaps
          </p>
          <p className="mt-2 font-serif text-3xl font-bold text-amber-950">
            {incompleteApproval}
          </p>
        </div>
      </section>

      <section
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          unsafeFallbacks === 0
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-rose-200 bg-rose-50'
        }`}
      >
        {unsafeFallbacks === 0 ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
        )}
        <div>
          <p className="text-sm font-semibold">
            {unsafeFallbacks === 0
              ? 'No registered surface substitutes a target for missing evidence.'
              : `${unsafeFallbacks} surfaces still have unsafe or unknown fallback behaviour.`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Missing current evidence must render as unavailable. Committed, modelled, target and
            current values stay separate.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-serif text-xl font-bold">Registered surfaces</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {IMPACT_SURFACES.length} routes and artifacts in the first audit set.
          </p>
        </div>
        <div className="divide-y divide-border">
          {IMPACT_SURFACES.map((surface) => {
            const href = routeHref(surface.routeOrArtifact);
            const consent = gateState(surface, 'consentGate');
            const cultural = gateState(surface, 'culturalGate');
            const approval = gateState(surface, 'communityApprovalGate');
            return (
              <article key={surface.id} className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{surface.purpose}</h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          STATUS_STYLE[surface.status].className
                        }`}
                      >
                        {STATUS_STYLE[surface.status].label}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                      <span>{surface.routeOrArtifact}</span>
                      {href && (
                        <Link
                          href={href}
                          aria-label={`Open ${surface.routeOrArtifact}`}
                          className="text-emerald-700 hover:text-emerald-900"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {surface.audience.map((audience) => (
                      <span
                        key={audience}
                        className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="flex items-center gap-1.5 font-semibold text-foreground">
                      <Database className="h-3.5 w-3.5" /> Sources
                    </p>
                    <p className="mt-1 leading-5 text-muted-foreground">
                      {surface.dataSources.join(' · ')}
                    </p>
                  </div>
                  {[
                    ['Consent', consent],
                    ['Cultural', cultural],
                    ['Community approval', approval],
                  ].map(([label, state]) => {
                    const typedState = state as typeof consent;
                    const GateIcon = typedState.Icon;
                    return (
                      <div key={label as string} className="rounded-lg bg-muted/50 p-3">
                        <p className="font-semibold text-foreground">{label as string}</p>
                        <p
                          className={`mt-1 flex items-center gap-1.5 ${typedState.className}`}
                        >
                          <GateIcon className="h-3.5 w-3.5" />
                          {typedState.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid gap-3 text-xs sm:grid-cols-2">
                  <p className="rounded-lg border border-border px-3 py-2 text-muted-foreground">
                    <span className="font-semibold text-foreground">Missing data: </span>
                    {surface.fallbackBehavior.replaceAll('_', ' ')}
                  </p>
                  <p className="rounded-lg border border-border px-3 py-2 text-muted-foreground">
                    <span className="font-semibold text-foreground">Freshness: </span>
                    {surface.cacheBehavior}
                  </p>
                </div>

                {surface.notes && surface.notes.length > 0 && (
                  <ul className="space-y-1 text-xs text-amber-800">
                    {surface.notes.map((note) => (
                      <li key={note}>• {note}</li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
