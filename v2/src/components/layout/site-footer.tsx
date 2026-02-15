import Link from 'next/link';
import { FeedbackWidget } from '@/components/feedback/feedback-widget';
import { NewsletterForm } from '@/components/layout/newsletter-form';

const footerLinks = {
  product: [
    { name: 'The Stretch Bed', href: '/shop/stretch-bed-single' },
    { name: 'How It\'s Made', href: '/process' },
    { name: 'Washing Machines (Coming)', href: '/partner' },
  ],
  about: [
    { name: 'Our Story', href: '/story' },
    { name: 'Communities', href: '/community' },
    { name: 'Impact', href: '/impact' },
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
  return (
    <footer className="border-t bg-muted/30">
      {/* Newsletter */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Join the movement</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get updates on new products, community stories, and farm content.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-primary">Goods</span>
              <span className="block text-sm text-muted-foreground">on Country</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Delivering essential items to remote Australian Indigenous communities.
              Every purchase makes a difference.
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

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8">
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
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary">
                Terms of Service
              </Link>
              <FeedbackWidget />
              <Link href="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
