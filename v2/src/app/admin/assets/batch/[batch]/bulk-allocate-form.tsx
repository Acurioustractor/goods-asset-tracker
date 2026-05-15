'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type CommunityOption = {
  id: string;
  name: string;
  state: string;
  status: string;
};

type AssetLite = {
  unique_id: string;
  status: string | null;
  community: string | null;
  community_id: string | null;
};

const STATUS_OPTIONS = [
  { value: 'allocated', label: 'Allocated (pre-delivery, ear-marked for community)' },
  { value: 'deployed', label: 'Deployed (in community right now)' },
  { value: 'ready', label: 'Ready (still pending delivery)' },
  { value: 'demo', label: 'Demo' },
  { value: 'under_investigation', label: 'Under investigation' },
  { value: 'retired', label: 'Retired' },
];

const STATUS_GROUP_LABEL: Record<string, string> = {
  active: 'Active deployments',
  testing: 'Testing',
  exploring: 'Exploring',
  prospect: 'Prospects',
  administrative: 'Admin / staging',
};
const STATUS_GROUP_ORDER = ['active', 'testing', 'exploring', 'prospect', 'administrative'];

export function BulkAllocateForm({
  batch,
  assets,
  communityOptions,
}: {
  batch: string;
  assets: AssetLite[];
  communityOptions: CommunityOption[];
}) {
  const router = useRouter();
  const [communityId, setCommunityId] = useState('');
  const [status, setStatus] = useState('allocated');
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [note, setNote] = useState('');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<null | { updated: number; community: string; status: string }>(null);

  const grouped = useMemo(() => {
    const m = new Map<string, CommunityOption[]>();
    for (const o of communityOptions) {
      if (!m.has(o.status)) m.set(o.status, []);
      m.get(o.status)!.push(o);
    }
    return m;
  }, [communityOptions]);

  const selectedCommunity = communityOptions.find((c) => c.id === communityId);
  const toUpdate = assets.length - excluded.size;

  const toggleExclude = (uid: string) => {
    setExcluded((prev) => {
      const n = new Set(prev);
      if (n.has(uid)) n.delete(uid);
      else n.add(uid);
      return n;
    });
  };

  const submit = () => {
    if (!communityId) {
      setError('Pick a community.');
      return;
    }
    if (toUpdate < 1) {
      setError('All assets are excluded.');
      return;
    }
    if (!confirm(`Allocate ${toUpdate} asset${toUpdate === 1 ? '' : 's'} in batch ${batch} to ${selectedCommunity?.name} (status: ${status})?`)) {
      return;
    }
    setError(null);
    setResult(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/assets/batch/${batch}/allocate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            community_id: communityId,
            status,
            exclude: [...excluded],
            note: note.trim() || undefined,
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
        setResult({ updated: j.updated, community: j.community, status: j.status });
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed');
      }
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-amber-300 bg-amber-50/40 p-5">
      <div>
        <h2 className="text-base font-semibold text-amber-900">Allocate batch in one move</h2>
        <p className="text-xs text-amber-800/80">
          Updates community + status + appends audit note on every selected asset. Untick rows below to leave them alone.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="block text-xs">
          <span className="block font-medium text-amber-900 mb-1">Community</span>
          <select
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            className="w-full rounded-md border border-amber-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="">— Pick a community —</option>
            {STATUS_GROUP_ORDER.filter((s) => grouped.has(s)).map((s) => (
              <optgroup key={s} label={STATUS_GROUP_LABEL[s] || s}>
                {grouped.get(s)!.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.name} ({opt.state})</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label className="block text-xs">
          <span className="block font-medium text-amber-900 mb-1">New status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-amber-300 bg-white px-2 py-1.5 text-sm"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className="block text-xs">
          <span className="block font-medium text-amber-900 mb-1">Override audit note (optional)</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="leave blank for auto"
            className="w-full rounded-md border border-amber-300 bg-white px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={submit} disabled={pending}>
          {pending ? 'Allocating…' : `Allocate ${toUpdate} of ${assets.length}`}
        </Button>
        {excluded.size > 0 && (
          <Button size="sm" variant="outline" onClick={() => setExcluded(new Set())}>
            Clear {excluded.size} exclude{excluded.size === 1 ? '' : 's'}
          </Button>
        )}
        {error && <span className="text-xs text-red-700">{error}</span>}
        {result && (
          <Badge className="bg-emerald-100 text-emerald-800 text-xs">
            ✓ {result.updated} updated → {result.community} ({result.status})
          </Badge>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500">
              <th className="py-2 px-3 font-medium w-10"></th>
              <th className="py-2 px-3 font-medium">ID</th>
              <th className="py-2 px-3 font-medium">Current status</th>
              <th className="py-2 px-3 font-medium">Current community</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => {
              const isExcluded = excluded.has(a.unique_id);
              return (
                <tr key={a.unique_id} className={`border-b last:border-0 ${isExcluded ? 'opacity-40' : 'hover:bg-gray-50'}`}>
                  <td className="py-1.5 px-3">
                    <input
                      type="checkbox"
                      checked={!isExcluded}
                      onChange={() => toggleExclude(a.unique_id)}
                      aria-label={`Include ${a.unique_id}`}
                    />
                  </td>
                  <td className="py-1.5 px-3 font-mono text-xs">{a.unique_id}</td>
                  <td className="py-1.5 px-3 text-xs">{a.status?.replace(/_/g, ' ') || '—'}</td>
                  <td className="py-1.5 px-3 text-xs text-gray-600">{a.community || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
