import Link from 'next/link';
import Image from 'next/image';
import { canonValue } from '@/lib/data/canon';

export const dynamic = 'force-dynamic';

/**
 * Production Facility Overview — the one page that tells the whole plant story:
 * how it works, what it costs, how staff run it, what it puts out.
 * Assembled from verified sources only:
 * - Process + ops: v2/docs/PRODUCTION_FACILITY_GUIDE.md (from the 5 Feb 2026 walkthrough)
 * - Money: canon.ts engine-locked figures
 * - Media: v2/public/images/process + /video (all on-disk, no placeholders)
 * Gated under /admin until Ben approves promotion to a public route.
 */

const PROCESS_STEPS: { step: string; detail: string; img: string; alt: string }[] = [
  {
    step: 'Collect & sort',
    detail: 'Community plastic waste: HDPE (#2) and PP (#5) only. PVC is never processed. ~21kg input per bed.',
    img: '/images/process/01-source.jpg',
    alt: 'Sorted plastic feedstock',
  },
  {
    step: 'Shred',
    detail: 'Zerma granulator in the 20ft container grinds waste into uniform flakes, stored in weighed, labelled tubs.',
    img: '/images/process/shredder-granulator.jpg',
    alt: 'Zerma granulator shredding plastic',
  },
  {
    step: 'Weigh & fill',
    detail: '15kg of flakes spread evenly across a metal tray. Even distribution is the single biggest factor in sheet quality.',
    img: '/images/process/shredded-chips-weighed.jpg',
    alt: 'Weighing shredded plastic flakes',
  },
  {
    step: 'Heat & press',
    detail: 'The heat press melts flakes at 180°C over 2-4 hours, then 5000 PSI compresses the melt to sheet thickness.',
    img: '/images/process/heat-press-full.jpg',
    alt: 'Heat press melting plastic sheets',
  },
  {
    step: 'Cool',
    detail: 'Sheets cool under light pressure in the cooling press, four at a time, ideally overnight.',
    img: '/images/process/pressed-sheets-stacked.jpg',
    alt: 'Pressed recycled plastic sheets stacked',
  },
  {
    step: 'CNC cut',
    detail: 'The CNC router cuts each sheet into the flat-pack parts for one bed, 3-5 hours per sheet.',
    img: '/images/process/cnc-cutting-closeup.jpg',
    alt: 'CNC router cutting bed parts',
  },
  {
    step: 'Edge & finish',
    detail: 'Every cut edge is routed smooth and checked by hand. No sharp corners, no burrs.',
    img: '/images/process/bull-nose-router.jpg',
    alt: 'Edge finishing with bull-nose router',
  },
  {
    step: 'Assemble',
    detail: 'X-trestle legs, two galvanised steel poles, structural canvas. No glue, no nails, no tools. 200kg load test.',
    img: '/images/process/04-build.jpg',
    alt: 'Assembling a Stretch Bed',
  },
];

const EQUIPMENT: { name: string; where: string; job: string }[] = [
  { name: 'Zerma granulator', where: '20ft container', job: 'Grinds plastic waste into uniform flakes' },
  { name: 'Heat press', where: '40ft container', job: 'Melts flakes at 180°C into sheets' },
  { name: 'Hydraulic press (5000 PSI)', where: '40ft container', job: 'Compresses melted sheets to thickness' },
  { name: 'Cooling press', where: '40ft container', job: 'Cools 4 sheets at a time under pressure' },
  { name: 'CNC router', where: '40ft container', job: 'Cuts sheets into flat-pack bed parts' },
  { name: 'Edge router + dust extractor', where: '40ft container', job: 'Finishing and dust capture' },
  { name: 'Diesel generator (DG23000SE3)', where: 'Between containers', job: 'Powers one machine at a time' },
];

export default function FacilityOverview() {
  const marginalBuykit = canonValue('marginal-buykit');
  const marginalFactory = canonValue('marginal-factory');

  return (
    <div className="px-4 md:px-8 py-6 space-y-8 max-w-6xl mx-auto">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/admin" className="hover:underline">Investor wiki</Link>
        <span className="mx-1">/</span>
        <span>Production facility</span>
      </nav>

      {/* Hero */}
      <header className="relative rounded-3xl overflow-hidden">
        <Image
          src="/images/process/factory-panorama.jpg"
          alt="The on-Country production facility: two shipping containers and the press line"
          width={1600}
          height={700}
          className="w-full h-72 md:h-96 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-6 md:p-8 text-white">
          <h1 className="font-display text-3xl md:text-4xl font-bold">The production facility</h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base text-white/85">
            Two shipping containers, a generator, and a press line that turns community plastic waste
            into beds. Built to be transportable, and built so community can own and run it.
          </p>
        </div>
      </header>

      {/* The one move — money */}
      <section className="rounded-2xl border bg-card shadow-sm p-6">
        <h2 className="font-display text-xl font-bold">The one move</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
          A finished recycled-plastic leg kit bought from a city factory costs $344 against about $40
          of raw shredded plastic: an 8.6× markup <span className="font-semibold">(verified, BOM)</span>.
          Pressing legs in-house saves $194 per bed. That is the whole capital case for the plant.
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border p-4">
            <div className="font-display text-2xl font-bold tabular-nums">${String(marginalBuykit)}</div>
            <div className="text-[11px] text-muted-foreground mt-1">marginal cost per bed today, bought-in kit · verified</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-display text-2xl font-bold tabular-nums text-emerald-700">${String(marginalFactory)}</div>
            <div className="text-[11px] text-muted-foreground mt-1">per bed pressing our own legs · verified, engine-locked</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-display text-2xl font-bold tabular-nums">$110,046</div>
            <div className="text-[11px] text-muted-foreground mt-1">press capex already invested · verified</div>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-display text-2xl font-bold tabular-nums">338</div>
            <div className="text-[11px] text-muted-foreground mt-1">annual break-even in beds once pressing in-house (from 1,679) · modelled</div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Full model: <Link href="/admin/cost-model" className="underline">Cost model workspace</Link> ·
          wiki/investor/02-financial-model.md
        </p>
      </section>

      {/* Watch it work */}
      <section>
        <h2 className="font-display text-xl font-bold mb-3">Watch it work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <figure className="rounded-2xl overflow-hidden border">
            <video controls preload="none" poster="/images/process/facility-full-site.jpg" className="w-full aspect-video object-cover">
              <source src="/video/recycling-plant-desktop.mp4" type="video/mp4" />
            </video>
            <figcaption className="p-3 text-xs text-muted-foreground">The plant running: shred, press, sheets</figcaption>
          </figure>
          <figure className="rounded-2xl overflow-hidden border">
            <video controls preload="none" className="w-full aspect-video object-cover">
              <source src="/video/partners/oonchiumpa/mykel-building-the-bed.mp4" type="video/mp4" />
            </video>
            <figcaption className="p-3 text-xs text-muted-foreground">Mykel building the bed (cleared)</figcaption>
          </figure>
          <figure className="rounded-2xl overflow-hidden border">
            <video controls preload="none" className="w-full aspect-video object-cover">
              <source src="/video/stretch-bed/assembly.mp4" type="video/mp4" />
            </video>
            <figcaption className="p-3 text-xs text-muted-foreground">Flat-pack assembly, no tools, ~5 minutes</figcaption>
          </figure>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Full facility walkthrough (5 Feb 2026):{' '}
          <a href="https://share.descript.com/embed/QRzMJxd1Jo3" className="underline" target="_blank" rel="noreferrer">
            Descript recording
          </a>{' '}
          — external embed only; local copy not yet in the repo (gap).
        </p>
      </section>

      {/* How it works — 8 steps with photos */}
      <section>
        <h2 className="font-display text-xl font-bold mb-1">How it works</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Each Stretch Bed takes about 15kg of recycled HDPE/PP (21kg input including offcuts).
        </p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.step} className="rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col">
              <Image src={s.img} alt={s.alt} width={600} height={400} className="w-full h-36 object-cover" />
              <div className="p-4 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-sm text-stone-400">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-semibold text-sm">{s.step}</h3>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Facility + equipment */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="rounded-2xl border bg-card shadow-sm p-5">
          <h2 className="font-display text-lg font-bold">The site</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            A 20ft container (granulator, flake storage) and a 40ft container (prep table, heat press,
            cool press, CNC, finishing), with the diesel generator between them. It powers one machine
            at a time: shred or press, never both. The whole facility is designed to move between
            communities, and to transfer to community ownership — that transfer is the pathway, not
            yet done.
          </p>
          <table className="mt-4 w-full text-sm">
            <tbody className="divide-y">
              {EQUIPMENT.map((e) => (
                <tr key={e.name}>
                  <td className="py-2 pr-3 font-semibold whitespace-nowrap">{e.name}</td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground whitespace-nowrap">{e.where}</td>
                  <td className="py-2 text-xs text-muted-foreground">{e.job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border bg-card shadow-sm p-5">
            <h2 className="font-display text-lg font-bold">How a shift runs</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li><span className="font-semibold text-foreground">Start:</span> read handover, walk the site, check diesel and PPE, set the day&apos;s target.</li>
              <li><span className="font-semibold text-foreground">During:</span> log sheets started and completed, photograph finished sheets, track diesel.</li>
              <li><span className="font-semibold text-foreground">End:</span> power down, lock both containers, write handover notes for the next shift.</li>
              <li><span className="font-semibold text-foreground">Safety:</span> no lone working on hot processes, ventilation always on, HDPE/PP only, never PVC.</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Shift logging is live at <Link href="/production" className="underline">/production</Link> — glove-friendly,
              works offline. Full manual: <Link href="/wiki/manufacturing/facility-manual" className="underline">facility manual</Link>.
            </p>
          </div>
          <div className="rounded-2xl border bg-card shadow-sm p-5">
            <h2 className="font-display text-lg font-bold">Output</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>One sheet = the flat-pack parts for one bed; CNC run is 3-5 hours per sheet.</li>
              <li>Target throughput at full operation: 4-5 beds per day <span className="text-xs">(modelled)</span>.</li>
              <li>First production run: 9 sheets pressed, ~135kg plastic recycled (Feb 2026, measured on site).</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Live production data: <Link href="/admin/production" className="underline">production dashboard</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Known gaps — internal honesty panel */}
      <section className="rounded-2xl border bg-amber-50/60 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Gaps before this page goes public (internal)
        </h2>
        <ul className="space-y-1.5 text-sm">
          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-600 flex-shrink-0" aria-hidden />Nic&apos;s facility walkthrough exists only as a Descript embed; pull a local copy into the repo.</li>
          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-600 flex-shrink-0" aria-hidden />No photo of the plastic-washing step or of collection in community.</li>
          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-600 flex-shrink-0" aria-hidden />Staff-at-work photos are thin (one portrait); capture candid production shots next trip.</li>
          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-600 flex-shrink-0" aria-hidden />CNC noted as not operational in the Feb guide (contact Jimmy) — confirm current status before publishing output claims.</li>
        </ul>
      </section>
    </div>
  );
}
