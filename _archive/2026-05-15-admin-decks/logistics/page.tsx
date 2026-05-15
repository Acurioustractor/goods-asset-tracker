'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  Recycle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Package,
  MapPin,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BED_WEIGHT_KG = 26;
const HDPE_PER_BED_KG = 20;
const BEDS_PER_PALLET = 60;

const routes = [
  {
    id: 'alice-tc',
    name: 'Alice Springs → Tennant Creek',
    distanceKm: 510,
    freightPerKgOut: 0.45,
    freightPerKgReturn: 0.25, // backloading rate (cheaper — truck is going anyway)
    wasteAvailableKg: 2000, // estimated plastic waste available per trip
    communities: ['Tennant Creek', 'Ali Curung', 'Ti Tree'],
  },
  {
    id: 'alice-katherine',
    name: 'Alice Springs → Katherine',
    distanceKm: 1180,
    freightPerKgOut: 0.65,
    freightPerKgReturn: 0.35,
    wasteAvailableKg: 1500,
    communities: ['Katherine', 'Mataranka', 'Larrimah'],
  },
  {
    id: 'townsville-palm',
    name: 'Townsville → Palm Island',
    distanceKm: 65, // barge
    freightPerKgOut: 1.20, // barge rate higher per kg
    freightPerKgReturn: 0.60,
    wasteAvailableKg: 3000,
    communities: ['Palm Island'],
  },
  {
    id: 'townsville-groote',
    name: 'Townsville → Groote Archipelago',
    distanceKm: 1400, // barge
    freightPerKgOut: 2.50,
    freightPerKgReturn: 1.20,
    wasteAvailableKg: 5000,
    communities: ['Angurugu', 'Umbakumba', 'Milyakburra'],
  },
  {
    id: 'alice-darwin',
    name: 'Alice Springs → Darwin',
    distanceKm: 1500,
    freightPerKgOut: 0.80,
    freightPerKgReturn: 0.40,
    wasteAvailableKg: 2500,
    communities: ['Darwin', 'Maningrida', 'Wadeye'],
  },
];

function currency(n: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LogisticsCalculatorPage() {
  const [beds, setBeds] = useState(100);
  const [selectedRoute, setSelectedRoute] = useState(routes[0].id);

  const route = routes.find((r) => r.id === selectedRoute) || routes[0];

  // Outbound: delivering beds
  const totalWeightOut = beds * BED_WEIGHT_KG;
  const palletsNeeded = Math.ceil(beds / BEDS_PER_PALLET);
  const freightCostOut = totalWeightOut * route.freightPerKgOut;

  // Return: backloading waste plastic
  const wasteCollected = Math.min(route.wasteAvailableKg, beds * HDPE_PER_BED_KG * 1.5); // collect up to 1.5x what's needed
  const freightCostReturn = wasteCollected * route.freightPerKgReturn;
  const bedsFromWaste = Math.floor(wasteCollected / HDPE_PER_BED_KG);

  // Economics
  const totalFreight = freightCostOut + freightCostReturn;
  const freightPerBed = totalFreight / beds;
  const traditionalFreight = beds * 500; // standard mattress freight ~$500 each
  const freightSavings = traditionalFreight - freightCostOut;
  const wasteValue = wasteCollected * 0.80; // estimated value of recycled HDPE per kg
  const netLogisticsCost = totalFreight - wasteValue;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="relative -mx-4 -mt-6 rounded-xl bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 px-8 py-12 text-white shadow-lg sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-10">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-amber-400 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-orange-400 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wider text-amber-300 uppercase">
            <Truck className="h-4 w-4" />
            Backloading Economics
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Logistics Calculator
          </h1>
          <p className="mt-2 text-lg text-amber-200">
            Deliver beds out, return with waste plastic. Every trip funds the next production run.
          </p>
        </div>
      </section>

      {/* Calculator Controls */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Configure Route</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Number of Beds</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">10</span>
                <span className="text-2xl font-bold text-amber-700">{beds} beds</span>
                <span className="text-sm text-gray-500">500</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Delivery Route</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {routes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoute(r.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                      selectedRoute === r.id
                        ? 'border-amber-500 bg-amber-50 text-amber-900 font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{r.name}</span>
                      <span className="text-xs text-gray-500">{r.distanceKm.toLocaleString()}km</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Flow Diagram */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">The Circuit</h2>
        </div>

        <div className="rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="rounded-xl bg-white border border-amber-200 p-4 text-center">
              <Package className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <div className="text-sm font-bold">Production</div>
              <div className="text-xs text-gray-500 mt-1">{beds} beds assembled</div>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-amber-400 rotate-90 md:rotate-0" />
            </div>
            <div className="rounded-xl bg-white border border-emerald-200 p-4 text-center">
              <Truck className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-sm font-bold">Deliver</div>
              <div className="text-xs text-gray-500 mt-1">{palletsNeeded} pallets out</div>
              <div className="text-xs text-emerald-600 font-medium">{currency(freightCostOut)}</div>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 text-amber-400 rotate-90 md:rotate-0" />
            </div>
            <div className="rounded-xl bg-white border border-blue-200 p-4 text-center">
              <Recycle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-bold">Backload</div>
              <div className="text-xs text-gray-500 mt-1">{(wasteCollected / 1000).toFixed(1)}t plastic back</div>
              <div className="text-xs text-blue-600 font-medium">{currency(freightCostReturn)}</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-600 text-white px-6 py-2 text-sm font-medium">
              <Recycle className="h-4 w-4" />
              Waste collected = {bedsFromWaste} beds worth of HDPE
            </div>
          </div>
        </div>
      </section>

      {/* Economics Breakdown */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Economics</h2>
          <p className="mt-1 text-sm text-gray-500">
            {route.name} — {beds} beds
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Outbound Freight', value: currency(freightCostOut), sub: `${currency(freightCostOut / beds)}/bed`, icon: Truck, color: 'text-amber-600' },
            { label: 'Return Freight', value: currency(freightCostReturn), sub: `${(wasteCollected / 1000).toFixed(1)}t waste plastic`, icon: Recycle, color: 'text-blue-600' },
            { label: 'Waste HDPE Value', value: currency(wasteValue), sub: `@ $0.80/kg recycled`, icon: DollarSign, color: 'text-emerald-600' },
            { label: 'Net Logistics Cost', value: currency(netLogisticsCost), sub: `${currency(netLogisticsCost / beds)}/bed net`, icon: TrendingUp, color: netLogisticsCost < 0 ? 'text-emerald-600' : 'text-gray-900' },
          ].map((card) => (
            <Card key={card.label}>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                  <span className="text-xs font-medium text-gray-500 uppercase">{card.label}</span>
                </div>
                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                <div className="text-xs text-gray-500 mt-1">{card.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison vs Traditional */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">vs Traditional Mattress Freight</h2>
        </div>

        <Card>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Standard Mattress</div>
                <div className="text-3xl font-bold text-red-600 mt-2">{currency(traditionalFreight)}</div>
                <div className="text-sm text-gray-500 mt-1">{beds} mattresses @ ~$500 each</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Goods Stretch Bed</div>
                <div className="text-3xl font-bold text-emerald-600 mt-2">{currency(freightCostOut)}</div>
                <div className="text-sm text-gray-500 mt-1">{beds} beds flat-packed, {palletsNeeded} pallets</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Savings</div>
                <div className="text-3xl font-bold text-amber-600 mt-2">{currency(freightSavings)}</div>
                <div className="text-sm text-gray-500 mt-1">{Math.round((freightSavings / traditionalFreight) * 100)}% reduction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Route Details */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Route Details</h2>
        </div>

        <Card>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-bold text-gray-900">{route.name}</div>
                  <div className="text-sm text-gray-500">{route.distanceKm.toLocaleString()}km — Communities: {route.communities.join(', ')}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-gray-500">Outbound rate</div>
                  <div className="font-bold">${route.freightPerKgOut.toFixed(2)}/kg</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Return rate (backload)</div>
                  <div className="font-bold">${route.freightPerKgReturn.toFixed(2)}/kg</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Waste available</div>
                  <div className="font-bold">{(route.wasteAvailableKg / 1000).toFixed(1)}t per trip</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Backload discount</div>
                  <div className="font-bold text-emerald-600">
                    {Math.round((1 - route.freightPerKgReturn / route.freightPerKgOut) * 100)}% cheaper
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* The punchline */}
      <section>
        <div className="rounded-2xl bg-gradient-to-br from-amber-900 to-orange-800 p-8 text-center">
          <div className="text-amber-300 text-sm uppercase tracking-widest mb-3">The loop</div>
          <p className="text-xl md:text-2xl font-black text-white leading-tight max-w-2xl mx-auto">
            Deliver beds → Collect waste plastic → Shred → Press → Make more beds → Deliver
          </p>
          <p className="text-amber-300/70 text-sm mt-4 max-w-md mx-auto">
            Every delivery funds the next production run. Zero inventory. Circular logistics.
          </p>
        </div>
      </section>
    </div>
  );
}
