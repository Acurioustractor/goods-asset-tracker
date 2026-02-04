'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export function AuthNavItem({ className, onClick }: { className?: string; onClick?: () => void }) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuth(!!session);
    });
  }, []);

  if (!isAuth) return null;

  return (
    <Link href="/my-items" className={className} onClick={onClick}>
      My Bed
    </Link>
  );
}
