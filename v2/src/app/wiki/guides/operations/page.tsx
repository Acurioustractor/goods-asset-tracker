import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Operations Handbook | Goods Wiki',
  description: 'Daily operations guide for managing orders, inventory, content, and community support.',
};

export default function OperationsHandbookPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-br from-green-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/wiki" className="text-green-600 hover:text-green-700 text-sm font-medium mb-4 inline-block">
            &larr; Back to Wiki
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Operations Handbook</h1>
          <p className="text-lg text-gray-600">
            Daily operations guide for managing orders, production, fleet, and community support.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg max-w-none">
        <h2>Quick Reference</h2>

        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Task</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Frequency</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr><td className="px-4 py-2 text-gray-900">Check new orders</td><td className="px-4 py-2 text-gray-600">Daily</td><td className="px-4 py-2"><code>/admin/orders</code></td></tr>
              <tr><td className="px-4 py-2 text-gray-900">Review support tickets</td><td className="px-4 py-2 text-gray-600">Daily</td><td className="px-4 py-2"><code>/admin/requests</code></td></tr>
              <tr><td className="px-4 py-2 text-gray-900">Check fleet health</td><td className="px-4 py-2 text-gray-600">Daily</td><td className="px-4 py-2"><code>/admin/fleet</code></td></tr>
              <tr><td className="px-4 py-2 text-gray-900">Production log</td><td className="px-4 py-2 text-gray-600">Per shift</td><td className="px-4 py-2"><code>/admin/production</code></td></tr>
              <tr><td className="px-4 py-2 text-gray-900">Inventory check</td><td className="px-4 py-2 text-gray-600">Weekly</td><td className="px-4 py-2"><code>/admin/production</code></td></tr>
              <tr><td className="px-4 py-2 text-gray-900">Campaign engine review</td><td className="px-4 py-2 text-gray-600">Weekly</td><td className="px-4 py-2"><code>/admin/campaign-engine</code></td></tr>
              <tr><td className="px-4 py-2 text-gray-900">Review community ideas</td><td className="px-4 py-2 text-gray-600">Weekly</td><td className="px-4 py-2"><code>/community/ideas</code></td></tr>
              <tr><td className="px-4 py-2 text-gray-900">Impact dashboard</td><td className="px-4 py-2 text-gray-600">Monthly</td><td className="px-4 py-2"><code>/dashboard</code></td></tr>
            </tbody>
          </table>
        </div>

        <h2>Daily Morning Checklist</h2>
        <ol>
          <li><strong>Orders</strong> — Check <code>/admin/orders</code> for new paid orders. Mark as &quot;Processing&quot; once confirmed.</li>
          <li><strong>Support Tickets</strong> — Review <code>/admin/requests</code> for QR-scanned support requests. Triage by priority.</li>
          <li><strong>Fleet</strong> — Check <code>/admin/fleet</code> for washing machine heartbeats. Flag any machines offline &gt;24h.</li>
          <li><strong>Messages</strong> — Check <code>/admin/messages</code> for user messages via the QR portal.</li>
        </ol>

        <h2>Order Processing</h2>
        <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 font-mono text-sm space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-24 text-gray-500">PAID</span>
            <span className="text-gray-300">&rarr;</span>
            <span className="w-28 text-blue-600">PROCESSING</span>
            <span className="text-gray-300">&rarr;</span>
            <span className="w-20 text-amber-600">SHIPPED</span>
            <span className="text-gray-300">&rarr;</span>
            <span className="text-green-600">DELIVERED</span>
          </div>
        </div>
        <ul>
          <li><strong>Paid:</strong> Verify order details, confirm shipping address, check inventory</li>
          <li><strong>Processing:</strong> Coordinate with production/warehouse, package order, print label</li>
          <li><strong>Shipped:</strong> Add tracking number, customer gets notification, monitor delivery</li>
          <li><strong>Delivered:</strong> Mark complete. Customer can claim via QR code.</li>
        </ul>

        <h2>Production Operations</h2>
        <p>
          Log each shift at <code>/admin/production</code>. Record: shift date, workers present,
          beds completed, any quality issues, inventory levels (HDPE plastic, steel poles, canvas).
        </p>
        <ul>
          <li><strong>Plastic Processing:</strong> Collect &rarr; Sort by type (HDPE only) &rarr; Shred &rarr; Melt &rarr; Press into leg moulds</li>
          <li><strong>Assembly:</strong> 2 steel poles + canvas + 4 plastic legs = 1 Stretch Bed</li>
          <li><strong>QR Tagging:</strong> Every bed gets a unique QR code linked in the asset register</li>
          <li><strong>Quality Check:</strong> Weight test (200kg), canvas tension, leg fit tolerance</li>
        </ul>

        <h2>Fleet Management (Washing Machines)</h2>
        <p>
          The 11 deployed washing machines send telemetry data via Particle.io and Openfields webhooks.
          The fleet rollup cron runs every 6 hours.
        </p>
        <ul>
          <li><strong>Heartbeat alerts:</strong> Machines that miss 24h of data get flagged</li>
          <li><strong>Usage tracking:</strong> Cycle counts, energy consumption (kWh), water usage</li>
          <li><strong>Maintenance:</strong> Track via support tickets. Common issues: water inlet, drain pump, control board</li>
        </ul>

        <h2>Campaign Engine</h2>
        <p>
          The campaign engine at <code>/admin/campaign-engine</code> manages engagement scoring and pipeline follow-ups.
        </p>
        <ul>
          <li><strong>Scoring runs weekly</strong> (Monday 6am) — orders 5pt, QR claims 3pt, tickets 2pt, newsletter 1pt</li>
          <li><strong>GHL sync runs daily</strong> (7am) — pushes Grantscope targets to GoHighLevel CRM</li>
          <li><strong>Pipeline followup runs weekly</strong> (Wednesday 8am) — auto-emails stale contacts</li>
          <li><strong>Tiers:</strong> Aware (1-2pt), Engaged (3-5pt), Active (6-9pt), Champion (10+pt)</li>
        </ul>

        <h2>Automated Cron Jobs</h2>
        <div className="not-prose overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Job</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Schedule</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">What It Does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr><td className="px-4 py-2">Fleet Rollup</td><td className="px-4 py-2">Every 6h</td><td className="px-4 py-2">Aggregates washing machine usage data</td></tr>
              <tr><td className="px-4 py-2">EL Sync</td><td className="px-4 py-2">Daily 8am</td><td className="px-4 py-2">Syncs Empathy Ledger stories</td></tr>
              <tr><td className="px-4 py-2">Weekly Digest</td><td className="px-4 py-2">Sunday 10pm</td><td className="px-4 py-2">Compiles activity summary email</td></tr>
              <tr><td className="px-4 py-2">Engagement Scoring</td><td className="px-4 py-2">Monday 6am</td><td className="px-4 py-2">Scores contacts, syncs GHL tier tags</td></tr>
              <tr><td className="px-4 py-2">GHL Sync</td><td className="px-4 py-2">Daily 7am</td><td className="px-4 py-2">Pushes Grantscope targets to GHL</td></tr>
              <tr><td className="px-4 py-2">Pipeline Followup</td><td className="px-4 py-2">Wednesday 8am</td><td className="px-4 py-2">Auto-follows up stale pipeline contacts</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
