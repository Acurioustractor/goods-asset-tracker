import Link from 'next/link';
import { PRODUCT_WIKIS } from '@/lib/data/product-wiki';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { ArrowRight, BookOpen } from 'lucide-react';
import { AdminHubTabs } from '../admin-hub-tabs';

const PRODUCTS_TABS = [
  { label: 'Overview', href: '/admin/products' },
  { label: 'Full story', href: '/admin/products/story' },
  { label: 'Facility', href: '/admin/facility' },
  { label: 'Production', href: '/admin/production' },
];

export const dynamic = 'force-static';

const STATUS_TONE: Record<string, string> = {
  flagship: 'bg-primary text-primary-foreground',
  prototype: 'bg-[#4E8F88] text-white',
  'open-source': 'bg-amber-200 text-amber-900',
  plant: 'bg-[#5C7048] text-white',
};

export default function ProductsIndex() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Products &amp; Plant</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          A page for each product and the plant, written well, with images and video. The place to
          walk someone through what Goods makes, how it works, and why it exists.
        </p>
      </header>

      <AdminHubTabs tabs={PRODUCTS_TABS} />

      {/* The full Goods story — the marquee entry */}
      <Link
        href="/admin/products/story"
        className="group relative block overflow-hidden rounded-3xl border"
        style={{ aspectRatio: '21 / 6' }}
      >
        <video autoPlay muted loop playsInline poster="/video/community-poster.jpg" className="absolute inset-0 h-full w-full object-cover">
          <source src="/video/community-desktop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(20,17,12,0.92) 0%, rgba(20,17,12,0.55) 55%, rgba(20,17,12,0.1) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-center p-8">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-widest text-white/70 mb-1">
            <BookOpen className="h-3.5 w-3.5" /> The full story
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>The Goods story</h2>
          <p className="mt-1 max-w-xl text-white/80 text-sm">
            Where it came from, the problem it solves, and why it became a production and ownership project. The whole narrative in one place.
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white">Read the story <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" /></span>
        </div>
      </Link>

      {/* Product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PRODUCT_WIKIS.map((p) => (
          <Link key={p.slug} href={`/admin/products/${p.slug}`} className="group relative block overflow-hidden rounded-2xl border" style={{ aspectRatio: '16 / 10' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.hero.image || p.hero.poster} alt={p.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,17,12,0.9) 0%, rgba(20,17,12,0.2) 55%, rgba(20,17,12,0) 80%)' }} />
            <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_TONE[p.status]}`}>{p.statusLabel}</span>
            <div className="absolute bottom-0 left-0 p-5">
              <p className="text-[12px] font-medium text-white/70">{p.eyebrow}</p>
              <h3 className="font-display text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>{p.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Canon footnote */}
      <p className="text-xs text-muted-foreground">
        {CANONICAL_ASSETS.bedsDeployed} beds ({CANONICAL_ASSETS.basketBedsDeployed} Basket, {CANONICAL_ASSETS.stretchBedsDeployed} Stretch) ·{' '}
        {CANONICAL_ASSETS.washersInCommunity} washing machines · {CANONICAL_ASSETS.plasticKg.toLocaleString()}kg HDPE diverted · register-verified.
      </p>
    </div>
  );
}
