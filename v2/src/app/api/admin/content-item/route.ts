// Content system — Phase 0: curation write endpoint.
// Writes star / rating / archive / tag state to public.content_items for one or
// many items. Replaces the per-surface write routes over time (local-image-tag,
// canon-el-pick, dashboard-image).
//
// SECURITY: the middleware only guards /admin PAGES, not /api/admin/* routes, so
// this route MUST self-authorise. requireAdmin() enforces the admin session.

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';

interface Body {
  id?: string;
  ids?: string[];
  starred?: boolean;
  rating?: number | null;
  archived?: boolean;
  tags?: string[];
  consent_tier?: 'public' | 'gated' | 'red';
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

  const ids = (body.ids ?? (body.id ? [body.id] : [])).filter((x) => typeof x === 'string' && x);
  if (ids.length === 0) {
    return NextResponse.json({ ok: false, error: 'provide id or ids[]' }, { status: 400 });
  }

  // Build the patch from only the fields actually supplied.
  const patch: Record<string, unknown> = {};
  if (typeof body.starred === 'boolean') patch.starred = body.starred;
  if (body.rating === null) patch.rating = null;
  else if (typeof body.rating === 'number') {
    if (!Number.isInteger(body.rating) || body.rating < 0 || body.rating > 5) {
      return NextResponse.json({ ok: false, error: 'rating must be an integer 0..5 or null' }, { status: 400 });
    }
    patch.rating = body.rating;
  }
  if (typeof body.archived === 'boolean') {
    patch.archived_at = body.archived ? new Date().toISOString() : null;
    if (!body.archived) patch.archive_path = null; // un-archive clears the (not-yet-applied) move target
  }
  if (Array.isArray(body.tags)) patch.tags = body.tags.filter((t) => typeof t === 'string');
  if (body.consent_tier && ['public', 'gated', 'red'].includes(body.consent_tier)) {
    patch.consent_tier = body.consent_tier;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, error: 'no updatable fields provided' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('content_items')
    .update(patch)
    .in('id', ids)
    .select('id');

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, updated: data?.length ?? 0 });
}
