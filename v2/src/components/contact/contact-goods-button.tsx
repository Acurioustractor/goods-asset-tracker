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

/**
 * Must stay a subset of CONTACT_SUBJECTS in api/contact/route.ts. A subject not
 * on that allowlist is silently downgraded to General Inquiry, so a typo here
 * costs you the routing without failing anywhere visible.
 */
type Subject =
  | 'General Inquiry'
  | 'Partnership Inquiry'
  | 'Bulk Order Inquiry'
  | 'Facility Funding Inquiry'
  | 'Community Interest';

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

  const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a7363]';
  const field = 'mt-1.5 block w-full rounded-2xl border border-[#e0d7c6] bg-white px-4 py-3 text-base text-goods-ink shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] placeholder:text-[#9a917f] transition-colors focus:border-goods-terracotta focus:outline-none focus:ring-4 focus:ring-goods-terracotta/15';

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
        <div className="fixed inset-0 z-[210] flex items-end justify-center bg-[#16140f]/70 backdrop-blur-sm md:items-center md:p-8" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="flex max-h-[94svh] w-full max-w-3xl flex-col overflow-hidden md:grid rounded-t-[28px] bg-[#FDF8F3] text-goods-ink shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] md:grid-cols-[0.85fr_1.15fr] md:rounded-[28px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Who you are writing to: the ink panel on a wide screen, a short header on a phone. */}
            <div className="relative flex-none bg-goods-ink px-6 pb-6 pt-5 text-goods-cream md:px-8 md:py-9">
              <button type="button" onClick={close} className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-goods-cream/80 hover:bg-white/10 md:hidden" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
              <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-white/25 md:hidden" aria-hidden="true" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">Goods on Country</p>
              <h2 id={titleId} className="mt-2 font-display text-3xl font-semibold leading-[1.05] md:text-4xl">
                {state === 'sent' ? 'Thank you.' : 'Talk to the team.'}
              </h2>
              <ul className="mt-5 hidden space-y-3 text-[15px] leading-snug text-goods-cream/80 md:block">
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-goods-terracotta-light" />It comes straight to the Goods on Country team.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-goods-terracotta-light" />A person reads it and replies by email.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-goods-terracotta-light" />Or write to hi@act.place.</li>
              </ul>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-7 pt-5 md:px-8 md:py-9">
              <div className="mb-2 hidden justify-end md:flex">
                <button type="button" onClick={close} className="-mr-3 -mt-5 flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {state === 'sent' ? (
                <div>
                  <p className="text-lg leading-relaxed text-[#4a4741]">Your message is with the Goods on Country team. A person will reply by email.</p>
                  <button type="button" onClick={close} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-goods-ink px-6 text-sm font-semibold text-goods-cream">
                    Back to the page
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelCls}>Name</span>
                      <input ref={firstField} name="name" required autoComplete="name" className={field} />
                    </label>
                    <label className="block">
                      <span className={labelCls}>Email</span>
                      <input name="email" type="email" required autoComplete="email" inputMode="email" className={field} />
                    </label>
                  </div>
                  <label className="block">
                    <span className={labelCls}>Organisation <span className="normal-case tracking-normal text-[#9a917f]">optional</span></span>
                    <input name="organisation" autoComplete="organization" className={field} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Message</span>
                    <textarea name="message" required rows={4} className={`${field} resize-y leading-relaxed`} />
                  </label>
                  <label className="hidden" aria-hidden="true">
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                  {error && <p className="rounded-xl bg-[#f3e4da] px-3.5 py-2.5 text-sm text-[#8a3b24]" role="alert">{error}</p>}
                  <button type="submit" disabled={state === 'sending'} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-goods-terracotta px-6 text-base font-semibold text-white transition-colors hover:bg-[#a94f35] disabled:opacity-60">
                    {state === 'sending' ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
