'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PRODUCTION_LINKS = [
  { href: '/production', label: 'Shift Log' },
  { href: '/production/inventory', label: 'Inventory' },
  { href: '/production/journal', label: 'Journal' },
  { href: '/production/progress', label: 'My Progress' },
];

export function ProductionNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 mt-3">
      {PRODUCTION_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-background text-foreground'
                : 'text-background/70 hover:text-background hover:bg-background/10'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
