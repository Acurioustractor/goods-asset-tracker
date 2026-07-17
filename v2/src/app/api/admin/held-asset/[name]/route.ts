/**
 * Gated delivery for checkpoint-held review diagrams.
 *
 * The operating-model and ownership-pathway drawings are NOT approved for
 * any public surface while checkpoint 25 is open (Ben confirmed the full
 * hold 2026-07-17, including pulling ownership-v2 off /process and
 * /cost-story). Held files must never live in `public/` (served ungated;
 * both were URL-reachable on prod at guessable root paths until this route
 * replaced them). They sit beside this route in `../assets/` and stream
 * only to authenticated admins, for the internal-review view of the pitch
 * proof drawer.
 *
 * The allowlist below is deliberate: this route must never grow into a
 * generic file server. Add a held asset = add one literal `new URL` entry
 * (literal so Next.js file tracing bundles it into the serverless function;
 * next.config.ts carries a belt-and-braces include like photo-review's).
 */
import { readFileSync } from 'node:fs';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HELD_ASSETS: Record<string, { url: URL; contentType: string }> = {
  'goods-community-ownership-v2.png': {
    url: new URL('../assets/goods-community-ownership-v2.png', import.meta.url),
    contentType: 'image/png',
  },
  'operating-model.png': {
    url: new URL('../assets/operating-model.png', import.meta.url),
    contentType: 'image/png',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  const { name } = await params;
  const asset = HELD_ASSETS[name];
  if (!asset) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  try {
    const file = readFileSync(asset.url);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': asset.contentType,
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
}
