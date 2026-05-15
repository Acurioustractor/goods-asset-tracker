'use client';

import { useState } from 'react';

export function FollowForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!email && !phone) {
      setErr('Please add an email or phone so we can stay in touch.');
      return;
    }
    setStatus('submitting');
    try {
      const tasks: Promise<Response>[] = [];
      if (email) {
        tasks.push(
          fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, tag: 'canberra-airport-2026' }),
          })
        );
      }
      tasks.push(
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || 'Canberra Airport visitor',
            email: email || `phone-${phone.replace(/\s/g, '')}@placeholder.goodsoncountry.com`,
            phone,
            subject: 'Canberra Airport — Reconciliation Week',
            message: `${name || 'Someone'} scanned a Goods QR at Canberra Airport during Reconciliation Week 2026. Email: ${email || '—'}, Phone: ${phone || '—'}`,
            subscribe: !!email,
          }),
        })
      );
      const results = await Promise.all(tasks);
      if (!results.some((r) => r.ok)) throw new Error('Submit failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[#8B9D77]/40 bg-[#8B9D77]/10 p-6 text-center">
        <p className="font-display text-2xl text-[#2E2E2E] mb-1">Thank you.</p>
        <p className="text-sm text-[#2E2E2E]/80">
          We&apos;ll be in touch after Reconciliation Week. Keep scrolling — there&apos;s more of the story below.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-[#2E2E2E]/20 bg-white px-4 py-3 text-base text-[#2E2E2E] placeholder:text-[#2E2E2E]/40 focus:outline-none focus:ring-2 focus:ring-[#C45C3E]/40"
        />
        <input
          type="tel"
          inputMode="tel"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-[#2E2E2E]/20 bg-white px-4 py-3 text-base text-[#2E2E2E] placeholder:text-[#2E2E2E]/40 focus:outline-none focus:ring-2 focus:ring-[#C45C3E]/40"
        />
      </div>
      <input
        type="email"
        inputMode="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-[#2E2E2E]/20 bg-white px-4 py-3 text-base text-[#2E2E2E] placeholder:text-[#2E2E2E]/40 focus:outline-none focus:ring-2 focus:ring-[#C45C3E]/40"
      />
      {err && (
        <p className="text-sm text-[#C45C3E]">{err}</p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-xl bg-[#2E2E2E] px-4 py-4 text-base font-semibold text-[#FDF8F3] hover:bg-[#C45C3E] transition disabled:opacity-50"
      >
        {status === 'submitting' ? 'Sending…' : 'Stay close to the story'}
      </button>
      {status === 'error' && (
        <p className="text-sm text-[#C45C3E]">Something went wrong. Try again or email ben@goodsoncountry.com.</p>
      )}
    </form>
  );
}
