import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = (body.email as string | undefined)?.trim() || undefined;
    const phone = (body.phone as string | undefined)?.trim() || undefined;
    const name = (body.name as string | undefined)?.trim() || undefined;
    const tag = body.tag as string | undefined;
    // R8 (Spam Act 2003): explicit consent gate. The newsletter send-trigger
    // (goods-newsletter / comms:goods-newsletter) is granted ONLY when the form
    // sends newsletterConsent==='Yes' from a default-OFF opt-in checkbox.
    // Submitting the form is NOT consent. Accept either an explicit string flag
    // or a boolean `consent` from the UI. TODO(tag-align): the live Goods
    // newsletter forms (footer, get-involved, sponsor, canberra) do not yet
    // render an opt-in checkbox — until they do, signups create leads but are
    // NOT enrolled (OCAP-safe). Add the default-OFF checkbox at the form.
    const newsletterConsent =
      body.newsletterConsent === 'Yes' || body.consent === true ? 'Yes' : undefined;

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

    const ghlResult = await ghl.addToNewsletter({ email, phone, name, tag, newsletterConsent });

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
