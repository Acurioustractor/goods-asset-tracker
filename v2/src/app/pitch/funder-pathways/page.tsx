import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Handshake,
  MapPin,
  MessageCircle,
  PackageCheck,
  Repeat2,
  ShieldCheck,
  ShoppingBag,
  Users,
  Wrench,
} from 'lucide-react';
import { MediaSwapZone, type SwapFolder } from '@/components/admin/media-swap-picker';
import { COMMUNITY_PATHWAYS } from '@/lib/data/community-pathways';
import { PATHWAY_STAGES, PUBLIC_STAGES, type PublicStage } from '@/lib/data/pathway-stages';
import { CanonicalPitchNotice } from '@/components/pitch/pitch-surface-notice';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Community pathways for funders | Goods on Country',
  description:
    'A practical way for communities, funders and customers to build community-controlled production together.',
};

const featuredIds = ['utopia', 'tennant-creek', 'oonchiumpa'] as const;

const entryPoints = [
  {
    label: 'I’m a community',
    title: 'Tell us what would be useful.',
    description:
      'Begin with a yarn about what you want, what already exists and how much support would help.',
    action: 'Start with a conversation',
    href: '/contact',
    icon: Users,
    tone: 'bg-[#e7efdf]',
  },
  {
    label: 'I want to fund',
    title: 'Resource a confirmed pathway.',
    description:
      'Support one requested module, a complete local pathway or the shared system behind them.',
    action: 'See ways to fund',
    href: '#fund',
    icon: CircleDollarSign,
    tone: 'bg-[#f3d7c0]',
  },
  {
    label: 'I want to buy',
    title: 'Create demand that lasts.',
    description:
      'Purchase proven products or build a contract that can support dependable local production.',
    action: 'Buy the Stretch Bed',
    href: '/shop/stretch-bed-single',
    icon: ShoppingBag,
    tone: 'bg-[#eee4d5]',
  },
];

// The six stages come from pathway-stages.ts (the single source of truth). This page only
// decides which icon sits on each one.
const STAGE_ICONS: Record<PublicStage, typeof MessageCircle> = {
  yarn: MessageCircle,
  shape: Users,
  resource: ClipboardCheck,
  deliver: Wrench,
  transfer: Handshake,
  grow: Repeat2,
};

const publicSteps = PUBLIC_STAGES.map((stage) => ({
  title: stage.label,
  line: stage.line,
  holds: stage.holds,
  icon: STAGE_ICONS[stage.id],
}));

const pathwayFields = [
  'Community ambition',
  'What already exists',
  'Selected modules',
  'Operator and intended owner',
  'Visible scope and budget',
  'Immediate decision',
  'Evidence and media permissions',
  'Community-defined success',
];

const roles = [
  {
    name: 'Community partner',
    line: 'Chooses the ambition, operator, pace, evidence and ownership direction.',
  },
  {
    name: 'Goods. on Country',
    line: 'Turns the request into a practical, fundable pathway and coordinates delivery.',
  },
  {
    name: 'Goods.',
    line: 'Provides proven products, components, quality and commercial capability.',
  },
  {
    name: 'ACT',
    line: 'Stewards relationships, learning, patient support and movement toward control.',
  },
];

const fundingLayers = [
  {
    number: '01',
    label: 'One useful module',
    example: 'Urapuntja',
    description:
      'Equipment, freight, installation, training and support around a confirmed community request.',
  },
  {
    number: '02',
    label: 'A local pathway',
    example: 'Tennant Creek',
    description:
      'A staged partnership connecting existing people and places to one useful operational test.',
  },
  {
    number: '03',
    label: 'Community production',
    example: 'Oonchiumpa',
    description:
      'Plant, workforce, contracts, operations and an agreed movement of capability and control.',
  },
  {
    number: '04',
    label: 'The enabling system',
    example: 'Across communities',
    description:
      'Product development, quality, coordination, evidence and patient support shared across pathways.',
  },
];

const valueDestinations = [
  {
    name: 'Community-held value',
    points: ['Paid local roles', 'Assets and operating capability', 'Production and contract revenue'],
  },
  {
    name: 'Goods operating revenue',
    points: ['Products and components', 'Implementation and training', 'Agreed ongoing support'],
  },
  {
    name: 'Shared capacity',
    points: ['Product quality', 'Partnership coordination', 'Evidence and learning infrastructure'],
  },
];

function selectedHero(id: string, fallback: string) {
  return getStoryOverrides(`pathways-${id}`).hero || fallback;
}

export default async function FunderPathwaysPage() {
  const pathways = featuredIds
    .map((id) => COMMUNITY_PATHWAYS.find((pathway) => pathway.id === id))
    .filter((pathway) => pathway?.caseStudy);
  const utopia = pathways.find((pathway) => pathway?.id === 'utopia');
  const overrideSlug = 'pitch-funder-pathways';
  const overrides = getStoryOverrides(overrideSlug);
  const getMedia = (key: string, fallback: string) => overrides[key] || fallback;
  const getMediaAlt = (key: string, fallback: string) =>
    overrides[key]
      ? 'Selected media for the funder pathways page; provenance and public-use status must be confirmed'
      : fallback;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const canSwap = !!user || process.env.NODE_ENV !== 'production';
  const mediaFolders: SwapFolder[] = [
    { label: 'Oonchiumpa', emoji: '📍', tags: ['community:oonchiumpa'] },
    { label: 'Alice build', emoji: '🛠', tags: ['event:alice-build'] },
    { label: 'Utopia Homelands', emoji: '📍', tags: ['community:utopia-homelands'] },
    { label: 'Utopia delivery', emoji: '🚚', tags: ['community:utopia-homelands', 'event:bed-delivery'] },
    { label: 'Tennant Creek', emoji: '📍', tags: ['community:tennant-creek'] },
    { label: 'All media library', emoji: '🗂', tags: [] },
  ];

  return (
    <main className="min-h-screen bg-[#f8f3ea] text-[#211f1b]">
      <CanonicalPitchNotice />
      <header className="border-b border-[#ded4c5] bg-[#f8f3ea]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-5">
          <Link href="/pathways" className="block">
            <Image
              src="/brand/canonical/goods-on-country-primary-ink.png"
              alt="Goods on Country"
              width={260}
              height={86}
              className="h-auto w-[180px] md:w-[215px]"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-[#776e62] sm:block">
              Community pathways
            </span>
            <Link
              href="/pathways"
              className="inline-flex min-h-11 items-center rounded-full border border-[#cfc2b1] px-4 py-2 text-sm font-semibold transition hover:bg-white"
            >
              Live pathways
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-[#d8cdbd]">
        <div className="mx-auto grid min-h-[760px] max-w-[1600px] lg:grid-cols-[1.04fr_0.96fr]">
          <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b65738]">
              Community chooses. We build the pathway.
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              Start with what a community says it needs.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#61584d] md:text-xl">
              Goods on Country turns a community request into a visible, priced pathway.
              Funders and customers resource it. Capability, assets, evidence and control
              stay with—or move toward—the community.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#take-part"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#c8613d] px-6 py-3 font-semibold text-white transition hover:bg-[#ad4f32]"
              >
                Find your way in <ArrowDown className="h-4 w-4" />
              </Link>
              <Link
                href="#worked-pathway"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#cfc2b1] bg-white/50 px-6 py-3 font-semibold transition hover:bg-white"
              >
                See one request become a pathway
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#ded4c5] pt-6 text-sm text-[#756b5f]">
              <span><strong className="text-[#211f1b]">3</strong> live community pathways</span>
              <span><strong className="text-[#211f1b]">8</strong> selectable modules</span>
              <span><strong className="text-[#211f1b]">1</strong> shared operating system</span>
            </div>
          </div>
          <div className="relative min-h-[500px] overflow-hidden bg-[#cabdac] lg:min-h-full">
            <Image
              src={getMedia('hero.main', '/images/build/build-041.jpg')}
              alt={getMediaAlt(
                'hero.main',
                'Oonchiumpa team members building a Stretch Bed in Alice Springs',
              )}
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
              priority
            />
            {canSwap ? (
              <MediaSwapZone
                slug={overrideSlug}
                overrideKey="hero.main"
                currentUrl={getMedia('hero.main', '/images/build/build-041.jpg')}
                tagQuery={['event:alice-build']}
                kind="photo"
                label="choose hero image"
                broadTag="event:alice-build"
                folders={mediaFolders}
              />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-7 pt-28 text-white md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f1b49c]">
                The model is already happening
              </p>
              <p className="mt-3 max-w-xl font-display text-3xl leading-tight">
                Oonchiumpa young people and team members are already making. The next
                pathway moves production capability locally.
              </p>
              <Link href="/pathways/oonchiumpa" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold">
                See the Oonchiumpa pathway <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="take-part" className="scroll-mt-24 border-b border-[#d8cdbd] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b65738]">
              Choose your front door
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
              You do not need to understand the whole system to take part.
            </h2>
          </div>
          <div className="mt-12 divide-y divide-[#d8cdbd] border-y border-[#d8cdbd]">
            {entryPoints.map((entry) => {
              const Icon = entry.icon;
              return (
                <article
                  key={entry.label}
                  className="grid gap-5 py-7 md:grid-cols-[0.42fr_0.9fr_1.15fr_auto] md:items-center md:gap-8"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-full ${entry.tone}`}>
                      <Icon className="h-5 w-5 text-[#8c4935]" />
                    </span>
                    <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8c4935]">
                      {entry.label}
                    </p>
                  </div>
                  <h3 className="font-display text-2xl leading-tight md:text-3xl">{entry.title}</h3>
                  <p className="max-w-xl text-base leading-7 text-[#665d51]">{entry.description}</p>
                  <Link
                    href={entry.href}
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#a64f35]"
                  >
                    {entry.action} <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 border-b border-[#d8cdbd] bg-[#211f1b] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e5a78e]">
                One shared process
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                From a yarn to community-led growth.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/65 lg:justify-self-end">
              A community can begin anywhere and choose how much support it wants. No
              equipment is prescribed and no ownership structure is assumed.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-6">
            {publicSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="min-h-56 bg-[#211f1b] p-6">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-[#e5a78e]" />
                    <span className="text-xs font-semibold text-white/35">0{index + 1}</span>
                  </div>
                  <h3 className="mt-9 font-display text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/58">{step.line}</p>
                  <p className="mt-4 border-t border-white/12 pt-3 text-xs uppercase tracking-[0.14em] text-[#e5a78e]">
                    Community holds: {step.holds}
                  </p>
                </article>
              );
            })}
          </div>
          <p className="mt-6 text-sm text-white/45">
            Internally, each pathway is tracked through {PATHWAY_STAGES.length} operating steps,
            each rolling up to one of these six. Publicly the promise stays simple: yarn first,
            make the work visible, agree it together, and move it into community hands.
          </p>
        </div>
      </section>

      {utopia?.caseStudy ? (
        <section id="worked-pathway" className="scroll-mt-24 border-b border-[#d8cdbd] bg-[#ece2d3]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b65738]">
                  One request, made concrete
                </p>
                <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                  Jane asks about a shredder. This is what happens next.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-[#665d51]">
                  The request is not treated as a grant category or expanded into a fixed
                  program. It becomes one visible pathway that Urapuntja can change, pause
                  or approve.
                </p>
                <div className="mt-8 overflow-hidden rounded-[2rem]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={getMedia(
                        'worked.utopia',
                        selectedHero(utopia.id, utopia.caseStudy.hero.src),
                      )}
                      alt={getMediaAlt('worked.utopia', utopia.caseStudy.hero.alt)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                    {canSwap ? (
                      <MediaSwapZone
                        slug={overrideSlug}
                        overrideKey="worked.utopia"
                        currentUrl={getMedia(
                          'worked.utopia',
                          selectedHero(utopia.id, utopia.caseStudy.hero.src),
                        )}
                        tagQuery={['community:utopia-homelands']}
                        kind="photo"
                        label="choose worked example"
                        broadTag="community:utopia-homelands"
                        folders={mediaFolders}
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-[#cdbda7] bg-[#f8f3ea] shadow-[0_22px_70px_rgba(63,46,26,0.1)]">
                <div className="border-b border-[#d8cdbd] bg-white px-6 py-5 md:px-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b65738]">
                        Community pathway card
                      </p>
                      <h3 className="mt-2 font-display text-3xl">Urapuntja · shredder module</h3>
                    </div>
                    <span className="rounded-full bg-[#e7efdf] px-3 py-2 text-xs font-semibold text-[#516448]">
                      Scope together
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-[#d8cdbd]">
                  {[
                    ['1. Community request', 'Explore a shredder that can support practical youth activity and local recycling capability.'],
                    ['2. Confirm before pricing', 'Operator, site, plastic feedstock, safety, maintenance and intended ownership.'],
                    ['3. Price visibly', 'Equipment, freight, installation, training, initial materials and agreed ongoing support.'],
                    ['4. Funding decision', 'A funder backs only the scope Urapuntja confirms. Costs and responsibilities remain separate.'],
                    ['5. Local delivery', 'Install and train alongside the nominated operator. Solve early operational issues together.'],
                    ['6. Community choice', 'Urapuntja decides whether the pathway stops, continues or grows into another module.'],
                  ].map(([title, line]) => (
                    <div key={title} className="grid gap-2 px-6 py-5 md:grid-cols-[0.42fr_1fr] md:px-8">
                      <p className="text-sm font-semibold text-[#3a352e]">{title}</p>
                      <p className="text-sm leading-6 text-[#665d51]">{line}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4 bg-[#211f1b] px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between md:px-8">
                  <p className="max-w-md text-sm leading-6 text-white/65">
                    No purchase or public promise is made until Urapuntja confirms the pathway.
                  </p>
                  <Link href="/pathways/utopia" className="inline-flex min-h-11 items-center gap-2 font-semibold">
                    Open the evidence <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-[#d8cdbd] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b65738]">
                The common record
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
                Every pathway answers the same eight questions.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#665d51]">
                This pathway card becomes the shared object across the community conversation,
                budget, delivery system, funder update and community-approved story.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-[#d8cdbd] bg-[#d8cdbd] sm:grid-cols-2">
              {pathwayFields.map((field, index) => (
                <div key={field} className="flex min-h-24 items-center gap-4 bg-[#f8f3ea] p-5">
                  <span className="text-xs font-semibold text-[#b65738]">0{index + 1}</span>
                  <p className="font-semibold">{field}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pathways" className="scroll-mt-24 border-b border-[#d8cdbd]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b65738]">
                The model in practice
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                Same process. Different community choices.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#6b6257]">
              These are not tiers of readiness. Each community begins where it is useful
              and moves at the speed of agreement.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pathways.map((pathway) => {
              if (!pathway?.caseStudy) return null;
              const requested = pathway.modules.filter((item) => item.state === 'requested');
              return (
                <article
                  key={pathway.id}
                  className="group overflow-hidden rounded-[2rem] border border-[#d8cdbd] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_65px_rgba(66,50,31,0.12)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#ddd4c8]">
                    <Image
                      src={getMedia(
                        `pathway.${pathway.id}`,
                        selectedHero(pathway.id, pathway.caseStudy.hero.src),
                      )}
                      alt={getMediaAlt(`pathway.${pathway.id}`, pathway.caseStudy.hero.alt)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                    {canSwap ? (
                      <MediaSwapZone
                        slug={overrideSlug}
                        overrideKey={`pathway.${pathway.id}`}
                        currentUrl={getMedia(
                          `pathway.${pathway.id}`,
                          selectedHero(pathway.id, pathway.caseStudy.hero.src),
                        )}
                        tagQuery={[
                          pathway.id === 'utopia'
                            ? 'community:utopia-homelands'
                            : `community:${pathway.id}`,
                        ]}
                        kind="photo"
                        label={`choose ${pathway.name}`}
                        broadTag={
                          pathway.id === 'utopia'
                            ? 'community:utopia-homelands'
                            : `community:${pathway.id}`
                        }
                        folders={mediaFolders}
                      />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 pt-20 text-white">
                      <p className="flex items-center gap-2 text-xs font-semibold">
                        <MapPin className="h-4 w-4 text-[#e5a78e]" /> {pathway.region}
                      </p>
                      <h3 className="mt-2 font-display text-3xl">{pathway.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b65738]">
                      {pathway.caseStudy.eyebrow}
                    </p>
                    <p className="mt-4 text-lg font-semibold leading-7">{pathway.invitation}</p>
                    <div className="mt-5 min-h-14 space-y-2">
                      {requested.length > 0 ? (
                        requested.map((module) => (
                          <p key={module.id} className="flex items-start gap-2 text-sm leading-6 text-[#655c50]">
                            <Check className="mt-1 h-4 w-4 shrink-0 text-[#718461]" />
                            {module.name}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm leading-6 text-[#655c50]">
                          No module is selected until the community confirms it.
                        </p>
                      )}
                    </div>
                    <div className="mt-6 border-t border-[#ded4c7] pt-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f4d38]">
                        Next useful decision
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#554e45]">{pathway.caseStudy.nextAsk}</p>
                    </div>
                    <Link
                      href={`/pathways/${pathway.id}`}
                      className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#a64f35]"
                    >
                      Open the pathway and evidence <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8cdbd] bg-[#ece2d3]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b65738]">
                Clear responsibility
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
                One movement toward community control.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#665d51]">
                Funding can enter at any layer. The community’s decision rights and
                ownership direction do not change.
              </p>
            </div>
            <div className="divide-y divide-[#cfc2b1] border-y border-[#cfc2b1]">
              {roles.map((role, index) => (
                <article key={role.name} className="grid gap-3 py-5 md:grid-cols-[4rem_0.65fr_1fr] md:items-center">
                  <span className="text-xs font-semibold text-[#b65738]">0{index + 1}</span>
                  <h3 className="font-display text-2xl">{role.name}</h3>
                  <p className="text-sm leading-6 text-[#665d51]">{role.line}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="fund" className="scroll-mt-24 border-b border-[#d8cdbd] bg-[#211f1b] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e5a78e]">
              Ways to fund
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
              Fund the scale that matches your mandate.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Every commitment names what is funded, what stays local, what Goods is
              accountable for and what evidence returns.
            </p>
          </div>
          <div className="mt-12 divide-y divide-white/15 border-y border-white/15">
            {fundingLayers.map((layer) => (
              <article
                key={layer.label}
                className="grid gap-4 py-7 md:grid-cols-[5rem_0.8fr_0.5fr_1.3fr] md:items-center md:gap-8"
              >
                <span className="font-display text-3xl text-[#e5a78e]">{layer.number}</span>
                <h3 className="font-display text-2xl">{layer.label}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">
                  {layer.example}
                </p>
                <p className="text-sm leading-6 text-white/62">{layer.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8cdbd] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b65738]">
                How money and value move
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
                Capital enters. Capability stays.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#665d51] lg:justify-self-end">
              The exact entity, contract and allocation are agreed for each pathway.
              Every budget separates community-held value, Goods operating revenue and
              the shared capacity needed to support more than one community.
            </p>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-[0.65fr_1.35fr]">
            <article className="rounded-[2rem] bg-[#c8613d] p-7 text-white md:p-9">
              <PackageCheck className="h-6 w-6 text-[#ffd2bd]" />
              <h3 className="mt-6 font-display text-3xl">What funding buys</h3>
              <div className="mt-6 space-y-3">
                {[
                  'Listening and pathway design',
                  'Equipment, freight and installation',
                  'Training, safety and quality',
                  'Materials and working stock',
                  'Paid local roles and coordination',
                  'Maintenance, evidence and support',
                ].map((item) => (
                  <p key={item} className="flex items-start gap-2 text-sm leading-6 text-white/78">
                    <Check className="mt-1 h-4 w-4 shrink-0" /> {item}
                  </p>
                ))}
              </div>
            </article>
            <div className="grid gap-4 sm:grid-cols-3">
              {valueDestinations.map((destination) => (
                <article key={destination.name} className="rounded-[2rem] border border-[#d8cdbd] bg-[#f8f3ea] p-6">
                  <h3 className="font-display text-2xl">{destination.name}</h3>
                  <div className="mt-6 space-y-3">
                    {destination.points.map((point) => (
                      <p key={point} className="flex items-start gap-2 text-sm leading-5 text-[#5e564b]">
                        <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-[#718461]" />
                        {point}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-5 flex items-start gap-4 rounded-[2rem] border border-[#b8c9ad] bg-[#e6efdf] p-6 md:items-center md:p-8">
            <Repeat2 className="mt-1 h-6 w-6 shrink-0 text-[#58704d] md:mt-0" />
            <p className="font-display text-xl leading-8 text-[#2d3928] md:text-2xl">
              Contracts create demand. Demand supports local production. Production builds
              revenue and evidence. Community chooses what grows next.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f3ea]">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b65738]">
                Accountability
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
                Evidence returns to community first.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Community confirms the request, operator and decision rights.',
                'Budgets separate assets, training, delivery and ongoing support.',
                'Media stays linked to person, place, permission and audience.',
                'Progress is reported against the agreed pathway, not imposed outcomes.',
              ].map((item) => (
                <div key={item} className="flex gap-3 border-t border-[#d8cdbd] py-5">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-[#718461]" />
                  <p className="text-sm leading-6 text-[#5f574c]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-14 overflow-hidden rounded-[2rem] bg-[#211f1b] p-8 text-white md:p-12">
            <Building2 className="absolute -bottom-16 -right-10 h-72 w-72 text-white/[0.035]" />
            <div className="relative grid gap-9 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-4xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e5a78e]">
                  The next useful step
                </p>
                <p className="mt-4 font-display text-3xl leading-tight md:text-5xl">
                  Bring one community request, one funding mandate or one purchasing need.
                  We will scope the smallest useful next step together.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/partner"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c8613d] px-6 py-3 font-semibold text-white"
                >
                  Start a conversation <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pathways"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-6 py-3 font-semibold"
                >
                  Explore live pathways
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#e0d6c8] pt-7 text-xs text-[#766d61]">
            <p className="flex items-center gap-2">
              <Factory className="h-4 w-4 text-[#b65738]" />
              Working brief. Budgets and ownership structures remain community- and opportunity-specific.
            </p>
            <p>{PATHWAY_STAGES.length} internal stages · 3 live case studies · 1 community-controlled model</p>
          </div>
        </div>
      </section>
    </main>
  );
}
