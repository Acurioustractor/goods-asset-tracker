// Serves images for the System visuals board that live outside v2/public —
// generated-images/ (gitignored, local-only draft pool) and design/deck-photos/
// (the Pencil investor-deck art). Prefix-allowlisted to just those two roots,
// with the same path-traversal guard as /api/admin/canon-image. Local/dev tool:
// generated-images/ is gitignored (see CLAUDE.md "no large media in git"), so on
// Vercel those requests 404 and the board shows a broken tile with a note.
import fs from 'node:fs';
import path from 'node:path';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const ALLOWED_PREFIXES = ['generated-images/', 'design/deck-photos/'];

function repoRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith(`${path.sep}v2`) ? path.resolve(cwd, '..') : cwd;
}

export async function GET(req: NextRequest) {
  const rel = req.nextUrl.searchParams.get('path') || '';
  if (!ALLOWED_PREFIXES.some((prefix) => rel.startsWith(prefix))) {
    return new Response('Not allowed', { status: 403 });
  }

  const root = repoRoot();
  const abs = path.resolve(root, rel);
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    return new Response('Invalid path', { status: 400 });
  }

  try {
    const buf = fs.readFileSync(abs);
    const mime = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
    return new Response(new Uint8Array(buf), {
      headers: { 'Content-Type': mime, 'Cache-Control': 'private, max-age=300' },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
