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

/**
 * EL's OWN MEDIA API IS NOT THE WAY IN ANY MORE.
 *
 * Every storyteller portrait in EL is recorded as /api/media/<uuid>/file, and on 17 September
 * 2026 that endpoint answered {"error":"Not available"} with a 403 for 23 of the 26 Goods
 * portraits, with or without an API key. The files were never gone: media_assets still had every
 * row, and the storage paths had been moved under `relocated/`, which is the shape of a migration
 * that took the API's view of the file with it.
 *
 * So resolve the id in the database instead of asking the API. media_assets gives the bucket and
 * the path, and the service key reads the private story-media bucket directly. Same image, one
 * hop fewer, and it does not depend on an EL web route staying up.
 */
const EL_URL = (process.env.EMPATHY_LEDGER_SUPABASE_URL || '').replace(/\/$/, '');
const MEDIA_ID = /\/api\/media\/([0-9a-fA-F-]{36})\/file/;

async function fetchViaMediaAssets(mediaId: string): Promise<Response | null> {
  if (!EL_URL || !EL_KEY) return null;
  const headers = { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` };
  try {
    const lookup = await fetch(
      `${EL_URL}/rest/v1/media_assets?id=eq.${mediaId}&select=storage_bucket,storage_path`,
      { headers, signal: AbortSignal.timeout(8000) },
    );
    if (!lookup.ok) return null;
    const rows = (await lookup.json()) as { storage_bucket?: string; storage_path?: string }[];
    const row = rows?.[0];
    if (!row?.storage_bucket || !row?.storage_path) return null;
    const objectUrl = `${EL_URL}/storage/v1/object/${row.storage_bucket}/${row.storage_path
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`;
    const res = await fetch(objectUrl, { headers, signal: AbortSignal.timeout(8000) });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/**
 * A STORAGE URL THAT 400s, REPAIRED BY FILENAME — AND ONLY WHEN THE FILENAME IS UNAMBIGUOUS.
 *
 * Ana - Bega's portrait is recorded in EL as a public-bucket URL that no longer resolves, while
 * the file itself sits at relocated/profile-images/storytellers/ana___bega.jpg. The basename
 * survived the move, so it is enough to find the file again.
 *
 * It is enough ONLY when exactly one row matches. Two files called the same thing would make this
 * a coin toss, and the losing side of that toss is a photograph of the wrong person under
 * somebody's name, on a page about consent. So more than one match returns nothing and the avatar
 * falls back to initials, which is the honest answer.
 */
async function fetchByFilename(objectUrl: URL): Promise<Response | null> {
  if (!EL_URL || !EL_KEY) return null;
  const basename = decodeURIComponent(objectUrl.pathname.split('/').pop() || '');
  if (!basename || !/\.(jpe?g|png|webp|gif|avif)$/i.test(basename)) return null;
  const headers = { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` };
  try {
    const lookup = await fetch(
      `${EL_URL}/rest/v1/media_assets?storage_path=ilike.*${encodeURIComponent(basename)}&select=storage_bucket,storage_path&limit=2`,
      { headers, signal: AbortSignal.timeout(8000) },
    );
    if (!lookup.ok) return null;
    const rows = (await lookup.json()) as { storage_bucket?: string; storage_path?: string }[];
    if (rows.length !== 1) return null; // ambiguous, or nothing. Initials are better than a guess.
    const row = rows[0];
    if (!row.storage_bucket || !row.storage_path) return null;
    const res = await fetch(
      `${EL_URL}/storage/v1/object/${row.storage_bucket}/${row.storage_path.split('/').map(encodeURIComponent).join('/')}`,
      { headers, signal: AbortSignal.timeout(8000) },
    );
    return res.ok ? res : null;
  } catch {
    return null;
  }
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
    // An EL media id resolves through the database, not through EL's media API.
    const mediaId = src.match(MEDIA_ID)?.[1];
    if (mediaId) {
      const viaDb = await fetchViaMediaAssets(mediaId);
      const dbType = viaDb?.headers.get('content-type') || '';
      if (viaDb && dbType.startsWith('image/')) {
        const body = await viaDb.arrayBuffer();
        cacheSet(src, { body, contentType: dbType, expires: Date.now() + CACHE_TTL_MS });
        return imageResponse(body, dbType, false);
      }
    }

    // Supabase storage (public or signed) accepts the service key; the
    // empathyledger.com proxy ignores it. Follow redirects (default).
    const upstream = await fetch(url.toString(), {
      headers: url.hostname.endsWith('supabase.co') ? { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } : {},
      // 8s: portrait fetch shouldn't hang a page
      signal: AbortSignal.timeout(8000),
    });
    let ct = upstream.headers.get('content-type') || '';
    if (!upstream.ok || !ct.startsWith('image/')) {
      // A moved file keeps its name. One unambiguous match, or initials.
      const repaired = url.hostname.endsWith('supabase.co') ? await fetchByFilename(url) : null;
      const repairedType = repaired?.headers.get('content-type') || '';
      if (!repaired || !repairedType.startsWith('image/')) {
        return new NextResponse('not an image', { status: 404 });
      }
      const repairedBody = await repaired.arrayBuffer();
      cacheSet(src, { body: repairedBody, contentType: repairedType, expires: Date.now() + CACHE_TTL_MS });
      return imageResponse(repairedBody, repairedType, false);
    }
    const body = await upstream.arrayBuffer();
    cacheSet(src, { body, contentType: ct, expires: Date.now() + CACHE_TTL_MS });
    return imageResponse(body, ct, false);
  } catch {
    return new NextResponse('fetch failed', { status: 404 });
  }
}
