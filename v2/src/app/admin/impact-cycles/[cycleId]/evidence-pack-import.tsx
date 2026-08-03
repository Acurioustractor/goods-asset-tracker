'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PackSummary = {
  id: string;
  title: string;
  sourceLabel: string;
  warning: string;
  observationCount: number;
  consentSummary: Array<{ state: string; count: number }>;
};

export function EvidencePackImport({
  cycleId,
  packs,
}: {
  cycleId: string;
  packs: PackSummary[];
}) {
  const router = useRouter();
  const [dates, setDates] = useState<Record<string, string>>({});
  const [busyPack, setBusyPack] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(
    null,
  );

  async function importPack(packId: string) {
    const occurredAt = dates[packId];
    if (!occurredAt) {
      setMessage({ kind: 'error', text: 'Confirm the interview or event date before importing.' });
      return;
    }
    setBusyPack(packId);
    setMessage(null);
    try {
      const response = await fetch(
        `/api/admin/impact-cycles/${cycleId}/observation-packs/${packId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ occurredAt }),
        },
      );
      const result = (await response.json()) as {
        error?: string;
        imported?: number;
        skipped?: number;
      };
      if (!response.ok) throw new Error(result.error || 'Could not import the evidence pack.');
      setMessage({
        kind: 'success',
        text: `${result.imported || 0} private observations imported${
          result.skipped ? `; ${result.skipped} already present` : ''
        }.`,
      });
      router.refresh();
    } catch (error) {
      setMessage({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Could not import the evidence pack.',
      });
    } finally {
      setBusyPack(null);
    }
  }

  if (packs.length === 0) return null;

  return (
    <section className="space-y-4 rounded-xl border border-violet-200 bg-violet-50 p-5 sm:p-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-800">
          Empathy Ledger review packs
        </p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-violet-950">
          Proposed private evidence
        </h2>
        <p className="mt-1 text-sm text-violet-900/75">
          Import bounded observations, not transcripts or public claims. Existing imports are
          skipped safely.
        </p>
      </div>
      {packs.map((pack) => (
        <article key={pack.id} className="rounded-xl border border-violet-200 bg-white p-5">
          <h3 className="font-serif text-xl font-bold">{pack.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{pack.sourceLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-violet-100 px-2.5 py-1 font-semibold text-violet-900">
              {pack.observationCount} proposed observations
            </span>
            {pack.consentSummary.map(({ state, count }) => (
              <span key={state} className="rounded-full bg-slate-100 px-2.5 py-1">
                {count} {state.replaceAll('_', ' ')}
              </span>
            ))}
          </div>
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            {pack.warning}
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <Label htmlFor={`pack-date-${pack.id}`}>Confirmed interview/event date</Label>
              <Input
                id={`pack-date-${pack.id}`}
                type="date"
                value={dates[pack.id] || ''}
                onChange={(event) =>
                  setDates((current) => ({ ...current, [pack.id]: event.target.value }))
                }
                className="w-auto bg-white"
              />
            </div>
            <Button
              type="button"
              onClick={() => importPack(pack.id)}
              disabled={busyPack !== null}
            >
              {busyPack === pack.id ? 'Importing…' : 'Import as private drafts'}
            </Button>
          </div>
        </article>
      ))}
      {message && (
        <p
          role="status"
          className={`text-sm ${message.kind === 'error' ? 'text-red-700' : 'text-emerald-800'}`}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}
