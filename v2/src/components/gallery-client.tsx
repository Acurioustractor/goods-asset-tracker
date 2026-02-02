'use client';

import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CommunityLocation } from '@/lib/data/content';

// Dynamic import to avoid SSR issues with Leaflet
const CommunityMap = dynamic(
  () => import('@/components/community-map').then((mod) => mod.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] md:h-[600px] rounded-xl bg-muted animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  category: 'people' | 'product' | 'process' | 'community';
  location?: string;
  community?: string;
  caption: string;
  subcaption?: string;
}

export interface GalleryStoryteller {
  id: string;
  name: string;
  role?: string;
  location: string;
  community: string;
  photo: string;
  keyQuote: string;
  isElder: boolean;
}

export interface GalleryVideo {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'local' | 'embed';
  src?: string;
  poster?: string;
  embedUrl?: string;
}

interface GalleryClientProps {
  photos: GalleryPhoto[];
  storytellers: GalleryStoryteller[];
  videos: GalleryVideo[];
  communityLocations: CommunityLocation[];
}

type Category = 'all' | 'people' | 'product' | 'process' | 'community';

export default function GalleryClient({
  photos,
  storytellers,
  videos,
  communityLocations,
}: GalleryClientProps) {
  const [category, setCategory] = useState<Category>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: photos.length },
    { id: 'people', label: 'People', count: photos.filter((p) => p.category === 'people').length },
    { id: 'product', label: 'Product', count: photos.filter((p) => p.category === 'product').length },
    { id: 'process', label: 'Process', count: photos.filter((p) => p.category === 'process').length },
    { id: 'community', label: 'Community', count: photos.filter((p) => p.category === 'community').length },
  ];

  const filtered = category === 'all'
    ? photos
    : photos.filter((p) => p.category === category);

  const communityFiltered = selectedCommunity
    ? filtered.filter((p) => p.community === selectedCommunity)
    : filtered;

  const lightboxPhoto = photos.find((p) => p.id === lightbox);

  return (
    <main>
      {/* ============================================================
          HERO — Map
          ============================================================ */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mb-10">
            <p className="text-sm uppercase tracking-widest text-background/50 mb-4">
              Gallery
            </p>
            <h1
              className="text-3xl md:text-5xl font-light mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              From Country
            </h1>
            <p className="text-lg text-background/70">
              Photos, stories, and videos from communities across Australia.
              Every image is shared with the storyteller&apos;s permission.
            </p>
          </div>

          {/* Community map */}
          <CommunityMap
            locations={communityLocations}
            storytellers={storytellers}
            selectedCommunity={selectedCommunity}
            onSelectCommunity={setSelectedCommunity}
          />

          {/* Community filter chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setSelectedCommunity(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                !selectedCommunity
                  ? 'bg-background text-foreground'
                  : 'bg-background/10 text-background/70 hover:bg-background/20'
              }`}
            >
              All communities
            </button>
            {communityLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedCommunity(selectedCommunity === loc.id ? null : loc.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedCommunity === loc.id
                    ? 'bg-background text-foreground'
                    : 'bg-background/10 text-background/70 hover:bg-background/20'
                }`}
              >
                {loc.name}
                {loc.bedsDelivered > 0 && (
                  <span className="ml-1.5 text-xs opacity-60">{loc.bedsDelivered} beds</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PHOTO GRID
          ============================================================ */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={category === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
                <span className="ml-1.5 text-xs opacity-60">{cat.count}</span>
              </Button>
            ))}
          </div>

          {/* Photo grid */}
          {communityFiltered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No photos match this filter.</p>
              <Button
                variant="link"
                onClick={() => {
                  setCategory('all');
                  setSelectedCommunity(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {communityFiltered.map((photo) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid group cursor-pointer"
                  onClick={() => setLightbox(photo.id)}
                >
                  <div className="relative overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={600}
                      height={photo.category === 'people' ? 800 : 450}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-medium">{photo.caption}</p>
                        {photo.subcaption && (
                          <p className="text-white/70 text-xs">{photo.subcaption}</p>
                        )}
                        {photo.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-white/50 text-xs">{photo.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Category badge */}
                    <Badge
                      variant="outline"
                      className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs capitalize"
                    >
                      {photo.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          VIDEO SECTION
          ============================================================ */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2
              className="text-2xl font-light text-foreground mb-2"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Videos
            </h2>
            <p className="text-muted-foreground">
              Community footage and testimonials from on country
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden border-0 shadow-sm">
                <CardContent className="p-0">
                  {video.type === 'local' && video.src ? (
                    <div className="aspect-video bg-black">
                      <video
                        src={video.src}
                        poster={video.poster}
                        controls
                        preload="none"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : video.type === 'embed' && video.embedUrl ? (
                    <div className="aspect-video bg-black">
                      <iframe
                        src={video.embedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        className="w-full h-full"
                        title={video.title}
                      />
                    </div>
                  ) : null}
                  <div className="p-4">
                    <p className="font-medium text-foreground text-sm">{video.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{video.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs capitalize">
                      {video.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          DATA SOVEREIGNTY FOOTER
          ============================================================ */}
      <section className="py-8 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>All photos and videos are owned and controlled by community storytellers</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          LIGHTBOX
          ============================================================ */}
      {lightbox && lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={lightboxPhoto.src}
                alt={lightboxPhoto.alt}
                width={1200}
                height={800}
                className="w-full h-auto rounded-lg"
                sizes="100vw"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-medium">{lightboxPhoto.caption}</p>
              {lightboxPhoto.subcaption && (
                <p className="text-white/60 text-sm mt-1">{lightboxPhoto.subcaption}</p>
              )}
              {lightboxPhoto.location && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/40 text-sm">{lightboxPhoto.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
