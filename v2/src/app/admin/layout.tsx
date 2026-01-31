import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Check if user has admin role (stored in user metadata or app_metadata)
  const isAdmin =
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    // Fallback: check against a list of admin emails
    process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');

  if (!isAdmin) {
    redirect('/admin/unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-semibold text-lg">
                Goods Admin
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Orders
                </Link>
                <Link
                  href="/admin/products"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Products
                </Link>
                <Link
                  href="/admin/messages"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Messages
                </Link>
                <Link
                  href="/admin/requests"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Requests
                </Link>
                <Link
                  href="/admin/compassion"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Compassion
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <form action="/api/auth/signout" method="POST">
                <Button variant="outline" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
