// Endpoint for the in-place media swap picker. Writes overrides to
// v2/data/field-note-overrides.json. Works in dev (and on any env
// where the FS is writable — Vercel prod is read-only, so swaps must
// be committed to git from local before they ship).

import { NextResponse } from 'next/server';
import { setStoryOverride } from '@/lib/field-notes/overrides';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

interface Body {
  slug?: string;
  key?: string;
  value?: string | null;
  updates?: { key: string; value: string | null }[];
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }
  const { slug, key, value, updates } = body;
  if (!slug) {
    return NextResponse.json({ ok: false, error: 'slug required' }, { status: 400 });
  }
  // Batch mode: write multiple keys atomically (e.g. el-video-gallery slot
  // override needs src + poster + title in one go so the slot doesn't
  // render half-resolved).
  if (Array.isArray(updates) && updates.length > 0) {
    try {
      for (const u of updates) {
        if (!u.key) continue;
        setStoryOverride(slug, u.key, u.value ?? null);
      }
      revalidatePath(`/field-notes/${slug}`);
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json(
        { ok: false, error: e instanceof Error ? e.message : String(e) },
        { status: 500 }
      );
    }
  }
  if (!key) {
    return NextResponse.json({ ok: false, error: 'key or updates required' }, { status: 400 });
  }
  try {
    setStoryOverride(slug, key, value ?? null);
    revalidatePath(`/field-notes/${slug}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
