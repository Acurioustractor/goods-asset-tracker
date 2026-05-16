'use client';

import { useState } from 'react';

type Props = {
  uniqueId: string;
  productNoun: string;
};

type ReminderChoice = '3-months' | '6-months' | '1-year';

const OPTIONS: { value: ReminderChoice; label: string; months: number; signal_value: string }[] = [
  { value: '3-months', label: 'In 3 months', months: 3, signal_value: '3mo-check' },
  { value: '6-months', label: 'In 6 months', months: 6, signal_value: '6mo-wash' },
  { value: '1-year', label: 'In a year', months: 12, signal_value: '1yr-check' },
];

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function ReminderForm({ uniqueId, productNoun }: Props) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [choice, setChoice] = useState<ReminderChoice>('6-months');
  const [pending, setPending] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setError('Phone number needed so we can text you.');
      return;
    }
    const opt = OPTIONS.find((o) => o.value === choice)!;
    const when = addMonths(new Date(), opt.months);
    setPending(true);
    try {
      const res = await fetch(`/api/bed/${encodeURIComponent(uniqueId)}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signal_type: 'reminder',
          signal_value: opt.signal_value,
          contact: phone.trim(),
          scheduled_for: when.toISOString(),
          payload: { choice, product_noun: productNoun },
        }),
      });
      if (!res.ok) throw new Error('Could not save');
      setSubmittedAt(when.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setPending(false);
    }
  };

  if (submittedAt) {
    return (
      <div className="rounded-2xl border bg-card p-4">
        <p className="text-sm">
          ✓ We&apos;ll text you in <strong>{submittedAt}</strong> to see how the {productNoun.toLowerCase()} is going.
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
          <span className="text-2xl flex-shrink-0" aria-hidden>⏰</span>
          <div>
            <p className="text-sm font-semibold">Text me later to check in</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pick 3, 6, or 12 months. We&apos;ll send one SMS, reply if anything&apos;s up. Reply STOP to opt out any time.
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold">Text me later to check in</p>
        <p className="text-xs text-muted-foreground">
          One SMS, sent from Goods on Country. Reply STOP at any time and we won&apos;t text again.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setChoice(opt.value)}
            className={`rounded-lg border px-3 py-2 text-sm ${
              choice === opt.value
                ? 'bg-amber-700 text-white border-amber-700'
                : 'bg-card hover:bg-muted'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="04XX XXX XXX"
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
          {pending ? 'Saving…' : 'Set reminder'}
        </button>
      </div>
    </div>
  );
}
