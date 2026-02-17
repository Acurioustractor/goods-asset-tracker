import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Partner Portal | Goods on Country',
    template: '%s | Goods Partner Portal',
  },
  description: 'Your community enterprise support system — knowledge, projects, goals, and storytelling.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Simple portal header */}
      <header className="bg-white border-b border-stone-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-2">
            <span className="text-lg font-bold text-stone-900">Goods</span>
            <span className="text-sm text-stone-500">Partner Portal</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-stone-500 hover:text-stone-700"
          >
            Main Site
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Simple footer */}
      <footer className="bg-white border-t border-stone-200 px-4 py-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-stone-500">
          <p>Need help? <a href="tel:+61400000000" className="text-green-700 font-medium">Call Ben</a> or <Link href="/support" className="text-green-700 font-medium">Submit a ticket</Link></p>
        </div>
      </footer>
    </div>
  );
}
