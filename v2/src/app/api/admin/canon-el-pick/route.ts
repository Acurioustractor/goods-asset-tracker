// Endpoint for the Canon board's Empathy Ledger picker (/admin/canon).
// Pins / unpins an EL photo to a QBE area. Writes to v2/data/canon-el-picks.json
// (dev/local writable FS; Vercel prod is read-only, so picks must be committed
// from local before they ship).

import { NextResponse } from 'next/server';
import { addCanonElPick, removeCanonElPick, type CanonElPick } from '@/lib/data/canon-el-picks';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

interface Body {
  areaId?: string;
  action?: 'add' | 'remove';
  pick?: CanonElPick;
  elId?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }
  const { areaId, action } = body;
  if (!areaId || !action) {
    return NextResponse.json({ ok: false, error: 'areaId and action required' }, { status: 400 });
  }
  try {
    if (action === 'add') {
      if (!body.pick?.url || !body.pick?.elId) {
        return NextResponse.json(
          { ok: false, error: 'pick.url and pick.elId required' },
          { status: 400 },
        );
      }
      addCanonElPick(areaId, body.pick);
    } else if (action === 'remove') {
      const elId = body.elId || body.pick?.elId;
      if (!elId) {
        return NextResponse.json({ ok: false, error: 'elId required' }, { status: 400 });
      }
      removeCanonElPick(areaId, elId);
    } else {
      return NextResponse.json({ ok: false, error: 'unknown action' }, { status: 400 });
    }
    revalidatePath('/admin/canon');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
