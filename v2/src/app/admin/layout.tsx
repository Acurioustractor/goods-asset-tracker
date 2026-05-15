import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from './admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isLocalDev = process.env.NODE_ENV === 'development' && (host.startsWith('localhost') || host.startsWith('127.0.0.1'));

  // Check if user is authenticated
  // Middleware handles redirect for unauthenticated users on protected admin routes.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // For login/unauthorized pages, render children without admin chrome
  // In local dev, always show admin chrome
  if (!user && !isLocalDev) {
    return <>{children}</>;
  }

  // Check if user has admin role (skip in local dev)
  if (!isLocalDev) {
    const isAdmin =
      user?.app_metadata?.role === 'admin' ||
      user?.user_metadata?.role === 'admin' ||
      process.env.ADMIN_EMAILS?.split(',').includes(user?.email || '');

    if (!isAdmin) {
      redirect('/admin/unauthorized');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminSidebar userEmail={user?.email || (isLocalDev ? 'Local Dev' : 'Admin')} />

      {/* Main Content Area — sidebar is md:fixed w-72, so we only need left padding */}
      <div className="md:pl-72 min-w-0 overflow-x-hidden">
        <main className="w-full px-4 sm:px-6 py-8 md:py-10 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
