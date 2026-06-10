'use client';

import { useMemo, useState } from 'react';
import type { DashboardImageAssignment, DashboardImageSlot } from '@/lib/data/partner-dashboard-images';

export interface ElPhoto {
  id: string;
  url: string;
  /** Small transformed thumbnail for the grid (full `url` is what gets assigned). */
  thumb: string;
  title: string;
  tags: string[];
  isPublic: boolean;
  consent: boolean;
  elderOk: boolean;
  location: string;
}

type Overrides = Record<string, DashboardImageAssignment>;

const PRESETS: { key: string; label: string; match: (p: ElPhoto) => boolean }[] = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'alice-build', label: 'Young people building', match: (p) => p.tags.includes('event:alice-build') || p.tags.includes('participant:oonchiumpa-young-people') },
  { key: 'delivery', label: 'Delivery in community', match: (p) => p.tags.includes('event:bed-delivery') || p.tags.includes('community:utopia-homelands') },
  { key: 'mykel', label: 'Mykel', match: (p) => p.tags.includes('participant:mykel') },
  { key: 'public', label: 'Public-cleared only', match: (p) => p.isPublic },
];

function consentBadge(p: ElPhoto): { text: string; cls: string } {
  if (p.isPublic) return { text: 'public', cls: 'bg-green-100 text-green-700' };
  if (p.consent && p.elderOk) return { text: 'gated-ok', cls: 'bg-amber-100 text-amber-700' };
  if (p.consent && !p.elderOk) return { text: 'elder review pending', cls: 'bg-orange-100 text-orange-700' };
  return { text: 'not flagged in EL', cls: 'bg-gray-200 text-gray-600' };
}

export function DashboardImagePicker({
  slug,
  partnerName,
  slots,
  overrides,
  photos,
}: {
  slug: string;
  partnerName: string;
  slots: DashboardImageSlot[];
  overrides: Overrides;
  photos: ElPhoto[];
}) {
  const [ov, setOv] = useState<Overrides>(overrides);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [preset, setPreset] = useState('all');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ElPhoto | null>(null);

  const groups = useMemo(() => {
    const m = new Map<string, DashboardImageSlot[]>();
    for (const s of slots) {
      if (!m.has(s.group)) m.set(s.group, []);
      m.get(s.group)!.push(s);
    }
    return Array.from(m.entries());
  }, [slots]);

  const filtered = useMemo(() => {
    const pre = PRESETS.find((p) => p.key === preset)!;
    const q = query.trim().toLowerCase();
    return photos.filter((p) => pre.match(p) && (!q || p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)) || p.location.toLowerCase().includes(q)));
  }, [photos, preset, query]);

  async function save(slotKey: string, value: DashboardImageAssignment | null) {
    setBusy(slotKey);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard-image', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, slotKey, value }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'save failed');
      setOv((prev) => {
        const next = { ...prev };
        if (value) next[slotKey] = value;
        else delete next[slotKey];
        return next;
      });
      setActiveSlot(null);
      setPreview(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  function assign(slot: DashboardImageSlot, photo: ElPhoto) {
    const consent = photo.isPublic
      ? 'el:public'
      : photo.consent && photo.elderOk
        ? 'el:gated-ok'
        : photo.consent
          ? 'el:consent-elder-pending'
          : 'community-consent';
    save(slot.key, {
      url: photo.url,
      alt: (photo.title || slot.fallbackAlt).replace(/\s*—\s*/g, ', '),
      elId: photo.id,
      consent,
    });
  }

  const active = slots.find((s) => s.key === activeSlot) || null;

  return (
    <div className="space-y-6 p-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard images: {partnerName}</h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-500">
          Assign an Empathy Ledger photo to any image slot on{' '}
          <code>/partners/{slug}/dashboard</code>. Picks write to{' '}
          <code>data/partner-dashboard-images.json</code>. They preview live here, and go to prod when the
          file is committed and deployed. Click a photo to see it full size, then assign. Badges show the EL
          consent flag (public / gated-ok / elder review pending / not flagged) as a guide; you hold the call
          on community consent.
        </p>
      </header>

      {error ? <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(320px,420px)_1fr]">
        {/* Slot list */}
        <div className="space-y-6">
          {groups.map(([group, gslots]) => (
            <section key={group}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{group}</h2>
              <ul className="space-y-2">
                {gslots.map((s) => {
                  const o = ov[s.key];
                  const src = o?.url || s.fallbackSrc;
                  const overridden = !!o;
                  return (
                    <li
                      key={s.key}
                      className={`flex items-center gap-3 rounded-lg border p-2 ${activeSlot === s.key ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-14 w-20 shrink-0 rounded object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">{s.label}</p>
                        <p className="truncate text-[11px] text-gray-400">
                          {overridden ? (
                            <span className="font-semibold text-blue-600">EL · {o.consent}</span>
                          ) : (
                            <span>config default</span>
                          )}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <button
                          onClick={() => setActiveSlot(activeSlot === s.key ? null : s.key)}
                          className="rounded bg-gray-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-700"
                        >
                          {activeSlot === s.key ? 'Close' : 'Change'}
                        </button>
                        {overridden ? (
                          <button
                            onClick={() => save(s.key, null)}
                            disabled={busy === s.key}
                            className="text-[11px] text-gray-400 hover:text-red-600 disabled:opacity-50"
                          >
                            reset
                          </button>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* Photo library (shown when a slot is active) */}
        <div>
          {!active ? (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
              Pick a slot on the left, then choose a photo here.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Assigning: {active.label}</span>
                <span className="text-xs text-gray-400">{filtered.length} photos</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPreset(p.key)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${preset === p.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {p.label}
                  </button>
                ))}
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="search tag / title / place"
                  className="ml-auto w-48 rounded border border-gray-300 px-2 py-1 text-xs"
                />
              </div>
              <div className="grid max-h-[72vh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                {filtered.map((p) => {
                  const badge = consentBadge(p);
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPreview(p)}
                      title="Click to preview full size"
                      className="group relative overflow-hidden rounded-lg border border-gray-200 text-left hover:border-blue-400"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.thumb} alt="" className="aspect-[4/3] w-full bg-gray-100 object-cover" loading="lazy" />
                      <span className={`absolute left-1 top-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${badge.cls}`}>{badge.text}</span>
                      <span className="block truncate px-1.5 py-1 text-[10px] text-gray-500">{p.title || p.tags.find((t) => t.startsWith('event:')) || p.location || p.id.slice(0, 8)}</span>
                    </button>
                  );
                })}
                {filtered.length === 0 ? <p className="col-span-full p-6 text-center text-sm text-gray-400">No photos match.</p> : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full-size preview + assign */}
      {preview && active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={() => setPreview(null)}>
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt="" className="max-h-[68vh] w-full bg-gray-900 object-contain" />
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${consentBadge(preview).cls}`}>{consentBadge(preview).text}</span>
                <p className="mt-1 truncate text-sm font-medium text-gray-800">{preview.title || preview.id}</p>
                <p className="truncate text-xs text-gray-400">{preview.tags.join('  ·  ')}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => setPreview(null)} className="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={() => assign(active, preview)}
                  disabled={busy === active.key}
                  className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  Assign to {active.label}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
