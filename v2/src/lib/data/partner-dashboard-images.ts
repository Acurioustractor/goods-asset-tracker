// EL-backed image overrides for the partner dashboards.
//
// The dashboard config (partner-dashboards.ts) supplies a FALLBACK image for
// every slot. An admin picker (/admin/dashboard-images) lets a human assign an
// Empathy Ledger photo to any slot; the assignment is written here, to
// v2/data/partner-dashboard-images.json. The dashboard page resolves each slot
// to its override (if any) or the config fallback.
//
// This mirrors the field-note-overrides pattern: the JSON is committed to git,
// so picks preview live in dev and go to prod on the next deploy. EL photo URLs
// are allowed by next.config (yvnuayzslukamizrlhwb.supabase.co), so overrides
// can point straight at the EL CDN at full resolution.
//
// Shape:
//   {
//     "snow": {
//       "partnership.0": { "url": "https://yvnu.../alice-build/x.jpg", "alt": "...", "elId": "uuid", "consent": "el:public" },
//       "moment.3":      { "url": "...", "alt": "...", "elId": "uuid", "consent": "el:gated-ok" }
//     }
//   }

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { PartnerDashboard } from './partner-dashboards';

const OVERRIDES_PATH = join(process.cwd(), 'data', 'partner-dashboard-images.json');

export interface DashboardImageAssignment {
  /** Image URL: an EL CDN URL or a local /images/... path. */
  url: string;
  /** Alt text. Falls back to the slot's config alt when omitted. */
  alt?: string;
  /** Empathy Ledger story id, kept for provenance + future re-sync. */
  elId?: string;
  /** Consent note, e.g. 'el:public' or 'el:gated-ok' (consented + elder-reviewed, used on the gated page). */
  consent?: string;
}

type Store = Record<string, Record<string, DashboardImageAssignment>>; // slug -> slotKey -> assignment

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

/** All slot overrides for one partner. Read once per request, pass to resolveDashImg. */
export function getDashboardImageOverrides(slug: string): Record<string, DashboardImageAssignment> {
  return readStore()[slug] || {};
}

/** Assign (or clear, with null) one slot. Used by the admin picker API route. */
export function setDashboardImage(slug: string, slotKey: string, value: DashboardImageAssignment | null): void {
  const store = readStore();
  if (!store[slug]) store[slug] = {};
  if (value === null || !value.url) {
    delete store[slug][slotKey];
    if (Object.keys(store[slug]).length === 0) delete store[slug];
  } else {
    store[slug][slotKey] = value;
  }
  writeStore(store);
}

/** Resolve one slot: the override wins, else the config fallback. Never throws. */
export function resolveDashImg(
  overrides: Record<string, DashboardImageAssignment>,
  slotKey: string,
  fallback: { src: string; alt: string },
): { src: string; alt: string } {
  const o = overrides[slotKey];
  if (o && o.url) return { src: o.url, alt: o.alt && o.alt.trim() ? o.alt : fallback.alt };
  return fallback;
}

export interface DashboardImageSlot {
  key: string;
  /** Human label for the admin list, e.g. "Moment 3 — Sally and Georgina on Country". */
  label: string;
  /** Section grouping for the admin UI. */
  group: string;
  fallbackSrc: string;
  fallbackAlt: string;
}

/**
 * Enumerate every config-driven image slot on a partner dashboard, with its
 * stable key + fallback. The admin picker lists these so a human can reassign
 * any of them from the EL library. Kept in sync with the page by deriving from
 * the same config arrays the page renders.
 */
export function getDashboardImageSlots(partner: PartnerDashboard): DashboardImageSlot[] {
  const slots: DashboardImageSlot[] = [];
  const push = (key: string, label: string, group: string, src?: string, alt?: string) => {
    if (!src) return;
    slots.push({ key, label, group, fallbackSrc: src, fallbackAlt: alt ?? '' });
  };

  if (partner.heroImage) push('hero', 'Hero photo', 'Hero', partner.heroImage.src, partner.heroImage.alt);

  (partner.funderImpact?.moments ?? []).forEach((m, i) =>
    push(`moment.${i}`, `Moment ${i + 1} — ${m.title}`, 'Your part in this', m.image?.src, m.image?.alt),
  );
  (partner.facilityGallery ?? []).forEach((g, i) =>
    push(`facility.${i}`, `Facility photo ${i + 1}`, 'Community-owned assets', g.src, g.alt),
  );
  (partner.communityPartnership?.photos ?? []).forEach((g, i) =>
    push(`partnership.${i}`, `Partnership photo ${i + 1}`, 'Oonchiumpa partnership', g.src, g.alt),
  );
  (partner.featuredVoices ?? []).forEach((v, i) =>
    push(`voice.${i}`, `Voice ${i + 1} — ${v.name}`, 'Community voice', v.image?.src, v.image?.alt),
  );
  (partner.gallery ?? []).forEach((g, i) =>
    push(`gallery.${i}`, `Field gallery ${i + 1}`, 'In service now', g.src, g.alt),
  );

  return slots;
}
