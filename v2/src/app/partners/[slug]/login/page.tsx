'use client';

import { useState, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';

interface LoginPageProps {
  params: Promise<{ slug: string }>;
}

function LoginForm({ slug }: { slug: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const res = await fetch(`/api/partners/${slug}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(`/partners/${slug}/dashboard`);
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FDF8F3' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            Goods on Country
          </p>
          <h1 className="text-3xl font-light mb-2" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
            Partner Dashboard
          </h1>
          <p className="text-sm" style={{ color: '#5E5E5E' }}>
            Enter the access code to view your partner dashboard.
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
              placeholder="Access code"
              autoFocus
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors"
              style={{ borderColor: error ? '#C45C3E' : '#E8DED4', backgroundColor: 'white', color: '#2E2E2E' }}
            />
            {error && (
              <p className="text-xs mt-2" style={{ color: '#C45C3E' }}>
                Incorrect code. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#C45C3E' }}
          >
            {loading ? 'Checking...' : 'View dashboard'}
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

export default function PartnerLoginPage({ params }: LoginPageProps) {
  const { slug } = use(params);
  return (
    <Suspense>
      <LoginForm slug={slug} />
    </Suspense>
  );
}
