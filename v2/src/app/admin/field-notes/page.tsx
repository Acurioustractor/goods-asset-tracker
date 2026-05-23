import Link from 'next/link';
import type { Metadata } from 'next';
import { tripStories } from '@/lib/data/trip-stories';
import type { TripBlock } from '@/lib/data/trip-stories';

export const metadata: Metadata = {
  title: 'Field notes (internal)',
  robots: { index: false, follow: false },
};

// Block kinds sourced from story-atoms.ts (universal copy) vs hand-written
// per story. Used to show authors the ratio: more atom = more reusable.
const ATOM_KINDS = new Set(['goods-facts', 'health-facts', 'problem-statement', 'production-plant-facts', 'live-map']);
const STRUCTURAL_KINDS = new Set(['portal']);

function voiceStats(blocks: TripBlock[]): { cleared: number; pending: number } {
  let cleared = 0, pending = 0;
  for (const b of blocks) {
    if (b.kind === 'voices') {
      for (const c of b.cards) {
        if (c.consent === 'cleared') cleared++;
        else pending++;
      }
    }
  }
  return { cleared, pending };
}

function blockTypeBreakdown(blocks: TripBlock[]): { bespoke: number; atom: number; structural: number } {
  let bespoke = 0, atom = 0, structural = 0;
  for (const b of blocks) {
    if (ATOM_KINDS.has(b.kind)) atom++;
    else if (STRUCTURAL_KINDS.has(b.kind)) structural++;
    else bespoke++;
  }
  return { bespoke, atom, structural };
}

export default function FieldNotesIndex() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-light text-foreground mb-2"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Field notes
          </h1>
          <p className="text-muted-foreground max-w-prose">
            Scrollytelling stories from community trips. Each is authored as data
            in <code>src/lib/data/trip-stories.ts</code>, drawing on the atom blocks in{' '}
            <code>src/lib/data/story-atoms.ts</code>. Stories stay internal until consent
            clears in Empathy Ledger.
          </p>
        </div>
        <Link
          href="/admin/field-notes/library"
          className="shrink-0 rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
        >
          📐 Block library →
        </Link>
      </div>

      <div className="grid gap-4">
        {tripStories.map((s) => {
          const v = voiceStats(s.blocks);
          const t = blockTypeBreakdown(s.blocks);
          return (
            <div
              key={s.slug}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/field-notes/${s.slug}`} className="block">
                    <h2 className="text-xl font-medium text-foreground hover:text-amber-700 transition-colors">{s.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{s.dateline}</p>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-2 max-w-prose">{s.summary}</p>
                </div>
                <span
                  className={`shrink-0 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${
                    s.published
                      ? 'text-green-700 border-green-300 bg-green-50'
                      : 'text-amber-700 border-amber-300 bg-amber-50'
                  }`}
                >
                  {s.published ? '✓ published' : '⊘ internal only'}
                </span>
              </div>

              {/* Stats row */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded bg-stone-100 px-2 py-1">
                  <strong className="font-mono text-stone-900">{s.blocks.length}</strong> blocks
                </span>
                <span className="rounded bg-amber-50 px-2 py-1 text-amber-800">
                  <strong className="font-mono">{t.bespoke}</strong> bespoke ·{' '}
                  <strong className="font-mono">{t.atom}</strong> atom
                </span>
                {(v.cleared > 0 || v.pending > 0) && (
                  <span className="rounded bg-blue-50 px-2 py-1 text-blue-800">
                    voices:{' '}
                    <strong className="font-mono text-emerald-700">{v.cleared}</strong> cleared,{' '}
                    <strong className="font-mono text-amber-700">{v.pending}</strong> pending
                  </span>
                )}
              </div>

              {/* Action links — single full-screen experience at /field-notes.
                  Admins auto-see internal mode (consent-pending content visible)
                  via auth cookie; ?public=1 forces the public-viewer mode for
                  sanity checking before flipping published:true. */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Link
                  href={`/field-notes/${s.slug}`}
                  target="_blank"
                  className="rounded border border-blue-200 bg-blue-50 px-2 py-1 font-medium text-blue-800 hover:bg-blue-100"
                >
                  → Open (full-screen)
                </Link>
                <Link
                  href={`/field-notes/${s.slug}?public=1`}
                  target="_blank"
                  className="rounded border border-stone-200 bg-stone-50 px-2 py-1 font-medium text-stone-700 hover:bg-stone-100"
                >
                  → As public sees it
                </Link>
                <code className="rounded border bg-stone-50 px-2 py-1 text-stone-600">
                  src/lib/data/trip-stories.ts · slug: {s.slug}
                </code>
              </div>
            </div>
          );
        })}
      </div>

      <details className="mt-8 rounded-lg border bg-stone-50 p-4 text-xs">
        <summary className="cursor-pointer font-medium text-stone-700">
          ✍️ How to add a new field note
        </summary>
        <ol className="mt-3 ml-4 list-decimal space-y-1.5 text-stone-600">
          <li>
            Open <code className="rounded bg-white px-1.5 py-0.5">src/lib/data/trip-stories.ts</code>{' '}
            and add a new TripStory entry. Copy an existing one as template.
          </li>
          <li>
            Set <code>slug</code>, <code>title</code>, <code>summary</code>, <code>dateline</code>.
            Keep <code>published: false</code> until consent clears.
          </li>
          <li>
            Fill <code>blocks: []</code> with a mix of bespoke (masthead, immersive, bleedquote,
            voices, close, pathways) and atom (goods-facts, health-facts, problem-statement, etc.)
            blocks. See the{' '}
            <Link href="/admin/field-notes/library" className="font-medium text-blue-700 hover:underline">
              block library
            </Link>{' '}
            for every available kind with examples + copy-as-snippet buttons.
          </li>
          <li>
            Drop trip photos in <code>v2/public/images/stories/&lt;slug&gt;/</code> and videos in{' '}
            <code>v2/public/video/&lt;slug&gt;/</code>.
          </li>
          <li>
            For voice cards, set <code>consent: &apos;pending&apos;</code> until verified in EL per{' '}
            <code>CONSENT_PROCESS.md</code>. Internal preview shows them; public route does not until
            <code> published: true</code>.
          </li>
          <li>Preview at <code>/admin/field-notes/&lt;slug&gt;</code>. Iterate the prose.</li>
        </ol>
      </details>
    </div>
  );
}
