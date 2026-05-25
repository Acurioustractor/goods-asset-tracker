'use client';

import { useState } from 'react';

type State = 'idle' | 'submitting' | 'success' | 'error';

export function PressContactForm() {
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setError('');

    const form = e.currentTarget;
    const organisation = (form.elements.namedItem('organisation') as HTMLInputElement).value || '';
    const messageText = (form.elements.namedItem('message') as HTMLTextAreaElement).value || '';
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: 'Press Pack Request',
      organisation,
      message: organisation ? `Organisation: ${organisation}\n\n${messageText}` : messageText,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong');
      }
      setState('success');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-lg border bg-emerald-50/50 p-6 text-sm">
        <p className="font-medium text-emerald-900">Thanks. We&apos;ll be in touch within two business days.</p>
        <p className="mt-2 text-emerald-800/80">
          For urgent media enquiries, email{' '}
          <a href="mailto:press@goodsoncountry.com" className="underline">press@goodsoncountry.com</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Your name</span>
          <input name="name" required className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Email</span>
          <input name="email" type="email" required className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </label>
      </div>
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">Organisation <span className="text-muted-foreground">(optional)</span></span>
        <input name="organisation" className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </label>
      <label className="text-sm">
        <span className="mb-1.5 block font-medium">What do you need?</span>
        <textarea name="message" rows={4} required placeholder="Story angle, deadline, formats, anything else we should know." className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </label>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          We reply within two business days. For urgent: <a href="mailto:press@goodsoncountry.com" className="underline">press@goodsoncountry.com</a>.
        </p>
        <button type="submit" disabled={state === 'submitting'} className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50">
          {state === 'submitting' ? 'Sending…' : 'Send request'}
        </button>
      </div>
      {state === 'error' && <p className="text-sm text-rose-600">{error}</p>}
    </form>
  );
}
