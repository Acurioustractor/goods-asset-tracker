// Storyteller Atlas: every voice in the canonical registry on one screen.
// Thematic header maps the six belief turns of the signed narrative
// (wiki/outputs/2026-07-11-narrative-foundation.md) to the voices that carry
// them, the communities those voices come from, and a grounding metric on a
// live page. Body is the full roster grouped by community, with consent tiers,
// all blessed AND held quotes (badged), and provenance labels.
//
// Data sources: v2/src/lib/data/storyteller-registry.ts (voices, quotes, tiers)
// and v2/src/lib/data/transcript-provenance.ts (transcript metadata only, keyed
// by registry name; no transcript text exists there or here). Canonical metrics
// imported from asset-canonical.ts, never hardcoded.

import type { Metadata } from 'next';
import Link from 'next/link';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import {
  STORYTELLER_REGISTRY,
  type StorytellerRecord,
} from '@/lib/data/storyteller-registry';
import {
  getProvenance,
  provenanceLabel,
  releaseStateLabel,
  PROVENANCE_ASOF,
  PROVENANCE_SOURCE,
  UNREGISTERED_TRANSCRIPTS,
} from '@/lib/data/transcript-provenance';
import AtlasClient, { type AtlasRecord } from './atlas-client';

export const metadata: Metadata = {
  title: 'Storyteller Atlas · Goods admin',
  robots: { index: false, follow: false },
};

const DISPLAY_FONT = { fontFamily: 'var(--font-display, Georgia, serif)' } as const;

// ── Community grouping ───────────────────────────────────────────────────────
// Registry `community` strings are free text ("Alice Springs / Utopia",
// "Arlparra (Utopia Homelands)"), so we bucket them into the atlas place
// groups. Utopia checks run before Alice Springs so the Oonchiumpa
// "Alice Springs / Utopia" records land with the Utopia group, matching the
// registry's own section grouping. No Maningrida voices exist in the registry
// today; the bucket renders only when it has voices.
const PLACE_ORDER = [
  'Tennant Creek',
  'Utopia / Arlparra',
  'Palm Island',
  'Alice Springs',
  'Kalgoorlie',
  'Maningrida',
  'Mount Isa',
  'Darwin',
  'Other',
] as const;

function placeFor(rec: StorytellerRecord): string {
  const c = rec.community.toLowerCase();
  if (c.includes('tennant')) return 'Tennant Creek';
  if (c.includes('utopia') || c.includes('arlparra') || c.includes('ampilatwatja'))
    return 'Utopia / Arlparra';
  if (c.includes('palm')) return 'Palm Island';
  if (c.includes('alice')) return 'Alice Springs';
  if (c.includes('kalgoorlie')) return 'Kalgoorlie';
  if (c.includes('maningrida')) return 'Maningrida';
  if (c.includes('mount isa')) return 'Mount Isa';
  if (c.includes('darwin')) return 'Darwin';
  return 'Other';
}

// ── Turn analysis ────────────────────────────────────────────────────────────
// The registry has no structured per-turn array; each record carries a
// free-text `turns` field ("3, 5 → scale", "strengthens 1, 5"). We count a
// voice as carrying turn N when the digit N appears anywhere in that string
// (core and "strengthens" mentions both count).
function turnNumbers(rec: StorytellerRecord): number[] {
  if (!rec.turns) return [];
  return Array.from(new Set((rec.turns.match(/[1-6]/g) ?? []).map(Number)));
}

interface TurnTheme {
  n: number;
  title: string;
  metricLabel: string;
  metricHref: string;
}

const nf = new Intl.NumberFormat('en-AU');

const TURN_THEMES: TurnTheme[] = [
  {
    n: 1,
    title: 'The need is real, people name it themselves',
    metricLabel: 'Cost story: the need',
    metricHref: '/cost-story',
  },
  {
    n: 2,
    title: 'The existing supply fails these places',
    metricLabel: 'Cost story: supply failure',
    metricHref: '/cost-story',
  },
  {
    n: 3,
    title: 'The products work because community designed them',
    metricLabel: `${nf.format(CANONICAL_ASSETS.bedsDeployed)} beds · ${nf.format(CANONICAL_ASSETS.washersInCommunity)} washers`,
    metricHref: '/register',
  },
  {
    n: 4,
    title: 'The making belongs in community hands',
    metricLabel: 'Utopia build, May 2026',
    metricHref: '/field-notes/utopia-may-2026',
  },
  {
    n: 5,
    title: 'The plant makes the pattern transferable; ownership is the promise',
    metricLabel: `${nf.format(CANONICAL_ASSETS.communitiesServed)} communities served`,
    metricHref: '/impact',
  },
  {
    n: 6,
    title: 'What the capital does',
    metricLabel: 'AU$400K ask',
    metricHref: '/pitch/deck',
  },
];

export default function StoryAtlasPage() {
  const records: AtlasRecord[] = STORYTELLER_REGISTRY.map((rec) => ({
    ...rec,
    place: placeFor(rec),
  }));

  const totalVoices = records.length;
  const externalCleared = records.filter((r) => r.tier === 'external').length;
  // Communities represented: distinct place buckets among community voices
  // (funder and internal records are not community voices). "Other" bucket
  // voices count by their raw community string (Katherine, NT-wide, East
  // Arnhem) so distinct places are not collapsed into one.
  const communityPlaces = new Set(
    records
      .filter((r) => r.tier !== 'funder' && r.tier !== 'internal')
      .map((r) => (r.place === 'Other' ? r.community : r.place)),
  );

  const turnCards = TURN_THEMES.map((theme) => {
    const voices = records.filter((r) => turnNumbers(r).includes(theme.n));
    const places = Array.from(
      new Set(voices.map((r) => (r.place === 'Other' ? r.community : r.place))),
    );
    return { ...theme, voiceCount: voices.length, places };
  });

  // Provenance summary over the whole roster (metadata only; grouping mirrors
  // provenanceGroup() in atlas-client.tsx, kept local because client-module
  // functions cannot be called from a server component).
  const provKinds = records.map((r) => getProvenance(r.name).kind);
  const transcriptBacked = provKinds.filter(
    (k) => k === 'el-transcript' || k === 'ben-provided-transcript',
  ).length;
  const tripNotes = provKinds.filter((k) => k === 'trip-notes').length;
  const curatedNoSource = provKinds.filter((k) => k === 'curated').length;

  const unregistered = Object.entries(UNREGISTERED_TRANSCRIPTS);

  return (
    <div className="space-y-8 p-6 pb-16">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl text-foreground" style={DISPLAY_FONT}>
            Storyteller Atlas
          </h1>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Every voice in the canonical registry on one screen: who they are, where they speak
            from, which belief turns they carry, and every blessed or held quote. Internal admin
            surface: holds are shown and clearly marked, never for external use.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">
            <span className="font-bold">{totalVoices}</span>&nbsp;voices
          </span>
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
            <span className="font-bold">{externalCleared}</span>&nbsp;external cleared
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">
            <span className="font-bold">{communityPlaces.size}</span>&nbsp;communities
          </span>
          <Link
            href="/admin/quote-cards"
            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-primary hover:underline"
          >
            Quote cards
          </Link>
          <Link
            href="/admin/el-storytellers"
            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-primary hover:underline"
          >
            EL storytellers
          </Link>
        </div>
      </header>

      <section aria-label="Provenance summary" className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
            <span className="font-bold">{transcriptBacked}</span>&nbsp;transcript-backed
          </span>
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-700">
            <span className="font-bold">{tripNotes}</span>&nbsp;trip notes
          </span>
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
            <span className="font-bold">{curatedNoSource}</span>&nbsp;curated, no primary source
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Provenance as of {PROVENANCE_ASOF}: {PROVENANCE_SOURCE}
        </p>
        {unregistered.length > 0 ? (
          <div className="max-w-md rounded-lg border border-border bg-card p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Not yet in the registry
            </p>
            {unregistered.map(([name, p]) => (
              <div key={name} className="mt-1.5">
                <p className="text-sm text-foreground" style={DISPLAY_FONT}>
                  {name}
                  <span className="ml-2 align-middle text-xs font-normal text-muted-foreground">
                    transcript on file, not yet in the registry
                  </span>
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {provenanceLabel(p)}
                  {p.recordingDates?.length ? `. Recorded ${p.recordingDates.join(' · ')}` : ''}
                  {p.releaseState ? `. EL: ${releaseStateLabel(p.releaseState)}` : ''}
                  {p.note ? `. ${p.note}` : ''}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section aria-labelledby="themes-heading">
        <h2 id="themes-heading" className="text-xl text-foreground" style={DISPLAY_FONT}>
          The themes
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The six belief turns of the signed narrative, with the voices and places that carry each
          one, grounded in a live number.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {turnCards.map((card) => (
            <div key={card.n} className="rounded-lg border border-border bg-card p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Turn {card.n}
              </p>
              <h3 className="mt-1 text-base leading-snug text-foreground" style={DISPLAY_FONT}>
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{card.voiceCount}</span>{' '}
                {card.voiceCount === 1 ? 'voice carries' : 'voices carry'} this turn
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {card.places.length > 0 ? (
                  card.places.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    No voice mapped to this turn yet
                  </span>
                )}
              </div>
              <div className="mt-3">
                <Link
                  href={card.metricHref}
                  className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-primary hover:underline"
                >
                  {card.metricLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Storyteller roster">
        <AtlasClient records={records} placeOrder={[...PLACE_ORDER]} />
      </section>
    </div>
  );
}
