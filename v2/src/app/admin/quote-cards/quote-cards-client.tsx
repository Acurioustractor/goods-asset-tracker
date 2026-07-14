'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote, Search, X } from 'lucide-react';
import {
  STORYTELLER_REGISTRY,
  type RegistryQuote,
  type StorytellerRecord,
} from '@/lib/data/storyteller-registry';

/* ── model helpers ──────────────────────────────────────────────────────── */

const TURN_LABEL: Record<number, string> = {
  1: 'The need',
  2: 'Supply fails',
  3: 'Product works',
  4: 'Making in community',
  5: 'Plant + ownership',
  6: 'The ask',
};

function parseTurns(turns?: string): number[] {
  if (!turns) return [];
  const found = new Set<number>();
  for (const m of turns.matchAll(/[1-6]/g)) found.add(Number(m[0]));
  return [...found].sort();
}

const TIER_STYLE: Record<string, { label: string; cls: string }> = {
  external: { label: 'cleared', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  website: { label: 'website only', cls: 'bg-sky-100 text-sky-800 border-sky-300' },
  funder: { label: 'funder', cls: 'bg-violet-100 text-violet-800 border-violet-300' },
  pending: { label: 'pending', cls: 'bg-amber-100 text-amber-900 border-amber-300' },
  hold: { label: 'HOLD', cls: 'bg-rose-100 text-rose-800 border-rose-300' },
  internal: { label: 'internal', cls: 'bg-zinc-200 text-zinc-700 border-zinc-300' },
};

function initials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
}

/** Consent-safe quote list for a person: drop `hold`-status quotes. */
function usableQuotes(record: StorytellerRecord): RegistryQuote[] {
  return record.quotes.filter((q) => q.status !== 'hold');
}

/* ── card ───────────────────────────────────────────────────────────────── */

function Card({
  record,
  onFocus,
  large = false,
}: {
  record: StorytellerRecord;
  onFocus?: () => void;
  large?: boolean;
}) {
  const quotes = usableQuotes(record);
  const [qi, setQi] = useState(0);
  const quote = quotes[qi] ?? null;
  const turns = parseTurns(record.turns);
  const tier = TIER_STYLE[record.tier] ?? TIER_STYLE.pending;

  const cycle = (delta: number) => {
    if (quotes.length < 2) return;
    setQi((v) => (v + delta + quotes.length) % quotes.length);
  };

  return (
    <div
      className={[
        'group relative overflow-hidden rounded-xl border border-border bg-zinc-900',
        large ? 'aspect-[4/5] w-full max-w-md' : 'aspect-[4/5] cursor-pointer',
      ].join(' ')}
      onClick={onFocus}
    >
      {/* portrait or placeholder */}
      {record.portrait ? (
        <Image
          src={record.portrait}
          alt={record.name}
          fill
          sizes={large ? '440px' : '(max-width: 640px) 50vw, 300px'}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900">
          <span className="text-5xl font-light text-white/40">{initials(record.name)}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

      {/* tier + practitioner badges */}
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tier.cls}`}>
          {tier.label}
        </span>
        {record.practitioner && (
          <span className="rounded-full border border-white/30 bg-black/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            practitioner
          </span>
        )}
      </div>

      {/* content */}
      <div className={['absolute inset-x-0 bottom-0', large ? 'p-6' : 'p-4'].join(' ')}>
        {quote ? (
          <p
            className={[
              'font-light leading-snug text-white',
              large ? 'text-2xl' : 'text-base',
            ].join(' ')}
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            <Quote className="mb-1 inline h-4 w-4 text-white/50" /> {quote.text}
          </p>
        ) : (
          <p className="text-sm italic text-white/50">No cleared quote on file.</p>
        )}

        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{record.name}</p>
            <p className="truncate text-xs text-white/60">{record.community}</p>
          </div>
          {turns.length > 0 && (
            <span className="flex-shrink-0 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-white">
              {turns.map((t) => `T${t}`).join(' · ')} {TURN_LABEL[turns[0]]}
            </span>
          )}
        </div>

        {quotes.length > 1 && (
          <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => cycle(-1)}
              aria-label="Previous quote"
              className="rounded-full bg-white/15 p-1 text-white hover:bg-white/30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] text-white/60">
              {qi + 1}/{quotes.length}
            </span>
            <button
              type="button"
              onClick={() => cycle(1)}
              aria-label="Next quote"
              className="rounded-full bg-white/15 p-1 text-white hover:bg-white/30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── root ───────────────────────────────────────────────────────────────── */

type SortKey = 'community' | 'turn' | 'name';

export function QuoteCardsClient() {
  const [query, setQuery] = useState('');
  const [community, setCommunity] = useState<string>('all');
  const [turn, setTurn] = useState<number | 'all'>('all');
  const [showHolds, setShowHolds] = useState(false);
  const [hidePractitioners, setHidePractitioners] = useState(false);
  const [portraitOnly, setPortraitOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('community');
  const [focus, setFocus] = useState<string | null>(null);

  const people = useMemo(
    () => STORYTELLER_REGISTRY.filter((r) => r.tier !== 'internal' && !r.narratedBy),
    [],
  );

  const communities = useMemo(
    () => Array.from(new Set(people.map((r) => r.community))).sort(),
    [people],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = people.filter((r) => {
      if (r.tier === 'hold' && !showHolds) return false;
      if (community !== 'all' && r.community !== community) return false;
      if (turn !== 'all' && !parseTurns(r.turns).includes(turn)) return false;
      if (hidePractitioners && r.practitioner) return false;
      if (portraitOnly && !r.portrait) return false;
      if (q && !r.name.toLowerCase().includes(q) && !r.community.toLowerCase().includes(q)) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'turn') return (parseTurns(a.turns)[0] ?? 9) - (parseTurns(b.turns)[0] ?? 9);
      return a.community.localeCompare(b.community) || a.name.localeCompare(b.name);
    });
    return rows;
  }, [people, query, community, turn, showHolds, hidePractitioners, portraitOnly, sortKey]);

  const focusRecord = focus ? people.find((r) => r.slug === focus) ?? null : null;

  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocus(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-4 py-6 md:px-8">
          <h1 className="text-2xl font-light text-foreground" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
            Quote cards
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Every storyteller as a portrait + quote thumbnail, straight from the registry. Filter by
            community, turn and consent tier; cycle a person&apos;s quotes; click a card to open a big,
            screenshot-ready version. <span className="font-medium text-foreground">Hold</span>-tier quotes
            are hidden by default.
          </p>

          {/* controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or place"
                className="w-48 rounded-md border border-border bg-background py-1.5 pl-8 pr-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>

            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"
            >
              <option value="all">All communities</option>
              {communities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={String(turn)}
              onChange={(e) => setTurn(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"
            >
              <option value="all">All turns</option>
              {[1, 2, 3, 4, 5, 6].map((t) => (
                <option key={t} value={t}>
                  T{t} · {TURN_LABEL[t]}
                </option>
              ))}
            </select>

            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground"
            >
              <option value="community">Sort: community</option>
              <option value="turn">Sort: turn</option>
              <option value="name">Sort: name</option>
            </select>

            <label className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground">
              <input type="checkbox" checked={portraitOnly} onChange={(e) => setPortraitOnly(e.target.checked)} />
              Has portrait
            </label>
            <label className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground">
              <input type="checkbox" checked={hidePractitioners} onChange={(e) => setHidePractitioners(e.target.checked)} />
              Hide practitioners
            </label>
            <label className="flex items-center gap-1.5 rounded-md border border-rose-300 bg-rose-50 px-2 py-1.5 text-sm text-rose-800">
              <input type="checkbox" checked={showHolds} onChange={(e) => setShowHolds(e.target.checked)} />
              Show holds (internal only)
            </label>

            <span className="ml-auto text-sm text-muted-foreground">{filtered.length} people</span>
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:px-8 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((record) => (
          <Card key={record.slug} record={record} onFocus={() => setFocus(record.slug)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="p-8 text-center text-sm text-muted-foreground">No storytellers match these filters.</p>
      )}

      {/* focus modal — screenshot-ready */}
      {focusRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setFocus(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Card record={focusRecord} large />
            <p className="mt-3 text-center text-xs text-white/60">
              Cycle quotes with the arrows, then screenshot this card. Press Esc or click outside to close.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFocus(null)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
