import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = (body.email as string | undefined)?.trim() || undefined;
    const phone = (body.phone as string | undefined)?.trim() || undefined;
    const name = (body.name as string | undefined)?.trim() || undefined;
    const tag = body.tag as string | undefined;

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    const ghlResult = await ghl.addToNewsletter({ email, phone, name, tag });

    console.log('[Newsletter Signup]', {
      channel: email && phone ? 'email+phone' : email ? 'email' : 'phone',
      email,
      phone,
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
