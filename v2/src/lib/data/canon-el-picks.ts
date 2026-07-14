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
// design/ is a sibling of v2/ (process.cwd() is v2 in the running app).
const DESIGN = join(process.cwd(), '..', 'design');

export interface CanonElPick {
  /** Empathy Ledger story id (provenance + dedupe key). */
  elId: string;
  /** Full-resolution EL CDN URL. */
  url: string;
  title: string;
  /** 'el:public' | 'el:gated-ok' | 'el:consent-elder-pending' | 'el:not-flagged'. */
  consent: string;
  tags?: string[];
  /** image | video | portrait — so the board can badge non-photo picks. */
  kind?: 'image' | 'video' | 'portrait';
  /** Thumbnail/poster URL (videos differ from the playable url). */
  thumb?: string;
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
  writeCanonResolved();
}

/** Remove an EL photo from an area. */
export function removeCanonElPick(areaId: string, elId: string): void {
  const store = readStore();
  if (!store[areaId]) return;
  store[areaId] = store[areaId].filter((p) => p.elId !== elId);
  if (store[areaId].length === 0) delete store[areaId];
  writeStore(store);
  writeCanonResolved();
}

interface SlotDef { key: string; label: string; group: string; type: string; dataClass: string; areas?: string[]; seed?: string | null; }
interface CanonImg { slot?: string; canonicalPath: string; source?: string; elId?: string; consentCleared?: boolean; }

/**
 * Collapse every source into one flat slot -> winner map (design/canon-resolved.json)
 * so artifacts pull the chosen asset with no second decision. Precedence:
 * local canon (slot-tagged) > EL pick under the slot key > seed > empty.
 * Called after every pick change so the loop closes automatically; also runnable
 * standalone via scripts/canon-resolve.mjs. Best-effort: never throws into the route.
 */
export function writeCanonResolved(): void {
  try {
    const slotsDoc = JSON.parse(readFileSync(join(DESIGN, 'canon-slots.json'), 'utf-8')) as { slots?: SlotDef[] };
    const canon = JSON.parse(readFileSync(join(DESIGN, 'image-canon.json'), 'utf-8')) as { images?: CanonImg[] };
    const picks = readStore();
    const localBySlot: Record<string, CanonImg> = {};
    for (const im of canon.images || []) if (im.slot) localBySlot[im.slot] = im;

    const resolved: Record<string, unknown> = {};
    let filled = 0;
    for (const s of slotsDoc.slots || []) {
      const base = { label: s.label, group: s.group, type: s.type, dataClass: s.dataClass, areas: s.areas || [] };
      const local = localBySlot[s.key];
      const sp = picks[s.key] || [];
      if (local) {
        resolved[s.key] = { ...base, source: local.source === 'empathy-ledger' ? 'el-canon' : 'local', path: local.canonicalPath, elId: local.elId, consent: local.consentCleared ? 'cleared' : s.dataClass === 'red' ? 'gated' : 'public', status: 'canon' };
        filled++;
      } else if (sp.length) {
        const p = sp[sp.length - 1];
        resolved[s.key] = { ...base, source: 'el-pick', url: p.url, elId: p.elId, kind: p.kind || 'image', consent: p.consent || 'el:not-flagged', alternates: sp.length - 1, status: 'el-pick' };
        filled++;
      } else if (s.seed) {
        resolved[s.key] = { ...base, source: 'seed', path: s.seed, consent: s.dataClass === 'red' ? 'gated' : 'public', status: 'seed' };
      } else {
        resolved[s.key] = { ...base, source: 'none', status: 'empty' };
      }
    }
    writeFileSync(
      join(DESIGN, 'canon-resolved.json'),
      JSON.stringify({ asOf: new Date().toISOString().slice(0, 10), filled, total: (slotsDoc.slots || []).length, resolved }, null, 2) + '\n',
    );
  } catch {
    // best-effort; the standalone script can always regenerate it
  }
}
