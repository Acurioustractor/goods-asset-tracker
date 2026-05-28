'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

// EL photo folders. Driven by what's actually tagged in EL — see the
// stories table tag audit:
//   community:utopia-homelands × 221, event:alice-build × 121,
//   participant:oonchiumpa-young-people × 121, batch:156 × 221, etc.
// Add new folders here as new tag groups appear in EL.
interface Folder {
  label: string;
  emoji: string;
  tags: string[];
  hint: string;
}

const FOLDERS: Folder[] = [
  { label: 'All Goods media', emoji: '🗂', tags: [], hint: 'Every photo across stories + media_assets, newest first' },
  { label: 'Untagged', emoji: '🏷', tags: ['__untagged'], hint: 'Photos uploaded to EL but never tagged. Surfaces orphans.' },
  { label: 'All Stretch Bed', emoji: '🛏', tags: ['product:stretch-bed'], hint: 'Tagged product:stretch-bed' },
  { label: 'Utopia delivery', emoji: '🏠', tags: ['community:utopia-homelands', 'event:bed-delivery'], hint: 'Bed delivery to Utopia Homelands' },
  { label: 'Alice build', emoji: '🛠', tags: ['event:alice-build'], hint: 'Oonchiumpa young people building beds in Alice Springs' },
  { label: 'Oonchiumpa young people', emoji: '👥', tags: ['participant:oonchiumpa-young-people'], hint: '' },
  { label: 'May 2026 trip', emoji: '📅', tags: ['trip:may-2026'], hint: 'Whole May 2026 trip across communities' },
  { label: 'Batch 156', emoji: '📦', tags: ['batch:156'], hint: 'Utopia delivery batch' },
  { label: 'Tennant Creek', emoji: '🌳', tags: ['community:tennant-creek'], hint: '' },
];

interface PickerItem {
  id: string;
  thumb: string;
  url: string;
  title: string;
  kind: 'photo' | 'video';
  tags?: string[];
}

async function fetchPhotos(tags: string[]): Promise<PickerItem[]> {
  // Special sentinel for the "Untagged" folder. Fetch everything, then
  // filter client-side to items with no tags.
  const isUntagged = tags.length === 1 && tags[0] === '__untagged';
  const realTags = isUntagged ? [] : tags;

  const params = new URLSearchParams();
  for (const t of realTags) params.append('tag', t);
  params.set('kind', 'photo');
  // The photo browser searches across ALL EL projects, not just the
  // canonical Goods project_id. Many "goods" photos in EL never got the
  // project_id assigned at upload time, so a project-scoped query would
  // miss them. Tags carry the real signal.
  params.set('crossProject', '1');
  // Empty tags = "All Goods media" or "Untagged" folder. The list endpoint
  // guards against tag-less queries unless scope=recent is set, so opt in here.
  if (realTags.length === 0) params.set('scope', 'recent');
  const res = await fetch(`/api/admin/field-note-override/list?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const rows: PickerItem[] = await res.json();

  if (isUntagged) {
    return rows.filter((r) => !r.tags || r.tags.length === 0);
  }
  return rows;
}

export function PhotosBrowserClient() {
  const [folderIdx, setFolderIdx] = useState(0);
  const [items, setItems] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<PickerItem | null>(null);

  const folder = FOLDERS[folderIdx];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPhotos(folder.tags).then((rows) => {
      if (!cancelled) {
        setItems(rows);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [folderIdx, folder.tags]);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((it) => it.title.toLowerCase().includes(q));
  }, [items, search]);

  // Esc closes lightbox
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div>
      {/* Folder chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FOLDERS.map((f, i) => {
          const isActive = folderIdx === i;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => setFolderIdx(i)}
              title={f.hint}
              className={
                'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium border transition ' +
                (isActive
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:border-foreground')
              }
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search + count */}
      <div className="flex items-center gap-4 mb-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by photo title…"
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {loading ? 'Loading…' : `${filtered.length} photo${filtered.length === 1 ? '' : 's'} in this folder`}
        </span>
      </div>
      {!loading && folderIdx === 1 && filtered.length > 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-5">
          ⚠ {filtered.length} photo{filtered.length === 1 ? '' : 's'} in Empathy Ledger have no tags yet,
          so they don&rsquo;t show up on any tag-filtered page (/process, field-notes, etc.).
          Tag them in <a href="/admin/photos" className="underline">/admin/photos</a> or in EL admin to make them findable.
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <p className="text-center text-muted-foreground py-12">Loading from Empathy Ledger…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No photos found in this folder. Try a different folder or check tagging in EL.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setActive(it)}
              className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border hover:border-foreground/60 transition group"
              title={it.title}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.thumb || it.url}
                alt={it.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-2 py-2 text-[10px] text-white text-left line-clamp-2">
                {it.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <LightBox
          item={active}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}

function LightBox({ item, onClose }: { item: PickerItem; onClose: () => void }) {
  const [copied, setCopied] = useState<'thumb' | 'full' | null>(null);

  const copy = useCallback(async (text: string, kind: 'thumb' | 'full') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 sm:p-8 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background text-foreground max-w-5xl w-full max-h-[92vh] rounded-2xl overflow-hidden grid md:grid-cols-[1fr_320px] cursor-default"
      >
        {/* Image side */}
        <div className="bg-black flex items-center justify-center min-h-[40vh] md:min-h-[60vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.title}
            className="max-h-[88vh] max-w-full object-contain"
          />
        </div>
        {/* Metadata side */}
        <aside className="p-5 overflow-y-auto bg-card border-l border-border">
          <header className="flex items-start justify-between gap-2 mb-4">
            <h2 className="text-base font-semibold leading-snug">
              {item.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-xl leading-none text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </header>

          {item.tags && item.tags.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => copy(item.url, 'full')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-left hover:border-foreground transition"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Public URL
              </div>
              <div className="text-xs truncate font-mono">{item.url}</div>
              <div className="text-[10px] text-accent mt-1">
                {copied === 'full' ? '✓ Copied' : 'Click to copy'}
              </div>
            </button>

            <a
              href={item.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-foreground text-background px-3 py-2.5 text-sm font-semibold text-center hover:opacity-90 transition"
            >
              Download original
            </a>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-center hover:border-foreground transition"
            >
              Open in new tab
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
              EL story ID
            </p>
            <p className="text-xs font-mono break-all">{item.id}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
