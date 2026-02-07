import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export async function ProtectedRoute({
  children,
  requiredRole = 'user',
}: ProtectedRouteProps) {
  const supabase = await createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user is logged in, redirect to login
  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  // Check for admin role if required
  if (requiredRole === 'admin') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      redirect('/unauthorized');
    }
  }

  return <>{children}</>;
}
