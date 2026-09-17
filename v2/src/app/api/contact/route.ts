import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';
import { guardContactSubmission } from '@/lib/contact-delivery/anti-abuse';
import { acknowledgeOrReply } from '@/lib/comms/replies';
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
  /** Honeypot. A real person never fills this in; a bot fills every field. */
  _companyWebsite?: string;
}

/**
 * The only subjects this route accepts.
 *
 * Each one becomes a `goods-<slug>` tag on the contact, and each slug is mapped
 * to a role/interest in lib/ghl/canonical-tags. Before this list existed the
 * subject was free text, so any POST to this endpoint could mint a new tag in a
 * GHL account shared with Harvest, JusticeHub and CONTAINED. Anything not on
 * this list now falls back to General Inquiry.
 *
 * Adding a subject here means adding its mapping in canonical-tags too, or you
 * get a contact carrying a tag nothing can find.
 */
const CONTACT_SUBJECTS = new Set([
  'General Inquiry',
  'Partnership Inquiry',
  'Bulk Order Inquiry',
  'Facility Funding Inquiry',
  'Community Interest',
  'Media Pack Request',
  'LGANT 2026: place put forward',
]);

function safeSubject(raw: string | undefined): string {
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  return CONTACT_SUBJECTS.has(trimmed) ? trimmed : 'General Inquiry';
}

export async function POST(request: NextRequest) {
  let submissionId: string | null = null;
  try {
    const body = (await request.json()) as ContactFormData;

    // Abuse guard before anything is written or sent. A honeypot hit is answered
    // with the same success the sender would have got, so a bot learns nothing
    // from the response, and nothing is stored.
    const guard = await guardContactSubmission(request, {
      honeypot: body._companyWebsite,
      identity: body.email,
    });
    if (guard.reason === 'honeypot') {
      return NextResponse.json({ success: true, message: 'Your message has been received.' });
    }
    if (!guard.allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a few minutes and try again.' },
        { status: 429 },
      );
    }

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
    const subject = safeSubject(body.subject);
    body.subject = subject;

    const submission = {
      kind: 'contact' as const,
      email: body.email,
      name: body.name,
      subject,
      payload: {
        ...(body as unknown as Record<string, unknown>),
        // The honeypot value is never kept. The fingerprint is an HMAC of the
        // client address, never the address itself, and it is what the next
        // request's rate-limit window counts against.
        _companyWebsite: undefined,
        _clientFingerprint: guard.fingerprint,
      } as Record<string, unknown>,
    };
    submissionId = await recordContactSubmission(submission);

    // Route to appropriate GHL method based on subject
    const isMediaRequest = subject === 'Media Pack Request';

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
      const subjectTag = `goods-${subject.toLowerCase().replace(/\s+/g, '-')}`;

      // Full inquiry text for the mergeable `message` field — this is what the
      // GHL internal-notification email merges so the team can action it from
      // their inbox without opening GHL. Subject prefixed so it's visible.
      const inquiryDetails = [
        `Subject: ${subject}`,
        '',
        body.message,
      ].join('\n');

      ghlResult = await ghl.createInquiryContact(body.email, body.name, [subjectTag], {
        phone: body.phone,
        companyName: body.organisation,
        message: inquiryDetails,
        source: `Website Contact: ${subject}`,
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
    // inquiry tag, then thread the message into the contact's Conversations
    // inbox (below) as the primary record. `act-inquiry` is the single clean
    // marker the Universal Inquiry pipeline triggers on (NOT shared with
    // feedback/imports the way base `goods-inquiry` is).
    //
    // `project-goods` is no longer stamped here unconditionally, because it is the trigger for
    // the generic acknowledgement and some subjects now have their own written reply. See
    // acknowledgeOrReply. Project segmentation does not depend on it: the canonical write already
    // stamps `project:act-gd`.
    if (ghlResult.success && ghlResult.contact?.id) {
      await ghl.addTags(ghlResult.contact.id, ['act-inquiry']);

      // One reply, decided in one place. If we have written a branch for this subject it is sent
      // from here and `project-goods` is NOT stamped, so the generic acknowledgement does not also
      // arrive. If we have not, the tag goes on and the generic letter is what they get, which is
      // better than silence. The route does not make that choice: acknowledgeOrReply does, so the
      // two cannot both happen to one person.
      const outcome = await acknowledgeOrReply({
        contactId: ghlResult.contact.id,
        subject,
        context: {
          name: body.name,
          organisation: body.organisation,
          message: body.message,
          phone: body.phone,
        },
      });
      console.log(`[Contact] ${subject}: ${outcome}`);

      // Put it on a board. Each door lands on its own pipeline at the first
      // stage (see lib/ghl/inquiry-routing), so an enquiry is a card somebody
      // can move rather than a tag somebody has to search for. Subjects with no
      // route (General, Media Pack, LGANT) are a no-op.
      const opp = await ghl.createInquiryOpportunity({
        contactId: ghlResult.contact.id,
        subject,
        name: body.organisation?.trim() || body.name,
      });
      if (opp.created) console.log('[Contact] Opened a card on', opp.board);

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
        subject: `Website Contact: ${subject}`,
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
