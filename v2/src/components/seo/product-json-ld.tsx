import type { Product } from '@/lib/types/database';
import { formatAmountFromStripe } from '@/lib/stripe';

interface ProductJsonLdProps {
  product: Product;
  baseUrl?: string;
}

export function ProductJsonLd({
  product,
  baseUrl = 'https://goods.act.place',
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.short_description,
    image: product.images.length > 0 ? product.images : product.featured_image,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: 'Goods on Country',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/shop/${product.slug}`,
      priceCurrency: product.currency,
      price: formatAmountFromStripe(product.price_cents).toFixed(2),
      availability:
        product.inventory_count > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Goods on Country',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd({
  baseUrl = 'https://goods.act.place',
}: {
  baseUrl?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Goods on Country',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Goods on Country delivers essential items like beds and washing machines to remote Australian Indigenous communities.',
    sameAs: [
      'https://www.instagram.com/goodsoncountry',
      'https://www.facebook.com/goodsoncountry',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AU',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@goodsoncountry.org.au',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd({
  baseUrl = 'https://goods.act.place',
}: {
  baseUrl?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Goods on Country',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
