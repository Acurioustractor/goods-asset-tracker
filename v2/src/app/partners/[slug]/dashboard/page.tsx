import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPartnerDashboard, type OwnershipStage } from '@/lib/data/partner-dashboards';
import { getDashboardImageOverrides, resolveDashImg } from '@/lib/data/partner-dashboard-images';
import { getAssetStats } from '@/lib/data/impact-fetcher';
import { getRoadmap } from '@/lib/data/roadmap';
import { verifiedFinancials } from '@/lib/data/compendium';
import { empathyLedger } from '@/lib/empathy-ledger/client';
import { DashboardScroll, type NavItem } from '@/components/dashboard/dashboard-scroll';
import { Section } from '@/components/dashboard/section';
import { ConfidenceChip, ConfidenceLegend } from '@/components/dashboard/confidence-chip';
import { CapitalStack } from '@/components/dashboard/capital-stack';
import { OwnershipJourney, type JourneyStage } from '@/components/dashboard/ownership-journey';
import { HealthPathway } from '@/components/dashboard/health-pathway';
import { WasherJourney } from '@/components/dashboard/washer-journey';

// Always live: read the asset register fresh each request.
export const dynamic = 'force-dynamic';

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPartnerDashboard(slug);
  return {
    title: p ? `${p.partnerName} — Goods on Country partner dashboard` : 'Partner dashboard',
    description: p?.thesisLine,
    robots: { index: false, follow: false },
  };
}

const fmtAUD = (n: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(n);

// A counted hero answer.
function HeroStat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="rounded-lg px-4 py-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
      <p className="font-display text-2xl leading-none sm:text-3xl" style={{ color: RUST }}>{value}</p>
      <p className="mt-1.5 text-xs leading-snug" style={{ color: `${CHARCOAL}b3` }}>{label}</p>
      {note ? <p className="mt-1 text-[11px] leading-snug" style={{ color: `${CHARCOAL}66` }}>{note}</p> : null}
    </div>
  );
}

// A graded metric card for the "in service" section.
function MetricCard({
  value,
  label,
  comparison,
  pill,
  grade,
  note,
}: {
  value: string;
  label: string;
  comparison: string;
  pill?: { text: string; live?: boolean };
  grade: 'counted' | 'modelled';
  note?: string;
}) {
  return (
    <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-3xl leading-none sm:text-4xl" style={{ color: RUST }}>{value}</p>
        {pill ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ backgroundColor: pill.live ? '#E6EDDD' : '#EEE9E3', color: pill.live ? '#4F6138' : '#6A5E54' }}
          >
            {pill.live ? <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SAGE }} /> : null}
            {pill.text}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm font-semibold" style={{ color: CHARCOAL }}>{label}</p>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{comparison}</p>
      <div className="mt-3">
        <ConfidenceChip grade={grade} note={note} />
      </div>
    </div>
  );
}

const STAGE_ORDER: OwnershipStage[] = ['planned', 'built', 'operating', 'community-run', 'community-owned'];
const STAGE_LABEL: Record<OwnershipStage, string> = {
  planned: 'Planned',
  built: 'Built',
  operating: 'Operating',
  'community-run': 'Community run',
  'community-owned': 'Community owned',
};
// What each rung of the ownership ladder means. Editorial, stage-generic, forward.
const STAGE_MEANING: Record<OwnershipStage, string> = {
  planned:
    'We have been working closely with Oonchiumpa on plans for the first on Country production facility. It will be staffed by 100% Indigenous staff and built to support young people into long-term employment.',
  built:
    'We have a production facility making beds at Witta Farm, with someone who lives there employed to make the beds. The next stage is an Oonchiumpa staff member doing a ten-week train-the-trainer experience at the farm, in preparation to support the Alice Springs production facility.',
  operating:
    'Running day to day, making beds and parts on Country. Local people on the tools, learning every part of how it works.',
  'community-run':
    'The community holds the operation. The roster, the maintenance, and the call on what gets made sit with local hands.',
  'community-owned':
    'The community owns the plant, the income it makes, and what happens next. This is the destination, and it is still ahead of us.',
};

export default async function PartnerDashboardPage({ params }: Props) {
  const { slug } = await params;
  const partner = getPartnerDashboard(slug);
  if (!partner) notFound();

  // EL-backed image overrides. The admin picker (/admin/dashboard-images) writes
  // data/partner-dashboard-images.json; every image slot resolves to its override
  // or the config fallback. resolveGal pre-resolves a gallery array by index.
  const imgOv = getDashboardImageOverrides(slug);
  function resolveGal<T extends { src: string; alt: string }>(arr: T[], prefix: string): T[] {
    return arr.map((g, i) => ({ ...g, ...resolveDashImg(imgOv, `${prefix}.${i}`, { src: g.src, alt: g.alt }) }) as T);
  }

  // Live metrics from the asset register.
  let stats: Awaited<ReturnType<typeof getAssetStats>> | null = null;
  try {
    stats = await getAssetStats();
  } catch {
    stats = null;
  }

  const beds = stats ? stats.totalBeds.toLocaleString() : '—';
  const communities = stats ? String(stats.communitiesServed) : '—';
  const stretch = stats ? stats.stretchBedsDeployed.toLocaleString() : '—';
  const plasticT = stats ? `${((stats.stretchBedsDeployed * 20) / 1000).toFixed(2)} t` : '—';
  const washers = stats ? String(stats.washersWorking) : '—';
  const washersUnconfirmed = stats ? stats.washersDeployed - stats.washersWorking : 0;
  const peopleReached = stats ? Math.round(stats.totalBeds * 2.5) : null;
  const communityList = stats
    ? stats.communityBreakdown
        .map((c) => c.community)
        .filter((c) => c && c !== 'Unknown' && c !== 'Pending Delivery')
    : [];

  // Roadmap (live), with config fallback.
  const roadmap = await getRoadmap();
  const kanban = roadmap?.kanban ?? partner.kanban;

  // Community voice (Empathy Ledger, consent-gated). Featured voices are the
  // named, attribution-confirmed storytellers from the partner config; the
  // anonymous EL quote grid only renders when no featured voices are set.
  const insights = await empathyLedger.getProjectInsights().catch(() => null);
  const themes = (insights?.themes ?? []).slice(0, 6);
  const quotes = (insights?.topQuotes ?? []).slice(0, 3);
  const featuredVoices = partner.featuredVoices ?? [];
  // More community voices, pulled live from Empathy Ledger's public syndication
  // API (no login). Text-only by design: EL avatar URLs live on a host we do not
  // proxy, so we showcase name + place + theme rather than risk a broken portrait.
  // The named featured voices above are excluded so nobody appears twice.
  const featuredNames = new Set(featuredVoices.map((v) => v.name.toLowerCase()));
  const ledgerVoices = (await empathyLedger.getProjectStorytellers({ limit: 24 }).catch(() => []))
    .map((s) => ({
      name: s.name,
      location: s.location,
      isElder: s.isElder,
      theme: s.themes?.[0]?.displayName || s.themes?.[0]?.name || null,
    }))
    .filter((s) => Boolean(s.name && !featuredNames.has(s.name.toLowerCase())))
    .slice(0, 6);
  const hasVoice =
    featuredVoices.length > 0 || themes.length > 0 || quotes.length > 0 || ledgerVoices.length > 0;

  // The one secured figure (Xero-reconciled). Never a fresh client-side sum.
  const secured = verifiedFinancials.revenueReceived;
  const asAt = verifiedFinancials.lastUpdated;

  // Consent-gated galleries: only documented items reach the page.
  const gallery = resolveGal(partner.gallery, 'gallery').filter((g) => g.consent === 'documented');
  const facilityGallery = resolveGal(partner.facilityGallery ?? [], 'facility').filter((g) => g.consent === 'documented');
  const partnership = partner.communityPartnership;
  const nextChapter = partner.nextChapter;
  const partnershipPhotos = resolveGal(partnership?.photos ?? [], 'partnership').filter((g) => g.consent === 'documented');

  // Single-image + nested-image slots resolved the same way.
  const heroImg = partner.heroImage
    ? resolveDashImg(imgOv, 'hero', { src: partner.heroImage.src, alt: partner.heroImage.alt })
    : null;
  const momentsResolved = (partner.funderImpact?.moments ?? []).map((m, i) =>
    m.image ? { ...m, image: { ...m.image, ...resolveDashImg(imgOv, `moment.${i}`, { src: m.image.src, alt: m.image.alt }) } } : m,
  );
  const featuredVoicesResolved = featuredVoices.map((v, i) =>
    v.image ? { ...v, image: { ...v.image, ...resolveDashImg(imgOv, `voice.${i}`, { src: v.image.src, alt: v.image.alt }) } } : v,
  );

  // The ownership journey: one rung per stage, with facilities parked where they are.
  const milestones = partner.ownershipMilestones ?? [];
  const ownershipStages: JourneyStage[] = STAGE_ORDER.map((stage) => ({
    key: stage,
    label: STAGE_LABEL[stage],
    meaning: STAGE_MEANING[stage],
    facilities: milestones
      .filter((m) => m.stage === stage)
      .map((m) => ({ facility: m.facility, hostCommunity: m.hostCommunity })),
  }));

  // Nav rail with a confidence dot per section (the epistemic map).
  const nav: NavItem[] = [
    { id: 'heading', label: "Where we're heading", grade: 'counted' },
    { id: 'goal', label: 'The goal' },
    { id: 'health', label: 'Health hardware', grade: 'modelled' },
    ...(nextChapter ? [{ id: 'next-chapter', label: 'The next chapter', grade: 'not-yet' } as NavItem] : []),
    { id: 'path', label: 'The path', grade: 'not-yet' },
    { id: 'assets', label: 'Community-owned assets', grade: 'not-yet' },
    { id: 'in-service', label: 'In service now', grade: 'counted' },
    { id: 'washer', label: 'The washing machine', grade: 'not-yet' },
    ...(partner.funderImpact ? [{ id: 'your-part', label: 'Your part in this', grade: 'counted' } as NavItem] : []),
    ...(partnership ? [{ id: 'partnership', label: `${partnership.name.split(' ')[0]} partnership` } as NavItem] : []),
    ...(hasVoice ? [{ id: 'voice', label: 'Community voice' } as NavItem] : []),
    { id: 'whats-next', label: "What's next", grade: 'not-yet' },
    { id: 'back-it', label: 'Back the next stage' },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      {/* Funder PDF path: drop the orientation chrome, unpin sticky headers, keep
          cards whole across page breaks, and print the brand palette (not blanks). */}
      <style>{`@media print {
        nav[aria-label="On this page"], [data-print-hide] { display: none !important; }
        .sticky { position: static !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        figure, li, .rounded-lg, .rounded-xl { break-inside: avoid; }
        section { break-inside: auto; }
        section header { break-after: avoid; break-inside: avoid; }
        a[href]::after { content: '' !important; }
      }`}</style>

      {/* ---- Hero (full-width band, tracked by the rail) ---- */}
      <section id="heading" className="scroll-mt-24 px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="inline-flex flex-col leading-none">
              <span className="font-display text-3xl sm:text-4xl" style={{ color: CHARCOAL }}>Goods</span>
              <span className="mt-1 text-[10px] uppercase sm:text-xs" style={{ color: `${CHARCOAL}99` }}>On Country · Always-on partner dashboard</span>
            </Link>
            <div className="rounded-lg bg-white px-4 py-3 shadow-sm" style={{ border: '1px solid #E8DED4' }}>
              <Image src="/images/partners/snow-foundation.png" alt={partner.partnerName} width={400} height={160} priority className="h-12 w-auto" />
            </div>
          </div>

          <div className={partner.heroImage ? 'grid items-center gap-8 lg:grid-cols-[3fr_2fr]' : undefined}>
            <div>
              <p className="mb-4 text-xs uppercase tracking-wide" style={{ color: RUST }}>{partner.partnerName}</p>
              <h1 className="mb-4 font-display text-4xl leading-[1.05] sm:text-5xl" style={{ color: CHARCOAL }}>{partner.heroLine}</h1>
              <p className="max-w-3xl font-display text-xl leading-snug sm:text-2xl" style={{ color: RUST }}>{partner.thesisLine}</p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>{partner.intro}</p>
            </div>
            {partner.heroImage ? (
              <figure className="overflow-hidden rounded-xl bg-white" style={{ border: '1px solid #E8DED4' }}>
                <div className="relative aspect-[4/3]">
                  <Image src={heroImg!.src} alt={heroImg!.alt} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 420px" />
                </div>
                {partner.heroImage.caption ? (
                  <figcaption className="px-4 py-2.5 text-[11px]" style={{ color: `${CHARCOAL}99` }}>{partner.heroImage.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>

          {/* Counted answers only. Modelled figures live in "In service now". */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value={beds} label="Beds in community" note={stretch ? `${stretch} are Stretch Beds` : undefined} />
            <HeroStat value={communities} label="Communities" />
            <HeroStat value={washers} label="Washing machines live" />
            <HeroStat value={fmtAUD(secured)} label="Total grants and support, all sources" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ConfidenceChip grade="counted" />
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ backgroundColor: '#E6EDDD', color: '#4F6138' }}>
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: SAGE }} />
              Always on
            </span>
            <p className="text-xs" style={{ color: `${CHARCOAL}80` }}>Live from the asset register and Xero-reconciled, as at {asAt}. This page is not a one-off report. It updates as the work does, so it is always current.</p>
          </div>

          {partner.dataSovereigntyLine ? (
            <p className="mt-6 max-w-2xl border-l-2 pl-4 text-sm italic leading-relaxed" style={{ borderColor: SAGE, color: `${CHARCOAL}b3` }}>
              {partner.dataSovereigntyLine}
            </p>
          ) : null}

          <div className="mt-7 rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>How to read this page</p>
            <p className="mb-4 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>Every number carries one of these labels, and they follow you down the page. It is the same honest grading we hold ourselves to in our investor-readiness work, so you always know what is counted, what is modelled, and what is still ahead.</p>
            <ConfidenceLegend />
          </div>
        </div>
      </section>

      {/* ---- Long scroll with the sticky rail ---- */}
      <DashboardScroll sections={nav}>
        {/* The goal */}
        <Section id="goal" eyebrow="The goal" title="Where we are heading" posture="Direction, not measurement">
          <p className="max-w-2xl text-lg leading-relaxed" style={{ color: `${CHARCOAL}dd` }}>{partner.goalStatement}</p>
          {facilityGallery.length > 0 ? (
            <figure className="mt-8 overflow-hidden rounded-xl bg-white" style={{ border: '1px solid #E8DED4' }}>
              <div className="relative aspect-[16/9]">
                <Image src={facilityGallery[0].src} alt={facilityGallery[0].alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 860px" />
              </div>
              <figcaption className="px-4 py-2.5 text-[11px]" style={{ color: `${CHARCOAL}99` }}>{facilityGallery[0].alt}</figcaption>
            </figure>
          ) : null}
        </Section>

        {/* Why this is health hardware (the chain a funder can stand behind) */}
        <Section
          id="health"
          eyebrow="Why it matters"
          title="A good bed is health hardware"
          confidence={{ grade: 'modelled', note: 'Each link is graded. The deployments are counted; the prevention pathway is published, modelled evidence we contribute to, not a Goods clinical result.' }}
        >
          <p className="max-w-2xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            A washing machine is not convenience and a bed is not furniture. Clean bedding and a bed off the
            floor sit inside the documented prevention chain for rheumatic heart disease, the condition that
            started Goods in the first place.
          </p>
          <div className="mt-8">
            <HealthPathway strategyLine={partner.healthStrategyLine} />
          </div>
          <figure className="mt-8 overflow-hidden rounded-xl bg-white" style={{ border: '1px solid #E8DED4' }}>
            <div className="relative aspect-[16/9]">
              <Image src="/images/media-pack/lying-on-stretch-bed.jpg" alt="Person lying on a Stretch Bed on Country" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 860px" />
            </div>
          </figure>
          <figure className="mt-4 overflow-hidden rounded-xl bg-white" style={{ border: '1px solid #E8DED4' }}>
            <div className="relative aspect-[16/9]">
              <Image src="/images/product/stretch-bed-overview.png" alt="The Stretch Bed, all parts labelled" fill className="object-contain p-4" sizes="(max-width: 1024px) 100vw, 860px" />
            </div>
          </figure>
        </Section>

        {/* The next chapter: grants -> blended finance, and the invitation (Snow). */}
        {nextChapter ? (
          <Section
            id="next-chapter"
            eyebrow="The next chapter"
            title="From grants to blended finance"
            confidence={{ grade: 'not-yet', note: 'Direction and live conversations. The match is contingent, the capital is being raised, and nothing here is secured.' }}
          >
            <p className="max-w-2xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>{nextChapter.intro}</p>

            {/* The capital arc: grant funded -> blended raise -> self sustaining */}
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {nextChapter.arc.map((a, i) => {
                const isNow = a.state === 'now';
                const isAhead = a.state === 'ahead';
                const accent = isNow ? RUST : isAhead ? '#B8AEA4' : SAGE;
                const badge = a.state === 'done' ? 'Where we began' : isNow ? 'We are here' : 'Still ahead';
                const pillBg = isNow ? '#F6E4DE' : isAhead ? '#EEE9E3' : '#E6EDDD';
                const pillFg = isNow ? '#9A4023' : isAhead ? '#6A5E54' : '#4F6138';
                return (
                  <div key={a.stage} className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', borderTop: `3px solid ${accent}` }}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent }}>{String(i + 1).padStart(2, '0')}</p>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ backgroundColor: pillBg, color: pillFg }}>{badge}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{a.stage}</p>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{a.meaning}</p>
                  </div>
                );
              })}
            </div>

            {/* What the matched-finance program is (the lever) */}
            <div className="mt-6 rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>The matched-finance lever</p>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>{nextChapter.qbeNote}</p>
            </div>

            {/* The invitation to this funder */}
            <div className="mt-6 rounded-xl p-6 sm:p-7" style={{ backgroundColor: CREAM, border: `1px solid ${RUST}33`, borderLeft: `3px solid ${RUST}` }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>{nextChapter.invitation.eyebrow}</p>
              <p className="mt-1.5 font-display text-xl leading-snug sm:text-2xl" style={{ color: CHARCOAL }}>{nextChapter.invitation.title}</p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>{nextChapter.invitation.body}</p>
              <div className="mt-4"><ConfidenceChip grade="not-yet" note="An exploration. Not a commitment, and not secured." /></div>
            </div>
          </Section>
        ) : null}

        {/* The path (forward reframe) */}
        <Section
          id="path"
          eyebrow="The path"
          title="What it takes, and how the money is built"
          confidence={{ grade: 'not-yet', note: 'Forward targets and live conversations, not money in the bank. Only the secured figure is received.' }}
        >
          <CapitalStack securedToDate={secured} />
        </Section>

        {/* Community-owned assets (the heart) */}
        <Section
          id="assets"
          eyebrow="The assets that stay"
          title="What the community comes to own"
          confidence={{ grade: 'not-yet', note: 'What exists today is counted; the ownership transfer is in design. Stages are named, not claimed done.' }}
        >
          <p className="max-w-2xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            We are building a recycled-plastic plant on Country, collect, shred, melt, press, that is designed to leave our hands.
            The community becomes the operator, then the owner, of the means of making the next bed.
          </p>
          {facilityGallery.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {facilityGallery.map((g, i) => (
                <figure
                  key={g.src}
                  className={`overflow-hidden rounded-lg bg-white ${i === 0 ? 'col-span-2 md:col-span-1' : ''}`}
                  style={{ border: '1px solid #E8DED4' }}
                >
                  <div className="relative aspect-[4/3]">
                    <Image src={g.src} alt={g.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                  <figcaption className="px-3 py-2 text-[11px] leading-snug" style={{ color: `${CHARCOAL}99` }}>{g.alt}</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
          <div className="mt-8">
            <OwnershipJourney stages={ownershipStages} />
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed" style={{ color: `${CHARCOAL}99` }}>
            Owned means the community holds the plant, the income it makes, the maintenance, and the decisions. That transfer is the point, and it is still ahead of us.
          </p>
        </Section>

        {/* In service now (the honest proof) */}
        <Section
          id="in-service"
          eyebrow="The proof, honestly graded"
          title="What is already on Country, and still working"
          confidence={{ grade: 'counted', note: 'Delivery counts are counted. Plastic and people reached are modelled assumptions, labelled below.' }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              value={beds}
              label="Beds in community"
              comparison={`Across ${communities} communities, still in homes.`}
              pill={{ text: 'in service' }}
              grade="counted"
              note="Distinct asset-register records. A bed delivered is an output; a bed still in use is closer to the outcome."
            />
            <MetricCard
              value={stretch}
              label="Recycled-plastic Stretch Beds"
              comparison="Each one diverts about 20kg of HDPE from landfill."
              grade="counted"
            />
            <MetricCard
              value={washers}
              label="Washing machines"
              comparison={washersUnconfirmed > 0 ? `${washersUnconfirmed} deployed machines are not reporting live. We name them rather than round them into the win.` : 'All deployed machines reporting live.'}
              pill={{ text: 'live / deployed', live: true }}
              grade="counted"
              note="Working count is hand-confirmed; telemetry coverage is partial."
            />
            <MetricCard
              value={plasticT}
              label="Plastic kept out of landfill"
              comparison="Modelled at about 20kg per Stretch Bed."
              grade="modelled"
              note="Assumes ~20kg HDPE per Stretch Bed. Not weighed per unit."
            />
            <MetricCard
              value={peopleReached ? `~${peopleReached.toLocaleString()}` : '—'}
              label="People reached"
              comparison="Modelled at about 2.5 people per bed."
              grade="modelled"
              note="A planning assumption (~2.5 per bed), not a headcount."
            />
          </div>
          {communityList.length > 0 ? (
            <p className="mt-5 text-sm leading-relaxed" style={{ color: `${CHARCOAL}b3` }}>
              <span className="font-semibold" style={{ color: CHARCOAL }}>The {communityList.length} communities: </span>
              {communityList.join('  ·  ')}
            </p>
          ) : null}

          {gallery.length > 0 ? (
            <div className="mt-8">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>From the field</p>
              <p className="mb-3 text-sm font-medium" style={{ color: CHARCOAL }}>Most recent trip to Utopia Homelands, May 2026</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {gallery.map((g) => (
                  <figure key={g.src} className="overflow-hidden rounded-lg bg-white" style={{ border: '1px solid #E8DED4' }}>
                    <div className="relative aspect-[4/3]">
                      <Image src={g.src} alt={g.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                  </figure>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/field-notes/utopia-may-2026" className="text-sm font-medium underline underline-offset-2" style={{ color: RUST }}>
                  Read the full Utopia trip story →
                </Link>
              </div>
            </div>
          ) : null}
        </Section>

        {/* The washing machine path: ideation, V1, cost-down R&D, home ownership */}
        <Section
          id="washer"
          eyebrow="Pakkimjalki Kari"
          title="The washing machine, from idea to a home purchase"
          confidence={{ grade: 'not-yet', note: 'Deployment counts are live from the register. Unit costs and the price target are founder estimates, labelled modelled. The destination is a design goal we have not reached.' }}
        >
          <p className="max-w-2xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            The bed has a sibling. Pakkimjalki Kari, named in Warumungu by Elder Dianne Stokes, is the washing
            machine built for the conditions that kill ordinary machines. It exists because clean bedding is the
            other half of the health chain above. Here is where it has come from, and where the R&D is taking it.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-[3fr_2fr]">
            <figure className="overflow-hidden rounded-xl bg-white" style={{ border: '1px solid #E8DED4' }}>
              <div className="relative aspect-[4/3]">
                <Image src="/images/product/washing-machine.jpg" alt="The Pakkimjalki Kari at sunset, Tennant Creek" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 560px" />
              </div>
              <figcaption className="px-4 py-2.5 text-[11px]" style={{ color: `${CHARCOAL}99` }}>The Pakkimjalki Kari, Tennant Creek, July 2025.</figcaption>
            </figure>
            <div className="flex flex-col gap-4">
              <figure className="overflow-hidden rounded-xl" style={{ border: '1px solid #E8DED4' }}>
                <div className="relative aspect-[4/3]">
                  <Image src="/images/people/dianne-stokes.jpg" alt="Elder Dianne Stokes, Warumungu and Warlmanpa Elder" fill className="object-cover object-top" sizes="(max-width: 1024px) 50vw, 320px" />
                </div>
              </figure>
              <div className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: SAGE }}>January 2026</p>
                <p className="text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>Elder Dianne Stokes names the machine</p>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>Warumungu and Warlmanpa Elder, living on her Country in Tennant Creek. She gave the machine its name in Warumungu language. The name travels with every unit.</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <WasherJourney
              washersLine={
                stats
                  ? `${stats.washersWorking} machines in community today, placed through councils and organisations.`
                  : '14 machines in community today, placed through councils and organisations.'
              }
            />
          </div>
        </Section>

        {/* Your part in this (rendered only for partners with a funderImpact config) */}
        {partner.funderImpact ? (
          <Section
            id="your-part"
            eyebrow="Your part in this"
            title="What your backing has built"
            confidence={{ grade: 'counted', note: 'The cumulative figure is Xero-reconciled. The split is how the FY25 grant was acquitted.' }}
          >
            <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
              <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="font-display text-4xl leading-none sm:text-5xl" style={{ color: RUST }}>{partner.funderImpact.total.value}</p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: `${CHARCOAL}b3` }}>{partner.funderImpact.total.note}</p>
                <div className="mt-4"><ConfidenceChip grade="counted" /></div>
              </div>
              <div className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>{partner.funderImpact.breakdown.heading}</p>
                <ul className="space-y-3">
                  {partner.funderImpact.breakdown.items.map((it) => (
                    <li key={it.label} className="flex items-baseline justify-between gap-4">
                      <span className="text-sm leading-snug" style={{ color: `${CHARCOAL}cc` }}>{it.label}</span>
                      <span className="shrink-0 font-display text-lg" style={{ color: CHARCOAL }}>{it.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {partner.funderImpact.moments.length > 0 ? (
              <div className="mt-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>On country together</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {momentsResolved.map((m) => (
                    <div key={m.title} className="overflow-hidden rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                      {m.image ? (
                        <div className="relative aspect-[16/9] w-full">
                          <Image src={m.image.src} alt={m.image.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                        </div>
                      ) : null}
                      <div className="p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: SAGE }}>{m.date}</p>
                        <p className="mt-1.5 text-sm font-medium leading-snug" style={{ color: CHARCOAL }}>{m.title}</p>
                        {m.detail ? <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{m.detail}</p> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {partner.funderImpact.quotes.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {partner.funderImpact.quotes.map((q) => (
                  <figure key={q.attribution} className="rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                    <blockquote className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>&ldquo;{q.text}&rdquo;</blockquote>
                    <figcaption className="mt-3 text-xs uppercase tracking-wide" style={{ color: SAGE }}>{q.attribution}</figcaption>
                  </figure>
                ))}
              </div>
            ) : null}
          </Section>
        ) : null}

        {/* Community partnership (rendered only when configured) */}
        {partnership ? (
          <Section
            id="partnership"
            eyebrow="Community partnership"
            title={`${partnership.name.split(' ')[0]}: who we build with`}
            posture="Relationship, told plainly"
          >
            <p className="max-w-2xl text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>{partnership.intro}</p>

            {/* The story so far, in beats */}
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {partnership.beats.map((b, i) => (
                <div key={b.title} className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: SAGE }}>{String(i + 1).padStart(2, '0')}</p>
                  <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>{b.title}</p>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{b.body}</p>
                </div>
              ))}
            </div>

            {partnershipPhotos.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                {partnershipPhotos.map((g, i) => (
                  <figure
                    key={g.src}
                    className={`overflow-hidden rounded-lg bg-white ${i === 0 ? 'col-span-2 md:col-span-1' : ''}`}
                    style={{ border: '1px solid #E8DED4' }}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image src={g.src} alt={g.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                  </figure>
                ))}
              </div>
            ) : null}

            {partnership.quote ? (
              <figure className="mt-6 max-w-2xl rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <blockquote className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>&ldquo;{partnership.quote.text}&rdquo;</blockquote>
                <figcaption className="mt-3 text-xs uppercase tracking-wide" style={{ color: SAGE }}>{partnership.quote.attribution}</figcaption>
              </figure>
            ) : null}

            {/* Where it goes next */}
            <div className="mt-6 max-w-2xl rounded-lg p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', borderLeft: `3px solid ${RUST}` }}>
              <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>{partnership.forward.title}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: `${CHARCOAL}b3` }}>{partnership.forward.body}</p>
            </div>

            {partnership.links.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {partnership.links.map((l) => (
                  <Link key={l.href} href={l.href} className="block rounded-lg p-5 transition hover:opacity-90" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                    <p className="text-base font-medium" style={{ color: CHARCOAL }}>{l.label} →</p>
                    {l.note ? <p className="mt-1 text-sm" style={{ color: `${CHARCOAL}99` }}>{l.note}</p> : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </Section>
        ) : null}

        {/* Community voice */}
        {hasVoice ? (
          <Section id="voice" eyebrow="In their words" title="What the people closest to this say" posture="Consented, qualitative">
            <p className="mb-6 max-w-2xl text-sm leading-relaxed" style={{ color: `${CHARCOAL}bf` }}>
              Drawn from consented stories in Empathy Ledger, the community&rsquo;s own consent-managed record. You are seeing only what people have chosen to share, pulled in live with no login needed, and the community can revisit or withdraw their story at any time. The signal is the themes and voices that recur across the work, not a satisfaction score. Where a voice is absent, consent is not yet given, not that there is no story.
            </p>

            {featuredVoices.length > 0 ? (
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                {featuredVoicesResolved.map((v) => (
                  <figure key={v.name} className="flex flex-col overflow-hidden rounded-lg bg-white" style={{ border: '1px solid #E8DED4' }}>
                    {v.image ? (
                      <div className="relative aspect-[4/3]">
                        <Image src={v.image.src} alt={v.image.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      {v.context ? (
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: SAGE }}>{v.context}</p>
                      ) : null}
                      <blockquote className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>&ldquo;{v.quote}&rdquo;</blockquote>
                      <figcaption className="mt-auto pt-4">
                        <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>{v.name}</p>
                        <p className="mt-0.5 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{v.role}</p>
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            ) : null}

            {ledgerVoices.length > 0 ? (
              <div className="mb-8">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>More voices from the community ledger</p>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {ledgerVoices.map((v) => (
                    <figure key={v.name} className="flex flex-col rounded-lg bg-white p-5" style={{ border: '1px solid #E8DED4' }}>
                      <p className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>
                        {v.name}{v.isElder ? <span className="text-sm" style={{ color: SAGE }}> · Elder</span> : null}
                      </p>
                      {v.location ? <p className="mt-1 text-xs" style={{ color: `${CHARCOAL}99` }}>{v.location}</p> : null}
                      {v.theme ? <p className="mt-3 text-xs leading-relaxed" style={{ color: `${CHARCOAL}80` }}>In their story: {v.theme}</p> : null}
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}

            {themes.length > 0 ? (
              <div className="mb-8 flex flex-wrap gap-2">
                {themes.map((t) => (
                  <span key={t.name} className="rounded-full px-4 py-2 text-sm" style={{ backgroundColor: '#FFFFFF', color: CHARCOAL, border: '1px solid #E8DED4' }}>
                    {t.name.replace(/[_-]+/g, ' ').replace(/^./, (c) => c.toUpperCase())}
                    {t.storytellerCount ? <span style={{ color: `${CHARCOAL}80` }}> · {t.storytellerCount}</span> : null}
                  </span>
                ))}
              </div>
            ) : null}
            {featuredVoices.length === 0 && quotes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {quotes.map((q, i) => (
                  <figure key={i} className="rounded-lg bg-white p-6" style={{ border: '1px solid #E8DED4' }}>
                    <blockquote className="font-display text-lg leading-snug" style={{ color: CHARCOAL }}>&ldquo;{q.text}&rdquo;</blockquote>
                    {q.context ? <figcaption className="mt-4 text-xs uppercase" style={{ color: SAGE }}>{q.context}</figcaption> : null}
                  </figure>
                ))}
              </div>
            ) : null}
          </Section>
        ) : null}

        {/* What's next */}
        <Section
          id="whats-next"
          eyebrow="The next handovers"
          title="Where this goes from here"
          confidence={{ grade: 'not-yet', note: 'Forward plan. Items are by stage; nothing planned reads as done.' }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {kanban.map((col) => (
              <div key={col.heading} className="rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="mb-4 text-sm font-semibold uppercase" style={{ color: SAGE }}>{col.heading}</p>
                <ul className="space-y-3">
                  {col.items.map((it) => (
                    <li key={it.title}>
                      <p className="text-sm font-medium leading-snug" style={{ color: CHARCOAL }}>{it.title}</p>
                      {it.note ? <p className="mt-0.5 text-xs" style={{ color: `${CHARCOAL}99` }}>{it.note}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Back the next stage */}
        <Section id="back-it" eyebrow="Back the next handover" title={partner.cta.headline}>
          <div className="rounded-xl p-7 sm:p-9" style={{ backgroundColor: RUST }}>
            <p className="font-display text-2xl leading-snug sm:text-3xl" style={{ color: '#FFFFFF' }}>{partner.cta.action}</p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed" style={{ color: '#FFFFFFe6' }}>{partner.cta.supporting}</p>
            <div className="mt-6">
              {partner.cta.external ? (
                <a href={partner.cta.href} className="inline-block rounded-lg bg-white px-5 py-3 text-sm font-semibold" style={{ color: RUST }}>{partner.cta.action} →</a>
              ) : (
                <Link href={partner.cta.href} className="inline-block rounded-lg bg-white px-5 py-3 text-sm font-semibold" style={{ color: RUST }}>{partner.cta.action} →</Link>
              )}
            </div>
          </div>

          {partner.links.length > 0 ? (
            <div className="mt-8">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>Go deeper</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {partner.links.map((l) => {
                  const inner = (
                    <>
                      <p className="text-base font-medium" style={{ color: CHARCOAL }}>{l.label} →</p>
                      {l.note ? <p className="mt-1 text-sm" style={{ color: `${CHARCOAL}99` }}>{l.note}</p> : null}
                    </>
                  );
                  const cls = 'block rounded-lg p-5 transition hover:opacity-90';
                  const style = { backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' };
                  return l.external ? (
                    <a key={l.href} href={l.href} className={cls} style={style}>{inner}</a>
                  ) : (
                    <Link key={l.href} href={l.href} className={cls} style={style}>{inner}</Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </Section>
      </DashboardScroll>

      {/* Acknowledgement of Country */}
      <section className="mx-auto max-w-3xl px-5 py-14 text-center sm:px-8">
        <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}bf` }}>
          Goods on Country acknowledges the Traditional Owners of the lands on which we work, and pays respect to
          Elders past, present and emerging. This work is done on Country, with Country, for Country.
        </p>
      </section>
    </main>
  );
}
