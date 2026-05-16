import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Plant safety briefing | Goods Wiki',
  description:
    'PPE, machine hazards, hot-press protocol, first-aid, emergency contacts for the Alice Springs plastic-recycling and bed-manufacturing plant.',
};

export default function SafetyBriefingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-br from-red-50 to-orange-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/wiki"
            className="text-red-700 hover:text-red-800 text-sm font-medium mb-4 inline-block"
          >
            &larr; Back to Wiki
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Plant safety briefing</h1>
          <p className="text-lg text-gray-600">
            What new operators read before stepping onto the production floor. Hazards, PPE,
            emergency response, daily checks.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg max-w-none">
        <div className="not-prose rounded-2xl border-2 border-red-300 bg-red-50 p-4 mb-8">
          <p className="font-bold text-red-900">
            🚨 Read this before your first shift. Sign at the bottom of /admin/production after.
          </p>
          <p className="text-sm text-red-800 mt-1">
            Plant safety is not a one-time thing. Re-read after any incident, any new equipment,
            any new operator.
          </p>
        </div>

        <h2>Personal Protective Equipment (PPE)</h2>
        <h3>Always on the floor</h3>
        <ul>
          <li>
            <strong>Closed-toe boots.</strong> No thongs, no runners. Steel cap preferred near the
            press and shredder.
          </li>
          <li>
            <strong>Long pants.</strong> Not shorts. Hot plastic flicks.
          </li>
          <li>
            <strong>Safety glasses.</strong> Wraparound style. Mandatory near the shredder and
            press at all times.
          </li>
          <li>
            <strong>Hearing protection.</strong> Earmuffs near the shredder when it&apos;s running.
            Conversation-level is too loud — if you have to raise your voice, plugs aren&apos;t
            enough.
          </li>
          <li>
            <strong>Heat-resistant gloves.</strong> When loading the press, unloading sheets,
            handling cooling material. Cotton or leather, not synthetic (melts to skin).
          </li>
        </ul>

        <h3>Don&apos;t wear</h3>
        <ul>
          <li>Loose sleeves, ties, dangling jewellery — anything that can catch in the shredder.</li>
          <li>Long hair untied — pull it back.</li>
          <li>Headphones in both ears — you need to hear the room.</li>
          <li>Phone in hand near the press or shredder.</li>
        </ul>

        <h2>Hazards by station</h2>

        <h3>Plastic shredder</h3>
        <ul>
          <li>
            <strong>Never reach in.</strong> If material jams, power off at the wall switch, wait
            until rotors stop, then clear with a tool. Hands are not a tool.
          </li>
          <li>
            <strong>Watch for material kickback.</strong> Hard pieces (caps, hinges) can fly. Stand
            to the side of the input chute, not over it.
          </li>
          <li>
            <strong>Sort first.</strong> Metal contamination (a stray screw, a coin) wrecks the
            blades and can spark. Hand-sort the input bin every batch.
          </li>
          <li>
            <strong>Don&apos;t shred wet plastic.</strong> Water flashes to steam, creates pressure.
            Dry input only.
          </li>
        </ul>

        <h3>Heat press</h3>
        <ul>
          <li>
            <strong>Operating temp:</strong> 180-200°C plate temperature, 30-45 min cycle. Plate is
            hot for hours after shutdown. Treat as live until you can put your hand 30cm from it
            without feeling heat.
          </li>
          <li>
            <strong>Never open mid-cycle.</strong> Steam release + pressure release can both burn.
          </li>
          <li>
            <strong>Two-person unload.</strong> Cooked sheets are heavy and floppy until cooled.
            One person opens, one person guides the sheet out flat onto the cooling rack.
          </li>
          <li>
            <strong>Cooling rack is &apos;hot zone&apos;.</strong> Don&apos;t lean on it, don&apos;t
            put cardboard on it, don&apos;t place hands near sheet edges for 20 minutes after
            pressing.
          </li>
        </ul>

        <h3>CNC router (legs)</h3>
        <ul>
          <li>
            <strong>Eye protection mandatory.</strong> Plastic chips kick out from the bit.
          </li>
          <li>
            <strong>Hold-down before cut.</strong> Sheet shifts under cut = bit shatters, parts
            fly.
          </li>
          <li>
            <strong>Dust extraction on.</strong> HDPE dust is irritant. Run the extractor
            continuously when the router is on.
          </li>
          <li>
            <strong>Bit changes only with power off.</strong> Spindle locked.
          </li>
        </ul>

        <h3>Assembly bench</h3>
        <ul>
          <li>
            <strong>Pole ends can be sharp.</strong> Inspect each pole before threading through
            canvas. File burrs.
          </li>
          <li>
            <strong>Heavy-duty canvas needles.</strong> If repairing canvas, thimble + leather
            palm pad. No bare-hand sewing.
          </li>
          <li>
            <strong>Lift with legs, not back.</strong> A finished bed is 26kg + the steel
            poles are awkward.
          </li>
        </ul>

        <h2>Daily checks before starting</h2>
        <ol>
          <li>Walk the floor. Look for trip hazards: loose plastic, water spills, trailing leads.</li>
          <li>Power off → on for each machine. Listen for unusual sounds, smell for burning.</li>
          <li>First-aid kit accessible + stocked. Replace anything used yesterday.</li>
          <li>Fire extinguisher visible, undamaged, in date.</li>
          <li>Phone signal works at the press station (for emergency calls).</li>
          <li>Two people on site minimum if the press is running.</li>
        </ol>

        <h2>If something goes wrong</h2>

        <h3>Minor burns</h3>
        <ul>
          <li>Cool running water for 20 minutes. Not ice, not butter, not toothpaste.</li>
          <li>If skin is intact, dress with cling film loosely.</li>
          <li>
            If blistered or larger than a 20¢ coin, see a doctor. In Alice that&apos;s Alice
            Springs Hospital ED.
          </li>
        </ul>

        <h3>Cuts</h3>
        <ul>
          <li>Pressure + elevate. Clean with bottled water if you can.</li>
          <li>If deep or jagged or won&apos;t stop, doctor. Tetanus shot up to date.</li>
        </ul>

        <h3>Eye injury</h3>
        <ul>
          <li>Don&apos;t rub. Eyewash station at the press. 15 minutes of flushing minimum.</li>
          <li>Anything more than a chip you couldn&apos;t flush out: doctor immediately.</li>
        </ul>

        <h3>Fire</h3>
        <ul>
          <li>Press fire: kill power at wall. CO₂ extinguisher (red label) onto base of flames.</li>
          <li>Plastic fire: don&apos;t breathe the smoke. Move away upwind. Call 000.</li>
          <li>Shredder fire (usually a stuck metal contaminant): power off, CO₂, then visual inspect.</li>
          <li>If unsure, leave and call 000. The plant insurance is fine. People aren&apos;t replaceable.</li>
        </ul>

        <h3>Machinery jam, person hurt</h3>
        <p>
          Stop the machine at the wall switch. Don&apos;t move the person unless they&apos;re in
          ongoing danger. Call 000. Have the address ready:{' '}
          <strong>Goods on Country plant — Alice Springs</strong> (update with exact address when
          available).
        </p>

        <h2>Emergency contacts</h2>
        <ul>
          <li>
            <strong>Ambulance / Fire / Police:</strong> 000
          </li>
          <li>
            <strong>Alice Springs Hospital ED:</strong> (08) 8951 7777
          </li>
          <li>
            <strong>Goods on Country support:</strong> +61 468 052 660 (text or WhatsApp)
          </li>
          <li>
            <strong>Plant manager (current):</strong> TBD — fill in when assigned per shift
          </li>
          <li>
            <strong>Workplace Health and Safety NT:</strong> 1800 019 115 (notifiable incidents)
          </li>
        </ul>

        <h2>After an incident — even minor</h2>
        <ol>
          <li>
            Log it in{' '}
            <Link href="/admin/production" className="text-red-700 underline">
              /admin/production
            </Link>
            &apos;s journal. Date, what happened, what you did, what could prevent it next time.
          </li>
          <li>Tell Ben or Nic same day. Don&apos;t wait for the report.</li>
          <li>
            If notifiable (serious injury, fire, anything that needed 000): Worksafe NT within 24
            hours.
          </li>
          <li>Review this page. If the briefing didn&apos;t cover what happened, edit it.</li>
        </ol>

        <hr />
        <p className="text-sm text-gray-500">
          Last reviewed: 2026-05-16. Re-read after any plant change. Sign-off goes in the
          production journal once you&apos;ve read it.
        </p>
      </div>
    </div>
  );
}
