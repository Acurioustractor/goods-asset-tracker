import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';
import { sendEmail } from '@/lib/email/send';

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
      // General inquiries — base goods-inquiry + the subject-specific tag.
      const subjectTag = body.subject
        ? `goods-${body.subject.toLowerCase().replace(/\s+/g, '-')}`
        : 'goods-inquiry';

      ghlResult = await ghl.createInquiryContact(body.email, body.name, [subjectTag]);

      if (body.subscribe) {
        await ghl.addToNewsletter(body.email, body.name, 'contact-form');
      }
    }

    // EVERY contact submission (general + media pack): apply the ACT-wide
    // inquiry tags and save the message as a note. `act-inquiry` is the single
    // clean marker the Universal Inquiry pipeline triggers on — it is NOT
    // shared with feedback/imports the way the base `goods-inquiry` tag is.
    // `project-goods` lets that pipeline be filtered/triaged by project.
    if (ghlResult.success && ghlResult.contact?.id) {
      await ghl.addTags(ghlResult.contact.id, ['act-inquiry', 'project-goods']);

      const note = [
        '📥 Website contact form',
        `Subject: ${body.subject || 'General Inquiry'}`,
        body.organisation ? `Organisation: ${body.organisation}` : null,
        body.phone ? `Phone: ${body.phone}` : null,
        '',
        'Message:',
        body.message,
        '',
        `Submitted: ${new Date().toLocaleString('en-AU')}`,
      ]
        .filter((l) => l !== null)
        .join('\n');
      await ghl.addNote(ghlResult.contact.id, note);
    }

    // Email the submission to the team. Best-effort: never block the form on it.
    // Actually sends only when RESEND_API_KEY is set; otherwise lib/email/send
    // logs it (see EMAIL_ENABLED). Recipient is configurable via env.
    try {
      const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || 'hi@act.place';

      const details = [
        `Name: ${body.name}`,
        `Email: ${body.email}`,
        body.phone ? `Phone: ${body.phone}` : null,
        body.organisation ? `Organisation: ${body.organisation}` : null,
        `Subject: ${body.subject || 'General Inquiry'}`,
      ]
        .filter(Boolean)
        .join('\n');

      await sendEmail({
        to: notifyTo,
        replyTo: body.email,
        subject: `New contact: ${body.subject || 'Inquiry'} from ${body.name}`,
        body: `New contact form submission from goodsoncountry.com.\n\n${details}\n\nMessage:\n${body.message}\n\nReply directly to this email to respond to ${body.name}.`,
      });
    } catch (emailErr) {
      console.error('[Contact Form] notification email failed:', emailErr);
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
