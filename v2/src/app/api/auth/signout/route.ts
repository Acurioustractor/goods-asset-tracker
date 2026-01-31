import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Check referer to determine where to redirect
  const headersList = await headers();
  const referer = headersList.get('referer') || '';
  const isFromAdmin = referer.includes('/admin');

  const redirectUrl = isFromAdmin ? '/admin/login' : '/';
  return NextResponse.redirect(new URL(redirectUrl, request.url));
}
