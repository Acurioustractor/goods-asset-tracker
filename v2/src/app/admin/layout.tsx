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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar userEmail={user?.email || (isLocalDev ? 'Local Dev' : 'Admin')} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen max-w-[100vw]">
        {/* We use main container to house the individual dashboard segments */}
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
