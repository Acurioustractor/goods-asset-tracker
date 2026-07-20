// Media Room — media_links write endpoint. Typed junction between a media item
// (photo/video, wherever it lives) and the entities it shows (person, community,
// asset, product, story). Lets the Media Room inspector tag a photo/video to a
// product / community / story; the Atlas and community pages read these back.
//
// SECURITY: middleware guards /admin PAGES, not /api/admin/* routes, so this
// route MUST self-authorise via requireAdmin().

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';

type MediaSource = 'local' | 'el_media' | 'el_story' | 'supabase' | 'external';
type MediaKind = 'photo' | 'video' | 'diagram' | 'document';
type TargetType = 'person' | 'community' | 'asset' | 'product' | 'story';
type Relation = 'shows' | 'made_by' | 'taken_at' | 'about';

interface PostBody {
  media_source: MediaSource;
  media_key: string;
  media_type?: MediaKind;
  title?: string | null;
  target_type: TargetType;
  target_key: string;
  relation?: Relation;
  consent_status?: 'cleared' | 'held' | 'unknown' | 'not_required';
}

const MEDIA_SOURCES: MediaSource[] = ['local', 'el_media', 'el_story', 'supabase', 'external'];
const TARGET_TYPES: TargetType[] = ['person', 'community', 'asset', 'product', 'story'];

// GET /api/admin/media-link?media_source=..&media_key=.. → the links on one media item.
export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  const { searchParams } = new URL(request.url);
  const media_source = searchParams.get('media_source');
  const media_key = searchParams.get('media_key');
  if (!media_source || !media_key) {
    return NextResponse.json({ ok: false, error: 'media_source and media_key required' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('media_links')
    .select('id, target_type, target_key, relation, consent_status, source, title')
    .eq('media_source', media_source)
    .eq('media_key', media_key)
    .order('target_type');

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, links: data ?? [] });
}

// POST → add a link (idempotent on the unique constraint).
export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }

  if (!MEDIA_SOURCES.includes(body.media_source)) {
    return NextResponse.json({ ok: false, error: 'bad media_source' }, { status: 400 });
  }
  if (!TARGET_TYPES.includes(body.target_type)) {
    return NextResponse.json({ ok: false, error: 'bad target_type' }, { status: 400 });
  }
  if (!body.media_key || !body.target_key) {
    return NextResponse.json({ ok: false, error: 'media_key and target_key required' }, { status: 400 });
  }

  const row = {
    media_source: body.media_source,
    media_key: body.media_key,
    media_type: body.media_type ?? 'photo',
    title: body.title ?? null,
    target_type: body.target_type,
    target_key: body.target_key,
    relation: body.relation ?? 'shows',
    consent_status: body.consent_status ?? 'unknown',
    source: 'media-room',
  };

  const supabase = createServiceClient();
  // Upsert on the unique(media_source, media_key, target_type, target_key, relation)
  // so re-adding an existing link is a no-op and returns the row.
  const { data, error } = await supabase
    .from('media_links')
    .upsert(row, { onConflict: 'media_source,media_key,target_type,target_key,relation' })
    .select('id, target_type, target_key, relation, consent_status, source, title')
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, link: data });
}

// DELETE /api/admin/media-link?id=.. → remove one link.
export async function DELETE(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from('media_links').delete().eq('id', id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
