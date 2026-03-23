'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function QuickConnectForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Submit as both newsletter + contact inquiry
      const [newsletterRes, contactRes] = await Promise.all([
        fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, tag: 'parliament-house-demo' }),
        }),
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone,
            subject: 'Parliament House - Chat Request',
            message: `${name} scanned a QR code at Parliament House and wants to chat with Nic or Ben. Phone: ${phone || 'not provided'}`,
            subscribe: true,
          }),
        }),
      ]);

      if (!newsletterRes.ok && !contactRes.ok) {
        throw new Error('Failed to submit');
      }

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
        Nic or Ben will reach out to set up a yarn about Goods on Country.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your name"
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send'}
          </Button>
        </div>
        {status === 'error' && (
          <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
}
