import type { Metadata } from 'next';
import CentrecorpStory from './centrecorp-story';

const PAGE_TITLE = 'Goods on Country and Centrecorp Foundation Partnership';
const PAGE_DESCRIPTION =
  'In Alice Springs and Utopia Homelands, young people built their own Stretch Beds with Goods on Country, A Curious Tractor and Oonchiumpa, supported by the Centrecorp Foundation. The field story from the May 2026 trip.';
const PAGE_URL = 'https://www.goodsoncountry.com/partners/centrecorp';
const PAGE_IMAGE = 'https://www.goodsoncountry.com/images/partners/centrecorp/story/01-hero.jpg';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'Goods on Country Centrecorp',
    'Centrecorp Foundation Goods on Country',
    'A Curious Tractor Centrecorp',
    'Utopia Homelands beds',
    'Oonchiumpa Good News Story',
    'Central Australia bed delivery',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: 'article',
    images: [
      {
        url: PAGE_IMAGE,
        width: 1200,
        height: 800,
        alt: 'Young people carrying a flat-packed Stretch Bed on Country at Utopia Homelands',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [PAGE_IMAGE],
  },
  robots: { index: true, follow: true },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  image: [PAGE_IMAGE],
  datePublished: '2026-05-18',
  dateModified: '2026-06-26',
  author: [
    { '@type': 'Organization', name: 'Goods on Country', url: 'https://www.goodsoncountry.com' },
    { '@type': 'Organization', name: 'A Curious Tractor', url: 'https://www.act.place' },
  ],
  publisher: {
    '@type': 'Organization',
    name: 'Goods on Country',
    url: 'https://www.goodsoncountry.com',
    logo: { '@type': 'ImageObject', url: 'https://www.goodsoncountry.com/logo.svg' },
  },
  isPartOf: { '@type': 'WebSite', '@id': 'https://www.goodsoncountry.com/#website', name: 'Goods on Country' },
  mentions: [
    { '@type': 'Organization', name: 'Centrecorp Foundation', url: 'https://www.centrecorpfoundation.com.au/' },
    { '@type': 'Organization', name: 'Oonchiumpa Consultancy & Services' },
    { '@type': 'Place', name: 'Utopia Homelands' },
  ],
};

const videoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Oonchiumpa Good News Story video',
  description:
    'Community story video connected to the Goods on Country, A Curious Tractor, Oonchiumpa and Centrecorp Foundation Utopia Homelands bed delivery record.',
  thumbnailUrl: ['https://www.goodsoncountry.com/video/partners/centrecorp/utopia-good-news-full-poster.jpg'],
  uploadDate: '2026-05-18T18:00:00+09:30',
  duration: 'PT1M13S',
  contentUrl: 'https://www.goodsoncountry.com/video/partners/centrecorp/utopia-good-news-full.mp4',
  url: PAGE_URL,
  publisher: { '@type': 'Organization', '@id': 'https://www.goodsoncountry.com/#organization', name: 'Goods on Country' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Goods on Country', item: 'https://www.goodsoncountry.com' },
    { '@type': 'ListItem', position: 2, name: 'Partners', item: 'https://www.goodsoncountry.com/partner' },
    { '@type': 'ListItem', position: 3, name: 'Centrecorp Foundation Partnership', item: PAGE_URL },
  ],
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function CentrecorpPartnershipPage() {
  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={videoJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <CentrecorpStory />
    </>
  );
}
