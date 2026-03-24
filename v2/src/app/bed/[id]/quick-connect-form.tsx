'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function QuickConnectForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Must have at least one contact method
    if (!email && !phone) {
      setValidationError('Please enter your email or phone number so we can reach you.');
      return;
    }

    setStatus('submitting');

    try {
      const promises: Promise<Response>[] = [];

      // Newsletter signup (only if email provided)
      if (email) {
        promises.push(
          fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, tag: 'parliament-house-demo' }),
          })
        );
      }

      // Contact inquiry (always — uses whichever contact method they gave)
      promises.push(
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || 'Parliament House visitor',
            email: email || `phone-${phone.replace(/\s/g, '')}@placeholder.goodsoncountry.com`,
            phone,
            subject: 'Parliament House - Chat Request',
            message: `${name || 'Someone'} scanned a QR code at Parliament House and wants to chat with Nic or Ben. Email: ${email || 'not provided'}, Phone: ${phone || 'not provided'}`,
            subscribe: !!email,
          }),
        })
      );

      const results = await Promise.all(promises);
      const anyOk = results.some((r) => r.ok);

      if (!anyOk) throw new Error('Failed to submit');

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 text-center">
        <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-1">We&apos;ll be in touch!</p>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          Nic or Ben will reach out shortly to set up a yarn. Keep scrolling to learn more about what we do.
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold text-foreground">Want to have a yarn with the founders?</p>
            <p className="text-sm text-muted-foreground">
              Leave your details and Nic or Ben will reach out for a chat about Goods on Country.
            </p>
          </div>
          <Button onClick={() => setIsOpen(true)} className="whitespace-nowrap">
            Let&apos;s Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
      <p className="font-semibold text-foreground mb-1">Leave your details</p>
      <p className="text-sm text-muted-foreground mb-4">
        Drop your email, phone, or both — whatever works for you.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setValidationError(''); }}
            placeholder="your@email.com"
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setValidationError(''); }}
            placeholder="Phone number"
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {validationError && (
          <p className="text-sm text-amber-700 dark:text-amber-400">{validationError}</p>
        )}
        <Button type="submit" className="w-full" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending...' : 'Send'}
        </Button>
        {status === 'error' && (
          <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
}
