import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { STRETCH_BED, WASHING_MACHINE } from '@/lib/data/products';
import { story } from '@/lib/data/content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaSlot } from '@/components/ui/media-slot';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { BedPhotoGallery } from './bed-photo-gallery';
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
                : isMachine ? 'This Is Your Washing Machine' : 'This Is Your Bed'}
            </h1>
            {asset.display_name && asset.display_name_public && (
              <p className="text-amber-200/80 text-sm mb-3">
                {isMachine ? 'A washing machine' : 'A bed'} by Goods on Country
              </p>
            )}
            <p className="text-white/80 text-lg mb-6">
              Every Goods {productNoun} has a story. Scan the QR code to see where it came from,
              what it&apos;s made of, and the community it supports.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-5 py-2.5 text-sm">
                <span className="text-amber-300 font-mono font-bold">{asset.unique_id}</span>
                <span className="text-white/50">|</span>
                <span>{asset.product || productLabel}</span>
                {asset.community && (
                  <>
                    <span className="text-white/50">|</span>
                    <span>{asset.community}</span>
                  </>
                )}
              </div>
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

      {/* Photos linked to this asset (Goods staff + recipient uploads) */}
      <BedGallery items={galleryItems} productNoun={productNoun} />

      {/* Pulse check — single tap, no login */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <PulseCheck uniqueId={asset.unique_id} productNoun={productNoun} />
      </div>

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

      {/* Behind this bed: materials + suppliers + Alice plant team */}
      <div className="max-w-3xl mx-auto px-4 mt-4">
        <BehindThisBed
          productNoun={productNoun}
          productionPhotos={productionPhotos}
          recentOperators={recentOperators}
          isMachine={isMachine}
        />
      </div>

      {/* Community context: how many beds here */}
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

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">
        {/* What is this product? */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">
            {isMachine ? `What Is the ${WASHING_MACHINE.name}?` : 'What Is the Stretch Bed?'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {(isMachine
              ? [
                  { label: 'Base unit', value: WASHING_MACHINE.specs.baseUnit },
                  { label: 'Designed lifespan', value: '10–15 years in remote conditions' },
                  { label: 'Operation', value: 'One-button, washable, low-water' },
                  { label: 'Housing', value: 'Recycled HDPE plastic skin' },
                  { label: 'Status', value: 'Prototype: deployed in TC, MNG, PI' },
                  { label: 'Named by', value: 'Elder Dianne Stokes (Warumungu)' },
                ]
              : [
                  { label: 'Weight', value: STRETCH_BED.specs.weight },
                  { label: 'Capacity', value: STRETCH_BED.specs.loadCapacity },
                  { label: 'Dimensions', value: STRETCH_BED.specs.dimensions },
                  { label: 'Assembly', value: STRETCH_BED.specs.assemblyTime },
                  { label: 'Tools', value: STRETCH_BED.specs.toolsRequired },
                  { label: 'Plastic Diverted', value: STRETCH_BED.specs.plasticDiverted },
                ]
            ).map((spec) => (
              <div key={spec.label} className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{spec.label}</p>
                <p className="font-semibold mt-1">{spec.value}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            {isMachine ? (
              <>
                {WASHING_MACHINE.shortDescription} Co-designed with community in Tennant Creek, named in
                Warumungu language by Elder Dianne Stokes, built to last 10–15 years where standard
                machines die in 1–2.
              </>
            ) : (
              <>
                {STRETCH_BED.shortDescription} Designed with over 500 minutes of community feedback, the
                Stretch Bed is built to last 10+ years in remote conditions.
              </>
            )}
          </p>
        </section>

        {/* Video: community voices */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">Hear from Community</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Community voices on why beds and essential goods matter.
          </p>
          <div className="space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src="https://share.descript.com/embed/LAT0KNJMxmH"
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Community voices: Stretch Bed recipient"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src="https://share.descript.com/embed/2gxa5x40r9N"
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title="Cliff Plummer: Beds and dignity"
                />
              </div>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src="https://share.descript.com/embed/YQwAcYfxzkn"
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title="Fred: Community voices from Oonchiumpa"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dianne Stokes: co-designer */}
        <section className="bg-muted/50 rounded-2xl p-6 md:p-8">
          <div className="grid sm:grid-cols-[200px_1fr] gap-6 items-start">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="/images/people/dianne-stokes.jpg"
                alt="Elder Dianne Stokes"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Co-Designer</p>
              <h3 className="font-display text-xl font-bold mb-2">Elder Dianne Stokes</h3>
              <blockquote className="border-l-2 border-primary pl-4 mb-3">
                <p className="text-foreground italic" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
                  &ldquo;Working both ways &mdash; cultural side in white society and Indigenous society.&rdquo;
                </p>
              </blockquote>
              <p className="text-sm text-muted-foreground">
                Dianne named the washing machine &ldquo;Pakkimjalki Kari&rdquo; in Warumungu language.
                She didn&apos;t just receive a product. She co-designed it, tested it,
                and named it for her community in Tennant Creek.
              </p>
            </div>
          </div>
        </section>

        {/* Journey timeline */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">This Bed&apos;s Journey</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Every Goods bed is tracked from manufacture to delivery. Here&apos;s where this one has been.
          </p>

          {events.length > 0 ? (
            <div className="relative pl-8 space-y-6">
              {/* Timeline line */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />

              {events.map((event, i) => {
                const meta = EVENT_LABELS[event.event_type] || {
                  label: event.event_type,
                  icon: '📍',
                  color: 'bg-gray-500',
                };
                return (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-5 top-1 w-4 h-4 rounded-full ${meta.color} border-2 border-background flex items-center justify-center`}
                    >
                      {i === events.length - 1 && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
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
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl mb-3">🌱</p>
                <p className="font-medium mb-1">Journey just beginning</p>
                <p className="text-sm text-muted-foreground">
                  This bed is fresh off the line. Check back as it makes its way to community.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* In community: timelapse */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">In Community</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Watch a Stretch Bed being made at the Alice Springs production facility.
          </p>
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src="https://share.descript.com/embed/Xtrc5ZYsym6"
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Stretch Bed making timelapse: Alice Springs"
            />
          </div>
        </section>

        {/* How tracking works */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">How Tracking Works</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Every Goods product carries a unique QR code. Here&apos;s the lifecycle:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                step: '1',
                title: 'Manufacture',
                desc: 'Each bed is made from recycled HDPE plastic, galvanised steel, and heavy-duty canvas. A unique ID is assigned at creation.',
              },
              {
                step: '2',
                title: 'QR Code Applied',
                desc: 'A tamper-proof QR sticker links the physical bed to its digital record: specs, journey, and support.',
              },
              {
                step: '3',
                title: 'Track & Deliver',
                desc: 'Every milestone is logged: quality check, shipping, delivery. Communities and buyers can follow along in real time.',
              },
              {
                step: '4',
                title: 'Lifetime Support',
                desc: 'Scan any time for support, warranty claims, or condition check-ins. The bed\'s full history lives with it.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Story */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">Why This Exists</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {story.problem.stats.map((stat) => (
                <div key={stat.label} className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-100 dark:border-red-900/50">
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stat.value}</p>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.source}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {story.problem.description}
            </p>
          </div>
        </section>

        {/* Sibling product teaser: show the OTHER product to scanners */}
        <section className="bg-foreground text-background rounded-2xl overflow-hidden">
          <div className="grid sm:grid-cols-2">
            <div className="relative min-h-[200px]">
              <Image
                src={isMachine
                  ? '/images/product/stretch-bed-hero.jpg'
                  : '/images/product/washing-machine-hero.jpg'}
                alt={isMachine
                  ? 'The Stretch Bed: recycled plastic, galvanised steel, heavy-duty canvas'
                  : 'Pakkimjalki Kari: washing machine by Goods on Country'}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <p className="text-background/50 text-xs uppercase tracking-widest mb-2">
                {isMachine ? 'Also from Goods' : 'Coming Soon'}
              </p>
              <h3 className="font-display text-xl font-bold mb-2">
                {isMachine ? 'The Stretch Bed' : 'Pakkimjalki Kari'}
              </h3>
              <p className="text-background/70 text-sm mb-4">
                {isMachine
                  ? 'A flat-packable, washable bed made from recycled plastic, galvanised steel, and heavy-duty canvas. 26kg, 200kg capacity, 10+ year design life.'
                  : 'A commercial-grade washing machine in recycled plastic housing. Named in Warumungu language by Elder Dianne Stokes. Built to last 10-15 years, not 1-2.'}
              </p>
              <Button asChild variant="secondary" size="sm" className="w-fit">
                <Link href={isMachine ? '/shop/stretch-bed-single' : '/shop/washing-machine'}>
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-br from-stone-100 to-amber-50 dark:from-stone-900 dark:to-amber-950/30 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Follow Our Journey</h2>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            Goods on Country is building a new model for remote community infrastructure
            beds, washing machines, and eventually community-owned manufacturing.
          </p>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Subscribe to hear how the project grows, where beds are being delivered,
            and how you can support or get involved.
          </p>
          <div className="max-w-sm mx-auto">
            <NewsletterSignup
              tag="bed-scan"
              buttonText="Subscribe to Updates"
              successMessage="Welcome aboard! We'll send you a welcome email with more about our story."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-8">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href={isMachine ? '/shop/washing-machine' : '/shop/stretch-bed-single'}>
                {isMachine ? 'Register Interest' : 'Buy a Stretch Bed'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/story">Read Our Story</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/support?asset_id=${id}`}>Report an Issue</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
