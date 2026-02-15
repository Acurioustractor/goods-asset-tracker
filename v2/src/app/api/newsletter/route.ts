import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = body.email as string;
    const tag = body.tag as string | undefined;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const ghlResult = await ghl.addToNewsletter(email);

    console.log('[Newsletter Signup]', {
      email,
      tag: tag || 'general',
      ghlSuccess: ghlResult.success,
      ghlError: ghlResult.error,
      ghlSimulated: ghlResult.simulated,
    });

    return NextResponse.json({
      success: true,
      message: "You're subscribed! We'll keep you in the loop.",
    });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
