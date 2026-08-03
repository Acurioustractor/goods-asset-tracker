import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { parseCreateImpactGoalInput } from '@/lib/impact-system/input';
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
  const parsed = parseCreateImpactGoalInput(body);
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
  const { data, error } = await supabase
    .from('community_impact_goals')
    .insert({
      impact_cycle_id: cycleId,
      local_name: input.localName,
      why_it_matters: input.whyItMatters,
      desired_change: input.desiredChange,
      unacceptable_changes: input.unacceptableChanges,
      goods_domain_mappings: input.goodsDomainMappings,
      desired_direction: input.desiredDirection ?? null,
      baseline_description: input.baselineDescription ?? null,
      review_cadence: input.reviewCadence ?? null,
      next_review_at: input.nextReviewAt ?? null,
    })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ goal: data }, { status: 201 });
}
