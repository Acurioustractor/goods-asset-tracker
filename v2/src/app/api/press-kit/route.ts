// Press kit endpoint: structured JSON bundle for journalists, partners,
// or any external integration that wants verified quotes, key stats,
// product specs, photo URLs, and brand contact info.
//
// EL-led: storytellers and headline quotes are gated on Empathy Ledger
// consent state. Only voices with consent-clean Goods stories in EL appear
// in this response. Quote text itself is curated in content.ts; EL is the
// gate, not the source of verbatim text.
//
// GET /api/press-kit?host=https://www.goodsoncountry.com
//
// Cached at 5 minutes via Next ISR. Public. CORS-permissive for press use.

import { NextResponse } from 'next/server';
import { brand, story, impact, quotes, partners } from '@/lib/data/content';
import { STRETCH_BED, WASHING_MACHINE } from '@/lib/data/products';
import { getFeaturedVoices } from '@/lib/empathy-ledger/featured-voices';

export const revalidate = 300;

const ASSET_EMAIL = 'hi@act.place';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const explicitHost = url.searchParams.get('host');
  const host = (explicitHost ?? `${url.protocol}//${url.host}`).replace(/\/$/, '');

  // Voices come from EL-led featured-voices.ts. Only consent-verified storytellers.
  const voices = await getFeaturedVoices(20);
  const verifiedAuthors = new Set(voices.filter((v) => v.liveFromEL).map((v) => v.name));

  // Headline quotes only published when the speaker is currently EL-verified.
  // Order: prioritise verified authors, drop drafts entirely.
  const headlineQuotes = quotes
    .filter((q) => q.verified && verifiedAuthors.has(q.author))
    .slice(0, 5)
    .map((q) => ({
      text: q.text,
      author: q.author,
      context: q.context,
      theme: q.theme,
      consentSource: 'Empathy Ledger',
    }));

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      revalidateSeconds: 300,
      schemaVersion: '2',
      contact: ASSET_EMAIL,
      consentModel:
        'Empathy Ledger leads. A storyteller appears in this response only when EL has at least one consent-clean Goods story for them (syndication_enabled = true, consent_withdrawn_at IS NULL, is_archived = false). Storytellers can withdraw consent at any time; the response refreshes within 5 minutes of EL state change.',
      verifiedStorytellerCount: verifiedAuthors.size,
      mediaPolicy:
        'Always credit by name and community. Storytellers retain ownership of their stories. If you publish, link back to goodsoncountry.com/stories.',
    },
    brand: {
      name: brand.name,
      tagline: brand.tagline,
      taglineAlt: brand.taglineAlt,
      mission: brand.mission,
      oneLiner: brand.oneLiner,
      philosophy: brand.philosophy,
    },
    summary: {
      whatWeDo:
        'Goods on Country is a First Nations social enterprise designing and making essential goods (Stretch Beds, Pakkimjalki Kari washing machines) with remote Indigenous Australian communities. Manufacturing transfers to community ownership.',
      whyItMatters: story.problem.description,
      keyNumbers: impact.stats,
    },
    products: {
      stretchBed: {
        name: STRETCH_BED.name,
        slug: STRETCH_BED.slug,
        status: STRETCH_BED.status,
        tagline: STRETCH_BED.tagline,
        specs: STRETCH_BED.specs,
        materials: STRETCH_BED.materials,
        features: STRETCH_BED.features,
        productPage: `${host}/shop/stretch-bed-single`,
        heroImage: `${host}/images/product/stretch-bed-hero.jpg`,
      },
      pakkimjalkiKari: {
        name: WASHING_MACHINE.name,
        slug: WASHING_MACHINE.slug,
        status: WASHING_MACHINE.status,
        tagline: WASHING_MACHINE.tagline,
        nameOrigin: 'Named in Warumungu language by Elder Dianne Stokes.',
        heroImage: `${host}/images/media-pack/washing-machine-enclosure-sunset.jpg`,
      },
    },
    headlineQuotes,
    storytellers: voices.map((v) => ({
      id: v.id,
      name: v.name,
      location: v.location,
      photo: v.photo ? (v.photo.startsWith('http') ? v.photo : `${host}${v.photo}`) : null,
      photoAlt: v.photoAlt,
      consentVerified: v.liveFromEL,
      activeInEmpathyLedger: v.liveFromEL,
      isElder: v.isElder ?? false,
      storyCount: v.storyCount ?? 0,
      attributionFormat: `${v.name}, ${v.location}`,
    })),
    partners: {
      community: partners.communityPartners.map((p) => ({
        name: p.name,
        role: p.role,
        location: p.location,
        contribution: p.contribution,
      })),
      funding: partners.fundingPartners,
      health: partners.healthPartners,
    },
    deck: {
      url: `${host}/decks/live-session-deck.html`,
      slides: 10,
      keyboardShortcuts: {
        navigate: '← → arrow keys or space',
        speakerNotes: 'n',
        slideOverview: 'o',
        printToPdf: 'p',
      },
    },
    landingPages: {
      home: `${host}/`,
      brandComms: `${host}/brand`,
      product: `${host}/shop/stretch-bed-single`,
      process: `${host}/process`,
      communities: `${host}/communities`,
      impact: `${host}/impact`,
      stories: `${host}/stories`,
      about: `${host}/about`,
      pressKitJson: `${host}/api/press-kit`,
    },
    voiceRules: {
      capitaliseAlways: ['On-Country', 'Country', 'Elder', 'First Nations', 'Pakkimjalki Kari', 'Stretch Bed', 'Goods on Country'],
      bannedTerms: [
        'donate',
        'donation',
        'charity',
        'beneficiaries',
        'empower',
        'unlock',
        'leverage',
        'synergy',
        'ecosystem',
        'GTM',
        'disrupting',
        'revolutionary',
        'innovative',
        'game-changer',
        'helping them',
      ],
      bannedFormatting: ['em dashes', 'Title Case In Body Copy'],
      brandVoiceGuide:
        'https://www.notion.so/359ebcf981cf810aa2afe9d8b3dcd375',
    },
    contact: {
      general: ASSET_EMAIL,
      mediaInquiries: ASSET_EMAIL,
      partnerships: ASSET_EMAIL,
      assetRequests: ASSET_EMAIL,
    },
  };

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
}
