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
      // General inquiries — base goods-inquiry + the subject-specific tag.
      const subjectTag = body.subject
        ? `goods-${body.subject.toLowerCase().replace(/\s+/g, '-')}`
        : 'goods-inquiry';

      // Full inquiry text for the mergeable `message` field — this is what the
      // GHL internal-notification email merges so the team can action it from
      // their inbox without opening GHL. Subject prefixed so it's visible.
      const inquiryDetails = [
        `Subject: ${body.subject || 'General Inquiry'}`,
        '',
        body.message,
      ].join('\n');

      ghlResult = await ghl.createInquiryContact(body.email, body.name, [subjectTag], {
        phone: body.phone,
        companyName: body.organisation,
        message: inquiryDetails,
        source: `Website Contact: ${body.subject || 'General Inquiry'}`,
      });

      // R8 (Spam Act 2003): `subscribe === true` is the explicit opt-in signal —
      // it means the user ticked the newsletter checkbox on the contact form, so
      // it carries consent for the goods-newsletter send-trigger. Pass it through
      // as newsletterConsent='Yes'. Without it, no enrolment happens.
      // TODO(tag-align): the /contact UI does NOT yet render a `subscribe`
      // opt-in checkbox (the form never sends this field) — this branch is dormant
      // until a default-OFF checkbox is added that sets subscribe=true. Adding the
      // checkbox is the last step to make the consent path live.
      if (body.subscribe === true) {
        await ghl.addToNewsletter({
          email: body.email,
          name: body.name,
          tag: 'contact-form',
          newsletterConsent: 'Yes',
        });
      }
    }

    // EVERY contact submission (general + media pack): apply the ACT-wide
    // inquiry tags, then thread the message into the contact's Conversations
    // inbox (below) as the primary record. `act-inquiry` is the single clean
    // marker the Universal Inquiry pipeline triggers on (NOT shared with
    // feedback/imports the way base `goods-inquiry` is). `project-goods` lets
    // that pipeline be filtered/triaged by project.
    if (ghlResult.success && ghlResult.contact?.id) {
      await ghl.addTags(ghlResult.contact.id, ['act-inquiry', 'project-goods']);

      // Thread the inquiry into the contact's GHL Conversations inbox as an
      // inbound email, so the team can read + reply in-thread (replies send via
      // the native GHL email channel — no Custom conversation provider needed).
      // This is the primary tracking surface for inquiries.
      const esc = (s: string) =>
        s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const inquiryHtml = [
        body.organisation ? `<p><strong>Organisation:</strong> ${esc(body.organisation)}</p>` : '',
        body.phone ? `<p><strong>Phone:</strong> ${esc(body.phone)}</p>` : '',
        `<p>${esc(body.message).replace(/\n/g, '<br/>')}</p>`,
      ].join('');
      await ghl.addInboundEmail({
        contactId: ghlResult.contact.id,
        fromEmail: body.email,
        subject: `Website Contact: ${body.subject || 'General Inquiry'}`,
        html: inquiryHtml,
        text: body.message,
      });
    }

    // Email notifications (team notify + sender acknowledgement) are owned by
    // the GHL "Contact → Universal Inquiry" workflow, which triggers on the
    // `act-inquiry` tag applied above. This route stays identify-and-tag + note
    // only; it does NOT send email. (Don't reintroduce a sendEmail() call here —
    // it would double-send the team notification once GHL sending is live.)

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
