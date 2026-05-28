import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { ClearCartOnSuccess } from './clear-cart';

// Force dynamic rendering - this page needs runtime access to Stripe
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

async function getSession(sessionId: string) {
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    });
    return session;
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect('/shop');
  }

  const session = await getSession(session_id);

  if (!session) {
    redirect('/shop');
  }

  // Fetch the matching order so we can branch the messaging for sponsorships.
  // The order is written by the Stripe webhook, which usually lands before the
  // browser redirects here — but if not, we degrade to the generic copy.
  const supabase = createServiceClient();
  const { data: order } = await supabase
    .from('orders')
    .select('is_sponsorship, sponsored_community, sponsor_message, order_number')
    .eq('stripe_checkout_session_id', session_id)
    .maybeSingle();

  const isSponsorship = order?.is_sponsorship === true;
  const sponsoredCommunity = order?.sponsored_community || null;
  const sponsorMessage = order?.sponsor_message || null;

  const customerEmail =
    typeof session.customer === 'object' &&
    session.customer &&
    'email' in session.customer &&
    session.customer.email
      ? session.customer.email
      : session.customer_email;

  return (
    <main className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Clear cart on client side */}
        <ClearCartOnSuccess />

        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {isSponsorship ? 'Thank you for sponsoring a bed.' : 'Thank you for your order!'}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {isSponsorship
              ? sponsoredCommunity
                ? `A Stretch Bed is on its way to ${sponsoredCommunity}.`
                : 'A Stretch Bed is on its way to a community that needs it.'
              : 'Your purchase makes a real difference in remote communities.'}
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-semibold text-foreground mb-4">Order Details</h2>

            <dl className="space-y-3 text-sm">
              {customerEmail && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Confirmation sent to</dt>
                  <dd className="text-foreground font-medium">{customerEmail}</dd>
                </div>
              )}

              <div className="flex justify-between">
                <dt className="text-muted-foreground">Order total</dt>
                <dd className="text-foreground font-medium">
                  {new Intl.NumberFormat('en-AU', {
                    style: 'currency',
                    currency: session.currency?.toUpperCase() || 'AUD',
                  }).format((session.amount_total || 0) / 100)}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted-foreground">Payment status</dt>
                <dd className="text-emerald-600 dark:text-emerald-400 font-medium capitalize">
                  {session.payment_status}
                </dd>
              </div>
            </dl>

            {/* Line Items */}
            {session.line_items?.data && session.line_items.data.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-foreground mb-3">Items ordered</h3>
                <ul className="space-y-2">
                  {session.line_items.data.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.description} × {item.quantity}
                      </span>
                      <span className="text-foreground">
                        {new Intl.NumberFormat('en-AU', {
                          style: 'currency',
                          currency: session.currency?.toUpperCase() || 'AUD',
                        }).format((item.amount_total || 0) / 100)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dedication echo (sponsorship only) */}
        {isSponsorship && sponsorMessage && (
          <Card className="mb-8 border-accent/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-2">Your message</h3>
              <p className="text-base italic text-muted-foreground">
                &ldquo;{sponsorMessage}&rdquo;
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                We&apos;ll pass this on with the bed when it&apos;s delivered.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Impact Message */}
        <Card className="mb-8 bg-accent/10 border-accent/20">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <svg
                className="h-8 w-8 text-accent flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-foreground">Your Impact</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isSponsorship
                    ? `Your sponsorship funds a Stretch Bed and the work to get it on Country${
                        sponsoredCommunity ? ` in ${sponsoredCommunity}` : ''
                      } — 20kg of recycled plastic diverted, one more home with a bed, one less step in the Rheumatic Heart Disease cascade.`
                    : 'Your purchase supports artisan employment and delivers comfort to families in remote Indigenous communities across Australia. Thank you for being part of this journey.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="font-semibold text-foreground mb-4">What happens next?</h2>
            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </span>
                <div>
                  <p className="font-medium text-foreground">Order confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll receive an email confirmation with your order details.
                  </p>
                </div>
              </li>
              {isSponsorship ? (
                <>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Allocation</p>
                      <p className="text-sm text-muted-foreground">
                        We allocate one bed from the next production run to{' '}
                        {sponsoredCommunity || 'the community with the greatest need'} and tag it
                        under your sponsorship.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-foreground">On Country</p>
                      <p className="text-sm text-muted-foreground">
                        Once the bed reaches its home, we&apos;ll email you the QR-code link so you
                        can follow exactly where it landed.
                      </p>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Preparation</p>
                      <p className="text-sm text-muted-foreground">
                        Our artisans will prepare your order with care.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-foreground">Shipping</p>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll ship your order and send tracking information.
                      </p>
                    </div>
                  </li>
                </>
              )}
            </ol>
          </CardContent>
        </Card>

        {/* Stay in the loop — explicit newsletter opt-in (separate consent from
            the transactional GHL contact the webhook already created). */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="p-6">
            <h2 className="font-semibold text-foreground mb-1">
              {isSponsorship ? 'Follow your bed onto Country' : 'Stay in the loop'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {isSponsorship
                ? 'Get the stories, photos and updates as beds reach the families who need them — including, where we can, the one you sponsored.'
                : 'Stories, photos and updates from the communities we work alongside. No spam, easy to unsubscribe.'}
            </p>
            <NewsletterSignup
              tag={isSponsorship ? 'sponsor' : 'customer'}
              defaultEmail={customerEmail || ''}
              buttonText="Keep me updated"
              successMessage="You're in. We'll keep you posted as beds land on Country."
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/impact">See Our Impact</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
