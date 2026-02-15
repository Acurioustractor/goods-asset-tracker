import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Plastic Processing Guide | Goods Wiki',
  description: 'Complete guide to HDPE plastic collection, sorting, shredding, sheet forming, and quality control for the Goods on Country production facility.',
};

export default function PlasticProcessingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/wiki" className="hover:text-green-600">Wiki</Link>
          {' '}/{' '}
          <Link href="/wiki#manufacturing" className="hover:text-green-600">Manufacturing</Link>
          {' '}/{' '}
          <span className="text-gray-900">Plastic Processing Guide</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Plastic Processing Guide</h1>
          <p className="text-xl text-gray-600">
            From collection to finished sheet — everything you need to know about processing
            recycled HDPE plastic in the on-country production facility.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Contents</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#accepted-plastics" className="text-green-600 hover:text-green-700">Accepted Plastics</a></li>
            <li><a href="#collection" className="text-green-600 hover:text-green-700">Collection & Sorting</a></li>
            <li><a href="#safety" className="text-green-600 hover:text-green-700">Safety</a></li>
            <li><a href="#shredding" className="text-green-600 hover:text-green-700">Shredding</a></li>
            <li><a href="#sheet-forming" className="text-green-600 hover:text-green-700">Sheet Forming</a></li>
            <li><a href="#quality-control" className="text-green-600 hover:text-green-700">Quality Control</a></li>
            <li><a href="#waste" className="text-green-600 hover:text-green-700">Waste & Offcuts</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="space-y-16">

          {/* Accepted Plastics */}
          <section id="accepted-plastics">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accepted Plastics</h2>
            <p className="text-gray-600 mb-6">
              The facility processes HDPE (High-Density Polyethylene), identified by the #2
              recycling symbol. Each Stretch Bed diverts 20kg of HDPE from landfill.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border border-green-200 bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">Accept</h3>
                <ul className="list-disc list-inside text-green-900 space-y-2 text-sm">
                  <li>Milk bottles and juice containers</li>
                  <li>Detergent and cleaning product bottles</li>
                  <li>Shampoo and conditioner bottles</li>
                  <li>HDPE pipes and fittings</li>
                  <li>Plastic crates and bins</li>
                  <li>Bottle caps (often HDPE)</li>
                </ul>
              </div>

              <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-3">Reject</h3>
                <ul className="list-disc list-inside text-red-900 space-y-2 text-sm">
                  <li>PET bottles (#1) — different melting point</li>
                  <li>PVC (#3) — releases toxic fumes</li>
                  <li>Polystyrene (#6) — incompatible</li>
                  <li>Mixed or unlabelled plastics</li>
                  <li>Contaminated or food-soiled plastic</li>
                  <li>Plastic with metal inserts or electronics</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Identification tip:</strong> Look for the #2 triangle on the bottom of containers.
                HDPE is typically opaque and slightly waxy to the touch. When in doubt, set it aside
                for a supervisor to check — mixing plastic types ruins entire batches.
              </p>
            </div>
          </section>

          {/* Collection & Sorting */}
          <section id="collection">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Collection & Sorting</h2>
            <p className="text-gray-600 mb-6">
              Good sorting at collection prevents contamination downstream. A clean input stream
              means better sheets and fewer rejected batches.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 1: Collection</h3>
                <p className="text-gray-700">
                  Gather HDPE plastic from community collection points, local businesses, and
                  council waste streams. Remove lids and rinse containers to remove food residue.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 2: Visual Sort</h3>
                <p className="text-gray-700">
                  Check every item for the #2 recycling symbol. Separate by colour if colour-matching
                  sheets are desired. Remove any non-HDPE items, labels, and metal components.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 3: Cleaning</h3>
                <p className="text-gray-700">
                  Rinse sorted plastic with water to remove dirt, dust, and any remaining residue.
                  Allow to air dry before storage.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Step 4: Storage</h3>
                <p className="text-gray-700">
                  Store sorted, clean plastic in designated bins away from weather. Keep different
                  colours separated if needed. Label bins clearly.
                </p>
              </div>
            </div>
          </section>

          {/* Safety */}
          <section id="safety">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Safety</h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-red-900 mb-3">Required PPE</h3>
              <ul className="list-disc list-inside text-red-900 space-y-2 text-sm">
                <li><strong>Shredding:</strong> Safety glasses, hearing protection, heavy-duty gloves, closed-toe shoes</li>
                <li><strong>Heat press:</strong> Heat-resistant gloves, safety glasses, long sleeves, closed-toe shoes</li>
                <li><strong>CNC routing:</strong> Safety glasses, hearing protection, dust mask or respirator</li>
                <li><strong>Sorting:</strong> Gloves, closed-toe shoes</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fume Awareness</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-900">
                <strong>HDPE at 190°C can produce fumes.</strong> Always ensure adequate ventilation
                when the heat press is running. If you experience headache, dizziness, or nausea,
                move to fresh air immediately and notify the supervisor. Never heat PVC — it releases
                toxic chlorine gas.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">First Aid</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Burns:</strong> Cool under running water for 20 minutes. Do not apply ice. Seek medical attention for serious burns.</li>
              <li><strong>Cuts:</strong> Apply pressure with clean cloth. Clean and bandage. Seek help if deep or won&apos;t stop bleeding.</li>
              <li><strong>Fume inhalation:</strong> Move to fresh air. Rest. Seek medical attention if symptoms persist.</li>
              <li><strong>Eye injury:</strong> Flush with clean water for 15 minutes. Seek medical attention.</li>
            </ul>
          </section>

          {/* Shredding */}
          <section id="shredding">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shredding</h2>
            <p className="text-gray-600 mb-6">
              Shredding reduces sorted HDPE to uniform flakes ready for the heat press.
              Consistent flake size is critical for even sheet quality.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Feed Rate</h3>
                <p className="text-gray-700">
                  Feed plastic steadily into the hopper. Do not overload — this causes jams and
                  uneven output. Listen to the motor sound for signs of strain.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Jam Clearing</h3>
                <p className="text-gray-700">
                  If a jam occurs: power off the shredder, engage lockout, then clear the jam manually.
                  Never reach into a running or powered shredder. Restart only after the jam is fully cleared.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">Output Quality</h3>
                <p className="text-gray-700">
                  Check flake output regularly. Flakes should be roughly uniform in size. Oversized pieces
                  indicate dull blades. Dust or powder suggests excessive wear. Both affect final sheet quality.
                </p>
              </div>
            </div>
          </section>

          {/* Sheet Forming */}
          <section id="sheet-forming">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sheet Forming</h2>
            <p className="text-gray-600 mb-6">
              Converting shredded HDPE flakes into solid sheets through the heat press.
              This is the most time-intensive step in the process.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">1. Frame Preparation</h3>
                <p className="text-gray-700">
                  Clean the steel frame. Apply release agent to all inner surfaces. Place frame on
                  the press bed.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">2. Even Distribution</h3>
                <p className="text-gray-700">
                  Pour shredded flakes into the frame. Spread evenly by hand, paying extra attention
                  to corners and edges. Overfill slightly — plastic compresses significantly under heat
                  and pressure.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">3. Pressing</h3>
                <p className="text-gray-700">
                  Close the press and bring to 190°C at ~5,000 PSI. Maintain for 2–3 hours.
                  Monitor temperature and pressure gauges throughout the cycle.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-lg mb-2">4. Cooling</h3>
                <p className="text-gray-700">
                  Transfer the pressed sheet (still in frame) to the cooling rack immediately.
                  Apply even weight across the surface. Allow minimum 6 hours — overnight is ideal.
                  Rushing this step causes warping.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Plan production around cooling time. Press sheets in the morning,
                cool overnight, and route the next day. This maximises throughput.
              </p>
            </div>
          </section>

          {/* Quality Control */}
          <section id="quality-control">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality Control</h2>
            <p className="text-gray-600 mb-6">
              Every sheet must pass inspection before being routed into bed components.
              Catching defects early saves time and material.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Inspection Criteria</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Check</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Pass</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Thickness</td>
                    <td className="px-4 py-3">Even across entire sheet</td>
                    <td className="px-4 py-3">Thin spots or uneven thickness</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Surface</td>
                    <td className="px-4 py-3">Smooth, fully fused</td>
                    <td className="px-4 py-3">Visible flakes, rough patches, or voids</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Flatness</td>
                    <td className="px-4 py-3">Sheet lies flat on table</td>
                    <td className="px-4 py-3">Warping, bowing, or curling</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Structural</td>
                    <td className="px-4 py-3">No cracks when flexed</td>
                    <td className="px-4 py-3">Cracks, splits, or delamination</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Contamination</td>
                    <td className="px-4 py-3">Uniform material throughout</td>
                    <td className="px-4 py-3">Foreign material visible, discolouration</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reject Handling</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Sheets that fail inspection are shredded and re-processed</li>
              <li>Record the defect type and probable cause for process improvement</li>
              <li>If multiple sheets fail in a row, check machine calibration before continuing</li>
            </ul>
          </section>

          {/* Waste & Offcuts */}
          <section id="waste">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Waste & Offcuts</h2>
            <p className="text-gray-600 mb-6">
              The facility operates a zero-waste approach. All plastic offcuts and rejected
              sheets are fed back into the shredder for re-processing.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-3">Zero-Waste Cycle</h3>
              <ul className="list-disc list-inside text-green-900 space-y-2 text-sm">
                <li>CNC routing offcuts → back to shredder</li>
                <li>Trimming waste → back to shredder</li>
                <li>Failed sheets → back to shredder</li>
                <li>Test pieces → back to shredder</li>
                <li>Nothing leaves the facility as plastic waste</li>
              </ul>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Re-shredded material can be processed through the heat press
                multiple times without significant quality loss. HDPE is highly recyclable and
                maintains structural integrity through several re-melt cycles.
              </p>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between">
            <Link href="/wiki" className="text-green-600 hover:text-green-700">
              ← Back to Wiki
            </Link>
            <Link href="/wiki/manufacturing/machine-specs" className="text-green-600 hover:text-green-700">
              Machine Specifications →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
