import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';
import {
  recordContactSubmission,
  sendSubmissionToInbox,
  updateContactSubmission,
} from '@/lib/contact-delivery';

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
  let submissionId: string | null = null;
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

    // This is the source-of-truth receipt for the public form. It is written
    // before GHL/email calls and retried by the cron if either destination is
    // down, rather than silently treating a failed integration as a submission.
    const submission = {
      kind: 'contact' as const,
      email: body.email,
      name: body.name,
      subject: body.subject || 'General Inquiry',
      payload: body as unknown as Record<string, unknown>,
    };
    submissionId = await recordContactSubmission(submission);

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

    const ghlDelivered = Boolean(ghlResult.success && !ghlResult.simulated && ghlResult.contact?.id);
    const inboxResult = await sendSubmissionToInbox(submission);
    await updateContactSubmission(submissionId, {
      ghlStatus: ghlDelivered ? 'delivered' : ghlResult.simulated ? 'disabled' : 'failed',
      inboxStatus: inboxResult.success ? 'delivered' : 'failed',
      error: [ghlResult.error, inboxResult.error].filter(Boolean).join(' | ') || undefined,
      delivered: ghlDelivered || inboxResult.success,
    });

    // GHL owns the sender acknowledgement/workflow. The independent alert to
    // hi@act.place above is deliberately operational: it is the fallback path
    // that keeps a human-visible copy even when the GHL workflow is unhealthy.

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

    // A durable receipt is enough to acknowledge the enquiry: the retry job
    // continues until the independent team inbox has it. If persistence and
    // both immediate channels failed, tell the visitor to retry instead.
    if (!submissionId && !ghlDelivered && !inboxResult.success) {
      return NextResponse.json({ error: 'We could not safely receive your message. Please email hi@act.place.' }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you soon.',
      debug: { ghlSuccess: ghlResult.success, ghlError: ghlResult.error, ghlSimulated: ghlResult.simulated },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    await updateContactSubmission(submissionId, { ghlStatus: 'failed', inboxStatus: 'failed', error: error instanceof Error ? error.message : 'Unknown contact error' });
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
