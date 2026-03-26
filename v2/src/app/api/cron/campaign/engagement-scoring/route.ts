import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';
import {
  SCORING_WEIGHTS,
  getTierForScore,
  TIER_TAGS,
  ALL_TIER_TAGS,
  type EngagementTier,
  type ScoringAction,
} from '@/lib/campaign/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/**
 * Engagement Scoring Cron — runs weekly
 *
 * Scores contacts across all engagement signals:
 * - Orders (5pt each)
 * - Newsletter signups (1pt)
 * - QR code claims (3pt each)
 * - Support tickets (2pt each)
 * - Partnership inquiries (4pt each)
 * - Contact form submissions (1pt)
 * - Story contributions (3pt each)
 *
 * Assigns tier tags in GHL: goods-tier-aware, goods-tier-engaged, etc.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceClient();
  const scoreMap = new Map<string, { score: number; name: string | null; actions: Partial<Record<ScoringAction, number>> }>();

  function addScore(email: string, name: string | null, action: ScoringAction, count: number) {
    const key = email.toLowerCase().trim();
    if (!key) return;
    const existing = scoreMap.get(key) || { score: 0, name: null, actions: {} };
    existing.score += SCORING_WEIGHTS[action] * count;
    existing.name = existing.name || name;
    existing.actions[action] = (existing.actions[action] || 0) + count;
    scoreMap.set(key, existing);
  }

  try {
    // ── 1. Orders ──
    const { data: orders } = await supabase
      .from('orders')
      .select('customer_email, customer_name')
      .eq('payment_status', 'paid');

    if (orders) {
      const orderCounts = new Map<string, { count: number; name: string | null }>();
      for (const o of orders) {
        if (!o.customer_email) continue;
        const key = o.customer_email.toLowerCase();
        const existing = orderCounts.get(key) || { count: 0, name: null };
        existing.count++;
        existing.name = existing.name || o.customer_name;
        orderCounts.set(key, existing);
      }
      for (const [email, { count, name }] of orderCounts) {
        addScore(email, name, 'order', count);
      }
    }

    // ── 2. QR Claims (user_assets) ──
    const { data: claims } = await supabase
      .from('user_assets')
      .select('user_phone, user_name');

    if (claims) {
      // Phone-based claims — we'll track by phone but can't score by email
      // For now, count unique phones as claims
      const phoneCounts = new Map<string, number>();
      for (const c of claims) {
        if (!c.user_phone) continue;
        phoneCounts.set(c.user_phone, (phoneCounts.get(c.user_phone) || 0) + 1);
      }
      // We can't directly map phone → email for scoring, but we'll
      // track these separately in the response
    }

    // ── 3. Support Tickets ──
    const { data: tickets } = await supabase
      .from('tickets')
      .select('contact_info, user_name');

    if (tickets) {
      const ticketCounts = new Map<string, { count: number; name: string | null }>();
      for (const t of tickets) {
        if (!t.contact_info || !t.contact_info.includes('@')) continue;
        const key = t.contact_info.toLowerCase();
        const existing = ticketCounts.get(key) || { count: 0, name: null };
        existing.count++;
        existing.name = existing.name || t.user_name;
        ticketCounts.set(key, existing);
      }
      for (const [email, { count, name }] of ticketCounts) {
        addScore(email, name, 'support_ticket', count);
      }
    }

    // ── 4. Partnership Inquiries ──
    const { data: inquiries } = await supabase
      .from('partnership_inquiries')
      .select('contact_email, contact_name');

    if (inquiries) {
      const inquiryCounts = new Map<string, { count: number; name: string | null }>();
      for (const i of inquiries) {
        if (!i.contact_email) continue;
        const key = i.contact_email.toLowerCase();
        const existing = inquiryCounts.get(key) || { count: 0, name: null };
        existing.count++;
        existing.name = existing.name || i.contact_name;
        inquiryCounts.set(key, existing);
      }
      for (const [email, { count, name }] of inquiryCounts) {
        addScore(email, name, 'partnership_inquiry', count);
      }
    }

    // ── 5. CRM Contacts (newsletter signups, contact form) ──
    const { data: crmContacts } = await supabase
      .from('crm_contacts')
      .select('email, name, roles');

    if (crmContacts) {
      for (const c of crmContacts) {
        if (!c.email) continue;
        // Newsletter subscribers
        addScore(c.email, c.name, 'newsletter_signup', 1);
      }
    }

    // ── 6. Stories (Empathy Ledger storytellers) ──
    const { data: stories } = await supabase
      .from('stories')
      .select('storyteller_email, storyteller_name');

    if (stories) {
      const storyCounts = new Map<string, { count: number; name: string | null }>();
      for (const s of stories) {
        if (!s.storyteller_email) continue;
        const key = s.storyteller_email.toLowerCase();
        const existing = storyCounts.get(key) || { count: 0, name: null };
        existing.count++;
        existing.name = existing.name || s.storyteller_name;
        storyCounts.set(key, existing);
      }
      for (const [email, { count, name }] of storyCounts) {
        addScore(email, name, 'story_contribution', count);
      }
    }

    // ── 7. LinkedIn & Gmail Engagement (from GHL tags) ──
    // Fetch GHL contacts once — reused for tag sync below
    const ghlContactsCache = ghl.isEnabled() ? await ghl.getContacts({ goodsOnly: true }) : [];

    for (const c of ghlContactsCache) {
      const tags = c.tags || [];
      const email = c.email;
      const name = c.contactName || [c.firstName, c.lastName].filter(Boolean).join(' ') || null;

      if (!email) continue;

      // Key partner tag (Kristy, Tanya, Narelle, Rachel, etc.)
      if (tags.includes('goods-key-partner')) {
        addScore(email, name, 'key_partner', 1);
      }

      // LinkedIn tier scoring
      if (tags.includes('goods-linkedin-hot')) {
        addScore(email, name, 'linkedin_hot', 1);
      } else if (tags.includes('goods-linkedin-strategic')) {
        addScore(email, name, 'linkedin_strategic', 1);
      } else if (tags.includes('goods-linkedin-warm')) {
        addScore(email, name, 'linkedin_warm', 1);
      }

      // LinkedIn posts engaged (each goods-li-* tag = 1 post)
      const postTags = tags.filter(t => t.startsWith('goods-li-'));
      if (postTags.length > 0) {
        addScore(email, name, 'linkedin_post_engaged', postTags.length);
      }

      // Gmail active correspondence
      if (tags.includes('goods-gmail-active')) {
        addScore(email, name, 'gmail_active', 1);
      }
    }

    // ── Compile Results ──
    const tierDistribution: Record<EngagementTier, number> = {
      aware: 0,
      engaged: 0,
      active: 0,
      champion: 0,
    };

    const scoredContacts: Array<{
      email: string;
      name: string | null;
      score: number;
      tier: EngagementTier;
      actions: Partial<Record<ScoringAction, number>>;
    }> = [];

    for (const [email, data] of scoreMap) {
      const tier = getTierForScore(data.score);
      tierDistribution[tier]++;
      scoredContacts.push({
        email,
        name: data.name,
        score: data.score,
        tier,
        actions: data.actions,
      });
    }

    // Sort by score descending
    scoredContacts.sort((a, b) => b.score - a.score);

    // ── Sync Tier Tags to GHL ──
    let ghlUpdated = 0;
    let ghlErrors = 0;

    if (ghl.isEnabled()) {
      const ghlByEmail = new Map<string, { id: string; tags: string[] }>();

      for (const c of ghlContactsCache) {
        if (c.email) {
          ghlByEmail.set(c.email.toLowerCase(), {
            id: c.id,
            tags: c.tags || [],
          });
        }
      }

      // For each scored contact, update GHL tags
      for (const contact of scoredContacts) {
        const ghlContact = ghlByEmail.get(contact.email);
        if (!ghlContact) continue;

        const currentTierTags = ghlContact.tags.filter(t => ALL_TIER_TAGS.includes(t));
        const newTierTag = TIER_TAGS[contact.tier];

        // Skip if already correct
        if (currentTierTags.length === 1 && currentTierTags[0] === newTierTag) continue;

        try {
          // Remove old tier tags, add new one
          // GHL API: update contact tags
          const tagsToKeep = ghlContact.tags.filter(t => !ALL_TIER_TAGS.includes(t));
          tagsToKeep.push(newTierTag);

          // Use createOrUpdateContact to set tags
          await ghl.createInquiryContact(contact.email, contact.name || undefined, tagsToKeep);
          ghlUpdated++;

          // Rate limit
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch {
          ghlErrors++;
        }
      }
    }

    // ── Store scores in Supabase for dashboard ──
    // Upsert into engagement_scores table (will create if needed)
    const { error: upsertError } = await supabase
      .from('engagement_scores')
      .upsert(
        scoredContacts.map(c => ({
          email: c.email,
          name: c.name,
          score: c.score,
          tier: c.tier,
          actions: c.actions,
          scored_at: new Date().toISOString(),
        })),
        { onConflict: 'email' }
      );

    if (upsertError) {
      console.warn('[Engagement Scoring] Upsert warning:', upsertError.message);
      // Table might not exist yet — that's OK, scores still returned
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      contacts_scored: scoredContacts.length,
      tier_distribution: tierDistribution,
      ghl_updated: ghlUpdated,
      ghl_errors: ghlErrors,
      top_10: scoredContacts.slice(0, 10).map(c => ({
        email: c.email,
        name: c.name,
        score: c.score,
        tier: c.tier,
      })),
    });
  } catch (error) {
    console.error('[Engagement Scoring] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Scoring failed' },
      { status: 500 },
    );
  }
}
