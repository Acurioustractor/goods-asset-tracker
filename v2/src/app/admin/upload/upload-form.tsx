'use client';

import { useState, useTransition } from 'react';
import { uploadMulti, type FileResult } from './actions';

const USES = [
  { value: 'atmosphere', label: 'Atmosphere — silent loop, background mood' },
  { value: 'voice', label: 'Voice — someone speaking, audio is the point' },
  { value: 'process', label: 'Process — how something works' },
  { value: 'moment', label: 'Moment — captured event' },
  { value: 'establishing', label: 'Establishing — wide shot, place + scale' },
] as const;

const PLACEMENTS = [
  { value: 'overlay-fullscreen', label: 'Hero / full-screen overlay' },
  { value: 'under-text', label: 'Under text' },
  { value: 'standalone-card', label: 'Standalone card' },
] as const;

const TRIPS = ['trip-may-2026', 'trip-april-2026', 'trip-march-2026', 'universal'];

interface Community {
  slug: string;
  name: string;
}

interface SelectedFile {
  file: File;
  preview?: string;
  isVideo: boolean;
}

export function UploadForm({ communities }: { communities: Community[] }) {
  const [pending, startTransition] = useTransition();
  const [results, setResults] = useState<FileResult[] | null>(null);
  const [selected, setSelected] = useState<SelectedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const next: SelectedFile[] = [];
    for (const f of Array.from(fileList)) {
      const isVideo = f.type.startsWith('video/');
      const isImage = f.type.startsWith('image/');
      if (!isVideo && !isImage) continue;
      const preview = isImage ? URL.createObjectURL(f) : undefined;
      next.push({ file: f, preview, isVideo });
    }
    setSelected((prev) => [...prev, ...next]);
  }

  function removeFile(index: number) {
    setSelected((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selected.length === 0) {
      setResults([{ filename: '', ok: false, type: 'other', error: 'Drop or pick at least one file.' }]);
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.delete('files'); // strip the empty input
    for (const s of selected) formData.append('files', s.file);
    setResults(null);
    startTransition(async () => {
      const r = await uploadMulti(formData);
      setResults(r.results);
      if (r.ok) setSelected([]);
    });
  }

  const hasVideo = selected.some((s) => s.isVideo);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Drop zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition ${
          dragOver
            ? 'border-amber-600 bg-amber-50'
            : selected.length > 0
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <input
          type="file"
          name="files"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        {selected.length > 0 ? (
          <p className="font-medium text-emerald-700">
            {selected.length} file{selected.length > 1 ? 's' : ''} ready — drop more or click to add
          </p>
        ) : (
          <>
            <p className="font-medium text-gray-700">Drop photos and videos here</p>
            <p className="mt-1 text-xs text-gray-500">
              Or click to select multiple. JPG / PNG / MP4 / MOV / WebM. Mix freely.
            </p>
          </>
        )}
      </label>

      {/* Selected files grid */}
      {selected.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {selected.map((s, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded border bg-gray-100">
              {s.preview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={s.preview} alt={s.file.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-stone-900 text-2xl">🎬</div>
              )}
              <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-white">
                {s.file.name}
              </span>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 rounded-full bg-red-600 px-1.5 py-0 text-xs font-bold text-white hover:bg-red-700"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Shared context for ALL files */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-gray-800">Community *</span>
          <select
            name="community"
            required
            defaultValue=""
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Pick one…
            </option>
            {communities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
            <option value="universal">(no specific community)</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-semibold text-gray-800">Trip *</span>
          <select
            name="trip"
            required
            defaultValue="trip-may-2026"
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {TRIPS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-semibold text-gray-800">
            Event tag (groups files in galleries — e.g. alice-build, delivery-utopia, elders-yarn)
          </span>
          <input
            type="text"
            name="event"
            placeholder="alice-build"
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-semibold text-gray-800">Themes (comma-separated, optional)</span>
          <input
            type="text"
            name="themes"
            placeholder="family, health, gratitude"
            className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      {/* Video-specific fields, only shown when at least one video is staged */}
      {hasVideo && (
        <fieldset className="space-y-3 rounded border border-amber-200 bg-amber-50/40 p-3">
          <legend className="text-xs font-semibold uppercase tracking-wide text-amber-900">
            Video defaults ({selected.filter((s) => s.isVideo).length} video
            {selected.filter((s) => s.isVideo).length > 1 ? 's' : ''})
          </legend>
          <label className="block space-y-1">
            <span className="text-sm font-semibold text-gray-800">Use</span>
            <select
              name="use"
              defaultValue="voice"
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {USES.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="space-y-1">
            <legend className="text-sm font-semibold text-gray-800">Placements (any apply)</legend>
            <div className="space-y-1">
              {PLACEMENTS.map((p) => (
                <label key={p.value} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="placements" value={p.value} className="h-4 w-4" />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>
      )}

      {/* Optional context */}
      <details className="rounded border border-stone-200 bg-stone-50 p-3 text-sm">
        <summary className="cursor-pointer font-semibold text-stone-700">
          + Optional: participant slug + product
        </summary>
        <div className="mt-3 space-y-3">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-gray-600">
              Participant slug (only if ONE named person is the subject + consented)
            </span>
            <input
              type="text"
              name="participant"
              placeholder="mykel"
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-gray-600">Product</span>
            <select
              name="product"
              defaultValue=""
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">(none)</option>
              <option value="stretch-bed">stretch-bed</option>
              <option value="washing-machine">washing-machine</option>
              <option value="basket-bed">basket-bed</option>
            </select>
          </label>
        </div>
      </details>

      {/* Consent gate */}
      <label className="flex items-start gap-2 rounded border border-amber-200 bg-amber-50 p-3">
        <input type="checkbox" name="hasConsent" className="mt-1 h-4 w-4" />
        <span className="text-sm">
          <span className="font-semibold text-amber-900">
            I have explicit consent for all of these to be public.
          </span>
          <br />
          <span className="text-xs text-amber-800">
            Default is pending (private until you approve via /admin/photos).
          </span>
        </span>
      </label>

      {/* Submit + results */}
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-xs text-gray-500">
          {hasVideo
            ? `Videos run through ffmpeg locally (~15s each). Photos resize via sharp (~1s each).`
            : `Photos resize via sharp (~1s each).`}
        </p>
        <button
          type="submit"
          disabled={pending || selected.length === 0}
          className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {pending ? `Uploading ${selected.length}…` : `Upload ${selected.length || ''}`}
        </button>
      </div>

      {results && results.length > 0 && (
        <div className="space-y-1">
          {results.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded border p-2 text-xs ${
                r.ok ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'
              }`}
            >
              <span className="w-12 font-mono">{r.ok ? '✓' : '✗'}</span>
              <span className="w-12 uppercase opacity-60">{r.type}</span>
              <span className="flex-1 truncate">{r.filename}</span>
              {r.ok && r.storyId && (
                <code className="text-[10px] opacity-50">{r.storyId.slice(0, 8)}</code>
              )}
              {!r.ok && r.error && <span className="text-red-700">{r.error}</span>}
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
