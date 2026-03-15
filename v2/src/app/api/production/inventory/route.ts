import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const { data: snapshots, error } = await supabase
      .from('production_inventory')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching inventory:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ snapshots });
  } catch (error) {
    console.error('Inventory GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();

    const { operator } = body;
    if (!operator) {
      return NextResponse.json({ error: 'Operator is required' }, { status: 400 });
    }

    const { data: snapshot, error } = await supabase
      .from('production_inventory')
      .insert({
        snapshot_date: body.snapshot_date || new Date().toISOString().split('T')[0],
        operator,
        chipped_plastic_sheets: body.chipped_plastic_sheets || 0,
        tab_sheets_finished: body.tab_sheets_finished || 0,
        tab_sheets_in_cooker: body.tab_sheets_in_cooker || 0,
        tab_sheets_cooling: body.tab_sheets_cooling || 0,
        tabs_ready: body.tabs_ready || 0,
        leg_sheets_uncut: body.leg_sheets_uncut || 0,
        legs_ready: body.legs_ready || 0,
        steel_poles: body.steel_poles || 0,
        canvas_ready: body.canvas_ready || 0,
        notes: body.notes || null,
        photo_urls: body.photo_urls || [],
        voice_note_urls: body.voice_note_urls || [],
        voice_note_transcripts: body.voice_note_transcripts || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating inventory snapshot:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ snapshot, success: true });
  } catch (error) {
    console.error('Inventory POST error:', error);
    return NextResponse.json({ error: 'Failed to create inventory snapshot' }, { status: 500 });
  }
}
