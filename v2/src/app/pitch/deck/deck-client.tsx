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
  PlayCircle,
  Presentation,
  Quote,
  RotateCcw,
  X,
} from 'lucide-react';
import { deckSlides, deckUpdated, type DeckSlide } from '@/lib/data/deck';
import { getStoryteller } from '@/lib/data/storyteller-registry';

const STORAGE_KEY = 'goods-deck-v1';

type TextField = 'headline' | 'body';

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
  return slide ? slide[field] : '';
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
          <div className="grid gap-2 sm:grid-cols-2">
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

function voicePool(slide: DeckSlide, currentAtIndex: string): string[] {
  return Array.from(
    new Set([...(slide.voiceNames ?? []), ...(slide.voiceAlternates ?? []), currentAtIndex]),
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
}) {
  return (
    <div id={slide.id} className="scroll-mt-24 rounded-lg border border-border bg-card">
      <div className="relative aspect-[16/7] w-full overflow-hidden rounded-t-lg border-b border-border bg-muted">
        <Image
          src={slide.photo}
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
}: {
  slide: DeckSlide;
  getText: (slide: DeckSlide, field: TextField) => string;
  getVoice: (slide: DeckSlide, idx: number) => string;
}) {
  const leadName = slide.voiceNames?.[0] ? getVoice(slide, 0) : null;
  const registryQuote = leadName ? leadQuote(leadName) : null;
  const literal = slide.literalQuotes?.[0] ?? null;

  return (
    <div className="absolute inset-0">
      <Image src={slide.photo} alt={slide.photoAlt} fill sizes="100vw" className="object-cover" priority />
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
}: {
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
  getText: (slide: DeckSlide, field: TextField) => string;
  getVoice: (slide: DeckSlide, idx: number) => string;
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
      <PresentSlide slide={slide} getText={getText} getVoice={getVoice} />

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
  const [hydrated, setHydrated] = useState(false);
  const [presentIndex, setPresentIndex] = useState<number | null>(null);
  const [exportText, setExportText] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          text?: Record<string, string>;
          voices?: Record<string, string>;
        };
        setOverrides(parsed.text ?? {});
        setVoicePicks(parsed.voices ?? {});
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ text: overrides, voices: voicePicks }));
  }, [overrides, voicePicks, hydrated]);

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
  }, []);

  const dirtySlides = useMemo(() => {
    const set = new Set<string>();
    for (const k of Object.keys(overrides)) set.add(k.split('.')[0]);
    for (const k of Object.keys(voicePicks)) set.add(k.split('.')[0]);
    return set;
  }, [overrides, voicePicks]);

  const editCount = dirtySlides.size;

  const buildExport = useCallback(() => {
    const lines: string[] = ['# Goods deck — edits to commit', ''];
    let any = false;
    deckSlides.forEach((slide, i) => {
      const changes: string[] = [];
      const h = overrides[`${slide.id}.headline`];
      const b = overrides[`${slide.id}.body`];
      if (h !== undefined) changes.push(`- headline → ${h}`);
      if (b !== undefined) changes.push(`- body → ${b}`);
      (slide.voiceNames ?? []).forEach((defName, idx) => {
        const picked = voicePicks[`${slide.id}.voice.${idx}`];
        if (picked && picked !== defName) changes.push(`- voice ${idx + 1}: ${defName} → ${picked}`);
      });
      if (changes.length) {
        any = true;
        lines.push(`## Slide ${i + 1} — ${slide.id} (${slide.eyebrow})`, ...changes, '');
      }
    });
    if (!any) lines.push('_No edits yet — the deck matches deck.ts._');
    setExportText(lines.join('\n'));
  }, [overrides, voicePicks]);

  const resetAll = useCallback(() => {
    setOverrides({});
    setVoicePicks({});
  }, []);

  return (
    <main className="bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-foreground text-background">
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/pitch"
            className="mb-4 inline-flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to pitch
          </Link>
          <p className="mb-2 text-sm uppercase tracking-widest text-primary">The deck</p>
          <h1
            className="max-w-3xl text-3xl font-light leading-tight md:text-5xl"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            The whole story, one screen. Edit any slide, then present.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-background/70">
            Nine slides on the signed six-turn spine: the model and the loop, then each belief turn
            with its voices, the ask last. Click any headline or paragraph to edit it in place — your
            changes save in this browser. Hit <span className="font-semibold text-background">Present</span> to
            open the main deck. Updated {deckUpdated}.
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
        />
      )}

      {exportText !== null && <ExportModal text={exportText} onClose={() => setExportText(null)} />}
    </main>
  );
}
