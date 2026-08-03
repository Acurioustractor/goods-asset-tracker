'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type GoalOption = { id: string; localName: string };

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm';

export function ObservationCreateForm({
  cycleId,
  goals,
}: {
  cycleId: string;
  goals: GoalOption[];
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
      const response = await fetch(`/api/admin/impact-cycles/${cycleId}/observations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId: fields.get('goalId'),
          observationType: fields.get('observationType'),
          title: fields.get('title'),
          description: fields.get('description'),
          occurredAt: fields.get('occurredAt'),
          direction: fields.get('direction'),
          evidenceSystem: fields.get('evidenceSystem'),
          evidenceType: fields.get('evidenceType'),
          evidenceExternalId: fields.get('evidenceExternalId'),
          evidenceUrl: fields.get('evidenceUrl'),
          evidenceVersion: fields.get('evidenceVersion'),
          evidenceStrength: fields.get('evidenceStrength'),
          sourceStartSeconds: fields.get('sourceStartSeconds'),
          sourceEndSeconds: fields.get('sourceEndSeconds'),
          speakerName: fields.get('speakerName'),
          speakerStorytellerId: fields.get('speakerStorytellerId'),
          consentState: fields.get('consentState'),
          consentBasis: fields.get('consentBasis'),
          approvedPurposes: lines('approvedPurposes'),
          approvedAudiences: lines('approvedAudiences'),
          claimBoundary: fields.get('claimBoundary'),
          restricted: fields.get('restricted') === 'on',
          followUpNeeded: fields.get('followUpNeeded') === 'on',
          followUpOn: fields.get('followUpOn'),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not add the observation.');
      form.reset();
      setMessage({ kind: 'success', text: 'Private evidence added.' });
      router.refresh();
    } catch (error) {
      setMessage({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Could not add the observation.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <fieldset disabled={submitting} className="space-y-5">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-semibold">Quick capture</p>
          <p className="mt-1 text-emerald-800">
            Six decisions are enough. Keep it private; technical source details can be added only
            when useful.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="goalId">1. What goal does this relate to?</Label>
            <select id="goalId" name="goalId" className={selectClass}>
              <option value="">The whole cycle</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.localName}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="observationType">2. What kind of evidence is it?</Label>
            <select
              id="observationType"
              name="observationType"
              defaultValue="participant_account"
              className={selectClass}
            >
              <option value="participant_account">Someone&apos;s account</option>
              <option value="reflection">Individual reflection</option>
              <option value="operational_event">Something Goods recorded</option>
              <option value="measurement">A measurement</option>
              <option value="group_deliberation">A group reflection</option>
              <option value="document">A document</option>
              <option value="external_verification">Independent verification</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">3. Give it a short name</Label>
            <Input id="title" name="title" required placeholder="Participant learned to pack the bed" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="occurredAt">When did it happen?</Label>
            <Input id="occurredAt" name="occurredAt" type="date" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">4. What happened or what was said?</Label>
          <Textarea id="description" name="description" required rows={4} />
          <p className="text-xs text-muted-foreground">
            Summarise faithfully. Use exact quotes only after the transcript has been checked.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="speakerName">5. Who did it come from?</Label>
            <Input id="speakerName" name="speakerName" placeholder="Identity pending is valid" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consentState">Can this voice be used?</Label>
            <select id="consentState" name="consentState" defaultValue="pending" className={selectClass}>
              <option value="pending">Not reviewed yet</option>
              <option value="user_attested">Standing permission confirmed</option>
              <option value="approved">Approved for specific uses</option>
              <option value="restricted">Keep restricted</option>
              <option value="declined">Leave this out</option>
              <option value="revoked">Permission withdrawn</option>
              <option value="not_required">Permission not required</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="claimBoundary">6. What does this evidence not prove?</Label>
          <Textarea
            id="claimBoundary"
            name="claimBoundary"
            required
            rows={3}
            placeholder="One reported learning moment, not sustained local capability."
          />
        </div>

        <details className="rounded-lg border border-border bg-muted/20">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
            Source and governance details
            <span className="ml-2 font-normal text-muted-foreground">Optional</span>
          </summary>
          <div className="space-y-5 border-t border-border p-4">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="evidenceSystem">Where is the original?</Label>
                <select
                  id="evidenceSystem"
                  name="evidenceSystem"
                  defaultValue="community_impact_cycle"
                  className={selectClass}
                >
                  <option value="community_impact_cycle">Captured in this cycle</option>
                  <option value="empathy_ledger">Empathy Ledger</option>
                  <option value="goods">Goods</option>
                  <option value="external">External</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidenceType">Source type</Label>
                <Input
                  id="evidenceType"
                  name="evidenceType"
                  required
                  defaultValue="reflection_note"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidenceStrength">Evidence strength</Label>
                <select
                  id="evidenceStrength"
                  name="evidenceStrength"
                  defaultValue="direct_participant_account"
                  className={selectClass}
                >
                  <option value="direct_participant_account">Direct participant account</option>
                  <option value="direct_operational_record">Direct operational record</option>
                  <option value="corroborated_account">Corroborated account</option>
                  <option value="repeated_independent_accounts">Repeated independent accounts</option>
                  <option value="community_deliberation">Community deliberation</option>
                  <option value="documentary_evidence">Documentary evidence</option>
                  <option value="independent_substantiation">Independent substantiation</option>
                  <option value="evaluator_interpretation">Evaluator interpretation</option>
                  <option value="plausible_contribution">Plausible contribution</option>
                  <option value="causal_estimate">Causal estimate</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="evidenceExternalId">Source ID</Label>
                <Input id="evidenceExternalId" name="evidenceExternalId" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidenceUrl">Private source URL</Label>
                <Input id="evidenceUrl" name="evidenceUrl" type="url" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="evidenceVersion">Version</Label>
                <Input id="evidenceVersion" name="evidenceVersion" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sourceStartSeconds">Start time (seconds)</Label>
                <Input id="sourceStartSeconds" name="sourceStartSeconds" type="number" min="0" step="0.1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourceEndSeconds">End time (seconds)</Label>
                <Input id="sourceEndSeconds" name="sourceEndSeconds" type="number" min="0" step="0.1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="speakerStorytellerId">Empathy Ledger storyteller ID</Label>
                <Input id="speakerStorytellerId" name="speakerStorytellerId" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consentBasis">Permission basis</Label>
              <Input id="consentBasis" name="consentBasis" placeholder="Who confirmed what, and when?" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="approvedPurposes">Approved purposes</Label>
                <Textarea id="approvedPurposes" name="approvedPurposes" rows={3} placeholder="One per line" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approvedAudiences">Approved audiences</Label>
                <Textarea id="approvedAudiences" name="approvedAudiences" rows={3} placeholder="One per line" />
              </div>
            </div>
            <div className="flex flex-wrap gap-5 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="restricted" defaultChecked />
                Keep private
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="followUpNeeded" />
                Follow-up needed
              </label>
              <div className="flex items-center gap-2">
                <Label htmlFor="followUpOn">Follow up on</Label>
                <Input id="followUpOn" name="followUpOn" type="date" className="w-auto" />
              </div>
            </div>
            <input type="hidden" name="direction" value="" />
          </div>
        </details>

        <Button type="submit">{submitting ? 'Adding…' : 'Add private evidence'}</Button>
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
