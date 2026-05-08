// Goods on Country - v2 Next.js App
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import {
  ConditionalSiteHeader,
  ConditionalSiteFooter,
  ConditionalImpactBanner,
} from '@/components/layout/conditional-chrome';
import { CartProvider } from '@/lib/cart';
import { CartDrawer } from '@/components/cart';

import { Analytics } from '@vercel/analytics/react';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Goods on Country | Built with communities, not for them.',
    template: '%s | Goods on Country',
  },
  description:
    'Goods on Country builds Stretch Beds and Pakkimjalki Kari washing machines with First Nations communities across remote Australia. Co-designed, made On-Country, manufacturing transferred to community ownership.',
  keywords: [
    'Stretch Bed',
    'Pakkimjalki Kari',
    'First Nations',
    'social enterprise',
    'remote communities',
    'On-Country manufacturing',
    'recycled HDPE plastic',
    'community ownership',
    'co-design',
  ],
  authors: [{ name: 'Goods on Country' }],
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/brand/favicon.svg',
  },
  openGraph: {
    title: 'Goods on Country | Built with communities, not for them.',
    description:
      'A First Nations social enterprise designing essential goods with remote Indigenous communities. Stretch Beds and Pakkimjalki Kari washing machines, co-designed and made On-Country.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'Goods on Country',
    url: 'https://www.goodsoncountry.com',
    images: [
      {
        url: '/brand/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Goods on Country. Built with communities, not for them.',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goods on Country | Built with communities, not for them.',
    description:
      'A First Nations social enterprise designing essential goods with remote Indigenous communities.',
    images: ['/brand/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <ConditionalSiteHeader />
            <ConditionalImpactBanner />
            <main className="flex-1">{children}</main>
            <ConditionalSiteFooter />
          </div>
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
// Force deployment Sat  7 Feb 2026 10:57:48 AEST
