import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  deployments,
  documentedDemand,
  communityPartners,
  problemStats,
  getDeploymentTotals,
  getDemandTotal,
} from '@/lib/data/compendium';
import { expansionTargets, getExpansionTargetTotals } from '@/lib/data/expansion-targets';
import { getGrantscopeCommunities, type GrantscopeCommunityProof } from '@/lib/grantscope/client';
import { getFunderPage } from '@/lib/data/funder-pages';
import { FunderMap } from '../funder-map';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PARTNER_CATEGORY_LABELS: Record<string, string> = {
  core: 'Core community partners',
  health: 'Health partners',
  manufacturing: 'Manufacturing and technical',
  government: 'Government',
  strategic: 'Strategic advisors',
  future: 'Future manufacturing pipeline',
};

const PARTNER_CATEGORY_ORDER = ['core', 'health', 'manufacturing', 'government', 'strategic', 'future'];

const PROCUREMENT_PATHWAYS = [
  {
    name: 'NT Remote Housing Program',
    scope: '$4B over 10 years, 2700 new homes',
    status: 'Awaiting furniture / fit-out panel opening',
    note: 'Beds for every new home. Register on NT Housing Infrastructure Panel when furniture sub-panel opens.',
  },
  {
    name: 'QLD Government Procurement Policy 2026',
    scope: '$35B annual government spend',
    status: 'Social enterprise registration in progress',
    note: 'Social enterprise preference under $500K. Direct path to QLD govt procurement contracts.',
  },
  {
    name: 'Supply Nation Certification',
    scope: '$2.3B of $3.8B Indigenous procurement',
    status: 'Application via Oonchiumpa, deadline 1 July 2026',
    note: 'Certified Aboriginal-owned suppliers receive 3x more contracts. Critical pathway for federal and corporate procurement.',
  },
  {
    name: 'AusTender',
    scope: 'All federal government contracts',
    status: 'Registered as supplier',
    note: 'Active monitoring of furniture, housing and Indigenous procurement opportunities.',
  },
  {
    name: 'Snow Foundation Q4 / Round 4',
    scope: 'Multi-round philanthropic relationship',
    status: 'Round 4 proposal submitted ($200K pending)',
    note: 'Established relationship since Oct 2024. Sally Grimsley-Ballard primary contact.',
  },
];

const EMPLOYMENT_PATHWAYS = [
  {
    leadOrg: 'Palm Island Community Company (PICC)',
    site: 'Station Precinct, Townsville (30-year lease, community-owned)',
    grant: 'REAL Innovation Fund (GO8213), DEWR',
    amount: '$1.2M over 4 years',
    status: 'EOI submitted 2 March 2026',
    participants: '60–80 First Nations participants over 4 years. 30–40 transitioning into ongoing paid employment, apprenticeships, or self-managed enterprise.',
    streams: [
      'Goods manufacturing and circular economy: producing recycled-plastic bed bases and refurbished washing machines for Palm Island and regional communities. Entry-level production through to quality control, logistics, and small business management.',
      'Hospitality and cultural enterprise: commercial kitchen reactivation, catering, photography, film, digital media, and cultural tourism support.',
      'On-Country work and construction pathways: hands-on construction experience helping build out the Station Precinct, plus connection into PICC ranger and land management programs.',
      'Cross-community exchange: partnerships with Oonchiumpa (Central Australia) and Brodie Germaine Fitness (Mt Isa / Lower Gulf) for visiting trainees and shared mentors.',
    ],
    why: "PICC already employs 197 people (80%+ Indigenous), generates $9.75M annual economic output to Palm Island, and has been 100% community-controlled since September 2021. This program extends their proven employment model into goods manufacturing and justice reintegration, using community-owned infrastructure and PICC's existing Women's Healing Service re-entry network.",
  },
  {
    leadOrg: 'Oonchiumpa Consultancy',
    site: 'Alice Springs / Mbantua, Central Australia',
    grant: 'REAL Innovation Fund (GO8213), DEWR',
    amount: '$1.2M over 4 years',
    status: 'EOI submitted 2 March 2026',
    participants: 'Central Australian First Nations participants entering structured On-Country employment via youth diversion, cultural curriculum, and goods manufacturing pathways.',
    streams: [
      "Goods manufacturing facility: planned production site in Alice Springs to manufacture Stretch Beds and washing machines on Country, with local plastic processing and assembly.",
      'Cultural authority and youth diversion: Oonchiumpa runs a youth case work program (led by Fred Campbell) connecting young people on the edge of the justice system into structured work and community projects.',
      'Cross-cultural exchange: reciprocal exchange with PICC participants in Townsville, building a multi-region apprentice and mentor network.',
      'Cultural curriculum and consultation: Elder-led co-design at university-equivalent rates, with revenue staying in community.',
    ],
    why: '100% Aboriginal owned and operated. Named after the Central Australian corkwood tree. Two years co-designing products "around the fire" with Goods. Director Kristy Bloomfield, Manager Tanya Turner, Board Chair Karen Liddle, Youth Case Worker Fred Campbell. The Alice Springs facility is the second pole of a two-site strategy that creates the cross-community apprentice exchange.',
  },
];

export default async function FunderCommunitiesPage({ params }: PageProps) {
  const { slug } = await params;
  const funder = getFunderPage(slug);
  if (!funder) notFound();

  const totals = getDeploymentTotals();
  const demandTotal = getDemandTotal();
  const states = Array.from(new Set([
    ...deployments.map((d) => d.state),
    ...expansionTargets.map((t) => t.state),
  ])).sort();
  const expansionTotals = getExpansionTargetTotals();

  // Pull live Grantscope intelligence with graceful fallback
  const grantscopeCommunities: GrantscopeCommunityProof[] = await getGrantscopeCommunities()
    .catch(() => [] as GrantscopeCommunityProof[]);

  // Communities researched = active deployments + expansion targets + any Grantscope-only entries
  const allCommunityNames = new Set<string>();
  deployments.forEach((d) => allCommunityNames.add(d.community));
  expansionTargets.forEach((t) => allCommunityNames.add(t.community));
  grantscopeCommunities.forEach((g) => allCommunityNames.add(g.community));
  const communitiesResearchedCount = allCommunityNames.size;

  const totalReachPopulation = expansionTargets.reduce((s, t) => s + t.pop, 0);

  const partnersByCategory = PARTNER_CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: PARTNER_CATEGORY_LABELS[cat],
    items: communityPartners.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FDF8F3', color: '#2E2E2E' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        {/* Header */}
        <header className="mb-10 sm:mb-12">
          <Link
            href={`/funders/${slug}`}
            className="text-xs uppercase tracking-widest underline mb-6 inline-block"
            style={{ color: '#C45C3E' }}
          >
            ← Back to the brief
          </Link>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            Communities Intelligence · Prepared for {funder.name}
          </p>
          <h1
            className="text-4xl md:text-5xl font-light mb-6 leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            The full due diligence
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: '#5E5E5E' }}>
            Below is the complete picture of the communities, partners, demand, and procurement pathways
            that Goods has been working across. Every entry is documented in our internal CRM and pulled
            live from the same source of truth that runs the Goods Command Center. This is the depth of
            relationship and research behind the funding ask.
          </p>
        </header>

        {/* Summary Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Stat value={`${communitiesResearchedCount}`} label="Communities researched" sub={`Active plus ${expansionTotals.count} priority expansion targets`} />
            <Stat value={`${totalReachPopulation.toLocaleString()}`} label="Population reach" sub="Across the priority target list" />
            <Stat value={`${expansionTotals.housingBodies}`} label="Housing bodies mapped" sub="Direct procurement contacts identified" />
            <Stat value={`${states.join(', ')}`} label="States covered" sub="NT, QLD, WA, SA" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat value={`${totals.communities}`} label="Active deployments" sub="Goods is on the ground today" />
            <Stat value={`${totals.beds}`} label="Beds delivered" sub="Verified from internal asset register" />
            <Stat value={`${communityPartners.length}`} label="Partner organisations" sub={`${partnersByCategory.length} categories tracked`} />
            <Stat value={`$${(demandTotal / 1_000_000).toFixed(2)}M`} label="Documented demand" sub="From community requests" />
          </div>
        </section>

        {/* Map */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            Where the work is happening
          </p>
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Active deployment map
          </h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
            <FunderMap />
          </div>
        </section>

        {/* Active Deployments Table */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Active community deployments
          </h2>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr style={{ backgroundColor: '#F4ECE2' }}>
                    <th className="text-left p-3 md:p-4 font-medium">Community</th>
                    <th className="text-left p-3 md:p-4 font-medium">State</th>
                    <th className="text-left p-3 md:p-4 font-medium">Beds</th>
                    <th className="text-left p-3 md:p-4 font-medium">Washers</th>
                    <th className="text-left p-3 md:p-4 font-medium">Partner</th>
                    <th className="text-left p-3 md:p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deployments.map((d, i) => (
                    <tr key={d.id} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FDF8F3' }}>
                      <td className="p-3 md:p-4 font-medium">
                        {d.community}
                        {d.traditionalName && (
                          <span className="block text-xs italic" style={{ color: '#8B9D77' }}>
                            {d.traditionalName}
                          </span>
                        )}
                      </td>
                      <td className="p-3 md:p-4" style={{ color: '#5E5E5E' }}>{d.state}</td>
                      <td className="p-3 md:p-4 font-medium">{d.beds}</td>
                      <td className="p-3 md:p-4" style={{ color: '#5E5E5E' }}>{d.washers}</td>
                      <td className="p-3 md:p-4 text-xs" style={{ color: '#5E5E5E' }}>{d.partner || '·'}</td>
                      <td className="p-3 md:p-4 text-xs" style={{ color: '#8B9D77' }}>{d.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Priority Expansion Targets */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            Where Goods can deploy next
          </p>
          <h2 className="text-2xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Priority expansion targets
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: '#5E5E5E' }}>
            Sixteen remote communities Goods has actively researched as the next deployment cohort.
            Each entry includes population, the housing body that runs procurement, and the specific
            need rationale. Combined population reach across this list: {totalReachPopulation.toLocaleString()} people.
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[820px]">
                <thead>
                  <tr style={{ backgroundColor: '#F4ECE2' }}>
                    <th className="text-left p-3 font-medium">#</th>
                    <th className="text-left p-3 font-medium">Community</th>
                    <th className="text-left p-3 font-medium">State</th>
                    <th className="text-left p-3 font-medium">Population</th>
                    <th className="text-left p-3 font-medium">Need rationale</th>
                    <th className="text-left p-3 font-medium">Procurement contact</th>
                  </tr>
                </thead>
                <tbody>
                  {expansionTargets.map((t, i) => (
                    <tr key={t.community} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FDF8F3' }}>
                      <td className="p-3 text-xs font-medium" style={{ color: '#C45C3E' }}>{t.priority}</td>
                      <td className="p-3 font-medium">{t.community}</td>
                      <td className="p-3" style={{ color: '#5E5E5E' }}>{t.state}</td>
                      <td className="p-3 font-medium">{t.pop.toLocaleString()}</td>
                      <td className="p-3 text-xs leading-relaxed" style={{ color: '#5E5E5E' }}>{t.reason}</td>
                      <td className="p-3 text-xs" style={{ color: '#5E5E5E' }}>{t.housingBody}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Grantscope Live Feed (optional) */}
        {grantscopeCommunities.length > 0 && (
          <section className="mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
              Live community intelligence feed
            </p>
            <h2 className="text-2xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Grantscope workspace data
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#5E5E5E' }}>
              Pulled live from the Grantscope intelligence workspace. Each community has documented
              bed and washer demand, key partners on the ground, and any known buyer signal already
              identified. {grantscopeCommunities.length} communities currently in the feed.
            </p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[860px]">
                  <thead>
                    <tr style={{ backgroundColor: '#F4ECE2' }}>
                      <th className="text-left p-3 font-medium">Community</th>
                      <th className="text-left p-3 font-medium">State</th>
                      <th className="text-left p-3 font-medium">Beds delivered</th>
                      <th className="text-left p-3 font-medium">Bed demand</th>
                      <th className="text-left p-3 font-medium">Washer demand</th>
                      <th className="text-left p-3 font-medium">Partners</th>
                      <th className="text-left p-3 font-medium">Known buyer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grantscopeCommunities.map((g, i) => (
                      <tr key={g.id} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FDF8F3' }}>
                        <td className="p-3 font-medium">
                          {g.community}
                          {g.regionLabel && (
                            <span className="block text-xs italic" style={{ color: '#8B9D77' }}>
                              {g.regionLabel}
                            </span>
                          )}
                        </td>
                        <td className="p-3" style={{ color: '#5E5E5E' }}>{g.state}</td>
                        <td className="p-3" style={{ color: '#5E5E5E' }}>{g.bedsDelivered}</td>
                        <td className="p-3 font-medium">{g.demandBeds}</td>
                        <td className="p-3" style={{ color: '#5E5E5E' }}>{g.demandWashers}</td>
                        <td className="p-3 text-xs" style={{ color: '#5E5E5E' }}>
                          {g.keyPartnerNames && g.keyPartnerNames.length > 0
                            ? g.keyPartnerNames.join(', ')
                            : '·'}
                        </td>
                        <td className="p-3 text-xs" style={{ color: '#8B9D77' }}>
                          {g.knownBuyer || '·'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Documented Demand */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            Demand we have not yet fulfilled
          </p>
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Documented community demand
          </h2>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E8DED4' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr style={{ backgroundColor: '#F4ECE2' }}>
                    <th className="text-left p-3 md:p-4 font-medium">Requester</th>
                    <th className="text-left p-3 md:p-4 font-medium">Request</th>
                    <th className="text-left p-3 md:p-4 font-medium whitespace-nowrap">Estimated value</th>
                    <th className="text-left p-3 md:p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {documentedDemand.map((d, i) => (
                    <tr key={d.id} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FDF8F3' }}>
                      <td className="p-3 md:p-4 font-medium">{d.requester}</td>
                      <td className="p-3 md:p-4" style={{ color: '#5E5E5E' }}>{d.request}</td>
                      <td className="p-3 md:p-4 font-medium whitespace-nowrap">
                        {d.estimatedValue > 0 ? `$${d.estimatedValue.toLocaleString()}` : 'TBD'}
                      </td>
                      <td className="p-3 md:p-4 text-xs" style={{ color: '#8B9D77' }}>{d.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Partners by Category */}
        <section className="mb-16">
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Partner organisations across the ecosystem
          </h2>
          <div className="space-y-8">
            {partnersByCategory.map((group) => (
              <div key={group.category}>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#C45C3E' }}>
                  {group.label} · {group.items.length}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {group.items.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-xl"
                      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
                    >
                      <h3 className="text-base font-medium mb-1" style={{ color: '#2E2E2E' }}>
                        {p.name}
                      </h3>
                      {p.location && (
                        <p className="text-xs mb-2" style={{ color: '#8B9D77' }}>
                          {p.location}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed mb-3" style={{ color: '#5E5E5E' }}>
                        {p.description}
                      </p>
                      {p.contacts && p.contacts.length > 0 && (
                        <div className="text-xs space-y-0.5" style={{ color: '#5E5E5E' }}>
                          {p.contacts.map((c, i) => (
                            <p key={i}>
                              <span className="font-medium">{c.name}</span>
                              {c.role && <span style={{ color: '#8B9D77' }}> · {c.role}</span>}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Employment Pathways */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            How beds become jobs
          </p>
          <h2 className="text-2xl font-light mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Community employment pathways
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: '#5E5E5E' }}>
            The On-Country manufacturing facility is also an employment program. Goods has been
            actively building structured pathways from training into paid work with two community
            partners, both of whom submitted EOIs to the federal REAL Innovation Fund (DEWR) on 2
            March 2026 for $1.2M each over four years. Below is what those programs look like.
          </p>

          <div className="space-y-6">
            {EMPLOYMENT_PATHWAYS.map((p) => (
              <div
                key={p.leadOrg}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid #E8DED4', backgroundColor: '#FFFFFF' }}
              >
                <div className="p-6" style={{ backgroundColor: '#F4ECE2' }}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#C45C3E' }}>
                    Lead applicant
                  </p>
                  <h3 className="text-xl font-medium mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2E2E2E' }}>
                    {p.leadOrg}
                  </h3>
                  <p className="text-sm mb-1" style={{ color: '#5E5E5E' }}>
                    <span style={{ color: '#8B9D77' }}>Site:</span> {p.site}
                  </p>
                  <p className="text-sm mb-1" style={{ color: '#5E5E5E' }}>
                    <span style={{ color: '#8B9D77' }}>Grant:</span> {p.grant}
                  </p>
                  <p className="text-sm mb-1" style={{ color: '#5E5E5E' }}>
                    <span style={{ color: '#8B9D77' }}>Amount:</span> <span className="font-medium">{p.amount}</span>
                  </p>
                  <p className="text-sm" style={{ color: '#5E5E5E' }}>
                    <span style={{ color: '#8B9D77' }}>Status:</span> {p.status}
                  </p>
                </div>

                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#8B9D77' }}>
                    Participants
                  </p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: '#5E5E5E' }}>
                    {p.participants}
                  </p>

                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
                    Program streams
                  </p>
                  <ul className="space-y-3 mb-5">
                    {p.streams.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#5E5E5E' }}>
                        <span style={{ color: '#C45C3E' }}>·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#8B9D77' }}>
                    Why this org
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#5E5E5E' }}>
                    {p.why}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm mt-6 italic" style={{ color: '#8B9D77' }}>
            Combined funding sought across both EOIs: $2.4M over 4 years. Combined participant
            target: 100+ First Nations people transitioning into skilled work. Both programs share
            the same On-Country manufacturing model and reciprocal apprentice exchange.
          </p>
        </section>

        {/* Procurement Pathways */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            How beds get into houses at scale
          </p>
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Procurement pathways identified
          </h2>
          <div className="space-y-3">
            {PROCUREMENT_PATHWAYS.map((p) => (
              <div
                key={p.name}
                className="p-5 rounded-xl"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2 gap-1">
                  <h3 className="text-base font-medium" style={{ color: '#2E2E2E' }}>
                    {p.name}
                  </h3>
                  <p className="text-xs" style={{ color: '#C45C3E' }}>{p.scope}</p>
                </div>
                <p className="text-sm mb-2" style={{ color: '#5E5E5E' }}>
                  {p.note}
                </p>
                <p className="text-xs" style={{ color: '#8B9D77' }}>
                  Status: {p.status}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The need (problem stats) */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B9D77' }}>
            The underlying need
          </p>
          <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            The data behind the work
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {problemStats.map((s, i) => (
              <div
                key={i}
                className="p-4 rounded-xl"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
              >
                <p className="text-xl font-light mb-1" style={{ fontFamily: 'Georgia, serif', color: '#C45C3E' }}>
                  {s.value}
                </p>
                <p className="text-sm mb-1" style={{ color: '#2E2E2E' }}>{s.claim}</p>
                <p className="text-xs" style={{ color: '#8B9D77' }}>Source: {s.source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer back link */}
        <footer className="pt-8 text-center" style={{ borderTop: '1px solid #E8DED4' }}>
          <Link
            href={`/funders/${slug}`}
            className="text-sm font-medium underline"
            style={{ color: '#C45C3E' }}
          >
            ← Back to the {funder.name} brief
          </Link>
          <p className="mt-4 text-xs" style={{ color: '#8B9D77' }}>
            Confidential · Prepared for {funder.name} · Not for redistribution
          </p>
        </footer>
      </div>
    </main>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DED4' }}
    >
      <p className="text-3xl font-light mb-1" style={{ fontFamily: 'Georgia, serif', color: '#C45C3E' }}>
        {value}
      </p>
      <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#2E2E2E' }}>
        {label}
      </p>
      <p className="text-xs" style={{ color: '#8B9D77' }}>
        {sub}
      </p>
    </div>
  );
}
