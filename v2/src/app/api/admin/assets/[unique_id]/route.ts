import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const EDITABLE_FIELDS = new Set([
  'name',
  'community',
  'community_id',
  'place',
  'status',
  'notes',
  'partner_name',
  'gps',
  'household_size',
  'theme_tag',
  'recipient_consent_at',
  'recipient_name',
  'install_photo_url',
]);

const VALID_THEME_TAGS = new Set([
  'practical-need',
  'circular-value',
  'youth-pathway',
  'local-production',
  'health-comfort',
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ unique_id: string }> }
) {
  const { unique_id } = await params;

  if (!unique_id || !/^[A-Za-z0-9_-]{1,64}$/.test(unique_id)) {
    return NextResponse.json({ error: 'invalid unique_id' }, { status: 400 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!EDITABLE_FIELDS.has(k)) continue;
    if (typeof v === 'string' && v.trim() === '') {
      patch[k] = null;
    } else {
      patch[k] = v;
    }
  }

  if ('household_size' in patch && patch.household_size !== null) {
    const n = Number(patch.household_size);
    if (!Number.isFinite(n) || n <= 0 || n > 49) {
      return NextResponse.json({ error: 'household_size must be 1-49' }, { status: 400 });
    }
    patch.household_size = Math.round(n);
  }
  if ('theme_tag' in patch && patch.theme_tag !== null) {
    if (typeof patch.theme_tag !== 'string' || !VALID_THEME_TAGS.has(patch.theme_tag)) {
      return NextResponse.json({ error: 'invalid theme_tag' }, { status: 400 });
    }
  }

  const appendNote = typeof body.appendNote === 'string' ? body.appendNote.trim() : '';

  if (Object.keys(patch).length === 0 && !appendNote) {
    return NextResponse.json({ error: 'no editable fields supplied' }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (appendNote) {
    const { data: current } = await supabase
      .from('assets')
      .select('notes')
      .eq('unique_id', unique_id)
      .single();
    const existing = current?.notes ? `${current.notes}\n` : '';
    patch.notes = `${existing}${appendNote}`;
  }

  // If community_id is provided, look up the canonical name to keep the
  // denormalised `community` column in sync. Explicit `community` in the body
  // wins (lets callers override display name if needed).
  if (typeof patch.community_id === 'string' && patch.community_id && !('community' in body)) {
    const { data: community } = await supabase
      .from('communities')
      .select('name')
      .eq('id', patch.community_id)
      .maybeSingle();
    if (community?.name) {
      patch.community = community.name;
    } else {
      return NextResponse.json({ error: `community_id "${patch.community_id}" not found` }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from('assets')
    .update(patch)
    .eq('unique_id', unique_id)
    .select(
      'unique_id, name, community, community_id, place, status, notes, partner_name, gps, supply_date, product, qr_url'
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, asset: data });
}
