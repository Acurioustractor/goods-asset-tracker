import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MediaSwapZone, type SwapFolder } from '@/components/admin/media-swap-picker';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { createClient } from '@/lib/supabase/server';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import {
  COMMUNITY_PATHWAYS,
  PATHWAY_STAGES,
  communityPathway,
  type EvidenceState,
  type ModuleState,
} from '@/lib/data/community-pathways';

export function generateStaticParams() {
  return COMMUNITY_PATHWAYS.map((pathway) => ({ id: pathway.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pathway = communityPathway(id);
  // noindex on BOTH branches, deliberately. Ben 2026-07-25: out of the menus for now. These are
  // the per-community pages, so they carry more detail than the index, not less: named modules,
  // evidence states, and items marked "Confirm together" that are NOT yet confirmed with that
  // community. Missing the detail pages would have left the sensitive half indexable.
  const robots = { index: false, follow: false } as const;
  return pathway
    ? { title: `${pathway.name} community pathway`, description: pathway.invitation, robots }
    : { robots };
}

const evidenceLabel: Record<EvidenceState, string> = {
  verified: 'Verified',
  'community-confirmation': 'Confirm together',
  'not-assessed': 'Not yet assessed',
};

const moduleStyle: Record<ModuleState, string> = {
  requested: 'border-[#b9c5ac] bg-[#f4f7f0] text-[#405039]',
  exploring: 'border-[#e7c894] bg-[#fff9ed] text-[#76521f]',
  later: 'border-[#d8d2c8] bg-[#f7f5f1] text-[#625c52]',
  'not-assessed': 'border-[#dde1e4] bg-[#f7f8f9] text-[#68717a]',
};

const moduleLabel: Record<ModuleState, string> = {
  requested: 'Requested',
  exploring: 'Explore together',
  later: 'Possible later',
  'not-assessed': 'Not assessed',
};

export default async function CommunityPathwayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pathway = communityPathway(id);
  if (!pathway) notFound();

  const activeStage = PATHWAY_STAGES.findIndex((stage) => stage.id === pathway.stage);
  const overrideSlug = `pathways-${pathway.id}`;
  const overrides = getStoryOverrides(overrideSlug);
  const getMedia = (key: string, fallback: string) => overrides[key] || fallback;
  const getMediaAlt = (key: string, fallback: string) =>
    overrides[key]
      ? `Selected media for the ${pathway.name} pathway; provenance to confirm before publication`
      : fallback;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const canSwap = !!user || process.env.NODE_ENV !== 'production';
  const communityTag = pathway.id === 'utopia' ? 'community:utopia-homelands' : `community:${pathway.id}`;
  const mediaFolders: SwapFolder[] = [
    { label: pathway.name, emoji: '📍', tags: [communityTag] },
    ...(pathway.id === 'oonchiumpa'
      ? [
          { label: 'Oonchiumpa people', emoji: '👥', tags: ['participant:oonchiumpa-young-people'] },
          { label: 'Alice build', emoji: '🛠', tags: ['event:alice-build'] },
        ]
      : []),
    ...(pathway.id === 'utopia'
      ? [{ label: 'May delivery', emoji: '🚚', tags: ['community:utopia-homelands', 'event:bed-delivery'] }]
      : []),
    ...(pathway.id === 'tennant-creek'
      ? [{ label: 'Tennant Creek voices', emoji: '💬', tags: ['community:tennant-creek'] }]
      : []),
    { label: 'All media library', emoji: '🗂', tags: [] },
  ];

  return (
    <div className="min-h-screen bg-[#fbf8f1]">
      <section className="border-b border-[#e6dfd1] bg-white">
        <div className="container mx-auto max-w-7xl px-5 py-5">
          <Link
            href="/pathways"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#5f584e] hover:text-[#a64f35]"
          >
            <ArrowLeft className="h-4 w-4" /> All pathways
          </Link>
        </div>
      </section>

      <section className="border-b border-[#e6dfd1] bg-[linear-gradient(145deg,#f4eadb_0%,#fbf8f1_56%,#eef1e9_100%)]">
        <div className="container mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1fr_0.72fr] lg:py-20">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a64f35]">
              <MapPinned className="h-4 w-4" /> {pathway.region}
            </p>
            <h1 className="mt-4 font-display text-4xl text-[#2b2a26] md:text-6xl">{pathway.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#625b50]">{pathway.invitation}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#2b2a26] px-4 py-2 text-xs font-semibold text-white">
                {pathway.stageLabel}
              </span>
              <span className="rounded-full border border-[#d5cabc] bg-white/70 px-4 py-2 text-xs font-semibold text-[#5c554b]">
                Evidence: {evidenceLabel[pathway.evidenceState]}
              </span>
              <span className="rounded-full border border-[#d5cabc] bg-white/70 px-4 py-2 text-xs font-semibold text-[#5c554b]">
                Media: {evidenceLabel[pathway.mediaState]}
              </span>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-[0_18px_50px_rgba(69,57,39,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a64f35]">Relationship</p>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="flex items-center gap-2 font-semibold text-[#37332e]"><UserRound className="h-4 w-4" /> Community lead</dt>
                <dd className="mt-1.5 leading-6 text-[#6b6358]">{pathway.communityLead}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#37332e]">Organisation</dt>
                <dd className="mt-1.5 leading-6 text-[#6b6358]">{pathway.leadOrganisation}</dd>
              </div>
              <div className="rounded-2xl bg-[#f5f0e8] p-4">
                <dt className="font-semibold text-[#37332e]">Decision needed next</dt>
                <dd className="mt-2 leading-6 text-[#5f584e]">{pathway.nextDecision}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="border-b border-[#e6dfd1] bg-white">
        <div className="container mx-auto max-w-7xl overflow-x-auto px-5 py-6">
          <ol className="flex min-w-[860px] items-center">
            {PATHWAY_STAGES.map((stage, index) => (
              <li key={stage.id} className="flex flex-1 items-center">
                <div className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    index < activeStage ? 'bg-[#6f815f] text-white' : index === activeStage ? 'bg-[#a64f35] text-white' : 'bg-[#eee9e0] text-[#7b7468]'
                  }`}>
                    {index < activeStage ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span className={`text-xs font-semibold ${index === activeStage ? 'text-[#a64f35]' : 'text-[#625b50]'}`}>
                    {stage.label}
                  </span>
                </div>
                {index < PATHWAY_STAGES.length - 1 && <div className="mx-3 h-px flex-1 bg-[#ddd5c9]" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <main className="container mx-auto max-w-7xl px-5 py-14 md:py-20">
        {pathway.caseStudy && (
          <section className="mb-20 overflow-hidden rounded-[2rem] border border-[#dfd4c4] bg-white shadow-[0_24px_70px_rgba(67,55,35,0.08)]">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative min-h-[360px] lg:min-h-[620px]">
                <Image
                  src={getMedia('hero', pathway.caseStudy.hero.src)}
                  alt={pathway.caseStudy.hero.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="object-cover"
                />
                {canSwap && (
                  <MediaSwapZone
                    slug={overrideSlug}
                    overrideKey="hero"
                    currentUrl={getMedia('hero', pathway.caseStudy.hero.src)}
                    tagQuery={[communityTag]}
                    kind="photo"
                    label="choose hero"
                    broadTag={communityTag}
                    folders={mediaFolders}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 pt-24 text-white md:p-9">
                  <p className="max-w-lg text-sm leading-6 text-white/85">{pathway.caseStudy.hero.alt}</p>
                </div>
              </div>
              <div className="flex flex-col justify-center p-7 md:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a64f35]">
                  {pathway.caseStudy.eyebrow}
                </p>
                <h2 className="mt-4 font-display text-3xl leading-tight text-[#2b2a26] md:text-5xl">
                  {pathway.caseStudy.headline}
                </h2>
                <p className="mt-6 text-base leading-8 text-[#625b50]">
                  {pathway.caseStudy.summary}
                </p>
                <figure className="mt-8 border-l-2 border-[#c9613c] pl-5">
                  <blockquote className="font-display text-xl leading-8 text-[#2b2a26]">
                    “{pathway.caseStudy.quote.text}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-[#6b6358]">
                    <strong className="text-[#37332e]">{pathway.caseStudy.quote.name}</strong>
                    <span className="block">{pathway.caseStudy.quote.context}</span>
                  </figcaption>
                </figure>
              </div>
            </div>

            <div className="grid border-t border-[#e6dfd3] md:grid-cols-3">
              {pathway.caseStudy.proof.map((item) => (
                <div key={item.label} className="border-b border-[#e6dfd3] p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                  <p className="font-display text-4xl text-[#2b2a26]">{item.value}</p>
                  <p className="mt-2 font-semibold text-[#37332e]">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#746c60]">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-10 bg-[#f7f1e8] p-7 md:p-12 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a64f35]">What happened</p>
                <div className="mt-6 space-y-7">
                  {pathway.caseStudy.story.map((beat, index) => (
                    <article key={beat.title} className="grid grid-cols-[2rem_1fr] gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2b2a26] text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-[#302d28]">{beat.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#6b6358]">{beat.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {pathway.caseStudy.gallery.map((photo, index) => (
                  <div
                    key={photo.src}
                    className={`relative overflow-hidden rounded-2xl ${index === 0 ? 'col-span-2 aspect-[16/8]' : 'aspect-square'}`}
                  >
                    <Image
                      src={getMedia(`gallery.${index}`, photo.src)}
                      alt={getMediaAlt(`gallery.${index}`, photo.alt)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 35vw"
                      className="object-cover transition duration-500 hover:scale-[1.02]"
                    />
                    {canSwap && (
                      <MediaSwapZone
                        slug={overrideSlug}
                        overrideKey={`gallery.${index}`}
                        currentUrl={getMedia(`gallery.${index}`, photo.src)}
                        tagQuery={[communityTag]}
                        kind="photo"
                        label={`choose photo ${index + 1}`}
                        broadTag={communityTag}
                        folders={mediaFolders}
                      />
                    )}
                  </div>
                ))}
                <p className="col-span-2 mt-2 text-xs leading-5 text-[#7a7266]">
                  <strong className="text-[#4a453e]">Media basis:</strong>{' '}
                  {pathway.caseStudy.mediaBasis}
                  {pathway.caseStudy.gallery.some((_, index) => overrides[`gallery.${index}`]) ? (
                    <> Manually selected replacements must have their place, people and public-use status confirmed before publication.</>
                  ) : null}
                </p>
              </div>
            </div>

            {pathway.caseStudy.video && (
              <div className="bg-[#1c1a17] p-5 md:p-10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#e5aa90]">
                  {pathway.caseStudy.video.title}
                </p>
                <div className="relative">
                  <video
                    controls
                    preload="metadata"
                    poster={getMedia('video.poster', pathway.caseStudy.video.poster)}
                    className="aspect-video w-full rounded-2xl bg-black object-cover"
                  >
                    <source src={getMedia('video.src', pathway.caseStudy.video.src)} type="video/mp4" />
                  </video>
                  {canSwap && (
                    <MediaSwapZone
                      slug={overrideSlug}
                      overrideKey="video"
                      currentUrl={getMedia('video.src', pathway.caseStudy.video.src)}
                      tagQuery={[communityTag]}
                      kind="video"
                      label="choose video"
                      broadTag={communityTag}
                      folders={mediaFolders}
                      compoundFields={{ url: 'src', thumb: 'poster' }}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="grid gap-8 p-7 md:p-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl bg-[#c9613c] p-7 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">The fundable next step</p>
                <p className="mt-4 font-display text-2xl leading-9">{pathway.caseStudy.nextAsk}</p>
                {pathway.caseStudy.statusNote && (
                  <p className="mt-5 border-t border-white/25 pt-5 text-sm leading-6 text-white/75">
                    {pathway.caseStudy.statusNote}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a64f35]">Go deeper</p>
                <div className="mt-4 space-y-3">
                  {pathway.caseStudy.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group block rounded-2xl border border-[#e1d8c9] p-4 transition hover:border-[#c9613c]"
                    >
                      <span className="flex items-center justify-between gap-3 font-semibold text-[#302d28]">
                        {item.label}
                        <ArrowRight className="h-4 w-4 text-[#a64f35] transition group-hover:translate-x-1" />
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[#746c60]">{item.note}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="support-menu">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a64f35]">Choose support</p>
            <h2 className="mt-3 font-display text-3xl text-[#2b2a26] md:text-4xl">A menu, not a fixed program</h2>
            <p className="mt-4 leading-7 text-[#6b6358]">
              These are working options. A module only becomes part of the delivery plan
              after the community confirms it.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {pathway.modules.map((item) => (
              <article key={item.id} className="rounded-2xl border border-[#e2d9ca] bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-[#302d28]">{item.name}</h3>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${moduleStyle[item.state]}`}>
                    {moduleLabel[item.state]}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6b6358]">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-[#e1d8c9] bg-white p-7">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#718461]" />
              <h2 className="font-display text-2xl text-[#2b2a26]">Evidence boundary</h2>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#625b50]">{pathway.evidenceNote}</p>
          </article>
          <article className="rounded-3xl border border-[#e1d8c9] bg-white p-7">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-6 w-6 text-[#a64f35]" />
              <h2 className="font-display text-2xl text-[#2b2a26]">Stories and media</h2>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#625b50]">{pathway.mediaNote}</p>
          </article>
        </section>

        <section className="mt-16 rounded-3xl bg-[#2b2a26] p-7 text-white md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e6b59e]">Next actions</p>
              <h2 className="mt-3 font-display text-3xl">Move at the speed of agreement</h2>
              <p className="mt-4 text-sm leading-7 text-white/65">
                Goods prepares each step with the people involved. The community lead
                confirms the record before the pathway advances.
              </p>
            </div>
            <ol className="grid gap-3">
              {pathway.nextActions.map((action, index) => (
                <li key={action} className="flex items-start gap-4 rounded-2xl bg-white/7 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/12 text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-6 text-white/85">{action}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl border border-[#ded5c7] bg-[#f3ede4] p-7 md:flex-row md:items-center">
          <div>
            <p className="flex items-center gap-2 font-semibold text-[#37332e]">
              <MessageCircle className="h-5 w-5 text-[#a64f35]" /> Conversation-first
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b6358]">
              Use this pathway in a phone call, Google Meet or on-Country conversation.
              Return the summary for correction before turning it into a proposal.
            </p>
          </div>
          <Link
            href="/partner"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#a64f35] px-5 py-3 text-sm font-semibold text-white hover:bg-[#8f422d]"
          >
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
