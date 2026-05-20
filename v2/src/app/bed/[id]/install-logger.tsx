'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type CommunityOption = {
  id: string;
  name: string;
  state: string;
  status: string;
};

type Props = {
  uniqueId: string;
  productLabel: string;
  initial: {
    community: string | null;
    community_id: string | null;
    place: string | null;
    gps: string | null;
    status: string | null;
    recipient_name: string | null;
    install_photo_url: string | null;
  };
  adminEmail: string;
  communityOptions: CommunityOption[];
};

const QUEUE_PREFIX = 'goods.install.queue.';

type QueuedDrop = {
  uniqueId: string;
  payload: Record<string, unknown>;
  queuedAt: string;
  adminEmail: string;
};

function listQueued(): QueuedDrop[] {
  if (typeof window === 'undefined') return [];
  const out: QueuedDrop[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key?.startsWith(QUEUE_PREFIX)) continue;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) out.push(JSON.parse(raw) as QueuedDrop);
    } catch {
      /* ignore corrupt entries */
    }
  }
  return out.sort((a, b) => a.queuedAt.localeCompare(b.queuedAt));
}

function queueLocally(drop: QueuedDrop): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(QUEUE_PREFIX + drop.uniqueId, JSON.stringify(drop));
}

function dequeue(uniqueId: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(QUEUE_PREFIX + uniqueId);
}

async function syncOne(drop: QueuedDrop): Promise<'ok' | 'offline' | 'error'> {
  try {
    const res = await fetch(`/api/admin/assets/${drop.uniqueId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(drop.payload),
    });
    if (res.ok) return 'ok';
    // 4xx/5xx — payload reached the server but was rejected. Don't keep
    // retrying forever on a bad payload; surface so user can fix.
    return 'error';
  } catch {
    // Network failure — still offline
    return 'offline';
  }
}

const STATUS_OPTIONS = [
  { value: 'deployed', label: 'Deployed (in community)' },
  { value: 'ready', label: 'Ready (still pending delivery)' },
  { value: 'demo', label: 'Demo' },
  { value: 'under_investigation', label: 'Under investigation' },
  { value: 'retired', label: 'Retired' },
];

// Group communities by status for the dropdown
const STATUS_GROUP_LABEL: Record<string, string> = {
  active: 'Active deployments',
  testing: 'Testing',
  exploring: 'Exploring',
  prospect: 'Prospects',
  administrative: 'Admin / staging',
};
const STATUS_GROUP_ORDER = ['active', 'testing', 'exploring', 'prospect', 'administrative'];

export function InstallLogger({ uniqueId, productLabel, initial, adminEmail, communityOptions }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const isPendingDelivery = initial.community_id === 'pending-delivery' || initial.community === 'Pending Delivery';

  const [communityId, setCommunityId] = useState(
    isPendingDelivery ? '' : initial.community_id || ''
  );
  const [place, setPlace] = useState(initial.place || '');
  const [gps, setGps] = useState(initial.gps || '');
  const [status, setStatus] = useState(initial.status || 'deployed');
  const [recipientName, setRecipientName] = useState(initial.recipient_name || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUploadState, setPhotoUploadState] = useState<'idle' | 'uploading' | 'ok' | 'error'>('idle');
  const [photoUploadError, setPhotoUploadError] = useState('');
  const [gpsState, setGpsState] = useState<'idle' | 'capturing' | 'ok' | 'error'>('idle');
  const [gpsError, setGpsError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);
  const [queuedOffline, setQueuedOffline] = useState(false);
  const [queueSize, setQueueSize] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const refreshQueueCount = useCallback(() => {
    setQueueSize(listQueued().length);
  }, []);

  const drainQueue = useCallback(async () => {
    const queued = listQueued();
    if (queued.length === 0) {
      setQueueSize(0);
      return;
    }
    setSyncing(true);
    let anySynced = false;
    for (const drop of queued) {
      const result = await syncOne(drop);
      if (result === 'ok') {
        dequeue(drop.uniqueId);
        anySynced = true;
      } else if (result === 'offline') {
        // Still no network — stop trying, keep queue intact
        break;
      }
      // 'error' = bad payload, leave queued so user can see it on the bed page
    }
    setSyncing(false);
    refreshQueueCount();
    if (anySynced) router.refresh();
  }, [refreshQueueCount, router]);

  useEffect(() => {
    refreshQueueCount();
    void drainQueue();
    const onOnline = () => void drainQueue();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [drainQueue, refreshQueueCount]);

  const captureGps = () => {
    if (!navigator.geolocation) {
      setGpsState('error');
      setGpsError('Geolocation not supported on this browser.');
      return;
    }
    setGpsState('capturing');
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const acc = Math.round(pos.coords.accuracy);
        setGps(`${lat},${lng}`);
        setGpsState('ok');
        setGpsError(`±${acc}m accuracy`);
      },
      (err) => {
        setGpsState('error');
        setGpsError(err.message || 'Could not capture location. You can paste lat,lng manually.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  };

  const selectedCommunity = communityOptions.find((c) => c.id === communityId);

  const onSave = () => {
    if (!communityId) {
      setSaveError('Pick a community from the list.');
      return;
    }
    setSaveError('');
    setSaved(false);
    setQueuedOffline(false);

    const today = new Date().toISOString().slice(0, 10);
    const trimmedRecipient = recipientName.trim();
    const stamp = `[${today}] installed by ${adminEmail} → ${selectedCommunity?.name || communityId}${place ? ` / ${place}` : ''}${gps ? ` (gps ${gps})` : ''}${trimmedRecipient ? ` recipient: ${trimmedRecipient}` : ''}`;
    const payload: Record<string, unknown> = {
      community_id: communityId,
      place: place || null,
      gps: gps || null,
      status,
      recipient_name: trimmedRecipient || null,
      appendNote: stamp,
    };

    const queueAndShow = () => {
      queueLocally({
        uniqueId,
        payload,
        queuedAt: new Date().toISOString(),
        adminEmail,
      });
      setQueuedOffline(true);
      refreshQueueCount();
    };

    startTransition(async () => {
      // Fast path: if the browser already knows we're offline, skip the fetch
      // (photo upload + PATCH both need network). Queue and bail.
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        queueAndShow();
        return;
      }

      // Step 1: optional photo upload. Failure is non-fatal — the install
      // record still saves; user can attach the photo later.
      if (photoFile) {
        setPhotoUploadState('uploading');
        setPhotoUploadError('');
        try {
          const fd = new FormData();
          fd.append('photo', photoFile, photoFile.name);
          const upRes = await fetch(`/api/admin/assets/${uniqueId}/install-photo`, {
            method: 'POST',
            body: fd,
          });
          if (upRes.ok) {
            const j = await upRes.json().catch(() => ({}));
            if (j.url) payload.install_photo_url = j.url;
            setPhotoUploadState('ok');
          } else {
            const j = await upRes.json().catch(() => ({}));
            setPhotoUploadState('error');
            setPhotoUploadError(j.error || `Photo upload failed: HTTP ${upRes.status}`);
          }
        } catch (e) {
          setPhotoUploadState('error');
          setPhotoUploadError(e instanceof Error ? e.message : 'Photo upload failed');
        }
      }

      try {
        const res = await fetch(`/api/admin/assets/${uniqueId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `HTTP ${res.status}`);
        }
        // Online save succeeded — clear any prior queued entry for this bed.
        dequeue(uniqueId);
        refreshQueueCount();
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 4000);
      } catch (e) {
        // Network failure (offline / timeout / DNS) -> queue locally.
        // 4xx/5xx errors that returned a JSON body land here too; treat as
        // offline-queueable since the user can't fix server-side issues in
        // the field. They'll surface on the admin register later.
        const looksLikeNetwork =
          e instanceof TypeError ||
          (e instanceof Error && /Failed to fetch|NetworkError|Load failed/i.test(e.message));
        if (looksLikeNetwork) {
          queueAndShow();
        } else {
          setSaveError(e instanceof Error ? e.message : 'Save failed');
        }
      }
    });
  };

  // Group options by status
  const grouped = new Map<string, CommunityOption[]>();
  for (const opt of communityOptions) {
    if (!grouped.has(opt.status)) grouped.set(opt.status, []);
    grouped.get(opt.status)!.push(opt);
  }

  if (!open) {
    return (
      <div className="max-w-3xl mx-auto px-4 mt-4 space-y-2">
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4 text-left shadow-sm hover:bg-amber-100 transition"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Goods staff · {adminEmail}
              </div>
              <div className="mt-0.5 text-base font-bold text-amber-900">
                Log this {productLabel.toLowerCase()}&apos;s location
              </div>
              <div className="text-sm text-amber-800/80">
                {isPendingDelivery
                  ? 'New unit — tap to assign community, place, GPS.'
                  : `Currently: ${initial.community}${initial.place ? ` · ${initial.place}` : ''}. Tap to update.`}
              </div>
            </div>
            <span className="text-2xl">📍</span>
          </div>
        </button>
        {queueSize > 0 && (
          <div className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-xs text-orange-900 flex items-center justify-between gap-3">
            <span>
              <strong>{queueSize} drop{queueSize === 1 ? '' : 's'}</strong> queued offline.
              {syncing ? ' Syncing…' : ' Will sync when online.'}
            </span>
            <button
              type="button"
              onClick={() => void drainQueue()}
              disabled={syncing}
              className="rounded bg-orange-700 px-2.5 py-1 text-white text-xs font-medium hover:bg-orange-800 disabled:opacity-50 whitespace-nowrap"
            >
              {syncing ? 'Syncing…' : 'Sync now'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 mt-4">
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Log location · {uniqueId}
            </div>
            <div className="text-xs text-amber-800/80">Signed in as {adminEmail}</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-xs underline text-amber-900/70"
            type="button"
          >
            Hide
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-amber-900 mb-1">Community</label>
            <select
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-base"
            >
              <option value="">— Pick a community —</option>
              {STATUS_GROUP_ORDER.filter((s) => grouped.has(s)).map((s) => (
                <optgroup key={s} label={STATUS_GROUP_LABEL[s] || s}>
                  {grouped.get(s)!.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} ({opt.state})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="mt-1 text-xs text-amber-800/70">
              Don&apos;t see the community?{' '}
              <a className="underline" href="/admin/communities" target="_blank" rel="noreferrer">
                Add it in the register
              </a>{' '}
              first, then come back.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-900 mb-1">
              Place (house / family / outstation)
            </label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g. Sandover Outstation, Frank household"
              className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-900 mb-1">GPS (lat,lng)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={gps}
                onChange={(e) => setGps(e.target.value)}
                placeholder="-23.6980,133.8807"
                className="flex-1 rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-base font-mono"
              />
              <button
                type="button"
                onClick={captureGps}
                disabled={gpsState === 'capturing'}
                className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 whitespace-nowrap"
              >
                {gpsState === 'capturing' ? 'Capturing…' : '📍 Use my GPS'}
              </button>
            </div>
            {gpsError && (
              <p className={`mt-1 text-xs ${gpsState === 'ok' ? 'text-emerald-700' : 'text-red-700'}`}>
                {gpsError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-900 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-base"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-900 mb-1">
              Recipient name (optional)
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Frank family, Mary T."
              className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-amber-900 mb-1">
              Install photo (optional — bed in place)
            </label>
            {initial.install_photo_url && !photoFile && (
              <div className="mb-2 flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={initial.install_photo_url}
                  alt="Current install photo"
                  className="h-16 w-16 rounded-lg object-cover bg-amber-100"
                />
                <span className="text-xs text-amber-800/80">Photo on file. Upload a new one to replace it.</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                setPhotoFile(e.target.files?.[0] || null);
                setPhotoUploadState('idle');
                setPhotoUploadError('');
              }}
              className="block w-full text-sm text-amber-900 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-amber-200 file:text-amber-900 file:font-medium hover:file:bg-amber-300"
            />
            {photoFile && (
              <p className="mt-1 text-xs text-amber-800/80">
                {photoFile.name} ({Math.round(photoFile.size / 1024)} KB)
              </p>
            )}
            {photoUploadState === 'uploading' && (
              <p className="mt-1 text-xs text-amber-800">Uploading photo…</p>
            )}
            {photoUploadState === 'ok' && (
              <p className="mt-1 text-xs text-emerald-700">Photo uploaded.</p>
            )}
            {photoUploadState === 'error' && (
              <p className="mt-1 text-xs text-red-700">{photoUploadError}</p>
            )}
          </div>

          {saveError && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
              {saveError}
            </div>
          )}
          {saved && (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Saved. The asset register is updated.
            </div>
          )}
          {queuedOffline && (
            <div className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-sm text-orange-900">
              <strong>Saved offline.</strong> No signal here — this drop will sync automatically
              when you&apos;re back online. Safe to keep going to the next bed.
            </div>
          )}

          <button
            onClick={onSave}
            disabled={isPending}
            className="w-full rounded-lg bg-amber-700 px-4 py-3.5 text-base font-bold text-white hover:bg-amber-800 disabled:opacity-50"
          >
            {isPending ? 'Saving…' : `Save location for ${uniqueId}`}
          </button>

          {queueSize > 0 && (
            <div className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-xs text-orange-900 flex items-center justify-between gap-3">
              <span>
                <strong>{queueSize} drop{queueSize === 1 ? '' : 's'}</strong> waiting to sync.
                {syncing ? ' Syncing now…' : ' Will sync automatically when online.'}
              </span>
              <button
                type="button"
                onClick={() => void drainQueue()}
                disabled={syncing}
                className="rounded bg-orange-700 px-2.5 py-1 text-white text-xs font-medium hover:bg-orange-800 disabled:opacity-50 whitespace-nowrap"
              >
                {syncing ? 'Syncing…' : 'Sync now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
