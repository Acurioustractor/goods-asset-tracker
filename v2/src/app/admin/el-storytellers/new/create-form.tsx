'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStoryteller, type CreateStorytellerInput } from './actions';

export function CreateStorytellerForm({ communities }: { communities: string[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; slug?: string } | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [location, setLocation] = useState('');
  const [culturalBackground, setCulturalBackground] = useState('');
  const [isElder, setIsElder] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [consentSource, setConsentSource] = useState<CreateStorytellerInput['consentSource']>('direct-recipient');
  const [consentDetails, setConsentDetails] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await createStoryteller({
        displayName,
        bio: bio || undefined,
        avatarUrl: avatarUrl || undefined,
        location: location || undefined,
        culturalBackground: culturalBackground || undefined,
        isElder,
        isFeatured,
        consentSource,
        consentDetails: consentDetails || undefined,
      });
      if (res.ok) {
        setResult({
          ok: true,
          message: `Created ${res.displayName}. Use storytellerSlug: '${res.slug}' on any voice card to auto-link.`,
          slug: res.slug,
        });
        setTimeout(() => router.push('/admin/el-storytellers'), 2500);
      } else {
        setResult({ ok: false, message: res.error || 'Unknown error' });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-lg border bg-white p-6">
      <Section title="Identity">
        <Field label="Display name" required sub="Public-facing name. Slug auto-generated from this.">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Ray Nelson"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Bio (optional)" sub="One paragraph. Public on /storytellers/[slug].">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Ray is a senior man from Utopia Homelands who…"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Avatar URL (optional)" sub="Pasted URL. EL storage upload happens separately.">
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
      </Section>

      <Section title="Place + culture">
        <Field label="Community (optional)" sub="Pick from canonical Goods communities.">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">— Pick a community —</option>
            {communities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Cultural background (optional)" sub="e.g. 'Anmatyerr', 'Alyawarr', 'Warumungu'. Free text.">
          <input
            type="text"
            value={culturalBackground}
            onChange={(e) => setCulturalBackground(e.target.value)}
            placeholder="Anmatyerr"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isElder} onChange={(e) => setIsElder(e.target.checked)} />
            Elder
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Featured (shows higher in lists)
          </label>
        </div>
      </Section>

      <Section title="Consent capture">
        <Field
          label="Consent source"
          sub="How was consent captured? This routes to the CONSENT_PROCESS.md workflow."
          required
        >
          <select
            value={consentSource}
            onChange={(e) => setConsentSource(e.target.value as CreateStorytellerInput['consentSource'])}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="direct-recipient">Direct from recipient</option>
            <option value="family-guardian">Family / guardian (under-18 or hold)</option>
            <option value="oonchiumpa">Via Oonchiumpa (cultural facilitator)</option>
            <option value="team-internal">Goods team internal note (not for public)</option>
          </select>
        </Field>
        <Field label="Consent notes (optional)" sub="Free text. When, who confirmed, scope of sharing.">
          <textarea
            value={consentDetails}
            onChange={(e) => setConsentDetails(e.target.value)}
            rows={3}
            placeholder="Captured 2026-05-22 by [name] via [channel]. Scope: Goods + funder reports OK; not for external press without re-confirmation."
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
        <p className="rounded border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
          <strong>Important:</strong> this form creates the record as{' '}
          <code className="rounded bg-white px-1">is_active=false</code>. You still need to verify
          consent + flip the flag in EL before they appear publicly.
        </p>
      </Section>

      {result && (
        <div className={`rounded border p-3 text-sm ${result.ok ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-red-300 bg-red-50 text-red-900'}`}>
          {result.ok ? '✓' : '✗'} {result.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {busy ? 'Creating…' : 'Create storyteller'}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, sub, required, children }: { label: string; sub?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-700">
        {label}{required && <span className="ml-0.5 text-red-600">*</span>}
      </span>
      {children}
      {sub && <p className="mt-1 text-[11px] text-gray-500">{sub}</p>}
    </label>
  );
}
