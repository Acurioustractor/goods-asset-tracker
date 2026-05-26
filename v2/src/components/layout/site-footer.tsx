'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FeedbackWidget } from '@/components/feedback/feedback-widget';
import { NewsletterForm } from '@/components/layout/newsletter-form';

const backedByPartners = [
  {
    name: 'Snow Foundation',
    src: '/images/partners/snow-foundation-mono.png',
    href: 'https://www.snowfoundation.org.au',
    width: 2194,
    height: 1056,
  },
  {
    name: 'Centrecorp Foundation',
    src: '/images/partners/centrecorp-foundation.jpg',
    href: '/partners/centrecorp',
    width: 400,
    height: 240,
  },
  {
    name: 'The Funding Network',
    src: '/images/partners/tfn.svg',
    href: 'https://www.thefundingnetwork.com.au',
    width: 1256,
    height: 445,
  },
  {
    name: 'FRRR',
    src: '/images/partners/frrr.png',
    href: 'https://frrr.org.au',
    width: 1024,
    height: 491,
  },
  {
    name: 'AMP Foundation',
    src: '/images/partners/amp-foundation.png',
    href: 'https://ampfoundation.com.au',
    width: 1024,
    height: 272,
  },
  {
    name: 'QBE Foundation',
    src: '/images/partners/qbe.png',
    href: 'https://www.qbe.com/sustainability/qbe-foundation',
    width: 800,
    height: 220,
  },
];

const communityPartners = [
  {
    name: 'Oonchiumpa Consultancy',
    src: '/images/partners/oonchiumpa.png',
    href: 'https://oonchiumpa.com.au',
    width: 560,
    height: 350,
  },
];

const footerLinks = {
  product: [
    { name: 'The Stretch Bed', href: '/shop/stretch-bed-single' },
    { name: 'How It\'s Made', href: '/process' },
    { name: 'Washing Machines', href: '/shop/washing-machine' },
  ],
  about: [
    { name: 'Our Story', href: '/story' },
    { name: 'Communities', href: '/community' },
    { name: 'Impact', href: '/impact' },
    { name: 'Centrecorp Partnership', href: '/partners/centrecorp' },
    { name: 'Gallery', href: '/gallery' },
  ],
  connect: [
    { name: 'Partner With Us', href: '/partner' },
    { name: 'Sponsor a Bed', href: '/sponsor' },
    { name: 'Support / FAQ', href: '/support' },
    { name: 'Contact', href: '/contact' },
  ],
};

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t bg-muted/30">
      {/* Newsletter */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Stay close to the story</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Updates on new beds, new communities, and what&apos;s happening On-Country. No spam, ever.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block" aria-label="Goods on Country home">
              <Image
                src="/brand/logos/goods-stacked-black.svg"
                alt="Goods on Country"
                width={180}
                height={120}
                className="h-20 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Community-designed health hardware. Manufactured On-Country. Made by community, made for community.
            </p>
            {/* Social Links */}
            <div className="mt-4 flex gap-4">
              <a
                href="https://www.linkedin.com/company/a-curious-tractor/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">About</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Connect</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partner strip */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-12 sm:gap-y-6">
            <PartnerGroup label="Backed by" partners={backedByPartners} />
            <PartnerGroup label="Community partner" partners={communityPartners} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Goods on Country acknowledges the Traditional Owners of the lands on which we live
              and work. We pay our respects to Elders past, present, and emerging.
            </p>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Goods on Country. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-primary">
                Contact
              </Link>
              <FeedbackWidget />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterPartner = {
  name: string;
  src: string;
  href: string;
  width: number;
  height: number;
};

function PartnerGroup({ label, partners }: { label: string; partners: FooterPartner[] }) {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 opacity-60 transition-opacity hover:opacity-90">
        {partners.map((partner) => {
          const isExternal = partner.href.startsWith('http');
          // Fixed bounding box per logo so every brand renders at the same
          // visual weight regardless of aspect ratio. h-8 × w-28 sits the
          // longest logo (QBE wordmark) without overflow, and lets the
          // narrowest (FRRR mark + text) breathe.
          const wrapClass =
            'flex h-8 w-28 items-center justify-center transition hover:opacity-90';
          const logo = (
            <Image
              src={partner.src}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              className="max-h-full max-w-full object-contain grayscale transition hover:grayscale-0"
            />
          );
          return isExternal ? (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={partner.name}
              title={partner.name}
              className={wrapClass}
            >
              {logo}
            </a>
          ) : (
            <Link
              key={partner.name}
              href={partner.href}
              aria-label={partner.name}
              title={partner.name}
              className={wrapClass}
            >
              {logo}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
