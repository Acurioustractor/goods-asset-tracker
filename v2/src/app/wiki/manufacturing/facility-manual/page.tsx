import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Travelling Facility Manual | Goods Wiki',
  description: 'Operations, Safety & Training Manual for the Travelling On-Country Plastic Re-Production Facility',
};

export default function FacilityManualPage() {
  return (
    <>
      <style jsx global>{`
        .manual { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.55; }
        .manual__header { margin-bottom: 1.5rem; }
        .manual__subtitle { margin: .25rem 0; }
        .manual__meta { color: #444; font-size: .95rem; margin-top: .5rem; }
        .manual__nav { border: 1px solid #ddd; padding: 1rem; border-radius: .5rem; margin: 1.5rem 0; }
        .manual__section { margin: 2rem 0; }
        .manual__callout { border-left: 4px solid #999; padding: 1rem; background: #fafafa; border-radius: .25rem; margin: 1rem 0; }
        .manual__callout--warning { border-left-color: #b45309; background: #fff7ed; }
        .manual__callout--standard { border-left-color: #2563eb; background: #eff6ff; }
        .manual__small { font-size: .95rem; color: #333; }
        .manual__figure { margin: 1rem 0; }
        .manual__figure img { max-width: 100%; height: auto; display: block; border-radius: .5rem; }
        .manual__table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .manual__table th, .manual__table td { border: 1px solid #ddd; padding: .6rem; text-align: left; }
        .manual__checklist { list-style: none; padding-left: 0; }
        .manual__checklist li { margin: .4rem 0; }
        .manual__footer { margin-top: 2.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; color: #444; }
        .manual__step { margin: 1.5rem 0; padding: 1rem; border-left: 3px solid #22c55e; background: #f0fdf4; border-radius: .25rem; }
      `}</style>

      <main className="manual" id="travelling-facility-manual">
        <header className="manual__header">
          <div className="mb-4">
            <Link href="/wiki" className="text-sm text-green-600 hover:text-green-700">
              ← Back to Wiki
            </Link>
          </div>
          <h1>Travelling On-Country Plastic Re-Production Facility</h1>
          <p className="manual__subtitle">Operations, Safety & Training Manual</p>
          <p className="manual__meta">
            <strong>Version:</strong> 1.0 &nbsp;•&nbsp; <strong>Document type:</strong> Field Manual &nbsp;•&nbsp;
            <strong>Audience:</strong> Operators, Youth Trainees, Site Leads
          </p>
        </header>

        <nav className="manual__nav" aria-label="Manual sections">
          <h2>Contents</h2>
          <ol>
            <li><a href="#purpose">Purpose of the Facility</a></li>
            <li><a href="#product-overview">Product Overview – Tension Bed System</a></li>
            <li><a href="#container-setup">Mobile Container Setup & Machine Flow</a></li>
            <li><a href="#safety">Safety Requirements</a></li>
            <li><a href="#workflow">Production Workflow (End-to-End)</a></li>
            <li><a href="#counting">Production Counting & Inventory Control</a></li>
            <li><a href="#maintenance">Maintenance & Issue Reporting</a></li>
            <li><a href="#training">Training & Community Use</a></li>
            <li><a href="#mobility">Mobility & Handover Protocol</a></li>
            <li><a href="#principles">Guiding Principles</a></li>
            <li><a href="#appendix">Appendix: Templates & Checklists</a></li>
          </ol>
        </nav>

        {/* 1 */}
        <section id="purpose" className="manual__section">
          <h2>1. Purpose of the Facility</h2>
          <p>
            This travelling production facility converts recycled plastic into modular tension beds designed for use in remote and
            Indigenous communities.
          </p>
          <ul>
            <li>Reduce plastic waste locally</li>
            <li>Support organic and regenerative growing practices</li>
            <li>Enable community-owned production and income</li>
            <li>Create a repeatable, teachable system that can move between locations</li>
          </ul>
          <p>
            The facility is designed to be <strong>mobile</strong>, <strong>repairable</strong>, and <strong>bolt-together</strong>
            (no glue, no welding in the final product).
          </p>
        </section>

        {/* 2 */}
        <section id="product-overview" className="manual__section">
          <h2>2. Product Overview – Tension Bed System</h2>

          <h3>2.1 What the Bed Is</h3>
          <p>
            Each finished bed uses two crossed X-frame leg assemblies, two metal tension rods, and one canvas growing surface.
            The design packs flat, assembles quickly, and is made for repair and reuse.
          </p>

          <h3>2.2 Parts per Bed (Fixed Standard)</h3>
          <p><strong>This ratio does not change.</strong> All counting and inventory is based on the recipe below.</p>

          <div className="manual__callout manual__callout--standard">
            <h4>Bed Recipe (Standard)</h4>
            <ul>
              <li><strong>8</strong> long plastic legs</li>
              <li><strong>8</strong> plastic blocks</li>
              <li><strong>2</strong> metal rods</li>
              <li><strong>1</strong> canvas top</li>
            </ul>
            <p className="manual__small">
              Geometry: <strong>1 X-frame = 4 legs + 4 blocks</strong> • <strong>1 bed = 2 X-frames</strong>
            </p>
          </div>

          <h3>2.3 Visual Parts Identification</h3>
          <p>
            Add your photos here for clarity (legs, blocks, rods, canvas, assembled bed).
          </p>
          <figure className="manual__figure">
            <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Image: X-frame legs and blocks (to be added)</p>
            </div>
            <figcaption className="text-sm text-gray-600 mt-2">Example: X-frame made from two crossed legs (add real image paths).</figcaption>
          </figure>
        </section>

        {/* 3 */}
        <section id="container-setup" className="manual__section">
          <h2>3. Mobile Container Setup & Machine Flow</h2>

          <h3>3.1 Container Overview</h3>
          <p>
            The container is a mobile, enclosed workshop that houses fixed machinery for processing plastic, forming sheets, and cutting parts.
            Bed assembly happens outside the container to keep the interior clear and safe.
          </p>

          <h3>3.2 Machine Zones (Recommended Layout)</h3>
          <ol>
            <li><strong>Zone A — Plastic Intake & Shredding</strong>: waste plastic → shredded feedstock</li>
            <li><strong>Zone B — Sheet Forming (Heat Press)</strong>: shredded plastic → solid sheets</li>
            <li><strong>Zone C — Cooling & Stabilisation</strong>: sheets rest to avoid warp</li>
            <li><strong>Zone D — CNC Cutting</strong>: sheets → legs + blocks</li>
            <li><strong>Zone E — Parts Storage & Buffer</strong>: bins for legs, blocks, and offcuts</li>
          </ol>

          <h3>3.3 External Assembly Zone</h3>
          <p>
            Assembly occurs outside the container for more space, better ergonomics, and safer machine separation.
          </p>

          <h3>3.4 Material Flow (No Backtracking Rule)</h3>
          <div className="manual__callout">
            <p><strong>Plastic moves in one direction only:</strong></p>
            <ol>
              <li>Waste plastic → shredder</li>
              <li>Shred → press</li>
              <li>Press → cool</li>
              <li>Sheet → CNC</li>
              <li>Parts → bins</li>
              <li>Parts → assembly</li>
              <li>Bed → packing / shipping</li>
            </ol>
          </div>
        </section>

        {/* 4 */}
        <section id="safety" className="manual__section">
          <h2>4. Safety Requirements (Non-Negotiable)</h2>

          <h3>4.1 Required PPE</h3>
          <ul>
            <li>Safety glasses</li>
            <li>Heat-resistant gloves (thick, extended grip)</li>
            <li>Closed-toe boots</li>
            <li>Long sleeves and pants</li>
          </ul>

          <h3>4.2 General Safety Rules</h3>
          <ul>
            <li>No loose clothing near machinery</li>
            <li>No hands near moving parts</li>
            <li>Machines off before clearing jams</li>
            <li>Hot plastic and metal: assume hot at all times</li>
            <li>Team lifts for heavy sheets</li>
            <li>Report damage immediately</li>
          </ul>

          <div className="manual__callout manual__callout--warning" role="note" aria-label="Safety note">
            <p><strong>Start-of-day safety brief</strong> is required at every new site setup and before any youth-led shift begins.</p>
          </div>
        </section>

        {/* 5 */}
        <section id="workflow" className="manual__section">
          <h2>5. Production Workflow (End-to-End)</h2>

          <article className="manual__step" id="workflow-shredder">
            <h3>Step 1: Plastic Shredding</h3>
            <p><strong>Purpose:</strong> Reduce plastic into pressable material.</p>
            <ul>
              <li>Inspect shredder before use</li>
              <li>Feed plastic gradually</li>
              <li>Stop immediately if jam occurs</li>
              <li>Power off before opening hood</li>
            </ul>
            <p><strong>Log:</strong> jams, broken parts, maintenance needed.</p>
          </article>

          <article className="manual__step" id="workflow-sheet-prep">
            <h3>Step 2: Sheet Preparation (Flip Table / Frames)</h3>
            <p><strong>Purpose:</strong> Prepare even sheet material.</p>
            <ul>
              <li>Spread shredded plastic evenly (no peaks, no gaps)</li>
              <li>Trim excess with a sharp, sturdy knife</li>
              <li>Lock frame securely</li>
            </ul>
          </article>

          <article className="manual__step" id="workflow-heat-press">
            <h3>Step 3: Heat Pressing</h3>
            <p><strong>Purpose:</strong> Form solid plastic sheets.</p>
            <div className="manual__callout manual__callout--standard">
              <p><strong>Standard settings:</strong> 190°C • 2–3 hours • ~5,000 PSI</p>
            </div>
            <ul>
              <li>Insert frame at correct angle</li>
              <li>Apply initial force with safe body position</li>
              <li>Re-jack to maintain pressure as required</li>
              <li>Do not rush the cycle</li>
            </ul>
          </article>

          <article className="manual__step" id="workflow-cooling">
            <h3>Step 4: Cooling & Stabilisation</h3>
            <p><strong>Purpose:</strong> Stabilise sheet structure and prevent warping.</p>
            <ul>
              <li>Transfer to cooling press or rack</li>
              <li><strong>Minimum cooling time:</strong> 6 hours</li>
              <li>No stacking or bending sheets early</li>
            </ul>
          </article>

          <article className="manual__step" id="workflow-cnc">
            <h3>Step 5: CNC Cutting</h3>
            <p><strong>Purpose:</strong> Cut sheets into parts.</p>
            <ul>
              <li>Confirm correct templates loaded</li>
              <li>Secure sheet before cutting (clamps / hold-down)</li>
              <li>Stay clear during operation</li>
              <li>Use dust extraction when routing/cutting</li>
            </ul>
            <p><strong>Parts cut:</strong> long legs and blocks.</p>
          </article>

          <article className="manual__step" id="workflow-finishing">
            <h3>Step 6: Edge Finishing</h3>
            <p><strong>Purpose:</strong> Safety and durability.</p>
            <ul>
              <li>Route or sand all edges</li>
              <li>Remove sharp corners</li>
              <li>Inspect holes and joins</li>
            </ul>
            <p><strong>Rule:</strong> No unfinished parts move to assembly.</p>
          </article>

          <article className="manual__step" id="workflow-assembly">
            <h3>Step 7: Bed Assembly</h3>

            <h4>X-Frame Assembly</h4>
            <ul>
              <li><strong>1 X-frame = 4 legs + 4 blocks</strong></li>
              <li>Bolt securely</li>
              <li>Check alignment and wobble</li>
            </ul>

            <h4>Final Bed Assembly</h4>
            <ul>
              <li><strong>1 bed = 2 X-frames</strong></li>
              <li>Insert 2 rods</li>
              <li>Tension canvas</li>
              <li>Inspect for wobble or slack</li>
            </ul>
          </article>
        </section>

        {/* 6 */}
        <section id="counting" className="manual__section">
          <h2>6. Production Counting & Inventory Control</h2>

          <div className="manual__callout manual__callout--standard">
            <h3>Counting Rule (Put This on the Wall)</h3>
            <p><strong>Beds possible = MIN(legs ÷ 8, blocks ÷ 8, rods ÷ 2, canvas ÷ 1)</strong></p>
          </div>

          <h3>End-of-Shift Log (Required)</h3>
          <table className="manual__table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Sheets made today</td><td>___</td></tr>
              <tr><td>Legs available</td><td>___</td></tr>
              <tr><td>Blocks available</td><td>___</td></tr>
              <tr><td>Rods available</td><td>___</td></tr>
              <tr><td>Canvas available</td><td>___</td></tr>
              <tr><td>Beds assembled today</td><td>___</td></tr>
              <tr><td>Beds possible (stock)</td><td>___</td></tr>
            </tbody>
          </table>
        </section>

        {/* 7 */}
        <section id="maintenance" className="manual__section">
          <h2>7. Maintenance & Issue Reporting</h2>
          <p>Each shift must record:</p>
          <ul>
            <li>Machine faults</li>
            <li>Broken tools</li>
            <li>Damaged sheets</li>
            <li>Parts failures</li>
            <li>Suggested improvements</li>
          </ul>
          <p><strong>This log travels with the facility.</strong></p>
        </section>

        {/* 8 */}
        <section id="training" className="manual__section">
          <h2>8. Training & Community Use</h2>
          <p>This facility is designed so that:</p>
          <ul>
            <li>New operators can learn by watching once</li>
            <li>Skills increase through repetition</li>
            <li>Knowledge stays in community</li>
          </ul>

          <h3>Recommended Training Approach</h3>
          <ol>
            <li>Observe full workflow</li>
            <li>Assist one station</li>
            <li>Run one station</li>
            <li>Lead one full cycle</li>
          </ol>

          <div className="manual__callout manual__callout--warning">
            <p><strong>No step is skipped.</strong> Safety and quality checks are mandatory.</p>
          </div>
        </section>

        {/* 9 */}
        <section id="mobility" className="manual__section">
          <h2>9. Mobility & Handover Protocol</h2>
          <p>When relocating the facility:</p>
          <ul>
            <li>Complete final inventory count</li>
            <li>Pack machines in order of setup</li>
            <li>Secure all tools and templates</li>
            <li>Transfer logs to next site</li>
            <li>Brief incoming operators</li>
          </ul>
          <p>The system must arrive <strong>ready to run</strong>, not re-invented.</p>
        </section>

        {/* 10 */}
        <section id="principles" className="manual__section">
          <h2>10. Guiding Principles</h2>
          <ul>
            <li>Build locally</li>
            <li>Teach openly</li>
            <li>Repair instead of replace</li>
            <li>Design for reuse</li>
            <li>Keep the system simple and accountable</li>
          </ul>
        </section>

        {/* Appendix */}
        <section id="appendix" className="manual__section">
          <h2>Appendix: Templates & Checklists</h2>

          <h3>A. Daily Start Checklist</h3>
          <ul className="manual__checklist">
            <li><label><input type="checkbox" /> PPE available and worn</label></li>
            <li><label><input type="checkbox" /> Safety brief completed</label></li>
            <li><label><input type="checkbox" /> Tools present (knives, spanners, bits)</label></li>
            <li><label><input type="checkbox" /> Emergency stop tested (CNC + press)</label></li>
            <li><label><input type="checkbox" /> Shredder inspected (clear + ready)</label></li>
            <li><label><input type="checkbox" /> Press area clear (no obstructions)</label></li>
            <li><label><input type="checkbox" /> Cooling area ready</label></li>
          </ul>

          <h3>B. End-of-Shift Checklist</h3>
          <ul className="manual__checklist">
            <li><label><input type="checkbox" /> Machines powered down safely</label></li>
            <li><label><input type="checkbox" /> Offcuts returned to shred bin</label></li>
            <li><label><input type="checkbox" /> Inventory counts recorded</label></li>
            <li><label><input type="checkbox" /> Issues logged (faults, repairs, ideas)</label></li>
            <li><label><input type="checkbox" /> Workspace cleaned and cleared</label></li>
          </ul>
        </section>

        <footer className="manual__footer">
          <p>
            <strong>Document control:</strong> Keep version history when updating. This manual is designed to travel with the facility and be
            usable offline (print-friendly).
          </p>
          <div className="mt-4">
            <Link href="/wiki" className="text-green-600 hover:text-green-700">
              ← Back to Wiki Homepage
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
