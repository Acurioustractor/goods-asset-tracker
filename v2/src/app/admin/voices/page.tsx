import Link from 'next/link';
import { STORYTELLER_REGISTRY, type VoiceTier } from '@/lib/data/storyteller-registry';
import { getProvenance, provenanceLabel, PROVENANCE_ASOF } from '@/lib/data/transcript-provenance';
import { DOMAIN_QUOTE_COVERAGE, VOICE_GAPS } from '@/lib/data/investor-wiki';

export const dynamic = 'force-dynamic';

const TIER_TONE: Record<VoiceTier, string> = {
  external: 'text-emerald-700',
  website: 'text-sky-700',
  funder: 'text-sky-700',
  pending: 'text-amber-700',
  hold: 'text-red-700',
  internal: 'text-stone-500',
};

const TABS: { label: string; href: string; current?: boolean }[] = [
  { label: 'Overview', href: '/admin/voices', current: true },
  { label: 'Atlas', href: '/admin/story-atlas' },
  { label: 'Registry', href: '/admin/storytellers' },
  { label: 'Quotes', href: '/admin/quotes' },
  { label: 'EL stories', href: '/admin/el-stories' },
  { label: 'EL storytellers', href: '/admin/el-storytellers' },
  { label: 'Curated', href: '/admin/stories' },
  { label: 'Community lens', href: '/admin/community-stories' },
];

export default function VoicesHub() {
  const rows = STORYTELLER_REGISTRY.map((s) => {
    const prov = getProvenance(s.name);
    const usable = s.quotes.filter((q) => q.status !== 'hold').length;
    return { s, prov, usable };
  }).sort((a, b) => b.usable - a.usable);

  const external = rows.filter((r) => r.s.tier === 'external').length;
  const holds = rows.filter((r) => r.s.tier === 'hold').length;
  const totalQuotes = rows.reduce((n, r) => n + (r.s.tier === 'external' ? r.usable : 0), 0);
  const maxDomain = Math.max(...DOMAIN_QUOTE_COVERAGE.map((d) => d.quotes));

  return (
    <div className="px-4 md:px-8 py-6 space-y-5 max-w-7xl mx-auto">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/admin" className="hover:underline">Investor wiki</Link>
        <span className="mx-1">/</span>
        <span>Area 01</span>
      </nav>

      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold">Voices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {STORYTELLER_REGISTRY.length} storytellers · {totalQuotes} cleared quotes · verbatim only, consent default-deny
          </p>
        </div>
        <Link
          href="/admin/consent"
          className="rounded-xl bg-stone-900 text-amber-400 px-4 py-2 text-sm font-semibold hover:bg-stone-800 transition-colors"
        >
          Consent worklist · {holds} hold{holds === 1 ? '' : 's'}
        </Link>
      </header>

      {/* Tab row — each tab is a working surface; non-Overview tabs open the existing route */}
      <div className="flex gap-1 border-b overflow-x-auto pb-px" role="tablist" aria-label="Voices surfaces">
        {TABS.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`whitespace-nowrap rounded-t-lg px-3.5 py-2 text-sm ${
              t.current
                ? 'bg-orange-50 text-orange-900 font-semibold border border-b-0'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={t.current ? 'page' : undefined}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Storyteller table */}
        <section className="lg:col-span-2 rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Storyteller</th>
                  <th className="px-4 py-2.5 font-semibold">Community</th>
                  <th className="px-4 py-2.5 font-semibold">Tier</th>
                  <th className="px-4 py-2.5 font-semibold">Transcript</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Quotes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map(({ s, prov, usable }) => {
                  const isHold = s.tier === 'hold';
                  // 'curated' = hand-typed card only, no primary transcript traced (the gap state)
                  const noTranscript = prov.kind === 'curated';
                  return (
                    <tr key={s.slug} className={isHold ? 'bg-red-50/60' : noTranscript && s.tier === 'external' ? 'bg-amber-50/50' : undefined}>
                      <td className="px-4 py-2.5 font-semibold">{s.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{s.community || '—'}</td>
                      <td className={`px-4 py-2.5 font-semibold ${TIER_TONE[s.tier]}`}>{s.tier}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {isHold ? 'held' : provenanceLabel(prov)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{isHold ? '—' : usable}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-4 py-2 text-[11px] text-muted-foreground border-t">
            Transcript provenance as of {PROVENANCE_ASOF}. Held voices show no words anywhere, ever.
          </p>
        </section>

        {/* Side: coverage + gaps */}
        <div className="space-y-4">
          <section className="rounded-2xl border bg-card shadow-sm p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Quotes per impact domain
            </h2>
            <ul className="space-y-2.5">
              {DOMAIN_QUOTE_COVERAGE.map((d) => {
                const weak = d.quotes < 5;
                return (
                  <li key={d.domain}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{d.domain}</span>
                      <span className={`font-semibold tabular-nums ${weak ? 'text-red-700' : 'text-muted-foreground'}`}>
                        {d.quotes}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className={`h-1.5 rounded-full ${weak ? 'bg-red-500' : 'bg-emerald-600'}`}
                        style={{ width: `${Math.max(4, Math.round((d.quotes / maxDomain) * 100))}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Source: Area 1 pass, wiki/investor/01-storytellers.md
            </p>
          </section>

          <section className="rounded-2xl border bg-amber-50/60 p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Gaps to close
            </h2>
            <ul className="space-y-1.5">
              {VOICE_GAPS.map((g) => (
                <li key={g} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-600 flex-shrink-0" aria-hidden />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
