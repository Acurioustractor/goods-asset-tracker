'use client';

import { useState } from 'react';

type Props = {
  uniqueId: string;
  productNoun: string;
  community: string | null;
};

export function DemandButton({ uniqueId, productNoun, community }: Props) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [contact, setContact] = useState('');
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setPending(true);
    try {
      const res = await fetch(`/api/bed/${encodeURIComponent(uniqueId)}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signal_type: 'demand_bump',
          signal_value: String(qty),
          contact: contact.trim() || undefined,
          payload: {
            qty,
            notes: notes.trim() || undefined,
            from_asset: uniqueId,
          },
        }),
      });
      if (!res.ok) throw new Error('Could not save');
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-card p-4">
        <p className="text-sm">
          ✓ Logged. Goods will see this on the {community ? community : 'community'} register.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border bg-card hover:bg-amber-50 dark:hover:bg-amber-950/30 p-4 text-left transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0" aria-hidden>📣</span>
          <div>
            <p className="text-sm font-semibold">We need more here</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tell us how many more {productNoun.toLowerCase()}s {community ? community : 'this community'} could use.
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold">More {productNoun.toLowerCase()}s needed</p>
        <p className="text-xs text-muted-foreground">
          Goods sees this on the community demand register and chases supply.
        </p>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">How many?</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-9 h-9 rounded-lg border text-lg font-bold hover:bg-muted"
          >
            −
          </button>
          <span className="text-2xl font-bold w-12 text-center">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(Math.min(50, qty + 1))}
            className="w-9 h-9 rounded-lg border text-lg font-bold hover:bg-muted"
          >
            +
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Anything we should know? (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="e.g. for the new houses, for our outstation"
          className="w-full rounded-lg border px-3 py-2 text-sm bg-background"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Phone or email (optional)</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="So we can follow up"
          className="w-full rounded-lg border px-3 py-2.5 text-base bg-background"
        />
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="flex-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 text-sm font-semibold disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Send to Goods'}
        </button>
      </div>
    </div>
  );
}
