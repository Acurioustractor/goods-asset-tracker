'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ObservationOption = {
  id: string;
  title: string;
  speakerName: string | null;
  consentState: string;
  restricted: boolean;
};

type GoalOption = { id: string; localName: string };

export function DeliberationCreateForm({
  cycleId,
  goals,
  observations,
}: {
  cycleId: string;
  goals: GoalOption[];
  observations: ObservationOption[];
}) {
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
    const lines = (name: string) =>
      String(fields.get(name) || '')
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean);

    try {
      const response = await fetch(`/api/admin/impact-cycles/${cycleId}/deliberations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: fields.get('goalId'),
          title: fields.get('title'),
          heldAt: fields.get('heldAt'),
          participantsSummary: fields.get('participantsSummary'),
          authorityBasis: fields.get('authorityBasis'),
          observationIds: fields.getAll('observationIds'),
          whatMatters: fields.get('whatMatters'),
          selectedChange: fields.get('selectedChange'),
          selectionReason: fields.get('selectionReason'),
          dissent: lines('dissent'),
          harmsOrBurdens: lines('harmsOrBurdens'),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not record the reflection.');
      form.reset();
      setMessage({ kind: 'success', text: 'Private community reflection recorded.' });
      router.refresh();
    } catch (error) {
      setMessage({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Could not record the reflection.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (observations.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
        Add at least one evidence observation before recording a group reflection.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <fieldset disabled={submitting} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Reflection title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heldAt">Review date</Label>
            <Input id="heldAt" name="heldAt" type="date" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="goalId">Related community goal</Label>
          <select id="goalId" name="goalId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Whole-cycle reflection</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>{goal.localName}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="participantsSummary">Who participated?</Label>
            <Textarea id="participantsSummary" name="participantsSummary" required rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="authorityBasis">Why was this group authorised to review?</Label>
            <Textarea
              id="authorityBasis"
              name="authorityBasis"
              required
              rows={3}
              placeholder="Who convened the review and how participation was decided"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Evidence considered</Label>
          <div className="grid gap-2">
            {observations.map((observation) => (
              <label
                key={observation.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm"
              >
                <input
                  type="checkbox"
                  name="observationIds"
                  value={observation.id}
                  className="mt-1"
                />
                <span>
                  <span className="font-semibold">{observation.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {observation.speakerName || 'No speaker recorded'} ·{' '}
                    {observation.consentState.replaceAll('_', ' ')}
                    {observation.restricted ? ' · restricted' : ''}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Selecting restricted evidence records that it informed this private review. It does not
            grant permission to publish it.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatMatters">What mattered most to the group?</Label>
          <Textarea id="whatMatters" name="whatMatters" required rows={4} />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="selectedChange">What change should be tried or prioritised?</Label>
            <Textarea id="selectedChange" name="selectedChange" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selectionReason">Why this change?</Label>
            <Textarea id="selectionReason" name="selectionReason" rows={3} />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="harmsOrBurdens">Harms or burdens raised</Label>
            <Textarea id="harmsOrBurdens" name="harmsOrBurdens" rows={3} placeholder="One per line" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dissent">Different or dissenting views</Label>
            <Textarea id="dissent" name="dissent" rows={3} placeholder="One per line; do not force consensus" />
          </div>
        </div>
        <Button type="submit">{submitting ? 'Recording…' : 'Record private reflection'}</Button>
      </fieldset>
      {message && (
        <p role="status" className={`text-sm ${message.kind === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
