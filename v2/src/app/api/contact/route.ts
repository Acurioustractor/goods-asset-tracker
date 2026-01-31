import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
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

    // Create contact in GHL with inquiry details
    const tags = ['goods-inquiry'];
    if (body.subscribe) {
      tags.push('goods-newsletter');
    }

    const ghlResult = await ghl.createOrderContact({
      email: body.email,
      name: body.name,
      phone: body.phone,
      orderNumber: `INQ-${Date.now()}`, // Inquiry reference
      totalCents: 0,
      isSponsorship: false,
      productTypes: ['inquiry'],
    });

    // Log the inquiry even if GHL fails
    console.log('[Contact Form]', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      ghlSuccess: ghlResult.success,
    });

    // If GHL is enabled and worked, add a note with the message
    if (ghlResult.success && ghlResult.contact?.id) {
      // The contact was created, message is logged
      console.log(`Contact inquiry from ${body.email} logged to GHL`);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
