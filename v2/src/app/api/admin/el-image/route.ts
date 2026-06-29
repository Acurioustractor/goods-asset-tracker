// Server-side proxy + cache for Empathy Ledger media thumbnails used by the Canon
// board picker. EL's media endpoint throttles bursts, so 50+ direct browser <img>
// loads blank out; routing them through here lets Next cache the upstream fetch and
// lets the browser cache the response, so repeat loads are instant and never blank.
//
// SSRF guard: only proxies EL hosts. Auth follows the existing /api/admin/canon-*
// pattern (gated by the admin middleware, not in-route).

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const KEY = process.env.EMPATHY_LEDGER_API_KEY || '';
const ALLOW = [/^https:\/\/www\.empathyledger\.com\//, /^https:\/\/[a-z0-9-]+\.supabase\.co\//];

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get('url');
  if (!url || !ALLOW.some((re) => re.test(url))) {
    return NextResponse.json({ error: 'url required, EL host only' }, { status: 400 });
  }
  try {
    const upstream = await fetch(url, {
      headers: KEY ? { 'X-API-Key': KEY } : {},
      cache: 'force-cache',
      next: { revalidate: 86400 },
    });
    if (!upstream.ok) return NextResponse.json({ error: `upstream ${upstream.status}` }, { status: 502 });
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
