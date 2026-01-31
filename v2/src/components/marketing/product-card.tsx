import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Product } from '@/lib/types/database';

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

function formatPrice(cents: number, currency: string = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function ProductCard({ product, showBadge = true }: ProductCardProps) {
  const hasDiscount =
    product.compare_at_price_cents &&
    product.compare_at_price_cents > product.price_cents;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.featured_image ? (
          <Image
            src={product.featured_image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-muted-foreground/40"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        {showBadge && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <Badge variant="default" className="bg-accent text-accent-foreground">
                Featured
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">
                Save{' '}
                {formatPrice(
                  product.compare_at_price_cents! - product.price_cents,
                  product.currency
                )}
              </Badge>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Type Badge */}
        <Badge variant="secondary" className="mb-2">
          {product.product_type.replace('_', ' ')}
        </Badge>

        {/* Product Name */}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        {product.short_description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.short_description}
          </p>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            {formatPrice(product.price_cents, product.currency)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price_cents!, product.currency)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/shop/${product.slug}`}>View Details</Link>
        </Button>
        <Button variant="outline" size="icon" aria-label="Add to cart">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Skeleton loader for product cards
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <CardContent className="p-4">
        <div className="h-5 w-20 animate-pulse rounded bg-muted mb-2" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-1 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-3 h-7 w-24 animate-pulse rounded bg-muted" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <div className="h-10 flex-1 animate-pulse rounded bg-muted" />
        <div className="h-10 w-10 animate-pulse rounded bg-muted" />
      </CardFooter>
    </Card>
  );
}
