import Link from 'next/link';

const footerLinks = {
  shop: [
    { name: 'The Stretch Bed', href: '/shop/stretch-bed-single' },
    { name: 'Washing Machines', href: '/partner' },
    { name: 'Basket Bed (Open Source)', href: '/basket-bed-plans' },
  ],
  about: [
    { name: 'Our Story', href: '/story' },
    { name: 'How It\'s Made', href: '/process' },
    { name: 'Communities', href: '/community' },
    { name: 'Impact', href: '/impact' },
  ],
  support: [
    { name: 'Contact', href: '/contact' },
    { name: 'Sponsor a Bed', href: '/sponsor' },
    { name: 'My Items', href: '/my-items' },
    { name: 'Community Stories', href: '/stories' },
    { name: 'FAQ', href: '/support' },
  ],
  partners: [
    { name: 'Partner With Us', href: '/partner' },
    { name: 'Pitch Deck', href: '/pitch' },
    { name: 'Impact & Evidence', href: '/impact' },
    { name: 'Community Partners', href: '/community' },
    { name: 'Media Inquiries', href: '/contact' },
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
            <form
              action="/api/contact"
              method="POST"
              className="flex flex-col sm:flex-row gap-3"
            >
              <input type="hidden" name="type" value="newsletter" />
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1">
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
                href="https://facebook.com/goodsoncountry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/goodsoncountry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h3 className="font-semibold text-foreground">Shop</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link) => (
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
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link) => (
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
            <h3 className="font-semibold text-foreground">Partners</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.partners.map((link) => (
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
