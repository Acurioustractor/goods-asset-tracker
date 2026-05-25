import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';

interface PartnershipFormData {
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  partnershipType: string;
  message?: string;
  howHeard?: string;
  partnerSegment?: string;
  fundingTier?: string;
  timeline?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PartnershipFormData;

    // Validate required fields
    if (!body.organizationName || !body.contactName || !body.contactEmail) {
      return NextResponse.json(
        { error: 'Organization name, contact name, and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.contactEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Roll segmentation answers into the stored message so they survive
    // even if the partnership_inquiries table doesn't have dedicated columns.
    const segmentPrefix = [
      body.partnerSegment ? `Segment: ${body.partnerSegment}` : null,
      body.fundingTier ? `Ticket size: ${body.fundingTier}` : null,
      body.timeline ? `Timeline: ${body.timeline}` : null,
    ].filter(Boolean).join(' · ');
    const enrichedMessage = [segmentPrefix, body.message].filter(Boolean).join('\n\n');

    // Must match the CHECK constraint set by migration
    // 20260525000001_widen_partnership_type_check.sql. Anything outside the
    // set (e.g. a typo or a new form value rolled out before the migration is
    // mirrored to a fresh environment) falls back to 'other' so the insert
    // still lands. The original form value is always preserved on the GHL
    // contact via the goods-* tag + note, so no signal is lost.
    const ALLOWED_DB_TYPES = new Set([
      'corporate_sponsor', 'retail_partner', 'community_partner',
      'media_partner', 'government', 'ngo', 'other',
      'partnership-inquiry', 'washer-interest', 'sponsor', 'license',
      'distribution', 'grant', 'media-pack-request',
    ]);
    const dbPartnershipType =
      body.partnershipType && ALLOWED_DB_TYPES.has(body.partnershipType)
        ? body.partnershipType
        : 'other';

    // Store in Supabase partnership_inquiries table
    const { data: inquiry, error: dbError } = await supabase
      .from('partnership_inquiries')
      .insert({
        organization_name: body.organizationName,
        contact_name: body.contactName,
        contact_email: body.contactEmail,
        contact_phone: body.contactPhone || null,
        website: body.website || null,
        partnership_type: dbPartnershipType,
        message: enrichedMessage || null,
        how_heard: body.howHeard || null,
        status: 'new',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Failed to store partnership inquiry:', dbError);
      // Continue even if DB fails - still try GHL
    }

    // Create contact in GHL. Washer-interest is a prospective buyer, not a partner —
    // tag separately so reach-out segmentation stays clean.
    const isWasherInterest = body.partnershipType === 'washer-interest';
    let ghlResult;
    if (isWasherInterest) {
      ghlResult = await ghl.createInquiryContact(
        body.contactEmail,
        body.contactName,
        ['goods-washer-interest'],
      );
      if (ghlResult.success && ghlResult.contact?.id) {
        const note = [
          '🌀 Washing Machine — Register Interest',
          `Organisation: ${body.organizationName}`,
          body.contactPhone ? `Phone: ${body.contactPhone}` : null,
          body.howHeard ? `How heard: ${body.howHeard}` : null,
          body.message ? `\nMessage:\n${body.message}` : null,
          `Submitted: ${new Date().toLocaleString('en-AU')}`,
        ]
          .filter(Boolean)
          .join('\n');
        await ghl.addNote(ghlResult.contact.id, note);
      }
    } else {
      ghlResult = await ghl.createPartnershipContact({
        organizationName: body.organizationName,
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        partnershipType: body.partnershipType,
        message: body.message,
        partnerSegment: body.partnerSegment,
        fundingTier: body.fundingTier,
        timeline: body.timeline,
      });
    }

    console.log('[Partnership Inquiry]', {
      organization: body.organizationName,
      contact: body.contactEmail,
      type: body.partnershipType,
      dbSuccess: !dbError,
      ghlSuccess: ghlResult.success,
      inquiryId: inquiry?.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your partnership inquiry. Our team will be in touch soon.',
      inquiryId: inquiry?.id,
    });
  } catch (error) {
    console.error('Partnership form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
