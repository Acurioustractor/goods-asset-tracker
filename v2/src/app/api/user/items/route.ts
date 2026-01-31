import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's claimed items with asset details
    const { data: items, error } = await supabase
      .from('user_assets')
      .select(`
        id,
        asset_id,
        claimed_at,
        claim_status,
        assets (
          unique_id,
          name,
          product,
          community,
          place,
          photo,
          supply_date
        )
      `)
      .eq('profile_id', user.id)
      .eq('claim_status', 'active')
      .order('claimed_at', { ascending: false });

    if (error) {
      console.error('Error fetching user items:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: items || [] });
  } catch (error) {
    console.error('User items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
