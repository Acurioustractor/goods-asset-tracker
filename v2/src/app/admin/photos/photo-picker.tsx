'use client';

import { useMemo, useState, useTransition } from 'react';
import { reviewPhoto } from './actions';
import { bulkUpdateTags } from './bulk-tag-actions';

// Type inlined 2026-07-04 when /admin/photos was retired to a redirect (page.tsx
// no longer exports it). This client is dead code, kept in-folder for restore.
type PhotoStory = {
  id: string;
  title: string;
  content: string;
  url: string;
  videoUrl: string | null;
  isVideo: boolean;
  durationSeconds: number | null;
  tags: string[];
  isPublic: boolean;
  needsElder: boolean;
  consent: boolean;
  location: string | null;
  bedId: string | null;
  community: string | null;
  day: string | null;
  source: string | null;
  use: string | null;
  themes: string[];
  createdAt: string;
};

const COMMUNITY_LABELS: Record<string, string> = {
  'utopia-homelands': 'Utopia Homelands',
  'alice-springs': 'Alice Springs',
  'tennant-creek': 'Tennant Creek',
};

// Quick-filter chips for the most-used trip slices. Each preset applies a
// tag predicate (matchAny / matchAll over the photo's tags array). Counts
// render live from the photo set. Add new presets here as new events land.
type QuickPreset = {
  key: string;
  label: string;
  hint?: string;
  match: (tags: string[]) => boolean;
};
const QUICK_PRESETS: QuickPreset[] = [
  {
    key: 'alice-build',
    label: 'Alice build',
    hint: 'Oonchiumpa young people building beds',
    match: (t) => t.includes('event:alice-build') || t.includes('alice-springs'),
  },
  {
    key: 'utopia-delivery',
    label: 'Utopia delivery',
    hint: 'Beds going to the homes',
    match: (t) => t.includes('utopia-homelands') || t.includes('community:utopia-homelands') || t.includes('event:delivery-utopia'),
  },
  {
    key: 'ampilatwatja',
    label: 'Ampilatwatja Elders',
    hint: 'Four beds, two Order-of-Australia Elders',
    match: (t) => t.includes('ampilatwatja') || t.includes('community:ampilatwatja') || t.includes('event:elders-yarn'),
  },
  {
    key: 'trip-may-2026',
    label: 'Whole May trip',
    hint: 'Every photo + video from the May 2026 trip',
    match: (t) => t.includes('trip-may-2026') || t.includes('trip:may-2026'),
  },
  {
    key: 'needs-review',
    label: 'Needs my eyes',
    hint: 'Approved consent but not yet flipped public',
    match: (t) => t.includes('consent:elder-pending') || t.includes('pending-elder-review'),
  },
];

export function PhotoPicker({ photos }: { photos: PhotoStory[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterTag, setFilterTag] = useState<string>('');
  const [filterCommunity, setFilterCommunity] = useState<string>('');
  const [filterDay, setFilterDay] = useState<string>('');
  const [filterSource, setFilterSource] = useState<string>('');
  const [onlyDecoded, setOnlyDecoded] = useState(false);
  const [pendingReview, setPendingReview] = useState<string | null>(null);
  const [filterMediaType, setFilterMediaType] = useState<'all' | 'photo' | 'video'>('all');
  const [filterUse, setFilterUse] = useState<string>('');
  const [quickPreset, setQuickPreset] = useState<string | null>('alice-build');
  const [, startTransition] = useTransition();
  const [bulkPanelOpen, setBulkPanelOpen] = useState(false);
  const [bulkAddCsv, setBulkAddCsv] = useState('');
  const [bulkRemoveCsv, setBulkRemoveCsv] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ ok: number; fail: number } | null>(null);

  async function runBulkTag() {
    setBulkBusy(true);
    setBulkResult(null);
    try {
      const res = await bulkUpdateTags({
        storyIds: [...selected],
        add: bulkAddCsv.split(',').map((t) => t.trim()).filter(Boolean),
        remove: bulkRemoveCsv.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setBulkResult({ ok: res.ok.length, fail: res.fail.length });
      if (res.fail.length === 0) {
        setBulkAddCsv('');
        setBulkRemoveCsv('');
        // Wait a moment for revalidation, then refresh
        setTimeout(() => window.location.reload(), 800);
      }
    } finally {
      setBulkBusy(false);
    }
  }

  async function review(id: string, action: 'approve' | 'elder-ok' | 'unpublish') {
    setPendingReview(id);
    try {
      const res = await reviewPhoto(id, action);
      if (!res.ok) alert(`Review failed: ${res.error}`);
      else startTransition(() => { /* triggers revalidation */ });
    } finally {
      setPendingReview(null);
    }
  }

  // Build the universe of tags + axes from the loaded photos.
  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of photos) for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [photos]);

  const communities = useMemo(() => {
    const s = new Set<string>();
    for (const p of photos) if (p.community) s.add(p.community);
    return [...s].sort();
  }, [photos]);

  const days = useMemo(() => {
    const s = new Set<string>();
    for (const p of photos) if (p.day) s.add(p.day);
    return [...s].sort();
  }, [photos]);

  const sources = useMemo(() => {
    const s = new Set<string>();
    for (const p of photos) if (p.source) s.add(p.source);
    return [...s].sort();
  }, [photos]);

  const uses = useMemo(() => {
    const s = new Set<string>();
    for (const p of photos) if (p.use) s.add(p.use);
    return [...s].sort();
  }, [photos]);

  const filtered = useMemo(() => {
    const preset = quickPreset ? QUICK_PRESETS.find((p) => p.key === quickPreset) : null;
    return photos.filter((p) => {
      if (preset && !preset.match(p.tags)) return false;
      if (filterMediaType === 'photo' && p.isVideo) return false;
      if (filterMediaType === 'video' && !p.isVideo) return false;
      if (filterUse && p.use !== filterUse) return false;
      if (filterTag && !p.tags.includes(filterTag)) return false;
      if (filterCommunity && p.community !== filterCommunity) return false;
      if (filterDay && p.day !== filterDay) return false;
      if (filterSource && p.source !== filterSource) return false;
      if (onlyDecoded && !p.bedId) return false;
      return true;
    });
  }, [photos, filterMediaType, filterUse, filterTag, filterCommunity, filterDay, filterSource, onlyDecoded, quickPreset]);

  // Live counts per preset, computed once. Lets the chips show "(120)" so
  // you know which bucket is worth opening before clicking.
  const presetCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const preset of QUICK_PRESETS) {
      counts[preset.key] = photos.filter((p) => preset.match(p.tags)).length;
    }
    return counts;
  }, [photos]);

  const selectedPhotos = useMemo(
    () => photos.filter((p) => selected.has(p.id)),
    [photos, selected],
  );

  const markdown = useMemo(() => {
    if (selectedPhotos.length === 0) return '(no photos selected yet — click tiles to add)';
    return selectedPhotos
      .map((p) => {
        const parts = [
          p.bedId ? `bed ${p.bedId}` : null,
          p.community ? COMMUNITY_LABELS[p.community] || p.community : null,
          p.day ? p.day.replace('day-', 'Day ') : null,
        ].filter(Boolean).join(' · ');
        return `![${parts || p.title}](${p.url})`;
      })
      .join('\n\n');
  }, [selectedPhotos]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setFilterTag('');
    setFilterCommunity('');
    setFilterDay('');
    setFilterSource('');
    setOnlyDecoded(false);
    setFilterMediaType('all');
    setFilterUse('');
    setQuickPreset(null);
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      alert('Copy failed — select the text manually.');
    }
  }

  return (
    <div className="space-y-4 pb-32">
      {/* Quick-filter chips: one-click presets for the most-used trip slices. */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Jump to
        </span>
        <button
          type="button"
          onClick={() => setQuickPreset(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            quickPreset === null
              ? 'bg-gray-900 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          All ({photos.length})
        </button>
        {QUICK_PRESETS.map((preset) => {
          const count = presetCounts[preset.key] ?? 0;
          const active = quickPreset === preset.key;
          const dim = count === 0;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => setQuickPreset(active ? null : preset.key)}
              disabled={dim}
              title={preset.hint}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                active
                  ? 'bg-amber-600 text-white shadow-sm'
                  : dim
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {preset.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Video drop-zone hint: filename convention for upload-videos.mjs */}
      <details className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3 text-xs text-stone-600">
        <summary className="cursor-pointer font-semibold text-stone-800">
          + How to add videos with thumbnails
        </summary>
        <div className="mt-2 space-y-2 leading-relaxed">
          <p>
            Drop a folder of MP4/MOV files and run the uploader. It auto-extracts
            a poster frame at 1s, re-encodes to web-friendly H.264 1080p, tags
            from the filename, and writes to EL.
          </p>
          <p>
            <strong>Filename convention:</strong>{' '}
            <code className="rounded bg-white px-1.5 py-0.5">
              {'{use}_{community}_{subject}_{duration}s.mp4'}
            </code>
          </p>
          <p>Examples:</p>
          <ul className="list-disc pl-5 space-y-0.5 font-mono text-[11px]">
            <li>testimonial_alice_mykel-bed-talk_28s.mov</li>
            <li>hero-overlay_utopia_arrival-wide_12s.mp4</li>
            <li>per-bed_utopia_gb0-156-96_22s.mp4</li>
            <li>setup_universal_stretch-bed-assembly_85s.mp4</li>
          </ul>
          <p>
            Then run from <code>v2/</code>:{' '}
            <code className="rounded bg-white px-1.5 py-0.5">
              node scripts/upload-videos.mjs /path/to/folder --trip trip-may-2026
            </code>
          </p>
        </div>
      </details>

      {/* Filter bar */}
      <div className="rounded-lg border bg-white p-3 space-y-3">
        {/* Media-type segmented control — photos vs videos vs both */}
        <div className="flex gap-1 rounded-md border bg-gray-50 p-1 w-fit text-xs">
          {(['all', 'photo', 'video'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterMediaType(t)}
              className={`rounded px-3 py-1 font-medium transition ${filterMediaType === t ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {t === 'all' && 'All media'}
              {t === 'photo' && '📷 Photos'}
              {t === 'video' && '🎬 Videos'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {uses.length > 0 && (
            <select
              value={filterUse}
              onChange={(e) => setFilterUse(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1.5 text-sm"
              title="Video use type"
            >
              <option value="">All uses</option>
              {uses.map((u) => (
                <option key={u} value={u}>use:{u}</option>
              ))}
            </select>
          )}
          <select
            value={filterCommunity}
            onChange={(e) => setFilterCommunity(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">All communities</option>
            {communities.map((c) => (
              <option key={c} value={c}>{COMMUNITY_LABELS[c] || c}</option>
            ))}
          </select>
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">All days</option>
            {days.map((d) => (
              <option key={d} value={d}>{d.replace('day-', 'Day ')}</option>
            ))}
          </select>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s.replace('-', ' ')}</option>
            ))}
          </select>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">All tags</option>
            {allTags.map(([t, n]) => (
              <option key={t} value={t}>{t} ({n})</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                checked={onlyDecoded}
                onChange={(e) => setOnlyDecoded(e.target.checked)}
                className="h-3.5 w-3.5"
              />
              <span>Only with bed ID</span>
            </label>
            <span>
              Showing <span className="font-bold text-gray-900">{filtered.length}</span> of {photos.length}
            </span>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded border border-gray-200 px-2 py-1 hover:bg-gray-50"
          >
            Reset filters
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((p) => {
          const isSel = selected.has(p.id);
          const isPending = pendingReview === p.id;
          return (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-lg border-2 bg-white transition-all ${
                isSel ? 'border-amber-500 shadow-lg' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className="block w-full text-left"
                aria-label={`${isSel ? 'Deselect' : 'Select'} ${p.title}`}
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  {p.isVideo && (
                    <>
                      {/* Centred ▶ overlay */}
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        </span>
                      </span>
                      {/* Duration badge */}
                      {p.durationSeconds && (
                        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          {p.durationSeconds >= 60 ? `${Math.floor(p.durationSeconds / 60)}:${String(Math.round(p.durationSeconds % 60)).padStart(2, '0')}` : `0:${String(Math.round(p.durationSeconds)).padStart(2, '0')}`}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div className="space-y-1 p-2 text-xs">
                  <div className="font-mono font-semibold text-amber-700">
                    {p.isVideo ? (p.use ? `🎬 ${p.use}` : '🎬 video') : (p.bedId || 'no-qr')}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.community && (
                      <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-700">
                        {COMMUNITY_LABELS[p.community] || p.community}
                      </span>
                    )}
                    {p.day && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700">
                        {p.day.replace('day-', 'Day ')}
                      </span>
                    )}
                    {p.themes.length > 0 && p.themes.slice(0, 2).map((t) => (
                      <span key={t} className="rounded bg-violet-50 px-1.5 py-0.5 text-violet-700" title={`theme: ${t}`}>
                        #{t}
                      </span>
                    ))}
                    {p.needsElder && (
                      <span className="rounded bg-red-50 px-1.5 py-0.5 text-red-700" title="Requires elder review">
                        ⚠ elder
                      </span>
                    )}
                    {p.isPublic && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800" title="Public">
                        ✓ public
                      </span>
                    )}
                    {!p.isPublic && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600" title="Not public yet">
                        private
                      </span>
                    )}
                  </div>
                  <div className="truncate text-gray-500" title={p.title}>{p.title}</div>
                </div>
                {isSel && (
                  <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                    ✓
                  </span>
                )}
              </button>
              {/* Review action row — sits outside the toggle button so clicks
                  don't accidentally toggle the deck selection. */}
              <div className="flex border-t bg-gray-50 text-[10px]">
                {!p.isPublic && (
                  <button
                    type="button"
                    onClick={() => review(p.id, 'approve')}
                    disabled={isPending}
                    className="flex-1 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                    title="Mark elder-reviewed + flip to public"
                  >
                    {isPending ? '…' : '✓ Approve public'}
                  </button>
                )}
                {p.needsElder && !p.isPublic && (
                  <button
                    type="button"
                    onClick={() => review(p.id, 'elder-ok')}
                    disabled={isPending}
                    className="flex-1 border-l py-1.5 font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                    title="Elder-reviewed but keep private"
                  >
                    Elder OK
                  </button>
                )}
                {p.isPublic && (
                  <button
                    type="button"
                    onClick={() => review(p.id, 'unpublish')}
                    disabled={isPending}
                    className="flex-1 py-1.5 font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                    title="Unpublish (back to private)"
                  >
                    {isPending ? '…' : 'Unpublish'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-gray-500">
            No photos match these filters. {photos.length === 0 && 'No EL photos found at all — check the upload script ran.'}
          </p>
        )}
      </div>

      {/* Bottom sticky panel for selection markdown */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-stone-900 text-amber-50 shadow-xl">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>
                <span className="font-bold text-amber-300">{selected.size}</span> selected
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="rounded border border-stone-700 px-3 py-1 text-xs hover:bg-stone-800"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setBulkPanelOpen(!bulkPanelOpen)}
                  className={`rounded border px-3 py-1 text-xs font-semibold ${
                    bulkPanelOpen
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-stone-700 text-amber-50 hover:bg-stone-800'
                  }`}
                  title="Add or remove tags on all selected"
                >
                  🏷️ Bulk tag
                </button>
                <button
                  type="button"
                  onClick={copyMarkdown}
                  className="rounded bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700"
                >
                  Copy Markdown
                </button>
              </div>
            </div>

            {bulkPanelOpen ? (
              <div className="space-y-2 rounded bg-stone-800 p-3 text-xs">
                <p className="text-amber-200">
                  Apply tags to all <strong className="font-bold text-amber-300">{selected.size}</strong> selected.
                  Use the canonical taxonomy: <code className="rounded bg-stone-900 px-1 text-[10px]">participant:ray-nelson</code>{' '}
                  <code className="rounded bg-stone-900 px-1 text-[10px]">theme:family</code>{' '}
                  <code className="rounded bg-stone-900 px-1 text-[10px]">community:utopia-homelands</code>{' '}
                  <code className="rounded bg-stone-900 px-1 text-[10px]">use:hero-photo</code>
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium text-emerald-300">+ Add tags (comma-separated)</span>
                    <input
                      type="text"
                      value={bulkAddCsv}
                      onChange={(e) => setBulkAddCsv(e.target.value)}
                      placeholder="theme:family, participant:ray-nelson"
                      className="w-full rounded bg-stone-900 px-2 py-1.5 font-mono text-xs text-amber-50 placeholder-stone-500"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium text-red-300">− Remove tags (comma-separated)</span>
                    <input
                      type="text"
                      value={bulkRemoveCsv}
                      onChange={(e) => setBulkRemoveCsv(e.target.value)}
                      placeholder="pending-elder-review"
                      className="w-full rounded bg-stone-900 px-2 py-1.5 font-mono text-xs text-amber-50 placeholder-stone-500"
                    />
                  </label>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-400">
                    {bulkResult && (
                      <>
                        <span className="text-emerald-400">{bulkResult.ok} updated</span>
                        {bulkResult.fail > 0 && <span className="text-red-400"> · {bulkResult.fail} failed</span>}
                      </>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={runBulkTag}
                    disabled={bulkBusy || (!bulkAddCsv.trim() && !bulkRemoveCsv.trim())}
                    className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {bulkBusy ? 'Applying…' : `Apply to ${selected.size}`}
                  </button>
                </div>
              </div>
            ) : (
              <pre className="max-h-32 overflow-y-auto rounded bg-stone-800 p-2 text-[11px] leading-relaxed">
                {markdown}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
