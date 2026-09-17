'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { ADMIN_ROUTE_DIRECTORY } from '@/lib/data/admin-routes';
import {
  Map as MapIcon,
  MapPin,
  CircleDollarSign,
  HandCoins,
  KanbanSquare,
  DoorOpen,
  Quote,
  ClipboardList,
  Radio,
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

/**
 * THE SIDEBAR IS THE THINGS THE BUSINESS IS MADE OF, NAMED PLAINLY.
 *
 * Ben, 17 September 2026, walking it: "those sidebar titles are shit and confusing, also still
 * too many routes, still confusing and all over the place."
 *
 * The version he was looking at was fifteen verbs. Verbs read well in a sentence and badly in a
 * list: "Record a bed" was the asset register and "Make a bed" was the facility, so the two most
 * important surfaces in the business had names you could swap without noticing. "Check the fleet"
 * was washing machines. "Run the day" and "Everything" were both the home screen.
 *
 * Nine nouns instead. Each one names a thing that actually exists, and each one is a hub whose
 * tabs hold the surfaces that used to be their own sidebar line:
 *
 *   Beds             register, production, scans, signals, trip preflight, installs
 *   Washing machines the fleet, quarterly
 *   Communities      the per-place register and the pathways
 *   People           contacts and relationships
 *   Stories          voices, the consent gate, quote cards, field notes, media
 *   Sales            orders, requests, the procurement desk
 *   Funding          the raise, funders, LOIs, funder and impact reports
 *   Costs            the cost model, Xero reconciliation, trip receipts
 *
 * FINDING A SPECIFIC THING IS STILL ⌘K, and it searches the records themselves: about 850 rows,
 * every asset, community, contact and storyteller, plus every route. Looking for GB0-156-40 or
 * Gapuwiyak or Dianne Stokes is one keystroke and a name.
 *
 * WHAT IS NOT HERE. No More drawer, no route directory link, no second copy of one URL under two
 * names. /admin#routes lists every route with the hub it lives in, for the once a month that
 * question comes up.
 */
/**
 * A DOOR'S CHILDREN COME FROM THE ROUTE DIRECTORY, AND THEY OPEN IN THE SIDEBAR.
 *
 * The first attempt put them in a strip across the top of every page. Ben, immediately: "this
 * double top bar is shit and hard to use." He was right, and the reason is a real distinction I
 * had collapsed. /admin/voices already has its own tabs (Overview, Registry, Quotes) and those
 * are VIEWS OF THAT PAGE. Consent gate and Quote cards are SEPARATE ROUTES. Stacking the two
 * kinds of tab in two rows made a page look like it had eighteen tabs, and made the top of every
 * screen scroll sideways.
 *
 * Views stay on the page. Routes live in the sidebar, under the door that owns them, and only
 * the door you are standing in opens. Vertical space costs nothing here; horizontal space at the
 * top of a working page costs everything.
 */
function childrenOf(href: string) {
  const group = ADMIN_ROUTE_DIRECTORY.find((g) => g.routes.some((r) => r.href === href));
  if (!group) return [];
  return group.routes.filter((r) => r.href !== href);
}

const navigation: NavGroup[] = [
  {
    group: 'The work',
    items: [
      { name: 'Home',             href: '/admin',             icon: MapIcon },
      { name: 'Beds',             href: '/admin/assets',      icon: ClipboardList },
      { name: 'Washing machines', href: '/admin/fleet',       icon: Radio },
      { name: 'Communities',      href: '/admin/communities', icon: MapPin },
      { name: 'People',           href: '/admin/people',      icon: Users },
      { name: 'Stories',          href: '/admin/voices',      icon: Quote },
    ],
  },
  {
    group: 'The money',
    items: [
      { name: 'Sales',            href: '/admin/orders',      icon: HandCoins },
      { name: 'Funding',          href: '/admin/deals',       icon: KanbanSquare },
      { name: 'Costs',            href: '/admin/cost-model',  icon: CircleDollarSign },
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

  // Standing anywhere in a door's section, including on one of its children, opens that door.
  const inSection = (href: string) =>
    isActive(href) ||
    childrenOf(href).some((r) => pathname === r.href || pathname.startsWith(r.href + '/'));

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

                    {/* Only the door you are standing in opens. */}
                    {inSection(item.href) && childrenOf(item.href).length > 0 && (
                      <ul role="list" className="mt-0.5 mb-1.5 ml-[1.45rem] space-y-px border-l pl-3">
                        {childrenOf(item.href).map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              aria-current={pathname === child.href ? 'page' : undefined}
                              className={`block rounded-md px-2 py-1 text-[13px] leading-5 transition-colors ${
                                pathname === child.href
                                  ? 'font-semibold text-primary'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
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
