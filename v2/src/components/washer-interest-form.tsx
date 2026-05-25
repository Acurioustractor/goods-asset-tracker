'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const ROLE_OPTIONS = [
  { value: 'community', label: 'Community member / family' },
  { value: 'health', label: 'Clinic or health service' },
  { value: 'council', label: 'Council / shire / land council' },
  { value: 'school', label: 'School or homelands learning centre' },
  { value: 'org', label: 'Community organisation' },
  { value: 'other', label: 'Other' },
];

const QUANTITY_OPTIONS = [
  { value: 'one', label: 'Just one' },
  { value: 'few', label: '2 to 5' },
  { value: 'several', label: '5 to 10' },
  { value: 'many', label: '10 or more' },
  { value: 'unsure', label: 'Not sure yet' },
];

const TIMING_OPTIONS = [
  { value: 'now', label: 'As soon as possible' },
  { value: 'this-year', label: 'This year' },
  { value: 'exploring', label: 'Just exploring' },
];

export function WasherInterestForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    const formData = new FormData(e.currentTarget);

    const role = formData.get('role') as string;
    const quantity = formData.get('quantity') as string;
    const timing = formData.get('timing') as string;
    const community = formData.get('community') as string;
    const note = (formData.get('note') as string) || '';

    // Pack the washer-specific answers into the message body so the API stashes
    // them in the GHL contact note (the partnership API doesn't have dedicated
    // columns for washer fields yet).
    const messageLines = [
      role ? `Role: ${ROLE_OPTIONS.find((o) => o.value === role)?.label || role}` : null,
      quantity ? `How many machines: ${QUANTITY_OPTIONS.find((o) => o.value === quantity)?.label || quantity}` : null,
      timing ? `Timing: ${TIMING_OPTIONS.find((o) => o.value === timing)?.label || timing}` : null,
      note ? `\nNote:\n${note}` : null,
    ].filter(Boolean);

    const payload = {
      organizationName: community,
      contactName: formData.get('contact_name') as string,
      contactEmail: formData.get('contact_email') as string,
      contactPhone: (formData.get('contact_phone') as string) || undefined,
      partnershipType: 'washer-interest',
      message: messageLines.join('\n') || undefined,
    };

    try {
      const response = await fetch('/api/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Thanks — you&apos;re on the list</h3>
        <p className="text-muted-foreground">
          We&apos;ll be in touch as soon as Pakkimjalki Kari is ready, or sooner if we have
          questions about your community.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Identity */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="community" className="block text-sm font-medium text-foreground mb-1">
            Community or organisation
          </label>
          <input
            type="text"
            id="community"
            name="community"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g. Tennant Creek, Maningrida, Palm Island"
          />
        </div>

        <div>
          <label htmlFor="contact_name" className="block text-sm font-medium text-foreground mb-1">
            Your name
          </label>
          <input
            type="text"
            id="contact_name"
            name="contact_name"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="First and last"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
            What&apos;s your role? <span className="text-muted-foreground/70 font-normal">(optional)</span>
          </label>
          <select
            id="role"
            name="role"
            defaultValue=""
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Choose one…</option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact_email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            id="contact_email"
            name="contact_email"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-foreground mb-1">
            Phone <span className="text-muted-foreground/70 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            id="contact_phone"
            name="contact_phone"
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="04XX XXX XXX"
          />
        </div>
      </div>

      {/* Sizing */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-1">
            About how many machines? <span className="text-muted-foreground/70 font-normal">(optional)</span>
          </label>
          <select
            id="quantity"
            name="quantity"
            defaultValue=""
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Choose one…</option>
            {QUANTITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="timing" className="block text-sm font-medium text-foreground mb-1">
            When? <span className="text-muted-foreground/70 font-normal">(optional)</span>
          </label>
          <select
            id="timing"
            name="timing"
            defaultValue=""
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Choose one…</option>
            {TIMING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-foreground mb-1">
          Anything else we should know? <span className="text-muted-foreground/70 font-normal">(optional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="What kind of laundry needs do you have? Existing machines? Power and water set-up?"
        />
      </div>

      {status === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Register interest'}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Pakkimjalki Kari is still a prototype. We&apos;ll get back to you when we have testing
        results to share or a machine ready for your community.
      </p>
    </form>
  );
}
