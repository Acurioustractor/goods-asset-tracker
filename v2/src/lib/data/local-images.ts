// Server-only util: enumerate every local website image under public/images/**.
//
// The media library admin page merges these with the Empathy Ledger photo
// library so a human can browse ALL project imagery in one grid. This walks the
// filesystem at request time (the page is force-dynamic) rather than importing a
// manifest, so newly-dropped images appear without a rebuild.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { getLocalImageTags } from './local-image-tags';

export interface LocalImage {
  url: string;
  area: string;
  filename: string;
  source: 'website';
  /** Saved subject tags (namespace:value) for this image. Default []. */
  tags: string[];
  /**
   * Other /images/... paths that are byte-identical copies of this image. Only
   * present on a canonical image that has duplicates elsewhere on disk. The
   * alias files are skipped during the walk so each unique image appears once.
   */
  aliases?: string[];
}

const IMAGE_RE = /\.(jpe?g|png|webp)$/i;

type DedupMap = Record<string, string[]>; // canonical url -> alias urls

/**
 * Read the content-hash dedup map produced by scripts/image-dedup.mjs.
 * Missing or corrupt file -> {} (so behaviour is unchanged: every file lists).
 */
function readDedupMap(): DedupMap {
  const path = join(process.cwd(), 'data', 'image-dedup.json');
  if (!existsSync(path)) return {};
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as DedupMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Recursively walk public/images and return one LocalImage per image file.
 * `area` is the first path segment under images/ (e.g. 'product', 'community');
 * a file sitting directly in images/ gets area 'root'. Sorted by area then
 * filename. Returns [] on any fs error so the page never blanks.
 */
export function getLocalImages(): LocalImage[] {
  const root = join(process.cwd(), 'public', 'images');
  const out: LocalImage[] = [];
  // Saved subject tags, read once. Keyed by the /images/... url.
  const savedTags = getLocalImageTags();
  // Content-hash dedup map: canonical url -> alias urls. Read once.
  const dedup = readDedupMap();
  // Flat set of every alias url, so we can skip those files during the walk and
  // show each unique image once (under its canonical path).
  const aliasUrls = new Set<string>();
  for (const aliases of Object.values(dedup)) {
    for (const a of aliases) aliasUrls.add(a);
  }

  function walk(dir: string, relSegments: string[]) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const childRel = [...relSegments, entry.name];
      if (entry.isDirectory()) {
        walk(join(dir, entry.name), childRel);
      } else if (entry.isFile() && IMAGE_RE.test(entry.name)) {
        const relPath = childRel.join('/');
        const url = `/images/${relPath}`;
        // Skip files that are duplicate copies of a canonical image.
        if (aliasUrls.has(url)) continue;
        const area = relSegments.length > 0 ? relSegments[0] : 'root';
        const aliases = dedup[url];
        out.push({
          url,
          area,
          filename: entry.name,
          source: 'website',
          tags: savedTags[url] ?? [],
          ...(aliases && aliases.length > 0 ? { aliases } : {}),
        });
      }
    }
  }

  try {
    walk(root, []);
  } catch {
    return [];
  }

  out.sort((a, b) => {
    if (a.area !== b.area) return a.area.localeCompare(b.area);
    return a.filename.localeCompare(b.filename);
  });
  return out;
}

/** Sorted unique list of `area` values across the given local images. */
export function getLocalImageAreas(localImages: LocalImage[]): string[] {
  return Array.from(new Set(localImages.map((i) => i.area))).sort((a, b) =>
    a.localeCompare(b),
  );
}
