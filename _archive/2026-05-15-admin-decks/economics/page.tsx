'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

type Model = 'factory' | 'panels' | 'kits' | 'community';

const MODEL_INFO: Record<Model, { label: string; color: string; bg: string; border: string; desc: string }> = {
  factory:   { label: 'Factory Production',  color: 'text-green-800', bg: 'bg-green-50',  border: 'border-green-200', desc: 'Raw shred, press + CNC + finish' },
  panels:    { label: 'Defy Panels',         color: 'text-blue-800',  bg: 'bg-blue-50',   border: 'border-blue-200',  desc: 'Pre-pressed panels, CNC + finish' },
  kits:      { label: 'Defy Bed Kits',       color: 'text-amber-800', bg: 'bg-amber-50',  border: 'border-amber-200', desc: 'Pre-cut kits, assembly only' },
  community: { label: 'Community Model',     color: 'text-purple-800',bg: 'bg-purple-50', border: 'border-purple-200',desc: 'Free plastic + volunteer labour' },
};

export default function EconomicsDashboard() {
  const [model, setModel] = useState<Model>('factory');

  // --- SHARED INPUTS ---
  const [laborRatePerHour, setLaborRatePerHour] = useState(50.00);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [operators, setOperators] = useState(1);
  const dailyLabourCost = operators * hoursPerDay * laborRatePerHour;

  // --- DIESEL ---
  const [dieselPricePerLitre, setDieselPricePerLitre] = useState(3.00);
  const [dieselLitresPerDay, setDieselLitresPerDay] = useState(25);

  // --- MATERIAL COSTS ---
  const [plasticPricePerKg, setPlasticPricePerKg] = useState(2.00);
  const [deliveryPricePerKg, setDeliveryPricePerKg] = useState(0.75);
  const plasticRatePerKg = plasticPricePerKg + deliveryPricePerKg;
  const plasticKgPerBed = 20 * 1.05; // 20kg + 5% overfill

  // --- HARDWARE (same for all models) ---
  const [steelPricePerMeter, setSteelPricePerMeter] = useState(5.50);
  const steelLengthMeter = 1.88;
  const [canvasPricePerMeter, setCanvasPricePerMeter] = useState(4.80);
  const canvasLengthMeter = 2.1;
  const [screwsCost, setScrewsCost] = useState(3.50);
  const steelCost = steelLengthMeter * steelPricePerMeter;
  const canvasCost = canvasLengthMeter * canvasPricePerMeter;
  const hardwareCost = steelCost + canvasCost + screwsCost;

  // --- DEFY PRICING ---
  const [defyPanelPrice, setDefyPanelPrice] = useState(200.00); // per 1200x1200 panel (INV-1731)
  const [defyKitPrice, setDefyKitPrice] = useState(344.05);     // per bed kit (INV-1732)
  const [defyKitFreight, setDefyKitFreight] = useState(25.00);  // est per kit

  // --- THROUGHPUT PER MODEL ---
  const [factoryBedsPerDay, setFactoryBedsPerDay] = useState(5);
  const [panelBedsPerDay, setPanelBedsPerDay] = useState(7.5);   // skip pressing
  const [kitBedsPerDay, setKitBedsPerDay] = useState(10);        // assembly only

  // --- PRICING ---
  const [retailPrice, setRetailPrice] = useState(600.00);
  const [institutionalPrice, setInstitutionalPrice] = useState(560.00);

  // ========================
  // COST CALCULATIONS
  // ========================

  // Factory: raw shred, full production
  const factoryPlastic = plasticKgPerBed * plasticRatePerKg;
  const factoryDiesel = factoryBedsPerDay > 0 ? (dieselLitresPerDay * dieselPricePerLitre) / factoryBedsPerDay : 0;
  const factoryLabour = factoryBedsPerDay > 0 ? dailyLabourCost / factoryBedsPerDay : 0;
  const factoryTotal = factoryPlastic + factoryDiesel + factoryLabour + hardwareCost;

  // Defy Panels: buy 1200x1200 panels, CNC + finish on site
  const panelPlastic = defyPanelPrice * 2; // 2 panels per bed
  const panelDiesel = panelBedsPerDay > 0 ? ((dieselLitresPerDay * 0.5) * dieselPricePerLitre) / panelBedsPerDay : 0; // ~50% diesel (CNC only, no press)
  const panelLabour = panelBedsPerDay > 0 ? dailyLabourCost / panelBedsPerDay : 0;
  const panelTotal = panelPlastic + panelDiesel + panelLabour + hardwareCost;

  // Defy Kits: buy pre-cut + finished kits, assembly only
  const kitPlastic = defyKitPrice + defyKitFreight;
  const kitDiesel = 0; // no machines
  const kitLabour = kitBedsPerDay > 0 ? dailyLabourCost / kitBedsPerDay : 0;
  const kitTotal = kitPlastic + kitDiesel + kitLabour + hardwareCost;

  // Community: free plastic, volunteer labour
  const communityPlastic = 0;
  const communityDiesel = factoryBedsPerDay > 0 ? (dieselLitresPerDay * dieselPricePerLitre) / factoryBedsPerDay : 0;
  const communityLabour = 0;
  const communityTotal = communityPlastic + communityDiesel + hardwareCost;

  // Active model
  const costs: Record<Model, { plastic: number; diesel: number; labour: number; total: number; throughput: number }> = {
    factory:   { plastic: factoryPlastic, diesel: factoryDiesel, labour: factoryLabour, total: factoryTotal, throughput: factoryBedsPerDay },
    panels:    { plastic: panelPlastic,   diesel: panelDiesel,   labour: panelLabour,   total: panelTotal,   throughput: panelBedsPerDay },
    kits:      { plastic: kitPlastic,     diesel: kitDiesel,     labour: kitLabour,     total: kitTotal,     throughput: kitBedsPerDay },
    community: { plastic: communityPlastic,diesel: communityDiesel,labour: communityLabour,total: communityTotal, throughput: factoryBedsPerDay },
  };

  const active = costs[model];
  const retailMargin = retailPrice - active.total;
  const instMargin = institutionalPrice - active.total;

  // --- LOGISTICS ---
  const [bedW, setBedW] = useState(291);
  const [bedL, setBedL] = useState(1165);
  const [bedH, setBedH] = useState(25);
  const [shippingCost, setShippingCost] = useState(800);
  const palletW = 1165, palletL = 1165, palletH = 1500;
  const [logistics, setLogistics] = useState({ bedsPerPallet: 0, costPerBed: 0, wastedVolumePct: 0 });

  useEffect(() => {
    const fitW = Math.floor(palletW / bedW);
    const fitL = Math.floor(palletL / bedL);
    const layers = Math.floor(palletH / bedH);
    const maxBeds = fitW * fitL * layers;
    const costPer = maxBeds > 0 ? shippingCost / maxBeds : 0;
    const wastedPct = ((1 - ((bedW * bedL * bedH * maxBeds) / (palletW * palletL * palletH))) * 100);
    setLogistics({ bedsPerPallet: maxBeds, costPerBed: costPer, wastedVolumePct: wastedPct });
  }, [bedW, bedL, bedH, shippingCost]);

  const totalDelivered = active.total + logistics.costPerBed;

  // --- OPEX ---
  const [opexMonthly, setOpexMonthly] = useState(9.00);
  const capexProfit = retailPrice - totalDelivered;
  const opexRevenue5yr = opexMonthly * 12 * 5;
  const opexProfit = opexRevenue5yr - (totalDelivered + canvasCost);
  const opexMultiplier = capexProfit > 0 ? (opexProfit / capexProfit).toFixed(2) : '0';

  // --- B2G ---
  const [quoteQuantity, setQuoteQuantity] = useState(1000);
  const totalPallets = logistics.bedsPerPallet > 0 ? Math.ceil(quoteQuantity / logistics.bedsPerPallet) : 0;
  const standardPallets = Math.ceil(quoteQuantity / 12);

  // --- PROJECTIONS ---
  const bedsPerWeek = active.throughput * 5;
  const bedsPerMonth = bedsPerWeek * 4;

  const fmt = (n: number) => '$' + n.toFixed(2);
  const fmtK = (n: number) => n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : fmt(n);
  const pct = (margin: number, price: number) => price > 0 ? ((margin / price) * 100).toFixed(0) + '%' : '0%';

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stretch Bed Economics</h1>
        <p className="text-gray-500 mt-2">Throughput-based cost model. Four supply paths compared.</p>
      </div>

      {/* MODEL TOGGLE */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(MODEL_INFO) as Model[]).map(m => (
          <button key={m} onClick={() => setModel(m)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${model === m ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {MODEL_INFO[m].label}
          </button>
        ))}
      </div>

      {/* TOP-LINE SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 uppercase">Cost / Bed</p>
          <p className="text-2xl font-bold text-gray-800">{fmt(active.total)}</p>
        </div>
        <div className={`rounded-xl border p-4 text-center ${retailMargin > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-xs text-gray-500 uppercase">Retail Margin</p>
          <p className={`text-2xl font-bold ${retailMargin > 0 ? 'text-green-700' : 'text-red-700'}`}>{fmt(retailMargin)}</p>
          <p className="text-xs text-gray-400">{pct(retailMargin, retailPrice)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 uppercase">Weekly Output</p>
          <p className="text-2xl font-bold text-gray-800">{bedsPerWeek} beds</p>
          <p className="text-xs text-gray-400">{fmtK(bedsPerWeek * retailPrice)} revenue</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 uppercase">Monthly Profit</p>
          <p className="text-2xl font-bold text-green-700">{fmtK(bedsPerMonth * retailMargin)}</p>
          <p className="text-xs text-gray-400">{bedsPerMonth} beds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* SECTION 1: ALL MODELS COMPARISON */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>1. All Supply Paths Compared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-2">Component</th>
                    <th className="py-2 text-right">Factory</th>
                    <th className="py-2 text-right">Defy Panels</th>
                    <th className="py-2 text-right">Defy Kits</th>
                    <th className="py-2 text-right">Community</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Plastic / panels / kit</td>
                    <td className="py-2 text-right">{fmt(factoryPlastic)}</td>
                    <td className="py-2 text-right">{fmt(panelPlastic)}</td>
                    <td className="py-2 text-right">{fmt(kitPlastic)}</td>
                    <td className="py-2 text-right text-green-600">$0.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Diesel</td>
                    <td className="py-2 text-right">{fmt(factoryDiesel)}</td>
                    <td className="py-2 text-right">{fmt(panelDiesel)}</td>
                    <td className="py-2 text-right">$0.00</td>
                    <td className="py-2 text-right">{fmt(communityDiesel)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Labour</td>
                    <td className="py-2 text-right">{fmt(factoryLabour)}</td>
                    <td className="py-2 text-right">{fmt(panelLabour)}</td>
                    <td className="py-2 text-right">{fmt(kitLabour)}</td>
                    <td className="py-2 text-right text-green-600">$0.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Steel + Canvas + Screws</td>
                    <td className="py-2 text-right">{fmt(hardwareCost)}</td>
                    <td className="py-2 text-right">{fmt(hardwareCost)}</td>
                    <td className="py-2 text-right">{fmt(hardwareCost)}</td>
                    <td className="py-2 text-right">{fmt(hardwareCost)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-bold text-base bg-gray-50">
                    <td className="py-3">TOTAL / BED</td>
                    <td className="py-3 text-right text-green-700">{fmt(factoryTotal)}</td>
                    <td className="py-3 text-right text-blue-700">{fmt(panelTotal)}</td>
                    <td className="py-3 text-right text-amber-700">{fmt(kitTotal)}</td>
                    <td className="py-3 text-right text-purple-700">{fmt(communityTotal)}</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="py-2 text-gray-500">Retail margin ($600)</td>
                    <td className="py-2 text-right font-semibold text-green-600">{fmt(retailPrice - factoryTotal)} ({pct(retailPrice - factoryTotal, retailPrice)})</td>
                    <td className="py-2 text-right font-semibold text-blue-600">{fmt(retailPrice - panelTotal)} ({pct(retailPrice - panelTotal, retailPrice)})</td>
                    <td className="py-2 text-right font-semibold text-amber-600">{fmt(retailPrice - kitTotal)} ({pct(retailPrice - kitTotal, retailPrice)})</td>
                    <td className="py-2 text-right font-semibold text-purple-600">{fmt(retailPrice - communityTotal)} ({pct(retailPrice - communityTotal, retailPrice)})</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="py-2 text-gray-500">Institutional margin ($560)</td>
                    <td className="py-2 text-right text-green-600">{fmt(institutionalPrice - factoryTotal)} ({pct(institutionalPrice - factoryTotal, institutionalPrice)})</td>
                    <td className="py-2 text-right text-blue-600">{fmt(institutionalPrice - panelTotal)} ({pct(institutionalPrice - panelTotal, institutionalPrice)})</td>
                    <td className="py-2 text-right text-amber-600">{fmt(institutionalPrice - kitTotal)} ({pct(institutionalPrice - kitTotal, institutionalPrice)})</td>
                    <td className="py-2 text-right text-purple-600">{fmt(institutionalPrice - communityTotal)} ({pct(institutionalPrice - communityTotal, institutionalPrice)})</td>
                  </tr>
                  <tr className="text-sm border-t">
                    <td className="py-2 text-gray-500">Throughput</td>
                    <td className="py-2 text-right">{factoryBedsPerDay}/day</td>
                    <td className="py-2 text-right">{panelBedsPerDay}/day</td>
                    <td className="py-2 text-right">{kitBedsPerDay}/day</td>
                    <td className="py-2 text-right">{factoryBedsPerDay}/day</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="py-2 text-gray-500">Facility needed</td>
                    <td className="py-2 text-right text-xs">Full (press+CNC+router)</td>
                    <td className="py-2 text-right text-xs">Partial (CNC+router)</td>
                    <td className="py-2 text-right text-xs">Shed + impact driver</td>
                    <td className="py-2 text-right text-xs">Full (volunteer-run)</td>
                  </tr>
                  <tr className="text-sm">
                    <td className="py-2 text-gray-500">Best for</td>
                    <td className="py-2 text-right text-xs">Ongoing production</td>
                    <td className="py-2 text-right text-xs">Press busy/broken</td>
                    <td className="py-2 text-right text-xs">Remote sites, no facility</td>
                    <td className="py-2 text-right text-xs">Community ownership</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Visual comparison cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {(Object.keys(MODEL_INFO) as Model[]).map(m => {
                const c = costs[m];
                const info = MODEL_INFO[m];
                const margin = retailPrice - c.total;
                return (
                  <div key={m} className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${model === m ? `${info.bg} ${info.border} ring-2 ring-offset-1 ring-green-500` : 'bg-white hover:bg-gray-50'}`} onClick={() => setModel(m)}>
                    <p className={`text-xs font-semibold uppercase ${info.color}`}>{info.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${info.color}`}>{fmt(c.total)}</p>
                    <p className="text-xs text-gray-500 mt-1">{fmt(margin)} margin ({pct(margin, retailPrice)})</p>
                    <p className="text-xs text-gray-400">{c.throughput}/day</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: ACTIVE MODEL DETAIL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>2. {MODEL_INFO[model].label} Detail</span>
              <Badge className={`${MODEL_INFO[model].bg} ${MODEL_INFO[model].color}`}>{fmt(active.total)}</Badge>
            </CardTitle>
            <p className="text-sm text-gray-500">{MODEL_INFO[model].desc}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-xs">Labour ($/hr)</Label><Input type="number" value={laborRatePerHour} onChange={e => setLaborRatePerHour(Number(e.target.value))} /></div>
              <div className="space-y-1"><Label className="text-xs">Hours / Day</Label><Input type="number" value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))} /></div>
            </div>

            {model === 'factory' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label className="text-xs">Beds / Day</Label><Input type="number" step="0.5" value={factoryBedsPerDay} onChange={e => setFactoryBedsPerDay(Number(e.target.value))} /></div>
                <div className="space-y-1"><Label className="text-xs">Plastic ($/kg)</Label><Input type="number" step="0.10" value={plasticPricePerKg} onChange={e => setPlasticPricePerKg(Number(e.target.value))} /></div>
                <div className="space-y-1"><Label className="text-xs">Delivery ($/kg)</Label><Input type="number" step="0.10" value={deliveryPricePerKg} onChange={e => setDeliveryPricePerKg(Number(e.target.value))} /></div>
                <div className="space-y-1"><Label className="text-xs">Diesel (L/day)</Label><Input type="number" value={dieselLitresPerDay} onChange={e => setDieselLitresPerDay(Number(e.target.value))} /></div>
              </div>
            )}
            {model === 'panels' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label className="text-xs">Beds / Day</Label><Input type="number" step="0.5" value={panelBedsPerDay} onChange={e => setPanelBedsPerDay(Number(e.target.value))} /></div>
                <div className="space-y-1"><Label className="text-xs">Panel Price ($)</Label><Input type="number" step="1" value={defyPanelPrice} onChange={e => setDefyPanelPrice(Number(e.target.value))} /></div>
              </div>
            )}
            {model === 'kits' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label className="text-xs">Beds / Day (assembly)</Label><Input type="number" step="0.5" value={kitBedsPerDay} onChange={e => setKitBedsPerDay(Number(e.target.value))} /></div>
                <div className="space-y-1"><Label className="text-xs">Kit Price ($)</Label><Input type="number" step="0.01" value={defyKitPrice} onChange={e => setDefyKitPrice(Number(e.target.value))} /></div>
                <div className="space-y-1"><Label className="text-xs">Kit Freight ($)</Label><Input type="number" step="1" value={defyKitFreight} onChange={e => setDefyKitFreight(Number(e.target.value))} /></div>
              </div>
            )}
            {model === 'community' && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800">
                  Community collects waste plastic (free). Volunteers or CDP participants operate the facility.
                  Only costs are diesel for the generator and hardware (steel, canvas, screws).
                </p>
              </div>
            )}

            {/* Cost stack bar */}
            <div className="mt-4">
              <div className="flex rounded-lg overflow-hidden h-8 text-xs font-medium text-white">
                {active.plastic > 0 && <div className="bg-blue-500 flex items-center justify-center" style={{ width: `${(active.plastic / active.total) * 100}%` }}>{active.total > 0 && (active.plastic / active.total * 100) > 10 ? 'Plastic' : ''}</div>}
                {active.diesel > 0 && <div className="bg-amber-500 flex items-center justify-center" style={{ width: `${(active.diesel / active.total) * 100}%` }}>{active.total > 0 && (active.diesel / active.total * 100) > 10 ? 'Diesel' : ''}</div>}
                {active.labour > 0 && <div className="bg-purple-500 flex items-center justify-center" style={{ width: `${(active.labour / active.total) * 100}%` }}>{active.total > 0 && (active.labour / active.total * 100) > 10 ? 'Labour' : ''}</div>}
                <div className="bg-gray-400 flex items-center justify-center" style={{ width: `${(hardwareCost / active.total) * 100}%` }}>{active.total > 0 && (hardwareCost / active.total * 100) > 10 ? 'Hardware' : ''}</div>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Plastic {fmt(active.plastic)}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Diesel {fmt(active.diesel)}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-500 inline-block" /> Labour {fmt(active.labour)}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-400 inline-block" /> Hardware {fmt(hardwareCost)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: MARGIN + PRICING */}
        <Card>
          <CardHeader><CardTitle>3. Pricing + Margin</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label className="text-xs">Retail ($)</Label><Input type="number" value={retailPrice} onChange={e => setRetailPrice(Number(e.target.value))} /></div>
              <div className="space-y-1"><Label className="text-xs">Institutional ($)</Label><Input type="number" value={institutionalPrice} onChange={e => setInstitutionalPrice(Number(e.target.value))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg text-center border ${retailMargin > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-xs text-gray-500">Retail</p>
                <p className={`text-2xl font-bold ${retailMargin > 0 ? 'text-green-700' : 'text-red-700'}`}>{fmt(retailMargin)}</p>
                <p className="text-xs text-gray-400">{pct(retailMargin, retailPrice)}</p>
              </div>
              <div className={`p-4 rounded-lg text-center border ${instMargin > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-xs text-gray-500">Institutional</p>
                <p className={`text-2xl font-bold ${instMargin > 0 ? 'text-green-700' : 'text-red-700'}`}>{fmt(instMargin)}</p>
                <p className="text-xs text-gray-400">{pct(instMargin, institutionalPrice)}</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded border text-xs text-gray-500">
              + Freight {fmt(logistics.costPerBed)}/bed = delivered {fmt(totalDelivered)}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: OPEX */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>4. HWaaS Flywheel</span>
              <Badge className="bg-blue-100 text-blue-800">{opexMultiplier}x over 5yr</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1"><Label className="text-xs">Monthly Lease ($)</Label><Input type="number" value={opexMonthly} onChange={e => setOpexMonthly(Number(e.target.value))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center border">
                <p className="text-xs text-gray-500">CapEx Sale</p>
                <p className="text-2xl font-bold text-gray-700">{fmt(capexProfit)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
                <p className="text-xs text-blue-600">OpEx 5yr Net</p>
                <p className="text-2xl font-bold text-blue-800">{fmt(opexProfit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 5: LOGISTICS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>5. Freight Density</span>
              <Badge className="bg-green-100 text-green-800">{logistics.bedsPerPallet} beds/pallet</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1"><Label className="text-xs">Width</Label><Input type="number" value={bedW} onChange={e => setBedW(Number(e.target.value))} /></div>
              <div className="space-y-1"><Label className="text-xs">Length</Label><Input type="number" value={bedL} onChange={e => setBedL(Number(e.target.value))} /></div>
              <div className="space-y-1"><Label className="text-xs">Height</Label><Input type="number" value={bedH} onChange={e => setBedH(Number(e.target.value))} /></div>
            </div>
            <div className="space-y-1"><Label className="text-xs">Pallet Cost ($)</Label><Input type="number" value={shippingCost} onChange={e => setShippingCost(Number(e.target.value))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded border text-center"><p className="text-xs text-gray-500">Beds / Pallet</p><p className="text-xl font-bold">{logistics.bedsPerPallet}</p></div>
              <div className="p-3 bg-gray-50 rounded border text-center"><p className="text-xs text-gray-500">Freight / Bed</p><p className="text-xl font-bold">{fmt(logistics.costPerBed)}</p></div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 6: B2G */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 text-white">
          <CardHeader><CardTitle className="text-orange-400">6. B2G Quoting Engine</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <Label className="text-slate-300">Volume (units)</Label>
                <Input className="bg-slate-800 border-slate-700 text-white" type="number" value={quoteQuantity} onChange={e => setQuoteQuantity(Number(e.target.value))} />
              </div>
              <div className="p-4 border border-slate-700 bg-slate-800/50 rounded-lg">
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex justify-between"><span>5yr OpEx Revenue:</span><span className="font-mono text-white">${(opexRevenue5yr * quoteQuantity).toLocaleString()}</span></li>
                  <li className="flex justify-between border-b border-slate-700 pb-2"><span>Net Profit:</span><span className="font-mono text-green-400 font-bold">${(opexProfit * quoteQuantity).toLocaleString()}</span></li>
                  <li className="flex justify-between pt-1"><span>Pallets:</span><span className="font-mono text-orange-400">{totalPallets} <span className="text-slate-500 line-through pl-1">{standardPallets}</span></span></li>
                  <li className="flex justify-between"><span>Freight saved:</span><span className="font-mono text-white">${((standardPallets - totalPallets) * shippingCost).toLocaleString()}</span></li>
                  <li className="flex justify-between"><span>Production time:</span><span className="font-mono text-white">{Math.ceil(quoteQuantity / active.throughput)} days ({Math.ceil(quoteQuantity / (active.throughput * 5))} weeks)</span></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
