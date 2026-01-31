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

    // Store in Supabase partnership_inquiries table
    const { data: inquiry, error: dbError } = await supabase
      .from('partnership_inquiries')
      .insert({
        organization_name: body.organizationName,
        contact_name: body.contactName,
        contact_email: body.contactEmail,
        contact_phone: body.contactPhone || null,
        website: body.website || null,
        partnership_type: body.partnershipType || null,
        message: body.message || null,
        how_heard: body.howHeard || null,
        status: 'new',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Failed to store partnership inquiry:', dbError);
      // Continue even if DB fails - still try GHL
    }

    // Create contact in GHL
    const ghlResult = await ghl.createPartnershipContact({
      organizationName: body.organizationName,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      partnershipType: body.partnershipType,
      message: body.message,
    });

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
