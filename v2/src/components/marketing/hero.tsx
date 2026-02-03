import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: {
    desktop: string;
    mobile: string;
    poster: string;
  };
}

export function Hero({
  title = 'Beds that change lives',
  subtitle = "Every bed we deliver brings comfort, dignity, and rest to families in remote Indigenous communities across Australia.",
  primaryCta = { text: 'Shop Beds', href: '/shop' },
  secondaryCta = { text: 'Sponsor a Bed', href: '/sponsor' },
  imageSrc,
  imageAlt = 'Goods on Country bed delivery',
  videoSrc,
}: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">
      {/* Full-bleed background — video or image */}
      {videoSrc ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={videoSrc.poster}
        >
          <source src={videoSrc.desktop} media="(min-width: 768px)" type="video/mp4" />
          <source src={videoSrc.mobile} type="video/mp4" />
        </video>
      ) : imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
      )}

      {/* Dark gradient overlay — heavier at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Content — anchored to bottom */}
      <div className="relative z-10 w-full pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {title}
            </h1>
            <p className="mt-4 text-lg text-white/80 md:text-xl max-w-lg">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-amber-600 text-white hover:bg-amber-700 font-semibold text-base px-8"
              >
                <Link href={primaryCta.href}>{primaryCta.text}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-white/60 text-white hover:bg-white/10 hover:text-white font-semibold text-base px-8"
              >
                <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
