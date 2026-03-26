import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/**
 * GHL Sync Cron — runs daily
 *
 * Syncs Grantscope strategic targets into GHL:
 * - Fetches buyers, capital, and partners from Grantscope workspace API
 * - Upserts contacts that don't have a ghl_contact_id yet
 * - Adds appropriate tags (goods-buyer-target, goods-capital-target, goods-partner-target)
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!ghl.isEnabled()) {
    return NextResponse.json({
      success: true,
      message: 'GHL disabled — skipping sync',
      synced: 0,
    });
  }

  const grantscopeUrl = process.env.GRANTSCOPE_WORKSPACE_URL;
  if (!grantscopeUrl) {
    return NextResponse.json({
      success: true,
      message: 'No GRANTSCOPE_WORKSPACE_URL configured — skipping',
      synced: 0,
    });
  }

  const results = { synced: 0, skipped: 0, errors: 0, details: [] as string[] };

  try {
    // Fetch Grantscope workspace data
    const gsResponse = await fetch(`${grantscopeUrl}/api/goods-workspace/data`, {
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000),
    });

    if (!gsResponse.ok) {
      return NextResponse.json(
        { error: `Grantscope API returned ${gsResponse.status}` },
        { status: 502 },
      );
    }

    const gsData = await gsResponse.json();

    // Get existing GHL contacts to check for duplicates
    const existingContacts = await ghl.getContacts({ goodsOnly: true });
    const existingEmails = new Set(
      existingContacts
        .map(c => c.email?.toLowerCase())
        .filter(Boolean) as string[]
    );
    const existingOrgs = new Set(
      existingContacts
        .map(c => c.companyName?.toLowerCase())
        .filter(Boolean) as string[]
    );

    // Process buyers
    const buyers = gsData.buyers || [];
    for (const buyer of buyers) {
      const email = buyer.contactEmail?.toLowerCase();
      const orgName = buyer.name?.toLowerCase();

      if ((email && existingEmails.has(email)) || (orgName && existingOrgs.has(orgName))) {
        results.skipped++;
        continue;
      }

      try {
        await ghl.createStrategicTargetContact({
          organizationName: buyer.name || 'Unknown Buyer',
          contactName: buyer.contactName,
          contactEmail: buyer.contactEmail,
          contactPhone: buyer.contactPhone,
          targetType: 'buyer',
          regionFocus: buyer.regionFocus || buyer.state,
          relationshipStatus: buyer.relationshipStatus || 'cold',
          nextAction: buyer.nextAction,
          contactSurface: buyer.contactSurface,
          whyPlausible: buyer.whyPlausible,
          sourceOrgName: buyer.name || 'Grantscope',
          sourceOrgAbn: buyer.abn,
          sourceEntityGsId: buyer.id,
        });
        results.synced++;
        results.details.push(`Synced buyer: ${buyer.name}`);

        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.errors++;
        results.details.push(`Failed buyer: ${buyer.name} — ${error instanceof Error ? error.message : 'unknown'}`);
      }
    }

    // Process capital (funders)
    const capital = gsData.capital || [];
    for (const funder of capital) {
      const email = funder.contactEmail?.toLowerCase();
      const orgName = funder.name?.toLowerCase();

      if ((email && existingEmails.has(email)) || (orgName && existingOrgs.has(orgName))) {
        results.skipped++;
        continue;
      }

      try {
        await ghl.createStrategicTargetContact({
          organizationName: funder.name || 'Unknown Funder',
          contactName: funder.contactName,
          contactEmail: funder.contactEmail,
          targetType: 'capital',
          regionFocus: funder.regionFocus || funder.state,
          relationshipStatus: funder.relationshipStatus || 'cold',
          nextAction: funder.nextAction,
          whyPlausible: funder.whyPlausible,
          sourceOrgName: funder.name || 'Grantscope',
          sourceOrgAbn: funder.abn,
          sourceEntityGsId: funder.id,
        });
        results.synced++;
        results.details.push(`Synced funder: ${funder.name}`);

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.errors++;
        results.details.push(`Failed funder: ${funder.name} — ${error instanceof Error ? error.message : 'unknown'}`);
      }
    }

    // Process partners
    const partners = gsData.partners || [];
    for (const partner of partners) {
      const email = partner.contactEmail?.toLowerCase();
      const orgName = partner.name?.toLowerCase();

      if ((email && existingEmails.has(email)) || (orgName && existingOrgs.has(orgName))) {
        results.skipped++;
        continue;
      }

      try {
        await ghl.createStrategicTargetContact({
          organizationName: partner.name || 'Unknown Partner',
          contactName: partner.contactName,
          contactEmail: partner.contactEmail,
          targetType: 'partner',
          regionFocus: partner.regionFocus || partner.location,
          relationshipStatus: partner.relationshipStatus || 'cold',
          nextAction: partner.nextAction,
          whyPlausible: partner.whyPlausible,
          sourceOrgName: partner.name || 'Grantscope',
          sourceEntityGsId: partner.id,
        });
        results.synced++;
        results.details.push(`Synced partner: ${partner.name}`);

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.errors++;
        results.details.push(`Failed partner: ${partner.name} — ${error instanceof Error ? error.message : 'unknown'}`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
      sources: {
        buyers: buyers.length,
        capital: capital.length,
        partners: partners.length,
      },
    });
  } catch (error) {
    console.error('[GHL Sync] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 },
    );
  }
}
