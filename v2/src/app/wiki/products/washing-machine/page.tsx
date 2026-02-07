import Link from 'next/link';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Pakkimjalki Kari (Washing Machine) | Goods Wiki',
  description:
    'Complete guide to the Pakkimjalki Kari washing machine - specifications, operation, maintenance, and community deployment.',
};

export default function WashingMachinePage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/wiki/products"
            className="text-sm text-neutral-600 hover:text-neutral-900 mb-4 inline-block"
          >
            ← Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Pakkimjalki Kari
          </h1>
          <p className="text-xl text-neutral-600">
            Commercial-grade washing machine named in Warumungu language by
            Elder Dianne Stokes. Currently in prototype stage with community
            deployments.
          </p>
        </div>

        {/* Status Banner */}
        <Card className="mb-8 p-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">
                Prototype Stage
              </h3>
              <p className="text-sm text-amber-800">
                This washing machine is currently being tested in several
                communities. We&apos;re collecting feedback to refine the
                design and reduce the price point while maintaining reliability
                for remote conditions.{' '}
                <Link
                  href="/support/contact"
                  className="underline font-medium"
                >
                  Register your interest
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Specs */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-neutral-600">Base Unit</div>
              <div className="font-semibold">Speed Queen Commercial</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Load Capacity</div>
              <div className="font-semibold">Commercial-grade</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Design Focus</div>
              <div className="font-semibold">Remote reliability</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Status</div>
              <div className="font-semibold text-amber-600">Prototype</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Community Testing</div>
              <div className="font-semibold">Active deployments</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Price Target</div>
              <div className="font-semibold">TBD (reducing)</div>
            </div>
          </div>
        </Card>

        {/* The Problem */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">The Problem We&apos;re Solving</h2>
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-700 leading-relaxed mb-4">
              One Alice Springs provider sells <strong>$3 million per year</strong> of
              washing machines into remote communities. Most of these machines end
              up in dumps within months of delivery.
            </p>
            <p className="text-neutral-700 leading-relaxed mb-4">
              Remote communities face unique challenges:
            </p>
            <ul className="space-y-2 text-neutral-700">
              <li>Extreme temperatures and dust conditions</li>
              <li>Hard water and high mineral content</li>
              <li>Limited access to spare parts and repairs</li>
              <li>High costs for replacement units</li>
              <li>Consumer-grade machines aren&apos;t built for these conditions</li>
            </ul>
            <p className="text-neutral-700 leading-relaxed mt-4">
              <strong>Our approach:</strong> Start with commercial-grade equipment
              proven to last, then work with communities to optimize for remote
              conditions and reduce the price point without compromising reliability.
            </p>
          </div>
        </Card>

        {/* Design Philosophy */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">Design Philosophy</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                1. Commercial-Grade Foundation
              </h3>
              <p className="text-neutral-700">
                We start with Speed Queen commercial washers - machines designed
                for laundromats and hotels that run multiple cycles daily for
                years. This gives us a proven, durable platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                2. Community Co-Design
              </h3>
              <p className="text-neutral-700">
                The name &quot;Pakkimjalki Kari&quot; was chosen by Elder Dianne Stokes
                in Warumungu language. We&apos;re deploying prototypes and gathering
                feedback to understand real-world performance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                3. Price Optimization
              </h3>
              <p className="text-neutral-700">
                Our goal is to reduce the price point while maintaining the
                reliability needed for remote conditions. This means working with
                suppliers, optimizing logistics, and potentially exploring local
                assembly options.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                4. Long-Term Thinking
              </h3>
              <p className="text-neutral-700">
                We&apos;re not rushing to market. We&apos;re taking the time to get this
                right - test in real conditions, gather feedback, iterate on the
                design, and only scale when we&apos;re confident we have a solution
                that will last.
              </p>
            </div>
          </div>
        </Card>

        {/* Current Status */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">✓ Prototype Deployed</h3>
              <p className="text-neutral-700">
                Several units are currently operating in remote communities,
                allowing us to test performance in real conditions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">→ Gathering Feedback</h3>
              <p className="text-neutral-700">
                We&apos;re collecting data on reliability, common issues, maintenance
                needs, and community satisfaction to inform the next design
                iteration.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">○ Price Optimization</h3>
              <p className="text-neutral-700">
                Working with suppliers and logistics partners to reduce the total
                cost while maintaining quality and reliability.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">○ Not Yet for Sale</h3>
              <p className="text-neutral-700">
                We&apos;re not currently selling washing machines. If you&apos;re interested
                in being notified when they&apos;re available, please{' '}
                <Link href="/support/contact" className="text-neutral-900 underline font-medium">
                  register your interest
                </Link>
                .
              </p>
            </div>
          </div>
        </Card>

        {/* Operation Guide (Preliminary) */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Operation Guide (Preliminary)
          </h2>
          <p className="text-sm text-neutral-600 mb-4">
            This guide is based on Speed Queen commercial washer operation and
            will be updated as we refine the design for remote conditions.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Basic Operation</h3>
              <ol className="space-y-2 list-decimal list-inside text-neutral-700">
                <li>Load clothes (do not overload - leave space for agitation)</li>
                <li>Add detergent to dispenser (use appropriate amount for load size)</li>
                <li>Select cycle and temperature</li>
                <li>Close lid and press start</li>
                <li>Machine will automatically fill, wash, rinse, and spin</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Cycle Selection</h3>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <span className="font-medium min-w-[120px]">Heavy Duty:</span>
                  <span className="text-neutral-700">
                    Work clothes, heavily soiled items
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium min-w-[120px]">Normal:</span>
                  <span className="text-neutral-700">
                    Everyday clothes, regular load
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium min-w-[120px]">Delicate:</span>
                  <span className="text-neutral-700">
                    Lighter fabrics, gentle wash
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Water Temperature</h3>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <span className="font-medium min-w-[120px]">Hot:</span>
                  <span className="text-neutral-700">
                    Whites, heavily soiled items
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium min-w-[120px]">Warm:</span>
                  <span className="text-neutral-700">Most loads, good balance</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium min-w-[120px]">Cold:</span>
                  <span className="text-neutral-700">
                    Delicates, colors (saves energy)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Maintenance */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">Maintenance</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Daily</h3>
              <ul className="space-y-2 text-neutral-700">
                <li>• Wipe down exterior and control panel</li>
                <li>• Leave lid open between loads for air circulation</li>
                <li>• Check for any unusual sounds or vibrations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Weekly</h3>
              <ul className="space-y-2 text-neutral-700">
                <li>• Clean lint filter (if applicable)</li>
                <li>• Inspect hoses for leaks or wear</li>
                <li>• Wipe door seal and check for debris</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Monthly</h3>
              <ul className="space-y-2 text-neutral-700">
                <li>• Run cleaning cycle with washer cleaner or vinegar</li>
                <li>• Check water inlet filters for mineral buildup</li>
                <li>• Inspect drain hose for clogs</li>
                <li>• Verify machine is level (adjust feet if needed)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Annually</h3>
              <ul className="space-y-2 text-neutral-700">
                <li>• Professional inspection recommended</li>
                <li>• Check all hose connections for tightness</li>
                <li>• Inspect electrical connections</li>
                <li>• Test safety features (lid lock, auto-stop)</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Troubleshooting */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-neutral-200">
                <tr>
                  <th className="pb-3 pr-4 font-semibold text-neutral-900">
                    Issue
                  </th>
                  <th className="pb-3 pr-4 font-semibold text-neutral-900">
                    Possible Cause
                  </th>
                  <th className="pb-3 font-semibold text-neutral-900">Solution</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3 pr-4">Won&apos;t start</td>
                  <td className="py-3 pr-4">Lid not fully closed</td>
                  <td className="py-3">Ensure lid is properly latched</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 pr-4">Won&apos;t fill</td>
                  <td className="py-3 pr-4">Water supply off or inlet clogged</td>
                  <td className="py-3">
                    Check taps are on, clean inlet filters
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 pr-4">Won&apos;t drain</td>
                  <td className="py-3 pr-4">Drain hose kinked or clogged</td>
                  <td className="py-3">
                    Check drain hose, remove any blockages
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 pr-4">Excessive vibration</td>
                  <td className="py-3 pr-4">Unbalanced load or machine not level</td>
                  <td className="py-3">
                    Redistribute clothes, adjust leveling feet
                  </td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 pr-4">Clothes still wet</td>
                  <td className="py-3 pr-4">Overloaded or unbalanced spin</td>
                  <td className="py-3">Reduce load size, redistribute items</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 pr-4">Unusual noise</td>
                  <td className="py-3 pr-4">Foreign object or mechanical issue</td>
                  <td className="py-3">
                    Check for coins/debris, contact support if persists
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Mineral buildup</td>
                  <td className="py-3 pr-4">Hard water in remote areas</td>
                  <td className="py-3">
                    Run vinegar cleaning cycle monthly, consider water softener
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-neutral-600 mt-4">
            For issues not listed here or if problems persist,{' '}
            <Link
              href="/support/contact"
              className="text-neutral-900 underline font-medium"
            >
              contact support
            </Link>
            .
          </p>
        </Card>

        {/* Register Interest */}
        <Card className="p-8 bg-neutral-900 text-white">
          <h2 className="text-2xl font-semibold mb-4">
            Register Your Interest
          </h2>
          <p className="text-neutral-300 mb-6">
            Want to be notified when Pakkimjalki Kari is available for
            purchase? We&apos;ll keep you updated on testing progress, pricing, and
            availability.
          </p>
          <Link
            href="/support/contact"
            className="inline-block bg-white text-neutral-900 px-6 py-3 rounded font-semibold hover:bg-neutral-100 transition-colors"
          >
            Register Interest
          </Link>
        </Card>
      </div>
    </div>
  );
}
