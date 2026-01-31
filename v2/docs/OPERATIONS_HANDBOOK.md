# Goods on Country - Operations Handbook

Daily operations guide for managing the Goods on Country e-commerce platform and content systems.

---

## Quick Reference

| Task | Frequency | Tool/Location |
|------|-----------|---------------|
| Check new orders | Daily | `/admin/orders` |
| Update order status | As needed | `/admin/orders/[id]` |
| Review product inventory | Weekly | `/admin/products` |
| Run content audit | Weekly | SQL scripts |
| Publish content to social | 3x/week | GHL + Empathy Ledger |
| Monthly impact report | Monthly | `/impact` page data |

---

## Daily Operations

### Morning Checklist

1. **Check New Orders**
   - Go to `/admin/orders?status=paid`
   - Review any new orders from overnight
   - Mark orders as "Processing" once confirmed

2. **Customer Communications**
   - Check email for customer inquiries
   - Respond to order status questions
   - Forward partnership inquiries to appropriate team member

3. **Inventory Check**
   - Verify stock levels at `/admin/products`
   - Flag any products with low inventory (< 5 units)
   - Coordinate with artisans for production needs

### Order Processing Workflow

```
New Order → Paid → Processing → Shipped → Delivered

1. PAID: Payment confirmed via Stripe
   - Verify order details
   - Confirm shipping address
   - Check inventory

2. PROCESSING: Preparing for shipment
   - Coordinate with artisan/warehouse
   - Package order
   - Print shipping label

3. SHIPPED: Order dispatched
   - Add tracking number in admin
   - Customer receives shipping notification
   - Monitor delivery progress

4. DELIVERED: Confirmed delivery
   - Mark as delivered in admin
   - Schedule delivery photo if applicable
   - Send follow-up survey (D+7)
```

---

## Weekly Operations

### Monday: Content Planning

1. **Review Content Calendar**
   - Check scheduled posts for the week
   - Identify any gaps in coverage
   - Assign content creation tasks

2. **Content Audit**
   - Run `scripts/empathy-ledger-content-audit.sql`
   - Tag any new relevant content
   - Update syndication consent if needed

### Wednesday: Order Fulfillment Review

1. **Check Processing Orders**
   - Review all orders in "Processing" status
   - Identify any blockers
   - Update customers on delays if any

2. **Shipping Updates**
   - Add tracking numbers for shipped orders
   - Follow up on delayed shipments
   - Update delivery estimates

### Friday: Reporting & Planning

1. **Weekly Stats**
   - Total orders this week
   - Revenue summary
   - Inventory changes
   - Customer feedback received

2. **Next Week Prep**
   - Confirm artisan availability
   - Check upcoming deliveries
   - Plan content for next week

---

## Content Operations

### Publishing Workflow

```
Content Created → Review → Approve → Tag → Publish → Promote

1. CREATED: Story/photo submitted to Empathy Ledger
2. REVIEW: Check for quality and cultural sensitivity
3. APPROVE: Elder approval if required
4. TAG: Add Goods project code and themes
5. PUBLISH: Set visibility to public
6. PROMOTE: Share on social channels
```

### Content Types Schedule

| Day | Content Type | Platform |
|-----|--------------|----------|
| Monday | Impact Story | Instagram, Website |
| Wednesday | Product Feature | Instagram, Facebook |
| Friday | Community Spotlight | All platforms |
| As needed | Delivery Story | All platforms |

### Social Media Guidelines

**Instagram:**
- Use storytelling captions (2-3 paragraphs)
- Include relevant hashtags: #GoodsOnCountry #BedsForCommunities
- Tag community partners when appropriate
- Always credit photographers/storytellers

**Facebook:**
- Longer-form content acceptable
- Share links to full stories on website
- Engage with comments promptly

### Empathy Ledger Content Tagging

When tagging content for Goods:

```sql
-- Tag media assets
UPDATE media_assets
SET project_code = 'goods'
WHERE id = '[asset-id]';

-- Add themes to stories
UPDATE stories
SET themes = themes || '["goods", "impact"]'::jsonb
WHERE id = '[story-id]';
```

---

## Order Fulfillment

### Standard Order Process

1. **Order Received**
   - Automatic email confirmation sent
   - Order appears in admin dashboard
   - Status: "Paid"

2. **Order Preparation**
   - Pull products from inventory
   - Quality check before shipping
   - Package securely
   - Mark as "Processing" in admin

3. **Shipping**
   - Generate shipping label
   - Record tracking number
   - Mark as "Shipped" in admin
   - Customer receives tracking notification

4. **Delivery**
   - Monitor tracking for issues
   - Mark as "Delivered" when confirmed
   - For community deliveries, coordinate photo documentation

### Sponsorship Orders

Special handling for "Buy for Community" orders:

1. **Identify Community**
   - Check `sponsored_community` field
   - Verify community contact details

2. **Coordinate Delivery**
   - Contact community coordinator
   - Schedule delivery time
   - Arrange for delivery photo/story

3. **Post-Delivery**
   - Upload delivery photos to Empathy Ledger
   - Create impact story (if consent given)
   - Send thank-you to sponsor with photos

4. **Impact Tracking**
   - Link order to asset in v1 system
   - Update impact metrics
   - Include in monthly report

---

## Admin Dashboard Guide

### Dashboard (`/admin`)

- **Overview Stats**: Total orders, pending fulfillment, revenue
- **Recent Orders**: Quick access to latest orders
- **Quick Actions**: Links to common tasks

### Orders (`/admin/orders`)

- **Filters**: Filter by status (Paid, Processing, Shipped, etc.)
- **Search**: Find orders by number or email
- **Bulk Actions**: Not yet implemented

### Order Detail (`/admin/orders/[id]`)

- **Order Info**: Items, totals, customer details
- **Status Update**: Change order status
- **Tracking**: Add/update tracking number
- **Notes**: Internal notes for team

### Products (`/admin/products`)

- **Inventory**: Update stock counts
- **Status**: Activate/deactivate products
- **Quick View**: Link to public product page

---

## Troubleshooting

### Order Issues

**Payment received but order not in system:**
1. Check Stripe dashboard for payment
2. Verify webhook is configured correctly
3. Check server logs for webhook errors
4. Manually create order if needed

**Customer didn't receive confirmation email:**
1. Verify email address in order
2. Check spam folder
3. Resend confirmation manually

**Tracking not updating:**
1. Verify tracking number is correct
2. Check with shipping carrier
3. Contact customer with update

### Content Issues

**Content not appearing on website:**
1. Verify `project_code = 'goods'`
2. Check visibility is `public`
3. Verify syndication consent
4. Clear cache or wait for expiry (5 min)

**Images not loading:**
1. Check image URL is accessible
2. Verify CORS settings
3. Check media asset status

### Admin Access Issues

**Can't login to admin:**
1. Verify email is in ADMIN_EMAILS list
2. Check Supabase Auth is working
3. Clear browser cookies and retry

---

## Emergency Contacts

| Role | Contact | When to Contact |
|------|---------|-----------------|
| Technical Support | [tech@act.place] | System outages, bugs |
| Operations Lead | [ops@goodsoncountry.org.au] | Order issues, escalations |
| Content Lead | [content@act.place] | Content approvals |
| Community Coordinator | [varies by region] | Delivery coordination |

---

## Monthly Procedures

### First Week of Month

1. **Monthly Report**
   - Pull order stats from admin
   - Calculate impact metrics
   - Update `/impact` page if needed

2. **Content Audit**
   - Full audit of Empathy Ledger content
   - Tag any missed content
   - Plan content for month

### Mid-Month

1. **Inventory Review**
   - Full stock count
   - Order production if needed
   - Update product availability

2. **Partner Communications**
   - Send sponsor impact updates
   - Follow up on partnership inquiries

### End of Month

1. **Financial Reconciliation**
   - Match Stripe payments to orders
   - Report any discrepancies

2. **Planning**
   - Set goals for next month
   - Schedule major content pieces
   - Coordinate community deliveries

---

## Appendix: SQL Quick Reference

### Check Recent Orders
```sql
SELECT order_number, customer_email, total_cents, status, created_at
FROM orders
ORDER BY created_at DESC
LIMIT 10;
```

### Orders by Status
```sql
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status;
```

### Revenue This Month
```sql
SELECT SUM(total_cents)/100 as revenue_aud
FROM orders
WHERE status NOT IN ('cancelled', 'refunded')
AND created_at >= DATE_TRUNC('month', NOW());
```

### Low Inventory Products
```sql
SELECT name, inventory_count
FROM products
WHERE is_active = true
AND track_inventory = true
AND inventory_count < 5;
```
