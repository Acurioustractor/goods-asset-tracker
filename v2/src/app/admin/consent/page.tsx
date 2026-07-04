// Content system — the consent worklist. The operational face of the Goods
// consent model. EL is the source of truth; the indexer derives one tier per
// asset (scripts/content-index.mjs elConsentTier):
//   blocked (red) = sacred-no-publish / storyteller-withdrawn / not public
//   showing (public) = public, on the site, not yet elder-reviewed
//   cleared (gated) = public AND elder-approved (funder/press/hero tier)
// The sweep now = elder-review the "showing" media to promote it to "cleared".

import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Row {
  consent_tier: string | null;
  source: string;
  media_type: string;
  archived_at: string | null;
}

async function fetchCounts() {
  try {
    const supabase = createServiceClient();
    const [ci, st] = await Promise.all([
      supabase.from('content_items').select('consent_tier, source, media_type, archived_at'),
      supabase.from('storytellers').select('consent_tier'),
    ]);
    if (ci.error) return { ready: false, live: [] as Row[], storytellers: 0 };
    const live = ((ci.data ?? []) as Row[]).filter((r) => !r.archived_at);
    return { ready: true, live, storytellers: (st.data ?? []).length };
  } catch {
    return { ready: false, live: [] as Row[], storytellers: 0 };
  }
}

// Named real-world clearances (context the tier can't capture on its own).
const PRIORITY: { item: string; why: string; needed: string; priority: 'high' | 'medium' }[] = [
  {
    item: 'Elder-review the showing Goods media',
    why: 'Public Goods photos and videos show on the site now, but none are elder-approved yet, so none can carry the cleared/funder tier.',
    needed: 'In Empathy Ledger, mark elder_approved on the Goods media. On the next index run they promote from "showing" to "cleared".',
    priority: 'high',
  },
  {
    item: 'Golden-hour human hero still',
    why: 'The number-one hero we already hold. Becomes the consent-cleared human hero the pitch is missing.',
    needed: 'Clear community-testing-bed-golden-hour.jpg with the person in it. Held, consent pending.',
    priority: 'high',
  },
  {
    item: 'Jaquilane testimony + overlay',
    why: 'The only testimony and only overlay we hold. Pulled from /story, /gallery and /stories pending a single confirmed clearance.',
    needed: 'Confirm clearance in one place, then re-add. Or retire the clip.',
    priority: 'high',
  },
  {
    item: 'Karen Liddle clip (karen-liddle-on-beds)',
    why: 'A high-value Oonchiumpa partner clip, but named clearance was not confirmable.',
    needed: 'Verify Karen Liddle named clearance before any funder or public use.',
    priority: 'medium',
  },
  {
    item: 'Ampilatwatja OAM Elders',
    why: 'Cleared for use, but full names must be confirmed before crediting by name.',
    needed: 'Confirm the Elders full names before crediting.',
    priority: 'medium',
  },
];

function Stat({ n, label, tone }: { n: number; label: string; tone: 'red' | 'green' | 'amber' | 'neutral' }) {
  const cls =
    tone === 'red' ? 'text-red-700'
    : tone === 'green' ? 'text-emerald-700'
    : tone === 'amber' ? 'text-amber-700'
    : 'text-foreground';
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <div className={'text-3xl font-bold tabular-nums ' + cls}>{n}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export default async function ConsentPage() {
  const { ready, live, storytellers } = await fetchCounts();
  const blocked = live.filter((r) => r.consent_tier === 'red').length;
  const cleared = live.filter((r) => r.consent_tier === 'gated').length;
  const showing = live.filter((r) => r.consent_tier === 'public');
  const showingCount = showing.length;
  // EL media that shows on the site but is not yet elder-reviewed = the backlog.
  const elBacklog = showing.filter((r) => r.source === 'el');
  const elBacklogImg = elBacklog.filter((r) => r.media_type === 'image').length;
  const elBacklogVid = elBacklog.filter((r) => r.media_type === 'video').length;

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Consent worklist</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          One consent model, sourced from Empathy Ledger. Public media shows on the site with hard
          stops always enforced (sacred and storyteller-withdrawn never appear). The sweep is to
          elder-review the showing media so it can carry the cleared, funder-facing tier.
        </p>
        {!ready && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            content_items not reachable. Run <code>cd v2 &amp;&amp; npm run content:index</code>.
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Stat n={showingCount} label="showing (public)" tone="green" />
        <Stat n={cleared} label="cleared (elder-approved)" tone="green" />
        <Stat n={blocked} label="blocked (never shows)" tone="red" />
        <Stat n={storytellers} label="cleared storytellers" tone="green" />
      </div>

      {/* The elder-review backlog */}
      <section className="mb-8 rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-amber-500 text-white px-5 py-3">
          <h2 className="text-lg font-semibold">Elder-review backlog: Empathy Ledger ({elBacklog.length})</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground mb-3 max-w-2xl">
            <b>{elBacklogImg} photos</b> and <b>{elBacklogVid} videos</b> from the Goods project show on
            the site now (public in Empathy Ledger, not sacred, not withdrawn) but are <b>not yet
            elder-approved</b>, so they can&apos;t carry the cleared tier used for funder and press
            collateral. Mark them elder_approved in Empathy Ledger to promote them.
          </p>
          <p className="text-xs text-muted-foreground">
            Where: the Empathy Ledger admin (Goods project media). Then run{' '}
            <code>cd v2 &amp;&amp; npm run content:index</code> and they move to <b>cleared</b>.
          </p>
        </div>
      </section>

      {/* Named clearances */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Named clearances</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Item</th>
                <th className="px-3 py-2 text-left">Why it matters</th>
                <th className="px-3 py-2 text-left">What&apos;s needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PRIORITY.map((p) => (
                <tr key={p.item} className="align-top">
                  <td className="px-3 py-2">
                    <span
                      className={
                        'mr-1.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase align-middle ' +
                        (p.priority === 'high' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white')
                      }
                    >
                      {p.priority}
                    </span>
                    <span className="font-semibold">{p.item}</span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{p.why}</td>
                  <td className="px-3 py-2 text-xs text-foreground">{p.needed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-4">
        Tiers are derived from Empathy Ledger by the indexer, not set here. The cleared allowlist
        ({storytellers} storytellers) drives named voices, see <b>/admin/people</b>. Track what to
        shoot on <b>/admin/media-gaps</b>. Full plan:{' '}
        <code>wiki/outputs/2026-07-03-thematic-media-system.md</code>.
      </footer>
    </div>
  );
}
