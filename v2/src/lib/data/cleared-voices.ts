// Canonical consent allowlist for community storyteller VOICES on EXTERNAL surfaces
// (the open web: /stories, /community, /gallery, plus funder material).
//
// Source of truth: the `cleared-voices` canon fact in `./canon.ts` (the 32 voices Ben
// cleared for external use in the 2026-06-17 consent pass) and the Goods Storyteller
// Library "Cleared for external" view. The broader `display-storyteller-pool` is a
// coverage queue, NOT a clearance list, so it is deliberately NOT used here.
//
// Posture: DEFAULT-DENY. A voice renders externally only if its name matches this
// list. Empathy Ledger exposes no per-storyteller consent flag to the syndication
// client, so the canon name-list is the gate. Matching is name-normalised and
// tolerant (case, whitespace, parentheticals, punctuation, "&"/"and"), but if a
// cleared person's EL name differs from every spelling here they are hidden. That is
// the safe direction for consent; add the spelling here to surface them.
//
// Keep in sync with `cleared-voices` in canon.ts. Practitioner voices (Dr Boe
// Remenyi, Chloe, Wayne Glenn) must still be LABELLED as practitioners in the UI,
// not as community recipients; this list only governs whether they may appear.

const CLEARED_VOICES_EXTERNAL: string[] = [
  'Ivy Johnson', 'Ivy',
  'Dianne Stokes',
  'Ray Nelson',
  'Mykel',
  'Kristy Bloomfield',
  'Norman Frank', // EL may append "(Jupurrurla)"; parentheticals are stripped on match
  'Linda Turner',
  'Alfred Johnson',
  'Brian Russell',
  'Karen Liddle',
  'Katrina Bloomfield',
  'Annie Morrison',
  'Heather Mundo',
  'Fred Campbell',
  'Gloria Turner',
  'Carmelita & Colette', 'Carmelita and Colette',
  'Daniel Patrick Noble',
  'Shayne Bloomfield',
  'Jason',
  'Gary',
  'Dorrie Jones',
  'Cliff Plummer',
  'Mark',
  'Melissa Jackson',
  'Patricia Frank',
  'Risilda Hogan',
  'Tracy McCartney',
  'Jimmy Frank',
  'Xavier',
  'Dr Boe Remenyi', 'Boe Remenyi',
  'Chloe',
  'Wayne Glenn',
];

function normaliseVoiceName(name: string): string {
  return (name ?? '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ') // drop parentheticals e.g. "(Jupurrurla)"
    .replace(/[.,]/g, ' ')       // drop punctuation e.g. "Dr."
    .replace(/\s+/g, ' ')        // collapse whitespace (handles "Alfred  Johnson")
    .trim();
}

const ALLOWED = new Set(CLEARED_VOICES_EXTERNAL.map(normaliseVoiceName));

/**
 * True if this storyteller name is cleared for EXTERNAL display (open web).
 * Default-deny: unknown or empty names return false.
 */
export function isClearedForExternal(name: string | null | undefined): boolean {
  if (!name) return false;
  return ALLOWED.has(normaliseVoiceName(name));
}
