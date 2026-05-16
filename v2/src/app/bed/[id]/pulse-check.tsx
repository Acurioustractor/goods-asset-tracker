'use client';

import { useState } from 'react';

type Props = {
  uniqueId: string;
  productNoun: string;
};

type Pulse = 'good' | 'meh' | 'bad';

const OPTIONS: { value: Pulse; emoji: string; label: string; color: string }[] = [
  { value: 'good', emoji: '👍', label: 'Going well', color: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30' },
  { value: 'meh', emoji: '😐', label: "It's OK", color: 'hover:bg-amber-50 dark:hover:bg-amber-950/30' },
  { value: 'bad', emoji: '👎', label: 'Not great', color: 'hover:bg-red-50 dark:hover:bg-red-950/30' },
];

export function PulseCheck({ uniqueId, productNoun }: Props) {
  const [submitted, setSubmitted] = useState<Pulse | null>(null);
  const [pending, setPending] = useState<Pulse | null>(null);

  const submit = async (value: Pulse) => {
    setPending(value);
    try {
      const res = await fetch(`/api/bed/${encodeURIComponent(uniqueId)}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signal_type: 'pulse', signal_value: value }),
      });
      if (res.ok) setSubmitted(value);
    } finally {
      setPending(null);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-4 text-center">
        <p className="text-sm text-emerald-900 dark:text-emerald-200">
          🙏 Thanks. {submitted === 'bad' ? "We'll be in touch." : "Good to hear."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border shadow-sm p-4">
      <p className="text-sm font-semibold mb-1">How&apos;s the {productNoun.toLowerCase()} going?</p>
      <p className="text-xs text-muted-foreground mb-3">One tap. No account needed. Helps us know what&apos;s working.</p>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => submit(opt.value)}
            disabled={!!pending}
            className={`rounded-xl border bg-card ${opt.color} transition-colors p-3 flex flex-col items-center gap-1 disabled:opacity-50`}
          >
            <span className="text-2xl" aria-hidden>{opt.emoji}</span>
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
