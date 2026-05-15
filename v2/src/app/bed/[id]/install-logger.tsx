'use client';

import { useState, useTransition } from 'react';
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
  };
  adminEmail: string;
  communityOptions: CommunityOption[];
};

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
  const [gpsState, setGpsState] = useState<'idle' | 'capturing' | 'ok' | 'error'>('idle');
  const [gpsError, setGpsError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

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

    const today = new Date().toISOString().slice(0, 10);
    const stamp = `[${today}] installed by ${adminEmail} → ${selectedCommunity?.name || communityId}${place ? ` / ${place}` : ''}${gps ? ` (gps ${gps})` : ''}`;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/assets/${uniqueId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            community_id: communityId,
            place: place || null,
            gps: gps || null,
            status,
            appendNote: stamp,
          }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `HTTP ${res.status}`);
        }
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 4000);
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : 'Save failed');
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
      <div className="max-w-3xl mx-auto px-4 mt-4">
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

          <button
            onClick={onSave}
            disabled={isPending}
            className="w-full rounded-lg bg-amber-700 px-4 py-3.5 text-base font-bold text-white hover:bg-amber-800 disabled:opacity-50"
          >
            {isPending ? 'Saving…' : `Save location for ${uniqueId}`}
          </button>
        </div>
      </div>
    </div>
  );
}
