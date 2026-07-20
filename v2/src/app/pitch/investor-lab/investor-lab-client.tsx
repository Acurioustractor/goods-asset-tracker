'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  CheckCircle2,
  Circle,
  ClipboardList,
  Compass,
  ExternalLink,
  Factory,
  Image as ImageIcon,
  MapPinned,
  MessageSquareQuote,
  Replace,
  Route,
  UsersRound,
} from 'lucide-react';
import {
  investorLabSourceLinks,
  investorLabThesis,
  investorLabUpdated,
  investorLenses,
  labDecisions,
  narrativeRoutes,
  photoBanks,
  placeReviewQuestions,
} from '@/lib/data/investor-narrative-lab';
import { deckPhotoSlots, storytellerReview, type PhotoCandidate, type StorytellerReview } from '@/lib/data/pitch-photo-review';
import { placePathways, themeThreads } from '@/lib/data/pitch-workshop';

type LabView = 'spine' | 'investors' | 'places' | 'photos' | 'decisions';

const views: { id: LabView; label: string; icon: typeof Route }[] = [
  { id: 'spine', label: 'Narrative spine', icon: Route },
  { id: 'investors', label: 'Investor lens', icon: BadgeDollarSign },
  { id: 'places', label: 'Communities + maps', icon: MapPinned },
  { id: 'photos', label: 'Photo bank', icon: ImageIcon },
  { id: 'decisions', label: 'Deck decisions', icon: ClipboardList },
];

const voiceNames = new Set([
  'Dianne Stokes',
  'Mykel',
  'Fred Campbell',
  'Xavier',
  'Kristy Bloomfield',
  'Karen Liddle',
  'Katrina Bloomfield',
  'Dorrie Jones',
  'Ivy',
  'Alfred Johnson',
  'Norman Frank',
  'Linda Turner',
  'Patricia Frank',
  'Carmelita & Colette',
  'Jason',
]);

function isExternal(href: string) {
  return href.startsWith('http');
}

function SmallPill({ children, tone = 'sage' }: { children: React.ReactNode; tone?: 'sage' | 'clay' | 'ink' }) {
  const toneClass = {
    sage: 'border-[#b7c7bd] bg-[#ecf2ed] text-[#24423f]',
    clay: 'border-[#ddb5a2] bg-[#f7e8df] text-[#8f3f27]',
    ink: 'border-[#2f4a46]/20 bg-[#2f4a46] text-white',
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold ${toneClass}`}>
      {children}
    </span>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed text-[#4f5f59]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2f6f59]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PhotoTile({ photo, priority = false }: { photo: PhotoCandidate; priority?: boolean }) {
  const contain = photo.src.includes('map') || photo.src.includes('oonchiumpa');

  return (
    <figure className="overflow-hidden rounded-md border border-[#d6ddd4] bg-white shadow-sm shadow-[#18211d]/5">
      <div className="relative aspect-[4/3] bg-[#e7ece8]">
        <Image
          src={photo.src}
          alt={photo.label}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 330px"
          className={contain ? 'object-contain p-4' : 'object-cover'}
        />
      </div>
      <figcaption className="border-t border-[#d6ddd4] p-3">
        <p className="text-sm font-semibold leading-snug text-[#1f2623]">{photo.label}</p>
        {photo.note && <p className="mt-2 text-xs leading-relaxed text-[#65756f]">{photo.note}</p>}
        {photo.tags && (
          <div className="mt-2 flex flex-wrap gap-1">
            {photo.tags.map((tag) => (
              <SmallPill key={tag}>{tag}</SmallPill>
            ))}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

function VoiceCard({ person }: { person: StorytellerReview }) {
  return (
    <article className="rounded-md border border-[#d6ddd4] bg-white p-4 shadow-sm shadow-[#18211d]/5">
      <div className="flex gap-3">
        {person.photo ? (
          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-[#e7ece8]">
            <Image src={person.photo} alt={person.name} fill sizes="56px" className="object-cover" />
          </div>
        ) : (
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-[#c2ccc5] bg-[#edf1ed] text-[#6f7e77]">
            <UsersRound className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#1f2623]">{person.name}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#65756f]">{person.location}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#7a8a83]">{person.role}</p>
        </div>
      </div>
      {person.quote && <p className="mt-3 text-sm leading-relaxed text-[#35423d]">&quot;{person.quote}&quot;</p>}
      <div className="mt-3 flex flex-wrap gap-1">
        {person.themes.slice(0, 3).map((theme) => (
          <SmallPill key={theme}>{theme}</SmallPill>
        ))}
      </div>
    </article>
  );
}

function SourceLinks() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {investorLabSourceLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          target={isExternal(link.href) ? '_blank' : undefined}
          rel={isExternal(link.href) ? 'noreferrer' : undefined}
          className="rounded-md border border-white/15 bg-white/8 p-4 text-white transition-colors hover:bg-white/12"
        >
          <span className="flex items-center justify-between gap-3 text-sm font-semibold">
            {link.label}
            <ExternalLink className="h-4 w-4 text-white/60" />
          </span>
          <span className="mt-2 block text-xs leading-relaxed text-white/65">{link.note}</span>
        </Link>
      ))}
    </div>
  );
}

export function InvestorLabClient() {
  const [view, setView] = useState<LabView>('spine');
  const [routeId, setRouteId] = useState(narrativeRoutes[0]?.id ?? '');
  const [lensId, setLensId] = useState(investorLenses[0]?.id ?? '');
  const [placeId, setPlaceId] = useState(placePathways[0]?.id ?? '');
  const [photoBankId, setPhotoBankId] = useState(photoBanks[0]?.id ?? '');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const route = useMemo(
    () => narrativeRoutes.find((item) => item.id === routeId) ?? narrativeRoutes[0],
    [routeId],
  );
  const lens = useMemo(
    () => investorLenses.find((item) => item.id === lensId) ?? investorLenses[0],
    [lensId],
  );
  const place = useMemo(
    () => placePathways.find((item) => item.id === placeId) ?? placePathways[0],
    [placeId],
  );
  const photoBank = useMemo(
    () => photoBanks.find((item) => item.id === photoBankId) ?? photoBanks[0],
    [photoBankId],
  );
  const featuredVoices = useMemo(
    () => storytellerReview.filter((person) => voiceNames.has(person.name)),
    [],
  );
  const completedCount = Object.values(checked).filter(Boolean).length;
  const routeFit = lens?.routeBias.includes(route?.id ?? '') ?? false;
  const photoCount = photoBanks.reduce((sum, bank) => sum + bank.photos.length, 0);

  function toggleDecision(id: string) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <main className="min-h-screen bg-[#f5f3ea] text-[#1f2623]">
      <section className="border-b border-[#203833] bg-[#243d3a] text-white">
        <div className="mx-auto max-w-[1560px] px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Link
              href="/pitch"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Pitch
            </Link>
            <Link
              href="/pitch/workshop"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              Workshop
            </Link>
            <Link
              href="/pitch/photo-review"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              Photo review
            </Link>
            <Link
              href="/pitch/miro-board"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              Miro board
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#e09b6f]">
                <Compass className="h-4 w-4" />
                Investor narrative lab
              </p>
              <h1
                className="max-w-5xl text-4xl font-light leading-tight md:text-6xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Brainstorm the pitch through story, place, proof, and investor belief.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
                {investorLabThesis.answer}
              </p>
            </div>

            <div className="rounded-md border border-white/15 bg-white/8 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">{investorLabThesis.question}</p>
              <p className="mt-3 text-xl leading-relaxed text-white">{investorLabThesis.deckStance}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-white/10 bg-white/8 p-3">
                  <p className="text-2xl font-semibold">{narrativeRoutes.length}</p>
                  <p className="mt-1 text-xs text-white/55">story routes</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/8 p-3">
                  <p className="text-2xl font-semibold">{investorLenses.length}</p>
                  <p className="mt-1 text-xs text-white/55">investor lenses</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/8 p-3">
                  <p className="text-2xl font-semibold">{photoCount}</p>
                  <p className="mt-1 text-xs text-white/55">photo candidates</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/8 p-3">
                  <p className="text-2xl font-semibold">{deckPhotoSlots.length}</p>
                  <p className="mt-1 text-xs text-white/55">deck photo jobs</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-white/45">Updated {investorLabUpdated}</p>
            </div>
          </div>

          <div className="mt-8">
            <SourceLinks />
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-[#d6ddd4] bg-[#fdfcf7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1560px] gap-2 overflow-x-auto px-4 py-3 md:px-6">
          {views.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={[
                  'inline-flex flex-shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'border-[#24423f] bg-[#24423f] text-white'
                    : 'border-[#d6ddd4] bg-white text-[#5a6963] hover:border-[#24423f]/40 hover:text-[#1f2623]',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-b border-[#d6ddd4] bg-[#edf2ed]">
        <div className="mx-auto grid max-w-[1560px] gap-4 px-4 py-5 md:grid-cols-3 md:px-6">
          <div className="rounded-md border border-[#cdd8d0] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a8a83]">Route</p>
            <p className="mt-2 text-lg font-semibold text-[#1f2623]">{route?.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#65756f]">{route?.openingLine}</p>
          </div>
          <div className="rounded-md border border-[#cdd8d0] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a8a83]">Investor</p>
            <p className="mt-2 text-lg font-semibold text-[#1f2623]">{lens?.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#65756f]">
              {routeFit ? 'Strong route fit for this investor.' : 'Possible fit, but the proof order needs more care.'}
            </p>
          </div>
          <div className="rounded-md border border-[#cdd8d0] bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a8a83]">Place proof</p>
            <p className="mt-2 text-lg font-semibold text-[#1f2623]">{place?.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#65756f]">{place?.role}</p>
          </div>
        </div>
      </section>

      {view === 'spine' && route && (
        <section className="py-8 md:py-10">
          <div className="mx-auto grid max-w-[1560px] gap-6 px-4 md:px-6 lg:grid-cols-[320px_1fr]">
            <nav className="space-y-2 lg:sticky lg:top-24 lg:self-start">
              {narrativeRoutes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRouteId(item.id)}
                  className={[
                    'block w-full rounded-md border p-4 text-left transition-colors',
                    route.id === item.id
                      ? 'border-[#24423f] bg-[#24423f] text-white'
                      : 'border-[#d6ddd4] bg-white text-[#4f5f59] hover:border-[#24423f]/40',
                  ].join(' ')}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{item.shortLabel}</span>
                  <span className="mt-2 block text-base font-semibold">{item.label}</span>
                  <span className="mt-2 block text-sm leading-relaxed opacity-75">{item.openingLine}</span>
                </button>
              ))}
            </nav>

            <div className="space-y-6">
              <section className="rounded-md border border-[#d6ddd4] bg-white p-5 md:p-7">
                <div className="flex flex-wrap gap-2">
                  {route.investorFit.map((fit) => (
                    <SmallPill key={fit} tone="clay">{fit}</SmallPill>
                  ))}
                </div>
                <h2
                  className="mt-4 max-w-4xl text-3xl font-light leading-tight md:text-5xl"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  {route.openingLine}
                </h2>
                <p className="mt-5 max-w-4xl text-base leading-relaxed text-[#4f5f59]">{route.belief}</p>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-[#65756f]">{route.whenItWorks}</p>
              </section>

              <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                <section className="rounded-md border border-[#d6ddd4] bg-white p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1f2623]">
                    <MessageSquareQuote className="h-5 w-5 text-[#a64f35]" />
                    Proof the route needs
                  </h3>
                  <div className="mt-4">
                    <CheckList items={route.proof} />
                  </div>
                </section>
                <section className="rounded-md border border-[#d6ddd4] bg-white p-5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1f2623]">
                    <ArrowRight className="h-5 w-5 text-[#2f6f59]" />
                    Deck moves
                  </h3>
                  <div className="mt-4">
                    <CheckList items={route.deckMoves} />
                  </div>
                </section>
              </div>

              <section className="rounded-md border border-[#d6ddd4] bg-[#fffaf2] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8f3f27]">Watch point</h3>
                <p className="mt-2 max-w-4xl text-sm leading-relaxed text-[#4f3b31]">{route.watchOut}</p>
              </section>

              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-[#1f2623]">Best photo set for this route</h3>
                  <SmallPill tone="ink">{route.photos.length} images</SmallPill>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {route.photos.map((photo, index) => (
                    <PhotoTile key={`${route.id}-${photo.src}`} photo={photo} priority={index === 0} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      )}

      {view === 'investors' && lens && (
        <section className="py-8 md:py-10">
          <div className="mx-auto max-w-[1560px] space-y-6 px-4 md:px-6">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {investorLenses.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLensId(item.id)}
                  className={[
                    'rounded-md border p-4 text-left transition-colors',
                    lens.id === item.id
                      ? 'border-[#24423f] bg-[#24423f] text-white'
                      : 'border-[#d6ddd4] bg-white text-[#4f5f59] hover:border-[#24423f]/40',
                  ].join(' ')}
                >
                  <span className="text-base font-semibold">{item.label}</span>
                  <span className="mt-2 block text-xs leading-relaxed opacity-75">{item.question}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <section className="rounded-md border border-[#d6ddd4] bg-white p-5 md:p-7">
                <p className="text-sm uppercase tracking-[0.18em] text-[#a64f35]">{lens.label}</p>
                <h2
                  className="mt-3 max-w-4xl text-3xl font-light leading-tight md:text-5xl"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  {lens.question}
                </h2>
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="text-base font-semibold text-[#1f2623]">What they need to see</h3>
                    <div className="mt-4">
                      <CheckList items={lens.wantsToSee} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#1f2623]">Proof to put forward</h3>
                    <div className="mt-4">
                      <CheckList items={lens.proofToShow} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-md border border-[#d6ddd4] bg-[#edf2ed] p-5 md:p-7">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#24423f]">Ask language</h3>
                <p className="mt-3 text-xl leading-relaxed text-[#1f2623]">{lens.askLanguage}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {lens.routeBias.map((id) => {
                    const match = narrativeRoutes.find((item) => item.id === id);
                    return match ? (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setRouteId(id);
                          setView('spine');
                        }}
                        className="inline-flex items-center gap-2 rounded-md border border-[#b7c7bd] bg-white px-3 py-2 text-sm font-semibold text-[#24423f] transition-colors hover:border-[#24423f]"
                      >
                        {match.label}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : null;
                  })}
                </div>
                <div className="mt-5 rounded-md border border-[#ddb5a2] bg-[#fffaf2] p-4">
                  <p className="text-sm font-semibold text-[#8f3f27]">Watch point</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#4f3b31]">{lens.watchOut}</p>
                </div>
              </section>
            </div>
          </div>
        </section>
      )}

      {view === 'places' && place && (
        <section className="py-8 md:py-10">
          <div className="mx-auto max-w-[1560px] space-y-6 px-4 md:px-6">
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <section className="overflow-hidden rounded-md border border-[#d6ddd4] bg-white">
                <div className="relative aspect-[16/10] bg-[#e7ece8]">
                  <Image
                    src="/images/stories/utopia/region-map.png"
                    alt="Utopia Homelands region map"
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 720px"
                    className="object-contain p-4"
                  />
                </div>
                <div className="border-t border-[#d6ddd4] p-5">
                  <h2 className="text-lg font-semibold text-[#1f2623]">Map the proof before the scale claim</h2>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {placeReviewQuestions.map((question) => (
                      <div key={question} className="flex gap-2 text-sm leading-relaxed text-[#4f5f59]">
                        <Circle className="mt-1 h-3 w-3 flex-shrink-0 text-[#a64f35]" />
                        <span>{question}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {placePathways.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPlaceId(item.id)}
                      className={[
                        'rounded-md border p-4 text-left transition-colors',
                        place.id === item.id
                          ? 'border-[#24423f] bg-[#24423f] text-white'
                          : 'border-[#d6ddd4] bg-white text-[#4f5f59] hover:border-[#24423f]/40',
                      ].join(' ')}
                    >
                      <span className="text-base font-semibold">{item.name}</span>
                      <span className="mt-2 block text-xs leading-relaxed opacity-75">{item.role}</span>
                    </button>
                  ))}
                </div>

                <div className="rounded-md border border-[#d6ddd4] bg-white p-5">
                  <h2
                    className="text-3xl font-light leading-tight text-[#1f2623]"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    {place.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#4f5f59]">{place.proofNow}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#4f5f59]">{place.nextMove}</p>
                  <div className="mt-5">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a8a83]">
                      Community knowledge to carry
                    </h3>
                    <div className="mt-4">
                      <CheckList items={place.communityKnowledge} />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-[#1f2623]">Photos and voices for {place.name}</h3>
                <SmallPill tone="ink">{place.photos.length} place images</SmallPill>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {place.photos.map((photo) => (
                  <PhotoTile key={`${place.id}-${photo.src}`} photo={photo} />
                ))}
                {place.voices.map((voice) => (
                  <article key={`${place.id}-${voice.name}`} className="rounded-md border border-[#d6ddd4] bg-white p-4">
                    <MessageSquareQuote className="h-5 w-5 text-[#a64f35]" />
                    <p className="mt-3 text-sm leading-relaxed text-[#35423d]">&quot;{voice.line}&quot;</p>
                    <p className="mt-3 text-sm font-semibold text-[#1f2623]">{voice.name}</p>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-[#1f2623]">Voice wall for deck testing</h3>
                <Link
                  href="/pitch/photo-review#storytellers"
                  className="inline-flex items-center gap-2 rounded-md border border-[#d6ddd4] bg-white px-3 py-2 text-sm font-semibold text-[#24423f] transition-colors hover:border-[#24423f]"
                >
                  Full photo review
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {featuredVoices.map((person) => (
                  <VoiceCard key={person.name} person={person} />
                ))}
              </div>
            </section>
          </div>
        </section>
      )}

      {view === 'photos' && photoBank && (
        <section className="py-8 md:py-10">
          <div className="mx-auto grid max-w-[1560px] gap-6 px-4 md:px-6 lg:grid-cols-[300px_1fr]">
            <nav className="space-y-2 lg:sticky lg:top-24 lg:self-start">
              {photoBanks.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setPhotoBankId(bank.id)}
                  className={[
                    'block w-full rounded-md border p-4 text-left transition-colors',
                    photoBank.id === bank.id
                      ? 'border-[#24423f] bg-[#24423f] text-white'
                      : 'border-[#d6ddd4] bg-white text-[#4f5f59] hover:border-[#24423f]/40',
                  ].join(' ')}
                >
                  <span className="text-base font-semibold">{bank.label}</span>
                  <span className="mt-2 block text-xs leading-relaxed opacity-75">{bank.role}</span>
                </button>
              ))}
            </nav>

            <div className="space-y-6">
              <section className="rounded-md border border-[#d6ddd4] bg-white p-5 md:p-7">
                <p className="text-sm uppercase tracking-[0.18em] text-[#a64f35]">{photoBank.label}</p>
                <h2
                  className="mt-3 text-3xl font-light leading-tight md:text-5xl"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  {photoBank.role}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#4f5f59]">{photoBank.bestFor}</p>
              </section>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {photoBank.photos.map((photo, index) => (
                  <PhotoTile key={`${photoBank.id}-${photo.src}`} photo={photo} priority={index === 0} />
                ))}
              </div>

              <section className="rounded-md border border-[#d6ddd4] bg-[#edf2ed] p-5">
                <h3 className="text-lg font-semibold text-[#1f2623]">Themes the photo set should carry</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {themeThreads.map((thread) => (
                    <article key={thread.id} className="rounded-md border border-[#cdd8d0] bg-white p-4">
                      <p className="text-sm font-semibold text-[#1f2623]">{thread.theme}</p>
                      <p className="mt-2 text-xs leading-relaxed text-[#65756f]">{thread.whatCommunityIsSaying}</p>
                      <p className="mt-3 text-xs leading-relaxed text-[#35423d]">&quot;{thread.bestQuote}&quot;</p>
                      <p className="mt-2 text-[11px] font-semibold text-[#7a8a83]">{thread.quoteBy}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      )}

      {view === 'decisions' && route && lens && place && (
        <section className="py-8 md:py-10">
          <div className="mx-auto grid max-w-[1560px] gap-6 px-4 md:px-6 xl:grid-cols-[1fr_0.85fr]">
            <section className="rounded-md border border-[#d6ddd4] bg-white p-5 md:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#a64f35]">Decision queue</p>
                  <h2
                    className="mt-3 text-3xl font-light leading-tight md:text-5xl"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    Turn the brainstorm into deck choices.
                  </h2>
                </div>
                <SmallPill tone="ink">
                  {completedCount} of {labDecisions.length} marked
                </SmallPill>
              </div>

              <div className="mt-6 space-y-3">
                {labDecisions.map((decision) => {
                  const done = Boolean(checked[decision.id]);
                  return (
                    <button
                      key={decision.id}
                      type="button"
                      onClick={() => toggleDecision(decision.id)}
                      className={[
                        'block w-full rounded-md border p-4 text-left transition-colors',
                        done
                          ? 'border-[#2f6f59] bg-[#ecf2ed]'
                          : 'border-[#d6ddd4] bg-[#fdfcf7] hover:border-[#24423f]/40',
                      ].join(' ')}
                    >
                      <span className="flex items-start gap-3">
                        {done ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2f6f59]" />
                        ) : (
                          <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#7a8a83]" />
                        )}
                        <span>
                          <span className="block text-base font-semibold text-[#1f2623]">{decision.label}</span>
                          <span className="mt-2 block text-sm leading-relaxed text-[#4f5f59]">
                            Current answer: {decision.defaultAnswer}
                          </span>
                          <span className="mt-2 block text-xs leading-relaxed text-[#65756f]">
                            Evidence: {decision.evidenceNeeded}
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-[#65756f]">
                            Deck output: {decision.deckOutput}
                          </span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
              <section className="rounded-md border border-[#d6ddd4] bg-[#243d3a] p-5 text-white">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Replace className="h-5 w-5 text-[#e09b6f]" />
                  Working deck stance
                </h3>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/75">
                  <p>
                    Lead route: <strong className="text-white">{route.label}</strong>
                  </p>
                  <p>
                    Investor lens: <strong className="text-white">{lens.label}</strong>
                  </p>
                  <p>
                    Place proof: <strong className="text-white">{place.name}</strong>
                  </p>
                  <p>{investorLabThesis.deckStance}</p>
                </div>
              </section>

              <section className="rounded-md border border-[#d6ddd4] bg-white p-5">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1f2623]">
                  <Factory className="h-5 w-5 text-[#2f6f59]" />
                  Next slide edits
                </h3>
                <div className="mt-4">
                  <CheckList
                    items={[
                      'Replace the deck cover with the selected opening image.',
                      'Add one Oonchiumpa proof slide before the plant model.',
                      'Keep the ask tied to the next 90 to 180 days.',
                      'Move board, entity, and consent checks into a short appendix until final.',
                    ]}
                  />
                </div>
              </section>

              <section className="rounded-md border border-[#d6ddd4] bg-white p-5">
                <h3 className="text-lg font-semibold text-[#1f2623]">Fast path back into the deck</h3>
                <div className="mt-4 grid gap-2">
                  <Link
                    href="https://docs.google.com/presentation/d/1ClOU09dQVs_m_SvGcqAY3FeZnPWqBL0ZPxjdKqV1M8c/edit"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between rounded-md border border-[#d6ddd4] px-3 py-2 text-sm font-semibold text-[#24423f] transition-colors hover:border-[#24423f]"
                  >
                    Main Google Slides deck
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/pitch/photo-review"
                    className="inline-flex items-center justify-between rounded-md border border-[#d6ddd4] px-3 py-2 text-sm font-semibold text-[#24423f] transition-colors hover:border-[#24423f]"
                  >
                    Photo review board
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/admin/media-library"
                    className="inline-flex items-center justify-between rounded-md border border-[#d6ddd4] px-3 py-2 text-sm font-semibold text-[#24423f] transition-colors hover:border-[#24423f]"
                  >
                    Live media library
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}
