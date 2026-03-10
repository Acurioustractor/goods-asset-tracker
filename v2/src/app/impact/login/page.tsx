'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/impact';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const res = await fetch('/api/impact/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#FDF8F3' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p
            className="text-sm uppercase tracking-widest mb-3"
            style={{ color: '#8B9D77' }}
          >
            Goods on Country
          </p>
          <h1
            className="text-3xl font-light mb-2"
            style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
          >
            Impact Model
          </h1>
          <p className="text-sm" style={{ color: '#5E5E5E' }}>
            Enter the password to view the impact dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
              style={{
                borderColor: error ? '#C45C3E' : '#E8DED4',
                backgroundColor: 'white',
                color: '#2E2E2E',
              }}
            />
            {error && (
              <p className="text-xs mt-2" style={{ color: '#C45C3E' }}>
                Incorrect password. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#C45C3E' }}
          >
            {loading ? 'Checking...' : 'View Dashboard'}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: '#8B9D77' }}>
          Contact{' '}
          <a href="mailto:hi@act.place" className="underline">
            hi@act.place
          </a>{' '}
          for access.
        </p>
      </div>
    </main>
  );
}

export default function ImpactLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
