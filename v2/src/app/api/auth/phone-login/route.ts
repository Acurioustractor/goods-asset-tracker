import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    // Validate phone format (+61 followed by 9 digits)
    if (!phone || !/^\+61\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Use Australian mobile (+61)' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Request OTP via SMS
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms',
      },
    });

    if (error) {
      console.error('Phone login error:', error);

      // Handle specific Supabase errors
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Too many attempts. Please wait a few minutes.' },
          { status: 429 }
        );
      }

      if (error.message.includes('not enabled')) {
        return NextResponse.json(
          { error: 'SMS login is not yet enabled. Please contact support.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
    });
  } catch (error) {
    console.error('Phone login error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
