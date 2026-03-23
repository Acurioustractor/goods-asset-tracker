'use client';

import * as React from 'react';
import Image from 'next/image';

interface ImageLightboxProps {
  images: string[];
  alt?: string;
  initialIndex?: number;
  children: (props: { open: (index?: number) => void }) => React.ReactNode;
}

export function ImageLightbox({ images, alt = 'Photo', initialIndex = 0, children }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      else if (e.key === 'ArrowLeft') setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
      else if (e.key === 'ArrowRight') setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length]);

  const open = (index?: number) => {
    if (index !== undefined) setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      {children({ open })}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          {/* Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1)); }}
                className="absolute left-4 text-white/70 hover:text-white z-10"
              >
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0)); }}
                className="absolute right-4 text-white/70 hover:text-white z-10"
              >
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${alt} ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
