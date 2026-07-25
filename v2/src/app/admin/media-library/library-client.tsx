'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { themeName } from '@/lib/data/themes';

export interface UnifiedItem {
  id: string;
  /** Thumbnail/grid src. */
  src: string;
  /** Full-resolution url. */
  full: string;
  source: 'el' | 'website' | 'descript';
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
  /** e.g. 'overlay' | 'portrait' | 'render' — from content_items.media_subtype. */
  mediaSubtype?: string;
  /** Free-form curation notes (content_items.notes). */
  notes?: string | null;
  /** Poster/thumbnail image url for a video tile. */
  poster?: string;
  /** For an embed-only video (e.g. Descript): the iframe src to play inline. */
  embedUrl?: string;
  /** Community this asset belongs to (content_items.community_id → communities.name). */
  community?: string;
  /** Storyteller whose portrait this is (content_items.storyteller_id → display_name). */
  person?: string;
  /** People depicted in this EL photo — EL media_storytellers junction, keyed by the
   *  media_asset_id (= the id after the `el:` prefix). EL images only. */
  people?: { id: string; name: string }[];
  /** Primary theme id (themes.ts derivation: theme:<id> tag > canon slot > folder). */
  theme?: string;
}

type SourceFilter = 'all' | 'website' | 'el' | 'descript';
/** Pickable storyteller for photo→people alignment (from the project_storytellers roster). */
type RosterPerson = { id: string; name: string; isElder?: boolean };

// Measured image aspect ratios are cached here so repeat loads (the whole
// iterate-and-refresh loop) lay the justified grid out correctly on the FIRST
// paint instead of measure-then-reflow. Bump the version to invalidate.
const ASPECT_CACHE_KEY = 'mlib:aspects:v1';
function loadAspectCache(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(ASPECT_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, number>) : {};
  } catch {
    return {};
  }
}

/** Plain-language source label for the tile + modal. Consent nuance moved off
 *  the grid; only a clear "held" flag stays visible as a safety marker. */
function sourceLabel(source: UnifiedItem['source']): string {
  if (source === 'website') return 'Website';
  if (source === 'descript') return 'Descript';
  return 'Community';
}

function consentBadge(item: UnifiedItem): { text: string; cls: string } {
  if (item.source === 'website') return { text: 'Website', cls: 'bg-muted text-foreground' };
  if (item.source === 'descript') return { text: 'Descript', cls: 'bg-violet-100 text-violet-700' };
  // Empathy Ledger = community media, consent-governed.
  return { text: 'Community', cls: 'bg-green-100 text-green-700' };
}

/** True when this item should never go on an external slide without a check. */
function isHeld(item: UnifiedItem): boolean {
  return item.consent === 'flagged' || item.consent === 'elder-pending' || item.tags.includes('consent:held');
}

/** A patch sent to /api/admin/content-item and applied optimistically to state. */
type CurationPatch = { starred?: boolean; rating?: number; archived?: boolean; community_id?: string | null };

export function MediaLibraryClient({
  items: initialItems,
  curationReady,
  communities = [],
}: {
  items: UnifiedItem[];
  curationReady: boolean;
  communities?: { id: string; name: string }[];
}) {
  const commMap = useMemo(() => new Map(communities.map((c) => [c.id, c.name])), [communities]);
  // Local copy so saved tags + curation state update the grid without a reload.
  const [items, setItems] = useState<UnifiedItem[]>(initialItems);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [area, setArea] = useState<string>('__all');
  const [theme, setTheme] = useState<string>('__all');
  const [community, setCommunity] = useState<string>('__all');
  const [personFilter, setPersonFilter] = useState<string>('__all');
  const [needsPeople, setNeedsPeople] = useState(false);
  const [roster, setRoster] = useState<RosterPerson[]>([]);
  // Primary mode: Photos vs Videos. Opens on Photos.
  const [kind, setKind] = useState<'image' | 'video'>('image');
  // Advanced filters (source / subject / community / person / theme) collapse
  // behind one toggle so the top stays clean.
  const [showFilters, setShowFilters] = useState(false);
  // Justified-rows layout state: measured image aspect ratios + the grid's width.
  // Seeded from the localStorage cache so a re-load lays out with no reflow.
  const [aspects, setAspects] = useState<Record<string, number>>(loadAspectCache);
  const [gridWidth, setGridWidth] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<UnifiedItem | null>(null);
  // Thumbnails that failed to load (e.g. gated EL rows with no public cdn_url) —
  // render a clean "no preview" placeholder instead of a broken image.
  const [brokenThumbs, setBrokenThumbs] = useState<Set<string>>(new Set());
  // curation UI state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkTagInput, setBulkTagInput] = useState('');
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
      .then((d: { items?: UnifiedItem[]; elMissing?: boolean; roster?: RosterPerson[] }) => {
        if (cancelled) return;
        elRef.current = d.items ?? [];
        setElMissing(!!d.elMissing);
        setRoster(d.roster ?? []);
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

  // Measure the grid width for the justified-rows layout.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => { for (const e of entries) setGridWidth(e.contentRect.width); });
    ro.observe(el);
    setGridWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Persist measured aspects (debounced) so the next load skips the reflow. A
  // cold load coalesces its burst of onLoad measurements into a single write.
  const aspectFlush = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (aspectFlush.current) clearTimeout(aspectFlush.current);
    aspectFlush.current = setTimeout(() => {
      try { window.localStorage.setItem(ASPECT_CACHE_KEY, JSON.stringify(aspects)); } catch { /* quota / private mode */ }
    }, 400);
    return () => { if (aspectFlush.current) clearTimeout(aspectFlush.current); };
  }, [aspects]);

  const updateItemTags = useCallback((id: string, tags: string[]) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, tags } : it)));
    setActive((cur) => (cur && cur.id === id ? { ...cur, tags } : cur));
  }, []);

  const updateItemNotes = useCallback((id: string, notes: string | null) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, notes } : it)));
    setActive((cur) => (cur && cur.id === id ? { ...cur, notes } : cur));
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
        ...(patch.community_id !== undefined
          ? { community: patch.community_id ? commMap.get(patch.community_id) : undefined }
          : {}),
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
    [items, commMap],
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

  // Bulk-ADD a subject tag to the selection without clobbering each item's own
  // tags (the content-item API replaces tags[], so we merge + write per item).
  const bulkAddTag = useCallback(
    async (raw: string) => {
      const tag = raw.trim();
      if (!tag) return;
      const targets = items.filter(
        (it) => selected.has(it.id) && it.contentId && !it.tags.includes(tag),
      );
      if (targets.length === 0) return;
      setErr('');
      const snapshot = items;
      setItems((prev) =>
        prev.map((it) =>
          selected.has(it.id) && it.contentId && !it.tags.includes(tag)
            ? { ...it, tags: [...it.tags, tag] }
            : it,
        ),
      );
      const results = await Promise.allSettled(
        targets.map((it) =>
          fetch('/api/admin/content-item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: it.contentId, tags: [...it.tags, tag] }),
          })
            .then((r) => r.json())
            .then((d: { ok: boolean; error?: string }) => {
              if (!d.ok) throw new Error(d.error || 'save failed');
            }),
        ),
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      if (failed) {
        setItems(snapshot); // revert all on partial failure so state stays truthful
        setErr(`Bulk tag failed on ${failed}/${targets.length} — nothing changed.`);
      }
    },
    [items, selected],
  );

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // --- photo→people alignment: writes to EL media_storytellers (not content_items).
  // Keyed by media_asset_id (= item.id minus the `el:` prefix). Optimistic; reverts.
  const mutatePeople = useCallback(
    async (item: UnifiedItem, storytellerId: string, action: 'add' | 'remove') => {
      if (item.source !== 'el') return;
      const mediaAssetId = item.id.replace(/^el:/, '');
      const name = roster.find((p) => p.id === storytellerId)?.name ?? '';
      setErr('');
      const snapshot = items;
      const apply = (it: UnifiedItem): UnifiedItem => {
        const cur = it.people ?? [];
        const people = action === 'remove'
          ? cur.filter((x) => x.id !== storytellerId)
          : (cur.some((x) => x.id === storytellerId) ? cur : [...cur, { id: storytellerId, name }]);
        return { ...it, people };
      };
      setItems((prev) => prev.map((it) => (it.id === item.id ? apply(it) : it)));
      setActive((cur) => (cur && cur.id === item.id ? apply(cur) : cur));
      try {
        const res = await fetch('/api/admin/el-align', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaAssetId, storytellerId, action }),
        });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      } catch (e) {
        setItems(snapshot); // revert
        setActive((cur) => (cur && cur.id === item.id ? snapshot.find((s) => s.id === item.id) ?? cur : cur));
        setErr(`People save failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    },
    [items, roster],
  );

  const sourceCounts = useMemo(() => {
    let website = 0;
    let el = 0;
    let descript = 0;
    for (const it of items) {
      if (it.source === 'website') website += 1;
      else if (it.source === 'descript') descript += 1;
      else el += 1;
    }
    return { all: items.length, website, el, descript };
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

  // People tagged across EL photos in the current source view (media_storytellers).
  const personOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of items) {
      if (sourceFilter !== 'all' && it.source !== sourceFilter) continue;
      for (const p of it.people ?? []) counts.set(p.name, (counts.get(p.name) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, count }));
  }, [items, sourceFilter]);

  // EL images with no one tagged yet — the alignment backlog.
  const needsPeopleCount = useMemo(
    () => items.filter((it) => it.source === 'el' && it.mediaType === 'image' && (it.people ?? []).length === 0).length,
    [items],
  );

  // Themes present in the current source view (from themes.ts derivation).
  const themeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of items) {
      if (sourceFilter !== 'all' && it.source !== sourceFilter) continue;
      if (!it.theme) continue;
      counts.set(it.theme, (counts.get(it.theme) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, name: themeName(value) || value, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, sourceFilter]);

  const kindCounts = useMemo(() => {
    let image = 0, video = 0;
    for (const it of items) {
      if (it.mediaType === 'video') video++; else image++;
    }
    return { image, video };
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      // Archived hidden by default; toggle to review the archive.
      if (!showArchived && it.archived) return false;
      if (showArchived && !it.archived) return false;
      if (starredOnly && !it.starred) return false;
      if (sourceFilter !== 'all' && it.source !== sourceFilter) return false;
      if (theme !== '__all' && it.theme !== theme) return false;
      if (area !== '__all' && it.area !== area && !it.tags.includes(area)) return false;
      if (community !== '__all' && it.community !== community) return false;
      if (personFilter !== '__all' && !(it.people ?? []).some((p) => p.name === personFilter)) return false;
      if (needsPeople && !(it.source === 'el' && it.mediaType === 'image' && (it.people ?? []).length === 0)) return false;
      // Photos = anything not a video (undefined mediaType counts as a photo).
      const isVid = it.mediaType === 'video';
      if (kind === 'image' && isVid) return false;
      if (kind === 'video' && !isVid) return false;
      if (q) {
        const hay = `${it.title} ${it.area} ${it.tags.join(' ')} ${it.community ?? ''} ${it.person ?? ''} ${themeName(it.theme) ?? ''} ${it.full}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, sourceFilter, theme, area, community, personFilter, needsPeople, kind, search, showArchived, starredOnly]);

  // Justified-rows layout (Google-Photos style): every photo shown whole at its
  // natural aspect, but each row shares a height so the grid stays clean and even.
  // Aspects are measured from the images as they load; clamped so a freak
  // panorama/very-tall shot can't blow out a row.
  const rows = useMemo(() => {
    // MAX_PER_ROW caps a run of tall (portrait) photos so a cluster of them can't
    // cram 11-12 into one row of narrow strips — they break into fewer, larger
    // tiles instead. Landscape rows fill on width well before the cap, so it only
    // bites on portrait clusters. MAX_A also higher so panoramas aren't chopped.
    const ROW_H = 220, GAP = 12, MIN_A = 0.5, MAX_A = 2.6, DEF_A = 1.4, MAX_PER_ROW = 6;
    type Cell = { it: UnifiedItem; idx: number; w: number; h: number };
    if (gridWidth <= 0) return [] as { items: Cell[] }[];
    const out: { items: Cell[] }[] = [];
    let cur: { it: UnifiedItem; idx: number; a: number }[] = [];
    let sumA = 0;
    const flush = (stretch: boolean) => {
      if (!cur.length) return;
      const h = stretch ? (gridWidth - GAP * (cur.length - 1)) / sumA : ROW_H;
      out.push({ items: cur.map((c) => ({ it: c.it, idx: c.idx, w: c.a * h, h })) });
      cur = []; sumA = 0;
    };
    filtered.forEach((it, idx) => {
      const a = Math.min(MAX_A, Math.max(MIN_A, aspects[it.id] ?? DEF_A));
      cur.push({ it, idx, a }); sumA += a;
      if (sumA * ROW_H + GAP * (cur.length - 1) >= gridWidth || cur.length >= MAX_PER_ROW) flush(true);
    });
    flush(false); // last row keeps the natural height, left-aligned
    return out;
  }, [filtered, aspects, gridWidth]);

  const archivedCount = useMemo(() => items.filter((it) => it.archived).length, [items]);
  const starredCount = useMemo(() => items.filter((it) => it.starred).length, [items]);
  // How many advanced filters are active — shown as a count on the Filters button.
  const activeFilterCount =
    (sourceFilter !== 'all' ? 1 : 0) +
    (area !== '__all' ? 1 : 0) +
    (community !== '__all' ? 1 : 0) +
    (personFilter !== '__all' ? 1 : 0) +
    (theme !== '__all' ? 1 : 0) +
    (needsPeople ? 1 : 0) +
    (showArchived ? 1 : 0);
  // Every distinct tag in the library — powers tag autocomplete + click-to-filter.
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const it of items) for (const t of it.tags) set.add(t);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

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

  const chip = (key: SourceFilter, label: string, count: number, title?: string) => {
    const isActive = sourceFilter === key;
    return (
      <button
        key={key}
        type="button"
        title={title}
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

      {/* Shared tag autocomplete source (bulk bar + item tag editor). */}
      <datalist id="ml-tag-suggestions">
        {allTags.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      {/* ── Primary control: Photos | Videos, search, filters toggle ── */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setKind('image')}
            className={
              'inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition ' +
              (kind === 'image' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')
            }
          >
            Photos <span className={kind === 'image' ? 'text-muted-foreground' : 'opacity-70'}>{kindCounts.image}</span>
          </button>
          <button
            type="button"
            onClick={() => setKind('video')}
            className={
              'inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition ' +
              (kind === 'video' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')
            }
          >
            Videos <span className={kind === 'video' ? 'text-muted-foreground' : 'opacity-70'}>{kindCounts.video}</span>
          </button>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search titles, tags, people…"
          className="flex-1 min-w-[12rem] rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {toggleBtn(showFilters, () => setShowFilters((v) => !v), 'Filters', activeFilterCount || undefined)}

        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {filtered.length} item{filtered.length === 1 ? '' : 's'}
          {elState === 'loading' && <span className="ml-1 opacity-70">· loading…</span>}
        </span>
      </div>

      {/* ── Curation toggles (kept light) ── */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {toggleBtn(
          selectMode,
          () => { setSelectMode((v) => !v); if (selectMode) setSelected(new Set()); },
          selectMode ? 'Selecting — click tiles' : '☑ Select multiple',
          selectMode ? selected.size : undefined,
        )}
        {toggleBtn(starredOnly, () => setStarredOnly((v) => !v), '★ Starred', starredCount)}
        <span className="text-[11px] text-muted-foreground ml-1 hidden sm:inline">
          {selectMode
            ? 'click tiles to select · shift-click for a range · then use the bar below'
            : 'keys: j/k move · s star · x archive · 1–5 rate · space select · enter open'}
        </span>
      </div>

      {/* ── Advanced filters (collapsed by default) ── */}
      {showFilters && (
        <div className="mb-4 rounded-xl border border-border bg-muted/20 p-3">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[11px] uppercase tracking-widest text-muted-foreground">Source</span>
            {chip('all', 'All', sourceCounts.all)}
            {chip('website', 'Website', sourceCounts.website, "The site's own files — marketing, product, brand. Yours to use freely.")}
            {chip('el', 'Community', sourceCounts.el, 'Empathy Ledger community media — consent-governed, linked to the people & communities in it.')}
            {sourceCounts.descript > 0 && chip('descript', 'Descript', sourceCounts.descript, 'Hosted video cuts — walkthrough, timelapse, storyteller cuts. Play inline.')}
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground whitespace-nowrap">Subject</span>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="__all">All subjects</option>
                {areaOptions.map((a) => (
                  <option key={a.value} value={a.value}>{a.value} ({a.count})</option>
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
                    <option key={c.value} value={c.value}>{c.value} ({c.count})</option>
                  ))}
                </select>
              </label>
            )}

            {personOptions.length > 0 && (
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground whitespace-nowrap">Person</span>
                <select
                  value={personFilter}
                  onChange={(e) => setPersonFilter(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="__all">Anyone</option>
                  {personOptions.map((p) => (
                    <option key={p.value} value={p.value}>{p.value} ({p.count})</option>
                  ))}
                </select>
              </label>
            )}

            {themeOptions.length > 0 && (
              <label className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground whitespace-nowrap">Theme</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="__all">All themes</option>
                  {themeOptions.map((t) => (
                    <option key={t.value} value={t.value}>{t.name} ({t.count})</option>
                  ))}
                </select>
              </label>
            )}

            {needsPeopleCount > 0 && (
              <label className="flex items-center gap-2 text-sm" title="Community photos with no one tagged yet — the alignment backlog">
                <input type="checkbox" checked={needsPeople} onChange={(e) => setNeedsPeople(e.target.checked)} />
                <span className="text-muted-foreground whitespace-nowrap">Needs people ({needsPeopleCount})</span>
              </label>
            )}

            {toggleBtn(showArchived, () => setShowArchived((v) => !v), showArchived ? 'Viewing archive' : 'Show archived', archivedCount)}

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => { setSourceFilter('all'); setArea('__all'); setCommunity('__all'); setPersonFilter('__all'); setTheme('__all'); setNeedsPeople(false); setShowArchived(false); }}
                className="rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Archive-only mode: make it unmistakable why the grid is small */}
      {showArchived && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <span>You&rsquo;re viewing <span className="font-semibold">archived items only</span> ({archivedCount}) — the rest of the library is hidden.</span>
          <button
            type="button"
            onClick={() => setShowArchived(false)}
            className="rounded-md border border-amber-400 px-2 py-0.5 font-medium hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900/40"
          >
            ← Back to full library
          </button>
        </div>
      )}

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
          {communities.length > 0 && (
            <select
              aria-label="Tag community"
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value;
                e.target.value = '';
                if (v === '__clear') bulkSet({ community_id: null });
                else if (v) bulkSet({ community_id: v });
              }}
              className="border-l border-border pl-2 ml-1 rounded-lg border px-2 py-1 text-xs bg-background"
            >
              <option value="" disabled>Tag community…</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value="__clear">— Clear community —</option>
            </select>
          )}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={bulkTagInput}
              onChange={(e) => setBulkTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); bulkAddTag(bulkTagInput); setBulkTagInput(''); } }}
              list="ml-tag-suggestions"
              placeholder="tag selected…"
              className="w-32 rounded-lg border border-input bg-background px-2 py-1 text-xs font-mono"
            />
            <button type="button" onClick={() => { bulkAddTag(bulkTagInput); setBulkTagInput(''); }} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:border-foreground">+ Tag</button>
          </div>
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
        <div ref={gridRef}>
          {rows.map((row, ri) => (
            <div key={ri} className="mb-3 flex gap-3">
              {row.items.map(({ it, idx, w, h }) => {
            const badge = consentBadge(it);
            const isSel = selected.has(it.id);
            const isCursor = idx === cursor;
            const canCurate = !!it.contentId;
            const isVideo = it.mediaType === 'video';
            const rawThumb = isVideo ? it.poster : it.src;
            const thumb = rawThumb && !brokenThumbs.has(it.id) ? rawThumb : undefined;
            return (
              <div
                key={it.id}
                ref={(el) => { if (el) tileRefs.current.set(idx, el); else tileRefs.current.delete(idx); }}
                style={{ width: `${w}px`, height: `${h}px` }}
                className={
                  'relative shrink-0 rounded-lg overflow-hidden bg-muted border transition group ' +
                  (isSel
                    ? 'ring-2 ring-primary border-primary '
                    : isCursor
                      ? 'border-accent ring-2 ring-accent '
                      : 'border-border hover:border-foreground/60 ') +
                  (it.archived ? 'opacity-60 ' : '')
                }
              >
                {/* Box is sized to the image's measured aspect, so object-contain shows the whole photo with no bars. */}
                {thumb ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={thumb}
                    alt={it.title}
                    loading="lazy"
                    ref={(el) => {
                      // Catch already-cached images that never fire onLoad.
                      if (el && el.complete && el.naturalWidth && aspects[it.id] === undefined) {
                        const ar = el.naturalWidth / el.naturalHeight;
                        queueMicrotask(() => setAspects((m) => (m[it.id] ? m : { ...m, [it.id]: ar })));
                      }
                    }}
                    onLoad={(e) => {
                      const im = e.currentTarget;
                      if (im.naturalWidth && im.naturalHeight) {
                        const ar = im.naturalWidth / im.naturalHeight;
                        setAspects((m) => (m[it.id] ? m : { ...m, [it.id]: ar }));
                      }
                    }}
                    onError={() => setBrokenThumbs((s) => { const n = new Set(s); n.add(it.id); return n; })}
                    className="absolute inset-0 h-full w-full object-contain transition-opacity group-hover:opacity-95"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-muted text-muted-foreground">
                    <span className="text-2xl">{isVideo ? '🎬' : '🖼'}</span>
                    <span className="text-[9px] uppercase tracking-wider">No preview</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    setCursor(idx);
                    if (selectMode) { if (canCurate) selectAt(idx, it.id, e.shiftKey); }
                    else setActive(it);
                  }}
                  className="absolute inset-0 h-full w-full text-left"
                  title={selectMode ? (canCurate ? 'Click to select (shift-click for a range)' : 'Not indexed — cannot select') : it.title}
                />
                {isVideo && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-sm text-white">▶</span>
                  </span>
                )}

                {/* source badge */}
                <span className={'pointer-events-none absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold ' + badge.cls}>
                  {badge.text}
                </span>

                {/* held marker — do not place externally without a consent check */}
                {isHeld(it) && (
                  <span className="pointer-events-none absolute top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-semibold text-white">
                    held
                  </span>
                )}

                {/* people tagged (EL alignment) */}
                {it.people && it.people.length > 0 && (
                  <span
                    className="pointer-events-none absolute top-7 left-1.5 max-w-[85%] truncate rounded-full bg-accent/90 px-1.5 py-0.5 text-[9px] font-semibold text-white"
                    title={it.people.map((p) => p.name).join(', ')}
                  >
                    {it.people.length === 1 ? it.people[0].name : `👤 ${it.people.length}`}
                  </span>
                )}

                {/* select checkbox (curatable items) — always visible in select mode */}
                {canCurate && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); selectAt(idx, it.id, e.shiftKey); }}
                    aria-label={isSel ? 'Deselect' : 'Select'}
                    className={
                      'absolute bottom-1.5 left-1.5 h-6 w-6 rounded border flex items-center justify-center text-[12px] font-bold transition ' +
                      (isSel
                        ? 'bg-primary text-primary-foreground border-primary'
                        : selectMode
                          ? 'bg-background/90 border-primary/50 text-transparent hover:text-primary'
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
                {it.notes && (
                  <span className="pointer-events-none absolute bottom-8 right-1.5 rounded-full bg-amber-500 text-white px-1.5 py-0.5 text-[9px] font-semibold" title={it.notes}>
                    ✎
                  </span>
                )}
                {it.aliases && it.aliases.length > 0 && (
                  <span
                    className="pointer-events-none absolute top-1.5 right-9 rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[9px] font-semibold"
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
          ))}
        </div>
      )}

      {active && (
        <PreviewModal
          item={active}
          curationReady={curationReady}
          roster={roster}
          communities={communities}
          onClose={() => setActive(null)}
          onSaveTags={updateItemTags}
          onSaveNotes={updateItemNotes}
          onToggleStar={toggleStar}
          onToggleArchive={toggleArchive}
          onSetRating={setRating}
          onMutatePeople={mutatePeople}
          onFilterTag={(t) => { setArea(t); setActive(null); }}
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

// The three real Goods products, for tagging media to a product page.
const LINKABLE_PRODUCTS: { slug: string; name: string }[] = [
  { slug: 'stretch-bed', name: 'Stretch Bed' },
  { slug: 'pakkimjalki-kari', name: 'Pakkimjalki Kari (washer)' },
  { slug: 'basket-bed', name: 'Basket Bed' },
];

interface MediaLink {
  id: string;
  target_type: 'person' | 'community' | 'asset' | 'product' | 'story';
  target_key: string;
  relation: string;
  consent_status: string | null;
  source: string | null;
  title: string | null;
}

/**
 * Links panel — reads/writes the media_links typed junction for one media item.
 * Product + community linking (the gap the old library never had); existing
 * person/story links from the backfill render read-only-ish here too. Self-
 * contained: fetches this item's links on open so nothing threads through the
 * big grid pipeline.
 */
function MediaLinksPanel({
  item,
  communities,
  people,
}: {
  item: UnifiedItem;
  communities: { id: string; name: string }[];
  people: RosterPerson[];
}) {
  const mediaSource = item.source === 'el' ? 'el_media' : 'local';
  const mediaKey = item.source === 'el' ? item.id.replace(/^el:/, '') : item.full;
  const mediaType = item.mediaType === 'video' ? 'video' : 'photo';

  const [links, setLinks] = useState<MediaLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [productPick, setProductPick] = useState('');
  const [communityPick, setCommunityPick] = useState('');
  const [personPick, setPersonPick] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr('');
    const qs = new URLSearchParams({ media_source: mediaSource, media_key: mediaKey });
    fetch(`/api/admin/media-link?${qs}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.ok) setLinks(d.links);
        else setErr(d.error || 'load failed');
      })
      .catch((e) => alive && setErr(String(e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [mediaSource, mediaKey]);

  const commName = (id: string) => communities.find((c) => c.id === id)?.name ?? id;
  const prodName = (slug: string) => LINKABLE_PRODUCTS.find((p) => p.slug === slug)?.name ?? slug;

  const addLink = useCallback(
    async (target_type: MediaLink['target_type'], target_key: string, title: string | null) => {
      if (!target_key) return;
      // already linked?
      if (links.some((l) => l.target_type === target_type && l.target_key === target_key)) return;
      setBusy(true);
      setErr('');
      try {
        const res = await fetch('/api/admin/media-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_source: mediaSource,
            media_key: mediaKey,
            media_type: mediaType,
            title,
            target_type,
            target_key,
          }),
        });
        const d = await res.json();
        if (d.ok && d.link) setLinks((prev) => [...prev, d.link]);
        else setErr(d.error || 'save failed');
      } catch (e) {
        setErr(String(e));
      } finally {
        setBusy(false);
      }
    },
    [links, mediaSource, mediaKey, mediaType],
  );

  const removeLink = useCallback(async (id: string) => {
    setBusy(true);
    setErr('');
    try {
      const res = await fetch(`/api/admin/media-link?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const d = await res.json();
      if (d.ok) setLinks((prev) => prev.filter((l) => l.id !== id));
      else setErr(d.error || 'delete failed');
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }, []);

  const personName = (id: string) => people.find((p) => p.id === id)?.name ?? id;
  const labelFor = (l: MediaLink) => {
    if (l.target_type === 'product') return prodName(l.target_key);
    if (l.target_type === 'community') return commName(l.target_key);
    if (l.target_type === 'person') return l.title || personName(l.target_key);
    return l.title || l.target_key;
  };
  const toneFor = (t: MediaLink['target_type']) =>
    t === 'product'
      ? 'bg-primary/10 text-primary'
      : t === 'community'
        ? 'bg-accent/10 text-accent'
        : t === 'person'
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-muted text-foreground';

  const availableProducts = LINKABLE_PRODUCTS.filter(
    (p) => !links.some((l) => l.target_type === 'product' && l.target_key === p.slug),
  );
  const availableCommunities = communities.filter(
    (c) => !links.some((l) => l.target_type === 'community' && l.target_key === c.id),
  );
  // Person links let you tag WHO is in a website photo or video. EL images use
  // their own EL-junction People panel instead, so this picker is website-only.
  const canLinkPerson = item.source === 'website';
  const availablePeople = people.filter(
    (p) => !links.some((l) => l.target_type === 'person' && l.target_key === p.id),
  );

  return (
    <div className="mb-5 rounded-lg border border-border p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Links</div>
        {busy && <span className="text-[10px] text-muted-foreground">saving…</span>}
      </div>

      {loading ? (
        <div className="text-xs text-muted-foreground">Loading links…</div>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap gap-1">
            {links.length === 0 && <span className="text-xs text-muted-foreground">Not linked to anything yet.</span>}
            {links.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => removeLink(l.id)}
                title="Click to remove"
                className={`rounded-full px-2 py-0.5 text-xs hover:bg-red-100 hover:text-red-700 ${toneFor(l.target_type)}`}
              >
                <span className="opacity-60 mr-1">{l.target_type}</span>
                {labelFor(l)} ×
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            {/* Add a person link — who is in this photo / video (website items) */}
            {canLinkPerson && (
              <div className="flex gap-1.5">
                <select
                  value={personPick}
                  onChange={(e) => setPersonPick(e.target.value)}
                  className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs"
                >
                  <option value="">Tag a person…{people.length === 0 ? ' (loading…)' : ''}</option>
                  {availablePeople.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}{p.isElder ? ' (elder)' : ''}</option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={!personPick || busy}
                  onClick={() => { addLink('person', personPick, personName(personPick)); setPersonPick(''); }}
                  className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            )}

            {/* Add a product link */}
            <div className="flex gap-1.5">
              <select
                value={productPick}
                onChange={(e) => setProductPick(e.target.value)}
                className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs"
              >
                <option value="">Link a product…</option>
                {availableProducts.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
              <button
                type="button"
                disabled={!productPick || busy}
                onClick={() => { addLink('product', productPick, prodName(productPick)); setProductPick(''); }}
                className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {/* Add a community link */}
            <div className="flex gap-1.5">
              <select
                value={communityPick}
                onChange={(e) => setCommunityPick(e.target.value)}
                className="flex-1 rounded border border-border bg-background px-2 py-1 text-xs"
              >
                <option value="">Link a community…</option>
                {availableCommunities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                type="button"
                disabled={!communityPick || busy}
                onClick={() => { addLink('community', communityPick, commName(communityPick)); setCommunityPick(''); }}
                className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </div>
        </>
      )}
      {err && <div className="mt-2 text-[11px] text-red-600">{err}</div>}
    </div>
  );
}

function PreviewModal({
  item,
  curationReady,
  roster,
  communities,
  onClose,
  onSaveTags,
  onSaveNotes,
  onToggleStar,
  onToggleArchive,
  onSetRating,
  onMutatePeople,
  onFilterTag,
}: {
  item: UnifiedItem;
  curationReady: boolean;
  roster: RosterPerson[];
  communities: { id: string; name: string }[];
  onClose: () => void;
  onSaveTags: (id: string, tags: string[]) => void;
  onSaveNotes: (id: string, notes: string | null) => void;
  onToggleStar: (it: UnifiedItem) => void;
  onToggleArchive: (it: UnifiedItem) => void;
  onSetRating: (it: UnifiedItem, r: number) => void;
  onMutatePeople: (it: UnifiedItem, storytellerId: string, action: 'add' | 'remove') => void;
  onFilterTag: (tag: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const badge = consentBadge(item);
  const isWebsite = item.source === 'website';
  const isVideo = item.mediaType === 'video';
  const canCurate = !!item.contentId;
  // Subject tags apply to any indexed website item — images and video alike.
  const showTagEditor = isWebsite;

  // Tag editor state (website items only). Seeded from the item's current tags.
  const [draftTags, setDraftTags] = useState<string[]>(item.tags);
  const [tagInput, setTagInput] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');

  // Notes editor state. Seeded from the item; kept local so a failed save
  // doesn't wipe what was typed.
  const [draftNotes, setDraftNotes] = useState(item.notes ?? '');
  const [notesState, setNotesState] = useState<SaveState>('idle');
  const [notesError, setNotesError] = useState('');
  const [notesColPending, setNotesColPending] = useState(false);

  // Re-seed if a different item opens in the same modal instance.
  useEffect(() => {
    setDraftTags(item.tags);
    setTagInput('');
    setSaveState('idle');
    setSaveError('');
  }, [item.id, item.tags]);

  const itemNotes = item.notes ?? '';
  useEffect(() => {
    setDraftNotes(itemNotes);
    setNotesState('idle');
    setNotesError('');
    setNotesColPending(false);
    // Seed only when a different item opens; item.notes changes from our own
    // optimistic save must not clobber the draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

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

  // Notes save: optimistic (grid badge + state update immediately), reverts on
  // API failure. Same {ids:[...]} body shape as the other curation writes.
  const saveNotes = useCallback(async () => {
    if (!item.contentId) {
      setNotesState('error');
      setNotesError('Not indexed yet. Run npm run content:index first.');
      return;
    }
    const prev = item.notes ?? null;
    const next = draftNotes.trim() === '' ? null : draftNotes;
    setNotesState('saving');
    setNotesError('');
    setNotesColPending(false);
    onSaveNotes(item.id, next); // optimistic
    try {
      const res = await fetch('/api/admin/content-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [item.contentId], notes: next ?? '' }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setNotesState('saved');
    } catch (e) {
      onSaveNotes(item.id, prev); // revert
      const msg = e instanceof Error ? e.message : String(e);
      setNotesState('error');
      setNotesError(msg);
      if (/column|schema cache|42703/i.test(msg)) setNotesColPending(true);
    }
  }, [item.contentId, item.id, item.notes, draftNotes, onSaveNotes]);

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
            item.embedUrl ? (
              <iframe
                src={item.embedUrl}
                title={item.title}
                className="w-full aspect-video max-h-[88vh] bg-black"
                allow="fullscreen; autoplay"
                allowFullScreen
              />
            ) : (
              <video
                src={item.full}
                poster={item.poster}
                controls
                className="max-h-[88vh] max-w-full object-contain"
              />
            )
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
            <h2 className="font-display text-base font-semibold leading-snug break-words">{item.title}</h2>
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
              {sourceLabel(item.source)}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
              {item.area}
            </span>
            {item.tags.includes('status:stale-canon') && (
              <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-semibold" title="Figures in this cut are behind current canon (540/22/3540)">figures stale</span>
            )}
            {item.tags.includes('consent:held') && (
              <span className="rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-semibold" title="Consent not confirmed — do not place on an external slide">consent held</span>
            )}
            {item.theme && (
              <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium">{themeName(item.theme)}</span>
            )}
            {item.community && (
              <span className="rounded-full bg-accent/10 text-accent px-2 py-0.5 text-[10px] font-medium">📍 {item.community}</span>
            )}
            {item.person && (
              <span className="rounded-full bg-muted text-foreground px-2 py-0.5 text-[10px] font-medium">{item.person}</span>
            )}
            {item.canonSlot && (
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold" title="This image is a locked canon pick">
                canon: {item.canonSlot}
              </span>
            )}
          </div>

          {/* Descript cut note (canon / consent context). */}
          {item.source === 'descript' && item.notes && (
            <p className="mb-4 rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
              {item.notes}
            </p>
          )}

          {/* Links — media_links typed junction (product / community / story). The
              Atlas + community + product pages read these back. */}
          {item.source !== 'descript' && (
            <MediaLinksPanel item={item} communities={communities} people={roster} />
          )}

          {/* People in this photo — EL alignment (media_storytellers). EL images only. */}
          {item.source === 'el' && !isVideo && (
            <div className="mb-5 rounded-lg border border-border p-3">
              <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">People in this photo</div>
              <div className="mb-2 flex flex-wrap gap-1">
                {(item.people ?? []).length === 0 && (
                  <span className="text-xs text-muted-foreground">No one tagged yet.</span>
                )}
                {(item.people ?? []).map((pp) => (
                  <button
                    key={pp.id}
                    type="button"
                    onClick={() => onMutatePeople(item, pp.id, 'remove')}
                    title="Click to remove"
                    className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 hover:bg-red-100 hover:text-red-700"
                  >
                    {pp.name} ×
                  </button>
                ))}
              </div>
              <select
                value=""
                onChange={(e) => { if (e.target.value) onMutatePeople(item, e.target.value, 'add'); }}
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">+ add person…</option>
                {roster
                  .filter((x) => !(item.people ?? []).some((y) => y.id === x.id))
                  .map((x) => (
                    <option key={x.id} value={x.id}>{x.name}{x.isElder ? ' (elder)' : ''}</option>
                  ))}
              </select>
              <p className="mt-1.5 text-[10px] text-muted-foreground">
                Writes to EL <code className="rounded bg-muted px-1">media_storytellers</code> as appears_in, consent pending. The photo is already public; this records who is in it.
              </p>
            </div>
          )}

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

          {/* Notes (content_items.notes) — any indexed item */}
          {canCurate && (
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Notes
              </p>
              <textarea
                value={draftNotes}
                onChange={(e) => { setDraftNotes(e.target.value); setNotesState('idle'); }}
                rows={3}
                placeholder="Why it's a keeper, what to fix, where it's used…"
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={saveNotes}
                disabled={notesState === 'saving'}
                className="mt-1.5 w-full rounded-lg bg-foreground text-background px-3 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {notesState === 'saving' ? 'Saving…' : 'Save notes'}
              </button>
              <p className="mt-1.5 text-[11px] min-h-[1rem]" aria-live="polite">
                {notesState === 'saved' && <span className="text-green-600">✓ Saved</span>}
                {notesState === 'error' && (
                  <span className="text-red-600">Error: {notesError}</span>
                )}
                {notesColPending && (
                  <span className="block text-muted-foreground">Notes column pending: run the ALTER in Supabase SQL editor</span>
                )}
              </p>
            </div>
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
                  list="ml-tag-suggestions"
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
                    <button
                      key={t}
                      type="button"
                      onClick={() => onFilterTag(t)}
                      title={`Filter the library to ${t}`}
                      className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono hover:bg-primary hover:text-primary-foreground transition"
                    >
                      {t}
                    </button>
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
