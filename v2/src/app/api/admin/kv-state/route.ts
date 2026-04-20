import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

// Generic key-value state store for admin pages (checklists, filters, prefs).
// Shared across browsers and users — no per-user scoping.
// Table: public.admin_kv_state (key text PRIMARY KEY, value jsonb, updated_at timestamptz)

async function assertAdmin() {
  const userSupabase = await createClient();
  const {
    data: { user },
  } = await userSupabase.auth.getUser();

  if (!user) return { ok: false, status: 401, error: 'Unauthorized' } as const;

  const isAdmin =
    user.app_metadata?.role === 'admin' ||
    user.user_metadata?.role === 'admin' ||
    process.env.ADMIN_EMAILS?.split(',').includes(user.email || '');

  if (!isAdmin) return { ok: false, status: 403, error: 'Forbidden' } as const;
  return { ok: true } as const;
}

export async function GET(request: Request) {
  const auth = await assertAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('admin_kv_state')
    .select('value, updated_at')
    .eq('key', key)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ key, value: data?.value ?? null, updated_at: data?.updated_at ?? null });
}

export async function PUT(request: Request) {
  const auth = await assertAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { key, value } = body ?? {};
  if (!key || typeof key !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid key' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('admin_kv_state')
    .upsert({ key, value: value ?? {}, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
