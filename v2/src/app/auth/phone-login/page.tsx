import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { PhoneLoginForm } from '@/components/auth/phone-login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Sign In - Goods on Country',
  description: 'Sign in to access your items, messages, and requests',
};

async function checkAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function PhoneLoginPage() {
  // Redirect if already logged in
  const user = await checkAuth();
  if (user) {
    redirect('/my-items');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 text-5xl">
              <span role="img" aria-label="bed">🛏️</span>
            </div>
            <CardTitle className="text-2xl">My Items</CardTitle>
            <CardDescription>
              Sign in to claim your bed or washing machine
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Benefits list */}
            <div className="mb-6 rounded-lg bg-primary/5 border border-primary/10 p-4">
              <p className="text-sm font-medium text-primary mb-3">
                With an account you can:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span role="img" aria-label="camera">📸</span>
                  See photos of your item being made
                </li>
                <li className="flex items-center gap-2">
                  <span role="img" aria-label="chat">💬</span>
                  Message us directly
                </li>
                <li className="flex items-center gap-2">
                  <span role="img" aria-label="bed">🛏️</span>
                  Request blankets, pillows & more
                </li>
                <li className="flex items-center gap-2">
                  <span role="img" aria-label="package">📦</span>
                  Track your delivery
                </li>
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
