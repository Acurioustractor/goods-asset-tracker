import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { parseCreateImpactCycleInput } from '@/lib/impact-system/input';
import { createServiceClient } from '@/lib/supabase/server';

const CYCLE_COLUMNS = `
  id,
  community_id,
  title,
  purpose,
  status,
  local_language_name,
  lead_organisation,
  authority_summary,
  decision_protocol,
  data_custody_preference,
  review_cadence,
  next_review_at,
  approved_for_public_summary,
  public_summary_approved_at,
  created_at,
  updated_at
`;

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  const communityId = new URL(request.url).searchParams.get('communityId');
  const supabase = createServiceClient();
  let query = supabase
    .from('community_impact_cycles')
    .select(CYCLE_COLUMNS)
    .order('updated_at', { ascending: false });
  if (communityId) query = query.eq('community_id', communityId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cycles: data ?? [] });
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }
  const parsed = parseCreateImpactCycleInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const input = parsed.value;
  const supabase = createServiceClient();
  const { data: community, error: communityError } = await supabase
    .from('communities')
    .select('id')
    .eq('id', input.communityId)
    .maybeSingle();
  if (communityError) {
    return NextResponse.json({ error: communityError.message }, { status: 500 });
  }
  if (!community) {
    return NextResponse.json({ error: 'Community not found.' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('community_impact_cycles')
    .insert({
      community_id: input.communityId,
      title: input.title,
      purpose: input.purpose,
      local_language_name: input.localLanguageName ?? null,
      lead_organisation: input.leadOrganisation ?? null,
      authority_summary: input.authoritySummary ?? null,
      decision_protocol: input.decisionProtocol ?? null,
      data_custody_preference: input.dataCustodyPreference ?? null,
      review_cadence: input.reviewCadence ?? null,
      next_review_at: input.nextReviewAt ?? null,
    })
    .select(CYCLE_COLUMNS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cycle: data }, { status: 201 });
}

