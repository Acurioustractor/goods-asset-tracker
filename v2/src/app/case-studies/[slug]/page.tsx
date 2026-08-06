/**
 * /case-studies/[slug] — the "how we did it" pack for a proven run.
 *
 * Two readers at once: a community or organisation asking "how would this work for us",
 * and a funder asking "has this actually happened". Counts derive from the register,
 * quotes render from the storyteller registry (cleared tiers only), and the film drops in
 * automatically when its canon-videos slot is filled — until then the slot renders a
 * coming-soon card rather than pretending.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CASE_STUDIES, caseStudy } from '@/lib/data/case-studies';
import { COMMUNITY_BED_CANON } from '@/lib/data/community-canonical';
import { communityRecord, isPublishable } from '@/lib/data/community-record';
import { getStoryteller } from '@/lib/data/storyteller-registry';
import { canonVideo } from '@/lib/data/canon-videos';
import { videoUrl } from '@/lib/data/media';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CASE_STUDIES.filter((c) => c.published).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} — Goods on Country`,
    description: study.standfirst,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudy(slug);
  if (!study) notFound();

  const canon = COMMUNITY_BED_CANON.find((c) => c.id === study.communityId);
  const record = communityRecord(study.communityId);
  const washers = record?.assets && isPublishable(record.assets) ? record.assets.value.washers : 0;
  const beds = canon ? canon.basketBeds + canon.stretchBeds : 0;
  const film = canonVideo(study.videoKey);

  const voices = study.voiceNames
    .map((name) => {
      const person = getStoryteller(name);
      if (!person || person.tier !== 'external') return null;
      const quote =
        person.quotes.find((q) => q.status === 'primary') ??
        person.quotes.find((q) => q.status === 'approved');
      return quote ? { person, quote } : null;
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  return (
    <article className="bg-[#fbf8f1] text-[#2b2a26]">
      {/* Hero */}
      <header className="relative min-h-[70svh] overflow-hidden bg-[#171714] text-[#fbf8f1]">
        <Image src={study.hero.src} alt={study.hero.alt} fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="relative mx-auto flex min-h-[70svh] max-w-[1200px] flex-col justify-end px-6 pb-12 pt-24 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e88461]">
            Case study · {study.country}
          </p>
          <h1 className="goods-pitch-display mt-4 max-w-3xl text-4xl leading-[1.02] md:text-6xl">
            {study.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{study.standfirst}</p>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/25 pt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
            <div><dd className="goods-pitch-display text-2xl normal-case tracking-normal text-white">{beds}</dd><dt>beds in homes</dt></div>
            {canon && canon.stretchBeds > 0 && (
              <div><dd className="goods-pitch-display text-2xl normal-case tracking-normal text-white">{canon.stretchBeds}</dd><dt>pressed at our facility</dt></div>
            )}
            {washers > 0 && (
              <div><dd className="goods-pitch-display text-2xl normal-case tracking-normal text-white">{washers}</dd><dt>washing machines</dt></div>
            )}
          </dl>
        </div>
      </header>

      {/* Partner */}
      <section className="border-b border-[#d9d1c3] px-6 py-10 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <p className="max-w-3xl text-lg leading-8 text-[#6d675c]">
            This run was commissioned by{' '}
            {study.partner.nameCleared ? (
              <strong className="text-[#2b2a26]">{study.partner.name}</strong>
            ) : (
              study.partner.role
            )}
            . The order, the timing and the destination were theirs; designed with community starts
            with whose ask it is.
          </p>
        </div>
      </section>

      {/* The steps */}
      <section className="px-6 py-12 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">How it worked</p>
          <ol className="mt-8 space-y-12">
            {study.steps.map((step, i) => (
              <li key={step.title} className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c45c3e]">0{i + 1}</p>
                  <h2 className="goods-pitch-display mt-2 text-3xl leading-tight">{step.title}</h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[#6d675c]">{step.body}</p>
                </div>
                {step.photo && (
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image src={step.photo.src} alt={step.photo.alt} fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Film slot */}
      <section className="border-y border-[#d9d1c3] bg-[#171714] px-6 py-12 text-[#fbf8f1] md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e88461]">The film</p>
          {film ? (
            <video controls preload="none" poster={film.poster ?? undefined} className="mt-6 w-full">
              <source src={videoUrl(film.desktopFile)} type="video/mp4" />
            </video>
          ) : (
            <div className="mt-6 flex min-h-[240px] items-center justify-center border border-dashed border-white/30">
              <p className="max-w-md text-center text-sm leading-6 text-white/60">
                The film of this run is being cut now. It drops in here the day it clears review,
                with the same consent gate as every voice on this page.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Voices */}
      {voices.length > 0 && (
        <section className="px-6 py-12 md:px-10">
          <div className="mx-auto max-w-[1200px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">In their words</p>
            {voices.map(({ person, quote }) => (
              <figure key={person.name} className="mt-6 border-l-2 border-[#c45c3e] pl-5">
                <blockquote className="goods-pitch-display max-w-3xl text-xl leading-snug md:text-2xl">
                  &quot;{quote.text}&quot;
                </blockquote>
                <figcaption className="mt-3 text-sm text-[#7a7363]">
                  {person.name}
                  {person.role ? `, ${person.role}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Momentum */}
      <section className="border-t border-[#d9d1c3] px-6 py-12 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">What happens next</p>
          <ul className="mt-6 max-w-3xl space-y-4">
            {study.momentum.map((line) => (
              <li key={line} className="border-l-2 border-[#d9d1c3] pl-5 text-base leading-7 text-[#6d675c]">{line}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* For communities */}
      <section className="border-t border-[#d9d1c3] bg-[#f1ece4] px-6 py-12 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="goods-pitch-display text-3xl leading-tight">Could this work where you are?</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-2">
            {study.forCommunities.map((line, i) => (
              <li key={line} className="flex gap-4">
                <span className="goods-pitch-display text-2xl text-[#c45c3e]">0{i + 1}</span>
                <p className="text-base leading-7 text-[#2b2a26]">{line}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="bg-[#c45c3e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d26a4a]">
              Start a yarn
            </Link>
            <Link href="/pitch/road" className="border border-[#2b2a26]/30 px-6 py-3 text-sm font-semibold hover:border-[#2b2a26]">
              The whole road
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
