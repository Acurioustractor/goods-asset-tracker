import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';
import { ghl } from '@/lib/ghl';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // These are slow — one GHL call per target

/**
 * Push outreach targets from the master target list to GHL.
 *
 * POST /api/admin/targets/push-outreach
 * Body: { targets: OutreachTarget[], dryRun?: boolean }
 *
 * Maps OutreachTarget → StrategicTargetContactData and pushes through
 * the existing ghl.createStrategicTargetContact flow (creates contacts,
 * notes, and pipeline opportunities in GHL).
 */

type OutreachTarget = {
  id: string;
  name: string;
  category: string;
  status: string;
  priority: string;
  states?: string[];
  contactName?: string;
  contactEmail?: string;
  amountSignal?: string;
  instrument?: string;
  nextAction: string;
  grantRelevance: string;
  notes?: string;
};

// Map outreach category → GHL target type
function mapTargetType(category: string): 'buyer' | 'capital' | 'partner' {
  const buyerCategories = ['health_buyer', 'procurement_buyer'];
  const capitalCategories = [
    'philanthropy_active',
    'philanthropy_pipeline',
    'philanthropy_prospect',
    'aboriginal_trust',
    'government_grant',
    'impact_finance',
  ];
  // partner: corporate, distribution_partner, community_partner, manufacturing_partner

  if (buyerCategories.includes(category)) return 'buyer';
  if (capitalCategories.includes(category)) return 'capital';
  return 'partner';
}

// Map outreach status → GHL relationship status tag
function mapRelationshipStatus(status: string): string {
  const map: Record<string, string> = {
    active: 'active',
    warm: 'warm-intro',
    applied: 'applied',
    prospect: 'prospect',
    research: 'research',
  };
  return map[status] || status;
}

async function persistOutreachTargetIdentity(target: OutreachTarget) {
  const supabase = createServiceClient();
  const normalizedEmail = String(target.contactEmail || '').trim().toLowerCase();

  let existingId: string | null = null;

  const byTargetId = await supabase
    .from('crm_contacts')
    .select('id')
    .eq('grantscope_id', target.id)
    .limit(1)
    .maybeSingle();

  if (!byTargetId.error && byTargetId.data?.id) {
    existingId = byTargetId.data.id;
  }

  if (!existingId && normalizedEmail) {
    const byEmail = await supabase
      .from('crm_contacts')
      .select('id')
      .ilike('email', normalizedEmail)
      .limit(1)
      .maybeSingle();

    if (!byEmail.error && byEmail.data?.id) {
      existingId = byEmail.data.id;
    }
  }

  if (!existingId) {
    const byOrg = await supabase
      .from('crm_contacts')
      .select('id')
      .ilike('organization', target.name)
      .limit(1)
      .maybeSingle();

    if (!byOrg.error && byOrg.data?.id) {
      existingId = byOrg.data.id;
    }
  }

  const payload = {
    name: target.contactName || target.name,
    email: target.contactEmail || null,
    organization: target.name,
    roles: [mapTargetType(target.category)],
    status: 'active',
    relationship_status: target.status === 'active' ? 'active' : target.status === 'warm' ? 'warm' : 'prospect',
    grantscope_id: target.id,
    tags: [
      'goods-strategic-target',
      `goods-${mapTargetType(target.category)}-target`,
      `goods-outreach-${target.category}`,
    ],
    metadata: {
      outreach_target_id: target.id,
      outreach_category: target.category,
      outreach_priority: target.priority,
    },
  };

  if (existingId) {
    const { error } = await supabase
      .from('crm_contacts')
      .update(payload)
      .eq('id', existingId);

    if (error) {
      throw new Error(`Failed to update CRM contact: ${error.message}`);
    }
    return existingId;
  }

  const { data, error } = await supabase
    .from('crm_contacts')
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create CRM contact: ${error.message}`);
  }

  return data.id as string;
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (guard) return guard;

    const body = await request.json();
    const targets: OutreachTarget[] = body.targets || [];
    const dryRun = body.dryRun === true;

    if (!targets.length) {
      return NextResponse.json({ error: 'No targets provided' }, { status: 400 });
    }

    if (dryRun) {
      // Return what WOULD be pushed without actually pushing
      const preview = targets.map((t) => ({
        id: t.id,
        name: t.name,
        targetType: mapTargetType(t.category),
        relationshipStatus: mapRelationshipStatus(t.status),
        hasContact: !!(t.contactName || t.contactEmail),
        nextAction: t.nextAction,
      }));
      return NextResponse.json({
        dryRun: true,
        totalTargets: targets.length,
        preview,
      });
    }

    // Push each target through the existing GHL integration
    const results = await Promise.all(
      targets.map(async (target) => {
        try {
          const result = await ghl.createStrategicTargetContact({
            organizationName: target.name,
            contactName: target.contactName,
            contactEmail: target.contactEmail,
            targetType: mapTargetType(target.category),
            regionFocus: target.states?.join(', ') || 'National',
            relationshipStatus: mapRelationshipStatus(target.status),
            nextAction: target.nextAction,
            whyPlausible: target.grantRelevance,
            tags: [
              `goods-outreach-${target.category}`,
              `goods-priority-${target.priority}`,
              ...(target.instrument ? [`goods-instrument-${target.instrument}`] : []),
            ],
            sourceOrgName: 'A Curious Tractor Pty Ltd',
            sourceOrgAbn: 'ACN 697 347 676',
            sourceIdentityName: 'Goods on Country',
          });

          const crmContactId = await persistOutreachTargetIdentity(target);

          return {
            targetId: target.id,
            name: target.name,
            targetType: mapTargetType(target.category),
            success: result.success,
            simulated: result.simulated ?? false,
            contactId: result.contact?.id || null,
            crmContactId,
            opportunityId: result.opportunity?.id || null,
            opportunityCreated: result.opportunityCreated ?? false,
            error: result.error || null,
          };
        } catch (error) {
          return {
            targetId: target.id,
            name: target.name,
            targetType: mapTargetType(target.category),
            success: false,
            simulated: false,
            contactId: null,
            crmContactId: null,
            opportunityId: null,
            opportunityCreated: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      }),
    );

    const successful = results.filter((r) => r.success).length;
    const failed = results.length - successful;
    const opportunitiesCreated = results.filter((r) => r.opportunityCreated).length;

    return NextResponse.json({
      totalTargets: results.length,
      successful,
      failed,
      opportunitiesCreated,
      results,
    });
  } catch (error) {
    console.error('Push outreach targets error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to push targets' },
      { status: 500 },
    );
  }
}
