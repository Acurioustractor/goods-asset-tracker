import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = new Set([
  'requested', 'allocated', 'ready', 'demo', 'deployed', 'under_investigation', 'retired',
]);

/**
 * Bulk-allocate every asset in a batch (GB0-{batch}-*) to a community.
 *
 * Body:
 *   community_id:  string (required, must exist in communities)
 *   status:        string (optional, defaults to 'allocated' — sensible for pre-arrival staging)
 *   exclude:       string[] (optional, list of unique_ids to skip)
 *   note:          string (optional override audit-trail line; defaults sensible)
 *
 * Updates: community_id, community (denormalised), status, notes (append-only).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ batch: string }> }
) {
  const { batch } = await params;
  if (!batch || !/^[A-Za-z0-9_-]{1,32}$/.test(batch)) {
    return NextResponse.json({ error: 'invalid batch' }, { status: 400 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const community_id = typeof body.community_id === 'string' ? body.community_id.trim() : '';
  if (!community_id) {
    return NextResponse.json({ error: 'community_id required' }, { status: 400 });
  }

  const status = typeof body.status === 'string' && body.status.trim() ? body.status.trim() : 'allocated';
  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: `invalid status (got "${status}")` }, { status: 400 });
  }

  const exclude = Array.isArray(body.exclude) ? body.exclude.filter((x): x is string => typeof x === 'string') : [];
  const customNote = typeof body.note === 'string' ? body.note.trim() : '';

  const supabase = createServiceClient();

  // Resolve community to fail fast + grab display name
  const { data: community, error: cErr } = await supabase
    .from('communities')
    .select('id, name')
    .eq('id', community_id)
    .maybeSingle();
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
  if (!community) return NextResponse.json({ error: `community "${community_id}" not found` }, { status: 400 });

  // Find every asset in the batch
  const prefix = `GB0-${batch}`;
  const { data: assets, error: aErr } = await supabase
    .from('assets')
    .select('unique_id, notes, status, community_id')
    .or(`unique_id.eq.${prefix},unique_id.like.${prefix}-%,unique_id.like.${prefix}_%`);
  if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 });

  const targets = (assets || []).filter((a) => !exclude.includes(a.unique_id));
  if (targets.length === 0) {
    return NextResponse.json({ error: `no assets found for batch ${batch}` }, { status: 404 });
  }

  // Update each row individually so we can append a per-row audit note safely.
  // (Could optimize to a single SQL UPDATE with concat, but n=107 is fine.)
  const today = new Date().toISOString().slice(0, 10);
  const noteLine = customNote || `[${today}] bulk-allocated to ${community.name} (batch ${batch}, status=${status})`;

  const results = { ok: 0, failed: 0, errors: [] as Array<{ unique_id: string; error: string }> };

  for (const a of targets) {
    const existingNotes = a.notes ? `${a.notes}\n` : '';
    const { error } = await supabase
      .from('assets')
      .update({
        community_id: community.id,
        community: community.name,
        status,
        notes: `${existingNotes}${noteLine}`,
      })
      .eq('unique_id', a.unique_id);
    if (error) {
      results.failed++;
      results.errors.push({ unique_id: a.unique_id, error: error.message });
    } else {
      results.ok++;
    }
  }

  return NextResponse.json({
    batch,
    community_id: community.id,
    community: community.name,
    status,
    note: noteLine,
    total_found: assets?.length || 0,
    excluded: exclude.length,
    updated: results.ok,
    failed: results.failed,
    errors: results.errors,
  });
}
