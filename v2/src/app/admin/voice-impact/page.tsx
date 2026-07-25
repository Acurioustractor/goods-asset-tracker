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
import { StorytellerAvatar } from '@/components/storyteller-avatar';
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
  'jobs-ownership': { bar: 'bg-primary', chip: 'bg-primary/10 text-primary' },
  'circular-economy': { bar: 'bg-accent', chip: 'bg-accent/10 text-accent' },
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

// Voice location string -> communities.id (community pages + Atlas share these ids).
const COMMUNITY_MATCH: [RegExp, string, string][] = [
  [/tennant/i, 'tennant-creek', 'Tennant Creek'],
  [/utopia|arlparra|wenitong/i, 'utopia', 'Utopia Homelands'],
  [/alice/i, 'alice-springs', 'Alice Springs'],
  [/palm island/i, 'palm-island', 'Palm Island'],
  [/maningrida/i, 'maningrida', 'Maningrida'],
  [/kalgoorlie|goldfields/i, 'kalgoorlie', 'Kalgoorlie'],
  [/darwin/i, 'darwin', 'Darwin'],
  [/katherine/i, 'katherine', 'Katherine'],
  [/kununurra/i, 'kununurra', 'Kununurra'],
  [/mount isa|mt isa/i, 'mt-isa', 'Mt Isa'],
];
function communityFor(location: string | null, name: string): { id: string; label: string } | null {
  const hay = `${location ?? ''} ${name}`;
  for (const [re, id, label] of COMMUNITY_MATCH) if (re.test(hay)) return { id, label };
  return null;
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
        <h1 className="mt-1 font-display font-serif text-3xl text-foreground">The Voice Impact Model</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Every substantive Empathy Ledger transcript in the Goods project, deep-analysed and coded
          against the five outcome domains. The numbers on <Link href="/impact" className="underline">/impact</Link> prove
          scale; these voices prove meaning. Empathy Ledger philosophy applies throughout: the
          transcript is the storyteller&rsquo;s asset, analysis is authorised, external use of any line
          still needs its own clearing pass, and no voice is reduced to a metric.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{VOICE_IMPACT.analysisAuthority}</p>
      </header>

      {/* Stat strip */}
      <div className="flex flex-wrap gap-x-10 gap-y-3 border-y border-border py-4">
        {[
          [totals.voices, 'community voices'],
          [totals.transcripts, 'transcripts analysed'],
          [totals.words.toLocaleString(), 'words'],
          [totals.quotes, 'top quotes extracted'],
          [totals.deck, 'deck-grade'],
          [totals.cleared, 'cleared for external use'],
        ].map(([n, label]) => (
          <div key={String(label)}>
            <div className="font-serif text-2xl text-foreground">{n}</div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Portrait wall — every voice, at a glance */}
      <section>
        <h2 className="font-display font-serif text-xl text-foreground">Every voice</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {voices.map((v) => (
            <a key={v.name} href={`#voice-${v.name.replace(/[^a-zA-Z]+/g, '-')}`} className="group w-24 text-center">
              {true ? (
                <StorytellerAvatar
                  name={v.name}
                  src={v.portrait}
                  size={80}
                  className={`mx-auto ring-2 transition group-hover:ring-orange-600 ${v.held ? 'ring-red-300 grayscale' : v.staff ? 'ring-muted' : v.funder ? 'ring-primary/40' : 'ring-border'}`}
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted font-serif text-xl text-muted-foreground ring-2 ring-border group-hover:ring-orange-600">
                  {v.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                </div>
              )}
              <div className="mt-1.5 truncate text-[11px] font-medium text-foreground">{v.name}</div>
              <div className="text-[10px] text-muted-foreground">
                {v.transcriptCount}T · {(v.totalChars / 1000).toFixed(1)}k ch
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Domain coverage */}
      <section>
        <h2 className="font-display font-serif text-xl text-foreground">Voices by outcome domain</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Which of the five canonical domains the voices evidence, and how strongly.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {domains.map((d) => (
            <div key={d.domain} className="rounded-lg border border-border p-4">
              <div className="text-sm font-semibold text-foreground">{d.label}</div>
              <div className="mt-3 font-serif text-3xl text-foreground">{d.voices}</div>
              <div className="text-xs text-muted-foreground">voices · {d.quotes} quotes · {d.deckGrade} deck-grade</div>
              <div className="mt-3 h-1.5 w-full rounded bg-muted">
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
        <h2 className="font-display font-serif text-xl text-foreground">What the voices talk about</h2>
        <p className="mt-1 text-sm text-muted-foreground">Thematic coding across all transcripts, coloured by outcome domain.</p>
        <div className="mt-4 space-y-2">
          {themes
            .filter((t) => t.quotes > 0)
            .sort((a, b) => b.quotes - a.quotes)
            .map(({ theme, quotes: q, voices: v }) => (
              <div key={theme.id} className="flex items-center gap-3">
                <div className="w-56 shrink-0 text-right">
                  <span className="text-sm text-foreground">{theme.label}</span>
                </div>
                <div className="h-5 flex-1 rounded bg-muted">
                  <div
                    className={`flex h-5 items-center rounded pl-2 text-[11px] font-medium text-white ${DOMAIN_TONE[theme.domain].bar}`}
                    style={{ width: `${Math.max(7, (q / maxTheme) * 100)}%` }}
                  >
                    {q}
                  </div>
                </div>
                <div className="w-20 shrink-0 text-xs text-muted-foreground">{v} voices</div>
              </div>
            ))}
        </div>
      </section>

      {/* Voice cards */}
      <section>
        <h2 className="font-display font-serif text-xl text-foreground">The voices</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ordered by deck-grade material. Portraits from Empathy Ledger; photo counts from media_links.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {voices.map((v) => {
            const vq = v.transcripts.flatMap((t) => t.topQuotes);
            const best = vq.find((q) => q.strength === 'deck') ?? vq[0];
            const vThemes = [...new Set(v.transcripts.flatMap((t) => t.themesPresent.map((x) => x.theme)))];
            const photos = media.get(v.name) ?? 0;
            const community = communityFor(v.location, v.name);
            return (
              <div
                key={v.name}
                id={`voice-${v.name.replace(/[^a-zA-Z]+/g, '-')}`}
                className={`scroll-mt-6 rounded-lg border p-4 ${v.held ? 'border-red-200 bg-red-50/40' : 'border-border'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 text-center">
                    <StorytellerAvatar name={v.name} src={v.portrait} size={56} />
                    <div className="mt-1 text-[10px] font-medium leading-tight text-muted-foreground">
                      {v.transcriptCount}T
                      <br />
                      {(v.totalChars / 1000).toFixed(1)}k ch
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{v.name}</span>
                      {v.isElder && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">ELDER</span>}
                      {v.held && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">HELD · internal only</span>}
                      {v.staff && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">STAFF</span>}
                      {v.funder && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">FUNDER WITNESS</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {community ? (
                        <Link href={`/admin/communities/${community.id}`} className="text-orange-800 hover:underline">
                          {community.label}
                        </Link>
                      ) : (
                        v.location ?? 'location unrecorded'
                      )}{' '}
                      · {v.transcriptCount} transcript{v.transcriptCount > 1 ? 's' : ''} ·{' '}
                      {v.totalWords.toLocaleString()} words · {v.totalChars.toLocaleString()} characters
                      {photos > 0 ? ` · ${photos} linked photo${photos > 1 ? 's' : ''}` : ''}
                    </div>
                  </div>
                </div>
                {best && (
                  <blockquote className="mt-3 border-l-2 border-orange-700 pl-3 font-serif text-sm leading-relaxed text-foreground">
                    &ldquo;{best.text}&rdquo;
                    <div className="mt-1 font-sans text-[11px] not-italic text-muted-foreground">
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
                        <div className="text-xs font-semibold text-foreground">
                          {t.title || 'Untitled recording'} · {t.wordCount.toLocaleString()}w
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.narrativeSummary}</p>
                        <ul className="mt-2 space-y-2">
                          {t.topQuotes.map((q, i) => (
                            <li key={i} className="text-xs leading-relaxed text-foreground">
                              <span className="font-serif">&ldquo;{q.text}&rdquo;</span>
                              <span className="text-muted-foreground"> · {q.strength}{q.cleared ? ' · cleared' : ''}{q.sensitivity ? ` · ⚑ ${q.sensitivity}` : ''}</span>
                            </li>
                          ))}
                        </ul>
                        {t.analysisNotes && <p className="mt-2 text-[11px] italic text-muted-foreground">{t.analysisNotes}</p>}
                      </div>
                    ))}
                    <div className="text-[11px] text-muted-foreground">
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

      <footer className="max-w-3xl border-t border-border pt-4 text-xs text-muted-foreground">
        Claims discipline: quotes are transcript-verbatim (trims marked with ...). Health lines are the
        storyteller&rsquo;s own testimony; scabies to RHD stays the why, never a claimed outcome. Held voices
        never leave this page. Data: voice-impact-data.json, rebuilt via scripts/build-voice-impact-data.mjs.
      </footer>
    </div>
  );
}
