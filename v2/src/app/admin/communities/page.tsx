import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  deployments,
  getDeploymentTotals,
  documentedDemand,
  getDemandTotal,
  communityVoices,
} from '@/lib/data/compendium';

// NT expansion targets from community research sweep
const expansionTargets = [
  { community: 'Wadeye (Port Keats)', state: 'NT' as const, pop: 2600, priority: 1, reason: 'Worst overcrowding in Australia — 150 homes short. Houses with up to 26 people.', housingBody: 'Thamarrurr Development Corp' },
  { community: 'Yarrabah', state: 'QLD' as const, pop: 2500, priority: 2, reason: '7 new homes building NOW. 97% Indigenous.', housingBody: 'Yarrabah Aboriginal Shire Council' },
  { community: 'Galiwin\'ku (Elcho Island)', state: 'NT' as const, pop: 2200, priority: 3, reason: 'Largest NE Arnhem community. Receiving new homes under OFOH.', housingBody: 'East Arnhem Regional Council' },
  { community: 'Aurukun', state: 'QLD' as const, pop: 1370, priority: 4, reason: 'Lowest median income on Cape York ($13,520/yr). Housing plan active.', housingBody: 'Aurukun Aboriginal Shire Council' },
  { community: 'Torres Strait (via TSIRC)', state: 'QLD' as const, pop: 4000, priority: 5, reason: '14 islands, modular housing strategy, CEQ stores already there.', housingBody: 'Torres Strait Island Regional Council' },
  { community: 'Gunbalanya (Oenpelli)', state: 'NT' as const, pop: 1200, priority: 6, reason: '$26.5M tender: 24 new homes + 18 upgrades.', housingBody: 'Bawinanga Aboriginal Corp' },
  { community: 'Doomadgee', state: 'QLD' as const, pop: 1400, priority: 7, reason: 'Housing plan underway.', housingBody: 'Doomadgee Aboriginal Shire Council' },
  { community: 'Borroloola', state: 'NT' as const, pop: 900, priority: 8, reason: '31 of 38 new homes just completed — need beds.', housingBody: 'Roper Gulf Regional Council' },
  { community: 'Groote Archipelago', state: 'NT' as const, pop: 1500, priority: 9, reason: '800 beds + 300 washers requested.', housingBody: 'Anindilyakwa Housing Aboriginal Corp' },
  { community: 'Ngukurr', state: 'NT' as const, pop: 1100, priority: 10, reason: 'Part of housing class action communities.', housingBody: 'Roper Gulf Regional Council' },
  { community: 'Ramingining', state: 'NT' as const, pop: 870, priority: 11, reason: 'New homes under OFOH.', housingBody: 'East Arnhem Regional Council' },
  { community: 'Kowanyama', state: 'QLD' as const, pop: 1100, priority: 12, reason: '4 new homes + housing plan.', housingBody: 'Kowanyama Aboriginal Shire Council' },
  { community: 'Woorabinda', state: 'QLD' as const, pop: 1000, priority: 13, reason: '91.6% Indigenous. Only DOGIT community in Central QLD.', housingBody: 'Woorabinda Aboriginal Shire Council' },
  { community: 'Cherbourg', state: 'QLD' as const, pop: 1500, priority: 14, reason: 'Overcrowding action plan underway.', housingBody: 'Cherbourg Aboriginal Shire Council' },
  { community: 'Lajamanu', state: 'NT' as const, pop: 600, priority: 15, reason: 'New homes under OFOH.', housingBody: 'Central Desert Regional Council' },
  { community: 'Yuendumu', state: 'NT' as const, pop: 800, priority: 16, reason: 'Central Desert Regional Council area.', housingBody: 'Central Desert Regional Council' },
];

export default function CommunitiesPage() {
  const totals = getDeploymentTotals();
  const demandTotal = getDemandTotal();

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
            <p className="text-2xl font-bold text-orange-700">${(demandTotal / 1000).toFixed(0)}K</p>
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
                  <p className="text-xs text-orange-600">
                    {voicesByComm[d.community]} community voice{voicesByComm[d.community] > 1 ? 's' : ''} recorded
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
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
                <th className="pb-2 font-medium w-8">#</th>
                <th className="pb-2 font-medium">Community</th>
                <th className="pb-2 font-medium">State</th>
                <th className="pb-2 font-medium text-right">Pop.</th>
                <th className="pb-2 font-medium">Why</th>
                <th className="pb-2 font-medium">Housing Body</th>
              </tr>
            </thead>
            <tbody>
              {expansionTargets.map((t) => (
                <tr key={t.priority} className="border-b last:border-0">
                  <td className="py-2 text-gray-400 font-mono text-xs">{t.priority}</td>
                  <td className="py-2 font-medium">{t.community}</td>
                  <td className="py-2">
                    <Badge variant="outline" className="text-xs">{t.state}</Badge>
                  </td>
                  <td className="py-2 text-right font-mono">~{t.pop.toLocaleString()}</td>
                  <td className="py-2 text-gray-600 text-xs max-w-[300px]">{t.reason}</td>
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
