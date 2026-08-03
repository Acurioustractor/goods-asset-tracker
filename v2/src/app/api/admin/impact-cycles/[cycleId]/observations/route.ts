import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { parseCreateImpactObservationInput } from '@/lib/impact-system/input';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cycleId: string }> },
) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }
  const parsed = parseCreateImpactObservationInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { cycleId } = await params;
  const supabase = createServiceClient();
  const { data: cycle, error: cycleError } = await supabase
    .from('community_impact_cycles')
    .select('id')
    .eq('id', cycleId)
    .maybeSingle();
  if (cycleError) return NextResponse.json({ error: cycleError.message }, { status: 500 });
  if (!cycle) return NextResponse.json({ error: 'Impact cycle not found.' }, { status: 404 });

  const input = parsed.value;
  if (input.goalId) {
    const { data: goal, error: goalError } = await supabase
      .from('community_impact_goals')
      .select('id')
      .eq('id', input.goalId)
      .eq('impact_cycle_id', cycleId)
      .maybeSingle();
    if (goalError) return NextResponse.json({ error: goalError.message }, { status: 500 });
    if (!goal) {
      return NextResponse.json({ error: 'Goal does not belong to this impact cycle.' }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from('community_impact_observations')
    .insert({
      impact_cycle_id: cycleId,
      goal_id: input.goalId ?? null,
      observation_type: input.observationType,
      title: input.title,
      description: input.description,
      occurred_at: input.occurredAt,
      direction: input.direction ?? null,
      evidence_system: input.evidenceSystem,
      evidence_type: input.evidenceType,
      evidence_external_id: input.evidenceExternalId ?? null,
      evidence_url: input.evidenceUrl ?? null,
      evidence_version: input.evidenceVersion ?? null,
      evidence_strength: input.evidenceStrength,
      source_start_seconds: input.sourceStartSeconds ?? null,
      source_end_seconds: input.sourceEndSeconds ?? null,
      speaker_name: input.speakerName ?? null,
      speaker_storyteller_id: input.speakerStorytellerId ?? null,
      consent_state: input.consentState,
      consent_basis: input.consentBasis ?? null,
      approved_purposes: input.approvedPurposes,
      approved_audiences: input.approvedAudiences,
      claim_boundary: input.claimBoundary,
      restricted: input.restricted,
      follow_up_needed: input.followUpNeeded,
      follow_up_on: input.followUpOn ?? null,
    })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ observation: data }, { status: 201 });
}
