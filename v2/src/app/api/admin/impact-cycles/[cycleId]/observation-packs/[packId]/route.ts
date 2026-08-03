import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { getEvidencePack } from '@/lib/impact-system/evidence-packs';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cycleId: string; packId: string }> },
) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }
  const occurredAt =
    body && typeof body === 'object' && !Array.isArray(body)
      ? (body as Record<string, unknown>).occurredAt
      : undefined;
  if (typeof occurredAt !== 'string' || Number.isNaN(Date.parse(occurredAt))) {
    return NextResponse.json(
      { error: 'occurredAt must be the confirmed interview or event date.' },
      { status: 400 },
    );
  }

  const { cycleId, packId } = await params;
  const pack = getEvidencePack(packId);
  if (!pack) return NextResponse.json({ error: 'Evidence pack not found.' }, { status: 404 });

  const supabase = createServiceClient();
  const { data: cycle, error: cycleError } = await supabase
    .from('community_impact_cycles')
    .select('id, community_id')
    .eq('id', cycleId)
    .maybeSingle();
  if (cycleError) return NextResponse.json({ error: cycleError.message }, { status: 500 });
  if (!cycle) return NextResponse.json({ error: 'Impact cycle not found.' }, { status: 404 });
  if (!pack.communityIds.includes(cycle.community_id)) {
    return NextResponse.json(
      { error: 'This evidence pack does not belong to the cycle community.' },
      { status: 400 },
    );
  }

  const versions = pack.observations
    .map((observation) => observation.evidenceVersion)
    .filter((version): version is string => Boolean(version));
  const { data: existing, error: existingError } = await supabase
    .from('community_impact_observations')
    .select('evidence_version')
    .eq('impact_cycle_id', cycleId)
    .eq('evidence_system', pack.sourceSystem)
    .eq('evidence_external_id', pack.sourceExternalId)
    .in('evidence_version', versions);
  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
  const existingVersions = new Set((existing || []).map((row) => row.evidence_version));
  const pending = pack.observations.filter(
    (observation) => !existingVersions.has(observation.evidenceVersion),
  );

  if (pending.length === 0) {
    return NextResponse.json({ imported: 0, skipped: pack.observations.length });
  }

  const { error } = await supabase.from('community_impact_observations').insert(
    pending.map((observation) => ({
      impact_cycle_id: cycleId,
      goal_id: null,
      observation_type: observation.observationType,
      title: observation.title,
      description: observation.description,
      occurred_at: occurredAt,
      direction: observation.direction ?? null,
      evidence_system: observation.evidenceSystem,
      evidence_type: observation.evidenceType,
      evidence_external_id: observation.evidenceExternalId ?? null,
      evidence_url: observation.evidenceUrl ?? null,
      evidence_version: observation.evidenceVersion ?? null,
      evidence_strength: observation.evidenceStrength,
      source_start_seconds: observation.sourceStartSeconds ?? null,
      source_end_seconds: observation.sourceEndSeconds ?? null,
      speaker_name: observation.speakerName ?? null,
      speaker_storyteller_id: observation.speakerStorytellerId ?? null,
      consent_state: observation.consentState,
      consent_basis: observation.consentBasis ?? null,
      approved_purposes: observation.approvedPurposes,
      approved_audiences: observation.approvedAudiences,
      claim_boundary: observation.claimBoundary,
      restricted: true,
      follow_up_needed: observation.followUpNeeded,
      follow_up_on: null,
    })),
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    imported: pending.length,
    skipped: pack.observations.length - pending.length,
  });
}
