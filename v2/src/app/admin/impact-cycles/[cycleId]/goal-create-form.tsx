'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const DOMAINS = [
  ['rest-health', 'Rest and health'],
  ['dignity-safety', 'Dignity and safety'],
  ['self-determination', 'Self-determination'],
  ['jobs-ownership', 'Jobs and ownership'],
  ['circular-economy', 'Circular economy'],
] as const;

export function GoalCreateForm({ cycleId }: { cycleId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(
    null,
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const form = event.currentTarget;
    const fields = new FormData(form);

    try {
      const response = await fetch(`/api/admin/impact-cycles/${cycleId}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          localName: fields.get('localName'),
          whyItMatters: fields.get('whyItMatters'),
          desiredChange: fields.get('desiredChange'),
          unacceptableChanges: String(fields.get('unacceptableChanges') || '')
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
          goodsDomainMappings: fields.getAll('goodsDomainMappings'),
          desiredDirection: fields.get('desiredDirection'),
          baselineDescription: fields.get('baselineDescription'),
          reviewCadence: fields.get('reviewCadence'),
          nextReviewAt: fields.get('nextReviewAt'),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not add the goal.');

      form.reset();
      setMessage({ kind: 'success', text: 'Private community goal added.' });
      router.refresh();
    } catch (error) {
      setMessage({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Could not add the goal.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <fieldset disabled={submitting} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="localName">What does the community call this goal?</Label>
          <Input id="localName" name="localName" required maxLength={160} />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="whyItMatters">Why does it matter?</Label>
            <Textarea id="whyItMatters" name="whyItMatters" required rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desiredChange">What would meaningful change look like?</Label>
            <Textarea id="desiredChange" name="desiredChange" required rows={4} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unacceptableChanges">What must not happen?</Label>
          <Textarea
            id="unacceptableChanges"
            name="unacceptableChanges"
            rows={3}
            placeholder="One harm, burden or unacceptable trade-off per line"
          />
          <p className="text-xs text-muted-foreground">
            These are guardrails, not negative metrics to optimise away.
          </p>
        </div>
        <details className="rounded-lg border border-border bg-muted/20">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
            Reporting and review details
            <span className="ml-2 font-normal text-muted-foreground">Optional</span>
          </summary>
          <div className="space-y-5 border-t border-border p-4">
            <div className="space-y-2">
              <Label>How does this relate to Goods&apos; shared reporting domains?</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {DOMAINS.map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <input type="checkbox" name="goodsDomainMappings" value={value} />
                    {label}
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                The local goal remains primary; mappings only support comparison.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="desiredDirection">Desired direction</Label>
                <select
                  id="desiredDirection"
                  name="desiredDirection"
                  defaultValue=""
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Not decided</option>
                  <option value="increase">Increase</option>
                  <option value="decrease">Decrease</option>
                  <option value="maintain">Maintain</option>
                  <option value="locally_defined">Locally defined / qualitative</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baselineDescription">What is true now?</Label>
                <Input
                  id="baselineDescription"
                  name="baselineDescription"
                  placeholder="A qualitative baseline is valid"
                />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reviewCadence">Review cadence</Label>
                <Input
                  id="reviewCadence"
                  name="reviewCadence"
                  placeholder="For example: each visit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextReviewAt">Next review</Label>
                <Input id="nextReviewAt" name="nextReviewAt" type="date" />
              </div>
            </div>
          </div>
        </details>
        <Button type="submit">{submitting ? 'Adding…' : 'Add private goal'}</Button>
      </fieldset>
      {message && (
        <p
          role="status"
          className={`text-sm ${message.kind === 'error' ? 'text-red-700' : 'text-emerald-700'}`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
