'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PartnershipFormProps {
  /** Pre-select a partnership type: used when arriving via a product page CTA */
  defaultType?: string;
}

const SEGMENT_OPTIONS = [
  { value: 'foundation', label: 'Foundation or trust' },
  { value: 'paf-puaf', label: 'PAF / PuAF' },
  { value: 'family-office', label: 'Family office' },
  { value: 'corporate', label: 'Corporate / CSR' },
  { value: 'recoverable-grant', label: 'Recoverable grant' },
  { value: 'patient-debt', label: 'Patient debt' },
  { value: 'institutional-buyer', label: 'Institutional buyer' },
  { value: 'community', label: 'Community organisation' },
  { value: 'other', label: 'Other' },
];

const TIER_OPTIONS = [
  { value: 'exploring', label: 'Just exploring' },
  { value: 'under-25k', label: 'Under $25K' },
  { value: '25-100k', label: '$25K to $100K' },
  { value: '100-500k', label: '$100K to $500K' },
  { value: '500k-plus', label: '$500K+' },
  { value: 'recoverable', label: 'Recoverable funding' },
  { value: 'patient-debt', label: 'Patient debt' },
];

const TIMELINE_OPTIONS = [
  { value: 'now', label: 'Now / this quarter' },
  { value: 'this-year', label: 'This year' },
  { value: 'future', label: 'Longer view' },
];

const inputClass =
  'w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';
const radioLabelClass =
  'flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground cursor-pointer transition hover:border-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5';

/**
 * Two-stage partnership form.
 *
 * Stage 1 is the lowest-friction lead capture: who you are and how to reach
 * you. The qualifying questions (ticket size, timeline) used to be required
 * up front and were costing submissions, so they now live in Stage 2, shown
 * only AFTER the lead is captured. Stage 2 is optional and enriches the same
 * inquiry via PATCH (no duplicate row). If someone bails at Stage 2, we still
 * have them.
 */
export function PartnershipForm({ defaultType }: PartnershipFormProps = {}) {
  const [stage, setStage] = useState<1 | 2 | 'done'>(1);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');
  const [inquiryId, setInquiryId] = useState<string | null>(null);

  // Stage 1 fields
  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [partnerSegment, setPartnerSegment] = useState('');
  const [message, setMessage] = useState('');

  // Stage 2 fields (optional enrichment)
  const [fundingTier, setFundingTier] = useState('');
  const [timeline, setTimeline] = useState('');

  const submitStageOne = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const response = await fetch('/api/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName,
          contactName,
          contactEmail,
          contactPhone: contactPhone || undefined,
          partnerSegment: partnerSegment || undefined,
          partnershipType: defaultType || 'partnership-inquiry',
          message: message || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit');

      // Lead is captured. Offer the optional enrichment only if we have a row
      // to attach it to; otherwise we're already done.
      if (data.inquiryId) {
        setInquiryId(data.inquiryId as string);
        setStatus('idle');
        setStage(2);
      } else {
        setStage('done');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    }
  };

  const submitStageTwo = async () => {
    // Best-effort enrichment: the lead is already in. Never block 'done' on it.
    setStatus('submitting');
    try {
      if (inquiryId && (fundingTier || timeline)) {
        await fetch('/api/partnership', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inquiryId, fundingTier: fundingTier || undefined, timeline: timeline || undefined }),
        });
      }
    } catch {
      // swallow: enrichment is optional
    } finally {
      setStage('done');
    }
  };

  if (stage === 'done') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Thanks, we&apos;ll be in touch</h3>
        <p className="text-muted-foreground">
          Your message is in. A real person on the Goods team will get back to you within a few
          working days.
        </p>
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div className="space-y-8">
        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
          <p className="text-sm font-semibold text-foreground">You&apos;re in. We&apos;ve got your details.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Two optional questions to help us come back with the right capital pathway. Skip them
            if you&apos;d rather just talk.
          </p>
        </div>

        <fieldset>
          <legend className="block text-sm font-semibold text-foreground mb-3">
            Roughly what size or structure are you thinking?
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {TIER_OPTIONS.map((option) => (
              <label key={option.value} className={radioLabelClass}>
                <input
                  type="radio"
                  name="funding_tier"
                  value={option.value}
                  checked={fundingTier === option.value}
                  onChange={(e) => setFundingTier(e.target.value)}
                  className="text-primary focus:ring-ring"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="block text-sm font-semibold text-foreground mb-3">
            When are you looking to move?
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {TIMELINE_OPTIONS.map((option) => (
              <label key={option.value} className={radioLabelClass}>
                <input
                  type="radio"
                  name="timeline"
                  value={option.value}
                  checked={timeline === option.value}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="text-primary focus:ring-ring"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            size="lg"
            className="flex-1"
            disabled={status === 'submitting'}
            onClick={submitStageTwo}
          >
            {status === 'submitting' ? 'Sending…' : 'Send these too'}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="flex-1"
            disabled={status === 'submitting'}
            onClick={() => setStage('done')}
          >
            All done
          </Button>
        </div>
      </div>
    );
  }

  // Stage 1: lead capture
  return (
    <form onSubmit={submitStageOne} className="space-y-8">
      {/* Identity block: the essentials, captured first */}
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
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className={inputClass}
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
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className={inputClass}
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
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={inputClass}
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
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className={inputClass}
            placeholder="04XX XXX XXX"
          />
        </div>
      </div>

      {/* Segment: optional, a quick single choice that routes the lead */}
      <fieldset>
        <legend className="block text-sm font-semibold text-foreground mb-3">
          What kind of capital path fits you? <span className="text-muted-foreground/70 font-normal">(optional)</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {SEGMENT_OPTIONS.map((option) => (
            <label key={option.value} className={radioLabelClass}>
              <input
                type="radio"
                name="partner_segment"
                value={option.value}
                checked={partnerSegment === option.value}
                onChange={(e) => setPartnerSegment(e.target.value)}
                className="text-primary focus:ring-ring"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
          What would you like to discuss? <span className="text-muted-foreground/70 font-normal">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
          placeholder="Anything you'd like us to know: your mandate, timing, a community you want to back, or a question we should answer first."
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
