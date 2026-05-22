'use client';

import { useState } from 'react';
import { saveAliceRecipients } from './actions';

type BedRow = {
  unique_id: string;
  display_name: string | null;
  recipient_name: string | null;
  place: string | null;
  notes: string | null;
};

const HINTS = [
  'Mykel',
  '4 young girls — Girl 1',
  '4 young girls — Girl 2',
  '4 young girls — Girl 3',
  '4 young girls — Girl 4',
  '3 other young people — 1',
  '3 other young people — 2',
  '3 other young people — 3',
];

export function WizardForm({ rows }: { rows: BedRow[] }) {
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: string[]; fail: { id: string; error: string }[] } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setResult(null);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await saveAliceRecipients(fd);
      setResult(res);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Bed</th>
              <th className="px-3 py-2 text-left">Recipient name</th>
              <th className="px-3 py-2 text-left">Place (optional)</th>
              <th className="px-3 py-2 text-left">Note (optional)</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => {
              const saved = result?.ok.includes(r.unique_id);
              const failed = result?.fail.find((f) => f.id === r.unique_id);
              return (
                <tr key={r.unique_id} className={saved ? 'bg-emerald-50/40' : failed ? 'bg-red-50/40' : ''}>
                  <td className="px-3 py-2 align-top">
                    <div className="font-mono text-xs font-semibold text-blue-700">{r.unique_id}</div>
                    {r.display_name && (
                      <div className="text-xs text-amber-700">named &ldquo;{r.display_name}&rdquo;</div>
                    )}
                    <input type="hidden" name="bed_id" value={r.unique_id} />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      name={`recipient:${r.unique_id}`}
                      defaultValue={r.recipient_name || ''}
                      placeholder={HINTS[i] || 'e.g. Mykel'}
                      className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      name={`place:${r.unique_id}`}
                      defaultValue={r.place === 'Alice Springs' ? '' : (r.place || '')}
                      placeholder="e.g. Hartley Street"
                      className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      name={`note:${r.unique_id}`}
                      placeholder="anything else"
                      className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 align-top text-xs">
                    {saved && <span className="text-emerald-700">✓ saved</span>}
                    {failed && <span className="text-red-700" title={failed.error}>✗ {failed.error}</span>}
                    {!saved && !failed && <span className="text-gray-400">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Leave a row empty to skip it. You can run this wizard again later for the unfilled ones.
        </p>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save all'}
        </button>
      </div>

      {result && (
        <p className="text-sm">
          <strong>{result.ok.length}</strong> saved
          {result.fail.length > 0 && <span className="text-red-700"> · {result.fail.length} failed</span>}
        </p>
      )}
    </form>
  );
}
