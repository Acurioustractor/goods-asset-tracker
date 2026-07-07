'use client';

// Photo → people alignment grid. Filter by gallery / untagged; per photo, add a
// storyteller (writes EL media_storytellers) or click a chip to remove. Optimistic
// UI; on a failed EL write it reverts and surfaces the error.

import { useMemo, useState } from 'react';
import type { AlignPhoto, AlignPerson } from '@/lib/empathy-ledger/align';

const proxy = (u: string) => `/api/admin/el-image?url=${encodeURIComponent(u)}`;

export function AlignClient({ photos: initial, persons }: { photos: AlignPhoto[]; persons: AlignPerson[] }) {
  const [photos, setPhotos] = useState<AlignPhoto[]>(initial);
  const [gallery, setGallery] = useState<string>('__all');
  const [untaggedOnly, setUntaggedOnly] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const galleries = useMemo(() => [...new Set(initial.map((p) => p.gallery))].sort(), [initial]);
  const tagged = photos.filter((p) => p.people.length > 0).length;
  const shown = photos.filter(
    (p) => (gallery === '__all' || p.gallery === gallery) && (!untaggedOnly || p.people.length === 0),
  );

  async function mut(mediaId: string, storytellerId: string, action: 'add' | 'remove') {
    const key = mediaId + storytellerId;
    setBusy(key);
    setErr(null);
    const name = persons.find((x) => x.id === storytellerId)?.name || '';
    // optimistic
    setPhotos((ps) =>
      ps.map((p) => {
        if (p.id !== mediaId) return p;
        const people = action === 'remove' ? p.people.filter((x) => x.id !== storytellerId) : [...p.people, { id: storytellerId, name }];
        return { ...p, people };
      }),
    );
    try {
      const res = await fetch('/api/admin/el-align', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaAssetId: mediaId, storytellerId, action }),
      });
      const j = (await res.json()) as { ok: boolean; error?: string };
      if (!j.ok) throw new Error(j.error || 'EL write failed');
    } catch (e) {
      // revert
      setPhotos((ps) =>
        ps.map((p) => {
          if (p.id !== mediaId) return p;
          const people = action === 'remove' ? [...p.people, { id: storytellerId, name }] : p.people.filter((x) => x.id !== storytellerId);
          return { ...p, people };
        }),
      );
      setErr(e instanceof Error ? e.message : 'EL write failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <select value={gallery} onChange={(e) => setGallery(e.target.value)} className="rounded border px-2 py-1">
          <option value="__all">All galleries ({photos.length})</option>
          {galleries.map((g) => (
            <option key={g} value={g}>{g} ({initial.filter((p) => p.gallery === g).length})</option>
          ))}
        </select>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={untaggedOnly} onChange={(e) => setUntaggedOnly(e.target.checked)} /> untagged only
        </label>
        <span className="text-muted-foreground">{tagged}/{photos.length} tagged &middot; {shown.length} shown</span>
        {err && <span className="rounded bg-red-100 px-2 py-0.5 text-red-700">{err}</span>}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))' }}>
        {shown.map((p) => {
          const available = persons.filter((x) => !p.people.some((y) => y.id === x.id));
          return (
            <div key={p.id} className="overflow-hidden rounded-lg border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={proxy(p.thumb || p.url)} alt={p.title || 'EL photo'} loading="lazy" className="h-40 w-full bg-muted object-cover" />
              <div className="space-y-2 p-2">
                <div className="flex min-h-[24px] flex-wrap gap-1">
                  {p.people.length === 0 && <span className="text-xs text-muted-foreground">no one tagged</span>}
                  {p.people.map((pp) => (
                    <button
                      key={pp.id}
                      onClick={() => mut(p.id, pp.id, 'remove')}
                      disabled={busy === p.id + pp.id}
                      title="Click to remove"
                      className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 hover:bg-red-100 hover:text-red-700 disabled:opacity-50"
                    >
                      {pp.name} &times;
                    </button>
                  ))}
                </div>
                <select
                  value=""
                  onChange={(e) => { if (e.target.value) mut(p.id, e.target.value, 'add'); }}
                  className="w-full rounded border px-2 py-1 text-xs"
                >
                  <option value="">+ add person&hellip;</option>
                  {available.map((x) => (
                    <option key={x.id} value={x.id}>{x.name}{x.isElder ? ' (elder)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
