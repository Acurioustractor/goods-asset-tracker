/**
 * QBE DIAGNOSTIC AREAS — the readiness spine of the Goods Alignment Engine.
 *
 * Layer 1 (QBE domain), companion to canon.ts (the number spine) and
 * artifact-register.json (which artifacts exist + which areas they cover).
 * The 12 Catalysing Impact diagnostic areas with their SIH/QBE maturity scores
 * (now -> target), priority, the keystone gap, and the catalytic-raise blockers.
 *
 * The data lives in qbe-areas.json (read headless by scripts/check-qbe-readiness.mjs,
 * Loop D) so the loop stays deterministic and CI-safe. This module is the typed,
 * app-facing view. The Notion QBE Diagnostic Artifact DB
 * (cb3794d427914d72bf1036106d8116f5) is the human mirror — edit here, not Notion.
 *
 * Scores: SIH/QBE Impact Investment Readiness Diagnostic V4 (1 May 2026 workshop),
 * mapped in wiki/outputs/2026-06-02-qbe-catalytic-pitch/02-qbe-diagnostic-alignment.md.
 */
import data from './qbe-areas.json';

/** P0 = gates the catalytic raise (build first). P1 = strengthen, not blocking. */
export type QbePriority = 'P0' | 'P1';
/** SIH readiness band for the area. */
export type QbeBand = 'strength' | 'priority-gap' | 'partial';

export interface QbeArea {
  /** Two-digit area id ('01'..'12'); matches the qbeAreas ids in artifact-register.json. */
  id: string;
  name: string;
  /** V4 maturity now (0-10). null for the two Notion-added areas (11, 12) with no V4 score. */
  scoreNow: number | null;
  /** V4 maturity target (0-10). null for areas 11, 12. */
  scoreTarget: number | null;
  priority: QbePriority;
  band: QbeBand;
  /** True if SIH flagged this as one of the diagnostic's priority gaps (the * in V4 Figure 1). */
  sihPriorityGap: boolean;
  /** Area 09 only — the single keystone that gates the entire catalytic raise. */
  keystone?: boolean;
  /** One-line gap that blocks the raise (from the alignment report section 3). */
  gap: string;
}

export interface CatalyticBlocker {
  /** 1 = highest leverage. */
  rank: number;
  /** Area ids this blocker maps onto. */
  areaIds: string[];
  summary: string;
}

export const QBE_AREAS: QbeArea[] = data.areas as QbeArea[];
export const CATALYTIC_BLOCKERS: CatalyticBlocker[] = data.catalyticBlockers as CatalyticBlocker[];
/** ISO date the area scores were last confirmed against the diagnostic. */
export const QBE_AS_OF: string = data.asOf;

const BY_ID = new Map(QBE_AREAS.map((a) => [a.id, a]));

/** Look up a QBE area by id. Throws if missing, so a typo fails loudly. */
export function qbeArea(id: string): QbeArea {
  const a = BY_ID.get(id);
  if (!a) throw new Error(`Unknown QBE area id: ${id}`);
  return a;
}

/** The maturity gap (target - now) for an area, or null if the area has no V4 score. */
export function qbeScoreGap(id: string): number | null {
  const a = qbeArea(id);
  if (a.scoreNow == null || a.scoreTarget == null) return null;
  return a.scoreTarget - a.scoreNow;
}

/** All P0 (raise-gating) areas. */
export function qbeP0Areas(): QbeArea[] {
  return QBE_AREAS.filter((a) => a.priority === 'P0');
}
