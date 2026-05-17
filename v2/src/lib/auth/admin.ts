import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

/**
 * Centralised admin auth gate for API routes.
 *
 * Returns `null` if the request is authorised (admin or local-dev bypass),
 * or a `NextResponse` (401/403) the route should return immediately.
 *
 * Usage in any /api/admin/* route:
 *
 *   const guard = await requireAdmin(request);
 *   if (guard) return guard;
 *
 *   // …authorized work…
 *
 * The local-dev bypass mirrors src/proxy.ts and src/app/admin/layout.tsx:
 *   NODE_ENV === 'development' AND host starts with localhost/127.0.0.1.
 * That means `pnpm dev` against http://localhost:3000 lets you exercise
 * admin API routes without logging in. In production the user must be
 * authenticated AND match either an admin role or ADMIN_EMAILS.
 */
export async function requireAdmin(request?: NextRequest): Promise<NextResponse | null> {
  // Local-dev bypass — same shape as proxy.ts / layout.tsx
  const hostHeader = request?.headers.get('host') ?? (await headers()).get('host') ?? '';
  const isLocalDev =
    process.env.NODE_ENV === 'development' &&
    (hostHeader.startsWith('localhost') || hostHeader.startsWith('127.0.0.1'));
  if (isLocalDev) return null;

  // Production / preview path — require an authenticated admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim()).filter(Boolean);
  const isAdmin =
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    adminEmails.includes(user.email || '');

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
