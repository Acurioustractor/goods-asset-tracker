// People CRM — curated override write endpoint.
// Upserts editable display fields (photo/bio/featured/hidden) into
// public.people_overrides, keyed by the aggregator person id.
//
// SECURITY: the middleware only guards /admin PAGES, not /api/admin/* routes,
// so this route MUST self-authorise via requireAdmin(). Writes use the service
// key (people_overrides is RLS default-deny; service_role bypasses).

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';

interface Body {
  person_id?: string;
  photo_url?: string | null;
  bio?: string | null;
  featured?: boolean;
  hidden?: boolean;
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }

  const personId = typeof body.person_id === 'string' ? body.person_id.trim() : '';
  if (!personId) {
    return NextResponse.json({ ok: false, error: 'person_id required' }, { status: 400 });
  }

  const row: Record<string, unknown> = { person_id: personId, updated_at: new Date().toISOString() };
  if ('photo_url' in body) row.photo_url = body.photo_url ? String(body.photo_url).trim() : null;
  if ('bio' in body) row.bio = body.bio ? String(body.bio) : null;
  if (typeof body.featured === 'boolean') row.featured = body.featured;
  if (typeof body.hidden === 'boolean') row.hidden = body.hidden;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('people_overrides')
    .upsert(row, { onConflict: 'person_id' })
    .select('person_id, photo_url, bio, featured, hidden')
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, override: data });
}
