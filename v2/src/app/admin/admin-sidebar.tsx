'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Truck,
  ShoppingCart,
  Wrench,
  BookOpen,
  Users,
  Menu,
  X,
  LogOut,
  Library,
  Globe,
  Crosshair,
  FileCheck,
  Radar,
  Boxes,
  Send,
  Camera,
  BarChart3,
  Images,
  Receipt,
  Presentation,
  Building2,
  FileSignature,
  ClipboardCheck,
  NotebookPen,
  Calculator,
  PackagePlus,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }> };
type NavGroup = { group: string; items: NavItem[] };

// Musk-5 minimal nav (restructured 2026-05-28 from 35 → 5 top-level + collapsible More).
// Every item must justify its presence: who uses it, how often, what's the outcome.
// 5 hubs, each links to its primary page; sub-pages either tabs inside that page or in More.
const navigation: NavGroup[] = [
  {
    group: 'Today',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Make',
    items: [
      { name: 'Production',  href: '/admin/production', icon: Wrench },
      { name: 'Cost model',  href: '/admin/cost-model', icon: Calculator },
      { name: 'Assets',      href: '/admin/assets',     icon: Library },
    ],
  },
  {
    group: 'Place',
    items: [
      { name: 'Communities',    href: '/admin/communities',    icon: Globe },
      { name: 'Trip preflight', href: '/admin/bed-preflight',  icon: FileCheck },
      { name: 'Install',        href: '/admin/install-bulk',   icon: Camera },
    ],
  },
  {
    group: 'Story',
    items: [
      { name: 'Photos',       href: '/admin/photos',          icon: Images },
      { name: 'Stories (EL)', href: '/admin/el-stories',      icon: BookOpen },
      { name: 'Storytellers', href: '/admin/el-storytellers', icon: Users },
    ],
  },
  {
    group: 'Money',
    items: [
      { name: 'Funders',   href: '/admin/funders',             icon: Building2 },
      { name: 'Deals',     href: '/admin/deals',               icon: Crosshair },
      { name: 'LOI tracker', href: '/admin/loi-tracker',        icon: FileSignature },
      { name: 'Xero recon', href: '/admin/xero-reconciliation', icon: FileCheck },
    ],
  },
];

// "More" drawer — still working routes, just not on the daily nav. Reachable
// via the drawer below or by direct URL. Hidden by default; click "More" to expand.
//
// Stale 5 (no edits in 3+ months) are kept out of nav entirely — direct URL only:
//   /admin/compassion · /admin/messages · /admin/products · /admin/brand · /admin/team · /admin/announcements
//
// /admin/alice-fill is a one-off wizard for 2026-05-21 trip catch-up — never re-linked.
const moreNavigation: NavItem[] = [
  // Field workflow
  { name: 'Bed signals',     href: '/admin/bed-signals',   icon: Radar },
  { name: 'Install checklist', href: '/admin/install-checklist', icon: ClipboardCheck },
  { name: 'Scans',           href: '/admin/scans',         icon: BarChart3 },
  { name: 'Trip receipts',   href: '/admin/trip-receipts', icon: Receipt },
  { name: 'Field notes',     href: '/admin/field-notes',   icon: NotebookPen },
  // Comms (moved out of daily, used as-needed)
  { name: 'Reach out',       href: '/admin/reach-out',     icon: Send },
  // Funder collateral (Funders is the hub; these are sub-pages)
  { name: 'Funder reports',  href: '/admin/reports',       icon: Presentation },
  { name: 'Deck preview',    href: '/admin/deck',          icon: Presentation },
  // Money detail
  { name: 'Orders',          href: '/admin/orders',        icon: ShoppingCart },
  { name: 'Requests',        href: '/admin/requests',      icon: PackagePlus },
  // Fleet — quarterly
  { name: 'Fleet',           href: '/admin/fleet',         icon: Truck },
  // Content
  { name: 'Library',         href: '/admin/library',       icon: Boxes },
  // Photo browser (Photos hub is canonical)
  { name: 'Browse photos',   href: '/admin/photos-browser', icon: Images },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Auto-expand "More" if the current route lives in there, so the user sees
  // they're inside a More item.
  const inMore = moreNavigation.some((m) => pathname === m.href || pathname.startsWith(m.href + '/'));
  const [moreOpen, setMoreOpen] = useState(inMore);

  const renderNavContent = () => (
    <div className="admin-sidebar-scroll flex h-full flex-col overflow-y-auto bg-slate-900 border-r border-slate-800 px-6 pb-4 pt-6">
      <div className="flex h-12 shrink-0 items-center justify-between">
         <span className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="text-orange-500">Goods</span> Admin
         </span>
         <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
           <X className="h-6 w-6" />
         </button>
      </div>
      <nav className="mt-8 flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-8">
          {navigation.map((group) => (
            <li key={group.group}>
              <div className="text-xs font-semibold leading-6 text-slate-400 uppercase tracking-wider mb-2">
                {group.group}
              </div>
              <ul role="list" className="-mx-2 space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all
                          ${isActive
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}

          {/* More drawer — collapsible. Stale + rarely-used routes live here. */}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-semibold leading-6 text-slate-400 uppercase tracking-wider mb-2 hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <MoreHorizontal className="h-3.5 w-3.5" /> More
                <span className="text-[10px] normal-case tracking-normal text-slate-500">({moreNavigation.length})</span>
              </span>
              {moreOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
            {moreOpen && (
              <ul role="list" className="-mx-2 space-y-1">
                {moreNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all
                          ${isActive
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }
                        `}
                      >
                        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          <li className="mt-auto pt-8">
             <div className="px-2 pt-3 pb-1 text-[10px] uppercase tracking-wider text-slate-500 border-t border-slate-800">
               Archived decks (moved 2026-05-15)
             </div>
             <p className="px-2 pb-2 text-[10px] leading-snug text-slate-600">
               One-shot proposal pages now live in <code>_archive/2026-05-15-admin-decks/</code>.
               See <code>RESTORE.md</code> to bring one back.
             </p>
             <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-medium leading-6 text-slate-400 border-t border-slate-800">
               <span className="truncate">{userEmail}</span>
             </div>
             <form action="/api/auth/signout" method="POST">
               <button
                 type="submit"
                 className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-medium leading-6 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
               >
                 <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
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
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8 md:hidden">
        <div className="flex text-lg font-bold tracking-tight text-gray-900">
            <span className="text-orange-500 mr-1">Goods</span> Admin
        </div>
        <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setMobileMenuOpen(true)}>
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="relative z-50 md:hidden">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
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
