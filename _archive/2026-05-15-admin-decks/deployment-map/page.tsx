'use client';

import { useState } from 'react';
import { CommunityMap } from '@/components/community-map';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package, Recycle, Users } from 'lucide-react';

// ---------------------------------------------------------------------------
// Community coordinates + deployment data
// ---------------------------------------------------------------------------

const communities = [
  {
    id: 'palm-island',
    name: 'Palm Island',
    traditionalName: 'Bwgcolman',
    region: 'North Queensland',
    lat: -18.7361,
    lng: 146.5822,
    beds: 141,
    washers: 0,
    partner: 'PICC / Plate It Forward',
    state: 'QLD',
    description: 'Largest single deployment. PICC said "we\'ll buy the production facility itself." Eb & Jahvan training with Defy Design.',
    highlight: 'Community ownership pathway',
  },
  {
    id: 'tennant-creek',
    name: 'Tennant Creek',
    traditionalName: 'Wumpurrarni',
    region: 'Barkly Region, NT',
    lat: -19.6498,
    lng: 134.1892,
    beds: 139,
    washers: 5,
    partner: 'Wilya Janta',
    state: 'NT',
    description: '139 beds + 5 washing machines. Norman Frank & Dr Simon Quilty. Community Shed hosts production plant.',
    highlight: 'Production hub + washing machine fleet',
  },
  {
    id: 'alice-homelands',
    name: 'Alice Springs Homelands',
    traditionalName: 'Mparntwe',
    region: 'Central Australia, NT',
    lat: -23.6980,
    lng: 133.8807,
    beds: 60,
    washers: 0,
    partner: 'Oonchiumpa',
    state: 'NT',
    description: 'Oonchiumpa-led deployment across Alice homelands. Kristy Bloomfield. Base for NT circuit model.',
    highlight: 'Supply Nation certification vehicle',
  },
  {
    id: 'utopia',
    name: 'Utopia Homelands',
    traditionalName: 'Urapuntja',
    region: 'Central Australia, NT',
    lat: -22.0000,
    lng: 134.9000,
    beds: 24,
    washers: 0,
    partner: 'Centrecorp Foundation',
    state: 'NT',
    description: '107 beds ordered via Centrecorp (INV-0291). 24 deployed so far across homeland outstations.',
    highlight: 'Centrecorp partnership',
  },
  {
    id: 'maningrida',
    name: 'Maningrida',
    traditionalName: 'Manayingkarírra',
    region: 'Arnhem Land, NT',
    lat: -12.0601,
    lng: 134.2290,
    beds: 24,
    washers: 0,
    partner: 'Homeland Schools Co.',
    state: 'NT',
    description: 'Homeland Schools Company deployment. Remote Top End community.',
    highlight: 'Top End expansion',
  },
  {
    id: 'kalgoorlie',
    name: 'Kalgoorlie',
    traditionalName: 'Ninga Mia',
    region: 'Goldfields, WA',
    lat: -30.7489,
    lng: 121.4658,
    beds: 20,
    washers: 0,
    partner: '',
    state: 'WA',
    description: 'Ninga Mia community deployment. First WA beds. Proving national reach.',
    highlight: 'WA footprint',
  },
  {
    id: 'mt-isa',
    name: 'Mt Isa',
    traditionalName: 'Kalkadoon',
    region: 'North West QLD',
    lat: -20.7264,
    lng: 139.4928,
    beds: 4,
    washers: 0,
    partner: 'Direct',
    state: 'QLD',
    description: 'Testing deployment in Mt Isa / Kalkadoon country.',
    highlight: 'QLD western corridor',
  },
];

// Future / pipeline communities (no beds yet)
const pipelineCommunities = [
  { id: 'groote', name: 'Groote Archipelago', lat: -13.8500, lng: 136.7500, demand: 500, state: 'NT', note: '$1.7M WHSAC proposal' },
  { id: 'wadeye', name: 'Wadeye', lat: -14.2333, lng: 129.5167, demand: 50, state: 'NT', note: 'Red Dust connection' },
  { id: 'darwin', name: 'Darwin', lat: -12.4634, lng: 130.8456, demand: 100, state: 'NT', note: 'Circuit model endpoint' },
  { id: 'katherine', name: 'Katherine', lat: -14.4667, lng: 132.2667, demand: 80, state: 'NT', note: 'Circuit model stop' },
  { id: 'townsville', name: 'Townsville', lat: -19.2590, lng: 146.8169, demand: 0, state: 'QLD', note: 'REAL Fund production plant site' },
];

const totalBeds = communities.reduce((s, c) => s + c.beds, 0);
const totalWashers = communities.reduce((s, c) => s + c.washers, 0);
const totalPlastic = totalBeds * 20; // 20kg HDPE per bed
const pipelineDemand = pipelineCommunities.reduce((s, c) => s + c.demand, 0);

export default function DeploymentMapPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const mapLocations = communities.map((c) => ({
    id: c.id,
    name: `${c.name}${c.traditionalName ? ` (${c.traditionalName})` : ''}`,
    region: `${c.region} — ${c.partner || 'Direct'}`,
    lat: c.lat,
    lng: c.lng,
    storytellerCount: 0,
    bedsDelivered: c.beds,
    description: c.description,
    highlight: c.highlight,
  }));

  return (
    <div className="space-y-8 pb-16">
      {/* Hero stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Beds Deployed', value: `${totalBeds}+`, icon: Package, color: 'text-orange-600 bg-orange-50' },
          { label: 'Communities', value: String(communities.length), icon: MapPin, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Plastic Diverted', value: `${(totalPlastic / 1000).toFixed(1)}t`, icon: Recycle, color: 'text-blue-600 bg-blue-50' },
          { label: 'Pipeline Demand', value: `${pipelineDemand}+`, icon: Users, color: 'text-purple-600 bg-purple-50' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map */}
      <CommunityMap
        locations={mapLocations}
        storytellers={[]}
        selectedCommunity={selected}
        onSelectCommunity={setSelected}
      />

      {/* Community Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Deployments</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((c) => (
            <Card
              key={c.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selected === c.id ? 'ring-2 ring-orange-500' : ''}`}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{c.name}</h3>
                    {c.traditionalName && (
                      <div className="text-xs text-gray-500 italic">{c.traditionalName}</div>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">{c.state}</Badge>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{c.beds}</div>
                    <div className="text-[10px] text-gray-500 uppercase">beds</div>
                  </div>
                  {c.washers > 0 && (
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{c.washers}</div>
                      <div className="text-[10px] text-gray-500 uppercase">washers</div>
                    </div>
                  )}
                  <div className="ml-auto text-right">
                    <div className="text-sm font-bold text-emerald-600">{c.beds * 20}kg</div>
                    <div className="text-[10px] text-gray-500">HDPE diverted</div>
                  </div>
                </div>
                {c.partner && (
                  <div className="text-xs text-gray-500">Partner: {c.partner}</div>
                )}
                <div className="mt-2 rounded-md bg-orange-50 border border-orange-100 px-2 py-1">
                  <div className="text-xs text-orange-800">{c.highlight}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pipeline Communities</h2>
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">Community</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">Demand</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {pipelineCommunities.map((c) => (
                  <tr key={c.id} className="border-b last:border-b-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{c.state}</Badge></td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums">{c.demand > 0 ? `${c.demand} beds` : '—'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Punchline */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
        <div className="text-slate-400 text-sm uppercase tracking-widest mb-3">Deployed across Australia</div>
        <p className="text-4xl md:text-5xl font-black text-orange-400">{totalBeds}+ beds</p>
        <p className="text-xl text-white mt-2">{communities.length} communities · {(totalPlastic / 1000).toFixed(1)} tonnes plastic diverted</p>
        <p className="text-slate-400 text-sm mt-4">From Kalgoorlie to Maningrida. Every dot is a family sleeping better.</p>
      </div>
    </div>
  );
}
