'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { EmpathyLedgerMedia } from '@/lib/empathy-ledger/types';

interface MediaGalleryProps {
  media: EmpathyLedgerMedia[];
  columns?: 2 | 3 | 4;
  showAttribution?: boolean;
}

export function MediaGallery({
  media,
  columns = 3,
  showAttribution = true,
}: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<EmpathyLedgerMedia | null>(null);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <p>No media available</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {media.map((item) => (
          <MediaItem
            key={item.id}
            item={item}
            showAttribution={showAttribution}
            onClick={() => setSelectedMedia(item)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {selectedMedia && (
        <MediaLightbox
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
}

interface MediaItemProps {
  item: EmpathyLedgerMedia;
  showAttribution?: boolean;
  onClick?: () => void;
}

function MediaItem({ item, showAttribution = true, onClick }: MediaItemProps) {
  const isVideo = item.mediaType === 'video';

  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
      onClick={onClick}
    >
      {isVideo ? (
        <video
          src={item.url}
          poster={item.thumbnailUrl || undefined}
          className="h-full w-full object-cover"
          muted
        />
      ) : (
        <Image
          src={item.thumbnailUrl || item.url}
          alt={item.altText || item.title || 'Community image'}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full">
          {item.title && (
            <p className="text-white text-sm font-medium line-clamp-1">{item.title}</p>
          )}
          {showAttribution && item.attributionText && (
            <p className="text-white/80 text-xs line-clamp-1">{item.attributionText}</p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {isVideo && (
          <Badge variant="secondary" className="bg-black/60 text-white text-xs">
            <svg
              className="h-3 w-3 mr-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Video
          </Badge>
        )}
        {item.elderApproved && (
          <Badge className="bg-emerald-600/90 text-white text-xs">
            Elder Approved
          </Badge>
        )}
      </div>

      {/* Cultural sensitivity indicator */}
      {item.culturalSensitivity === 'high' && (
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-amber-500/90 text-white border-none text-xs">
            Culturally Sensitive
          </Badge>
        </div>
      )}
    </div>
  );
}

interface MediaLightboxProps {
  media: EmpathyLedgerMedia;
  onClose: () => void;
}

function MediaLightbox({ media, onClose }: MediaLightboxProps) {
  const isVideo = media.mediaType === 'video';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>

        {/* Media content */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {isVideo ? (
            <video
              src={media.url}
              poster={media.thumbnailUrl || undefined}
              controls
              autoPlay
              className="h-full w-full object-contain"
            />
          ) : (
            <Image
              src={media.url}
              alt={media.altText || media.title || 'Full size image'}
              fill
              className="object-contain"
            />
          )}
        </div>

        {/* Caption */}
        <div className="mt-4 text-white">
          {media.title && (
            <h3 className="text-lg font-medium">{media.title}</h3>
          )}
          {media.description && (
            <p className="mt-1 text-white/80 text-sm">{media.description}</p>
          )}
          {media.attributionText && (
            <p className="mt-2 text-white/60 text-xs">{media.attributionText}</p>
          )}

          {/* Cultural tags */}
          {media.culturalTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {media.culturalTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/10 text-white">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton loader
export function MediaGallerySkeleton({ count = 6, columns = 3 }: { count?: number; columns?: 2 | 3 | 4 }) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}
