'use client';

/**
 * An enquiry written on the page, not in a pop-up: an organisation ordering beds, or a community
 * asking about a facility. It posts to /api/contact, the same route as /contact and the Contact
 * button, so it lands as a GHL contact (act-inquiry, project-goods, and the subject's own tag), in
 * GHL Conversations, and in the team inbox. The answers are written into the message as labelled
 * lines so the team can act on them without opening anything else. Analytics counts only events.
 */

import { useId, useState, type FormEvent } from 'react';
import { trackContactEvent } from '@/lib/analytics/contact';

export interface EnquiryField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select';
  required?: boolean;
  options?: readonly string[];
  hint?: string;
  autoComplete?: string;
  half?: boolean;
}

export function EnquiryForm({
  kind,
  subject,
  fields,
  submitLabel,
  sentTitle,
  sentLine,
  dark = false,
}: {
  kind: 'beds' | 'facilities' | 'sell-beds';
  subject: 'Bulk Order Inquiry' | 'Partnership Inquiry';
  fields: readonly EnquiryField[];
  submitLabel: string;
  sentTitle: string;
  sentLine: string;
  dark?: boolean;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const id = useId();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (String(data.get('website') ?? '').trim()) return setState('sent');
    setState('sending');
    setError(null);
    const value = (n: string) => String(data.get(n) ?? '').trim();
    const lines = fields
      .filter((f) => !['name', 'email', 'phone', 'organisation', 'message'].includes(f.name) && value(f.name))
      .map((f) => `${f.label}: ${value(f.name)}`);
    const message = [`Sent from ${window.location.pathname} (${{ beds: 'organisation bed order', facilities: 'facility enquiry', 'sell-beds': 'community stock enquiry' }[kind]})`, '', ...lines, ...(value('message') ? ['', value('message')] : [])].join('\n');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value('name'), email: value('email'), phone: value('phone') || undefined, organisation: value('organisation') || undefined, subject, message }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || 'We could not send that. Please try again, or email hi@act.place.');
      setState('sent');
      trackContactEvent('contact_form_submitted', kind, subject);
    } catch (err) {
      setState('failed');
      setError(err instanceof Error ? err.message : 'We could not send that. Please email hi@act.place.');
      trackContactEvent('contact_form_failed', kind, subject);
    }
  };

  const ink = dark ? 'text-goods-cream' : 'text-goods-ink';
  const soft = dark ? 'text-goods-cream/70' : 'text-[#7a7363]';
  const labelCls = `text-[11px] font-semibold uppercase tracking-[0.16em] ${soft}`;
  const field = `mt-1.5 block w-full rounded-2xl border px-4 py-3 text-base transition-colors focus:outline-none focus:ring-4 ${dark ? 'border-white/15 bg-white/5 text-goods-cream placeholder:text-goods-cream/40 focus:border-goods-terracotta-light focus:ring-goods-terracotta/25' : 'border-[#e0d7c6] bg-white text-goods-ink placeholder:text-[#9a917f] focus:border-goods-terracotta focus:ring-goods-terracotta/15'}`;

  if (state === 'sent') {
    return (
      <div role="status" className={`rounded-[24px] border p-8 ${dark ? 'border-white/15 bg-white/5' : 'border-[#e6dfd1] bg-white'}`}>
        <p className={`font-display text-3xl font-semibold ${ink}`}>{sentTitle}</p>
        <p className={`mt-3 text-lg leading-relaxed ${dark ? 'text-goods-cream/85' : 'text-[#4a4741]'}`}>{sentLine}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      onFocus={() => {
        if (started) return;
        setStarted(true);
        trackContactEvent('contact_form_viewed', kind, subject);
      }}
      className="grid gap-5 sm:grid-cols-2"
      aria-describedby={`${id}-note`}
    >
      {fields.map((f) => (
        <label key={f.name} className={`block ${f.half ? '' : 'sm:col-span-2'}`}>
          <span className={labelCls}>
            {f.label}
            {!f.required && <span className="ml-1.5 normal-case tracking-normal opacity-70">optional</span>}
          </span>
          {f.type === 'textarea' ? (
            <textarea name={f.name} required={f.required} rows={4} className={`${field} resize-y leading-relaxed`} />
          ) : f.type === 'select' ? (
            <select name={f.name} required={f.required} defaultValue="" className={field}>
              <option value="" disabled>Choose one</option>
              {f.options?.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input name={f.name} type={f.type ?? 'text'} required={f.required} autoComplete={f.autoComplete} inputMode={f.type === 'number' ? 'numeric' : f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : undefined} min={f.type === 'number' ? 1 : undefined} className={field} />
          )}
          {f.hint && <span className={`mt-1.5 block text-sm ${soft}`}>{f.hint}</span>}
        </label>
      ))}
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      {error && (
        <p role="alert" className="rounded-xl bg-[#f3e4da] px-4 py-3 text-sm text-[#8a3b24] sm:col-span-2">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" disabled={state === 'sending'} className="inline-flex min-h-12 items-center justify-center rounded-full bg-goods-terracotta px-7 text-base font-semibold text-white transition-colors hover:bg-[#a94f35] disabled:opacity-60">
          {state === 'sending' ? 'Sending…' : submitLabel}
        </button>
        <p id={`${id}-note`} className={`text-sm ${soft}`}>
          It comes straight to the Goods on Country team, and a person replies by email.
        </p>
      </div>
    </form>
  );
}
