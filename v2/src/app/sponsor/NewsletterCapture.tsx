'use client';

import { useState } from 'react';
import { CREAM, RUST, CHARCOAL, SAGE } from './palette';

// "Not ready to sponsor today?" newsletter capture — funnels browsers who
// don't convert into the comms list. Tagged goods-newsletter +
// goods-src-sponsor-interest so the GHL Smart Router can nurture them.
export default function NewsletterCapture() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('submitting');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail,
          tag: 'sponsor-interest',
          consent: newsletterConsent,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setNewsletterConsent(false);
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <section className="px-5 sm:px-8 py-14 sm:py-16" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: RUST }}>
          Not ready today?
        </p>
        <h2 className="font-display text-2xl sm:text-3xl leading-tight mb-3" style={{ color: CHARCOAL }}>
          Stay in the loop.
        </h2>
        <p className="text-sm sm:text-base mb-6" style={{ color: `${CHARCOAL}cc` }}>
          Get stories and photos from Country as beds reach the families who need them. No spam,
          unsubscribe any time.
        </p>
        {newsletterStatus === 'success' ? (
          <div
            className="rounded-2xl px-5 py-4 text-sm font-medium"
            style={{ backgroundColor: `${SAGE}1A`, border: `1px solid ${SAGE}33`, color: CHARCOAL }}
          >
            You&apos;re in. We&apos;ll keep you posted as beds land on Country.
          </div>
        ) : (
          <form onSubmit={handleNewsletter} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2"
                style={{ backgroundColor: 'white', border: `1px solid ${CHARCOAL}1A`, color: CHARCOAL }}
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'submitting'}
                className="rounded-xl px-6 py-3 text-base font-semibold transition disabled:opacity-50 whitespace-nowrap"
                style={{ backgroundColor: CHARCOAL, color: CREAM }}
              >
                {newsletterStatus === 'submitting' ? 'Subscribing…' : 'Keep me updated'}
              </button>
            </div>
            <label className="flex items-start justify-center gap-2 text-xs" style={{ color: `${CHARCOAL}B3` }}>
              <input
                type="checkbox"
                checked={newsletterConsent}
                onChange={(e) => setNewsletterConsent(e.target.checked)}
                required
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span>
                Yes, email me occasional Goods updates. I can unsubscribe anytime.{' '}
                <a href="/privacy" className="underline underline-offset-2">Privacy</a>
              </span>
            </label>
          </form>
        )}
        {newsletterStatus === 'error' && (
          <p className="mt-3 text-sm" style={{ color: RUST }}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
