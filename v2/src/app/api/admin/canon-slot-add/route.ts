// Add a new purpose slot from the Canon Studio. Appends to design/canon-slots.json
// (dedupe by key). Lets you grow the taxonomy as the raise needs new shots without
// hand-editing JSON. Local/dev writable FS only; commit to ship.

import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

function repoRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith(`${path.sep}v2`) ? path.resolve(cwd, '..') : cwd;
}
function slugify(s: string): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
}

interface Slot {
  key: string; label: string; group: string; type: string; dataClass: string;
  areas: string[]; use?: string; note?: string; seed?: string | null;
}
interface Body {
  key?: string; label?: string; group?: string; type?: string; dataClass?: string;
  areas?: string[]; note?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid JSON body' }, { status: 400 });
  }
  const label = (body.label || '').trim();
  if (!label) return NextResponse.json({ ok: false, error: 'label required' }, { status: 400 });
  const key = slugify(body.key || label);
  if (!key) return NextResponse.json({ ok: false, error: 'could not derive a key' }, { status: 400 });

  const slot: Slot = {
    key,
    label,
    group: (body.group || 'Custom').trim() || 'Custom',
    type: ['photo', 'illustration', 'chart', 'logo', 'video'].includes(body.type || '') ? (body.type as string) : 'photo',
    dataClass: ['green', 'amber', 'red'].includes(body.dataClass || '') ? (body.dataClass as string) : 'green',
    areas: Array.isArray(body.areas) ? body.areas.map((a) => String(a).trim()).filter(Boolean) : [],
    note: (body.note || '').trim() || undefined,
    seed: null,
  };

  try {
    const file = path.join(repoRoot(), 'design', 'canon-slots.json');
    const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as { slots?: Slot[]; groups?: string[] };
    raw.slots = raw.slots || [];
    if (raw.slots.some((s) => s.key === key)) {
      return NextResponse.json({ ok: false, error: `slot key "${key}" already exists` }, { status: 409 });
    }
    raw.slots.push(slot);
    if (Array.isArray(raw.groups) && !raw.groups.includes(slot.group)) raw.groups.push(slot.group);
    fs.writeFileSync(file, JSON.stringify(raw, null, 2) + '\n', 'utf8');
    revalidatePath('/admin/canon');
    return NextResponse.json({ ok: true, slot });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
