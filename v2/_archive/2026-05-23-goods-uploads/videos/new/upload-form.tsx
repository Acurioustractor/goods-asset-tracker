'use client';

import { useState, useTransition } from 'react';
import { uploadVideo } from './actions';

const USES = [
  { value: 'atmosphere', label: 'Atmosphere — silent loop, background mood' },
  { value: 'voice', label: 'Voice — someone speaking, audio is the point' },
  { value: 'process', label: 'Process — how something works (assembly, plant)' },
  { value: 'moment', label: 'Moment — captured event (unloading, the nod)' },
  { value: 'establishing', label: 'Establishing — wide shot, place + scale' },
] as const;

const PLACEMENTS = [
  { value: 'overlay-fullscreen', label: 'Hero / full-screen overlay' },
  { value: 'under-text', label: 'Under text in a section' },
  { value: 'standalone-card', label: 'Standalone card in a video gallery' },
] as const;

const TRIPS = ['trip-may-2026', 'trip-april-2026', 'trip-march-2026', 'universal'];

interface Community {
  slug: string;
  name: string;
}

export function VideoUploadForm({ communities }: { communities: Community[] }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    ok: boolean;
    storyId?: string;
    error?: string;
    posterUrl?: string;
    videoUrl?: string;
  } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setResult({ ok: false, error: 'Drop a video file or click to select one.' });
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.set('file', file);
    setResult(null);
    startTransition(async () => {
      const r = await uploadVideo(formData);
      setResult(r);
      if (r.ok) {
        // Reset form on success so they can upload another.
        (e.target as HTMLFormElement).reset();
        setFile(null);
      }
    });
  }

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
            : file
            ? 'border-emerald-500 bg-emerald-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <input
          type="file"
          accept="video/*,.mp4,.mov,.m4v,.webm"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file ? (
          <>
            <p className="font-medium text-emerald-700">{file.name}</p>
            <p className="mt-1 text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            <p className="mt-2 text-xs text-gray-400">Click or drop another to replace</p>
          </>
        ) : (
          <>
            <p className="font-medium text-gray-700">Drop a video here</p>
            <p className="mt-1 text-xs text-gray-500">or click to select. MP4 / MOV / WebM, max 500MB.</p>
          </>
        )}
      </label>

      {/* Use axis */}
      <fieldset className="space-y-1">
        <legend className="text-sm font-semibold text-gray-800">Use (what role does it play?)</legend>
        <select
          name="use"
          required
          defaultValue=""
          className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Pick one…
          </option>
          {USES.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </fieldset>

      {/* Placement axis (multi) */}
      <fieldset className="space-y-1">
        <legend className="text-sm font-semibold text-gray-800">
          Placement (where can it sit on a page? tick any that apply)
        </legend>
        <div className="space-y-1.5">
          {PLACEMENTS.map((p) => (
            <label key={p.value} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="placements" value={p.value} className="h-4 w-4" />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Context */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-gray-800">Community</span>
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
          <span className="text-sm font-semibold text-gray-800">Trip</span>
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
      </div>

      {/* Title + caption */}
      <label className="block space-y-1">
        <span className="text-sm font-semibold text-gray-800">Title</span>
        <input
          type="text"
          name="title"
          required
          placeholder="e.g. Mykel bed reflection"
          className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-gray-800">Caption (one or two sentences)</span>
        <textarea
          name="caption"
          rows={2}
          placeholder="In their own voice, after building seven beds."
          className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      {/* Optional context */}
      <details className="rounded border border-stone-200 bg-stone-50 p-3 text-sm">
        <summary className="cursor-pointer font-semibold text-stone-700">
          + Optional context (participant / themes / product)
        </summary>
        <div className="mt-3 space-y-3">
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-gray-600">
              Participant (slug, only if one named person is the subject and they&apos;ve consented)
            </span>
            <input
              type="text"
              name="participant"
              placeholder="mykel"
              className="block w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-semibold text-gray-600">Themes (comma-separated)</span>
            <input
              type="text"
              name="themes"
              placeholder="family, health, gratitude"
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
            I have explicit consent from the people in this video to make it public.
          </span>
          <br />
          <span className="text-xs text-amber-800">
            Default is consent-pending (private until elder review). Only tick this when individuals on
            camera have personally consented.
          </span>
        </span>
      </label>

      {/* Submit + result */}
      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-xs text-gray-500">
          ffmpeg runs locally to extract a poster + re-encode H.264 1080p. ~10-30s per video.
        </p>
        <button
          type="submit"
          disabled={pending || !file}
          className="rounded bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {pending ? 'Encoding…' : 'Upload to EL'}
        </button>
      </div>

      {result && (
        <div
          className={`rounded border p-3 text-sm ${
            result.ok
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-red-300 bg-red-50 text-red-900'
          }`}
        >
          {result.ok ? (
            <>
              <p className="font-semibold">Uploaded.</p>
              <p className="mt-1 text-xs">
                Story ID: <code>{result.storyId}</code>
              </p>
              <p className="mt-1 text-xs">
                Poster: <code className="break-all">{result.posterUrl}</code>
              </p>
              <p className="mt-1 text-xs">
                Video: <code className="break-all">{result.videoUrl}</code>
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold">Upload failed.</p>
              <p className="mt-1 whitespace-pre-wrap text-xs">{result.error}</p>
            </>
          )}
        </div>
      )}
    </form>
  );
}
