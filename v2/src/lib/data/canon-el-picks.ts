// Empathy Ledger photo picks for the Canon board, keyed by QBE diagnostic area.
//
// The image canon (design/image-canon.json) is the curated set of LOCAL images.
// This file lets a human pull straight from the full Empathy Ledger library on
// /admin/canon and pin EL photos to an area, without copying files. Picks write
// to v2/data/canon-el-picks.json (same committed-JSON pattern as the partner
// dashboard image picker, so they survive a reload and ship on the next deploy).
//
// EL photo URLs are allowed by next.config (the EL CDN host), so a pick can
// point straight at the EL CDN at full resolution. Consent is recorded per pick
// from the EL flags; the human still holds the final community-consent call.
//
// Shape:
//   {
//     "02": [ { "elId": "uuid", "url": "https://…/x.jpg", "title": "…",
//               "consent": "el:public", "tags": ["community:utopia"] } ]
//   }

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PICKS_PATH = join(process.cwd(), 'data', 'canon-el-picks.json');

export interface CanonElPick {
  /** Empathy Ledger story id (provenance + dedupe key). */
  elId: string;
  /** Full-resolution EL CDN URL. */
  url: string;
  title: string;
  /** 'el:public' | 'el:gated-ok' | 'el:consent-elder-pending' | 'el:not-flagged'. */
  consent: string;
  tags?: string[];
}

type Store = Record<string, CanonElPick[]>; // areaId -> picks

function readStore(): Store {
  if (!existsSync(PICKS_PATH)) return {};
  try {
    const parsed = JSON.parse(readFileSync(PICKS_PATH, 'utf-8')) as Store;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  writeFileSync(PICKS_PATH, JSON.stringify(store, null, 2) + '\n', 'utf-8');
}

/** Every area's EL picks. Read once per request, pass to the board. */
export function getCanonElPicks(): Store {
  return readStore();
}

/** Pin an EL photo to an area (no-op if that elId is already pinned there). */
export function addCanonElPick(areaId: string, pick: CanonElPick): void {
  const store = readStore();
  if (!store[areaId]) store[areaId] = [];
  if (!store[areaId].some((p) => p.elId === pick.elId)) store[areaId].push(pick);
  writeStore(store);
}

/** Remove an EL photo from an area. */
export function removeCanonElPick(areaId: string, elId: string): void {
  const store = readStore();
  if (!store[areaId]) return;
  store[areaId] = store[areaId].filter((p) => p.elId !== elId);
  if (store[areaId].length === 0) delete store[areaId];
  writeStore(store);
}
