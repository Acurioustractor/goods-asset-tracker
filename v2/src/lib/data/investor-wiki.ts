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
    metric: '29 voices analysed · 192 quotes · 56 cleared',
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
    metric: 'crm_contacts hub · 135 contacts',
    status: 'draft',
    href: '/admin/people',
    doc: 'wiki/investor/03-partners-people.md',
  },
  {
    num: '04',
    slug: 'raise',
    title: 'Raise',
    description: 'QBE pipeline, LOIs, supporters, match spine',
    metric: '$0 signed of $400K · 31 Aug',
    status: 'draft',
    href: '/admin/deals',
    doc: 'wiki/investor/04-qbe-pipeline.md',
  },
  {
    num: '05',
    slug: 'visuals',
    title: 'Visuals',
    description: 'Diagrams and model drawings, done and missing',
    metric: 'money charts at canon · map regenerated',
    status: 'draft',
    href: '/admin/system-visuals',
    doc: 'wiki/investor/05-diagrams.md',
  },
  {
    num: '06',
    slug: 'full-stories',
    title: 'Full stories',
    description: 'Project history · people, places and the work',
    metric: 'Maningrida story unlocked (Shayne)',
    status: 'draft',
    href: '/admin/site-content',
    doc: 'wiki/investor/06-full-stories.md',
  },
  {
    num: '07',
    slug: 'media',
    title: 'Media',
    description: 'All photos and videos, walkthroughs and gaps',
    metric: 'media_links live · 145+ links',
    status: 'draft',
    href: '/admin/media-library',
    doc: 'wiki/investor/07-media.md',
  },
  {
    num: '08',
    slug: 'pitch-deck',
    title: 'Pitch deck',
    description: 'Slide-by-slide review of the funder deck',
    metric: 'on final canon · cleared voices placed',
    status: 'draft',
    href: '/admin/pitch-cockpit',
    doc: 'wiki/investor/08-deck-review.md',
  },
  {
    num: '12',
    slug: 'voice-impact',
    title: 'Voice Impact Model',
    description: 'Every transcript analysed; themes mapped to the 5 domains',
    metric: '29 voices · 41 transcripts · 13 themes',
    status: 'draft',
    href: '/admin/voice-impact',
    doc: 'wiki/investor/12-voice-impact-model.md',
  },
  {
    num: '13',
    slug: 'linkage',
    title: 'Linkage coverage',
    description: 'Voices x quotes x photos x videos x communities, with gaps',
    metric: 'auto-generated join',
    status: 'draft',
    href: '/admin/voice-impact',
    doc: 'wiki/investor/13-linkage-coverage.md',
  },
  {
    num: '14',
    slug: 'playout',
    title: 'Playout plan',
    description: 'The 12-beat assembly spine every surface follows',
    metric: '12 of 12 beats READY',
    status: 'locked',
    href: '/admin/pitch-cockpit',
    doc: 'wiki/investor/14-playout-plan.md',
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
  // Voice Impact Model deep pass 2026-07-20 (192 coded quotes across 29 voices).
  { domain: 'Self-determination', quotes: 66 },
  { domain: 'Rest & health', quotes: 62 },
  { domain: 'Dignity & safety', quotes: 43 },
  { domain: 'Jobs & ownership', quotes: 15 },
  { domain: 'Circular economy', quotes: 12 },
];

/** Gaps to close, from the Area 1 pass. */
export const VOICE_GAPS: string[] = [
  'Jobs-ownership and circular-economy are the thin domains: record makers at the next production run',
  'Patricia Frank carries the washing thread with no transcript on file',
  "Fred Campbell's quotes rest on a 24-word clip",
  'Only Mykel + Karen have linked video; Sinnae video missing, May-trip footage not in repo',
  'Margaret Lloyd has no photo; homeland spelling ("Wenitong") unverified',
];

/** Human-gated actions surfaced on the wiki dashboard. Mirror of MEMORY/handoffs. */
export const NEEDS_BEN: { label: string; href?: string }[] = [
  { label: '$426 full cost-model sense-check session (Ben request 2026-07-20; stays Modelled until then)', href: '/admin/cost-model' },
  { label: 'Margaret Lloyd homeland spelling ("Wenitong" as transcribed) before external captions' },
  { label: 'Julalikari washer recipients (names for GB0-WM-TC-JUL rows)' },
  { label: 'Tennant youth centre follow-up owner' },
  { label: 'Jimmy Frank break-the-cycle quote: audio check before external use', href: '/admin/voice-impact' },
  { label: 'Kununurra Elder clearance (paper-only consent; gates any Kununurra story)' },
];
