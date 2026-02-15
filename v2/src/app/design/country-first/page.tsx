'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { value: '200-350', label: 'Beds Requested' },
  { value: '8+', label: 'Communities' },
  { value: '15', label: 'Storytellers' },
  { value: '$3M/yr', label: 'The Problem' },
];

const communities = [
  { name: 'Palm Island', beds: 141, region: 'QLD' },
  { name: 'Tennant Creek', beds: 139, region: 'NT' },
  { name: 'Alice Homelands', beds: 60, region: 'NT' },
  { name: 'Maningrida', beds: 24, region: 'NT' },
  { name: 'Kalgoorlie', beds: 20, region: 'WA' },
];

export default function CountryFirstPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-stone-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/design/country-first" className="text-xl font-bold" style={{ color: '#C2703B' }}>
            Goods.
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm font-medium text-stone-700 hover:text-stone-900">Shop</Link>
            <Link href="#" className="text-sm font-medium text-stone-700 hover:text-stone-900">Impact</Link>
            <Link href="#" className="text-sm font-medium text-stone-700 hover:text-stone-900">About</Link>
            <Button size="sm" style={{ backgroundColor: '#C2703B' }}>
              Sponsor a Bed
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero - Full bleed landscape */}
      <section className="relative h-[80vh] min-h-[600px] pt-16">
        {/* Background image placeholder */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #C2703B 0%, #8B4513 50%, #2D5A47 100%)',
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl mx-auto px-4">
            <p className="text-white/80 text-sm uppercase tracking-widest mb-4">
              Goods on Country
            </p>
            <h1 className="text-5xl md:text-7xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Comfort delivered<br />to Country
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
              Beds made from recycled plastic, delivered to remote Indigenous communities across Australia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base px-8" style={{ backgroundColor: '#C2703B' }}>
                Shop Beds
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 text-white border-white hover:bg-white/10"
              >
                Sponsor a Bed
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-light mb-2" style={{ color: '#C2703B' }}>
                  {stat.value}
                </p>
                <p className="text-sm text-stone-600 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20" style={{ backgroundColor: '#fafaf9' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-stone-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              The Stretch Bed
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto">
              Stackable, washable, and built to last. Each bed diverts 20kg of plastic from landfill.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Product image placeholder */}
            <div
              className="aspect-square rounded-lg"
              style={{ backgroundColor: '#e7e5e4' }}
            >
              <div className="h-full flex items-center justify-center text-stone-400">
                [Product Photo]
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-light text-stone-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Built for Country
              </h3>
              <ul className="space-y-4 text-stone-600 mb-8">
                <li className="flex items-start gap-3">
                  <span style={{ color: '#2D5A47' }}>&#10003;</span>
                  Made from recycled plastic
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: '#2D5A47' }}>&#10003;</span>
                  5-minute assembly
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: '#2D5A47' }}>&#10003;</span>
                  Washable mattress components
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: '#2D5A47' }}>&#10003;</span>
                  Built to last 10+ years
                </li>
              </ul>
              <p className="text-2xl font-light text-stone-900 mb-6">
                From <span style={{ color: '#C2703B' }}>$850</span>
              </p>
              <Button size="lg" style={{ backgroundColor: '#C2703B' }}>
                Shop Beds
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-stone-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Voices from Country
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <blockquote className="text-center">
              <p className="text-2xl md:text-3xl font-light text-stone-700 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                &ldquo;It took just five minutes to put together, and it&apos;s properly comfortable.&rdquo;
              </p>
              <footer className="text-stone-500">
                &mdash; Mark, Palm Island
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Communities Map */}
      <section className="py-20" style={{ backgroundColor: '#fafaf9' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-stone-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Communities We Serve
            </h2>
            <p className="text-stone-600">
              Delivering beds across remote Australia
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {communities.map((community) => (
              <Card key={community.name} className="border-stone-200">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-light mb-1" style={{ color: '#C2703B' }}>
                    {community.beds}
                  </p>
                  <p className="text-sm text-stone-700">{community.name}</p>
                  <p className="text-xs text-stone-400">{community.region}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 text-center"
        style={{ backgroundColor: '#2D5A47' }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Be part of the journey
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Every bed purchased supports remote Indigenous communities and diverts plastic from landfill.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-white/90" style={{ color: '#2D5A47' }}>
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Sponsor a Bed
            </Button>
          </div>
        </div>
      </section>

      {/* Back to designs */}
      <div className="fixed bottom-4 right-4">
        <Button variant="outline" asChild className="bg-white shadow-lg">
          <Link href="/design">View All Concepts</Link>
        </Button>
      </div>
    </div>
  );
}
