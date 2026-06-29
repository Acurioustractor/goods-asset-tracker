'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface CanonImage {
  subject: string;
  type: 'photo' | 'illustration' | 'chart' | 'logo';
  dataClass: 'green' | 'amber' | 'red';
  caption: string;
  qbeAreas: string[];
  canonicalPath: string;
  consentCleared: boolean;
  /** Purpose-slot key this image is the canon pick for (design/canon-slots.json). */
  slot?: string;
  /** Grid + preview src (served via the canon-image API). */
  src: string;
  /** Public web URL if the image lives under v2/public/**, else null. */
  webUrl: string | null;
}

/** A purpose slot the raise needs an asset for (design/canon-slots.json). */
export interface CanonSlot {
  key: string;
  label: string;
  group: string;
  type: string;
  dataClass: string;
  areas: string[];
  use?: string;
  note?: string;
  seed?: string | null;
  /** Grid src for the seed image, served via the canon-image API (null for videos / missing). */
  seedSrc?: string | null;
}

export interface CanonGap {
  areaId: string;
  subject: string;
  need: string;
  draft?: string;
  draftStatus?: string;
}

/** A photo from the Empathy Ledger library (full EL pool, for the picker). */
export interface ElPhoto {
  id: string;
  url: string;
  thumb: string;
  title: string;
  tags: string[];
  isPublic: boolean;
  consent: boolean;
  elderOk: boolean;
  location: string;
  /** image (default) | video | portrait (RED, consent-gated). */
  kind?: 'image' | 'video' | 'portrait';
}

/** An EL asset pinned to an area or slot (persisted in canon-el-picks.json). */
export interface CanonElPick {
  elId: string;
  url: string;
  title: string;
  consent: string;
  tags?: string[];
  /** image | video | portrait — so pinned tiles can badge videos / RED faces. */
  kind?: 'image' | 'video' | 'portrait';
  /** Thumbnail URL (videos have a poster distinct from the playable url). */
  thumb?: string;
}

type TypeFilter = 'all' | 'photo' | 'illustration' | 'chart' | 'logo';
type Picks = Record<string, CanonElPick[]>;

const TYPE_PILL: Record<CanonImage['type'], string> = {
  photo: 'bg-blue-100 text-blue-700',
  illustration: 'bg-purple-100 text-purple-700',
  chart: 'bg-teal-100 text-teal-700',
  logo: 'bg-gray-200 text-gray-700',
};

function consentPill(im: CanonImage): { text: string; cls: string } {
  if (im.dataClass === 'red') {
    return im.consentCleared
      ? { text: 'consent · cleared', cls: 'bg-green-100 text-green-700' }
      : { text: 'consent · gated', cls: 'bg-red-100 text-red-700' };
  }
  if (im.dataClass === 'amber') return { text: 'internal', cls: 'bg-amber-100 text-amber-700' };
  return { text: 'public', cls: 'bg-green-100 text-green-700' };
}

function elBadge(p: ElPhoto): { text: string; cls: string } {
  if (p.isPublic) return { text: 'public', cls: 'bg-green-100 text-green-700' };
  if (p.consent && p.elderOk) return { text: 'gated-ok', cls: 'bg-amber-100 text-amber-700' };
  if (p.consent && !p.elderOk) return { text: 'elder pending', cls: 'bg-orange-100 text-orange-700' };
  return { text: 'not flagged', cls: 'bg-gray-200 text-gray-600' };
}

function pickBadge(consent: string): { text: string; cls: string } {
  switch (consent) {
    case 'el:public':
      return { text: 'EL · public', cls: 'bg-green-100 text-green-700' };
    case 'el:gated-ok':
      return { text: 'EL · gated-ok', cls: 'bg-amber-100 text-amber-700' };
    case 'el:consent-elder-pending':
      return { text: 'EL · elder pending', cls: 'bg-orange-100 text-orange-700' };
    default:
      return { text: 'EL · not flagged', cls: 'bg-gray-200 text-gray-600' };
  }
}

function elConsentString(p: ElPhoto): string {
  return p.isPublic
    ? 'el:public'
    : p.consent && p.elderOk
      ? 'el:gated-ok'
      : p.consent
        ? 'el:consent-elder-pending'
        : 'el:not-flagged';
}

// Route EL thumbnails through our cache proxy so grids never blank under EL's
// burst throttling and repeat loads are instant. Only proxies EL hosts; anything
// else (local /api paths, our own urls) is returned untouched.
function elProxy(url: string): string {
  if (!url || url.startsWith('/')) return url;
  return /empathyledger\.com|supabase\.co/.test(url)
    ? `/api/admin/el-image?url=${encodeURIComponent(url)}`
    : url;
}

export function CanonBoardClient({
  images,
  gaps,
  areaNames,
  slots,
  elPhotos,
  elPicks,
}: {
  images: CanonImage[];
  gaps: CanonGap[];
  areaNames: Record<string, string>;
  slots: CanonSlot[];
  elPhotos: ElPhoto[];
  elPicks: Picks;
}) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<CanonImage | null>(null);
  const [picks, setPicks] = useState<Picks>(elPicks);
  const [pickerArea, setPickerArea] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [imageList, setImageList] = useState<CanonImage[]>(images);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => setPicks(elPicks), [elPicks]);
  useEffect(() => setImageList(images), [images]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActive(null);
        setPickerArea(null);
        setUploadOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const typeCounts = useMemo(() => {
    const c = { all: imageList.length, photo: 0, illustration: 0, chart: 0, logo: 0 };
    for (const im of imageList) c[im.type] += 1;
    return c;
  }, [imageList]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return imageList.filter((im) => {
      if (typeFilter !== 'all' && im.type !== typeFilter) return false;
      if (q) {
        const hay = `${im.subject} ${im.caption} ${im.canonicalPath}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [imageList, typeFilter, search]);

  const areaIds = useMemo(() => Object.keys(areaNames).sort(), [areaNames]);

  const byArea = useMemo(() => {
    const map = new Map<string, CanonImage[]>();
    for (const id of areaIds) map.set(id, []);
    for (const im of filtered) {
      for (const a of im.qbeAreas) if (map.has(a)) map.get(a)!.push(im);
    }
    return map;
  }, [filtered, areaIds]);

  const gapsByArea = useMemo(() => {
    const map = new Map<string, CanonGap[]>();
    for (const g of gaps) {
      if (!map.has(g.areaId)) map.set(g.areaId, []);
      map.get(g.areaId)!.push(g);
    }
    return map;
  }, [gaps]);

  // Friendly picker title for an area id or a slot key (slot-filling lives in the Studio tab).
  const bucketLabel = useCallback(
    (key: string) =>
      areaNames[key] ? `Area ${key} · ${areaNames[key]}` : slots.find((s) => s.key === key)?.label || key,
    [areaNames, slots],
  );

  const addPick = useCallback(
    async (areaId: string, photo: ElPhoto) => {
      setError(null);
      const pick: CanonElPick = {
        elId: photo.id,
        url: photo.url,
        title: photo.title,
        consent: elConsentString(photo),
        tags: photo.tags,
        kind: photo.kind || 'image',
        thumb: photo.thumb || photo.url,
      };
      try {
        const res = await fetch('/api/admin/canon-el-pick', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ areaId, action: 'add', pick }),
        });
        const json = (await res.json()) as { ok: boolean; error?: string };
        if (!json.ok) throw new Error(json.error || 'save failed');
        setPicks((prev) => {
          const list = prev[areaId] ?? [];
          if (list.some((p) => p.elId === pick.elId)) return prev;
          return { ...prev, [areaId]: [...list, pick] };
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [],
  );

  const removePick = useCallback(async (areaId: string, elId: string) => {
    setError(null);
    try {
      const res = await fetch('/api/admin/canon-el-pick', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ areaId, action: 'remove', elId }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error || 'remove failed');
      setPicks((prev) => {
        const list = (prev[areaId] ?? []).filter((p) => p.elId !== elId);
        const next = { ...prev };
        if (list.length) next[areaId] = list;
        else delete next[areaId];
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const onUploaded = useCallback((image: CanonImage) => {
    setImageList((prev) => [...prev.filter((x) => x.canonicalPath !== image.canonicalPath), image]);
  }, []);

  const removeCanonImage = useCallback(async (im: CanonImage) => {
    setError(null);
    try {
      const res = await fetch('/api/admin/canon-remove', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ canonicalPath: im.canonicalPath }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error || 'remove failed');
      setImageList((prev) => prev.filter((x) => x.canonicalPath !== im.canonicalPath));
      setActive(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const typeChip = (key: TypeFilter, label: string, count: number) => {
    const isActive = typeFilter === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => setTypeFilter(key)}
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
      {/* Type filter + search */}
      <div className="flex flex-wrap gap-2 mb-3">
        {typeChip('all', 'All', typeCounts.all)}
        {typeChip('photo', 'Photos', typeCounts.photo)}
        {typeChip('illustration', 'Illustrations', typeCounts.illustration)}
        {typeChip('chart', 'Charts', typeCounts.chart)}
        {typeChip('logo', 'Logos', typeCounts.logo)}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subject, caption, path…"
          className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {filtered.length} canon image{filtered.length === 1 ? '' : 's'}
        </span>
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="shrink-0 rounded-lg bg-foreground text-background px-3.5 py-2 text-sm font-semibold hover:opacity-90 transition"
        >
          ⬆ Upload from desktop
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {/* Area jump nav */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {areaIds.map((id) => (
          <a
            key={id}
            href={`#area-${id}`}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground hover:border-foreground hover:text-foreground transition"
          >
            {id} · {areaNames[id]}
          </a>
        ))}
      </div>

      {/* Area sections */}
      <div className="space-y-10">
        {areaIds.map((id) => {
          const imgs = byArea.get(id) ?? [];
          const areaGaps = gapsByArea.get(id) ?? [];
          const areaPicks = picks[id] ?? [];
          return (
            <section key={id} id={`area-${id}`} className="scroll-mt-6">
              <h2 className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-border pb-1.5">
                <span className="text-lg font-bold">{id}</span>
                <span className="text-base font-semibold">{areaNames[id]}</span>
                <span className="text-xs text-muted-foreground">
                  {imgs.length} canon
                  {areaPicks.length > 0 ? ` · ${areaPicks.length} EL pick${areaPicks.length === 1 ? '' : 's'}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => setPickerArea(id)}
                  className="ml-auto rounded-full border border-foreground/30 bg-background px-3 py-1 text-xs font-medium hover:border-foreground hover:bg-muted transition"
                >
                  + Add from Empathy Ledger
                </button>
              </h2>

              {imgs.length === 0 && areaPicks.length === 0 && areaGaps.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No canon image mapped to this area yet. Use{' '}
                  <button
                    type="button"
                    onClick={() => setPickerArea(id)}
                    className="underline hover:text-foreground"
                  >
                    Add from Empathy Ledger
                  </button>
                  .
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {/* Local canon images */}
                  {imgs.map((im) => {
                    const cp = consentPill(im);
                    return (
                      <button
                        key={`${id}:${im.canonicalPath}`}
                        type="button"
                        onClick={() => setActive(im)}
                        className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border hover:border-foreground/60 transition group text-left"
                        title={im.subject}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={im.src}
                          alt={im.subject}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                        />
                        <span
                          className={
                            'absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold ' +
                            TYPE_PILL[im.type]
                          }
                        >
                          {im.type}
                        </span>
                        <span
                          className={
                            'absolute top-1.5 right-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold ' +
                            cp.cls
                          }
                        >
                          {cp.text}
                        </span>
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-2 py-2 text-[10px] text-white">
                          <span className="block font-semibold leading-tight line-clamp-2">
                            {im.subject}
                          </span>
                        </span>
                      </button>
                    );
                  })}

                  {/* EL picks for this area */}
                  {areaPicks.map((p) => {
                    const b = pickBadge(p.consent);
                    return (
                      <div
                        key={`pick:${id}:${p.elId}`}
                        className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-blue-300"
                        title={p.title}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={elProxy(p.thumb || p.url)}
                          alt={p.title}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-semibold text-white">
                          {p.kind === 'video' ? '▶ EL video' : p.kind === 'portrait' ? 'EL face' : 'EL pick'}
                        </span>
                        <span
                          className={
                            'absolute top-1.5 right-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold ' +
                            b.cls
                          }
                        >
                          {b.text}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePick(id, p.elId)}
                          className="absolute bottom-1.5 right-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-semibold text-white hover:bg-red-600 transition"
                        >
                          remove
                        </button>
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-6 pt-3 text-[10px] text-white">
                          <span className="block leading-tight line-clamp-2">
                            {p.title || '(untitled EL photo)'}
                          </span>
                        </span>
                      </div>
                    );
                  })}

                  {/* Gap cards */}
                  {areaGaps.map((g) => (
                    <div
                      key={`gap:${g.areaId}:${g.subject}`}
                      className="aspect-square rounded-lg border-2 border-dashed border-amber-300 bg-amber-50/50 p-3 flex flex-col justify-center text-center"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                        Gap
                      </span>
                      <span className="mt-1 text-[11px] leading-snug text-amber-900">{g.need}</span>
                      {g.draftStatus && (
                        <span className="mt-1.5 text-[9px] text-amber-600">{g.draftStatus}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {active && (
        <CanonPreview im={active} onClose={() => setActive(null)} onRemove={removeCanonImage} />
      )}

      {pickerArea && (
        <ElPickerModal
          areaId={pickerArea}
          areaLabel={bucketLabel(pickerArea)}
          photos={elPhotos}
          pinnedIds={new Set((picks[pickerArea] ?? []).map((p) => p.elId))}
          onAssign={(photo) => addPick(pickerArea, photo)}
          onClose={() => setPickerArea(null)}
        />
      )}

      {uploadOpen && (
        <UploadModal
          areaNames={areaNames}
          onUploaded={onUploaded}
          onClose={() => setUploadOpen(false)}
        />
      )}
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, [value]);
  return (
    <button
      type="button"
      onClick={copy}
      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-left hover:border-foreground transition"
    >
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className="text-xs truncate font-mono">{value}</div>
      <div className="text-[10px] text-accent mt-1">{copied ? '✓ Copied' : 'Click to copy'}</div>
    </button>
  );
}

function CanonPreview({
  im,
  onClose,
  onRemove,
}: {
  im: CanonImage;
  onClose: () => void;
  onRemove: (im: CanonImage) => void;
}) {
  const cp = consentPill(im);
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 sm:p-8 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background text-foreground max-w-5xl w-full max-h-[92vh] rounded-2xl overflow-hidden grid md:grid-cols-[1fr_340px] cursor-default"
      >
        <div className="bg-black flex items-center justify-center min-h-[40vh] md:min-h-[60vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={im.src} alt={im.subject} className="max-h-[88vh] max-w-full object-contain" />
        </div>

        <aside className="p-5 overflow-y-auto bg-card border-l border-border">
          <header className="flex items-start justify-between gap-2 mb-3">
            <h2 className="text-base font-semibold leading-snug break-words">{im.subject}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-xl leading-none text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </header>

          {im.caption && <p className="text-sm text-muted-foreground mb-4">{im.caption}</p>}

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={'rounded-full px-2 py-0.5 text-[10px] font-semibold ' + TYPE_PILL[im.type]}>
              {im.type}
            </span>
            <span className={'rounded-full px-2 py-0.5 text-[10px] font-semibold ' + cp.cls}>
              {cp.text}
            </span>
            {im.qbeAreas.map((a) => (
              <span key={a} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                Area {a}
              </span>
            ))}
          </div>

          {im.dataClass === 'red' && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-[11px] leading-snug text-red-700">
              Consent-gated storyteller image.{' '}
              {im.consentCleared
                ? 'Cleared to publish — keep the cleared-voices list current.'
                : 'NOT cleared — do not publish externally.'}
            </p>
          )}

          <div className="space-y-2">
            <CopyRow label="Canonical path (for Pencil / deck)" value={im.canonicalPath} />
            {im.webUrl && <CopyRow label="Web URL (for the site)" value={im.webUrl} />}
            <a
              href={im.src}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-foreground text-background px-3 py-2.5 text-sm font-semibold text-center hover:opacity-90 transition"
            >
              Download
            </a>
            <a
              href={im.src}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-center hover:border-foreground transition"
            >
              Open in new tab
            </a>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Remove this image from the canon? It un-lists it from the board. The file on disk is kept.',
                  )
                ) {
                  onRemove(im);
                }
              }}
              className="block w-full rounded-lg border border-red-300 bg-background px-3 py-2.5 text-sm text-center text-red-600 hover:bg-red-50 transition"
            >
              Remove from canon
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ElPickerModal({
  areaId,
  areaLabel,
  photos,
  pinnedIds,
  onAssign,
  onClose,
}: {
  areaId: string;
  areaLabel: string;
  photos: ElPhoto[];
  pinnedIds: Set<string>;
  onAssign: (photo: ElPhoto) => Promise<void>;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [publicOnly, setPublicOnly] = useState(false);
  const [kindFilter, setKindFilter] = useState<'all' | 'image' | 'video' | 'portrait'>('all');
  const [preview, setPreview] = useState<ElPhoto | null>(null);
  const [busy, setBusy] = useState(false);

  const kindCounts = useMemo(() => {
    const c = { all: photos.length, image: 0, video: 0, portrait: 0 };
    for (const p of photos) c[p.kind || 'image'] += 1;
    return c;
  }, [photos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return photos.filter((p) => {
      if (kindFilter !== 'all' && (p.kind || 'image') !== kindFilter) return false;
      if (publicOnly && !p.isPublic) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [photos, query, publicOnly, kindFilter]);

  const assign = useCallback(
    async (photo: ElPhoto) => {
      setBusy(true);
      await onAssign(photo);
      setBusy(false);
      setPreview(null);
    },
    [onAssign],
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[10000] bg-black/80 flex items-start justify-center p-3 sm:p-6 overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background text-foreground w-full max-w-5xl rounded-2xl p-5 my-4 cursor-default"
      >
        <header className="flex flex-wrap items-center gap-2 mb-4">
          <h2 className="text-base font-semibold">Empathy Ledger → Area {areaLabel}</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} photos</span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg border border-border px-3 py-1.5 text-sm hover:border-foreground transition"
          >
            Done
          </button>
        </header>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {([
            ['all', 'All'],
            ['image', 'Photos'],
            ['video', 'Videos'],
            ['portrait', 'Faces'],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              className={
                'rounded-full border px-3 py-1.5 text-xs font-medium transition ' +
                (kindFilter === k
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:border-foreground')
              }
            >
              {label} <span className="opacity-70">{kindCounts[k]}</span>
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search title / tag / place"
            className="flex-1 min-w-[180px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={publicOnly}
              onChange={(e) => setPublicOnly(e.target.checked)}
            />
            Public-cleared only
          </label>
        </div>

        <div className="grid max-h-[64vh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-5">
          {filtered.map((p) => {
            const b = elBadge(p);
            const pinned = pinnedIds.has(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPreview(p)}
                title="Click to preview, then assign"
                className={
                  'group relative overflow-hidden rounded-lg border text-left hover:border-foreground ' +
                  (pinned ? 'border-blue-400 ring-2 ring-blue-100' : 'border-border')
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={elProxy(p.thumb)}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-square w-full bg-muted object-cover"
                />
                {p.kind === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl text-white/90 drop-shadow">▶</span>
                )}
                <span className={'absolute left-1 top-1 rounded px-1.5 py-0.5 text-[9px] font-semibold ' + b.cls}>
                  {p.kind === 'portrait' ? 'RED · face' : b.text}
                </span>
                {pinned && (
                  <span className="absolute right-1 top-1 rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                    pinned
                  </span>
                )}
                <span className="block truncate px-1.5 py-1 text-[10px] text-muted-foreground">
                  {p.title || p.location || p.id.slice(0, 8)}
                </span>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full p-6 text-center text-sm text-muted-foreground">
              No EL photos match.
            </p>
          )}
        </div>
      </div>

      {/* Full-size preview + assign */}
      {preview && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/85 p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={elProxy(preview.kind === 'video' ? preview.thumb : preview.url)}
              alt={preview.title}
              className="max-h-[68vh] w-full bg-black object-contain"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <span className={'rounded px-2 py-0.5 text-[11px] font-semibold ' + elBadge(preview).cls}>
                  {elBadge(preview).text}
                </span>
                <p className="mt-1 truncate text-sm font-medium">{preview.title || preview.id}</p>
                <p className="truncate text-xs text-muted-foreground">{preview.tags.join('  ·  ')}</p>
                {!preview.isPublic && (
                  <p className="mt-1 text-[11px] text-amber-700">
                    Not public-cleared in EL — you hold the community-consent call before using it
                    externally.
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => assign(preview)}
                  disabled={busy || pinnedIds.has(preview.id)}
                  className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
                >
                  {pinnedIds.has(preview.id) ? 'Already pinned' : busy ? 'Pinning…' : `Pin to Area ${areaId}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadModal({
  areaNames,
  onUploaded,
  onClose,
}: {
  areaNames: Record<string, string>;
  onUploaded: (image: CanonImage) => void;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [caption, setCaption] = useState('');
  const [type, setType] = useState<CanonImage['type']>('photo');
  const [dataClass, setDataClass] = useState<CanonImage['dataClass']>('green');
  const [consentCleared, setConsentCleared] = useState(false);
  const [areas, setAreas] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const areaIds = useMemo(() => Object.keys(areaNames).sort(), [areaNames]);

  const pickFile = useCallback((f: File | null) => {
    setFile(f);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return f ? URL.createObjectURL(f) : null;
    });
  }, []);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const toggleArea = (id: string) =>
    setAreas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const canSubmit = !!file && subject.trim().length > 0 && areas.size > 0 && !busy;

  const submit = useCallback(async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('subject', subject.trim());
      fd.append('caption', caption.trim());
      fd.append('type', type);
      fd.append('dataClass', dataClass);
      fd.append('consentCleared', String(consentCleared));
      fd.append('areas', Array.from(areas).join(','));
      const res = await fetch('/api/admin/canon-upload', { method: 'POST', body: fd });
      const json = (await res.json()) as { ok: boolean; error?: string; image?: CanonImage };
      if (!json.ok || !json.image) throw new Error(json.error || 'upload failed');
      onUploaded(json.image);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  }, [file, subject, caption, type, dataClass, consentCleared, areas, onUploaded, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[10000] bg-black/80 flex items-start justify-center p-3 sm:p-6 overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background text-foreground w-full max-w-2xl rounded-2xl p-5 my-4 cursor-default"
      >
        <header className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold">Upload photo from desktop</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto text-xl leading-none text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </header>

        <p className="mb-4 rounded-md bg-muted px-3 py-2 text-[11px] text-muted-foreground">
          Adds to the local Goods canon (<code>v2/public/images/uploads</code> +{' '}
          <code>image-canon.json</code>). It does not write to Empathy Ledger — that is a separate,
          consent-gated step.
        </p>

        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          <div>
            <label className="block aspect-square w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-border hover:border-foreground transition">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-muted-foreground">
                  Click to choose an image
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {file && (
              <p className="mt-1 truncate text-[10px] text-muted-foreground">
                {file.name} · {(file.size / 1024).toFixed(0)} KB
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Subject *
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Bed delivery at Utopia"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Caption
              </label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="one-line caption"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-3">
              <label className="flex-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                Type
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as CanonImage['type'])}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
                >
                  <option value="photo">photo</option>
                  <option value="illustration">illustration</option>
                  <option value="chart">chart</option>
                  <option value="logo">logo</option>
                </select>
              </label>
              <label className="flex-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                Consent
                <select
                  value={dataClass}
                  onChange={(e) => setDataClass(e.target.value as CanonImage['dataClass'])}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
                >
                  <option value="green">green — public-safe</option>
                  <option value="red">red — consent-gated</option>
                </select>
              </label>
            </div>
            {dataClass === 'red' && (
              <label className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-[11px] text-red-700">
                <input
                  type="checkbox"
                  checked={consentCleared}
                  onChange={(e) => setConsentCleared(e.target.checked)}
                  className="mt-0.5"
                />
                I confirm consent to publish this image (storyteller / community cleared).
              </label>
            )}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                QBE areas *
              </label>
              <div className="flex flex-wrap gap-1.5">
                {areaIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleArea(id)}
                    className={
                      'rounded-md border px-2 py-1 text-xs font-medium transition ' +
                      (areas.has(id)
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background text-muted-foreground border-border hover:border-foreground')
                    }
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-50"
          >
            {busy ? 'Uploading…' : 'Add to canon'}
          </button>
        </div>
      </div>
    </div>
  );
}
