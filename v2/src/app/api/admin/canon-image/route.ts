// Serves a single canon image by its canonical repo path. The image canon
// (design/image-canon.json) references two roots — v2/public/** (served
// statically) and design/deck-assets/** (NOT served by Next) — so the Canon
// board needs a way to render the deck-assets ones. This route reads from the
// repo on disk, allowlisted strictly to paths that appear in image-canon.json,
// with a path-traversal guard. Local/dev tool: on Vercel the design/ tree may
// be absent, in which case deck-assets images 404 (cards show a broken tile);
// public images still resolve. No copies are ever made (canon is no-copy).
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

function repoRoot(): string {
  const cwd = process.cwd();
  return cwd.endsWith(`${path.sep}v2`) ? path.resolve(cwd, '..') : cwd;
}

function allowedPaths(root: string): Set<string> {
  try {
    const raw = JSON.parse(
      fs.readFileSync(path.join(root, 'design', 'image-canon.json'), 'utf8'),
    ) as { images?: { canonicalPath?: string }[]; gaps?: { draft?: string }[] };
    const set = new Set<string>();
    for (const im of raw.images ?? []) if (im.canonicalPath) set.add(im.canonicalPath);
    for (const g of raw.gaps ?? []) if (g.draft) set.add(g.draft);
    return set;
  } catch {
    return new Set();
  }
}

export async function GET(req: NextRequest) {
  const rel = req.nextUrl.searchParams.get('path') || '';
  const root = repoRoot();

  // Allowlist: the requested path must be a canonical image (or gap draft).
  if (!allowedPaths(root).has(rel)) {
    return new Response('Not in canon', { status: 403 });
  }

  // Try the exact canonical path, then the deck-assets mirror by basename
  // (covers a public path that is missing but mirrored for the deck).
  const base = path.basename(rel);
  const candidates = [rel, path.join('design', 'deck-assets', base)];
  for (const c of candidates) {
    const abs = path.resolve(root, c);
    if (abs !== root && !abs.startsWith(root + path.sep)) continue; // traversal guard
    try {
      const buf = fs.readFileSync(abs);
      const mime = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
      return new Response(new Uint8Array(buf), {
        headers: { 'Content-Type': mime, 'Cache-Control': 'private, max-age=300' },
      });
    } catch {
      // try next candidate
    }
  }
  return new Response('Not found', { status: 404 });
}
