'use client';

// Canon Studio — the guided, one-slot-at-a-time way to fill the purpose slots.
// For the current slot it ranks the whole pool (EL photos/videos/portraits + every
// repo image) by kind + keyword + QBE-area match, shows the best first, and one
// click pins the winner and advances to the next empty slot. Writes through the same
// routes as the board (EL -> canon-el-pick, repo -> canon-slot-set), which keep
// canon-resolved.json current. A compact overview strip jumps to any slot.

import { useCallback, useMemo, useRef, useState } from 'react';
import { CanonBoardClient, type CanonImage, type CanonGap, type CanonSlot, type ElPhoto, type CanonElPick } from './canon-client';

export interface Candidate {
  id: string;
  source: 'el' | 'repo';
  kind: 'image' | 'video' | 'portrait';
  /** thumbnail url (raw EL url or repo /images path) */
  thumb: string;
  /** full-res url for preview */
  full: string;
  title: string;
  tags: string[];
  area: string;
  /** repo canonical path (v2/public/...), for repo picks */
  path?: string;
  /** EL file url + consent, for EL picks */
  url?: string;
  consent?: string;
}

type Picks = Record<string, CanonElPick[]>;
type CanonBySlot = Record<string, { canonicalPath: string; src: string; subject: string }>;

function elProxy(url: string): string {
  if (!url || url.startsWith('/')) return url;
  return /empathyledger\.com|supabase\.co/.test(url) ? `/api/admin/el-image?url=${encodeURIComponent(url)}` : url;
}

const STOP = new Set([
  'the', 'a', 'of', 'on', 'in', 'to', 'and', 'for', 'it', 'its', 'one', 'that', 'this', 'with', 'at', 'by',
  'from', 'as', 'is', 'are', 'an', 'or', 'no', 'not', 'our', 'we', 'you', 'your', 'goes', 'off', 'up', 'into',
  'can', 'move', 'shot', 'image', 'photo', 'video', 'branded', 'visual', 'single', 'strongest',
]);
function toks(s: string | undefined): string[] {
  return (s || '').toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !STOP.has(t));
}

export function CanonStudio({
  slots: slotsProp,
  candidates,
  elPicks,
  canonBySlot,
}: {
  slots: CanonSlot[];
  candidates: Candidate[];
  elPicks: Picks;
  canonBySlot: CanonBySlot;
}) {
  const [slots, setSlots] = useState<CanonSlot[]>(slotsProp);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Picks>(elPicks);
  const [canon, setCanon] = useState<CanonBySlot>(canonBySlot);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ label: '', group: 'Custom', type: 'photo', dataClass: 'green', areas: '', note: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const slot = slots[idx];

  const isFilled = useCallback(
    (key: string) => !!canon[key] || (picks[key]?.length ?? 0) > 0,
    [canon, picks],
  );
  const filledCount = useMemo(() => slots.filter((s) => isFilled(s.key)).length, [slots, isFilled]);

  const ranked = useMemo(() => {
    if (!slot) return [];
    const slotKind: 'video' | 'portrait' | 'image' =
      slot.type === 'video' ? 'video' : slot.group.startsWith('Storyteller') || slot.key.startsWith('storyteller') ? 'portrait' : 'image';
    const kw = new Set([...toks(slot.key.replace(/-/g, ' ')), ...toks(slot.label), ...toks(slot.note)]);
    const areas = new Set(slot.areas);
    const q = query.trim().toLowerCase();
    const scored = candidates
      .map((c) => {
        if (slotKind === 'video' && c.kind !== 'video') return null;
        if (slotKind !== 'video' && c.kind === 'video') return null;
        let score = 0;
        if (slotKind === 'portrait') {
          if (c.kind === 'portrait') score += 130;
          else if (/people\//.test(c.path || '')) score += 60;
        } else if (slotKind === 'image') {
          if (c.kind === 'portrait') score -= 30;
        } else {
          score += 100; // video kind matched
        }
        const hay = new Set([
          ...toks(c.title), ...toks(c.path || c.url || ''), ...toks(c.tags.join(' ')), ...toks(c.area), ...toks(c.id),
        ]);
        let hits = 0;
        for (const k of kw) if (hay.has(k)) hits++;
        score += hits * 22;
        if (areas.has(c.area)) score += 14;
        if (['illustration', 'chart', 'logo'].includes(slot.type) && c.source === 'repo') score += 12;
        if (q) {
          const hayStr = `${c.title} ${c.path || c.url} ${c.tags.join(' ')} ${c.area}`.toLowerCase();
          if (!hayStr.includes(q)) return null;
        }
        return { c, score };
      })
      .filter((x): x is { c: Candidate; score: number } => x !== null)
      .sort((a, b) => b.score - a.score);
    return scored;
  }, [slot, candidates, query]);

  const advance = useCallback(() => {
    // jump to the next still-empty slot after idx, else just +1, else stay
    for (let i = idx + 1; i < slots.length; i++) if (!isFilled(slots[i].key)) { setIdx(i); return; }
    if (idx + 1 < slots.length) setIdx(idx + 1);
  }, [idx, slots, isFilled]);

  const assign = useCallback(
    async (c: Candidate) => {
      if (!slot) return;
      setBusy(true);
      setError(null);
      try {
        if (c.source === 'el') {
          const pick: CanonElPick = {
            elId: c.id, url: c.url || c.full, title: c.title,
            consent: c.consent || 'el:not-flagged', kind: c.kind, thumb: c.thumb,
          };
          const res = await fetch('/api/admin/canon-el-pick', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ areaId: slot.key, action: 'add', pick }),
          });
          if (!((await res.json()) as { ok: boolean }).ok) throw new Error('save failed');
          setPicks((p) => ({ ...p, [slot.key]: [...(p[slot.key] || []).filter((x) => x.elId !== c.id), pick] }));
        } else {
          const res = await fetch('/api/admin/canon-slot-set', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ slot: slot.key, action: 'set', canonicalPath: c.path, type: slot.type, dataClass: slot.dataClass, subject: slot.label, caption: slot.note, areas: slot.areas }),
          });
          if (!((await res.json()) as { ok: boolean }).ok) throw new Error('save failed');
          setCanon((m) => ({ ...m, [slot.key]: { canonicalPath: c.path || '', src: c.thumb, subject: slot.label } }));
        }
        advance();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setBusy(false);
      }
    },
    [slot, advance],
  );

  const clearSlot = useCallback(async () => {
    if (!slot) return;
    setBusy(true);
    setError(null);
    try {
      if (canon[slot.key]) {
        await fetch('/api/admin/canon-slot-set', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ slot: slot.key, action: 'clear' }),
        });
        setCanon((m) => { const n = { ...m }; delete n[slot.key]; return n; });
      }
      for (const p of picks[slot.key] || []) {
        await fetch('/api/admin/canon-el-pick', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ areaId: slot.key, action: 'remove', elId: p.elId }),
        });
      }
      setPicks((m) => { const n = { ...m }; delete n[slot.key]; return n; });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, [slot, canon, picks]);

  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f || !slot) return;
      setBusy(true);
      setError(null);
      try {
        const fd = new FormData();
        fd.append('file', f);
        fd.append('subject', slot.label);
        fd.append('caption', slot.note || '');
        fd.append('type', slot.type === 'video' ? 'photo' : slot.type);
        fd.append('dataClass', slot.dataClass);
        if (slot.dataClass === 'red') fd.append('consentCleared', 'true');
        fd.append('areas', slot.areas.join(','));
        fd.append('slot', slot.key);
        const res = await fetch('/api/admin/canon-upload', { method: 'POST', body: fd });
        const j = (await res.json()) as { ok: boolean; error?: string; image?: { canonicalPath: string; src: string } };
        if (!j.ok || !j.image) throw new Error(j.error || 'upload failed');
        setCanon((m) => ({ ...m, [slot.key]: { canonicalPath: j.image!.canonicalPath, src: j.image!.src, subject: slot.label } }));
        advance();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setBusy(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [slot, advance],
  );

  const onAddSlot = useCallback(async () => {
    if (!form.label.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/canon-slot-add', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          label: form.label, group: form.group, type: form.type, dataClass: form.dataClass,
          areas: form.areas.split(',').map((s) => s.trim()).filter(Boolean), note: form.note,
        }),
      });
      const j = (await res.json()) as { ok: boolean; error?: string; slot?: CanonSlot };
      if (!j.ok || !j.slot) throw new Error(j.error || 'add failed');
      setSlots((prev) => {
        const next = [...prev, { ...(j.slot as CanonSlot), seedSrc: null }];
        setIdx(next.length - 1);
        return next;
      });
      setAddOpen(false);
      setForm({ label: '', group: 'Custom', type: 'photo', dataClass: 'green', areas: '', note: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [form]);

  if (!slot) return <p className="p-6 text-sm text-muted-foreground">No slots defined.</p>;

  const red = slot.dataClass === 'red';
  const local = canon[slot.key];
  const elList = picks[slot.key] || [];
  const visible = showAll ? ranked : ranked.slice(0, 48);

  const currentThumb = local ? local.src : elList[0] ? elProxy(elList[0].thumb || elList[0].url) : slot.seedSrc || '';
  const currentState = local ? 'canon' : elList.length ? 'el' : slot.seedSrc ? 'seed' : 'empty';

  return (
    <div>
      {/* Progress + overview */}
      <div className="sticky top-0 z-20 -mx-2 mb-4 border-b border-border bg-background/95 px-2 py-3 backdrop-blur sm:-mx-4 sm:px-4">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold">
            Slot {idx + 1} / {slots.length}
          </span>
          <div className="h-2 flex-1 min-w-[160px] overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${(filledCount / slots.length) * 100}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">{filledCount}/{slots.length} set</span>
          <button
            type="button"
            onClick={() => { for (let i = 0; i < slots.length; i++) if (!isFilled(slots[i].key)) { setIdx(i); return; } }}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:border-foreground"
          >
            Jump to next empty
          </button>
        </div>
        {/* overview dots */}
        <div className="flex flex-wrap gap-1">
          {slots.map((s, i) => {
            const st = canon[s.key] ? 'bg-green-500' : (picks[s.key]?.length ?? 0) > 0 ? 'bg-primary' : s.seedSrc ? 'bg-amber-400' : 'bg-muted-foreground/30';
            return (
              <button
                key={s.key}
                type="button"
                title={`${s.label}${isFilled(s.key) ? ' (set)' : ''}`}
                onClick={() => setIdx(i)}
                className={`h-2.5 w-2.5 rounded-full ${st} ${i === idx ? 'ring-2 ring-foreground ring-offset-1' : ''}`}
              />
            );
          })}
        </div>
      </div>

      {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {/* Current slot header + current pick */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{slot.group}</div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            {slot.label}
            {red && <span className="rounded bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">RED · consent-gated</span>}
          </h2>
          <div className="mt-1 text-xs text-muted-foreground">
            <code className="text-[11px]">{slot.key}</code>
            {slot.areas.length ? ` · areas ${slot.areas.join(', ')}` : ''} · {slot.type}
          </div>
          {slot.note && <p className="mt-2 max-w-2xl text-sm text-foreground">{slot.note}</p>}
          {red && (
            <p className="mt-1 text-xs text-red-600">
              Only pin a consent-cleared face. You hold the community-consent call.
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-medium uppercase text-muted-foreground">current</div>
            <div className={'text-[11px] font-semibold ' + (currentState === 'canon' ? 'text-green-600' : currentState === 'el' ? 'text-primary' : currentState === 'seed' ? 'text-amber-600' : 'text-muted-foreground')}>
              {currentState === 'canon' ? 'canon set' : currentState === 'el' ? 'EL pinned' : currentState === 'seed' ? 'seed (unconfirmed)' : 'empty'}
            </div>
            {local || elList.length > 0 ? (
              <button type="button" onClick={clearSlot} disabled={busy} className="mt-1 text-[11px] text-red-600 underline hover:text-red-700 disabled:opacity-50">
                clear
              </button>
            ) : null}
          </div>
          <div className="h-24 w-24 overflow-hidden rounded-xl border border-border bg-muted">
            {currentThumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentThumb} alt="current" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">{slot.type === 'video' ? '▶' : 'empty'}</div>
            )}
          </div>
        </div>
      </div>

      {/* Candidate controls */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">Best candidates</span>
        <span className="text-xs text-muted-foreground">{ranked.length} ranked · click to pick &amp; advance</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="filter candidates…"
          className="ml-auto w-40 rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onUpload} />
        <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-foreground disabled:opacity-50" title="Upload a new image straight into this slot">
          ⬆ Upload to slot
        </button>
        <button type="button" onClick={() => setAddOpen((v) => !v)} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-foreground">
          + New purpose
        </button>
        <div className="flex gap-1">
          <button type="button" onClick={() => setIdx((i) => Math.max(0, i - 1))} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-foreground">← Prev</button>
          <button type="button" onClick={advance} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-foreground">Skip →</button>
        </div>
      </div>

      {/* Add-a-new-purpose form */}
      {addOpen && (
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/40 p-3 sm:grid-cols-6">
          <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Label (e.g. Founder portrait)" className="col-span-2 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm" />
          <input value={form.group} onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))} placeholder="Group" className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm" />
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm">
            {['photo', 'illustration', 'chart', 'logo', 'video'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={form.dataClass} onChange={(e) => setForm((f) => ({ ...f, dataClass: e.target.value }))} className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm">
            {['green', 'amber', 'red'].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <input value={form.areas} onChange={(e) => setForm((f) => ({ ...f, areas: e.target.value }))} placeholder="areas e.g. 01,02" className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm" />
          <input value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="Note / what it's for" className="col-span-4 rounded-lg border border-input bg-background px-2.5 py-1.5 text-sm" />
          <button type="button" disabled={busy || !form.label.trim()} onClick={onAddSlot} className="col-span-2 rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background disabled:opacity-50">
            Create &amp; go to it
          </button>
        </div>
      )}

      {/* Candidate grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {visible.map(({ c }) => {
          const isCurrent = (c.source === 'el' && elList.some((p) => p.elId === c.id)) || (c.source === 'repo' && local?.canonicalPath === c.path);
          return (
            <button
              key={`${c.source}:${c.id}`}
              type="button"
              disabled={busy}
              onClick={() => assign(c)}
              title={c.title || c.id}
              className={
                'group relative aspect-square overflow-hidden rounded-lg border text-left transition disabled:opacity-50 ' +
                (isCurrent ? 'border-green-500 ring-2 ring-green-200' : 'border-border hover:border-foreground')
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.source === 'el' ? elProxy(c.thumb) : c.thumb} alt={c.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
              {c.kind === 'video' && <span className="absolute inset-0 flex items-center justify-center text-2xl text-white/90 drop-shadow">▶</span>}
              <span className={'absolute left-1 top-1 rounded px-1.5 py-0.5 text-[8px] font-semibold ' + (c.source === 'el' ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background')}>
                {c.kind === 'portrait' ? 'RED' : c.source}
              </span>
              {isCurrent && <span className="absolute right-1 top-1 rounded bg-green-600 px-1.5 py-0.5 text-[8px] font-semibold text-white">current</span>}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 pb-1 pt-3 text-[9px] text-white">
                <span className="line-clamp-1">{c.title || c.area || c.id.slice(0, 8)}</span>
              </span>
            </button>
          );
        })}
      </div>
      {ranked.length > 48 && (
        <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-3 rounded-lg border border-border px-3 py-1.5 text-sm hover:border-foreground">
          {showAll ? 'Show fewer' : `Show all ${ranked.length}`}
        </button>
      )}
    </div>
  );
}

// Shell: tab between the guided Studio (default) and the by-QBE-area reference board.
export function CanonShell({
  images,
  gaps,
  areaNames,
  slots,
  elPhotos,
  elPicks,
  candidates,
  canonBySlot,
}: {
  images: CanonImage[];
  gaps: CanonGap[];
  areaNames: Record<string, string>;
  slots: CanonSlot[];
  elPhotos: ElPhoto[];
  elPicks: Picks;
  candidates: Candidate[];
  canonBySlot: CanonBySlot;
}) {
  const [tab, setTab] = useState<'studio' | 'area'>('studio');
  return (
    <div>
      <div className="mb-5 inline-flex rounded-lg border border-border p-0.5">
        {(['studio', 'area'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={'rounded-md px-4 py-1.5 text-sm font-medium transition ' + (tab === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground')}
          >
            {t === 'studio' ? 'Studio — fill slots' : 'By QBE area (reference)'}
          </button>
        ))}
      </div>
      {tab === 'studio' ? (
        <CanonStudio slots={slots} candidates={candidates} elPicks={elPicks} canonBySlot={canonBySlot} />
      ) : (
        <CanonBoardClient images={images} gaps={gaps} areaNames={areaNames} slots={slots} elPhotos={elPhotos} elPicks={elPicks} />
      )}
    </div>
  );
}
