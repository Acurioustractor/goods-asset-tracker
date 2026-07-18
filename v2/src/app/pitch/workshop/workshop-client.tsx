'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  BedDouble,
  CheckCircle2,
  Compass,
  ExternalLink,
  Factory,
  Images,
  MapPinned,
  MessageSquareQuote,
  Route,
} from 'lucide-react';
import {
  deckRun,
  messageLenses,
  pitchSections,
  placePathways,
  themeThreads,
  workshopThesis,
  workshopUpdated,
} from '@/lib/data/pitch-workshop';
import type { PhotoCandidate } from '@/lib/data/pitch-photo-review';

type ViewMode = 'document' | 'message' | 'themes' | 'places' | 'deck';

const modes: { id: ViewMode; label: string; icon: typeof Route }[] = [
  { id: 'document', label: 'Full pitch', icon: Route },
  { id: 'message', label: 'Message', icon: MessageSquareQuote },
  { id: 'themes', label: 'Photos + quotes', icon: Images },
  { id: 'places', label: 'Places', icon: MapPinned },
  { id: 'deck', label: 'Deck run', icon: BedDouble },
];

function PhotoTile({ photo, priority = false }: { photo: PhotoCandidate; priority?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-md border border-border bg-card">
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={photo.src}
          alt={photo.label}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 260px"
          className="object-cover"
        />
      </div>
      <figcaption className="border-t border-border p-3">
        <p className="text-sm font-semibold text-foreground">{photo.label}</p>
        <code className="mt-2 block break-all text-[10px] leading-relaxed text-muted-foreground">{photo.src}</code>
      </figcaption>
    </figure>
  );
}

function CheckLine({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
      <span>{children}</span>
    </li>
  );
}

export function PitchWorkshopClient() {
  const [mode, setMode] = useState<ViewMode>('document');
  const [sectionId, setSectionId] = useState(pitchSections[0]?.id ?? '');
  const [lensId, setLensId] = useState(messageLenses[0]?.id ?? '');
  const [placeId, setPlaceId] = useState(placePathways[0]?.id ?? '');

  const section = useMemo(
    () => pitchSections.find((item) => item.id === sectionId) ?? pitchSections[0],
    [sectionId],
  );
  const lens = useMemo(
    () => messageLenses.find((item) => item.id === lensId) ?? messageLenses[0],
    [lensId],
  );
  const place = useMemo(
    () => placePathways.find((item) => item.id === placeId) ?? placePathways[0],
    [placeId],
  );

  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border bg-foreground text-background">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Link
              href="/pitch"
              className="inline-flex items-center gap-2 rounded-md border border-background/15 px-3 py-2 text-sm text-background/70 transition-colors hover:bg-background/10 hover:text-background"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to pitch
            </Link>
            <Link
              href="/pitch/investor-lab"
              className="inline-flex items-center gap-2 rounded-md border border-background/15 px-3 py-2 text-sm text-background/70 transition-colors hover:bg-background/10 hover:text-background"
            >
              Investor lab
              <Compass className="h-4 w-4" />
            </Link>
            <Link
              href="/pitch/community-narrative"
              className="inline-flex items-center gap-2 rounded-md border border-background/15 px-3 py-2 text-sm text-background/70 transition-colors hover:bg-background/10 hover:text-background"
            >
              Community narrative
              <ExternalLink className="h-4 w-4" />
            </Link>
            <Link
              href="/pitch/photo-review"
              className="inline-flex items-center gap-2 rounded-md border border-background/15 px-3 py-2 text-sm text-background/70 transition-colors hover:bg-background/10 hover:text-background"
            >
              Photo review
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest text-primary">Pitch workshop</p>
              <h1
                className="max-w-5xl text-4xl font-light leading-tight md:text-6xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Build the pitch around community knowledge, proof, and the path to ownership.
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-background/70 md:text-lg">
                {workshopThesis.line}
              </p>
            </div>

            <div className="rounded-md border border-background/15 bg-background/5 p-5">
              <p className="text-xs uppercase tracking-widest text-background/45">Best current thesis</p>
              <p className="mt-3 text-lg leading-relaxed text-background">{workshopThesis.reason}</p>
              <p className="mt-4 text-sm leading-relaxed text-background/65">{workshopThesis.proof}</p>
              <p className="mt-5 text-xs text-background/40">Updated {workshopUpdated}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto flex gap-2 overflow-x-auto px-4 py-3">
          {modes.map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={[
                  'inline-flex flex-shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      {mode === 'document' && section && (
        <section className="py-10">
          <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[260px_1fr]">
            <nav className="space-y-2 lg:sticky lg:top-20 lg:self-start">
              {pitchSections.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSectionId(item.id)}
                  className={[
                    'block w-full rounded-md border px-4 py-3 text-left transition-colors',
                    section.id === item.id
                      ? 'border-primary bg-card text-foreground'
                      : 'border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  ].join(' ')}
                >
                  <span className="text-xs uppercase tracking-widest">{item.navLabel}</span>
                  <span className="mt-1 block text-sm font-semibold">{item.question}</span>
                </button>
              ))}
            </nav>

            <article className="space-y-6">
              <div className="rounded-md border border-border bg-card p-5 md:p-7">
                <p className="text-sm uppercase tracking-widest text-accent">{section.question}</p>
                <h2
                  className="mt-3 max-w-4xl text-3xl font-light leading-tight md:text-5xl"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  {section.headline}
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                <div className="rounded-md border border-border bg-card p-5">
                  <h3 className="text-lg font-semibold">Message moves</h3>
                  <ul className="mt-4 space-y-3">
                    {section.messages.map((item) => (
                      <CheckLine key={item}>{item}</CheckLine>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md border border-border bg-card p-5">
                  <h3 className="text-lg font-semibold">Proof to carry</h3>
                  <ul className="mt-4 space-y-3">
                    {section.proof.map((item) => (
                      <CheckLine key={item}>{item}</CheckLine>
                    ))}
                  </ul>
                </div>
              </div>

              {section.quote && (
                <blockquote className="rounded-md border border-primary/20 bg-primary/10 p-5">
                  <p className="text-xl leading-relaxed text-foreground">&quot;{section.quote.text}&quot;</p>
                  <footer className="mt-3 text-sm font-semibold text-muted-foreground">{section.quote.by}</footer>
                </blockquote>
              )}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {section.photos.map((photo, index) => (
                  <PhotoTile key={photo.src} photo={photo} priority={index === 0} />
                ))}
              </div>

              <div className="rounded-md border border-border bg-muted/40 p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Decision for the deck</p>
                <p className="mt-2 text-base leading-relaxed text-foreground">{section.decision}</p>
              </div>
            </article>
          </div>
        </section>
      )}

      {mode === 'message' && lens && (
        <section className="py-10">
          <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[320px_1fr]">
            <div className="space-y-2">
              {messageLenses.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLensId(item.id)}
                  className={[
                    'block w-full rounded-md border px-4 py-3 text-left transition-colors',
                    lens.id === item.id
                      ? 'border-primary bg-card text-foreground'
                      : 'border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  ].join(' ')}
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <div className="rounded-md border border-border bg-card p-6">
                <p className="text-sm uppercase tracking-widest text-accent">{lens.label}</p>
                <h2
                  className="mt-3 text-3xl font-light leading-tight md:text-5xl"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  {lens.line}
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-md border border-border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Use when</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{lens.whenToUse}</p>
                  </div>
                  <div className="rounded-md border border-border bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Watch out</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{lens.watchOut}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-border bg-card p-5">
                <h3 className="text-lg font-semibold">Deck shape</h3>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {lens.deckShape.map((item, index) => (
                    <div key={item} className="rounded-md border border-border bg-background p-4">
                      <span className="text-xs font-semibold text-primary">{String(index + 1).padStart(2, '0')}</span>
                      <p className="mt-2 text-sm leading-relaxed text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {mode === 'themes' && (
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="mb-7 max-w-4xl">
              <p className="text-sm uppercase tracking-widest text-accent">Themes from community</p>
              <h2
                className="mt-3 text-3xl font-light leading-tight md:text-5xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Match each theme to one voice and one image.
              </h2>
            </div>

            <div className="grid gap-5">
              {themeThreads.map((thread, index) => (
                <article key={thread.id} className="rounded-md border border-border bg-card p-4">
                  <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                    <PhotoTile photo={thread.bestPhoto} priority={index === 0} />
                    <div className="grid gap-5 md:grid-cols-[1fr_0.9fr]">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Theme</p>
                        <h3 className="mt-1 text-2xl font-semibold">{thread.theme}</h3>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                          {thread.whatCommunityIsSaying}
                        </p>
                        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-accent">Deck use</p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground">{thread.deckUse}</p>
                      </div>
                      <blockquote className="rounded-md border border-primary/20 bg-primary/10 p-4">
                        <p className="text-lg leading-relaxed text-foreground">&quot;{thread.bestQuote}&quot;</p>
                        <footer className="mt-3 text-sm font-semibold text-muted-foreground">{thread.quoteBy}</footer>
                      </blockquote>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {mode === 'places' && place && (
        <section className="py-10">
          <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[320px_1fr]">
            <div className="space-y-2">
              {placePathways.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPlaceId(item.id)}
                  className={[
                    'block w-full rounded-md border px-4 py-3 text-left transition-colors',
                    place.id === item.id
                      ? 'border-primary bg-card text-foreground'
                      : 'border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  ].join(' ')}
                >
                  <span className="text-sm font-semibold">{item.name}</span>
                  <span className="mt-1 block text-xs leading-relaxed">{item.role}</span>
                </button>
              ))}
            </div>

            <article className="space-y-5">
              <div className="rounded-md border border-border bg-card p-6">
                <p className="text-sm uppercase tracking-widest text-accent">Place pathway</p>
                <h2
                  className="mt-3 text-3xl font-light leading-tight md:text-5xl"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  {place.name}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{place.role}</p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-md border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Proof now</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">{place.proofNow}</p>
                </div>
                <div className="rounded-md border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Next move</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">{place.nextMove}</p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                <div className="rounded-md border border-border bg-card p-5">
                  <h3 className="text-lg font-semibold">Community knowledge to carry</h3>
                  <ul className="mt-4 space-y-3">
                    {place.communityKnowledge.map((item) => (
                      <CheckLine key={item}>{item}</CheckLine>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md border border-border bg-card p-5">
                  <h3 className="text-lg font-semibold">Voices</h3>
                  <div className="mt-4 space-y-3">
                    {place.voices.map((voice) => (
                      <blockquote key={voice.name} className="rounded-md border border-border bg-background p-3">
                        <p className="text-sm leading-relaxed text-foreground">&quot;{voice.line}&quot;</p>
                        <footer className="mt-2 text-xs font-semibold text-muted-foreground">{voice.name}</footer>
                      </blockquote>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {place.photos.map((photo, index) => (
                  <PhotoTile key={photo.src} photo={photo} priority={index === 0} />
                ))}
              </div>
            </article>
          </div>
        </section>
      )}

      {mode === 'deck' && (
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-4xl">
                <p className="text-sm uppercase tracking-widest text-accent">Draft run order</p>
                <h2
                  className="mt-3 text-3xl font-light leading-tight md:text-5xl"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  A ten-slide path from why, to what, to how, to ownership.
                </h2>
              </div>
              <Link
                href="https://docs.google.com/presentation/d/1ClOU09dQVs_m_SvGcqAY3FeZnPWqBL0ZPxjdKqV1M8c/edit"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open Slides
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {deckRun.map((slide, index) => (
                <article key={slide.number} className="overflow-hidden rounded-md border border-border bg-card">
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={slide.photo.src}
                      alt={slide.photo.label}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 768px) 100vw, 420px"
                      className="object-cover"
                    />
                    <div className="absolute left-3 top-3 rounded bg-foreground/85 px-2 py-1 text-xs font-semibold text-background">
                      {slide.number}
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{slide.job}</p>
                    <h3 className="text-xl font-semibold leading-tight">{slide.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{slide.message}</p>
                    {slide.quote && (
                      <blockquote className="rounded-md bg-muted p-3 text-sm leading-relaxed text-foreground">
                        &quot;{slide.quote}&quot;
                      </blockquote>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border bg-card py-8">
        <div className="container mx-auto flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Factory className="h-5 w-5 text-accent" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Workshop frame: community knowledge, product proof, production pathway, ownership over time.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/pitch/investor-lab"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold transition-colors hover:border-primary/40"
            >
              Investor lab
            </Link>
            <Link
              href="/pitch/community-narrative"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold transition-colors hover:border-primary/40"
            >
              Community narrative
            </Link>
            <Link
              href="/pitch/photo-review"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold transition-colors hover:border-primary/40"
            >
              Photo review
            </Link>
            <Link
              href="/pitch/miro-board"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold transition-colors hover:border-primary/40"
            >
              Miro board
            </Link>
            <Link
              href="/field-notes/utopia-may-2026"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold transition-colors hover:border-primary/40"
            >
              Utopia field note
            </Link>
            <Link
              href="/partners/oonchiumpa"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold transition-colors hover:border-primary/40"
            >
              Oonchiumpa page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
