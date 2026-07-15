// Media picker feed — the swap widget's data source.
// Returns LOCAL (repo-committed, web-served) images and videos from
// content_items, starred first, for the deck builder's photo/video swap
// picker. Local-only on purpose: anything picked here can be committed
// straight into deck.ts and will render on the public site. EL media needs
// its own consent path and is deliberately excluded from this feed.
//
// SECURITY: the middleware only guards /admin PAGES, not /api/admin/* routes,
// so this route MUST self-authorise (same pattern as content-item).

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';

export interface MediaPickItem {
  id: string;
  url: string;
  poster_url: string | null;
  media_type: 'image' | 'video';
  area: string | null;
  starred: boolean;
  tags: string[];
}

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  const kind = request.nextUrl.searchParams.get('kind'); // 'image' | 'video' | null (both)

  const supabase = createServiceClient();
  let query = supabase
    .from('content_items')
    .select('id,url,poster_url,media_type,area,starred,tags')
    .eq('source', 'local')
    .is('archived_at', null)
    .like('url', '/%')
    .order('starred', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(800);
  if (kind === 'image' || kind === 'video') query = query.eq('media_type', kind);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, items: (data ?? []) as MediaPickItem[] });
}
