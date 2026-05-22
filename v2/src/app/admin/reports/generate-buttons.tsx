'use client';

import { useState, useTransition } from 'react';
import { generateFunderReport } from './actions';

export function GenerateButtons({ funderSlug, periods }: { funderSlug: string; periods: string[] }) {
  const [pending, setPending] = useState<string | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [, startTransition] = useTransition();

  async function run(periodSlug: string) {
    setPending(periodSlug);
    setResult(null);
    try {
      const res = await generateFunderReport(funderSlug, periodSlug);
      if (res.ok) {
        setResult({ ok: true, message: `Wrote ${res.bytes} bytes · ${res.sections} sections` });
        startTransition(() => { /* triggers revalidation */ });
      } else {
        setResult({ ok: false, message: res.error || 'Unknown error' });
      }
    } finally {
      setPending(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => run(p)}
            disabled={!!pending}
            className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
          >
            {pending === p ? `Generating ${p}…` : `Generate ${p}`}
          </button>
        ))}
      </div>
      {result && (
        <p className={`mt-2 text-xs ${result.ok ? 'text-emerald-700' : 'text-red-700'}`}>
          {result.ok ? '✓ ' : '✗ '}{result.message}
        </p>
      )}
    </div>
  );
}
