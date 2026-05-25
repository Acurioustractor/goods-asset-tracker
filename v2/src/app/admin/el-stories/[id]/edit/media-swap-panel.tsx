'use client';

// Media-swap panel for the edit page. Walks the story's blocks, extracts
// every photo/video slot, shows each as a thumbnail card with a Swap
// button. Clicking Swap opens a picker that fetches available EL media
// by tag and lets the editor pick a replacement. Save is immediate — the
// API patches the EL row.

import { useEffect, useMemo, useRef, useState } from 'react';

interface PickerItem {
  id: string;
  thumb: string;
  url: string;
  title: string;
  kind: 'photo' | 'video';
  tags?: string[];
}

interface MediaSlot {
  path: string;            // dot-path into blocks (e.g. "3.media.image")
  url: string;             // current url
  kind: 'photo' | 'video';
  label: string;           // human-readable description
  blockIndex: number;      // which block this slot is in (for insert-after)
}

type InsertKind = 'figure' | 'video-cinema' | 'video-overlay';
interface InsertTarget {
  afterIndex: number;     // block index to insert after
  blockLabel: string;     // for the modal title
  insertKind: InsertKind; // photo | inline video | overlay video
}

interface Props {
  storyId: string;
  blocks: unknown[];
  defaultTag?: string;
}

function extractSlots(blocks: unknown[]): MediaSlot[] {
  const slots: MediaSlot[] = [];
  blocks.forEach((b, i) => {
    if (!b || typeof b !== 'object') return;
    const block = b as Record<string, unknown>;
    const kind = block.kind as string;
    const heading = (block.heading as string) || (block.title as string) || '';
    const tag = (block.tag as string) || '';
    const label = heading || tag || `${kind}`;

    if (block.media && typeof block.media === 'object') {
      const media = block.media as Record<string, unknown>;
      if (typeof media.image === 'string' && media.image) {
        slots.push({ path: `${i}.media.image`, url: media.image, kind: 'photo', label: `${label} · image`, blockIndex: i });
      }
      if (typeof media.videoDesktop === 'string' && media.videoDesktop) {
        slots.push({ path: `${i}.media.videoDesktop`, url: media.videoDesktop, kind: 'video', label: `${label} · video (desktop)`, blockIndex: i });
      }
      if (typeof media.videoMobile === 'string' && media.videoMobile && media.videoMobile !== media.videoDesktop) {
        slots.push({ path: `${i}.media.videoMobile`, url: media.videoMobile, kind: 'video', label: `${label} · video (mobile)`, blockIndex: i });
      }
    }

    if (kind === 'figure' && typeof block.image === 'string') {
      slots.push({ path: `${i}.image`, url: block.image, kind: 'photo', label: `${label} · figure`, blockIndex: i });
    }

    if (kind === 'before-after-split') {
      const before = block.before as Record<string, unknown> | undefined;
      const after = block.after as Record<string, unknown> | undefined;
      if (before && typeof before.image === 'string') {
        slots.push({ path: `${i}.before.image`, url: before.image, kind: 'photo', label: `${label} · before`, blockIndex: i });
      }
      if (after && typeof after.image === 'string') {
        slots.push({ path: `${i}.after.image`, url: after.image, kind: 'photo', label: `${label} · after`, blockIndex: i });
      }
    }

    const items = block.items as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(items)) {
      items.forEach((it, j) => {
        const src = (it.src as string) || (it.image as string) || '';
        if (!src) return;
        const itemKind = kind === 'el-video-gallery' ? 'video' : 'photo';
        slots.push({
          path: `${i}.items.${j}.${typeof it.src === 'string' ? 'src' : 'image'}`,
          url: src,
          kind: itemKind,
          label: `${label} · item ${j + 1}`,
          blockIndex: i,
        });
      });
    }
  });
  return slots;
}

// Tag the block-index headings so the insert UI knows where blocks
// START (not just where existing media slots sit). Even prose-only
// read blocks should get an "Insert after" affordance so the editor
// can drop a figure/video into a section without one.
function extractBlockHeadings(blocks: unknown[]): { index: number; label: string }[] {
  return blocks.map((b, i) => {
    if (!b || typeof b !== 'object') return { index: i, label: `block ${i}` };
    const block = b as Record<string, unknown>;
    const kind = (block.kind as string) || 'block';
    const heading = (block.heading as string) || (block.title as string) || (block.tag as string) || '';
    return { index: i, label: heading ? `${kind} · ${heading}` : kind };
  });
}

export function MediaSwapPanel({ storyId, blocks, defaultTag = 'trip:may-2026' }: Props) {
  const slots = useMemo(() => extractSlots(blocks), [blocks]);
  const blockHeadings = useMemo(() => extractBlockHeadings(blocks), [blocks]);
  const [openSlot, setOpenSlot] = useState<MediaSlot | null>(null);
  const [openInsert, setOpenInsert] = useState<InsertTarget | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="rounded-md border border-stone-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Media in this story ({slots.length})</h2>
      <p className="mt-1 text-xs text-gray-500">
        <strong>Swap</strong> replaces media in an existing slot. <strong>Insert after</strong> adds a
        new figure or video block after this point in the article. Both write straight to EL and show
        on <code>/stories/{storyId}</code> on next request (no cache).
      </p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {slots.map((slot) => (
          <SlotCard
            key={slot.path}
            slot={slot}
            onSwap={() => setOpenSlot(slot)}
            onInsert={(insertKind) =>
              setOpenInsert({
                afterIndex: slot.blockIndex,
                blockLabel: slot.label,
                insertKind,
              })
            }
          />
        ))}
      </div>

      <div className="mt-6 rounded-md border border-dashed border-stone-300 bg-stone-50 p-4">
        <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
          Insert a block at any position
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Drop a new photo, inline video, or full-bleed overlay video <strong>after</strong> any block in the
          article. Useful for sections currently without media.
        </p>
        <div className="mt-3 max-h-48 overflow-auto rounded border border-stone-200 bg-white">
          <table className="w-full text-xs">
            <tbody>
              {blockHeadings.map((b) => (
                <tr key={b.index} className="border-b border-stone-100 last:border-0">
                  <td className="px-2 py-1.5 font-mono text-[10px] text-stone-400 w-10">{b.index}</td>
                  <td className="px-2 py-1.5 text-stone-700 truncate" title={b.label}>{b.label}</td>
                  <td className="px-2 py-1.5 text-right w-44">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => setOpenInsert({ afterIndex: b.index, blockLabel: b.label, insertKind: 'figure' })}
                        className="rounded bg-stone-700 text-white px-1.5 py-0.5 text-[10px] hover:bg-stone-900"
                      >+ Photo</button>
                      <button
                        type="button"
                        onClick={() => setOpenInsert({ afterIndex: b.index, blockLabel: b.label, insertKind: 'video-cinema' })}
                        className="rounded bg-stone-700 text-white px-1.5 py-0.5 text-[10px] hover:bg-stone-900"
                      >+ Video</button>
                      <button
                        type="button"
                        onClick={() => setOpenInsert({ afterIndex: b.index, blockLabel: b.label, insertKind: 'video-overlay' })}
                        className="rounded bg-amber-600 text-white px-1.5 py-0.5 text-[10px] hover:bg-amber-700"
                      >+ Overlay</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openSlot && (
        <PickerModal
          mode="swap"
          slotLabel={openSlot.label}
          slotPath={openSlot.path}
          slotKind={openSlot.kind}
          defaultTag={defaultTag}
          busy={busy}
          onClose={() => setOpenSlot(null)}
          onPick={async (item) => {
            setBusy(true);
            try {
              const res = await fetch(`/api/admin/el-story-media-swap/${storyId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: openSlot.path, value: item.url }),
              });
              if (!res.ok) alert('Swap failed: ' + (await res.text()));
              else window.location.reload();
            } finally {
              setBusy(false);
            }
          }}
        />
      )}
      {openInsert && (
        <PickerModal
          mode="insert"
          slotLabel={`Insert ${insertKindLabel(openInsert.insertKind)} after: ${openInsert.blockLabel}`}
          slotPath={String(openInsert.afterIndex)}
          slotKind={openInsert.insertKind === 'figure' ? 'photo' : 'video'}
          defaultTag={defaultTag}
          busy={busy}
          onClose={() => setOpenInsert(null)}
          onPick={async (item) => {
            setBusy(true);
            try {
              const res = await fetch(`/api/admin/el-story-block-insert/${storyId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  afterIndex: openInsert.afterIndex,
                  kind: openInsert.insertKind,
                  url: item.url,
                  poster: item.thumb,
                  title: item.title,
                }),
              });
              if (!res.ok) alert('Insert failed: ' + (await res.text()));
              else window.location.reload();
            } finally {
              setBusy(false);
            }
          }}
        />
      )}
    </div>
  );
}

function insertKindLabel(k: InsertKind): string {
  if (k === 'figure') return 'a photo';
  if (k === 'video-overlay') return 'a full-bleed overlay video';
  return 'an inline video';
}

function SlotCard({
  slot,
  onSwap,
  onInsert,
}: {
  slot: MediaSlot;
  onSwap: () => void;
  onInsert: (kind: InsertKind) => void;
}) {
  return (
    <div className="rounded-md border border-stone-200 overflow-hidden bg-stone-50">
      <div className="relative aspect-[4/3] bg-stone-100">
        {slot.kind === 'video' ? (
          <video src={slot.url} preload="metadata" muted playsInline className="h-full w-full object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slot.url} alt="" className="h-full w-full object-cover" />
        )}
        <span className="absolute top-1 left-1 text-[10px] uppercase tracking-wider bg-black/70 text-white px-1.5 py-0.5 rounded">
          {slot.kind}
        </span>
      </div>
      <div className="p-2 text-xs">
        <p className="text-gray-700 truncate" title={slot.label}>{slot.label}</p>
        <p className="text-[10px] font-mono text-gray-400 truncate" title={slot.path}>{slot.path}</p>
        <button
          type="button"
          onClick={onSwap}
          className="mt-2 w-full rounded bg-amber-600 px-2 py-1 text-white text-[11px] font-medium hover:bg-amber-700"
        >
          Swap
        </button>
        <div className="mt-1 grid grid-cols-3 gap-1">
          <button
            type="button"
            title="Insert a photo after this block"
            onClick={() => onInsert('figure')}
            className="rounded bg-stone-700 text-white px-1 py-0.5 text-[9px] font-medium hover:bg-stone-900"
          >+ Photo</button>
          <button
            type="button"
            title="Insert an inline video after this block"
            onClick={() => onInsert('video-cinema')}
            className="rounded bg-stone-700 text-white px-1 py-0.5 text-[9px] font-medium hover:bg-stone-900"
          >+ Video</button>
          <button
            type="button"
            title="Insert a full-bleed background overlay video after this block"
            onClick={() => onInsert('video-overlay')}
            className="rounded bg-amber-700 text-white px-1 py-0.5 text-[9px] font-medium hover:bg-amber-800"
          >+ Overlay</button>
        </div>
      </div>
    </div>
  );
}

function PickerModal({
  mode,
  slotLabel,
  slotPath,
  slotKind,
  defaultTag,
  busy,
  onClose,
  onPick,
}: {
  mode: 'swap' | 'insert';
  slotLabel: string;
  slotPath: string;
  slotKind: 'photo' | 'video';
  defaultTag: string;
  busy: boolean;
  onClose: () => void;
  onPick: (item: PickerItem) => void;
}) {
  const [tag, setTag] = useState(defaultTag);
  const [items, setItems] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  async function load(t: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/field-note-override/list?tags=${encodeURIComponent(t)}&kind=${slotKind === 'video' ? 'video' : 'photo'}&limit=200`);
      if (res.ok) {
        const data = (await res.json()) as { items?: PickerItem[] };
        setItems(data.items || []);
      } else {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(tag); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 p-4 border-b">
          <div>
            <h3 className="text-sm font-semibold">
              {mode === 'insert' ? 'Pick a ' + slotKind + ' to insert' : 'Pick a replacement ' + slotKind}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{mode === 'insert' ? slotLabel : <>Slot: <code className="font-mono">{slotPath}</code> · {slotLabel}</>}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-black text-xl leading-none">×</button>
        </header>
        <div className="p-4 border-b flex items-center gap-2 text-sm">
          <label className="text-gray-600">Tag filter:</label>
          <input
            ref={tagInputRef}
            defaultValue={tag}
            className="border rounded px-2 py-1 font-mono text-xs flex-1 max-w-xs"
            placeholder="trip:may-2026"
          />
          <button
            type="button"
            onClick={() => { const v = tagInputRef.current?.value || ''; setTag(v); load(v); }}
            className="rounded bg-stone-700 text-white px-3 py-1 text-xs"
          >
            Search
          </button>
          <span className="ml-auto text-xs text-gray-500">{loading ? 'Loading…' : `${items.length} matches`}</span>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">No matches for tag <code>{tag}</code>.</p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  disabled={busy}
                  onClick={() => onPick(it)}
                  className="group relative aspect-square overflow-hidden rounded border border-stone-200 hover:border-amber-600 disabled:opacity-40"
                  title={it.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.thumb || it.url} alt={it.title} className="h-full w-full object-cover" />
                  {it.kind === 'video' && (
                    <span className="absolute top-1 right-1 text-[10px] bg-black/70 text-white px-1 rounded">▶</span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-[10px] text-white truncate group-hover:bg-amber-600/90 group-hover:from-amber-600/95">
                    {it.title || 'untitled'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
