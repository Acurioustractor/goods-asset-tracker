// Set or clear the LOCAL canon pick for a purpose slot from the Canon Studio.
// Upserts an entry in design/image-canon.json tagged with the slot (overwrites the
// prior pick for that slot), then regenerates design/canon-resolved.json so artifacts
// pull the winner. EL picks go through /api/admin/canon-el-pick instead.
//
// Dev/local writable FS only (Vercel prod is read-only); picks ship once committed.

import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { writeCanonResolved } from '@/lib/data/canon-el-picks';

export const runtime = 'nodejs';

function repoRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith(`${path.sep}v2`) ? path.resolve(cwd, '..') : cwd;
}

interface Body {
  slot?: string;
  action?: 'set' | 'clear';
  canonicalPath?: string;
  type?: string;
  dataClass?: string;
  subject?: string;
  caption?: string;
  areas?: string[];
}

interface CanonImg {
  subject: string; type: string; dataClass: string; caption?: string;
  qbeAreas?: string[]; canonicalPath: string; consentCleared?: boolean; slot?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }
  const { slot, action } = body;
  if (!slot || !action) {
    return NextResponse.json({ ok: false, error: 'slot and action required' }, { status: 400 });
  }
  try {
    const file = path.join(repoRoot(), 'design', 'image-canon.json');
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as { images?: CanonImg[]; asOf?: string };
    const images = (raw.images ?? []).filter((im) => im.slot !== slot);

    if (action === 'set') {
      if (!body.canonicalPath) {
        return NextResponse.json({ ok: false, error: 'canonicalPath required to set' }, { status: 400 });
      }
      // also drop any other entry already pointing at this exact path with no slot, to avoid dupes
      const entry: CanonImg = {
        subject: body.subject || slot,
        slot,
        type: ['photo', 'illustration', 'chart', 'logo'].includes(body.type || '') ? (body.type as string) : 'photo',
        dataClass: ['green', 'amber', 'red'].includes(body.dataClass || '') ? (body.dataClass as string) : 'green',
        caption: body.caption || '',
        qbeAreas: body.areas || [],
        canonicalPath: body.canonicalPath,
      };
      if (entry.dataClass === 'red') entry.consentCleared = true;
      images.push(entry);
    } // 'clear' just keeps the filtered list

    raw.images = images;
    raw.asOf = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(file, JSON.stringify(raw, null, 2) + '\n', 'utf8');
    writeCanonResolved();
    revalidatePath('/admin/canon');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
