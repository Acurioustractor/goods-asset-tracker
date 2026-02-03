'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: '01',
    title: 'You Buy',
    description: 'Purchase a bed for yourself or sponsor one for a family in need.',
    icon: '🛒',
  },
  {
    number: '02',
    title: 'We Build',
    description: 'Artisans craft each bed from 21kg of recycled plastic.',
    icon: '🔧',
  },
  {
    number: '03',
    title: 'We Deliver',
    description: 'Our team transports beds thousands of kilometers to remote communities.',
    icon: '🚚',
  },
  {
    number: '04',
    title: 'Lives Change',
    description: 'Families receive a good night\'s sleep, improving health and wellbeing.',
    icon: '❤️',
  },
];

const impacts = [
  { value: '200-350', label: 'Beds Requested', icon: '🛏️' },
  { value: '8+', label: 'Communities Served', icon: '📍' },
  { value: '15', label: 'Community Storytellers', icon: '🗣️' },
  { value: '$3M/yr', label: 'The Problem We\'re Solving', icon: '♻️' },
];

export default function MissionForwardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/design/mission-forward" className="text-xl font-black" style={{ color: '#1E3A5F' }}>
            GOODS.
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Shop</Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Mission</Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">Impact</Link>
            <Button size="sm" style={{ backgroundColor: '#E07A3E' }}>
              Join the Mission
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero - Mission statement */}
      <section className="pt-16">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p
              className="text-sm font-bold uppercase tracking-widest mb-6"
              style={{ color: '#E07A3E' }}
            >
              Our Mission
            </p>
            <h1
              className="text-4xl md:text-6xl font-black leading-tight mb-8"
              style={{ color: '#111111' }}
            >
              We believe everyone deserves a good night&apos;s sleep.
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              That&apos;s why we deliver beds to remote Indigenous communities where no one else will.
              Every bed. Every family. Every night.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6"
                style={{ backgroundColor: '#E07A3E' }}
              >
                Join Our Mission
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
              >
                Shop Beds
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: '#E07A3E' }}
            >
              The Process
            </p>
            <h2 className="text-3xl md:text-4xl font-black" style={{ color: '#111111' }}>
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 -translate-y-1/2" style={{ backgroundColor: '#E5E7EB' }} />
                )}

                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    <span className="text-white font-bold">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#111111' }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-20" style={{ backgroundColor: '#1E3A5F' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">
              Real Impact
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Measured Results
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {impacts.map((impact) => (
              <div key={impact.label} className="text-center">
                <p className="text-5xl md:text-6xl font-black text-white mb-2">
                  {impact.value}
                </p>
                <p className="text-white/70 text-sm">
                  {impact.label}
                </p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="max-w-2xl mx-auto mt-16">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Progress to 1,000 beds</span>
              <span>389 / 1,000</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: '38.9%', backgroundColor: '#E07A3E' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Product */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Product image placeholder */}
            <div
              className="aspect-square rounded-lg"
              style={{ backgroundColor: '#F1F5F9' }}
            >
              <div className="h-full flex items-center justify-center text-gray-400">
                [Clean product photography]
              </div>
            </div>

            <div>
              <p
                className="text-sm font-bold uppercase tracking-widest mb-4"
                style={{ color: '#E07A3E' }}
              >
                The Product
              </p>
              <h2 className="text-3xl md:text-4xl font-black mb-6" style={{ color: '#111111' }}>
                The Stretch Bed
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Purpose-built for remote Australia. Stackable, washable, and made from
                recycled plastic. Each bed diverts 21kg from landfill.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { label: '5 minutes', desc: 'Assembly time, no tools' },
                  { label: 'Washable', desc: 'Fully cleanable mattress' },
                  { label: '10+ years', desc: 'Built to last' },
                  { label: 'Community', desc: 'Co-designed with Elders' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      {item.label.split(' ')[0]}
                    </div>
                    <span className="text-gray-700">{item.desc}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-black" style={{ color: '#111111' }}>$850</span>
                <span className="text-gray-500">AUD</span>
              </div>

              <div className="flex gap-4">
                <Button size="lg" style={{ backgroundColor: '#E07A3E' }}>
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                >
                  Sponsor Instead
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-20" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p
                className="text-sm font-bold uppercase tracking-widest mb-4"
                style={{ color: '#E07A3E' }}
              >
                Transparency
              </p>
              <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#111111' }}>
                Real Impact, Real Results
              </h2>
              <p className="text-gray-600">
                Verified outcomes from community partnerships.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { percentage: '400+', label: 'Beds Delivered', desc: 'Across 8+ communities' },
                { percentage: '60%', label: 'Scabies Reduction', desc: 'From community laundries' },
                { percentage: '$6', label: 'Healthcare Saved', desc: 'Per $1 invested' },
              ].map((item) => (
                <Card key={item.label} className="border-2" style={{ borderColor: '#E5E7EB' }}>
                  <CardContent className="p-6 text-center">
                    <p
                      className="text-5xl font-black mb-2"
                      style={{ color: '#1E3A5F' }}
                    >
                      {item.percentage}
                    </p>
                    <p className="font-bold text-gray-900 mb-1">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community quote */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <blockquote>
              <p
                className="text-2xl md:text-3xl font-light italic mb-8"
                style={{ color: '#111111' }}
              >
                &ldquo;It took just five minutes to put together, and it&apos;s properly comfortable.&rdquo;
              </p>
              <footer className="text-gray-500">
                &mdash; Mark, Palm Island
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20" style={{ backgroundColor: '#E07A3E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Ready to make a difference?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Every bed purchased or sponsored directly supports remote Indigenous communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90">
              Shop Beds
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              Sponsor a Bed
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
            >
              Partner With Us
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
