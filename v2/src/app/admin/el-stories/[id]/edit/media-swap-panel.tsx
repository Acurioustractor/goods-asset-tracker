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

    // media.image + media.videoDesktop / videoMobile
    if (block.media && typeof block.media === 'object') {
      const media = block.media as Record<string, unknown>;
      if (typeof media.image === 'string' && media.image) {
        slots.push({ path: `${i}.media.image`, url: media.image, kind: 'photo', label: `${label} · image` });
      }
      if (typeof media.videoDesktop === 'string' && media.videoDesktop) {
        slots.push({ path: `${i}.media.videoDesktop`, url: media.videoDesktop, kind: 'video', label: `${label} · video (desktop)` });
      }
      if (typeof media.videoMobile === 'string' && media.videoMobile && media.videoMobile !== media.videoDesktop) {
        slots.push({ path: `${i}.media.videoMobile`, url: media.videoMobile, kind: 'video', label: `${label} · video (mobile)` });
      }
    }

    // figure: image
    if (kind === 'figure' && typeof block.image === 'string') {
      slots.push({ path: `${i}.image`, url: block.image, kind: 'photo', label: `${label} · figure` });
    }

    // before-after-split: before.image + after.image
    if (kind === 'before-after-split') {
      const before = block.before as Record<string, unknown> | undefined;
      const after = block.after as Record<string, unknown> | undefined;
      if (before && typeof before.image === 'string') {
        slots.push({ path: `${i}.before.image`, url: before.image, kind: 'photo', label: `${label} · before` });
      }
      if (after && typeof after.image === 'string') {
        slots.push({ path: `${i}.after.image`, url: after.image, kind: 'photo', label: `${label} · after` });
      }
    }

    // gallery / video-gallery: items[].src
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
        });
      });
    }
  });
  return slots;
}

export function MediaSwapPanel({ storyId, blocks, defaultTag = 'trip:may-2026' }: Props) {
  const slots = useMemo(() => extractSlots(blocks), [blocks]);
  const [openSlot, setOpenSlot] = useState<MediaSlot | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="rounded-md border border-stone-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Media in this story ({slots.length})</h2>
      <p className="mt-1 text-xs text-gray-500">
        Click <strong>Swap</strong> on any tile to pick a replacement from EL. Changes write to EL
        and show on <code>/stories/{storyId}</code> on next request (no cache).
      </p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {slots.map((slot) => (
          <SlotCard key={slot.path} slot={slot} onSwap={() => setOpenSlot(slot)} />
        ))}
      </div>
      {openSlot && (
        <PickerModal
          slot={openSlot}
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
              if (!res.ok) {
                const t = await res.text();
                alert('Swap failed: ' + t);
              } else {
                window.location.reload();
              }
            } finally {
              setBusy(false);
            }
          }}
        />
      )}
    </div>
  );
}

function SlotCard({ slot, onSwap }: { slot: MediaSlot; onSwap: () => void }) {
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
      </div>
    </div>
  );
}

function PickerModal({
  slot,
  defaultTag,
  busy,
  onClose,
  onPick,
}: {
  slot: MediaSlot;
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
      const res = await fetch(`/api/admin/field-note-override/list?tags=${encodeURIComponent(t)}&kind=${slot.kind === 'video' ? 'video' : 'photo'}&limit=200`);
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
            <h3 className="text-sm font-semibold">Pick a replacement {slot.kind}</h3>
            <p className="text-xs text-gray-500 mt-1">Slot: <code className="font-mono">{slot.path}</code> · {slot.label}</p>
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
