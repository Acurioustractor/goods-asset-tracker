'use client';

/**
 * One button that lets anyone reach Goods on Country from any page. It opens a short form (name,
 * email, organisation, message) and posts to /api/contact, the same route as the /contact page:
 * a durable receipt first, then the GHL contact with the act-inquiry and project-goods tags, the
 * message threaded into GHL Conversations, and a copy to the team inbox (hi@act.place). The
 * page it was sent from is written at the top of the message so the team knows the context.
 *
 * Drop it anywhere:
 *   <ContactGoodsButton />                                   a small pill
 *   <ContactGoodsButton variant="solid" label="Talk to us" /> a large terracotta button
 *   <ContactGoodsButton subject="Partnership Inquiry" />      tags the enquiry for partners
 *
 * On a phone the form rises as a sheet from the bottom; on a wide screen it sits in the middle.
 * Only aggregate events reach analytics: no names, emails or messages.
 */

import { Mail, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { trackContactEvent } from '@/lib/analytics/contact';

type Subject = 'General Inquiry' | 'Partnership Inquiry' | 'Bulk Order Inquiry';

export function ContactGoodsButton({
  label = 'Contact Goods',
  variant = 'pill',
  subject = 'General Inquiry',
  from,
  className = '',
}: {
  label?: string;
  variant?: 'pill' | 'solid';
  subject?: Subject;
  /** Where the message came from, for the team. Defaults to the page address. */
  from?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const titleId = useId();

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    trackContactEvent('contact_form_viewed', 'pitch');
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // A field people never see; anything in it is a bot, so pretend it went.
    if (String(data.get('website') ?? '').trim()) {
      setState('sent');
      return;
    }
    setState('sending');
    setError(null);
    const page = from ?? `${window.location.pathname}${window.location.hash}`;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          organisation: String(data.get('organisation') ?? '') || undefined,
          subject,
          message: `Sent from ${page}\n\n${String(data.get('message') ?? '')}`,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || 'We could not send that. Please try again, or email hi@act.place.');
      setState('sent');
      trackContactEvent('contact_form_submitted', 'pitch', subject);
    } catch (err) {
      setState('failed');
      setError(err instanceof Error ? err.message : 'We could not send that. Please email hi@act.place.');
      trackContactEvent('contact_form_failed', 'pitch', subject);
    }
  };

  const field = 'mt-1 block w-full rounded-xl border border-[#d9d0bf] bg-white px-3.5 py-2.5 text-base text-goods-ink placeholder:text-[#9a917f] focus:border-goods-terracotta focus:outline-none focus:ring-2 focus:ring-goods-terracotta/30';

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setState('idle');
          setOpen(true);
        }}
        aria-haspopup="dialog"
        className={
          variant === 'solid'
            ? `inline-flex min-h-11 items-center gap-2 rounded-full bg-goods-terracotta px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a94f35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-cream ${className}`
            : `inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-goods-terracotta px-4 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] transition-colors hover:bg-[#a94f35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goods-terracotta ${className}`
        }
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[210] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-goods-cream p-6 text-goods-ink shadow-2xl sm:rounded-[28px] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Goods on Country</p>
                <h2 id={titleId} className="mt-1 font-display text-3xl font-semibold leading-tight">
                  {state === 'sent' ? 'Thank you.' : 'Get in touch.'}
                </h2>
              </div>
              <button type="button" onClick={close} className="flex h-11 w-11 flex-none items-center justify-center rounded-full hover:bg-black/5" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {state === 'sent' ? (
              <div className="mt-4">
                <p className="text-lg leading-relaxed text-[#4a4741]">Your message is with the Goods on Country team. We will get back to you.</p>
                <button type="button" onClick={close} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-goods-ink px-6 text-sm font-semibold text-goods-cream">
                  Back to the page
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">
                    Name
                    <input ref={firstField} name="name" required autoComplete="name" className={field} />
                  </label>
                  <label className="block text-sm font-semibold">
                    Email
                    <input name="email" type="email" required autoComplete="email" inputMode="email" className={field} />
                  </label>
                </div>
                <label className="block text-sm font-semibold">
                  Organisation <span className="font-normal text-[#7a7363]">(optional)</span>
                  <input name="organisation" autoComplete="organization" className={field} />
                </label>
                <label className="block text-sm font-semibold">
                  Message
                  <textarea name="message" required rows={4} className={`${field} resize-y`} />
                </label>
                <label className="hidden" aria-hidden="true">
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
                {error && <p className="rounded-xl bg-[#f3e4da] px-3.5 py-2.5 text-sm text-[#8a3b24]" role="alert">{error}</p>}
                <button type="submit" disabled={state === 'sending'} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-goods-terracotta px-6 text-base font-semibold text-white transition-colors hover:bg-[#a94f35] disabled:opacity-60 sm:w-auto">
                  {state === 'sending' ? 'Sending…' : 'Send'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
