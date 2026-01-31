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
