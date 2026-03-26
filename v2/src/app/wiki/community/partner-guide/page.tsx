import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Partner Guide | Goods Wiki',
  description: 'How to partner with Goods on Country — sponsorship tiers, community partnerships, and procurement.',
};

export default function PartnerGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-br from-green-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/wiki" className="text-green-600 hover:text-green-700 text-sm font-medium mb-4 inline-block">
            &larr; Back to Wiki
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner Guide</h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about partnering with Goods on Country to deliver quality goods to remote communities.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg max-w-none">
        <h2>About Goods on Country</h2>
        <p>
          Goods on Country is a social enterprise delivering quality furniture to remote Indigenous communities
          across Australia. Our flagship product — the <strong>Stretch Bed</strong> — is a flat-packable,
          washable bed made from recycled HDPE plastic, galvanised steel, and heavy-duty canvas.
          Each bed diverts 20kg of plastic from landfill.
        </p>

        <div className="grid md:grid-cols-3 gap-6 not-prose my-8">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">400+</div>
            <div className="text-sm text-gray-600 mt-1">Beds deployed</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">15+</div>
            <div className="text-sm text-gray-600 mt-1">Communities served</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">10+ yr</div>
            <div className="text-sm text-gray-600 mt-1">Design lifespan</div>
          </div>
        </div>

        <h2>Partnership Opportunities</h2>

        <h3>Corporate Sponsorship</h3>
        <p>Sponsor bed deliveries for communities in need.</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tier</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Contribution</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Impact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Recognition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Founding Partner</td>
                <td className="px-4 py-3 text-sm text-gray-600">$50,000+</td>
                <td className="px-4 py-3 text-sm text-gray-600">100+ beds</td>
                <td className="px-4 py-3 text-sm text-gray-600">Homepage logo, annual report, dedicated impact story</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Major Partner</td>
                <td className="px-4 py-3 text-sm text-gray-600">$20,000+</td>
                <td className="px-4 py-3 text-sm text-gray-600">40+ beds</td>
                <td className="px-4 py-3 text-sm text-gray-600">Partners page, quarterly updates</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Supporting Partner</td>
                <td className="px-4 py-3 text-sm text-gray-600">$5,000+</td>
                <td className="px-4 py-3 text-sm text-gray-600">10+ beds</td>
                <td className="px-4 py-3 text-sm text-gray-600">Partners page, impact certificate</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Community Partner</td>
                <td className="px-4 py-3 text-sm text-gray-600">$1,000+</td>
                <td className="px-4 py-3 text-sm text-gray-600">2+ beds</td>
                <td className="px-4 py-3 text-sm text-gray-600">Community updates acknowledgment</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>All sponsors receive tax-deductible donation receipts (where applicable), delivery photos, impact stories, and invitations to community events.</p>

        <h3>Procurement Partnership</h3>
        <p>
          For housing bodies, health services, and government agencies looking to procure beds at scale.
          We work with organisations including PICC (Palm Island), NPY Women&apos;s Council,
          Homeland Schools Company, and Aboriginal health services across the NT and QLD.
        </p>
        <ul>
          <li>Bulk pricing for 10+ bed orders</li>
          <li>Customised delivery scheduling for remote locations</li>
          <li>QR-based asset tracking for every unit deployed</li>
          <li>Ongoing maintenance and support</li>
          <li>Impact reporting for grant acquittals</li>
        </ul>

        <h3>Community Partnership</h3>
        <p>If you represent a community that could benefit from Goods products:</p>
        <ul>
          <li>Needs assessment tailored to your community</li>
          <li>Culturally appropriate delivery and setup</li>
          <li>On-country manufacturing training opportunities</li>
          <li>Ongoing support via QR code system and SMS</li>
          <li>Storytelling through Empathy Ledger (with full consent)</li>
        </ul>

        <h3>Manufacturing Partnership</h3>
        <p>
          We&apos;re building on-country manufacturing capability. Our travelling production facility
          can process recycled HDPE plastic into bed components right in community. Partners include
          Defy Design (recycling training), Envirobank (plastic supply), and Oonchiumpa Consultancy
          (cultural leadership).
        </p>

        <h2>How to Get Started</h2>
        <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
          <Link href="/partner" className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <div className="font-semibold text-green-800 mb-1">Partnership Inquiry</div>
            <div className="text-sm text-green-700">Fill out our partnership form</div>
          </Link>
          <Link href="/contact" className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="font-semibold text-blue-800 mb-1">Contact Us</div>
            <div className="text-sm text-blue-700">hello@goodsoncountry.com</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
