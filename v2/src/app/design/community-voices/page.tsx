'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    quote: "It took just five minutes to put together, and it's properly comfortable.",
    author: 'Mark',
    location: 'Palm Island',
    image: null,
  },
  {
    quote: "I need a good mattress so I can rest my back...and ability to wash it due to disability needs.",
    author: 'Community Member',
    location: 'Tennant Creek',
    image: null,
  },
  {
    quote: "My daughter tried one and now I want three beds in maroon for my family.",
    author: 'Norm Frank',
    location: 'Alice Homelands',
    image: null,
  },
];

const stats = [
  { value: '200-350', label: 'Beds Requested' },
  { value: '15', label: 'Storytellers' },
  { value: '8+', label: 'Communities' },
  { value: '$3M/yr', label: 'The Problem' },
];

export default function CommunityVoicesPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F3' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b" style={{ borderColor: '#E8DED4' }}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/design/community-voices" className="text-xl font-bold" style={{ color: '#C45C3E' }}>
            Goods on Country
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm font-medium hover:opacity-70" style={{ color: '#2E2E2E' }}>Shop</Link>
            <Link href="#" className="text-sm font-medium hover:opacity-70" style={{ color: '#2E2E2E' }}>Stories</Link>
            <Link href="#" className="text-sm font-medium hover:opacity-70" style={{ color: '#2E2E2E' }}>About</Link>
            <Button size="sm" style={{ backgroundColor: '#C45C3E' }}>
              Sponsor a Bed
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero - Large portrait with quote */}
      <section className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Portrait placeholder */}
            <div
              className="aspect-[4/5] rounded-2xl overflow-hidden relative"
              style={{ backgroundColor: '#E8DED4' }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                [Portrait: Community member with bed]
              </div>
              {/* Gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="lg:pl-8">
              <p className="text-sm uppercase tracking-widest mb-6" style={{ color: '#8B9D77' }}>
                Community Voices
              </p>
              <blockquote className="mb-8">
                <p className="text-3xl md:text-4xl font-light leading-relaxed mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                  &ldquo;It took just five minutes to put together, and it&apos;s properly comfortable.&rdquo;
                </p>
                <footer className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full"
                    style={{ backgroundColor: '#C45C3E' }}
                  />
                  <div>
                    <p className="font-medium" style={{ color: '#2E2E2E' }}>Mark</p>
                    <p className="text-sm" style={{ color: '#8B9D77' }}>Palm Island, QLD</p>
                  </div>
                </footer>
              </blockquote>

              <p className="text-lg mb-8" style={{ color: '#5E5E5E' }}>
                Every bed we deliver has a story. These are the voices of the communities we serve.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" style={{ backgroundColor: '#C45C3E' }}>
                  Hear More Stories
                </Button>
                <Button size="lg" variant="outline" style={{ borderColor: '#C45C3E', color: '#C45C3E' }}>
                  Shop Beds
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12" style={{ backgroundColor: '#C45C3E' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-light text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-white/80">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More voices */}
      <section className="py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              More Voices
            </h2>
            <p style={{ color: '#5E5E5E' }}>
              Stories from families across remote Australia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-sm" style={{ backgroundColor: 'white' }}>
                <CardContent className="p-6">
                  {/* Avatar placeholder */}
                  <div
                    className="w-16 h-16 rounded-full mb-4"
                    style={{ backgroundColor: '#E8DED4' }}
                  />
                  <blockquote>
                    <p className="text-lg mb-4" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <footer>
                      <p className="font-medium" style={{ color: '#C45C3E' }}>{testimonial.author}</p>
                      <p className="text-sm" style={{ color: '#8B9D77' }}>{testimonial.location}</p>
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" style={{ borderColor: '#C45C3E', color: '#C45C3E' }}>
              Read All Stories
            </Button>
          </div>
        </div>
      </section>

      {/* The Bed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                The Product
              </p>
              <h2 className="text-3xl md:text-4xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                The Stretch Bed
              </h2>
              <p className="text-lg mb-6" style={{ color: '#5E5E5E' }}>
                Co-designed with communities over 500+ minutes of feedback. Built from recycled plastic,
                designed for remote conditions, and made to last.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Made from 21kg recycled plastic',
                  '5-minute assembly, no tools required',
                  'Washable mattress components',
                  'Built to last 10+ years',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#8B9D77' }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span style={{ color: '#2E2E2E' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-3xl font-light" style={{ color: '#C45C3E' }}>$850</span>
                <span style={{ color: '#5E5E5E' }}>or sponsor for a family</span>
              </div>

              <div className="flex gap-4">
                <Button size="lg" style={{ backgroundColor: '#C45C3E' }}>
                  Shop Beds
                </Button>
                <Button size="lg" variant="outline" style={{ borderColor: '#8B9D77', color: '#8B9D77' }}>
                  Sponsor a Bed
                </Button>
              </div>
            </div>

            {/* Product image placeholder */}
            <div
              className="aspect-square rounded-2xl"
              style={{ backgroundColor: '#E8DED4' }}
            >
              <div className="h-full flex items-center justify-center text-stone-400">
                [Lifestyle: Bed in home setting]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-4" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Built on Community Voice
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: '#5E5E5E' }}>
              Every decision we make is guided by the communities we serve.
              Our goal is to transfer manufacturing to community-owned enterprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Listen', desc: 'Community co-design shapes every product' },
              { title: 'Create', desc: 'Built for remote conditions, locally repairable' },
              { title: 'Transfer', desc: 'Manufacturing moves to community ownership' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-light text-white"
                  style={{ backgroundColor: '#C45C3E' }}
                >
                  {i + 1}
                </div>
                <h3 className="text-xl font-medium mb-2" style={{ color: '#2E2E2E' }}>{item.title}</h3>
                <p style={{ color: '#5E5E5E' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: '#2E2E2E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Every bed has a story.<br />Be part of the next one.
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            When you purchase or sponsor a bed, you&apos;ll receive updates and photos
            as it reaches its new home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" style={{ backgroundColor: '#C45C3E' }}>
              Sponsor a Bed
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              Shop for Yourself
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
