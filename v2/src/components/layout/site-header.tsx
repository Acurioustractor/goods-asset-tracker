'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CartButton } from '@/components/cart';

/**
 * Site header, rebuilt 2026-08-06 (Ben: the old top menu never sat right, and the
 * 300px mobile sheet was cramped). Desktop: a short nav in reading order plus the two
 * CTAs. Mobile: a FULL-SCREEN overlay — big type a thumb cannot miss, the primary
 * pages first, then the same four doors the homepage ends on, so wherever someone is
 * they can reach their next step in one tap.
 */

type NavItem = { name: string; href: string; subtitle?: string };

const navigation: NavItem[] = [
  { name: 'The Stretch Bed', href: '/shop/stretch-bed-single' },
  { name: 'How it’s made', href: '/process' },
  { name: 'Communities', href: '/communities' },
  { name: 'Our story', href: '/story' },
  { name: 'Invest', href: '/invest' },
  { name: 'Contact', href: '/contact' },
];

/** The same four audience doors the homepage closes on (home.ts HOME_DOORS order).
    Colours via the canonical CSS vars; ink text on the light tones for contrast. */
const menuDoors = [
  { name: 'Buy a bed', href: '/shop/stretch-bed-single', color: 'var(--goods-terracotta)', text: '#FFFFFF' },
  { name: 'Sponsor a bed', href: '/sponsor', color: 'var(--goods-gold)', text: 'var(--goods-ink)' },
  { name: 'Want this where you are?', href: '/communities', color: 'var(--goods-sage)', text: 'var(--goods-ink)' },
  { name: 'Back the making', href: '/invest', color: 'var(--goods-teal)', text: '#FFFFFF' },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the overlay on navigation and lock body scroll while it is open.
  useEffect(() => setMobileMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Goods on Country home">
          <Image
            src="/brand/canonical/goods-on-country-primary-ink.png"
            alt="Goods on Country"
            width={657}
            height={447}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-7">
          {navigation.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname?.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium transition-colors hover:text-goods-terracotta ${
                  active ? 'text-goods-terracotta' : 'text-foreground/70'
                }`}
              >
                {item.name}
                {active && (
                  <span className="absolute -bottom-[22px] left-0 right-0 h-0.5 bg-goods-terracotta" aria-hidden />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTAs & cart */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <Button size="sm" className="bg-goods-terracotta text-white hover:bg-goods-terracotta/90" asChild>
            <Link href="/shop/stretch-bed-single">Buy a bed</Link>
          </Button>
          <CartButton />
        </div>

        {/* Mobile: cart + menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <CartButton />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7h16.5M3.75 12h16.5m-16.5 5h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-goods-cream lg:hidden" role="dialog" aria-modal="true">
          <div className="flex h-16 items-center justify-between border-b border-goods-ink/10 px-4">
            <Link href="/" aria-label="Goods on Country home" onClick={() => setMobileMenuOpen(false)}>
              <Image
                src="/brand/canonical/goods-on-country-primary-ink.png"
                alt="Goods on Country"
                width={657}
                height={447}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-md text-goods-ink hover:bg-black/5"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-between overflow-y-auto px-6 pb-10 pt-8">
            <div className="space-y-1">
              {navigation.map((item, i) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-3xl font-semibold text-goods-ink transition-colors hover:text-goods-terracotta"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)', transitionDelay: `${i * 15}ms` }}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-goods-sub">
                Where do you want to go?
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {menuDoors.map((door) => (
                  <Link
                    key={door.name}
                    href={door.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl px-4 py-4 text-sm font-semibold leading-snug"
                    style={{ backgroundColor: door.color, color: door.text }}
                  >
                    {door.name}
                  </Link>
                ))}
              </div>
              <p className="mt-6 text-sm text-goods-sub">
                hello@goodsoncountry.com
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
