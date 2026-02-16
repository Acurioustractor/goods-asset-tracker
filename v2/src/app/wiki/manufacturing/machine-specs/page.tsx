import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Machine Specifications | Goods Wiki',
  description: 'Technical specifications for the shredder, heat press, cooling rack, CNC router, and flip table in the Goods on Country production facility.',
};

export default function MachineSpecsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/wiki" className="hover:text-green-600">Wiki</Link>
          {' '}/{' '}
          <Link href="/wiki#manufacturing" className="hover:text-green-600">Manufacturing</Link>
          {' '}/{' '}
          <span className="text-gray-900">Machine Specifications</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Machine Specifications</h1>
          <p className="text-xl text-gray-600">
            Technical specs, operating parameters, safety notes, and maintenance schedules
            for every machine in the travelling production facility.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Machines</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#shredder" className="text-green-600 hover:text-green-700">Shredder</a></li>
            <li><a href="#heat-press" className="text-green-600 hover:text-green-700">Heat Press</a></li>
            <li><a href="#cooling-rack" className="text-green-600 hover:text-green-700">Cooling Press / Rack</a></li>
            <li><a href="#cnc-router" className="text-green-600 hover:text-green-700">CNC Router</a></li>
            <li><a href="#flip-table" className="text-green-600 hover:text-green-700">Flip Table / Frames</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="space-y-16">

          {/* Shredder */}
          <section id="shredder">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shredder</h2>
            <p className="text-gray-600 mb-6">
              The shredder is the first stage of the plastic recycling pipeline. It takes sorted
              HDPE plastic and reduces it to small flakes ready for the heat press.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Parameter</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Input Material</td>
                    <td className="px-4 py-3">Sorted HDPE (#2) plastic</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Output</td>
                    <td className="px-4 py-3">Plastic flakes (uniform size)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Power</td>
                    <td className="px-4 py-3">3-phase electric</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Feed Method</td>
                    <td className="px-4 py-3">Manual — hand-fed through hopper</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Operating Notes</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Feed plastic steadily — do not overload the hopper</li>
              <li>Listen for changes in motor sound that indicate a jam</li>
              <li>Clear jams only when machine is powered off and locked out</li>
              <li>Check output flake size regularly for consistency</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <ul className="list-disc list-inside text-red-900 space-y-2 text-sm">
                <li>Hearing protection required at all times during operation</li>
                <li>Safety glasses and gloves mandatory</li>
                <li>Keep hands clear of the hopper opening</li>
                <li>Lockout/tagout before clearing any jam</li>
                <li>Long hair and loose clothing must be secured</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Maintenance</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Daily:</strong> Clear residual plastic from blades and hopper</li>
              <li><strong>Weekly:</strong> Inspect blade sharpness, check belt tension</li>
              <li><strong>Monthly:</strong> Lubricate bearings, inspect electrical connections</li>
              <li><strong>As needed:</strong> Blade sharpening or replacement</li>
            </ul>
          </section>

          {/* Heat Press */}
          <section id="heat-press">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Heat Press</h2>
            <p className="text-gray-600 mb-6">
              The heat press melts shredded HDPE flakes and presses them into solid sheets
              that become the recycled plastic legs of the Stretch Bed.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Parameter</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Operating Temperature</td>
                    <td className="px-4 py-3">190°C</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Pressure</td>
                    <td className="px-4 py-3">~5,000 PSI</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Cycle Time</td>
                    <td className="px-4 py-3">2–3 hours per sheet</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Input</td>
                    <td className="px-4 py-3">Shredded HDPE flakes in steel frame</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Output</td>
                    <td className="px-4 py-3">Solid HDPE sheet</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Power</td>
                    <td className="px-4 py-3">3-phase electric</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Operating Notes</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Distribute flakes evenly in the frame before pressing — uneven fill causes weak spots</li>
              <li>Preheat the press to target temperature before loading</li>
              <li>Monitor temperature gauges throughout the cycle</li>
              <li>Do not open the press during the cycle — heat loss causes inconsistent sheets</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <ul className="list-disc list-inside text-red-900 space-y-2 text-sm">
                <li>Heat-resistant gloves required when handling frames and sheets</li>
                <li>Burns risk — surfaces reach 190°C</li>
                <li>Adequate ventilation required — HDPE fumes at temperature</li>
                <li>Keep fire extinguisher accessible at all times</li>
                <li>Never leave the press unattended during operation</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Maintenance</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Daily:</strong> Clean press surfaces of residual plastic</li>
              <li><strong>Weekly:</strong> Check hydraulic fluid levels, inspect seals</li>
              <li><strong>Monthly:</strong> Calibrate temperature gauges, inspect heating elements</li>
              <li><strong>Quarterly:</strong> Full hydraulic system inspection</li>
            </ul>
          </section>

          {/* Cooling Press / Rack */}
          <section id="cooling-rack">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cooling Press / Rack</h2>
            <p className="text-gray-600 mb-6">
              After hot-pressing, sheets must cool slowly and under pressure to prevent warping.
              The cooling rack holds sheets flat during the critical cooling period.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Parameter</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Minimum Cool Time</td>
                    <td className="px-4 py-3">6 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Method</td>
                    <td className="px-4 py-3">Weighted flat cooling under even pressure</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Capacity</td>
                    <td className="px-4 py-3">Multiple sheets simultaneously</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Operating Notes</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Transfer sheets to cooling rack immediately after pressing</li>
              <li>Apply weight evenly across the entire sheet surface</li>
              <li>Do not rush cooling — sheets removed early will warp</li>
              <li>6 hours minimum; overnight is ideal</li>
              <li>Check for warping before moving to CNC stage</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Issues</h3>
            <div className="overflow-x-auto">
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
                    <td className="px-4 py-3 font-medium">Warped sheet</td>
                    <td className="px-4 py-3">Insufficient cool time or uneven weight</td>
                    <td className="px-4 py-3">Re-press and cool for longer with more even weight</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Surface marks</td>
                    <td className="px-4 py-3">Debris on cooling surface</td>
                    <td className="px-4 py-3">Clean cooling surfaces before each use</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* CNC Router */}
          <section id="cnc-router">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">CNC Router</h2>
            <p className="text-gray-600 mb-6">
              The CNC router cuts cooled HDPE sheets into precise leg components using
              pre-loaded templates. Accuracy here determines fit quality during bed assembly.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Parameter</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Material</td>
                    <td className="px-4 py-3">Cooled HDPE sheets</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Templates</td>
                    <td className="px-4 py-3">Pre-loaded cutting profiles for bed leg components</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Dust Extraction</td>
                    <td className="px-4 py-3">Required — connected extraction system</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Hold-Down</td>
                    <td className="px-4 py-3">Vacuum table or mechanical clamps</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Operating Notes</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Verify template selection before starting each cut run</li>
              <li>Ensure sheet is firmly held down — movement during cutting ruins the part</li>
              <li>Dust extraction must be running before starting the router</li>
              <li>Check first cut piece against template for dimensional accuracy</li>
              <li>Collect all offcuts for re-shredding (zero waste)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <ul className="list-disc list-inside text-red-900 space-y-2 text-sm">
                <li>Safety glasses and hearing protection required</li>
                <li>Dust extraction must be active — HDPE dust is a respiratory hazard</li>
                <li>Keep hands clear of the cutting area during operation</li>
                <li>Do not reach under the sheet while the router is running</li>
                <li>Emergency stop must be accessible at all times</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Maintenance</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Daily:</strong> Clear dust and chips from table and guides</li>
              <li><strong>Weekly:</strong> Inspect router bit sharpness, check extraction filters</li>
              <li><strong>Monthly:</strong> Lubricate guide rails, verify template calibration</li>
              <li><strong>As needed:</strong> Router bit replacement</li>
            </ul>
          </section>

          {/* Flip Table / Frames */}
          <section id="flip-table">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Flip Table / Frames</h2>
            <p className="text-gray-600 mb-6">
              The flip table is used for sheet preparation, trimming, and final quality inspection
              before parts move to assembly. Steel frames hold plastic during pressing.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Parameter</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Purpose</td>
                    <td className="px-4 py-3">Sheet preparation, trimming, inspection</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Frames</td>
                    <td className="px-4 py-3">Steel moulds that hold plastic during pressing</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Capacity</td>
                    <td className="px-4 py-3">One sheet at a time</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Operating Notes</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Clean frame surfaces before filling with shredded plastic</li>
              <li>Apply release agent to frame walls to prevent sticking</li>
              <li>Distribute plastic evenly — overfill slightly to account for compression</li>
              <li>Trim sheet edges flush after cooling</li>
              <li>Inspect finished sheets for voids, cracks, or uneven thickness</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Frame Care</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>After each use:</strong> Clean residual plastic from frame edges</li>
              <li><strong>Weekly:</strong> Check frame for warping or damage</li>
              <li><strong>As needed:</strong> Re-apply release agent coating</li>
            </ul>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between">
            <Link href="/wiki" className="text-green-600 hover:text-green-700">
              ← Back to Wiki
            </Link>
            <Link href="/wiki/manufacturing/plastic-processing" className="text-green-600 hover:text-green-700">
              Plastic Processing Guide →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
