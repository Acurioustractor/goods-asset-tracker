import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  organisation?: string;
  subscribe?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactFormData;

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Route to appropriate GHL method based on subject
    const isMediaRequest = body.subject === 'Media Pack Request';

    let ghlResult;

    if (isMediaRequest) {
      // Media pack requests → partnership contact with goods-media tag
      ghlResult = await ghl.createPartnershipContact({
        organizationName: body.organisation || 'Not provided',
        contactName: body.name,
        contactEmail: body.email,
        contactPhone: body.phone,
        partnershipType: 'Media Pack Request',
        message: body.message,
      });
    } else {
      // General inquiries — create contact with inquiry tags
      const subjectTag = body.subject
        ? `goods-${body.subject.toLowerCase().replace(/\s+/g, '-')}`
        : 'goods-inquiry';

      ghlResult = await ghl.addToNewsletter(body.email, body.name, subjectTag);

      // If they opted into newsletter, add that too
      if (body.subscribe) {
        await ghl.addToNewsletter(body.email, body.name, 'contact-form-subscribe');
      }
    }

    // Log the inquiry with full GHL result for debugging
    console.log('[Contact Form]', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      organisation: body.organisation,
      type: isMediaRequest ? 'media-request' : 'general-inquiry',
      ghlSuccess: ghlResult.success,
      ghlError: ghlResult.error,
      ghlSimulated: ghlResult.simulated,
      ghlContactId: ghlResult.contact?.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you soon.',
      debug: { ghlSuccess: ghlResult.success, ghlError: ghlResult.error, ghlSimulated: ghlResult.simulated },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
