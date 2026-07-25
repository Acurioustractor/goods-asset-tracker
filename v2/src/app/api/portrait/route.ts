// Portrait proxy. Storyteller portraits live in EL, and many are in a PRIVATE
// story-media bucket reachable only via the empathyledger.com proxy, which mints
// an expiring signed URL. Browsers can't reliably load that production redirect
// chain (localhost → www.empathyledger.com → non-www → signed supabase URL), so
// most portraits render as broken squares while Jimmy Frank's (a PUBLIC-bucket
// direct URL) works.
//
// This route fetches the portrait server-side — following the redirects, using
// the EL service key for the private bucket — and streams the image back from
// the SAME origin (localhost:3000 / goodsoncountry.com). Reliable, no CORS, no
// browser-side redirect flakiness. Falls back to 404 so the client shows initials.
//
//   /api/portrait?src=<url-encoded EL portrait url>

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const EL_KEY = (process.env.EMPATHY_LEDGER_SUPABASE_KEY || '').replace(/["']/g, '').trim();
// Only proxy from trusted hosts (prevents this becoming an open SSRF proxy).
const ALLOWED = [/(^|\.)empathyledger\.com$/, /\.supabase\.co$/];

// In-process cache of resolved portraits. The slow part is the server-side fetch
// to EL (follow redirects into the private story-media bucket); once one render
// resolves a portrait, every later render in this warm process serves it instantly
// instead of re-hitting EL. Capped so a long-lived process can't grow unbounded.
type CacheEntry = { body: ArrayBuffer; contentType: string; expires: number };
const CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1h
const CACHE_MAX = 300;

function cacheGet(key: string): CacheEntry | null {
  const hit = CACHE.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) {
    CACHE.delete(key);
    return null;
  }
  // refresh LRU position
  CACHE.delete(key);
  CACHE.set(key, hit);
  return hit;
}

function cacheSet(key: string, entry: CacheEntry) {
  CACHE.set(key, entry);
  while (CACHE.size > CACHE_MAX) {
    const oldest = CACHE.keys().next().value;
    if (oldest === undefined) break;
    CACHE.delete(oldest);
  }
}

function imageResponse(body: ArrayBuffer, contentType: string, cached: boolean) {
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // browser + CDN cache so we don't re-proxy every render
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800',
      'X-Portrait-Cache': cached ? 'hit' : 'miss',
    },
  });
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get('src');
  if (!src) return new NextResponse('src required', { status: 400 });

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return new NextResponse('bad src', { status: 400 });
  }
  if (url.protocol !== 'https:' || !ALLOWED.some((re) => re.test(url.hostname))) {
    return new NextResponse('host not allowed', { status: 403 });
  }

  const cached = cacheGet(src);
  if (cached) return imageResponse(cached.body, cached.contentType, true);

  try {
    // Supabase storage (public or signed) accepts the service key; the
    // empathyledger.com proxy ignores it. Follow redirects (default).
    const upstream = await fetch(url.toString(), {
      headers: url.hostname.endsWith('supabase.co') ? { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } : {},
      // 8s: portrait fetch shouldn't hang a page
      signal: AbortSignal.timeout(8000),
    });
    const ct = upstream.headers.get('content-type') || '';
    if (!upstream.ok || !ct.startsWith('image/')) {
      return new NextResponse('not an image', { status: 404 });
    }
    const body = await upstream.arrayBuffer();
    cacheSet(src, { body, contentType: ct, expires: Date.now() + CACHE_TTL_MS });
    return imageResponse(body, ct, false);
  } catch {
    return new NextResponse('fetch failed', { status: 404 });
  }
}
