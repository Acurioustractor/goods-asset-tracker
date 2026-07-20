/**
 * ROUTE REVIEW BOARD — /admin/route-review
 *
 * Every admin route as one reviewable card: what's on it, where its data
 * comes from, what job it does, which deck beat it feeds, and the proposed
 * public/gated/team disposition. Built for Ben's route-by-route pass
 * (2026-07-20); data in @/lib/data/route-review.
 */
import Link from 'next/link';
import {
  ROUTE_REVIEW,
  DOOR_PLAN,
  type Disposition,
  type DesignState,
} from '@/lib/data/route-review';

export const metadata = {
  title: 'Route Review — Goods Admin',
  description: 'Every admin route, its key elements, deck links, and the proposed public/gated/team split.',
};

const DISPO_STYLE: Record<Disposition, string> = {
  public: 'bg-accent/15 text-accent-foreground border-accent/40',
  gated: 'bg-primary/10 text-primary border-primary/30',
  team: 'bg-muted text-muted-foreground border-border',
  retire: 'bg-red-50 text-red-700 border-red-200',
};

const DISPO_LABEL: Record<Disposition, string> = {
  public: 'PUBLIC',
  gated: 'GATED',
  team: 'TEAM',
  retire: 'RETIRE',
};

const DESIGN_LABEL: Record<DesignState, string> = {
  'on-system': 'On system',
  restyled: 'Restyled today',
  left: 'Untouched',
};

export default function RouteReviewPage() {
  const all = ROUTE_REVIEW.flatMap((g) => g.routes);
  const counts = {
    total: all.length,
    gated: all.filter((r) => r.disposition === 'gated').length,
    retire: all.filter((r) => r.disposition === 'retire').length,
    deck: all.filter((r) => r.deckFeeds).length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-16">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Route review · 2026-07-20
        </p>
        <h1 className="font-display text-3xl text-foreground">
          Every route, one card, your call
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {counts.total} routes. Each card: what&apos;s on the page, where the data comes from,
          which deck beat it feeds, and a proposed door (public / gated / team / retire).
          {` ${counts.deck}`} routes feed the deck directly; {counts.gated} are proposed for the
          funder door; {counts.retire} are retire candidates. Disagree with a chip? That&apos;s
          the review — say so per route.
        </p>
      </header>

      {/* The three doors */}
      <section className="grid gap-3 md:grid-cols-3">
        {DOOR_PLAN.map((d) => (
          <div key={d.door} className="rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {d.door}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground">
              <span className="font-medium">Now:</span> {d.now}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Proposed:</span> {d.proposed}
            </p>
          </div>
        ))}
      </section>

      {/* Route groups */}
      {ROUTE_REVIEW.map((group) => (
        <section key={group.group} className="space-y-4">
          <h2 className="font-display text-2xl text-foreground">{group.group}</h2>
          <div className="grid gap-3 lg:grid-cols-2">
            {group.routes.map((r) => (
              <div key={r.href} className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={r.href} className="text-sm font-semibold text-foreground hover:text-primary">
                      {r.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground/70">{r.href}</p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${DISPO_STYLE[r.disposition]}`}>
                      {DISPO_LABEL[r.disposition]}
                    </span>
                    <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {DESIGN_LABEL[r.design]}
                    </span>
                  </div>
                </div>

                <p className="text-[13px] leading-relaxed text-foreground">{r.job}</p>

                <ul className="space-y-1">
                  {r.keyElements.map((el, i) => (
                    <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      {el}
                    </li>
                  ))}
                </ul>

                {r.deckFeeds && (
                  <p className="rounded-lg bg-primary/5 px-3 py-1.5 text-[12px] text-primary">
                    <span className="font-semibold">Feeds the deck:</span> {r.deckFeeds}
                  </p>
                )}
                {r.dispositionWhy && (
                  <p className="text-[12px] leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">Why {DISPO_LABEL[r.disposition].toLowerCase()}:</span>{' '}
                    {r.dispositionWhy}
                  </p>
                )}
                {r.workNeeded && (
                  <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-[12px] text-amber-900">
                    <span className="font-semibold">Work needed:</span> {r.workNeeded}
                  </p>
                )}
                <p className="mt-auto text-[11px] text-muted-foreground/60">Data: {r.dataSources}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
