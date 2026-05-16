import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedMapWrapper } from './bed-map-wrapper';
import { InstallLogger } from './install-logger';
import { RecipientPanel } from './recipient-panel';
import { BedGallery, type BedGalleryItem } from './bed-gallery';
import { NameYourBed } from './name-your-bed';
import { PulseCheck } from './pulse-check';
import { ContactRow } from './contact-row';
import { BedFaq } from './bed-faq';
import { SetupVideo } from './setup-video';
import { PartsDiagram } from './parts-diagram';
import { CommunityBeds } from './community-beds';
import { ReminderForm } from './reminder-form';
import { DemandButton } from './demand-button';
import { CoopInvite } from './coop-invite';
import { BehindThisBed } from './behind-this-bed';

type AdminUserShape = {
  email?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
} | null;

function isAdminUser(user: AdminUserShape) {
  if (!user) return false;
  if ((user.app_metadata as { role?: string })?.role === 'admin') return true;
  if ((user.user_metadata as { role?: string })?.role === 'admin') return true;
  const allow = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return allow.includes(user.email || '');
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: asset } = await supabase
    .from('assets')
    .select('product, name')
    .eq('unique_id', id)
    .single();
  const isMachine = /machine/i.test(asset?.product || '');
  const label = isMachine ? 'Washing Machine' : 'Stretch Bed';
  const noun = isMachine ? 'machine' : 'bed';
  return {
    title: `${label} ${id}: Track Your Goods`,
    description: `Follow the journey of ${label} ${id}, from recycled plastic to community impact. Made by Goods on Country.`,
    openGraph: {
      title: `${label} ${id}`,
      description: `Follow this ${noun}'s journey from recycled materials to community impact.`,
    },
  };
}

const EVENT_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  created: { label: 'Manufactured', icon: '🔨', color: 'bg-amber-500' },
  in_production: { label: 'In Production', icon: '⚙️', color: 'bg-orange-500' },
  quality_check: { label: 'Quality Check', icon: '✅', color: 'bg-green-500' },
  ready: { label: 'Ready to Ship', icon: '📦', color: 'bg-blue-500' },
  shipped: { label: 'Shipped', icon: '🚚', color: 'bg-indigo-500' },
  in_transit: { label: 'In Transit', icon: '🛤️', color: 'bg-violet-500' },
  delivered: { label: 'Delivered', icon: '🏠', color: 'bg-emerald-500' },
  setup: { label: 'Set Up', icon: '🛏️', color: 'bg-teal-500' },
  photo_update: { label: 'Photo Update', icon: '📸', color: 'bg-pink-500' },
};

interface BedPageProps {
  params: Promise<{ id: string }>;
}

export default async function BedPage({ params }: BedPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Check if visitor is an admin (Goods staff in the field)
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = isAdminUser(user);

  // Fetch asset details
  const { data: asset } = await supabase
    .from('assets')
    .select('unique_id, name, product, community, community_id, place, status, supply_date, created_time, photo, gps, display_name, display_name_public')
    .eq('unique_id', id)
    .single();

  // Canonical community options (only fetched when an admin is on this page)
  const communityOptions = isAdmin
    ? ((await supabase
        .from('communities')
        .select('id, name, state, status')
        .order('status', { ascending: true })
        .order('name', { ascending: true })
      ).data || [])
    : [];

  // Has the current user already claimed this asset?
  let isClaimedByMe = false;
  if (user && asset) {
    const { data: claim } = await supabase
      .from('user_assets')
      .select('id')
      .eq('profile_id', user.id)
      .eq('asset_id', asset.unique_id)
      .maybeSingle();
    isClaimedByMe = !!claim;
  }

  // Fetch all assets for the map (aggregate by community)
  const { data: allAssets } = await supabase
    .from('assets')
    .select('unique_id, community, gps, product, status');

  // Fetch photos linked to this asset. Public gallery shows only is_public=true
  // unless the viewer is the claimant or an admin (full visibility for the bed's owner).
  const compassionQuery = supabase
    .from('compassion_content')
    .select('id, content_type, media_url, thumbnail_url, caption, created_by, created_at, is_public')
    .eq('asset_id', id)
    .eq('content_type', 'photo')
    .not('media_url', 'is', null)
    .order('created_at', { ascending: false });

  const seeAllPhotos = isAdmin || isClaimedByMe;
  const { data: compassionRows } = seeAllPhotos
    ? await compassionQuery
    : await compassionQuery.eq('is_public', true);

  const galleryItems: BedGalleryItem[] = (compassionRows || []).map((row) => ({
    id: row.id,
    url: row.media_url as string,
    thumbnail: (row.thumbnail_url as string) || null,
    caption: (row.caption as string) || null,
    byline: row.created_by && row.created_by !== 'Bed scan submission' ? (row.created_by as string) : null,
    createdAt: row.created_at as string,
  }));

  // Recent production shifts for the "Behind this bed" card
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400_000).toISOString().slice(0, 10);
  const { data: shiftRows } = await supabase
    .from('production_shifts')
    .select('operator, shift_date, sheets_produced, beds_assembled, photo_urls')
    .gte('shift_date', ninetyDaysAgo)
    .order('shift_date', { ascending: false })
    .limit(50);

  // Aggregate by first name so "Ben Knight" + "Ben" collapse into one Ben.
  // First-name-only is intentional for the public page (operators didn't opt in to full-name attribution).
  const operatorMap = new Map<string, { operator: string; lastShift: string; sheetsThisYear: number }>();
  const productionPhotos: string[] = [];
  for (const shift of shiftRows || []) {
    const opName = (shift.operator as string)?.trim();
    if (opName) {
      const firstName = opName.split(/\s+/)[0] || opName;
      const prev = operatorMap.get(firstName);
      if (!prev) {
        operatorMap.set(firstName, {
          operator: firstName,
          lastShift: shift.shift_date as string,
          sheetsThisYear: (shift.sheets_produced as number) || 0,
        });
      } else {
        prev.sheetsThisYear += (shift.sheets_produced as number) || 0;
        if ((shift.shift_date as string) > prev.lastShift) {
          prev.lastShift = shift.shift_date as string;
        }
      }
    }
    for (const url of (shift.photo_urls as string[]) || []) {
      if (productionPhotos.length < 9 && url) productionPhotos.push(url);
    }
  }
  const recentOperators = Array.from(operatorMap.values()).sort(
    (a, b) => b.sheetsThisYear - a.sheetsThisYear,
  );

  // Sibling assets in the same community (for the CommunityBeds card)
  let siblingAssets: {
    unique_id: string;
    display_name: string | null;
    display_name_public: boolean | null;
    product: string | null;
    status: string | null;
  }[] = [];
  let communityTotal = 0;
  if (asset?.community_id) {
    const { data: sibs, count } = await supabase
      .from('assets')
      .select('unique_id, display_name, display_name_public, product, status', { count: 'exact' })
      .eq('community_id', asset.community_id)
      .order('status', { ascending: true })
      .order('unique_id', { ascending: true })
      .limit(9);
    siblingAssets = sibs || [];
    communityTotal = count || 0;
  }

  // Fetch journey events
  const { data: journeyEvents } = await supabase
    .from('bed_journeys')
    .select('*')
    .eq('asset_id', id)
    .order('event_date', { ascending: true });

  const events = journeyEvents || [];

  const isMachine = /machine/i.test(asset?.product || '');
  const productLabel = isMachine ? 'Washing Machine' : 'Stretch Bed';
  const productNoun = isMachine ? 'machine' : 'bed';
  const heroImage = isMachine
    ? '/images/product/washing-machine-hero.jpg'
    : '/images/product/stretch-bed-hero.jpg';

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-xl font-semibold mb-2">Bed Not Found</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We couldn&apos;t find a bed with ID: <strong>{id}</strong>
            </p>
            <Button asChild>
              <Link href="/">Visit Goods on Country</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero banner with product image */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white overflow-hidden">
        <div className="grid md:grid-cols-2 items-center max-w-6xl mx-auto">
          <div className="py-16 px-6 md:px-12">
            <p className="text-amber-300 font-medium text-sm tracking-widest uppercase mb-3">
              Goods on Country
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
              {asset.display_name && asset.display_name_public
                ? `“${asset.display_name}”`
                : isMachine ? 'This is your washing machine' : 'This is your bed'}
            </h1>
            <p className="text-white/80 text-base mb-4">
              {asset.community
                ? `Made by Goods on Country · ${asset.community}`
                : 'Made by Goods on Country'}
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-xs mb-4">
              <span className="text-amber-300 font-mono font-bold">{asset.unique_id}</span>
            </div>
            <NameYourBed
              uniqueId={asset.unique_id}
              productNoun={productNoun}
              initialName={asset.display_name}
              initialPublic={asset.display_name_public ?? true}
            />
          </div>
          <div className="relative h-64 md:h-full md:min-h-[400px]">
            <Image
              src={heroImage}
              alt={isMachine
                ? 'Pakkimjalki Kari: washing machine by Goods on Country'
                : 'The Stretch Bed: recycled plastic, galvanised steel, heavy-duty canvas'}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Goods-staff install logger: only renders for authed admins */}
      {isAdmin && user?.email && (
        <InstallLogger
          uniqueId={asset.unique_id}
          productLabel={productLabel}
          adminEmail={user.email}
          communityOptions={communityOptions}
          initial={{
            community: asset.community,
            community_id: asset.community_id,
            place: asset.place,
            gps: asset.gps,
            status: asset.status,
          }}
        />
      )}

      {/* Recipient-first panel: claim, ask, story, support */}
      <RecipientPanel
        uniqueId={asset.unique_id}
        productLabel={productLabel}
        productNoun={productNoun}
        community={asset.community}
        communityId={asset.community_id}
        place={asset.place}
        status={asset.status}
        isAuthed={!!user}
        isClaimed={isClaimedByMe}
      />

      {/* Pulse check — single tap, no login. Up high so it's the easiest signal to leave. */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <PulseCheck uniqueId={asset.unique_id} productNoun={productNoun} />
      </div>

      {/* Photos linked to this asset (Goods staff + recipient uploads) */}
      <BedGallery items={galleryItems} productNoun={productNoun} uniqueId={asset.unique_id} />

      {/* Direct contact: WhatsApp / SMS / phone */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <ContactRow uniqueId={asset.unique_id} productNoun={productNoun} />
      </div>

      {/* Setup video + quick answers */}
      <div className="max-w-3xl mx-auto px-4 mt-6 grid gap-4 md:grid-cols-2">
        <SetupVideo productNoun={productNoun} isMachine={isMachine} />
        <BedFaq uniqueId={asset.unique_id} productNoun={productNoun} isMachine={isMachine} />
      </div>

      {/* Parts diagram */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <PartsDiagram isMachine={isMachine} />
      </div>

      {/* Community context first — emotionally closer than the supply chain */}
      {asset.community && asset.community_id && (
        <div className="max-w-5xl mx-auto px-4 mt-6">
          <CommunityBeds
            community={asset.community}
            communityId={asset.community_id}
            currentUniqueId={asset.unique_id}
            siblings={siblingAssets}
            totalCount={communityTotal}
          />
        </div>
      )}

      {/* Behind this bed: materials + suppliers + Alice plant team */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <BehindThisBed
          productNoun={productNoun}
          productionPhotos={productionPhotos}
          recentOperators={recentOperators}
          isMachine={isMachine}
        />
      </div>

      {/* Stay-in-touch options: reminder, demand, workshop */}
      <div className="max-w-3xl mx-auto px-4 mt-6 grid gap-3 md:grid-cols-3">
        <ReminderForm uniqueId={asset.unique_id} productNoun={productNoun} />
        <DemandButton
          uniqueId={asset.unique_id}
          productNoun={productNoun}
          community={asset.community}
        />
        <CoopInvite uniqueId={asset.unique_id} community={asset.community} />
      </div>

      {/* Map: where is this bed? */}
      {allAssets && allAssets.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-6 relative z-0">
          <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 pb-2">
              <h2 className="font-display text-lg font-bold">Where Is This Bed?</h2>
              <p className="text-muted-foreground text-xs">
                Your bed is at {asset.place || asset.community || 'its community'}. See all Goods products deployed across Australia.
              </p>
            </div>
            <BedMapWrapper currentAssetId={id} assets={allAssets} />
          </div>
        </div>
      )}

      {/* Journey timeline — only if this bed actually has events. Recipient sentimental value. */}
      {events.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 mt-6">
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="font-display text-lg font-bold">This {productNoun.toLowerCase()}&apos;s journey</h2>
              <p className="text-xs text-muted-foreground">
                Every milestone from manufacture to delivery.
              </p>
            </div>
            <div className="relative pl-8 pr-4 py-4 space-y-4">
              <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-border" />
              {events.map((event, i) => {
                const meta = EVENT_LABELS[event.event_type] || {
                  label: event.event_type,
                  icon: '📍',
                  color: 'bg-gray-500',
                };
                return (
                  <div key={event.id} className="relative">
                    <div
                      className={`absolute -left-5 top-1 w-4 h-4 rounded-full ${meta.color} border-2 border-background flex items-center justify-center`}
                    >
                      {i === events.length - 1 && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <span>{meta.icon}</span>
                        <h3 className="font-semibold text-sm">{meta.label}</h3>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(event.event_date).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tight footer — recipient already has the bed, so no buy CTA. One link to the wider story. */}
      <footer className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-xs text-muted-foreground">
          Made by Goods on Country ·{' '}
          <Link href="/story" className="underline hover:text-foreground">
            Why this exists
          </Link>
        </p>
      </footer>
    </div>
  );
}
