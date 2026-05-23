// Media-swap overrides for trip stories. Click-to-swap in the admin
// preview writes to v2/data/field-note-overrides.json. The file is
// committed to git, so once the user is happy with their swaps they
// push and the swaps go live in prod.
//
// Shape:
//   {
//     "utopia-may-2026": {
//       "0.media.image": "https://yvnu.../trip-may-2026/alice-build/foo.jpg",
//       "0.media.videoDesktop": "https://yvnu.../trip-may-2026/atmosphere/bar.mp4",
//       "12.media.image": "https://...",
//       "20.items.0.poster": "https://...",
//       "20.items.0.src": "https://..."
//     }
//   }
//
// Keys are dot paths: <blockIndex>.<dot-path-into-block>. The applier walks
// the path and overwrites the leaf string. Missing intermediate objects
// are silently skipped (defensive — never throw at render time).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { TripStory } from '@/lib/data/trip-stories';

const OVERRIDES_PATH = join(process.cwd(), 'data', 'field-note-overrides.json');

type OverrideMap = Record<string, Record<string, string>>;

function readOverridesFile(): OverrideMap {
  if (!existsSync(OVERRIDES_PATH)) return {};
  try {
    const raw = readFileSync(OVERRIDES_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as OverrideMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeOverridesFile(map: OverrideMap): void {
  writeFileSync(OVERRIDES_PATH, JSON.stringify(map, null, 2) + '\n', 'utf-8');
}

export function getStoryOverrides(slug: string): Record<string, string> {
  const map = readOverridesFile();
  return map[slug] || {};
}

export function setStoryOverride(slug: string, key: string, value: string | null): void {
  const map = readOverridesFile();
  if (!map[slug]) map[slug] = {};
  if (value === null || value === '') {
    delete map[slug][key];
  } else {
    map[slug][key] = value;
  }
  writeOverridesFile(map);
}

// Walks a dot path like "0.media.image" into the block tree and overwrites
// the leaf string. Returns a NEW story (immutable). Silent no-op if the
// path doesn't resolve — never throws at render time.
export function applyOverrides(story: TripStory, overrides: Record<string, string>): TripStory {
  if (!overrides || Object.keys(overrides).length === 0) return story;
  // Deep-clone the blocks so we don't mutate the imported source data.
  const blocks = JSON.parse(JSON.stringify(story.blocks));
  for (const [key, value] of Object.entries(overrides)) {
    const parts = key.split('.');
    if (parts.length < 2) continue;
    const idx = parseInt(parts[0], 10);
    if (Number.isNaN(idx) || !blocks[idx]) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let target: any = blocks[idx];
    for (let i = 1; i < parts.length - 1; i++) {
      const p = parts[i];
      // Support numeric indices in the path (items.0.poster)
      const numeric = /^\d+$/.test(p) ? parseInt(p, 10) : null;
      const next = numeric !== null ? target[numeric] : target[p];
      if (next === undefined || next === null) {
        target = null;
        break;
      }
      target = next;
    }
    if (!target) continue;
    const leaf = parts[parts.length - 1];
    target[leaf] = value;
  }
  return { ...story, blocks };
}
