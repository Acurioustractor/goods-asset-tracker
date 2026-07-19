// Merges the deep transcript analyses (wiki/investor/voice-analysis/batch-*.json)
// with the EL consent + portrait snapshot into the committed data file the
// Voice Impact Model reads: v2/src/lib/data/voice-impact-data.json.
//
//   node --env-file=.env.local scripts/build-voice-impact-data.mjs
//
// Re-runnable: pulls consent/portraits live from EL, reads analyses from the
// repo. Analysis JSONs are the durable output of the 2026-07-20 deep pass
// (Ben-authorised for all storytellers); edit them by hand as quotes clear.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ANALYSIS_DIR = path.join(ROOT, '..', 'wiki', 'investor', 'voice-analysis');
const OUT = path.join(ROOT, 'src', 'lib', 'data', 'voice-impact-data.json');

const EL_URL = (process.env.EMPATHY_LEDGER_SUPABASE_URL || '').replace(/"/g, '');
const EL_KEY = (process.env.EMPATHY_LEDGER_SUPABASE_KEY || '').replace(/"/g, '');
const GOODS_PROJECT = '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

// EL filing-name -> canonical name (Ben-confirmed).
const NAME_FIX = { 'Shane Bloomfield': 'Shayne Bloomfield', 'Kirsty Bloomfield': 'Kristy Bloomfield' };

async function elConsentSnapshot() {
  if (!EL_URL || !EL_KEY) throw new Error('EL env missing');
  const res = await fetch(
    `${EL_URL}/rest/v1/transcripts?project_id=eq.${GOODS_PROJECT}&deleted_at=is.null&consent_withdrawn_at=is.null&word_count=gte.100&select=id,title,word_count,ai_analysis_allowed,ai_processing_consent,privacy_level,cultural_sensitivity,requires_elder_review,storyteller_id,storytellers(display_name,public_avatar_url,profile_image_url,location,is_elder)&limit=100`,
    { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } },
  );
  if (!res.ok) throw new Error(`EL ${res.status}`);
  return res.json();
}

const el = await elConsentSnapshot();
const elById = new Map(el.map((t) => [t.id, t]));

const analyses = [];
for (const f of fs.readdirSync(ANALYSIS_DIR).filter((f) => f.endsWith('.json')).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(ANALYSIS_DIR, f), 'utf8'));
  analyses.push(...j.transcripts.filter((t) => !t.error && t.transcript_id !== 'synthesis'));
}

// Normalise analysis-batch variance: themes_present entries may use `theme` or
// `id` as the key; stray domain-as-theme values map to the nearest theme.
const THEME_ALIAS = { 'circular-economy': 'product-durability' };
const normTheme = (t) => THEME_ALIAS[t] || t;
const normThemesPresent = (arr) =>
  (arr || []).map((x) =>
    typeof x === 'string'
      ? { theme: normTheme(x), note: '' }
      : { theme: normTheme(x.theme ?? x.id), note: x.note || '' },
  );

const byVoice = new Map();
for (const a of analyses) {
  const elRow = elById.get(a.transcript_id);
  if (!elRow) {
    console.warn(`no EL row for ${a.storyteller} ${a.transcript_id} — skipped`);
    continue;
  }
  const rawName = elRow.storytellers?.display_name || a.storyteller;
  const name = NAME_FIX[rawName] || rawName;
  if (!byVoice.has(name)) {
    byVoice.set(name, {
      name,
      elStorytellerId: elRow.storyteller_id || null,
      location: elRow.storytellers?.location || null,
      isElder: !!elRow.storytellers?.is_elder,
      portrait: elRow.storytellers?.profile_image_url || elRow.storytellers?.public_avatar_url || null,
      held: !!a.held,
      staff: !!a.staff,
      transcriptCount: 0,
      totalWords: 0,
      elConsent: {
        aiAnalysisAllowed: elRow.ai_analysis_allowed,
        aiProcessingConsent: elRow.ai_processing_consent,
        privacyLevel: elRow.privacy_level,
        culturalSensitivity: elRow.cultural_sensitivity,
        requiresElderReview: elRow.requires_elder_review,
      },
      transcripts: [],
    });
  }
  const v = byVoice.get(name);
  v.held = v.held || !!a.held;
  v.staff = v.staff || !!a.staff;
  v.transcriptCount += 1;
  v.totalWords += elRow.word_count || 0;
  v.transcripts.push({
    storyteller: name,
    transcriptId: a.transcript_id,
    title: elRow.title || '',
    wordCount: elRow.word_count || 0,
    held: !!a.held,
    staff: !!a.staff,
    topQuotes: (a.top_quotes || []).map((q) => ({
      text: q.text,
      timestamp: q.timestamp ?? null,
      context: q.context || '',
      themes: (q.themes || []).map(normTheme),
      domain: q.domain,
      strength: a.held ? 'internal-only' : q.strength,
      sensitivity: q.sensitivity ?? null,
      cleared: !!q.cleared,
    })),
    themesPresent: normThemesPresent(a.themes_present),
    narrativeSummary: a.narrative_summary || '',
    analysisNotes: a.analysis_notes || '',
  });
}

const out = {
  asOf: '2026-07-20',
  analysisAuthority:
    'Full-transcript analysis authorised by Ben for all Goods storytellers, 2026-07-20. External use of any quote still requires a per-quote clearing pass (cleared: true).',
  voices: [...byVoice.values()].sort((a, b) => {
    const q = (v) => v.transcripts.reduce((n, t) => n + t.topQuotes.filter((x) => x.strength === 'deck').length, 0);
    return q(b) - q(a) || b.totalWords - a.totalWords;
  }),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
const nq = out.voices.reduce((n, v) => n + v.transcripts.reduce((m, t) => m + t.topQuotes.length, 0), 0);
console.log(`${out.voices.length} voices, ${analyses.length} transcripts, ${nq} quotes -> ${path.relative(ROOT, OUT)}`);
