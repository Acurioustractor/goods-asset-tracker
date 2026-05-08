import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FunderMap } from './funder-map';
import { getFunderPage } from '@/lib/data/funder-pages';
import { getFunderRecommendation } from '@/lib/data/funder-voice-resolver';
import {
  deployments,
  documentedDemand,
  communityPartners,
  getDeploymentTotals,
  getDemandTotal,
} from '@/lib/data/compendium';
import { expansionTargets, getExpansionTargetTotals } from '@/lib/data/expansion-targets';
import {
  TRACTION_STATS,
  PRODUCT_CARDS,
  BUYER_PIPELINE,
  CAPITAL_STACK,
  QBE_PROGRAM,
  INVESTMENT_THESIS,
} from '@/lib/data/funder-shared-content';

const COMMUNITY_VOICES = [
  { src: '/images/people/dianne-stokes.jpg', alt: 'Elder Dianne Stokes who named the washing machine in Warumungu' },
  { src: '/images/people/norman-frank.jpg', alt: 'Norman Frank, Tennant Creek' },
  { src: '/images/people/patricia-frank.jpg', alt: 'Patricia Frank, Tennant Creek' },
  { src: '/images/people/linda-turner.jpg', alt: 'Linda Turner' },
  { src: '/images/people/ivy.jpg', alt: 'Ivy' },
  { src: '/images/people/cliff-plummer.jpg', alt: 'Cliff Plummer' },
];

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function FunderPage({ params }: PageProps) {
  const { slug } = await params;
  const funder = getFunderPage(slug);
  if (!funder) notFound();

  // Funder-specific voice + URL pulled from the central map.
  // The resolver checks EL consent state; voice.quote will be empty when
  // the recommended storyteller is not yet consent-verified in EL.
  const recommendation = funder.urlMapKey
    ? await getFunderRecommendation(funder.urlMapKey, '')
    : null;

  // Aggregate due-diligence stats from the live compendium and expansion target list
  const deploymentTotals = getDeploymentTotals();
  const demandTotal = getDemandTotal();
  const expansionTotals = getExpansionTargetTotals();
  const states = Array.from(new Set([
    ...deployments.map((d) => d.state),
    ...expansionTargets.map((t) => t.state),
  ])).sort();
  const partnerCount = communityPartners.length;
  const demandCommunityCount = documentedDemand.length;
  // Communities researched = active deployments + expansion targets, deduped
  const allCommunityNames = new Set<string>();
  deployments.forEach((d) => allCommunityNames.add(d.community));
  expansionTargets.forEach((t) => allCommunityNames.add(t.community));
  const communitiesResearchedCount = allCommunityNames.size;

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FDF8F3', color: '#2E2E2E' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        {/* Header */}
        <header className="mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
            Investor Brief · April 2026 · Confidential
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-light mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Goods on Country
            <br />
            <span style={{ color: '#C45C3E' }}>× {funder.name}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-8" style={{ color: '#5E5E5E' }}>
            {funder.intro}
          </p>
          <figure className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/product/stretch-bed-community.jpg"
              alt="The Stretch Bed in a remote community house"
              className="w-full h-auto block"
            />
          </figure>
        </header>

        {/* Featured voice — only shown when the recommended storyteller has
            consent-clean Goods stories in Empathy Ledger. If not, the voice
            section is hidden until the consent flow completes (see
            wiki/articles/brand-comms/CONSENT_PROCESS.md). */}
        {recommendation?.voice && recommendation.voice.consentVerified && (
          <section className="mb-16">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Voice from community
            </p>
            <div
              className="grid sm:grid-cols-[160px_1fr] gap-6 sm:gap-8 p-6 sm:p-8 rounded-2xl items-start"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
            >
              <div className="aspect-square sm:aspect-auto sm:h-40 w-full rounded-xl overflow-hidden" style={{ backgroundColor: '#E8DED4' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recommendation.voice.photo}
                  alt={recommendation.voice.photoAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <blockquote
                  className="text-xl sm:text-2xl md:text-3xl font-light leading-snug mb-4"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  &ldquo;{recommendation.voice.quote}&rdquo;
                </blockquote>
                <p className="text-sm font-medium" style={{ color: '#2E2E2E' }}>
                  {recommendation.voice.name}
                </p>
                <p className="text-sm" style={{ color: '#8B9D77' }}>
                  {recommendation.voice.location} · {recommendation.voice.quoteContext}
                </p>
                {recommendation.entry.rationale && (
                  <p className="text-xs mt-4 italic" style={{ color: '#7A7A7A' }}>
                    Selected for {funder.name} because: {recommendation.entry.rationale.toLowerCase()}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* The Ask */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
            The Ask
          </p>

          <div className="space-y-4">
            {[funder.ask, ...(funder.alternativeAsks || [])].map((ask, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 md:p-8 rounded-2xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8DED4',
                }}
              >
                {ask.label && (
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C45C3E' }}>
                    {ask.label}
                  </p>
                )}
                <p className="text-2xl sm:text-3xl md:text-4xl font-light mb-3 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {ask.amount}{' '}
                  <span className="block sm:inline text-base sm:text-inherit" style={{ color: '#5E5E5E', fontSize: 'inherit' }}>
                    <span className="hidden sm:inline" style={{ fontSize: '0.6em' }}>· </span>
                    <span className="sm:text-[0.6em]">{ask.instrument}</span>
                  </span>
                </p>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#5E5E5E' }}>
                  {ask.purpose}
                </p>
              </div>
            ))}
          </div>

          {funder.closeBy && (
            <p className="text-sm mt-6" style={{ color: '#8B9D77' }}>
              Target close: {funder.closeBy}
            </p>
          )}
        </section>

        {/* Facilities on Country (optional) */}
        {funder.facility && (
          <section className="mb-16">
            {funder.facility.heroImage && (
              <figure className="mb-8 rounded-2xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={funder.facility.heroImage}
                  alt={funder.facility.heroImageAlt || ''}
                  className="w-full h-auto block"
                />
              </figure>
            )}

            <h2 className="text-2xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              {funder.facility.title}
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#5E5E5E' }}>
              {funder.facility.intro}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                  What the infrastructure includes
                </p>
                <ul className="space-y-3">
                  {funder.facility.components.map((c, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#5E5E5E' }}>
                      <span style={{ color: '#C45C3E' }}>·</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: '#2E2E2E', color: '#FDF8F3' }}>
                <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                  What it becomes
                </p>
                <ul className="space-y-3">
                  {funder.facility.becomes.map((b, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#E8DED4' }}>
                      <span style={{ color: '#C45C3E' }}>·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {funder.facility.supportImages && funder.facility.supportImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {funder.facility.supportImages.map((img, i) => (
                  <figure key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8DED4', backgroundColor: '#FFFFFF' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} className="w-full h-48 object-cover block" />
                    {img.caption && (
                      <figcaption className="p-3 text-xs leading-relaxed" style={{ color: '#5E5E5E' }}>
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Traction Stats */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Where we are right now
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {TRACTION_STATS.map((stat) => (
              <div key={stat.label} className="p-5 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
                <p className="text-3xl font-light mb-1" style={{ fontFamily: 'Georgia, serif', color: '#C45C3E' }}>
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#2E2E2E' }}>
                  {stat.label}
                </p>
                <p className="text-xs" style={{ color: '#8B9D77' }}>
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCT_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-xl overflow-hidden flex flex-col"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt={card.imageAlt} className="w-full h-48 object-cover block" />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-medium mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2E2E2E' }}>
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: '#5E5E5E' }}>
                    {card.body}
                  </p>
                  {card.link && (
                    <Link
                      href={card.link.href}
                      className="text-sm font-medium underline"
                      style={{ color: '#C45C3E' }}
                    >
                      {card.link.label} →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deployment Map */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            Where the work is happening
          </p>
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Active deployments across remote Australia
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
            <FunderMap />
          </div>
          <p className="text-xs mt-3" style={{ color: '#8B9D77' }}>
            Click any community marker to see beds delivered, deployment status, and storytellers from that place.
          </p>
        </section>

        {/* Communities Intelligence Summary */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            The depth behind the ask
          </p>
          <h2 className="text-2xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Communities intelligence snapshot
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: '#5E5E5E' }}>
            Goods has been working across remote Australia for years. Below is a summary of the
            relationships, deployments, and procurement pathways already documented in our internal
            CRM. The full breakdown lives one click away on the next page.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div
              className="p-5 rounded-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
            >
              <p className="text-3xl font-light mb-1" style={{ fontFamily: 'Georgia, serif', color: '#C45C3E' }}>
                {communitiesResearchedCount}
              </p>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#2E2E2E' }}>
                Communities researched
              </p>
              <p className="text-xs" style={{ color: '#8B9D77' }}>
                {deploymentTotals.communities} active plus {expansionTotals.count} priority expansion targets
              </p>
            </div>
            <div
              className="p-5 rounded-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
            >
              <p className="text-3xl font-light mb-1" style={{ fontFamily: 'Georgia, serif', color: '#C45C3E' }}>
                {expansionTotals.totalPopulation.toLocaleString()}
              </p>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#2E2E2E' }}>
                Population reach
              </p>
              <p className="text-xs" style={{ color: '#8B9D77' }}>
                Across the priority target list, {states.join(', ')}
              </p>
            </div>
            <div
              className="p-5 rounded-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
            >
              <p className="text-3xl font-light mb-1" style={{ fontFamily: 'Georgia, serif', color: '#C45C3E' }}>
                {expansionTotals.housingBodies}
              </p>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#2E2E2E' }}>
                Housing bodies mapped
              </p>
              <p className="text-xs" style={{ color: '#8B9D77' }}>
                Direct procurement contacts identified
              </p>
            </div>
            <div
              className="p-5 rounded-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
            >
              <p className="text-3xl font-light mb-1" style={{ fontFamily: 'Georgia, serif', color: '#C45C3E' }}>
                {partnerCount}
              </p>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#2E2E2E' }}>
                Partner organisations
              </p>
              <p className="text-xs" style={{ color: '#8B9D77' }}>
                {deploymentTotals.beds} beds delivered, ${(demandTotal / 1_000_000).toFixed(2)}M documented demand
              </p>
            </div>
          </div>

          <div
            className="p-6 rounded-xl mb-4"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C45C3E' }}>
              The community ownership model
            </p>
            <p className="text-base leading-relaxed mb-3" style={{ color: '#2E2E2E' }}>
              Funders are not just paying for beds. They are underwriting community ownership of
              the enterprise itself.
            </p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#5E5E5E' }}>
              The facility, the production process, the IP, and the revenue are all designed to
              transition into community hands over time. Aboriginal-controlled corporations like
              Oonchiumpa and PICC become the operating entity. Local people are trained as
              apprentices, then employed full-time, then promoted into supervisor and management
              roles. The IP and design files become Aboriginal-controlled, open-sourced where
              appropriate and licensed where they generate ongoing community revenue.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#5E5E5E' }}>
              This is what community ownership and employment look like in practice: a permanent
              On-Country asset that pays wages, builds skills, and stays community-owned. An
              organisation backing this model is backing the long-run sovereignty of remote
              communities, not just a one-off goods deployment. Goods Asset Register tracks every
              bed back to the family that received it, making the impact visible and verifiable
              for funders for the full life of the product.
            </p>
          </div>

          <div
            className="p-5 rounded-xl mb-6"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C45C3E' }}>
              How beds become jobs
            </p>
            <p className="text-base leading-relaxed mb-2" style={{ color: '#2E2E2E' }}>
              The On-Country facility is also an employment program.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#5E5E5E' }}>
              Two REAL Innovation Fund EOIs ($1.2M each, $2.4M total) have been submitted to DEWR
              for community-led employment pathways at PICC&apos;s Station Precinct in Townsville
              and Oonchiumpa&apos;s site in Alice Springs. Combined, the two programs target 100+
              First Nations participants over four years moving into goods manufacturing,
              hospitality, On-Country work, and a reciprocal cross-community apprentice exchange.
              Both EOIs are on the next page.
            </p>
          </div>

          <Link
            href={`/funders/${slug}/communities`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: '#2E2E2E', color: '#FDF8F3' }}
          >
            See the full due diligence →
          </Link>
        </section>

        {/* Buyer Pipeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Live buyer pipeline
          </h2>
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid #E8DED4' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr style={{ backgroundColor: '#F4ECE2' }}>
                    <th className="text-left p-3 md:p-4 font-medium whitespace-nowrap">Buyer</th>
                    <th className="text-left p-3 md:p-4 font-medium">Volume</th>
                    <th className="text-left p-3 md:p-4 font-medium whitespace-nowrap">Value</th>
                    <th className="text-left p-3 md:p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {BUYER_PIPELINE.map((row, i) => (
                    <tr key={row.buyer} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FDF8F3' }}>
                      <td className="p-3 md:p-4 font-medium">{row.buyer}</td>
                      <td className="p-3 md:p-4" style={{ color: '#5E5E5E' }}>{row.volume}</td>
                      <td className="p-3 md:p-4 whitespace-nowrap" style={{ color: '#5E5E5E' }}>{row.value}</td>
                      <td className="p-3 md:p-4 text-xs" style={{ color: '#8B9D77' }}>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Link href="/gallery" className="text-sm font-medium underline" style={{ color: '#C45C3E' }}>
            See community deployments in the gallery →
          </Link>
        </section>

        {/* Community Voices */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            The people we work with
          </p>
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Elders, families, communities
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
            {COMMUNITY_VOICES.map((p) => (
              <figure key={p.src} className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} className="w-full aspect-square object-cover block" />
              </figure>
            ))}
          </div>
          <Link href="/story" className="text-sm font-medium underline" style={{ color: '#C45C3E' }}>
            Read the full story →
          </Link>
        </section>

        {/* QBE Program */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            {QBE_PROGRAM.title}
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: '#5E5E5E' }}>
            {QBE_PROGRAM.description}
          </p>
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
              Program contacts
            </p>
            <ul className="space-y-2">
              {QBE_PROGRAM.contacts.map((c) => (
                <li key={c} className="text-sm" style={{ color: '#2E2E2E' }}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Capital Stack */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            The blended capital stack
          </h2>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr style={{ backgroundColor: '#F4ECE2' }}>
                    <th className="text-left p-3 md:p-4 font-medium whitespace-nowrap">Layer</th>
                    <th className="text-left p-3 md:p-4 font-medium">Source</th>
                    <th className="text-left p-3 md:p-4 font-medium whitespace-nowrap">Amount</th>
                    <th className="text-left p-3 md:p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CAPITAL_STACK.map((row, i) => (
                    <tr
                      key={row.layer}
                      style={{
                        backgroundColor: row.highlight ? '#FFF1E8' : i % 2 === 0 ? '#FFFFFF' : '#FDF8F3',
                      }}
                    >
                      <td className="p-3 md:p-4 font-medium">{row.layer}</td>
                      <td className="p-3 md:p-4" style={{ color: '#5E5E5E' }}>{row.source}</td>
                      <td className="p-3 md:p-4 font-medium whitespace-nowrap">{row.amount}</td>
                      <td className="p-3 md:p-4 text-xs" style={{ color: '#8B9D77' }}>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why this funder */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Why {funder.name} specifically
          </h2>
          <ul className="space-y-4">
            {funder.whyUs.map((item, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: '#C45C3E', color: 'white' }}
                >
                  {i + 1}
                </span>
                <span className="text-base leading-relaxed" style={{ color: '#5E5E5E' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Investment Thesis */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            The investment thesis
          </h2>
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#8B9D77' }}>
                The problem
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#5E5E5E' }}>
                {INVESTMENT_THESIS.why}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#8B9D77' }}>
                The team
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#5E5E5E' }}>
                {INVESTMENT_THESIS.whoWeAre}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#8B9D77' }}>
                The numbers
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#5E5E5E' }}>
                {INVESTMENT_THESIS.achievable}
              </p>
            </div>
          </div>
        </section>

        {/* Closing Video */}
        {funder.closingVideo && (
          <section className="mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
              Hear from community
            </p>
            <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {funder.closingVideo.title}
            </h2>
            <figure className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E8DED4', backgroundColor: '#2E2E2E' }}>
              {funder.closingVideo.embed ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={funder.closingVideo.src}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  src={funder.closingVideo.src}
                  poster={funder.closingVideo.poster}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-auto block"
                />
              )}
              {funder.closingVideo.caption && (
                <figcaption className="p-4 text-sm leading-relaxed" style={{ color: '#E8DED4' }}>
                  {funder.closingVideo.caption}
                </figcaption>
              )}
            </figure>
          </section>
        )}

        {/* Dive deeper cross-links */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
            Dive deeper
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/story"
              className="p-4 rounded-xl text-center text-sm font-medium transition-colors"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', color: '#2E2E2E' }}
            >
              The full story
            </Link>
            <Link
              href="/process"
              className="p-4 rounded-xl text-center text-sm font-medium transition-colors"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', color: '#2E2E2E' }}
            >
              How it is made
            </Link>
            <Link
              href="/shop/stretch-bed-single"
              className="p-4 rounded-xl text-center text-sm font-medium transition-colors"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', color: '#2E2E2E' }}
            >
              The product page
            </Link>
            <Link
              href="/gallery"
              className="p-4 rounded-xl text-center text-sm font-medium transition-colors"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4', color: '#2E2E2E' }}
            >
              Community gallery
            </Link>
          </div>
        </section>

        {/* Next Step */}
        {funder.meetingAsk && (
          <section className="p-8 rounded-2xl" style={{ backgroundColor: '#2E2E2E', color: '#FDF8F3' }}>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
              Next step
            </p>
            <p className="text-xl font-light leading-relaxed mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              {funder.meetingAsk}
            </p>
            <div className="text-sm space-y-1" style={{ color: '#E8DED4' }}>
              <p>
                Nicholas Marchesi ·{' '}
                <a href="mailto:nicholas@act.place" className="underline">
                  nicholas@act.place
                </a>{' '}
                ·{' '}
                <a href="tel:+61424054113" className="underline">
                  0424 054 113
                </a>
              </p>
              <p>
                Goods on Country ·{' '}
                <a href="https://www.goodsoncountry.com" className="underline">
                  www.goodsoncountry.com
                </a>
              </p>
            </div>
          </section>
        )}

        <footer className="mt-16 pt-8 text-center text-xs" style={{ color: '#8B9D77', borderTop: '1px solid #E8DED4' }}>
          Confidential · Prepared for {funder.name} · Not for redistribution
        </footer>
      </div>
    </main>
  );
}
