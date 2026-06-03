/**
 * Gated raw HTML for the internal Photo + Video Review tool.
 *
 * This tool holds storyteller consent status, GPS coordinates, and Empathy
 * Ledger data, so it must NEVER live in `public/` (which is served ungated).
 * Instead the self-contained HTML sits beside this route and is streamed only
 * to authenticated admins. Two gates apply: `proxy.ts` redirects any
 * unauthenticated `/admin/*` request to `/admin/login`, and `requireAdmin()`
 * below enforces the admin role for anyone who reaches the handler.
 *
 * The HTML is a snapshot of `wiki/outputs/2026-06-03-goods-brand-guide/
 * photo-video-review.html`. If that source tool changes, re-copy it here.
 */
import { readFileSync } from 'node:fs';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let cachedHtml: string | null = null;
function loadHtml(): string {
  if (cachedHtml == null) {
    // `new URL(..., import.meta.url)` is traced by Next.js file tracing, so the
    // co-located .html is bundled into the serverless function.
    cachedHtml = readFileSync(new URL('./photo-review.html', import.meta.url), 'utf8');
  }
  return cachedHtml;
}

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  return new NextResponse(loadHtml(), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
