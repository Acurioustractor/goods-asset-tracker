'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const frames = [
  { src: '/images/product/stretch-bed-kids-building.jpg', alt: 'Kids in community clipping recycled plastic legs onto steel poles', label: 'Clip legs onto poles' },
  { src: '/images/media-pack/community-bed-assembly.jpg', alt: 'Two community members threading canvas over the bed frame', label: 'Thread canvas over frame' },
  { src: '/images/media-pack/community-testing-bed-golden-hour.jpg', alt: 'Community member testing the Stretch Bed at golden hour', label: 'Test it out' },
  { src: '/images/product/stretch-bed-community.jpg', alt: 'Elder woman standing proudly next to assembled Stretch Bed on red dirt', label: 'Done. On country.' },
];

export function AssemblySequence() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % frames.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => setPaused((p) => !p)}
      role="button"
      tabIndex={0}
      aria-label="Assembly sequence — click to pause"
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') setPaused((p) => !p); }}
    >
      <div className="aspect-[3/2] relative rounded-2xl overflow-hidden bg-muted">
        {frames.map((frame, i) => (
          <Image
            key={frame.src}
            src={frame.src}
            alt={frame.alt}
            fill
            className={`object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={i === 0}
          />
        ))}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {frames.map((frame, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-6' : 'bg-border'}`}
            aria-label={`Step ${i + 1}: ${frame.label}`}
          />
        ))}
      </div>

      {/* Label */}
      <p className="text-sm text-muted-foreground text-center mt-2">
        {frames[current].label}
      </p>
    </div>
  );
}
