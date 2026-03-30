'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ThroughputPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
      <div className="mb-4">
        <Link href="/wiki" className="text-sm text-green-600 hover:text-green-700">← Back to Wiki</Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
        How Throughput Works
      </h1>
      <p className="text-lg text-stone-500 mt-2 mb-8">
        The one number that drives every cost, margin, and capacity decision.
      </p>

      <figure className="my-8">
        <div className="relative overflow-hidden rounded-xl">
          <Image src="/images/process/factory-panorama.jpg" alt="The full production facility" width={2975} height={1343} className="w-full h-auto" />
        </div>
        <figcaption className="text-sm text-stone-500 mt-2 italic">The production line. Every station runs in parallel, not in sequence.</figcaption>
      </figure>

      <div className="prose prose-stone max-w-none">
        <h2 style={{ fontFamily: 'Georgia, serif' }}>What is throughput?</h2>
        <p className="text-lg">
          Throughput is the answer to one question: <strong>if Joey shows up at 7am and leaves at 3pm, how many finished beds are sitting in the shed at the end of the day?</strong>
        </p>
        <p>The answer right now is <strong>5 beds per day</strong>. Here's why that number matters so much.</p>
      </div>

      {/* THE WRONG WAY */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 my-8">
        <h2 className="text-xl font-bold text-red-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>The wrong way to think about it</h2>
        <p className="text-red-900 mb-4">Imagine timing Joey making ONE bed from scratch, doing nothing else:</p>
        <ol className="space-y-2 text-red-900">
          <li>1. Shred plastic (30 min)</li>
          <li>2. Fill frame and press sheet 1 (2 hours)</li>
          <li>3. Fill frame and press sheet 2 (2 hours)</li>
          <li>4. CNC cut both sheets (45 min)</li>
          <li>5. Edge finish all parts (30 min)</li>
          <li>6. Pre-drill (15 min)</li>
          <li>7. Assemble the bed (30 min)</li>
        </ol>
        <div className="mt-4 p-4 bg-red-100 rounded-lg">
          <p className="font-bold text-red-800">Total: ~6.5 hours = $325 labour per bed</p>
          <p className="text-sm text-red-700 mt-1">At $600 retail, that's a $35 margin. Barely worth it.</p>
        </div>
        <p className="text-red-800 font-semibold mt-4">But nobody works like this.</p>
      </div>

      {/* THE RIGHT WAY */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 my-8">
        <h2 className="text-xl font-bold text-green-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>The right way: what Joey actually does</h2>
        <p className="text-green-900 mb-6">The press and CNC are robots. They work while Joey works on something else. His day is a rotation between stations, always keeping every machine busy.</p>

        <div className="space-y-4">
          {[
            { time: '7:00am', action: 'Arrives. Yesterday\'s sheets are cooled and ready. Loads Sheet A onto CNC, hits start. CNC runs on its own.', station: 'CNC' },
            { time: '7:10am', action: 'While CNC runs, fills a steel frame with shredded plastic and loads the heat press. Press starts its 90-min cycle.', station: 'Press' },
            { time: '7:25am', action: 'Takes yesterday\'s CNC-cut parts and starts edge finishing on the bull nose router. Hands-on work.', station: 'Edge' },
            { time: '8:00am', action: 'Edge finishing done for one bed. Pre-drills the holes using the jig.', station: 'Drill' },
            { time: '8:20am', action: 'Assembles Bed #1 in the shed. Screws sides together, threads poles through canvas.', station: 'Assembly' },
            { time: '8:50am', action: 'Bed #1 done. CNC has finished Sheet A. Unloads, loads Sheet B, starts again.', station: 'CNC' },
            { time: '9:00am', action: 'Press nearly done. Starts edge finishing parts from Sheet A.', station: 'Edge' },
            { time: '9:30am', action: 'Press finishes. Slides hot sheet out (pizza paddle), loads new frame, restarts. Back to edge work.', station: 'Press' },
          ].map((entry, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-16 text-right">
                <span className="text-sm font-mono font-bold text-green-700">{entry.time}</span>
              </div>
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div className="flex-1">
                <p className="text-green-900">{entry.action}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-16 text-right">
              <span className="text-sm font-mono font-bold text-green-700">3:00pm</span>
            </div>
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2" />
            <div className="flex-1">
              <p className="text-green-900 font-bold">5 finished beds, 2 sheets cooling for tomorrow, CNC queue clear. Day done.</p>
            </div>
          </div>
        </div>
      </div>

      {/* KEY PHOTOS */}
      <div className="grid grid-cols-2 gap-4 my-8">
        <figure>
          <div className="relative overflow-hidden rounded-xl">
            <Image src="/images/process/heat-press-full.jpg" alt="Heat press running unattended" width={800} height={533} className="w-full h-auto" />
          </div>
          <figcaption className="text-sm text-stone-500 mt-2 italic">The press runs for 90 minutes on its own. Joey works other stations.</figcaption>
        </figure>
        <figure>
          <div className="relative overflow-hidden rounded-xl">
            <Image src="/images/process/cnc-router-full.jpg" alt="CNC router running unattended" width={800} height={533} className="w-full h-auto" />
          </div>
          <figcaption className="text-sm text-stone-500 mt-2 italic">CNC cuts a full sheet in ~45 minutes. No operator needed once started.</figcaption>
        </figure>
        <figure>
          <div className="relative overflow-hidden rounded-xl">
            <Image src="/images/process/bull-nose-router.jpg" alt="Bull nose router for edge finishing" width={800} height={533} className="w-full h-auto" />
          </div>
          <figcaption className="text-sm text-stone-500 mt-2 italic">Edge finishing. This is hands-on. Joey does this while machines run.</figcaption>
        </figure>
        <figure>
          <div className="relative overflow-hidden rounded-xl">
            <Image src="/images/process/parts-rack-sorted.jpg" alt="Finished parts on rack ready for assembly" width={800} height={533} className="w-full h-auto" />
          </div>
          <figcaption className="text-sm text-stone-500 mt-2 italic">Finished parts sorted on the rack. Buffer stock keeps assembly moving.</figcaption>
        </figure>
      </div>

      {/* WHY IT CHANGES COST */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 my-8 shadow-sm">
        <h2 className="text-xl font-bold text-stone-800 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Why this changes the cost per bed</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-xl p-5 text-center">
            <p className="text-xs text-red-500 uppercase font-semibold">Sequential Model</p>
            <p className="text-sm text-red-700 mt-2">"Each bed takes 6.5 hours"</p>
            <p className="text-3xl font-bold text-red-700 mt-2">$325</p>
            <p className="text-xs text-red-500 mt-1">labour per bed</p>
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-sm text-red-600">$565 total cost</p>
              <p className="text-sm font-bold text-red-700">6% margin</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-5 text-center">
            <p className="text-xs text-green-500 uppercase font-semibold">Throughput Model</p>
            <p className="text-sm text-green-700 mt-2">"Joey makes 5 beds in 8 hours"</p>
            <p className="text-3xl font-bold text-green-700 mt-2">$80</p>
            <p className="text-xs text-green-500 mt-1">labour per bed</p>
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-sm text-green-600">$232 total cost</p>
              <p className="text-sm font-bold text-green-700">61% margin</p>
            </div>
          </div>
        </div>
        <p className="text-stone-600 mt-4 text-center">Same person. Same pay. Same day. The difference is how you count.</p>
      </div>

      {/* BOTTLENECK MAP */}
      <h2 className="text-2xl font-bold text-stone-800 mt-12 mb-6" style={{ fontFamily: 'Georgia, serif' }}>The Bottleneck Map</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-stone-50 text-left">
              <th className="border border-stone-200 p-3">Station</th>
              <th className="border border-stone-200 p-3">Time per cycle</th>
              <th className="border border-stone-200 p-3">Runs unattended?</th>
              <th className="border border-stone-200 p-3">Bottleneck?</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Shredder', 'Ongoing', 'No', false],
              ['Heat Press', '90 min/sheet', 'Yes', true],
              ['CNC Router', '~45 min/sheet', 'Yes', false],
              ['Edge Finishing', '~30 min/bed', 'No', false],
              ['Pre-drilling', '~15 min/bed', 'No', false],
              ['Assembly', '~30 min/bed', 'No', false],
            ].map(([station, time, unattended, bottleneck]) => (
              <tr key={station as string} className={bottleneck ? 'bg-amber-50' : ''}>
                <td className="border border-stone-200 p-3 font-medium">{station}</td>
                <td className="border border-stone-200 p-3">{time}</td>
                <td className="border border-stone-200 p-3">{unattended}</td>
                <td className="border border-stone-200 p-3">
                  {bottleneck
                    ? <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded text-xs font-bold">YES</span>
                    : <span className="text-stone-400">No</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
        <p className="text-amber-900">
          <strong>The press is the bottleneck.</strong> It can do 6 sheets per day. Each bed needs 2 sheets. So the theoretical max from one press is 3 beds/day of new material. Joey hits 5 because he builds from a rolling buffer of pre-pressed sheets and pre-cut parts.
        </p>
      </div>

      <figure className="my-8">
        <div className="relative overflow-hidden rounded-xl">
          <Image src="/images/process/heat-press-detail.jpg" alt="Heat press platens close-up" width={800} height={533} className="w-full h-auto" />
        </div>
        <figcaption className="text-sm text-stone-500 mt-2 italic">The press platens. 90 minutes per sheet, 6 sheets per day max. This is what sets the pace.</figcaption>
      </figure>

      {/* CASE STUDIES */}
      <h2 className="text-2xl font-bold text-stone-800 mt-12 mb-6" style={{ fontFamily: 'Georgia, serif' }}>What Changes When Throughput Changes</h2>

      <div className="space-y-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-2">Joey gets faster (6 beds/day)</h3>
          <p className="text-stone-600 mb-3">He's been at it 7 weeks. As he gets more efficient at station rotation:</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-stone-50 rounded-lg p-3">
              <p className="text-xs text-stone-500">Labour/bed</p>
              <p className="text-lg font-bold">$67</p>
              <p className="text-xs text-green-600">was $80</p>
            </div>
            <div className="bg-stone-50 rounded-lg p-3">
              <p className="text-xs text-stone-500">Weekly output</p>
              <p className="text-lg font-bold">30 beds</p>
              <p className="text-xs text-green-600">was 25</p>
            </div>
            <div className="bg-stone-50 rounded-lg p-3">
              <p className="text-xs text-stone-500">Monthly profit</p>
              <p className="text-lg font-bold">+$1,800</p>
              <p className="text-xs text-green-600">extra</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-stone-800 mb-2">Add a second operator</h3>
          <p className="text-stone-600 mb-3">One person runs press + shredder. The other runs CNC + finishing + assembly.</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-stone-50 rounded-lg p-3">
              <p className="text-xs text-stone-500">Daily cost</p>
              <p className="text-lg font-bold">$800</p>
              <p className="text-xs text-stone-400">2 operators</p>
            </div>
            <div className="bg-stone-50 rounded-lg p-3">
              <p className="text-xs text-stone-500">Throughput</p>
              <p className="text-lg font-bold">8-9/day</p>
              <p className="text-xs text-stone-400">press still the limit</p>
            </div>
            <div className="bg-stone-50 rounded-lg p-3">
              <p className="text-xs text-stone-500">Labour/bed</p>
              <p className="text-lg font-bold">$100</p>
              <p className="text-xs text-amber-600">higher, but 60% more output</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
          <h3 className="font-bold text-purple-800 mb-2">Community takes over</h3>
          <p className="text-purple-900 mb-3">The facility runs with CDP participants or volunteers. Plastic is collected locally for free.</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <p className="text-xs text-purple-600">Cost/bed</p>
              <p className="text-lg font-bold text-purple-800">$39</p>
              <p className="text-xs text-purple-500">diesel + hardware only</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <p className="text-xs text-purple-600">Margin @ $560</p>
              <p className="text-lg font-bold text-purple-800">$521</p>
              <p className="text-xs text-purple-500">93%</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <p className="text-xs text-purple-600">That margin goes to</p>
              <p className="text-lg font-bold text-purple-800">Community</p>
              <p className="text-xs text-purple-500">their enterprise</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="font-bold text-amber-800 mb-2">Buying Defy kits while setting up a new site</h3>
          <p className="text-amber-900 mb-3">Containers aren't there yet but families need beds now.</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-amber-100 rounded-lg p-3">
              <p className="text-xs text-amber-600">Kit cost</p>
              <p className="text-lg font-bold text-amber-800">$393</p>
              <p className="text-xs text-amber-500">buy + assemble</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3">
              <p className="text-xs text-amber-600">Throughput</p>
              <p className="text-lg font-bold text-amber-800">10/day</p>
              <p className="text-xs text-amber-500">assembly only</p>
            </div>
            <div className="bg-amber-100 rounded-lg p-3">
              <p className="text-xs text-amber-600">Lead time</p>
              <p className="text-lg font-bold text-amber-800">8 weeks</p>
              <p className="text-xs text-amber-500">from order</p>
            </div>
          </div>
        </div>
      </div>

      {/* THE ONE NUMBER */}
      <div className="bg-green-700 text-white rounded-2xl p-6 sm:p-8 my-8 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>The One Number That Matters</h2>
        <p className="text-green-100 text-lg mb-6">Every morning, the question is:</p>
        <p className="text-3xl font-bold mb-6">"How many beds will be finished today?"</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="bg-green-800 rounded-lg p-3">
            <p className="text-green-300 text-xs">Revenue</p>
            <p className="font-semibold">beds x price</p>
          </div>
          <div className="bg-green-800 rounded-lg p-3">
            <p className="text-green-300 text-xs">Labour cost/bed</p>
            <p className="font-semibold">daily wage / beds</p>
          </div>
          <div className="bg-green-800 rounded-lg p-3">
            <p className="text-green-300 text-xs">Weekly capacity</p>
            <p className="font-semibold">beds x 5 days</p>
          </div>
          <div className="bg-green-800 rounded-lg p-3">
            <p className="text-green-300 text-xs">Order fulfilment</p>
            <p className="font-semibold">order / beds per day</p>
          </div>
        </div>
        <p className="text-green-200 mt-6">When Joey says "I did 5 today", that single number tells you your margins, your costs, and your capacity.</p>
      </div>

      <figure className="my-8">
        <div className="relative overflow-hidden rounded-xl">
          <Image src="/images/process/joey-portrait.jpg" alt="Joey at the production facility" width={800} height={533} className="w-full h-auto" />
        </div>
        <figcaption className="text-sm text-stone-500 mt-2 italic">Joey. 5 beds a day. That's the number.</figcaption>
      </figure>

      {/* LINKS */}
      <div className="border-t border-stone-200 pt-6 mt-12 flex flex-wrap gap-3">
        <Link href="/wiki/manufacturing/facility-manual" className="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm">
          Facility Manual
        </Link>
        <Link href="/admin/economics" className="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm">
          Economics Dashboard
        </Link>
        <Link href="/production" className="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm">
          Shift Log
        </Link>
        <Link href="/wiki" className="text-green-600 hover:text-green-700 px-4 py-2 text-sm">
          ← Back to Wiki
        </Link>
      </div>
    </div>
  );
}
