import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { WASHING_MACHINE } from '@/lib/data/products';

export const metadata = {
  title: 'Pakkimjalki Kari (Washing Machine) | Goods Wiki',
  description:
    'Complete guide to the Pakkimjalki Kari washing machine - the journey from problem to prototype, community co-design, and how to get involved.',
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
            &larr; Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            {WASHING_MACHINE.name}
          </h1>
          <p className="text-xl text-neutral-600">
            {WASHING_MACHINE.tagline}
          </p>
        </div>

        {/* Status Banner */}
        <Card className="mb-8 p-6 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <div className="text-2xl">&#9888;&#65039;</div>
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">
                Currently in Prototype &mdash; Not Yet for Sale
              </h3>
              <p className="text-sm text-amber-800">
                We&apos;re testing in several remote communities and collecting
                real-world feedback before scaling. This page documents where
                we are, how we got here, and how you can be part of it.
              </p>
            </div>
          </div>
        </Card>

        {/* The Problem */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">The Problem</h2>
          <div className="space-y-4 text-neutral-700 leading-relaxed">
            <p>
              One Alice Springs provider sells <strong>$3 million per year</strong> of
              washing machines into remote communities. Most end up in dumps
              within months.
            </p>
            <p>
              Consumer-grade machines aren&apos;t built for remote conditions &mdash;
              extreme heat, dust, hard water with high mineral content, and
              limited access to repairs or spare parts. Communities end up in a
              cycle of buying cheap machines that fail quickly.
            </p>
            <p>
              We asked: what if we started with commercial-grade equipment
              proven to survive thousands of cycles in laundromats, and adapted
              it for remote community use?
            </p>
          </div>
        </Card>

        {/* The Journey So Far */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">The Journey So Far</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                <div className="w-0.5 flex-1 bg-green-200 mt-1" />
              </div>
              <div className="pb-6">
                <h3 className="font-semibold text-neutral-900">Research &amp; Community Conversations</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  We spent time in communities understanding the problem firsthand.
                  Washing machines were consistently raised as a top priority &mdash;
                  families were spending hundreds on machines that lasted weeks.
                  We mapped the failure modes: dust ingress, mineral buildup,
                  power fluctuations, and lack of service infrastructure.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                <div className="w-0.5 flex-1 bg-green-200 mt-1" />
              </div>
              <div className="pb-6">
                <h3 className="font-semibold text-neutral-900">Choosing the Base Unit</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  After researching commercial options, we selected the Speed
                  Queen commercial washer &mdash; machines built for laundromats
                  that run multiple cycles daily for years. The commercial-grade
                  components handle exactly the kind of heavy use and harsh
                  conditions found in remote communities.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                <div className="w-0.5 flex-1 bg-green-200 mt-1" />
              </div>
              <div className="pb-6">
                <h3 className="font-semibold text-neutral-900">Naming &amp; Community Co-Design</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  Elder Dianne Stokes named the machine <strong>Pakkimjalki
                  Kari</strong> in Warumungu language. This isn&apos;t just branding &mdash;
                  it reflects community ownership of the design process. We work
                  with communities to test, refine, and validate every decision.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">4</div>
                <div className="w-0.5 flex-1 bg-amber-200 mt-1" />
              </div>
              <div className="pb-6">
                <h3 className="font-semibold text-neutral-900">Prototype Deployment (Current Stage)</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  Several units are now operating in remote communities. We&apos;re
                  collecting data on reliability, maintenance needs, water and
                  power usage, and community satisfaction. This real-world
                  testing is essential &mdash; lab conditions can&apos;t replicate
                  40&deg;C heat, red dust, and bore water.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-300 text-neutral-600 flex items-center justify-center text-sm font-bold">5</div>
                <div className="w-0.5 flex-1 bg-neutral-200 mt-1" />
              </div>
              <div className="pb-6">
                <h3 className="font-semibold text-neutral-500">Price Optimisation (Next)</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Working with suppliers and logistics partners to reduce the
                  total delivered cost while maintaining quality. We&apos;re also
                  exploring whether our on-country plastic recycling facility
                  could produce protective housing components.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-300 text-neutral-600 flex items-center justify-center text-sm font-bold">6</div>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-500">Community Availability (Future)</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Once we&apos;ve validated reliability and achieved the right price
                  point, we&apos;ll make Pakkimjalki Kari available to communities and
                  organisations. Same model as the Stretch Bed &mdash; with the
                  long-term goal of community-owned manufacturing.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Specs */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">What We Know So Far</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-neutral-600">Base Unit</div>
              <div className="font-semibold">{WASHING_MACHINE.specs.baseUnit}</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Capacity</div>
              <div className="font-semibold">Commercial-grade</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Design Focus</div>
              <div className="font-semibold">Remote reliability</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Current Stage</div>
              <div className="font-semibold text-amber-600">Prototype Testing</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Community Testing</div>
              <div className="font-semibold">Active deployments</div>
            </div>
            <div>
              <div className="text-sm text-neutral-600">Price</div>
              <div className="font-semibold">TBD (optimising)</div>
            </div>
          </div>
        </Card>

        {/* How to Get Involved */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Get Involved</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Community or Organisation</h3>
              <p className="text-sm text-neutral-600 mb-3">
                If your community needs reliable washing machines, we want to
                hear from you. We&apos;re looking for communities willing to
                participate in prototype testing and provide feedback.
              </p>
              <Link
                href="/contact"
                className="text-sm font-medium text-neutral-900 underline"
              >
                Get in touch &rarr;
              </Link>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Funding Partner or Sponsor</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Help us get more prototypes into communities, fund R&amp;D on
                price reduction, or support the path to community-owned
                manufacturing.
              </p>
              <Link
                href="/partner"
                className="text-sm font-medium text-neutral-900 underline"
              >
                Partner with us &rarr;
              </Link>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Technical Expertise</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Know about commercial appliances, remote power systems, water
                treatment, or logistics? We&apos;re always looking for people who
                can help us solve specific challenges.
              </p>
              <Link
                href="/contact"
                className="text-sm font-medium text-neutral-900 underline"
              >
                Share your expertise &rarr;
              </Link>
            </div>

            <div className="border border-neutral-200 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-neutral-600 mb-3">
                Register your interest and we&apos;ll let you know when
                Pakkimjalki Kari is available, or when we have testing results
                to share.
              </p>
              <Link
                href="/partner"
                className="text-sm font-medium text-neutral-900 underline"
              >
                Register interest &rarr;
              </Link>
            </div>
          </div>
        </Card>

        {/* Operation Guide (Preliminary) */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Operation Guide (Preliminary)
          </h2>
          <p className="text-sm text-neutral-600 mb-4">
            Based on Speed Queen commercial washer operation. Will be updated
            as we refine the design for remote conditions.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Basic Operation</h3>
              <ol className="space-y-2 list-decimal list-inside text-neutral-700">
                <li>Load clothes (do not overload &mdash; leave space for agitation)</li>
                <li>Add detergent to dispenser (appropriate amount for load size)</li>
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
                  <span className="text-neutral-700">Work clothes, heavily soiled items</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium min-w-[120px]">Normal:</span>
                  <span className="text-neutral-700">Everyday clothes, regular load</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-medium min-w-[120px]">Delicate:</span>
                  <span className="text-neutral-700">Lighter fabrics, gentle wash</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Maintenance */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-semibold mb-4">Maintenance (Preliminary)</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Daily</h3>
              <ul className="space-y-2 text-neutral-700">
                <li>&bull; Wipe down exterior and control panel</li>
                <li>&bull; Leave lid open between loads for air circulation</li>
                <li>&bull; Check for unusual sounds or vibrations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Weekly</h3>
              <ul className="space-y-2 text-neutral-700">
                <li>&bull; Clean lint filter (if applicable)</li>
                <li>&bull; Inspect hoses for leaks or wear</li>
                <li>&bull; Wipe door seal and check for debris</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Monthly</h3>
              <ul className="space-y-2 text-neutral-700">
                <li>&bull; Run cleaning cycle with washer cleaner or vinegar</li>
                <li>&bull; Check water inlet filters for mineral buildup</li>
                <li>&bull; Inspect drain hose for clogs</li>
                <li>&bull; Verify machine is level (adjust feet if needed)</li>
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
                  <th className="pb-3 pr-4 font-semibold text-neutral-900">Issue</th>
                  <th className="pb-3 pr-4 font-semibold text-neutral-900">Possible Cause</th>
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
                  <td className="py-3">Check taps are on, clean inlet filters</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 pr-4">Won&apos;t drain</td>
                  <td className="py-3 pr-4">Drain hose kinked or clogged</td>
                  <td className="py-3">Check drain hose, remove blockages</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 pr-4">Excessive vibration</td>
                  <td className="py-3 pr-4">Unbalanced load or machine not level</td>
                  <td className="py-3">Redistribute clothes, adjust leveling feet</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 pr-4">Mineral buildup</td>
                  <td className="py-3 pr-4">Hard water in remote areas</td>
                  <td className="py-3">Run vinegar cleaning cycle monthly, consider water softener</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-neutral-600 mt-4">
            For issues not listed here,{' '}
            <Link href="/contact" className="text-neutral-900 underline font-medium">
              contact us
            </Link>.
          </p>
        </Card>

        {/* CTA */}
        <Card className="p-8 bg-neutral-900 text-white">
          <h2 className="text-2xl font-semibold mb-4">
            Want to Be Part of This?
          </h2>
          <p className="text-neutral-300 mb-6">
            Whether you&apos;re a community that needs reliable washing machines,
            a funder who wants to support the prototype stage, or someone with
            technical expertise to share &mdash; we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/partner"
              className="inline-block bg-white text-neutral-900 px-6 py-3 rounded font-semibold hover:bg-neutral-100 transition-colors text-center"
            >
              Partner With Us
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-neutral-900 transition-colors text-center"
            >
              Get in Touch
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
