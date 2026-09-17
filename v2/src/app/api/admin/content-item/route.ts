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
  community_id?: string | null;
  /** Free-text curation note (nullable text column; cap 2000 chars). */
  notes?: string | null;
  /**
   * PHOTOGRAPHS THAT HAVE NO ROW YET, SO THEY CAN BE TAGGED ANYWAY.
   *
   * 70 images sat on disk and in the grid with no content_items row, which made them invisible
   * to every write: select them, hit a tag, and the bulk tagger skipped them in silence because
   * it filters on contentId. Registering them takes one insert, so the tag itself registers them
   * rather than sending somebody to a terminal to run content:index first.
   */
  create?: { ref: string; url?: string; mediaType?: 'image' | 'video' }[];
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
  const toCreate = (Array.isArray(body.create) ? body.create : []).filter((c) => c && typeof c.ref === 'string' && c.ref);
  if (ids.length === 0 && toCreate.length === 0) {
    return NextResponse.json({ ok: false, error: 'provide id, ids[] or create[]' }, { status: 400 });
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
  // Community tag: a uuid FK to communities.id, or null to clear.
  if ('community_id' in body) {
    patch.community_id = body.community_id ? String(body.community_id) : null;
  }
  // Curation note: free text or null to clear. Requires the nullable `notes`
  // column (ALTER TABLE content_items ADD COLUMN IF NOT EXISTS notes text).
  if ('notes' in body) {
    if (body.notes !== null && typeof body.notes !== 'string') {
      return NextResponse.json({ ok: false, error: 'notes must be a string or null' }, { status: 400 });
    }
    const trimmed = body.notes === null ? '' : body.notes.trim();
    patch.notes = trimmed ? trimmed.slice(0, 2000) : null;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: false, error: 'no updatable fields provided' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Register anything that has no row yet, then treat it like any other item.
  let registered = 0;
  for (const c of toCreate.slice(0, 500)) {
    const { data: found } = await supabase.from('content_items').select('id').eq('ref', c.ref).maybeSingle();
    if (found?.id) {
      ids.push(found.id as string);
      continue;
    }
    const { data: ins, error: insErr } = await supabase
      .from('content_items')
      .insert({
        source: 'local',
        ref: c.ref,
        url: c.url || c.ref,
        media_type: c.mediaType === 'video' ? 'video' : 'image',
        // "/images/act/mark.png" -> "act", the same area the crawler assigns.
        area: c.ref.split('/')[2] || 'unplaced',
        consent_tier: 'gated',
      })
      .select('id')
      .single();
    if (insErr) {
      return NextResponse.json({ ok: false, error: `could not register ${c.ref}: ${insErr.message}` }, { status: 500 });
    }
    if (ins?.id) {
      ids.push(ins.id as string);
      registered += 1;
    }
  }

  const { data, error } = await supabase
    .from('content_items')
    .update(patch)
    .in('id', ids)
    .select('id');

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, updated: data?.length ?? 0, registered });
}
