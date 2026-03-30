'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function EconomicsDashboard() {
  // --- PRODUCTION MODEL TOGGLE ---
  const [model, setModel] = useState<'factory' | 'defy'>('factory');

  // --- THROUGHPUT MODEL ---
  const [bedsPerDay, setBedsPerDay] = useState(5);
  const [operators, setOperators] = useState(1);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [laborRatePerHour, setLaborRatePerHour] = useState(50.00);

  const dailyLabourCost = operators * hoursPerDay * laborRatePerHour;
  const labourPerBed = bedsPerDay > 0 ? dailyLabourCost / bedsPerDay : 0;

  // --- DIESEL (daily model) ---
  const [dieselPricePerLitre, setDieselPricePerLitre] = useState(3.00);
  const [dieselLitresPerDay, setDieselLitresPerDay] = useState(25); // Joey's observed ~25L/day
  const dailyDieselCost = dieselLitresPerDay * dieselPricePerLitre;
  const dieselPerBed = bedsPerDay > 0 ? dailyDieselCost / bedsPerDay : 0;

  // --- PLASTIC MATERIAL ---
  const [plasticPricePerKg, setPlasticPricePerKg] = useState(2.00);
  const [deliveryPricePerKg, setDeliveryPricePerKg] = useState(0.75); // ~$900/1200kg
  const plasticTotalPerKg = plasticPricePerKg + deliveryPricePerKg;
  const plasticKgPerBed = 20; // 10kg per side × 2 sides
  const extraFactor = 1.05; // 5% overfill
  const plasticCostPerBed = plasticKgPerBed * extraFactor * plasticTotalPerKg;

  // --- HARDWARE (per bed, same for both models) ---
  const [steelLengthMeter, setSteelLengthMeter] = useState(1.88);
  const [steelPricePerMeter, setSteelPricePerMeter] = useState(5.50);
  const [canvasLengthMeter, setCanvasLengthMeter] = useState(2.1);
  const [canvasPricePerMeter, setCanvasPricePerMeter] = useState(4.80);
  const [screwsCostPerBed, setScrewsCostPerBed] = useState(3.50);

  const steelCost = steelLengthMeter * steelPricePerMeter;
  const canvasCost = canvasLengthMeter * canvasPricePerMeter;
  const hardwareCost = steelCost + canvasCost + screwsCostPerBed;

  // --- FACTORY MODEL TOTALS ---
  const factoryTotalPerBed = plasticCostPerBed + dieselPerBed + labourPerBed + hardwareCost;

  // --- DEFY KIT MODEL ---
  const [defyKitPrice, setDefyKitPrice] = useState(344.05);
  const [defyKitFreight, setDefyKitFreight] = useState(0);
  const [defyAssemblyBedsPerDay, setDefyAssemblyBedsPerDay] = useState(10); // Assembly-only throughput
  const defyLabourPerBed = defyAssemblyBedsPerDay > 0 ? dailyLabourCost / defyAssemblyBedsPerDay : 0;
  const defyTotalPerBed = defyKitPrice + defyKitFreight + defyLabourPerBed + hardwareCost;

  // --- COMMUNITY MODEL (free plastic, volunteer labour) ---
  const communityTotalPerBed = dieselPerBed + hardwareCost;

  // --- ACTIVE MODEL ---
  const activeCost = model === 'factory' ? factoryTotalPerBed : defyTotalPerBed;

  // --- PRICING ---
  const [retailPrice, setRetailPrice] = useState(600.00);
  const [institutionalPrice, setInstitutionalPrice] = useState(560.00);
  const retailMargin = retailPrice - activeCost;
  const institutionalMargin = institutionalPrice - activeCost;

  // --- LOGISTICS ---
  const [palletW] = useState(1165);
  const [palletL] = useState(1165);
  const [palletH] = useState(1500);
  const [bedW, setBedW] = useState(291);
  const [bedL, setBedL] = useState(1165);
  const [bedH, setBedH] = useState(25);
  const [shippingCost, setShippingCost] = useState(800);
  const [logistics, setLogistics] = useState({ bedsPerPallet: 0, costPerBed: 0, wastedVolumePct: 0 });

  useEffect(() => {
    const fitW = bedW > palletW ? 1 : Math.floor(palletW / bedW);
    const fitL = bedL > palletL ? 1 : Math.floor(palletL / bedL);
    const bedsPerLayer = fitW * fitL;
    const layers = bedH > palletH ? 1 : Math.floor(palletH / bedH);
    const maxBeds = bedsPerLayer * layers;
    const costPer = maxBeds > 0 ? (shippingCost / maxBeds) : 0;
    const palletVol = palletW * palletL * palletH;
    const bedsVol = (bedW * bedL * bedH) * maxBeds;
    const wastedPct = palletVol > 0 ? ((1 - (bedsVol / palletVol)) * 100) : 0;
    setLogistics({ bedsPerPallet: maxBeds, costPerBed: costPer, wastedVolumePct: wastedPct });
  }, [palletW, palletL, palletH, bedW, bedL, bedH, shippingCost]);

  const totalCostDelivered = activeCost + logistics.costPerBed;

  // --- OPEX / HWaaS ---
  const [opexMonthly, setOpexMonthly] = useState(9.00);
  const capexProfit = retailPrice - totalCostDelivered;
  const opexRevenue5yr = (opexMonthly * 12) * 5;
  const opexCost5yr = totalCostDelivered + canvasCost;
  const opexProfit = opexRevenue5yr - opexCost5yr;
  const opexMultiplier = capexProfit > 0 ? (opexProfit / capexProfit).toFixed(2) : '0';

  // --- B2G QUOTING ---
  const [quoteQuantity, setQuoteQuantity] = useState(1000);
  const totalContainers = logistics.bedsPerPallet > 0 ? Math.ceil(quoteQuantity / logistics.bedsPerPallet) : 0;
  const standardContainers = Math.ceil(quoteQuantity / 12);
  const freightSavings = (standardContainers - totalContainers) * shippingCost;
  const totalQuoteRevenue = opexRevenue5yr * quoteQuantity;
  const totalQuoteProfit = opexProfit * quoteQuantity;

  // --- WEEKLY/MONTHLY PROJECTIONS ---
  const bedsPerWeek = bedsPerDay * 5;
  const bedsPerMonth = bedsPerWeek * 4;
  const weeklyRevenue = bedsPerWeek * retailPrice;
  const weeklyProfit = bedsPerWeek * retailMargin;
  const monthlyRevenue = bedsPerMonth * retailPrice;
  const monthlyProfit = bedsPerMonth * retailMargin;

  const fmt = (n: number) => '$' + n.toFixed(2);
  const fmtK = (n: number) => n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : fmt(n);

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stretch Bed Economics</h1>
        <p className="text-gray-500 mt-2">
          Throughput-based cost model from March 2026 production data (Joey, weeks 5-7).
        </p>
      </div>

      {/* MODEL TOGGLE */}
      <div className="flex gap-2">
        <button onClick={() => setModel('factory')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${model === 'factory' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Factory Production
        </button>
        <button onClick={() => setModel('defy')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${model === 'defy' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Defy Kit Supply
        </button>
      </div>

      {/* TOP-LINE SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 uppercase">Cost / Bed</p>
          <p className="text-2xl font-bold text-gray-800">{fmt(activeCost)}</p>
        </div>
        <div className={`rounded-xl border p-4 text-center ${retailMargin > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-xs text-gray-500 uppercase">Retail Margin</p>
          <p className={`text-2xl font-bold ${retailMargin > 0 ? 'text-green-700' : 'text-red-700'}`}>{fmt(retailMargin)}</p>
          <p className="text-xs text-gray-400">{retailPrice > 0 ? ((retailMargin / retailPrice) * 100).toFixed(0) : 0}%</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 uppercase">Weekly Output</p>
          <p className="text-2xl font-bold text-gray-800">{bedsPerWeek} beds</p>
          <p className="text-xs text-gray-400">{fmtK(weeklyRevenue)} revenue</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-xs text-gray-500 uppercase">Monthly Profit</p>
          <p className="text-2xl font-bold text-green-700">{fmtK(monthlyProfit)}</p>
          <p className="text-xs text-gray-400">{bedsPerMonth} beds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* SECTION 1: THROUGHPUT + LABOUR */}
        <Card>
          <CardHeader>
            <CardTitle>1. Daily Throughput</CardTitle>
            <p className="text-sm text-gray-500">Operator multitasks across stations. Press and CNC run unattended.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Beds / Day</Label>
                <Input type="number" value={bedsPerDay} onChange={e => setBedsPerDay(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Operators</Label>
                <Input type="number" value={operators} onChange={e => setOperators(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hours / Day</Label>
                <Input type="number" value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Rate ($/hr)</Label>
                <Input type="number" value={laborRatePerHour} onChange={e => setLaborRatePerHour(Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-gray-50 rounded border text-center">
                <p className="text-xs text-gray-500">Daily Labour Cost</p>
                <p className="text-xl font-bold">{fmt(dailyLabourCost)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded border border-green-200 text-center">
                <p className="text-xs text-gray-500">Labour / Bed</p>
                <p className="text-xl font-bold text-green-700">{fmt(labourPerBed)}</p>
              </div>
            </div>
            {model === 'defy' && (
              <div className="space-y-1 pt-2 border-t">
                <Label className="text-xs">Assembly-only throughput (beds/day)</Label>
                <Input type="number" value={defyAssemblyBedsPerDay} onChange={e => setDefyAssemblyBedsPerDay(Number(e.target.value))} />
                <p className="text-xs text-gray-400">Kits arrive pre-cut. Assembly only = higher throughput.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION 2: MATERIALS + DIESEL */}
        <Card>
          <CardHeader>
            <CardTitle>2. Materials + Energy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {model === 'factory' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Plastic ($/kg)</Label>
                    <Input type="number" step="0.10" value={plasticPricePerKg} onChange={e => setPlasticPricePerKg(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Delivery ($/kg)</Label>
                    <Input type="number" step="0.10" value={deliveryPricePerKg} onChange={e => setDeliveryPricePerKg(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Diesel ($/L)</Label>
                    <Input type="number" step="0.10" value={dieselPricePerLitre} onChange={e => setDieselPricePerLitre(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Diesel (L/day)</Label>
                    <Input type="number" value={dieselLitresPerDay} onChange={e => setDieselLitresPerDay(Number(e.target.value))} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="p-3 bg-gray-50 rounded border text-center">
                    <p className="text-xs text-gray-500">Plastic / Bed</p>
                    <p className="text-lg font-bold">{fmt(plasticCostPerBed)}</p>
                    <p className="text-xs text-gray-400">{(plasticKgPerBed * extraFactor).toFixed(1)}kg @ {fmt(plasticTotalPerKg)}/kg</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border text-center">
                    <p className="text-xs text-gray-500">Diesel / Bed</p>
                    <p className="text-lg font-bold">{fmt(dieselPerBed)}</p>
                    <p className="text-xs text-gray-400">{(dieselLitresPerDay / bedsPerDay).toFixed(1)}L</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border text-center">
                    <p className="text-xs text-gray-500">Hardware / Bed</p>
                    <p className="text-lg font-bold">{fmt(hardwareCost)}</p>
                    <p className="text-xs text-gray-400">steel + canvas + screws</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Defy Kit ($/kit)</Label>
                    <Input type="number" step="0.01" value={defyKitPrice} onChange={e => setDefyKitPrice(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Kit Freight ($/kit)</Label>
                    <Input type="number" step="0.01" value={defyKitFreight} onChange={e => setDefyKitFreight(Number(e.target.value))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="p-3 bg-gray-50 rounded border text-center">
                    <p className="text-xs text-gray-500">Kit Cost</p>
                    <p className="text-lg font-bold">{fmt(defyKitPrice + defyKitFreight)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border text-center">
                    <p className="text-xs text-gray-500">Hardware / Bed</p>
                    <p className="text-lg font-bold">{fmt(hardwareCost)}</p>
                  </div>
                </div>
                <div className="p-3 bg-amber-50 rounded border border-amber-200 mt-2">
                  <p className="text-xs text-amber-800">Defy kit freight TBC. Ref: INV-1732 (27 Mar 2026). 40 kits per pallet (~1000kg).</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* SECTION 3: FULL COST BREAKDOWN */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>3. Full Cost Breakdown</span>
              <Badge className={activeCost < institutionalPrice ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {fmt(activeCost)} / bed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="py-2">Component</th>
                    <th className="py-2 text-right">Cost</th>
                    <th className="py-2 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {model === 'factory' ? (
                    <>
                      <tr className="border-b"><td className="py-2">Recycled plastic ({(plasticKgPerBed * extraFactor).toFixed(1)}kg @ {fmt(plasticTotalPerKg)}/kg)</td><td className="py-2 text-right">{fmt(plasticCostPerBed)}</td><td className="py-2 text-right text-gray-400">{(plasticCostPerBed / factoryTotalPerBed * 100).toFixed(0)}%</td></tr>
                      <tr className="border-b"><td className="py-2">Diesel ({(dieselLitresPerDay / bedsPerDay).toFixed(1)}L @ {fmt(dieselPricePerLitre)}/L)</td><td className="py-2 text-right">{fmt(dieselPerBed)}</td><td className="py-2 text-right text-gray-400">{(dieselPerBed / factoryTotalPerBed * 100).toFixed(0)}%</td></tr>
                      <tr className="border-b"><td className="py-2">Labour ({operators} op × {hoursPerDay}hr ÷ {bedsPerDay} beds)</td><td className="py-2 text-right">{fmt(labourPerBed)}</td><td className="py-2 text-right text-gray-400">{(labourPerBed / factoryTotalPerBed * 100).toFixed(0)}%</td></tr>
                      <tr className="border-b"><td className="py-2">Steel poles ({steelLengthMeter}m @ {fmt(steelPricePerMeter)}/m)</td><td className="py-2 text-right">{fmt(steelCost)}</td><td className="py-2 text-right text-gray-400">{(steelCost / factoryTotalPerBed * 100).toFixed(0)}%</td></tr>
                      <tr className="border-b"><td className="py-2">Canvas ({canvasLengthMeter}m @ {fmt(canvasPricePerMeter)}/m)</td><td className="py-2 text-right">{fmt(canvasCost)}</td><td className="py-2 text-right text-gray-400">{(canvasCost / factoryTotalPerBed * 100).toFixed(0)}%</td></tr>
                      <tr className="border-b"><td className="py-2">Screws / hardware</td><td className="py-2 text-right">{fmt(screwsCostPerBed)}</td><td className="py-2 text-right text-gray-400">{(screwsCostPerBed / factoryTotalPerBed * 100).toFixed(0)}%</td></tr>
                    </>
                  ) : (
                    <>
                      <tr className="border-b"><td className="py-2">Defy kit (pre-cut plastic)</td><td className="py-2 text-right">{fmt(defyKitPrice)}</td><td className="py-2 text-right text-gray-400">{(defyKitPrice / defyTotalPerBed * 100).toFixed(0)}%</td></tr>
                      <tr className="border-b"><td className="py-2">Kit freight</td><td className="py-2 text-right">{fmt(defyKitFreight)}</td><td className="py-2 text-right text-gray-400">{defyTotalPerBed > 0 ? (defyKitFreight / defyTotalPerBed * 100).toFixed(0) : 0}%</td></tr>
                      <tr className="border-b"><td className="py-2">Assembly labour ({fmt(dailyLabourCost)}/day ÷ {defyAssemblyBedsPerDay} beds)</td><td className="py-2 text-right">{fmt(defyLabourPerBed)}</td><td className="py-2 text-right text-gray-400">{(defyLabourPerBed / defyTotalPerBed * 100).toFixed(0)}%</td></tr>
                      <tr className="border-b"><td className="py-2">Steel poles</td><td className="py-2 text-right">{fmt(steelCost)}</td><td className="py-2 text-right text-gray-400">{(steelCost / defyTotalPerBed * 100).toFixed(0)}%</td></tr>
                      <tr className="border-b"><td className="py-2">Canvas</td><td className="py-2 text-right">{fmt(canvasCost)}</td><td className="py-2 text-right text-gray-400">{(canvasCost / defyTotalPerBed * 100).toFixed(0)}%</td></tr>
                      <tr className="border-b"><td className="py-2">Screws / hardware</td><td className="py-2 text-right">{fmt(screwsCostPerBed)}</td><td className="py-2 text-right text-gray-400">{(screwsCostPerBed / defyTotalPerBed * 100).toFixed(0)}%</td></tr>
                    </>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-bold text-base">
                    <td className="py-3">TOTAL PER BED</td>
                    <td className="py-3 text-right">{fmt(activeCost)}</td>
                    <td className="py-3 text-right">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Three-model comparison */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
                <p className="text-xs text-green-600 uppercase font-semibold">Community Model</p>
                <p className="text-2xl font-bold text-green-800 mt-1">{fmt(communityTotalPerBed)}</p>
                <p className="text-xs text-green-600 mt-1">Free plastic + volunteer</p>
              </div>
              <div className={`p-4 rounded-xl border text-center ${model === 'factory' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                <p className="text-xs text-blue-600 uppercase font-semibold">Factory Model</p>
                <p className="text-2xl font-bold text-blue-800 mt-1">{fmt(factoryTotalPerBed)}</p>
                <p className="text-xs text-blue-600 mt-1">Paid materials + operator</p>
              </div>
              <div className={`p-4 rounded-xl border text-center ${model === 'defy' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50'}`}>
                <p className="text-xs text-amber-600 uppercase font-semibold">Defy Kit Model</p>
                <p className="text-2xl font-bold text-amber-800 mt-1">{fmt(defyTotalPerBed)}</p>
                <p className="text-xs text-amber-600 mt-1">Pre-cut kits + assembly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 4: MARGIN ANALYSIS */}
        <Card>
          <CardHeader>
            <CardTitle>4. Margin Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Retail ($)</Label>
                <Input type="number" value={retailPrice} onChange={e => setRetailPrice(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Institutional ($)</Label>
                <Input type="number" value={institutionalPrice} onChange={e => setInstitutionalPrice(Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className={`p-4 rounded-lg text-center border ${retailMargin > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-xs text-gray-500 mb-1">Retail</p>
                <p className={`text-2xl font-bold ${retailMargin > 0 ? 'text-green-700' : 'text-red-700'}`}>{fmt(retailMargin)}</p>
                <p className="text-xs text-gray-400">{retailPrice > 0 ? ((retailMargin / retailPrice) * 100).toFixed(0) : 0}% margin</p>
              </div>
              <div className={`p-4 rounded-lg text-center border ${institutionalMargin > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-xs text-gray-500 mb-1">Institutional</p>
                <p className={`text-2xl font-bold ${institutionalMargin > 0 ? 'text-green-700' : 'text-red-700'}`}>{fmt(institutionalMargin)}</p>
                <p className="text-xs text-gray-400">{institutionalPrice > 0 ? ((institutionalMargin / institutionalPrice) * 100).toFixed(0) : 0}% margin</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded border text-xs text-gray-500">
              + Delivery freight {fmt(logistics.costPerBed)}/bed = delivered cost {fmt(totalCostDelivered)}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 5: OPEX FLYWHEEL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>5. HWaaS Flywheel</span>
              <Badge className="bg-blue-100 text-blue-800">{opexMultiplier}x over 5yr</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs">Monthly Lease ($)</Label>
              <Input type="number" value={opexMonthly} onChange={e => setOpexMonthly(Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-gray-50 rounded-lg text-center border">
                <p className="text-xs text-gray-500 mb-1">CapEx Sale</p>
                <p className="text-2xl font-bold text-gray-700">{fmt(capexProfit)}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
                <p className="text-xs text-blue-600 mb-1">OpEx 5yr Net</p>
                <p className="text-2xl font-bold text-blue-800">{fmt(opexProfit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 6: LOGISTICS */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>6. Freight Density</span>
              <Badge className={logistics.wastedVolumePct < 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {logistics.bedsPerPallet} beds/pallet
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1"><Label className="text-xs">Width (mm)</Label><Input type="number" value={bedW} onChange={e => setBedW(Number(e.target.value))} /></div>
                  <div className="space-y-1"><Label className="text-xs">Length (mm)</Label><Input type="number" value={bedL} onChange={e => setBedL(Number(e.target.value))} /></div>
                  <div className="space-y-1"><Label className="text-xs">Height (mm)</Label><Input type="number" value={bedH} onChange={e => setBedH(Number(e.target.value))} /></div>
                </div>
                <div className="space-y-1"><Label className="text-xs">Pallet Cost ($)</Label><Input type="number" value={shippingCost} onChange={e => setShippingCost(Number(e.target.value))} /></div>
              </div>
              <div className="flex flex-col space-y-3 justify-center">
                <div className="p-3 bg-gray-50 rounded border text-center">
                  <p className="text-xs text-gray-500">Beds / Pallet</p>
                  <p className="text-xl font-bold">{logistics.bedsPerPallet}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded border text-center">
                  <p className="text-xs text-gray-500">Freight / Bed</p>
                  <p className="text-xl font-bold">{fmt(logistics.costPerBed)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 7: B2G QUOTING */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-orange-400">7. B2G Quoting Engine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <Label className="text-slate-300">Volume (units)</Label>
                <Input className="bg-slate-800 border-slate-700 text-white" type="number" value={quoteQuantity} onChange={e => setQuoteQuantity(Number(e.target.value))} />
              </div>
              <div className="flex flex-col justify-center">
                <div className="p-4 border border-slate-700 bg-slate-800/50 rounded-lg">
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex justify-between"><span>5yr OpEx Revenue:</span><span className="font-mono text-white">${totalQuoteRevenue.toLocaleString()}</span></li>
                    <li className="flex justify-between border-b border-slate-700 pb-2"><span>Net Profit:</span><span className="font-mono text-green-400 font-bold">${totalQuoteProfit.toLocaleString()}</span></li>
                    <li className="flex justify-between pt-1"><span>Pallets:</span><span className="font-mono text-orange-400">{totalContainers} <span className="text-slate-500 line-through pl-1">{standardContainers}</span></span></li>
                    <li className="flex justify-between"><span>Freight saved:</span><span className="font-mono text-white">${freightSavings.toLocaleString()}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
