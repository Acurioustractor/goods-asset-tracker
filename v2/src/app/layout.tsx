// Goods on Country - v2 Next.js App
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import {
  ConditionalSiteHeader,
  ConditionalSiteFooter,
  ConditionalImpactBanner,
} from '@/components/layout/conditional-chrome';
import { CartProvider } from '@/lib/cart';
import { CartDrawer } from '@/components/cart';

import { Analytics } from '@vercel/analytics/next';
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

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.goodsoncountry.com'),
  applicationName: 'Goods on Country',
  title: {
    default: 'Goods on Country',
    template: '%s · Goods on Country',
  },
  description:
    'Beds, washing machines, and a manufacturing model that stays with the communities it serves. Made by community. Made for community.',
  keywords: [
    'Stretch Bed',
    'First Nations',
    'remote communities',
    'social enterprise',
    'On-Country manufacturing',
    'recycled plastic',
    'washing machines',
    'Australia',
    'Goods on Country',
    'A Curious Tractor',
    'remote community beds',
    'recycled plastic beds',
    'Central Australia',
  ],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Goods on Country' }],
  creator: 'Goods on Country',
  publisher: 'Goods on Country',
  category: 'Social enterprise',
  openGraph: {
    title: 'Goods on Country',
    description:
      'Beds, washing machines, and a manufacturing model that stays with the communities it serves.',
    url: '/',
    type: 'website',
    locale: 'en_AU',
    siteName: 'Goods on Country',
    images: [
      {
        url: '/images/media-pack/lying-on-stretch-bed.jpg',
        width: 2000,
        height: 1333,
        alt: 'A young man lying full-length on a Stretch Bed on country, the recycled-plastic legs and canvas visible',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goods on Country',
    description:
      'Beds, washing machines, and a manufacturing model that stays with the communities it serves.',
    images: ['/images/media-pack/lying-on-stretch-bed.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
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
      <body className={`${inter.variable} ${playfair.variable} ${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
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
