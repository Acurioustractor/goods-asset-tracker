import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';
import { team } from '@/lib/data/team';
import { getFeaturedSupporters } from '@/lib/data/supporters';
import { brand, story } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Goods on Country - a social enterprise delivering essential items to remote Australian Indigenous communities.',
};

const VALUES = [
  {
    title: 'Community-Led Design',
    description: 'Products refined "around the fire" with Elders and families. We listen first, design second.',
  },
  {
    title: 'Transparency',
    description: 'We track every item we deliver. Real data, real impact, no hidden costs.',
  },
  {
    title: 'Built for Remote',
    description: 'Commercial-grade foundations, local repairability. The Toyota Troopy of household goods.',
  },
  {
    title: 'Community Ownership',
    description: 'Our goal is to transfer manufacturing to community-owned enterprises. We become unnecessary.',
  },
];

const TIMELINE = [
  { year: '2018', title: 'The Spark', description: 'Nic hears Dr. Bo Remenyi speak about preventable Rheumatic Heart Disease in remote communities.' },
  { year: '2022', title: 'Project Begins', description: 'Goods project kicks off with advisory session in November.' },
  { year: '2023', title: 'A Curious Tractor Founded', description: 'Organisation formally established in September. First bed prototypes developed.' },
  { year: '2024', title: '400+ Beds Delivered', description: 'Active pilots deliver beds across Palm Island, Tennant Creek, Mt Isa, and more.' },
  { year: '2025', title: 'Washing Machines Launch', description: 'Pakkimjalki Kari (Speed Queen-based) washing machines deployed. 8+ communities served.' },
];

const featuredSupporters = getFeaturedSupporters();

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: '#FDF8F3' }}>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              {brand.hero.about.headline}
            </p>
            <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              {brand.tagline}
            </h1>
            <p className="text-lg mb-8" style={{ color: '#5E5E5E' }}>
              {brand.hero.about.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16" style={{ backgroundColor: '#C45C3E' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest text-white/70 mb-4">Our Mission</p>
            <blockquote className="text-2xl md:text-3xl font-light text-white leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
              &ldquo;{brand.mission}&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* The Problem We're Solving */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            <div>
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                The Challenge
              </p>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                {story.problem.headline}
              </h2>
              <p className="mb-4" style={{ color: '#5E5E5E' }}>
                Thousands of people in remote Australia sleep on the floor or share beds.
                Essential appliances fail within months because they were never designed for
                remote conditions. The freight makes everything unaffordable.
              </p>
              <p className="mb-4" style={{ color: '#5E5E5E' }}>
                This isn&apos;t a cultural choice—it&apos;s a failure of infrastructure.
                A washing machine isn&apos;t convenience—it&apos;s cardiac prevention.
                Clean bedding breaks the scabies cycle that leads to Rheumatic Heart Disease.
              </p>
              <p style={{ color: '#5E5E5E' }}>
                We build durable, repairable, community-designed &quot;health hardware&quot;
                that addresses the environmental conditions driving preventable disease.
              </p>
            </div>

            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-medium mb-6" style={{ color: '#C45C3E' }}>The Barriers</h3>
                <div className="space-y-6">
                  {[
                    { num: '1', title: 'Distance & Cost', desc: 'Remote delivery can cost more than the item itself' },
                    { num: '2', title: 'Availability', desc: "Standard retailers don't serve these communities" },
                    { num: '3', title: 'Durability', desc: "Cheap furniture doesn't survive harsh conditions" },
                  ].map((item) => (
                    <div key={item.num} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium"
                        style={{ backgroundColor: '#C45C3E' }}
                      >
                        {item.num}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#2E2E2E' }}>{item.title}</p>
                        <p className="text-sm" style={{ color: '#5E5E5E' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Our Values
            </p>
            <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              What Guides Us
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {VALUES.map((value) => (
              <Card key={value.title} className="border-0 shadow-sm" style={{ backgroundColor: '#FDF8F3' }}>
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#C45C3E' }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>{value.title}</h3>
                  <p className="text-sm" style={{ color: '#5E5E5E' }}>{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Our Journey
            </p>
            <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Growing Impact
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-0.5" style={{ backgroundColor: '#E8DED4' }} />

              {TIMELINE.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-4 mb-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div
                    className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 -translate-x-1/2 z-10"
                    style={{ backgroundColor: '#C45C3E', borderColor: '#FDF8F3' }}
                  />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <span className="text-sm font-bold" style={{ color: '#C45C3E' }}>{item.year}</span>
                    <h3 className="font-medium" style={{ color: '#2E2E2E' }}>{item.title}</h3>
                    <p className="text-sm" style={{ color: '#5E5E5E' }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              The Team
            </p>
            <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Who We Are
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {team.map((member) => (
              <Card key={member.id} className="border-0 shadow-lg bg-white overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 aspect-square md:aspect-auto relative bg-gray-100">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#E8DED4' }}>
                          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#8B9D77' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-medium mb-1" style={{ color: '#2E2E2E' }}>{member.name}</h3>
                      <p className="text-sm mb-3" style={{ color: '#C45C3E' }}>{member.role}</p>
                      <p className="text-sm leading-relaxed" style={{ color: '#5E5E5E' }}>{member.bio}</p>
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="inline-block mt-3 text-sm underline" style={{ color: '#8B9D77' }}>
                          {member.email}
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Supporters */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Our Community
            </p>
            <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Featured Supporters & Partners
            </h2>
            <p className="mt-4 max-w-2xl mx-auto" style={{ color: '#5E5E5E' }}>
              The people and organizations making this work possible
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {featuredSupporters.map((supporter) => (
              <Card key={supporter.id} className="border-0 shadow-sm" style={{ backgroundColor: 'white' }}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: supporter.type === 'foundation' ? '#C45C3E' : '#8B9D77' }}
                    >
                      {supporter.type === 'individual' && (
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                      {supporter.type === 'organization' && (
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                      {supporter.type === 'foundation' && (
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium" style={{ color: '#2E2E2E' }}>{supporter.name}</h3>
                      {supporter.role && (
                        <p className="text-xs mb-1" style={{ color: '#C45C3E' }}>{supporter.role}</p>
                      )}
                      {supporter.location && (
                        <p className="text-xs mb-2" style={{ color: '#8B9D77' }}>{supporter.location}</p>
                      )}
                      <p className="text-sm" style={{ color: '#5E5E5E' }}>{supporter.contribution}</p>
                      {supporter.website && (
                        <a href={supporter.website} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs underline" style={{ color: '#8B9D77' }}>
                          Visit website →
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* OCAP Section */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-5xl mx-auto">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
                Data Sovereignty
              </p>
              <h2 className="text-3xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                OCAP Principles
              </h2>
              <p className="text-white/80 mb-6">
                We follow OCAP (Ownership, Control, Access, Possession) principles
                in all our data practices. Community data belongs to communities.
              </p>
              <ul className="space-y-3">
                {[
                  'Community-owned data governance',
                  'Transparent tracking systems',
                  'Privacy-first approach',
                  'Elder-approved content only',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8B9D77' }}>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4"
                style={{ backgroundColor: 'rgba(139, 157, 119, 0.2)' }}
              >
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#8B9D77' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-white/70">
                Data sovereignty is a fundamental right
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#C45C3E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            {brand.oneLiner}
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Every purchase supports community-led design and manufacturing in remote Australia.
            {' '}{brand.philosophy}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-white/90" style={{ color: '#C45C3E' }} asChild>
              <Link href="/shop">Shop Products</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/sponsor">Sponsor an Item</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/contact">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
