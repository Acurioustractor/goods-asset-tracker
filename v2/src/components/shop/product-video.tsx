'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductVideoProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  className?: string;
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&autoplay=1`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return null;
}

function getThumbnailUrl(url: string): string | null {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }
  return null;
}

export function ProductVideo({
  videoUrl,
  thumbnailUrl,
  title = 'Product Video',
  className,
}: ProductVideoProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const embedUrl = getEmbedUrl(videoUrl);
  const autoThumbnail = thumbnailUrl || getThumbnailUrl(videoUrl);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className={cn('relative aspect-video rounded-lg overflow-hidden bg-muted', className)}>
      {isPlaying ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 w-full h-full group"
        >
          {/* Thumbnail */}
          {autoThumbnail ? (
            <Image
              src={autoThumbnail}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <svg
                className="w-10 h-10 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Watch Video text */}
          <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
            Watch Video
          </div>
        </button>
      )}
    </div>
  );
}
