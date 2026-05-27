import type { Product } from '@/lib/types/database';
import { formatAmountFromStripe } from '@/lib/stripe';
import { STRETCH_BED } from '@/lib/data/products';

const DEFAULT_BASE_URL = 'https://www.goodsoncountry.com';

function absoluteUrl(path: string, baseUrl = DEFAULT_BASE_URL) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProductJsonLdProps {
  product: Product;
  baseUrl?: string;
}

export function ProductJsonLd({
  product,
  baseUrl = DEFAULT_BASE_URL,
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/shop/${product.slug}#product`,
    name: product.name,
    description: product.description || product.short_description,
    image:
      product.images.length > 0
        ? product.images.map((image) => absoluteUrl(image, baseUrl))
        : product.featured_image
          ? absoluteUrl(product.featured_image, baseUrl)
          : undefined,
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
        '@id': `${baseUrl}/#organization`,
        name: 'Goods on Country',
      },
    },
  };

  return <JsonLdScript data={jsonLd} />;
}

export function OrganizationJsonLd({
  baseUrl = DEFAULT_BASE_URL,
}: {
  baseUrl?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Goods on Country',
    legalName: 'A Curious Tractor',
    alternateName: [
      'Goods',
      'Goods on Country',
      'A Curious Tractor Goods',
      'A Curious Tractor',
    ],
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.svg`,
      width: 512,
      height: 512,
    },
    image: [
      `${baseUrl}/images/media-pack/lying-on-stretch-bed.jpg`,
      `${baseUrl}/images/product/stretch-bed-hero.jpg`,
    ],
    description:
      'Goods on Country designs, builds and delivers durable beds, washing machines and practical household infrastructure for remote First Nations communities across Australia.',
    sameAs: [
      'https://www.instagram.com/goodsoncountry',
      'https://www.facebook.com/goodsoncountry',
    ],
    parentOrganization: {
      '@type': 'Organization',
      name: 'A Curious Tractor',
      url: 'https://www.act.place',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Australia',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Northern Territory',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Queensland',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Western Australia',
      },
      {
        '@type': 'Place',
        name: 'Remote First Nations communities in Australia',
      },
    ],
    knowsAbout: [
      'Stretch Bed',
      'remote community bed delivery',
      'recycled HDPE plastic furniture',
      'on-country manufacturing',
      'remote First Nations housing support',
      'washing machines for remote communities',
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          '@id': `${baseUrl}/shop/stretch-bed-single#product`,
          name: STRETCH_BED.name,
        },
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AU',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@goodsoncountry.com',
      areaServed: 'AU',
      availableLanguage: 'English',
    },
  };

  return <JsonLdScript data={jsonLd} />;
}

export function WebSiteJsonLd({
  baseUrl = DEFAULT_BASE_URL,
}: {
  baseUrl?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: 'Goods on Country',
    url: baseUrl,
    inLanguage: 'en-AU',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    about: {
      '@id': `${baseUrl}/#organization`,
    },
  };

  return <JsonLdScript data={jsonLd} />;
}

export function StretchBedProductJsonLd({
  baseUrl = DEFAULT_BASE_URL,
}: {
  baseUrl?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/shop/stretch-bed-single#product`,
    name: STRETCH_BED.name,
    alternateName: 'Stretch Bed',
    description: STRETCH_BED.shortDescription,
    url: `${baseUrl}/shop/stretch-bed-single`,
    image: [
      `${baseUrl}/images/product/stretch-bed-hero.jpg`,
      `${baseUrl}/images/product/stretch-bed-assembly.jpg`,
      `${baseUrl}/images/product/stretch-bed-in-use.jpg`,
      `${baseUrl}/images/media-pack/community-bed-assembly.jpg`,
    ],
    sku: 'stretch-bed-single',
    brand: {
      '@type': 'Brand',
      name: 'Goods on Country',
    },
    manufacturer: {
      '@id': `${baseUrl}/#organization`,
    },
    category: 'Furniture > Beds',
    material: [
      STRETCH_BED.materials.legs.name,
      STRETCH_BED.materials.frame.name,
      STRETCH_BED.materials.sleepingSurface.name,
    ],
    weight: {
      '@type': 'QuantitativeValue',
      value: 26,
      unitCode: 'KGM',
    },
    depth: {
      '@type': 'QuantitativeValue',
      value: 188,
      unitCode: 'CMT',
    },
    width: {
      '@type': 'QuantitativeValue',
      value: 92,
      unitCode: 'CMT',
    },
    height: {
      '@type': 'QuantitativeValue',
      value: 25,
      unitCode: 'CMT',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Load capacity',
        value: STRETCH_BED.specs.loadCapacity,
      },
      {
        '@type': 'PropertyValue',
        name: 'Assembly time',
        value: STRETCH_BED.specs.assemblyTime,
      },
      {
        '@type': 'PropertyValue',
        name: 'Tools required',
        value: STRETCH_BED.specs.toolsRequired,
      },
      {
        '@type': 'PropertyValue',
        name: 'Plastic diverted',
        value: STRETCH_BED.specs.plasticDiverted,
      },
    ],
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/shop/stretch-bed-single`,
      priceCurrency: 'AUD',
      price: '750.00',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${baseUrl}/#organization`,
      },
    },
  };

  return <JsonLdScript data={jsonLd} />;
}

export function BreadcrumbJsonLd({
  items,
  baseUrl = DEFAULT_BASE_URL,
}: {
  items: Array<{ name: string; path: string }>;
  baseUrl?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, baseUrl),
    })),
  };

  return <JsonLdScript data={jsonLd} />;
}

export function FAQPageJsonLd({
  questions,
}: {
  questions: Array<{ question: string; answer: string }>;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((question) => ({
      '@type': 'Question',
      name: question.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.answer,
      },
    })),
  };

  return <JsonLdScript data={jsonLd} />;
}

export function ItemListJsonLd({
  name,
  items,
  baseUrl = DEFAULT_BASE_URL,
}: {
  name: string;
  items: Array<{ name: string; path: string; description?: string; image?: string }>;
  baseUrl?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        description: item.description,
        image: item.image ? absoluteUrl(item.image, baseUrl) : undefined,
        url: absoluteUrl(item.path, baseUrl),
      },
    })),
  };

  return <JsonLdScript data={jsonLd} />;
}
