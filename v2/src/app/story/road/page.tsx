/**
 * /story/road — the Goods story at long length, on the road spine.
 *
 * Content lives in `lib/data/story-road.ts`, never in this file. The current
 * `/story` page hardcodes 1,178 lines of prose into JSX, which is why its copy
 * drifted out of reach of every prose guard in the repo. Markup here, words there.
 *
 * Ships alongside `/story` rather than replacing it, so both can be walked before
 * anything is switched. Replacing `/story` is a redirect and a decision, not a
 * rewrite.
 *
 * VOICES resolve through the storyteller registry at render time, and a voice whose
 * tier is not `external` is DROPPED rather than rendered. The registry is the gate;
 * this page trusts it and does not keep its own list.
 *
 * GAPS render. A stop that is short a photo says so, in place. Silent fallback is how
 * you stop knowing what you are missing.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  storyStops,
  storyOpening,
  storyUpdated,
  type StoryStop,
  type StoryFigure,
  type StoryImage,
  type StoryGap,
} from '@/lib/data/story-road';
import { getStoryteller, type StorytellerRecord } from '@/lib/data/storyteller-registry';

export const metadata: Metadata = {
  title: 'The Work That Stays',
  description:
    'The full Goods on Country history, walked as a road: Kalgoorlie, Tennant Creek, Palm Island, Utopia, the farm and Maningrida, and Alice Springs. The model arrives at the end, because it is what the road produced.',
};

// ─────────────────────────────────────────────────────────── voices

/**
 * Resolve a name to a renderable voice, or null.
 *
 * Default-deny in two places: an unknown name resolves to tier `hold` in the
 * registry and is dropped here, and a person with no usable quote is dropped too.
 * `hold` and `retired` quotes can never be selected.
 */
function resolveVoice(name: string): { person: StorytellerRecord; quote: string; context: string } | null {
  const person = getStoryteller(name);
  if (!person || person.tier !== 'external') return null;

  const usable = person.quotes.filter((q) => q.status === 'primary' || q.status === 'approved');
  const chosen = usable.find((q) => q.status === 'primary') ?? usable[0];
  if (!chosen) return null;

  return { person, quote: chosen.text, context: chosen.context };
}

function Voice({ name }: { name: string }) {
  const voice = resolveVoice(name);
  if (!voice) return null;
  const { person, quote, context } = voice;

  return (
    <figure className="my-10 border-l-2 border-[var(--goods-terracotta,#B7593F)] pl-6 md:pl-8">
      <blockquote className="font-serif text-2xl md:text-3xl leading-snug text-foreground">
        {quote}
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 text-sm">
        {person.portrait && (
          <Image
            src={person.portrait}
            alt=""
            width={44}
            height={44}
            className="rounded-full object-cover h-11 w-11"
          />
        )}
        <span>
          <span className="font-medium text-foreground">{person.name}</span>
          <span className="block text-muted-foreground">
            {/* Practitioners must be labelled as practitioners, never as community
                recipients. The registry carries the flag; the UI has to honour it. */}
            {person.practitioner ? `${person.role} · practitioner` : person.role}
            {person.community ? ` · ${person.community}` : ''}
          </span>
          <span className="block text-muted-foreground/70 text-xs mt-0.5">{context}</span>
        </span>
      </figcaption>
    </figure>
  );
}

// ─────────────────────────────────────────────────────────── parts

function Figures({ figures }: { figures: StoryFigure[] }) {
  return (
    <dl className="my-10 grid gap-x-8 gap-y-6 grid-cols-2 md:grid-cols-4">
      {figures.map((f) => (
        <div key={f.label}>
          <dt className="font-serif text-3xl md:text-4xl text-foreground">{f.value}</dt>
          <dd className="mt-1 text-sm text-muted-foreground">{f.label}</dd>
          {/* Claims status is not decoration. A modelled figure and a verified one
              must never look the same on a funder-facing page. */}
          <dd className="mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
            {f.claim}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Gap({ gap }: { gap: StoryGap }) {
  return (
    <div className="my-8 rounded-md border border-dashed px-5 py-4 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Missing {gap.slot}: {gap.wanted}</span>
      <span className="block mt-1">{gap.reason}</span>
    </div>
  );
}

function Gallery({ images }: { images: StoryImage[] }) {
  return (
    <div className={`my-10 grid gap-4 ${images.length > 1 ? 'sm:grid-cols-2' : ''}`}>
      {images.map((img) => (
        <figure key={img.src}>
          <Image
            src={img.src}
            alt={img.alt}
            width={900}
            height={600}
            sizes="(max-width: 640px) 100vw, 45vw"
            className="w-full h-auto rounded-md object-cover"
          />
          {img.caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground">{img.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

function Stop({ stop }: { stop: StoryStop }) {
  return (
    <section id={stop.id} className="scroll-mt-24 border-t py-16 md:py-24">
      <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">{stop.eyebrow}</p>
      <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-tight text-foreground">
        {stop.headline}
      </h2>
      {stop.place && <p className="mt-3 text-sm text-muted-foreground">{stop.place}</p>}

      {stop.photo && (
        <figure className="my-10">
          <Image
            src={stop.photo.src}
            alt={stop.photo.alt}
            width={1400}
            height={900}
            sizes="(max-width: 768px) 100vw, 70vw"
            className="w-full h-auto rounded-md object-cover"
          />
          {stop.photo.caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground">
              {stop.photo.caption}
            </figcaption>
          )}
        </figure>
      )}

      <div className="mt-8 space-y-6">
        {stop.chapters.map((para, i) => (
          <p key={i} className="text-lg md:text-xl leading-relaxed text-foreground/90">
            {para}
          </p>
        ))}
      </div>

      {stop.voiceNames?.map((name) => (
        <Voice key={name} name={name} />
      ))}

      {stop.figures && stop.figures.length > 0 && <Figures figures={stop.figures} />}
      {stop.gallery && stop.gallery.length > 0 && <Gallery images={stop.gallery} />}

      {stop.video && (
        <figure className="my-10">
          <div className="relative w-full overflow-hidden rounded-md aspect-video">
            <iframe
              src={stop.video.embedUrl}
              title={stop.video.label}
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
          <figcaption className="mt-2 text-sm text-muted-foreground">{stop.video.label}</figcaption>
        </figure>
      )}

      {stop.gaps?.map((gap) => (
        <Gap key={`${gap.slot}-${gap.wanted}`} gap={gap} />
      ))}
    </section>
  );
}

// ─────────────────────────────────────────────────────────── page

export default function StoryRoadPage() {
  const placeStops = storyStops.filter((s) => s.kind === 'stop');

  return (
    <main className="mx-auto max-w-3xl px-5 pb-32 pt-16 md:pt-24">
      <header>
        <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">
          The Work That Stays
        </p>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-[1.05] text-foreground">
          {storyOpening.headline}
        </h1>

        <figure className="my-12">
          <Image
            src={storyOpening.photo.src}
            alt={storyOpening.photo.alt}
            width={1400}
            height={900}
            sizes="(max-width: 768px) 100vw, 70vw"
            priority
            className="w-full h-auto rounded-md object-cover"
          />
          <figcaption className="mt-2 text-sm text-muted-foreground">
            {storyOpening.photo.caption}
          </figcaption>
        </figure>

        <div className="space-y-6">
          {storyOpening.chapters.map((para, i) => (
            <p key={i} className="text-lg md:text-xl leading-relaxed text-foreground/90">
              {para}
            </p>
          ))}
        </div>
      </header>

      {/* The road, listed before it is walked. Seven places, then what they produced. */}
      <nav aria-label="The road" className="mt-16 border-t pt-8">
        <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">The road</p>
        <ol className="mt-4 space-y-2">
          {placeStops.map((stop, i) => (
            <li key={stop.id} className="text-base">
              <Link href={`#${stop.id}`} className="hover:underline text-foreground">
                <span className="text-muted-foreground tabular-nums mr-3">{i + 1}</span>
                {stop.headline}
              </Link>
              {stop.place && (
                <span className="block ml-8 text-sm text-muted-foreground">{stop.place}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {storyStops.map((stop) => (
        <Stop key={stop.id} stop={stop} />
      ))}

      <footer className="border-t pt-10 text-sm text-muted-foreground">
        <p>Updated {storyUpdated}.</p>
        <p className="mt-2">
          Figures are read from the canonical register. Each carries its own claims
          status, because this page mixes delivered counts with modelled economics and
          the two must not read alike.
        </p>
      </footer>
    </main>
  );
}
