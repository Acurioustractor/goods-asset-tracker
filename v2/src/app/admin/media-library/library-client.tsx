'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  // --- curation state (website items indexed in content_items) ---
  /** content_items.id — present only once the index is built. Required to curate. */
  contentId?: string;
  starred?: boolean;
  rating?: number;
  archived?: boolean;
  /** Set = this image is the winner for a raise canon slot (guarded from cull). */
  canonSlot?: string;
  mediaType?: 'image' | 'video';
  /** Poster/thumbnail image url for a video tile. */
  poster?: string;
  /** Community this asset belongs to (content_items.community_id → communities.name). */
  community?: string;
  /** Storyteller whose portrait this is (content_items.storyteller_id → display_name). */
  person?: string;
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

/** A patch sent to /api/admin/content-item and applied optimistically to state. */
type CurationPatch = { starred?: boolean; rating?: number; archived?: boolean };

export function MediaLibraryClient({
  items: initialItems,
  curationReady,
}: {
  items: UnifiedItem[];
  curationReady: boolean;
}) {
  // Local copy so saved tags + curation state update the grid without a reload.
  const [items, setItems] = useState<UnifiedItem[]>(initialItems);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [area, setArea] = useState<string>('__all');
  const [community, setCommunity] = useState<string>('__all');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<UnifiedItem | null>(null);
  // curation UI state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [selectMode, setSelectMode] = useState(false); // click tiles to select for batch ops
  const [cursor, setCursor] = useState(0); // index into `filtered`, for keyboard cull
  const [err, setErr] = useState('');
  // Empathy Ledger loads after first paint (kept out of the blocking server render).
  const elRef = useRef<UnifiedItem[]>([]);
  const [elState, setElState] = useState<'loading' | 'done' | 'error'>('loading');
  const [elMissing, setElMissing] = useState(false);

  // Fetch Empathy Ledger media after first paint, then merge onto local items.
  // This is why the page paints instantly now — the paged EL API no longer blocks
  // the server render.
  useEffect(() => {
    let cancelled = false;
    setElState('loading');
    fetch('/api/admin/el-media')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d: { items?: UnifiedItem[]; elMissing?: boolean }) => {
        if (cancelled) return;
        elRef.current = d.items ?? [];
        setElMissing(!!d.elMissing);
        setItems((prev) => [...prev.filter((i) => i.source !== 'el'), ...elRef.current]);
        setElState('done');
      })
      .catch(() => {
        if (!cancelled) setElState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Server re-render (revalidate): reset local items, keep any EL already loaded.
  useEffect(() => {
    setItems([...initialItems, ...elRef.current]);
  }, [initialItems]);

  const updateItemTags = useCallback((id: string, tags: string[]) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, tags } : it)));
    setActive((cur) => (cur && cur.id === id ? { ...cur, tags } : cur));
  }, []);

  // --- curation write: optimistic, reverts on API failure --------------------
  const mutate = useCallback(
    async (ids: string[], patch: CurationPatch) => {
      const targets = items.filter((it) => ids.includes(it.id));
      const contentIds = targets.map((it) => it.contentId).filter((x): x is string => !!x);
      if (contentIds.length === 0) {
        setErr('These items are not indexed yet — run npm run content:index first.');
        return;
      }
      setErr('');
      const snapshot = items;
      const apply = (it: UnifiedItem): UnifiedItem => ({
        ...it,
        ...(patch.starred !== undefined ? { starred: patch.starred } : {}),
        ...(patch.rating !== undefined ? { rating: patch.rating } : {}),
        ...(patch.archived !== undefined ? { archived: patch.archived } : {}),
      });
      setItems((prev) => prev.map((it) => (ids.includes(it.id) && it.contentId ? apply(it) : it)));
      setActive((cur) => (cur && ids.includes(cur.id) && cur.contentId ? apply(cur) : cur));
      try {
        const res = await fetch('/api/admin/content-item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: contentIds, ...patch }),
        });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      } catch (e) {
        setItems(snapshot); // revert
        setErr(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    },
    [items],
  );

  const toggleStar = useCallback((it: UnifiedItem) => mutate([it.id], { starred: !it.starred }), [mutate]);
  const toggleArchive = useCallback((it: UnifiedItem) => mutate([it.id], { archived: !it.archived }), [mutate]);
  const setRating = useCallback((it: UnifiedItem, r: number) => mutate([it.id], { rating: r }), [mutate]);
  const bulkSet = useCallback(
    (patch: CurationPatch) => {
      const ids = Array.from(selected);
      if (ids.length) mutate(ids, patch);
      if (patch.archived !== undefined) setSelected(new Set()); // archived items leave the view
    },
    [selected, mutate],
  );

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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

  // Communities present in the current source view (only items linked to one).
  const communityOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of items) {
      if (sourceFilter !== 'all' && it.source !== sourceFilter) continue;
      if (!it.community) continue;
      counts.set(it.community, (counts.get(it.community) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, count }));
  }, [items, sourceFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      // Archived hidden by default; toggle to review the archive.
      if (!showArchived && it.archived) return false;
      if (showArchived && !it.archived) return false;
      if (starredOnly && !it.starred) return false;
      if (sourceFilter !== 'all' && it.source !== sourceFilter) return false;
      if (area !== '__all' && it.area !== area && !it.tags.includes(area)) return false;
      if (community !== '__all' && it.community !== community) return false;
      if (q) {
        const hay = `${it.title} ${it.area} ${it.tags.join(' ')} ${it.community ?? ''} ${it.person ?? ''} ${it.full}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, sourceFilter, area, community, search, showArchived, starredOnly]);

  const archivedCount = useMemo(() => items.filter((it) => it.archived).length, [items]);
  const starredCount = useMemo(() => items.filter((it) => it.starred).length, [items]);

  // Batch selection helpers. selectAt supports shift-click range select over the
  // currently-filtered set (only curatable items can be selected).
  const lastSelIdx = useRef<number | null>(null);
  const selectAt = useCallback(
    (idx: number, id: string, shift: boolean) => {
      if (shift && lastSelIdx.current !== null) {
        const [a, b] = [lastSelIdx.current, idx].sort((x, y) => x - y);
        const range = filtered.slice(a, b + 1).filter((f) => f.contentId).map((f) => f.id);
        setSelected((prev) => { const n = new Set(prev); range.forEach((r) => n.add(r)); return n; });
      } else {
        toggleSelect(id);
      }
      lastSelIdx.current = idx;
    },
    [filtered, toggleSelect],
  );
  const selectAllFiltered = useCallback(() => {
    setSelected(new Set(filtered.filter((it) => it.contentId).map((it) => it.id)));
  }, [filtered]);

  // Clamp cursor when the filtered set shrinks/changes.
  useEffect(() => {
    setCursor((c) => (filtered.length === 0 ? 0 : Math.min(c, filtered.length - 1)));
  }, [filtered.length]);

  // Scroll the cursor tile into view.
  const tileRefs = useRef<Map<number, HTMLElement>>(new Map());
  useEffect(() => {
    tileRefs.current.get(cursor)?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  // --- keyboard: navigate + cull without leaving the keyboard ----------------
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Modal open: only Escape (closes it).
      if (active) {
        if (e.key === 'Escape') setActive(null);
        return;
      }
      // Don't hijack typing.
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) {
        return;
      }
      if (e.key === 'Escape') {
        setSelected(new Set());
        return;
      }
      const cur = filtered[cursor];
      switch (e.key) {
        case 'ArrowRight':
        case 'j':
          e.preventDefault();
          setCursor((c) => Math.min(c + 1, Math.max(filtered.length - 1, 0)));
          break;
        case 'ArrowLeft':
        case 'k':
          e.preventDefault();
          setCursor((c) => Math.max(c - 1, 0));
          break;
        case 's':
          if (cur) { e.preventDefault(); toggleStar(cur); }
          break;
        case 'x':
          if (cur) { e.preventDefault(); toggleArchive(cur); }
          break;
        case ' ':
          if (cur) { e.preventDefault(); toggleSelect(cur.id); }
          break;
        case 'A':
          e.preventDefault();
          setSelected(new Set(filtered.filter((it) => it.contentId).map((it) => it.id)));
          break;
        case 'Enter':
          if (cur) { e.preventDefault(); setActive(cur); }
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          if (cur && cur.contentId) { e.preventDefault(); setRating(cur, Number(e.key)); }
          break;
        default:
          break;
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, filtered, cursor, toggleStar, toggleArchive, toggleSelect, setRating]);

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

  const toggleBtn = (on: boolean, onClick: () => void, label: string, count?: number) => (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition ' +
        (on ? 'bg-foreground text-background border-foreground' : 'bg-background text-foreground border-border hover:border-foreground')
      }
    >
      <span>{label}</span>
      {count !== undefined && <span className={on ? 'opacity-80' : 'text-muted-foreground'}>{count}</span>}
    </button>
  );

  return (
    <div>
      {!curationReady && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          Curation index not built yet. Run <code>cd v2 &amp;&amp; npm run content:index</code> to enable star, rating and archive.
          You can still browse every image below.
        </p>
      )}
      {err && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {err}
        </p>
      )}
      {(elMissing || elState === 'error') && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          {elMissing
            ? 'Empathy Ledger unavailable (EMPATHY_LEDGER_API_KEY not set). Showing local website media only.'
            : 'Couldn’t load Empathy Ledger media this time. Showing local website media only.'}
        </p>
      )}

      {/* Source filter chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {chip('all', 'All', sourceCounts.all)}
        {chip('website', 'Website', sourceCounts.website)}
        {chip('el', 'Empathy Ledger', sourceCounts.el)}
      </div>

      {/* Curation view toggles */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {toggleBtn(
          selectMode,
          () => { setSelectMode((v) => !v); if (selectMode) setSelected(new Set()); },
          selectMode ? 'Selecting — click tiles' : '☑ Select multiple',
          selectMode ? selected.size : undefined,
        )}
        {toggleBtn(starredOnly, () => setStarredOnly((v) => !v), '★ Starred only', starredCount)}
        {toggleBtn(showArchived, () => setShowArchived((v) => !v), showArchived ? 'Viewing archive' : 'Show archived', archivedCount)}
        <span className="text-[11px] text-muted-foreground ml-1 hidden sm:inline">
          {selectMode
            ? 'click tiles to select · shift-click for a range · then use the bar below'
            : 'keys: j/k move · s star · x archive · 1–5 rate · space select · A all · enter open'}
        </span>
      </div>

      {/* Subject + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
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

        {communityOptions.length > 0 && (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground whitespace-nowrap">Community</span>
            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="__all">All communities</option>
              {communityOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.value} ({c.count})
                </option>
              ))}
            </select>
          </label>
        )}

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, subject, tags, filename…"
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {filtered.length} item{filtered.length === 1 ? '' : 's'}
          {elState === 'loading' && <span className="ml-1 opacity-70">· loading Empathy Ledger…</span>}
        </span>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="sticky top-2 z-20 mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
          <span className="text-sm font-semibold">{selected.size} selected</span>
          <button type="button" onClick={() => bulkSet({ starred: true })} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:border-foreground">★ Star</button>
          <button type="button" onClick={() => bulkSet({ starred: false })} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:border-foreground">☆ Unstar</button>
          <span className="flex items-center gap-1 border-l border-border pl-2 ml-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Rate</span>
            {[1, 2, 3, 4, 5].map((r) => (
              <button key={r} type="button" onClick={() => bulkSet({ rating: r })} className="rounded px-1 text-xs text-muted-foreground hover:text-yellow-500" aria-label={`Rate ${r}`}>{r}★</button>
            ))}
          </span>
          <button type="button" onClick={() => bulkSet({ archived: true })} className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30">🗑 Archive (cull)</button>
          {showArchived && (
            <button type="button" onClick={() => bulkSet({ archived: false })} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:border-foreground">Restore</button>
          )}
          <button type="button" onClick={selectAllFiltered} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:border-foreground">Select all {filtered.length}</button>
          <button type="button" onClick={() => setSelected(new Set())} className="ml-auto rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground">Clear</button>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No images match the current filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((it, idx) => {
            const badge = consentBadge(it);
            const isSel = selected.has(it.id);
            const isCursor = idx === cursor;
            const canCurate = !!it.contentId;
            const isVideo = it.mediaType === 'video';
            const thumb = isVideo ? it.poster : it.src;
            return (
              <div
                key={it.id}
                ref={(el) => { if (el) tileRefs.current.set(idx, el); else tileRefs.current.delete(idx); }}
                className={
                  'relative aspect-square rounded-lg overflow-hidden bg-muted border transition group ' +
                  (isSel
                    ? 'ring-2 ring-blue-500 border-blue-500 '
                    : isCursor
                      ? 'border-accent ring-2 ring-accent '
                      : 'border-border hover:border-foreground/60 ') +
                  (it.archived ? 'opacity-60 ' : '')
                }
              >
                <button
                  type="button"
                  onClick={(e) => {
                    setCursor(idx);
                    if (selectMode) { if (canCurate) selectAt(idx, it.id, e.shiftKey); }
                    else setActive(it);
                  }}
                  className="absolute inset-0 h-full w-full text-left"
                  title={selectMode ? (canCurate ? 'Click to select (shift-click for a range)' : 'Not indexed — cannot select') : it.title}
                >
                  {thumb ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={thumb}
                      alt={it.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-2xl">🎬</div>
                  )}
                  {isVideo && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-sm text-white">▶</span>
                    </span>
                  )}
                </button>

                {/* consent / source badge */}
                <span className={'pointer-events-none absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold ' + badge.cls}>
                  {badge.text}
                </span>

                {/* select checkbox (curatable items) — always visible in select mode */}
                {canCurate && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); selectAt(idx, it.id, e.shiftKey); }}
                    aria-label={isSel ? 'Deselect' : 'Select'}
                    className={
                      'absolute bottom-1.5 left-1.5 h-6 w-6 rounded border flex items-center justify-center text-[12px] font-bold transition ' +
                      (isSel
                        ? 'bg-blue-500 text-white border-blue-500'
                        : selectMode
                          ? 'bg-background/90 border-blue-400 text-transparent hover:text-blue-500'
                          : 'bg-background/80 border-border text-transparent opacity-0 group-hover:opacity-100 hover:text-muted-foreground')
                    }
                  >
                    ✓
                  </button>
                )}

                {/* star toggle (website only) */}
                {canCurate && (
                  <button
                    type="button"
                    onClick={() => toggleStar(it)}
                    aria-label={it.starred ? 'Unstar' : 'Star'}
                    className={
                      'absolute top-1.5 right-1.5 h-6 w-6 rounded-full flex items-center justify-center text-sm transition ' +
                      (it.starred ? 'bg-yellow-400 text-black' : 'bg-background/70 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground')
                    }
                  >
                    {it.starred ? '★' : '☆'}
                  </button>
                )}

                {/* archive marker */}
                {it.archived && (
                  <span className="pointer-events-none absolute top-8 right-1.5 rounded-full bg-red-600 text-white px-1.5 py-0.5 text-[9px] font-semibold">
                    archived
                  </span>
                )}
                {it.canonSlot && (
                  <span className="pointer-events-none absolute bottom-1.5 right-1.5 rounded-full bg-emerald-600 text-white px-1.5 py-0.5 text-[9px] font-semibold" title={`Canon pick: ${it.canonSlot}`}>
                    canon
                  </span>
                )}
                {it.aliases && it.aliases.length > 0 && (
                  <span
                    className="pointer-events-none absolute top-1.5 right-9 rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[9px] font-semibold"
                    title={`Also at ${it.aliases.length} other location${it.aliases.length === 1 ? '' : 's'}`}
                  >
                    +{it.aliases.length}
                  </span>
                )}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-2 pt-4 pb-2 text-[10px] text-white line-clamp-2">
                  <span className="block opacity-70">{it.area}</span>
                  {it.title}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {active && (
        <PreviewModal
          item={active}
          curationReady={curationReady}
          onClose={() => setActive(null)}
          onSaveTags={updateItemTags}
          onToggleStar={toggleStar}
          onToggleArchive={toggleArchive}
          onSetRating={setRating}
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
  curationReady,
  onClose,
  onSaveTags,
  onToggleStar,
  onToggleArchive,
  onSetRating,
}: {
  item: UnifiedItem;
  curationReady: boolean;
  onClose: () => void;
  onSaveTags: (id: string, tags: string[]) => void;
  onToggleStar: (it: UnifiedItem) => void;
  onToggleArchive: (it: UnifiedItem) => void;
  onSetRating: (it: UnifiedItem, r: number) => void;
}) {
  const [copied, setCopied] = useState(false);
  const badge = consentBadge(item);
  const isWebsite = item.source === 'website';
  const isVideo = item.mediaType === 'video';
  const canCurate = !!item.contentId;
  const showTagEditor = isWebsite && !isVideo;

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
    if (!item.contentId) {
      setSaveState('error');
      setSaveError('Not indexed yet — run npm run content:index to tag this item.');
      return;
    }
    setSaveState('saving');
    setSaveError('');
    try {
      // DB-backed: tags live in content_items (kept across reindex). Replaces the
      // old local-image-tags.json write; the JSON is now insert-seed only.
      const res = await fetch('/api/admin/content-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.contentId, tags: draftTags }),
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
  }, [item.contentId, item.id, draftTags, onSaveTags]);

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
        {/* Media side */}
        <div className="bg-black flex items-center justify-center min-h-[40vh] md:min-h-[60vh]">
          {isVideo ? (
            <video
              src={item.full}
              poster={item.poster}
              controls
              className="max-h-[88vh] max-w-full object-contain"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.full}
              alt={item.title}
              className="max-h-[88vh] max-w-full object-contain"
            />
          )}
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
            {item.community && (
              <span className="rounded-full bg-sky-100 text-sky-700 px-2 py-0.5 text-[10px] font-medium">📍 {item.community}</span>
            )}
            {item.person && (
              <span className="rounded-full bg-violet-100 text-violet-700 px-2 py-0.5 text-[10px] font-medium">{item.person}</span>
            )}
            {item.canonSlot && (
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold" title="This image is a locked canon pick">
                canon: {item.canonSlot}
              </span>
            )}
          </div>

          {/* Curation controls (website items with an index row) */}
          {canCurate ? (
            <div className="mb-5 rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => onToggleStar(item)}
                  className={
                    'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ' +
                    (item.starred ? 'bg-yellow-400 text-black border-yellow-400' : 'border-border hover:border-foreground')
                  }
                >
                  {item.starred ? '★ Starred' : '☆ Star'}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleArchive(item)}
                  className={
                    'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition ' +
                    (item.archived ? 'bg-red-600 text-white border-red-600' : 'border-border text-red-600 hover:border-red-500')
                  }
                >
                  {item.archived ? 'Archived · restore' : 'Archive'}
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-1">Rate</span>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => onSetRating(item, (item.rating ?? 0) === r ? 0 : r)}
                    aria-label={`Rate ${r}`}
                    className={'text-lg leading-none transition ' + ((item.rating ?? 0) >= r ? 'text-yellow-500' : 'text-muted-foreground hover:text-foreground')}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ) : (
            isWebsite && !curationReady && (
              <p className="mb-5 text-[11px] text-amber-700">Run the content index to star / rate / archive this image.</p>
            )
          )}

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

          {showTagEditor ? (
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
