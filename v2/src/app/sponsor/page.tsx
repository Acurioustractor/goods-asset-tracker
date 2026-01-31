'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Communities that can receive sponsored beds
const COMMUNITIES = [
  { id: 'palm-island', name: 'Palm Island', state: 'QLD' },
  { id: 'tennant-creek', name: 'Tennant Creek', state: 'NT' },
  { id: 'alice-homelands', name: 'Alice Homelands', state: 'NT' },
  { id: 'maningrida', name: 'Maningrida', state: 'NT' },
  { id: 'kalgoorlie', name: 'Kalgoorlie', state: 'WA' },
  { id: 'mount-isa', name: 'Mount Isa', state: 'QLD' },
];

interface Product {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  currency: string;
  featured_image: string | null;
  product_type: string;
  short_description: string | null;
}

function formatPrice(cents: number, currency: string = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function SponsorContent() {
  const searchParams = useSearchParams();
  const { addItem, openCart } = useCart();

  const productSlug = searchParams.get('product');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [dedicationMessage, setDedicationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);

          // If a product slug was passed, select it
          if (productSlug && data.length > 0) {
            const product = data.find((p: Product) => p.slug === productSlug);
            if (product) {
              setSelectedProduct(product);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [productSlug]);

  const handleSponsor = () => {
    if (!selectedProduct) return;

    setIsAdding(true);

    const cartItem = {
      id: `${selectedProduct.id}-sponsor-${selectedCommunity || 'any'}`,
      slug: selectedProduct.slug,
      name: selectedProduct.name,
      price_cents: selectedProduct.price_cents,
      currency: selectedProduct.currency,
      image: selectedProduct.featured_image || undefined,
      product_type: selectedProduct.product_type,
      is_sponsorship: true,
      sponsored_community: selectedCommunity ? COMMUNITIES.find(c => c.id === selectedCommunity)?.name : undefined,
      dedication_message: dedicationMessage || undefined,
    };

    addItem(cartItem);

    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 300);
  };

  if (isLoading) {
    return (
      <main style={{ backgroundColor: '#FDF8F3' }} className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse" style={{ color: '#5E5E5E' }}>Loading...</div>
        </div>
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
              Make a Difference
            </p>
            <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Sponsor a Bed
            </h1>
            <p className="text-lg" style={{ color: '#5E5E5E' }}>
              Your sponsorship delivers comfort directly to a family in need.
              Choose a bed to sponsor and select a community to support.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left Column - Selection Steps */}
            <div className="lg:col-span-3 space-y-6">
              {/* Step 1: Product Selection */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: '#C45C3E' }}
                    >
                      1
                    </div>
                    <h2 className="text-lg font-medium" style={{ color: '#2E2E2E' }}>
                      Choose a Bed to Sponsor
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {products.filter(p => p.product_type.includes('bed')).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          selectedProduct?.id === product.id
                            ? 'border-[#C45C3E] bg-[#FDF8F3]'
                            : 'border-[#E8DED4] hover:border-[#C45C3E]/50'
                        }`}
                      >
                        <div
                          className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden"
                          style={{ backgroundColor: '#E8DED4' }}
                        >
                          {product.featured_image ? (
                            <Image
                              src={product.featured_image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#8B9D77' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium" style={{ color: '#2E2E2E' }}>{product.name}</p>
                          <p className="text-sm line-clamp-1" style={{ color: '#5E5E5E' }}>
                            {product.short_description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: '#C45C3E' }}>
                            {formatPrice(product.price_cents, product.currency)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Community Selection */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: '#C45C3E' }}
                    >
                      2
                    </div>
                    <h2 className="text-lg font-medium" style={{ color: '#2E2E2E' }}>
                      Select a Community (Optional)
                    </h2>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#5E5E5E' }}>
                    Choose a specific community or let us deliver where the need is greatest.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedCommunity('')}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        selectedCommunity === ''
                          ? 'border-[#C45C3E] bg-[#FDF8F3]'
                          : 'border-[#E8DED4] hover:border-[#C45C3E]/50'
                      }`}
                    >
                      <p className="font-medium" style={{ color: '#2E2E2E' }}>Any Community</p>
                      <p className="text-xs" style={{ color: '#8B9D77' }}>Greatest need</p>
                    </button>
                    {COMMUNITIES.map((community) => (
                      <button
                        key={community.id}
                        onClick={() => setSelectedCommunity(community.id)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          selectedCommunity === community.id
                            ? 'border-[#C45C3E] bg-[#FDF8F3]'
                            : 'border-[#E8DED4] hover:border-[#C45C3E]/50'
                        }`}
                      >
                        <p className="font-medium" style={{ color: '#2E2E2E' }}>{community.name}</p>
                        <p className="text-xs" style={{ color: '#8B9D77' }}>{community.state}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Dedication Message */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: '#C45C3E' }}
                    >
                      3
                    </div>
                    <h2 className="text-lg font-medium" style={{ color: '#2E2E2E' }}>
                      Add a Message (Optional)
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dedication" style={{ color: '#5E5E5E' }}>
                      Personal dedication or message
                    </Label>
                    <Input
                      id="dedication"
                      placeholder="e.g., In memory of..., With love from..."
                      value={dedicationMessage}
                      onChange={(e) => setDedicationMessage(e.target.value)}
                      maxLength={200}
                      className="border-[#E8DED4] focus:border-[#C45C3E] focus:ring-[#C45C3E]"
                    />
                    <p className="text-xs" style={{ color: '#8B9D77' }}>
                      This message will be included with the delivery
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <Card className="border-0 shadow-lg bg-white">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4" style={{ color: '#2E2E2E' }}>
                      Sponsorship Summary
                    </h3>

                    {selectedProduct ? (
                      <>
                        <div className="flex gap-4 mb-4">
                          <div
                            className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden"
                            style={{ backgroundColor: '#E8DED4' }}
                          >
                            {selectedProduct.featured_image ? (
                              <Image
                                src={selectedProduct.featured_image}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#8B9D77' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: '#2E2E2E' }}>{selectedProduct.name}</p>
                            <p className="text-sm px-2 py-1 rounded-full inline-block mt-1" style={{ backgroundColor: '#FDF8F3', color: '#C45C3E' }}>
                              Sponsorship
                            </p>
                          </div>
                        </div>

                        <div className="border-t pt-4 mb-4" style={{ borderColor: '#E8DED4' }}>
                          <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <dt style={{ color: '#5E5E5E' }}>Community</dt>
                              <dd className="font-medium" style={{ color: '#2E2E2E' }}>
                                {selectedCommunity
                                  ? COMMUNITIES.find(c => c.id === selectedCommunity)?.name
                                  : 'Any (Greatest need)'}
                              </dd>
                            </div>
                            {dedicationMessage && (
                              <div className="flex justify-between">
                                <dt style={{ color: '#5E5E5E' }}>Message</dt>
                                <dd className="font-medium text-right max-w-[150px] truncate" style={{ color: '#2E2E2E' }}>
                                  {dedicationMessage}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        <div className="border-t pt-4 mb-6" style={{ borderColor: '#E8DED4' }}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium" style={{ color: '#2E2E2E' }}>Total</span>
                            <span className="text-2xl font-bold" style={{ color: '#C45C3E' }}>
                              {formatPrice(selectedProduct.price_cents, selectedProduct.currency)}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="lg"
                          className="w-full text-white"
                          style={{ backgroundColor: '#C45C3E' }}
                          onClick={handleSponsor}
                          disabled={isAdding}
                        >
                          {isAdding ? (
                            <>
                              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Adding...
                            </>
                          ) : (
                            <>
                              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Sponsor This Bed
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div
                          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                          style={{ backgroundColor: '#FDF8F3' }}
                        >
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#C45C3E' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <p style={{ color: '#5E5E5E' }}>Select a bed to sponsor</p>
                      </div>
                    )}

                    {/* Impact Note */}
                    <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#FDF8F3' }}>
                      <div className="flex gap-3">
                        <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#8B9D77' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div className="text-sm">
                          <p className="font-medium" style={{ color: '#2E2E2E' }}>Your Impact</p>
                          <p style={{ color: '#5E5E5E' }}>
                            100% of your sponsorship goes directly to delivering
                            this bed to a family in need.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              The Journey
            </p>
            <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              How Sponsorship Works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                num: '1',
                title: 'You Sponsor',
                description: 'Choose a bed and optionally select a community to receive it.',
              },
              {
                num: '2',
                title: 'We Deliver',
                description: "Our team delivers and sets up the bed in the family's home.",
              },
              {
                num: '3',
                title: 'Lives Change',
                description: "A family receives the gift of a good night's sleep.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-light"
                  style={{ backgroundColor: '#C45C3E' }}
                >
                  {step.num}
                </div>
                <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>{step.title}</h3>
                <p className="text-sm" style={{ color: '#5E5E5E' }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Every bed has a story.<br />Be part of the next one.
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            When you sponsor a bed, you&apos;ll receive updates and photos
            as it reaches its new home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/stories">Read Community Stories</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/shop">Or Buy for Yourself</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SponsorPage() {
  return (
    <Suspense fallback={
      <main style={{ backgroundColor: '#FDF8F3' }} className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse" style={{ color: '#5E5E5E' }}>Loading sponsor page...</div>
        </div>
      </main>
    }>
      <SponsorContent />
    </Suspense>
  );
}
