import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STRETCH_BED, HDPE_CATALOG } from '@/lib/data/products';
import {
  Factory,
  Recycle,
  ArrowRight,
  Building2,
  Package,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HDPECatalogPage() {
  const totalPlasticDiverted = HDPE_CATALOG.reduce((sum, p) => {
    const match = p.specs.plasticDiverted.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 20); // start with 20kg from Stretch Bed

  return (
    <div className="space-y-12 pb-16">
      {/* Hero */}
      <section className="relative -mx-4 -mt-6 rounded-xl bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 px-8 py-12 text-white shadow-lg sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 overflow-hidden rounded-xl opacity-10">
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-teal-400 blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-cyan-400 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wider text-teal-300 uppercase">
            <Recycle className="h-4 w-4" />
            Product Expansion
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            HDPE Product Catalog
          </h1>
          <p className="mt-2 text-lg text-teal-200">
            The bed is the wedge. The same press makes wall panels, shelving, furniture, and playground equipment.
          </p>
        </div>

        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Current Product', value: 'Stretch Bed', color: 'text-amber-300' },
            { label: 'Expansion Products', value: String(HDPE_CATALOG.length), color: 'text-teal-300' },
            { label: 'Same Press', value: 'Yes', color: 'text-emerald-300' },
            { label: 'Target Market', value: '$4B housing', color: 'text-cyan-300' },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="text-xs font-medium text-teal-300/80 uppercase">{kpi.label}</div>
              <div className={`mt-2 text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Current: Stretch Bed */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Current: The Stretch Bed</h2>
          <p className="mt-1 text-sm text-gray-500">The proven product — {STRETCH_BED.specs.plasticDiverted} diverted per unit</p>
        </div>

        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{STRETCH_BED.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{STRETCH_BED.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-amber-100 text-amber-800">Available</Badge>
                  <Badge variant="outline">{STRETCH_BED.specs.weight}</Badge>
                  <Badge variant="outline">{STRETCH_BED.specs.plasticDiverted}</Badge>
                  <Badge variant="outline">{STRETCH_BED.specs.loadCapacity} capacity</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Expansion Products */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Expansion Catalog</h2>
          <p className="mt-1 text-sm text-gray-500">
            Same shredding + pressing equipment, different moulds. All from recycled HDPE.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HDPE_CATALOG.map((product) => (
            <Card key={product.slug} className="relative overflow-hidden">
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg bg-teal-600 text-white border-0 text-xs">
                  {product.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{product.description}</p>

                <div className="space-y-2 text-sm">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                      <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium text-gray-800 text-right max-w-[60%]">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-teal-50 border border-teal-100 p-3">
                  <div className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1">Market Fit</div>
                  <div className="text-xs text-teal-800">{product.marketFit}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-500">Est. price</span>
                  <span className="font-bold text-gray-900">{product.priceEstimate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why HDPE */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Why HDPE?</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'UV Resistant', detail: 'Withstands decades of outback sun without degradation' },
            { title: 'Waterproof', detail: 'No rot, no mould, no termites — perfect for remote conditions' },
            { title: 'Fully Washable', detail: 'Pressure-clean with water. Graffiti wipes off.' },
            { title: 'Virtually Indestructible', detail: '200kg load capacity on bed legs. Near-zero breakage rate.' },
            { title: 'Locally Sourced', detail: 'Made from community-collected plastic waste — circular economy' },
            { title: 'Same Equipment', detail: 'One shredder + press makes all products. Different moulds only.' },
          ].map((prop) => (
            <Card key={prop.title}>
              <CardContent>
                <h3 className="font-bold text-gray-900">{prop.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{prop.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* The Play */}
      <section>
        <div className="rounded-2xl bg-gradient-to-br from-teal-900 to-cyan-800 p-8 text-center">
          <div className="text-teal-300 text-sm uppercase tracking-widest mb-3">The bigger play</div>
          <p className="text-2xl md:text-3xl font-black text-white leading-tight max-w-2xl mx-auto">
            The bed gets you in the door.<br />
            The housing fitout supply chain is the market.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 text-teal-300">
            <span className="text-sm">Bed legs</span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-sm">Wall panels</span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-sm">Furniture</span>
            <ArrowRight className="h-4 w-4" />
            <span className="text-sm font-bold text-white">Entire fitout</span>
          </div>
        </div>
      </section>
    </div>
  );
}
