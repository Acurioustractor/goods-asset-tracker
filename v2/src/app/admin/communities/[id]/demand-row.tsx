'use client';

import { useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { updateDemand, deleteDemand } from './actions';

type DemandRow = {
  id: string;
  community_id: string;
  requested_by: string | null;
  product: string;
  qty: number;
  status: string;
  estimated_value_cents: number | null;
  notes: string | null;
};

const STATUS_OPTIONS = ['exploring', 'requested', 'approved', 'allocated', 'fulfilled', 'dropped'] as const;

const STATUS_STYLE: Record<string, string> = {
  exploring: 'bg-purple-100 text-purple-800',
  requested: 'bg-blue-100 text-blue-800',
  approved: 'bg-emerald-100 text-emerald-800',
  allocated: 'bg-amber-100 text-amber-800',
  fulfilled: 'bg-gray-100 text-gray-700',
  dropped: 'bg-red-50 text-red-700',
};

export function DemandRowItem({ row }: { row: DemandRow }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const valueDollars = row.estimated_value_cents ? (row.estimated_value_cents / 100).toString() : '';

  if (!editing) {
    return (
      <tr className="border-b last:border-0 hover:bg-gray-50">
        <td className="py-2 px-3 font-medium">{row.requested_by || <span className="text-gray-400">—</span>}</td>
        <td className="hidden sm:table-cell py-2 px-3 text-xs text-gray-600">{row.product}</td>
        <td className="py-2 px-3 text-right font-mono">{row.qty}</td>
        <td className="hidden md:table-cell py-2 px-3 text-right font-mono">
          {row.estimated_value_cents
            ? `$${(row.estimated_value_cents / 100).toLocaleString('en-AU')}`
            : '—'}
        </td>
        <td className="py-2 px-3">
          <Badge className={`text-xs ${STATUS_STYLE[row.status] || 'bg-gray-100 text-gray-700'}`}>
            {row.status}
          </Badge>
        </td>
        <td className="hidden lg:table-cell py-2 px-3 text-xs text-gray-500 max-w-[280px] truncate">{row.notes || '—'}</td>
        <td className="py-2 px-3 text-right">
          <button
            type="button"
            className="text-xs text-orange-600 hover:underline"
            onClick={() => setEditing(true)}
          >
            edit
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b last:border-0 bg-amber-50/40">
      <td colSpan={7} className="py-3 px-2 sm:px-3">
        <form
          action={(fd) => {
            setError(null);
            fd.set('id', row.id);
            fd.set('community_id', row.community_id);
            startTransition(async () => {
              const res = await updateDemand(fd);
              if (res?.error) {
                setError(res.error);
              } else {
                setEditing(false);
              }
            });
          }}
          className="grid grid-cols-1 gap-3 md:grid-cols-6 md:items-end"
        >
          <Field label="Requested by">
            <input name="requested_by" defaultValue={row.requested_by || ''} className={inputCls} />
          </Field>
          <Field label="Qty">
            <input name="qty" type="number" min="1" defaultValue={row.qty} required className={inputCls} />
          </Field>
          <Field label="Est. value ($AUD)">
            <input name="estimated_value_dollars" defaultValue={valueDollars} className={inputCls} placeholder="e.g. 5000" />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={row.status} className={inputCls}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Notes" wide>
            <input name="notes" defaultValue={row.notes || ''} className={inputCls} />
          </Field>
          <div className="flex flex-wrap gap-2 md:col-span-6">
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <button
              type="button"
              className="ml-auto text-xs text-red-600 hover:underline"
              disabled={pending}
              onClick={() => {
                if (!confirm('Delete this demand record?')) return;
                startTransition(async () => {
                  const res = await deleteDemand(row.id, row.community_id);
                  if (res?.error) setError(res.error);
                });
              }}
            >
              Delete
            </button>
          </div>
          {error && <div className="text-xs text-red-600 md:col-span-6">{error}</div>}
        </form>
      </td>
    </tr>
  );
}

const inputCls = 'w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500';

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block text-xs ${wide ? 'md:col-span-2' : ''}`}>
      <span className="block font-medium text-gray-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

export type { DemandRow };
