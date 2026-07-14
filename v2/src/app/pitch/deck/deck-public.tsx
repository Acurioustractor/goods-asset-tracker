'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  PlayCircle,
  Presentation,
  Quote,
  X,
} from 'lucide-react';
import { deckSlides, deckUpdated, type DeckSlide, type GalleryImage } from '@/lib/data/deck';
import { getStoryteller } from '@/lib/data/storyteller-registry';

/** Consent-safe: primary → approved, never a `hold` quote. */
function leadQuote(name: string) {
  const record = getStoryteller(name);
  if (!record) return null;
  return (
    record.quotes.find((q) => q.status === 'primary') ??
    record.quotes.find((q) => q.status === 'approved') ??
    null
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .filter((part) => part && part[0] === part[0].toUpperCase())
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}

function VoiceAvatar({ name, size = 56 }: { name: string; size?: number }) {
  const record = getStoryteller(name);
  const px = `${size}px`;
  if (record?.portrait) {
    return (
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-full border border-border bg-muted"
        style={{ height: px, width: px }}
      >
        <Image src={record.portrait} alt={name} fill sizes={px} className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-muted text-sm font-semibold text-muted-foreground"
      style={{ height: px, width: px }}
    >
      {initials(name)}
    </div>
  );
}

function VoiceCard({ name }: { name: string }) {
  const record = getStoryteller(name);
  const quote = leadQuote(name);
  if (!quote) return null;
  return (
    <figure className="rounded-md border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <VoiceAvatar name={name} />
        <div className="min-w-0 flex-1">
          <figcaption className="text-sm font-semibold text-foreground">{name}</figcaption>
          <p className="text-xs leading-relaxed text-muted-foreground">{record?.role}</p>
        </div>
      </div>
      <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
        &ldquo;{quote.text}&rdquo;
      </blockquote>
      {quote.context && <p className="mt-1 text-xs text-muted-foreground">{quote.context}</p>}
    </figure>
  );
}

function SlideMedia({ slide }: { slide: DeckSlide }) {
  const loop = slide.inlineVideo?.mode === 'loop' ? slide.inlineVideo : null;
  return (
    <div className="relative aspect-[16/8] w-full overflow-hidden rounded-t-lg border-b border-border bg-muted">
      {loop ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={loop.src}
          poster={loop.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-label={slide.photoAlt}
        />
      ) : (
        <Image
          src={slide.photo}
          alt={slide.photoAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-cover"
        />
      )}
    </div>
  );
}

function GalleryStrip({
  images,
  onOpen,
}: {
  images: GalleryImage[];
  onOpen: (img: GalleryImage) => void;
}) {
  return (
    <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
      {images.map((img) => (
        <button
          key={img.src}
          type="button"
          onClick={() => onOpen(img)}
          className="group relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted transition-transform hover:scale-[1.02] md:h-32 md:w-48"
          aria-label={`View larger: ${img.alt}`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="192px"
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        </button>
      ))}
    </div>
  );
}

function FeatureVideo({ slide }: { slide: DeckSlide }) {
  const feature = slide.inlineVideo?.mode === 'feature' ? slide.inlineVideo : null;
  if (!feature) return null;
  return (
    <div className="mt-5 overflow-hidden rounded-md border border-border bg-black">
      {feature.label && (
        <p className="flex items-center gap-2 bg-card px-4 py-3 text-sm font-semibold text-foreground">
          <PlayCircle className="h-4 w-4 text-primary" />
          {feature.label}
        </p>
      )}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- field recording; spoken content is summarised in the surrounding slide copy */}
      <video className="w-full" src={feature.src} poster={feature.poster} controls preload="none" />
    </div>
  );
}

function GoDeeper({ slide }: { slide: DeckSlide }) {
  if (!slide.goDeeper?.length) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-2 border-t border-dashed border-border pt-4">
      {slide.goDeeper.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          {link.label}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      ))}
    </div>
  );
}

function SlideSection({
  slide,
  index,
  total,
  onOpenImage,
}: {
  slide: DeckSlide;
  index: number;
  total: number;
  onOpenImage: (img: GalleryImage) => void;
}) {
  return (
    <section id={slide.id} className="scroll-mt-24 rounded-lg border border-border bg-card">
      <SlideMedia slide={slide} />
      <div className="p-5 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-widest text-accent">{slide.eyebrow}</p>
          <p className="text-[11px] font-semibold text-muted-foreground">
            {index + 1} / {total}
          </p>
        </div>

        <h2
          className="mt-2 text-2xl font-light leading-tight text-foreground md:text-4xl"
          style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
        >
          {slide.headline}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {slide.body}
        </p>

        {slide.steps && (
          <ol className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {slide.steps.map((step, i) => (
              <li key={step} className="flex gap-2 rounded-md border border-border bg-background p-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-xs leading-relaxed text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        )}

        {slide.literalQuotes && slide.literalQuotes.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {slide.literalQuotes.map((q) => (
              <blockquote
                key={q.text}
                className="rounded-md border-l-2 border-primary/50 bg-muted/40 py-2 pl-3 pr-2"
              >
                <p className="text-sm leading-relaxed text-foreground">&ldquo;{q.text}&rdquo;</p>
                <footer className="mt-1 text-[11px] text-muted-foreground">{q.attribution}</footer>
              </blockquote>
            ))}
          </div>
        )}

        {slide.voiceNames && slide.voiceNames.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {slide.voiceNames.map((name) => (
              <VoiceCard key={name} name={name} />
            ))}
          </div>
        )}

        {slide.chips && slide.chips.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {slide.chips.map((chip) => (
              <div key={chip.label} className="rounded-md border border-border bg-background px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{chip.label}</p>
                <p className="text-sm font-semibold text-foreground">{chip.value}</p>
              </div>
            ))}
          </div>
        )}

        <FeatureVideo slide={slide} />

        {slide.gallery && slide.gallery.length > 0 && (
          <GalleryStrip images={slide.gallery} onOpen={onOpenImage} />
        )}

        <GoDeeper slide={slide} />
      </div>
    </section>
  );
}

/* ── Present (fullscreen) ───────────────────────────────────────────────── */

function PresentSlide({ slide }: { slide: DeckSlide }) {
  const leadName = slide.voiceNames?.[0] ?? null;
  const registryQuote = leadName ? leadQuote(leadName) : null;
  const literal = slide.literalQuotes?.[0] ?? null;
  const loop = slide.inlineVideo?.mode === 'loop' ? slide.inlineVideo : null;

  return (
    <div className="absolute inset-0">
      {loop ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={loop.src}
          poster={loop.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-label={slide.photoAlt}
        />
      ) : (
        <Image src={slide.photo} alt={slide.photoAlt} fill sizes="100vw" className="object-cover" priority />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 md:text-sm">{slide.eyebrow}</p>
          <h2
            className="mt-3 text-3xl font-light leading-tight text-white md:text-5xl"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            {slide.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-lg">{slide.body}</p>

          {slide.steps && (
            <div className="mt-5 flex flex-wrap gap-2">
              {slide.steps.map((step, i) => (
                <span
                  key={step}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur-sm"
                >
                  {i + 1}. {step.split(': ')[0]}
                </span>
              ))}
            </div>
          )}

          {(registryQuote || literal) && (
            <div className="mt-5 flex items-start gap-3">
              {leadName && registryQuote && <VoiceAvatar name={leadName} size={48} />}
              <div>
                <p className="flex items-start gap-2 text-base italic leading-relaxed text-white md:text-xl">
                  <Quote className="mt-1 h-4 w-4 flex-shrink-0 text-white/50" />
                  <span>&ldquo;{(registryQuote?.text ?? literal?.text) as string}&rdquo;</span>
                </p>
                <p className="mt-1 pl-6 text-xs text-white/60 md:text-sm">
                  {registryQuote ? leadName : literal?.attribution}
                </p>
              </div>
            </div>
          )}

          {slide.chips && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {slide.chips.map((chip) => (
                <div key={chip.label}>
                  <p className="text-lg font-semibold text-white md:text-2xl">{chip.value}</p>
                  <p className="text-[11px] uppercase tracking-wide text-white/60">{chip.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PresentOverlay({
  index,
  setIndex,
  onClose,
}: {
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const total = deckSlides.length;
  const go = useCallback(
    (delta: number) => setIndex(Math.min(total - 1, Math.max(0, index + delta))),
    [index, setIndex, total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  const slide = deckSlides[index];

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <PresentSlide slide={slide} />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
      >
        <X className="h-4 w-4" />
        Exit
      </button>

      <div className="absolute left-4 top-4 z-10 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
        {index + 1} / {total}
      </div>

      {index > 0 && (
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      {index < total - 1 && (
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      )}

      <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center gap-1.5">
        {deckSlides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={[
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Lightbox ───────────────────────────────────────────────────────────── */

function Lightbox({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10"
      onClick={onClose}
      role="dialog"
      aria-label={image.alt}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 text-white backdrop-blur-sm hover:bg-white/25"
        aria-label="Close image"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="relative h-full w-full max-w-5xl">
        <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-contain" />
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs text-white/80">
        {image.alt}
      </p>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────── */

export function DeckPublic() {
  const [presentIndex, setPresentIndex] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  return (
    <main className="bg-background text-foreground">
      {/* Intro */}
      <div className="border-b border-border bg-foreground text-background">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <p className="mb-2 text-sm uppercase tracking-widest text-primary">The pitch</p>
          <h1
            className="max-w-3xl text-3xl font-light leading-tight md:text-5xl"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            The whole story, one page.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-background/70 md:text-base">
            Ten turns through what communities have built with Goods: the need, named by the people
            living it; the products they designed; the making moving into community hands; and what
            has to move next. Real voices, real photographs, and numbers that audit back to the
            public register. Updated {deckUpdated}.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPresentIndex(0)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Presentation className="h-4 w-4" />
              Present fullscreen
            </button>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md border border-background/25 px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-background/10"
            >
              Every number, audited
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Slides */}
      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
        {deckSlides.map((slide, index) => (
          <SlideSection
            key={slide.id}
            slide={slide}
            index={index}
            total={deckSlides.length}
            onOpenImage={setLightbox}
          />
        ))}

        {/* Closing band */}
        <div className="rounded-lg border border-border bg-card p-6 text-center md:p-10">
          <h2
            className="text-2xl font-light leading-tight text-foreground md:text-3xl"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Sit down with us.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            If this story holds something for you, the next step is a conversation, not a form.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Back the work
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Talk to us
            </Link>
            <button
              type="button"
              onClick={() => setPresentIndex(0)}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Presentation className="h-4 w-4" />
              Present from the top
            </button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Figures verified {deckUpdated}. Every number on this page audits back to{' '}
            <Link href="/register" className="underline hover:text-foreground">
              the register
            </Link>
            .
          </p>
        </div>
      </div>

      {presentIndex !== null && (
        <PresentOverlay index={presentIndex} setIndex={setPresentIndex} onClose={() => setPresentIndex(null)} />
      )}

      {lightbox && <Lightbox image={lightbox} onClose={() => setLightbox(null)} />}
    </main>
  );
}
