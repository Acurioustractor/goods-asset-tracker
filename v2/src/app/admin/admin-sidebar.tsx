'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Map as MapIcon,
  MapPin,
  Image as ImageIcon,
  CircleDollarSign,
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
  ChevronDown,
  ChevronRight,
  CornerDownLeft,
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
const navigation: NavGroup[] = [
  {
    group: 'Cockpit',
    items: [
      { name: 'The Map',           href: '/admin',                icon: MapIcon },
      { name: 'Communities',       href: '/admin/communities',    icon: MapPin },
      { name: 'Media Room',        href: '/admin/media-library',  icon: ImageIcon },
      { name: 'Money',             href: '/admin/cost-model',     icon: CircleDollarSign },
      { name: 'Products & Plant',  href: '/admin/facility',       icon: Factory },
      { name: 'Pipeline',          href: '/admin/pipeline',       icon: KanbanSquare },
    ],
  },
  {
    group: 'Funder room',
    items: [
      { name: 'Start Here',   href: '/investors',           icon: DoorOpen },
      { name: 'Cost Story',   href: '/admin/cost-model',    icon: ReceiptText },
      { name: 'Voice Impact', href: '/admin/voice-impact',  icon: Quote },
    ],
  },
  {
    group: 'Field',
    items: [
      { name: 'Today',    href: '/admin/today',          icon: Sun },
      { name: 'Register', href: '/admin/assets',         icon: ClipboardList },
      { name: 'Trips',    href: '/admin/bed-preflight',  icon: Truck },
      { name: 'Fleet',    href: '/admin/fleet',          icon: Radio },
      { name: 'Consent',  href: '/admin/consent',        icon: ShieldCheck },
    ],
  },
];

// More drawer + ⌘K target list — still-active routes not yet absorbed into a
// front. Grouped loosely by the front that will eventually own each.
const moreNavigation: NavItem[] = [
  // → Communities
  { name: 'Atlas (full map)',   href: '/admin/atlas',             icon: MapIcon },
  { name: 'People',             href: '/admin/people',            icon: MapPin },
  // → Media Room
  { name: 'Canon board',        href: '/admin/canon',             icon: ImageIcon },
  { name: 'Visuals',            href: '/admin/system-visuals',    icon: ImageIcon },
  { name: 'Media gaps',         href: '/admin/media-gaps',        icon: ImageIcon },
  { name: 'Quote cards',        href: '/admin/quote-cards',       icon: Quote },
  { name: 'Dashboard images',   href: '/admin/dashboard-images',  icon: ImageIcon },
  // → Voices (consent wing)
  { name: 'Voices hub',         href: '/admin/voices',            icon: Quote },
  { name: 'Registry',           href: '/admin/storytellers',      icon: Quote },
  { name: 'Story atlas',        href: '/admin/story-atlas',       icon: Quote },
  { name: 'Quotes',             href: '/admin/quotes',            icon: Quote },
  { name: 'Stories (EL)',       href: '/admin/el-stories',        icon: Quote },
  { name: 'Storytellers (EL)',  href: '/admin/el-storytellers',   icon: Quote },
  { name: 'Community stories',  href: '/admin/community-stories', icon: Quote },
  { name: 'Field notes',        href: '/admin/field-notes',       icon: Quote },
  // → Money
  { name: 'Xero recon',         href: '/admin/xero-reconciliation', icon: CircleDollarSign },
  { name: 'Orders',             href: '/admin/orders',            icon: CircleDollarSign },
  { name: 'Requests',           href: '/admin/requests',          icon: CircleDollarSign },
  { name: 'Trip receipts',      href: '/admin/trip-receipts',     icon: ReceiptText },
  { name: 'Funders',            href: '/admin/funders',           icon: CircleDollarSign },
  { name: 'Funder reports',     href: '/admin/reports',           icon: ReceiptText },
  { name: 'Impact reports',     href: '/admin/reports/impact',    icon: ReceiptText },
  // → Pipeline
  { name: 'Deals (Kanban)',     href: '/admin/deals',             icon: KanbanSquare },
  { name: 'LOI tracker',        href: '/admin/loi-tracker',       icon: KanbanSquare },
  // → Products & Plant
  { name: 'Production',         href: '/admin/production',        icon: Factory },
  // → Field
  { name: 'Bed signals',        href: '/admin/bed-signals',       icon: Radio },
  { name: 'Scans',              href: '/admin/scans',             icon: Radio },
  { name: 'Install',            href: '/admin/install-bulk',      icon: Truck },
  { name: 'Install checklist',  href: '/admin/install-checklist', icon: ClipboardList },
  { name: 'Operating systems',  href: '/admin/operating-systems', icon: Radio },
  { name: 'Roadmap',            href: '/admin/roadmap',           icon: ClipboardList },
  // Pitch + comms
  { name: 'Pitch cockpit',      href: '/admin/pitch-cockpit',     icon: ImageIcon },
  { name: 'Deck builder',       href: '/admin/deck-builder',      icon: ImageIcon },
  { name: 'Site content',       href: '/admin/site-content',      icon: ReceiptText },
  { name: 'Content library',    href: '/admin/library',           icon: ImageIcon },
  { name: 'Reach out',          href: '/admin/reach-out',         icon: Radio },
  // Route review board
  { name: 'Route review',       href: '/admin/route-review',      icon: KanbanSquare },
];

// Flat list of everything ⌘K can jump to (fronts + more), de-duplicated by href.
const ALL_ROUTES: NavItem[] = (() => {
  const seen = new Set<string>();
  const out: NavItem[] = [];
  for (const item of [...navigation.flatMap((g) => g.items), ...moreNavigation]) {
    if (seen.has(item.href)) continue;
    seen.add(item.href);
    out.push(item);
  }
  return out;
})();

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ROUTES;
    // subsequence fuzzy match on the name
    return ALL_ROUTES.filter((r) => {
      const name = r.name.toLowerCase();
      let i = 0;
      for (const ch of q) {
        i = name.indexOf(ch, i);
        if (i === -1) return false;
        i += 1;
      }
      return true;
    });
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

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
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active].href); }
            }}
            placeholder="Jump anywhere…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] font-semibold text-muted-foreground">esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted-foreground">No routes match “{query}”.</li>
          )}
          {results.map((r, i) => (
            <li key={r.href}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => go(r.href)}
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm text-left ${
                  i === active ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
              >
                <r.icon className="h-4 w-4 shrink-0 opacity-70" />
                <span className="flex-1">{r.name}</span>
                <span className="text-[11px] text-muted-foreground">{r.href}</span>
                {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" />}
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
  const inMore = moreNavigation.some((m) => pathname === m.href || pathname.startsWith(m.href + '/'));
  const [moreOpen, setMoreOpen] = useState(inMore);

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

          {/* More drawer */}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className="flex w-full items-center justify-between px-2 text-[10.5px] font-bold leading-6 text-muted-foreground uppercase tracking-[0.14em] mb-1 hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <MoreHorizontal className="h-3.5 w-3.5" /> More
                <span className="text-[10px] normal-case tracking-normal">({moreNavigation.length})</span>
              </span>
              {moreOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
            {moreOpen && (
              <ul role="list" className="space-y-0.5">
                {moreNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center gap-x-3 rounded-lg px-2.5 py-1.5 text-sm leading-6 font-medium transition-all ${
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Footer */}
          <li className="mt-auto pt-6">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden />
              <div className="leading-tight">
                <div className="text-xs font-semibold text-emerald-900">Canon in sync</div>
                <div className="text-[11px] text-emerald-800/80 tabular-nums">540 · 177 · 20 · 11</div>
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
