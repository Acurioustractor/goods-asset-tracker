import Link from 'next/link';
import { STORYTELLER_REGISTRY, type VoiceTier } from '@/lib/data/storyteller-registry';
import { getProvenance, provenanceLabel, PROVENANCE_ASOF } from '@/lib/data/transcript-provenance';
import { DOMAIN_QUOTE_COVERAGE, VOICE_GAPS } from '@/lib/data/investor-wiki';
import { StoryAtlasTab } from './tabs/story-atlas/tab';
import { RegistryTab } from './tabs/storytellers/tab';
import { QuotesTab } from './tabs/quotes/tab';
import { ElStoriesTab } from './tabs/el-stories/tab';
import { ElStorytellersTab } from './tabs/el-storytellers/tab';
import { CuratedStoriesTab } from './tabs/stories/tab';
import { CommunityLensTab } from './tabs/community-stories/tab';

export const dynamic = 'force-dynamic';

const TIER_TONE: Record<VoiceTier, string> = {
  external: 'text-emerald-700',
  website: 'text-primary',
  funder: 'text-primary',
  pending: 'text-amber-700',
  hold: 'text-red-700',
  internal: 'text-muted-foreground',
};

/**
 * ONE HUB, NOT NINE ROUTES.
 *
 * Ben, 17 September 2026, looking at a sidebar that listed eight story surfaces as eight
 * destinations: "Voices hub, Registry, Story atlas, Quotes, Stories (EL), Storytellers (EL),
 * Community stories and Field notes were eight lines for one thing."
 *
 * The information architecture already said so. This file has carried a TABS array pointing at
 * seven other routes since July, and admin-routes.ts declared every one of them `absorbed`,
 * meaning "folded into a hub; still works, linked from that hub's tabs". They were tabs in
 * everything except the address bar, and each one was a page file with its own metadata.
 *
 * They are tabs now. Each body moved to ./tabs/<name>/tab.tsx keeping its own client component
 * beside it, so the relative imports never moved and no data fetching changed. Seven routes
 * became one, and every old URL still lands on the right tab through next.config.ts.
 *
 * The create forms stay as their own routes, because a form needs a URL you can return to:
 * /admin/el-stories/new, /admin/el-stories/[id]/edit and /admin/el-storytellers/new.
 */
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'atlas', label: 'Atlas' },
  { id: 'registry', label: 'Registry' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'el-stories', label: 'EL stories' },
  { id: 'el-storytellers', label: 'EL storytellers' },
  { id: 'curated', label: 'Curated' },
  { id: 'community', label: 'Community lens' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default async function VoicesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const current: TabId = (TABS.find((t) => t.id === tab)?.id ?? 'overview') as TabId;

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-1 border-b pb-2">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={t.id === 'overview' ? '/admin/voices' : `/admin/voices?tab=${t.id}`}
            className={`rounded-lg px-3 py-1.5 text-sm ${current === t.id ? 'bg-muted font-semibold' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </Link>
        ))}
        <Link href="/admin/voice-impact" className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
          Voice Impact Model
        </Link>
      </nav>

      {current === 'overview' && <VoicesOverview />}
      {current === 'atlas' && <StoryAtlasTab />}
      {current === 'registry' && <RegistryTab />}
      {current === 'quotes' && <QuotesTab />}
      {current === 'el-stories' && <ElStoriesTab />}
      {current === 'el-storytellers' && <ElStorytellersTab />}
      {current === 'curated' && <CuratedStoriesTab />}
      {current === 'community' && <CommunityLensTab />}
    </div>
  );
}

function VoicesOverview() {
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
          className="rounded-xl bg-primary text-amber-400 px-4 py-2 text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Consent worklist · {holds} hold{holds === 1 ? '' : 's'}
        </Link>
      </header>


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
                      <td className="px-4 py-2.5 text-muted-foreground">{s.community || 'not recorded'}</td>
                      <td className={`px-4 py-2.5 font-semibold ${TIER_TONE[s.tier]}`}>{s.tier}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {isHold ? 'held' : provenanceLabel(prov)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{isHold ? 'held' : usable}</td>
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
