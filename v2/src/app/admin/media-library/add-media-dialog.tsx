'use client';

// The Media Room's "Add media" action. Absorbs the retired /admin/compassion
// page: a real file upload (to the production-media bucket via /api/admin/media-upload)
// that, when attached to a bed, writes the compassion_content row the recipient's
// /bed/[id] page reads. Two tabs — Add, and Recent bed content (the cross-bed
// management glance the old page carried).

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export type AssetOption = { unique_id: string; product: string | null; community: string | null };
export type RecentBedContent = {
  id: string;
  asset_id: string;
  content_type: 'photo' | 'video' | 'message';
  media_url: string | null;
  caption: string | null;
  created_at: string;
  sent_at: string | null;
  viewed_at: string | null;
  is_public: boolean | null;
};

type ContentType = 'photo' | 'video' | 'message';

export function AddMediaDialog({
  assets,
  recent,
}: {
  assets: AssetOption[];
  recent: RecentBedContent[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'add' | 'recent'>('add');

  const [assetQuery, setAssetQuery] = useState('');
  const [assetId, setAssetId] = useState('');
  const [contentType, setContentType] = useState<ContentType>('photo');
  const [caption, setCaption] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredAssets = useMemo(() => {
    const q = assetQuery.trim().toLowerCase();
    const list = q
      ? assets.filter(
          (a) =>
            a.unique_id.toLowerCase().includes(q) ||
            (a.community || '').toLowerCase().includes(q) ||
            (a.product || '').toLowerCase().includes(q),
        )
      : assets;
    return list.slice(0, 200);
  }, [assets, assetQuery]);

  const selectedAsset = useMemo(
    () => (assetId ? assets.find((a) => a.unique_id === assetId) ?? null : null),
    [assets, assetId],
  );

  function reset() {
    setAssetId('');
    setAssetQuery('');
    setContentType('photo');
    setCaption('');
    setIsPublic(true);
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  function onPickFile(f: File | null) {
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f && f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
    // Infer type from the file so the picker is one step.
    if (f) setContentType(f.type.startsWith('video/') ? 'video' : 'photo');
  }

  async function submit() {
    setError(null);
    if (!assetId) {
      setError('Pick the bed / asset this is for.');
      return;
    }
    if (contentType !== 'message' && !file) {
      setError('Choose a photo or video file.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set('asset_id', assetId);
      fd.set('content_type', contentType);
      fd.set('caption', caption);
      fd.set('is_public', isPublic ? 'true' : 'false');
      if (file) fd.set('file', file);
      const res = await fetch('/api/admin/media-upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setSuccess(true);
      reset();
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-1.5">
        <span className="text-base leading-none">＋</span> Add media
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                  Add media
                </h2>
                <p className="text-xs text-muted-foreground">
                  Upload a photo, video or message for a bed. It shows on that recipient&apos;s bed page.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                ✕
              </button>
            </header>

            <div className="flex gap-1 border-b px-5 pt-3">
              {(['add', 'recent'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-t-lg px-3 py-1.5 text-sm ${
                    tab === t
                      ? 'border border-b-0 bg-background font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t === 'add' ? 'Add' : `Recent bed content (${recent.length})`}
                </button>
              ))}
            </div>

            {tab === 'add' ? (
              <div className="space-y-4 p-5">
                {success && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    Added. It is now on the bed page.
                  </div>
                )}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Bed / asset typeahead — hundreds of assets, so type to narrow then click. */}
                <div className="space-y-1.5">
                  <Label>Bed / asset</Label>
                  {selectedAsset ? (
                    <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/50 p-2 text-sm">
                      <span className="min-w-0 truncate">
                        <span className="font-medium">{selectedAsset.unique_id}</span>{' '}
                        <span className="text-muted-foreground">
                          — {selectedAsset.product || '?'} ({selectedAsset.community || 'unknown'})
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAssetId('');
                          setAssetQuery('');
                        }}
                        className="shrink-0 text-xs text-muted-foreground underline hover:text-foreground"
                      >
                        change
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={assetQuery}
                        onChange={(e) => setAssetQuery(e.target.value)}
                        placeholder="Type a bed ID, community or product..."
                        className="w-full rounded-md border bg-background p-2 text-sm"
                        autoComplete="off"
                      />
                      {assetQuery.trim() && (
                        <div className="max-h-44 overflow-y-auto rounded-md border">
                          {filteredAssets.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-muted-foreground">No match.</p>
                          ) : (
                            filteredAssets.map((a) => (
                              <button
                                type="button"
                                key={a.unique_id}
                                onClick={() => setAssetId(a.unique_id)}
                                className="block w-full border-b px-3 py-1.5 text-left text-sm last:border-0 hover:bg-muted"
                              >
                                <span className="font-medium">{a.unique_id}</span>{' '}
                                <span className="text-muted-foreground">
                                  — {a.product || '?'} ({a.community || 'unknown'})
                                </span>
                              </button>
                            ))
                          )}
                          {filteredAssets.length === 200 && (
                            <p className="px-3 py-1.5 text-[11px] text-muted-foreground">
                              Showing first 200. Keep typing to narrow.
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as ContentType)}
                      className="w-full rounded-md border bg-background p-2 text-sm"
                    >
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                      <option value="message">Message (text only)</option>
                    </select>
                  </div>
                  {contentType !== 'message' && (
                    <div className="space-y-1.5">
                      <Label>File</Label>
                      <input
                        ref={fileRef}
                        type="file"
                        accept={contentType === 'video' ? 'video/*' : 'image/*'}
                        onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                        className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                      />
                    </div>
                  )}
                </div>

                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="preview" className="max-h-48 rounded-lg border object-contain" />
                )}

                <div className="space-y-1.5">
                  <Label>Caption</Label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={2}
                    placeholder="A short note for the recipient (optional)."
                    className="w-full rounded-md border bg-background p-2 text-sm"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                  Show on the recipient&apos;s public bed page
                </label>

                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={submit} disabled={loading}>
                    {loading ? 'Uploading...' : 'Add media'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-h-[60vh] space-y-2 overflow-y-auto p-5">
                {recent.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No bed content yet.</p>
                ) : (
                  recent.map((r) => (
                    <a
                      key={r.id}
                      href={`/bed/${r.asset_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-lg border p-2.5 text-sm hover:border-primary/50"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-lg">
                        {r.content_type === 'photo' && r.media_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.media_url} alt="" className="h-full w-full object-cover" />
                        ) : r.content_type === 'video' ? (
                          '🎥'
                        ) : (
                          '💬'
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{r.asset_id}</span>
                        {r.caption && <span className="block truncate text-muted-foreground">{r.caption}</span>}
                        <span className="mt-0.5 block text-[11px] text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1">
                        {r.is_public === false && <Badge variant="outline" className="text-[10px]">Private</Badge>}
                        {r.sent_at && <Badge variant="outline" className="text-[10px]">Sent</Badge>}
                        {r.viewed_at && (
                          <Badge variant="outline" className="bg-emerald-50 text-[10px]">Viewed</Badge>
                        )}
                      </span>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
