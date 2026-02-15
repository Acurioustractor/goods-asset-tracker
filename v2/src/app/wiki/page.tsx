import { Metadata } from 'next';
import Link from 'next/link';
import { WikiSearch } from '@/components/wiki/wiki-search';

export const metadata: Metadata = {
  title: 'Goods Wiki & Knowledge Base | Goods on Country',
  description: 'Comprehensive guide covering production facilities, products, support, and the full Goods on Country knowledge base.',
};

export default function WikiPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-green-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Goods Wiki & Knowledge Base
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mb-8">
            Everything you need to know about Goods on Country — from operating
            recycling plants to product guides, community support, and the full story.
          </p>

          {/* Search */}
          <div className="flex justify-center">
            <WikiSearch />
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 py-4 overflow-x-auto">
            <a href="#manufacturing" className="text-sm font-medium text-gray-700 hover:text-green-600 whitespace-nowrap">
              Manufacturing
            </a>
            <a href="#products" className="text-sm font-medium text-gray-700 hover:text-green-600 whitespace-nowrap">
              Products
            </a>
            <a href="#support" className="text-sm font-medium text-gray-700 hover:text-green-600 whitespace-nowrap">
              Support
            </a>
            <a href="#community" className="text-sm font-medium text-gray-700 hover:text-green-600 whitespace-nowrap">
              Community
            </a>
            <a href="#guides" className="text-sm font-medium text-gray-700 hover:text-green-600 whitespace-nowrap">
              How-To Guides
            </a>
            <a href="#about" className="text-sm font-medium text-gray-700 hover:text-green-600 whitespace-nowrap">
              About
            </a>
          </div>
        </div>
      </nav>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Manufacturing Section */}
        <section id="manufacturing" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Manufacturing & Production</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            <Link
              href="/wiki/manufacturing/facility-manual"
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                📦 Travelling Facility Manual
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Complete operations manual for the mobile on-country plastic re-production facility.
              </p>
              <span className="text-green-600 text-sm font-medium">View manual →</span>
            </Link>

            <Link
              href="/wiki/manufacturing/machine-specs"
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                🔧 Machine Specifications
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Technical specs for shredder, heat press, CNC router, and other equipment.
              </p>
              <span className="text-green-600 text-sm font-medium">View specs →</span>
            </Link>

            <Link
              href="/wiki/manufacturing/plastic-processing"
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ♻️ Plastic Processing Guide
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Material types, sorting, safety, and quality control for plastic recycling.
              </p>
              <span className="text-green-600 text-sm font-medium">View guide →</span>
            </Link>

          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            <Link
              href="/wiki/products/stretch-bed"
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                🛏️ Stretch Bed Guide
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Assembly instructions, specifications, care & maintenance for the Stretch Bed.
              </p>
              <span className="text-green-600 text-sm font-medium">View guide →</span>
            </Link>

            <Link
              href="/wiki/products/washing-machine"
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                🧺 Washing Machine Guide
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Setup, operation, troubleshooting for Pakkimjalki Kari washing machines.
              </p>
              <span className="text-green-600 text-sm font-medium">View guide →</span>
            </Link>

            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                📐 Product Design Files
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Open-source CAD files, templates, and specifications for all products.
              </p>
              <span className="text-gray-400 text-sm font-medium">Coming soon</span>
            </div>

          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Support & Troubleshooting</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                ❓ FAQ
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Common questions about products, ordering, shipping, and community support.
              </p>
              <span className="text-gray-400 text-sm font-medium">Coming soon</span>
            </div>

            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                🔨 Repairs & Maintenance
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                How to repair and maintain beds, machines, and facility equipment.
              </p>
              <span className="text-gray-400 text-sm font-medium">Coming soon</span>
            </div>

            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                📞 Contact Support
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Get help from the Goods team via email, SMS, or community channels.
              </p>
              <span className="text-gray-400 text-sm font-medium">Coming soon</span>
            </div>

          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Community & Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">

            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                🌏 Community Partners
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Map and directory of communities using Goods products and facilities.
              </p>
              <span className="text-gray-400 text-sm font-medium">Coming soon</span>
            </div>

            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                📖 Impact Stories
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Real stories from communities using Goods products to grow food and build resilience.
              </p>
              <span className="text-gray-400 text-sm font-medium">Coming soon</span>
            </div>

          </div>
        </section>

        {/* How-To Guides Section */}
        <section id="guides" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How-To Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                🌱 Growing Guide
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                How to use Stretch Beds for organic growing, companion planting, and soil health.
              </p>
              <span className="text-gray-400 text-sm font-medium">Coming soon</span>
            </div>

            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                🎓 Training Materials
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Youth training programs, operator certifications, and workshop guides.
              </p>
              <span className="text-gray-400 text-sm font-medium">Coming soon</span>
            </div>

            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                📋 Checklists & Templates
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Downloadable safety checklists, inventory sheets, and maintenance logs.
              </p>
              <span className="text-gray-400 text-sm font-medium">Coming soon</span>
            </div>

          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Goods on Country</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600">
              Goods on Country is a social enterprise delivering quality furniture and
              infrastructure to remote Indigenous communities across Australia. We combine
              recycling, local manufacturing, and community ownership to create sustainable,
              repairable products that last.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">20kg</div>
                <div className="text-sm text-gray-600">HDPE plastic diverted per bed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">5 min</div>
                <div className="text-sm text-gray-600">Stretch Bed assembly time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">200kg</div>
                <div className="text-sm text-gray-600">Bed weight capacity</div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer CTA */}
      <div className="bg-green-50 border-t border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 mb-6">
            This knowledge base is growing. Contact us if you need specific information.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
