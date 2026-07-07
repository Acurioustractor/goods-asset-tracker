// EL photo↔people alignment write endpoint. Adds/removes a media_storytellers
// row (the EL source-of-truth junction) for one photo + one storyteller. Consent
// is written as `pending`, so nothing here can auto-publish. Self-authorises:
// middleware guards /admin PAGES, not /api/admin/* routes.

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { alignAdd, alignRemove } from '@/lib/empathy-ledger/align';

export const runtime = 'nodejs';

interface Body { mediaAssetId?: string; storytellerId?: string; action?: 'add' | 'remove'; }

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }
  const { mediaAssetId, storytellerId, action } = body;
  if (!mediaAssetId || !storytellerId) {
    return NextResponse.json({ ok: false, error: 'mediaAssetId and storytellerId are required' }, { status: 400 });
  }
  const res = action === 'remove'
    ? await alignRemove(mediaAssetId, storytellerId)
    : await alignAdd(mediaAssetId, storytellerId);
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}
