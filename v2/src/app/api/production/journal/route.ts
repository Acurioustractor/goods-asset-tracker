import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const VALID_ENTRY_TYPES = ['reflection', 'issue', 'cost_idea', 'general'];

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);
    const entryType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    let query = supabase
      .from('production_journal')
      .select('*')
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (entryType && VALID_ENTRY_TYPES.includes(entryType)) {
      query = query.eq('entry_type', entryType);
    }

    const { data: entries, error } = await query;

    if (error) {
      console.error('Error fetching journal:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Journal GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch journal' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();

    const { operator, entry_type, title } = body;

    if (!operator) {
      return NextResponse.json({ error: 'Operator is required' }, { status: 400 });
    }
    if (!entry_type || !VALID_ENTRY_TYPES.includes(entry_type)) {
      return NextResponse.json({ error: 'Valid entry type is required' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data: entry, error } = await supabase
      .from('production_journal')
      .insert({
        entry_date: body.entry_date || new Date().toISOString().split('T')[0],
        operator,
        entry_type,
        title,
        content: body.content || null,
        voice_note_urls: body.voice_note_urls || [],
        voice_note_transcripts: body.voice_note_transcripts || [],
        photo_urls: body.photo_urls || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating journal entry:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entry, success: true });
  } catch (error) {
    console.error('Journal POST error:', error);
    return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 });
  }
}
