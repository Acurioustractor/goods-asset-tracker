// Database types for Goods v2
// These should be regenerated from Supabase when schema changes

export type ProductType = 'stretch_bed' | 'basket_bed' | 'washing_machine' | 'accessory';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  currency: string;
  product_type: ProductType;
  images: string[];
  featured_image: string | null;
  inventory_count: number;
  track_inventory: boolean;
  is_active: boolean;
  is_featured: boolean;
  metadata: Record<string, unknown>;
  artisan_id: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partial_refund';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_id: string | null;
  shipping_address: Address | null;
  billing_address: Address | null;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  discount_cents: number;
  total_cents: number;
  currency: string;
  status: OrderStatus;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  payment_status: PaymentStatus;
  paid_at: string | null;
  is_sponsorship: boolean;
  sponsored_community: string | null;
  sponsor_message: string | null;
  shipping_method: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_type: string | null;
  product_image: string | null;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  asset_id: string | null;
  created_at: string;
}

export type StoryType = 'community_voice' | 'impact_report' | 'bed_journey' | 'artisan_profile' | 'news' | 'blog';

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  images: string[];
  video_url: string | null;
  story_type: StoryType;
  community: string | null;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  author_name: string | null;
  author_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  slug: string | null;
  name: string;
  role: string | null;
  bio: string | null;
  short_bio: string | null;
  photo: string | null;
  photos: string[];
  is_artisan: boolean;
  is_staff: boolean;
  community: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  facebook: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BedJourneyEventType =
  | 'created'
  | 'in_production'
  | 'quality_check'
  | 'ready'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'setup'
  | 'photo_update';

export interface BedJourney {
  id: string;
  asset_id: string | null;
  order_item_id: string | null;
  event_type: BedJourneyEventType;
  event_date: string;
  description: string | null;
  location: string | null;
  media: string[];
  created_by: string | null;
  artisan_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type PartnershipType =
  | 'corporate_sponsor'
  | 'retail_partner'
  | 'community_partner'
  | 'media_partner'
  | 'government'
  | 'ngo'
  | 'other';

export type PartnershipTier = 'founding' | 'major' | 'supporting' | 'community';

export interface PartnershipInquiry {
  id: string;
  organization_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  website: string | null;
  partnership_type: PartnershipType | null;
  message: string | null;
  how_heard: string | null;
  status: 'new' | 'contacted' | 'in_discussion' | 'approved' | 'declined' | 'inactive';
  assigned_to: string | null;
  notes: string | null;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  slug: string | null;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  partnership_type: PartnershipType;
  partnership_tier: PartnershipTier | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  show_on_website: boolean;
  display_order: number;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  total_sponsored_beds: number;
  total_contribution_cents: number;
  inquiry_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Existing Goods v1 types (for reference)
export interface Asset {
  unique_id: string;
  type: string;
  status: string;
  community: string;
  qr_link: string | null;
  owner_name: string | null;
  owner_phone: string | null;
  delivery_date: string | null;
  last_checkin_date: string | null;
  condition: string | null;
  notes: string | null;
  created_at: string;
  // Extended fields
  name: string | null;
  product: string | null;
  place: string | null;
  photo: string | null;
  supply_date: string | null;
}

// ============================================================================
// USER ACCOUNT TYPES
// ============================================================================

export interface Profile {
  id: string;
  phone: string | null;
  email: string | null;
  display_name: string | null;
  notification_preferences: {
    sms: boolean;
    email: boolean;
  };
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export type ClaimStatus = 'active' | 'transferred' | 'revoked';

export interface UserAsset {
  id: string;
  profile_id: string;
  asset_id: string;
  claimed_at: string;
  claim_status: ClaimStatus;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  // Joined asset data
  assets?: Asset;
}

export type MessageDirection = 'inbound' | 'outbound';

export interface Message {
  id: string;
  profile_id: string;
  asset_id: string | null;
  direction: MessageDirection;
  message_text: string;
  media_url: string | null;
  read_at: string | null;
  delivered_at: string | null;
  sender_name: string | null;
  created_at: string;
}

export type RequestType = 'blanket' | 'pillow' | 'parts' | 'checkin' | 'pickup' | 'other';
export type RequestPriority = 'low' | 'normal' | 'urgent';
export type RequestStatus = 'pending' | 'approved' | 'in_progress' | 'fulfilled' | 'denied';

export interface UserRequest {
  id: string;
  profile_id: string;
  asset_id: string | null;
  request_type: RequestType;
  description: string | null;
  priority: RequestPriority;
  status: RequestStatus;
  fulfilled_at: string | null;
  fulfilled_by: string | null;
  fulfillment_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  assets?: Asset;
}

export type CompassionContentType = 'photo' | 'video' | 'message';

export interface CompassionContent {
  id: string;
  asset_id: string;
  content_type: CompassionContentType;
  media_url: string | null;
  thumbnail_url: string | null;
  caption: string | null;
  created_by: string | null;
  created_at: string;
  sent_at: string | null;
  viewed_at: string | null;
}

// ============================================================================
// COMMUNITY TYPES
// ============================================================================

export type IdeaCategory = 'product' | 'service' | 'community' | 'other';
export type IdeaStatus = 'submitted' | 'reviewing' | 'planned' | 'in_progress' | 'completed' | 'declined';

export interface CommunityIdea {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  category: IdeaCategory | null;
  status: IdeaStatus;
  vote_count: number;
  created_at: string;
  updated_at: string;
  // Client-side computed
  has_voted?: boolean;
}

export interface IdeaVote {
  id: string;
  idea_id: string;
  profile_id: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string | null;
  is_published: boolean;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PRODUCT METADATA EXTENDED TYPES
// ============================================================================

export interface ProductComponent {
  name: string;
  image: string;
  description: string;
}

export interface AssemblyStep {
  step: number;
  title: string;
  description: string;
  image: string;
}

export interface SustainabilityData {
  plastic_diverted_kg: number;
  carbon_saved_kg: number;
  local_jobs_created: number;
  community_share_percent: number;
}

export interface EnterpriseOpportunity {
  enabled: boolean;
  title: string;
  description: string;
  benefits: string[];
  contact_cta: string;
}

export interface ProductMetadata {
  materials?: string;
  dimensions?: string;
  weight?: string;
  assembly_time?: string;
  warranty?: string;
  environmental_impact?: string;
  video_url?: string;
  video_thumbnail?: string;
  components?: ProductComponent[];
  assembly_steps?: AssemblyStep[];
  sustainability?: SustainabilityData;
  enterprise_opportunity?: EnterpriseOpportunity;
}

// ============================================================================
// PRODUCTION TYPES
// ============================================================================

export interface ProductionShift {
  id: string;
  operator: string;
  shift_date: string;
  sheets_produced: number;
  sheets_cooling: number;
  plastic_shredded_kg: number;
  diesel_level: 'low' | 'medium' | 'full';
  issues: string[];
  issue_notes: string | null;
  handover_notes: string | null;
  total_sheets_to_date: number | null;
  user_id: string | null;
  voice_note_urls: string[];
  photo_urls: string[];
  created_at: string;
  updated_at: string;
}

// Utility types
export type Tables = {
  // E-commerce
  products: Product;
  orders: Order;
  order_items: OrderItem;
  // Content
  stories: Story;
  team_members: TeamMember;
  bed_journeys: BedJourney;
  // Partnerships
  partnership_inquiries: PartnershipInquiry;
  partners: Partner;
  // V1 Assets
  assets: Asset;
  // User accounts
  profiles: Profile;
  user_assets: UserAsset;
  messages: Message;
  user_requests: UserRequest;
  compassion_content: CompassionContent;
  // Community
  community_ideas: CommunityIdea;
  idea_votes: IdeaVote;
  announcements: Announcement;
  // Production
  production_shifts: ProductionShift;
};
