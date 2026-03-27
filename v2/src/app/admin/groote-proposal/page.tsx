import { STRETCH_BED, WASHING_MACHINE, PRODUCTION_FACILITY, ENTERPRISE } from '@/lib/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Proposal for WHSAC — Groote Archipelago | Goods on Country',
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PRICING = {
  beds: { qty: 500, unitPrice: 560, label: 'Stretch Bed (Single)' },
  washers: { qty: 300, unitPrice: 4950, label: 'Washing Machine (Pakkimjalji Kari)' },
} as const;

const bedTotal = PRICING.beds.qty * PRICING.beds.unitPrice;
const washerTotal = PRICING.washers.qty * PRICING.washers.unitPrice;
const packageTotal = bedTotal + washerTotal;

const FREIGHT = {
  goodsBed: { perUnit: 163, perPallet: 60, description: 'Flat-pack, 26kg' },
  standardMattress: { perUnit: 500, perPallet: 12, description: 'Bulky, spring mattress' },
} as const;

const freightSavingPerBed = FREIGHT.standardMattress.perUnit - FREIGHT.goodsBed.perUnit;
const totalFreightSavings = freightSavingPerBed * PRICING.beds.qty;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function currency(n: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

// ---------------------------------------------------------------------------
// Section Components
// ---------------------------------------------------------------------------

function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2
      id={id}
      className="font-serif text-2xl md:text-3xl font-bold text-stone-800 mb-4 tracking-tight"
    >
      {children}
    </h2>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-amber-700 font-serif">{value}</div>
      <div className="text-sm text-stone-600 mt-1 font-medium">{label}</div>
      {sub && <div className="text-xs text-stone-400 mt-0.5">{sub}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GrooteProposalPage() {
  return (
    <div className="min-h-screen bg-white print:bg-white print:p-0">
      {/* ----------------------------------------------------------------- */}
      {/* 1. COVER / HEADER */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-stone-900 text-white px-6 py-16 md:py-24 print:py-12 print:bg-stone-900 print:text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-stone-900 font-bold text-lg">
              G
            </div>
            <span className="text-amber-400 font-serif text-lg tracking-wide">
              Goods on Country
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Proposal for WHSAC
            <br />
            <span className="text-amber-400">Groote Archipelago</span>
          </h1>

          <p className="text-stone-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
            A community health hardware package for the Anindilyakwa region — 500 Stretch Beds and
            300 Washing Machines designed for remote conditions.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-stone-400">
            <span>Prepared for: <strong className="text-white">Simone Grimmond, WHSAC</strong></span>
            <span className="text-stone-600">|</span>
            <span>Date: <strong className="text-white">March 2026</strong></span>
            <span className="text-stone-600">|</span>
            <span>
              Package value: <strong className="text-amber-400">{currency(packageTotal)}</strong>
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16 print:space-y-10">
        {/* ----------------------------------------------------------------- */}
        {/* 2. EXECUTIVE SUMMARY */}
        {/* ----------------------------------------------------------------- */}
        <section>
          <SectionHeading id="executive-summary">Executive Summary</SectionHeading>
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
            <p>
              Goods on Country proposes to supply WHSAC with a comprehensive health hardware package
              for the Groote Archipelago — 500 Stretch Beds and 300 commercial-grade washing machines
              — purpose-built for remote community conditions.
            </p>
            <p>
              Our flat-pack Stretch Bed eliminates the freight penalty that makes standard mattresses
              unaffordable on island communities. At 26kg and 60 beds per pallet, the freight savings
              alone on 500 beds ({currency(totalFreightSavings)}) cover the cost of 300 beds at unit
              price. The washable canvas surface directly addresses the scabies-to-Rheumatic Heart
              Disease pathway that disproportionately affects remote Indigenous communities.
            </p>
            <p>
              Combined with our commercial-grade washing machines — designed to last 10+ years where
              standard machines fail within months — this package represents a step-change in
              community health infrastructure for the Anindilyakwa region.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 3. THE PROBLEM */}
        {/* ----------------------------------------------------------------- */}
        <section className="print:break-before-page">
          <SectionHeading id="the-problem">The Problem</SectionHeading>

          <blockquote className="border-l-4 border-amber-500 pl-6 py-2 my-6 bg-amber-50 rounded-r-lg print:bg-amber-50">
            <p className="text-stone-700 italic text-lg leading-relaxed">
              &ldquo;We are on an island — literally. Therefore anything we purchase is so much more
              expensive due to freight.&rdquo;
            </p>
            <cite className="text-stone-500 text-sm not-italic block mt-2">
              — Simone Grimmond, WHSAC
            </cite>
          </blockquote>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="border-stone-200">
              <CardContent>
                <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">
                  Freight Makes Everything Unaffordable
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Groote Archipelago is serviced exclusively by barge. Bulky mattresses cost $500+ each
                  to freight, fitting only ~12 per pallet. For 500 beds, freight alone exceeds $250,000
                  — often more than the mattresses themselves. And those mattresses last 1-2 years in
                  remote conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardContent>
                <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">
                  Health Starts with Clean Bedding
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  1 in 3 children in remote communities have scabies at any given time. Scabies leads to
                  skin sores, Group A Strep infection, and ultimately Rheumatic Heart Disease — a
                  condition that is entirely preventable. Standard mattresses cannot be washed. Our
                  canvas sleeping surface can.
                </p>
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardContent>
                <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">
                  Washing Machines Go to the Dump
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  One Alice Springs provider sells $3M per year of washing machines into remote
                  communities. Most end up in dumps within months — they were never designed for remote
                  conditions, overcrowded housing, or bore water. Communities are paying premium prices
                  for disposable goods.
                </p>
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardContent>
                <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">
                  Overcrowding Accelerates Everything
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  55% of very remote First Nations homes are overcrowded. People sleeping on floors,
                  sharing beds, cycling through insufficient laundry. Every health hardware failure
                  compounds. The gap widens, not because of a lack of will, but a lack of fit-for-purpose
                  products.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 4. THE SOLUTION */}
        {/* ----------------------------------------------------------------- */}
        <section className="print:break-before-page">
          <SectionHeading id="the-solution">The Solution</SectionHeading>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Purpose-built health hardware, designed with communities, manufactured sustainably, and
            delivered at a fraction of the freight cost.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Stretch Bed */}
            <div className="border border-stone-200 rounded-xl p-6 bg-stone-50">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Flagship</Badge>
                <h3 className="font-serif font-bold text-stone-800 text-xl">
                  {STRETCH_BED.name}
                </h3>
              </div>
              <p className="text-stone-600 text-sm mb-4">{STRETCH_BED.shortDescription}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Weight</span>
                  <span className="font-medium text-stone-800">{STRETCH_BED.specs.weight}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Load Capacity</span>
                  <span className="font-medium text-stone-800">{STRETCH_BED.specs.loadCapacity}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Dimensions</span>
                  <span className="font-medium text-stone-800">{STRETCH_BED.specs.dimensions}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Assembly</span>
                  <span className="font-medium text-stone-800">
                    {STRETCH_BED.specs.assemblyTime}, {STRETCH_BED.specs.toolsRequired.toLowerCase()} tools
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Design Life</span>
                  <span className="font-medium text-stone-800">{STRETCH_BED.specs.designLifespan}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Warranty</span>
                  <span className="font-medium text-stone-800">{STRETCH_BED.specs.warranty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Plastic Diverted</span>
                  <span className="font-medium text-stone-800">{STRETCH_BED.specs.plasticDiverted}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-200">
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Key Features
                </h4>
                <ul className="text-sm text-stone-600 space-y-1">
                  {STRETCH_BED.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5 shrink-0">--</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Washing Machine */}
            <div className="border border-stone-200 rounded-xl p-6 bg-stone-50">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Commercial Grade
                </Badge>
                <h3 className="font-serif font-bold text-stone-800 text-xl">
                  {WASHING_MACHINE.name}
                </h3>
              </div>
              <p className="text-stone-600 text-sm mb-4">{WASHING_MACHINE.shortDescription}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Base Unit</span>
                  <span className="font-medium text-stone-800">{WASHING_MACHINE.specs.baseUnit}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Design Life</span>
                  <span className="font-medium text-stone-800">10+ years (vs 1-2 for consumer)</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Operation</span>
                  <span className="font-medium text-stone-800">One-button, community-tested</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1">
                  <span className="text-stone-500">Water</span>
                  <span className="font-medium text-stone-800">Bore water compatible</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Named by</span>
                  <span className="font-medium text-stone-800">Elder Dianne Stokes (Warumungu)</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-200">
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Why Commercial Grade Matters
                </h4>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">--</span>
                    Built for high-use, multi-household environments
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">--</span>
                    Handles bore water, red dust, heavy loads
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">--</span>
                    IoT-connected for remote monitoring and maintenance alerts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5 shrink-0">--</span>
                    Recycled plastic housing — locally repairable
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 5. FREIGHT COMPARISON */}
        {/* ----------------------------------------------------------------- */}
        <section className="print:break-before-page">
          <SectionHeading id="freight-comparison">Freight Comparison</SectionHeading>
          <p className="text-stone-600 mb-8 leading-relaxed">
            The flat-pack Stretch Bed fundamentally changes barge logistics. The freight savings on
            this order alone cover the cost of 300 beds at unit price.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Goods Bed */}
            <div className="border-2 border-amber-500 rounded-xl p-6 bg-amber-50 relative">
              <div className="absolute -top-3 left-4">
                <Badge className="bg-amber-500 text-white border-0 text-xs">
                  Goods Stretch Bed
                </Badge>
              </div>
              <div className="mt-2 space-y-4">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-amber-700 font-serif">
                    {currency(FREIGHT.goodsBed.perUnit)}
                  </div>
                  <div className="text-stone-600 text-sm">freight per bed via barge</div>
                </div>
                <div className="flex justify-between text-sm border-t border-amber-200 pt-3">
                  <span className="text-stone-600">Per pallet</span>
                  <span className="font-bold text-stone-800">{FREIGHT.goodsBed.perPallet} beds</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Form factor</span>
                  <span className="font-bold text-stone-800">{FREIGHT.goodsBed.description}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">500 beds freight</span>
                  <span className="font-bold text-amber-700">
                    {currency(FREIGHT.goodsBed.perUnit * 500)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Pallets needed</span>
                  <span className="font-bold text-stone-800">
                    ~{Math.ceil(500 / FREIGHT.goodsBed.perPallet)} pallets
                  </span>
                </div>
              </div>
            </div>

            {/* Standard Mattress */}
            <div className="border-2 border-stone-300 rounded-xl p-6 bg-stone-50 relative">
              <div className="absolute -top-3 left-4">
                <Badge variant="outline" className="bg-white text-stone-600 text-xs">
                  Standard Mattress
                </Badge>
              </div>
              <div className="mt-2 space-y-4">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-stone-500 font-serif">
                    {currency(FREIGHT.standardMattress.perUnit)}+
                  </div>
                  <div className="text-stone-500 text-sm">freight per mattress via barge</div>
                </div>
                <div className="flex justify-between text-sm border-t border-stone-200 pt-3">
                  <span className="text-stone-500">Per pallet</span>
                  <span className="font-bold text-stone-600">
                    ~{FREIGHT.standardMattress.perPallet} mattresses
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Form factor</span>
                  <span className="font-bold text-stone-600">
                    {FREIGHT.standardMattress.description}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">500 mattresses freight</span>
                  <span className="font-bold text-red-600">
                    {currency(FREIGHT.standardMattress.perUnit * 500)}+
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Pallets needed</span>
                  <span className="font-bold text-stone-600">
                    ~{Math.ceil(500 / FREIGHT.standardMattress.perPallet)} pallets
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings callout */}
          <div className="bg-stone-900 text-white rounded-xl p-8 text-center">
            <div className="text-stone-400 text-sm uppercase tracking-wider mb-2">
              Total Freight Savings on 500 Beds
            </div>
            <div className="text-5xl md:text-6xl font-bold text-amber-400 font-serif mb-3">
              {currency(totalFreightSavings)}
            </div>
            <p className="text-stone-300 max-w-lg mx-auto">
              Saving {currency(freightSavingPerBed)} per bed. The freight savings alone cover the
              cost of 300 beds at {currency(PRICING.beds.unitPrice)} unit price.
            </p>
            <div className="flex justify-center gap-8 mt-6 text-sm">
              <div>
                <div className="text-2xl font-bold text-amber-400">5x</div>
                <div className="text-stone-400">more beds per pallet</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">75%</div>
                <div className="text-stone-400">fewer pallets needed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">67%</div>
                <div className="text-stone-400">lower freight per bed</div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 6. PRICING TABLE */}
        {/* ----------------------------------------------------------------- */}
        <section className="print:break-before-page">
          <SectionHeading id="pricing">Pricing</SectionHeading>

          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-100">
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700">Item</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700 text-right">Qty</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700 text-right">
                    Unit Price
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-700 text-right">
                    Line Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-stone-200">
                  <td className="px-6 py-4">
                    <div className="font-medium text-stone-800">{PRICING.beds.label}</div>
                    <div className="text-sm text-stone-500">
                      Recycled HDPE + galvanised steel + canvas
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-stone-700">
                    {PRICING.beds.qty.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-stone-700">
                    {currency(PRICING.beds.unitPrice)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-stone-800">
                    {currency(bedTotal)}
                  </td>
                </tr>
                <tr className="border-t border-stone-200">
                  <td className="px-6 py-4">
                    <div className="font-medium text-stone-800">{PRICING.washers.label}</div>
                    <div className="text-sm text-stone-500">
                      Commercial Speed Queen base, IoT-connected
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-stone-700">
                    {PRICING.washers.qty.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-stone-700">
                    {currency(PRICING.washers.unitPrice)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-stone-800">
                    {currency(washerTotal)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-stone-300 bg-stone-50">
                  <td className="px-6 py-4 font-bold text-stone-800" colSpan={3}>
                    Total Package
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-2xl text-amber-700 font-serif">
                    {currency(packageTotal)}
                  </td>
                </tr>
                <tr className="border-t border-stone-200 bg-amber-50">
                  <td className="px-6 py-3 text-stone-600 text-sm" colSpan={3}>
                    Estimated freight savings (vs standard mattresses for 500 beds)
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-amber-700">
                    {currency(totalFreightSavings)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-sm text-stone-500 mt-4">
            Prices are ex-GST and exclude freight. Freight quoted separately based on barge schedule
            and staging. Volume pricing applied — institutional rate of {currency(PRICING.beds.unitPrice)}/bed
            (standard retail: $600).
          </p>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 7. COMMUNITY IMPACT */}
        {/* ----------------------------------------------------------------- */}
        <section className="print:break-before-page">
          <SectionHeading id="community-impact">Community Impact</SectionHeading>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Stat
              value="10t"
              label="Recycled plastic diverted"
              sub="20kg per bed x 500 beds"
            />
            <Stat
              value="500"
              label="Washable beds"
              sub="Breaking the scabies cycle"
            />
            <Stat
              value="300"
              label="10+ year washing machines"
              sub="vs 1-2 year consumer units"
            />
            <Stat
              value={currency(totalFreightSavings)}
              label="Freight savings"
              sub="Reinvested into community"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-stone-200">
              <CardContent>
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <span className="text-red-600 text-lg">+</span>
                </div>
                <h3 className="font-serif font-bold text-stone-800 mb-2">Health</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Washable beds interrupt the scabies-to-Rheumatic Heart Disease cascade. Functional
                  washing machines mean clean bedding, clean clothes, fewer skin infections. These are
                  not comfort items — they are cardiac prevention.
                </p>
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardContent>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <span className="text-green-600 text-lg">R</span>
                </div>
                <h3 className="font-serif font-bold text-stone-800 mb-2">Environmental</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  10 tonnes of HDPE plastic diverted from landfill and ocean — community-collected
                  waste transformed into virtually indestructible bed components. Every bed is a
                  circular economy story: local waste becomes local infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-stone-200">
              <CardContent>
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  <span className="text-amber-600 text-lg">$</span>
                </div>
                <h3 className="font-serif font-bold text-stone-800 mb-2">Economic</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  On-country manufacturing creates skilled employment in communities. The mobile
                  production facility can be community-operated, building local capacity in plastic
                  recycling, fabrication, and assembly. Our goal is to transfer ownership.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 8. PRODUCTION & LOGISTICS */}
        {/* ----------------------------------------------------------------- */}
        <section className="print:break-before-page">
          <SectionHeading id="production-logistics">Production &amp; Logistics</SectionHeading>

          <div className="space-y-8">
            {/* Production */}
            <div>
              <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">
                Manufacturing Model
              </h3>
              <p className="text-stone-600 mb-4 leading-relaxed">
                Goods operates a {PRODUCTION_FACILITY.type.toLowerCase()} — a two-container system
                that can be deployed to communities for on-country production. Beds are manufactured
                through a process of collecting, shredding, and pressing local plastic waste into
                structural components.
              </p>
              <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  Production Line
                </h4>
                <div className="flex flex-wrap gap-3">
                  {PRODUCTION_FACILITY.machines.map((machine, i) => (
                    <div key={machine} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-stone-700">
                        {i + 1}. {machine}
                      </Badge>
                      {i < PRODUCTION_FACILITY.machines.length - 1 && (
                        <span className="text-stone-400">--&gt;</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-stone-500 mt-3">
                  Capacity: {PRODUCTION_FACILITY.capacity}
                </p>
              </div>
            </div>

            {/* Circuit Model */}
            <div>
              <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">
                Delivery Circuit — Townsville to Groote
              </h3>
              <p className="text-stone-600 mb-4 leading-relaxed">
                The proposed Townsville plant (funded via REAL Fund) would be the closest production
                facility to Groote Archipelago. The circuit model allows production and delivery across
                multiple communities in a single deployment.
              </p>

              <div className="flex flex-col md:flex-row items-center gap-4 bg-stone-50 rounded-xl p-6 border border-stone-200">
                {['Townsville', 'Palm Island', 'Groote Archipelago', 'East Arnhem'].map(
                  (location, i) => (
                    <div key={location} className="flex items-center gap-4">
                      <div
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          location === 'Groote Archipelago'
                            ? 'bg-amber-500 text-white'
                            : 'bg-white border border-stone-300 text-stone-700'
                        }`}
                      >
                        {location}
                      </div>
                      {i < 3 && (
                        <span className="text-stone-400 hidden md:inline">--&gt;</span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-serif font-bold text-stone-800 text-lg mb-3">
                Indicative Timeline
              </h3>
              <div className="space-y-3">
                {[
                  {
                    phase: 'Agreement & Order Confirmation',
                    duration: 'Weeks 1-2',
                    detail: 'Finalise specs, quantities, delivery schedule',
                  },
                  {
                    phase: 'Bed Production',
                    duration: 'Weeks 3-16',
                    detail: '500 beds at ~30/week production rate',
                  },
                  {
                    phase: 'Washing Machine Procurement',
                    duration: 'Weeks 3-10',
                    detail: '300 units sourced, configured, and tested',
                  },
                  {
                    phase: 'Staging & Barge Loading',
                    duration: 'Weeks 14-16',
                    detail: 'Consolidate in Townsville, load onto barge',
                  },
                  {
                    phase: 'Delivery to Groote',
                    duration: 'Weeks 16-18',
                    detail: 'Barge delivery, on-ground distribution, assembly support',
                  },
                  {
                    phase: 'Community Training',
                    duration: 'Week 18',
                    detail: 'Assembly workshops, maintenance guides, IoT setup',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-24 shrink-0 text-sm font-medium text-amber-700">
                      {item.duration}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-stone-800 text-sm">{item.phase}</div>
                      <div className="text-stone-500 text-sm">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 9. ABOUT GOODS ON COUNTRY */}
        {/* ----------------------------------------------------------------- */}
        <section className="print:break-before-page">
          <SectionHeading id="about">About Goods on Country</SectionHeading>
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
            <p>
              Goods on Country designs and manufactures health hardware — beds, washing machines, and
              refrigerators — purpose-built for remote Indigenous communities across Australia. Our
              products are designed <em>with</em> communities, not <em>for</em> them, through
              extensive co-design sessions with Elders and families.
            </p>
            <p>
              Our flagship product, the Stretch Bed, has been delivered to 8+ communities with 400+
              assets tracked. Our mobile manufacturing facility converts community-collected plastic
              waste into bed components, creating local employment and a circular economy pathway.
            </p>
            <p>
              We are backed by the Snow Foundation, VFFF, FRRR, AMP Spark, and The Funding Network,
              with health service partners including Anyinginyi Health, Miwatj Health, Purple House,
              and Red Dust.
            </p>
          </div>

          <div className="mt-6 bg-stone-50 rounded-xl p-6 border border-stone-200">
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
              Key Partners
            </h3>
            <div className="flex flex-wrap gap-2">
              {ENTERPRISE.keyPartners.map((partner) => (
                <Badge key={partner} variant="outline" className="text-stone-600">
                  {partner}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 10. NEXT STEPS */}
        {/* ----------------------------------------------------------------- */}
        <section className="print:break-before-page">
          <SectionHeading id="next-steps">Next Steps</SectionHeading>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8">
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Review & Discussion',
                  detail:
                    'We would welcome the opportunity to discuss this proposal with WHSAC leadership and tailor quantities, staging, and delivery to your specific needs.',
                },
                {
                  step: '2',
                  title: 'Site Visit / Sample',
                  detail:
                    'We can provide sample Stretch Beds for on-site evaluation by community members and housing staff.',
                },
                {
                  step: '3',
                  title: 'Confirm Order & Schedule',
                  detail:
                    'Finalise quantities, delivery windows aligned with barge schedules, and payment terms.',
                },
                {
                  step: '4',
                  title: 'Production & Delivery',
                  detail:
                    'Begin production with regular updates. On-ground assembly support and community training included.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-medium text-stone-800">{item.title}</div>
                    <div className="text-stone-600 text-sm">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center text-stone-600">
            <p className="text-lg font-serif text-stone-800 mb-2">
              Contact
            </p>
            <p>
              Nicholas Marchesi, Founder
              <br />
              <span className="text-amber-700">nic@goodsoncountry.com</span>
              <br />
              <span className="text-stone-500">www.goodsoncountry.com</span>
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* Footer */}
        {/* ----------------------------------------------------------------- */}
        <footer className="border-t border-stone-200 pt-8 mt-16 print:mt-8 text-center text-sm text-stone-400">
          <p>
            Goods on Country &mdash; ABN pending &mdash; www.goodsoncountry.com
          </p>
          <p className="mt-1">
            This proposal is confidential and intended for WHSAC (Workforce Housing Services
            Aboriginal Corporation) only.
          </p>
        </footer>
      </div>
    </div>
  );
}
