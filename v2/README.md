# Goods on Country v2

A consumer-facing social enterprise platform for Goods on Country, delivering beds and essential items to remote Australian Indigenous communities.

## Overview

v2 transforms the operational asset tracking system into a full e-commerce platform with:
- Product catalog and shopping
- Community storytelling
- Partnership management
- Impact metrics dashboard
- Sponsorship program ("Buy for a Community")

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe (planned)
- **Deployment**: Vercel

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
v2/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/
│   │   ├── layout/          # Header, Footer
│   │   ├── marketing/       # Hero, ImpactStats, ProductCard
│   │   └── ui/              # shadcn/ui components
│   └── lib/
│       ├── supabase/        # Supabase client setup
│       └── types/           # TypeScript types
├── supabase/
│   └── migrations/          # Database migration SQL files
└── public/                  # Static assets
```

## Database Migrations

The v2 e-commerce tables are defined in `supabase/migrations/`:
- `products` - Product catalog
- `orders` / `order_items` - Order management
- `stories` / `team_members` / `bed_journeys` - Content/CMS
- `partnership_inquiries` / `partners` - Partnership management

To apply migrations, run them through the Supabase dashboard SQL editor or CLI.

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key

Optional:
- `SUPABASE_SERVICE_ROLE_KEY` - For server-side admin operations
- `STRIPE_SECRET_KEY` - Stripe payments (when implemented)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe client key

GoHighLevel strategic target execution:
- `GHL_ENABLED` - Set to `true` to enable GHL contact + opportunity sync
- `GHL_API_KEY` - GoHighLevel API key
- `GHL_LOCATION_ID` - GoHighLevel location id. You can copy this from the URL when you are inside the location in GHL, e.g. `/v2/location/<location_id>/...`
- `GRANTSCOPE_SYNC_SECRET` or `GOODS_GRANTSCOPE_SYNC_SECRET` - shared secret for CivicGraph -> Goods target pushes
- `GHL_PIPELINE_STRATEGIC_BUYER` - Buyer opportunity pipeline id
- `GHL_STAGE_STRATEGIC_BUYER_NEW` - Default buyer stage id
- `GHL_PIPELINE_STRATEGIC_CAPITAL` - Capital/philanthropy pipeline id
- `GHL_STAGE_STRATEGIC_CAPITAL_NEW` - Default capital stage id
- `GHL_PIPELINE_STRATEGIC_PARTNER` - Partner/community pipeline id
- `GHL_STAGE_STRATEGIC_PARTNER_NEW` - Default partner stage id

If the strategic pipeline ids are missing, Goods will still create/update contacts and notes from CivicGraph pushes, but it will not create pipeline opportunities yet.

Simplest setup:
- set `GHL_API_KEY`
- set `GHL_LOCATION_ID`
- set `GHL_PIPELINE_STRATEGIC_DEFAULT_NAME=Goods`
- set `GHL_PIPELINE_STRATEGIC_DEFAULT_STAGE_NAME=New Lead`

With those four values in place, the Goods integration will resolve the pipeline/stage by name and use them for buyer, capital, and partner opportunities. Raw pipeline/stage ids are now optional.

## Deployment

Deploy to Vercel:
```bash
vercel
```

Or connect the repository to Vercel for automatic deployments.

## Relationship to v1

v2 runs alongside the existing v1 vanilla HTML/JS site:
- **v1** (`/deploy`): Staff tools, QR support, asset tracking
- **v2** (`/v2`): Consumer-facing e-commerce, marketing, storytelling

Both share the same Supabase database. v2 adds new tables without modifying v1 tables.
