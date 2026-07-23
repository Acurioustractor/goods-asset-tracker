'use client';

// Storyteller Atlas roster grid: client-side filtering (tier, community, name
// search) over the server-rendered registry data. Internal admin surface, so
// hold-tier voices and hold-status quotes ARE shown, clearly badged.

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { StorytellerRecord, VoiceTier } from '@/lib/data/storyteller-registry';
import {
  getProvenance,
  provenanceLabel,
  releaseStateLabel,
  type ProvenanceKind,
} from '@/lib/data/transcript-provenance';

/** Registry record annotated server-side with its atlas place bucket. */
export type AtlasRecord = StorytellerRecord & { place: string };

// Provenance kind buckets for the filter. The provenance module is metadata
// only (counts, dates, release states); no transcript text exists in it and
// none is ever rendered here.
export type ProvenanceGroup = 'transcript-backed' | 'trip-notes' | 'curated' | 'other';

export function provenanceGroup(kind: ProvenanceKind): ProvenanceGroup {
  if (kind === 'el-transcript' || kind === 'ben-provided-transcript') return 'transcript-backed';
  if (kind === 'trip-notes') return 'trip-notes';
  if (kind === 'curated') return 'curated';
  return 'other';
}

const PROVENANCE_BADGE: Record<ProvenanceKind, string> = {
  'el-transcript': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'ben-provided-transcript': 'bg-green-50 text-green-700 border-green-200',
  'trip-notes': 'bg-sky-50 text-sky-700 border-sky-200',
  'funder-pack': 'bg-muted text-muted-foreground border-border',
  narrated: 'bg-muted text-muted-foreground border-border italic',
  'content-hardcoded': 'bg-amber-50 text-amber-800 border-amber-200',
  curated: 'bg-amber-50 text-amber-800 border-amber-200',
};

const PROVENANCE_FILTER_OPTIONS: Array<{ value: 'all' | ProvenanceGroup; label: string }> = [
  { value: 'all', label: 'All provenance' },
  { value: 'transcript-backed', label: 'Transcript-backed' },
  { value: 'trip-notes', label: 'Trip notes' },
  { value: 'curated', label: 'Curated, no primary source' },
  { value: 'other', label: 'Other (funder pack, hardcoded, narrated)' },
];

const DISPLAY_FONT = { fontFamily: 'var(--font-display, Georgia, serif)' } as const;

const TIER_BADGE: Record<VoiceTier, { label: string; cls: string }> = {
  external: { label: 'external cleared', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  website: { label: 'website only', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  funder: { label: 'funder only', cls: 'bg-accent/10 text-accent border-accent/20' },
  hold: { label: 'HOLD, never external', cls: 'bg-red-50 text-red-700 border-red-200' },
  pending: { label: 'pending confirmation', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  internal: { label: 'internal', cls: 'bg-muted text-muted-foreground border-border' },
};

const QUOTE_STATUS_BADGE: Record<'primary' | 'approved' | 'hold' | 'retired', { label: string; cls: string }> = {
  primary: { label: 'primary', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  approved: { label: 'approved', cls: 'bg-muted text-muted-foreground border-border' },
  hold: { label: 'HOLD', cls: 'bg-red-100 text-red-700 border-red-200' },
  retired: { label: 'RETIRED', cls: 'bg-zinc-200 text-zinc-600 border-zinc-300 line-through' },
};

const TIER_OPTIONS: Array<'all' | VoiceTier> = [
  'all',
  'external',
  'website',
  'funder',
  'hold',
  'pending',
  'internal',
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function StorytellerCard({ rec }: { rec: AtlasRecord }) {
  const tier = TIER_BADGE[rec.tier];
  const prov = getProvenance(rec.name);
  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        {rec.portrait ? (
          <Image
            src={rec.portrait}
            alt={rec.name}
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground"
            aria-hidden="true"
          >
            {initials(rec.name)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-lg leading-snug text-foreground" style={DISPLAY_FONT}>
            {rec.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{rec.role}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tier.cls}`}
            >
              {tier.label}
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
              {rec.community}
            </span>
            {rec.practitioner ? (
              <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                practitioner
              </span>
            ) : null}
            {rec.turns ? (
              <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground">
                turns: {rec.turns}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {rec.quotes.length > 0 ? (
        <ul className="mt-3 space-y-2.5">
          {rec.quotes.map((q, i) => {
            const status = QUOTE_STATUS_BADGE[q.status];
            return (
              <li key={i}>
                <blockquote className="border-l-2 border-border pl-3">
                  <p className="text-sm leading-relaxed text-foreground">"{q.text}"</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-1.5 py-px text-[10px] font-medium ${status.cls}`}
                    >
                      {status.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{q.context}</span>
                  </div>
                </blockquote>
              </li>
            );
          })}
        </ul>
      ) : rec.narratedBy ? (
        <p className="mt-3 text-xs text-muted-foreground">
          No direct quotes by design: story narrated by {rec.narratedBy}.
        </p>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">No quotes on record.</p>
      )}

      {/* Provenance from transcript-provenance.ts (keyed by registry name).
          Metadata only: kind, counts, dates, EL release state. Transcript text
          never enters this repo and is never rendered. */}
      <div className="mt-3 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${PROVENANCE_BADGE[prov.kind]}`}
          >
            {provenanceLabel(prov)}
          </span>
          {prov.inQuoteAnalysis ? (
            <span className="inline-flex items-center rounded-full border border-border bg-background px-1.5 py-px text-[10px] text-muted-foreground">
              in the 6-turn quote analysis (local)
            </span>
          ) : null}
        </div>
        {prov.recordingDates?.length || prov.releaseState || prov.note ? (
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {prov.recordingDates?.length ? (
              <span>Recorded {prov.recordingDates.join(' · ')}. </span>
            ) : null}
            {prov.releaseState ? <span>EL: {releaseStateLabel(prov.releaseState)}. </span> : null}
            {prov.note ? <span>{prov.note}</span> : null}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function AtlasClient({
  records,
  placeOrder,
}: {
  records: AtlasRecord[];
  placeOrder: string[];
}) {
  const [tier, setTier] = useState<'all' | VoiceTier>('all');
  const [place, setPlace] = useState<string>('all');
  const [prov, setProv] = useState<'all' | ProvenanceGroup>('all');
  const [search, setSearch] = useState('');

  const placesWithVoices = useMemo(
    () => placeOrder.filter((p) => records.some((r) => r.place === p)),
    [records, placeOrder],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (tier !== 'all' && r.tier !== tier) return false;
      if (place !== 'all' && r.place !== place) return false;
      if (prov !== 'all' && provenanceGroup(getProvenance(r.name).kind) !== prov) return false;
      if (q) {
        const hay = [r.name, ...(r.aliases ?? []), r.role, r.community]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, tier, place, prov, search]);

  const groups = useMemo(
    () =>
      placesWithVoices
        .map((p) => ({ place: p, voices: filtered.filter((r) => r.place === p) }))
        .filter((g) => g.voices.length > 0),
    [placesWithVoices, filtered],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, role, community"
          className="h-9 w-64 max-w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as 'all' | VoiceTier)}
          className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
          aria-label="Filter by consent tier"
        >
          {TIER_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All tiers' : t}
            </option>
          ))}
        </select>
        <select
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
          aria-label="Filter by community"
        >
          <option value="all">All communities</option>
          {placesWithVoices.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={prov}
          onChange={(e) => setProv(e.target.value as 'all' | ProvenanceGroup)}
          className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground"
          aria-label="Filter by transcript provenance"
        >
          {PROVENANCE_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {records.length} voices
        </span>
      </div>

      {groups.length === 0 ? (
        <p className="rounded border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No voices match the current filters.
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.place}>
            <h2
              className="mb-3 flex items-baseline gap-2 text-xl text-foreground"
              style={DISPLAY_FONT}
            >
              {group.place}
              <span className="text-sm text-muted-foreground">
                {group.voices.length} {group.voices.length === 1 ? 'voice' : 'voices'}
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {group.voices.map((rec) => (
                <StorytellerCard key={rec.slug} rec={rec} />
              ))}
            </div>
          </section>
        ))
      )}

      <p className="text-xs text-muted-foreground">
        Curate quote cards at{' '}
        <Link href="/admin/quote-cards" className="text-primary hover:underline">
          /admin/quote-cards
        </Link>{' '}
        and manage Empathy Ledger storytellers at{' '}
        <Link href="/admin/el-storytellers" className="text-primary hover:underline">
          /admin/el-storytellers
        </Link>
        .
      </p>
    </div>
  );
}
