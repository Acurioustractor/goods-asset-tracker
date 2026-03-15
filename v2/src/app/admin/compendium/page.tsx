import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  deployments,
  getDeploymentTotals,
  funding,
  getFundingSummary,
  documentedDemand,
  getDemandTotal,
  communityVoices,
  communityPartners,
  advisoryBoard,
  problemStats,
  timeline,
  risks,
  vision2030,
  environmentalImpact,
  productionFacility,
  videoTestimonials,
  type PartnerCategory,
} from '@/lib/data/compendium';

export default function CompendiumPage() {
  const totals = getDeploymentTotals();
  const fundingSummary = getFundingSummary();
  const demandTotal = getDemandTotal();

  const partnersByCategory = communityPartners.reduce(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    },
    {} as Record<PartnerCategory, typeof communityPartners>,
  );

  const categoryLabels: Record<PartnerCategory, string> = {
    core: 'Core Community',
    health: 'Health',
    manufacturing: 'Manufacturing & Technical',
    government: 'Government',
    strategic: 'Strategic',
    future: 'Future Manufacturing',
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Compendium</h1>
        <p className="text-gray-500 mt-1">
          Master data source — all partnerships, funding, deployments, community voices, and impact data in one place.
        </p>
        <p className="text-xs text-gray-400 mt-1">Last synced from COMPENDIUM_MARCH_2026.md — March 15, 2026</p>
      </div>

      {/* Top-level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KPICard label="Beds Deployed" value={totals.beds} />
        <KPICard label="Washers Deployed" value={totals.washers} />
        <KPICard label="Communities" value={totals.communities} />
        <KPICard label="Funding Received" value={`$${(fundingSummary.received / 1000).toFixed(0)}K`} />
        <KPICard label="Receivables" value={`$${(fundingSummary.receivables / 1000).toFixed(0)}K`} />
        <KPICard label="Demand Pipeline" value={`$${(demandTotal / 1000).toFixed(0)}K`} />
      </div>

      {/* Deployments */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Deployments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Community</th>
                <th className="pb-2 font-medium">Traditional Name</th>
                <th className="pb-2 font-medium">State</th>
                <th className="pb-2 font-medium text-right">Beds</th>
                <th className="pb-2 font-medium text-right">Washers</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Partner</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((d) => (
                <tr key={d.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{d.community}</td>
                  <td className="py-2 text-gray-500 italic">{d.traditionalName || '—'}</td>
                  <td className="py-2">{d.state}</td>
                  <td className="py-2 text-right font-mono">{d.beds}</td>
                  <td className="py-2 text-right font-mono">{d.washers}</td>
                  <td className="py-2">
                    <Badge
                      className={
                        d.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : d.status === 'testing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {d.status}
                    </Badge>
                  </td>
                  <td className="py-2 text-gray-600 text-xs">{d.partner || '—'}</td>
                </tr>
              ))}
              <tr className="border-t-2 font-semibold">
                <td className="py-2" colSpan={3}>TOTAL</td>
                <td className="py-2 text-right font-mono">{totals.beds}</td>
                <td className="py-2 text-right font-mono">{totals.washers}</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Documented Demand */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Documented Demand</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Requester</th>
                <th className="pb-2 font-medium">Request</th>
                <th className="pb-2 font-medium text-right">Est. Value</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {documentedDemand.map((d) => (
                <tr key={d.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{d.requester}</td>
                  <td className="py-2 text-gray-600">{d.request}</td>
                  <td className="py-2 text-right font-mono">
                    {d.estimatedValue > 0 ? `$${d.estimatedValue.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-2">
                    <Badge
                      className={
                        d.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : d.status === 'requested'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {d.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Funding */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Funding</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Received</p>
              <p className="text-2xl font-bold text-green-700">${fundingSummary.received.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Pending / In Discussion</p>
              <p className="text-2xl font-bold text-yellow-700">${fundingSummary.pending.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Outstanding Receivables</p>
              <p className="text-2xl font-bold text-orange-700">${fundingSummary.receivables.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 font-medium text-right">Amount</th>
                <th className="pb-2 font-medium">Program</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Contact</th>
                <th className="pb-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {funding.map((f) => (
                <tr key={f.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{f.source}</td>
                  <td className="py-2 text-right font-mono">
                    {f.amount > 0 ? `$${f.amount.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-2 text-gray-600 text-xs">{f.program || '—'}</td>
                  <td className="py-2">
                    <Badge
                      className={
                        f.status === 'received'
                          ? 'bg-green-100 text-green-800'
                          : f.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : f.status === 'receivable'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {f.status}
                    </Badge>
                  </td>
                  <td className="py-2 text-gray-600 text-xs">{f.contact || '—'}</td>
                  <td className="py-2 text-gray-500 text-xs max-w-[200px] truncate">{f.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Partners by Category */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Partners ({communityPartners.length})</h2>
        {(Object.keys(categoryLabels) as PartnerCategory[]).map((cat) => {
          const partners = partnersByCategory[cat];
          if (!partners?.length) return null;
          return (
            <div key={cat} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                {categoryLabels[cat]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {partners.map((p) => (
                  <Card key={p.id} className="border-gray-200">
                    <CardContent className="pt-4 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{p.name}</h4>
                        {p.location && (
                          <span className="text-xs text-gray-400">{p.location}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{p.description}</p>
                      {p.contacts && p.contacts.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.contacts.map((c, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {c.name}
                              {c.role ? ` (${c.role})` : ''}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {p.keyFacts && p.keyFacts.length > 0 && (
                        <ul className="text-xs text-gray-500 list-disc ml-4 pt-1">
                          {p.keyFacts.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Community Voices */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          Community Voices ({communityVoices.length} storytellers)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityVoices.map((v) => (
            <Card key={v.id}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{v.name}</h4>
                    {v.role && <p className="text-xs text-gray-500">{v.role}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">{v.community}</Badge>
                    <Badge variant="outline" className="text-xs">{v.state}</Badge>
                  </div>
                </div>
                {v.quotes.map((q, i) => (
                  <blockquote key={i} className="text-sm text-gray-700 border-l-2 border-orange-300 pl-3 italic">
                    &ldquo;{q}&rdquo;
                  </blockquote>
                ))}
                {v.context && (
                  <p className="text-xs text-gray-500">{v.context}</p>
                )}
                {v.videoUrl && (
                  <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    Watch video
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Problem Statistics */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Problem Statistics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Claim</th>
                <th className="pb-2 font-medium">Value</th>
                <th className="pb-2 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {problemStats.map((s, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2">{s.claim}</td>
                  <td className="py-2 font-semibold">{s.value}</td>
                  <td className="py-2 text-gray-500 text-xs">{s.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Environmental Impact */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Environmental Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="Plastic per Bed" value={`${environmentalImpact.plasticPerBed.min}–${environmentalImpact.plasticPerBed.max}kg`} />
          <KPICard label="Total Diverted" value={`${(environmentalImpact.totalDivertedToDate / 1000).toFixed(1)}t`} />
          <KPICard label="At Scale (5K/yr)" value={`${environmentalImpact.atScale.tonnes}t/yr`} />
          <KPICard label="Product Lifespan" value={environmentalImpact.productLifespan.split(' (')[0]} />
        </div>
      </section>

      {/* Production Facility */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Production Facility</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productionFacility.containers.map((c, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{c.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{c.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Circuit Deployment Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-gray-600">{productionFacility.circuitModel.description}</p>
            <p className="text-sm"><strong>2026 planned:</strong> {productionFacility.circuitModel.planned2026}</p>
            <p className="text-sm text-gray-500">Hosting cost: {productionFacility.circuitModel.hostingCost}</p>
          </CardContent>
        </Card>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Timeline</h2>
        <div className="space-y-2">
          {timeline.map((m, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-xs font-mono text-gray-400 w-24 shrink-0 pt-0.5">{m.date}</span>
              <span className="text-sm">{m.event}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Risks */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Risks & Mitigations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Risk</th>
                <th className="pb-2 font-medium">Likelihood</th>
                <th className="pb-2 font-medium">Impact</th>
                <th className="pb-2 font-medium">Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 font-medium">{r.risk}</td>
                  <td className="py-2">
                    <Badge className={r.likelihood === 'High' ? 'bg-red-100 text-red-800' : r.likelihood === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {r.likelihood}
                    </Badge>
                  </td>
                  <td className="py-2">
                    <Badge className={r.impact === 'High' ? 'bg-red-100 text-red-800' : r.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                      {r.impact}
                    </Badge>
                  </td>
                  <td className="py-2 text-gray-600 text-xs">{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Vision 2030 */}
      <section>
        <Card className="bg-slate-900 text-white border-slate-800">
          <CardHeader>
            <CardTitle className="text-orange-400">Vision 2030</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <blockquote className="text-sm italic border-l-2 border-orange-500 pl-3">
              &ldquo;{vision2030.quote}&rdquo;
            </blockquote>
            <ul className="space-y-2">
              {vision2030.metrics.map((m, i) => (
                <li key={i} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-orange-400">{'>'}</span> {m}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-400 pt-2">
              <strong className="text-white">Ultimate success:</strong> {vision2030.ultimateSuccess}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Video Assets */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Video Testimonials ({videoTestimonials.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {videoTestimonials.map((v, i) => (
            <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:border-orange-300 transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <h4 className="font-medium text-sm">{v.title}</h4>
                  {v.person && <p className="text-xs text-gray-500">{v.person}</p>}
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function KPICard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-4 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
