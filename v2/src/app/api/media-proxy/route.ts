// Same-origin image proxy for Empathy Ledger media.
//
// EL portrait/media URLs (www.empathyledger.com/api/media/<id>/file) 307-redirect
// through to short-lived SIGNED Supabase URLs, and EL's proxy rejects browser-origin
// <img> requests (they error even though a server-side fetch follows the chain fine).
// So we fetch server-side here and stream the bytes back same-origin. Also transparently
// survives signed-URL expiry (re-fetched each request) and hotlink checks.
//
// NOT an open proxy: https only, host allowlist, and the response must be an image.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = new Set([
  'empathyledger.com',
  'www.empathyledger.com',
  'yvnuayzslukamizrlhwb.supabase.co', // EL Supabase storage
]);

export async function GET(req: Request) {
  const src = new URL(req.url).searchParams.get('src');
  if (!src) return new NextResponse('missing src', { status: 400 });

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return new NextResponse('bad src', { status: 400 });
  }
  if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
    return new NextResponse('host not allowed', { status: 403 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      redirect: 'follow',
      headers: { Accept: 'image/*' },
      cache: 'no-store',
    });
    if (!upstream.ok) return new NextResponse(`upstream ${upstream.status}`, { status: 502 });
    const ct = upstream.headers.get('content-type') || 'image/jpeg';
    if (!ct.startsWith('image/')) return new NextResponse('not an image', { status: 415 });
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': ct,
        // Cache hard: portraits rarely change and the upstream signed URLs are costly.
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return new NextResponse('fetch failed', { status: 502 });
  }
}
