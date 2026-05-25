'use client';

// Inline + button that drops between blocks on the live article when
// an admin is logged in. Clicking it expands to three quick options
// (Photo, Video, Overlay video), each of which opens a picker filtered
// by EL tag. Picking a media calls the insert endpoint, which adds a
// new block AFTER the given index and reloads the page.

import { useEffect, useRef, useState } from 'react';

type Kind = 'figure' | 'video-cinema' | 'video-overlay';

interface PickerItem {
  id: string;
  thumb: string;
  url: string;
  title: string;
  kind: 'photo' | 'video';
}

interface Props {
  storyId: string;
  afterIndex: number;
  defaultTag?: string;
}

export function InsertBetweenBlocks({ storyId, afterIndex, defaultTag = 'trip:may-2026' }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [picker, setPicker] = useState<Kind | null>(null);

  return (
    <div className="not-prose my-2 flex justify-center group" data-after-index={afterIndex}>
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="opacity-30 hover:opacity-100 transition-opacity inline-flex items-center gap-2 rounded-full bg-foreground/90 text-white text-xs px-3 py-1 shadow-sm hover:shadow"
          title="Add a photo or video here"
        >
          <span aria-hidden>+</span> Add media here
        </button>
      ) : (
        <div className="inline-flex items-center gap-1 rounded-full bg-foreground text-white text-xs px-2 py-1 shadow-sm">
          <span className="px-2 text-white/60">After block {afterIndex}:</span>
          <button type="button" onClick={() => setPicker('figure')} className="rounded-full bg-stone-700 hover:bg-stone-600 px-3 py-1">+ Photo</button>
          <button type="button" onClick={() => setPicker('video-cinema')} className="rounded-full bg-stone-700 hover:bg-stone-600 px-3 py-1">+ Video</button>
          <button type="button" onClick={() => setPicker('video-overlay')} className="rounded-full bg-amber-600 hover:bg-amber-500 px-3 py-1">+ Overlay</button>
          <button type="button" onClick={() => setExpanded(false)} className="rounded-full bg-stone-700 hover:bg-stone-600 px-2 py-1" aria-label="Cancel">×</button>
        </div>
      )}
      {picker && (
        <PickerModal
          kind={picker}
          afterIndex={afterIndex}
          storyId={storyId}
          defaultTag={defaultTag}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

function PickerModal({
  kind,
  afterIndex,
  storyId,
  defaultTag,
  onClose,
}: {
  kind: Kind;
  afterIndex: number;
  storyId: string;
  defaultTag: string;
  onClose: () => void;
}) {
  const [tag, setTag] = useState(defaultTag);
  const [items, setItems] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const mediaKind: 'photo' | 'video' = kind === 'figure' ? 'photo' : 'video';

  async function load(t: string) {
    setLoading(true);
    try {
      // EL picker endpoint expects repeated `tag` params, returns a bare
      // array (not `{items}`). Split a comma-separated value into many
      // `tag=…` params so authors can search by single or compound tags.
      const tagList = t.split(',').map((s) => s.trim()).filter(Boolean);
      const params = new URLSearchParams();
      for (const tg of tagList) params.append('tag', tg);
      params.set('kind', mediaKind);
      params.set('limit', '200');
      const res = await fetch(`/api/admin/field-note-override/list?${params}`);
      if (res.ok) {
        const data = (await res.json()) as unknown;
        const arr = Array.isArray(data)
          ? (data as PickerItem[])
          : ((data as { items?: PickerItem[] }).items || []);
        setItems(arr);
      } else {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(tag); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function handlePick(item: PickerItem) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/el-story-block-insert/${storyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          afterIndex,
          kind,
          url: item.url,
          poster: item.thumb,
          title: item.title,
        }),
      });
      if (!res.ok) {
        alert('Insert failed: ' + (await res.text()));
      } else {
        window.location.reload();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-5xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 p-4 border-b">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Insert a {mediaKind} after block {afterIndex}
              {kind === 'video-overlay' && ' (full-bleed overlay)'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">Pick from EL by tag. Default: <code>{defaultTag}</code>.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-black text-xl leading-none">×</button>
        </header>
        <div className="p-4 border-b flex items-center gap-2 text-sm">
          <label className="text-gray-600">Tag filter:</label>
          <input
            ref={tagInputRef}
            defaultValue={tag}
            className="border rounded px-2 py-1 font-mono text-xs flex-1 max-w-xs"
          />
          <button
            type="button"
            onClick={() => { const v = tagInputRef.current?.value || ''; setTag(v); load(v); }}
            className="rounded bg-stone-700 text-white px-3 py-1 text-xs"
          >
            Search
          </button>
          <span className="ml-auto text-xs text-gray-500">
            {loading ? 'Loading…' : `${items.length} matches`}
          </span>
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
                  onClick={() => handlePick(it)}
                  className="group relative aspect-square overflow-hidden rounded border border-stone-200 hover:border-amber-600 disabled:opacity-40"
                  title={it.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.thumb || it.url} alt={it.title} className="h-full w-full object-cover" />
                  {it.kind === 'video' && (
                    <span className="absolute top-1 right-1 text-[10px] bg-black/70 text-white px-1 rounded">▶</span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-[10px] text-white truncate group-hover:from-amber-600/95">
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
