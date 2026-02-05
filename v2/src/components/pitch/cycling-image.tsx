'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CyclingImageProps {
  images: { src: string; alt: string }[];
  interval?: number;
  aspect?: string;
  className?: string;
}

export function CyclingImage({ images, interval = 2500, aspect = '4/3', className = '' }: CyclingImageProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: aspect }}>
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          className={`object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ))}
    </div>
  );
}
