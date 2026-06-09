import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPartnerDashboard, type OwnershipStage } from '@/lib/data/partner-dashboards';
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
function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg px-4 py-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
      <p className="font-display text-2xl leading-none sm:text-3xl" style={{ color: RUST }}>{value}</p>
      <p className="mt-1.5 text-xs leading-snug" style={{ color: `${CHARCOAL}b3` }}>{label}</p>
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
    'On the table and designed with community from the first line. Nothing gets built until the people who will run it have shaped it.',
  built:
    'Made and commissioned on country. The plant exists, the press works, and the first goods come off it.',
  operating:
    'Running day to day, making beds and parts on country. Local people on the tools, learning every part of how it works.',
  'community-run':
    'The community holds the operation. The roster, the maintenance, and the call on what gets made sit with local hands.',
  'community-owned':
    'The community owns the plant, the income it makes, and what happens next. This is the destination, and it is still ahead of us.',
};

export default async function PartnerDashboardPage({ params }: Props) {
  const { slug } = await params;
  const partner = getPartnerDashboard(slug);
  if (!partner) notFound();

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
  const washers = stats ? `${stats.washersWorking} / ${stats.washersDeployed}` : '—';
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

  // Community voice (Empathy Ledger, consent-gated).
  const insights = await empathyLedger.getProjectInsights().catch(() => null);
  const themes = (insights?.themes ?? []).slice(0, 6);
  const quotes = (insights?.topQuotes ?? []).slice(0, 3);
  const hasVoice = themes.length > 0 || quotes.length > 0;

  // The one secured figure (Xero-reconciled). Never a fresh client-side sum.
  const secured = verifiedFinancials.revenueReceived;
  const asAt = verifiedFinancials.lastUpdated;

  // Consent-gated gallery: only documented items reach the page.
  const gallery = partner.gallery.filter((g) => g.consent === 'documented');

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
    { id: 'path', label: 'The path', grade: 'not-yet' },
    { id: 'assets', label: 'Community-owned assets', grade: 'not-yet' },
    { id: 'in-service', label: 'In service now', grade: 'counted' },
    ...(partner.funderImpact ? [{ id: 'your-part', label: 'Your part in this', grade: 'counted' } as NavItem] : []),
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
              <span className="mt-1 text-[10px] uppercase sm:text-xs" style={{ color: `${CHARCOAL}99` }}>On Country · Partner dashboard</span>
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
                  <Image src={partner.heroImage.src} alt={partner.heroImage.alt} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 420px" />
                </div>
                {partner.heroImage.caption ? (
                  <figcaption className="px-4 py-2.5 text-[11px]" style={{ color: `${CHARCOAL}99` }}>{partner.heroImage.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>

          {/* Counted answers only. Modelled figures live in "In service now". */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value={beds} label="Beds in community" />
            <HeroStat value={communities} label="Communities" />
            <HeroStat value={washers} label="Washing machines live / deployed" />
            <HeroStat value={fmtAUD(secured)} label="Secured to date" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <ConfidenceChip grade="counted" />
            <p className="text-xs" style={{ color: `${CHARCOAL}80` }}>Live from the asset register and Xero-reconciled, as at {asAt}.</p>
          </div>

          {partner.dataSovereigntyLine ? (
            <p className="mt-6 max-w-2xl border-l-2 pl-4 text-sm italic leading-relaxed" style={{ borderColor: SAGE, color: `${CHARCOAL}b3` }}>
              {partner.dataSovereigntyLine}
            </p>
          ) : null}

          <div className="mt-7 rounded-lg p-5" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>How sure are we</p>
            <ConfidenceLegend />
          </div>
        </div>
      </section>

      {/* ---- Long scroll with the sticky rail ---- */}
      <DashboardScroll sections={nav}>
        {/* The goal */}
        <Section id="goal" eyebrow="The goal" title="Where we are heading" posture="Direction, not measurement">
          <p className="max-w-2xl text-lg leading-relaxed" style={{ color: `${CHARCOAL}dd` }}>{partner.goalStatement}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed" style={{ color: `${CHARCOAL}99` }}>
            Across this page, a good moved is the output. What changes for people, and who owns the means of making the next one, is the outcome.
          </p>
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
        </Section>

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
            We are building a recycled-plastic plant on country, collect, shred, melt, press, that is designed to leave our hands.
            The community becomes the operator, then the owner, of the means of making the next bed.
          </p>
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
          title="What is already on country, and still working"
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
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide" style={{ color: RUST }}>From the field</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {gallery.map((g) => (
                  <figure key={g.src} className="overflow-hidden rounded-lg bg-white" style={{ border: '1px solid #E8DED4' }}>
                    <div className="relative aspect-[4/3]">
                      <Image src={g.src} alt={g.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 280px" />
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          ) : null}
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
                  {partner.funderImpact.moments.map((m) => (
                    <div key={m.title} className="rounded-lg p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: SAGE }}>{m.date}</p>
                      <p className="mt-1.5 text-sm font-medium leading-snug" style={{ color: CHARCOAL }}>{m.title}</p>
                      {m.detail ? <p className="mt-1 text-xs leading-relaxed" style={{ color: `${CHARCOAL}99` }}>{m.detail}</p> : null}
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

        {/* Community voice */}
        {hasVoice ? (
          <Section id="voice" eyebrow="In their words" title="What the people closest to this say" posture="Consented, qualitative">
            <p className="mb-6 max-w-2xl text-sm leading-relaxed" style={{ color: `${CHARCOAL}bf` }}>
              Drawn from consented stories on Empathy Ledger. The quality signal is the themes and the voices that come up across the work, not a single satisfaction score. Where a voice is absent, consent is not yet given, not that there is no story.
            </p>
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
            {quotes.length > 0 ? (
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
          Elders past, present and emerging. This work is done on country, with country, for country.
        </p>
      </section>
    </main>
  );
}
