'use client';

import { useEffect, useState, useCallback } from 'react';

// In-place media swap picker. Mounts a hover overlay on any image or
// video in the field-note (admin mode only). Click the overlay → modal
// opens showing all EL photos + videos for this trip; click a thumb to
// swap. Writes to v2/data/field-note-overrides.json via the API route.
//
// Usage: wrap any media element with <MediaSwapZone>:
//
//   <MediaSwapZone slug="utopia-may-2026" overrideKey="0.media.image"
//                  currentUrl={url} kind="photo">
//     <img src={url} ... />
//   </MediaSwapZone>

interface ElRow {
  id: string;
  title: string | null;
  media_url: string | null;
  story_image_url: string | null;
  tags: string[] | null;
  story_type: string | null;
}

interface PickerItem {
  id: string;
  thumb: string;     // poster URL for display
  url: string;       // the URL we write to the override
  title: string;
  kind: 'photo' | 'video';
}

const EL_URL_HINT = process.env.NEXT_PUBLIC_EL_URL || ''; // not strictly required

async function fetchPickerItems(
  tagQuery: string[],
  kind: 'photo' | 'video' | 'any'
): Promise<PickerItem[]> {
  const params = new URLSearchParams();
  for (const t of tagQuery) params.append('tag', t);
  params.set('kind', kind);
  const res = await fetch(`/api/admin/field-note-override/list?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

/**
 * A "folder" preset for the swap modal. Pass an array of these to
 * `folders=` and the modal renders them as a chip row at the top so the
 * user can jump between curated tag sets (e.g. "Utopia delivery",
 * "Alice build", "Recent uploads") without having to know the tag
 * scheme. Each folder is just a label + a tag query.
 */
export interface SwapFolder {
  label: string;
  emoji?: string;
  /** Tag query applied with PostgREST cs.{} (AND across all entries). Empty array = no tag filter / show everything recent. */
  tags: string[];
}

// Corner overlay button. Renders an absolutely-positioned "swap"
// pill on top of whatever section it sits inside (parent should be
// position:relative). Click → picker modal. Designed to be drop-in
// next to a Bg or media element without disturbing its layout.
export function MediaSwapZone({
  slug,
  overrideKey,
  currentUrl,
  tagQuery,
  kind,
  label,
  position = 'top-right',
  broadTag = 'trip:may-2026',
  folders,
  compoundFields,
  smartMediaRoute,
}: {
  slug: string;
  overrideKey: string;
  currentUrl: string;
  tagQuery: string[];
  kind: 'photo' | 'video' | 'any';
  label?: string;
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  // Broader fallback query the modal's "All trip media" toggle uses.
  broadTag?: string;
  /**
   * Folder presets. When provided, replaces the binary slot/broad toggle
   * with a chip-row of named folders. Click any chip to refilter. The
   * first folder is selected on open.
   */
  folders?: SwapFolder[];
  // When set, picking a video writes multiple override keys at once
  // (e.g. src + poster + title for an el-video-gallery slot). Each entry
  // maps the picker-item field to the override-key suffix appended to
  // `overrideKey`. E.g. { src: 'src', poster: 'poster', title: 'title' }
  // with overrideKey="5.items.0" writes "5.items.0.src", "5.items.0.poster",
  // "5.items.0.title".
  compoundFields?: Record<string, string>;
  // For full-bleed sections (masthead / immersive / read overlay / close)
  // where the section can be EITHER a photo OR a video overlay. When set,
  // the modal routes the picked item by kind:
  //  - Photo pick → writes `{base}.image`, clears video fields.
  //  - Video pick → writes `{base}.videoDesktop`, `{base}.videoMobile`,
  //    `{base}.poster`, clears image override.
  // `overrideKey` should end in `.image` and `base` is derived by stripping
  // that suffix. Pass `kind="any"` so the picker shows both photo and video.
  smartMediaRoute?: boolean;
}) {
  const [open, setOpen] = useState(false);
  void EL_URL_HINT;
  const posMap: Record<string, React.CSSProperties> = {
    'top-right': { top: '1rem', right: '1rem' },
    'top-left': { top: '1rem', left: '1rem' },
    'bottom-right': { bottom: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
  };
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        title={`Swap this ${kind === 'video' ? 'video' : kind === 'photo' ? 'photo' : 'media'}`}
        style={{
          position: 'absolute',
          zIndex: 60,
          background: 'rgba(217, 119, 6, 0.95)',
          color: 'white',
          padding: '0.4rem 0.75rem',
          borderRadius: 4,
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 700,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          ...posMap[position],
        }}
      >
        ⇄ {label || 'swap'}
      </button>
      {open && (
        <MediaSwapModal
          slug={slug}
          overrideKey={overrideKey}
          currentUrl={currentUrl}
          tagQuery={tagQuery}
          kind={kind}
          broadTag={broadTag}
          folders={folders}
          compoundFields={compoundFields}
          smartMediaRoute={smartMediaRoute}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function MediaSwapModal({
  slug,
  overrideKey,
  currentUrl,
  tagQuery,
  kind,
  broadTag,
  folders,
  compoundFields,
  smartMediaRoute,
  onClose,
}: {
  slug: string;
  overrideKey: string;
  currentUrl: string;
  tagQuery: string[];
  kind: 'photo' | 'video' | 'any';
  broadTag: string;
  folders?: SwapFolder[];
  compoundFields?: Record<string, string>;
  smartMediaRoute?: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>(kind === 'any' ? 'all' : kind);
  // When `folders` is provided, scope is the folder index (number).
  // Otherwise we keep the old binary 'filtered' | 'broad' behaviour.
  const usingFolders = !!folders && folders.length > 0;
  const [scope, setScope] = useState<'filtered' | 'broad'>('filtered');
  const [folderIdx, setFolderIdx] = useState<number>(0);

  // Active query depends on the picker mode. Folders mode uses the
  // selected folder's tags. Binary mode uses slot-tags vs broad-tag.
  const activeQuery: string[] = usingFolders
    ? (folders![folderIdx]?.tags ?? [])
    : (scope === 'filtered' ? tagQuery : [broadTag]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPickerItems(activeQuery, kind).then((rows) => {
      if (!cancelled) {
        setItems(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usingFolders, folderIdx, scope, tagQuery.join('|'), kind]);

  const swap = useCallback(
    async (picked: PickerItem | null) => {
      setSaving(true);
      try {
        // Build payload: single-key (legacy), compound, OR smart-routed.
        const payload: {
          slug: string;
          key?: string;
          value?: string | null;
          updates?: { key: string; value: string | null }[];
        } = { slug };
        if (smartMediaRoute) {
          // Full-bleed section that can be photo or video. overrideKey
          // ends in `.image`; we derive the parent base for video fields.
          const base = overrideKey.replace(/\.image$/, '');
          if (!picked) {
            // Reset: clear every media-* override on this section.
            payload.updates = [
              { key: `${base}.image`, value: null },
              { key: `${base}.videoDesktop`, value: null },
              { key: `${base}.videoMobile`, value: null },
              { key: `${base}.poster`, value: null },
            ];
          } else if (picked.kind === 'video') {
            payload.updates = [
              // Set videoDesktop + videoMobile so Bg renders the video.
              { key: `${base}.videoDesktop`, value: picked.url },
              { key: `${base}.videoMobile`, value: picked.url },
              // Use the EL thumb as poster so the loading frame matches.
              { key: `${base}.poster`, value: picked.thumb || null },
              // Clear the image override so it falls back to source data.
              { key: `${base}.image`, value: null },
            ];
          } else {
            // Photo pick. Set image; clear any prior video override.
            payload.updates = [
              { key: `${base}.image`, value: picked.url },
              { key: `${base}.videoDesktop`, value: null },
              { key: `${base}.videoMobile`, value: null },
              { key: `${base}.poster`, value: null },
            ];
          }
        } else if (compoundFields && picked) {
          const updates: { key: string; value: string | null }[] = [];
          for (const [pickerField, overrideSuffix] of Object.entries(compoundFields)) {
            const value = (picked as unknown as Record<string, unknown>)[pickerField];
            updates.push({
              key: `${overrideKey}.${overrideSuffix}`,
              value: typeof value === 'string' ? value : null,
            });
          }
          payload.updates = updates;
        } else if (compoundFields && picked === null) {
          // Reset: clear all compound keys for this slot.
          const updates = Object.values(compoundFields).map((suffix) => ({
            key: `${overrideKey}.${suffix}`,
            value: null as string | null,
          }));
          payload.updates = updates;
        } else {
          payload.key = overrideKey;
          payload.value = picked ? picked.url : null;
        }
        const res = await fetch('/api/admin/field-note-override', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          window.location.reload();
        } else {
          alert(`Swap failed: ${(await res.json()).error}`);
        }
      } finally {
        setSaving(false);
      }
    },
    [slug, overrideKey, compoundFields, smartMediaRoute]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const filtered = filter === 'all' ? items : items.filter((it) => it.kind === filter);

  return (
    <div className="ts-swap-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="ts-swap-modal-box" onClick={(e) => e.stopPropagation()}>
        <header className="ts-swap-modal-head">
          <div>
            <h2>Swap media</h2>
            <p className="ts-swap-modal-sub">
              Pick a photo or video from EL to put in this slot.{' '}
              <code className="ts-swap-modal-key">{overrideKey}</code> ·{' '}
              {tagQuery.length} tag{tagQuery.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="ts-swap-modal-actions">
            <button
              type="button"
              onClick={() => swap(null)}
              disabled={saving}
              className="ts-swap-revert"
              title="Restore the original value from trip-stories.ts"
            >
              ↺ reset
            </button>
            <button type="button" onClick={onClose} aria-label="Close">×</button>
          </div>
        </header>

        <div className="ts-swap-filters">
          {usingFolders ? (
            <div className="ts-swap-folders">
              {folders!.map((f, i) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setFolderIdx(i)}
                  className={folderIdx === i ? 'is-active' : ''}
                  title={f.tags.length === 0 ? 'No tag filter — all recent uploads' : f.tags.join(' + ')}
                >
                  {f.emoji ? <span style={{ marginRight: 6 }}>{f.emoji}</span> : null}
                  {f.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="ts-swap-scope">
              <button
                type="button"
                onClick={() => setScope('filtered')}
                className={scope === 'filtered' ? 'is-active' : ''}
                title={`Show only media matching this slot's tags (${tagQuery.join(' + ')})`}
              >
                ⊟ slot tags
              </button>
              <button
                type="button"
                onClick={() => setScope('broad')}
                className={scope === 'broad' ? 'is-active' : ''}
                title={`Show all media from ${broadTag}`}
              >
                ⊞ all trip media
              </button>
            </div>
          )}
          {kind === 'any' && (
            <div className="ts-swap-typefilter">
              {(['all', 'photo', 'video'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={filter === f ? 'is-active' : ''}
                >
                  {f === 'all' ? 'All' : f === 'photo' ? '📷 Photos' : '🎬 Videos'}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p className="ts-swap-modal-empty">Loading from Empathy Ledger…</p>
        ) : filtered.length === 0 ? (
          <p className="ts-swap-modal-empty">
            No {filter === 'all' ? 'media' : filter}s found with tags{' '}
            <code>{activeQuery.join(' + ')}</code>.{' '}
            {scope === 'filtered' ? (
              <>Try the <b>⊞ all trip media</b> toggle, or </>
            ) : null}
            upload at <a href="/admin/upload" target="_blank">/admin/upload</a>.
          </p>
        ) : (
          <div className="ts-swap-grid">
            {filtered.map((it) => {
              const isCurrent = it.url === currentUrl;
              const hasThumb = !!it.thumb;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => !isCurrent && swap(it)}
                  disabled={saving || isCurrent}
                  className={`ts-swap-tile ${isCurrent ? 'is-current' : ''}`}
                  title={it.title}
                >
                  {hasThumb ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={it.thumb} alt={it.title} loading="lazy" />
                  ) : it.kind === 'video' ? (
                    // No poster generated in EL — load the video itself at
                    // `metadata` preload so the browser pulls the first frame
                    // and uses it as the natural poster. Muted + no controls
                    // so it stays inert in the grid.
                    <video
                      src={it.url}
                      preload="metadata"
                      muted
                      playsInline
                      onLoadedMetadata={(e) => {
                        // Seek to ~0.1s so the first frame shows reliably
                        // (some codecs render a black frame at exactly 0).
                        const v = e.currentTarget;
                        if (v.duration > 0.5) v.currentTime = 0.1;
                      }}
                    />
                  ) : (
                    <span className="ts-swap-tile-fallback">{it.title}</span>
                  )}
                  {it.kind === 'video' && <span className="ts-swap-vbadge">▶</span>}
                  <span className="ts-swap-tile-title">{it.title}</span>
                  {isCurrent && <span className="ts-swap-curbadge">current</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        .ts-swap-overlay-btn {
          position: absolute;
          z-index: 60;
          background: rgba(217, 119, 6, 0.95);
          color: white;
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        .ts-swap-overlay-btn:hover {
          background: rgb(217, 119, 6);
          transform: translateY(-1px);
        }
        .ts-swap-pos-top-right {
          top: 1rem;
          right: 1rem;
        }
        .ts-swap-pos-top-left {
          top: 1rem;
          left: 1rem;
        }
        .ts-swap-pos-bottom-right {
          bottom: 1rem;
          right: 1rem;
        }
        .ts-swap-pos-bottom-left {
          bottom: 1rem;
          left: 1rem;
        }
        .ts-swap-modal {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(8, 7, 5, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3vh 3vw;
        }
        .ts-swap-modal-box {
          background: #18130c;
          color: #f5efe2;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          width: min(1200px, 100%);
          max-height: 94vh;
          overflow-y: auto;
          padding: 1.5rem;
        }
        .ts-swap-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 1rem;
        }
        .ts-swap-modal-head h2 {
          font-size: 1.4rem;
          font-weight: 600;
          margin: 0;
        }
        .ts-swap-modal-sub {
          margin: 0.4rem 0 0;
          font-size: 12px;
          color: rgba(245, 239, 226, 0.6);
        }
        .ts-swap-modal-key {
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 6px;
          border-radius: 3px;
        }
        .ts-swap-modal-actions {
          display: flex;
          gap: 0.5rem;
        }
        .ts-swap-modal-actions button {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f5efe2;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        }
        .ts-swap-modal-actions button:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .ts-swap-revert {
          font-size: 12px !important;
        }
        .ts-swap-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 1rem;
        }
        .ts-swap-scope,
        .ts-swap-typefilter {
          display: flex;
          gap: 0.3rem;
          padding: 3px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 5px;
        }
        .ts-swap-folders {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          padding: 3px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 5px;
          flex: 1 1 auto;
        }
        .ts-swap-filters button {
          background: transparent;
          border: 1px solid transparent;
          color: rgba(245, 239, 226, 0.7);
          padding: 0.35rem 0.7rem;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
        }
        .ts-swap-filters button:hover {
          color: rgba(245, 239, 226, 1);
          background: rgba(255, 255, 255, 0.05);
        }
        .ts-swap-filters button.is-active {
          background: #d97706;
          color: white;
          border-color: #d97706;
        }
        .ts-swap-modal-empty {
          padding: 2rem;
          text-align: center;
          color: rgba(245, 239, 226, 0.5);
          font-size: 13px;
        }
        .ts-swap-modal-empty a {
          color: #fbbf24;
        }
        .ts-swap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          grid-auto-rows: 165px;
          gap: 12px;
        }
        .ts-swap-tile {
          position: relative;
          height: 165px;
          width: 100%;
          border: 2px solid transparent;
          border-radius: 6px;
          overflow: hidden;
          padding: 0;
          margin: 0;
          cursor: pointer;
          background: #000;
          display: block;
        }
        .ts-swap-tile:hover {
          border-color: #d97706;
        }
        .ts-swap-tile.is-current {
          border-color: #10b981;
          cursor: default;
        }
        .ts-swap-tile img,
        .ts-swap-tile video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: #000;
        }
        .ts-swap-tile-fallback {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          padding: 0.6rem;
          font-size: 11px;
          color: rgba(245, 239, 226, 0.7);
          text-align: center;
          background: rgba(255, 255, 255, 0.05);
        }
        .ts-swap-tile-title {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 4px 6px;
          font-size: 10px;
          color: white;
          background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0));
          text-align: left;
          line-height: 1.2;
          letter-spacing: 0.02em;
          pointer-events: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ts-swap-vbadge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.4rem 0.7rem;
          border-radius: 50%;
          font-size: 14px;
          pointer-events: none;
        }
        .ts-swap-curbadge {
          position: absolute;
          top: 4px;
          left: 4px;
          background: #10b981;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 700;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

/**
 * "+ add photo" button for the manual-gallery block. Opens a picker that
 * shows all EL photos tagged for the trip; clicking a photo appends its
 * ID to the block's `_photoIds` comma-separated override and reloads.
 */
export function AddPhotoToManualGallery({
  slug,
  blockIndex,
  currentIds,
  broadTag = 'trip:may-2026',
}: {
  slug: string;
  blockIndex: number;
  currentIds: string[];
  broadTag?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ts-mg-add"
        title="Add a photo from EL"
      >
        + add photo
      </button>
      {open && (
        <AddPhotoModal
          slug={slug}
          blockIndex={blockIndex}
          currentIds={currentIds}
          broadTag={broadTag}
          onClose={() => setOpen(false)}
        />
      )}
      <style jsx>{`
        .ts-mg-add {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(217, 119, 6, 0.95);
          color: white;
          border: 0;
          padding: 10px 18px;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          margin: 1.4rem auto 0;
        }
        .ts-mg-add:hover {
          background: rgba(217, 119, 6, 1);
        }
      `}</style>
    </>
  );
}

function AddPhotoModal({
  slug,
  blockIndex,
  currentIds,
  broadTag,
  onClose,
}: {
  slug: string;
  blockIndex: number;
  currentIds: string[];
  broadTag: string;
  onClose: () => void;
}) {
  const [items, setItems] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  // Multi-select: tick photos as you scroll, then hit Add to commit
  // everything at once. Saves the open-pick-reload-reopen loop.
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const toggleId = useCallback((id: string) => {
    setPendingIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPickerItems([broadTag], 'any').then((rows) => {
      if (!cancelled) {
        setItems(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [broadTag]);

  const commitAdd = useCallback(async () => {
    if (pendingIds.length === 0) return;
    setSaving(true);
    try {
      // Preserve current gallery order; append new picks in selection order.
      const merged = [...currentIds];
      for (const id of pendingIds) {
        if (!merged.includes(id)) merged.push(id);
      }
      const res = await fetch('/api/admin/field-note-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          key: `${blockIndex}._photoIds`,
          value: merged.join(','),
        }),
      });
      if (res.ok) window.location.reload();
      else alert(`Add failed: ${(await res.json()).error}`);
    } finally {
      setSaving(false);
    }
  }, [slug, blockIndex, currentIds, pendingIds]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const currentSet = new Set(currentIds);
  const visible = items
    .filter((it) => !currentSet.has(it.id))
    .filter((it) => filter === 'all' || it.kind === filter);

  return (
    <div className="ts-mg-modal" onClick={onClose}>
      <div className="ts-mg-modal-inner" onClick={(e) => e.stopPropagation()}>
        <div className="ts-mg-modal-head">
          <h3>Add to this gallery</h3>
          <button type="button" onClick={onClose} className="ts-mg-modal-close">×</button>
        </div>
        <div className="ts-mg-modal-toolbar">
          {(['all', 'photo', 'video'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`ts-mg-filter ${filter === f ? 'is-active' : ''}`}
            >
              {f === 'all' ? 'All' : f === 'photo' ? '📷 Photos' : '🎬 Videos'}
            </button>
          ))}
        </div>
        <p className="ts-mg-modal-sub">
          {loading
            ? 'Loading media tagged trip:may-2026…'
            : `${visible.length} ${filter === 'all' ? 'item' : filter}${visible.length === 1 ? '' : 's'} available · ${currentIds.length} already in this gallery · ${pendingIds.length} selected`}
        </p>
        <div className="ts-mg-grid">
          {visible.map((it) => {
            const isSelected = pendingIds.includes(it.id);
            return (
            <button
              key={it.id}
              type="button"
              className={`ts-mg-tile ${isSelected ? 'is-selected' : ''}`}
              onClick={() => toggleId(it.id)}
              disabled={saving}
              title={it.title}
            >
              {it.thumb ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={it.thumb} alt={it.title} />
              ) : it.kind === 'video' ? (
                // No EL-side poster: pull the first-frame as fallback so
                // videos appear in the grid instead of as black boxes.
                <video src={it.url} preload="metadata" muted playsInline />
              ) : (
                <span className="ts-mg-tile-empty">{it.title}</span>
              )}
              {it.kind === 'video' && <span className="ts-mg-vbadge">▶</span>}
              {isSelected && <span className="ts-mg-check">✓</span>}
              <span className="ts-mg-tile-title">{it.title}</span>
            </button>
            );
          })}
        </div>
        {pendingIds.length > 0 && (
          <div className="ts-mg-modal-footer">
            <button
              type="button"
              className="ts-mg-clear"
              onClick={() => setPendingIds([])}
              disabled={saving}
            >
              clear selection
            </button>
            <button
              type="button"
              className="ts-mg-commit"
              onClick={commitAdd}
              disabled={saving}
            >
              {saving ? 'Adding…' : `Add ${pendingIds.length} to gallery`}
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .ts-mg-modal {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4vh 4vw;
        }
        .ts-mg-modal-inner {
          background: #15110c;
          color: #f4ede1;
          border: 1px solid rgba(244, 237, 225, 0.18);
          border-radius: 12px;
          width: 100%;
          max-width: 1100px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .ts-mg-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.4rem;
          border-bottom: 1px solid rgba(244, 237, 225, 0.12);
        }
        .ts-mg-modal-head h3 {
          font-family: Georgia, serif;
          font-size: 1.2rem;
          margin: 0;
        }
        .ts-mg-modal-close {
          background: rgba(244, 237, 225, 0.08);
          color: #f4ede1;
          border: 1px solid rgba(244, 237, 225, 0.18);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
        }
        .ts-mg-modal-sub {
          padding: 0.6rem 1.4rem;
          color: rgba(244, 237, 225, 0.6);
          font-size: 12px;
          letter-spacing: 0.04em;
        }
        .ts-mg-grid {
          padding: 0.5rem 1.4rem 1.4rem;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          grid-auto-rows: 200px;
          gap: 14px;
        }
        .ts-mg-tile {
          position: relative;
          border: 0;
          padding: 0;
          margin: 0;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          display: block;
          width: 100%;
          height: 200px;
        }
        .ts-mg-tile:hover {
          outline: 2px solid rgba(217, 119, 6, 0.9);
          transform: translateY(-1px);
        }
        .ts-mg-tile.is-selected {
          outline: 3px solid rgba(16, 185, 129, 0.95);
        }
        .ts-mg-check {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.95);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          pointer-events: none;
        }
        .ts-mg-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 1rem 1.4rem;
          border-top: 1px solid rgba(244, 237, 225, 0.12);
          background: rgba(15, 17, 12, 0.95);
        }
        .ts-mg-clear {
          background: none;
          color: rgba(244, 237, 225, 0.6);
          border: 1px solid rgba(244, 237, 225, 0.18);
          padding: 9px 16px;
          font-size: 11.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-radius: 999px;
          cursor: pointer;
        }
        .ts-mg-clear:hover {
          color: white;
          border-color: rgba(244, 237, 225, 0.32);
        }
        .ts-mg-commit {
          background: rgba(217, 119, 6, 0.95);
          color: white;
          border: 0;
          padding: 11px 22px;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
          border-radius: 999px;
          cursor: pointer;
        }
        .ts-mg-commit:hover {
          background: rgba(217, 119, 6, 1);
        }
        .ts-mg-commit:disabled {
          opacity: 0.5;
          cursor: wait;
        }
        .ts-mg-tile img,
        .ts-mg-tile video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          margin: 0;
        }
        .ts-mg-tile-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          padding: 1rem;
          font-size: 11px;
          color: rgba(244, 237, 225, 0.5);
          text-align: center;
        }
        .ts-mg-vbadge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.65);
          color: white;
          padding: 0.5rem 0.85rem;
          border-radius: 50%;
          font-size: 16px;
          pointer-events: none;
        }
        .ts-mg-modal-toolbar {
          display: flex;
          gap: 6px;
          padding: 0.4rem 1.4rem 0;
        }
        .ts-mg-filter {
          background: rgba(244, 237, 225, 0.06);
          color: rgba(244, 237, 225, 0.7);
          border: 1px solid rgba(244, 237, 225, 0.12);
          padding: 6px 14px;
          font-size: 11.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 600;
          border-radius: 999px;
          cursor: pointer;
        }
        .ts-mg-filter:hover {
          background: rgba(244, 237, 225, 0.1);
          color: rgba(244, 237, 225, 0.9);
        }
        .ts-mg-filter.is-active {
          background: rgba(217, 119, 6, 0.92);
          color: white;
          border-color: rgba(217, 119, 6, 1);
        }
        .ts-mg-tile-title {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 4px 6px;
          font-size: 10px;
          color: white;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0));
          text-align: left;
          line-height: 1.2;
          letter-spacing: 0.02em;
          pointer-events: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
