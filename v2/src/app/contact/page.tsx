'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const INQUIRY_TYPES = [
  { id: 'partnership', label: 'Partnership Inquiry', description: 'Explore collaboration opportunities' },
  { id: 'bulk-order', label: 'Bulk Order', description: 'Order 10+ beds for an organization' },
  { id: 'media', label: 'Media & Press', description: 'Interview requests, story features' },
  { id: 'general', label: 'General Inquiry', description: 'Questions about Goods on Country' },
];

export default function ContactPage() {
  const [inquiryType, setInquiryType] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main style={{ backgroundColor: '#FDF8F3' }}>
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: '#8B9D77' }}
              >
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-light mb-4" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                Message Sent
              </h1>
              <p className="mb-8" style={{ color: '#5E5E5E' }}>
                Thank you for reaching out. We&apos;ll get back to you within 2-3 business days.
              </p>
              <Button size="lg" style={{ backgroundColor: '#C45C3E' }} asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: '#FDF8F3' }}>
      {/* Header */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Get in Touch
            </p>
            <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Contact Us
            </h1>
            <p className="text-lg" style={{ color: '#5E5E5E' }}>
              Have a question, partnership idea, or just want to say hello?
              We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-5 max-w-6xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inquiry Type */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block" style={{ color: '#2E2E2E' }}>
                        What can we help you with?
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {INQUIRY_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setInquiryType(type.id)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                              inquiryType === type.id
                                ? 'border-[#C45C3E] bg-[#FDF8F3]'
                                : 'border-[#E8DED4] hover:border-[#C45C3E]/50'
                            }`}
                          >
                            <p className="font-medium text-sm" style={{ color: '#2E2E2E' }}>{type.label}</p>
                            <p className="text-xs" style={{ color: '#5E5E5E' }}>{type.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name" className="mb-2 block" style={{ color: '#5E5E5E' }}>
                          Your Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="Jane Smith"
                          className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="mb-2 block" style={{ color: '#5E5E5E' }}>
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="jane@example.com"
                          className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                        />
                      </div>
                    </div>

                    {/* Organization (for partnerships) */}
                    {(inquiryType === 'partnership' || inquiryType === 'bulk-order') && (
                      <div>
                        <Label htmlFor="organization" className="mb-2 block" style={{ color: '#5E5E5E' }}>
                          Organization
                        </Label>
                        <Input
                          id="organization"
                          name="organization"
                          placeholder="Your organization name"
                          className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                        />
                      </div>
                    )}

                    {/* Phone (optional) */}
                    <div>
                      <Label htmlFor="phone" className="mb-2 block" style={{ color: '#5E5E5E' }}>
                        Phone (optional)
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+61 4XX XXX XXX"
                        className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="mb-2 block" style={{ color: '#5E5E5E' }}>
                        Your Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-white"
                      style={{ backgroundColor: '#C45C3E' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Links */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4" style={{ color: '#2E2E2E' }}>Quick Links</h3>
                  <div className="space-y-3">
                    <Link
                      href="/shop"
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[#FDF8F3]"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#C45C3E' }}
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#2E2E2E' }}>Shop Beds</p>
                        <p className="text-sm" style={{ color: '#5E5E5E' }}>Browse our products</p>
                      </div>
                    </Link>
                    <Link
                      href="/sponsor"
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[#FDF8F3]"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#8B9D77' }}
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#2E2E2E' }}>Sponsor a Bed</p>
                        <p className="text-sm" style={{ color: '#5E5E5E' }}>Gift comfort to a family</p>
                      </div>
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[#FDF8F3]"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#C45C3E' }}
                      >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#2E2E2E' }}>Our Story</p>
                        <p className="text-sm" style={{ color: '#5E5E5E' }}>Learn about our mission</p>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="border-0 shadow-sm" style={{ backgroundColor: '#FDF8F3' }}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#8B9D77' }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium mb-1" style={{ color: '#2E2E2E' }}>Response Time</p>
                      <p className="text-sm" style={{ color: '#5E5E5E' }}>
                        We typically respond within 2-3 business days.
                        For urgent matters, please mention it in your message.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4" style={{ color: '#2E2E2E' }}>Based in Australia</h3>
                  <p className="text-sm mb-4" style={{ color: '#5E5E5E' }}>
                    Goods on Country operates across remote Australia, delivering beds
                    to communities in Queensland, Northern Territory, and Western Australia.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Queensland', 'Northern Territory', 'Western Australia'].map((state) => (
                      <span
                        key={state}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: '#FDF8F3', color: '#8B9D77' }}
                      >
                        {state}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                Common Questions
              </p>
              <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                Frequently Asked
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  q: 'How long does delivery take?',
                  a: 'Delivery times vary based on location. Urban areas typically receive beds within 2-4 weeks, while remote communities may take 4-8 weeks.',
                },
                {
                  q: 'Can I sponsor multiple beds?',
                  a: 'Yes! You can sponsor as many beds as you like. For bulk sponsorships (10+), please contact us for special arrangements.',
                },
                {
                  q: 'How do I know my sponsorship reached a family?',
                  a: "We'll send you updates and photos (with permission) when your sponsored bed is delivered to its new home.",
                },
                {
                  q: 'Are donations tax-deductible?',
                  a: 'Goods on Country is a social enterprise. Please contact us about tax deductibility options for your situation.',
                },
              ].map((faq, i) => (
                <Card key={i} className="border-0 shadow-sm" style={{ backgroundColor: '#FDF8F3' }}>
                  <CardContent className="p-6">
                    <h3 className="font-medium mb-2" style={{ color: '#C45C3E' }}>{faq.q}</h3>
                    <p className="text-sm" style={{ color: '#5E5E5E' }}>{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#C45C3E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Ready to make a difference?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Every bed purchased or sponsored supports remote Indigenous communities across Australia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-white/90" style={{ color: '#C45C3E' }} asChild>
              <Link href="/shop">Shop Beds</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/sponsor">Sponsor a Bed</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
