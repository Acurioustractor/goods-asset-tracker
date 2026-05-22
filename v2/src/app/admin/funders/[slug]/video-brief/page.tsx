import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { getFunder } from '@/lib/funders/registry';
import type { FunderConfig } from '@/lib/funders/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

/**
 * Slot requirements per funder. Tone-aware: short visual decks need 3 slot
 * types; long-form Snow-style decks add behind-the-scenes. Each slot has a
 * target length range so the page can flag mismatches.
 */
interface SlotSpec {
  use: string;
  label: string;
  description: string;
  minNeeded: number;
  targetSeconds: [number, number]; // [min, max]
}

function slotsFor(funder: FunderConfig): SlotSpec[] {
  const base: SlotSpec[] = [
    {
      use: 'overlay-bg',
      label: 'Hero overlay',
      description: 'Cinematic wide shot, silent, loops. Lives on the deck cover with the headline text on top.',
      minNeeded: 1,
      targetSeconds: [8, 15],
    },
    {
      use: 'testimonial',
      label: 'Testimonial',
      description: 'Single person to camera. Recipient, council coordinator, health partner. Funder voices.',
      minNeeded: funder.tone === 'evidence-and-named' ? 2 : 1,
      targetSeconds: [30, 60],
    },
    {
      use: 'setup',
      label: 'Setup tutorial',
      description: 'Step-by-step assembly. Universal — lives on /bed/[id] pages too. Voiceover OK.',
      minNeeded: 1,
      targetSeconds: [60, 90],
    },
  ];
  if (funder.tone === 'evidence-and-named') {
    base.push({
      use: 'behind',
      label: 'Behind-the-scenes',
      description: 'Production plant + on-country team. Music + minimal VO. Shows the model not just the product.',
      minNeeded: 1,
      targetSeconds: [60, 120],
    });
  }
  return base;
}

interface ElVideo {
  id: string;
  title: string;
  url: string;          // poster
  videoUrl: string | null;
  use: string | null;
  isPublic: boolean;
  needsElder: boolean;
  durationSeconds: number | null;
  tags: string[];
  inFunderScope: boolean;
}

async function fetchVideosFor(funder: FunderConfig): Promise<ElVideo[]> {
  if (!EL_URL || !EL_KEY || !EL_PROJECT_ID) return [];
  // Pull every Goods-project video story; filter funder-scope client-side
  // so we can show "exists but tagged for a different funder" awareness.
  const url = `${EL_URL}/rest/v1/stories` +
    `?project_id=eq.${EL_PROJECT_ID}` +
    `&tags=cs.{media-type:video}` +
    `&select=id,title,story_image_url,media_url,media_metadata,tags,is_public,requires_elder_review,elder_reviewed` +
    `&order=created_at.desc&limit=200`;
  const res = await fetch(url, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const stories = (await res.json()) as Array<{
    id: string;
    title: string | null;
    story_image_url: string | null;
    media_url: string | null;
    media_metadata: { duration_seconds?: number } | null;
    tags: string[] | null;
    is_public: boolean;
    requires_elder_review: boolean;
    elder_reviewed: boolean;
  }>;

  return stories.map((s) => {
    const tags = s.tags || [];
    const use = tags.find((t) => t.startsWith('use:'))?.slice(4) || null;
    const inFunderScope =
      funder.photoTags.some((ft) => tags.includes(ft)) ||
      (!!funder.community &&
        tags.includes(`community:${funder.community.toLowerCase().replace(/\s+/g, '-')}`));
    return {
      id: s.id,
      title: s.title || '(untitled)',
      url: s.story_image_url || s.media_url || '',
      videoUrl: s.media_url || null,
      use,
      isPublic: s.is_public,
      needsElder: s.requires_elder_review && !s.elder_reviewed,
      durationSeconds: s.media_metadata?.duration_seconds ?? null,
      tags,
      inFunderScope,
    };
  });
}

function durationLabel(secs: number | null): string {
  if (!secs) return '—';
  if (secs >= 60) return `${Math.floor(secs / 60)}:${String(Math.round(secs % 60)).padStart(2, '0')}`;
  return `0:${String(Math.round(secs)).padStart(2, '0')}`;
}

function inRange(secs: number | null, [min, max]: [number, number]): boolean {
  if (!secs) return true; // unknown duration ≠ wrong
  return secs >= min && secs <= max;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function VideoBriefPage({ params }: PageProps) {
  const { slug } = await params;
  const funder = await getFunder(slug);
  if (!funder) notFound();

  const slots = slotsFor(funder);
  const videos = await fetchVideosFor(funder);

  const slotResults = slots.map((slot) => {
    const allCandidates = videos.filter((v) => v.use === slot.use);
    const inScopePublic = allCandidates.filter((v) => v.inFunderScope && v.isPublic);
    const inScopePending = allCandidates.filter((v) => v.inFunderScope && !v.isPublic);
    const outOfScope = allCandidates.filter((v) => !v.inFunderScope);
    const filled = inScopePublic.length >= slot.minNeeded;
    return { slot, inScopePublic, inScopePending, outOfScope, filled };
  });

  const totalSlots = slots.length;
  const filledSlots = slotResults.filter((r) => r.filled).length;

  return (
    <div className="space-y-6 pb-16">
      <header>
        <p className="text-xs">
          <Link href={`/admin/funders`} className="text-blue-700 hover:underline">← back to funders</Link>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{funder.displayName} — video brief</h1>
        <p className="mt-1 text-sm text-gray-500">
          What videos this funder&apos;s reports need, and what&apos;s already in the Empathy Ledger. Filename
          convention for editor exports:{' '}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
            {'{use}_{community}_{subject}_{duration}s.mp4'}
          </code>
        </p>
      </header>

      {/* Coverage summary */}
      <div className="rounded-lg border bg-amber-50/40 p-4">
        <p className="text-sm">
          <span className="font-bold text-amber-900">{filledSlots}/{totalSlots}</span> slots filled with elder-approved video.
          {filledSlots < totalSlots && (
            <span className="ml-2 text-amber-800">
              Missing slots block deck rendering of those sections.
            </span>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {slotResults.map(({ slot, inScopePublic, inScopePending, outOfScope, filled }) => (
          <Card key={slot.use} className={filled ? 'border-emerald-200' : 'border-amber-200'}>
            <CardContent className="space-y-3 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold">
                    {slot.label}
                    <code className="ml-2 text-xs font-mono text-amber-700">use:{slot.use}</code>
                  </h2>
                  <p className="mt-1 text-xs text-gray-600">{slot.description}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Target length: <strong>{slot.targetSeconds[0]}–{slot.targetSeconds[1]}s</strong> · Need <strong>{slot.minNeeded}+</strong>
                  </p>
                </div>
                <div className="text-right">
                  {filled ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      ✓ Filled ({inScopePublic.length})
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                      ✗ Missing
                    </span>
                  )}
                </div>
              </div>

              {/* Filename hint */}
              <div className="rounded border bg-gray-50 p-2 font-mono text-[11px] text-gray-700">
                Suggested filename:&nbsp;
                <span className="text-amber-700">
                  {slot.use}_{funder.community ? funder.community.toLowerCase().replace(/\s+/g, '-') : 'utopia'}_
                  &lt;subject&gt;_&lt;duration&gt;s.mp4
                </span>
              </div>

              {/* Thumbnails for what exists */}
              {(inScopePublic.length > 0 || inScopePending.length > 0 || outOfScope.length > 0) && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {inScopePublic.map((v) => (
                    <ThumbCard key={v.id} v={v} band="ok" inRangeOk={inRange(v.durationSeconds, slot.targetSeconds)} />
                  ))}
                  {inScopePending.map((v) => (
                    <ThumbCard key={v.id} v={v} band="pending" inRangeOk={inRange(v.durationSeconds, slot.targetSeconds)} />
                  ))}
                  {outOfScope.slice(0, 2).map((v) => (
                    <ThumbCard key={v.id} v={v} band="other" inRangeOk={inRange(v.durationSeconds, slot.targetSeconds)} />
                  ))}
                </div>
              )}

              {inScopePublic.length === 0 && inScopePending.length === 0 && outOfScope.length === 0 && (
                <p className="text-xs italic text-gray-500">No videos with this use tag exist yet. Shoot or edit, then upload.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-lg border bg-gray-50 p-4 text-xs text-gray-600">
        <p className="mb-2 font-semibold text-gray-800">How to fill missing slots:</p>
        <ol className="ml-4 list-decimal space-y-1">
          <li>Edit in Premiere → export H.264 1080p mp4 with the suggested filename.</li>
          <li>Drop file(s) into any folder, then run: <code className="rounded bg-white px-1.5 py-0.5">node scripts/upload-videos.mjs &quot;/path/to/folder&quot;</code></li>
          <li>Tags auto-derive from filename. Default: pending elder review, not public.</li>
          <li>Open <Link href="/admin/photos" className="text-blue-700 hover:underline">/admin/photos</Link>, filter to <code className="rounded bg-white px-1 text-[10px]">🎬 Videos</code>, tap <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-900">✓ Approve public</span> on the hero videos.</li>
          <li>Refresh this page — the slot flips to filled. Refresh the deck preview to see the video in the report.</li>
        </ol>
      </div>
    </div>
  );
}

function ThumbCard({ v, band, inRangeOk }: { v: ElVideo; band: 'ok' | 'pending' | 'other'; inRangeOk: boolean }) {
  const ring = band === 'ok' ? 'border-emerald-300' : band === 'pending' ? 'border-amber-300' : 'border-gray-200';
  return (
    <div className={`relative overflow-hidden rounded-md border-2 ${ring} bg-white`}>
      {v.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={v.url} alt={v.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
      )}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
      </span>
      <div className="space-y-0.5 p-1.5 text-[10px]">
        <div className="flex items-center justify-between">
          <span className="font-mono">{durationLabel(v.durationSeconds)}</span>
          {!inRangeOk && v.durationSeconds && (
            <span className="rounded bg-amber-100 px-1 text-amber-800" title="Outside target range">⚠ length</span>
          )}
        </div>
        <div className="truncate text-gray-600" title={v.title}>{v.title}</div>
        <div className="flex flex-wrap gap-0.5">
          {band === 'ok' && <span className="rounded bg-emerald-50 px-1 text-emerald-700">✓ public</span>}
          {band === 'pending' && <span className="rounded bg-amber-50 px-1 text-amber-700">⚠ elder</span>}
          {band === 'other' && <span className="rounded bg-gray-100 px-1 text-gray-600">other funder</span>}
        </div>
      </div>
    </div>
  );
}
