import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { WASHING_MACHINE } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Pakkimjalki Kari (Washing Machine) | Goods Wiki',
  description:
    'Complete guide to the Pakkimjalki Kari washing machine — the journey from problem to prototype, community co-design, health impact, and how to get involved.',
};

export default function WashingMachinePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/wiki" className="hover:text-green-600">Wiki</Link>
          {' '}/{' '}
          <Link href="/wiki#products" className="hover:text-green-600">Products</Link>
          {' '}/{' '}
          <span className="text-gray-900">Pakkimjalki Kari</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{WASHING_MACHINE.name}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
              Prototype
            </span>
          </div>
          <p className="text-xl text-gray-600">
            {WASHING_MACHINE.tagline}
          </p>
        </header>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-8">
          <Image
            src="/images/product/washing-machine-hero.jpg"
            alt="Pakkimjalki Kari washing machine — recycled plastic enclosure with Speed Queen commercial base"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Status Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-2xl shrink-0">&#9888;&#65039;</div>
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
        </div>

        {/* Table of Contents */}
        <nav className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Contents</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#problem" className="text-green-600 hover:text-green-700">The Problem</a></li>
            <li><a href="#journey" className="text-green-600 hover:text-green-700">The Journey So Far</a></li>
            <li><a href="#community-voices" className="text-green-600 hover:text-green-700">Community Voices</a></li>
            <li><a href="#how-it-works" className="text-green-600 hover:text-green-700">How It Works</a></li>
            <li><a href="#future" className="text-green-600 hover:text-green-700">Future Vision</a></li>
            <li><a href="#specs" className="text-green-600 hover:text-green-700">Quick Specs</a></li>
            <li><a href="#operation" className="text-green-600 hover:text-green-700">Operation Guide</a></li>
            <li><a href="#maintenance" className="text-green-600 hover:text-green-700">Maintenance</a></li>
            <li><a href="#troubleshooting" className="text-green-600 hover:text-green-700">Troubleshooting</a></li>
            <li><a href="#involved" className="text-green-600 hover:text-green-700">How to Get Involved</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <article className="prose prose-lg max-w-none">

          {/* The Problem */}
          <section id="problem" className="mb-12">
            <h2>The Problem</h2>

            <div className="not-prose">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-3xl font-bold text-red-900 mb-2">$3 million per year</p>
                <p className="text-red-800">
                  One Alice Springs provider sells $3M/yr of washing machines into remote communities.
                  Most end up in dumps within months.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">59%</div>
                  <div className="text-xs text-gray-600 mt-1">of remote homes lack washing machines</div>
                  <div className="text-xs text-gray-400 mt-1">FRRR, 2022</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">1-2 yrs</div>
                  <div className="text-xs text-gray-600 mt-1">lifespan of standard machines (vs 10-15)</div>
                  <div className="text-xs text-gray-400 mt-1">East Arnhem Spin Project</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">1 in 3</div>
                  <div className="text-xs text-gray-600 mt-1">children have scabies at any time</div>
                  <div className="text-xs text-gray-400 mt-1">PLOS NTD</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">55%</div>
                  <div className="text-xs text-gray-600 mt-1">of very remote First Nations homes are overcrowded</div>
                  <div className="text-xs text-gray-400 mt-1">AIHW, 2021</div>
                </div>
              </div>
            </div>

            <p>
              Consumer-grade machines aren&apos;t built for remote conditions &mdash;
              extreme heat, dust, hard water with high mineral content, and
              limited access to repairs or spare parts. Communities end up in a
              cycle of buying cheap machines that fail quickly.
            </p>

            <div className="not-prose">
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6">
                <h3 className="font-semibold text-red-900 mb-2">The Health Connection: Scabies &rarr; Rheumatic Heart Disease</h3>
                <p className="text-sm text-red-800 mb-3">
                  Without working washing machines, bedding and clothes can&apos;t be kept clean.
                  Scabies spreads through contaminated fabric, leading to skin infections that
                  can trigger Rheumatic Heart Disease &mdash; a condition that is entirely preventable
                  with good environmental health, but kills children in remote communities.
                </p>
                <blockquote className="border-l-4 border-red-300 pl-4 italic text-red-900">
                  &ldquo;Scabies often leads to Rheumatic Heart Disease, so washing machines are essential
                  to be able to clean infected clothing, bedding and towels.&rdquo;
                  <footer className="text-sm font-medium mt-1 not-italic">
                    &mdash; Jessica Allardyce, Miwatj Health
                  </footer>
                </blockquote>
              </div>
            </div>

            <p>
              We asked: what if we started with commercial-grade equipment
              proven to survive thousands of cycles in laundromats, and adapted
              it for remote community use?
            </p>
          </section>

          {/* The Journey So Far */}
          <section id="journey" className="mb-12">
            <h2>The Journey So Far</h2>

            <div className="not-prose space-y-6 mt-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                  <div className="w-0.5 flex-1 bg-green-200 mt-1" />
                </div>
                <div className="pb-6">
                  <h3 className="font-semibold text-gray-900">Research &amp; Community Conversations</h3>
                  <p className="text-sm text-gray-600 mt-1">
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
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                  <div className="w-0.5 flex-1 bg-green-200 mt-1" />
                </div>
                <div className="pb-6">
                  <h3 className="font-semibold text-gray-900">Choosing the Base Unit</h3>
                  <p className="text-sm text-gray-600 mt-1">
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
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                  <div className="w-0.5 flex-1 bg-green-200 mt-1" />
                </div>
                <div className="pb-6">
                  <h3 className="font-semibold text-gray-900">Naming &amp; Community Co-Design</h3>
                  <p className="text-sm text-gray-600 mt-1 mb-4">
                    Elder Dianne Stokes named the machine <strong>Pakkimjalki
                    Kari</strong> in Warumungu language. This isn&apos;t just branding &mdash;
                    it reflects community ownership of the design process. We work
                    with communities to test, refine, and validate every decision.
                  </p>
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                    <Image
                      src="/images/product/washing-machine-name.jpg"
                      alt="Pakkimjalki Kari — named in Warumungu language by Elder Dianne Stokes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Pakkimjalki Kari &mdash; named in Warumungu language by Elder Dianne Stokes
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0">4</div>
                  <div className="w-0.5 flex-1 bg-amber-200 mt-1" />
                </div>
                <div className="pb-6">
                  <h3 className="font-semibold text-gray-900">Prototype Deployment (Current Stage)</h3>
                  <p className="text-sm text-gray-600 mt-1 mb-4">
                    Several units are now operating in remote communities. We&apos;re
                    collecting data on reliability, maintenance needs, water and
                    power usage, and community satisfaction. This real-world
                    testing is essential &mdash; lab conditions can&apos;t replicate
                    40&deg;C heat, red dust, and bore water.
                  </p>
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                    <Image
                      src="/images/product/washing-machine-installed.jpg"
                      alt="Pakkimjalki Kari washing machine installed in a remote community"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    A Pakkimjalki Kari unit installed and operating in community
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold shrink-0">5</div>
                  <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                </div>
                <div className="pb-6">
                  <h3 className="font-semibold text-gray-500">Price Optimisation (Next)</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Working with suppliers and logistics partners to reduce the
                    total delivered cost while maintaining quality. We&apos;re also
                    exploring whether our on-country plastic recycling facility
                    could produce protective housing components.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold shrink-0">6</div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">Community Availability (Future)</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Once we&apos;ve validated reliability and achieved the right price
                    point, we&apos;ll make Pakkimjalki Kari available to communities and
                    organisations. Same model as the Stretch Bed &mdash; with the
                    long-term goal of community-owned manufacturing.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Community Voices */}
          <section id="community-voices" className="mb-12">
            <h2>Community Voices</h2>

            <div className="not-prose space-y-6 mt-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <blockquote className="text-lg italic text-gray-800 mb-3">
                  &ldquo;They truly wanna a washing machine to wash their blanket, to wash their clothes,
                  and it&apos;s right there at home.&rdquo;
                </blockquote>
                <footer className="font-medium text-gray-900">
                  &mdash; Patricia Frank, Tennant Creek
                </footer>
                <p className="text-sm text-gray-600 mt-3">
                  Patricia works at an Aboriginal corporation in Tennant Creek. She&apos;s from the Oo Tribe,
                  White Cockatoo clan group. She sees the need every day &mdash; families without working
                  washing machines, dirty blankets contributing to skin infections, children missing school.
                  Patricia helped connect Goods with language groups across the NT, building the relationships
                  that made Pakkimjalki Kari possible.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <blockquote className="text-lg italic text-gray-800 mb-3">
                  &ldquo;Working both ways &mdash; cultural side in white society and Indigenous society.&rdquo;
                </blockquote>
                <footer className="font-medium text-gray-900">
                  &mdash; Dianne Stokes, Elder, Tennant Creek
                </footer>
                <p className="text-sm text-gray-600 mt-3">
                  Elder Dianne Stokes didn&apos;t just name the machine &mdash; she helped design it.
                  She sat around the fire with her family refining the construction. When she received the first
                  Stretch Bed, she came back within two weeks requesting twenty more for her community.
                  Dianne embodies the Goods philosophy: community members aren&apos;t recipients, they&apos;re co-designers.
                </p>
              </div>

              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                <Image
                  src="/images/product/washing-machine-community.jpg"
                  alt="Community members with the Pakkimjalki Kari washing machine"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 italic">
                Community members engaging with the Pakkimjalki Kari washing machine
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="mb-12">
            <h2>How It Works</h2>

            <p>
              Pakkimjalki Kari starts with a <strong>Speed Queen commercial washer</strong> &mdash;
              the same machines used in laundromats that run hundreds of cycles per week for years.
              This isn&apos;t a consumer appliance rebadged for remote use. It&apos;s industrial equipment
              adapted for household conditions.
            </p>

            <h3>What Makes It Different from Consumer Machines</h3>
            <div className="not-prose grid md:grid-cols-2 gap-4 mt-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Commercial-Grade Motor</h4>
                <p className="text-sm text-gray-600">Built for thousands of cycles in laundromat environments. Consumer machines are designed for 2-3 loads per week &mdash; remote households often do 2-3 loads per day.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Metal Components (Not Plastic)</h4>
                <p className="text-sm text-gray-600">Internal components are metal where consumer machines use plastic. This is why laundromat machines last 10-15 years while consumer machines fail in 1-2 years in remote conditions.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Simple Controls</h4>
                <p className="text-sm text-gray-600">Minimal buttons, intuitive operation. No digital displays to fail. Designed so anyone can operate it without instruction manuals.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Serviceability</h4>
                <p className="text-sm text-gray-600">Parts are standard commercial components &mdash; available and replaceable. Unlike consumer machines designed to be disposed of when something breaks.</p>
              </div>
            </div>

            <h3>Adaptations for Remote Use</h3>
            <div className="not-prose space-y-3 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm shrink-0">&#9728;</div>
                <div>
                  <span className="font-medium text-gray-900">Heat:</span>
                  <span className="text-sm text-gray-600 ml-1">Operating temperatures regularly exceed 40&deg;C. Commercial components handle thermal stress that melts consumer-grade plastic internals.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm shrink-0">&#9729;</div>
                <div>
                  <span className="font-medium text-gray-900">Dust:</span>
                  <span className="text-sm text-gray-600 ml-1">Red dust infiltrates everything. Recycled plastic housing panels protect the machine from the environment.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm shrink-0">&#128167;</div>
                <div>
                  <span className="font-medium text-gray-900">Water:</span>
                  <span className="text-sm text-gray-600 ml-1">Bore water with high mineral content causes rapid calcium and iron buildup. Commercial units tolerate hard water far better than consumer machines.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm shrink-0">&#9889;</div>
                <div>
                  <span className="font-medium text-gray-900">Power:</span>
                  <span className="text-sm text-gray-600 ml-1">Remote power grids fluctuate. Industrial motors handle voltage variation that burns out consumer electronics.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Future Vision */}
          <section id="future" className="mb-12">
            <h2>Future Vision</h2>

            <div className="not-prose space-y-4 mt-6">
              <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r">
                <h3 className="font-semibold mb-2">Recycled Plastic Housing</h3>
                <p className="text-gray-700">The same on-country facility that presses recycled HDPE into Stretch Bed legs can produce protective housing panels for the washing machine. Community plastic waste becomes machine protection &mdash; the same circular economy model.</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r">
                <h3 className="font-semibold mb-2">Community-Owned Manufacturing</h3>
                <p className="text-gray-700">The long-term goal is the same as the Stretch Bed: transfer manufacturing capability to community-owned enterprises. Local people collecting waste, building housing components, assembling and maintaining machines. Our job is to become unnecessary.</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r">
                <h3 className="font-semibold mb-2">Price Optimisation</h3>
                <p className="text-gray-700">Commercial-grade machines cost more upfront but last 5-10x longer. We&apos;re working with suppliers and logistics partners to bring the delivered cost down while maintaining the quality that makes them last. The goal: a machine that costs more than a cheap one but saves communities thousands over its lifetime.</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r">
                <h3 className="font-semibold mb-2">Beyond Washing Machines</h3>
                <p className="text-gray-700">The containerised production facility can produce components for fridges and other appliances using different moulds and cut files. The same approach &mdash; commercial-grade base, recycled plastic housing, community co-design &mdash; can apply to any essential appliance that fails prematurely in remote conditions.</p>
              </div>
            </div>
          </section>

          {/* Quick Specs */}
          <section id="specs" className="mb-12">
            <h2>Quick Specs</h2>
            <div className="not-prose">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Base Unit</td>
                    <td className="px-4 py-3">{WASHING_MACHINE.specs.baseUnit}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Capacity</td>
                    <td className="px-4 py-3">Commercial-grade</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Housing</td>
                    <td className="px-4 py-3">Recycled HDPE plastic panels (same material as Stretch Bed legs)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Design Focus</td>
                    <td className="px-4 py-3">Remote reliability &mdash; dust, heat, hard water, power fluctuations</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Target Lifespan</td>
                    <td className="px-4 py-3">10-15 years (vs 1-2 for consumer machines)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Current Stage</td>
                    <td className="px-4 py-3"><span className="text-amber-600 font-medium">Prototype Testing</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Community Testing</td>
                    <td className="px-4 py-3">Active deployments in several remote communities</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Price</td>
                    <td className="px-4 py-3">TBD (optimising for remote delivery)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Named By</td>
                    <td className="px-4 py-3">Elder Dianne Stokes, in Warumungu language</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Operation Guide */}
          <section id="operation" className="mb-12">
            <h2>Operation Guide (Preliminary)</h2>
            <p className="text-sm text-gray-500">
              Based on Speed Queen commercial washer operation. Will be updated
              as we refine the design for remote conditions.
            </p>

            <h3>Basic Operation</h3>
            <ol>
              <li>Load clothes (do not overload &mdash; leave space for agitation)</li>
              <li>Add detergent to dispenser (appropriate amount for load size)</li>
              <li>Select cycle and temperature</li>
              <li>Close lid and press start</li>
              <li>Machine will automatically fill, wash, rinse, and spin</li>
            </ol>

            <h3>Cycle Selection</h3>
            <div className="not-prose space-y-2">
              <div className="flex gap-3">
                <span className="font-medium min-w-[120px]">Heavy Duty:</span>
                <span className="text-gray-700">Work clothes, heavily soiled items</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium min-w-[120px]">Normal:</span>
                <span className="text-gray-700">Everyday clothes, regular load</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium min-w-[120px]">Delicate:</span>
                <span className="text-gray-700">Lighter fabrics, gentle wash</span>
              </div>
            </div>
          </section>

          {/* Maintenance */}
          <section id="maintenance" className="mb-12">
            <h2>Maintenance (Preliminary)</h2>

            <h3>Daily</h3>
            <ul>
              <li>Wipe down exterior and control panel</li>
              <li>Leave lid open between loads for air circulation</li>
              <li>Check for unusual sounds or vibrations</li>
            </ul>

            <h3>Weekly</h3>
            <ul>
              <li>Clean lint filter (if applicable)</li>
              <li>Inspect hoses for leaks or wear</li>
              <li>Wipe door seal and check for debris</li>
            </ul>

            <h3>Monthly</h3>
            <ul>
              <li>Run cleaning cycle with washer cleaner or vinegar</li>
              <li>Check water inlet filters for mineral buildup</li>
              <li>Inspect drain hose for clogs</li>
              <li>Verify machine is level (adjust feet if needed)</li>
            </ul>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting" className="mb-12">
            <h2>Troubleshooting</h2>
            <div className="not-prose">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Issue</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Possible Cause</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Won&apos;t start</td>
                    <td className="px-4 py-3">Lid not fully closed</td>
                    <td className="px-4 py-3">Ensure lid is properly latched</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Won&apos;t fill</td>
                    <td className="px-4 py-3">Water supply off or inlet clogged</td>
                    <td className="px-4 py-3">Check taps are on, clean inlet filters</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Won&apos;t drain</td>
                    <td className="px-4 py-3">Drain hose kinked or clogged</td>
                    <td className="px-4 py-3">Check drain hose, remove blockages</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Excessive vibration</td>
                    <td className="px-4 py-3">Unbalanced load or machine not level</td>
                    <td className="px-4 py-3">Redistribute clothes, adjust leveling feet</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Mineral buildup</td>
                    <td className="px-4 py-3">Hard water in remote areas</td>
                    <td className="px-4 py-3">Run vinegar cleaning cycle monthly, consider water softener</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              For issues not listed here,{' '}
              <Link href="/contact" className="text-green-600 hover:text-green-700 font-medium">
                contact us
              </Link>.
            </p>
          </section>

          {/* How to Get Involved */}
          <section id="involved" className="mb-12">
            <h2>How to Get Involved</h2>
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Community or Organisation</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If your community needs reliable washing machines, we want to
                  hear from you. We&apos;re looking for communities willing to
                  participate in prototype testing and provide feedback.
                </p>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Get in touch &rarr;
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Funding Partner or Sponsor</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Help us get more prototypes into communities, fund R&amp;D on
                  price reduction, or support the path to community-owned
                  manufacturing.
                </p>
                <Link
                  href="/partner"
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Partner with us &rarr;
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Technical Expertise</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Know about commercial appliances, remote power systems, water
                  treatment, or logistics? We&apos;re always looking for people who
                  can help us solve specific challenges.
                </p>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Share your expertise &rarr;
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Register your interest and we&apos;ll let you know when
                  Pakkimjalki Kari is available, or when we have testing results
                  to share.
                </p>
                <Link
                  href="/partner"
                  className="text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Register interest &rarr;
                </Link>
              </div>
            </div>
          </section>

        </article>

        {/* CTA Footer */}
        <div className="bg-neutral-900 text-white rounded-lg p-8 mb-8">
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
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex justify-between">
            <Link href="/wiki" className="text-green-600 hover:text-green-700">
              &larr; Back to Wiki
            </Link>
            <Link href="/wiki/products/stretch-bed" className="text-green-600 hover:text-green-700">
              The Stretch Bed &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
