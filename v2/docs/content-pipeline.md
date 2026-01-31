# Goods on Country - Content Pipeline

How to discover, tag, and continuously gather stories and media from Empathy Ledger.

---

## Quick Start

### Step 1: Run Content Audit

Run `scripts/empathy-ledger-content-audit.sql` in the Empathy Ledger Supabase dashboard:
1. Go to Empathy Ledger Supabase → SQL Editor
2. Paste and run the audit script
3. Review results to identify Goods-relevant content

### Step 2: Tag Content

After reviewing audit results, run `scripts/empathy-ledger-tag-content.sql`:
1. Uncomment the UPDATE statements for content you want to tag
2. Run each section individually to control what gets tagged
3. Verify with the verification queries at the bottom

### Step 3: Verify on Goods Site

1. Check https://goods.act.place/stories
2. Content should appear via the Content Hub API
3. If not appearing, check API connection and caching

---

## Content Discovery Strategy

### Automatic Discovery

The Empathy Ledger Content Hub API automatically filters content by:
- `project_code = 'goods'` for media assets
- `project_code = 'goods-on-country'` for syndication site
- Theme tags like `goods`, `delivery`, `impact`, `testimonial`

### Manual Discovery

Regularly search for new content that should be tagged:

**Keywords to search in stories:**
- bed, beds, sleeping, furniture
- delivery, delivered, receiving
- goods, essentials, support
- washing machine, laundry
- palm island, tennant creek, maningrida, kalgoorlie (communities)

**Keywords to search in media:**
- Community names
- Bed, delivery, handover
- Artisan, maker, crafting

---

## Agentic Content Gathering

### Weekly Discovery Agent

Run this pattern weekly to find new content:

```sql
-- Find stories created in last 7 days that might be Goods-relevant
SELECT id, title, created_at
FROM stories
WHERE created_at > NOW() - INTERVAL '7 days'
AND (
    content ILIKE ANY(ARRAY['%bed%', '%delivery%', '%goods%', '%community%'])
    OR themes::text ILIKE '%impact%'
)
AND NOT (themes::text ILIKE '%goods%');
```

### Monthly Content Audit

Every month, run a comprehensive audit:

1. **New Stories** - Check all stories from last 30 days
2. **Untagged Media** - Find media with `project_code IS NULL`
3. **Syndication Gaps** - Stories without Goods consent
4. **Community Coverage** - Ensure each community has recent content

### Story Suggestion Agent

Use AI to suggest stories that need to be written:

**Monthly Prompts:**
```
"What stories should we write this month about Goods on Country?"

Consider:
- Recent deliveries that need documentation
- Communities without recent coverage
- Upcoming milestones (100 beds, 1 year anniversary)
- Sponsor thank-yous that are due
- Artisan profiles not yet written
```

---

## Content Types & Themes

### Story Types for Goods

| Type | Theme Tags | Appears On |
|------|------------|------------|
| Delivery Story | `delivery`, `impact`, `[community]` | /stories, /impact |
| Testimonial | `testimonial`, `community-voice` | /shop, /stories |
| Impact Update | `impact`, `monthly-update` | /impact, homepage |
| Sponsor Thanks | `sponsor-impact`, `thank-you` | /sponsor |
| Artisan Profile | `artisan`, `maker-story` | /about, /shop |
| Milestone | `milestone`, `celebration` | homepage, /stories |

### Theme Tags Reference

**Content Type Tags:**
- `testimonial` - Customer/recipient quotes
- `delivery` - Delivery documentation
- `impact` - Impact stories & stats
- `milestone` - Celebrations
- `artisan` - Maker stories

**Placement Tags:**
- `featured` - Shows on homepage
- `sponsor-impact` - Shows on /sponsor page
- `monthly-update` - Regular updates section

**Community Tags:**
- `palm-island`
- `tennant-creek`
- `alice-homelands`
- `maningrida`
- `kalgoorlie`

---

## Story Planning in Notion

### Content Calendar Structure

```
📅 Goods Content Calendar (Notion Database)

Properties:
- Title: Story title
- Type: Delivery | Testimonial | Impact | Sponsor | Artisan | Milestone
- Community: Select from communities
- Status: Planned | In Progress | Written | Published
- Scheduled Date: When to publish
- Assigned To: Who's writing
- Empathy Ledger ID: Link to published story
```

### Monthly Planning Template

**Week 1:** Impact Update
- Pull stats from Goods dashboard
- Write monthly summary story
- Tag with `impact`, `monthly-update`, `featured`

**Week 2:** Storyteller Spotlight
- Feature a community member or recipient
- Get their consent through Empathy Ledger
- Tag with `community-voice`, `testimonial`

**Week 3:** Sponsor Recognition
- Thank recent sponsors
- Include delivery photos
- Tag with `sponsor-impact`, `thank-you`

**Week 4:** Planning & Review
- Audit what was published
- Plan next month's content
- Identify gaps in community coverage

---

## Automated Content Flow

### Webhook Events

When content is published in Empathy Ledger, these webhooks fire to Goods:

| Event | Trigger | Goods Action |
|-------|---------|--------------|
| `story.published` | New story tagged with Goods | Clear cache, update /stories |
| `story.updated` | Story content changed | Update cached content |
| `gallery.photos.added` | New photos to Goods gallery | Update media galleries |
| `consent.revoked` | Storyteller removes consent | Hide content immediately |

### Cache Strategy

Goods caches Empathy Ledger content for 5 minutes:
- API responses are cached in memory
- Homepage features are cached longer (15 min)
- Clearing cache: Redeploy or wait for expiry

---

## Content Quality Checklist

Before tagging content for Goods:

- [ ] **Consent verified** - Storyteller has given explicit consent
- [ ] **Elder approved** (if required) - Cultural content has elder sign-off
- [ ] **Public visibility** - Story/media is set to public
- [ ] **Correct themes** - Appropriate theme tags applied
- [ ] **Attribution complete** - Author/storyteller properly credited
- [ ] **Images accessible** - URLs are valid and public
- [ ] **Cultural sensitivity** - No sacred/restricted content

---

## Troubleshooting

### Content Not Appearing

1. **Check project_code** - Must be `goods` or tagged for syndication
2. **Check visibility** - Must be `public`
3. **Check consent** - Must have Goods syndication consent
4. **Check API** - Test endpoint directly:
   ```bash
   curl "https://empathy-ledger.vercel.app/api/v1/content-hub/stories?project_code=goods-on-country&limit=5"
   ```

### Wrong Content Appearing

1. **Review themes** - Content may be mis-tagged
2. **Check query params** - API may be fetching wrong filters
3. **Clear cache** - Old content may be cached

### Images Not Loading

1. **Check URL** - Verify image URL is accessible
2. **Check CORS** - Empathy Ledger storage should allow Goods domain
3. **Check status** - Media asset must have `status = 'active'`

---

## Integration Points

### Empathy Ledger → Goods

```
Empathy Ledger (Source of Truth)
        ↓
Content Hub API (/api/v1/content-hub/*)
        ↓
Goods API Client (src/lib/empathy-ledger/client.ts)
        ↓
Goods Pages (/stories, /impact, /shop, etc.)
```

### Environment Variables

```bash
# In Goods .env.local
EMPATHY_LEDGER_API_URL=https://empathy-ledger.vercel.app
EMPATHY_LEDGER_API_KEY=your-api-key
EMPATHY_LEDGER_PROJECT_CODE=goods-on-country
ENABLE_EMPATHY_LEDGER=true
```

---

## Marketing Automation

### Available Marketing Skills

Marketing skills are symlinked from ACT infrastructure at `.claude/skills/marketing/`:

| Skill | Use Case |
|-------|----------|
| `copywriting` | Product pages, landing pages, marketing copy |
| `social-content` | Instagram, LinkedIn, Facebook posts |
| `seo-audit` | Website discoverability optimization |
| `page-cro` | Conversion rate optimization |
| `email-sequence` | Order confirmation, follow-up sequences |
| `schema-markup` | Structured data for products |

### Content Generation Pipeline

#### Post-Delivery Content
When a bed is delivered, trigger content generation:

1. **Delivery Photo Upload** → Empathy Ledger
2. **Story Draft** → AI generates draft from delivery notes
3. **Social Post** → Auto-generate Instagram post
4. **Email Update** → Notify sponsors if applicable

#### Content Types & Templates

**Product Spotlight (Weekly)**
```
Theme: product-spotlight
Platforms: Instagram, Facebook, Website
Content: Feature a product with artisan story
```

**Delivery Story (Per Delivery)**
```
Theme: delivery-story
Platforms: Instagram, Website, GHL Email
Content: Before/after, impact stats, testimonial
```

**Milestone Celebration (As Achieved)**
```
Theme: milestone-celebration
Platforms: All channels
Content: Celebrate 100th bed, new community, etc.
```

### GHL CRM Integration

#### Contact Tags
Apply tags on different actions:

| Action | Tags |
|--------|------|
| Purchase | `goods-customer`, `[product-type]` |
| Sponsor | `goods-sponsor`, `[community]` |
| Partnership Inquiry | `goods-partner-lead` |
| Email Subscriber | `goods-newsletter` |

#### Automated Workflows

**Order Confirmation Flow:**
1. Order placed → Create GHL contact
2. Apply tags: `goods-customer`, product type
3. Send order confirmation email
4. Schedule delivery follow-up (D+7)
5. Request review (D+14)

**Sponsor Flow:**
1. Sponsorship completed → Create GHL contact
2. Apply tags: `goods-sponsor`, community
3. Send thank-you email with impact story
4. Schedule 3-month impact update
5. Annual re-engagement campaign

### Social Publishing Automation

**Instagram Posting Flow:**
1. Content created in Empathy Ledger
2. Webhook triggers content sync
3. `generate-content-from-knowledge.mjs` creates caption
4. `sync-content-to-ghl.mjs` schedules post
5. Post published at optimal time

**Content Calendar:**
- Monday: Impact story
- Wednesday: Product feature
- Friday: Community spotlight
- (Delivery stories override as needed)

---

## Future Enhancements

### Automated Story Generation
- Use AI to draft stories from delivery reports
- Human review and approval before publishing
- Automatic tagging based on content analysis

### Community Self-Service
- Allow communities to submit their own stories
- Mobile-friendly story creation flow
- Automatic elder review routing

### Analytics Integration
- Track which stories perform best
- Identify content gaps by community
- Measure engagement with different story types

### Marketing Automation Expansion
- A/B testing for email subjects
- Personalized product recommendations
- Retargeting integration
- Referral program automation
