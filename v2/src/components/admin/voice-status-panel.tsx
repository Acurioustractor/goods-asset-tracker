import Link from 'next/link';
import type { TripStory } from '@/lib/data/trip-stories';

// Source row: every voice surface in the story, normalised to one shape.
interface VoiceRow {
  source: 'voices' | 'pulls' | 'bleedquote';
  blockLabel: string;
  quote: string;
  who: string | null;
  community: string | null;
  consent: 'cleared' | 'pending' | 'unknown';
  storytellerSlug: string | null;
}

function trimQuote(s: string, n = 90): string {
  const clean = s.replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim();
  return clean.length > n ? clean.slice(0, n - 1) + '…' : clean;
}

// "Mykel · consent pending" → { who: 'Mykel', consent: 'pending' }
// "Goods on Country team note · 21 May 2026" → { who: 'Goods team', consent: 'unknown' }
function parsePullSrc(src: string): { who: string; consent: VoiceRow['consent'] } {
  const parts = src.split(/\s*·\s*/);
  const who = parts[0] || src;
  const rest = parts.slice(1).join(' ').toLowerCase();
  let consent: VoiceRow['consent'] = 'unknown';
  if (rest.includes('cleared')) consent = 'cleared';
  else if (rest.includes('pending')) consent = 'pending';
  return { who, consent };
}

function extractVoices(story: TripStory): VoiceRow[] {
  const rows: VoiceRow[] = [];
  for (const block of story.blocks) {
    if (block.kind === 'voices') {
      for (const c of block.cards) {
        rows.push({
          source: 'voices',
          blockLabel: block.heading || 'Voices',
          quote: c.quote,
          who: c.who,
          community: c.community || null,
          consent: c.consent,
          storytellerSlug: c.storytellerSlug || null,
        });
      }
    } else if (block.kind === 'read' && 'pulls' in block && block.pulls) {
      for (const p of block.pulls) {
        const { who, consent } = parsePullSrc(p.src);
        rows.push({
          source: 'pulls',
          blockLabel: block.heading || 'Read',
          quote: p.quote,
          who,
          community: null,
          consent,
          storytellerSlug: null,
        });
      }
    } else if (block.kind === 'bleedquote') {
      rows.push({
        source: 'bleedquote',
        blockLabel: 'Bleedquote',
        quote: block.text,
        who: null,
        community: null,
        consent: 'unknown',
        storytellerSlug: null,
      });
    }
  }
  return rows;
}

function createUrl(row: VoiceRow): string {
  const params = new URLSearchParams();
  if (row.who) params.set('name', row.who);
  if (row.community) params.set('community', row.community);
  params.set('consentSource', row.community === 'Utopia Homelands' ? 'oonchiumpa' : 'direct-recipient');
  return `/admin/el-storytellers/new?${params.toString()}`;
}

export function VoiceStatusPanel({ story }: { story: TripStory }) {
  const rows = extractVoices(story);
  const cleared = rows.filter((r) => r.consent === 'cleared').length;
  const pending = rows.filter((r) => r.consent === 'pending').length;
  const wired = rows.filter((r) => r.storytellerSlug).length;
  const needsWiring = rows.filter((r) => r.consent === 'cleared' && !r.storytellerSlug).length;

  return (
    <section className="border-b border-amber-200 bg-amber-50/50 px-6 py-5">
      <header className="mb-3 flex flex-wrap items-baseline gap-3">
        <h2 className="text-lg font-bold tracking-tight text-amber-950">Voices in this story</h2>
        <span className="text-xs text-amber-900">
          {rows.length} total ·{' '}
          <span className="font-semibold">{cleared} cleared</span> ·{' '}
          <span className="font-semibold">{pending} pending</span> ·{' '}
          <span className="font-semibold">{wired} wired to EL</span>
          {needsWiring > 0 && (
            <> · <span className="font-semibold text-red-700">{needsWiring} cleared but unwired</span></>
          )}
        </span>
      </header>

      <div className="overflow-hidden rounded-lg border border-amber-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-amber-100/60 text-xs uppercase tracking-wide text-amber-900">
            <tr>
              <th className="px-3 py-2 text-left">Block</th>
              <th className="px-3 py-2 text-left">Who</th>
              <th className="px-3 py-2 text-left">Quote</th>
              <th className="px-3 py-2 text-left">Community</th>
              <th className="px-3 py-2 text-left">Consent</th>
              <th className="px-3 py-2 text-left">Storyteller</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-amber-50/40">
                <td className="px-3 py-2 text-xs text-amber-900">{r.blockLabel}</td>
                <td className="px-3 py-2 font-medium text-gray-900">
                  {r.who || <span className="italic text-gray-400">unattributed</span>}
                </td>
                <td className="px-3 py-2 max-w-[36ch] text-xs text-gray-700">{trimQuote(r.quote)}</td>
                <td className="px-3 py-2 text-xs text-gray-600">{r.community || '—'}</td>
                <td className="px-3 py-2 text-xs">
                  {r.consent === 'cleared' && (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800">cleared</span>
                  )}
                  {r.consent === 'pending' && (
                    <span className="rounded bg-amber-200 px-2 py-0.5 text-amber-900">pending</span>
                  )}
                  {r.consent === 'unknown' && (
                    <span className="rounded bg-stone-100 px-2 py-0.5 text-stone-600">unknown</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs">
                  {r.storytellerSlug ? (
                    <Link
                      href={`/storytellers/${r.storytellerSlug}`}
                      target="_blank"
                      className="text-blue-700 hover:underline"
                    >
                      /storytellers/{r.storytellerSlug} ↗
                    </Link>
                  ) : r.who ? (
                    <Link
                      href={createUrl(r)}
                      target="_blank"
                      className="rounded border border-amber-600 px-2 py-0.5 font-semibold text-amber-700 hover:bg-amber-600 hover:text-white"
                    >
                      + Create in EL
                    </Link>
                  ) : (
                    <span className="italic text-gray-400">attribute first</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-amber-900">
        After creating a storyteller, copy the <code className="rounded bg-white px-1">slug</code>{' '}
        shown on the success message into the matching voice card&apos;s{' '}
        <code className="rounded bg-white px-1">storytellerSlug</code> field in{' '}
        <code className="rounded bg-white px-1">src/lib/data/trip-stories.ts</code>.
      </p>
    </section>
  );
}
