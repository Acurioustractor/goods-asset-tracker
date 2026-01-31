import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';

/**
 * Support Ticket API
 *
 * This endpoint receives support tickets from QR code scans and:
 * 1. Stores them in the v1 tickets table (connected to assets)
 * 2. Creates/updates a contact in GoHighLevel
 * 3. Triggers appropriate workflows based on priority
 */

interface SupportTicketData {
  assetId: string;
  userName?: string;
  userContact: string; // phone number or email
  issueDescription: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  category?: string;
  photoUrls?: string[];
}

// V1 Supabase connection (separate from v2)
function getV1SupabaseUrl(): string {
  return process.env.V1_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

function getV1SupabaseKey(): string {
  return process.env.V1_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SupportTicketData;

    // Validate required fields
    if (!body.assetId || !body.userContact || !body.issueDescription) {
      return NextResponse.json(
        { error: 'Asset ID, contact information, and issue description are required' },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
    if (!validPriorities.includes(body.priority)) {
      body.priority = 'Medium';
    }

    const supabase = createServiceClient();

    // First, look up the asset to get community and product info
    let assetInfo: { community?: string; product?: string } = {};
    try {
      const { data: asset } = await supabase
        .from('assets')
        .select('community, product')
        .eq('unique_id', body.assetId)
        .single();

      if (asset) {
        assetInfo = asset;
      }
    } catch {
      // Asset lookup failed - continue anyway
      console.warn(`Could not find asset ${body.assetId}`);
    }

    // Create ticket in database
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        asset_id: body.assetId,
        user_name: body.userName || null,
        user_contact: body.userContact,
        issue_description: body.issueDescription,
        priority: body.priority,
        category: body.category || null,
        photo_urls: body.photoUrls || [],
        status: 'Open',
      })
      .select()
      .single();

    if (ticketError) {
      console.error('Failed to create ticket:', ticketError);
      // Continue to try GHL even if DB fails
    }

    // Send to GoHighLevel for triage
    const ghlResult = await ghl.createSupportTicketContact({
      assetId: body.assetId,
      userName: body.userName,
      userContact: body.userContact,
      issueDescription: body.issueDescription,
      priority: body.priority,
      category: body.category,
      community: assetInfo.community,
      productType: assetInfo.product,
    });

    console.log('[Support Ticket]', {
      assetId: body.assetId,
      priority: body.priority,
      category: body.category,
      ticketId: ticket?.id,
      dbSuccess: !ticketError,
      ghlSuccess: ghlResult.success,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: getResponseMessage(body.priority),
      ticketId: ticket?.id,
      reference: ticket?.id ? `TKT-${ticket.id.slice(0, 8).toUpperCase()}` : undefined,
    });
  } catch (error) {
    console.error('Support ticket error:', error);
    return NextResponse.json(
      { error: 'Failed to submit support request. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to look up asset info for the support form
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get('asset_id');

  if (!assetId) {
    return NextResponse.json(
      { error: 'Asset ID is required' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  try {
    const { data: asset, error } = await supabase
      .from('assets')
      .select('unique_id, product, community, name, last_checkin_date')
      .eq('unique_id', assetId)
      .single();

    if (error || !asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.unique_id,
        product: asset.product,
        community: asset.community,
        ownerName: asset.name,
        lastCheckIn: asset.last_checkin_date,
      },
    });
  } catch (error) {
    console.error('Asset lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to look up asset' },
      { status: 500 }
    );
  }
}

function getResponseMessage(priority: string): string {
  switch (priority) {
    case 'Urgent':
      return 'Your urgent request has been received. Our team will contact you within 24 hours.';
    case 'High':
      return 'Your high-priority request has been received. We will respond within 2-3 business days.';
    default:
      return 'Your support request has been received. We will be in touch soon.';
  }
}
