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
  ],
  authors: [{ name: 'Goods on Country' }],
  openGraph: {
    title: 'Goods on Country',
    description:
      'Beds, washing machines, and a manufacturing model that stays with the communities it serves.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'Goods on Country',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goods on Country',
    description:
      'Beds, washing machines, and a manufacturing model that stays with the communities it serves.',
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
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`} suppressHydrationWarning>
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
