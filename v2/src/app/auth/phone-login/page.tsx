import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { PhoneLoginForm } from '@/components/auth/phone-login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sign In - Goods on Country',
  description: 'Sign in to access your items, messages, and requests',
};

const loginContexts: Record<string, {
  emoji: string;
  emojiLabel: string;
  title: string;
  description: string;
  benefitsLabel: string;
  benefits: { emoji: string; emojiLabel: string; text: string }[];
}> = {
  '/production': {
    emoji: '🏭',
    emojiLabel: 'factory',
    title: 'Production Log',
    description: 'Enter your phone number to access the shift log — no password needed',
    benefitsLabel: 'From the shift log you can:',
    benefits: [
      { emoji: '📋', emojiLabel: 'clipboard', text: 'Log sheets produced and plastic shredded' },
      { emoji: '🔧', emojiLabel: 'wrench', text: 'Report equipment issues' },
      { emoji: '📝', emojiLabel: 'memo', text: 'Leave handover notes for the next shift' },
      { emoji: '📊', emojiLabel: 'chart', text: 'Track production totals' },
    ],
  },
};

const defaultContext = {
  emoji: '🛏️',
  emojiLabel: 'bed',
  title: 'My Items',
  description: 'Sign in to claim your bed or washing machine',
  benefitsLabel: 'With an account you can:',
  benefits: [
    { emoji: '📸', emojiLabel: 'camera', text: 'See photos of your item being made' },
    { emoji: '💬', emojiLabel: 'chat', text: 'Message us directly' },
    { emoji: '🛏️', emojiLabel: 'bed', text: 'Request blankets, pillows & more' },
    { emoji: '📦', emojiLabel: 'package', text: 'Track your delivery' },
  ],
};

async function checkAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function PhoneLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; asset_id?: string }>;
}) {
  const params = await searchParams;
  const from = params.from || '/my-items';

  // Redirect if already logged in
  const user = await checkAuth();
  if (user) {
    redirect(from);
  }

  const ctx = loginContexts[from] || defaultContext;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 text-5xl">
              <span role="img" aria-label={ctx.emojiLabel}>{ctx.emoji}</span>
            </div>
            <CardTitle className="text-2xl">{ctx.title}</CardTitle>
            <CardDescription>{ctx.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Benefits list */}
            <div className="mb-6 rounded-lg bg-primary/5 border border-primary/10 p-4">
              <p className="text-sm font-medium text-primary mb-3">
                {ctx.benefitsLabel}
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {ctx.benefits.map((b) => (
                  <li key={b.text} className="flex items-center gap-2">
                    <span role="img" aria-label={b.emojiLabel}>{b.emoji}</span>
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>

            <Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded-lg" />}>
              <PhoneLoginForm />
            </Suspense>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Link
              href="/support"
              className="block w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2 rounded-md hover:bg-muted"
            >
              Continue without signing in
            </Link>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Back to Goods on Country
          </Link>
        </p>
      </div>
    </div>
  );
}
