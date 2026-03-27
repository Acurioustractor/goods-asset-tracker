---
date: 2026-03-26T02:30:00Z
session_name: campaign-engine
branch: main
status: active
---

# Work Stream: campaign-engine

## Ledger
**Updated:** 2026-03-26T02:30:00Z
**Goal:** Build world-class campaign engine, CRM pipelines, brand strategy, and knowledge base for Goods on Country
**Branch:** main
**Test:** cd v2 && npm run build

### Now
[->] All core systems built — ready for LinkedIn post import, Gmail/Calendar integration, and deeper CRM features

### This Session
- [x] Campaign engine page with 4 tabs (Contacts, Pipeline, Compose, Momentum)
- [x] Engagement scoring cron (weekly, tested end-to-end: 11 contacts scored, 8 GHL tags synced)
- [x] GHL sync cron (daily, pushes Grantscope targets to GHL)
- [x] Pipeline followup cron (weekly, auto-emails stale contacts via Resend)
- [x] Branded email utility (Resend SDK with Goods HTML template)
- [x] engagement_scores DB table created + exec_sql RPC function for DDL access
- [x] 20 real CRM contacts seeded from compendium (advisory board + partners)
- [x] 5 new wiki pages (FAQ, Partner Guide, Operations Handbook, Story Templates, Tracking Model)
- [x] Wiki index updated: 10 of 12 sections now live (was 5)
- [x] Admin ideas moderation rebuilt (stats dashboard, status management, admin notes, delete)
- [x] Unified CRM with crm_deals table (26 deals seeded: $2.3M+ across 4 pipelines)
- [x] crm_activities table for conversation tracking (email, call, meeting, LinkedIn, SMS)
- [x] Brand & Content dashboard with LinkedIn post tracking + theme analysis
- [x] linkedin_posts table with engagement metrics
- [x] GHL activity sync cron (daily, pulls GHL contacts into crm_activities)
- [x] CRON_SECRET added to .env.local for local testing
- [x] V2 database access methods documented in memory (supabase CLI + exec_sql RPC)

### Next
- [ ] Import existing LinkedIn posts (scrape or manual paste of Ben's recent posts)
- [ ] Gmail API integration — pull email conversations into crm_activities
- [ ] Google Calendar integration — sync meetings into crm_activities
- [ ] Contact detail page with unified activity timeline
- [ ] Deal detail page with activity thread + linked contacts
- [ ] Batch import contacts from CSV/Grantscope
- [ ] LinkedIn OAuth for automated post metrics sync
- [ ] Notion integration for content planning
- [ ] Community feedback → ideas pipeline (auto-create ideas from feedback)
- [ ] Vector search across wiki content
- [ ] AI agent infrastructure (Story Curator, Support Bot, BI Analyst)

### Decisions
- Campaign engine adapted from JusticeHub patterns (not copied verbatim)
- Engagement scoring: order=5pt, newsletter=1pt, QR claim=3pt, support ticket=2pt, partnership=4pt, story=3pt
- Engagement tiers: Aware(1-2), Engaged(3-5), Active(6-9), Champion(10+)
- GHL is primary CRM — all scoring syncs as tier tags
- Pipeline stages stored in crm_contacts.metadata JSONB (not a separate column)
- crm_deals table for unified pipeline across sale/funding/partnership/procurement
- crm_activities table for conversation tracking across all channels
- linkedin_posts table for brand strategy with theme categorization
- Resend for branded email (fallback: logs only when RESEND_API_KEY not set)
- V2 DB access: `npx supabase db query --linked` for DDL, exec_sql RPC for programmatic
- Wiki pages are Server Components (static), admin pages are force-dynamic

### Open Questions
- RESOLVED: Email provider → Resend SDK (implemented, works when API key set)
- RESOLVED: DB DDL access → supabase CLI + exec_sql RPC function
- UNCONFIRMED: Gmail API OAuth — does Ben have a Google Cloud project?
- UNCONFIRMED: LinkedIn OAuth for automated post metrics
- UNCONFIRMED: Notion workspace ID for content planning integration

### Workflow State
pattern: hierarchical
phase: 2
total_phases: 3
retries: 0
max_retries: 3

#### Resolved
- goal: "Build campaign engine, CRM pipelines, brand strategy, and knowledge base"
- resource_allocation: aggressive

#### Unknowns
- gmail_oauth: Google Cloud project setup — UNKNOWN
- linkedin_oauth: LinkedIn API access — UNKNOWN
- notion_workspace: Workspace ID — UNKNOWN

#### Last Failure
(none)

---

## Context

### New DB Tables Created This Session
- `engagement_scores` (email PK, name, score, tier, actions JSONB, scored_at)
- `crm_deals` (id, contact_id FK, title, deal_type, pipeline_stage, amount_cents, probability, tags[], metadata JSONB)
- `crm_activities` (id, contact_id FK, deal_id FK, activity_type, subject, body, channel, direction, occurred_at, metadata JSONB)
- `linkedin_posts` (id, post_url, content, post_date, author, post_type, theme, campaign, likes/comments/reposts/impressions, engagement_rate, tags[])
- `exec_sql` RPC function (SECURITY DEFINER, runs DDL via REST API)
- `admin_notes` column added to `community_ideas`

### New Cron Jobs (Vercel)
- `/api/cron/campaign/engagement-scoring` — Monday 6am (weekly)
- `/api/cron/campaign/ghl-sync` — Daily 7am
- `/api/cron/campaign/pipeline-followup` — Wednesday 8am (weekly)
- `/api/cron/campaign/ghl-activity-sync` — Daily 9am

### Key Files Created This Session
- `v2/src/lib/campaign/types.ts` — Engagement tiers, scoring weights, pipeline stages
- `v2/src/lib/email/send.ts` — Resend email with Goods branded HTML template
- `v2/src/app/admin/campaign-engine/` — page.tsx, actions.ts, campaign-dashboard.tsx
- `v2/src/app/admin/crm/` — page.tsx, actions.ts, crm-dashboard.tsx
- `v2/src/app/admin/brand/` — page.tsx, actions.ts, brand-dashboard.tsx
- `v2/src/app/admin/ideas/` — page.tsx (rebuilt), actions.ts (rebuilt), ideas-admin.tsx (new)
- `v2/src/app/api/cron/campaign/` — 4 cron route files
- `v2/src/app/api/admin/campaign/send-email/route.ts`
- `v2/src/app/wiki/support/faq/page.tsx`
- `v2/src/app/wiki/community/partner-guide/page.tsx`
- `v2/src/app/wiki/community/tracking-model/page.tsx`
- `v2/src/app/wiki/guides/operations/page.tsx`
- `v2/src/app/wiki/guides/story-templates/page.tsx`

### Seeded Data
- 20 crm_contacts from compendium (advisory board + key partners + funders + government)
- 26 crm_deals from compendium funding data + sales pipeline + partnerships + procurement
- 11 engagement_scores from scoring cron (Ben Knight: 115pt Champion, etc.)

### CRM Pipeline Summary
- Sales: 6 deals ($515K pipeline, $454K won — Centrecorp 107 beds, Homeland Schools 65 beds)
- Funding: 15 deals ($1.4M pipeline, $446K won — Snow, TFN, FRRR, VFFF, AMP)
- Partnerships: 3 deals (Envirobank, Defy Design, Oonchiumpa)
- Procurement: 3 deals (Speed Queen washers, canvas, steel poles)

### Admin Sidebar Order (Network & Impact section)
Compassion → Messages → People → Grants → Campaign Engine → CRM & Pipelines → Brand & Content
