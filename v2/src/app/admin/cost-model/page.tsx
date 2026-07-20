/**
 * THE COST STORY — /admin/cost-model
 *
 * One narrative page that explains the Goods cost model the way we explain it
 * to funders: seven chapters, every figure carrying an honesty label, every
 * trap named. Replaces the four aesthetic "skins" (archived 2026-07-20 →
 * _archive/2026-07-20-cost-model-skins/). The locked engine remains at
 * `@/lib/cost-model` for the playable model when we need it.
 *
 * Data: `@/lib/data/cost-story` (Notion first-principles DB + advisor Q&A,
 * canon-corrected). This page renders the story; it holds no numbers itself.
 */
import {
  COST_STORY_SPINE,
  COST_CHAPTERS,
  COST_OPEN_ITEMS,
  SOLIDITY_LABEL,
  type Solidity,
} from '@/lib/data/cost-story';

export const metadata = {
  title: 'The Cost Story — Goods on Country',
  description:
    'The Goods cost model as a plain-language narrative: what a bed costs, what stays, and what the capital buys — every figure labelled by how solid it is.',
};

const SOLIDITY_STYLE: Record<Solidity, string> = {
  verified: 'bg-accent/15 text-accent-foreground border-accent/40',
  workpaper: 'bg-muted text-muted-foreground border-border',
  modelled: 'bg-primary/10 text-primary border-primary/30',
  target: 'bg-amber-50 text-amber-800 border-amber-200',
  conflict: 'bg-red-50 text-red-700 border-red-200',
  retired: 'bg-muted text-muted-foreground/70 border-border line-through',
};

export default function CostStoryPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-16">
      {/* Hero */}
      <header className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          Money story · cost model v6
        </p>
        <h1 className="font-display text-3xl text-foreground">
          How a $750 bed becomes a business
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The whole model in one move: stop paying 8.6× markup on the one part we buy
          finished. Every figure below is labelled by how solid it is — verified means an
          invoice or signed document, modelled means built from verified inputs but not
          yet demonstrated. We lead with the honest gaps; that is the pitch.
        </p>
      </header>

      {/* The 30-second story */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg text-foreground">The 30-second version</h2>
        <ol className="mt-4 space-y-3">
          {COST_STORY_SPINE.map((line, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                {i + 1}
              </span>
              {line}
            </li>
          ))}
        </ol>
      </section>

      {/* The chapters */}
      {COST_CHAPTERS.map((chapter, idx) => (
        <section key={chapter.slug} id={chapter.slug} className="space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Chapter {idx + 1}
            </p>
            <h2 className="font-display text-2xl text-foreground">{chapter.title}</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {chapter.lede}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {chapter.facts.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{fact.label}</p>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${SOLIDITY_STYLE[fact.solidity]}`}
                  >
                    {SOLIDITY_LABEL[fact.solidity]}
                  </span>
                </div>
                <p className="font-display text-xl text-foreground">{fact.value}</p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {fact.means}
                </p>
                {fact.watchOut && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">
                    <span className="font-semibold">Watch out:</span> {fact.watchOut}
                  </p>
                )}
                <p className="mt-auto text-[11px] text-muted-foreground/70">
                  Source: {fact.source}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Open items */}
      <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <h2 className="font-display text-lg text-foreground">
          What blocks “signed off” (Ben + accountant)
        </h2>
        <ul className="mt-4 space-y-2">
          {COST_OPEN_ITEMS.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] text-muted-foreground">
          Sources: the advisor Q&amp;A draft (12 questions, due 24 Jul) and the
          first-principles numbers DB in Notion. The playable engine remains at{' '}
          <code className="rounded bg-muted px-1">lib/cost-model</code>; the four skin
          prototypes are archived at{' '}
          <code className="rounded bg-muted px-1">_archive/2026-07-20-cost-model-skins/</code>.
        </p>
      </section>
    </div>
  );
}
