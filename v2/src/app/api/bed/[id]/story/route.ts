import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';

const EL_SUPABASE_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_SUPABASE_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';
const EL_TENANT_ID = process.env.EMPATHY_LEDGER_TENANT_ID || '5f1314c1-ffe9-4d8f-944b-6cdf02d4b943';
// Placeholder attribution — Goods staff reattributes to the real storyteller after review.
// "ACT Production Team" / paired author. Override per-deploy via env if you want a different fallback.
const EL_FALLBACK_STORYTELLER_ID =
  process.env.EMPATHY_LEDGER_FALLBACK_STORYTELLER_ID || 'ac700001-0000-0000-0000-000000000002';
const EL_FALLBACK_AUTHOR_ID =
  process.env.EMPATHY_LEDGER_FALLBACK_AUTHOR_ID || '5b5bc43b-ad02-450c-ae2f-44dea1a9e77b';

const STORY_BUCKET = 'ticket-photos';
const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB

type Asset = {
  unique_id: string;
  product: string | null;
  community: string | null;
  community_id: string | null;
  place: string | null;
  status: string | null;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const name = (form.get('name') as string | null)?.trim() || '';
  const contact = (form.get('contact') as string | null)?.trim() || '';
  const story = (form.get('story') as string | null)?.trim() || '';
  const community = (form.get('community') as string | null) || '';
  const place = (form.get('place') as string | null) || '';
  const consentToShare = form.get('consent_to_share') === '1';
  const consentToContact = form.get('consent_to_contact') === '1';
  const includeLocation = form.get('include_location') === '1';
  const photo = form.get('photo') as File | null;
  const audio = form.get('audio') as File | null;

  const hasPhoto = !!(photo && (photo as File).size > 0);
  const hasAudio = !!(audio && (audio as File).size > 0);
  if (!story && !hasPhoto && !hasAudio) {
    return NextResponse.json(
      { error: 'Share a photo, a voice note, a few words, or any combination.' },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();

  const { data: asset } = await supabase
    .from('assets')
    .select('unique_id, product, community, community_id, place, status')
    .eq('unique_id', id)
    .single<Asset>();

  if (!asset) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  // 1. Optional photo upload
  let photoUrl: string | null = null;
  if (photo && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: 'Photo too large (max 8MB)' }, { status: 413 });
    }
    const ext = photo.name.split('.').pop()?.toLowerCase() || 'jpg';
    const ts = Date.now();
    const safeName = `${id}-${ts}.${ext}`.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const path = `bed-stories/${id}/${safeName}`;
    const arrayBuffer = await photo.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(STORY_BUCKET)
      .upload(path, arrayBuffer, {
        contentType: photo.type || 'image/jpeg',
        upsert: false,
      });
    if (uploadError) {
      console.error('[bed/story] photo upload failed:', uploadError);
    } else {
      const { data: pub } = supabase.storage.from(STORY_BUCKET).getPublicUrl(path);
      photoUrl = pub.publicUrl;
    }
  }

  // 1b. Optional voice-note upload
  let audioUrl: string | null = null;
  if (audio && audio.size > 0) {
    if (audio.size > MAX_PHOTO_BYTES * 2) {
      return NextResponse.json({ error: 'Voice note too large (max 16MB)' }, { status: 413 });
    }
    const ext = (audio.type.split('/')[1] || 'webm').split(';')[0];
    const ts = Date.now();
    const safeName = `${id}-${ts}.${ext}`.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const path = `bed-stories/${id}/audio-${safeName}`;
    const arrayBuffer = await audio.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(STORY_BUCKET)
      .upload(path, arrayBuffer, {
        contentType: audio.type || 'audio/webm',
        upsert: false,
      });
    if (uploadError) {
      console.error('[bed/story] audio upload failed:', uploadError);
    } else {
      const { data: pub } = supabase.storage.from(STORY_BUCKET).getPublicUrl(path);
      audioUrl = pub.publicUrl;
    }
  }

  // 2. Always write compassion_content for audit trail
  const submitterLabel = name || 'Bed scan submission';
  const captionParts = [
    story,
    '',
    '— Submitted from /bed scan',
    `Asset: ${asset.unique_id}${asset.product ? ` · ${asset.product}` : ''}`,
    asset.community || community ? `Community: ${asset.community || community}` : null,
    asset.place || place ? `Place: ${asset.place || place}` : null,
    contact ? `Contact: ${contact}` : null,
    name ? `Name: ${name}` : null,
    `Consent to share: ${consentToShare ? 'YES' : 'no'}`,
    `Consent to contact: ${consentToContact ? 'YES' : 'no'}`,
    `Include location in story: ${includeLocation ? 'YES' : 'no'}`,
  ].filter(Boolean);

  const { data: compassion, error: compassionError } = await supabase
    .from('compassion_content')
    .insert({
      asset_id: asset.unique_id,
      content_type: photoUrl ? 'photo' : 'message',
      media_url: photoUrl,
      thumbnail_url: photoUrl,
      caption: captionParts.join('\n'),
      created_by: contact || submitterLabel,
      is_public: consentToShare, // recipient must opt in to public visibility
    })
    .select()
    .single();

  if (compassionError) {
    console.error('[bed/story] compassion_content insert failed:', compassionError);
    return NextResponse.json({ error: 'Could not save your story. Try again.' }, { status: 500 });
  }

  // 2b. If a voice note was uploaded, log it as a separate row (content_type='video' for now —
  //     no 'audio' enum value yet; the media_url filename keeps the actual type discoverable).
  if (audioUrl) {
    await supabase.from('compassion_content').insert({
      asset_id: asset.unique_id,
      content_type: 'video',
      media_url: audioUrl,
      thumbnail_url: null,
      caption: `Voice note from ${submitterLabel}. ${story ? 'Transcript / context:\n' + story : '(no transcript provided)'}`,
      created_by: contact || submitterLabel,
      is_public: consentToShare,
    });
  }

  // 3. Mirror to support tickets for the Goods inbox + GHL workflow
  const kindParts = [photoUrl && 'photo', audioUrl && 'voice note', story && 'story']
    .filter(Boolean)
    .map((s) => s as string);
  const submissionKind = kindParts.length === 0 ? 'Submission' : kindParts.join(' + ');
  const ticketDescription = [
    `${submissionKind} for ${asset.unique_id}${asset.product ? ` (${asset.product})` : ''}`,
    asset.community ? `Community: ${asset.community}` : null,
    asset.place ? `Place: ${asset.place}` : null,
    story ? `Story:\n${story}` : null,
    name ? `Name: ${name}` : null,
    contact ? `Contact: ${contact}` : null,
    `Consent to share: ${consentToShare ? 'YES' : 'no'}`,
    `Consent to contact: ${consentToContact ? 'YES' : 'no'}`,
    photoUrl ? `Photo: ${photoUrl}` : null,
    audioUrl ? `Voice note: ${audioUrl}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  await supabase.from('tickets').insert({
    asset_id: asset.unique_id,
    user_name: name || null,
    user_contact: contact || 'no-contact-provided',
    issue_description: ticketDescription,
    priority: 'Low',
    category: 'feedback',
    photo_urls: photoUrl ? [photoUrl] : [],
    status: 'Open',
  });

  // 3b. Upsert the submitter into GHL so they're a known customer for follow-up.
  // Only fires when they actually shared contact info — anonymous stories stay in v2 + EL only.
  if (contact) {
    try {
      const isEmail = contact.includes('@');
      const result = await ghl.createInquiryContact(
        isEmail ? contact : '',
        name || undefined,
        ['goods-story-submitter', consentToContact ? 'goods-consent-to-contact' : 'goods-no-contact'],
      );
      if (result.success && result.contact?.id) {
        const note = [
          `📖 Story submission for ${asset.unique_id}${asset.product ? ` (${asset.product})` : ''}`,
          asset.community ? `Community: ${asset.community}` : null,
          asset.place ? `Place: ${asset.place}` : null,
          `Consent to share: ${consentToShare ? 'YES' : 'no'}`,
          `Consent to contact: ${consentToContact ? 'YES' : 'no'}`,
          story ? `\nStory:\n${story}` : null,
          photoUrl ? `Photo: ${photoUrl}` : null,
          audioUrl ? `Voice note: ${audioUrl}` : null,
          `Submitted: ${new Date().toLocaleString('en-AU')}`,
        ]
          .filter(Boolean)
          .join('\n');
        await ghl.addNote(result.contact.id, note);
      }
    } catch (err) {
      console.error('[bed/story] GHL sync failed:', err);
    }
  }

  // 4. Best-effort: post draft story to Empathy Ledger (only if there's actual story text)
  let elStoryId: string | null = null;
  if (story && consentToShare && EL_SUPABASE_URL && EL_SUPABASE_KEY && EL_PROJECT_ID) {
    try {
      const elPayload = {
        tenant_id: EL_TENANT_ID,
        project_id: EL_PROJECT_ID,
        storyteller_id: EL_FALLBACK_STORYTELLER_ID,
        author_id: EL_FALLBACK_AUTHOR_ID,
        title: name
          ? `Story from ${name}${includeLocation && asset.community ? ` (${asset.community})` : ''}`
          : `Bed ${asset.unique_id} — recipient story`,
        content: story,
        excerpt: story.length > 240 ? `${story.slice(0, 237)}…` : story,
        original_author_display: name || 'Anonymous',
        location_text: includeLocation && asset.community ? asset.community : null,
        status: 'draft',
        is_public: false,
        is_featured: false,
        syndication_enabled: false,
        permission_tier: 'private',
        community_status: 'draft',
        language: 'en',
        requires_elder_review: true,
        has_explicit_consent: consentToShare,
        consent_details: {
          source: 'goodsoncountry.com/bed-scan',
          asset_id: asset.unique_id,
          consent_to_share: consentToShare,
          consent_to_contact: consentToContact,
          include_location: includeLocation,
          contact: contact || null,
          submitted_at: new Date().toISOString(),
        },
        media_url: photoUrl,
        story_image_url: photoUrl,
        tags: ['bed-scan-submission', asset.product || 'goods', asset.community || 'unknown']
          .filter(Boolean)
          .map((t) => t.toString().toLowerCase().replace(/\s+/g, '-')),
        story_type: 'community-voice',
        privacy_level: 'private',
      };

      const res = await fetch(`${EL_SUPABASE_URL}/rest/v1/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: EL_SUPABASE_KEY,
          Authorization: `Bearer ${EL_SUPABASE_KEY}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(elPayload),
      });

      if (res.ok) {
        const inserted = (await res.json()) as { id: string }[];
        elStoryId = inserted[0]?.id || null;
      } else {
        const errText = await res.text();
        console.error('[bed/story] EL insert failed:', res.status, errText);
      }
    } catch (err) {
      console.error('[bed/story] EL insert threw:', err);
    }
  }

  return NextResponse.json({
    success: true,
    reference: compassion.id.slice(0, 8).toUpperCase(),
    elStoryId,
    syndicated: !!elStoryId,
  });
}
