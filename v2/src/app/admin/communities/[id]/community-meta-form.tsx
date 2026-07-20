'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateCommunity } from './actions';

const STATUS_OPTIONS = ['active', 'testing', 'exploring', 'prospect', 'administrative'] as const;
const inputCls = 'w-full rounded-md border border-border px-2 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

export function CommunityMetaForm({
  id,
  partner,
  status,
  contacts,
  notes,
}: {
  id: string;
  partner: string | null;
  status: string;
  contacts: string[];
  notes: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {partner ? <span><strong>Partner:</strong> {partner}</span> : <span className="text-muted-foreground">No partner set</span>}
          {contacts.length > 0 && <span className="ml-3"><strong>Contacts:</strong> {contacts.join(', ')}</span>}
          {notes && <p className="mt-2 text-xs italic text-muted-foreground">{notes}</p>}
        </div>
        <button
          type="button"
          className="text-xs text-primary hover:underline shrink-0"
          onClick={() => setEditing(true)}
        >
          edit
        </button>
      </div>
    );
  }

  return (
    <form
      action={(fd) => {
        setError(null);
        fd.set('id', id);
        startTransition(async () => {
          const res = await updateCommunity(fd);
          if (res?.error) setError(res.error);
          else setEditing(false);
        });
      }}
      className="space-y-3 rounded-lg border border-primary/25 bg-primary/5 p-3"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <label className="block text-xs">
          <span className="block font-medium text-muted-foreground mb-1">Partner</span>
          <input name="partner" defaultValue={partner || ''} className={inputCls} />
        </label>
        <label className="block text-xs">
          <span className="block font-medium text-muted-foreground mb-1">Status</span>
          <select name="status" defaultValue={status} className={inputCls}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="block font-medium text-muted-foreground mb-1">Contacts (comma or newline)</span>
          <input name="contacts" defaultValue={contacts.join(', ')} className={inputCls} />
        </label>
      </div>
      <label className="block text-xs">
        <span className="block font-medium text-muted-foreground mb-1">Notes</span>
        <textarea name="notes" defaultValue={notes || ''} rows={3} className={inputCls} />
      </label>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
          Cancel
        </Button>
        {error && <span className="text-xs text-red-600 ml-2 self-center">{error}</span>}
      </div>
    </form>
  );
}
