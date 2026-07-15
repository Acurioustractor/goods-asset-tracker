/**
 * TRANSCRIPT PROVENANCE — where every storyteller's words actually come from.
 *
 * This is the code-side home of the storyteller provenance model
 * (wiki/outputs/2026-07-14-storyteller-provenance-model.md), CORRECTED and
 * completed on 2026-07-15 from the Empathy Ledger database export
 * (empathy-ledger-v2/output/goods-evidence/, 2026-07-14): the EL Supabase
 * holds real transcripts for far more voices than the Notion-only view
 * found, including the whole Tennant Creek roster the earlier doc marked
 * "curated, unknown origin".
 *
 * METADATA ONLY. Titles, dates, word counts and release states are catalog
 * facts; transcript TEXT is RED/sacred, lives locally in the EL export and
 * the gitignored quote-analysis dir, and never enters this repo.
 *
 * Release state matters: a transcript EXISTING is not the same as it being
 * cleared for external use. `releaseState` carries EL's own gate verbatim.
 */

export type ProvenanceKind =
  /** A real transcript in the Empathy Ledger database (direct project record). */
  | 'el-transcript'
  /** Transcript provided directly by Ben and cleared for analysis (outside EL). */
  | 'ben-provided-transcript'
  /** Dated, cleared field-trip notes: real firsthand documentation, not a formal transcript. */
  | 'trip-notes'
  /** Traceable to a funder pack document. */
  | 'funder-pack'
  /** Hardcoded in website content, bypassing the EL consent pipeline. */
  | 'content-hardcoded'
  /** Story carried by another voice by design (e.g. Xavier via Fred Campbell). */
  | 'narrated'
  /** Hand-typed curated card; no primary source traced yet. */
  | 'curated';

export type ElReleaseState =
  /** Transcript on file; external release not yet reviewed or granted. */
  | 'blocked_no_review_or_grant'
  /** Transcript on file; needs cultural and use review before any release. */
  | 'blocked_cultural_and_use_review'
  /** Recording on file; analysis itself not yet authorised. */
  | 'blocked_analysis_not_authorized'
  /** At least one story published publicly on EL. */
  | 'public_story';

export interface TranscriptProvenance {
  kind: ProvenanceKind;
  /** Distinct EL transcripts on file (duplicates excluded). */
  transcriptCount?: number;
  /** Largest single transcript, approximate words. */
  approxWords?: number;
  /** Recording dates known from the EL export (YYYY-MM-DD). */
  recordingDates?: string[];
  releaseState?: ElReleaseState;
  /** In the 2026-07-14 six-turn quote re-analysis (local-only TABLE.md; lines promote by hand). */
  inQuoteAnalysis?: boolean;
  note?: string;
}

export const PROVENANCE_ASOF = '2026-07-15';
export const PROVENANCE_SOURCE =
  'EL Supabase export 2026-07-14 (goods-evidence inventory; metadata only). Supersedes the Notion-only table in wiki/outputs/2026-07-14-storyteller-provenance-model.md.';

/** Keyed by storyteller-registry `name`. */
export const TRANSCRIPT_PROVENANCE: Record<string, TranscriptProvenance> = {
  // Tennant Creek (the earlier doc said zero transcripts here; EL says otherwise)
  'Dianne Stokes': {
    kind: 'el-transcript',
    transcriptCount: 5,
    approxWords: 2631,
    recordingDates: ['2025-04-06', '2026-02-16', '2026-04-01'],
    releaseState: 'public_story',
    inQuoteAnalysis: true,
    note: 'Five transcripts incl. the washing machine trip interviews; one story published on EL ("Where the Country Calls Me Home").',
  },
  'Norman Frank': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 2262,
    recordingDates: ['2025-04-06'],
    releaseState: 'blocked_cultural_and_use_review',
    inQuoteAnalysis: true,
    note: 'Transcript is about Wilya Janta housing context; product quotes stay registry-gated.',
  },
  'Linda Turner': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 2444,
    recordingDates: ['2025-04-06'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
  },
  'Jimmy Frank': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 4269,
    recordingDates: ['2025-07-07'],
    releaseState: 'blocked_cultural_and_use_review',
    inQuoteAnalysis: true,
  },
  'Melissa Jackson': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 577,
    recordingDates: ['2025-06-27'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
  },
  'Annie Morrison': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 832,
    recordingDates: ['2025-04-06'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
  },
  'Brian Russell': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 1380,
    recordingDates: ['2025-06-27'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: 'Medical disclosure inside the transcript: external use HELD pending Ben.',
  },
  'Risilda Hogan': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 713,
    recordingDates: ['2025-04-06'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
  },
  'Cliff Plummer': {
    kind: 'el-transcript',
    transcriptCount: 2,
    approxWords: 793,
    recordingDates: ['2025-04-06'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: 'Practitioner. Medical disclosure inside the transcript: external use HELD pending Ben.',
  },
  'Patricia Frank': {
    kind: 'curated',
    note: 'No EL transcript in the 2026-07-14 export despite carrying the washing/health thread. Priority gap: record her properly.',
  },

  // Kalgoorlie / Palm Island / Darwin / Mount Isa (the original 2024-25 research trip)
  'Gloria Turner': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 1034,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
  },
  'Chloe': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 1175,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: 'Practitioner.',
  },
  'Walter': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 615,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: 'Registry tier is hold: transcript exists, external use is not cleared.',
  },
  'Mark': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 389,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: 'Website tier despite a real transcript.',
  },
  'Gary': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 5264,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: 'EL files this under the Goods project; the Notion "Beyond Shadows" tag was a mis-filing. Longest transcript in the corpus (15 bed mentions). Fire-and-dirt consultation line VERIFIED verbatim 2026-07-15: "sitting down on the grass, on the dirt, with the fire, that\'s our consultation, without the pen and paper, and just actually sit down and listen." Promoting it into the registry as an on-screen quote is Ben\'s call.',
  },
  'Wayne Glenn': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 1023,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: 'Practitioner.',
  },
  'Alfred Johnson': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 932,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
  },
  'Ivy': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 299,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: '"Which Ivy" identity flag still open before print use.',
  },
  'Jason': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 817,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
  },
  'Daniel Patrick Noble': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 1083,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
  },
  'Carmelita & Colette': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 615,
    recordingDates: ['2025-01-18'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
  },
  'Tracy McCartney': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 2916,
    recordingDates: ['2025-02-02'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: 'Place conflict unresolved; out of the deck table until fixed.',
  },

  // Alice Springs / Utopia / Oonchiumpa
  'Shayne Bloomfield': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 3936,
    releaseState: 'blocked_analysis_not_authorized',
    note: 'Filed in EL as "Shane Bloomfield". Long recording on file; analysis not yet authorised.',
  },
  'Kylie Bloomfield': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 3646,
    releaseState: 'blocked_analysis_not_authorized',
    note: 'Recording on file; analysis not yet authorised. Registry lists no usable transcript: this is why.',
  },
  'Fred Campbell': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 24,
    releaseState: 'blocked_analysis_not_authorized',
    note: 'Only a 24-word community-voices clip in EL; his narrative weight still rests on the curated card. Record him properly.',
  },
  'Mykel': {
    kind: 'ben-provided-transcript',
    transcriptCount: 1,
    inQuoteAnalysis: true,
    note: 'Transcript provided and cleared by Ben (2026-07-14 analysis batch D).',
  },
  'Xavier': {
    kind: 'narrated',
    note: 'By design: Fred Campbell narrates; consent via Oonchiumpa. Never quoted directly.',
  },
  'Katrina Bloomfield': {
    kind: 'trip-notes',
    note: 'Raw field-trip note, cleared. Real firsthand documentation, not a formal transcript.',
  },
  'Dorrie Jones': {
    kind: 'trip-notes',
    note: 'Trip note, Ben-cleared 2026-06-17.',
  },
  'Karen Liddle': {
    kind: 'trip-notes',
    note: 'Trip note, cleared. EL also holds Oonchiumpa partner lead records (not transcripts).',
  },
  'Kristy Bloomfield': {
    kind: 'curated',
    note: 'Seven partner lead records in EL (investigation only), no transcript. Record her properly.',
  },
  'Ray Nelson': {
    kind: 'funder-pack',
    note: 'Traceable to bed GB0-156-96 in a funder pack.',
  },

  // Practitioners / other
  'Dr Boe Remenyi': {
    kind: 'curated',
    note: 'Practitioner. No primary source traced.',
  },
  'Heather Mundo': { kind: 'curated' },
  'Jessica Allardyce': {
    kind: 'content-hardcoded',
    note: 'Bypasses the EL consent pipeline; hold tier, correctly unused.',
  },
  'Zelda Hogan': {
    kind: 'content-hardcoded',
    note: 'Website tier; never into funder surfaces.',
  },
  'Frankie Holmes OAM': { kind: 'trip-notes', note: 'Ampilatwatja trip voice card; full name crediting to confirm.' },
  'Donald Thompson OAM': { kind: 'trip-notes', note: 'Ampilatwatja trip voice card; full name crediting to confirm.' },
  'Charley': { kind: 'trip-notes', note: 'Trip voice card.' },
  'Nicholas Marchesi': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 567,
    releaseState: 'blocked_analysis_not_authorized',
  },
};

/** Voices with EL transcripts who are NOT yet in the storyteller registry. */
export const UNREGISTERED_TRANSCRIPTS: Record<string, TranscriptProvenance> = {
  'Ana - Bega': {
    kind: 'el-transcript',
    transcriptCount: 1,
    approxWords: 3054,
    recordingDates: ['2025-02-02'],
    releaseState: 'blocked_no_review_or_grant',
    inQuoteAnalysis: true,
    note: 'Bega Health practitioner; storyteller profile inactive in EL; not in the registry yet (open item).',
  },
};

const DEFAULT_PROVENANCE: TranscriptProvenance = {
  kind: 'curated',
  note: 'Not yet mapped in the provenance model.',
};

export function getProvenance(name: string): TranscriptProvenance {
  return TRANSCRIPT_PROVENANCE[name] ?? DEFAULT_PROVENANCE;
}

export function provenanceLabel(p: TranscriptProvenance): string {
  switch (p.kind) {
    case 'el-transcript': {
      const n = p.transcriptCount ?? 1;
      const w = p.approxWords ? `, ~${p.approxWords.toLocaleString()} words` : '';
      return `EL transcript${n > 1 ? ` x${n}` : ''}${w}`;
    }
    case 'ben-provided-transcript':
      return 'Transcript, Ben-provided + cleared';
    case 'trip-notes':
      return 'Trip notes, cleared';
    case 'funder-pack':
      return 'Funder pack, traceable';
    case 'content-hardcoded':
      return 'Hardcoded in site content';
    case 'narrated':
      return 'Narrated by another voice (by design)';
    case 'curated':
      return 'Curated card, no primary source';
  }
}

export function releaseStateLabel(s: ElReleaseState): string {
  switch (s) {
    case 'blocked_no_review_or_grant':
      return 'on file, external release not yet granted';
    case 'blocked_cultural_and_use_review':
      return 'on file, needs cultural + use review';
    case 'blocked_analysis_not_authorized':
      return 'recording on file, analysis not yet authorised';
    case 'public_story':
      return 'a story is published on EL';
  }
}
