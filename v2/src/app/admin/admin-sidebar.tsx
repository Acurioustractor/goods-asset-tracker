'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { ADMIN_ROUTE_DIRECTORY } from '@/lib/data/admin-routes';
import {
  Map as MapIcon,
  MapPin,
  Image as ImageIcon,
  CircleDollarSign,
  HandCoins,
  Factory,
  KanbanSquare,
  DoorOpen,
  ReceiptText,
  Quote,
  Sun,
  ClipboardList,
  Truck,
  Radio,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Search,
  MoreHorizontal,
  CornerDownLeft,
  CornerDownRight,
  Users,
  Route,
} from 'lucide-react';

type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }> };
type NavGroup = { group: string; items: NavItem[] };

// Consolidated nav (2026-07-20). The 58-route admin collapses into three doors:
//   Cockpit  = the daily fronts (map-first, one per product of the redesign)
//   Funder   = the sendable / gated surfaces
//   Field    = phone-first ops tools
// Everything else stays reachable through the More drawer and ⌘K until each
// front absorbs it as a tab. Sweep + keep/fold/retire table:
// wiki/outputs/2026-07-20-admin-see-do-public-sweep.md
/**
 * THE ADMIN IS A LIST OF THINGS YOU CAN DO. Everything else is findable, and nothing else is on
 * the screen.
 *
 * Ben, 17 September 2026, twice, and the second time was the one that landed:
 *   "we need a full rethink of the sidebar and data, it is a mess and all over the place"
 *   "I don't want 74 things. I want a simple and powerful system with a list of important
 *    actions we can do."
 *
 * The first rewrite regrouped 52 links into 24 and changed nothing that mattered, because a
 * shorter map of pages is still a map of pages. Nobody opens an admin to visit a page. They open
 * it to do one of about ten things.
 *
 * So the sidebar is ten verbs. Each one goes to the surface that does that job, and the surface
 * is often a hub with its own tabs, which is where the other sixty routes live.
 *
 * FINDING A SPECIFIC THING IS ⌘K, and it searches the records themselves: every
 * asset, community, contact, storyteller, and every place the registry knows that has no page
 * yet. About 850 rows. Looking for GB0-156-40 or Gapuwiyak or Dianne Stokes is one keystroke and
 * a name, and you never have to know which page lists that kind of thing.
 *
 * WHAT IS NOT HERE. No route directory link, no More drawer, no second copy of the same URL under
 * two names. /admin#routes still lists all 74 with their status for the once a month that
 * question comes up.
 */
const navigation: NavGroup[] = [
  {
    group: 'Do',
    items: [
      { name: 'Run the day',        href: '/admin/today',          icon: Sun },
      { name: 'Record a bed',       href: '/admin/assets',         icon: ClipboardList },
      { name: 'Plan a trip',        href: '/admin/bed-preflight',  icon: Truck },
      { name: 'Find a buyer',       href: '/admin/procurement',    icon: HandCoins },
      { name: 'Move the raise',     href: '/admin/deals',          icon: KanbanSquare },
      { name: 'Answer a funder',    href: '/admin/reports',        icon: ReceiptText },
      { name: 'Clear a voice',      href: '/admin/consent',        icon: ShieldCheck },
      { name: 'Check the fleet',    href: '/admin/fleet',          icon: Radio },
      { name: 'Make a bed',         href: '/admin/facility',       icon: Factory },
    ],
  },
  {
    group: 'Look at',
    items: [
      { name: 'A community',        href: '/admin/communities',    icon: MapPin },
      { name: 'A person',           href: '/admin/people',         icon: Users },
      { name: 'The money',          href: '/admin/cost-model',     icon: CircleDollarSign },
      { name: 'The media',          href: '/admin/media-library',  icon: ImageIcon },
      { name: 'Everything',         href: '/admin',                icon: MapIcon },
    ],
  },
];

/**
 * ⌘K reaches every route, and takes its list from ADMIN_ROUTE_DIRECTORY.
 *
 * It used to run off a hand-kept array beside the sidebar, which is how fifteen routes built
 * since July became unreachable from anywhere. The directory is guarded by
 * scripts/check-admin-routes.mjs, which fails the build when a route exists and is not declared,
 * so sourcing ⌘K from it means a new route is jumpable the moment it is declared and can never
 * fall behind again.
 *
 * Routes marked `stale` or `one-off` are still here. Somebody looking for the Alice fill wizard
 * by name should find it; they just should not have to scroll past it every day.
 */
const ALL_ROUTES: NavItem[] = (() => {
  const seen = new Set<string>();
  const out: NavItem[] = [];
  for (const item of navigation.flatMap((g) => g.items)) {
    seen.add(item.href);
    out.push(item);
  }
  for (const group of ADMIN_ROUTE_DIRECTORY) {
    for (const r of group.routes) {
      if (seen.has(r.href)) continue;
      seen.add(r.href);
      out.push({ name: r.name, href: r.href, icon: CornerDownRight });
    }
  }
  return out;
})();

/**
 * ⌘K FINDS THINGS, and routes come second.
 *
 * Ben, 17 September 2026: fewer routes, and a concrete way to find something that means
 * something and is connected to the actual data. Route names were never that. Nobody looks for
 * "Communities". They look for Tennant Creek, or Dianne Stokes, or GB0-156-40, and searching 74
 * page titles meant knowing which page listed the thing, going there, and searching again.
 *
 * /api/admin/search returns the records themselves, about 850 of them: every asset, community,
 * contact, storyteller and every place the registry knows that has no page yet. Fetched once on
 * first open, searched in the browser, so there is no round trip per keystroke.
 */
interface Found {
  key: string;
  label: string;
  sub: string;
  href: string;
  kind: string;
}

const KIND_LABEL: Record<string, string> = {
  community: 'place', storyteller: 'voice', person: 'person',
  asset: 'asset', place: 'place', route: 'page',
};

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [records, setRecords] = useState<Found[] | null>(null);

  // One fetch, the first time the palette is opened in a session.
  useEffect(() => {
    if (!open || records !== null) return;
    let cancelled = false;
    fetch('/api/admin/search')
      .then((r) => (r.ok ? r.json() : { records: [] }))
      .then((d: { records: { kind: string; label: string; sub: string; href: string }[] }) => {
        if (cancelled) return;
        setRecords(d.records.map((r, i) => ({ ...r, key: `${r.kind}-${r.href}-${i}` })));
      })
      .catch(() => { if (!cancelled) setRecords([]); });
    return () => { cancelled = true; };
  }, [open, records]);

  const routeRecords: Found[] = useMemo(
    () => ALL_ROUTES.map((r) => ({ key: `route-${r.href}`, label: r.name, sub: r.href, href: r.href, kind: 'route' })),
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return routeRecords;
    // Records first, because a page is what you settle for when the thing is not listed.
    const hay = [...(records ?? []), ...routeRecords];
    const starts: Found[] = [];
    const contains: Found[] = [];
    for (const r of hay) {
      const label = r.label.toLowerCase();
      if (label.startsWith(q)) starts.push(r);
      else if (label.includes(q) || r.sub.toLowerCase().includes(q)) contains.push(r);
    }
    return [...starts, ...contains].slice(0, 40);
  }, [query, records, routeRecords]);

  const go = useCallback(
    (href: string) => {
      onClose();
      setQuery('');
      router.push(href);
    },
    [onClose, router],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active].href); }
            }}
            placeholder="Find a place, a person, a bed, a page…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] font-semibold text-muted-foreground">esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted-foreground">
              Nothing matches “{query}”{records === null ? ', and the records are still loading' : ''}.
            </li>
          )}
          {results.map((r, i) => (
            <li key={r.key}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r.href)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm ${
                  i === active ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
              >
                <span className="w-12 shrink-0 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {KIND_LABEL[r.kind] ?? r.kind}
                </span>
                <span className="min-w-0 flex-1 truncate">{r.label}</span>
                <span className="max-w-[45%] truncate text-[11px] text-muted-foreground">{r.sub}</span>
                {i === active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ⌘K / Ctrl+K opens the palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/');

  const renderNavContent = () => (
    <div className="admin-sidebar-scroll flex h-full flex-col overflow-y-auto bg-card border-r px-4 pb-4 pt-6">
      {/* Brand */}
      <div className="flex shrink-0 items-start justify-between px-2">
        <div className="flex flex-col leading-tight">
          <span className="font-display text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            <span className="text-primary">Goods</span>
          </span>
          <span className="text-xs text-muted-foreground">on Country · admin</span>
        </div>
        <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ⌘K pill */}
      <button
        onClick={() => setPaletteOpen(true)}
        className="mt-4 flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground hover:border-primary/40 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5" /> Jump anywhere
        </span>
        <kbd className="text-[11px] font-semibold">⌘K</kbd>
      </button>

      <nav className="mt-5 flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-5">
          {navigation.map((group) => (
            <li key={group.group}>
              <div className="px-2 text-[10.5px] font-bold leading-6 text-muted-foreground uppercase tracking-[0.14em] mb-1">
                {group.group}
              </div>
              <ul role="list" className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center gap-x-3 rounded-lg px-2.5 py-1.5 text-sm leading-6 font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          <li className="px-2.5 pt-3">
            <p className="text-[10px] leading-snug text-muted-foreground">
              Looking for a bed, a place or a person? Press ⌘K. It searches the records themselves.
            </p>
          </li>

          {/* Footer */}
          <li className="mt-auto pt-6">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden />
              <div className="leading-tight">
                <div className="text-xs font-semibold text-emerald-900">Canon in sync</div>
                {/* Derived. This badge claims "Canon in sync" while showing hardcoded
                    figures, so it read 20 washers against a canon of 22. */}
                <div className="text-[11px] text-emerald-800/80 tabular-nums">
                  {CANONICAL_ASSETS.bedsDeployed} · {CANONICAL_ASSETS.stretchBedsDeployed} · {CANONICAL_ASSETS.washersInCommunity} · {CANONICAL_ASSETS.communitiesServed}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-3 px-2 py-2 text-sm font-medium text-muted-foreground border-t">
              <span className="truncate">{userEmail}</span>
            </div>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="group flex w-full items-center gap-x-3 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                Sign Out
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 shadow-sm sm:px-6 lg:px-8 md:hidden">
        <div className="flex text-lg tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          <span className="text-primary mr-1 font-bold">Goods</span> on Country
        </div>
        <button type="button" className="-m-2.5 p-2.5 text-muted-foreground" onClick={() => setMobileMenuOpen(true)}>
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="relative z-50 md:hidden">
          <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1 transform transition shadow-2xl">
              {renderNavContent()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col shadow-xl">
        {renderNavContent()}
      </div>
    </>
  );
}
