# Empathy Ledger Operations Guide

How to manage stories, photos, and storyteller content for Goods on Country.

---

## Quick Start

### Access Points

| What | URL | Purpose |
|------|-----|---------|
| Empathy Ledger Dashboard | `empathy-ledger.vercel.app` | Create & manage content |
| Goods Stories Page | `goods.act.place/stories` | See published content |
| Content Hub API | `empathy-ledger.vercel.app/api/v1/content-hub/*` | Technical API |

### Your Role

As a **Goods Team Member**, you can:
- Create stories on behalf of the organization
- Tag content for Goods syndication
- Feature stories on specific pages
- Manage themes and visibility

As a **Community Storyteller**, they can:
- Create their own stories
- Upload their photos/videos
- Control who sees their content
- Update or remove content anytime

---

## Daily Operations

### Check for New Content

1. Go to Empathy Ledger dashboard
2. Filter by `project_code: goods-on-country`
3. Review any pending content
4. Tag appropriately for syndication

### Quick Content Creation

**Add a testimonial (5 min):**
```
1. New Story → Type: Testimonial
2. Title: "[Quote excerpt]" — Name, Community
3. Summary: Brief context
4. Content: Full quote + attribution
5. Themes: testimonial, [community-name]
6. Visibility: Public
7. Submit for elder review if culturally sensitive
```

**Add delivery photos (10 min):**
```
1. Media → Upload Photos
2. Add alt text for each image
3. Set attribution (photographer name)
4. Add cultural tags: delivery, [community-name]
5. Mark elder_approved if reviewed
6. Set visibility: Public
```

---

## Weekly Workflow

### Monday: Content Review
- [ ] Check new community submissions
- [ ] Review and approve pending content
- [ ] Update featured story if needed

### Wednesday: Social Sharing
- [ ] Select story for social media
- [ ] Draft social post linking to /stories
- [ ] Schedule or post

### Friday: Documentation
- [ ] Log any new deliveries as stories
- [ ] Upload photos from the week
- [ ] Update impact stats if needed

---

## Monthly Workflow

### Week 1: Impact Update
Create monthly impact story:
```
Title: January 2026 Impact Update
Themes: impact, monthly-update, featured
```

Include:
- Beds delivered this month
- Communities served
- Featured testimonials
- Coming up next month

### Week 2: Storyteller Spotlight
Feature a community voice:
```
Title: Community Voice: [Name]
Themes: community-voice, featured, [community]
```

### Week 3: Partner/Sponsor Thanks
Acknowledge sponsors:
```
Title: Thank You [Sponsor Name]
Themes: sponsor-impact, thank-you
```

### Week 4: Planning
- Review analytics (which stories performed)
- Plan next month's content
- Identify gaps (communities without recent stories)

---

## Content Tagging System

### Project Code (Required)
Always set: `goods-on-country`

### Themes (Pick 2-3)

**By Content Type:**
| Theme | Use For |
|-------|---------|
| `testimonial` | Customer/recipient quotes |
| `delivery` | Delivery documentation |
| `impact` | Impact stories & stats |
| `milestone` | Celebrations |
| `artisan` | Maker stories |
| `behind-the-scenes` | Process stories |

**By Placement:**
| Theme | Appears On |
|-------|------------|
| `featured` | Homepage |
| `sponsor-impact` | /sponsor page |
| `monthly-update` | /stories, newsletters |

**By Community:**
| Theme | Community |
|-------|-----------|
| `palm-island` | Palm Island |
| `tennant-creek` | Tennant Creek |
| `alice-homelands` | Alice Homelands |
| `maningrida` | Maningrida |
| `kalgoorlie` | Kalgoorlie |

### Visibility Levels

| Level | Who Can See | Use When |
|-------|-------------|----------|
| `public` | Anyone | General impact stories, testimonials |
| `community` | Logged-in users | More personal stories |
| `private` | Only storyteller + admins | Drafts, sensitive content |

---

## Elder Review Process

### When Required
- Content mentioning cultural practices
- Photos/videos of community events
- Stories involving elders
- Any content marked `cultural_sensitivity: high`

### How It Works
1. Creator marks content for review
2. Elder reviewer receives notification
3. Elder approves, requests changes, or declines
4. Once approved, `elder_approved: true` is set
5. Content appears on Goods with "Elder Approved" badge

### Elder Approved Badge
Shows automatically on:
- Story cards
- Media gallery items
- Video stories

---

## Celebrating Milestones

### 100 Beds Milestone
```
Title: 100 Beds Delivered!
Summary: We've reached our first major milestone.
Themes: milestone, celebration, featured
```

### Community Anniversary
```
Title: One Year Supporting [Community]
Summary: Celebrating a year of partnership.
Themes: milestone, [community], impact
```

### Sponsor Recognition
```
Title: [Sponsor] Reaches 50 Beds Sponsored
Summary: Thank you for your incredible support.
Themes: sponsor-impact, milestone, thank-you
```

---

## Troubleshooting

### Content Not Appearing on Goods

1. **Check project_code** - Must be `goods-on-country`
2. **Check visibility** - Must be `public` for anonymous viewing
3. **Check elder_approved** - Some views filter by this
4. **Check themes** - Page may filter by specific themes
5. **Wait for cache** - API caches for 5 minutes

### Images Not Loading

1. Check image URL is accessible
2. Verify image is in Supabase storage
3. Check `status: active` on media asset
4. Ensure proper CORS headers

### API Connection Issues

Test endpoint:
```bash
curl -H "X-API-Key: YOUR_KEY" \
  https://empathy-ledger.vercel.app/api/v1/content-hub/stories?limit=1
```

---

## Quick Reference

### Content Hub API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/stories` | GET | List published stories |
| `/stories/:id` | GET | Single story details |
| `/media` | GET | Photos, videos, audio |
| `/themes` | GET | Available themes |

### Query Parameters

| Param | Example | Description |
|-------|---------|-------------|
| `project_code` | `goods-on-country` | Filter by project |
| `theme` | `testimonial` | Filter by theme |
| `elder_approved` | `true` | Only elder-approved |
| `type` | `image`, `video` | Media type filter |
| `limit` | `10` | Results per page |
| `page` | `2` | Pagination |

### Environment Variables (Goods Site)

```bash
EMPATHY_LEDGER_API_URL=https://empathy-ledger.vercel.app
EMPATHY_LEDGER_API_KEY=your-api-key
EMPATHY_LEDGER_PROJECT_CODE=goods-on-country
ENABLE_EMPATHY_LEDGER=true
```

---

## OCAP Reminder

Every piece of content follows OCAP principles:

- **O**wnership: Storytellers own their content
- **C**ontrol: They control visibility and sharing
- **A**ccess: They decide who can see it
- **P**ossession: Original stays in Empathy Ledger

**We never:**
- Copy content without permission
- Share private content publicly
- Override storyteller preferences
- Claim ownership of community stories

**We always:**
- Display attribution
- Show elder approval status
- Respect visibility settings
- Allow content removal on request
