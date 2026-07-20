'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { addDemand } from './actions';

const STATUS_OPTIONS = ['exploring', 'requested', 'approved', 'allocated', 'fulfilled'] as const;

const inputCls = 'w-full rounded-md border border-border px-2 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block text-xs ${wide ? 'md:col-span-2' : ''}`}>
      <span className="block font-medium text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}

export function AddDemandForm({ communityId }: { communityId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        + Log demand
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
      <form
        action={(fd) => {
          setError(null);
          fd.set('community_id', communityId);
          startTransition(async () => {
            const res = await addDemand(fd);
            if (res?.error) {
              setError(res.error);
            } else {
              setOpen(false);
              // Reset will happen via revalidatePath in the server action
            }
          });
        }}
        className="grid grid-cols-1 gap-3 md:grid-cols-6 md:items-end"
      >
        <Field label="Requested by">
          <input name="requested_by" className={inputCls} placeholder="e.g. Dianne Stokes" />
        </Field>
        <Field label="Product">
          <input name="product" defaultValue="Stretch Bed" className={inputCls} />
        </Field>
        <Field label="Qty">
          <input name="qty" type="number" min="1" defaultValue="1" required className={inputCls} />
        </Field>
        <Field label="Est. value ($AUD)">
          <input name="estimated_value_dollars" className={inputCls} placeholder="e.g. 560" />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue="requested" className={inputCls}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Source">
          <select name="source" defaultValue="manual" className={inputCls}>
            <option value="manual">manual</option>
            <option value="community_voice">community_voice</option>
            <option value="meeting">meeting</option>
            <option value="email">email</option>
            <option value="compendium">compendium</option>
          </select>
        </Field>
        <Field label="Notes" wide>
          <input name="notes" className={inputCls} placeholder="e.g. asked at delivery in March" />
        </Field>
        <div className="flex gap-2 md:col-span-6">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? 'Saving…' : 'Add demand'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {error && <span className="text-xs text-red-600 ml-2 self-center">{error}</span>}
        </div>
      </form>
    </div>
  );
}
