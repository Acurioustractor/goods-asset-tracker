'use client';

import Image from 'next/image';
import { ImageLightbox } from '@/components/ui/image-lightbox';

export type BedGalleryItem = {
  id: string;
  url: string;
  thumbnail: string | null;
  caption: string | null;
  byline: string | null;
  createdAt: string;
};

type Props = {
  items: BedGalleryItem[];
  productNoun: string;
};

function shortCaption(caption: string | null): string | null {
  if (!caption) return null;
  // Story-modal captions append metadata after a blank line — show only the story body.
  const head = caption.split(/\n{2,}/)[0]?.trim();
  if (!head) return null;
  return head.length > 200 ? `${head.slice(0, 197)}…` : head;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function BedGallery({ items, productNoun }: Props) {
  if (items.length === 0) return null;

  const photoUrls = items.map((i) => i.url);

  return (
    <section className="max-w-5xl mx-auto px-4 mt-8">
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">Photos with this {productNoun.toLowerCase()}</h2>
            <p className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? 'photo' : 'photos'}. Tap any photo to view.
            </p>
          </div>
        </div>

        <ImageLightbox images={photoUrls} alt={`Photo of ${productNoun}`}>
          {({ open }) => (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => open(idx)}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-label={shortCaption(item.caption) || `Photo ${idx + 1}`}
                >
                  <Image
                    src={item.thumbnail || item.url}
                    alt={shortCaption(item.caption) || `Photo with this ${productNoun.toLowerCase()}`}
                    fill
                    sizes="(min-width: 640px) 200px, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {(shortCaption(item.caption) || item.byline) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-left">
                      {shortCaption(item.caption) && (
                        <p className="text-[11px] text-white line-clamp-2 leading-tight">
                          {shortCaption(item.caption)}
                        </p>
                      )}
                      <p className="text-[10px] text-white/70 mt-0.5">
                        {item.byline ? `${item.byline} · ` : ''}{formatDate(item.createdAt)}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </ImageLightbox>
      </div>
    </section>
  );
}
