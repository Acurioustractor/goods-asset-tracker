import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if idea exists
    const { data: idea } = await supabase
      .from('community_ideas')
      .select('id')
      .eq('id', ideaId)
      .single();

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('idea_votes')
      .select('id')
      .eq('idea_id', ideaId)
      .eq('profile_id', user.id)
      .single();

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this idea' },
        { status: 400 }
      );
    }

    // Create vote
    const { error } = await supabase.from('idea_votes').insert({
      idea_id: ideaId,
      profile_id: user.id,
    });

    if (error) {
      console.error('Error creating vote:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete vote
    const { error } = await supabase
      .from('idea_votes')
      .delete()
      .eq('idea_id', ideaId)
      .eq('profile_id', user.id);

    if (error) {
      console.error('Error deleting vote:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove vote error:', error);
    return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 });
  }
}
