# Feature Plan: Business Intelligence Dashboard
Created: 2026-02-07
Author: architect-agent

## Overview

A real-time Business Intelligence dashboard for Goods on Country, living at `/admin/dashboard` within the existing admin section. It surfaces order analytics, revenue trends, production metrics, geographic distribution, and inventory levels from the Supabase database and production shift logs. The dashboard uses a hybrid Server Component + Client Component strategy: Server Components fetch data via Supabase, then pass it to lightweight Client Components for interactive charts and time-range filtering.

## Requirements

- [ ] Real-time metrics: daily/weekly/monthly order counts, revenue, AOV
- [ ] Revenue trend line chart (selectable time range)
- [ ] Product performance breakdown (Stretch Bed vs Washing Machine interest vs Basket Bed plans)
- [ ] Geographic heat map of orders by state/region
- [ ] Customer acquisition over time (new vs returning)
- [ ] Inventory levels for tracked products
- [ ] Production metrics from shift logs (sheets produced, plastic shredded)
- [ ] Time-based filters: today, 7d, 30d, 90d, year, custom range
- [ ] CSV/JSON export for any data view
- [ ] Mobile responsive (cards stack, charts scroll)

## Design

### Architecture

```
/admin/dashboard (page.tsx — Server Component)
  |
  +-- DashboardShell (layout/filter bar — Client Component)
  |     |
  |     +-- TimeRangeSelector (today / 7d / 30d / 90d / year / custom)
  |     +-- ExportButton (CSV download)
  |
  +-- KPICards (Server Component, revalidated)
  |     |-- Total Revenue card
  |     |-- Orders This Period card
  |     |-- Average Order Value card
  |     |-- Pending Fulfillment card
  |
  +-- RevenueChart (Client Component — recharts)
  |
  +-- ProductPerformance (Client Component — recharts bar chart)
  |
  +-- GeographicMap (Client Component — react-leaflet, already installed)
  |
  +-- CustomerAcquisition (Client Component — recharts area chart)
  |
  +-- InventoryTable (Server Component)
  |
  +-- ProductionMetrics (Client Component — recharts)
       |-- Sheets produced over time
       |-- Plastic shredded (kg) over time
       |-- Diesel level distribution
```

### Data Fetching Strategy

**Why hybrid, not full-client:**
- The existing admin pages use Server Components with `createClient()` — follow that pattern
- Initial load is fast (server-rendered), interactive filtering happens client-side
- Supabase queries run server-side (no exposed anon key for aggregate queries)

**Pattern:**
1. Page receives `searchParams` for time range (e.g., `?range=30d&from=2026-01-01&to=2026-02-07`)
2. Server Component fetches all data for the selected range via parallel `Promise.all`
3. Serialized data is passed as props to Client chart components
4. Time range changes trigger URL navigation (using `router.push` with searchParams), which re-renders the Server Component — no separate API routes needed

**For real-time updates (optional Phase 5):**
- Supabase Realtime subscription on `orders` table for live order notifications
- This would be a small Client Component overlay, not a full re-fetch

### Chart Library: Recharts

**Why Recharts over alternatives:**
| Library | Bundle (gzip) | React 19 | SSR | Tailwind integration |
|---------|--------------|----------|-----|---------------------|
| Recharts | ~45kb | Yes | Partial (client render) | Good with custom colors |
| Chart.js + react-chartjs-2 | ~60kb | Yes | No | Decent |
| Nivo | ~80kb+ | Uncertain | Partial | Good |
| Tremor | ~120kb | Yes | Yes | Native Tailwind |
| Victory | ~50kb | Yes | Partial | Manual |

Recharts wins: lightweight, React-native API, active maintenance, well-documented, works with React 19. Tremor would be ideal for Tailwind but is heavy and has had React 19 compatibility issues.

### Geographic Visualization

The project already has `leaflet`, `react-leaflet`, and `@types/leaflet` installed. The `Order.shipping_address` includes `state` and `postcode` fields. Strategy:
- Aggregate orders by Australian state (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)
- Use a choropleth overlay on the Leaflet map (GeoJSON of Australian states)
- Color intensity = order volume
- Clicking a state shows a breakdown

No new dependency needed.

### Interfaces

```typescript
// src/lib/types/dashboard.ts

export type TimeRange = 'today' | '7d' | '30d' | '90d' | 'year' | 'custom';

export interface DashboardFilters {
  range: TimeRange;
  from?: string; // ISO date
  to?: string;   // ISO date
}

export interface KPIData {
  totalRevenue: number;       // cents
  orderCount: number;
  averageOrderValue: number;  // cents
  pendingFulfillment: number;
  // Comparison to previous period
  revenueDelta: number;       // percentage change
  ordersDelta: number;
  aovDelta: number;
}

export interface RevenueDataPoint {
  date: string;      // YYYY-MM-DD
  revenue: number;   // cents
  orders: number;
}

export interface ProductPerformanceData {
  productType: string;
  productName: string;
  revenue: number;    // cents
  quantity: number;
  orderCount: number;
}

export interface GeographicData {
  state: string;       // AU state code
  orderCount: number;
  revenue: number;
  customerCount: number;
}

export interface CustomerAcquisitionData {
  date: string;
  newCustomers: number;
  returningCustomers: number;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  productType: string;
  inventoryCount: number;
  isLow: boolean;        // < 5 units
}

export interface ProductionData {
  date: string;
  sheetsProduced: number;
  plasticShreddedKg: number;
  operator: string;
  issues: string[];
}

export interface DashboardData {
  kpi: KPIData;
  revenueTrend: RevenueDataPoint[];
  productPerformance: ProductPerformanceData[];
  geographic: GeographicData[];
  customerAcquisition: CustomerAcquisitionData[];
  inventory: InventoryItem[];
  production: ProductionData[];
  filters: DashboardFilters;
}
```

### Data Flow

1. User navigates to `/admin/dashboard` or changes time range filter
2. `searchParams` parsed in Server Component → `DashboardFilters`
3. `fetchDashboardData(filters)` runs 7 parallel Supabase queries via `Promise.all`
4. Results transformed into `DashboardData` interface
5. Each section component receives its slice of data as props
6. Client Components render interactive charts (tooltips, hover, zoom)
7. Export button serializes current `DashboardData` slice to CSV

### Supabase Queries

```sql
-- KPI: Revenue & order count for period
SELECT COUNT(*) as order_count,
       SUM(total_cents) as total_revenue,
       AVG(total_cents) as avg_order_value
FROM orders
WHERE created_at >= :from AND created_at <= :to
  AND status NOT IN ('cancelled', 'refunded');

-- Revenue trend: daily aggregation
SELECT DATE(created_at) as date,
       COUNT(*) as orders,
       SUM(total_cents) as revenue
FROM orders
WHERE created_at >= :from AND created_at <= :to
  AND status NOT IN ('cancelled', 'refunded')
GROUP BY DATE(created_at)
ORDER BY date;

-- Product performance: via order_items join
SELECT oi.product_type, oi.product_name,
       SUM(oi.total_cents) as revenue,
       SUM(oi.quantity) as quantity,
       COUNT(DISTINCT oi.order_id) as order_count
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.created_at >= :from AND o.created_at <= :to
  AND o.status NOT IN ('cancelled', 'refunded')
GROUP BY oi.product_type, oi.product_name;

-- Geographic: parse shipping_address->>'state'
SELECT shipping_address->>'state' as state,
       COUNT(*) as order_count,
       SUM(total_cents) as revenue,
       COUNT(DISTINCT customer_email) as customer_count
FROM orders
WHERE created_at >= :from AND created_at <= :to
  AND status NOT IN ('cancelled', 'refunded')
  AND shipping_address IS NOT NULL
GROUP BY shipping_address->>'state';

-- Customer acquisition: new vs returning
-- New = first order in period, Returning = had prior orders
SELECT DATE(o.created_at) as date,
       COUNT(CASE WHEN first_order.first_date = DATE(o.created_at) THEN 1 END) as new_customers,
       COUNT(CASE WHEN first_order.first_date < DATE(o.created_at) THEN 1 END) as returning_customers
FROM orders o
LEFT JOIN (
  SELECT customer_email, DATE(MIN(created_at)) as first_date
  FROM orders WHERE status NOT IN ('cancelled', 'refunded')
  GROUP BY customer_email
) first_order ON first_order.customer_email = o.customer_email
WHERE o.created_at >= :from AND o.created_at <= :to
  AND o.status NOT IN ('cancelled', 'refunded')
GROUP BY DATE(o.created_at)
ORDER BY date;

-- Production shifts
SELECT shift_date, sheets_produced, plastic_shredded_kg, operator, issues
FROM production_shifts
WHERE shift_date >= :from AND shift_date <= :to
ORDER BY shift_date;
```

**Note:** Supabase JS client cannot do all of these as single queries (especially the customer acquisition subquery). Options:
1. Use Supabase RPC (create PostgreSQL functions) for complex aggregations — **recommended**
2. Fetch raw data and aggregate in JS — acceptable for small datasets (< 1000 orders)
3. Create a Supabase Edge Function — overkill for this

**Recommendation:** Start with JS-side aggregation (Phase 2), create RPC functions if performance becomes an issue (Phase 4).

## Dependencies

| Dependency | Type | Reason | Install |
|------------|------|--------|---------|
| recharts | External (new) | Chart rendering | `npm install recharts` |
| date-fns | External (new) | Date range calculations, formatting | `npm install date-fns` |
| leaflet + react-leaflet | External (existing) | Geographic map — already installed | N/A |
| @supabase/supabase-js | External (existing) | Database queries | N/A |
| shadcn/ui Card, Badge, Button | Internal (existing) | UI components | N/A |

Only 2 new dependencies: `recharts` (~45kb gzip) and `date-fns` (~6kb tree-shaken).

## Implementation Phases

### Phase 1: Foundation — Types, Data Layer, Page Shell
**Estimated effort:** Small (1-2 hours)

**Files to create:**
- `v2/src/lib/types/dashboard.ts` — All TypeScript interfaces (as defined above)
- `v2/src/lib/data/dashboard.ts` — `fetchDashboardData(filters)` function with all Supabase queries
- `v2/src/lib/data/dashboard-utils.ts` — Date range helpers, CSV export utility, data transformers
- `v2/src/app/admin/dashboard/page.tsx` — Server Component page shell

**Files to modify:**
- `v2/src/app/admin/layout.tsx` — Add "Dashboard" link to admin nav (between "Dashboard" overview and "Orders")

**Acceptance:**
- [ ] Types compile with no errors
- [ ] `fetchDashboardData` returns mock-compatible shape
- [ ] `/admin/dashboard` renders a loading shell
- [ ] Admin nav includes Dashboard link

### Phase 2: KPI Cards + Revenue Chart
**Estimated effort:** Medium (2-3 hours)

**Dependencies:** Phase 1

**Files to create:**
- `v2/src/components/dashboard/kpi-cards.tsx` — 4 KPI metric cards with delta indicators
- `v2/src/components/dashboard/revenue-chart.tsx` — `'use client'` line chart with Recharts
- `v2/src/components/dashboard/time-range-selector.tsx` — `'use client'` filter buttons + custom date picker
- `v2/src/components/dashboard/dashboard-shell.tsx` — `'use client'` wrapper with filter state + URL sync

**Install:**
```bash
cd v2 && npm install recharts date-fns
```

**Acceptance:**
- [ ] KPI cards display revenue, orders, AOV, pending count
- [ ] Delta percentages show comparison to previous period
- [ ] Revenue chart renders with real Supabase data
- [ ] Time range selector updates URL searchParams
- [ ] Page re-renders with filtered data

### Phase 3: Product Performance + Geographic Map + Customer Acquisition
**Estimated effort:** Medium (3-4 hours)

**Dependencies:** Phase 2

**Files to create:**
- `v2/src/components/dashboard/product-performance.tsx` — Horizontal bar chart by product type
- `v2/src/components/dashboard/geographic-map.tsx` — Leaflet choropleth of Australian states
- `v2/src/components/dashboard/customer-acquisition.tsx` — Stacked area chart (new vs returning)
- `v2/src/lib/data/au-states.geojson.ts` — GeoJSON boundaries for Australian states (static data)

**Acceptance:**
- [ ] Product chart shows revenue/quantity per product type
- [ ] Map renders with color intensity per state
- [ ] Map click shows state detail tooltip
- [ ] Customer chart distinguishes new vs returning
- [ ] All charts respect the active time range

### Phase 4: Inventory + Production + Export
**Estimated effort:** Medium (2-3 hours)

**Dependencies:** Phase 3

**Files to create:**
- `v2/src/components/dashboard/inventory-table.tsx` — Table with low-stock warnings
- `v2/src/components/dashboard/production-metrics.tsx` — Dual-axis chart (sheets + plastic kg)
- `v2/src/components/dashboard/export-button.tsx` — CSV download for current view

**Files to modify:**
- `v2/src/app/admin/dashboard/page.tsx` — Wire in inventory and production sections

**Acceptance:**
- [ ] Inventory table shows all tracked products with stock levels
- [ ] Low stock (< 5) highlighted in red
- [ ] Production chart shows shift data over time
- [ ] Export downloads CSV with current filtered data
- [ ] All sections work on mobile (responsive grid)

### Phase 5: Polish + Performance + Optional Realtime
**Estimated effort:** Small-Medium (2-3 hours)

**Dependencies:** Phase 4

**Files to create:**
- `v2/src/components/dashboard/live-indicator.tsx` — Optional Supabase Realtime subscription for new orders

**Files to modify:**
- `v2/src/app/admin/dashboard/page.tsx` — Add loading skeletons, error boundaries
- `v2/src/lib/data/dashboard.ts` — Add Supabase RPC functions if JS aggregation is slow

**Optimizations:**
- Add `export const revalidate = 60` to page for ISR caching (1-minute freshness)
- Skeleton loading states for each chart section
- Error boundaries per section (one failing chart doesn't break the page)
- `React.Suspense` boundaries around each data section

**Acceptance:**
- [ ] Page loads in < 2 seconds on production
- [ ] Skeleton states shown during load
- [ ] Individual section errors are contained
- [ ] Mobile layout tested and usable

### Phase 6: Supabase RPC Functions (if needed)
**Estimated effort:** Small (1-2 hours)

**Dependencies:** Phase 5 (only if performance requires it)

**Database migrations to create:**
- `revenue_trend_by_day(from_date, to_date)` — Returns daily revenue aggregation
- `customer_acquisition_by_day(from_date, to_date)` — Returns new vs returning per day
- `product_performance_summary(from_date, to_date)` — Returns product breakdown

**Acceptance:**
- [ ] RPC functions return same shape as JS aggregation
- [ ] Query time < 100ms for 1-year range
- [ ] Dashboard data layer swapped to use RPCs

## File Structure Summary

```
v2/src/
  app/admin/dashboard/
    page.tsx                          <- Server Component, data fetching
  components/dashboard/
    dashboard-shell.tsx               <- Client: filter bar + layout
    time-range-selector.tsx           <- Client: time range buttons
    kpi-cards.tsx                     <- Server: 4 metric cards
    revenue-chart.tsx                 <- Client: Recharts line chart
    product-performance.tsx           <- Client: Recharts bar chart
    geographic-map.tsx                <- Client: Leaflet choropleth
    customer-acquisition.tsx          <- Client: Recharts area chart
    inventory-table.tsx               <- Server: stock level table
    production-metrics.tsx            <- Client: Recharts dual-axis
    export-button.tsx                 <- Client: CSV download
    live-indicator.tsx                <- Client: realtime order ping
  lib/
    types/dashboard.ts                <- TypeScript interfaces
    data/dashboard.ts                 <- fetchDashboardData()
    data/dashboard-utils.ts           <- Date helpers, CSV, transforms
    data/au-states.geojson.ts         <- Australian state boundaries
```

## Page Layout (Desktop)

```
+---------------------------------------------------------------+
| [Admin Nav]  Dashboard | Orders | Products | Messages | ...   |
+---------------------------------------------------------------+
| Dashboard                                                      |
| [Today] [7d] [30d] [90d] [Year] [Custom ___-___]  [Export v] |
+---------------------------------------------------------------+
| +-------------+ +-------------+ +-------------+ +----------+ |
| | $12,450      | | 23 Orders   | | $541 AOV    | | 3 Pending| |
| | +12.5% ^     | | +8.3% ^     | | +3.1% ^     | | Fulfill  | |
| +-------------+ +-------------+ +-------------+ +----------+ |
+---------------------------------------------------------------+
| Revenue Trend (Line Chart)                                     |
| $                                                              |
| |     /\    /\                                                 |
| |   /    \/    \   /                                           |
| | /              \/                                            |
| +---------------------------------------------------> dates   |
+---------------------------------------------------------------+
| Product Performance        | Geographic Distribution          |
| (Horizontal Bar Chart)     | (Leaflet Map of Australia)       |
| Stretch Bed  ████████ $10k | [Map with state coloring]        |
| Washing Mach ██ $1.2k     |                                   |
| Accessories  █ $250       |                                   |
+---------------------------+-----------------------------------+
| Customer Acquisition       | Production Metrics               |
| (Stacked Area Chart)      | (Dual Line: sheets + kg)         |
| New ▓▓▓  Returning ░░░   |                                   |
+---------------------------+-----------------------------------+
| Inventory Levels                                               |
| Product          | Type        | Stock | Status               |
| Stretch Bed      | stretch_bed |    12 | OK                   |
| Canvas Covers    | accessory   |     2 | LOW STOCK !!         |
+---------------------------------------------------------------+
```

**Mobile:** Cards stack vertically. Charts get full width. Map is scrollable. Table horizontally scrollable.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low order volume makes charts sparse | Medium | Show meaningful empty states ("Not enough data for this period"); allow wider time ranges |
| Supabase query performance on large date ranges | Medium | Start with JS aggregation; create RPC functions in Phase 6 if needed |
| Recharts + React 19 incompatibility | Low | Recharts 2.15+ supports React 19; pin version if issues arise |
| Geographic data quality (missing/malformed addresses) | Medium | Gracefully handle null states; show "Unknown" bucket |
| shipping_address is JSONB — querying nested fields | Low | Supabase supports `->>'field'` syntax; tested in existing codebase |
| Admin auth bypass | High | Dashboard lives inside `/admin/` which has auth guard in layout.tsx — no additional auth needed |
| Bundle size increase from recharts | Low | Only loaded on admin dashboard (code-split by Next.js App Router) |

## Open Questions

- [ ] Should the dashboard be the new admin landing page (replace current `/admin` page), or live at `/admin/dashboard` as a separate page?
- [ ] Are there specific revenue targets or KPI thresholds that should trigger visual alerts (e.g., "revenue below $X this week")?
- [ ] Should production shift data be correlated with order data (e.g., production-to-delivery pipeline)?
- [ ] Is there a need for user-level access control within the dashboard (e.g., production staff see only production metrics)?
- [ ] Should the 400+ tracked assets (from the `assets` table) have their own analytics section (asset lifecycle, condition distribution, community distribution)?

## Success Criteria

1. Admin user can view all 7 metric categories on a single page
2. Time range filter changes update all charts within 2 seconds
3. Dashboard renders correctly on iPhone SE (375px) through desktop (1440px)
4. CSV export produces valid file with current filtered data
5. No new API routes required (all data fetched server-side)
6. Page load time < 3 seconds on Vercel production deployment
7. Zero increase in public bundle size (dashboard code only loaded in /admin)
