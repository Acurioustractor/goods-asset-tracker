import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';
import { guardContactSubmission } from '@/lib/contact-delivery/anti-abuse';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Same abuse guard as /api/contact: honeypot plus a rate limit keyed on an
    // HMAC of the client address. A honeypot hit is answered like a success so a
    // bot learns nothing, and nothing is written.
    const guard = await guardContactSubmission(request, {
      honeypot: body._companyWebsite,
      identity: (body.email as string | undefined),
    });
    if (guard.reason === 'honeypot') {
      return NextResponse.json({ success: true });
    }
    if (!guard.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a few minutes and try again.' },
        { status: 429 },
      );
    }

    const email = (body.email as string | undefined)?.trim() || undefined;
    const phone = (body.phone as string | undefined)?.trim() || undefined;
    const name = (body.name as string | undefined)?.trim() || undefined;
    const tag = body.tag as string | undefined;
    // R8 (Spam Act 2003): explicit consent gate. Submitting an email address is
    // not newsletter consent, so this endpoint fails closed unless a default-off
    // checkbox was affirmatively selected.
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

    if (!newsletterConsent) {
      return NextResponse.json(
        { error: 'Please confirm that you want to receive Goods updates.' },
        { status: 400 }
      );
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

    if (!ghlResult.success || !ghlResult.contact?.id || ghlResult.simulated) {
      return NextResponse.json(
        { error: 'We could not confirm your subscription. Please try again.' },
        { status: 502 }
      );
    }

    // What the person sees on screen, and it has to be true. "We'll keep you in the loop" is a
    // promise of frequency that nothing keeps: Ben ruled on 17 September that nothing goes to this
    // list until there is something worth sending, and the welcome workflow in GHL is still a
    // draft. Saying so is better than a cheerful line that leaves somebody wondering for nine
    // months whether the box worked.
    return NextResponse.json({
      success: true,
      status: 'subscribed',
      message: 'You are on the list. It is not a regular newsletter: you will hear from us when there is a story worth your time.',
    });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
