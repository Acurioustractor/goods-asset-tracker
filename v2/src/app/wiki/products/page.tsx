import Link from 'next/link';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Products | Goods Wiki',
  description:
    'Complete guides for all Goods on Country products - specifications, assembly, maintenance, and troubleshooting.',
};

const products = [
  {
    name: 'Stretch Bed',
    slug: 'stretch-bed',
    status: 'Available',
    statusColor: 'bg-green-100 text-green-800',
    description:
      'Flat-packable, washable bed made from recycled HDPE plastic, galvanised steel, and heavy-duty canvas.',
    specs: ['12kg weight', '200kg capacity', '188x92x25cm', '5-year warranty'],
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: 'Pakkimjalki Kari (Washing Machine)',
    slug: 'washing-machine',
    status: 'Prototype',
    statusColor: 'bg-amber-100 text-amber-800',
    description:
      'Commercial-grade washing machine designed for reliability in remote conditions. Currently in community testing.',
    specs: [
      'Speed Queen base',
      'Commercial-grade',
      'Remote-optimized',
      'Active testing',
    ],
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  {
    name: 'Basket Bed',
    slug: 'basket-bed',
    status: 'Archived',
    statusColor: 'bg-neutral-100 text-neutral-600',
    description:
      'Original prototype bed design using collapsible baskets. Now open-source - download plans for free.',
    specs: [
      'Single/double variants',
      'Stackable design',
      'Open-source plans',
      'Discontinued sales',
    ],
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/wiki"
            className="text-sm text-neutral-600 hover:text-neutral-900 mb-4 inline-block"
          >
            ← Back to Wiki
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Products</h1>
          <p className="text-xl text-neutral-600 max-w-3xl">
            Complete guides for all Goods on Country products. Each guide
            includes specifications, assembly instructions, maintenance
            procedures, and troubleshooting.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/wiki/products/${product.slug}`}
              className="group"
            >
              <Card className="h-full p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-neutral-100 rounded-lg text-neutral-700 group-hover:bg-neutral-200 transition-colors">
                    {product.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700">
                      {product.name}
                    </h3>
                    <span
                      className={`inline-block text-xs font-medium px-2 py-1 rounded ${product.statusColor}`}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mb-4">
                  {product.description}
                </p>
                <ul className="space-y-1">
                  {product.specs.map((spec, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-500 flex items-center gap-2"
                    >
                      <span className="text-neutral-400">•</span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Design Philosophy */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Design Philosophy</h2>
            <div className="prose prose-neutral prose-sm max-w-none">
              <p className="text-neutral-700 mb-3">
                All Goods products are co-designed with remote Indigenous
                communities to ensure they meet real needs and work in harsh
                conditions.
              </p>
              <ul className="space-y-2 text-neutral-600">
                <li>• Built to last 10+ years</li>
                <li>• Repairable with common tools</li>
                <li>• Made from recycled or durable materials</li>
                <li>• Designed for remote logistics</li>
                <li>• Community training included</li>
              </ul>
            </div>
          </Card>

          {/* Comparing Products */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">
              Choosing the Right Product
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">
                  Stretch Bed
                </h3>
                <p className="text-neutral-600">
                  Best for: Individuals, families, community housing programs.
                  Ready to purchase now.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">
                  Washing Machine
                </h3>
                <p className="text-neutral-600">
                  Best for: Communities, organizations. Register interest for
                  prototype testing.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">
                  Basket Bed
                </h3>
                <p className="text-neutral-600">
                  Best for: DIY makers, educational projects. Download
                  open-source plans.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="mt-8 p-8 bg-neutral-900 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-3">
              Need Help Choosing?
            </h2>
            <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
              Not sure which product is right for your community or
              organization? Get in touch and we&apos;ll help you find the best
              solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/support/contact"
                className="inline-block bg-white text-neutral-900 px-6 py-3 rounded font-semibold hover:bg-neutral-100 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/shop/stretch-bed-single"
                className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-neutral-900 transition-colors"
              >
                Shop Stretch Bed
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
