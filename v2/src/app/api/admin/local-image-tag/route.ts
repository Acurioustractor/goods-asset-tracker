// Endpoint for the media-library subject tagger (/admin/media-library).
// Writes LOCAL website image subject tags to v2/data/local-image-tags.json.
// Works in dev (and any env with a writable FS — Vercel prod is read-only, so
// tags must be committed to git from local before they ship). LOCAL-only: this
// route never touches Empathy Ledger.

import { NextResponse } from 'next/server';
import { setLocalImageTags } from '@/lib/data/local-image-tags';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

interface Body {
  url?: string;
  tags?: string[];
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }
  const { url, tags } = body;
  if (typeof url !== 'string' || !url.trim() || !url.startsWith('/images/')) {
    return NextResponse.json(
      { ok: false, error: 'url must be a non-empty /images/... path' },
      { status: 400 },
    );
  }
  if (!Array.isArray(tags)) {
    return NextResponse.json({ ok: false, error: 'tags must be an array' }, { status: 400 });
  }
  try {
    setLocalImageTags(url, tags);
    revalidatePath('/admin/media-library');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
