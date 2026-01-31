import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { phone, token } = await request.json();

    // Validate inputs
    if (!phone || !/^\+61\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    if (!token || !/^\d{6}$/.test(token)) {
      return NextResponse.json(
        { error: 'Invalid verification code. Must be 6 digits.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify OTP
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      console.error('OTP verification error:', error);

      if (error.message.includes('expired')) {
        return NextResponse.json(
          { error: 'Code expired. Please request a new one.' },
          { status: 400 }
        );
      }

      if (error.message.includes('invalid')) {
        return NextResponse.json(
          { error: 'Invalid code. Please try again.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Update last_login timestamp in profiles
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);

      if (profileError) {
        console.error('Failed to update last_login:', profileError);
        // Don't fail the request - login was still successful
      }
    }

    return NextResponse.json({
      success: true,
      user: data.user ? {
        id: data.user.id,
        phone: data.user.phone,
      } : null,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}
