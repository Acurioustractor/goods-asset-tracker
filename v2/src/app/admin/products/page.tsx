import Link from 'next/link';
import { PRODUCT_WIKIS, type ProductWiki } from '@/lib/data/product-wiki';
import { createServiceClient } from '@/lib/supabase/server';
import { ArrowRight, Play } from 'lucide-react';

export const dynamic = 'force-dynamic';

/**
 * PRODUCTS & PLANT · the shelf.
 *
 * This page was linked before it was written. Every product wiki page has carried an
 * "← Products & Plant" back-link since it shipped, and the destination did not exist: only
 * /admin/products/[slug] was on disk, so the four wikis could be reached by typing a slug and
 * nowhere else. Ben, 17 September 2026, finding it in the sweep: bring this one back and make it
 * rad. So the index is the shelf the back-link always meant.
 *
 * WHAT MAKES IT WORTH OPENING, rather than being a list of four links: each product carries its
 * own count out of the register. The wiki tells you what a Stretch Bed is; the register tells you
 * that 176 of them are deployed and 20 are sitting ready. Those are the two halves of the same
 * question and they have never been on one screen.
 */

const STATUS_TONE: Record<string, string> = {
  flagship: 'bg-primary text-primary-foreground',
  prototype: 'bg-goods-teal text-white',
  'open-source': 'bg-amber-200 text-amber-900',
  plant: 'bg-[#5C7048] text-white',
};

/**
 * The register stores a product NAME, not a slug — 'Stretch Bed', 'Washing Machine',
 * 'Basket Bed'. Mapping here rather than guessing from the slug keeps the join explicit and
 * survives a wiki being renamed. The Plant is not an asset, so it has no row and no count.
 */
const REGISTER_PRODUCT: Record<string, string | null> = {
  'stretch-bed': 'Stretch Bed',
  'pakkimjalki-kari': 'Washing Machine',
  'basket-bed': 'Basket Bed',
  'the-plant': null,
};

/**
 * Status order on the shelf. Every status a product actually has gets printed, including the
 * unflattering ones: an earlier cut showed only deployed/allocated/ready/demo, so the washing
 * machines read "33 deployed" above "45 in the register" and the missing twelve — nine retired,
 * three under investigation — were invisible. A tile whose numbers do not add up teaches people
 * to distrust every other number on the page.
 */
const STATUS_ORDER = ['deployed', 'allocated', 'ready', 'demo', 'under_investigation', 'retired'];

function orderStatuses(counts: Record<string, number>): [string, number][] {
  return Object.entries(counts).sort(
    ([a], [b]) =>
      (STATUS_ORDER.indexOf(a) + 1 || 99) - (STATUS_ORDER.indexOf(b) + 1 || 99) || a.localeCompare(b),
  );
}

type Counts = Record<string, Record<string, number>>;

async function registerCounts(): Promise<Counts> {
  const supabase = createServiceClient();
  const { data } = await supabase.from('assets').select('product, status');
  const out: Counts = {};
  for (const row of data ?? []) {
    const product = (row as { product: string | null }).product;
    const status = (row as { status: string | null }).status;
    if (!product) continue;
    out[product] ??= {};
    out[product][status ?? 'unknown'] = (out[product][status ?? 'unknown'] ?? 0) + 1;
  }
  return out;
}

function ProductCard({ p, counts }: { p: ProductWiki; counts: Record<string, number> | undefined }) {
  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const shown = counts ? orderStatuses(counts) : [];

  return (
    <Link
      href={`/admin/products/${p.slug}`}
      className="group block rounded-3xl overflow-hidden border bg-card transition hover:border-foreground/40"
    >
      <div className="relative" style={{ aspectRatio: '16 / 9' }}>
        {p.hero.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={p.hero.image}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={p.hero.poster ?? ''}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,17,12,0.92) 0%, rgba(20,17,12,0.3) 50%, rgba(20,17,12,0) 75%)',
          }}
        />
        <span
          className={`absolute top-4 right-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_TONE[p.status]}`}
        >
          {p.statusLabel}
        </span>
        {p.hero.video && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold text-white">
            <Play className="h-3 w-3" /> Film
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="mb-1 text-[13px] font-semibold text-white/70">{p.eyebrow}</p>
          <h2 className="text-2xl font-bold text-white">{p.name}</h2>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-muted-foreground">{p.tagline}</p>

        {/* The register half. Absent for the Plant, which is not an asset. */}
        {shown.length > 0 && (
          <div className="mt-5 flex flex-wrap items-end gap-x-7 gap-y-3 border-t pt-4">
            {shown.map(([status, n]) => (
              <div key={status}>
                <div className="text-xl font-bold tabular-nums">{n}</div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {status.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
            <div className="ml-auto text-[11px] text-muted-foreground">
              {total} in the register
            </div>
          </div>
        )}

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
          Open the wiki <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default async function ProductsIndexPage() {
  const counts = await registerCounts();

  return (
    <div className="max-w-[1100px] mx-auto pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Products &amp; Plant</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          What we make, what each one is for, and how many of them the register knows about.
          Every card opens the full wiki: materials, specs, the film, and the voices.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {PRODUCT_WIKIS.map((p) => {
          const key = REGISTER_PRODUCT[p.slug];
          return <ProductCard key={p.slug} p={p} counts={key ? counts[key] : undefined} />;
        })}
      </div>
    </div>
  );
}
