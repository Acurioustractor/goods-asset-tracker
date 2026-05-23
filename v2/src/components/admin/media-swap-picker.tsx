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
}: {
  slug: string;
  overrideKey: string;
  currentUrl: string;
  tagQuery: string[];
  kind: 'photo' | 'video' | 'any';
  label?: string;
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
}) {
  const [open, setOpen] = useState(false);
  void EL_URL_HINT;
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={`ts-swap-overlay-btn ts-swap-pos-${position}`}
        title={`Swap this ${kind === 'video' ? 'video' : kind === 'photo' ? 'photo' : 'media'}`}
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
  onClose,
}: {
  slug: string;
  overrideKey: string;
  currentUrl: string;
  tagQuery: string[];
  kind: 'photo' | 'video' | 'any';
  onClose: () => void;
}) {
  const [items, setItems] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>(kind === 'any' ? 'all' : kind);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPickerItems(tagQuery, kind).then((rows) => {
      if (!cancelled) {
        setItems(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [tagQuery, kind]);

  const swap = useCallback(
    async (url: string | null) => {
      setSaving(true);
      try {
        const res = await fetch('/api/admin/field-note-override', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, key: overrideKey, value: url }),
        });
        if (res.ok) {
          // Refresh the page to show the swap
          window.location.reload();
        } else {
          alert(`Swap failed: ${(await res.json()).error}`);
        }
      } finally {
        setSaving(false);
      }
    },
    [slug, overrideKey]
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

        {kind === 'any' && (
          <div className="ts-swap-filters">
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

        {loading ? (
          <p className="ts-swap-modal-empty">Loading from Empathy Ledger…</p>
        ) : filtered.length === 0 ? (
          <p className="ts-swap-modal-empty">
            No {filter === 'all' ? 'media' : filter}s found with tags{' '}
            <code>{tagQuery.join(' + ')}</code>. Upload some at{' '}
            <a href="/admin/upload" target="_blank">/admin/upload</a>.
          </p>
        ) : (
          <div className="ts-swap-grid">
            {filtered.map((it) => {
              const isCurrent = it.url === currentUrl;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => !isCurrent && swap(it.url)}
                  disabled={saving || isCurrent}
                  className={`ts-swap-tile ${isCurrent ? 'is-current' : ''}`}
                  title={it.title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.thumb} alt={it.title} loading="lazy" />
                  {it.kind === 'video' && <span className="ts-swap-vbadge">▶</span>}
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
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        .ts-swap-filters button {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(245, 239, 226, 0.8);
          padding: 0.35rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
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
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.6rem;
        }
        .ts-swap-tile {
          position: relative;
          aspect-ratio: 3/2;
          border: 2px solid transparent;
          border-radius: 4px;
          overflow: hidden;
          padding: 0;
          cursor: pointer;
          background: #000;
        }
        .ts-swap-tile:hover {
          border-color: #d97706;
        }
        .ts-swap-tile.is-current {
          border-color: #10b981;
          cursor: default;
        }
        .ts-swap-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
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
