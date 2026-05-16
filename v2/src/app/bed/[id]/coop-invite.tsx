'use client';

import { useState } from 'react';

type Props = {
  uniqueId: string;
  community: string | null;
};

export function CoopInvite({ uniqueId, community }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!contact.trim()) {
      setError('Drop a phone or email so we can reach you.');
      return;
    }
    setPending(true);
    try {
      const res = await fetch(`/api/bed/${encodeURIComponent(uniqueId)}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signal_type: 'workshop_interest',
          contact: contact.trim(),
          payload: {
            name: name.trim() || null,
            community,
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
      <div className="rounded-2xl border bg-card p-4 text-center">
        <p className="text-sm">🪛 You&apos;re on the list. Goods will be in touch about the next workshop.</p>
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
          <span className="text-2xl flex-shrink-0" aria-hidden>🪛</span>
          <div>
            <p className="text-sm font-semibold">Want to learn how to make beds?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Goods runs workshops on plastic recycling and bed manufacturing. Tell us you&apos;re keen and we&apos;ll find a spot for you.
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold">Workshop interest</p>
        <p className="text-xs text-muted-foreground">
          We&apos;ll let you know when the next workshop is happening — Alice, on Country, or online.
        </p>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        className="w-full rounded-lg border px-3 py-2.5 text-base bg-background"
      />
      <input
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="Phone or email"
        className="w-full rounded-lg border px-3 py-2.5 text-base bg-background"
      />
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
          {pending ? 'Saving…' : "I'm keen"}
        </button>
      </div>
    </div>
  );
}
