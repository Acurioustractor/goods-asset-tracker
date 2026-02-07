---
date: 2026-02-07T12:00:00Z
session_name: knowledge-base-expansion
branch: main
status: active
---

# Work Stream: Goods on Country Knowledge Base & AI Agent Infrastructure

## Ledger
**Updated:** 2026-02-07T12:00:00Z
**Goal:** Build world-class AI-powered knowledge base integrating Empathy Ledger stories, community feedback loops, business intelligence, and exponential growth systems through AI agents and community knowledge capture.
**Branch:** main
**Test:** npm run dev (localhost:3004)

### Now
[->] Document current state and design comprehensive knowledge infrastructure architecture

### This Session
- [x] Deployed Goods Wiki at /wiki with facility manual
- [x] Fixed Stripe live mode integration (GHL SMS working perfectly)
- [x] Created manufacturing operations manual
- [x] Set up wiki navigation structure (Manufacturing, Products, Support, Community, Guides, About)

### Next
- [ ] Map all existing knowledge sources (Empathy Ledger API, ACT dashboard, email archives, community feedback)
- [ ] Design AI agent architecture for knowledge curation and community support
- [ ] Build Empathy Ledger story integration into wiki
- [ ] Create community feedback capture system
- [ ] Design business intelligence dashboard architecture
- [ ] Build automated knowledge extraction from community trials

### Decisions
- Wiki structure: Modular card-based design for easy expansion
- Facility manual: Client component with styled-jsx for print-friendly offline use
- Knowledge base approach: Multi-source integration (Empathy Ledger + ACT + Community)
- AI strategy: Agent-based knowledge curation with human-in-loop validation

### Open Questions
- UNCONFIRMED: What Empathy Ledger API endpoints are available for story retrieval?
- UNCONFIRMED: What data points are available in ACT dashboard?
- UNCONFIRMED: How do we structure community feedback loops (SMS, email, web forms)?
- UNCONFIRMED: What financial/business metrics need tracking for growth analytics?

### Workflow State
pattern: research-architect-build
phase: 1
total_phases: 5
retries: 0
max_retries: 3

#### Resolved
- goal: "Build comprehensive AI-powered knowledge base for long-term Goods on Country support"
- resource_allocation: aggressive

#### Unknowns
- empathy_ledger_api_structure: UNKNOWN
- act_dashboard_data_schema: UNKNOWN
- community_feedback_channels: UNKNOWN
- business_intelligence_requirements: UNKNOWN

#### Last Failure
(none)

---

## Context

### Current State of Goods on Country Systems

#### 1. Website (v2 - Next.js 16 + React 19)
**Location:** `/Users/benknight/Code/Goods Asset Register/v2/`
**Live URL:** https://goodsoncountry.com

**Pages:**
- Homepage: Hero with video backgrounds
- `/shop/stretch-bed-single`: Product page with Stripe checkout
- `/process`: Manufacturing story
- `/story`: Brand narrative
- `/community`: Community partners
- `/support`: Contact and support
- `/wiki`: NEW - Knowledge base (just deployed)
- `/wiki/manufacturing/facility-manual`: Complete operations manual

**Tech Stack:**
- Next.js 16.1.4 (App Router, Turbopack)
- Stripe (live mode): Payments + webhooks
- Supabase (cwsyhpiuepvdjtxaozwf): Orders, customers, inventory
- GoHighLevel CRM: Contact management + SMS workflows
- Empathy Ledger API: Community stories (https://empathy-ledger-v2.vercel.app)

**Current Integrations:**
- ✅ Stripe checkout → Order creation → GHL contact update → SMS notifications
- ✅ Phone number collection for customer communication
- ✅ Product metadata flow: `stretch_bed` → `Stretch Bed` formatting
- ⚠️ Empathy Ledger: API connected but 0 published stories (fallback to local content)

#### 2. Empathy Ledger Integration
**API Base:** https://empathy-ledger-v2.vercel.app
**Project Code:** `goods-on-country`
**Status:** 240 storytellers registered, 0 stories published
**Current Behavior:** FeaturedStories component falls back to local `journeyStories` from `content.ts`

**Potential Data Sources:**
- Community stories from 240 storytellers (once published)
- Real voices and experiences with Goods products
- Impact narratives and testimonials
- Product feedback and use cases

#### 3. Database Schema (Supabase)
**Tables:**
- `orders`: Full order data (customer, shipping, billing, payment status)
- `order_items`: Line items with product_type, quantities, prices
- `products`: Product catalog (stretch_bed, washing_machine, basket_bed)

**Available Analytics:**
- Orders per day/month/year
- Revenue tracking
- Product performance
- Customer geographic distribution
- Average order value

#### 4. GoHighLevel CRM
**Custom Fields:**
- Order Number (WjRrXKT3nApbah3WOuPT)
- Order Total (EGD04YkWzbUhcqQawr3Q)
- Product Type (Kr7kLFGFFI0iF9ZzFHk1)
- Community (hofjfRFThrZpd94P4ukb)

**Workflows:**
- New Order SMS (33354d14-c4e9-465c-aad2-6d95c060d696)
- Customer + organization notifications
- Contact tagging (customer, bed-owner, washer-owner, sponsor)

**Potential for Expansion:**
- Two-way SMS feedback collection
- Email campaign integration
- Community check-in automation
- Product support ticket system

#### 5. Wiki Structure (Just Created)
**Sections Planned:**
- 📦 Manufacturing & Production (facility manual ✅, machine specs, plastic processing)
- 🛏️ Products (Stretch Bed, Washing Machine, design files)
- ❓ Support & Troubleshooting (FAQ, repairs, contact)
- 🌏 Community & Stories (partners, impact stories)
- 📋 How-To Guides (growing, training, checklists)
- ℹ️ About (Goods on Country story + stats)

#### 6. Knowledge Gaps to Fill

**Manufacturing Knowledge:**
- Machine specifications (shredder, heat press, CNC router)
- Plastic types and processing guidelines
- Safety protocols and PPE requirements
- Quality control procedures
- Maintenance schedules and troubleshooting

**Product Knowledge:**
- Stretch Bed assembly instructions
- Washing Machine (Pakkimjalki Kari) setup and operation
- Care and maintenance guides
- Troubleshooting common issues
- Repair procedures

**Community Knowledge:**
- How communities are using products
- Growing techniques and success stories
- Challenges and solutions
- Cultural adaptations and modifications
- Training best practices

**Business Knowledge:**
- Financial metrics and KPIs
- Supply chain management
- Inventory tracking
- Pricing and cost analysis
- Growth projections

### Proposed AI Agent Architecture

#### Agent 1: Story Curator
**Purpose:** Monitor Empathy Ledger, extract insights, generate wiki content
**Data Sources:**
- Empathy Ledger API (240 storytellers)
- Community feedback forms
- SMS response analysis
- Email correspondence

**Actions:**
- Auto-generate product use cases from stories
- Extract common challenges and solutions
- Identify feature requests and improvements
- Create FAQ entries from common questions
- Tag and categorize stories by theme

#### Agent 2: Community Support Bot
**Purpose:** Provide 24/7 support, escalate complex issues
**Interfaces:**
- SMS (via GHL integration)
- Email
- Wiki chat widget
- WhatsApp

**Capabilities:**
- Answer product questions using wiki knowledge base
- Troubleshoot common issues
- Guide through assembly/setup
- Collect feedback and log issues
- Escalate to human support when needed

#### Agent 3: Business Intelligence Analyst
**Purpose:** Monitor metrics, generate reports, identify trends
**Data Sources:**
- Supabase orders database
- GHL contact data
- Stripe analytics
- Community feedback

**Outputs:**
- Daily/weekly/monthly reports
- Growth trend analysis
- Product performance insights
- Geographic expansion opportunities
- Inventory forecasting

#### Agent 4: Knowledge Base Maintainer
**Purpose:** Keep wiki up-to-date, identify gaps, suggest improvements
**Actions:**
- Monitor for outdated information
- Identify missing documentation
- Suggest new guide topics based on support queries
- Update product specs when changes occur
- Maintain links and references

#### Agent 5: Training Content Generator
**Purpose:** Create training materials for community operators
**Outputs:**
- Step-by-step video scripts
- Interactive checklists
- Visual diagrams and infographics
- Printable field guides
- Quiz/assessment materials

### Integration Points

#### Empathy Ledger → Wiki
- Fetch published stories via API
- Display on `/community` and wiki Community section
- Auto-generate product testimonials
- Extract use cases for product pages
- Create searchable story archive

#### ACT Dashboard → Business Intelligence
- Pull project data
- Track community partnerships
- Monitor facility deployments
- Measure social impact metrics

#### Community Feedback → Knowledge Base
- SMS feedback after delivery
- Follow-up surveys at 30/60/90 days
- Repair/support request tracking
- Feature requests and suggestions
- Success story submissions

#### GHL → Support System
- Two-way SMS conversations
- Automated check-ins
- Issue escalation workflow
- Support ticket creation
- Resolution tracking

### Technology Stack for AI Agents

**LLM Provider:** Anthropic Claude (Sonnet/Opus for complex tasks, Haiku for simple)
**Agent Framework:** LangChain or LlamaIndex
**Vector Database:** Pinecone or Supabase pgvector
**Knowledge Graph:** Neo4j (optional, for relationship mapping)
**Scheduling:** Temporal or BullMQ
**Monitoring:** Langfuse or LangSmith

### Phased Implementation Plan

**Phase 1: Foundation (Weeks 1-2)**
- Map all data sources and APIs
- Design knowledge base schema
- Set up vector database for semantic search
- Create initial wiki content from existing docs

**Phase 2: Story Integration (Weeks 3-4)**
- Connect Empathy Ledger API
- Build story display components
- Create automated story curation pipeline
- Generate product testimonials

**Phase 3: Community Feedback Loop (Weeks 5-6)**
- Design feedback collection forms
- Implement SMS feedback via GHL
- Create email survey system
- Build feedback analysis pipeline

**Phase 4: AI Agent Development (Weeks 7-10)**
- Deploy Story Curator agent
- Deploy Community Support Bot (beta)
- Set up Business Intelligence Analyst
- Launch Knowledge Base Maintainer

**Phase 5: Optimization & Scale (Weeks 11-12)**
- Tune agent performance
- Add Training Content Generator
- Implement advanced analytics
- Create community self-service portal

### Success Metrics

**Knowledge Base:**
- 100+ wiki pages created
- <3 second search response time
- 90%+ user satisfaction rating

**Community Support:**
- <2 hour average response time
- 80%+ issues resolved by AI agent
- 95%+ community satisfaction

**Business Intelligence:**
- Daily automated reports
- Real-time inventory alerts
- Accurate 90-day demand forecasting

**Community Growth:**
- 50% increase in story submissions
- 2x community engagement rate
- 5x faster knowledge propagation

### Open Research Questions

1. **Empathy Ledger API:**
   - What endpoints are available?
   - How to authenticate?
   - What story metadata is returned?
   - Can we trigger story submission workflows?

2. **ACT Dashboard:**
   - What metrics are available?
   - API access or scraping required?
   - Real-time or batch data?
   - Historical data retention?

3. **Community Feedback:**
   - Optimal survey timing?
   - Incentives for participation?
   - Multi-language support needed?
   - Privacy and consent requirements?

4. **AI Agent Infrastructure:**
   - Hosting requirements?
   - Cost projections?
   - Latency targets?
   - Fallback/error handling?

### Next Actions

1. **Research Phase:**
   - Audit Empathy Ledger API documentation
   - Review ACT dashboard capabilities
   - Interview community members for feedback needs
   - Analyze current support email patterns

2. **Architecture Phase:**
   - Design vector database schema
   - Map data flow diagrams
   - Define agent interaction protocols
   - Create API specifications

3. **Build Phase:**
   - Start with Story Curator (highest impact)
   - Parallel: Build wiki content pages
   - Implement semantic search
   - Deploy first agent to production

4. **Iterate Phase:**
   - Monitor agent performance
   - Collect user feedback
   - Refine prompts and responses
   - Scale to additional agents

---

## Files and Structure

### Current Codebase
```
v2/
├── src/app/
│   ├── api/
│   │   ├── checkout/          # Stripe checkout session creation
│   │   └── webhooks/stripe/   # Webhook handling (order creation, GHL integration)
│   ├── shop/
│   │   └── stretch-bed-single/  # Product page
│   ├── wiki/                     # NEW - Knowledge base
│   │   ├── page.tsx              # Wiki homepage
│   │   └── manufacturing/
│   │       └── facility-manual/  # Operations manual
│   ├── community/               # Community partners page
│   └── support/                 # Support page
├── src/components/
│   ├── layout/
│   │   ├── site-header.tsx     # Navigation (now includes Wiki link)
│   │   └── site-footer.tsx
│   ├── empathy-ledger/          # Empathy Ledger components
│   └── marketing/               # Hero, ProductCard, etc.
├── src/lib/
│   ├── stripe/                  # Stripe integration
│   ├── ghl/                     # GoHighLevel integration
│   ├── supabase/                # Supabase client
│   └── data/
│       ├── content.ts           # Brand copy, journey stories
│       └── media.ts             # Image/video URLs
└── public/
    └── video/                   # Background videos
```

### Proposed Knowledge Base Structure
```
v2/
├── src/app/wiki/
│   ├── page.tsx                          # Wiki homepage ✅
│   ├── manufacturing/
│   │   ├── page.tsx                      # Manufacturing overview
│   │   ├── facility-manual/page.tsx      # Operations manual ✅
│   │   ├── machine-specs/page.tsx        # Machine specifications
│   │   └── plastic-processing/page.tsx   # Plastic guide
│   ├── products/
│   │   ├── page.tsx                      # Products overview
│   │   ├── stretch-bed/
│   │   │   ├── page.tsx                  # Stretch Bed guide
│   │   │   ├── assembly/page.tsx         # Assembly instructions
│   │   │   ├── maintenance/page.tsx      # Care & maintenance
│   │   │   └── troubleshooting/page.tsx  # Common issues
│   │   └── washing-machine/
│   │       ├── page.tsx                  # Washing machine guide
│   │       ├── setup/page.tsx            # Setup instructions
│   │       └── operation/page.tsx        # Operation manual
│   ├── support/
│   │   ├── page.tsx                      # Support overview
│   │   ├── faq/page.tsx                  # Frequently asked questions
│   │   ├── repairs/page.tsx              # Repair guides
│   │   └── contact/page.tsx              # Contact support
│   ├── community/
│   │   ├── page.tsx                      # Community overview
│   │   ├── stories/page.tsx              # Impact stories (Empathy Ledger)
│   │   ├── partners/page.tsx             # Partner directory
│   │   └── feedback/page.tsx             # Feedback form
│   └── guides/
│       ├── page.tsx                      # How-to guides overview
│       ├── growing/page.tsx              # Growing guide
│       ├── training/page.tsx             # Training materials
│       └── checklists/page.tsx           # Downloadable checklists
├── src/lib/knowledge-base/
│   ├── empathy-ledger.ts                 # Empathy Ledger API client
│   ├── search.ts                         # Vector search functions
│   ├── ai-agents/
│   │   ├── story-curator.ts              # Story curation agent
│   │   ├── support-bot.ts                # Community support agent
│   │   ├── business-intelligence.ts      # BI analyst agent
│   │   └── knowledge-maintainer.ts       # Wiki maintenance agent
│   └── vector-store/
│       ├── embeddings.ts                 # Generate embeddings
│       └── search.ts                     # Semantic search
└── scripts/
    ├── import-stories.ts                 # Import from Empathy Ledger
    ├── analyze-support-emails.ts         # Extract FAQ from emails
    └── generate-reports.ts               # Business intelligence reports
```

### Environment Variables Needed
```bash
# Empathy Ledger
EMPATHY_LEDGER_API_URL="https://empathy-ledger-v2.vercel.app"
EMPATHY_LEDGER_API_KEY="<to be obtained>"
EMPATHY_LEDGER_PROJECT_CODE="goods-on-country"

# Vector Database (Pinecone example)
PINECONE_API_KEY="<to be obtained>"
PINECONE_ENVIRONMENT="<region>"
PINECONE_INDEX="goods-knowledge-base"

# AI Provider (Anthropic)
ANTHROPIC_API_KEY="<already have>"

# ACT Dashboard
ACT_DASHBOARD_API_URL="<to be obtained>"
ACT_DASHBOARD_API_KEY="<to be obtained>"

# Already Have
SUPABASE_URL="https://cwsyhpiuepvdjtxaozwf.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="<have>"
GHL_API_KEY="<have>"
GHL_LOCATION_ID="<have>"
STRIPE_SECRET_KEY="<have - live mode>"
```
