'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PartnershipFormProps {
  /** Pre-select a partnership type — used when arriving via a product page CTA */
  defaultType?: string;
}

const SEGMENT_OPTIONS = [
  { value: 'foundation', label: 'Foundation or trust' },
  { value: 'corporate', label: 'Corporate / CSR' },
  { value: 'buyer', label: 'Institutional buyer (health, housing, government)' },
  { value: 'investor', label: 'Investor or lender' },
  { value: 'community', label: 'Community organisation' },
  { value: 'other', label: 'Other' },
];

const TIER_OPTIONS = [
  { value: 'exploring', label: 'Just exploring' },
  { value: 'under-25k', label: 'Under $25K' },
  { value: '25-100k', label: '$25K – $100K' },
  { value: '100-500k', label: '$100K – $500K' },
  { value: '500k-plus', label: '$500K+' },
  { value: 'loan', label: 'A loan or recoverable grant' },
];

const TIMELINE_OPTIONS = [
  { value: 'now', label: 'Now / this quarter' },
  { value: 'this-year', label: 'This year' },
  { value: 'future', label: 'Longer view' },
];

export function PartnershipForm({ defaultType }: PartnershipFormProps = {}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    const formData = new FormData(e.currentTarget);

    const payload = {
      organizationName: formData.get('organization_name') as string,
      contactName: formData.get('contact_name') as string,
      contactEmail: formData.get('contact_email') as string,
      contactPhone: (formData.get('contact_phone') as string) || undefined,
      partnerSegment: (formData.get('partner_segment') as string) || undefined,
      fundingTier: (formData.get('funding_tier') as string) || undefined,
      timeline: (formData.get('timeline') as string) || undefined,
      partnershipType: formData.get('partnership_type') as string,
      message: (formData.get('message') as string) || undefined,
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
        <h3 className="text-xl font-bold text-foreground mb-2">Thanks — we&apos;ll be in touch</h3>
        <p className="text-muted-foreground">
          Your message is in. A real person on the Goods team will get back to you within a few
          working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1 — Segment */}
      <fieldset>
        <legend className="block text-sm font-semibold text-foreground mb-3">
          1. What kind of partner are you?
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {SEGMENT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground cursor-pointer transition hover:border-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="radio"
                name="partner_segment"
                value={option.value}
                required
                className="text-primary focus:ring-ring"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Step 2 — Ticket size */}
      <fieldset>
        <legend className="block text-sm font-semibold text-foreground mb-3">
          2. Roughly what size are you thinking?
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {TIER_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground cursor-pointer transition hover:border-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="radio"
                name="funding_tier"
                value={option.value}
                required
                className="text-primary focus:ring-ring"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Step 3 — Timeline */}
      <fieldset>
        <legend className="block text-sm font-semibold text-foreground mb-3">
          3. When are you looking to move?
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {TIMELINE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground cursor-pointer transition hover:border-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="radio"
                name="timeline"
                value={option.value}
                required
                className="text-primary focus:ring-ring"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Identity block */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-foreground mb-1">
            Organisation
          </label>
          <input
            type="text"
            id="organization"
            name="organization_name"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Your organisation"
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
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="contact_email"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@organisation.com"
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

      {/* Hidden partnership_type for back-compat with /api/partnership routing logic */}
      <input
        type="hidden"
        name="partnership_type"
        defaultValue={defaultType || 'partnership-inquiry'}
      />

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
          What would you like to discuss?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Anything you'd like us to know — a community you want to back, a question, a deadline you're working to."
        />
      </div>

      {status === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Start the conversation'}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        We read every message. A real person from the Goods team will reply within a few working days.
      </p>
    </form>
  );
}
