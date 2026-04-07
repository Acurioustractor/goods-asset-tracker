import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  deployments,
  getDeploymentTotals,
  documentedDemand,
  getDemandTotal,
  communityVoices,
} from '@/lib/data/compendium';
import {
  getGrantscopeCommunities,
  type GrantscopeCommunityProof,
} from '@/lib/grantscope/client';
import { expansionTargets } from '@/lib/data/expansion-targets';

export const dynamic = 'force-dynamic';

export default async function CommunitiesPage() {
  const totals = getDeploymentTotals();
  const demandTotal = getDemandTotal();

  // Fetch Grantscope community intelligence (graceful fallback)
  const gsCommunitiesData = await getGrantscopeCommunities().catch(() => [] as GrantscopeCommunityProof[]);

  // Count voices per community
  const voicesByComm = communityVoices.reduce((acc, v) => {
    acc[v.community] = (acc[v.community] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Communities</h1>
        <p className="text-gray-500 mt-1">
          Current deployments, expansion targets, and documented demand across NT, QLD, WA, and SA.
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-gray-500 uppercase">Active Communities</p>
            <p className="text-2xl font-bold">{totals.activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-gray-500 uppercase">Beds Deployed</p>
            <p className="text-2xl font-bold text-green-700">{totals.beds}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-gray-500 uppercase">Washers Deployed</p>
            <p className="text-2xl font-bold">{totals.washers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-gray-500 uppercase">Expansion Targets</p>
            <p className="text-2xl font-bold text-blue-700">{expansionTargets.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-xs text-gray-500 uppercase">Demand Pipeline</p>
            <p className="text-2xl font-bold text-orange-700">${(demandTotal / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Deployments */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Current Deployments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deployments.map((d) => (
            <Card key={d.id} className={d.status === 'active' ? 'border-green-200' : ''}>
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{d.community}</h3>
                    {d.traditionalName && (
                      <p className="text-xs text-gray-500 italic">{d.traditionalName} Country</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">{d.state}</Badge>
                    <Badge className={d.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {d.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-lg font-bold">{d.beds}</p>
                    <p className="text-xs text-gray-500">beds</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-lg font-bold">{d.washers}</p>
                    <p className="text-xs text-gray-500">washers</p>
                  </div>
                </div>

                {d.partner && (
                  <p className="text-xs text-gray-600">Partner: {d.partner}</p>
                )}
                {d.contacts && d.contacts.length > 0 && (
                  <p className="text-xs text-gray-500">Contacts: {d.contacts.join(', ')}</p>
                )}
                {voicesByComm[d.community] && (
                  <Link href="/admin/stories" className="text-xs text-orange-600 hover:text-orange-800 hover:underline block">
                    {voicesByComm[d.community]} community voice{voicesByComm[d.community] > 1 ? 's' : ''} recorded →
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Grantscope Community Intelligence */}
      {gsCommunitiesData.length > 0 && (
        <section>
          <div className="border-t pt-8">
            <h2 className="text-lg font-semibold mb-1">Community Intelligence</h2>
            <p className="text-sm text-gray-500 mb-4">
              Need-leverage scores and demand signals from Grantscope workspace
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 font-medium">Community</th>
                  <th className="pb-2 font-medium">Region</th>
                  <th className="pb-2 font-medium text-right">Assets</th>
                  <th className="pb-2 font-medium text-right">Beds</th>
                  <th className="pb-2 font-medium text-right">Washers</th>
                  <th className="pb-2 font-medium text-right">Demand Beds</th>
                  <th className="pb-2 font-medium text-right">Demand Washers</th>
                  <th className="pb-2 font-medium text-right">Need Score</th>
                  <th className="pb-2 font-medium">Proof</th>
                </tr>
              </thead>
              <tbody>
                {gsCommunitiesData
                  .sort((a, b) => b.needLeverageScore - a.needLeverageScore)
                  .map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{c.community}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">{c.state}</Badge>
                          <span className="text-xs text-gray-500">{c.regionLabel}</span>
                        </div>
                      </td>
                      <td className="py-2 text-right font-mono">{c.totalAssets}</td>
                      <td className="py-2 text-right font-mono">{c.bedsDelivered}</td>
                      <td className="py-2 text-right font-mono">{c.washersDelivered}</td>
                      <td className="py-2 text-right font-mono text-blue-700">{c.demandBeds}</td>
                      <td className="py-2 text-right font-mono text-blue-700">{c.demandWashers}</td>
                      <td className="py-2 text-right">
                        <span className={`font-bold ${c.needLeverageScore >= 70 ? 'text-red-600' : c.needLeverageScore >= 40 ? 'text-orange-600' : 'text-gray-600'}`}>
                          {c.needLeverageScore}
                        </span>
                      </td>
                      <td className="py-2 text-gray-600 text-xs max-w-[250px] truncate">
                        {c.proofLine}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Documented Demand */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Documented Demand</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 pr-4 font-medium">Requester</th>
                <th className="pb-2 pr-4 font-medium">Request</th>
                <th className="pb-2 pr-4 font-medium text-right">Est. Value</th>
                <th className="pb-2 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {documentedDemand.map((d) => (
                <tr key={d.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium whitespace-nowrap">{d.requester}</td>
                  <td className="py-2 pr-4 text-gray-600">{d.request}</td>
                  <td className="py-2 pr-4 text-right font-mono whitespace-nowrap">
                    {d.estimatedValue > 0 ? `$${d.estimatedValue.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-2 text-center">
                    <Badge className={
                      d.status === 'approved' ? 'bg-green-100 text-green-800' :
                      d.status === 'requested' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {d.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Expansion Targets */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Expansion Targets</h2>
        <p className="text-sm text-gray-500 mb-4">
          Communities with active housing construction where Stretch Beds would be a natural fit.
          Prioritised by overcrowding severity and active build programs.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 pr-3 font-medium w-8">#</th>
                <th className="pb-2 pr-3 font-medium">Community</th>
                <th className="pb-2 pr-3 font-medium">State</th>
                <th className="pb-2 pr-4 font-medium text-right">Pop.</th>
                <th className="pb-2 pr-3 font-medium">Why</th>
                <th className="pb-2 font-medium">Housing Body</th>
              </tr>
            </thead>
            <tbody>
              {expansionTargets.map((t) => (
                <tr key={t.priority} className="border-b last:border-0">
                  <td className="py-2 pr-3 text-gray-400 font-mono text-xs">{t.priority}</td>
                  <td className="py-2 pr-3 font-medium">{t.community}</td>
                  <td className="py-2 pr-3">
                    <Badge variant="outline" className="text-xs">{t.state}</Badge>
                  </td>
                  <td className="py-2 pr-4 text-right font-mono">~{t.pop.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-gray-600 text-xs max-w-[300px]">{t.reason}</td>
                  <td className="py-2 text-gray-500 text-xs">{t.housingBody}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
