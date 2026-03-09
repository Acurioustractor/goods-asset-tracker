import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { alert_id } = await request.json();
  if (!alert_id) {
    return NextResponse.json({ error: 'Missing alert_id' }, { status: 400 });
  }

  const { error } = await supabase
    .from('alerts')
    .update({
      resolved: true,
      resolved_date: new Date().toISOString(),
      resolved_by: user.id,
    })
    .eq('id', alert_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
