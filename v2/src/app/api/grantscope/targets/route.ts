import { NextRequest, NextResponse } from 'next/server';
import { ghl } from '@/lib/ghl';

type StrategicTargetPayload = {
  targetType: 'buyer' | 'capital' | 'partner';
  targetId: string;
  organizationName: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  regionFocus: string;
  relationshipStatus: string;
  nextAction: string;
  contactSurface: string;
  whyPlausible: string;
  tags: string[];
  sourceUrl?: string;
  communityFocusName?: string;
  communityFocusPostcode?: string;
  communityFocusState?: string;
  suggestedPipelineLabel?: string;
  suggestedStageLabel?: string;
  sourceOrgName: string;
  sourceOrgAbn?: string;
  sourceEntityGsId?: string;
  sourceIdentityName: string;
};

type RequestBody = {
  source?: string;
  targetType?: 'buyer' | 'capital' | 'partner';
  targets?: StrategicTargetPayload[];
};

const EXPECTED_SECRET =
  process.env.GRANTSCOPE_SYNC_SECRET ||
  process.env.GOODS_GRANTSCOPE_SYNC_SECRET ||
  '';

export async function POST(request: NextRequest) {
  try {
    if (EXPECTED_SECRET) {
      const providedSecret = request.headers.get('x-grantscope-secret') || '';
      if (!providedSecret || providedSecret !== EXPECTED_SECRET) {
        return NextResponse.json({ error: 'Invalid sync secret.' }, { status: 401 });
      }
    }

    const body = (await request.json()) as RequestBody;
    const targets = Array.isArray(body.targets) ? body.targets : [];

    if (!targets.length) {
      return NextResponse.json({ error: 'No strategic targets provided.' }, { status: 400 });
    }

    const results = await Promise.all(
      targets.map(async (target) => {
        const result = await ghl.createStrategicTargetContact(target);
        return {
          targetId: target.targetId,
          organizationName: target.organizationName,
          success: result.success,
          simulated: result.simulated ?? false,
          contactId: result.contact?.id || null,
          opportunityId: result.opportunity?.id || null,
          opportunityCreated: result.opportunityCreated ?? false,
          pipelineConfigured: result.pipelineConfigured ?? false,
          error: result.error || null,
        };
      }),
    );

    const successful = results.filter((result) => result.success).length;
    const failed = results.length - successful;
    const opportunitiesCreated = results.filter((result) => result.opportunityCreated).length;

    return NextResponse.json({
      source: body.source || 'grantscope-goods-workspace',
      targetType: body.targetType || null,
      successful,
      failed,
      opportunitiesCreated,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to sync Goods strategic targets.',
      },
      { status: 500 },
    );
  }
}
