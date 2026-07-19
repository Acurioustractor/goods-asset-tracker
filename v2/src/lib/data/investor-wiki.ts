/**
 * Investor wiki — the 8 pitch areas and their pass status.
 *
 * Mirrors wiki/investor/00-INDEX.md (the human-readable master index).
 * Update BOTH when an area's status changes. Statuses are deliberately
 * coarse: pending -> in-progress -> draft -> locked.
 *
 * Domain quote-coverage counts are from the Area 1 pass
 * (wiki/investor/01-storytellers.md, 2026-07-19): 70 cleared external-tier
 * quotes mapped one-to-one onto the 5 impact domains.
 */

export type AreaStatus = 'pending' | 'in-progress' | 'draft' | 'locked';

export interface WikiArea {
  num: string;
  slug: string;
  title: string;
  description: string;
  metric: string;
  status: AreaStatus;
  /** Admin hub route for this area. */
  href: string;
  /** Wiki source doc, relative to repo root. */
  doc: string;
}

export const WIKI_AREAS: WikiArea[] = [
  {
    num: '01',
    slug: 'voices',
    title: 'Voices',
    description: 'Storytellers, cleared quotes, impact links',
    metric: '40 storytellers · 70 quotes',
    status: 'draft',
    href: '/admin/voices',
    doc: 'wiki/investor/01-storytellers.md',
  },
  {
    num: '02',
    slug: 'money-story',
    title: 'Money story',
    description: 'Cost model v6, honest numbers, how to explain it',
    metric: '$685 today → $426 in-house',
    status: 'draft',
    href: '/admin/cost-model',
    doc: 'wiki/investor/02-financial-model.md',
  },
  {
    num: '03',
    slug: 'people',
    title: 'People',
    description: 'Partners, team, the people who make it possible',
    metric: 'registry + advisory',
    status: 'pending',
    href: '/admin/people',
    doc: 'wiki/investor/03-partners-people.md',
  },
  {
    num: '04',
    slug: 'raise',
    title: 'Raise',
    description: 'QBE pipeline, LOIs, supporters, match spine',
    metric: '$0 signed of $400K · 31 Aug',
    status: 'pending',
    href: '/admin/deals',
    doc: 'wiki/investor/04-qbe-pipeline.md',
  },
  {
    num: '05',
    slug: 'visuals',
    title: 'Visuals',
    description: 'Diagrams and model drawings, done and missing',
    metric: '8 brand diagrams live',
    status: 'pending',
    href: '/admin/system-visuals',
    doc: 'wiki/investor/05-diagrams.md',
  },
  {
    num: '06',
    slug: 'full-stories',
    title: 'Full stories',
    description: 'Project history · people, places and the work',
    metric: '2 Notion masters',
    status: 'pending',
    href: '/admin/site-content',
    doc: 'wiki/investor/06-full-stories.md',
  },
  {
    num: '07',
    slug: 'media',
    title: 'Media',
    description: 'All photos and videos, walkthroughs and gaps',
    metric: '134 starred · video gaps',
    status: 'pending',
    href: '/admin/media-library',
    doc: 'wiki/investor/07-media.md',
  },
  {
    num: '08',
    slug: 'pitch-deck',
    title: 'Pitch deck',
    description: 'Slide-by-slide review of the funder deck',
    metric: '11 slides · 1 stale figure',
    status: 'pending',
    href: '/admin/pitch-cockpit',
    doc: 'wiki/investor/08-deck-review.md',
  },
];

export const STATUS_LABEL: Record<AreaStatus, string> = {
  pending: 'PENDING',
  'in-progress': 'IN PROGRESS',
  draft: 'DRAFT READY',
  locked: 'LOCKED',
};

/**
 * Quotes-per-impact-domain coverage from the Area 1 pass.
 * Source: wiki/investor/01-storytellers.md (2026-07-19). Re-run that pass
 * when the registry changes; do not hand-tweak these numbers.
 */
export const DOMAIN_QUOTE_COVERAGE: { domain: string; quotes: number }[] = [
  { domain: 'Rest & health', quotes: 21 },
  { domain: 'Jobs & ownership', quotes: 20 },
  { domain: 'Self-determination', quotes: 19 },
  { domain: 'Dignity & safety', quotes: 8 },
  { domain: 'Circular economy', quotes: 2 },
];

/** Gaps to close, from the Area 1 pass. */
export const VOICE_GAPS: string[] = [
  'No plastic-loop community quote (circular economy has 2, both freight-cost)',
  'Patricia Frank carries the washing thread with no transcript on file',
  "Fred Campbell's quotes rest on a 24-word clip",
];

/** Human-gated actions surfaced on the wiki dashboard. Mirror of MEMORY/handoffs. */
export const NEEDS_BEN: { label: string; href?: string }[] = [
  { label: 'Rule on 3-shifts vs two through-lines impact model', href: '/admin/voices' },
  { label: 'Maningrida DB correction --apply (drift red until applied)' },
  { label: 'Area 1 storyteller doc review (wiki/investor/01-storytellers.md)' },
  { label: 'Area 2: rule on claim labels ($426 verified vs modelled vs deck "measured") + revenue triangle', href: '/admin/cost-model' },
];
