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

  // Products - Stretch Bed
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
  if (media.product.stretchBedAssembly) {
    photos.push({
      id: 'product-stretch-bed-assembly',
      src: media.product.stretchBedAssembly,
      alt: 'Stretch Bed assembly',
      category: 'product',
      caption: 'Easy Assembly',
      subcaption: '5 minutes, no tools required',
    });
  }
  if (media.product.stretchBedInUse) {
    photos.push({
      id: 'product-stretch-bed-in-use',
      src: media.product.stretchBedInUse,
      alt: 'Stretch Bed in use',
      category: 'product',
      caption: 'In Use',
      subcaption: 'Community-tested durability',
    });
  }
  if (media.product.stretchBedCommunity) {
    photos.push({
      id: 'product-stretch-bed-community',
      src: media.product.stretchBedCommunity,
      alt: 'Stretch Bed in community',
      category: 'product',
      caption: 'Community Delivery',
      subcaption: 'Beds reaching remote families',
    });
  }
  if (media.product.stretchBedDetail) {
    photos.push({
      id: 'product-stretch-bed-detail',
      src: media.product.stretchBedDetail,
      alt: 'Stretch Bed detail',
      category: 'product',
      caption: 'Built to Last',
      subcaption: 'Heavy-duty canvas and recycled plastic',
    });
  }
  if (media.product.stretchBedKidsBuilding) {
    photos.push({
      id: 'product-stretch-bed-kids-building',
      src: media.product.stretchBedKidsBuilding,
      alt: 'Kids building a Stretch Bed',
      category: 'product',
      caption: 'Kids Can Build It',
      subcaption: 'Simple enough for anyone to assemble',
    });
  }
  // Products - Basket Bed
  if (media.product.basketBedHero) {
    photos.push({
      id: 'product-basket-bed',
      src: media.product.basketBedHero,
      alt: 'The Basket Bed',
      category: 'product',
      caption: 'The Basket Bed',
      subcaption: 'Our first prototype — now open source',
    });
  }
  // Products - Washing Machine
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
  if (media.product.washingMachineInstalled) {
    photos.push({
      id: 'product-washing-machine-installed',
      src: media.product.washingMachineInstalled,
      alt: 'Washing machine installed in community',
      category: 'product',
      location: 'Tennant Creek, NT',
      community: 'tennant-creek',
      caption: 'Installed',
      subcaption: 'Commercial-grade Speed Queen in recycled plastic housing',
    });
  }
  if (media.product.washingMachineName) {
    photos.push({
      id: 'product-washing-machine-name',
      src: media.product.washingMachineName,
      alt: 'Pakkimjalki Kari naming',
      category: 'product',
      location: 'Tennant Creek, NT',
      community: 'tennant-creek',
      caption: 'Pakkimjalki Kari',
      subcaption: '"Water that cleans" in Warumungu',
    });
  }
  if (media.product.washingMachineCommunity) {
    photos.push({
      id: 'product-washing-machine-community',
      src: media.product.washingMachineCommunity,
      alt: 'Washing machine in community',
      category: 'product',
      location: 'Tennant Creek, NT',
      community: 'tennant-creek',
      caption: 'Community Testing',
      subcaption: '8 prototype units deployed',
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
