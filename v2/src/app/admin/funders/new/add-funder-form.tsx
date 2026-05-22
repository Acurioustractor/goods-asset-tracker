'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addFunder } from '../actions';

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export function AddFunderForm({ communities }: { communities: string[] }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [contactName, setContactName] = useState('');
  const [totalAud, setTotalAud] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [unitLabel, setUnitLabel] = useState('beds');
  const [paidToDateAud, setPaidToDateAud] = useState('');
  const [toBePaidAud, setToBePaidAud] = useState('');
  const [grantReference, setGrantReference] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactPersonEmail, setContactPersonEmail] = useState('');
  const [contactPersonPhone, setContactPersonPhone] = useState('');
  const [photoTagsCsv, setPhotoTagsCsv] = useState('');
  const [community, setCommunity] = useState('');

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const totalAudNum = parseFloat(totalAud);
  const reportShape = !Number.isNaN(totalAudNum) && totalAudNum >= 100000
    ? 'Long-form (Snow-style: 11 sections)'
    : 'Short visual deck (Centrecorp-style: 12 sections)';
  const effectiveSlug = autoSlug ? slugify(displayName) : slug;
  const defaultTagPreview = effectiveSlug ? `${effectiveSlug}-funded` : '(slug-funded)';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const res = await addFunder({
        displayName,
        slug: effectiveSlug,
        contactName,
        totalAud: parseFloat(totalAud),
        totalUnits: totalUnits ? parseInt(totalUnits, 10) : undefined,
        unitLabel: unitLabel || undefined,
        paidToDateAud: paidToDateAud ? parseFloat(paidToDateAud) : undefined,
        toBePaidAud: toBePaidAud ? parseFloat(toBePaidAud) : undefined,
        grantReference: grantReference || undefined,
        contactPersonName: contactPersonName || undefined,
        contactPersonEmail: contactPersonEmail || undefined,
        contactPersonPhone: contactPersonPhone || undefined,
        photoTagsCsv,
        community: community || undefined,
      });
      if (res.ok) {
        router.push('/admin/funders');
      } else {
        setErr(res.error || 'Unknown error');
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-lg border bg-white p-6">
      <Section title="Identity">
        <Field label="Display name" required>
          <input
            type="text"
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); if (autoSlug) setSlug(slugify(e.target.value)); }}
            placeholder="e.g. Centrebuild Pty Ltd"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Slug (URL key)" sub={`Auto: ${effectiveSlug || '—'}`}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={effectiveSlug}
              onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
              placeholder="centrebuild"
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm font-mono"
            />
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-500">
              <input type="checkbox" checked={autoSlug} onChange={(e) => setAutoSlug(e.target.checked)} className="h-3.5 w-3.5" />
              auto
            </label>
          </div>
        </Field>
        <Field label="Xero contact name" required sub="Exact match to xero_invoices.contact_name for revenue tracking">
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="e.g. Centrebuild Pty Ltd"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
      </Section>

      <Section title="Commitment">
        <Field label="Total commitment ($ AUD ex-GST)" required>
          <input
            type="number"
            value={totalAud}
            onChange={(e) => setTotalAud(e.target.value)}
            placeholder="100000"
            min="0"
            step="1000"
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {totalAud && (
            <p className="mt-1 text-xs text-amber-700">→ Report shape: <strong>{reportShape}</strong></p>
          )}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Total units (optional)" sub="e.g. 100 beds">
            <input
              type="number"
              value={totalUnits}
              onChange={(e) => setTotalUnits(e.target.value)}
              placeholder="100"
              min="0"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Unit label" sub="e.g. beds / workshops">
            <input
              type="text"
              value={unitLabel}
              onChange={(e) => setUnitLabel(e.target.value)}
              placeholder="beds"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Paid to date ($, optional)">
            <input
              type="number"
              value={paidToDateAud}
              onChange={(e) => setPaidToDateAud(e.target.value)}
              min="0"
              step="1000"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="To be paid ($, optional)">
            <input
              type="number"
              value={toBePaidAud}
              onChange={(e) => setToBePaidAud(e.target.value)}
              min="0"
              step="1000"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>
        </div>
        <Field label="Grant reference (optional)" sub="e.g. 2024/OC0014">
          <input
            type="text"
            value={grantReference}
            onChange={(e) => setGrantReference(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </Field>
      </Section>

      <Section title="Funder contact (optional)">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Contact name">
            <input
              type="text"
              value={contactPersonName}
              onChange={(e) => setContactPersonName(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={contactPersonEmail}
              onChange={(e) => setContactPersonEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              value={contactPersonPhone}
              onChange={(e) => setContactPersonPhone(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </Field>
        </div>
      </Section>

      <Section title="Reporting scope">
        <Field label="Photo tags (comma-separated)" sub={`Empty → defaults to "${defaultTagPreview}". EL stories matching any of these tags fill the photo grid.`}>
          <input
            type="text"
            value={photoTagsCsv}
            onChange={(e) => setPhotoTagsCsv(e.target.value)}
            placeholder="e.g. centrebuild-funded, trip-may-2026"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono"
          />
        </Field>
        <Field label="Community scope (optional)" sub="If set, every metric (beds delivered, communities served, etc.) scopes to this community. Leave empty for all-Goods.">
          <select
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">— All Goods (no scope) —</option>
            {communities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
      </Section>

      {err && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{err}</p>}

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {saving ? 'Adding…' : 'Add funder'}
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
