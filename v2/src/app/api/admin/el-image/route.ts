// Server-side proxy + cache for Empathy Ledger media thumbnails used by the Canon
// board picker. EL's media endpoint throttles bursts, so 50+ direct browser <img>
// loads blank out; routing them through here lets Next cache the upstream fetch and
// lets the browser cache the response, so repeat loads are instant and never blank.
//
// SSRF guard: only proxies EL hosts. Auth follows the existing /api/admin/canon-*
// pattern (gated by the admin middleware, not in-route).

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';

const KEY = process.env.EMPATHY_LEDGER_API_KEY || '';
// EL Supabase storage host + service key: the private `story-media` bucket (the 52
// gated migrations) is only fetchable server-side with this key. We send it ONLY to
// the exact EL storage origin, never to any other allowed host.
const SB_URL = (process.env.EMPATHY_LEDGER_SUPABASE_URL || '').replace(/\/$/, '');
const SB_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const ALLOW = [/^https:\/\/www\.empathyledger\.com\//, /^https:\/\/[a-z0-9-]+\.supabase\.co\//];

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const url = new URL(req.url).searchParams.get('url');
  if (!url || !ALLOW.some((re) => re.test(url))) {
    return NextResponse.json({ error: 'url required, EL host only' }, { status: 400 });
  }
  // Gated EL storage objects need the Supabase service key; the public content-hub
  // host uses the content-hub API key. Anything else gets neither.
  const isGatedStorage = !!(SB_URL && SB_KEY && url.startsWith(`${SB_URL}/storage/`));
  const headers: Record<string, string> = isGatedStorage
    ? { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    : KEY
      ? { 'X-API-Key': KEY }
      : {};
  /*
   * A storage path does not say which bucket it is in. Rows that carry storage_path rather than
   * source_url lose the bucket name, so the caller has to guess one; if the guess is wrong the
   * object is still there, one bucket over. Try the other public buckets before giving up.
   */
  const PUBLIC_BUCKETS = ['story-images', 'media', 'story-media', 'gallery-photos', 'thumbnails'];
  const alternatives = (u: string): string[] => {
    const m = u.match(/^(.*\/storage\/v1\/object\/)([^/]+)\/(.+)$/);
    if (!m || !PUBLIC_BUCKETS.includes(m[2])) return [u];
    return [u, ...PUBLIC_BUCKETS.filter((b) => b !== m[2]).map((b) => `${m[1]}${b}/${m[3]}`)];
  };

  try {
    let upstream: Response | null = null;
    for (const attempt of alternatives(url)) {
      upstream = await fetch(attempt, { headers, cache: 'force-cache', next: { revalidate: 86400 } });
      if (upstream.ok) break;
    }
    if (!upstream || !upstream.ok) {
      return NextResponse.json({ error: `upstream ${upstream?.status ?? 'no response'}` }, { status: 502 });
    }
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'image/jpeg',
        // Gated bytes: keep them out of shared caches (admin-only, per-user).
        'Cache-Control': isGatedStorage
          ? 'private, max-age=3600, must-revalidate'
          : 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
