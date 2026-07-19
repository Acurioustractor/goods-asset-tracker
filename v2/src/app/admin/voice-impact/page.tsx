// The Voice Impact Model — the qualitative half of the Goods impact story.
//
// Numbers live on /impact and /admin; this page carries the VOICES: every
// substantive EL transcript deep-analysed (Ben-authorised 2026-07-20), coded
// against the theme taxonomy, mapped to the five canonical outcome domains,
// with portraits and linked media via media_links. Internal surface: held
// voices render here with a HELD badge and never leave /admin.

import Image from 'next/image';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import {
  VOICE_IMPACT,
  VOICE_THEMES,
  DOMAIN_LABELS,
  allQuotes,
  themeCounts,
  domainCoverage,
  type ImpactDomainId,
} from '@/lib/data/voice-impact-model';

export const metadata = {
  title: 'Voice Impact Model · Goods admin',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

const DOMAIN_TONE: Record<ImpactDomainId, { bar: string; chip: string }> = {
  'rest-health': { bar: 'bg-orange-700', chip: 'bg-orange-50 text-orange-800' },
  'dignity-safety': { bar: 'bg-amber-600', chip: 'bg-amber-50 text-amber-800' },
  'self-determination': { bar: 'bg-emerald-700', chip: 'bg-emerald-50 text-emerald-800' },
  'jobs-ownership': { bar: 'bg-sky-700', chip: 'bg-sky-50 text-sky-800' },
  'circular-economy': { bar: 'bg-stone-600', chip: 'bg-stone-100 text-stone-700' },
};

async function mediaCounts(): Promise<Map<string, number>> {
  // media_links person targets keyed by crm_contacts id -> count per person name.
  try {
    const supabase = createServiceClient();
    const [{ data: links }, { data: contacts }] = await Promise.all([
      supabase.from('media_links').select('target_key').eq('target_type', 'person'),
      supabase.from('crm_contacts').select('id, name'),
    ]);
    const nameById = new Map((contacts ?? []).map((c) => [c.id, c.name]));
    const counts = new Map<string, number>();
    for (const l of links ?? []) {
      const name = nameById.get(l.target_key);
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return counts;
  } catch {
    return new Map();
  }
}

export default async function VoiceImpactPage() {
  const media = await mediaCounts();
  const voices = VOICE_IMPACT.voices;
  const quotes = allQuotes();
  const community = voices.filter((v) => !v.staff);
  const totals = {
    voices: community.length,
    transcripts: voices.reduce((n, v) => n + v.transcriptCount, 0),
    words: voices.reduce((n, v) => n + v.totalWords, 0),
    quotes: quotes.length,
    deck: quotes.filter((q) => q.strength === 'deck' && !q.held && !q.staff).length,
    cleared: quotes.filter((q) => q.cleared).length,
  };
  const domains = domainCoverage();
  const themes = themeCounts();
  const maxTheme = Math.max(1, ...themes.map((t) => t.quotes));

  return (
    <div className="space-y-10 p-6 pb-24">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-800">
          Voices · the qualitative impact backbone
        </p>
        <h1 className="mt-1 font-serif text-3xl text-stone-900">The Voice Impact Model</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Every substantive Empathy Ledger transcript in the Goods project, deep-analysed and coded
          against the five outcome domains. The numbers on <Link href="/impact" className="underline">/impact</Link> prove
          scale; these voices prove meaning. Empathy Ledger philosophy applies throughout: the
          transcript is the storyteller&rsquo;s asset, analysis is authorised, external use of any line
          still needs its own clearing pass, and no voice is reduced to a metric.
        </p>
        <p className="mt-2 text-xs text-stone-400">{VOICE_IMPACT.analysisAuthority}</p>
      </header>

      {/* Stat strip */}
      <div className="flex flex-wrap gap-x-10 gap-y-3 border-y border-stone-200 py-4">
        {[
          [totals.voices, 'community voices'],
          [totals.transcripts, 'transcripts analysed'],
          [totals.words.toLocaleString(), 'words'],
          [totals.quotes, 'top quotes extracted'],
          [totals.deck, 'deck-grade'],
          [totals.cleared, 'cleared for external use'],
        ].map(([n, label]) => (
          <div key={String(label)}>
            <div className="font-serif text-2xl text-stone-900">{n}</div>
            <div className="text-xs uppercase tracking-wide text-stone-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Domain coverage */}
      <section>
        <h2 className="font-serif text-xl text-stone-900">Voices by outcome domain</h2>
        <p className="mt-1 text-sm text-stone-500">
          Which of the five canonical domains the voices evidence, and how strongly.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {domains.map((d) => (
            <div key={d.domain} className="rounded-lg border border-stone-200 p-4">
              <div className="text-sm font-semibold text-stone-800">{d.label}</div>
              <div className="mt-3 font-serif text-3xl text-stone-900">{d.voices}</div>
              <div className="text-xs text-stone-500">voices · {d.quotes} quotes · {d.deckGrade} deck-grade</div>
              <div className="mt-3 h-1.5 w-full rounded bg-stone-100">
                <div
                  className={`h-1.5 rounded ${DOMAIN_TONE[d.domain].bar}`}
                  style={{ width: `${Math.min(100, (d.quotes / Math.max(1, totals.quotes)) * 300)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Theme bars */}
      <section>
        <h2 className="font-serif text-xl text-stone-900">What the voices talk about</h2>
        <p className="mt-1 text-sm text-stone-500">Thematic coding across all transcripts, coloured by outcome domain.</p>
        <div className="mt-4 space-y-2">
          {themes
            .filter((t) => t.quotes > 0)
            .sort((a, b) => b.quotes - a.quotes)
            .map(({ theme, quotes: q, voices: v }) => (
              <div key={theme.id} className="flex items-center gap-3">
                <div className="w-56 shrink-0 text-right">
                  <span className="text-sm text-stone-700">{theme.label}</span>
                </div>
                <div className="h-5 flex-1 rounded bg-stone-100">
                  <div
                    className={`flex h-5 items-center rounded pl-2 text-[11px] font-medium text-white ${DOMAIN_TONE[theme.domain].bar}`}
                    style={{ width: `${Math.max(7, (q / maxTheme) * 100)}%` }}
                  >
                    {q}
                  </div>
                </div>
                <div className="w-20 shrink-0 text-xs text-stone-500">{v} voices</div>
              </div>
            ))}
        </div>
      </section>

      {/* Voice cards */}
      <section>
        <h2 className="font-serif text-xl text-stone-900">The voices</h2>
        <p className="mt-1 text-sm text-stone-500">
          Ordered by deck-grade material. Portraits from Empathy Ledger; photo counts from media_links.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {voices.map((v) => {
            const vq = v.transcripts.flatMap((t) => t.topQuotes);
            const best = vq.find((q) => q.strength === 'deck') ?? vq[0];
            const vThemes = [...new Set(v.transcripts.flatMap((t) => t.themesPresent.map((x) => x.theme)))];
            const photos = media.get(v.name) ?? 0;
            return (
              <div key={v.name} className={`rounded-lg border p-4 ${v.held ? 'border-red-200 bg-red-50/40' : 'border-stone-200'}`}>
                <div className="flex items-start gap-3">
                  {v.portrait ? (
                    // EL-hosted portrait; plain img keeps remote domains simple on an admin page.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.portrait} alt={v.name} className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-200 font-serif text-lg text-stone-600">
                      {v.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-stone-900">{v.name}</span>
                      {v.isElder && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">ELDER</span>}
                      {v.held && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">HELD · internal only</span>}
                      {v.staff && <span className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-semibold text-stone-600">STAFF</span>}
                    </div>
                    <div className="text-xs text-stone-500">
                      {v.location ?? 'location unrecorded'} · {v.transcriptCount} transcript{v.transcriptCount > 1 ? 's' : ''} ·{' '}
                      {v.totalWords.toLocaleString()} words{photos > 0 ? ` · ${photos} linked photo${photos > 1 ? 's' : ''}` : ''}
                    </div>
                  </div>
                </div>
                {best && (
                  <blockquote className="mt-3 border-l-2 border-orange-700 pl-3 font-serif text-sm leading-relaxed text-stone-800">
                    &ldquo;{best.text}&rdquo;
                    <div className="mt-1 font-sans text-[11px] not-italic text-stone-500">
                      {best.cleared ? 'cleared' : 'not cleared'} · {best.strength}
                      {best.timestamp ? ` · ${best.timestamp}` : ''}
                    </div>
                  </blockquote>
                )}
                <div className="mt-3 flex flex-wrap gap-1">
                  {vThemes.slice(0, 6).map((tid) => {
                    const t = VOICE_THEMES.find((x) => x.id === tid);
                    if (!t) return null;
                    return (
                      <span key={tid} className={`rounded-full px-2 py-0.5 text-[10px] ${DOMAIN_TONE[t.domain].chip}`}>
                        {t.label}
                      </span>
                    );
                  })}
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-medium text-orange-800">
                    Full analysis · {vq.length} quotes
                  </summary>
                  <div className="mt-2 space-y-4">
                    {v.transcripts.map((t) => (
                      <div key={t.transcriptId}>
                        <div className="text-xs font-semibold text-stone-700">
                          {t.title || 'Untitled recording'} · {t.wordCount.toLocaleString()}w
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-stone-600">{t.narrativeSummary}</p>
                        <ul className="mt-2 space-y-2">
                          {t.topQuotes.map((q, i) => (
                            <li key={i} className="text-xs leading-relaxed text-stone-700">
                              <span className="font-serif">&ldquo;{q.text}&rdquo;</span>
                              <span className="text-stone-400"> · {q.strength}{q.cleared ? ' · cleared' : ''}{q.sensitivity ? ` · ⚑ ${q.sensitivity}` : ''}</span>
                            </li>
                          ))}
                        </ul>
                        {t.analysisNotes && <p className="mt-2 text-[11px] italic text-stone-400">{t.analysisNotes}</p>}
                      </div>
                    ))}
                    <div className="text-[11px] text-stone-400">
                      EL consent flags: analysis {String(v.elConsent.aiAnalysisAllowed)} · privacy {v.elConsent.privacyLevel} ·{' '}
                      sensitivity {v.elConsent.culturalSensitivity}
                      {v.elConsent.requiresElderReview ? ' · requires Elder review' : ''}
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="max-w-3xl border-t border-stone-200 pt-4 text-xs text-stone-400">
        Claims discipline: quotes are transcript-verbatim (trims marked with ...). Health lines are the
        storyteller&rsquo;s own testimony; scabies to RHD stays the why, never a claimed outcome. Held voices
        never leave this page. Data: voice-impact-data.json, rebuilt via scripts/build-voice-impact-data.mjs.
      </footer>
    </div>
  );
}
