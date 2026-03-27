'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function EconomicsDashboard() {
  // --- 1. aBOM STATE (ATOMIC COSTS) ---
  // Real supply chain data as of March 2026
  const [steelLengthMeter, setSteelLengthMeter] = useState(1.88); // 2x poles @ 940mm each
  const [steelPricePerMeter, setSteelPricePerMeter] = useState(5.50); // 26.9mm OD galv steel

  const [hdpeWeightKg, setHdpeWeightKg] = useState(20.0); // 20kg HDPE diverted per bed
  const [hdpePricePerKg, setHdpePricePerKg] = useState(-0.30); // Recycled plastic rebate

  const [canvasLengthMeter, setCanvasLengthMeter] = useState(2.1); // Heavy-duty AU canvas
  const [canvasPricePerMeter, setCanvasPricePerMeter] = useState(4.80);

  const [laborMinutes, setLaborMinutes] = useState(14); // CNC + assembly
  const [laborRatePerHour, setLaborRatePerHour] = useState(35.00);

  // Derived aBOM costs
  const totalSteelCost = steelLengthMeter * steelPricePerMeter;
  const totalHdpeCost = hdpeWeightKg * hdpePricePerKg;
  const totalCanvasCost = canvasLengthMeter * canvasPricePerMeter;
  const laborCost = (laborMinutes / 60) * laborRatePerHour;
  
  const rawCost = totalSteelCost + totalHdpeCost + totalCanvasCost;
  const mfgCost = laborCost + 5.00; // adding baseline overhead
  const totalFactoryCost = rawCost + mfgCost;

  const idiotIndex = rawCost > 0 ? (totalFactoryCost / rawCost).toFixed(2) : '0';
  const isIdiotIndexGood = parseFloat(idiotIndex) < 6.0 && parseFloat(idiotIndex) > 0;

  // --- 2. LOGISTICS STATE ---
  // AU Standard Pallet 1165×1165mm, max height 1500mm
  const [palletW, setPalletW] = useState(1165);
  const [palletL, setPalletL] = useState(1165);
  const [palletH, setPalletH] = useState(1500);

  // Stretch Bed flat-pack: 291×1165×25mm per unit → 60 beds/pallet
  const [bedW, setBedW] = useState(291);
  const [bedL, setBedL] = useState(1165);
  const [bedH, setBedH] = useState(25); // True flat-pack height
  const [shippingCost, setShippingCost] = useState(800);

  const [logistics, setLogistics] = useState({
    bedsPerPallet: 0,
    costPerBed: 0,
    wastedVolumePct: 0,
  });

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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLogistics({
      bedsPerPallet: maxBeds,
      costPerBed: costPer,
      wastedVolumePct: wastedPct,
    });
  }, [palletW, palletL, palletH, bedW, bedL, bedH, shippingCost]);

  // --- 3. HARDWARE AS A SERVICE (OPEX) STATE ---
  const [retailPrice, setRetailPrice] = useState(600.0); // Retail price (verified from Xero)
  const [opexMonthly, setOpexMonthly] = useState(9.00); // $9/mo lease = $540 over 5yr
  const [canvasCost, setCanvasCost] = useState(totalCanvasCost); // Canvas replacement @ year 3
  
  const totalCostBuild = totalFactoryCost + logistics.costPerBed;
  const capexProfit = retailPrice - totalCostBuild;
  
  // 5 years revenue -> 1 canvas replacement 
  const opexRevenue5yr = (opexMonthly * 12) * 5;
  const opexCost5yr = totalCostBuild + canvasCost;
  const opexProfit = opexRevenue5yr - opexCost5yr;
  
  const opexMultiplier = capexProfit > 0 ? (opexProfit / capexProfit).toFixed(2) : '0';

  // --- 4. B2G QUOTING ENGINE ---
  const [quoteQuantity, setQuoteQuantity] = useState(1000);
  const [quoteAgency, setQuoteAgency] = useState('NIAA / Dept of Defence');
  
  const totalContainers = logistics.bedsPerPallet > 0 ? Math.ceil(quoteQuantity / logistics.bedsPerPallet) : 0;
  const standardContainers = Math.ceil(quoteQuantity / 12); // Traditional mattress: ~12 per pallet
  const freightSavings = (standardContainers - totalContainers) * shippingCost;
  const totalQuoteRevenue = opexRevenue5yr * quoteQuantity;
  const totalQuoteProfit = opexProfit * quoteQuantity;

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">First Principles Economics</h1>
        <p className="text-gray-500 mt-2">
          Model supply chain efficiency, geometric freight density, and SaaS lease multipliers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: aBOM IDIOT INDEX */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>1. Algorithmic BOM (aBOM)</span>
              <Badge className={isIdiotIndexGood ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                Idiot Index: {idiotIndex}x
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-500">Atomic raw material costs vs assembly labor.</p>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Steel ($/m)</Label>
                    <Input type="number" step="0.10" value={steelPricePerMeter} onChange={e => setSteelPricePerMeter(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">HDPE Cost ($/kg)</Label>
                    <Input type="number" step="0.10" value={hdpePricePerKg} onChange={e => setHdpePricePerKg(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Canvas ($/m)</Label>
                    <Input type="number" step="0.10" value={canvasPricePerMeter} onChange={e => setCanvasPricePerMeter(Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">CNC Labor ($/hr)</Label>
                    <Input type="number" value={laborRatePerHour} onChange={e => setLaborRatePerHour(Number(e.target.value))} />
                  </div>
                </div>
             </div>
             
             <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center border">
                <span className="font-semibold text-gray-700">Total Factory Cost:</span>
                <span className="text-xl font-bold">${totalFactoryCost.toFixed(2)}</span>
             </div>
          </CardContent>
        </Card>

        {/* SECTION 2: OPEX FLYWHEEL */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>2. HWaaS Flywheel (OpEx)</span>
              <Badge className="bg-blue-100 text-blue-800">{opexMultiplier}x Margin Multiplier</Badge>
            </CardTitle>
            <p className="text-sm text-gray-500">5-Year return on lease vs outright CapEx sale.</p>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Retail Sale Price ($)</Label>
                  <Input type="number" value={retailPrice} onChange={e => setRetailPrice(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Lease ($)</Label>
                  <Input type="number" value={opexMonthly} onChange={e => setOpexMonthly(Number(e.target.value))} />
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center border">
                  <p className="text-sm text-gray-500 mb-1">CapEx Net (5 Yr)</p>
                  <p className="text-2xl font-bold text-gray-700">${capexProfit.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
                  <p className="text-sm text-blue-600 mb-1">OpEx Net (5 Yr)</p>
                  <p className="text-2xl font-bold text-blue-800">${opexProfit.toFixed(2)}</p>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* SECTION 3: LOGISTICS PAYLOAD */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>3. Geometric Payload Fraction (Freight Density)</span>
              <Badge className={logistics.wastedVolumePct < 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {logistics.wastedVolumePct.toFixed(1)}% Shipping Air
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-500">Optimizing flat-pack tessellation onto the AU Standard Pallet (1165x1165).</p>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="space-y-4 md:col-span-2">
                   <div className="grid grid-cols-3 gap-2">
                     <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Platform Width</Label>
                        <Input type="number" value={palletW} disabled />
                     </div>
                     <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Platform Length</Label>
                        <Input type="number" value={palletL} disabled />
                     </div>
                     <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Pallet Cost ($)</Label>
                        <Input type="number" value={shippingCost} onChange={e => setShippingCost(Number(e.target.value))} />
                     </div>
                   </div>

                   <div className="pt-2 border-t">
                     <p className="text-sm font-medium mb-3">Bed Packed Dimensions</p>
                     <div className="grid grid-cols-3 gap-2">
                       <div className="space-y-1">
                          <Label>Width (mm)</Label>
                          <Input type="number" value={bedW} onChange={e => setBedW(Number(e.target.value))} />
                       </div>
                       <div className="space-y-1">
                          <Label>Length (mm)</Label>
                          <Input type="number" value={bedL} onChange={e => setBedL(Number(e.target.value))} />
                       </div>
                       <div className="space-y-1">
                          <Label>Height (mm)</Label>
                          <Input type="number" value={bedH} onChange={e => setBedH(Number(e.target.value))} />
                       </div>
                     </div>
                   </div>
                </div>

                {/* Logistics Outputs */}
                <div className="flex flex-col space-y-3 justify-center">
                   <div className="p-3 bg-gray-50 rounded border">
                     <p className="text-xs text-gray-500 uppercase tracking-wider">Unit Density</p>
                     <p className="text-xl font-bold">{logistics.bedsPerPallet} Beds / Pallet</p>
                   </div>
                   <div className="p-3 bg-gray-50 rounded border">
                     <p className="text-xs text-gray-500 uppercase tracking-wider">Freight Cost Unit</p>
                     <p className="text-xl font-bold">${logistics.costPerBed.toFixed(2)}</p>
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* SECTION 4: B2G QUOTING ENGINE */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-orange-400">4. Generative B2G Quoting Engine</CardTitle>
            <p className="text-sm text-slate-400">Roll up atomic costs and payload density into an automated Swarm Proposal.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Target Government Agency</Label>
                  <Input className="bg-slate-800 border-slate-700 text-white" value={quoteAgency} onChange={e => setQuoteAgency(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Requested Volume (Units)</Label>
                  <Input className="bg-slate-800 border-slate-700 text-white" type="number" value={quoteQuantity} onChange={e => setQuoteQuantity(Number(e.target.value))} />
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <div className="p-4 border border-slate-700 bg-slate-800/50 rounded-lg shadow-inner">
                  <h4 className="font-semibold text-lg text-white mb-3">Proposal Output Mathematics</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex justify-between items-center">
                      <span>Total 5-Yr OpEx Revenue:</span>
                      <span className="font-mono text-white text-base">${totalQuoteRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    <li className="flex justify-between items-center my-2 pb-2 border-b border-slate-700">
                      <span>Net Profit Margin:</span>
                      <span className="font-mono text-green-400 font-bold text-lg">${totalQuoteProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
                    <li className="flex justify-between items-center pt-1">
                      <span>Logistics Optimization:</span>
                      <span className="font-mono text-orange-400">{totalContainers} Pallets <span className="text-slate-500 line-through pl-1">{standardContainers}</span></span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Government Freight Saved:</span>
                      <span className="font-mono text-white">${freightSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </li>
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
