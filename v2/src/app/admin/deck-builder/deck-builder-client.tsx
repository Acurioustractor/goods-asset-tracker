'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Copy,
  Download,
  Film,
  Images,
  PlayCircle,
  Presentation,
  Quote,
  RotateCcw,
  Star,
  X,
} from 'lucide-react';
import { deckSlides, deckUpdated, type DeckSlide } from '@/lib/data/deck';
import { getStoryteller, STORYTELLER_REGISTRY } from '@/lib/data/storyteller-registry';

/** Item shape served by /api/admin/media-pick (local, committed media only). */
interface MediaPickItem {
  id: string;
  url: string;
  poster_url: string | null;
  media_type: 'image' | 'video';
  area: string | null;
  starred: boolean;
  tags: string[];
}

interface VideoPick {
  src: string;
  poster: string;
}

const STORAGE_KEY = 'goods-deck-v1';

type TextField = 'headline' | 'body' | 'script';

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

function canonical(slideId: string, field: TextField): string {
  const slide = deckSlides.find((s) => s.id === slideId);
  return slide ? (slide[field] ?? '') : '';
}

/** Uncontrolled contentEditable. React owns the text node; caret is preserved
 *  because the value prop only changes on blur/hydrate/reset, never mid-type. */
function Editable({
  value,
  onCommit,
  className,
  ariaLabel,
}: {
  value: string;
  onCommit: (v: string) => void;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <div
      role="textbox"
      aria-label={ariaLabel}
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e) => {
        const next = e.currentTarget.innerText.replace(/\u00a0/g, " ").replace(/\n{2,}/g, "\n").trim();
        if (next !== value) onCommit(next);
      }}
      className={[
        'rounded-sm outline-none transition-colors focus:bg-primary/5 focus:ring-1 focus:ring-primary/30',
        'cursor-text hover:bg-muted/60',
        className ?? '',
      ].join(' ')}
    >
      {value}
    </div>
  );
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

function VoiceCard({
  currentName,
  pool,
  onSwap,
}: {
  currentName: string;
  pool: string[];
  onSwap: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const record = getStoryteller(currentName);
  const quote = leadQuote(currentName);
  const pickable = pool.filter((n) => n !== currentName);

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <VoiceAvatar name={currentName} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{currentName}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {record?.role ?? 'Not in registry'}
          </p>
        </div>
        {pickable.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex flex-shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeftRight className="h-3 w-3" />
            Swap
          </button>
        )}
      </div>

      {quote ? (
        <p className="mt-3 text-sm leading-relaxed text-foreground">&ldquo;{quote.text}&rdquo;</p>
      ) : (
        <p className="mt-3 text-xs italic text-muted-foreground">
          No cleared quote on file — swap for a voice that has one.
        </p>
      )}
      {quote?.context && <p className="mt-1 text-xs text-muted-foreground">{quote.context}</p>}

      {open && pickable.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {pickable.map((name) => {
              const alt = getStoryteller(name);
              const altQuote = leadQuote(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onSwap(name);
                    setOpen(false);
                  }}
                  className="flex items-start gap-2 rounded-md border border-border bg-background p-2 text-left transition-colors hover:border-primary/40 hover:bg-muted"
                >
                  <VoiceAvatar name={name} size={36} />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-foreground">{name}</span>
                    <span className="block text-[10px] text-muted-foreground">{alt?.role}</span>
                    {altQuote && (
                      <span className="mt-1 block text-[10px] leading-snug text-muted-foreground">
                        &ldquo;{altQuote.text.slice(0, 64)}
                        {altQuote.text.length > 64 ? '…' : ''}&rdquo;
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** Every externally-cleared voice is swappable onto any slide (one system). */
const ALL_CLEARED_VOICES = STORYTELLER_REGISTRY.filter((s) => s.tier === 'external').map(
  (s) => s.name,
);

function voicePool(slide: DeckSlide, currentAtIndex: string): string[] {
  return Array.from(
    new Set([
      ...(slide.voiceNames ?? []),
      ...(slide.voiceAlternates ?? []),
      currentAtIndex,
      ...ALL_CLEARED_VOICES,
    ]),
  );
}

/* ── Media picker (photo/video swap widget) ─────────────────────────────── */

function MediaPicker({
  kind,
  items,
  onPick,
  onReset,
  onClose,
}: {
  kind: 'image' | 'video';
  items: MediaPickItem[] | null;
  onPick: (item: MediaPickItem) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState('');
  const [area, setArea] = useState<string | null>(null);

  const pool = (items ?? []).filter((i) => i.media_type === kind);
  const areas = Array.from(new Set(pool.map((i) => i.area).filter(Boolean))).sort() as string[];
  const needle = q.trim().toLowerCase();
  const shown = pool.filter(
    (i) =>
      (!area || i.area === area) &&
      (!needle ||
        i.url.toLowerCase().includes(needle) ||
        i.tags.some((t) => t.toLowerCase().includes(needle))),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-lg border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border p-4">
          <p className="text-sm font-semibold text-foreground">
            Swap {kind === 'image' ? 'photo' : 'video'} — every committed {kind} in the library
          </p>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search path or tag"
            className="ml-auto w-48 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Canonical
          </button>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-border px-4 py-2">
          <button
            type="button"
            onClick={() => setArea(null)}
            className={[
              'rounded-full px-2.5 py-1 text-[11px] font-semibold',
              area === null ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            All ({pool.length})
          </button>
          {areas.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setArea(a === area ? null : a)}
              className={[
                'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                area === a ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="grid flex-1 grid-cols-3 gap-2 overflow-y-auto p-4 sm:grid-cols-4 md:grid-cols-5">
          {items === null && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">Loading the library…</p>
          )}
          {items !== null && shown.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">Nothing matches.</p>
          )}
          {shown.map((i) => {
            const thumb = i.media_type === 'video' ? i.poster_url : i.url;
            return (
              <button
                key={i.id}
                type="button"
                onClick={() => onPick(i)}
                title={i.url}
                className="group relative overflow-hidden rounded-md border border-border bg-muted transition-transform hover:scale-[1.02] focus:ring-2 focus:ring-primary/50"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin picker thumbs, local files
                  <img src={thumb} alt={i.url} loading="lazy" className="h-24 w-full object-cover" />
                ) : (
                  <span className="flex h-24 w-full items-center justify-center text-[10px] text-muted-foreground">
                    <Film className="mr-1 h-3 w-3" />
                    no poster
                  </span>
                )}
                {i.starred && (
                  <Star className="absolute right-1 top-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400 drop-shadow" />
                )}
                <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1.5 py-0.5 text-left text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {i.url.split('/').slice(-2).join('/')}
                </span>
              </button>
            );
          })}
        </div>

        <p className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          Picks save in this browser; hit Export edits to hand them to Claude to commit. Local committed media only; tag and star in the{' '}
          <Link href="/admin/media-library" className="underline hover:text-foreground">
            media library
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

/* ── Edit view ──────────────────────────────────────────────────────────── */

function SlideCard({
  slide,
  index,
  total,
  getText,
  onText,
  getVoice,
  onVoice,
  onResetSlide,
  isDirty,
  photoSrc,
  onSwapPhoto,
  onSwapVideo,
}: {
  slide: DeckSlide;
  index: number;
  total: number;
  getText: (slide: DeckSlide, field: TextField) => string;
  onText: (slideId: string, field: TextField, value: string) => void;
  getVoice: (slide: DeckSlide, idx: number) => string;
  onVoice: (slideId: string, idx: number, name: string) => void;
  onResetSlide: (slideId: string) => void;
  isDirty: boolean;
  photoSrc: string;
  onSwapPhoto: () => void;
  onSwapVideo: () => void;
}) {
  return (
    <div id={slide.id} className="scroll-mt-24 rounded-lg border border-border bg-card">
      <div className="relative aspect-[16/7] w-full overflow-hidden rounded-t-lg border-b border-border bg-muted">
        <Image
          src={photoSrc}
          alt={slide.photoAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 860px"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
          {index + 1} / {total}
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-black/70">
          {slide.kind}
        </span>
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={onSwapPhoto}
            className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            <Images className="h-3 w-3" />
            Swap photo
          </button>
          <button
            type="button"
            onClick={onSwapVideo}
            className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            <Film className="h-3 w-3" />
            {slide.inlineVideo ? 'Swap video' : 'Add video'}
          </button>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-widest text-accent">{slide.eyebrow}</p>
          {isDirty && (
            <button
              type="button"
              onClick={() => onResetSlide(slide.id)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Reset slide
            </button>
          )}
        </div>

        <Editable
          ariaLabel={`${slide.eyebrow} headline`}
          value={getText(slide, 'headline')}
          onCommit={(v) => onText(slide.id, 'headline', v)}
          className="mt-1 text-2xl font-light leading-tight text-foreground md:text-3xl"
        />

        <Editable
          ariaLabel={`${slide.eyebrow} body`}
          value={getText(slide, 'body')}
          onCommit={(v) => onText(slide.id, 'body', v)}
          className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground"
        />

        {slide.steps && (
          <ol className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
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
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {slide.literalQuotes.map((q) => (
              <blockquote
                key={q.text}
                className="rounded-md border-l-2 border-primary/50 bg-muted/40 py-2 pl-3 pr-2"
              >
                <p className="text-sm leading-relaxed text-foreground">&ldquo;{q.text}&rdquo;</p>
                <footer className="mt-1 text-[11px] text-muted-foreground">— {q.attribution}</footer>
              </blockquote>
            ))}
          </div>
        )}

        {slide.voiceNames && slide.voiceNames.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Voices carrying this turn
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {slide.voiceNames.map((_, idx) => {
                const current = getVoice(slide, idx);
                return (
                  <VoiceCard
                    key={`${slide.id}:${idx}`}
                    currentName={current}
                    pool={voicePool(slide, current)}
                    onSwap={(name) => onVoice(slide.id, idx, name)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {slide.chips && slide.chips.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {slide.chips.map((chip) => (
              <div
                key={chip.label}
                className="rounded-md border border-border bg-background px-3 py-2"
              >
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {chip.label}
                </p>
                <p className="text-sm font-semibold text-foreground">{chip.value}</p>
              </div>
            ))}
          </div>
        )}

        {slide.script && (
          <div className="mt-5 rounded-md border border-dashed border-primary/30 bg-primary/[0.03] p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-primary/70">
              Spoken — presenter script (Present: press N)
            </p>
            <Editable
              ariaLabel={`${slide.eyebrow} presenter script`}
              value={getText(slide, 'script')}
              onCommit={(v) => onText(slide.id, 'script', v)}
              className="text-sm italic leading-relaxed text-foreground/80"
            />
          </div>
        )}

        {slide.video && (
          <div className="mt-5 rounded-md border border-border bg-muted/30 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <PlayCircle className="h-4 w-4 text-primary" />
              {slide.video.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{slide.video.note}</p>
            <Link
              href={slide.video.href}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Open the field note
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        <p className="mt-5 border-t border-dashed border-border pt-3 text-[11px] italic leading-relaxed text-muted-foreground/70">
          {slide.note}
        </p>
      </div>
    </div>
  );
}

/* ── Present view (the main deck) ───────────────────────────────────────── */

function PresentSlide({
  slide,
  getText,
  getVoice,
  getPhoto,
  getVideo,
}: {
  slide: DeckSlide;
  getText: (slide: DeckSlide, field: TextField) => string;
  getVoice: (slide: DeckSlide, idx: number) => string;
  getPhoto: (slide: DeckSlide) => string;
  getVideo: (slide: DeckSlide) => VideoPick | null;
}) {
  const leadName = slide.voiceNames?.[0] ? getVoice(slide, 0) : null;
  const registryQuote = leadName ? leadQuote(leadName) : null;
  const literal = slide.literalQuotes?.[0] ?? null;
  const video = getVideo(slide);

  return (
    <div className="absolute inset-0">
      {video ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={video.src}
          poster={video.poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          aria-label={slide.photoAlt}
        />
      ) : (
        <Image src={getPhoto(slide)} alt={slide.photoAlt} fill sizes="100vw" className="object-cover" priority />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70 md:text-sm">
            {slide.eyebrow}
          </p>
          <h2
            className="mt-3 text-3xl font-light leading-tight text-white md:text-5xl"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            {getText(slide, 'headline')}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-lg">
            {getText(slide, 'body')}
          </p>

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
                  — {registryQuote ? leadName : literal?.attribution}
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
  getText,
  getVoice,
  getPhoto,
  getVideo,
}: {
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
  getText: (slide: DeckSlide, field: TextField) => string;
  getVoice: (slide: DeckSlide, idx: number) => string;
  getPhoto: (slide: DeckSlide) => string;
  getVideo: (slide: DeckSlide) => VideoPick | null;
}) {
  const total = deckSlides.length;
  const [showNotes, setShowNotes] = useState(false);
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
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowNotes((v) => !v);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  const slide = deckSlides[index];
  const notes = getText(slide, 'script');

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <PresentSlide slide={slide} getText={getText} getVoice={getVoice} getPhoto={getPhoto} getVideo={getVideo} />

      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowNotes((v) => !v)}
          className={[
            'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors',
            showNotes ? 'bg-white/90 text-black' : 'bg-white/15 text-white hover:bg-white/25',
          ].join(' ')}
        >
          Notes (N)
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          <X className="h-4 w-4" />
          Exit
        </button>
      </div>

      {showNotes && notes && (
        <aside className="absolute right-4 top-16 z-10 max-h-[70vh] w-[22rem] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg bg-black/80 p-4 backdrop-blur-md">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/50">
            {slide.eyebrow} — spoken
          </p>
          <p className="text-sm leading-relaxed text-white/90">{notes}</p>
        </aside>
      )}

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

/* ── Export modal ───────────────────────────────────────────────────────── */

function ExportModal({ text, onClose }: { text: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-lg border border-border bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Your edits — hand this back to Claude to commit</p>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <textarea
          readOnly
          value={text}
          className="h-72 w-full resize-none rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(text).then(
                () => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                },
                () => undefined,
              );
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────── */

export function DeckClient() {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [voicePicks, setVoicePicks] = useState<Record<string, string>>({});
  const [photoPicks, setPhotoPicks] = useState<Record<string, string>>({});
  const [videoPicks, setVideoPicks] = useState<Record<string, VideoPick>>({});
  const [hydrated, setHydrated] = useState(false);
  const [presentIndex, setPresentIndex] = useState<number | null>(null);
  const [exportText, setExportText] = useState<string | null>(null);
  const [picker, setPicker] = useState<{ slideId: string; kind: 'image' | 'video' } | null>(null);
  const [pickItems, setPickItems] = useState<MediaPickItem[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          text?: Record<string, string>;
          voices?: Record<string, string>;
          photos?: Record<string, string>;
          videos?: Record<string, VideoPick>;
        };
        setOverrides(parsed.text ?? {});
        setVoicePicks(parsed.voices ?? {});
        setPhotoPicks(parsed.photos ?? {});
        setVideoPicks(parsed.videos ?? {});
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ text: overrides, voices: voicePicks, photos: photoPicks, videos: videoPicks }),
    );
  }, [overrides, voicePicks, photoPicks, videoPicks, hydrated]);

  const openPicker = useCallback(
    (slideId: string, kind: 'image' | 'video') => {
      setPicker({ slideId, kind });
      if (pickItems === null) {
        fetch('/api/admin/media-pick')
          .then((r) => r.json())
          .then((d) => setPickItems(Array.isArray(d.items) ? d.items : []))
          .catch(() => setPickItems([]));
      }
    },
    [pickItems],
  );

  const getPhoto = useCallback(
    (slide: DeckSlide) => photoPicks[slide.id] ?? slide.photo,
    [photoPicks],
  );

  const getVideo = useCallback(
    (slide: DeckSlide): VideoPick | null => {
      const picked = videoPicks[slide.id];
      if (picked) return picked;
      if (slide.inlineVideo?.mode === 'loop') {
        return { src: slide.inlineVideo.src, poster: slide.inlineVideo.poster };
      }
      return null;
    },
    [videoPicks],
  );

  const getText = useCallback(
    (slide: DeckSlide, field: TextField) => overrides[`${slide.id}.${field}`] ?? slide[field],
    [overrides],
  );

  const onText = useCallback((slideId: string, field: TextField, value: string) => {
    setOverrides((prev) => {
      const key = `${slideId}.${field}`;
      const next = { ...prev };
      if (value === canonical(slideId, field)) delete next[key];
      else next[key] = value;
      return next;
    });
  }, []);

  const getVoice = useCallback(
    (slide: DeckSlide, idx: number) =>
      voicePicks[`${slide.id}.voice.${idx}`] ?? slide.voiceNames?.[idx] ?? '',
    [voicePicks],
  );

  const onVoice = useCallback((slideId: string, idx: number, name: string) => {
    setVoicePicks((prev) => {
      const key = `${slideId}.voice.${idx}`;
      const slide = deckSlides.find((s) => s.id === slideId);
      const next = { ...prev };
      if (slide && slide.voiceNames?.[idx] === name) delete next[key];
      else next[key] = name;
      return next;
    });
  }, []);

  const onResetSlide = useCallback((slideId: string) => {
    setOverrides((prev) => {
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(prev)) if (!k.startsWith(`${slideId}.`)) next[k] = v;
      return next;
    });
    setVoicePicks((prev) => {
      const next: Record<string, string> = {};
      for (const [k, v] of Object.entries(prev)) if (!k.startsWith(`${slideId}.voice.`)) next[k] = v;
      return next;
    });
    setPhotoPicks((prev) => {
      const next = { ...prev };
      delete next[slideId];
      return next;
    });
    setVideoPicks((prev) => {
      const next = { ...prev };
      delete next[slideId];
      return next;
    });
  }, []);

  const dirtySlides = useMemo(() => {
    const set = new Set<string>();
    for (const k of Object.keys(overrides)) set.add(k.split('.')[0]);
    for (const k of Object.keys(voicePicks)) set.add(k.split('.')[0]);
    for (const k of Object.keys(photoPicks)) set.add(k);
    for (const k of Object.keys(videoPicks)) set.add(k);
    return set;
  }, [overrides, voicePicks, photoPicks, videoPicks]);

  const editCount = dirtySlides.size;

  const buildExport = useCallback(() => {
    const lines: string[] = ['# Goods deck — edits to commit', ''];
    let any = false;
    deckSlides.forEach((slide, i) => {
      const changes: string[] = [];
      const h = overrides[`${slide.id}.headline`];
      const b = overrides[`${slide.id}.body`];
      const sc = overrides[`${slide.id}.script`];
      if (h !== undefined) changes.push(`- headline → ${h}`);
      if (b !== undefined) changes.push(`- body → ${b}`);
      if (sc !== undefined) changes.push(`- script → ${sc}`);
      (slide.voiceNames ?? []).forEach((defName, idx) => {
        const picked = voicePicks[`${slide.id}.voice.${idx}`];
        if (picked && picked !== defName) changes.push(`- voice ${idx + 1}: ${defName} → ${picked}`);
      });
      const photoPicked = photoPicks[slide.id];
      if (photoPicked && photoPicked !== slide.photo) changes.push(`- photo → ${photoPicked}`);
      const videoPicked = videoPicks[slide.id];
      if (videoPicked && videoPicked.src !== slide.inlineVideo?.src) {
        changes.push(`- video → ${videoPicked.src} (poster: ${videoPicked.poster || 'none'})`);
      }
      if (changes.length) {
        any = true;
        lines.push(`## Slide ${i + 1} — ${slide.id} (${slide.eyebrow})`, ...changes, '');
      }
    });
    if (!any) lines.push('_No edits yet — the deck matches deck.ts._');
    setExportText(lines.join('\n'));
  }, [overrides, voicePicks, photoPicks, videoPicks]);

  const resetAll = useCallback(() => {
    setOverrides({});
    setVoicePicks({});
    setPhotoPicks({});
    setVideoPicks({});
  }, []);

  return (
    <main className="bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-foreground text-background">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/pitch/deck"
            className="mb-4 inline-flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
          >
            <ArrowLeft className="h-4 w-4" />
            View the public deck
          </Link>
          <p className="mb-2 text-sm uppercase tracking-widest text-primary">Deck builder · internal</p>
          <h1
            className="max-w-3xl text-3xl font-light leading-tight md:text-5xl"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            The whole story, one screen. Edit any slide, then present.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-background/70">
            Ten slides on the signed six-turn spine. Click any headline, paragraph or script to
            edit it in place — your changes save in this browser; export them for Claude to
            commit. The public page at /pitch/deck renders the committed version. Hit{' '}
            <span className="font-semibold text-background">Present</span> to open the main deck,
            and press <span className="font-semibold text-background">N</span> in Present for
            speaker notes. Updated {deckUpdated}.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPresentIndex(0)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Presentation className="h-4 w-4" />
              Present — open the main deck
            </button>
            <button
              type="button"
              onClick={buildExport}
              className="inline-flex items-center gap-2 rounded-md border border-background/25 px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-background/10"
            >
              <Download className="h-4 w-4" />
              Export edits{editCount > 0 ? ` (${editCount})` : ''}
            </button>
            {editCount > 0 && (
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-background/70 transition-colors hover:text-background"
              >
                <RotateCcw className="h-4 w-4" />
                Reset all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit view */}
      <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
        {deckSlides.map((slide, index) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            index={index}
            total={deckSlides.length}
            getText={getText}
            onText={onText}
            getVoice={getVoice}
            onVoice={onVoice}
            onResetSlide={onResetSlide}
            isDirty={dirtySlides.has(slide.id)}
            photoSrc={getPhoto(slide)}
            onSwapPhoto={() => openPicker(slide.id, 'image')}
            onSwapVideo={() => openPicker(slide.id, 'video')}
          />
        ))}

        <div className="rounded-lg border border-dashed border-border p-5 text-center">
          <button
            type="button"
            onClick={() => setPresentIndex(0)}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            <Presentation className="h-4 w-4" />
            Present from the top
          </button>
        </div>
      </div>

      {presentIndex !== null && (
        <PresentOverlay
          index={presentIndex}
          setIndex={setPresentIndex}
          onClose={() => setPresentIndex(null)}
          getText={getText}
          getVoice={getVoice}
          getPhoto={getPhoto}
          getVideo={getVideo}
        />
      )}

      {picker !== null && (
        <MediaPicker
          kind={picker.kind}
          items={pickItems}
          onPick={(item) => {
            if (picker.kind === 'image') {
              setPhotoPicks((prev) => ({ ...prev, [picker.slideId]: item.url }));
            } else {
              setVideoPicks((prev) => ({
                ...prev,
                [picker.slideId]: { src: item.url, poster: item.poster_url ?? '' },
              }));
            }
            setPicker(null);
          }}
          onReset={() => {
            if (picker.kind === 'image') {
              setPhotoPicks((prev) => {
                const next = { ...prev };
                delete next[picker.slideId];
                return next;
              });
            } else {
              setVideoPicks((prev) => {
                const next = { ...prev };
                delete next[picker.slideId];
                return next;
              });
            }
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
        />
      )}

      {exportText !== null && <ExportModal text={exportText} onClose={() => setExportText(null)} />}
    </main>
  );
}
