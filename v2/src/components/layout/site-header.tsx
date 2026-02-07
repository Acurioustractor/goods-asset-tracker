'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartButton } from '@/components/cart';
import { AuthNavItem } from '@/components/layout/auth-nav-item';

const navigation = [
  { name: 'The Stretch Bed', href: '/shop/stretch-bed-single' },
  { name: 'How It\'s Made', href: '/process' },
  { name: 'Our Story', href: '/story' },
  { name: 'Community', href: '/community' },
  { name: 'Dashboard', href: '/dashboard' },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">Goods</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">on Country</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
          <AuthNavItem className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary" />
        </div>

        {/* CTA Buttons & Cart */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <Button size="sm" asChild>
            <Link href="/shop/stretch-bed-single">Buy Now</Link>
          </Button>
          <CartButton />
        </div>

        {/* Mobile Cart & Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <CartButton />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <AuthNavItem
                className="text-lg font-medium text-foreground/80 transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="mt-4 flex flex-col gap-3">
                <Button asChild>
                  <Link href="/shop/stretch-bed-single" onClick={() => setMobileMenuOpen(false)}>
                    Buy Now
                  </Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
