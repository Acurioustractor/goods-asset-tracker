// Subject tags for LOCAL website images (public/images/**).
//
// The media library admin page lets a human open a local image's preview and
// assign/remove `namespace:value` subject tags (e.g. product:stretch-bed,
// community:utopia, people:mykel). Assignments are written here, to
// v2/data/local-image-tags.json, keyed by the image's /images/... url.
//
// This mirrors the partner-dashboard-images + field-note-overrides pattern: the
// JSON is committed to git, so tags preview live in dev and go to prod on the
// next deploy. LOCAL-only — Empathy Ledger items keep their own read-only tags
// and never touch this store.
//
// Shape:
//   {
//     "/images/build/build-009.jpg": ["product:stretch-bed", "production:press"],
//     "/images/utopia/x.jpg":        ["community:utopia", "moment:delivery"]
//   }

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OVERRIDES_PATH = join(process.cwd(), 'data', 'local-image-tags.json');

type Store = Record<string, string[]>; // image url -> tag strings

function readStore(): Store {
  if (!existsSync(OVERRIDES_PATH)) return {};
  try {
    const parsed = JSON.parse(readFileSync(OVERRIDES_PATH, 'utf-8')) as Store;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  writeFileSync(OVERRIDES_PATH, JSON.stringify(store, null, 2) + '\n', 'utf-8');
}

/** Clean a raw tag list: trim, drop empties, dedupe (order-preserving). */
function cleanTags(tags: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of tags) {
    if (typeof raw !== 'string') continue;
    const t = raw.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

/** The whole tag store. Read once per request; missing/corrupt file -> {}. */
export function getLocalImageTags(): Store {
  return readStore();
}

/**
 * Set the tag array for one image url. An empty (or all-blank) array deletes the
 * key entirely. Persists with 2-space indent + trailing newline. Never throws.
 */
export function setLocalImageTags(url: string, tags: string[]): void {
  const store = readStore();
  const clean = cleanTags(tags);
  if (clean.length === 0) {
    delete store[url];
  } else {
    store[url] = clean;
  }
  writeStore(store);
}
