import Link from 'next/link';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { canonValue } from '@/lib/data/canon';
import { WIKI_AREAS, STATUS_LABEL, NEEDS_BEN, type AreaStatus } from '@/lib/data/investor-wiki';
import { ADMIN_ROUTE_DIRECTORY, ROUTE_STATUS_LABEL, type RouteStatus } from '@/lib/data/admin-routes';

export const dynamic = 'force-dynamic';

const STATUS_TONE: Record<AreaStatus, string> = {
  pending: 'bg-amber-100 text-amber-900',
  'in-progress': 'bg-primary/10 text-primary',
  draft: 'bg-emerald-100 text-emerald-900',
  locked: 'bg-primary text-primary-foreground',
};

export default function InvestorWikiDashboard() {
  const revenue = Number(canonValue('revenue-carveout'));
  const canonStats: { value: string; label: string }[] = [
    { value: String(CANONICAL_ASSETS.bedsDeployed), label: 'beds delivered' },
    { value: String(CANONICAL_ASSETS.stretchBedsDeployed), label: 'Stretch Beds' },
    { value: String(CANONICAL_ASSETS.washersInCommunity), label: 'washers in community' },
    { value: `${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg`, label: 'HDPE diverted' },
    { value: `$${revenue.toLocaleString()}`, label: 'Goods-only revenue · signed' },
  ];
  const drafted = WIKI_AREAS.filter((a) => a.status === 'draft' || a.status === 'locked').length;

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 max-w-7xl mx-auto">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold">Investor wiki</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every pitch area, one careful pass. Canon-locked figures, cleared voices only.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden />
          <span className="text-xs font-semibold text-emerald-900">Canon locked · drift green</span>
        </div>
      </header>

      {/* Canon numbers strip — the only figures allowed on any surface */}
      <section aria-label="Canonical figures" className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {canonStats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card shadow-sm px-4 py-3">
            <div className="font-display text-2xl font-bold text-orange-800 tabular-nums">{s.value}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Area cards */}
      <section aria-label="Pitch areas">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            The areas — one careful pass each
          </h2>
          <p className="text-xs text-muted-foreground">{drafted} of {WIKI_AREAS.length} drafted</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {WIKI_AREAS.map((a) => (
            <Link
              key={a.slug}
              href={a.href}
              className="rounded-2xl border bg-card shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm text-muted-foreground">{a.num}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${STATUS_TONE[a.status]}`}>
                  {STATUS_LABEL[a.status]}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold leading-tight">{a.title}</h3>
              <p className="text-xs text-muted-foreground leading-snug">{a.description}</p>
              <p className="text-[11px] font-semibold text-muted-foreground mt-auto">{a.metric}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* The system row — voices, atlas, playout */}
      <section aria-label="The system" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link href="/admin/voice-impact" className="rounded-2xl border bg-card shadow-sm p-4 hover:shadow-md transition-shadow">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Voice Impact Model</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every transcript deep-analysed: 29 voices, 192 coded quotes, 56 cleared. Portraits, themes,
            consent flags and linked media, mapped to the five outcome domains.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Open the voices →</p>
        </Link>
        <Link href="/admin/atlas" className="rounded-2xl border bg-card shadow-sm p-4 hover:shadow-md transition-shadow">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Goods Atlas</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The map of everything: communities sized by beds, washers, facility interest, live signals,
            people and media, one drill-down per place.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Open the map →</p>
        </Link>
        <div className="rounded-2xl border bg-emerald-50/70 border-emerald-200 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-900 mb-2">Playout: 12 of 12 beats ready</h2>
          <p className="text-sm leading-relaxed text-emerald-900/80">
            Every narrative beat has its stat, cleared voice, face and media linked. The .pen deck rebuild
            is unblocked; blueprint in wiki/investor/14-playout-plan.md.
          </p>
        </div>
      </section>

      {/* Needs Ben + consent gate + communities + ops entry */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-1 rounded-2xl border bg-amber-50/60 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Needs Ben</h2>
          <ul className="space-y-1.5">
            {NEEDS_BEN.map((n) => (
              <li key={n.label} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-600 flex-shrink-0" aria-hidden />
                {n.href ? (
                  <Link href={n.href} className="hover:underline">{n.label}</Link>
                ) : (
                  <span>{n.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/admin/consent" className="rounded-2xl border bg-primary text-primary-foreground p-4 hover:shadow-md transition-shadow">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">Consent gate</h2>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            Held voices stay held. Default-deny. Open the consent worklist before anything ships.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Open worklist →</p>
        </Link>
        <Link href="/admin/communities" className="rounded-2xl border bg-card shadow-sm p-4 hover:shadow-md transition-shadow">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Communities</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every community: beds by product, washers, outstanding deliveries, signals, people and facility interest.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Open register →</p>
        </Link>
        <Link href="/admin/today" className="rounded-2xl border bg-card shadow-sm p-4 hover:shadow-md transition-shadow">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Operations</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Beds in motion, live field signals, money watch and today&apos;s call — the ops day view.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Open Today →</p>
        </Link>
      </section>

      {/* Complete route directory — every /admin route, dispositioned (Area 9) */}
      <section aria-label="All admin routes">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Every route — the full directory
          </h2>
          <p className="text-xs text-muted-foreground">
            {ADMIN_ROUTE_DIRECTORY.reduce((n, g) => n + g.routes.length, 0)} routes · wiki/investor/09-admin-ia.md
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {ADMIN_ROUTE_DIRECTORY.map((g) => (
            <div key={g.group} className="rounded-2xl border bg-card shadow-sm p-4">
              <h3 className="font-display text-sm font-bold mb-2">{g.group}</h3>
              <ul className="space-y-1">
                {g.routes.map((r) => (
                  <li key={r.href} className="flex items-center justify-between gap-2 text-sm">
                    <Link href={r.href} className="truncate hover:underline text-foreground">
                      {r.name}
                    </Link>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold tracking-wide ${ROUTE_TONE[r.status]}`}>
                      {ROUTE_STATUS_LABEL[r.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const ROUTE_TONE: Record<RouteStatus, string> = {
  hub: 'bg-orange-100 text-orange-900',
  active: 'bg-emerald-100 text-emerald-900',
  absorbed: 'bg-primary/10 text-primary',
  utility: 'bg-muted text-foreground',
  stale: 'bg-muted text-muted-foreground',
  'one-off': 'bg-muted text-muted-foreground',
};
