// Upload a photo from the desktop into the LOCAL Goods canon. Saves the file to
// v2/public/images/uploads/<slug>-<hash>.<ext> and appends an entry to
// design/image-canon.json (tagged with subject, caption, type, QBE areas, and a
// consent dataClass). This is the safe, local path — it does NOT write to
// Empathy Ledger (that is a separate, consent-gated step). Local/dev writable FS
// only; commit the new file + canon edit from local to ship to prod.

import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

function repoRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith(`${path.sep}v2`) ? path.resolve(cwd, '..') : cwd;
}

function slugify(s: string): string {
  return (
    (s || 'upload')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'upload'
  );
}

interface RawImg {
  subject?: string;
  canonicalPath?: string;
  [k: string]: unknown;
}
interface RawCanon {
  images?: RawImg[];
  areaCoverage?: Record<string, string[]>;
  [k: string]: unknown;
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'expected a multipart form' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'file required' }, { status: 400 });
  }
  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: `unsupported image type ${file.type || 'unknown'}` },
      { status: 400 },
    );
  }
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: 'file too large (max 15MB)' }, { status: 400 });
  }

  const subject = String(form.get('subject') || '').trim();
  if (!subject) {
    return NextResponse.json({ ok: false, error: 'subject required' }, { status: 400 });
  }
  const caption = String(form.get('caption') || '').trim();
  const typeIn = String(form.get('type') || 'photo');
  const type = ['photo', 'illustration', 'chart', 'logo'].includes(typeIn) ? typeIn : 'photo';
  const dcIn = String(form.get('dataClass') || 'green');
  const dataClass = ['green', 'amber', 'red'].includes(dcIn) ? dcIn : 'green';
  const consentCleared = String(form.get('consentCleared')) === 'true';
  const areas = String(form.get('areas') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
    const filename = `${slugify(subject)}-${hash}.${ext}`;
    const root = repoRoot();
    const dir = path.join(root, 'v2', 'public', 'images', 'uploads');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buf);

    const canonicalPath = `v2/public/images/uploads/${filename}`;
    const entry: RawImg = { subject, type, dataClass, caption, qbeAreas: areas, canonicalPath };
    if (dataClass === 'red') entry.consentCleared = consentCleared;

    const canonFile = path.join(root, 'design', 'image-canon.json');
    const raw = JSON.parse(fs.readFileSync(canonFile, 'utf8')) as RawCanon;
    if (!Array.isArray(raw.images)) raw.images = [];
    raw.images = raw.images.filter((im) => im.canonicalPath !== canonicalPath);
    raw.images.push(entry);
    if (raw.areaCoverage) {
      for (const a of areas) {
        if (Array.isArray(raw.areaCoverage[a]) && !raw.areaCoverage[a].includes(subject)) {
          raw.areaCoverage[a].push(subject);
        }
      }
    }
    fs.writeFileSync(canonFile, JSON.stringify(raw, null, 2) + '\n', 'utf8');
    revalidatePath('/admin/canon');

    return NextResponse.json({
      ok: true,
      image: {
        subject,
        type,
        dataClass,
        caption,
        qbeAreas: areas,
        canonicalPath,
        consentCleared: dataClass === 'red' ? consentCleared : false,
        src: `/api/admin/canon-image?path=${encodeURIComponent(canonicalPath)}`,
        webUrl: `/images/uploads/${filename}`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
