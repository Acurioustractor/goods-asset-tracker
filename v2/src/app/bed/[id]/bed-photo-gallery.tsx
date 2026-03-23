'use client';

import Image from 'next/image';
import { ImageLightbox } from '@/components/ui/image-lightbox';

interface BedPhotoGalleryProps {
  photos: string[];
  alt: string;
}

export function BedPhotoGallery({ photos, alt }: BedPhotoGalleryProps) {
  if (photos.length === 0) return null;

  return (
    <ImageLightbox images={photos} alt={alt}>
      {({ open }) => (
        <div
          className="relative rounded-2xl overflow-hidden shadow-xl border bg-card cursor-zoom-in group"
          onClick={() => open(0)}
        >
          <Image
            src={photos[0]}
            alt={alt}
            width={800}
            height={500}
            className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
            priority
          />
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            {photos.length > 1 ? `${photos.length} photos` : 'Click to zoom'}
          </div>
        </div>
      )}
    </ImageLightbox>
  );
}
