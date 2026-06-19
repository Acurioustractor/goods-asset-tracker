'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UnifiedItem {
  id: string;
  /** Thumbnail/grid src. */
  src: string;
  /** Full-resolution url. */
  full: string;
  source: 'el' | 'website';
  area: string;
  title: string;
  tags: string[];
  consent: 'public' | 'gated-ok' | 'elder-pending' | 'flagged' | 'local';
  /** Other /images/... paths holding a byte-identical copy (website only). */
  aliases?: string[];
}

type SourceFilter = 'all' | 'website' | 'el';

function consentBadge(item: UnifiedItem): { text: string; cls: string } {
  switch (item.consent) {
    case 'local':
      return { text: 'Website', cls: 'bg-gray-200 text-gray-700' };
    case 'public':
      return { text: 'EL · public', cls: 'bg-green-100 text-green-700' };
    case 'gated-ok':
      return { text: 'EL · gated-ok', cls: 'bg-amber-100 text-amber-700' };
    case 'elder-pending':
      return { text: 'EL · elder review pending', cls: 'bg-orange-100 text-orange-700' };
    case 'flagged':
    default:
      return { text: 'EL · not flagged', cls: 'bg-gray-200 text-gray-600' };
  }
}

export function MediaLibraryClient({ items: initialItems }: { items: UnifiedItem[] }) {
  // Local copy so saved website tags update the grid/filters without a reload.
  const [items, setItems] = useState<UnifiedItem[]>(initialItems);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [area, setArea] = useState<string>('__all');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<UnifiedItem | null>(null);

  // Keep in sync if the server re-renders with fresh items (e.g. revalidate).
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Patch one item's tags in place (after a successful save). Also refreshes the
  // open preview so its chips reflect the new state.
  const updateItemTags = useCallback((id: string, tags: string[]) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, tags } : it)));
    setActive((cur) => (cur && cur.id === id ? { ...cur, tags } : cur));
  }, []);

  // Esc closes preview
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const sourceCounts = useMemo(() => {
    let website = 0;
    let el = 0;
    for (const it of items) {
      if (it.source === 'website') website += 1;
      else el += 1;
    }
    return { all: items.length, website, el };
  }, [items]);

  // Subjects (with counts) limited to the items visible under the current source
  // filter, so the dropdown stays relevant. A "subject" is the folder `area` OR
  // any saved/EL tag — so newly-saved website tags become filterable.
  const areaOptions = useMemo(() => {
    const counts = new Map<string, number>();
    const bump = (key: string) => counts.set(key, (counts.get(key) || 0) + 1);
    for (const it of items) {
      if (sourceFilter !== 'all' && it.source !== sourceFilter) continue;
      const subjects = new Set<string>([it.area, ...it.tags]);
      for (const s of subjects) bump(s);
    }
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, count }));
  }, [items, sourceFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (sourceFilter !== 'all' && it.source !== sourceFilter) return false;
      if (area !== '__all' && it.area !== area && !it.tags.includes(area)) return false;
      if (q) {
        const hay = `${it.title} ${it.area} ${it.tags.join(' ')} ${it.full}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, sourceFilter, area, search]);

  const chip = (key: SourceFilter, label: string, count: number) => {
    const isActive = sourceFilter === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => setSourceFilter(key)}
        className={
          'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium border transition ' +
          (isActive
            ? 'bg-foreground text-background border-foreground'
            : 'bg-background text-foreground border-border hover:border-foreground')
        }
      >
        <span>{label}</span>
        <span className={isActive ? 'opacity-80' : 'text-muted-foreground'}>{count}</span>
      </button>
    );
  };

  return (
    <div>
      {/* Source filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {chip('all', 'All', sourceCounts.all)}
        {chip('website', 'Website', sourceCounts.website)}
        {chip('el', 'Empathy Ledger', sourceCounts.el)}
      </div>

      {/* Subject + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground whitespace-nowrap">Subject</span>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="__all">All subjects</option>
            {areaOptions.map((a) => (
              <option key={a.value} value={a.value}>
                {a.value} ({a.count})
              </option>
            ))}
          </select>
        </label>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, subject, tags, filename…"
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {filtered.length} image{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No images match the current filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((it) => {
            const badge = consentBadge(it);
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => setActive(it)}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border hover:border-foreground/60 transition group text-left"
                title={it.title}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.src}
                  alt={it.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                />
                <span
                  className={
                    'absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold ' +
                    badge.cls
                  }
                >
                  {badge.text}
                </span>
                {it.aliases && it.aliases.length > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[9px] font-semibold"
                    title={`Also at ${it.aliases.length} other location${it.aliases.length === 1 ? '' : 's'}`}
                  >
                    +{it.aliases.length}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-2 py-2 text-[10px] text-white line-clamp-2">
                  <span className="block opacity-70">{it.area}</span>
                  {it.title}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {active && (
        <PreviewModal
          item={active}
          onClose={() => setActive(null)}
          onSaveTags={updateItemTags}
        />
      )}
    </div>
  );
}

// Common namespaces offered as quick-add chips in the tag editor.
const TAG_NAMESPACES = [
  'product',
  'community',
  'people',
  'production',
  'material',
  'moment',
  'theme',
];

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

function PreviewModal({
  item,
  onClose,
  onSaveTags,
}: {
  item: UnifiedItem;
  onClose: () => void;
  onSaveTags: (id: string, tags: string[]) => void;
}) {
  const [copied, setCopied] = useState(false);
  const badge = consentBadge(item);
  const isWebsite = item.source === 'website';

  // Tag editor state (website items only). Seeded from the item's current tags.
  const [draftTags, setDraftTags] = useState<string[]>(item.tags);
  const [tagInput, setTagInput] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');

  // Re-seed if a different item opens in the same modal instance.
  useEffect(() => {
    setDraftTags(item.tags);
    setTagInput('');
    setSaveState('idle');
    setSaveError('');
  }, [item.id, item.tags]);

  const addTag = useCallback((raw: string) => {
    const t = raw.trim();
    if (!t) return;
    setDraftTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setTagInput('');
    setSaveState('idle');
  }, []);

  const removeTag = useCallback((tag: string) => {
    setDraftTags((prev) => prev.filter((t) => t !== tag));
    setSaveState('idle');
  }, []);

  const saveTags = useCallback(async () => {
    setSaveState('saving');
    setSaveError('');
    try {
      const res = await fetch('/api/admin/local-image-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: item.full, tags: draftTags }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setSaveState('error');
        setSaveError(data.error || `HTTP ${res.status}`);
        return;
      }
      onSaveTags(item.id, draftTags);
      setSaveState('saved');
    } catch (e) {
      setSaveState('error');
      setSaveError(e instanceof Error ? e.message : String(e));
    }
  }, [item.full, item.id, draftTags, onSaveTags]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
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
            src={item.full}
            alt={item.title}
            className="max-h-[88vh] max-w-full object-contain"
          />
        </div>

        {/* Metadata side */}
        <aside className="p-5 overflow-y-auto bg-card border-l border-border">
          <header className="flex items-start justify-between gap-2 mb-4">
            <h2 className="text-base font-semibold leading-snug break-words">{item.title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-xl leading-none text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </header>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={'rounded-full px-2 py-0.5 text-[10px] font-semibold ' + badge.cls}>
              {badge.text}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
              {item.source === 'website' ? 'Website' : 'Empathy Ledger'}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
              {item.area}
            </span>
          </div>

          {item.aliases && item.aliases.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Also at ({item.aliases.length})
              </p>
              <ul className="space-y-1">
                {item.aliases.map((a) => (
                  <li key={a} className="text-[11px] font-mono break-all text-muted-foreground">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isWebsite ? (
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Subject tags
              </p>

              {/* Current draft tags as removable chips */}
              {draftTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {draftTags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        aria-label={`Remove ${t}`}
                        className="text-muted-foreground hover:text-foreground leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground mb-2.5">No tags yet.</p>
              )}

              {/* Free-form add: input + Add (Enter also adds) */}
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="namespace:value"
                  className="flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-foreground transition"
                >
                  Add
                </button>
              </div>

              {/* Quick-add namespace chips: prefill the input for completion */}
              <div className="flex flex-wrap gap-1 mb-3">
                {TAG_NAMESPACES.map((ns) => (
                  <button
                    key={ns}
                    type="button"
                    onClick={() => setTagInput(`${ns}:`)}
                    className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-mono text-muted-foreground hover:border-foreground hover:text-foreground transition"
                  >
                    {ns}:
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={saveTags}
                disabled={saveState === 'saving'}
                className="w-full rounded-lg bg-foreground text-background px-3 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {saveState === 'saving' ? 'Saving…' : 'Save tags'}
              </button>
              <p className="mt-1.5 text-[11px] min-h-[1rem]" aria-live="polite">
                {saveState === 'saved' && <span className="text-green-600">✓ Saved</span>}
                {saveState === 'error' && (
                  <span className="text-red-600">Error: {saveError}</span>
                )}
              </p>
            </div>
          ) : (
            item.tags.length > 0 && (
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
            )
          )}

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => copy(item.full)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-left hover:border-foreground transition"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">URL</div>
              <div className="text-xs truncate font-mono">{item.full}</div>
              <div className="text-[10px] text-accent mt-1">
                {copied ? '✓ Copied' : 'Click to copy'}
              </div>
            </button>

            <a
              href={item.full}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-foreground text-background px-3 py-2.5 text-sm font-semibold text-center hover:opacity-90 transition"
            >
              Download
            </a>

            <a
              href={item.full}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-center hover:border-foreground transition"
            >
              Open in new tab
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">ID</p>
            <p className="text-xs font-mono break-all">{item.id}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
