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
  assetConditionStatus?: 'Good' | 'Needs Repair' | 'Damaged' | 'Missing' | 'Replaced';
  serviceability?: 'fully_usable' | 'limited_use' | 'unsafe' | 'not_usable';
  failureCause?:
    | 'wear'
    | 'rust'
    | 'mould'
    | 'frame_damage'
    | 'fabric_damage'
    | 'electrical_fault'
    | 'water_fault'
    | 'freight_damage'
    | 'unknown';
  outcomeWanted?: 'repair' | 'replace' | 'pickup' | 'assessment' | 'dispose';
  oldItemDisposition?: 'still_in_use' | 'stored' | 'awaiting_pickup' | 'dumped' | 'returned' | 'unknown';
  safetyRisk?: boolean;
  issueObservedAt?: string;
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
    let assetInfo: { unique_id?: string; community?: string; product?: string } = {};
    try {
      const { data: asset } = await supabase
        .from('assets')
        .select('unique_id, community, product')
        .eq('unique_id', body.assetId)
        .single();

      if (asset) {
        assetInfo = asset;
      }
    } catch {
      // Asset lookup failed - continue anyway
      console.warn(`Could not find asset ${body.assetId}`);
    }

    const lifecycleMetadataBlock = buildLifecycleMetadataBlock(body);
    const ticketDescription = lifecycleMetadataBlock
      ? `${body.issueDescription}\n\n--- Lifecycle Tracking ---\n${lifecycleMetadataBlock}`
      : body.issueDescription;

    // Create ticket in database
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        asset_id: body.assetId,
        user_name: body.userName || null,
        user_contact: body.userContact,
        issue_description: ticketDescription,
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

    const assetExists = Boolean(assetInfo.unique_id);
    const shouldCreateLifecycleSignals = assetExists && hasLifecycleSignal(body);

    if (shouldCreateLifecycleSignals) {
      const checkinStatus = deriveCheckinStatus(body);
      const checkinDate = parseIssueObservedAt(body.issueObservedAt);

      if (checkinStatus) {
        const { error: checkinError } = await supabase.from('checkins').insert({
          asset_id: body.assetId,
          checkin_date: checkinDate?.toISOString() || new Date().toISOString(),
          visitor_name: body.userName || 'Support request',
          comments: lifecycleMetadataBlock
            ? `Support request captured via Goods Support.\n\n${lifecycleMetadataBlock}\n\nIssue detail:\n${body.issueDescription}`
            : body.issueDescription,
          status: checkinStatus,
        });

        if (checkinError) {
          console.error('Failed to create lifecycle checkin:', checkinError);
        }
      }

      const alertsToCreate = buildLifecycleAlerts(body);
      if (alertsToCreate.length) {
        const { error: alertsError } = await supabase.from('alerts').insert(
          alertsToCreate.map((alert) => ({
            asset_id: body.assetId,
            alert_date: new Date().toISOString(),
            type: alert.type,
            severity: alert.severity,
            details: lifecycleMetadataBlock
              ? `${alert.details}\n\n${lifecycleMetadataBlock}`
              : alert.details,
          })),
        );

        if (alertsError) {
          console.error('Failed to create lifecycle alerts:', alertsError);
        }
      }
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
      assetConditionStatus: body.assetConditionStatus,
      serviceability: body.serviceability,
      failureCause: body.failureCause,
      outcomeWanted: body.outcomeWanted,
      oldItemDisposition: body.oldItemDisposition,
      safetyRisk: body.safetyRisk,
      issueObservedAt: body.issueObservedAt,
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

function hasLifecycleSignal(body: SupportTicketData) {
  return Boolean(
    body.assetConditionStatus ||
      body.serviceability ||
      body.failureCause ||
      body.outcomeWanted ||
      body.oldItemDisposition ||
      body.safetyRisk ||
      body.issueObservedAt,
  );
}

function deriveCheckinStatus(body: SupportTicketData) {
  if (body.assetConditionStatus) return body.assetConditionStatus;
  switch ((body.category || '').toLowerCase()) {
    case 'repair':
      return 'Needs Repair' as const;
    case 'damage':
      return 'Damaged' as const;
    case 'replacement':
      return 'Replaced' as const;
    default:
      return null;
  }
}

function parseIssueObservedAt(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function humanizeLifecycleValue(value: string) {
  return value
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function buildLifecycleMetadataBlock(body: SupportTicketData) {
  const rows = [
    body.assetConditionStatus ? `Condition: ${body.assetConditionStatus}` : null,
    body.serviceability ? `Serviceability: ${humanizeLifecycleValue(body.serviceability)}` : null,
    body.failureCause ? `Failure Cause: ${humanizeLifecycleValue(body.failureCause)}` : null,
    body.outcomeWanted ? `Outcome Wanted: ${humanizeLifecycleValue(body.outcomeWanted)}` : null,
    body.oldItemDisposition ? `Old Item Disposition: ${humanizeLifecycleValue(body.oldItemDisposition)}` : null,
    typeof body.safetyRisk === 'boolean' ? `Safety Risk: ${body.safetyRisk ? 'Yes' : 'No'}` : null,
    body.issueObservedAt ? `Observed At: ${body.issueObservedAt}` : null,
  ].filter(Boolean);

  return rows.join('\n');
}

function buildLifecycleAlerts(body: SupportTicketData) {
  const alerts: Array<{ type: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; details: string }> = [];

  if (body.safetyRisk || body.serviceability === 'unsafe') {
    alerts.push({
      type: 'Unsafe Asset',
      severity: 'Critical',
      details: 'Support form marked the asset as unsafe and in need of immediate attention.',
    });
  }

  if (
    body.oldItemDisposition === 'dumped' ||
    body.oldItemDisposition === 'awaiting_pickup' ||
    body.outcomeWanted === 'dispose' ||
    body.outcomeWanted === 'pickup'
  ) {
    alerts.push({
      type: 'Dump Risk',
      severity: 'High',
      details: 'Support form indicates end-of-life, disposal, or removal pressure for this asset.',
    });
  }

  if (
    body.outcomeWanted === 'replace' ||
    body.assetConditionStatus === 'Damaged' ||
    body.assetConditionStatus === 'Missing' ||
    body.assetConditionStatus === 'Replaced'
  ) {
    alerts.push({
      type: 'End of Life',
      severity: body.priority === 'Urgent' ? 'Critical' : 'High',
      details: 'Support form indicates the asset is at end-of-life or needs replacement.',
    });
  }

  return alerts;
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
