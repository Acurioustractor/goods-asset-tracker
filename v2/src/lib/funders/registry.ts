import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { FunderConfig, SectionKey } from './types';
import { centrecorpConfig } from './configs/centrecorp';
import { snowConfig } from './configs/snow';

/**
 * Built-in TypeScript funder configs. These ship in code because they carry
 * rich nested data (principles, risks, investment tiers) that's easier to
 * author + version-control in TS than in JSON.
 */
const TS_FUNDERS: Record<string, FunderConfig> = {
  centrecorp: centrecorpConfig,
  snow: snowConfig,
};

/**
 * JSON-on-disk shape for user-added funders. Mirrors FunderConfig but
 * `reportTitle` is an interpolation template string instead of a function,
 * and a couple of defaults are auto-applied. This lets the /admin/funders/new
 * form add new sponsors without a code change + redeploy.
 */
interface JsonFunderConfig extends Omit<FunderConfig, 'reportTitle' | 'preparedBy'> {
  reportTitle?: string;   // e.g. "Goods on Country × {displayName} — {label} report"
  preparedBy?: string;
}

function jsonFunderToConfig(j: JsonFunderConfig): FunderConfig {
  const tpl = j.reportTitle || `Goods on Country × ${j.displayName} — {label} report`;
  return {
    ...j,
    preparedBy: j.preparedBy ?? 'Nicholas Marchesi · Benjamin Knight',
    reportTitle: (period) =>
      tpl
        .replace(/\{displayName\}/g, j.displayName)
        .replace(/\{label\}/g, period.label)
        .replace(/\{slug\}/g, j.slug),
  };
}

/**
 * Canonical path for user-added funders. Each one is a JSON object inside
 * an array. The /admin/funders/new server action appends here, and the
 * registry reads on each request.
 */
export function jsonFundersPath(): string {
  return join(process.cwd(), '..', 'wiki', 'config', 'funders.json');
}

async function loadJsonFunders(): Promise<Record<string, FunderConfig>> {
  try {
    const raw = await readFile(jsonFundersPath(), 'utf-8');
    const arr = JSON.parse(raw) as JsonFunderConfig[];
    const out: Record<string, FunderConfig> = {};
    for (const j of arr) {
      // TS funders take precedence — they're the canonical Centrecorp/Snow.
      if (TS_FUNDERS[j.slug]) continue;
      out[j.slug] = jsonFunderToConfig(j);
    }
    return out;
  } catch {
    // No file yet, or unreadable — JSON funders are optional.
    return {};
  }
}

export async function loadAllFunders(): Promise<Record<string, FunderConfig>> {
  const json = await loadJsonFunders();
  return { ...TS_FUNDERS, ...json };
}

export async function getFunder(slug: string): Promise<FunderConfig | null> {
  const all = await loadAllFunders();
  return all[slug] || null;
}

export async function listFunders(): Promise<FunderConfig[]> {
  const all = await loadAllFunders();
  return Object.values(all);
}

/**
 * Section-set auto-pick based on commitment size. Small commitments default
 * to the short visual deck (Centrecorp shape); large commitments to the
 * long-form Snow shape. Form can override after creation.
 */
export function defaultSectionsFor(totalAud: number): SectionKey[] {
  if (totalAud >= 100000) {
    // Long-form Snow-style
    return [
      'cover',
      'financials-at-a-glance',
      'headline-achievements',
      'investment-priorities',
      'alignment-principles',
      'safeguarding-risks',
      'commitment-progress',
      'upcoming-commitments',
      'voices',
      'photo-grid',
      'country-acknowledgement',
    ];
  }
  // Short visual deck — Centrecorp shape
  return [
    'cover',
    'headline',
    'map',
    'hero-photo',
    'photo-grid',
    'voices',
    'why-it-works',
    'how-we-track',
    'impact-numbers',
    'commitment-progress',
    'whats-next',
    'country-acknowledgement',
  ];
}

// Back-compat exports for any callers still expecting sync access. These
// return only the TS-built-ins. New callers should prefer the async APIs.
export const FUNDERS: Record<string, FunderConfig> = TS_FUNDERS;
