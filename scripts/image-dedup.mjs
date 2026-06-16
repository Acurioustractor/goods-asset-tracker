#!/usr/bin/env node
/**
 * Content-hash deduplication map for the media library.
 *
 * Recursively walks v2/public/images, computes the md5 of every image file
 * (.jpg/.jpeg/.png/.webp, case-insensitive), and groups files that share the
 * same bytes. For each group with >1 file it picks a CANONICAL /images/... url
 * (shortest, then alphabetically first); the rest are aliases.
 *
 * Output: v2/data/image-dedup.json
 *   { "<canonicalUrl>": ["<aliasUrl>", ...], ... }
 * Only canonical urls that actually HAVE aliases are written. 2-space indent +
 * trailing newline. The map is consumed by getLocalImages() so the same image
 * appears once in the admin media library, listing its other locations.
 *
 * DELETES NOTHING — this only informs the view layer; all files stay on disk.
 *
 * Usage (from the repo root):
 *   node scripts/image-dedup.mjs
 *
 * Idempotent: re-running on an unchanged tree produces identical output.
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve paths relative to THIS script's repo root (scripts/ -> repo root),
// so the script works regardless of the caller's cwd.
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = join(REPO_ROOT, 'v2', 'public', 'images');
const OUT_PATH = join(REPO_ROOT, 'v2', 'data', 'image-dedup.json');

const IMAGE_RE = /\.(jpe?g|png|webp)$/i;

/** Recursively collect { url, hash } for every image file under IMAGES_DIR. */
function collect() {
  const files = [];

  function walk(dir, relSegments) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const childRel = [...relSegments, entry.name];
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs, childRel);
      } else if (entry.isFile() && IMAGE_RE.test(entry.name)) {
        const url = `/images/${childRel.join('/')}`;
        const hash = createHash('md5').update(readFileSync(abs)).digest('hex');
        files.push({ url, hash });
      }
    }
  }

  walk(IMAGES_DIR, []);
  return files;
}

/**
 * Pick the canonical url from a group: shortest path first, then alphabetical.
 * (Stable + deterministic so output is idempotent.)
 */
function pickCanonical(urls) {
  return [...urls].sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;
    return a.localeCompare(b);
  })[0];
}

function main() {
  let files;
  try {
    files = collect();
  } catch (err) {
    console.error(`image-dedup: failed to read ${IMAGES_DIR}: ${err.message}`);
    process.exit(1);
  }

  // Group urls by content hash.
  const groups = new Map(); // hash -> url[]
  for (const { url, hash } of files) {
    const arr = groups.get(hash);
    if (arr) arr.push(url);
    else groups.set(hash, [url]);
  }

  // Build the dedup map: canonical -> sorted aliases (only groups with dups).
  const map = {};
  let duplicateGroups = 0;
  let hiddenCopies = 0;
  for (const urls of groups.values()) {
    if (urls.length < 2) continue;
    duplicateGroups += 1;
    const canonical = pickCanonical(urls);
    const aliases = urls.filter((u) => u !== canonical).sort((a, b) => a.localeCompare(b));
    map[canonical] = aliases;
    hiddenCopies += aliases.length;
  }

  // Sort keys for stable, diff-friendly output.
  const sorted = {};
  for (const key of Object.keys(map).sort((a, b) => a.localeCompare(b))) {
    sorted[key] = map[key];
  }

  writeFileSync(OUT_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');

  const total = files.length;
  const unique = groups.size;
  console.log('image-dedup summary');
  console.log(`  total image files : ${total}`);
  console.log(`  unique images     : ${unique}`);
  console.log(`  duplicate groups  : ${duplicateGroups}`);
  console.log(`  copies hidden     : ${hiddenCopies}`);
  console.log(`  wrote             : ${OUT_PATH}`);
}

main();
