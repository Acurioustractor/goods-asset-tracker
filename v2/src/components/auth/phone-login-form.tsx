'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PhoneLoginFormProps {
  className?: string;
}

export function PhoneLoginForm({ className }: PhoneLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const assetId = searchParams.get('asset_id');
  const from = searchParams.get('from');

  // Format phone number as user types: 412 345 678
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');

    // Remove leading 0 if present
    if (value.startsWith('0')) {
      value = value.substring(1);
    }

    // Format: 412 345 678
    if (value.length > 3) {
      value = value.substring(0, 3) + ' ' + value.substring(3);
    }
    if (value.length > 7) {
      value = value.substring(0, 7) + ' ' + value.substring(7, 10);
    }

    setPhone(value);
  };

  const formatPhoneForApi = (input: string): string | null => {
    // Remove all non-digits
    let cleaned = input.replace(/\D/g, '');

    // Remove leading 0 if present
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // Must be 9 digits for Australian mobile
    if (cleaned.length < 9) {
      return null;
    }

    // Take first 9 digits
    cleaned = cleaned.substring(0, 9);

    return '+61' + cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formattedPhone = formatPhoneForApi(phone);
    if (!formattedPhone) {
      setError('Please enter a valid Australian mobile number');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/phone-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      // Store phone, asset_id, and return path in sessionStorage for OTP page
      sessionStorage.setItem('verify_phone', formattedPhone);
      if (assetId) {
        sessionStorage.setItem('claim_asset', assetId);
      }
      if (from) {
        sessionStorage.setItem('auth_return_to', from);
      }

      // Redirect to OTP verification
      router.push('/auth/verify-otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <div className="flex h-9 items-center justify-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
            +61
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="412 345 678"
            value={phone}
            onChange={handlePhoneChange}
            autoComplete="tel"
            required
            className="flex-1"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          We&apos;ll send you a 6-digit code via SMS
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Sending...
          </>
        ) : (
          'Send Code'
        )}
      </Button>
    </form>
  );
}
