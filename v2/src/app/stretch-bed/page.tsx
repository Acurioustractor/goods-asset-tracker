import Link from 'next/link';
import Image from 'next/image';
import { STRETCH_BED } from '@/lib/data/products';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { createClient } from '@/lib/supabase/server';
import { MediaSwapZone, type SwapFolder } from '@/components/admin/media-swap-picker';

export const metadata = {
  title: 'The Stretch Bed: How It Works',
  description:
    'How the Stretch Bed goes together: two galvanised steel poles, heavy-duty canvas, and recycled-plastic X-frame legs. Sets up in about five minutes, no tools. Full specs and assembly guide.',
  alternates: { canonical: 'https://www.goodsoncountry.com/stretch-bed' },
  openGraph: {
    title: 'The Stretch Bed: How It Works · Goods on Country',
    description:
      'The full build guide and specs for the Stretch Bed: recycled-plastic legs, galvanised steel poles, washable canvas. No tools, about five minutes.',
    url: 'https://www.goodsoncountry.com/stretch-bed',
    images: [
      {
        url: 'https://www.goodsoncountry.com/images/product/stretch-bed-hero.jpg',
        width: 1200,
        height: 900,
        alt: 'The Stretch Bed',
      },
    ],
  },
};

// Admin photo-swap runs on this page too. Overrides persist in
// data/field-note-overrides.json under slug 'stretch-bed'.
export const dynamic = 'force-dynamic';
const OVERRIDE_SLUG = 'stretch-bed';

// Folder chips for the swap modal (same set as /process).
const GOODS_PHOTO_FOLDERS: SwapFolder[] = [
  { label: 'Website images', emoji: '🖼', tags: ['__website__'] },
  { label: 'Recent uploads', emoji: '🕘', tags: [] },
  { label: 'All Stretch Bed', emoji: '🛏', tags: ['product:stretch-bed'] },
  { label: 'Utopia delivery', emoji: '🏠', tags: ['community:utopia-homelands', 'event:bed-delivery'] },
  { label: 'Alice build', emoji: '🛠', tags: ['event:alice-build'] },
  { label: 'Oonchiumpa young people', emoji: '👥', tags: ['participant:oonchiumpa-young-people'] },
  { label: 'May 2026 trip', emoji: '📅', tags: ['trip:may-2026'] },
  { label: 'Batch 156', emoji: '📦', tags: ['batch:156'] },
];

const serif = { fontFamily: 'Georgia, "Times New Roman", serif' };

const components = [
  {
    key: 'poles',
    n: '2',
    title: 'Galvanised steel poles',
    body: `${STRETCH_BED.materials.frame.detail}. Rated for ${STRETCH_BED.specs.loadCapacity}. They run the length of the bed and carry the load.`,
    img: '/images/product/stretch-bed-poles.jpg',
  },
  {
    key: 'canvas',
    n: '1',
    title: 'Heavy-duty canvas',
    body: 'Australian canvas with sewn sleeves along both long edges. Fully washable, quick-drying. It is also the bracing: the bed will not stand without it.',
    img: '/images/product/stretch-bed-detail.jpg',
  },
  {
    key: 'legs',
    n: '2',
    title: 'Recycled-plastic legs',
    body: 'Pressed from community-collected plastic waste, the HDPE planks cross into two X-frame trestles, each with a hole at the top for a pole to thread through. Virtually indestructible, no screws.',
    img: '/images/product/stretch-bed-legs.jpg',
  },
];

const steps = [
  {
    n: 1,
    title: 'Lay out the parts',
    body: 'Two steel poles, the folded canvas, and the recycled-plastic leg planks. That is everything. No tools, no fasteners.',
    img: '/images/product/stretch-bed-legs.jpg',
  },
  {
    n: 2,
    title: 'Stand up the two X-frame legs',
    body: 'The crossed plastic planks form two X-shaped trestles, one for each end of the bed, spaced a bed-length apart. These are the supports.',
    img: '/images/product/stretch-bed-assembly.jpg',
  },
  {
    n: 3,
    title: 'Thread the poles through the canvas and legs',
    body: 'Each steel pole passes through a sewn sleeve on a long edge of the canvas and through the hole at the top of each X-leg. One pole runs down each side.',
    img: '/images/product/stretch-bed-poles.jpg',
  },
  {
    n: 4,
    title: 'Pull it tight',
    body: 'With the poles run through the leg holes, the canvas pulls taut and the whole frame locks up tight. The poles through the holes hold the tension.',
    img: '/images/product/stretch-bed-detail.jpg',
  },
  {
    n: 5,
    title: 'Lie down',
    body: 'That is the bed. It sits low and sturdy, holds up to 200kg, and packs flat again when you need to move it.',
    img: '/images/product/stretch-bed-in-use.jpg',
  },
];

const specs = [
  { k: 'Dimensions (L × W × H)', v: STRETCH_BED.specs.dimensions },
  { k: 'Weight', v: STRETCH_BED.specs.weight },
  { k: 'Load capacity', v: STRETCH_BED.specs.loadCapacity },
  { k: 'Assembly', v: STRETCH_BED.specs.assemblyTime },
  { k: 'Tools required', v: STRETCH_BED.specs.toolsRequired },
  { k: 'Plastic diverted', v: STRETCH_BED.specs.plasticDiverted },
];

export default async function StretchBedPage() {
  // Admin detection, same pattern as /process and /field-notes: any
  // signed-in user (or local dev) gets the in-place swap widget on every
  // photo slot. Public visitors see the photos with no chrome.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const canSwap = !!user || process.env.NODE_ENV !== 'production';
  const overrides = getStoryOverrides(OVERRIDE_SLUG);

  const heroSrc = overrides['hero'] ?? '/images/product/stretch-bed-hero.jpg';

  return (
    <main className="bg-[#FCFBF7] text-[#2A2620]" data-skin="goods">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[52vh] min-h-[360px] w-full">
          <Image src={heroSrc} alt="The Stretch Bed" fill priority sizes="100vw" className="object-cover" />
          {canSwap && (
            <MediaSwapZone
              slug={OVERRIDE_SLUG}
              overrideKey="hero"
              currentUrl={heroSrc}
              tagQuery={['product:stretch-bed']}
              kind="photo"
              label="swap hero"
              broadTag="product:stretch-bed"
              folders={GOODS_PHOTO_FOLDERS}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-6 pb-10">
            <p className="mb-2 text-sm uppercase tracking-[0.18em] text-[#D99A6A]">How it works</p>
            <h1 style={serif} className="text-4xl font-bold text-white sm:text-5xl">
              The Stretch Bed
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-100">
              {STRETCH_BED.tagline} Sets up in about five minutes, no tools.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#build"
                className="rounded-md bg-[#B0673B] px-5 py-2.5 font-medium text-white transition hover:bg-[#974F2C]"
              >
                Watch it built
              </a>
              <Link
                href="/shop/stretch-bed-single"
                className="rounded-md border border-white/70 px-5 py-2.5 font-medium text-white transition hover:bg-white/10"
              >
                Buy or sponsor a bed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview diagram (fixed infographic, not swappable) */}
      <section className="mx-auto max-w-6xl px-6 pt-14">
        <p className="mb-4 text-center text-sm uppercase tracking-[0.18em] text-[#B0673B]">
          The whole bed, one diagram
        </p>
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <Image
            src="/goods-bed-anatomy.jpg"
            alt="Anatomy of the Stretch Bed: galvanised steel poles, heavy-duty canvas, and recycled-plastic X-trestle legs, with the cost of each part"
            width={1264}
            height={848}
            className="h-auto w-full"
            priority
          />
        </div>
      </section>

      {/* What it is */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 style={serif} className="text-3xl font-bold">
          Three parts, no tools
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          The whole bed is three component types. Recycled plastic for the legs, galvanised steel
          for the poles, and heavy-duty canvas for the surface. Nothing to screw, nothing to lose.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {components.map((c) => {
            const src = overrides[`component.${c.key}`] ?? c.img;
            return (
              <div key={c.key} className="overflow-hidden rounded-xl border border-slate-200">
                <div className="relative h-40 w-full bg-slate-100">
                  <Image src={src} alt={c.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  {canSwap && (
                    <MediaSwapZone
                      slug={OVERRIDE_SLUG}
                      overrideKey={`component.${c.key}`}
                      currentUrl={src}
                      tagQuery={['product:stretch-bed']}
                      kind="photo"
                      label="swap"
                      broadTag="product:stretch-bed"
                      folders={GOODS_PHOTO_FOLDERS}
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#B0673B]">
                    {c.n}× per bed
                  </div>
                  <h3 style={serif} className="mt-1 text-lg font-bold">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{c.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Video */}
      <section id="build" className="bg-[#F2ECE0] py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 style={serif} className="text-3xl font-bold">
            Watch a bed go together
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Start to finish, filmed in real time, ending with a load test. This is the whole build.
          </p>
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
            <video
              controls
              preload="metadata"
              poster="/video/stretch-bed/assembly-poster.jpg"
              className="aspect-video w-full"
            >
              <source src="/video/stretch-bed/assembly.mp4" type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 style={serif} className="text-3xl font-bold">
          How to build it, step by step
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Lay out the parts, stand the X-legs, thread the poles, pull it tight. About five minutes, no tools.
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <Image
            src="/goods-bed-assembly.jpg"
            alt="How the Stretch Bed goes together: lay out the parts, stand the X-legs, thread the poles, tension it, done"
            width={1264}
            height={848}
            className="h-auto w-full"
          />
        </div>
        <div className="mt-12 space-y-12">
          {steps.map((s, i) => {
            const src = overrides[`step.${s.n}`] ?? s.img;
            return (
              <div
                key={s.n}
                className={`grid items-center gap-8 sm:grid-cols-2 ${i % 2 ? 'sm:[&>div:first-child]:order-2' : ''}`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image src={src} alt={s.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  {canSwap && (
                    <MediaSwapZone
                      slug={OVERRIDE_SLUG}
                      overrideKey={`step.${s.n}`}
                      currentUrl={src}
                      tagQuery={['product:stretch-bed']}
                      kind="photo"
                      label={`swap step ${s.n}`}
                      broadTag="product:stretch-bed"
                      folders={GOODS_PHOTO_FOLDERS}
                    />
                  )}
                </div>
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B0673B] text-lg font-bold text-white">
                    {s.n}
                  </div>
                  <h3 style={serif} className="mt-4 text-2xl font-bold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The clever bit */}
      <section className="bg-[#221E18] py-16 text-white">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm uppercase tracking-[0.18em] text-[#D99A6A]">Why it works</p>
          <h2 style={serif} className="mt-2 text-3xl font-bold">
            The weight is what holds it together
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-200">
            It is a tension design. Each pole threads through the hole at the top of each X-leg, so
            the poles cannot slip, and the canvas stretched tight between them braces the whole
            frame. The frame <span className="text-[#D99A6A]">will not stand without the canvas</span>:
            it is the tension that holds everything together. No screws, no tools, just thread the
            poles through and pull it tight.
          </p>
        </div>
      </section>

      {/* Specs + materials */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 style={serif} className="text-3xl font-bold">
          Specifications
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
          {specs.map((s) => (
            <div key={s.k} className="bg-white p-5">
              <div className="text-[11px] uppercase tracking-wider text-slate-500">{s.k}</div>
              <div className="mt-1 text-xl font-bold">{s.v}</div>
            </div>
          ))}
        </div>

        <h3 style={serif} className="mt-12 text-2xl font-bold">
          Materials
        </h3>
        <dl className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
          {Object.values(STRETCH_BED.materials).map((m) => (
            <div key={m.name} className="grid grid-cols-3 gap-4 py-3 text-sm">
              <dt className="font-semibold">{m.name}</dt>
              <dd className="col-span-2 text-slate-600">
                {'detail' in m && m.detail ? m.detail : ''}
                {'supplier' in m && m.supplier ? (
                  <span className="block text-slate-400">{m.supplier}</span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="bg-[#B0673B] py-14 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-5 px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 style={serif} className="text-3xl font-bold">
              Put one in a home
            </h2>
            <p className="mt-1 text-[#F4E9E1]">
              Every bed diverts {STRETCH_BED.specs.plasticDiverted.replace(' per bed', '')} from
              landfill and is built toward community ownership.
            </p>
          </div>
          <Link
            href="/shop/stretch-bed-single"
            className="whitespace-nowrap rounded-md bg-white px-6 py-3 font-semibold text-[#B0673B] transition hover:bg-[#F4E9E1]"
          >
            Buy or sponsor a bed
          </Link>
        </div>
      </section>
    </main>
  );
}
