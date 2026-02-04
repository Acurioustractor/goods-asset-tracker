import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { notifyShiftToTelegram } from '@/lib/telegram/notify-shift';

export async function GET() {
  try {
    const supabase = createServiceClient();

    const { data: shifts, error } = await supabase
      .from('production_shifts')
      .select('*')
      .order('shift_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching production shifts:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ shifts });
  } catch (error) {
    console.error('Production shifts GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shifts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient();

    const body = await request.json();
    const {
      operator,
      shift_date,
      sheets_produced,
      sheets_cooling,
      plastic_shredded_kg,
      diesel_level,
      issues,
      issue_notes,
      handover_notes,
      user_id,
      voice_note_urls,
      voice_note_transcripts,
      photo_urls,
    } = body;

    // Validate required fields
    if (!operator) {
      return NextResponse.json(
        { error: 'Operator is required' },
        { status: 400 }
      );
    }

    const validDieselLevels = ['low', 'medium', 'full'];
    if (diesel_level && !validDieselLevels.includes(diesel_level)) {
      return NextResponse.json(
        { error: 'Invalid diesel level. Must be low, medium, or full.' },
        { status: 400 }
      );
    }

    // Calculate total_sheets_to_date by summing all previous sheets_produced + current
    const { data: sumData } = await supabase
      .from('production_shifts')
      .select('sheets_produced');

    const previousTotal = (sumData || []).reduce(
      (sum: number, row: { sheets_produced: number }) => sum + (row.sheets_produced || 0),
      0
    );
    const totalSheetsToDate = previousTotal + (sheets_produced || 0);

    const { data: shift, error } = await supabase
      .from('production_shifts')
      .insert({
        operator,
        shift_date: shift_date || new Date().toISOString().split('T')[0],
        sheets_produced: sheets_produced || 0,
        sheets_cooling: sheets_cooling || 0,
        plastic_shredded_kg: plastic_shredded_kg || 0,
        diesel_level: diesel_level || 'medium',
        issues: issues || [],
        issue_notes: issue_notes || null,
        handover_notes: handover_notes || null,
        total_sheets_to_date: totalSheetsToDate,
        user_id: user_id || null,
        voice_note_urls: voice_note_urls || [],
        voice_note_transcripts: voice_note_transcripts || [],
        photo_urls: photo_urls || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating production shift:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fire-and-forget Telegram notification — never blocks the response
    notifyShiftToTelegram(shift).catch((err) =>
      console.error('Telegram notification error:', err)
    );

    return NextResponse.json({ shift, success: true });
  } catch (error) {
    console.error('Production shifts POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create shift log' },
      { status: 500 }
    );
  }
}
