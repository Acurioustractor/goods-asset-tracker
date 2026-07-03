// Content system — the consent worklist. The operational face of the consent
// sweep (the #1 unlock in wiki/outputs/2026-07-03-thematic-media-system.md).
// Default-deny: an item is usable only when consent is cleared. This page shows
// what is blocked, the one bulk unlock, and the named real-world clearances.

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

// Named real-world clearances (from the shot-list consent prerequisites). These
// are not all consent_tier=red in the index (some are held locally or pulled),
// so they are tracked here as a checklist, not derived from the tier alone.
const PRIORITY: { item: string; why: string; needed: string; priority: 'high' | 'medium' }[] = [
  {
    item: 'Golden-hour human hero still',
    why: 'The number-one unlock we already hold. Becomes the consent-cleared human hero the pitch is missing.',
    needed: 'Clear community-testing-bed-golden-hour.jpg with the person in it. Held, consent pending.',
    priority: 'high',
  },
  {
    item: 'The Empathy Ledger pool',
    why: 'The single biggest unlock: a large existing library at zero shoot cost, all currently unusable.',
    needed: 'In Empathy Ledger, clear consent + Elder approval on the Goods media (see the count below). Then it re-syncs to gated automatically.',
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
    item: 'Centrecorp / Utopia clips (4)',
    why: 'Field-authentic delivery footage (bed-building, community-setup, delivery-road, good-news-full).',
    needed: 'Verify named-person and Elder clearance on each before funder or public use.',
    priority: 'medium',
  },
  {
    item: 'Ampilatwatja OAM Elders',
    why: 'Cleared for use, but full names must be confirmed before crediting by name.',
    needed: 'Confirm the Elders full names before crediting.',
    priority: 'medium',
  },
];

function Stat({ n, label, tone }: { n: number; label: string; tone: 'red' | 'green' | 'neutral' }) {
  const cls =
    tone === 'red' ? 'text-red-700' : tone === 'green' ? 'text-emerald-700' : 'text-foreground';
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <div className={'text-3xl font-bold tabular-nums ' + cls}>{n}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export default async function ConsentPage() {
  const { ready, live, storytellers } = await fetchCounts();
  const red = live.filter((r) => r.consent_tier === 'red');
  const elRed = red.filter((r) => r.source === 'el');
  const elRedImg = elRed.filter((r) => r.media_type === 'image').length;
  const elRedVid = elRed.filter((r) => r.media_type === 'video').length;
  const localRed = red.filter((r) => r.source !== 'el').length;
  const cleared = live.filter((r) => r.consent_tier === 'gated').length;
  const publicN = live.filter((r) => r.consent_tier === 'public').length;

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Consent worklist</h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Default-deny: media is used publicly or with a funder only when consent is cleared.
          Clearing consent is the biggest unlock in the media plan. This is the sweep, in order.
        </p>
        {!ready && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            content_items not reachable. Run <code>cd v2 &amp;&amp; npm run content:index</code>.
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Stat n={red.length} label="blocked (consent red)" tone="red" />
        <Stat n={cleared} label="cleared, gated" tone="green" />
        <Stat n={publicN} label="public" tone="neutral" />
        <Stat n={storytellers} label="cleared storytellers" tone="green" />
      </div>

      {/* The bulk unlock */}
      <section className="mb-8 rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-red-600 text-white px-5 py-3">
          <h2 className="text-lg font-semibold">The bulk unlock: Empathy Ledger ({elRed.length})</h2>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground mb-3 max-w-2xl">
            Every blocked item is in Empathy Ledger: <b>{elRedImg} images</b> and <b>{elRedVid} videos</b>.
            They are red because none carry both consent obtained and Elder approval. Clearing them in
            Empathy Ledger flips them to gated on the next index run, unlocking the whole pool at zero
            shoot cost. {localRed === 0 ? 'No local website media is blocked.' : `${localRed} local items are also red.`}
          </p>
          <p className="text-xs text-muted-foreground">
            Where to do it: the Empathy Ledger admin (set consent obtained + Elder approved on the Goods
            project media), then run <code>cd v2 &amp;&amp; npm run content:index</code> to re-sync.
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
                <th className="px-3 py-2 text-left">What's needed</th>
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
        The cleared allowlist ({storytellers} storytellers) drives what shows publicly, see{' '}
        <b>/admin/people</b>. Track what to shoot on <b>/admin/media-gaps</b>. Full plan:{' '}
        <code>wiki/outputs/2026-07-03-thematic-media-system.md</code> and the shot list at{' '}
        <code>2026-07-03-media-shot-list.md</code>.
      </footer>
    </div>
  );
}
