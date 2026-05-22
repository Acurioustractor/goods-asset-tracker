/**
 * Funder report generator. Loads a funder's section list, reads each
 * section markdown file in order, resolves all [METRIC: ...] placeholders
 * against live data, and writes the rendered markdown to a date-stamped
 * file under wiki/outputs/funder-reports/{slug}/{period}.md.
 *
 * Idempotent: re-running for the same period overwrites the file.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { FunderConfig, ReportContext, ReportPeriod, SectionKey } from './types';
import { resolveMetric } from './metrics';

// Map SectionKey → file path (numeric prefix matches the section's place in
// the canonical sequence; configs pick an ordered subset).
const SECTION_FILES: Record<SectionKey, string> = {
  'cover': '00-cover.md',
  'headline': '01-headline.md',
  'map': '02-map.md',
  'hero-photo': '03-hero-photo.md',
  'photo-grid': '04-photo-grid.md',
  'voices': '05-voices.md',
  'why-it-works': '06-why-it-works.md',
  'hero-video': '06b-hero-video.md',
  'how-we-track': '07-how-we-track.md',
  'impact-numbers': '08-impact-numbers.md',
  'financials-at-a-glance': '09-financials-at-a-glance.md',
  'headline-achievements': '10-headline-achievements.md',
  'investment-priorities': '11-investment-priorities.md',
  'alignment-principles': '12-alignment-principles.md',
  'safeguarding-risks': '13-safeguarding-risks.md',
  'commitment-progress': '14-commitment-progress.md',
  'upcoming-commitments': '15-upcoming-commitments.md',
  'whats-next': '16-whats-next.md',
  'country-acknowledgement': '17-country-acknowledgement.md',
};

function sectionsDir(): string {
  // Same pattern as deck/page.tsx: walk up to repo root, into wiki/templates.
  return join(process.cwd(), '..', 'wiki', 'templates', 'funder-report', 'sections');
}

function outputDir(): string {
  return join(process.cwd(), '..', 'wiki', 'outputs', 'funder-reports');
}

export function outputPath(slug: string, period: string): string {
  return join(outputDir(), slug, `${period}.md`);
}

async function loadSection(key: SectionKey): Promise<string> {
  const file = SECTION_FILES[key];
  const path = join(sectionsDir(), file);
  return readFile(path, 'utf-8');
}

/**
 * Replace every `[METRIC: key]` (one per line or inline) with the resolved
 * value. Other placeholder types ([PHOTO: ...], [QUOTE: ...], [VIDEO: ...])
 * are left as-is — they're resolved at render time by /admin/deck.
 */
async function resolvePlaceholders(md: string, ctx: ReportContext): Promise<string> {
  const re = /\[METRIC:\s*([a-z0-9-]+)\s*\]/gi;
  const matches = [...md.matchAll(re)];
  if (matches.length === 0) return md;
  // Resolve uniquely, then substitute (avoids hammering same metric multiple times)
  const unique = [...new Set(matches.map((m) => m[1]))];
  const resolved = new Map<string, string>();
  await Promise.all(unique.map(async (key) => {
    resolved.set(key, await resolveMetric(key, ctx));
  }));
  return md.replace(re, (_, key) => resolved.get(key) ?? `[METRIC ERROR: ${key} — resolution failed]`);
}

export async function generateReport(
  funder: FunderConfig,
  period: ReportPeriod,
  ctx: ReportContext,
): Promise<{ path: string; bytes: number; sections: number }> {
  const parts: string[] = [];
  for (const key of funder.sections) {
    const raw = await loadSection(key).catch(() => `<!-- missing section file: ${SECTION_FILES[key]} -->`);
    const resolved = await resolvePlaceholders(raw, ctx);
    parts.push(resolved);
  }
  const out = parts.join('\n\n');
  const path = outputPath(funder.slug, period.slug);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, out, 'utf-8');
  return { path, bytes: Buffer.byteLength(out), sections: funder.sections.length };
}
