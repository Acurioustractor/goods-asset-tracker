'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { team } from '@/lib/data/team';
import { brand, story, impact, mediaPack } from '@/lib/data/content';

const MEDIA_PASSWORD = process.env.NEXT_PUBLIC_MEDIA_PASSWORD;

export default function MediaPackPage() {
  const [authed, setAuthed] = useState(!MEDIA_PASSWORD);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (MEDIA_PASSWORD && sessionStorage.getItem('media-pack-auth') === 'true') {
      setAuthed(true);
    }
  }, []);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === MEDIA_PASSWORD) {
      sessionStorage.setItem('media-pack-auth', 'true');
      setAuthed(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="max-w-sm w-full px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-2" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Media Pack
            </h1>
            <p className="text-sm" style={{ color: '#5E5E5E' }}>
              Enter the password to access this page.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
              autoFocus
              placeholder="Password"
              className="w-full px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[#8B9D77]"
              style={{ borderColor: passwordError ? '#ef4444' : '#d1d5db' }}
            />
            {passwordError && (
              <p className="text-sm text-red-600">Incorrect password. Try again.</p>
            )}
            <Button type="submit" size="lg" className="w-full text-white" style={{ backgroundColor: '#8B9D77' }}>
              Enter
            </Button>
          </form>
        </div>
      </main>
    );
  }

  const allStats = [
    ...impact.stats.map((s) => ({ value: s.value, label: s.label })),
    ...story.problem.stats.map((s) => ({ value: s.value, label: s.label })),
  ];

  async function handleCopyBoilerplate() {
    try {
      await navigator.clipboard.writeText(mediaPack.pressBoilerplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = mediaPack.pressBoilerplate;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('submitting');
    setFormError('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: 'Media Pack Request',
      message: `Organisation: ${(form.elements.namedItem('organisation') as HTMLInputElement).value || 'Not provided'}\n\n${(form.elements.namedItem('message') as HTMLTextAreaElement).value}`,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Something went wrong');
      }

      setFormState('success');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong');
      setFormState('error');
    }
  }

  return (
    <main style={{ backgroundColor: '#FDF8F3' }}>
      {/* 1. Hero */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              For Funders & Partners
            </p>
            <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Media &amp; Partner Pack
            </h1>
            <p className="text-lg mb-2" style={{ color: '#5E5E5E' }}>
              {brand.oneLiner}
            </p>
            <p className="text-lg" style={{ color: '#5E5E5E' }}>
              {brand.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* 2. About the Project */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              The Project
            </p>
            <h2 className="text-3xl font-light mb-8" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              About Goods on Country
            </h2>

            {/* Origin story */}
            <div className="mb-12">
              <p className="leading-relaxed whitespace-pre-line" style={{ color: '#5E5E5E' }}>
                {story.origin}
              </p>
            </div>

            {/* Key milestones */}
            <h3 className="text-xl font-medium mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Key Milestones
            </h3>
            <div className="space-y-4 mb-12">
              {story.keyMilestones.map((milestone) => (
                <div key={milestone.year} className="flex items-start gap-4">
                  <span className="text-sm font-bold whitespace-nowrap min-w-[100px]" style={{ color: '#C45C3E' }}>
                    {milestone.year}
                  </span>
                  <span style={{ color: '#5E5E5E' }}>{milestone.event}</span>
                </div>
              ))}
            </div>

            {/* Problem stats grid */}
            <h3 className="text-xl font-medium mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              The Problem
            </h3>
            <p className="mb-6" style={{ color: '#5E5E5E' }}>
              {story.problem.description}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {story.problem.stats.map((stat) => (
                <Card key={stat.label} className="border-0 shadow-sm" style={{ backgroundColor: '#FDF8F3' }}>
                  <CardContent className="p-6">
                    <p className="text-2xl font-light mb-1" style={{ color: '#C45C3E', fontFamily: 'Georgia, serif' }}>
                      {stat.value}
                    </p>
                    <p className="text-sm" style={{ color: '#5E5E5E' }}>{stat.label}</p>
                    {stat.source && (
                      <p className="text-xs mt-1" style={{ color: '#8B9D77' }}>Source: {stat.source}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. About A Curious Tractor */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              The Organisation
            </p>
            <h2 className="text-3xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              About A Curious Tractor
            </h2>
            <p className="leading-relaxed" style={{ color: '#5E5E5E' }}>
              {mediaPack.aboutACT}
            </p>
          </div>
        </div>
      </section>

      {/* 4. The Team */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              The Team
            </p>
            <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Nic &amp; Ben
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

      {/* 5. Key Facts & Impact */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#C45C3E' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-white/70 mb-4">
              At a Glance
            </p>
            <h2 className="text-3xl font-light text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Key Facts &amp; Impact
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {allStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-light text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {stat.value}
                </p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Photos */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Gallery
            </p>
            <h2 className="text-3xl font-light mb-4" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Photos
            </h2>
            <p style={{ color: '#5E5E5E' }}>
              High-resolution images available for media use with attribution to Goods on Country.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {mediaPack.photos.map((photo) => (
              <div key={photo.src} className="group">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Download overlay */}
                  <a
                    href={photo.src}
                    download
                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300"
                    title={`Download: ${photo.caption}`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#2E2E2E' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </span>
                  </a>
                </div>
                <p className="text-xs mt-2" style={{ color: '#5E5E5E' }}>{photo.caption}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            {mediaPack.externalLinks.photoLibrary ? (
              <Button size="lg" className="text-white" style={{ backgroundColor: '#8B9D77' }} asChild>
                <a href={mediaPack.externalLinks.photoLibrary} target="_blank" rel="noopener noreferrer">
                  Download Full Photo Library
                </a>
              </Button>
            ) : (
              <p className="text-sm italic" style={{ color: '#8B9D77' }}>
                Full photo library download coming soon.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 7. Videos */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Film
            </p>
            <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Videos
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {mediaPack.videos.map((video) => (
              <Card key={video.title} className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#C45C3E' }}
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: '#2E2E2E' }}>{video.title}</h3>
                  <p className="text-sm mb-4" style={{ color: '#5E5E5E' }}>{video.description}</p>
                  {video.url ? (
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: '#8B9D77' }}>
                      Watch video &rarr;
                    </a>
                  ) : (
                    <p className="text-xs italic" style={{ color: '#8B9D77' }}>Link coming soon</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Brand Assets */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Identity
            </p>
            <h2 className="text-3xl font-light mb-8" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Brand Assets
            </h2>

            <div className="grid gap-8 md:grid-cols-2 mb-10">
              {/* Name & tagline */}
              <div>
                <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>Name</h3>
                <p className="text-lg" style={{ color: '#5E5E5E' }}>{brand.name}</p>
                <h3 className="font-medium mt-6 mb-2" style={{ color: '#2E2E2E' }}>Tagline</h3>
                <p className="text-lg italic" style={{ color: '#5E5E5E' }}>{brand.tagline}</p>
                <h3 className="font-medium mt-6 mb-2" style={{ color: '#2E2E2E' }}>Fonts</h3>
                <p style={{ color: '#5E5E5E' }}>
                  <span style={{ fontFamily: 'Georgia, serif' }}>Georgia</span> (display headings) &middot; System sans-serif (body)
                </p>
              </div>

              {/* Color swatches */}
              <div>
                <h3 className="font-medium mb-4" style={{ color: '#2E2E2E' }}>Colour Palette</h3>
                <div className="grid grid-cols-2 gap-4">
                  {mediaPack.brandColors.map((color) => (
                    <div key={color.hex} className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg border border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#2E2E2E' }}>{color.name}</p>
                        <p className="text-xs font-mono" style={{ color: '#5E5E5E' }}>{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              {mediaPack.externalLinks.logoPack ? (
                <Button size="lg" className="text-white" style={{ backgroundColor: '#8B9D77' }} asChild>
                  <a href={mediaPack.externalLinks.logoPack} target="_blank" rel="noopener noreferrer">
                    Download Logo Pack
                  </a>
                </Button>
              ) : (
                <p className="text-sm italic" style={{ color: '#8B9D77' }}>
                  Logo pack download coming soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Key Links */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-white/60 mb-4">
              Quick Access
            </p>
            <h2 className="text-3xl font-light text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Key Links
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {[
              { label: 'Website', href: '/', external: false },
              { label: 'Pitch Deck', href: '/pitch', external: false },
              { label: 'Shop', href: '/shop', external: false },
              { label: 'Contact', href: 'mailto:hi@act.place', external: true },
            ].map((link) => (
              <Card key={link.label} className="border-0 bg-white/10 hover:bg-white/20 transition-colors">
                <CardContent className="p-6 text-center">
                  {link.external ? (
                    <a href={link.href} className="text-white font-medium hover:underline">
                      {link.label} &rarr;
                    </a>
                  ) : (
                    <Link href={link.href} className="text-white font-medium hover:underline">
                      {link.label} &rarr;
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Press Boilerplate */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              For Press
            </p>
            <h2 className="text-3xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              About Goods on Country
            </h2>
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <p className="leading-relaxed" style={{ color: '#5E5E5E' }}>
                  {mediaPack.pressBoilerplate}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs italic" style={{ color: '#8B9D77' }}>
                    Copy-paste ready. For media enquiries contact{' '}
                    <a href="mailto:hi@act.place" className="underline">hi@act.place</a>.
                  </p>
                  <button
                    onClick={handleCopyBoilerplate}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-md border transition-colors"
                    style={{
                      borderColor: '#8B9D77',
                      color: copied ? '#fff' : '#8B9D77',
                      backgroundColor: copied ? '#8B9D77' : 'transparent',
                    }}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 11. Request Media Pack */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                Get in Touch
              </p>
              <h2 className="text-3xl font-light mb-4" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                Request Media Pack
              </h2>
              <p style={{ color: '#5E5E5E' }}>
                Need high-res assets, logos, or additional materials? Let us know and we&apos;ll send them through.
              </p>
            </div>

            {formState === 'success' ? (
              <Card className="border-0 shadow-sm" style={{ backgroundColor: '#FDF8F3' }}>
                <CardContent className="p-8 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: '#8B9D77' }}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                    Request received
                  </h3>
                  <p style={{ color: '#5E5E5E' }}>
                    We&apos;ll get back to you with the media pack shortly.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="mp-name" className="block text-sm font-medium mb-1.5" style={{ color: '#2E2E2E' }}>
                      Name *
                    </label>
                    <input
                      id="mp-name"
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B9D77] text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="mp-email" className="block text-sm font-medium mb-1.5" style={{ color: '#2E2E2E' }}>
                      Email *
                    </label>
                    <input
                      id="mp-email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B9D77] text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mp-org" className="block text-sm font-medium mb-1.5" style={{ color: '#2E2E2E' }}>
                    Organisation
                  </label>
                  <input
                    id="mp-org"
                    name="organisation"
                    type="text"
                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B9D77] text-sm"
                    placeholder="Your organisation (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="mp-message" className="block text-sm font-medium mb-1.5" style={{ color: '#2E2E2E' }}>
                    Message
                  </label>
                  <textarea
                    id="mp-message"
                    name="message"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B9D77] text-sm resize-y"
                    placeholder="What do you need? (e.g. high-res photos, logo files, video clips)"
                  />
                </div>

                {formState === 'error' && (
                  <p className="text-sm text-red-600">{formError}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={formState === 'submitting'}
                  className="w-full text-white"
                  style={{ backgroundColor: '#8B9D77' }}
                >
                  {formState === 'submitting' ? 'Sending...' : 'Send Request'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
