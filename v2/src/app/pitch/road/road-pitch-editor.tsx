'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, ImageIcon, Pencil, RotateCcw, X } from 'lucide-react';

type PickerItem = {
  id: string;
  thumb: string;
  url: string;
  title: string;
  kind: 'photo' | 'video';
  tags?: string[];
};

type RoadDraft = {
  text: Record<string, string>;
  media: Record<string, string>;
};

const STORAGE_KEY = 'goods-road-pitch-v1';
const COVER_REPAIR_KEY = 'goods-road-cover-repair-v1';
const EMPTY_DRAFT: RoadDraft = { text: {}, media: {} };

function readDraft(): RoadDraft {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '') as Partial<RoadDraft>;
    return { text: parsed.text ?? {}, media: parsed.media ?? {} };
  } catch {
    return EMPTY_DRAFT;
  }
}

function applyDraft(draft: RoadDraft) {
  for (const [key, value] of Object.entries(draft.text)) {
    const node = document.querySelector<HTMLElement>(`[data-road-text="${CSS.escape(key)}"]`);
    if (node) node.innerText = value;
  }
}

function swapLabel(key: string) {
  if (key === 'cover.photo') return 'Swap cover';
  if (key === 'closing.photo') return 'Swap closing';
  const chapter = key.match(/^stop-(\d+)-/);
  return chapter ? `Swap chapter ${chapter[1].padStart(2, '0')}` : 'Swap photo';
}

export function RoadPitchEditor() {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<RoadDraft>(EMPTY_DRAFT);
  const [pickerKey, setPickerKey] = useState<string | null>(null);
  const [items, setItems] = useState<PickerItem[] | null>(null);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [savingMedia, setSavingMedia] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const [, setViewportRevision] = useState(0);

  useEffect(() => {
    const local = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (!local) return;
    let saved = readDraft();
    // Repair the cover override created when the first snap-scroll implementation
    // left a stale cover button over another chapter. Preserve every other edit.
    if (!localStorage.getItem(COVER_REPAIR_KEY) && saved.media['cover.photo']) {
      const media = { ...saved.media };
      delete media['cover.photo'];
      saved = { ...saved, media };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(COVER_REPAIR_KEY, 'done');
    }
    // Media is now saved to the project override file, not browser storage.
    // Drop every legacy browser-only media pick so another browser cannot
    // resurrect an old image after the project has moved on.
    if (Object.keys(saved.media).length > 0) {
      saved = { ...saved, media: {} };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
    applyDraft(saved);
    queueMicrotask(() => {
      setAvailable(true);
      setDraft(saved);
    });
  }, []);

  useEffect(() => {
    if (!available) return;
    const nodes = document.querySelectorAll<HTMLElement>('[data-road-text]');
    nodes.forEach((node) => {
      node.contentEditable = editing ? 'true' : 'false';
      node.spellcheck = editing;
      node.classList.toggle('road-pitch-editable', editing);
    });
  }, [editing, available]);

  useEffect(() => {
    if (!editing) return;
    const onBlur = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const key = target.dataset.roadText;
      if (!key) return;
      const current = readDraft();
      const next = {
        ...current,
        text: { ...current.text, [key]: target.innerText.replace(/\u00a0/g, ' ').trim() },
      };
      setDraft(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };
    const onViewportChange = () => setViewportRevision((value) => value + 1);
    const scrollContainer = document.querySelector('.road-pitch-scroll');
    document.addEventListener('blur', onBlur, true);
    window.addEventListener('scroll', onViewportChange, { passive: true });
    window.addEventListener('resize', onViewportChange);
    scrollContainer?.addEventListener('scroll', onViewportChange, { passive: true });
    return () => {
      document.removeEventListener('blur', onBlur, true);
      window.removeEventListener('scroll', onViewportChange);
      window.removeEventListener('resize', onViewportChange);
      scrollContainer?.removeEventListener('scroll', onViewportChange);
    };
  }, [editing]);

  if (!available) return null;

  const openPicker = (key: string) => {
    setPickerKey(key);
    if (items !== null) return;
    fetch('/api/admin/field-note-override/list?scope=recent&kind=photo')
      .then((response) => response.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  };

  const pickMedia = async (url: string) => {
    if (!pickerKey) return;
    setSavingMedia(true);
    setMediaError(null);
    try {
      const response = await fetch('/api/admin/field-note-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'pitch-road', key: pickerKey, value: url }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Could not save image (${response.status})`);
      }
      window.location.reload();
    } catch (error) {
      setMediaError(error instanceof Error ? error.message : 'Could not save image');
      setSavingMedia(false);
    }
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const shown = (items ?? []).filter((item) => {
    const needle = query.trim().toLowerCase();
    return (
      !needle ||
      item.title.toLowerCase().includes(needle) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(needle))
    );
  });

  return (
    <>
      <div className="road-pitch-editor fixed bottom-5 right-5 z-[100] flex items-center gap-2 rounded-full border border-white/15 bg-goods-ink p-2 text-white shadow-2xl">
        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
            editing ? 'bg-goods-terracotta' : 'hover:bg-white/10'
          }`}
        >
          {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          {editing ? 'Done editing' : 'Edit this story'}
        </button>
        {Object.keys(draft.text).length + Object.keys(draft.media).length > 0 && (
          <>
            <button
              type="button"
              title="Copy edits"
              onClick={() => {
                void navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1200);
              }}
              className="rounded-full p-2 hover:bg-white/10"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              type="button"
              title="Reset local edits"
              onClick={reset}
              className="rounded-full p-2 hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[90] pointer-events-none">
          {Array.from(document.querySelectorAll<HTMLElement>('[data-road-media]')).map((node) => {
            const key = node.dataset.roadMedia!;
            const rect = node.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return null;
            return (
              <button
                key={`${key}-${Math.round(rect.top)}`}
                type="button"
                onClick={() => openPicker(key)}
                className="pointer-events-auto fixed flex items-center gap-1.5 rounded-full bg-goods-terracotta px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg"
                style={{ top: Math.max(12, rect.top + 12), left: Math.max(12, rect.right - 112) }}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                {swapLabel(key)}
              </button>
            );
          })}
        </div>
      )}

      {pickerKey && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4">
          <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-goods-cream text-goods-ink shadow-2xl">
            <div className="flex items-center gap-3 border-b border-goods-sand p-4">
              <div>
                <p className="font-semibold">Swap this photo</p>
                <p className="text-xs text-goods-sub">
                  Saves to the project and appears in every browser. Deploy the project to publish it.
                </p>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search people, place or tag"
                className="ml-auto w-64 rounded-md border border-goods-sand bg-white px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => setPickerKey(null)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            {mediaError && (
              <p className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Not saved: {mediaError}
              </p>
            )}
            <div className="grid flex-1 auto-rows-[190px] grid-cols-2 content-start gap-3 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-5">
              {items === null && <p className="col-span-full p-8 text-center">Loading photos…</p>}
              {items !== null && shown.length === 0 && (
                <p className="col-span-full p-8 text-center">No matching photos.</p>
              )}
              {shown.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={savingMedia}
                  onClick={() => void pickMedia(item.url)}
                  className="flex h-[190px] min-h-[190px] flex-col overflow-hidden rounded-md border border-goods-sand bg-white text-left hover:border-goods-terracotta"
                >
                  {/* External EL hosts vary, so the editor intentionally uses an unoptimised thumbnail. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumb || item.url}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="block h-[150px] min-h-[150px] w-full bg-[#e8e1d5] object-cover"
                  />
                  <span className="block w-full truncate px-2 py-2 text-xs">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
