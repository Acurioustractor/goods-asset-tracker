'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Truck,
  Calculator,
  ShoppingCart,
  Kanban,
  Wrench,
  AlertCircle,
  Handshake,
  BookOpen,
  Megaphone,
  Map as MapIcon,
  Lightbulb,
  Users,
  Menu,
  X,
  LogOut,
  Library,
  Globe,
  Network,
  Target,
  TrendingUp,
  Crosshair,
  ShieldCheck,
  BadgeCheck,
  Search,
  Recycle,
  Map as MapIcon2,
  FileCheck,
  Landmark,
  FileText,
  Mail,
} from 'lucide-react';

const navigation = [
  {
    group: 'Command Center',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Mission', href: '/mission', icon: Handshake },
      { name: 'Compendium', href: '/admin/compendium', icon: Library },
      { name: 'Ops', href: '/admin/ops', icon: Activity },
      { name: 'Fleet', href: '/admin/fleet', icon: Truck },
      { name: 'Unit Economics', href: '/admin/economics', icon: Calculator },
      { name: 'Communities', href: '/admin/communities', icon: Globe },
    ],
  },
  {
    group: 'Supply Chain & Assets',
    items: [
      { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { name: 'Pipeline', href: '/admin/pipeline', icon: Kanban },
      { name: 'Production', href: '/admin/production', icon: Wrench },
      { name: 'HDPE Catalog', href: '/admin/hdpe-catalog', icon: Recycle },
      { name: 'Logistics', href: '/admin/logistics', icon: Truck },
      { name: 'Requests', href: '/admin/requests', icon: AlertCircle },
    ],
  },
  {
    group: 'Network & Impact',
    items: [
      { name: 'Network', href: '/admin/network', icon: Network },
      { name: 'Strategy', href: '/admin/strategy', icon: Target },
      { name: 'Growth', href: '/admin/growth', icon: TrendingUp },
      { name: 'Deal Room', href: '/admin/deal-room', icon: Crosshair },
      { name: 'Procurement', href: '/admin/procurement', icon: ShieldCheck },
      { name: 'Supply Nation', href: '/admin/supply-nation', icon: BadgeCheck },
      { name: 'AusTender', href: '/admin/austender', icon: Search },
      { name: 'IBA Loan', href: '/admin/iba-loan', icon: Landmark },
      { name: 'Deployment Map', href: '/admin/deployment-map', icon: MapIcon2 },
      { name: 'Xero Recon', href: '/admin/xero-reconciliation', icon: FileCheck },
      { name: 'Capability Statement', href: '/admin/capability-statement', icon: FileText },
      { name: 'Groote Outreach', href: '/admin/groote-outreach', icon: Mail },
      { name: 'Brand & Content', href: '/admin/brand', icon: Globe },
    ],
  },
  {
    group: 'Content & Community',
    items: [
      { name: 'Stories', href: '/admin/stories', icon: BookOpen },
      { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { name: 'Journeys', href: '/admin/journeys', icon: MapIcon },
      { name: 'Ideas', href: '/admin/ideas', icon: Lightbulb },
      { name: 'Team', href: '/admin/team', icon: Users },
    ],
  },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderNavContent = () => (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-900 border-r border-slate-800 px-6 pb-4 pt-6">
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
          
          <li className="mt-auto pt-8">
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
