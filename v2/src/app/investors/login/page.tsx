'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Rocket } from 'lucide-react';

function LoginForm() {
  const params = useSearchParams();
  const from = params.get('from') || '/investors';
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/investors/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || 'Incorrect password.');
        setLoading(false);
        return;
      }
      window.location.href = from;
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
          <Rocket className="h-4 w-4" strokeWidth={1.5} />
          Goods on Country · Investor Cockpit
        </div>
        <h1 className="mt-6 text-3xl font-serif tracking-tight text-stone-900">
          Enter the password
        </h1>
        <p className="mt-3 text-sm text-stone-600 leading-relaxed">
          The interactive, verified bed cost model and investment view — shared with QBE and
          investment partners of Goods on Country. If you don&apos;t have the password,
          contact Ben at ben@benjamink.com.au.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="pw"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-500"
            >
              Password
            </label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-[#C45C3E] focus:outline-none focus:ring-1 focus:ring-[#C45C3E]"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-md bg-[#C45C3E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a74d33] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Checking…' : 'Open the cockpit'}
          </button>
        </form>
        <p className="mt-8 text-xs text-stone-400">Goods on Country · A Curious Tractor</p>
      </div>
    </div>
  );
}

export default function InvestorsLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
