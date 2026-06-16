// Remove an image from the canon (design/image-canon.json) by its canonical
// path. This drops the entry from the curated index (and prunes the subject from
// areaCoverage if nothing else uses it). It does NOT delete the file on disk —
// the canon is a reference index, so removing here just un-lists it. Local/dev
// writable FS only (Vercel prod is read-only; commit the edit from local to ship).

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';

interface RawImg {
  subject?: string;
  canonicalPath: string;
  [k: string]: unknown;
}
interface RawCanon {
  images?: RawImg[];
  areaCoverage?: Record<string, string[]>;
  [k: string]: unknown;
}

function repoRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith(`${path.sep}v2`) ? path.resolve(cwd, '..') : cwd;
}

export async function POST(req: Request) {
  let body: { canonicalPath?: string };
  try {
    body = (await req.json()) as { canonicalPath?: string };
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }
  const cp = body.canonicalPath;
  if (!cp) {
    return NextResponse.json({ ok: false, error: 'canonicalPath required' }, { status: 400 });
  }
  try {
    const file = path.join(repoRoot(), 'design', 'image-canon.json');
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as RawCanon;
    const images = Array.isArray(raw.images) ? raw.images : [];
    const removed = images.find((im) => im.canonicalPath === cp);
    if (!removed) {
      return NextResponse.json({ ok: false, error: 'not found in canon' }, { status: 404 });
    }
    raw.images = images.filter((im) => im.canonicalPath !== cp);

    // Prune the subject from areaCoverage if no remaining image shares it.
    if (raw.areaCoverage && removed.subject) {
      const stillUsed = raw.images.some((im) => im.subject === removed.subject);
      if (!stillUsed) {
        for (const k of Object.keys(raw.areaCoverage)) {
          if (Array.isArray(raw.areaCoverage[k])) {
            raw.areaCoverage[k] = raw.areaCoverage[k].filter((s) => s !== removed.subject);
          }
        }
      }
    }

    fs.writeFileSync(file, JSON.stringify(raw, null, 2) + '\n', 'utf8');
    revalidatePath('/admin/canon');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
