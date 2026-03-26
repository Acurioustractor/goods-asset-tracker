import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community Goods Tracking Model | Goods Wiki',
  description: 'How Goods on Country tracks essential items through their lifecycle in remote communities.',
};

export default function TrackingModelPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-br from-green-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/wiki" className="text-green-600 hover:text-green-700 text-sm font-medium mb-4 inline-block">
            &larr; Back to Wiki
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Goods Tracking Model</h1>
          <p className="text-lg text-gray-600">
            How we track essential goods through their full lifecycle — from deployment to replacement — so communities get better products and less money leaks out.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg max-w-none">
        <h2>Why Track?</h2>
        <p>
          In remote communities, essential goods like beds, washing machines, and fridges fail at alarming rates.
          One Alice Springs provider sells <strong>$3M/year</strong> of washing machines into remote communities —
          most end up in dumps within months. Without tracking, the same failing products get re-procured endlessly.
        </p>
        <p>Our tracking model answers six questions:</p>
        <ol>
          <li>What is in community <strong>right now</strong>?</li>
          <li>Who bought or supplied it?</li>
          <li>How long does it last?</li>
          <li>What fails, and <strong>why</strong>?</li>
          <li>What gets repaired, replaced, or dumped?</li>
          <li>How much money leaks out through repeat procurement of low-lifecycle products?</li>
        </ol>

        <h2>First Principles</h2>
        <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
          {[
            { title: 'Track the product, not the order', desc: 'An order is a financial event. A product is a physical thing in community with a lifecycle.' },
            { title: 'Capture at point of support', desc: 'The only reliable interaction is a short form on a phone. Capture lifecycle events when people ask for help.' },
            { title: 'Structured pick-lists first', desc: 'Free text is hard on phones with poor connectivity. Use dropdowns and checkboxes before long text.' },
            { title: 'Replacement = procurement signal', desc: 'When a product is dumped, that\'s not just support — it\'s a signal that procurement needs to improve.' },
            { title: 'Separate known from estimated', desc: 'Don\'t mix confirmed data with guesses. Mark confidence levels.' },
            { title: 'Keep it small enough to use', desc: 'A model nobody fills in is worse than no model. Optimise for actual field use.' },
          ].map(p => (
            <div key={p.title} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="font-semibold text-gray-900 text-sm">{p.title}</div>
              <div className="text-gray-600 text-sm mt-1">{p.desc}</div>
            </div>
          ))}
        </div>

        <h2>Product Lanes</h2>
        <p>We start with four product families because they combine high spend, high freight burden, high failure risk, and direct health impact:</p>
        <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          {[
            { icon: '🛏️', name: 'Beds', status: 'Active' },
            { icon: '🧺', name: 'Washing Machines', status: 'Active' },
            { icon: '🛋️', name: 'Mattresses', status: 'Planned' },
            { icon: '❄️', name: 'Fridges/Freezers', status: 'Planned' },
          ].map(lane => (
            <div key={lane.name} className="text-center p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-3xl mb-2">{lane.icon}</div>
              <div className="font-medium text-gray-900 text-sm">{lane.name}</div>
              <div className={`text-xs mt-1 ${lane.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>{lane.status}</div>
            </div>
          ))}
        </div>

        <h2>Core Entities</h2>

        <h3>1. Asset</h3>
        <p>One physical product in community. Every Stretch Bed and washing machine gets a unique ID and QR code.</p>
        <ul>
          <li><strong>unique_id</strong> — e.g. SB-0142</li>
          <li><strong>product_type</strong> — stretch_bed, washing_machine</li>
          <li><strong>community</strong> — where it is now</li>
          <li><strong>status</strong> — deployed, needs_repair, retired, dumped</li>
          <li><strong>claimed_by</strong> — household or person (via QR scan)</li>
        </ul>

        <h3>2. Lifecycle Event</h3>
        <p>Anything that happens to an asset after deployment. Captured via QR support form.</p>
        <ul>
          <li><strong>event_type</strong> — check_in, issue_reported, repair, replacement, disposal</li>
          <li><strong>condition</strong> — good, needs_repair, damaged, missing</li>
          <li><strong>failure_cause</strong> — wear, rust, mould, frame_damage, electrical_fault, freight_damage</li>
          <li><strong>outcome_wanted</strong> — repair, replace, pickup, assessment</li>
          <li><strong>safety_risk</strong> — boolean flag for urgent issues</li>
        </ul>

        <h3>3. Usage Data (Machines)</h3>
        <p>Telemetry from connected washing machines via IoT sensors.</p>
        <ul>
          <li><strong>cycle_count</strong> — wash cycles per day/week</li>
          <li><strong>energy_kwh</strong> — power consumption</li>
          <li><strong>heartbeat</strong> — last communication timestamp</li>
        </ul>

        <h2>How It Works in Practice</h2>
        <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">1</span>
            <div><strong>Deployment:</strong> Bed arrives in community. Worker scans QR, registers in asset system.</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">2</span>
            <div><strong>Claim:</strong> Recipient scans QR on their phone. Links their identity to the asset. Gets SMS support channel.</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">3</span>
            <div><strong>Support:</strong> When something breaks, scan QR &rarr; fill structured form &rarr; support ticket created &rarr; GHL workflow triggered.</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">4</span>
            <div><strong>Insight:</strong> Lifecycle events aggregate into failure patterns. &quot;Canvas tears after 2 years in dusty conditions&quot; becomes a design improvement.</div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">5</span>
            <div><strong>Procurement signal:</strong> When a competitor&apos;s washing machine gets dumped after 3 months, that&apos;s evidence for why communities should procure better products.</div>
          </div>
        </div>

        <h2>The Economic Argument</h2>
        <p>
          Without lifecycle tracking, remote communities are trapped in a cycle of cheap procurement and rapid failure.
          By tracking what lasts and what doesn&apos;t, we can prove that a $500 Stretch Bed lasting 10+ years
          costs less than replacing $50 beds every 6 months — and the data makes the grant case for quality goods.
        </p>
      </div>
    </div>
  );
}
