import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFundingSummary, financialSnapshot } from '@/lib/data/compendium';
import { DealsTable, type DealRow } from '@/components/strategy/deals-table';

export const dynamic = 'force-dynamic';

// Xero-verified pricing
const BED_PRICING = {
  stretch_institutional: 560,
  stretch_retail: 600,
  stretch_picc: 750,
  basket: 370,
  workshop: 6000,
  delivery: 3000,
};

// Plant distribution strategy
const PLANTS = [
  {
    id: 'alice-springs',
    name: 'Alice Springs Plant',
    status: 'planning' as const,
    partner: 'Oonchiumpa Consultancy',
    region: 'Central Australia',
    catchment: [
      'Utopia Homelands (107 beds committed)',
      'Alice Homelands (60 beds deployed)',
      'Tennant Creek (139 beds deployed)',
      'NPY Lands ("always looking for beds")',
      'Kalgoorlie / Ninga Mia (20 beds deployed)',
    ],
    fundingPath: 'REAL Innovation Fund (EOI submitted) + Snow Foundation Round 4',
    keyFacts: [
      'Oonchiumpa as lead applicant for REAL Fund',
      'Circuit model: Alice Springs → Tennant Creek → Katherine → Darwin',
      'Production facility $100K investment (2 containers)',
      'Builds 200 beds from 200 tubs of plastic',
    ],
  },
  {
    id: 'townsville',
    name: 'Townsville / Palm Island Plant',
    status: 'exploring' as const,
    partner: 'PICC (Palm Island Community Company)',
    region: 'North Queensland',
    catchment: [
      'Palm Island (141 beds deployed — largest community)',
      'Mt Isa / Kalkadoon (4 beds testing)',
      'Groote Archipelago (500 mattresses + 300 washers requested)',
      'East Arnhem / Miwatj Health (8 clinics exploring)',
    ],
    fundingPath: 'Tim Fairfax Foundation + SEFA repayable finance',
    keyFacts: [
      'PICC said "we\'ll buy it" re: the production facility itself',
      'Ebony & Jahvan Oui training with Defy — future operators',
      'REAL Innovation Fund — $1.2M for Townsville plant over 4yr',
      'Tim Fairfax Foundation — 33 comms, QLD focus',
    ],
  },
];

export default async function StrategyPage() {
  const supabase = createServiceClient();
  const fundingSummary = getFundingSummary();

  // Get ALL deals
  const [wonRes, activeRes] = await Promise.all([
    supabase
      .from('crm_deals')
      .select('title, amount_cents, deal_type, pipeline_stage, units, notes')
      .eq('pipeline_stage', 'won')
      .order('amount_cents', { ascending: false }),
    supabase
      .from('crm_deals')
      .select('title, amount_cents, pipeline_stage, deal_type, units, notes')
      .neq('pipeline_stage', 'won')
      .neq('pipeline_stage', 'lost')
      .order('amount_cents', { ascending: false }),
  ]);

  const wonDeals = (wonRes.data || []) as DealRow[];
  const activeDeals = (activeRes.data || []) as DealRow[];

  const totalFundingWon = wonDeals.filter(d => d.deal_type === 'funding').reduce((s, d) => s + (d.amount_cents || 0), 0);
  const totalUnitsWon = wonDeals.filter(d => d.deal_type === 'sale').reduce((s, d) => s + (d.units || 0), 0);
  const totalActive = activeDeals.reduce((s, d) => s + (d.amount_cents || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Strategic Sales</h1>
        <p className="mt-1 text-sm text-gray-500">
          Plant distribution, deals pipeline, and Xero reconciliation
        </p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Trade Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(financialSnapshot.tradeRevenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-500 mt-1">Xero-verified PAID</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Funding Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalFundingWon / 100 / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-500 mt-1">{wonDeals.filter(d => d.deal_type === 'funding').length} grants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Units Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnitsWon}</div>
            <p className="text-xs text-gray-500 mt-1">beds + washers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${(financialSnapshot.outstandingReceivables / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-500 mt-1">unpaid invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${(totalActive / 100 / 1000).toFixed(1)}M</div>
            <p className="text-xs text-gray-500 mt-1">{activeDeals.length} active deals</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Deals Table */}
      <DealsTable wonDeals={wonDeals} activeDeals={activeDeals} />

      {/* Plant Distribution Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PLANTS.map(plant => (
          <Card key={plant.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plant.name}</CardTitle>
                <Badge className={plant.status === 'planning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}>
                  {plant.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{plant.partner} &middot; {plant.region}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Catchment Communities</h4>
                <ul className="space-y-1">
                  {plant.catchment.map((c, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">&#9679;</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Funding Path</h4>
                <p className="text-sm text-gray-600">{plant.fundingPath}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Facts</h4>
                <ul className="space-y-1">
                  {plant.keyFacts.map((f, i) => (
                    <li key={i} className="text-xs text-gray-500">&bull; {f}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bed Pricing Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Bed Pricing (Xero-verified)</CardTitle>
          <p className="text-sm text-gray-500">Reference pricing from actual invoices</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Stretch (institutional)', price: BED_PRICING.stretch_institutional, note: 'Centrecorp rate' },
              { label: 'Stretch (retail)', price: BED_PRICING.stretch_retail, note: 'Direct sale' },
              { label: 'Stretch (PICC)', price: BED_PRICING.stretch_picc, note: 'May inc GST' },
              { label: 'Basket Bed', price: BED_PRICING.basket, note: 'Discontinued' },
              { label: 'Workshop', price: BED_PRICING.workshop, note: 'Per session' },
              { label: 'Delivery', price: BED_PRICING.delivery, note: 'Per delivery' },
            ].map((p, i) => (
              <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold">${p.price.toLocaleString()}</div>
                <div className="text-xs font-medium text-gray-700 mt-1">{p.label}</div>
                <div className="text-xs text-gray-400">{p.note}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Funding Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-green-800">Grants Received</div>
            <div className="text-2xl font-bold text-green-900 mt-1">${(fundingSummary.received / 1000).toFixed(0)}K</div>
            <div className="text-xs text-green-700 mt-1">Snow, TFN, FRRR, VFFF, AMP</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-amber-800">Pending Applications</div>
            <div className="text-2xl font-bold text-amber-900 mt-1">${(fundingSummary.pending / 1000).toFixed(0)}K</div>
            <div className="text-xs text-amber-700 mt-1">SEFA, Snow R4, QBE, REAL, SEDG</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-orange-800">Receivables</div>
            <div className="text-2xl font-bold text-orange-900 mt-1">${(fundingSummary.receivables / 1000).toFixed(0)}K</div>
            <div className="text-xs text-orange-700 mt-1">Authorised invoices awaiting payment</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
