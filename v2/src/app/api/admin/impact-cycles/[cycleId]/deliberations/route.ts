import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { parseCreateImpactDeliberationInput } from '@/lib/impact-system/input';
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
  const parsed = parseCreateImpactDeliberationInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { cycleId } = await params;
  const input = parsed.value;
  const supabase = createServiceClient();
  const [cycleResult, observationsResult] = await Promise.all([
    supabase.from('community_impact_cycles').select('id').eq('id', cycleId).maybeSingle(),
    supabase
      .from('community_impact_observations')
      .select('id')
      .eq('impact_cycle_id', cycleId)
      .in('id', input.observationIds),
  ]);
  if (cycleResult.error) {
    return NextResponse.json({ error: cycleResult.error.message }, { status: 500 });
  }
  if (!cycleResult.data) {
    return NextResponse.json({ error: 'Impact cycle not found.' }, { status: 404 });
  }
  if (observationsResult.error) {
    return NextResponse.json({ error: observationsResult.error.message }, { status: 500 });
  }
  if ((observationsResult.data || []).length !== new Set(input.observationIds).size) {
    return NextResponse.json(
      { error: 'Every selected observation must belong to this impact cycle.' },
      { status: 400 },
    );
  }
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
    .from('community_impact_deliberations')
    .insert({
      impact_cycle_id: cycleId,
      goal_id: input.goalId ?? null,
      title: input.title,
      held_at: input.heldAt,
      participants_summary: input.participantsSummary,
      authority_basis: input.authorityBasis,
      observation_ids: Array.from(new Set(input.observationIds)),
      what_matters: input.whatMatters,
      selected_change: input.selectedChange ?? null,
      selection_reason: input.selectionReason ?? null,
      dissent: input.dissent,
      harms_or_burdens: input.harmsOrBurdens,
    })
    .select('*')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deliberation: data }, { status: 201 });
}
