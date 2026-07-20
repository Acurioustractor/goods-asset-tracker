'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import ExifReader from 'exifreader';
import jsQR from 'jsqr';

// heic2any is a side-effecty browser-only lib — dynamic import keeps it out of
// the server bundle and out of the critical path for non-HEIC photos.
type Heic2Any = (opts: { blob: Blob; toType?: string; quality?: number }) => Promise<Blob | Blob[]>;
let _heic2any: Heic2Any | null = null;
async function getHeic2any(): Promise<Heic2Any> {
  if (_heic2any) return _heic2any;
  const mod = await import('heic2any');
  _heic2any = (mod.default || mod) as Heic2Any;
  return _heic2any;
}

function isHeic(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return type === 'image/heic' || type === 'image/heif' ||
         name.endsWith('.heic') || name.endsWith('.heif');
}

type Community = {
  id: string;
  name: string;
  state: string;
  status: string;
};

type PhotoEntry = {
  fileName: string;
  fileSize: number;
  previewUrl: string;
  uploadBlob: Blob;               // the file (or HEIC-converted JPEG) we'll upload
  uploadType: string;             // mime type of uploadBlob
  uniqueId: string | null;        // decoded from QR
  qrUrl: string | null;
  gps: { lat: number; lng: number } | null;
  capturedAt: string | null;      // ISO from EXIF
  decodeError: string | null;     // human-readable reason if QR didn't decode
  // user-editable per row:
  recipientName: string;
  recipientFromCaption: boolean;  // true if recipientName came from photo metadata
  placeOverride: string;
  communityOverride: string | null;  // null = use the batch-level community
  // submission state:
  status: 'pending' | 'saving' | 'saved' | 'error';
  errorMessage: string | null;
  uploadedPhotoUrl: string | null;
};

const STATUS_GROUP_LABEL: Record<string, string> = {
  active: 'Active deployments',
  testing: 'Testing',
  exploring: 'Exploring',
  prospect: 'Prospects',
  administrative: 'Admin / staging',
};
const STATUS_GROUP_ORDER = ['active', 'testing', 'exploring', 'prospect', 'administrative'];

const BED_QR_PATTERN = /\/bed\/([A-Za-z0-9_-]+)/;

async function decodePhoto(file: File): Promise<Partial<PhotoEntry>> {
  // Metadata extraction — ExifReader handles JPEG + iPhone HEIC reliably
  // (including iPhone 17 Pro's tmap HDR variant that exifr chokes on).
  //
  // Caption lookup order (iPhone Photos writes to Exif.ImageDescription
  // when a caption is added via "Add a Caption" in the Photos app):
  //   1. exif.ImageDescription   ← iPhone Photos caption
  //   2. iptc.Caption/Abstract   ← Lightroom + traditional caption field
  //   3. xmp.dc:description      ← macOS Preview "Edit Metadata"
  let gps: { lat: number; lng: number } | null = null;
  let capturedAt: string | null = null;
  let recipientGuess = '';
  try {
    const arrayBuffer = await file.arrayBuffer();
    const tags = ExifReader.load(arrayBuffer, { expanded: true });

    const lat = tags.gps?.Latitude;
    const lng = tags.gps?.Longitude;
    if (typeof lat === 'number' && typeof lng === 'number') {
      gps = { lat, lng };
    }

    // ExifReader returns date strings like "2026:05:20 11:33:46". Parse to ISO.
    // ExifReader's TS types are conservative; fall through any of the common
    // date tags via index access without tripping the typed-tag whitelist.
    const exifTags = tags.exif as Record<string, { description?: string } | undefined> | undefined;
    const takenStr = exifTags?.DateTimeOriginal?.description
      || exifTags?.DateTimeDigitized?.description
      || exifTags?.DateTime?.description;
    if (takenStr) {
      // EXIF date format: "YYYY:MM:DD HH:MM:SS" — convert to ISO
      const normalised = takenStr.replace(
        /^(\d{4}):(\d{2}):(\d{2})\s/,
        '$1-$2-$3T',
      );
      const d = new Date(normalised);
      if (!Number.isNaN(d.getTime())) capturedAt = d.toISOString();
    }

    // ExifReader's typing is loose, so we walk a few possible shapes
    const iptcTags = tags.iptc as Record<string, { description?: string } | undefined> | undefined;
    const xmpTags = tags.xmp as Record<string, { description?: string } | undefined> | undefined;
    const fileTags = tags.file as Record<string, { description?: string } | undefined> | undefined;
    const captionCandidates = [
      exifTags?.ImageDescription?.description,
      iptcTags?.['Caption/Abstract']?.description,
      xmpTags?.description?.description,
      xmpTags?.['dc:description']?.description,
      fileTags?.['Image Description']?.description,
    ].filter((c): c is string => typeof c === 'string' && c.trim().length > 0);
    if (captionCandidates.length > 0) {
      recipientGuess = captionCandidates[0].trim();
    }
  } catch {
    /* Metadata parse failure is fine — photo may still have a QR */
  }

  // For HEIC, convert to JPEG so the browser can decode pixels for jsQR AND
  // so we can later upload a format every backend understands.
  let decodeBlob: Blob = file;
  let uploadBlob: Blob = file;
  let uploadType: string = file.type || 'application/octet-stream';
  if (isHeic(file)) {
    try {
      const heic2any = await getHeic2any();
      const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 });
      const jpegBlob = Array.isArray(result) ? result[0] : result;
      decodeBlob = jpegBlob;
      uploadBlob = jpegBlob;
      uploadType = 'image/jpeg';
    } catch (e) {
      return {
        uploadBlob: file,
        uploadType,
        decodeError: `HEIC conversion failed: ${e instanceof Error ? e.message : 'unknown error'}`,
        gps,
        capturedAt,
        recipientName: recipientGuess,
      };
    }
  }

  // QR decode: render the (possibly converted) blob to a canvas, hand pixel
  // data to jsQR
  let uniqueId: string | null = null;
  let qrUrl: string | null = null;
  let decodeError: string | null = null;

  try {
    const imageBitmap = await createImageBitmap(decodeBlob).catch(() => null);
    if (!imageBitmap) {
      decodeError = 'Could not load image';
    } else {
      // Downscale large photos to ~1600px on the long edge — speeds decode + uses
      // less memory. jsQR is happy at lower resolutions as long as the QR is sharp.
      const maxEdge = 1600;
      const scale = Math.min(1, maxEdge / Math.max(imageBitmap.width, imageBitmap.height));
      const w = Math.round(imageBitmap.width * scale);
      const h = Math.round(imageBitmap.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        decodeError = 'Canvas context unavailable in this browser';
      } else {
        ctx.drawImage(imageBitmap, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const result = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
        if (result?.data) {
          qrUrl = result.data;
          const match = result.data.match(BED_QR_PATTERN);
          if (match) {
            uniqueId = match[1];
          } else {
            decodeError = `QR decoded but didn't match a bed URL: ${result.data.slice(0, 60)}`;
          }
        } else {
          decodeError = 'No QR detected in this photo';
        }
      }
      imageBitmap.close?.();
    }
  } catch (e) {
    decodeError = e instanceof Error ? e.message : 'Unknown decode error';
  }

  return {
    gps, capturedAt, uniqueId, qrUrl, decodeError, uploadBlob, uploadType,
    recipientName: recipientGuess,
  };
}

export function BulkInstallClient({ communities }: { communities: Community[] }) {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [batchCommunityId, setBatchCommunityId] = useState('');
  const [batchPlace, setBatchPlace] = useState('');
  const [processing, setProcessing] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const groupedCommunities = useMemo(() => {
    const map = new Map<string, Community[]>();
    for (const c of communities) {
      if (!map.has(c.status)) map.set(c.status, []);
      map.get(c.status)!.push(c);
    }
    return map;
  }, [communities]);

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProcessing(true);

    const fileArray = Array.from(files);
    const newEntries: PhotoEntry[] = fileArray.map((f) => ({
      fileName: f.name,
      fileSize: f.size,
      previewUrl: isHeic(f) ? '' : URL.createObjectURL(f),  // HEIC preview waits for conversion
      uploadBlob: f,
      uploadType: f.type || 'application/octet-stream',
      uniqueId: null,
      qrUrl: null,
      gps: null,
      capturedAt: null,
      decodeError: null,
      recipientName: '',
      recipientFromCaption: false,
      placeOverride: '',
      communityOverride: null,
      status: 'pending',
      errorMessage: null,
      uploadedPhotoUrl: null,
    }));

    setPhotos((prev) => [...prev, ...newEntries]);

    // Decode photos in parallel, up to 4 at a time, to keep the UI responsive.
    const concurrency = 4;
    let cursor = 0;
    const worker = async () => {
      while (cursor < fileArray.length) {
        const idx = cursor++;
        const decoded = await decodePhoto(fileArray[idx]);
        setPhotos((prev) => {
          const copy = [...prev];
          const targetIndex = copy.length - fileArray.length + idx;
          if (copy[targetIndex]) {
            // If we converted HEIC to JPEG, swap the preview URL so the thumbnail shows
            let previewUrl = copy[targetIndex].previewUrl;
            if (!previewUrl && decoded.uploadBlob) {
              previewUrl = URL.createObjectURL(decoded.uploadBlob);
            }
            // Don't clobber a manual recipient-name edit that happened while we
            // were still decoding. Only apply the caption-guess if the user
            // hasn't typed anything yet.
            const existing = copy[targetIndex];
            const userTyped = existing.recipientName.length > 0;
            const decodedName = decoded.recipientName ?? '';
            const recipientName = userTyped ? existing.recipientName : decodedName;
            const recipientFromCaption = !userTyped && decodedName.length > 0;
            copy[targetIndex] = {
              ...existing,
              ...decoded,
              recipientName,
              recipientFromCaption,
              previewUrl,
            };
          }
          return copy;
        });
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));

    setProcessing(false);
  }, []);

  const updatePhoto = (index: number, patch: Partial<PhotoEntry>) => {
    setPhotos((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });
  };

  const validPhotos = photos.filter((p) => p.uniqueId !== null);
  const unmatchedPhotos = photos.filter((p) => p.uniqueId === null);

  const saveAll = async () => {
    if (validPhotos.length === 0) return;
    if (!batchCommunityId && !validPhotos.every((p) => p.communityOverride)) {
      alert('Pick a community for the batch (or for every photo individually).');
      return;
    }
    setSavingAll(true);

    // Save in parallel batches of 4 to be polite to the server
    const indices = photos
      .map((p, i) => (p.uniqueId ? i : -1))
      .filter((i) => i >= 0);

    const concurrency = 4;
    let cursor = 0;

    const worker = async () => {
      while (cursor < indices.length) {
        const idx = indices[cursor++];
        const photo = photos[idx];
        if (!photo || !photo.uniqueId) continue;

        updatePhoto(idx, { status: 'saving', errorMessage: null });

        const communityId = photo.communityOverride || batchCommunityId;
        const place = (photo.placeOverride || batchPlace).trim() || null;
        const gps = photo.gps ? `${photo.gps.lat.toFixed(6)},${photo.gps.lng.toFixed(6)}` : null;
        const recipientName = photo.recipientName.trim() || null;
        const dateStr = (photo.capturedAt || new Date().toISOString()).slice(0, 10);
        const stamp = `[${dateStr}] photo-install → ${communityId}${place ? ` / ${place}` : ''}${gps ? ` (gps ${gps})` : ''}${recipientName ? ` recipient: ${recipientName}` : ''}`;

        try {
          // 1. Upload photo first so we have the public URL to write onto the asset
          //    in the same PATCH (single audit-line stamp). install-photo endpoint
          //    also sets install_photo_url on the row as a safety net.
          let uploadedUrl: string | null = null;
          if (photo.uploadBlob) {
            const fd = new FormData();
            const ext = (photo.uploadType.split('/')[1] || 'jpg').replace(/[^a-z0-9]/g, '');
            fd.append('photo', photo.uploadBlob, `${photo.uniqueId}-install.${ext}`);
            const uploadRes = await fetch(
              `/api/admin/assets/${photo.uniqueId}/install-photo`,
              { method: 'POST', body: fd },
            );
            if (uploadRes.ok) {
              const j = await uploadRes.json().catch(() => ({}));
              uploadedUrl = j.url ?? null;
            }
            // Upload failure is non-fatal — still save the install record.
          }

          // 2. PATCH the asset with the install metadata
          const res = await fetch(`/api/admin/assets/${photo.uniqueId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              community_id: communityId,
              place,
              gps,
              status: 'deployed',
              recipient_name: recipientName,
              ...(uploadedUrl ? { install_photo_url: uploadedUrl } : {}),
              appendNote: stamp,
            }),
          });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j.error || `HTTP ${res.status}`);
          }
          updatePhoto(idx, {
            status: 'saved',
            errorMessage: null,
            uploadedPhotoUrl: uploadedUrl,
          });
        } catch (e) {
          updatePhoto(idx, {
            status: 'error',
            errorMessage: e instanceof Error ? e.message : 'Save failed',
          });
        }
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
    setSavingAll(false);
  };

  return (
    <div className="space-y-6">
      {/* Drop area */}
      <div
        className="rounded-2xl border-2 border-dashed border-input bg-muted px-6 py-10 text-center"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void onFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-base font-medium text-foreground">Drop photos here</p>
        <p className="mt-1 text-sm text-muted-foreground">JPEG works best. HEIC may fail to decode.</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Or choose files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void onFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <>
          {/* Batch-level community + place */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">Defaults for this batch</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Used for any photo that doesn&apos;t have a per-row override.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Community</label>
                <select
                  value={batchCommunityId}
                  onChange={(e) => setBatchCommunityId(e.target.value)}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                >
                  <option value="">— Pick a community —</option>
                  {STATUS_GROUP_ORDER.filter((s) => groupedCommunities.has(s)).map((s) => (
                    <optgroup key={s} label={STATUS_GROUP_LABEL[s] || s}>
                      {groupedCommunities.get(s)!.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Default place (optional)
                </label>
                <input
                  type="text"
                  value={batchPlace}
                  onChange={(e) => setBatchPlace(e.target.value)}
                  placeholder="e.g. Utopia Homelands"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Photo table */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {photos.length} photo{photos.length === 1 ? '' : 's'} loaded
                </h2>
                <p className="text-xs text-muted-foreground">
                  {validPhotos.length} ready to save · {unmatchedPhotos.length} need attention
                  {processing && ' · decoding…'}
                </p>
              </div>
              <button
                type="button"
                onClick={saveAll}
                disabled={savingAll || processing || validPhotos.length === 0}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {savingAll
                  ? 'Saving…'
                  : `Save ${validPhotos.length} bed${validPhotos.length === 1 ? '' : 's'}`}
              </button>
            </div>

            <ul className="divide-y divide-border">
              {photos.map((p, i) => (
                <li key={p.previewUrl} className="px-4 py-3">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.previewUrl}
                        alt={p.fileName}
                        className="h-24 w-24 rounded-lg object-cover bg-muted"
                      />
                    </div>

                    {/* Details + inputs */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="text"
                          value={p.uniqueId ?? ''}
                          onChange={(e) => {
                            const raw = e.target.value.trim().toUpperCase();
                            updatePhoto(i, {
                              uniqueId: raw.length > 0 ? raw : null,
                              decodeError: raw.length > 0 ? null : p.decodeError,
                            });
                          }}
                          placeholder="Type bed ID e.g. GB0-156-1"
                          className={`rounded-full border px-2 py-0.5 text-xs font-mono w-48 ${
                            p.uniqueId
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                              : 'border-red-300 bg-red-50 text-red-900 placeholder-red-400'
                          }`}
                        />
                        {p.qrUrl && p.uniqueId && (
                          <span className="text-[10px] text-emerald-700">QR-decoded</span>
                        )}
                        {p.gps ? (
                          <span className="text-xs text-muted-foreground">
                            📍 {p.gps.lat.toFixed(5)}, {p.gps.lng.toFixed(5)}
                          </span>
                        ) : (
                          <span className="text-xs text-amber-700">no GPS in EXIF</span>
                        )}
                        {p.capturedAt && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(p.capturedAt).toLocaleString()}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground truncate">{p.fileName}</span>
                      </div>

                      {p.decodeError && (
                        <p className="mt-1 text-xs text-red-700">{p.decodeError}</p>
                      )}

                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div>
                          <input
                            type="text"
                            value={p.recipientName}
                            onChange={(e) =>
                              updatePhoto(i, {
                                recipientName: e.target.value,
                                recipientFromCaption: false,
                              })
                            }
                            placeholder="Recipient name (e.g. Frank family)"
                            className={`w-full rounded-lg border bg-card px-3 py-2 text-sm ${
                              p.recipientFromCaption ? 'border-emerald-300' : 'border-input'
                            }`}
                          />
                          {p.recipientFromCaption && (
                            <p className="mt-0.5 text-[10px] text-emerald-700">
                              ↑ pre-filled from photo caption
                            </p>
                          )}
                        </div>
                        <input
                          type="text"
                          value={p.placeOverride}
                          onChange={(e) => updatePhoto(i, { placeOverride: e.target.value })}
                          placeholder={batchPlace ? `Place override (default: ${batchPlace})` : 'Place (e.g. Sandover Outstation)'}
                          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                        />
                      </div>

                      {p.status === 'saving' && (
                        <p className="mt-1 text-xs text-muted-foreground">Saving…</p>
                      )}
                      {p.status === 'saved' && (
                        <p className="mt-1 text-xs text-emerald-700">✓ Saved to register</p>
                      )}
                      {p.status === 'error' && (
                        <p className="mt-1 text-xs text-red-700">Error: {p.errorMessage}</p>
                      )}
                    </div>

                    {/* Remove */}
                    <div>
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
