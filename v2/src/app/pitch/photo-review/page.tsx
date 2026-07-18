import Image from 'next/image';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Image as ImageIcon,
  Replace,
  UsersRound,
} from 'lucide-react';
import { advisoryGroup, investmentCase } from '@/lib/data/content';
import {
  deckPhotoSlots,
  deckReviewLinks,
  deckReviewUpdated,
  effectModel,
  replacementWorkflow,
  storytellerReview,
  type PhotoCandidate,
  type StorytellerReview,
} from '@/lib/data/pitch-photo-review';

export const metadata = {
  title: 'Photo review | Goods on Country pitch',
  description:
    'A simple review board for choosing deck photos, storyteller voices, and replacement images for the Goods on Country pitch.',
};

const featureNames = new Set([
  'Dianne Stokes',
  'Mykel',
  'Fred Campbell',
  'Xavier',
  'Kristy Bloomfield',
  'Karen Liddle',
  'Katrina Bloomfield',
  'Ray Nelson',
  'Ivy',
  'Alfred Johnson',
]);

function isExternal(href: string) {
  return href.startsWith('http');
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold',
        ok
          ? 'border-emerald-700/20 bg-emerald-50 text-emerald-800'
          : 'border-amber-700/20 bg-amber-50 text-amber-900',
      ].join(' ')}
    >
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {label}
    </span>
  );
}

function PhotoThumb({
  candidate,
  priority = false,
  className = '',
}: {
  candidate: PhotoCandidate;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={['overflow-hidden rounded-md border border-border bg-card', className].join(' ')}>
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={candidate.src}
          alt={candidate.label}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover"
        />
      </div>
      <figcaption className="space-y-2 border-t border-border p-3">
        <p className="text-sm font-semibold text-foreground">{candidate.label}</p>
        <code className="block break-all rounded bg-muted px-2 py-1 text-[11px] leading-relaxed text-muted-foreground">
          {candidate.src}
        </code>
        {candidate.tags && (
          <div className="flex flex-wrap gap-1">
            {candidate.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        {candidate.note && <p className="text-xs leading-relaxed text-muted-foreground">{candidate.note}</p>}
      </figcaption>
    </figure>
  );
}

function PersonPhoto({ person }: { person: StorytellerReview }) {
  if (!person.photo) {
    return (
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
        <ImageIcon className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted">
      <Image
        src={person.photo}
        alt={person.name}
        fill
        sizes="64px"
        className="object-cover"
      />
    </div>
  );
}

export default function PitchPhotoReviewPage() {
  const featuredStorytellers = storytellerReview.filter((person) => featureNames.has(person.name));
  const readyVoices = storytellerReview.filter((person) => person.clearedForExternal).length;
  const localPhotos = storytellerReview.filter((person) => person.photo).length;
  const timelineItems = investmentCase.timeline.slice(0, 2);

  return (
    <main className="bg-background text-foreground">
      <section className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <Link
            href="/pitch"
            className="mb-8 inline-flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to pitch
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-4 text-sm uppercase tracking-widest text-primary">Deck photo and voice review</p>
              <h1
                className="max-w-4xl text-4xl font-light leading-tight md:text-6xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                A simple board for choosing the real photos and voices in the funder deck.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-background/70 md:text-lg">
                Use this to decide which images carry production, delivery, young makers, and community voice.
                The final check stays in Empathy Ledger or the canon board before the deck goes out.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md border border-background/15 bg-background/5 p-4">
                <p className="text-2xl font-semibold">{deckPhotoSlots.length}</p>
                <p className="mt-1 text-xs leading-relaxed text-background/55">deck photo jobs</p>
              </div>
              <div className="rounded-md border border-background/15 bg-background/5 p-4">
                <p className="text-2xl font-semibold">{readyVoices}</p>
                <p className="mt-1 text-xs leading-relaxed text-background/55">cleared voices in review</p>
              </div>
              <div className="rounded-md border border-background/15 bg-background/5 p-4">
                <p className="text-2xl font-semibold">{localPhotos}</p>
                <p className="mt-1 text-xs leading-relaxed text-background/55">local photos ready</p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-background/45">Updated {deckReviewUpdated}</p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container mx-auto grid gap-3 px-4 py-5 md:grid-cols-3 xl:grid-cols-6">
          {deckReviewLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={isExternal(item.href) ? '_blank' : undefined}
              rel={isExternal(item.href) ? 'noreferrer' : undefined}
              className="rounded-md border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-muted"
            >
              <span className="flex items-center justify-between gap-3 text-sm font-semibold">
                {item.label}
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">{item.note}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-b border-border bg-amber-50">
        <div className="container mx-auto flex gap-4 px-4 py-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-800" />
          <div>
            <h2 className="text-sm font-semibold text-amber-950">Known source conflict to keep visible</h2>
            <p className="mt-1 max-w-4xl text-sm leading-relaxed text-amber-950/75">
              Current code canon marks Mykel, Xavier, and Fred Campbell as cleared for external funder use.
              One older wiki paragraph still says Mykel was pending. Use the current canon for review, then
              confirm the exact image or clip in Empathy Ledger before external release.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12" id="photo-slots">
        <div className="container mx-auto px-4">
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-accent">
                <ImageIcon className="h-4 w-4" />
                Photo slots
              </p>
              <h2
                className="text-3xl font-light leading-tight md:text-4xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Pick one photo for each slide job.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Each slot has a preferred image, backups, the copy it should carry, and the consent check that matters.
            </p>
          </div>

          <div className="grid gap-5">
            {deckPhotoSlots.map((slot, index) => (
              <article key={slot.id} className="rounded-md border border-border bg-card">
                <div className="grid gap-5 p-4 lg:grid-cols-[360px_1fr] lg:p-5">
                  <PhotoThumb candidate={slot.preferred} priority={index === 0} />
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{slot.slide}</p>
                      <h3 className="mt-1 text-2xl font-semibold text-foreground">{slot.job}</h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Copy use
                        </p>
                        <p className="text-sm leading-relaxed text-foreground">{slot.copyUse}</p>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Check before release
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">{slot.check}</p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Backup images
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {slot.alternates.map((candidate) => (
                          <div key={candidate.src} className="rounded-md border border-border bg-background">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-t-md bg-muted">
                              <Image
                                src={candidate.src}
                                alt={candidate.label}
                                fill
                                sizes="(max-width: 768px) 50vw, 220px"
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-2 p-3">
                              <p className="text-xs font-semibold leading-snug">{candidate.label}</p>
                              <code className="block break-all text-[10px] leading-relaxed text-muted-foreground">
                                {candidate.src}
                              </code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/35 py-12" id="featured">
        <div className="container mx-auto px-4">
          <div className="mb-7">
            <p className="mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-accent">
              <UsersRound className="h-4 w-4" />
              Featured voices
            </p>
            <h2
              className="text-3xl font-light leading-tight md:text-4xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              The deck should carry these people first.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {featuredStorytellers.map((person) => (
              <article key={person.name} className="rounded-md border border-border bg-card p-4">
                <div className="mb-4 flex items-center gap-3">
                  <PersonPhoto person={person} />
                  <div>
                    <h3 className="text-base font-semibold">{person.name}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{person.location}</p>
                  </div>
                </div>
                <StatusPill ok={person.clearedForExternal} label={person.clearedForExternal ? 'cleared voice' : 'hold'} />
                {person.quote && (
                  <p className="mt-4 text-sm leading-relaxed text-foreground">&quot;{person.quote}&quot;</p>
                )}
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{person.deckUse}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12" id="storytellers">
        <div className="container mx-auto px-4">
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-accent">
                <ClipboardList className="h-4 w-4" />
                Storyteller matrix
              </p>
              <h2
                className="text-3xl font-light leading-tight md:text-4xl"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                All current cleared voices in one place.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Photo missing means the voice can still be used as a quote, but the deck needs a neutral scene image
              or a newly confirmed EL portrait.
            </p>
          </div>

          <div className="overflow-x-auto rounded-md border border-border bg-card">
            <table className="min-w-[1100px] text-left text-sm">
              <thead className="border-b border-border bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="w-[240px] px-4 py-3 font-semibold">Person</th>
                  <th className="w-[190px] px-4 py-3 font-semibold">Location</th>
                  <th className="w-[230px] px-4 py-3 font-semibold">Themes</th>
                  <th className="w-[310px] px-4 py-3 font-semibold">Quote</th>
                  <th className="w-[260px] px-4 py-3 font-semibold">Deck use</th>
                  <th className="w-[220px] px-4 py-3 font-semibold">Readiness</th>
                </tr>
              </thead>
              <tbody>
                {storytellerReview.map((person) => (
                  <tr key={person.name} className="border-b border-border align-top last:border-b-0">
                    <td className="px-4 py-4">
                      <div className="flex gap-3">
                        <PersonPhoto person={person} />
                        <div>
                          <p className="font-semibold text-foreground">{person.name}</p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{person.role}</p>
                          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{person.source}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{person.location}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {person.themes.map((theme) => (
                          <span key={theme} className="rounded-full bg-secondary px-2 py-1 text-[11px] text-secondary-foreground">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm leading-relaxed text-foreground">
                      {person.quote ? `"` + person.quote + `"` : 'Quote needed from EL.'}
                    </td>
                    <td className="px-4 py-4 text-sm leading-relaxed text-muted-foreground">
                      {person.deckUse}
                      {person.note && <p className="mt-2 text-xs text-amber-900">{person.note}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <StatusPill ok={person.clearedForExternal} label={person.clearedForExternal ? 'cleared voice' : 'hold voice'} />
                        <StatusPill ok={!!person.photo} label={person.photo ? 'local photo' : 'EL photo needed'} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card py-12" id="model">
        <div className="container mx-auto px-4">
          <div className="mb-7">
            <p className="mb-2 text-sm uppercase tracking-widest text-accent">Effect model</p>
            <h2
              className="text-3xl font-light leading-tight md:text-4xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              The story to show in the deck.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-5">
            {effectModel.map((item) => (
              <article key={item.step} className="rounded-md border border-border bg-background p-4">
                <h3 className="text-base font-semibold">{item.step}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.proof}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-accent">Deck proof</p>
                <p className="mt-2 text-xs leading-relaxed text-foreground">{item.deckProof}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12" id="replace">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm uppercase tracking-widest text-accent">
              <Replace className="h-4 w-4" />
              Replacement workflow
            </p>
            <h2
              className="text-3xl font-light leading-tight md:text-4xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Keep replacements boring and traceable.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              The deck should change image-by-image. Every replacement needs a slide job, a source path, and a consent check.
            </p>
          </div>

          <ol className="space-y-3">
            {replacementWorkflow.map((item, index) => (
              <li key={item} className="grid grid-cols-[40px_1fr] gap-3 rounded-md border border-border bg-card p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-muted/35 py-12" id="governance">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-2 text-sm uppercase tracking-widest text-accent">DGR and board path</p>
            <h2
              className="text-3xl font-light leading-tight md:text-4xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Show what exists now and what is still landing.
            </h2>
            <div className="mt-6 space-y-4">
              {timelineItems.map((period) => (
                <div key={period.period} className="rounded-md border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground">{period.period}</p>
                  <ul className="mt-3 space-y-2">
                    {period.items.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-4">
            <h3 className="text-lg font-semibold">Advisory group to board story</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Use this as the people layer behind the governance slide. Keep it framed as the current advisory group
              and the path to the right board structure, not as a finished board unless the legal work has landed.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {advisoryGroup.map((person) => (
                <div key={person.name} className="rounded-md border border-border bg-background p-3">
                  <p className="text-sm font-semibold text-foreground">{person.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{person.title}</p>
                  {person.org && <p className="mt-1 text-xs text-muted-foreground">{person.org}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
