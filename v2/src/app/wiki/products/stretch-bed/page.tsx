import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { STRETCH_BED } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'The Stretch Bed - Complete Guide | Goods Wiki',
  description: 'Everything you need to know about the Stretch Bed: specifications, assembly, maintenance, and troubleshooting.',
};

export default function StretchBedGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/wiki" className="hover:text-green-600">Wiki</Link>
          {' '}/{' '}
          <Link href="/wiki#products" className="hover:text-green-600">Products</Link>
          {' '}/{' '}
          <span className="text-gray-900">Stretch Bed</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">The Stretch Bed</h1>
          <p className="text-xl text-gray-600">
            A washable, flat-packable bed made from recycled plastic, heavy-duty canvas,
            and galvanised steel. Designed with communities for extreme durability.
          </p>
        </header>

        {/* Quick Specs */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Specs</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Assembly Time</div>
              <div className="text-gray-900">~5 minutes</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Tools Required</div>
              <div className="text-gray-900">None</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Weight</div>
              <div className="text-gray-900">{STRETCH_BED.specs.weight}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Load Capacity</div>
              <div className="text-gray-900">200kg</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Dimensions</div>
              <div className="text-gray-900">188 x 92 x 25cm</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Warranty</div>
              <div className="text-gray-900">5 years</div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <nav className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Contents</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#specifications" className="text-green-600 hover:text-green-700">Specifications</a></li>
            <li><a href="#materials" className="text-green-600 hover:text-green-700">Materials</a></li>
            <li><a href="#assembly" className="text-green-600 hover:text-green-700">Assembly Instructions</a></li>
            <li><a href="#features" className="text-green-600 hover:text-green-700">Key Features</a></li>
            <li><a href="#maintenance" className="text-green-600 hover:text-green-700">Maintenance & Cleaning</a></li>
            <li><a href="#troubleshooting" className="text-green-600 hover:text-green-700">Troubleshooting</a></li>
            <li><a href="#why" className="text-green-600 hover:text-green-700">Why It Was Developed</a></li>
            <li><a href="#safety" className="text-green-600 hover:text-green-700">Safety Information</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <article className="prose prose-lg max-w-none">

          {/* Specifications */}
          <section id="specifications" className="mb-12">
            <h2>Specifications</h2>
            <div className="not-prose">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Weight</td>
                    <td className="px-4 py-3">{STRETCH_BED.specs.weight}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Load Capacity</td>
                    <td className="px-4 py-3">200kg (tested)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Dimensions</td>
                    <td className="px-4 py-3">188cm x 92cm x 25cm (L x W x H)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Assembly Time</td>
                    <td className="px-4 py-3">~5 minutes</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Warranty</td>
                    <td className="px-4 py-3">5 years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Tools Required</td>
                    <td className="px-4 py-3">None</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Design Lifespan</td>
                    <td className="px-4 py-3">10+ years</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-medium text-gray-700">Plastic Diverted</td>
                    <td className="px-4 py-3">{STRETCH_BED.specs.plasticDiverted}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Materials */}
          <section id="materials" className="mb-12">
            <h2>Materials</h2>
            <div className="not-prose">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Component</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Material</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Frame</td>
                    <td className="px-4 py-3">Galvanised steel pipe<br/><span className="text-sm text-gray-600">26.9mm OD x 2.6mm wall, 1950mm length</span></td>
                    <td className="px-4 py-3">DNA Steel Direct, Alice Springs</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Sleeping Surface</td>
                    <td className="px-4 py-3">Heavy-duty Australian canvas</td>
                    <td className="px-4 py-3">Centre Canvas, Alice Springs</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Legs</td>
                    <td className="px-4 py-3">Recycled HDPE plastic panels</td>
                    <td className="px-4 py-3">Defy Design, Sydney (current)<br/>On-country production (future)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">End Caps</td>
                    <td className="px-4 py-3">Round ribbed tube end caps, 27mm</td>
                    <td className="px-4 py-3">Hardware supplier</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Joinery</td>
                    <td className="px-4 py-3">Slot-together "T" section<br/><span className="text-sm text-gray-600">No screws or hardware needed</span></td>
                    <td className="px-4 py-3">Custom manufactured</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Environmental Impact:</strong> Each bed diverts 20kg of HDPE plastic from landfill.
                The recycled HDPE is currently sourced from Defy Design&apos;s Sydney operations. Future vision:
                on-country collection and processing in community-owned facilities.
              </p>
            </div>
          </section>

          {/* Assembly Instructions */}
          <section id="assembly" className="mb-12">
            <h2>Assembly Instructions</h2>
            <p><strong>Total Time:</strong> ~5 minutes | <strong>People:</strong> 1-2 | <strong>Tools:</strong> None required</p>

            <div className="not-prose space-y-6 mt-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 1: Frame Cutting (Pre-done)</h3>
                <p className="text-gray-700">Steel pipe arrives pre-cut to length by DNA Steel Direct. No cutting required on-site.</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 2: Frame Assembly</h3>
                <p className="text-gray-700 mb-2">Connect steel pipe pieces using the slot-together "T" section joinery.</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>No tools or fasteners needed</li>
                  <li>Pieces click together</li>
                  <li>Creates rigid rectangular frame</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 3: Attach Recycled Plastic Legs</h3>
                <p className="text-gray-700 mb-2">Insert HDPE leg panels into frame corners.</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Slide legs onto frame ends</li>
                  <li>Secure with built-in slots (no screws)</li>
                  <li>Ensure all four legs are firmly attached</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 4: Canvas Attachment</h3>
                <p className="text-gray-700 mb-2">Stretch heavy-duty canvas across the frame.</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Canvas works like a catamaran trampoline</li>
                  <li>Tension creates body-adaptive surface</li>
                  <li>Secure all edges to frame</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 5: End Caps</h3>
                <p className="text-gray-700">Attach 27mm round ribbed tube end caps to all exposed pipe ends for safety and finish.</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 6: Final Check</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Ensure all connections are secure</li>
                  <li>Test bed stability by applying weight</li>
                  <li>Check canvas tension is even</li>
                  <li>Verify bed sits level on ground</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>Community Assembly:</strong> Typically assembled on-country with community members.
                A trained "bed mechanic" often assists with first-time assembly to ensure proper setup.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section id="features" className="mb-12">
            <h2>Key Design Features</h2>
            <div className="not-prose grid md:grid-cols-2 gap-6 mt-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">🌊 Tension-Weave Surface</h3>
                <p className="text-gray-700">Canvas stretched across frame creates natural flexibility. Bed adapts to body shape like a catamaran trampoline - breathable and comfortable.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">💧 Fully Washable</h3>
                <p className="text-gray-700">No foam means entire bed can be hosed down or left outside in weather. Canvas dries quickly, preventing mould and moisture retention.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">📦 Flat-Packable</h3>
                <p className="text-gray-700">Smaller shipping footprint than Basket Bed. Easier to transport to remote communities via barge, plane, or truck.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">☀️ Outdoor-Ready</h3>
                <p className="text-gray-700">Canvas + galvanised steel handles extreme weather. Won't rust. Designed for dust, heat, humidity, and harsh conditions.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">🚫 No Foam</h3>
                <p className="text-gray-700">Eliminates mould, moisture retention, and breakdown issues common with foam mattresses in remote communities.</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">⬆️ Elevated Sleeping</h3>
                <p className="text-gray-700">High off ground addresses community request for elevated sleeping. Reduces exposure to vermin, insects, and cold/wet ground.</p>
              </div>
            </div>
          </section>

          {/* Maintenance */}
          <section id="maintenance" className="mb-12">
            <h2>Maintenance & Cleaning</h2>

            <h3>Canvas Surface</h3>
            <ul>
              <li>Hose down when dirty</li>
              <li>Can be left outside in rain for natural cleaning</li>
              <li>Fully washable - no moisture retention</li>
              <li>Dries quickly in sun</li>
            </ul>

            <h3>Steel Frame</h3>
            <ul>
              <li>Galvanised coating prevents rust</li>
              <li>Wipe clean with damp cloth as needed</li>
              <li>No special treatment required</li>
              <li>Inspect joints periodically for tightness</li>
            </ul>

            <h3>HDPE Legs</h3>
            <ul>
              <li>Stain-resistant and UV-resistant</li>
              <li>Stays clean in harsh conditions</li>
              <li>Unlike painted surfaces, HDPE doesn't trap dirt</li>
              <li>Wipe with damp cloth</li>
            </ul>

            <h3>End-of-Life / Repairs</h3>
            <ul>
              <li>Designed for repair, not replacement</li>
              <li>Components can be swapped individually</li>
              <li>Canvas can be replaced if worn</li>
              <li>Frame parts modular and replaceable</li>
              <li>Local "bed mechanics" can perform repairs</li>
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cause</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Bed wobbles</td>
                    <td className="px-4 py-3">Uneven ground or loose connections</td>
                    <td className="px-4 py-3">Level the ground or re-tighten all frame connections</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Canvas feels loose</td>
                    <td className="px-4 py-3">Natural settling or incorrect installation</td>
                    <td className="px-4 py-3">Re-tension canvas by adjusting attachment points</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Leg feels loose</td>
                    <td className="px-4 py-3">Connection not fully seated</td>
                    <td className="px-4 py-3">Remove and reseat leg firmly into frame slot</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Canvas tears</td>
                    <td className="px-4 py-3">Sharp object or excessive wear</td>
                    <td className="px-4 py-3">Contact support for canvas replacement</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Frame bent</td>
                    <td className="px-4 py-3">Excessive force or impact</td>
                    <td className="px-4 py-3">Replace damaged frame section - contact support</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Why It Was Developed */}
          <section id="why" className="mb-12">
            <h2>Why the Stretch Bed Was Developed</h2>
            <p>
              The Stretch Bed evolved from community feedback on the earlier Basket Bed design.
              Four themes emerged from co-design sessions:
            </p>

            <div className="not-prose space-y-4 mt-6">
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r">
                <h3 className="font-semibold mb-2">"We want to move it around"</h3>
                <p className="text-gray-700">Communities needed a lighter, more portable bed that flat-packs smaller for easier relocation between homes or rooms.</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r">
                <h3 className="font-semibold mb-2">"We want it high off the ground"</h3>
                <p className="text-gray-700">Elevated sleeping reduces exposure to insects, vermin, cold floors, and provides stable support for larger households.</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r">
                <h3 className="font-semibold mb-2">"We don't want the foam"</h3>
                <p className="text-gray-700">Foam toppers couldn't be washed, retained moisture, developed mould, and broke down in washing machines. Canvas solves all these issues - it can be hosed down completely.</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r">
                <h3 className="font-semibold mb-2">"We want a MAD bed!"</h3>
                <p className="text-gray-700">The advisory group pushed for more innovative, body-adaptive design that goes beyond basic functionality.</p>
              </div>
            </div>

            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-lg font-medium text-green-900 mb-2">Community Verdict</p>
              <blockquote className="text-gray-700 italic">
                "These ones are the best so far... in terms of flexibility, ease of use and reduction in skin disease stuff."
              </blockquote>
            </div>
          </section>

          {/* Safety */}
          <section id="safety" className="mb-12">
            <h2>Safety Information</h2>
            <ul>
              <li><strong>Load capacity:</strong> 200kg tested and verified</li>
              <li><strong>Durability testing:</strong> Conducted before deployment (ALMA Signal 3: Harm Risk protocol)</li>
              <li><strong>Weather resistance:</strong> Designed for extreme conditions - dust, heat, humidity</li>
              <li><strong>Pest resistance:</strong> No fabric crevices like traditional mattresses - resistant to bed bugs</li>
              <li><strong>Elevation:</strong> Lifts sleeper off ground, reducing exposure to vermin, insects, cold, and wet surfaces</li>
              <li><strong>No sharp edges:</strong> All exposed ends have safety caps</li>
              <li><strong>Tool-free assembly:</strong> Reduces injury risk during setup</li>
              <li><strong>Fire safety:</strong> Canvas is naturally fire-resistant compared to foam mattresses</li>
            </ul>
          </section>

        </article>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between">
            <Link href="/wiki" className="text-green-600 hover:text-green-700">
              ← Back to Wiki
            </Link>
            <Link href="/shop/stretch-bed-single" className="text-green-600 hover:text-green-700">
              Buy the Stretch Bed →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
