'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PartnershipForm() {
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
      partnershipType: formData.get('partnership_type') as string,
      message: formData.get('message') as string || undefined,
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
        <h3 className="text-xl font-bold text-foreground mb-2">Thank You</h3>
        <p className="text-muted-foreground">
          We&apos;ve received your expression of interest and will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-foreground mb-1">
          Organisation Name
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
          Contact Name
        </label>
        <input
          type="text"
          id="contact_name"
          name="contact_name"
          required
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Your name"
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
        <label htmlFor="partnership_type" className="block text-sm font-medium text-foreground mb-1">
          Partnership Type
        </label>
        <select
          id="partnership_type"
          name="partnership_type"
          required
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select an option</option>
          <option value="sponsor">Sponsor Beds</option>
          <option value="license">License the Model</option>
          <option value="distribution">Distribution Partner</option>
          <option value="grant">Grant or Investment</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Tell us about your interest..."
        />
      </div>
      {status === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting...' : 'Submit Expression of Interest'}
      </Button>
    </form>
  );
}
