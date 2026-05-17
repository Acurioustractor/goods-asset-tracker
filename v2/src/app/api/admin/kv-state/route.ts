import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/admin';

// Generic key-value state store for admin pages (checklists, filters, prefs).
// Shared across browsers and users — no per-user scoping.
// Table: public.admin_kv_state (key text PRIMARY KEY, value jsonb, updated_at timestamptz)

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

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

export async function PUT(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard) return guard;

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
