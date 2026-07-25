'use client';

// A front's tab strip. Each Cockpit front absorbs its sibling tools as tabs
// (the sidebar comment: tools stay in More / ⌘K "until each front absorbs it as
// a tab"). Additive navigation only — no route is deleted; every tool keeps its
// own URL. Mirrors the tab pattern the Voices hub already uses.
// Fold map: wiki/outputs/2026-07-20-admin-see-do-public-sweep.md

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type HubTab = { label: string; href: string };

export function AdminHubTabs({ tabs }: { tabs: HubTab[] }) {
  const pathname = usePathname();
  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b pb-px"
      role="tablist"
      aria-label="Section tabs"
    >
      {tabs.map((t) => {
        // Exact match, or a nested child (e.g. /admin/products/story under /admin/products),
        // but never let the shortest href swallow every sibling.
        const active =
          pathname === t.href ||
          (pathname.startsWith(t.href + '/') && !tabs.some((o) => o !== t && o.href.startsWith(t.href + '/') && (pathname === o.href || pathname.startsWith(o.href + '/'))));
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? 'page' : undefined}
            className={`whitespace-nowrap rounded-t-lg px-3.5 py-2 text-sm ${
              active
                ? 'border border-b-0 bg-background font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
