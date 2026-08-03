'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type CommunityOption = {
  id: string;
  name: string;
  traditional_name: string | null;
  state: string | null;
};

export function ImpactCycleCreateForm({
  communities,
  persistenceReady,
}: {
  communities: CommunityOption[];
  persistenceReady: boolean;
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
    const payload = Object.fromEntries(
      [
        'communityId',
        'title',
        'purpose',
        'localLanguageName',
        'leadOrganisation',
        'authoritySummary',
        'decisionProtocol',
        'dataCustodyPreference',
        'reviewCadence',
        'nextReviewAt',
      ].map((name) => [name, fields.get(name)]),
    );

    try {
      const response = await fetch('/api/admin/impact-cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not create the impact cycle.');

      form.reset();
      setMessage({ kind: 'success', text: 'Private impact cycle created.' });
      router.refresh();
    } catch (error) {
      setMessage({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Could not create the impact cycle.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset disabled={!persistenceReady || submitting} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="communityId">Community</Label>
            <select
              id="communityId"
              name="communityId"
              required
              defaultValue=""
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>
                Select a community
              </option>
              {communities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.traditional_name || community.name}
                  {community.state ? ` — ${community.state}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Cycle name</Label>
            <Input
              id="title"
              name="title"
              required
              maxLength={160}
              placeholder="2026 community production and impact cycle"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose, in the community&apos;s terms</Label>
          <Textarea
            id="purpose"
            name="purpose"
            required
            maxLength={4000}
            rows={4}
            placeholder="What change does the community want this cycle to support, and for whom?"
          />
        </div>

        <details className="rounded-lg border border-border bg-muted/20">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
            Community governance details
            <span className="ml-2 font-normal text-muted-foreground">
              Add now or complete together later
            </span>
          </summary>
          <div className="space-y-5 border-t border-border p-4">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="localLanguageName">Local-language name</Label>
                <Input id="localLanguageName" name="localLanguageName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadOrganisation">Lead community organisation</Label>
                <Input id="leadOrganisation" name="leadOrganisation" />
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="authoritySummary">Who has authority?</Label>
                <Textarea
                  id="authoritySummary"
                  name="authoritySummary"
                  rows={3}
                  placeholder="Name roles or groups, not assumptions about representation."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="decisionProtocol">How are decisions made?</Label>
                <Textarea
                  id="decisionProtocol"
                  name="decisionProtocol"
                  rows={3}
                  placeholder="Describe the agreed review, escalation and approval process."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataCustodyPreference">Data and story custody preference</Label>
              <Textarea
                id="dataCustodyPreference"
                name="dataCustodyPreference"
                rows={3}
                placeholder="Where records should live, who may access them and what must remain local or private."
              />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reviewCadence">Review cadence</Label>
                <Input
                  id="reviewCadence"
                  name="reviewCadence"
                  placeholder="For example: every 8 weeks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextReviewAt">Next community review</Label>
                <Input id="nextReviewAt" name="nextReviewAt" type="date" />
              </div>
            </div>
          </div>
        </details>

        <Button type="submit">{submitting ? 'Creating…' : 'Create private cycle'}</Button>
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
