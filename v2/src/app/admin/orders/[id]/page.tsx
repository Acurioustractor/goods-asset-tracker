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

  // Server action to link an order item to a v1 asset
  async function linkAsset(formData: FormData) {
    'use server';

    const orderItemId = formData.get('order_item_id') as string;
    const assetId = formData.get('asset_id') as string;

    if (!orderItemId) return;

    const supabase = createServiceClient();

    // If asset_id is provided, validate it exists in v1 assets table
    if (assetId && assetId.trim()) {
      const { data: asset, error: assetError } = await supabase
        .from('assets')
        .select('unique_id')
        .eq('unique_id', assetId.trim())
        .single();

      if (assetError || !asset) {
        console.error('Asset not found:', assetId);
        // Still allow linking even if validation fails (v1 might be separate DB)
      }
    }

    const { error } = await supabase
      .from('order_items')
      .update({
        asset_id: assetId?.trim() || null,
      })
      .eq('id', orderItemId);

    if (error) {
      console.error('Failed to link asset:', error);
    }

    revalidatePath(`/admin/orders/${id}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; Back to Orders
          </Link>
          <h1 className="text-2xl font-bold mt-2">{order.order_number}</h1>
          <p className="text-gray-500">
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
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} &times; $
                          {formatAmountFromStripe(item.unit_price_cents)}
                        </p>
                      </div>
                      <div className="font-medium">
                        ${formatAmountFromStripe(item.total_cents)}
                      </div>
                    </div>

                    {/* Asset Linking Section */}
                    <div className="mt-3 ml-20 p-3 bg-gray-50 rounded-lg">
                      <form action={linkAsset} className="flex items-center gap-3">
                        <input type="hidden" name="order_item_id" value={item.id} />
                        <Label htmlFor={`asset-${item.id}`} className="text-sm text-gray-600 whitespace-nowrap">
                          Asset ID:
                        </Label>
                        <Input
                          id={`asset-${item.id}`}
                          name="asset_id"
                          defaultValue={item.asset_id || ''}
                          placeholder="e.g., GB0-22-001"
                          className="flex-1 h-8 text-sm"
                        />
                        <Button type="submit" size="sm" variant="outline">
                          {item.asset_id ? 'Update' : 'Link'}
                        </Button>
                      </form>
                      {item.asset_id && (
                        <div className="mt-2 flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            Linked: {item.asset_id}
                          </Badge>
                          <a
                            href={`/support?asset_id=${item.asset_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View QR Support Page
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${formatAmountFromStripe(order.subtotal_cents)}</span>
                </div>
                {order.shipping_cents > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
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

          {/* Sponsorship Details */}
          {order.is_sponsorship && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Sponsorship Order</span>
                  <Badge className="bg-purple-100 text-purple-800">
                    Buy for Community
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.sponsored_community && (
                  <p>
                    <strong>Community:</strong> {order.sponsored_community}
                  </p>
                )}
                {order.sponsor_message && (
                  <div className="mt-2">
                    <strong>Sponsor Message:</strong>
                    <p className="mt-1 text-gray-600 italic">
                      &ldquo;{order.sponsor_message}&rdquo;
                    </p>
                  </div>
                )}
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
                <Label className="text-gray-500">Email</Label>
                <p>
                  <a
                    href={`mailto:${order.customer_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.customer_email}
                  </a>
                </p>
              </div>
              {order.customer_phone && (
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p>{order.customer_phone}</p>
                </div>
              )}
              {order.customer_notes && (
                <div>
                  <Label className="text-gray-500">Customer Notes</Label>
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
                <span className="text-gray-500">Status</span>
                <PaymentBadge status={order.payment_status} />
              </div>
              {order.paid_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Paid</span>
                  <span>
                    {new Date(order.paid_at).toLocaleDateString('en-AU')}
                  </span>
                </div>
              )}
              {order.stripe_checkout_session_id && (
                <div className="text-xs text-gray-400 mt-2 break-all">
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
                  <div className="text-sm text-gray-500">
                    Shipped:{' '}
                    {new Date(order.shipped_at).toLocaleDateString('en-AU')}
                  </div>
                )}

                {order.delivered_at && (
                  <div className="text-sm text-gray-500">
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
                className="block text-center text-sm text-blue-600 hover:underline py-2"
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
    pending: 'bg-gray-100 text-gray-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
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
    refunded: 'bg-gray-100 text-gray-800',
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
