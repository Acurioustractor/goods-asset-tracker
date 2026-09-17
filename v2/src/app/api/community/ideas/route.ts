import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';

const VALID_CATEGORIES = ['product', 'service', 'community', 'other'];

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort') || 'votes';

    // Get current user for checking votes
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get all ideas
    let query = supabase
      .from('community_ideas')
      .select('id, title, description, category, status, vote_count, created_at');

    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('vote_count', { ascending: false });
    }

    const { data: ideas, error } = await query.limit(50);

    if (error) {
      console.error('Error fetching ideas:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If user is logged in, check which ideas they've voted for
    let userVotes: string[] = [];
    if (user) {
      const { data: votes } = await supabase
        .from('idea_votes')
        .select('idea_id')
        .eq('profile_id', user.id);

      userVotes = votes?.map((v) => v.idea_id) || [];
    }

    // Add has_voted flag to each idea
    const ideasWithVotes = ideas?.map((idea) => ({
      ...idea,
      has_voted: userVotes.includes(idea.id),
    }));

    return NextResponse.json({ ideas: ideasWithVotes || [] });
  } catch (error) {
    console.error('Ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category } = body;

    // Validate title
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be less than 200 characters' },
        { status: 400 }
      );
    }

    // Validate category
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Create idea
    const { data: idea, error } = await supabase
      .from('community_ideas')
      .insert({
        profile_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating idea:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Put a named human on it. This route wrote the row and told nobody, and the
    // only stated process was a line in the operations guide saying to review
    // ideas weekly. Somebody signed in, typed an idea and waited. The task points
    // INWARD and the person receives nothing: an idea comes from a signed-in
    // profile, which on this site means the community line, and that line is
    // never sent to automatically (R9). Failure must not fail the submission,
    // which is already stored.
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, phone, email')
        .eq('id', user.id)
        .single();

      await ghl.raiseCommunityInbound({
        name: profile?.display_name || undefined,
        phone: profile?.phone || undefined,
        email: profile?.email || undefined,
        kind: 'Community idea',
        detail: [title.trim(), description?.trim(), category ? `Category: ${category}` : null]
          .filter(Boolean)
          .join('\n\n'),
      });
    } catch (notifyError) {
      console.error('[Ideas] Could not raise the inbound task:', notifyError);
    }

    return NextResponse.json({ idea, success: true });
  } catch (error) {
    console.error('Create idea error:', error);
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}
