'use client';

import { useMemo, useState, useTransition } from 'react';
import type { PhotoStory } from './page';
import { reviewPhoto } from './actions';

const COMMUNITY_LABELS: Record<string, string> = {
  'utopia-homelands': 'Utopia Homelands',
  'alice-springs': 'Alice Springs',
  'tennant-creek': 'Tennant Creek',
};

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
  const [, startTransition] = useTransition();

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
    return photos.filter((p) => {
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
  }, [photos, filterMediaType, filterUse, filterTag, filterCommunity, filterDay, filterSource, onlyDecoded]);

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
                <span className="font-bold text-amber-300">{selected.size}</span> selected for deck
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="rounded border border-stone-700 px-3 py-1 text-xs hover:bg-stone-800"
                >
                  Clear
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
            <pre className="max-h-32 overflow-y-auto rounded bg-stone-800 p-2 text-[11px] leading-relaxed">
              {markdown}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
