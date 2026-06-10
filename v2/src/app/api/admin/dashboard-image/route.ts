// Endpoint for the partner-dashboard image picker (/admin/dashboard-images).
// Writes EL photo assignments to v2/data/partner-dashboard-images.json. Works
// in dev (and any env with a writable FS — Vercel prod is read-only, so picks
// must be committed to git from local before they ship).

import { NextResponse } from 'next/server';
import { setDashboardImage, type DashboardImageAssignment } from '@/lib/data/partner-dashboard-images';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

interface Body {
  slug?: string;
  slotKey?: string;
  value?: DashboardImageAssignment | null;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }
  const { slug, slotKey, value } = body;
  if (!slug || !slotKey) {
    return NextResponse.json({ ok: false, error: 'slug and slotKey required' }, { status: 400 });
  }
  try {
    setDashboardImage(slug, slotKey, value && value.url ? value : null);
    revalidatePath(`/partners/${slug}/dashboard`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
