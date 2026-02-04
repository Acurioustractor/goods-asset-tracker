// Goods on Country - v2 Next.js App
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ImpactBanner } from '@/components/layout/impact-banner';
import { CartProvider } from '@/lib/cart';
import { CartDrawer } from '@/components/cart';
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
    default: 'Goods on Country | Beds That Change Lives',
    template: '%s | Goods on Country',
  },
  description:
    'Goods on Country delivers essential items like beds and washing machines to remote Australian Indigenous communities. Shop to support or sponsor a bed today.',
  keywords: [
    'beds',
    'Indigenous communities',
    'social enterprise',
    'Australia',
    'charity',
    'remote communities',
    'bed delivery',
    'washing machines',
  ],
  authors: [{ name: 'Goods on Country' }],
  openGraph: {
    title: 'Goods on Country | Beds That Change Lives',
    description:
      'Delivering essential items to remote Australian Indigenous communities. Every purchase makes a difference.',
    type: 'website',
    locale: 'en_AU',
    siteName: 'Goods on Country',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goods on Country | Beds That Change Lives',
    description:
      'Delivering essential items to remote Australian Indigenous communities.',
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
            <SiteHeader />
            <ImpactBanner />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
