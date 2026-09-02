'use client';

import { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { isPurchasableProductType, STRETCH_BED } from '@/lib/data/products';
import { CREAM, RUST, CHARCOAL, SAGE } from './palette';

// Communities that can receive sponsored beds. Mirrors the Goods admin
// communities table for the locations we can reliably deliver to today.
const COMMUNITIES = [
  { id: '', name: 'Wherever the need is greatest', state: 'Any' },
  { id: 'palm-island', name: 'Palm Island', state: 'QLD' },
  { id: 'tennant-creek', name: 'Tennant Creek', state: 'NT' },
  { id: 'utopia-homelands', name: 'Utopia Homelands', state: 'NT' },
  { id: 'maningrida', name: 'Maningrida', state: 'NT' },
  { id: 'alice-homelands', name: 'Alice Homelands', state: 'NT' },
  { id: 'mount-isa', name: 'Mount Isa', state: 'QLD' },
  { id: 'kalgoorlie', name: 'Kalgoorlie', state: 'WA' },
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

function SponsorFormContent() {
  const searchParams = useSearchParams();
  const { addItem, openCart } = useCart();

  const productSlug = searchParams.get('product');
  const presetCommunity = searchParams.get('community') || '';

  const [bed, setBed] = useState<Product | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<string>(presetCommunity);
  const [quantity, setQuantity] = useState(1);
  const [dedicationMessage, setDedicationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchBed() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data: Product[] = await res.json();
          // Pick the Stretch Bed by default. Non-commerce products never enter
          // the sponsor cart, even if a product query param points at one.
          const bedProducts = data.filter((p) => isPurchasableProductType(p.product_type));
          const preferred =
            (productSlug && bedProducts.find((p) => p.slug === productSlug)) ||
            bedProducts.find((p) => p.slug.includes('stretch')) ||
            bedProducts[0];
          if (preferred) setBed(preferred);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBed();
  }, [productSlug]);

  const community = COMMUNITIES.find((c) => c.id === selectedCommunity);
  const communityName = community?.id ? community.name : undefined;

  const handleSponsor = () => {
    if (!bed) return;
    setIsAdding(true);

    addItem(
      {
        id: `${bed.id}-sponsor-${selectedCommunity || 'any'}`,
        slug: bed.slug,
        name: bed.name,
        price_cents: bed.price_cents,
        currency: bed.currency,
        image: bed.featured_image || undefined,
        product_type: bed.product_type,
        is_sponsorship: true,
        sponsored_community: communityName,
        dedication_message: dedicationMessage || undefined,
      },
      quantity
    );

    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 300);
  };

  if (isLoading || !bed) {
    return (
      <section className="px-5 sm:px-8 max-w-3xl mx-auto pb-10">
        <p className="text-sm text-center py-10" style={{ color: `${CHARCOAL}99` }}>
          Loading the sponsor form…
        </p>
      </section>
    );
  }

  const totalCents = bed.price_cents * quantity;

  return (
    <>
      {/* What you're sponsoring */}
      <section className="px-5 sm:px-8 max-w-3xl mx-auto pb-10">
        <div
          className="rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center"
          style={{ backgroundColor: `${SAGE}1A`, border: `1px solid ${SAGE}33` }}
        >
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 rounded-2xl overflow-hidden" style={{ backgroundColor: `${CHARCOAL}10` }}>
            {bed.featured_image && (
              <Image
                src={bed.featured_image}
                alt={bed.name}
                fill
                className="object-cover"
                sizes="128px"
              />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: `${CHARCOAL}99` }}>
              You&apos;re sponsoring
            </p>
            <h2 className="font-display text-2xl sm:text-3xl mb-2 leading-tight" style={{ color: CHARCOAL }}>
              {bed.name}
            </h2>
            <p className="text-sm sm:text-base" style={{ color: `${CHARCOAL}cc` }}>
              Recycled plastic, canvas, steel. {STRETCH_BED.specs.loadCapacity} capacity. Flat-packed for remote freight.{' '}
              <Link
                href="/shop/stretch-bed-single"
                className="underline-offset-4 hover:underline"
                style={{ color: RUST }}
              >
                Read more
              </Link>
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="font-display text-3xl" style={{ color: RUST }}>
              {formatPrice(bed.price_cents, bed.currency)}
            </p>
            <p className="text-xs" style={{ color: `${CHARCOAL}99` }}>per bed</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="px-5 sm:px-8 max-w-3xl mx-auto pb-10">
        <div className="space-y-8">
          {/* Community picker */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl mb-1" style={{ color: CHARCOAL }}>
              Where should this bed go?
            </h3>
            <p className="text-sm mb-4" style={{ color: `${CHARCOAL}99` }}>
              Pick a community, or let us send it to the community with the deepest demand right now.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COMMUNITIES.map((c) => {
                const active = selectedCommunity === c.id;
                return (
                  <button
                    key={c.id || 'any'}
                    type="button"
                    onClick={() => setSelectedCommunity(c.id)}
                    className="rounded-2xl px-4 py-3 text-center transition"
                    style={{
                      backgroundColor: active ? CHARCOAL : CREAM,
                      color: active ? CREAM : CHARCOAL,
                      border: `1px solid ${active ? CHARCOAL : `${CHARCOAL}1A`}`,
                    }}
                  >
                    <p className="text-sm font-semibold leading-tight">{c.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: active ? `${CREAM}99` : `${CHARCOAL}66` }}>
                      {c.state}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl mb-1" style={{ color: CHARCOAL }}>
              How many beds?
            </h3>
            <p className="text-sm mb-4" style={{ color: `${CHARCOAL}99` }}>
              Each one lands in a different home in that community.
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="w-12 h-12 rounded-full text-2xl font-light transition disabled:opacity-30"
                style={{ backgroundColor: CREAM, border: `1px solid ${CHARCOAL}33`, color: CHARCOAL }}
              >
                −
              </button>
              <span className="font-display text-3xl w-16 text-center" style={{ color: CHARCOAL }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="w-12 h-12 rounded-full text-2xl font-light transition"
                style={{ backgroundColor: CREAM, border: `1px solid ${CHARCOAL}33`, color: CHARCOAL }}
              >
                +
              </button>
              <p className="ml-2 text-sm" style={{ color: `${CHARCOAL}99` }}>
                {quantity === 1 ? '1 bed' : `${quantity} beds`}, {formatPrice(totalCents, bed.currency)}
              </p>
            </div>
          </div>

          {/* Dedication */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl mb-1" style={{ color: CHARCOAL }}>
              Want to send a message?
            </h3>
            <p className="text-sm mb-4" style={{ color: `${CHARCOAL}99` }}>
              Optional. We pass it on with the bed when it&apos;s delivered.
            </p>
            <input
              type="text"
              placeholder="e.g. From the Smith family, with love"
              value={dedicationMessage}
              onChange={(e) => setDedicationMessage(e.target.value)}
              maxLength={200}
              className="w-full rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'white',
                border: `1px solid ${CHARCOAL}1A`,
                color: CHARCOAL,
              }}
            />
            <p className="mt-2 text-xs text-right" style={{ color: `${CHARCOAL}66` }}>
              {dedicationMessage.length}/200
            </p>
          </div>
        </div>
      </section>

      {/* Sticky-ish summary + action */}
      <section className="px-5 sm:px-8 max-w-3xl mx-auto pb-16">
        <div
          className="rounded-3xl p-6 sm:p-8"
          style={{ backgroundColor: CHARCOAL, color: CREAM }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: `${CREAM}99` }}>
                Your sponsorship
              </p>
              <p className="font-display text-2xl sm:text-3xl leading-tight">
                {quantity === 1 ? '1 Stretch Bed' : `${quantity} Stretch Beds`}
                {' → '}
                {communityName || 'wherever the need is greatest'}
              </p>
              {dedicationMessage && (
                <p className="mt-2 text-sm italic" style={{ color: `${CREAM}cc` }}>
                  &ldquo;{dedicationMessage}&rdquo;
                </p>
              )}
            </div>
            <div className="text-left sm:text-right">
              <p className="font-display text-3xl sm:text-4xl" style={{ color: CREAM }}>
                {formatPrice(totalCents, bed.currency)}
              </p>
              <p className="text-xs" style={{ color: `${CREAM}99` }}>AUD, incl. delivery on Country</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSponsor}
            disabled={isAdding}
            className="w-full rounded-xl px-5 py-4 text-base font-semibold transition disabled:opacity-50"
            style={{ backgroundColor: RUST, color: CREAM }}
          >
            {isAdding ? 'Adding to cart…' : `Sponsor ${quantity === 1 ? 'this bed' : `${quantity} beds`}`}
          </button>
          <p className="mt-3 text-xs text-center" style={{ color: `${CREAM}99` }}>
            Secure checkout through Stripe. AUD. You can change quantity in your cart before paying.
          </p>
        </div>
      </section>
    </>
  );
}

export default function SponsorForm() {
  return (
    <Suspense
      fallback={
        <section className="px-5 sm:px-8 max-w-3xl mx-auto pb-10">
          <p className="text-sm text-center py-10" style={{ color: `${CHARCOAL}99` }}>
            Loading the sponsor form…
          </p>
        </section>
      }
    >
      <SponsorFormContent />
    </Suspense>
  );
}
