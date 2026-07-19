/**
 * The Voice Impact Model — the qualitative backbone of the Goods impact story.
 *
 * Where impact-model.ts carries the five outcome domains as NUMBERS, this model
 * carries them as VOICES: every substantive Empathy Ledger transcript in the
 * Goods project (29 transcripts, 26 voices), deep-analysed with per-voice top
 * quotes, thematic coding, and a theme -> outcome-domain mapping. The claim
 * direction is always voice-first: the numbers prove scale, the voices prove
 * meaning, and no voice is ever reduced to a metric.
 *
 * Empathy Ledger philosophy, applied:
 *  - Storyteller sovereignty: the transcript is the person's asset. Analysis
 *    here is Ben-authorised (2026-07-20, all storytellers); EXTERNAL use of any
 *    line still requires a per-quote clearing pass. `cleared` is per quote.
 *  - Default-deny: held voices (Walter) are analysed for understanding but
 *    marked held and never surface outside /admin.
 *  - Verbatim or nothing: every quote is transcript-verbatim (filler trims
 *    marked with ...). Paraphrase is not a quote.
 *  - The why, not an outcome: health testimony stays in the storyteller's own
 *    voice; scabies -> RHD remains the reason the products exist, never a
 *    claimed health outcome.
 *
 * Data flow: EL transcripts -> deep analysis (wiki/investor/voice-analysis/) ->
 * scripts/build-voice-impact-data.mjs -> voice-impact-data.json -> this module.
 */

import data from './voice-impact-data.json';

export type ImpactDomainId =
  | 'rest-health'
  | 'dignity-safety'
  | 'self-determination'
  | 'jobs-ownership'
  | 'circular-economy';

export type VoiceThemeId =
  | 'rest-sleep-health'
  | 'washing-clean'
  | 'dignity-safety'
  | 'design-in-community'
  | 'never-asked'
  | 'making-jobs'
  | 'ownership-pathway'
  | 'country-culture'
  | 'elders-protocol'
  | 'reciprocity-partnership'
  | 'product-durability'
  | 'system-failure'
  | 'family-kids';

export interface VoiceTheme {
  id: VoiceThemeId;
  label: string;
  blurb: string;
  /** Which canonical outcome domain this theme evidences. */
  domain: ImpactDomainId;
}

/** The coding taxonomy. Order = display order. */
export const VOICE_THEMES: VoiceTheme[] = [
  { id: 'rest-sleep-health', label: 'Rest, sleep & health', blurb: 'Sleep off the ground, recovery, what a real bed changes at night', domain: 'rest-health' },
  { id: 'washing-clean', label: 'Washing & clean bedding', blurb: 'Working washers, hot washes, clean bedding in the tropics', domain: 'rest-health' },
  { id: 'dignity-safety', label: 'Dignity & safety', blurb: 'Pride, a bed you can get out of yourself, a home that works', domain: 'dignity-safety' },
  { id: 'family-kids', label: 'Family & kids', blurb: 'Children, grandkids, family life around the products', domain: 'dignity-safety' },
  { id: 'design-in-community', label: 'Designed in community', blurb: 'Products shaped by the people who use them', domain: 'self-determination' },
  { id: 'never-asked', label: 'Never been asked', blurb: 'Decades of services arriving without asking first', domain: 'self-determination' },
  { id: 'elders-protocol', label: 'Elders & protocol', blurb: 'Elders first, traditional owners before government', domain: 'self-determination' },
  { id: 'country-culture', label: 'Country & culture', blurb: 'Connection to country, language, cultural life', domain: 'self-determination' },
  { id: 'reciprocity-partnership', label: 'Reciprocity & partnership', blurb: 'Two-way need; how organisations should show up', domain: 'self-determination' },
  { id: 'making-jobs', label: 'Making & jobs', blurb: 'Building the products, work, wages, young makers', domain: 'jobs-ownership' },
  { id: 'ownership-pathway', label: 'Ownership pathway', blurb: 'Community owning the making; a pathway, never claimed complete', domain: 'jobs-ownership' },
  { id: 'product-durability', label: 'Product durability', blurb: 'Things that last vs things that end up in the dump', domain: 'circular-economy' },
  { id: 'system-failure', label: 'The broken supply chain', blurb: 'Freight, cost, distance, products that fail too quickly', domain: 'circular-economy' },
];

export const DOMAIN_LABELS: Record<ImpactDomainId, string> = {
  'rest-health': 'Rest & health',
  'dignity-safety': 'Dignity & safety',
  'self-determination': 'Self-determination & community-led design',
  'jobs-ownership': 'Jobs, On Country work & ownership',
  'circular-economy': 'Circular & local economy',
};

export interface VoiceQuote {
  text: string;
  timestamp: string | null;
  context: string;
  themes: VoiceThemeId[];
  domain: ImpactDomainId;
  strength: 'deck' | 'strong' | 'supporting' | 'internal-only';
  sensitivity: string | null;
  /** True only when Ben has cleared this exact line for external use. */
  cleared: boolean;
}

export interface VoiceTranscriptAnalysis {
  storyteller: string;
  transcriptId: string;
  title: string;
  wordCount: number;
  held: boolean;
  staff: boolean;
  topQuotes: VoiceQuote[];
  themesPresent: { theme: VoiceThemeId; note: string }[];
  narrativeSummary: string;
  analysisNotes: string;
}

export interface VoiceProfile {
  name: string;
  elStorytellerId: string | null;
  location: string | null;
  isElder: boolean;
  portrait: string | null;
  held: boolean;
  staff: boolean;
  transcriptCount: number;
  totalWords: number;
  /** EL's own consent flags, shown honestly next to Ben's blanket analysis authorisation. */
  elConsent: {
    aiAnalysisAllowed: boolean | null;
    aiProcessingConsent: boolean | null;
    privacyLevel: string | null;
    culturalSensitivity: string | null;
    requiresElderReview: boolean | null;
  };
  transcripts: VoiceTranscriptAnalysis[];
}

export interface VoiceImpactData {
  asOf: string;
  analysisAuthority: string;
  voices: VoiceProfile[];
}

export const VOICE_IMPACT: VoiceImpactData = data as VoiceImpactData;

// ---------------------------------------------------------------------------
// Derived views for the admin surface.

export function allQuotes(): (VoiceQuote & { storyteller: string; held: boolean; staff: boolean })[] {
  return VOICE_IMPACT.voices.flatMap((v) =>
    v.transcripts.flatMap((t) =>
      t.topQuotes.map((q) => ({ ...q, storyteller: v.name, held: v.held, staff: v.staff })),
    ),
  );
}

export function themeCounts(): { theme: VoiceTheme; quotes: number; voices: number }[] {
  const quotes = allQuotes();
  return VOICE_THEMES.map((theme) => {
    const hits = quotes.filter((q) => q.themes.includes(theme.id));
    return { theme, quotes: hits.length, voices: new Set(hits.map((q) => q.storyteller)).size };
  });
}

export function domainCoverage(): {
  domain: ImpactDomainId;
  label: string;
  quotes: number;
  voices: number;
  deckGrade: number;
}[] {
  const quotes = allQuotes().filter((q) => !q.held && !q.staff);
  return (Object.keys(DOMAIN_LABELS) as ImpactDomainId[]).map((domain) => {
    const hits = quotes.filter((q) => q.domain === domain);
    return {
      domain,
      label: DOMAIN_LABELS[domain],
      quotes: hits.length,
      voices: new Set(hits.map((q) => q.storyteller)).size,
      deckGrade: hits.filter((q) => q.strength === 'deck').length,
    };
  });
}
