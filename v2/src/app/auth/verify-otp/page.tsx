'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OTPInput } from '@/components/auth/otp-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyOTPPage() {
  const router = useRouter();
  const [phone, setPhone] = React.useState<string | null>(null);
  const [otp, setOtp] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [countdown, setCountdown] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);

  // Get phone from sessionStorage on mount
  React.useEffect(() => {
    const storedPhone = sessionStorage.getItem('verify_phone');
    if (!storedPhone) {
      router.push('/auth/phone-login');
      return;
    }
    setPhone(storedPhone);
  }, [router]);

  // Countdown timer for resend button
  React.useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const maskPhone = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    return phoneNumber.substring(0, 4) + ' *** *** ' + phoneNumber.substring(phoneNumber.length - 3);
  };

  const handleVerify = async (code: string) => {
    if (!phone || code.length !== 6) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, token: code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      setSuccess('Verified! Redirecting...');

      // Clear session storage and determine redirect
      sessionStorage.removeItem('verify_phone');
      const returnTo = sessionStorage.getItem('auth_return_to');
      sessionStorage.removeItem('auth_return_to');

      // Check if there's an asset to claim
      const claimAsset = sessionStorage.getItem('claim_asset');
      if (claimAsset) {
        sessionStorage.removeItem('claim_asset');
        router.push(`/my-items?claim=${claimAsset}`);
      } else {
        router.push(returnTo || '/my-items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phone || !canResend) return;

    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/phone-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      setSuccess('New code sent!');
      setCountdown(60);
      setCanResend(false);
      setOtp('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  if (!phone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <div className="animate-pulse">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 text-5xl">
              <span role="img" aria-label="phone">📱</span>
            </div>
            <CardTitle className="text-2xl">Enter Code</CardTitle>
            <CardDescription>
              We sent a 6-digit code to
            </CardDescription>
            <div className="mt-2 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground">
              {maskPhone(phone)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 text-sm text-accent-foreground text-center">
                {success}
              </div>
            )}

            <OTPInput
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
              disabled={isLoading}
              error={!!error}
            />

            <Button
              onClick={() => handleVerify(otp)}
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the code?
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={!canResend || isResending}
              >
                {isResending ? (
                  'Sending...'
                ) : canResend ? (
                  'Resend Code'
                ) : (
                  `Resend Code (${countdown}s)`
                )}
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/phone-login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Use a different number
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
