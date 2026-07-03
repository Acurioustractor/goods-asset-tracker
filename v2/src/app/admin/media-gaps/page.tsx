// Content system — the media gap dashboard. Per-theme matrix of what media
// exists (image / video / overlay) vs what we still need to shoot, read straight
// from content_items. The operational face of the gap list in
// wiki/outputs/2026-07-03-thematic-media-system.md.

import { createServiceClient } from '@/lib/supabase/server';
import { THEMES, themeForItem } from '@/lib/data/themes';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// What to shoot per theme (from the thematic-media-system gap list). HIGH = blocks
// a funder-facing point or the story heart.
const GAP_NOTES: Record<string, { priority: 'high' | 'medium'; need: string }> = {
  storytellers: { priority: 'high', need: 'Consent sweep is the #1 unlock (most EL videos + the only overlay are blocked). Then to-camera testimonies from cleared voices.' },
  'jobs-ownership': { priority: 'high', need: 'Ownership-handover / local-operators-running-the-plant clip. Only a chart exists today.' },
  'rest-health': { priority: 'high', need: 'Washing-machine-in-use video + a Dianne Stokes on-camera clip. The whole washer line is video-dark.' },
  'cost-curve': { priority: 'high', need: 'THE ASK motion piece + a match-progress overlay ($0 of $400K, weeks remaining).' },
  dignity: { priority: 'high', need: 'A matched before/after (floor mattress, then the same person on a bed, same room). The fastest case-maker.' },
  'plastic-to-plant': { priority: 'medium', need: 'A shred, press, cut process overlay over the plant background (background exists).' },
  manufacturing: { priority: 'medium', need: 'Alice-build overlays (the boys/girls building) + a CNC/press process reel.' },
  product: { priority: 'medium', need: 'An assembly timelapse overlay + a mobile variant of assembly.mp4.' },
  'community-design': { priority: 'medium', need: 'Design-in-community footage + the connectors clip. Verify named-person clearance first.' },
  communities: { priority: 'medium', need: 'A representative clip per community + a region/road drone shot; wire the live map.' },
};

interface Row {
  media_type: string;
  media_subtype: string | null;
  area: string | null;
  canon_slot: string | null;
  tags: string[] | null;
  archived_at: string | null;
  consent_tier: string | null;
}

async function fetchRows(): Promise<{ rows: Row[]; ready: boolean }> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('content_items')
      .select('media_type, media_subtype, area, canon_slot, tags, archived_at, consent_tier');
    if (error) return { rows: [], ready: false };
    return { rows: (data ?? []) as Row[], ready: true };
  } catch {
    return { rows: [], ready: false };
  }
}

function Cell({ n, label }: { n: number; label: string }) {
  const cls = n > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700';
  return (
    <td className="px-3 py-2 text-center">
      <span className={'inline-block min-w-[2.5rem] rounded-full px-2 py-0.5 text-xs font-semibold ' + cls}>
        {n > 0 ? `${n}` : '0'}
      </span>
      <span className="sr-only">{label}</span>
    </td>
  );
}

export default async function MediaGapsPage() {
  const { rows: all, ready } = await fetchRows();
  const rows = all.filter((r) => !r.archived_at);

  const stat = new Map(THEMES.map((t) => [t.id, { img: 0, vid: 0, overlay: 0, cleared: 0, blocked: 0, canonVideoLocal: false }]));
  let unthemed = 0;
  for (const r of rows) {
    const id = themeForItem({ area: r.area, canonSlot: r.canon_slot, tags: r.tags });
    if (!id || !stat.has(id)) { unthemed += 1; continue; }
    const s = stat.get(id)!;
    if (r.media_type === 'video') s.vid += 1;
    else s.img += 1;
    if (r.media_subtype === 'overlay') s.overlay += 1;
    // A local canon video (a video content_item with a canon_slot) is always
    // available; a slot resolving to a remote EL url never reaches content_items.
    if (r.media_type === 'video' && r.canon_slot) s.canonVideoLocal = true;
    if (r.consent_tier === 'red') s.blocked += 1;
    else s.cleared += 1;
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Media gaps</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What media each theme has (image / video / overlay) versus what we still need to shoot.
          Green means we have it, red means it is missing. {unthemed} items are not yet themed.
          Full plan: <code>wiki/outputs/2026-07-03-thematic-media-system.md</code>.
        </p>
        {!ready && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            content_items not reachable. Run <code>cd v2 &amp;&amp; npm run content:index</code>.
          </p>
        )}
      </header>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Theme</th>
              <th className="px-3 py-2 text-center">Images</th>
              <th className="px-3 py-2 text-center">Videos</th>
              <th className="px-3 py-2 text-center">Overlays</th>
              <th className="px-3 py-2 text-center">Canon video</th>
              <th className="px-3 py-2 text-center">Consent</th>
              <th className="px-3 py-2 text-left">What we still need</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {THEMES.map((t) => {
              const s = stat.get(t.id)!;
              const gap = GAP_NOTES[t.id];
              return (
                <tr key={t.id} className="align-top">
                  <td className="px-3 py-2">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">{t.investment}</div>
                  </td>
                  <Cell n={s.img} label="images" />
                  <Cell n={s.vid} label="videos" />
                  <Cell n={s.overlay} label="overlays" />
                  <td className="px-3 py-2 text-center">
                    <span
                      className={
                        'inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ' +
                        (s.canonVideoLocal ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700')
                      }
                    >
                      {s.canonVideoLocal ? 'local' : 'none'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center text-xs">
                    <span className="text-emerald-700">{s.cleared} ok</span>
                    {s.blocked > 0 && <span className="text-red-600"> · {s.blocked} red</span>}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {gap && (
                      <span
                        className={
                          'mr-1.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ' +
                          (gap.priority === 'high' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white')
                        }
                      >
                        {gap.priority}
                      </span>
                    )}
                    {gap?.need ?? 'Covered.'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
