import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatAmountFromStripe } from '@/lib/stripe';
import type { Order, OrderItem, Address } from '@/lib/types/database';
import { ghl, tagForAsset } from '@/lib/ghl';

// V1 Asset type for display
interface V1Asset {
  unique_id: string;
  product: string;
  community: string;
  name: string | null;
}

interface PageParams {
  id: string;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  const orderItems = (order.order_items || []) as OrderItem[];
  const shippingAddress = order.shipping_address as Address | null;
  const billingAddress = order.billing_address as Address | null;

  // Pull available beds for the allocator dropdown — status='ready' and not yet allocated.
  // These are the candidates to assign to this order's line items.
  const serviceClient = createServiceClient();
  const { data: availableBeds } = await serviceClient
    .from('assets')
    .select('unique_id, product, community')
    .eq('status', 'ready')
    .order('unique_id', { ascending: true })
    .limit(500);

  // Server action to update order status
  async function updateOrderStatus(formData: FormData) {
    'use server';

    const newStatus = formData.get('status') as string;
    const trackingNumber = formData.get('tracking_number') as string;
    const internalNotes = formData.get('internal_notes') as string;

    const supabase = await createClient();

    const updates: Partial<Order> = {
      status: newStatus as Order['status'],
      internal_notes: internalNotes || null,
    };

    // Add tracking number and shipped_at if shipping
    if (newStatus === 'shipped' && trackingNumber) {
      updates.tracking_number = trackingNumber;
      updates.shipped_at = new Date().toISOString();
    }

    // Add delivered_at if delivered
    if (newStatus === 'delivered') {
      updates.delivered_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Failed to update order:', error);
    }

    revalidatePath(`/admin/orders/${id}`);
    revalidatePath('/admin/orders');
    revalidatePath('/admin');
  }

  // Server action to add tracking number
  async function addTracking(formData: FormData) {
    'use server';

    const trackingNumber = formData.get('tracking_number') as string;

    if (!trackingNumber) return;

    const supabase = await createClient();

    const { error } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
      })
      .eq('id', id);

    if (error) {
      console.error('Failed to add tracking:', error);
    }

    revalidatePath(`/admin/orders/${id}`);
  }

  // Server action to allocate a v1 asset to an order item.
  // Side effects when an asset is set: update asset status → 'allocated', stamp the
  // shipping city as the community, and tag the buyer's GHL contact with
  // goods-asset-{id} so the bidirectional bed↔contact link fires for buyers.
  async function linkAsset(formData: FormData) {
    'use server';

    const orderItemId = formData.get('order_item_id') as string;
    const rawAssetId = formData.get('asset_id') as string;
    const assetId = rawAssetId?.trim() || null;

    if (!orderItemId) return;

    const supabase = createServiceClient();

    // Update the order_items row first (works whether allocating or unlinking)
    const { error: itemErr } = await supabase
      .from('order_items')
      .update({ asset_id: assetId })
      .eq('id', orderItemId);

    if (itemErr) {
      console.error('Failed to link asset:', itemErr);
      revalidatePath(`/admin/orders/${id}`);
      return;
    }

    // If unlinking, we're done — leave the asset row alone (admin can manage it manually).
    if (!assetId) {
      revalidatePath(`/admin/orders/${id}`);
      return;
    }

    // Re-read the order so we have the latest shipping address + customer info.
    const { data: fullOrder } = await supabase
      .from('orders')
      .select('order_number, customer_email, customer_phone, customer_name, shipping_address, is_sponsorship, sponsored_community')
      .eq('id', id)
      .single();

    // Pick the destination community: explicit sponsor target wins, else shipping city.
    const shipping = (fullOrder?.shipping_address as Address | null) || null;
    const destination =
      fullOrder?.sponsored_community ||
      (shipping?.city ? `${shipping.city}${shipping.state ? `, ${shipping.state}` : ''}` : null);

    // Update the asset record: move status from 'ready' → 'allocated', stamp destination.
    const { error: assetErr } = await supabase
      .from('assets')
      .update({
        status: 'allocated',
        ...(destination ? { community: destination, place: shipping?.line1 || null } : {}),
      })
      .eq('unique_id', assetId);

    if (assetErr) {
      console.error('Failed to update asset on allocation:', assetErr);
    }

    // Tag the buyer's GHL contact with goods-asset-{id} so the owners card on
    // /admin/assets/{id} surfaces them. Best-effort — don't block the allocation
    // if GHL is down.
    if (fullOrder?.customer_email) {
      try {
        const result = await ghl.createInquiryContact(
          fullOrder.customer_email,
          fullOrder.customer_name || undefined,
          ['goods-customer', 'goods-bed-owner', tagForAsset(assetId)],
          { source: 'Admin Manual Entry' },
        );
        if (result.success && result.contact?.id) {
          const note = [
            `🔗 Bed ${assetId} allocated to ${fullOrder.order_number}`,
            destination ? `Destination: ${destination}` : null,
            `Allocated: ${new Date().toLocaleString('en-AU')}`,
          ]
            .filter(Boolean)
            .join('\n');
          await ghl.addNote(result.contact.id, note);
        }
      } catch (err) {
        console.error('[linkAsset] GHL tag failed:', err);
      }
    }

    revalidatePath(`/admin/orders/${id}`);
    revalidatePath(`/admin/assets/${assetId}`);
    revalidatePath('/admin/assets');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Back to Orders
          </Link>
          <h1 className="font-display text-2xl font-bold mt-2">{order.order_number}</h1>
          <p className="text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.payment_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details - Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sponsorship fulfilment briefing — first thing the field team sees when
              opening a sponsored order. Surfaces the destination community and the
              dedication message that needs to travel with the bed. */}
          {order.is_sponsorship && (
            <Card className="border-2 border-[#C45C3E]/40 bg-[#FDF8F3]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <span>Sponsorship · Fulfilment briefing</span>
                  </CardTitle>
                  <Badge className="bg-[#C45C3E] text-white hover:bg-[#C45C3E]">
                    Buy for community
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Destination
                    </p>
                    <p className="font-semibold text-base text-foreground">
                      {order.sponsored_community || 'Wherever the need is greatest'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Sponsored by
                    </p>
                    <p className="font-semibold text-base text-foreground">
                      {order.customer_name || order.customer_email || '—'}
                    </p>
                    {order.customer_name && order.customer_email && (
                      <p className="text-xs text-muted-foreground truncate">
                        {order.customer_email}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      Beds
                    </p>
                    <p className="font-semibold text-base text-foreground">
                      {orderItems.reduce((sum, item) => sum + item.quantity, 0)}{' '}
                      &times; Stretch Bed
                    </p>
                  </div>
                </div>

                {order.sponsor_message ? (
                  <div className="rounded-xl bg-card border border-[#C45C3E]/30 p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#C45C3E] mb-2 font-medium">
                      Message to pass on with the bed
                    </p>
                    <p className="text-lg italic text-foreground leading-snug">
                      &ldquo;{order.sponsor_message}&rdquo;
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No dedication message from the sponsor.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 border-b last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      {item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} &times; $
                          {formatAmountFromStripe(item.unit_price_cents)}
                        </p>
                      </div>
                      <div className="font-medium">
                        ${formatAmountFromStripe(item.total_cents)}
                      </div>
                    </div>

                    {/* Asset Allocation Section */}
                    <div className="mt-3 ml-20 p-3 bg-muted rounded-lg space-y-2">
                      {(() => {
                        // Narrow available beds to product type when we can match. The product_type
                        // on the order_item is informal (e.g. "stretch-bed-single"); the asset row
                        // carries "stretch_bed" / "washing_machine". Match loosely.
                        const wantsBed = (item.product_type || item.product_name || '').toLowerCase().includes('bed');
                        const wantsWasher = (item.product_type || item.product_name || '').toLowerCase().includes('wash');
                        const candidates = (availableBeds || []).filter((b) => {
                          if (wantsBed) return (b.product || '').toLowerCase().includes('bed');
                          if (wantsWasher) return (b.product || '').toLowerCase().includes('wash');
                          return true;
                        });

                        return (
                          <>
                            <form action={linkAsset} className="flex items-center gap-2">
                              <input type="hidden" name="order_item_id" value={item.id} />
                              <Label htmlFor={`asset-pick-${item.id}`} className="text-sm text-muted-foreground whitespace-nowrap">
                                Allocate bed:
                              </Label>
                              <select
                                id={`asset-pick-${item.id}`}
                                name="asset_id"
                                defaultValue={item.asset_id || ''}
                                className="flex-1 h-8 rounded border border-input px-2 text-sm bg-card"
                              >
                                <option value="">— pick from {candidates.length} available —</option>
                                {item.asset_id && (
                                  <option value={item.asset_id}>
                                    {item.asset_id} (current)
                                  </option>
                                )}
                                {candidates
                                  .filter((b) => b.unique_id !== item.asset_id)
                                  .map((b) => (
                                    <option key={b.unique_id} value={b.unique_id}>
                                      {b.unique_id}
                                      {b.community ? ` · ${b.community}` : ''}
                                    </option>
                                  ))}
                              </select>
                              <Button type="submit" size="sm" variant="outline">
                                {item.asset_id ? 'Update' : 'Allocate'}
                              </Button>
                            </form>

                            <form action={linkAsset} className="flex items-center gap-2">
                              <input type="hidden" name="order_item_id" value={item.id} />
                              <Label htmlFor={`asset-${item.id}`} className="text-sm text-muted-foreground whitespace-nowrap">
                                Or type ID:
                              </Label>
                              <Input
                                id={`asset-${item.id}`}
                                name="asset_id"
                                placeholder="e.g., GB0-156-7"
                                className="flex-1 h-8 text-sm"
                              />
                              <Button type="submit" size="sm" variant="ghost">
                                Link
                              </Button>
                            </form>
                          </>
                        );
                      })()}

                      {item.asset_id && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <Badge className="bg-green-100 text-green-800">
                            Linked: {item.asset_id}
                          </Badge>
                          <Link
                            href={`/admin/assets/${item.asset_id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            Open in admin
                          </Link>
                          <a
                            href={`/bed/${item.asset_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Public page
                          </a>
                          <form action={linkAsset} className="inline">
                            <input type="hidden" name="order_item_id" value={item.id} />
                            <input type="hidden" name="asset_id" value="" />
                            <button
                              type="submit"
                              className="text-xs text-red-600 hover:underline"
                            >
                              Unlink
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${formatAmountFromStripe(order.subtotal_cents)}</span>
                </div>
                {order.shipping_cents > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${formatAmountFromStripe(order.shipping_cents)}</span>
                  </div>
                )}
                {order.discount_cents > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>
                      -${formatAmountFromStripe(order.discount_cents)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ${formatAmountFromStripe(order.total_cents)}{' '}
                    {order.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic">
                  {order.customer_name && <div>{order.customer_name}</div>}
                  <div>{shippingAddress.line1}</div>
                  {shippingAddress.line2 && <div>{shippingAddress.line2}</div>}
                  <div>
                    {shippingAddress.city}, {shippingAddress.state}{' '}
                    {shippingAddress.postcode}
                  </div>
                  <div>{shippingAddress.country}</div>
                </address>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p>
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="text-primary hover:underline"
                  >
                    {order.customer_email}
                  </a>
                </p>
              </div>
              {order.customer_phone && (
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p>{order.customer_phone}</p>
                </div>
              )}
              {order.customer_notes && (
                <div>
                  <Label className="text-muted-foreground">Customer Notes</Label>
                  <p className="text-sm">{order.customer_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <PaymentBadge status={order.payment_status} />
              </div>
              {order.paid_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span>
                    {new Date(order.paid_at).toLocaleDateString('en-AU')}
                  </span>
                </div>
              )}
              {order.stripe_checkout_session_id && (
                <div className="text-xs text-muted-foreground mt-2 break-all">
                  Session: {order.stripe_checkout_session_id}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fulfillment Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Fulfillment</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateOrderStatus} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <select
                    name="status"
                    id="status"
                    defaultValue={order.status}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tracking_number">Tracking Number</Label>
                  <Input
                    name="tracking_number"
                    id="tracking_number"
                    defaultValue={order.tracking_number || ''}
                    placeholder="Enter tracking number"
                  />
                </div>

                {order.shipped_at && (
                  <div className="text-sm text-muted-foreground">
                    Shipped:{' '}
                    {new Date(order.shipped_at).toLocaleDateString('en-AU')}
                  </div>
                )}

                {order.delivered_at && (
                  <div className="text-sm text-muted-foreground">
                    Delivered:{' '}
                    {new Date(order.delivered_at).toLocaleDateString('en-AU')}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="internal_notes">Internal Notes</Label>
                  <textarea
                    name="internal_notes"
                    id="internal_notes"
                    defaultValue={order.internal_notes || ''}
                    className="w-full border rounded-md px-3 py-2 text-sm min-h-[80px]"
                    placeholder="Notes for internal use only..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Update Order
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.status === 'paid' && (
                <form action={updateOrderStatus}>
                  <input type="hidden" name="status" value="processing" />
                  <input
                    type="hidden"
                    name="internal_notes"
                    value={order.internal_notes || ''}
                  />
                  <Button variant="outline" className="w-full" type="submit">
                    Mark as Processing
                  </Button>
                </form>
              )}
              {order.status === 'processing' && (
                <form action={updateOrderStatus}>
                  <input type="hidden" name="status" value="shipped" />
                  <input
                    type="hidden"
                    name="internal_notes"
                    value={order.internal_notes || ''}
                  />
                  <Button variant="outline" className="w-full" type="submit">
                    Mark as Shipped
                  </Button>
                </form>
              )}
              {order.status === 'shipped' && (
                <form action={updateOrderStatus}>
                  <input type="hidden" name="status" value="delivered" />
                  <input
                    type="hidden"
                    name="internal_notes"
                    value={order.internal_notes || ''}
                  />
                  <Button variant="outline" className="w-full" type="submit">
                    Mark as Delivered
                  </Button>
                </form>
              )}
              <a
                href={`mailto:${order.customer_email}`}
                className="block text-center text-sm text-primary hover:underline py-2"
              >
                Email Customer
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    pending: 'bg-muted text-foreground',
    paid: 'bg-primary/10 text-primary',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-muted text-foreground',
  };

  return (
    <Badge className={variants[status] || variants.pending}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    unpaid: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    refunded: 'bg-muted text-foreground',
    partial_refund: 'bg-yellow-100 text-yellow-800',
  };

  const labels: Record<string, string> = {
    unpaid: 'Unpaid',
    paid: 'Paid',
    refunded: 'Refunded',
    partial_refund: 'Partial Refund',
  };

  return (
    <Badge className={variants[status] || variants.unpaid}>
      {labels[status] || status}
    </Badge>
  );
}
