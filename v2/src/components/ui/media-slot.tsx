'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

/**
 * MediaSlot — drop-in image slot with graceful placeholder fallback and lightbox.
 *
 * Usage:
 *   <MediaSlot src="/images/product/stretch-bed-hero.jpg" alt="..." aspect="video" />
 *
 * When `src` is provided and the file exists, it renders a Next.js Image.
 * Clicking opens a fullscreen lightbox.
 * When `src` is omitted, it renders a styled placeholder with the label.
 *
 * File convention:
 *   /public/images/product/   — product photography
 *   /public/images/process/   — how-it's-made step photos/videos
 *   /public/images/community/ — community & landscape shots
 *   /public/images/people/    — portraits & team
 *   /public/images/pitch/     — pitch-specific imagery
 */

interface MediaSlotProps {
  src?: string;
  alt: string;
  label?: string;
  aspect?: 'video' | 'square' | '4/3' | '3/2' | '16/9';
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  overlay?: boolean;
  lightbox?: boolean;
}

const aspectClasses: Record<string, string> = {
  'video': 'aspect-video',
  'square': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '16/9': 'aspect-[16/9]',
};

export function MediaSlot({
  src,
  alt,
  label,
  aspect = 'video',
  className = '',
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  overlay = false,
  lightbox = true,
}: MediaSlotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const aspectClass = fill ? '' : aspectClasses[aspect] || 'aspect-video';

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  }, []);

  // Has real image
  if (src) {
    return (
      <>
        <div
          className={`relative overflow-hidden rounded-2xl ${aspectClass} ${className} ${lightbox ? 'cursor-zoom-in group' : ''}`}
          onClick={lightbox ? () => setIsOpen(true) : undefined}
          onKeyDown={lightbox ? handleKeyDown : undefined}
          role={lightbox ? 'button' : undefined}
          tabIndex={lightbox ? 0 : undefined}
          aria-label={lightbox ? `View ${alt} fullscreen` : undefined}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover ${lightbox ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}
            priority={priority}
            sizes={sizes}
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          )}
        </div>

        {/* Lightbox */}
        {lightbox && isOpen && (
          <MediaLightbox src={src} alt={alt} onClose={() => setIsOpen(false)} />
        )}
      </>
    );
  }

  // Placeholder
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-muted ${aspectClass} ${className} flex items-center justify-center border border-border`}>
      <div className="text-center p-6">
        <svg
          className="w-12 h-12 mx-auto mb-2 text-muted-foreground/20"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25c0 .828.672 1.5 1.5 1.5z"
          />
        </svg>
        <p className="text-xs text-muted-foreground/40">{label || alt}</p>
      </div>
    </div>
  );
}

/**
 * Inline lightbox overlay for a single image
 */
function MediaLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  // Close on Escape
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      tabIndex={-1}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
        aria-label="Close lightbox"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative max-w-[90vw] max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm max-w-lg text-center">
        {alt}
      </p>
    </div>
  );
}

/**
 * VideoSlot — video embed or placeholder
 */
interface VideoSlotProps {
  src?: string;
  label?: string;
  className?: string;
}

export function VideoSlot({ src, label, className = '' }: VideoSlotProps) {
  if (src) {
    return (
      <div className={`aspect-video rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={src}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
          title={label || 'Video'}
        />
      </div>
    );
  }

  return (
    <div className={`aspect-video rounded-lg bg-muted flex items-center justify-center border border-border ${className}`}>
      <div className="text-center p-4">
        <svg
          className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
          />
        </svg>
        <p className="text-sm text-muted-foreground/50">
          {label || 'Video coming soon'}
        </p>
      </div>
    </div>
  );
}
