import { empathyLedger } from '@/lib/empathy-ledger';
import {
  communityLocations,
  storytellerProfiles,
  storytellerEnrichment,
  videoGallery,
} from '@/lib/data/content';
import { media } from '@/lib/data/media';
import GalleryClient from '@/components/gallery-client';
import type { GalleryPhoto, GalleryStoryteller, GalleryVideo } from '@/components/gallery-client';
import type { SyndicationStoryteller } from '@/lib/empathy-ledger/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery — From Country',
  description: 'Photos, stories, and videos from communities across Australia. Every image is shared with the storyteller\'s permission.',
};

/**
 * Map a SyndicationStoryteller (from EL API) to the shape the gallery needs,
 * merging local enrichment data (community, video, local photo fallback).
 */
function mapELStoryteller(s: SyndicationStoryteller): GalleryStoryteller {
  const enrichment = storytellerEnrichment[s.name] ?? {};
  return {
    id: s.id,
    name: s.name,
    role: enrichment.role,
    location: s.location ?? '',
    community: enrichment.community ?? '',
    photo: s.avatarUrl ?? enrichment.localPhoto ?? '/images/people/placeholder.jpg',
    keyQuote: s.quotes[0]?.text ?? '',
    isElder: s.isElder,
  };
}

/**
 * Build the static photo list from storytellers + media assets.
 * People photos come from whichever source (EL or fallback).
 */
function buildPhotos(storytellers: GalleryStoryteller[]): GalleryPhoto[] {
  const photos: GalleryPhoto[] = [];

  // People
  storytellers.forEach((p) => {
    photos.push({
      id: `person-${p.id}`,
      src: p.photo,
      alt: p.name,
      category: 'people',
      location: p.location,
      community: p.community,
      caption: p.isElder ? `Elder ${p.name}` : p.name,
      subcaption: p.role || p.location,
    });
  });

  // Products
  if (media.product.stretchBedHero) {
    photos.push({
      id: 'product-stretch-bed',
      src: media.product.stretchBedHero,
      alt: 'The Stretch Bed',
      category: 'product',
      caption: 'The Stretch Bed',
      subcaption: 'Recycled HDPE plastic, galvanised steel, heavy-duty canvas',
    });
  }
  if (media.product.greateBed) {
    photos.push({
      id: 'product-greate-bed',
      src: media.product.greateBed,
      alt: 'The Greate Bed',
      category: 'product',
      caption: 'The Greate Bed',
      subcaption: 'Community prototype',
    });
  }
  if (media.product.washingMachine) {
    photos.push({
      id: 'product-washing-machine',
      src: media.product.washingMachine,
      alt: 'Pakkimjalki Kari Washing Machine',
      category: 'product',
      location: 'Tennant Creek, NT',
      community: 'tennant-creek',
      caption: 'Pakkimjalki Kari',
      subcaption: 'Named in Warumungu language by Elder Dianne Stokes',
    });
  }

  // Process
  const processItems = [
    { key: 'source' as const, alt: 'Collecting recycled plastic', caption: 'Source', sub: 'Collecting recycled HDPE plastic from communities' },
    { key: 'process' as const, alt: 'Processing plastic', caption: 'Process', sub: 'Melting plastic into durable sheets' },
    { key: 'cut' as const, alt: 'Cutting bed components', caption: 'Cut', sub: 'Precision cutting with minimal waste' },
    { key: 'build' as const, alt: 'Building bed frames', caption: 'Build', sub: 'Pressing recycled plastic bed legs' },
    { key: 'weave' as const, alt: 'Weaving canvas', caption: 'Assemble', sub: 'Steel poles through heavy-duty canvas' },
    { key: 'deliver' as const, alt: 'Delivering beds', caption: 'Deliver', sub: 'Beds reaching remote communities' },
  ];
  for (const item of processItems) {
    const src = media.process[item.key];
    if (src) {
      photos.push({
        id: `process-${item.key}`,
        src,
        alt: item.alt,
        category: 'process',
        caption: item.caption,
        subcaption: item.sub,
      });
    }
  }

  // Community landscapes
  if (media.community.tennantCreek) {
    photos.push({
      id: 'community-tennant-creek',
      src: media.community.tennantCreek,
      alt: 'Tennant Creek',
      category: 'community',
      location: 'Tennant Creek, NT',
      community: 'tennant-creek',
      caption: 'Tennant Creek',
      subcaption: 'The birthplace of Goods on Country',
    });
  }

  return photos;
}

/**
 * Map hardcoded storytellerProfiles to GalleryStoryteller shape (fallback).
 */
function mapFallbackStorytellers(): GalleryStoryteller[] {
  return storytellerProfiles.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    location: p.location,
    community: p.community,
    photo: p.photo,
    keyQuote: p.keyQuote,
    isElder: p.isElder,
  }));
}

/**
 * Map videoGallery to the normalized GalleryVideo shape.
 */
function mapVideos(): GalleryVideo[] {
  return videoGallery.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    category: v.category,
    type: v.type,
    src: 'src' in v ? v.src : undefined,
    poster: 'poster' in v ? v.poster : undefined,
    embedUrl: 'embedUrl' in v ? v.embedUrl : undefined,
  }));
}

export default async function GalleryPage() {
  // Fetch storytellers from EL API, fall back to hardcoded data
  let storytellers: GalleryStoryteller[];

  const elStorytellers = await empathyLedger.getProjectStorytellers({ limit: 50 });
  if (elStorytellers.length > 0) {
    storytellers = elStorytellers.map(mapELStoryteller);
  } else {
    storytellers = mapFallbackStorytellers();
  }

  const photos = buildPhotos(storytellers);
  const videos = mapVideos();

  return (
    <GalleryClient
      photos={photos}
      storytellers={storytellers}
      videos={videos}
      communityLocations={communityLocations}
    />
  );
}
