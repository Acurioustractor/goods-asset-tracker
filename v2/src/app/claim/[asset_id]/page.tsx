import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClaimButton } from './claim-button';

export const metadata = {
  title: 'Claim Your Item - Goods on Country',
  description: 'Claim your bed or washing machine',
};

interface ClaimPageProps {
  params: Promise<{ asset_id: string }>;
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { asset_id } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get asset details
  const { data: asset, error } = await supabase
    .from('assets')
    .select('unique_id, name, product, community, place')
    .eq('unique_id', asset_id)
    .single();

  if (error || !asset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Item Not Found</h2>
            <p className="text-muted-foreground text-sm mb-4">
              We couldn&apos;t find an item with ID: {asset_id}
            </p>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isBed = asset.product?.toLowerCase().includes('bed');
  const isWasher =
    asset.product?.toLowerCase().includes('washing') ||
    asset.product?.toLowerCase().includes('machine');
  const icon = isBed ? '🛏️' : isWasher ? '🧺' : '📦';

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardHeader className="text-center">
              <div className="text-5xl mb-2">{icon}</div>
              <CardTitle className="text-2xl">Claim Your {asset.product || 'Item'}</CardTitle>
              <CardDescription>
                Sign in to register this item to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{asset.product || 'Item'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-medium">{asset.unique_id}</span>
                </div>
                {asset.community && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Community</span>
                    <span className="font-medium">{asset.community}</span>
                  </div>
                )}
              </div>

              <Button asChild className="w-full">
                <Link href={`/auth/phone-login?asset_id=${asset_id}`}>
                  Sign In to Claim
                </Link>
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Don&apos;t have an account? Signing in will create one for you.
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Back to Goods on Country
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Check if already claimed by this user
  const { data: existingClaim } = await supabase
    .from('user_assets')
    .select('id, claimed_at')
    .eq('profile_id', user.id)
    .eq('asset_id', asset_id)
    .single();

  if (existingClaim) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-5xl mb-2">✅</div>
            <CardTitle className="text-2xl">Already Claimed</CardTitle>
            <CardDescription>
              You claimed this item on{' '}
              {new Date(existingClaim.claimed_at).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Product</span>
                <span className="font-medium">{asset.product || 'Item'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID</span>
                <span className="font-medium">{asset.unique_id}</span>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href="/my-items">Go to My Items</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is logged in and hasn't claimed - show claim confirmation
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-accent to-accent/80 text-white text-center rounded-t-xl">
            <div className="text-5xl mb-2">{icon}</div>
            <CardTitle className="text-2xl text-white">Claim This Item?</CardTitle>
            <CardDescription className="text-white/80">
              Register this item to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Product</span>
                <span className="font-medium text-sm">{asset.product || 'Item'}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-muted-foreground text-sm">ID</span>
                <span className="font-medium text-sm">{asset.unique_id}</span>
              </div>
              {asset.community && (
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground text-sm">Community</span>
                  <span className="font-medium text-sm">{asset.community}</span>
                </div>
              )}
            </div>

            <ClaimButton assetId={asset_id} />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/my-items" className="hover:text-primary transition-colors">
            Go to My Items
          </Link>
        </p>
      </div>
    </div>
  );
}
